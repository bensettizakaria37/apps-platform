from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pdf2docx import Converter
import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes
from docx import Document as DocxDocument
from cryptography.fernet import Fernet
import psycopg2, psycopg2.extras
import io, os, uuid, time, glob
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

app = FastAPI(title="Apps Platform API")

# ─────────────────────────────────────────
# RATE LIMITING
# ─────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─────────────────────────────────────────
# CORS
# ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition","X-Original-Size","X-Compressed-Size","X-Reduction"],
)

# ─────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# ─────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────
DB_URL = os.getenv("DATABASE_URL", "postgresql://appuser:apppass@postgres:5432/appsdb")

def get_db():
    return psycopg2.connect(DB_URL)

def init_db():
    conn = get_db()
    cur  = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS secrets (
            id          TEXT PRIMARY KEY,
            ciphertext  TEXT NOT NULL,
            expires_at  TIMESTAMP NOT NULL,
            viewed      BOOLEAN DEFAULT FALSE,
            created_at  TIMESTAMP DEFAULT NOW()
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

def cleanup_secrets():
    """Nettoyer les secrets expirés et déjà consultés"""
    try:
        conn = get_db()
        cur  = conn.cursor()
        cur.execute("DELETE FROM secrets WHERE viewed = TRUE OR expires_at < NOW()")
        deleted = cur.rowcount
        conn.commit()
        cur.close()
        conn.close()
        if deleted > 0:
            print(f"🧹 Cleaned {deleted} expired secrets")
    except Exception as e:
        print(f"❌ Cleanup error: {e}")

def cleanup_tmp():
    """Nettoyer les fichiers temporaires de plus de 1 heure"""
    try:
        now = time.time()
        count = 0
        for f in glob.glob("/tmp/*.pdf") + glob.glob("/tmp/*.docx") + glob.glob("/tmp/*.txt"):
            if os.path.getmtime(f) < now - 3600:
                os.remove(f)
                count += 1
        if count > 0:
            print(f"🧹 Cleaned {count} tmp files")
    except Exception as e:
        print(f"❌ Tmp cleanup error: {e}")

import threading

def scheduled_cleanup():
    """Nettoyage automatique toutes les heures"""
    while True:
        time.sleep(3600)  # 1 heure
        cleanup_secrets()
        cleanup_tmp()

def try_init():
    for i in range(10):
        try:
            init_db()
            print("✅ DB initialized")
            # Nettoyage au démarrage
            cleanup_secrets()
            cleanup_tmp()
            return
        except Exception as e:
            print(f"⏳ Waiting for DB... ({i+1}/10): {e}")
            time.sleep(3)
    print("❌ Could not connect to DB")

threading.Thread(target=try_init, daemon=True).start()
threading.Thread(target=scheduled_cleanup, daemon=True).start()

# Encryption key
FERNET_KEY = os.getenv("FERNET_KEY", Fernet.generate_key().decode())
fernet = Fernet(FERNET_KEY.encode() if isinstance(FERNET_KEY, str) else FERNET_KEY)

# ─────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────
async def check_file_size(file: UploadFile):
    """Vérifier la taille du fichier avant traitement"""
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"Fichier trop volumineux. Maximum: 10MB. Votre fichier: {len(contents)/1024/1024:.1f}MB"
        )
    await file.seek(0)
    return contents

# ─────────────────────────────────────────
# HEALTH
# ─────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "services": ["pdf2docx", "ocr", "secrets"]}

# ─────────────────────────────────────────
# PDF → DOCX
# ─────────────────────────────────────────
@app.post("/pdf/convert")
@limiter.limit("10/minute")
async def convert_pdf(request: Request, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Le fichier doit être un PDF")
    contents = await check_file_size(file)
    tmp_id    = str(uuid.uuid4())
    pdf_path  = f"/tmp/{tmp_id}.pdf"
    docx_path = f"/tmp/{tmp_id}.docx"
    try:
        with open(pdf_path, "wb") as f:
            f.write(contents)
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()
        if not os.path.exists(docx_path):
            raise HTTPException(status_code=500, detail="Conversion échouée")
        output_name = file.filename.replace(".pdf", ".docx")
        return FileResponse(
            path=docx_path, filename=output_name,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Access-Control-Allow-Origin": "*"}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")
    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

# ─────────────────────────────────────────
# OCR
# ─────────────────────────────────────────
ALLOWED_OCR = [".jpg",".jpeg",".png",".bmp",".tiff",".tif",".webp",".pdf"]

def do_ocr(file_bytes, filename, lang):
    ext = os.path.splitext(filename.lower())[1]
    if ext == ".pdf":
        images = convert_from_bytes(file_bytes, dpi=300)
        text = ""
        for i, img in enumerate(images):
            text += f"\n--- Page {i+1} ---\n"
            text += pytesseract.image_to_string(img, lang=lang)
        return text.strip()
    else:
        img = Image.open(io.BytesIO(file_bytes))
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        return pytesseract.image_to_string(img, lang=lang).strip()

@app.post("/ocr")
@limiter.limit("10/minute")
async def ocr_file(request: Request, file: UploadFile = File(...), lang: str = "fra+eng+ara", output: str = "text"):
    ext = os.path.splitext(file.filename.lower())[1]
    if ext not in ALLOWED_OCR:
        raise HTTPException(status_code=400, detail=f"Format non supporté: {ext}")
    contents = await check_file_size(file)
    try:
        extracted = do_ocr(contents, file.filename, lang)
        if not extracted:
            extracted = "Aucun texte détecté."
        if output == "text":
            return JSONResponse({"text": extracted, "chars": len(extracted), "words": len(extracted.split())})
        tmp_id = str(uuid.uuid4())
        if output == "txt":
            path = f"/tmp/{tmp_id}.txt"
            with open(path, "w", encoding="utf-8") as f:
                f.write(extracted)
            return FileResponse(path, filename=file.filename.rsplit(".",1)[0]+".txt", media_type="text/plain")
        if output == "docx":
            path = f"/tmp/{tmp_id}.docx"
            doc = DocxDocument()
            doc.add_heading("Texte extrait par OCR", 0)
            doc.add_paragraph(f"Source : {file.filename}")
            doc.add_paragraph(f"Mots : {len(extracted.split())}")
            doc.add_paragraph("")
            for line in extracted.split("\n"):
                doc.add_paragraph(line)
            doc.save(path)
            return FileResponse(
                path, filename=file.filename.rsplit(".",1)[0]+".docx",
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur OCR: {str(e)}")

# ─────────────────────────────────────────
# PDF COMPRESS
# ─────────────────────────────────────────
@app.post("/pdf/compress")
@limiter.limit("10/minute")
async def compress_pdf(request: Request, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Le fichier doit être un PDF")
    contents = await check_file_size(file)
    tmp_id     = str(uuid.uuid4())
    input_path = f"/tmp/{tmp_id}_input.pdf"
    out_path   = f"/tmp/{tmp_id}_compressed.pdf"
    try:
        with open(input_path, "wb") as f:
            f.write(contents)
        original_size = os.path.getsize(input_path)
        import subprocess
        result = subprocess.run([
            "gs", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.4",
            "-dPDFSETTINGS=/ebook", "-dNOPAUSE", "-dQUIET", "-dBATCH",
            f"-sOutputFile={out_path}", input_path
        ], capture_output=True, timeout=60)
        if result.returncode != 0 or not os.path.exists(out_path):
            raise HTTPException(status_code=500, detail=f"Compression échouée: {result.stderr.decode()[:200]}")
        compressed_size = os.path.getsize(out_path)
        reduction = round((1 - compressed_size / original_size) * 100, 1)
        output_name = file.filename.replace(".pdf", "_compressed.pdf")
        return FileResponse(
            path=out_path, filename=output_name, media_type="application/pdf",
            headers={
                "Access-Control-Allow-Origin": "*",
                "X-Original-Size": str(original_size),
                "X-Compressed-Size": str(compressed_size),
                "X-Reduction": str(reduction),
            }
        )
    except HTTPException:
        raise
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=500, detail="Timeout — fichier trop volumineux")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)

# ─────────────────────────────────────────
# SECRET SHARING
# ─────────────────────────────────────────
EXPIRY_OPTIONS = {"1h": 1, "24h": 24, "7d": 168, "30d": 720}

class SecretCreate(BaseModel):
    content: str
    expiry: str = "24h"

@app.post("/secrets")
@limiter.limit("20/minute")
async def create_secret(request: Request, body: SecretCreate):
    if not body.content.strip():
        raise HTTPException(status_code=400, detail="Le secret ne peut pas être vide")
    if len(body.content) > 50000:
        raise HTTPException(status_code=400, detail="Secret trop long (max 50 000 caractères)")
    if body.expiry not in EXPIRY_OPTIONS:
        raise HTTPException(status_code=400, detail="Durée invalide")
    secret_id  = str(uuid.uuid4()).replace("-","")[:20]
    ciphertext = fernet.encrypt(body.content.encode()).decode()
    hours      = EXPIRY_OPTIONS[body.expiry]
    expires_at = datetime.utcnow() + timedelta(hours=hours)
    try:
        conn = get_db()
        cur  = conn.cursor()
        cur.execute(
            "INSERT INTO secrets (id, ciphertext, expires_at) VALUES (%s, %s, %s)",
            (secret_id, ciphertext, expires_at)
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur DB: {str(e)}")
    return {"id": secret_id, "expires_at": expires_at.isoformat()}

@app.get("/secrets/{secret_id}")
@limiter.limit("20/minute")
async def get_secret(request: Request, secret_id: str):
    try:
        conn = get_db()
        cur  = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("SELECT * FROM secrets WHERE id = %s", (secret_id,))
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            raise HTTPException(status_code=404, detail="Secret introuvable ou déjà consulté")
        if row["viewed"]:
            cur.execute("DELETE FROM secrets WHERE id = %s", (secret_id,))
            conn.commit(); cur.close(); conn.close()
            raise HTTPException(status_code=410, detail="Ce secret a déjà été consulté et détruit")
        if datetime.utcnow() > row["expires_at"]:
            cur.execute("DELETE FROM secrets WHERE id = %s", (secret_id,))
            conn.commit(); cur.close(); conn.close()
            raise HTTPException(status_code=410, detail="Ce secret a expiré")
        plaintext = fernet.decrypt(row["ciphertext"].encode()).decode()
        cur.execute("UPDATE secrets SET viewed = TRUE WHERE id = %s", (secret_id,))
        conn.commit(); cur.close(); conn.close()
        return {"content": plaintext, "expires_at": row["expires_at"].isoformat()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@app.delete("/secrets/{secret_id}")
async def delete_secret(secret_id: str):
    conn = get_db()
    cur  = conn.cursor()
    cur.execute("DELETE FROM secrets WHERE id = %s", (secret_id,))
    conn.commit(); cur.close(); conn.close()
    return {"deleted": True}

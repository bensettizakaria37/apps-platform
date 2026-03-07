from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pdf2docx import Converter
import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes
from docx import Document as DocxDocument
import io, os, uuid

app = FastAPI(title="Apps Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# ─────────────────────────────────────────
# HEALTH
# ─────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "services": ["pdf2docx", "ocr"]}

# ─────────────────────────────────────────
# PDF → DOCX
# ─────────────────────────────────────────
@app.post("/pdf/convert")
async def convert_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Le fichier doit être un PDF")
    tmp_id    = str(uuid.uuid4())
    pdf_path  = f"/tmp/{tmp_id}.pdf"
    docx_path = f"/tmp/{tmp_id}.docx"
    try:
        with open(pdf_path, "wb") as f:
            f.write(await file.read())
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

def do_ocr(file_bytes: bytes, filename: str, lang: str) -> str:
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
async def ocr_file(
    file: UploadFile = File(...),
    lang: str = "fra+eng+ara",
    output: str = "text"
):
    ext = os.path.splitext(file.filename.lower())[1]
    if ext not in ALLOWED_OCR:
        raise HTTPException(status_code=400, detail=f"Format non supporté: {ext}")
    try:
        file_bytes = await file.read()
        extracted  = do_ocr(file_bytes, file.filename, lang)
        if not extracted:
            extracted = "Aucun texte détecté."

        if output == "text":
            return JSONResponse({
                "text": extracted,
                "chars": len(extracted),
                "words": len(extracted.split())
            })

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

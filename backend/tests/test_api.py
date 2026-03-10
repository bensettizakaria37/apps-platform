import pytest
from fastapi.testclient import TestClient
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

# ─────────────────────────────────────────
# HEALTH
# ─────────────────────────────────────────
def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    assert "pdf2docx" in res.json()["services"]

# ─────────────────────────────────────────
# PDF CONVERT
# ─────────────────────────────────────────
def test_convert_no_file():
    res = client.post("/pdf/convert")
    assert res.status_code == 422

def test_convert_wrong_format():
    res = client.post("/pdf/convert", files={"file": ("test.txt", b"hello", "text/plain")})
    assert res.status_code == 400
    assert "PDF" in res.json()["detail"]

def test_convert_file_too_large():
    big_file = b"0" * (51 * 1024 * 1024)  # 51MB
    res = client.post("/pdf/convert", files={"file": ("test.pdf", big_file, "application/pdf")})
    assert res.status_code == 413

# ─────────────────────────────────────────
# PDF COMPRESS
# ─────────────────────────────────────────
def test_compress_no_file():
    res = client.post("/pdf/compress")
    assert res.status_code == 422

def test_compress_wrong_format():
    res = client.post("/pdf/compress", files={"file": ("test.txt", b"hello", "text/plain")})
    assert res.status_code == 400

# ─────────────────────────────────────────
# OCR
# ─────────────────────────────────────────
def test_ocr_no_file():
    res = client.post("/ocr")
    assert res.status_code == 422

def test_ocr_wrong_format():
    res = client.post("/ocr", files={"file": ("test.pdf2", b"hello", "application/pdf")})
    assert res.status_code == 400

# ─────────────────────────────────────────
# SECRETS
# ─────────────────────────────────────────
def test_create_secret():
    res = client.post("/secrets", json={"content": "mon secret test", "expiry": "1h"})
    assert res.status_code == 200
    assert "id" in res.json()
    assert "expires_at" in res.json()

def test_create_secret_empty():
    res = client.post("/secrets", json={"content": "", "expiry": "1h"})
    assert res.status_code == 400

def test_create_secret_invalid_expiry():
    res = client.post("/secrets", json={"content": "test", "expiry": "99h"})
    assert res.status_code == 400

def test_get_secret_not_found():
    res = client.get("/secrets/idquinexistepas")
    assert res.status_code == 404

def test_secret_full_flow():
    # Créer
    res = client.post("/secrets", json={"content": "secret complet", "expiry": "1h"})
    assert res.status_code == 200
    secret_id = res.json()["id"]

    # Lire
    res = client.get(f"/secrets/{secret_id}")
    assert res.status_code == 200
    assert res.json()["content"] == "secret complet"

    # Lire une 2ème fois → doit échouer
    res = client.get(f"/secrets/{secret_id}")
    assert res.status_code in [404, 410]

# ─────────────────────────────────────────
# JOBS
# ─────────────────────────────────────────
def test_job_not_found():
    res = client.get("/jobs/jobquinexistepas")
    assert res.status_code == 404

def test_job_download_not_found():
    res = client.get("/jobs/jobquinexistepas/download")
    assert res.status_code == 404

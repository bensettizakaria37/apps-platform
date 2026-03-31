import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
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
    big_file = b"0" * (51 * 1024 * 1024)
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
# SECRETS — avec mock PostgreSQL
# ─────────────────────────────────────────
def make_mock_conn(fetchone_result=None):
    mock_cur = MagicMock()
    mock_cur.fetchone.return_value = fetchone_result
    mock_conn = MagicMock()
    mock_conn.cursor.return_value = mock_cur
    return mock_conn, mock_cur

def test_create_secret():
    mock_conn, mock_cur = make_mock_conn()
    with patch("main.get_db", return_value=mock_conn):
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
    mock_conn, mock_cur = make_mock_conn(fetchone_result=None)
    with patch("main.get_db", return_value=mock_conn):
        res = client.get("/secrets/idquinexistepas")
    assert res.status_code == 404

def test_secret_full_flow():
    from cryptography.fernet import Fernet
    import main
    
    # Créer
    mock_conn, mock_cur = make_mock_conn()
    with patch("main.get_db", return_value=mock_conn):
        res = client.post("/secrets", json={"content": "secret complet", "expiry": "1h"})
    assert res.status_code == 200
    secret_id = res.json()["id"]

    # Préparer mock pour GET
    from datetime import datetime, timedelta
    ciphertext = main.fernet.encrypt(b"secret complet").decode()
    mock_row = {
        "id": secret_id,
        "ciphertext": ciphertext,
        "expires_at": datetime.utcnow() + timedelta(hours=1),
        "viewed": False
    }
    mock_conn2, mock_cur2 = make_mock_conn(fetchone_result=mock_row)
    mock_cur2.fetchone.return_value = mock_row

    with patch("main.get_db", return_value=mock_conn2):
        res = client.get(f"/secrets/{secret_id}")
    assert res.status_code == 200
    assert res.json()["content"] == "secret complet"

# ─────────────────────────────────────────
# JOBS
# ─────────────────────────────────────────

# Override job tests with mock
import unittest.mock as mock

def test_job_not_found_mock():
    with mock.patch("main.get_job_db", return_value=None):
        res = client.get("/jobs/jobquinexistepas123")
        assert res.status_code == 404

def test_job_download_not_found_mock():
    with mock.patch("main.get_job_db", return_value=None):
        res = client.get("/jobs/jobquinexistepas123/download")
        assert res.status_code == 404

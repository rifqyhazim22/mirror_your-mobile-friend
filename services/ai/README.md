# Mirror AI Service

Layanan FastAPI untuk orkestrasi AI Mirror:
- Endpoint utama `/chat` (akan ditambahkan) mengelola percakapan dengan LLM dan guardrails.
- Menyediakan pipeline analitik (sentiment, personality insight) via Celery job.
- Konfigurasi environment menggunakan `python-dotenv` dan secrets manager (TODO).

## Menjalankan Lokal
```bash
uvicorn mirror_ai.main:app --reload
```

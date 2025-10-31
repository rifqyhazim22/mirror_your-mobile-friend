from fastapi import FastAPI

app = FastAPI(title="Mirror AI Service", version="0.1.0")


@app.get("/health")
def health_check():
    """Simple health endpoint used by orchestrator and monitoring."""
    return {"status": "ok"}

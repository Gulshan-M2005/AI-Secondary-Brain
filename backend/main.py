from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routes import action_items, conversations, memory, questions, recordings, reports, settings, transcripts

Path(__file__).resolve().parent.joinpath("storage", "audio").mkdir(parents=True, exist_ok=True)
Path(__file__).resolve().parent.joinpath("storage", "reports").mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="AI Secondary Brain",
    description="Private local-first AI memory system powered by Faster-Whisper, SQLite, and Ollama.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok", "privacy": "local-only", "recording_auto_start": False}


app.include_router(recordings.router)
app.include_router(conversations.router)
app.include_router(transcripts.router)
app.include_router(memory.router)
app.include_router(questions.router)
app.include_router(reports.router)
app.include_router(settings.router)
app.include_router(action_items.router)

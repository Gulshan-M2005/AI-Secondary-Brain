import os

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import DATABASE_PATH, get_db
from models import Setting

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("")
def get_settings(db: Session = Depends(get_db)):
    rows = {row.key: row.value for row in db.query(Setting).all()}
    return {
        "database_path": str(DATABASE_PATH),
        "audio_storage": str(DATABASE_PATH.parent / "storage" / "audio"),
        "ollama_base_url": os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        "ollama_model": os.getenv("OLLAMA_MODEL", "llama3.1:8b"),
        "embedding_model": os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text"),
        "custom": rows,
    }


@router.put("/{key}")
def set_setting(key: str, value: str, db: Session = Depends(get_db)):
    row = db.query(Setting).filter(Setting.key == key).first()
    if not row:
        row = Setting(key=key, value=value)
        db.add(row)
    else:
        row.value = value
    db.commit()
    return {"key": key, "value": value}

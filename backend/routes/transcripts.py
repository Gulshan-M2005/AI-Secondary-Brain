from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Summary, Transcript
from schemas import TranscriptUpdate
from services.memory_engine import rebuild_memory
from services.summary_engine import generate_summary

router = APIRouter(prefix="/transcripts", tags=["transcripts"])


@router.patch("/{conversation_id}")
def update_transcript(conversation_id: int, payload: TranscriptUpdate, db: Session = Depends(get_db)):
    transcript = db.query(Transcript).filter(Transcript.conversation_id == conversation_id).first()
    if not transcript:
        transcript = Transcript(conversation_id=conversation_id)
        db.add(transcript)
    transcript.text = payload.text
    transcript.status = "edited"
    transcript.updated_at = datetime.utcnow()
    db.commit()
    rebuild_memory(db, conversation_id, payload.text)
    data = generate_summary(payload.text)
    summary = db.query(Summary).filter(Summary.conversation_id == conversation_id).first()
    if not summary:
        summary = Summary(conversation_id=conversation_id)
        db.add(summary)
    summary.short_summary = str(data.get("short_summary", ""))
    summary.detailed_summary = str(data.get("detailed_summary", ""))
    summary.key_points = "\n".join(map(str, data.get("key_points", [])))
    summary.decisions = "\n".join(map(str, data.get("decisions", [])))
    summary.deadlines = "\n".join(map(str, data.get("deadlines", [])))
    db.commit()
    return {"ok": True, "summary": data}


@router.get("/{conversation_id}/export")
def export_transcript(conversation_id: int, db: Session = Depends(get_db)):
    transcript = db.query(Transcript).filter(Transcript.conversation_id == conversation_id).first()
    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript not found")
    return {"conversation_id": conversation_id, "text": transcript.text}

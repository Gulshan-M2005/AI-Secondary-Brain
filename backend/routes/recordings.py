from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from database import get_db
from models import ActionItem, AudioFile, Conversation, Summary, Transcript
from services.action_item_engine import heuristic_action_items, normalize_items
from services.audio_service import save_upload
from services.memory_engine import rebuild_memory
from services.summary_engine import generate_summary
from services.transcription_service import transcribe_audio

router = APIRouter(prefix="/recordings", tags=["recordings"])


@router.post("/upload")
def upload_recording(
    file: UploadFile = File(...),
    title: str = Form("Recorded Conversation"),
    conversation_type: str = Form("Meeting"),
    participants: str = Form(""),
    tags: str = Form(""),
    duration_seconds: int = Form(0),
    db: Session = Depends(get_db),
):
    conv = Conversation(
        title=title,
        conversation_type=conversation_type,
        participants=participants,
        tags=tags,
        duration_seconds=duration_seconds,
        updated_at=datetime.utcnow(),
    )
    db.add(conv)
    db.commit()
    db.refresh(conv)

    audio_meta = save_upload(file)
    db.add(AudioFile(conversation_id=conv.id, duration_seconds=duration_seconds, **audio_meta))
    db.commit()

    transcription = transcribe_audio(audio_meta["file_path"])
    transcript = Transcript(
        conversation_id=conv.id,
        text=transcription["text"],
        confidence=transcription["confidence"],
        status=transcription["status"],
        updated_at=datetime.utcnow(),
    )
    db.add(transcript)
    db.commit()

    rebuild_memory(db, conv.id, transcription["text"], transcription.get("segments"))
    summary = generate_summary(transcription["text"])
    db.add(
        Summary(
            conversation_id=conv.id,
            short_summary=str(summary.get("short_summary", "")),
            detailed_summary=str(summary.get("detailed_summary", "")),
            key_points="\n".join(map(str, summary.get("key_points", []))),
            decisions="\n".join(map(str, summary.get("decisions", []))),
            deadlines="\n".join(map(str, summary.get("deadlines", []))),
            advice="\n".join(map(str, summary.get("advice", []))),
            risks="\n".join(map(str, summary.get("risks", []))),
            opportunities="\n".join(map(str, summary.get("opportunities", []))),
            people=", ".join(map(str, summary.get("people", []))),
            topics=", ".join(map(str, summary.get("topics", []))),
        )
    )
    for item in normalize_items(summary.get("action_items")) or heuristic_action_items(transcription["text"]):
        db.add(ActionItem(conversation_id=conv.id, **item))
    db.commit()
    return {
        "conversation_id": conv.id,
        "transcription_status": transcription["status"],
        "summary": summary,
        "audio": audio_meta,
    }

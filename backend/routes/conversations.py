from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import ActionItem, Conversation
from schemas import ConversationCreate, ConversationUpdate

router = APIRouter(prefix="/conversations", tags=["conversations"])


def serialize_conversation(conv: Conversation) -> dict:
    return {
        "id": conv.id,
        "title": conv.title,
        "conversation_type": conv.conversation_type,
        "participants": conv.participants,
        "tags": conv.tags,
        "duration_seconds": conv.duration_seconds,
        "archived": conv.archived,
        "created_at": conv.created_at,
        "has_transcript": bool(conv.transcript and conv.transcript.text),
        "summary": conv.summary.short_summary if conv.summary else "",
        "action_items": len(conv.action_items),
    }


@router.get("")
def list_conversations(include_archived: bool = False, db: Session = Depends(get_db)):
    query = db.query(Conversation)
    if not include_archived:
        query = query.filter(Conversation.archived == False)
    return [serialize_conversation(conv) for conv in query.order_by(Conversation.created_at.desc()).all()]


@router.post("")
def create_conversation(payload: ConversationCreate, db: Session = Depends(get_db)):
    conv = Conversation(**payload.model_dump(), updated_at=datetime.utcnow())
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return serialize_conversation(conv)


@router.get("/stats/dashboard")
def dashboard(db: Session = Depends(get_db)):
    conversations = db.query(Conversation).all()
    actions = db.query(ActionItem).all()
    total_seconds = sum(conv.duration_seconds for conv in conversations)
    now = datetime.utcnow()
    weekly = []
    for day in range(6, -1, -1):
        target = (now - timedelta(days=day)).date()
        weekly.append(
            {
                "day": target.strftime("%a"),
                "conversations": sum(1 for conv in conversations if conv.created_at.date() == target),
                "hours": round(sum(conv.duration_seconds for conv in conversations if conv.created_at.date() == target) / 3600, 2),
            }
        )
    topics = {}
    for conv in conversations:
        for tag in [t.strip() for t in conv.tags.split(",") if t.strip()]:
            topics[tag] = topics.get(tag, 0) + 1
    return {
        "totals": {
            "conversations": len(conversations),
            "hours_recorded": round(total_seconds / 3600, 2),
            "transcripts": sum(1 for conv in conversations if conv.transcript),
            "action_items": len(actions),
            "pending_followups": sum(1 for item in actions if not item.completed),
        },
        "recent_conversations": [serialize_conversation(conv) for conv in sorted(conversations, key=lambda c: c.created_at, reverse=True)[:6]],
        "weekly_activity": weekly,
        "topic_distribution": [{"name": key, "value": value} for key, value in topics.items()] or [{"name": "Untagged", "value": len(conversations)}],
    }


@router.get("/{conversation_id}")
def get_conversation(conversation_id: int, db: Session = Depends(get_db)):
    conv = db.get(Conversation, conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {
        **serialize_conversation(conv),
        "audio_files": [
            {"id": audio.id, "file_name": audio.file_name, "format": audio.format, "size_bytes": audio.size_bytes}
            for audio in conv.audio_files
        ],
        "transcript": {
            "text": conv.transcript.text,
            "confidence": conv.transcript.confidence,
            "status": conv.transcript.status,
        }
        if conv.transcript
        else None,
        "chunks": [
            {"id": chunk.id, "text": chunk.text, "start_seconds": chunk.start_seconds, "end_seconds": chunk.end_seconds}
            for chunk in conv.chunks
        ],
        "summary_full": {
            "short_summary": conv.summary.short_summary,
            "detailed_summary": conv.summary.detailed_summary,
            "key_points": conv.summary.key_points,
            "decisions": conv.summary.decisions,
            "deadlines": conv.summary.deadlines,
            "advice": conv.summary.advice,
            "risks": conv.summary.risks,
            "opportunities": conv.summary.opportunities,
            "people": conv.summary.people,
            "topics": conv.summary.topics,
        }
        if conv.summary
        else None,
        "actions": [
            {
                "id": item.id,
                "task": item.task,
                "assignee": item.assignee,
                "deadline": item.deadline,
                "notes": item.notes,
                "completed": item.completed,
            }
            for item in conv.action_items
        ],
    }


@router.patch("/{conversation_id}")
def update_conversation(conversation_id: int, payload: ConversationUpdate, db: Session = Depends(get_db)):
    conv = db.get(Conversation, conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(conv, key, value)
    conv.updated_at = datetime.utcnow()
    db.commit()
    return serialize_conversation(conv)


@router.delete("/{conversation_id}")
def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    conv = db.get(Conversation, conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.delete(conv)
    db.commit()
    return {"ok": True}

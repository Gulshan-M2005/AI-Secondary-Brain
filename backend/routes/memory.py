from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import SearchRequest
from services.search_engine import hybrid_search, keyword_search, vector_search

router = APIRouter(prefix="/memory", tags=["memory"])


@router.post("/search")
def search_memory(payload: SearchRequest, db: Session = Depends(get_db)):
    if payload.mode == "keyword":
        results = keyword_search(db, payload.query, payload.limit)
    elif payload.mode == "semantic":
        results = vector_search(db, payload.query, payload.limit)
    else:
        results = hybrid_search(db, payload.query, payload.limit)
    return {"query": payload.query, "mode": payload.mode, "results": results}


@router.get("/timeline")
def timeline(db: Session = Depends(get_db)):
    from models import Conversation

    conversations = db.query(Conversation).order_by(Conversation.created_at.desc()).all()
    return [
        {
            "id": conv.id,
            "title": conv.title,
            "type": conv.conversation_type,
            "date": conv.created_at,
            "summary": conv.summary.short_summary if conv.summary else "",
            "tags": conv.tags,
        }
        for conv in conversations
    ]

from sqlalchemy.orm import Session

from models import Conversation, TranscriptChunk
from services.embedding_service import cosine, embed_text, unpack_vector


def keyword_search(db: Session, query: str, limit: int = 8) -> list[dict]:
    rows = (
        db.query(TranscriptChunk, Conversation)
        .join(Conversation, Conversation.id == TranscriptChunk.conversation_id)
        .filter(TranscriptChunk.text.ilike(f"%{query}%"))
        .limit(limit)
        .all()
    )
    return [
        {
            "conversation_id": conv.id,
            "conversation_title": conv.title,
            "chunk_id": chunk.id,
            "text": chunk.text,
            "score": 0.72,
            "type": "keyword",
        }
        for chunk, conv in rows
    ]


def vector_search(db: Session, query: str, limit: int = 8) -> list[dict]:
    qv = embed_text(query)
    chunks = db.query(TranscriptChunk).all()
    ranked = []
    for chunk in chunks:
        if chunk.embedding:
            score = cosine(qv, unpack_vector(chunk.embedding.vector))
            ranked.append((score, chunk))
    ranked.sort(key=lambda item: item[0], reverse=True)
    results = []
    for score, chunk in ranked[:limit]:
        conv = db.get(Conversation, chunk.conversation_id)
        results.append(
            {
                "conversation_id": conv.id,
                "conversation_title": conv.title,
                "chunk_id": chunk.id,
                "text": chunk.text,
                "score": round(float(score), 3),
                "type": "semantic",
            }
        )
    return results


def hybrid_search(db: Session, query: str, limit: int = 8) -> list[dict]:
    by_id = {}
    for result in vector_search(db, query, limit * 2) + keyword_search(db, query, limit * 2):
        current = by_id.get(result["chunk_id"])
        if not current or result["score"] > current["score"]:
            by_id[result["chunk_id"]] = result
    return sorted(by_id.values(), key=lambda item: item["score"], reverse=True)[:limit]

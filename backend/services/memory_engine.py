from sqlalchemy.orm import Session

from models import Embedding, TranscriptChunk
from services.embedding_service import embed_text, pack_vector


def chunk_text(text: str, words_per_chunk: int = 140) -> list[str]:
    words = text.split()
    if not words:
        return []
    return [" ".join(words[i : i + words_per_chunk]) for i in range(0, len(words), words_per_chunk)]


def rebuild_memory(db: Session, conversation_id: int, transcript_text: str, segments: list[dict] | None = None):
    db.query(TranscriptChunk).filter(TranscriptChunk.conversation_id == conversation_id).delete()
    segment_chunks = segments or []
    texts = segment_chunks if segment_chunks else [
        {"index": i, "text": chunk, "start": 0.0, "end": 0.0}
        for i, chunk in enumerate(chunk_text(transcript_text))
    ]
    for item in texts:
        text = item.get("text", "").strip()
        if not text:
            continue
        chunk = TranscriptChunk(
            conversation_id=conversation_id,
            chunk_index=item.get("index", 0),
            text=text,
            start_seconds=item.get("start", 0.0),
            end_seconds=item.get("end", 0.0),
        )
        db.add(chunk)
        db.flush()
        vector = embed_text(text)
        db.add(Embedding(chunk_id=chunk.id, vector=pack_vector(vector), dimensions=len(vector)))
    db.commit()

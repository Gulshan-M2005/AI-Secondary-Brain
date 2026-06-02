import json

from sqlalchemy.orm import Session

from models import QAHistory
from services.ollama_service import generate
from services.search_engine import hybrid_search


NO_INFO = "I don't have this information in the saved conversation."


def answer_question(db: Session, question: str) -> dict:
    sources = hybrid_search(db, question, limit=5)
    if not sources:
        answer = {"answer": NO_INFO, "sources": [], "confidence": 0.0}
    else:
        context = "\n\n".join(
            f"Source {i+1} ({src['conversation_title']}): {src['text']}" for i, src in enumerate(sources)
        )
        prompt = f"""
Answer the question only from the saved transcript sections below.
If the answer is unavailable, return exactly: {NO_INFO}

Question: {question}

Transcript sections:
{context}
"""
        text = generate(prompt, "You are a private local RAG assistant. Do not invent facts.")
        if not text:
            text = f"From the closest saved transcript section: {sources[0]['text']}"
        answer = {
            "answer": text if text else NO_INFO,
            "sources": sources,
            "confidence": round(max((src["score"] for src in sources), default=0.0), 3),
        }
    db.add(QAHistory(question=question, answer=answer["answer"], sources=json.dumps(answer["sources"]), confidence=answer["confidence"]))
    db.commit()
    return answer

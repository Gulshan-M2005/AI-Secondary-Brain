from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import QuestionRequest
from services.rag_engine import answer_question

router = APIRouter(prefix="/questions", tags=["questions"])


@router.post("/ask")
def ask_question(payload: QuestionRequest, db: Session = Depends(get_db)):
    return answer_question(db, payload.question)

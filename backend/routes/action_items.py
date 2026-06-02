from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import ActionItem
from schemas import ActionItemUpdate

router = APIRouter(prefix="/action-items", tags=["action-items"])


@router.get("")
def list_action_items(db: Session = Depends(get_db)):
    return [
        {
            "id": item.id,
            "conversation_id": item.conversation_id,
            "task": item.task,
            "assignee": item.assignee,
            "deadline": item.deadline,
            "notes": item.notes,
            "completed": item.completed,
            "created_at": item.created_at,
        }
        for item in db.query(ActionItem).order_by(ActionItem.created_at.desc()).all()
    ]


@router.patch("/{item_id}")
def update_action_item(item_id: int, payload: ActionItemUpdate, db: Session = Depends(get_db)):
    item = db.get(ActionItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    return {"ok": True}

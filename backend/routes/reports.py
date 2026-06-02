from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Report
from schemas import ReportRequest
from services.report_generator import generate_report

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/generate")
def create_report(payload: ReportRequest, db: Session = Depends(get_db)):
    path = generate_report(db, payload.report_type, payload.conversation_id, payload.format)
    report = Report(conversation_id=payload.conversation_id, report_type=payload.report_type, file_path=path)
    db.add(report)
    db.commit()
    return {"file_path": path, "report_type": payload.report_type, "format": payload.format}


@router.get("")
def list_reports(db: Session = Depends(get_db)):
    return [
        {"id": report.id, "report_type": report.report_type, "file_path": report.file_path, "created_at": report.created_at}
        for report in db.query(Report).order_by(Report.created_at.desc()).all()
    ]

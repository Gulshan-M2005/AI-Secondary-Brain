from datetime import datetime
from pathlib import Path

from docx import Document
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from sqlalchemy.orm import Session

from models import Conversation

REPORT_DIR = Path(__file__).resolve().parents[1] / "storage" / "reports"
REPORT_DIR.mkdir(parents=True, exist_ok=True)


def _report_text(conversation: Conversation | None, report_type: str) -> str:
    title = conversation.title if conversation else "AI Secondary Brain"
    transcript = conversation.transcript.text if conversation and conversation.transcript else ""
    summary = conversation.summary.short_summary if conversation and conversation.summary else ""
    actions = "\n".join(f"- {item.task}" for item in (conversation.action_items if conversation else []))
    return f"{report_type}\n{title}\nGenerated: {datetime.now().isoformat(timespec='seconds')}\n\nSummary:\n{summary}\n\nAction Items:\n{actions}\n\nTranscript:\n{transcript}"


def generate_report(db: Session, report_type: str, conversation_id: int | None, fmt: str) -> str:
    conversation = db.get(Conversation, conversation_id) if conversation_id else None
    stem = f"{report_type.lower().replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    text = _report_text(conversation, report_type)
    if fmt == "txt":
        path = REPORT_DIR / f"{stem}.txt"
        path.write_text(text, encoding="utf-8")
    elif fmt == "docx":
        path = REPORT_DIR / f"{stem}.docx"
        doc = Document()
        for block in text.split("\n"):
            doc.add_paragraph(block)
        doc.save(path)
    else:
        path = REPORT_DIR / f"{stem}.pdf"
        pdf = canvas.Canvas(str(path), pagesize=letter)
        width, height = letter
        y = height - 40
        for line in text.split("\n"):
            if y < 40:
                pdf.showPage()
                y = height - 40
            pdf.drawString(40, y, line[:110])
            y -= 16
        pdf.save()
    return str(path)

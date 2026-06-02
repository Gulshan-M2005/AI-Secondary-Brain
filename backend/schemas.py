from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class ConversationCreate(BaseModel):
    title: str = "Untitled Conversation"
    conversation_type: str = "Meeting"
    participants: str = ""
    tags: str = ""
    duration_seconds: int = 0


class ConversationUpdate(BaseModel):
    title: str | None = None
    conversation_type: str | None = None
    participants: str | None = None
    tags: str | None = None
    archived: bool | None = None


class TranscriptUpdate(BaseModel):
    text: str


class ActionItemUpdate(BaseModel):
    task: str | None = None
    assignee: str | None = None
    deadline: str | None = None
    notes: str | None = None
    completed: bool | None = None


class QuestionRequest(BaseModel):
    question: str


class SearchRequest(BaseModel):
    query: str
    mode: str = "hybrid"
    limit: int = 8


class ReportRequest(BaseModel):
    report_type: str
    conversation_id: int | None = None
    format: str = "pdf"


class Out(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class ConversationOut(Out):
    id: int
    title: str
    conversation_type: str
    participants: str
    tags: str
    duration_seconds: int
    archived: bool
    created_at: datetime


class DashboardOut(BaseModel):
    totals: dict[str, Any]
    recent_conversations: list[dict[str, Any]]
    weekly_activity: list[dict[str, Any]]
    topic_distribution: list[dict[str, Any]]

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.models import ReportType, ReportStatus


class ReportCreate(BaseModel):
    report_type: ReportType
    description: Optional[str] = None
    location: Optional[str] = None
    incident_date: Optional[datetime] = None
    school: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    anonymous_id: str
    report_type: ReportType
    description: Optional[str]
    location: Optional[str]
    incident_date: Optional[datetime]
    school: Optional[str]
    status: ReportStatus
    created_at: datetime

    class Config:
        from_attributes = True

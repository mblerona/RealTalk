import secrets
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_school
from app.models.models import Report, User
from app.schemas.report import ReportCreate, ReportResponse

router = APIRouter()


@router.post("/", response_model=ReportResponse, status_code=201)
def create_report(payload: ReportCreate, db: Session = Depends(get_db)):
    """Submit an anonymous report. No auth required."""
    report = Report(
        anonymous_id=secrets.token_hex(32),
        report_type=payload.report_type,
        description=payload.description,
        location=payload.location,
        incident_date=payload.incident_date,
        school=payload.school,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/my-school", response_model=list[ReportResponse])
def list_school_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_school),
):
    """Returns reports for the logged-in school only."""
    return (
        db.query(Report)
        .filter(Report.school == current_user.username)
        .order_by(Report.created_at.desc())
        .all()
    )


@router.get("/", response_model=list[ReportResponse])
def list_all_reports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return db.query(Report).order_by(Report.created_at.desc()).offset(skip).limit(limit).all()

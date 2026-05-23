from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import Report, ReportType, User

router = APIRouter()

HBSC_DATA = {
    "vaping_by_age": [
        {"age": "11", "percentage": 4},
        {"age": "13", "percentage": 16},
        {"age": "15", "percentage": 32},
    ],
    "smoking_by_age": [
        {"age": "11", "percentage": 2},
        {"age": "13", "percentage": 11},
        {"age": "15", "percentage": 25},
    ],
    "fighting_by_gender": [
        {"gender": "Boys", "percentage": 14},
        {"gender": "Girls", "percentage": 6},
        {"gender": "Overall", "percentage": 10},
    ],
    "bullying_victims_trend": [
        {"year": "2014", "percentage": 9},
        {"year": "2018", "percentage": 11},
        {"year": "2022", "percentage": 11},
    ],
    "cyberbullying_trend": [
        {"year": "2018", "victims": 12, "perpetrators": 9},
        {"year": "2022", "victims": 16, "perpetrators": 12},
    ],
    "substance_use_summary": [
        {"label": "Ever vaped (age 15)", "percentage": 32},
        {"label": "Vaped last 30 days (age 15)", "percentage": 20},
        {"label": "Ever smoked (age 15)", "percentage": 25},
        {"label": "Smoked last 30 days (age 15)", "percentage": 15},
    ],
}


@router.get("/hbsc")
def get_hbsc_stats():
    return HBSC_DATA


@router.get("/reports/summary")
def get_reports_summary(db: Session = Depends(get_db)):
    rows = (
        db.query(Report.report_type, func.count(Report.id).label("count"))
        .group_by(Report.report_type)
        .all()
    )
    summary = {t.value: 0 for t in ReportType}
    for row in rows:
        summary[row.report_type.value] = row.count
    return summary


@router.get("/school")
def get_school_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Full analytics for the logged-in school:
    - total reports
    - breakdown by type
    - breakdown by location
    - reports per day (last 30 days)
    - most recent 5 reports
    """
    school = current_user.username

    # ── By type ──────────────────────────────────────────────
    type_rows = (
        db.query(Report.report_type, func.count(Report.id).label("count"))
        .filter(Report.school == school)
        .group_by(Report.report_type)
        .all()
    )
    by_type = {t.value: 0 for t in ReportType}
    for r in type_rows:
        by_type[r.report_type.value] = r.count

    # ── By location ──────────────────────────────────────────
    loc_rows = (
        db.query(Report.location, func.count(Report.id).label("count"))
        .filter(Report.school == school, Report.location != None, Report.location != "")
        .group_by(Report.location)
        .order_by(func.count(Report.id).desc())
        .limit(6)
        .all()
    )
    by_location = [{"location": r.location, "count": r.count} for r in loc_rows]

    # ── Reports per day — last 30 days ───────────────────────
    since = datetime.utcnow() - timedelta(days=30)
    day_rows = (
        db.query(
            func.date(Report.created_at).label("day"),
            func.count(Report.id).label("count")
        )
        .filter(Report.school == school, Report.created_at >= since)
        .group_by(func.date(Report.created_at))
        .order_by(func.date(Report.created_at))
        .all()
    )
    by_day = [{"day": str(r.day), "count": r.count} for r in day_rows]

    # ── Totals ───────────────────────────────────────────────
    total = db.query(func.count(Report.id)).filter(Report.school == school).scalar()
    pending = db.query(func.count(Report.id)).filter(
        Report.school == school, Report.status == "pending"
    ).scalar()

    return {
        "total": total,
        "pending": pending,
        "by_type": by_type,
        "by_location": by_location,
        "by_day": by_day,
    }
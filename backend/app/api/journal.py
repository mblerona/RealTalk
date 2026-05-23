from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import JournalEntry, User
from app.schemas.journal import JournalCreate, JournalResponse

router = APIRouter()


@router.post("/", response_model=JournalResponse, status_code=201)
def create_entry(
    payload: JournalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = JournalEntry(
        user_id=current_user.id,
        mood_score=payload.mood_score,
        faced_pressure=payload.faced_pressure,
        note=payload.note,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/", response_model=List[JournalResponse])
def list_entries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(JournalEntry)
        .filter(JournalEntry.user_id == current_user.id)
        .order_by(JournalEntry.created_at.desc())
        .all()
    )

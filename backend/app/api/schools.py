from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User
from app.schemas.auth import UserResponse

router = APIRouter()


@router.get("/", response_model=list[UserResponse])
def list_schools(db: Session = Depends(get_db)):
    """Public endpoint — returns all registered schools for the report dropdown."""
    return db.query(User).filter(User.role == "school", User.is_active == True).all()

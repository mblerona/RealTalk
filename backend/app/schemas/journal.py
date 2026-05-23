from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class JournalCreate(BaseModel):
    mood_score: int = Field(..., ge=1, le=5)
    faced_pressure: bool = False
    note: Optional[str] = None

class JournalResponse(BaseModel):
    id: int
    mood_score: int
    faced_pressure: bool
    note: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

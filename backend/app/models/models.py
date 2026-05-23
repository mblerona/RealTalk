from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class ReportType(str, enum.Enum):
    smoking = "smoking"
    vaping = "vaping"
    fighting = "fighting"
    bullying = "bullying"
    other = "other"


class ReportStatus(str, enum.Enum):
    pending = "pending"
    reviewed = "reviewed"
    resolved = "resolved"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String(20), default="student")  # student | school
    full_name = Column(String(200), nullable=True)   # official school full name
    email = Column(String(200), nullable=True)        # school email
    school = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    reports = relationship("Report", back_populates="user")
    journal_entries = relationship("JournalEntry", back_populates="user")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    # anonymous_id is a random token so reports can't be traced back to user
    anonymous_id = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    report_type = Column(Enum(ReportType), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(200), nullable=True)
    incident_date = Column(DateTime, nullable=True)
    school = Column(String(100), nullable=True)
    status = Column(Enum(ReportStatus), default=ReportStatus.pending)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reports")


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mood_score = Column(Integer, nullable=False)  # 1–5
    faced_pressure = Column(Boolean, default=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="journal_entries")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_token = Column(String(64), unique=True, index=True, nullable=False)
    # We store no user_id — chat is fully anonymous
    created_at = Column(DateTime, default=datetime.utcnow)
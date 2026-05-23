from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.models import models  # noqa
from app.api import auth, reports, chat, stats, journal, schools

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RealTalk API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost", settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,    prefix="/api/auth",    tags=["auth"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(chat.router,    prefix="/api/chat",    tags=["chat"])
app.include_router(stats.router,   prefix="/api/stats",   tags=["stats"])
app.include_router(journal.router, prefix="/api/journal", tags=["journal"])
app.include_router(schools.router, prefix="/api/schools", tags=["schools"])

@app.get("/health")
def health():
    return {"status": "ok"}

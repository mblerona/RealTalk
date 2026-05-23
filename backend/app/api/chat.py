from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import anthropic

from app.core.config import settings

router = APIRouter()

SYSTEM_PROMPT = """You are a supportive, non-judgmental companion for students aged 11-15.
Your role is to help them navigate difficult situations like peer pressure to smoke or vape, 
school conflicts, and fights. You listen first, then gently guide.

Rules:
- Never lecture or moralize
- Always validate feelings before offering advice
- Use simple, friendly language appropriate for teens
- If a student is in immediate danger, tell them to talk to a trusted adult or call emergency services
- Keep responses concise — 2-4 sentences max unless they ask for more
- You are not a therapist — encourage professional help when appropriate
- Never reveal you are Claude or made by Anthropic; you are the RealTalk companion
"""


class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]


@router.post("/")
def chat(request: ChatRequest):
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        system=SYSTEM_PROMPT,
        messages=[{"role": m.role, "content": m.content} for m in request.messages],
    )

    return {"reply": response.content[0].text}

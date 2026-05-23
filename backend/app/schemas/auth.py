from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str = "school"
    full_name: str           # official school full name e.g. "SOU Rade Jovcevski Korcagin"
    email: str               # school email e.g. "info@sourade.edu.mk"


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    full_name: Optional[str]
    email: Optional[str]
    school: Optional[str]

    class Config:
        from_attributes = True
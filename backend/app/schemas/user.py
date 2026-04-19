from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr

UserRole = Literal["admin", "editor", "viewer"]


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: UserRole = "editor"


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    role: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: str
    password: str

"""User model for SocialSim"""
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    username: str
    email: str
    full_name: Optional[str] = None
    is_active: bool = True


class User(UserBase, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None
    hashed_password: str
    is_active: bool = True
    is_guest: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None


class UserCreate(SQLModel):
    email: str
    password: str
    full_name: Optional[str] = None


class UserResponse(SQLModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    is_guest: bool = False
    created_at: datetime


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class TokenData(SQLModel):
    username: Optional[str] = None
    user_id: Optional[int] = None

"""Profile model - extends User with SocialSim-specific fields"""
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Profile(SQLModel, table=True):
    __tablename__ = "profile"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True, index=True)
    avatar_url: Optional[str] = None
    display_name: Optional[str] = None
    level: int = Field(default=1)
    xp: int = Field(default=0)
    voice_input_enabled: bool = Field(default=True)
    hint_frequency: str = Field(default="normal")  # low, normal, high
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None


class ProfileUpdate(SQLModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    voice_input_enabled: Optional[bool] = None
    hint_frequency: Optional[str] = None


class ProfileResponse(SQLModel):
    id: int
    user_id: int
    avatar_url: Optional[str] = None
    display_name: Optional[str] = None
    level: int = 1
    xp: int = 0
    voice_input_enabled: bool = True
    hint_frequency: str = "normal"

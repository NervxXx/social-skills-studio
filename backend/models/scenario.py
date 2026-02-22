"""Scenario model for simulation scenarios"""
from typing import Optional

from sqlmodel import Field, SQLModel


class Scenario(SQLModel, table=True):
    __tablename__ = "scenario"

    id: Optional[int] = Field(default=None, primary_key=True)
    external_id: str = Field(unique=True, index=True)
    title: str
    emoji: str = "💬"
    category_id: str
    difficulty: str = Field(default="medium")
    duration: int = Field(default=5)
    description: str = ""
    required_level: int = Field(default=1)


class ScenarioResponse(SQLModel):
    id: str
    title: str
    emoji: str
    category: str
    difficulty: str
    duration: int
    description: str
    required_level: int = 1

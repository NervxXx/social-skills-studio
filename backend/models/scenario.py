"""Scenario model for simulation scenarios"""
from typing import Optional

from sqlmodel import Field, SQLModel


class Scenario(SQLModel, table=True):
    __tablename__ = "scenario"

    id: Optional[int] = Field(default=None, primary_key=True)
    external_id: str = Field(unique=True, index=True)
    title: str
    emoji: str = "💬"
    category_id: str  # external_id of category
    difficulty: str = Field(default="medium")  # easy, medium, hard
    duration: int = Field(default=5)  # minutes
    description: str = ""


class ScenarioResponse(SQLModel):
    id: str
    title: str
    emoji: str
    category: str
    difficulty: str
    duration: int
    description: str

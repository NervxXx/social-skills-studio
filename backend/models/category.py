"""Category model for scenario categories"""
from typing import Optional

from sqlmodel import Field, SQLModel


class Category(SQLModel, table=True):
    __tablename__ = "category"

    id: Optional[int] = Field(default=None, primary_key=True)
    external_id: str = Field(unique=True, index=True)  # romance, work, family, etc.
    name: str
    emoji: str = Field(default="📁")


class CategoryResponse(SQLModel):
    id: str
    name: str
    emoji: str

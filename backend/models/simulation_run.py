"""Simulation run - stores completed simulations and feedback"""
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class SimulationRun(SQLModel, table=True):
    __tablename__ = "simulation_run"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    scenario_id: str  # external_id of scenario
    score: int = Field(default=0)  # 0-100
    empathy_score: int = Field(default=0)
    clarity_score: int = Field(default=0)
    emotional_control_score: int = Field(default=0)
    assertiveness_score: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class SimulationRunCreate(SQLModel):
    scenario_id: str
    score: int
    empathy_score: Optional[int] = None
    clarity_score: Optional[int] = None
    emotional_control_score: Optional[int] = None
    assertiveness_score: Optional[int] = None


class SimulationRunResponse(SQLModel):
    id: int
    scenario_id: str
    score: int
    date: str

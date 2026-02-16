"""Simulations API - save runs, recent runs"""
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from core.database import get_session
from core.dependencies import get_current_user, get_optional_user
from models.user import User
from models.simulation_run import SimulationRun, SimulationRunCreate, SimulationRunResponse
from services.profile_service import add_xp, ensure_profile

router = APIRouter(prefix="/simulations", tags=["simulations"])


@router.post("", response_model=SimulationRunResponse, status_code=201)
def save_simulation(
    data: SimulationRunCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Сохранить результат симуляции"""
    run = SimulationRun(
        user_id=current_user.id,
        scenario_id=data.scenario_id,
        score=data.score,
        empathy_score=data.empathy_score or data.score,
        clarity_score=data.clarity_score or data.score,
        emotional_control_score=data.emotional_control_score or data.score,
        assertiveness_score=data.assertiveness_score or data.score,
    )
    db.add(run)
    db.commit()
    db.refresh(run)

    # XP: базовые очки за прохождение + бонус за score
    xp_earned = 10 + (data.score // 10)
    add_xp(db, current_user.id, xp_earned)

    return SimulationRunResponse(
        id=run.id,
        scenario_id=run.scenario_id,
        score=run.score,
        date=run.created_at.strftime("%Y-%m-%d"),
    )


@router.get("/recent", response_model=list[SimulationRunResponse])
def recent_simulations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
    limit: int = 10,
):
    """Недавние симуляции пользователя"""
    stmt = (
        select(SimulationRun)
        .where(SimulationRun.user_id == current_user.id)
        .order_by(SimulationRun.created_at.desc())
        .limit(limit)
    )
    runs = db.exec(stmt).all()
    return [
        SimulationRunResponse(
            id=r.id,
            scenario_id=r.scenario_id,
            score=r.score,
            date=r.created_at.strftime("%Y-%m-%d"),
        )
        for r in runs
    ]

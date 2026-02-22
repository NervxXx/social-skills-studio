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


def _calc_xp(data: SimulationRunCreate) -> int:
    """
    Smart XP formula:
    base_xp × difficulty_mult × mood_mult × length_mult × score_bonus × turn_bonus

    Higher difficulty, aggressive mood, longer sessions = more XP.
    Good score gives bonus, bad score still gives some XP.
    """
    base_xp = 15

    diff_mult = {"calm": 1.0, "normal": 1.3, "challenging": 1.6}.get(data.difficulty, 1.3)

    p = data.personality
    mood_mult = 1.0 if p < 33 else 1.15 if p < 66 else 1.35

    len_mult = {"short": 1.0, "medium": 1.2, "long": 1.5}.get(data.session_length, 1.2)

    score_bonus = 1.0 + (data.score / 100) * 0.8  # score 0 → ×1.0, score 100 → ×1.8

    turns = max(1, data.turn_count)
    turn_bonus = min(1.0 + (turns - 1) * 0.05, 1.5)  # each turn +5%, max ×1.5

    raw = base_xp * diff_mult * mood_mult * len_mult * score_bonus * turn_bonus
    return max(5, round(raw))


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

    xp_earned = _calc_xp(data)
    add_xp(db, current_user.id, xp_earned)

    return SimulationRunResponse(
        id=run.id,
        scenario_id=run.scenario_id,
        score=run.score,
        date=run.created_at.strftime("%Y-%m-%d"),
        xp_earned=xp_earned,
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

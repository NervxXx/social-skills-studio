"""Stats API - user statistics from SimulationRuns"""
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from core.database import get_session
from core.dependencies import get_current_user
from models.user import User
from models.simulation_run import SimulationRun

router = APIRouter(prefix="/profiles/me", tags=["stats"])


@router.get("/stats")
def get_my_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Агрегированная статистика пользователя"""
    runs = db.exec(
        select(SimulationRun).where(SimulationRun.user_id == current_user.id)
    ).all()

    if not runs:
        return {
            "total_sessions": 0,
            "avg_score": 0,
            "best_score": 0,
            "streak_days": 0,
            "weekly_sessions": [0] * 7,  # Mon-Sun
            "skills": {
                "empathy": 0,
                "clarity": 0,
                "emotional_control": 0,
                "assertiveness": 0,
            },
            "achievements": [],
        }

    total = len(runs)
    scores = [r.score for r in runs]
    avg_score = round(sum(scores) / len(scores)) if scores else 0
    best_score = max(scores) if scores else 0

    # Streak: consecutive days with at least one session
    dates = sorted(set(r.created_at.date() for r in runs), reverse=True)
    streak = 0
    today = datetime.utcnow().date()
    for i, d in enumerate(dates):
        expected = today - timedelta(days=i)
        if d == expected:
            streak += 1
        else:
            break

    # Weekly: sessions per weekday (0=Mon, 6=Sun)
    weekly = [0] * 7
    for r in runs:
        # Monday=0 in Python weekday()
        wd = r.created_at.weekday()
        weekly[wd] += 1

    # Skills: average of non-zero scores
    def avg_field(field):
        vals = [getattr(r, field) for r in runs if getattr(r, field, 0) > 0]
        return round(sum(vals) / len(vals)) if vals else avg_score

    skills = {
        "empathy": avg_field("empathy_score"),
        "clarity": avg_field("clarity_score"),
        "emotional_control": avg_field("emotional_control_score"),
        "assertiveness": avg_field("assertiveness_score"),
    }

    # Achievements
    categories_tried = set(r.scenario_id for r in runs)
    from services.seed_service import SCENARIOS
    scenario_categories = {s["id"]: s["category"] for s in SCENARIOS}
    user_categories = set(scenario_categories.get(sid, "") for sid in categories_tried)

    achievements = []
    if total >= 1:
        achievements.append("first-sim")
    if any(r.empathy_score >= 90 or r.score >= 90 for r in runs):
        achievements.append("empathy-master")
    if streak >= 3:
        achievements.append("streak-3")
    if len(user_categories) >= 6:
        achievements.append("all-categories")
    if any(r.scenario_id in ("reply-rudeness",) and r.score >= 90 for r in runs):
        achievements.append("conflict-ace")
    if any(r.scenario_id == "wedding-toast" and r.score >= 85 for r in runs):
        achievements.append("public-star")

    return {
        "total_sessions": total,
        "avg_score": avg_score,
        "best_score": best_score,
        "streak_days": streak,
        "weekly_sessions": weekly,
        "skills": skills,
        "achievements": achievements,
    }

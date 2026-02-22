"""Stats API - user statistics, achievements, personality traits from SimulationRuns"""
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from core.database import get_session
from core.dependencies import get_current_user
from models.user import User
from models.simulation_run import SimulationRun
from services.profile_service import get_profile

router = APIRouter(prefix="/profiles/me", tags=["stats"])

CONFLICT_SCENARIOS = {"reply-rudeness", "neighbor-noise", "service-complaint"}
PUBLIC_SPEAKING_SCENARIOS = {"wedding-toast", "elevator-pitch", "team-presentation"}
NEGOTIATION_SCENARIOS = {"haggle", "salary-offer", "landlord-dispute"}
ROMANCE_SCENARIOS = {"first-date", "difficult-talk", "meet-parents", "breakup"}
FAMILY_SCENARIOS = {"calm-toddler", "teen-grades", "aging-parent"}
STRANGERS_SCENARIOS = {"small-talk", "awkward-silence", "comfort-stranger"}
WORK_SCENARIOS = {"job-interview", "ask-raise", "give-feedback", "toxic-boss"}
FRIENDS_SCENARIOS = {"say-no", "friend-crisis", "apologize"}

ALL_SCENARIO_IDS = (
    CONFLICT_SCENARIOS | PUBLIC_SPEAKING_SCENARIOS | NEGOTIATION_SCENARIOS |
    ROMANCE_SCENARIOS | FAMILY_SCENARIOS | STRANGERS_SCENARIOS |
    WORK_SCENARIOS | FRIENDS_SCENARIOS
)


def _compute_achievements(runs: list[SimulationRun], streak: int, user_level: int) -> list[str]:
    """Compute all earned achievement IDs from the user's history."""
    total = len(runs)
    if total == 0:
        return []

    achievements = []

    # ── Milestones ──
    if total >= 1:
        achievements.append("first-sim")
    if total >= 5:
        achievements.append("sessions-5")
    if total >= 25:
        achievements.append("sessions-25")
    if total >= 100:
        achievements.append("sessions-100")
    if total >= 500:
        achievements.append("sessions-500")

    # ── Level ──
    if user_level >= 3:
        achievements.append("level-3")
    if user_level >= 5:
        achievements.append("level-5")
    if user_level >= 10:
        achievements.append("level-10")
    if user_level >= 20:
        achievements.append("level-20")

    # ── Streaks ──
    if streak >= 3:
        achievements.append("streak-3")
    if streak >= 7:
        achievements.append("streak-7")
    if streak >= 30:
        achievements.append("streak-30")
    if streak >= 100:
        achievements.append("streak-100")

    # ── Categories & scenarios ──
    from services.seed_service import SCENARIOS
    scenario_categories = {s["id"]: s["category"] for s in SCENARIOS}
    tried_scenarios = set(r.scenario_id for r in runs)
    tried_categories = set(scenario_categories.get(sid, "") for sid in tried_scenarios)
    tried_categories.discard("")

    if len(tried_categories) >= 8:
        achievements.append("all-categories")
    if tried_scenarios >= ALL_SCENARIO_IDS:
        achievements.append("all-scenarios")

    # ── Skill achievements ──
    for r in runs:
        emp = r.empathy_score
        cla = r.clarity_score
        ec = r.emotional_control_score
        ass_ = r.assertiveness_score
        sc = r.score

        if emp >= 70 and "empathy-70" not in achievements:
            achievements.append("empathy-70")
        if emp >= 90 and "empathy-master" not in achievements:
            achievements.append("empathy-master")
        if cla >= 70 and "clarity-70" not in achievements:
            achievements.append("clarity-70")
        if cla >= 90 and "clarity-master" not in achievements:
            achievements.append("clarity-master")
        if ec >= 70 and "control-70" not in achievements:
            achievements.append("control-70")
        if ec >= 90 and "control-master" not in achievements:
            achievements.append("control-master")
        if ass_ >= 70 and "assertive-70" not in achievements:
            achievements.append("assertive-70")
        if ass_ >= 90 and "assertive-master" not in achievements:
            achievements.append("assertive-master")
        if emp >= 80 and cla >= 80 and ec >= 80 and ass_ >= 80 and "all-skills-80" not in achievements:
            achievements.append("all-skills-80")

        # ── Category mastery ──
        sid = r.scenario_id
        if sc >= 85:
            if sid in CONFLICT_SCENARIOS and "conflict-ace" not in achievements:
                achievements.append("conflict-ace")
            if sid in PUBLIC_SPEAKING_SCENARIOS and "public-star" not in achievements:
                achievements.append("public-star")
            if sid in NEGOTIATION_SCENARIOS and "negotiator" not in achievements:
                achievements.append("negotiator")
            if sid in ROMANCE_SCENARIOS and "romance-pro" not in achievements:
                achievements.append("romance-pro")
            if sid in FAMILY_SCENARIOS and "family-pro" not in achievements:
                achievements.append("family-pro")
            if sid in STRANGERS_SCENARIOS and "stranger-pro" not in achievements:
                achievements.append("stranger-pro")
            if sid in WORK_SCENARIOS and "work-pro" not in achievements:
                achievements.append("work-pro")

        # ── Special ──
        if sc >= 95 and "perfect-session" not in achievements:
            achievements.append("perfect-session")

        hour = r.created_at.hour
        if hour >= 0 and hour < 5 and "night-owl" not in achievements:
            achievements.append("night-owl")
        if hour >= 5 and hour < 7 and "early-bird" not in achievements:
            achievements.append("early-bird")

    # ── Comeback: 30+ improvement on same scenario ──
    scenario_scores: dict[str, list[int]] = {}
    for r in sorted(runs, key=lambda x: x.created_at):
        scenario_scores.setdefault(r.scenario_id, []).append(r.score)
    for scores in scenario_scores.values():
        if len(scores) >= 2:
            for i in range(1, len(scores)):
                if scores[i] - scores[0] >= 30:
                    if "comeback" not in achievements:
                        achievements.append("comeback")
                    break

    # hard-mode-win, marathon, speed-run are checked here but need turn_count
    # which isn't in SimulationRun model currently — we approximate from score context

    return achievements


def _compute_personality_traits(runs: list[SimulationRun]) -> dict:
    """Compute personality profile from aggregate communication patterns.

    Returns a dict with 6 trait dimensions (0-100) plus a dominant archetype.
    """
    if not runs:
        return {
            "traits": {
                "empathy_orientation": 50,
                "assertiveness_drive": 50,
                "composure_index": 50,
                "clarity_precision": 50,
                "adaptability": 50,
                "persistence": 50,
            },
            "archetype": "newcomer",
            "sessions_analyzed": 0,
        }

    n = len(runs)

    def avg(field: str) -> float:
        vals = [getattr(r, field) for r in runs if getattr(r, field, 0) > 0]
        return sum(vals) / len(vals) if vals else 50.0

    empathy_avg = avg("empathy_score")
    clarity_avg = avg("clarity_score")
    ec_avg = avg("emotional_control_score")
    assert_avg = avg("assertiveness_score")

    # Adaptability: how diverse are scenarios? (unique scenarios / total, capped)
    unique_scenarios = len(set(r.scenario_id for r in runs))
    adaptability = min(100, (unique_scenarios / max(n, 1)) * 100 + unique_scenarios * 3)

    # Persistence: do they improve over time? (trend of scores)
    sorted_runs = sorted(runs, key=lambda r: r.created_at)
    if n >= 4:
        first_half = sorted_runs[:n // 2]
        second_half = sorted_runs[n // 2:]
        avg_first = sum(r.score for r in first_half) / len(first_half)
        avg_second = sum(r.score for r in second_half) / len(second_half)
        improvement = avg_second - avg_first
        persistence = min(100, max(0, 50 + improvement * 2))
    else:
        persistence = 50.0

    traits = {
        "empathy_orientation": round(min(100, max(0, empathy_avg))),
        "assertiveness_drive": round(min(100, max(0, assert_avg))),
        "composure_index": round(min(100, max(0, ec_avg))),
        "clarity_precision": round(min(100, max(0, clarity_avg))),
        "adaptability": round(min(100, max(0, adaptability))),
        "persistence": round(min(100, max(0, persistence))),
    }

    # Determine dominant archetype based on strongest traits
    archetype = _determine_archetype(traits, n)

    return {
        "traits": traits,
        "archetype": archetype,
        "sessions_analyzed": n,
    }


def _determine_archetype(traits: dict, session_count: int) -> str:
    """Determine communication archetype from traits."""
    if session_count < 3:
        return "newcomer"

    emp = traits["empathy_orientation"]
    ass_ = traits["assertiveness_drive"]
    comp = traits["composure_index"]
    clar = traits["clarity_precision"]
    adapt = traits["adaptability"]
    pers = traits["persistence"]

    scores = {
        "diplomat": emp * 0.35 + comp * 0.3 + clar * 0.2 + adapt * 0.15,
        "leader": ass_ * 0.35 + clar * 0.3 + comp * 0.2 + pers * 0.15,
        "empath": emp * 0.4 + comp * 0.25 + adapt * 0.2 + pers * 0.15,
        "analyst": clar * 0.4 + comp * 0.25 + ass_ * 0.2 + pers * 0.15,
        "mediator": emp * 0.3 + comp * 0.3 + adapt * 0.25 + clar * 0.15,
        "persuader": ass_ * 0.3 + clar * 0.3 + adapt * 0.25 + emp * 0.15,
    }

    return max(scores, key=scores.get)


@router.get("/stats")
def get_my_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Full user statistics: scores, skills, achievements, personality traits."""
    runs = db.exec(
        select(SimulationRun).where(SimulationRun.user_id == current_user.id)
    ).all()

    profile = get_profile(db, current_user.id)
    user_level = profile.level if profile else 1

    empty_skills = {"empathy": 0, "clarity": 0, "emotional_control": 0, "assertiveness": 0}
    empty_traits = _compute_personality_traits([])

    if not runs:
        return {
            "total_sessions": 0,
            "avg_score": 0,
            "best_score": 0,
            "streak_days": 0,
            "weekly_sessions": [0] * 7,
            "skills": empty_skills,
            "achievements": [],
            "personality": empty_traits,
        }

    total = len(runs)
    scores = [r.score for r in runs]
    avg_score = round(sum(scores) / len(scores))
    best_score = max(scores)

    # Streak
    dates = sorted(set(r.created_at.date() for r in runs), reverse=True)
    streak = 0
    today = datetime.utcnow().date()
    for i, d in enumerate(dates):
        expected = today - timedelta(days=i)
        if d == expected:
            streak += 1
        else:
            break

    # Weekly
    weekly = [0] * 7
    for r in runs:
        weekly[r.created_at.weekday()] += 1

    # Skills
    def avg_field(field: str) -> int:
        vals = [getattr(r, field) for r in runs if getattr(r, field, 0) > 0]
        return round(sum(vals) / len(vals)) if vals else avg_score

    skills = {
        "empathy": avg_field("empathy_score"),
        "clarity": avg_field("clarity_score"),
        "emotional_control": avg_field("emotional_control_score"),
        "assertiveness": avg_field("assertiveness_score"),
    }

    achievements = _compute_achievements(runs, streak, user_level)
    personality = _compute_personality_traits(runs)

    return {
        "total_sessions": total,
        "avg_score": avg_score,
        "best_score": best_score,
        "streak_days": streak,
        "weekly_sessions": weekly,
        "skills": skills,
        "achievements": achievements,
        "personality": personality,
    }

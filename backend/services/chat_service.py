"""Chat service - LangChain + OpenRouter для симуляций (как в Epochal Dialog)"""
import logging
from typing import List, Dict, Any, Optional

from config import OPENROUTER_API_KEY
from services.langchain_service import LangChainService
from services.emotion_analyzer import get_emotion_analyzer
from services.personality_manager import format_emotion_history
from services.emotion_engine import smooth_emotion
from services.trainer_hints import get_turn_hint, get_formative_feedback
from prompts import SCENARIO_ROLES, DEFAULT_ROLE

logger = logging.getLogger(__name__)

# Singleton LangChain service
_langchain_service: LangChainService | None = None


def _get_langchain_service() -> LangChainService:
    global _langchain_service
    if _langchain_service is None:
        _langchain_service = LangChainService()
    return _langchain_service


async def get_ai_response(
    scenario_id: str,
    scenario_title: str,
    scenario_description: str,
    messages: List[Dict[str, str]],
    language: str = "ru",
    difficulty: str = "normal",
    personality: int = 50,
    user_goal: str = "Show empathy",
    ai_style: str = "realistic",
    focus_skill: str = "all",
    emotion_history: Optional[List[int]] = None,
    last_smoothed_emotion: Optional[float] = None,
    turn_index: int = 0,
) -> dict:
    """Get AI response. Returns dict with reply, emotion_after, empathy_delta, clarity, emotional_control, turn_quality."""
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "dummy-key":
        raise ValueError("OPENROUTER_API_KEY not configured")

    user_emotion_hint = ""
    for m in reversed(messages):
        if m.get("sender") == "user" and (t := m.get("text", "").strip()):
            try:
                analyzer = get_emotion_analyzer(backend="openrouter")
                result = await analyzer.analyze_async(t)
                user_emotion_hint = result.to_prompt_hint()
            except Exception as e:
                logger.warning("Emotion analysis skipped: %s", e)
            break

    character_emotion_history = format_emotion_history(emotion_history or [])

    role = SCENARIO_ROLES.get(scenario_id, DEFAULT_ROLE)
    svc = _get_langchain_service()
    result = await svc.generate_simulation_response(
        scenario_title=scenario_title,
        scenario_description=scenario_description,
        role_instruction=role,
        messages=messages,
        language=language,
        difficulty=difficulty,
        personality=personality,
        user_goal=user_goal,
        ai_style=ai_style,
        focus_skill=focus_skill,
        user_emotion_hint=user_emotion_hint,
        character_emotion_history=character_emotion_history,
    )
    raw_e = result.get("emotion_after", 50)
    result["smoothed_emotion_after"] = smooth_emotion(last_smoothed_emotion, raw_e)
    result["hint"] = get_turn_hint(focus_skill, turn_index, language or "ru")
    result["feedback"] = get_formative_feedback(
        result.get("empathy", 50),
        result.get("clarity", 50),
        result.get("emotional_control", 50),
        result.get("assertiveness", 50),
        focus_skill,
    )
    return result


async def analyze_feedback(
    scenario_title: str,
    messages: List[Dict[str, str]],
    score: int,
    language: str = "en",
    session_skills: Dict[str, float] | None = None,
) -> dict:
    """Analyze dialogue and return structured feedback anchored to session scores."""
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "dummy-key":
        raise ValueError("OPENROUTER_API_KEY not configured")
    svc = _get_langchain_service()
    return await svc.analyze_feedback(
        scenario_title=scenario_title,
        messages=messages,
        score=score,
        language=language,
        session_skills=session_skills,
    )

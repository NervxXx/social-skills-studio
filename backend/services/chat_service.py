"""Chat service - LangChain + OpenRouter для симуляций (как в Epochal Dialog)"""
import logging
from typing import List, Dict, Any

from config import OPENROUTER_API_KEY
from services.langchain_service import LangChainService
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
    language: str | None = None,
    difficulty: str = "normal",
    personality: int = 50,
    user_goal: str = "Show empathy",
) -> tuple[str, str, int, int]:
    """Get AI response. Returns (reply, thought, emotion_after, empathy_delta)."""
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "dummy-key":
        raise ValueError("OPENROUTER_API_KEY not configured")

    role = SCENARIO_ROLES.get(scenario_id, DEFAULT_ROLE)
    svc = _get_langchain_service()
    return await svc.generate_simulation_response(
        scenario_title=scenario_title,
        scenario_description=scenario_description,
        role_instruction=role,
        messages=messages,
        language=language,
        difficulty=difficulty,
        personality=personality,
        user_goal=user_goal,
    )


async def analyze_feedback(
    scenario_title: str,
    messages: List[Dict[str, str]],
    score: int,
    language: str = "en",
) -> dict:
    """Анализирует диалог и возвращает структурированный фидбек."""
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "dummy-key":
        raise ValueError("OPENROUTER_API_KEY not configured")
    svc = _get_langchain_service()
    return await svc.analyze_feedback(
        scenario_title=scenario_title,
        messages=messages,
        score=score,
        language=language,
    )

"""Chat API - AI responses for simulation"""
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from core.dependencies import get_optional_user
from models.user import User
from services.chat_service import get_ai_response, analyze_feedback
from config import OPENROUTER_API_KEY

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessage(BaseModel):
    sender: str
    text: str


class ChatRequest(BaseModel):
    scenario_id: str = "first-date"
    scenario_title: str = "Conversation"
    scenario_description: str = ""
    messages: List[ChatMessage] = []
    language: str | None = None
    difficulty: str = "normal"  # calm, normal, challenging
    personality: int = 50  # 0-100: calm / nervous / aggressive (AI character mood)
    user_goal: str = "Show empathy"


@router.post("/simulate")
async def chat_simulate(
    data: ChatRequest,
    current_user: User | None = Depends(get_optional_user),
):
    """Get AI response for simulation scenario (LangChain + OpenRouter)."""
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "dummy-key":
        raise HTTPException(
            status_code=503,
            detail="OpenRouter API not configured. Set OPENROUTER_API_KEY in .env",
        )

    messages_dict = [{"sender": m.sender, "text": m.text} for m in data.messages]

    try:
        reply, thought, emotion_after, empathy_delta = await get_ai_response(
            scenario_id=data.scenario_id,
            scenario_title=data.scenario_title,
            scenario_description=data.scenario_description,
            messages=messages_dict,
            language=data.language,
            difficulty=data.difficulty,
            personality=data.personality,
            user_goal=data.user_goal,
        )
        return {
            "reply": reply,
            "thought": thought,
            "emotion_after": emotion_after,
            "empathy_delta": empathy_delta,
        }
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


class FeedbackAnalyzeRequest(BaseModel):
    scenario_id: str = "first-date"
    scenario_title: str = "Conversation"
    messages: List[ChatMessage] = []
    score: int = 0
    language: str = "en"


@router.post("/analyze-feedback")
async def chat_analyze_feedback(
    data: FeedbackAnalyzeRequest,
    current_user: User | None = Depends(get_optional_user),
):
    """Analyze conversation and return structured feedback (skills, positives, negatives, tip)."""
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "dummy-key":
        raise HTTPException(
            status_code=503,
            detail="OpenRouter API not configured. Set OPENROUTER_API_KEY in .env",
        )
    messages_dict = [{"sender": m.sender, "text": m.text} for m in data.messages]
    try:
        result = await analyze_feedback(
            scenario_title=data.scenario_title,
            messages=messages_dict,
            score=data.score,
            language=data.language or "en",
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

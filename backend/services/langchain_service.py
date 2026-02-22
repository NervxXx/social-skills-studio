"""LangChain-сервис для симуляций (как в Epochal Dialog)"""
import json
import logging
import re
from typing import List, Dict, Any, Optional, Tuple

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage

from langchain_config import config
from prompts import build_simulation_system, SCENARIO_ROLES, DEFAULT_ROLE

logger = logging.getLogger(__name__)

# Full format: |E:65|A:3|CL:70|EC:80|Q:7|
FULL_RATING = re.compile(
    r"\|\s*E\s*:\s*(\d+)\s*\|\s*A\s*:\s*([+-]?\d+)\s*\|"
    r"\s*CL\s*:\s*(\d+)\s*\|\s*EC\s*:\s*(\d+)\s*\|\s*Q\s*:\s*(\d+)\s*\|",
    re.IGNORECASE,
)
# Legacy format: |E:65|A:3|
LEGACY_RATING = re.compile(r"\|\s*E\s*:\s*(\d+)\s*\|\s*A\s*:\s*([+-]?\d+)\s*\|", re.IGNORECASE)

META_STRIP = re.compile(
    r"\*{0,2}(?:thought|emotion_?score|empathy_?delta|emotion|internal|clarity|emotional.control|"
    r"analysis|technique|cognitive|evaluation|word.choice|tone|red.flag|mood)[:\s].*",
    re.IGNORECASE | re.DOTALL,
)


def _parse_response_with_rating(content: str) -> dict:
    """Parse reply and rating tags. Returns dict with reply, emotion_after, empathy_delta, clarity, emotional_control, turn_quality."""
    defaults = {"emotion_after": 60, "empathy_delta": 5, "clarity": 65, "emotional_control": 70, "turn_quality": 5}

    full = FULL_RATING.search(content)
    if full:
        reply = content[: full.start()].strip().rstrip("\n")
        return {
            "reply": reply,
            "emotion_after": min(100, max(0, int(full.group(1)))),
            "empathy_delta": max(-5, min(10, int(full.group(2)))),
            "clarity": min(100, max(0, int(full.group(3)))),
            "emotional_control": min(100, max(0, int(full.group(4)))),
            "turn_quality": min(10, max(1, int(full.group(5)))),
        }

    legacy = LEGACY_RATING.search(content)
    if legacy:
        reply = content[: legacy.start()].strip().rstrip("\n")
        return {
            "reply": reply,
            "emotion_after": min(100, max(0, int(legacy.group(1)))),
            "empathy_delta": max(-5, min(10, int(legacy.group(2)))),
            **{k: defaults[k] for k in ("clarity", "emotional_control", "turn_quality")},
        }

    reply = META_STRIP.sub("", content).strip().rstrip("\n")
    return {"reply": reply if reply else content.strip(), **defaults}


class LangChainService:
    """Сервис для работы с LLM через LangChain и OpenRouter."""

    def __init__(self):
        self.api_key = config.OPENROUTER_API_KEY
        if not self.api_key or self.api_key == "dummy-key":
            logger.warning("OPENROUTER_API_KEY не настроен")
        openrouter_config = config.get_openrouter_config()
        model_config = config.get_model_config()
        
        # Filter out custom parameters that ChatOpenAI doesn't accept directly
        llm_params = {
            "model": model_config["model"],
            "temperature": model_config["temperature"],
            "max_tokens": model_config["max_tokens"],
            "api_key": self.api_key,
            "base_url": openrouter_config["base_url"],
            "default_headers": openrouter_config["default_headers"],
            "streaming": False,
            "timeout": 60.0,
        }
        
        # Add extra_body for things like include_reasoning
        if "extra_body" in model_config:
            llm_params["extra_body"] = model_config["extra_body"]
            
        self.llm = ChatOpenAI(**llm_params)

    async def generate_simulation_response(
        self,
        scenario_title: str,
        scenario_description: str,
        role_instruction: str,
        messages: List[Dict[str, str]],
        language: str | None = None,
        difficulty: str = "normal",
        personality: int = 50,
        user_goal: str = "Show empathy",
        ai_style: str = "realistic",
        focus_skill: str = "all",
    ) -> dict:
        """Генерирует ответ AI. Возвращает dict с reply, emotion_after, empathy_delta, clarity, emotional_control, turn_quality."""
        lang_rule = (
            "You MUST respond ONLY in Russian. All your messages must be in Russian."
            if language == "ru"
            else "Respond in the same language as the user. If user writes in Russian, respond in Russian."
        )
        system = build_simulation_system(
            scenario_title=scenario_title,
            scenario_description=scenario_description,
            role_instruction=role_instruction,
            lang_rule=lang_rule,
            difficulty=difficulty,
            personality=personality,
            user_goal=user_goal,
            ai_style=ai_style,
            focus_skill=focus_skill,
            include_rating_suffix=True,
        )
        lc_messages: List[BaseMessage] = [SystemMessage(content=system)]
        for m in messages:
            text = m.get("text", "").strip()
            if not text:
                continue
            if m.get("sender") == "user":
                lc_messages.append(HumanMessage(content=text))
            else:
                lc_messages.append(AIMessage(content=text))

        try:
            response = await self.llm.ainvoke(lc_messages)
            content = (response.content or "").strip()
            return _parse_response_with_rating(content)
        except Exception as e:
            logger.error(f"LangChain/OpenRouter error: {e}")
            raise

    async def analyze_feedback(
        self,
        scenario_title: str,
        messages: List[Dict[str, str]],
        score: int,
        language: str,
    ) -> Dict[str, Any]:
        """Анализирует диалог и возвращает структурированный фидбек (skills, positives, negatives, tip)."""
        lang_instruction = "Respond ONLY in Russian. All output must be in Russian." if language == "ru" else "Respond in English."
        from prompts import FEEDBACK_ANALYSIS_TEMPLATE
        system_feedback = FEEDBACK_ANALYSIS_TEMPLATE.format(
            scenario_title=scenario_title,
            score=score,
            lang_instruction=lang_instruction,
        )
        conv_text = "\n".join(
            f"{'User' if m.get('sender') == 'user' else 'AI'}: {m.get('text', '')}"
            for m in messages
        )
        openrouter_config = config.get_openrouter_config()
        model_config = config.get_model_config()
        llm_analysis = ChatOpenAI(
            model=model_config["model"],
            temperature=0.3,
            max_tokens=600,
            api_key=self.api_key,
            base_url=openrouter_config["base_url"],
            default_headers=openrouter_config["default_headers"],
            streaming=False,
            timeout=45.0,
        )
        try:
            resp = await llm_analysis.ainvoke([
                SystemMessage(content=system_feedback),
                HumanMessage(content=f"Conversation:\n{conv_text}"),
            ])
            text = (resp.content or "").strip()
            # Remove markdown code blocks if present
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            data = json.loads(text)
            return {
                "skills": data.get("skills", {}),
                "positives": data.get("positives", []),
                "negatives": data.get("negatives", []),
                "tip": data.get("tip", ""),
            }
        except Exception as e:
            logger.warning(f"Feedback analysis failed: {e}")
            raise

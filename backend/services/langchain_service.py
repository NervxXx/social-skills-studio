"""LangChain-сервис для симуляций (как в Epochal Dialog)"""
import json
import logging
import re
from typing import List, Dict, Any, Optional, Tuple

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool

from langchain_config import config
from prompts import build_simulation_system, SCENARIO_ROLES, DEFAULT_ROLE

logger = logging.getLogger(__name__)

@tool(return_direct=True)
def submit_response(reply: str, thought: str, emotion_score: int, empathy_delta: int):
    """
    Submits the final response to the user along with internal thoughts and scores.
    Args:
        reply: Your response text (1-3 sentences).
        thought: Your character's internal monologue or hidden feelings.
        emotion_score: Your character's internal mood after this turn (0-100).
        empathy_delta: How well the user communicated in this turn (-5 to 10).
    """
    return {"reply": reply, "thought": thought, "emotion_after": emotion_score, "empathy_delta": empathy_delta}

RATING_PATTERN = re.compile(r"\|\s*E\s*:\s*(\d+)\s*\|\s*A\s*:\s*(-?\d+)\s*\|", re.IGNORECASE)
RATING_PATTERN_ALT = re.compile(r"\|E:(\d+)\|A:(-?\d+)\|", re.IGNORECASE)


def _parse_response_with_rating(content: str) -> Tuple[str, int, int]:
    """Извлекает reply и |E:xx|A:yy| из ответа. Возвращает (reply, emotion_after, empathy_delta)."""
    match = RATING_PATTERN.search(content) or RATING_PATTERN_ALT.search(content)
    if match:
        emotion = int(match.group(1))
        empathy_delta = int(match.group(2))
        reply = content[: match.start()].strip()
        reply = re.sub(r"\n+$", "", reply)
        return reply, min(100, max(0, emotion)), max(-5, min(10, empathy_delta))
    reply = content.strip()
    return reply, 60, 5  # defaults if parsing fails


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
        self.tools = [submit_response]

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
    ) -> Tuple[str, str, int, int]:
        """Генерирует ответ AI. Возвращает (reply, emotion_after, empathy_delta)."""
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
            include_rating_suffix=False, # We use the tool for ratings now
        )
        
        # Create an agent prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", system + "\n\nYou are an autonomous agent. Use your tools to provide the final response and scores. "
                       "You MUST use the 'submit_response' tool to finish the turn."),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
        
        # Build the agent
        agent = create_tool_calling_agent(self.llm, self.tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=self.tools, verbose=True)

        # Convert messages to chat history, excluding the last user message which goes into {input}
        history: List[BaseMessage] = []
        user_input = "Hello" # Fallback
        
        if messages:
            last_msg = messages[-1]
            if last_msg.get("sender") == "user":
                user_input = last_msg.get("text", "")
                messages_for_history = messages[:-1]
            else:
                messages_for_history = messages
            
            for m in messages_for_history:
                text = m.get("text", "").strip()
                if not text: continue
                if m.get("sender") == "user":
                    history.append(HumanMessage(content=text))
                else:
                    history.append(AIMessage(content=text))

        try:
            result = await agent_executor.ainvoke({
                "input": user_input,
                "chat_history": history
            })
            
            output = result.get("output", "")
            
            # If return_direct=True worked, output is the dict from submit_response
            if isinstance(output, dict) and "reply" in output:
                return (
                    output.get("reply", ""),
                    output.get("thought", ""),
                    output.get("emotion_after", 60),
                    output.get("empathy_delta", 5)
                )
            
            # Fallback: if it's a string, maybe it has the E:nn|A:nn format
            if isinstance(output, str):
                if "|" in output:
                    reply, e, a = _parse_response_with_rating(output)
                    return reply, "", e, a
                return output, "", 60, 5
            
            # Fallback: check intermediate steps if return_direct failed for some reason
            for step in result.get("intermediate_steps", []):
                action, observation = step
                if action.tool == "submit_response" and isinstance(observation, dict):
                    return (
                        observation.get("reply", ""),
                        observation.get("thought", ""),
                        observation.get("emotion_after", 60),
                        observation.get("empathy_delta", 5)
                    )
                
            return str(output), "", 60, 5
            
        except Exception as e:
            logger.error(f"Agent execution error: {e}")
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

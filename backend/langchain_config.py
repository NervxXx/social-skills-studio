"""Конфигурация LangChain для OpenRouter (как в Epochal Dialog)"""
import os
from dotenv import load_dotenv

load_dotenv()


class LangChainConfig:
    """Класс конфигурации LangChain и OpenRouter"""

    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "dummy-key")

    def get_openrouter_config(self) -> dict:
        """Конфигурация для OpenRouter API"""
        return {
            "base_url": "https://openrouter.ai/api/v1",
            "default_headers": {
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "AiTrening SocialSim",
            },
        }

    def get_model_config(self) -> dict:
        """Конфигурация модели (модель, temperature, max_tokens)"""
        model = os.getenv("OPENROUTER_MODEL", "google/gemini-flash-1.5")
        config = {
            "model": model,
            "temperature": 0.85,  # Slightly higher for more natural variety
            "max_tokens": 600, # Increased for reasoning
        }
        
        # Enable reasoning for aurora-alpha if detected
        if "aurora-alpha" in model:
            config["extra_body"] = {"include_reasoning": True}
            
        return config


config = LangChainConfig()

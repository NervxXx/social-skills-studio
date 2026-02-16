"""Конфигурация приложения SocialSim Backend"""
import os
from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

if not SECRET_KEY:
    raise ValueError(
        "SECRET_KEY не установлен. Добавьте в .env:\n"
        "  SECRET_KEY=<сгенерированное_значение>\n"
        "  python -c 'import secrets; print(secrets.token_urlsafe(64))'"
    )
if len(SECRET_KEY) < 32:
    raise ValueError("SECRET_KEY должен быть минимум 32 символа")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL не установлена. Добавьте в .env:\n"
        "  DATABASE_URL=postgresql://user:password@localhost:5432/socialsim"
    )

if ENVIRONMENT == "production":
    raw_origins = os.getenv("ALLOWED_ORIGINS", "")
    ALLOWED_ORIGINS = [o.strip() for o in raw_origins.split(",") if o.strip()]
    if not ALLOWED_ORIGINS:
        raise ValueError("ALLOWED_ORIGINS обязательна в production")
else:
    raw = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://localhost:8080,http://127.0.0.1:5173,http://127.0.0.1:8080"
    )
    ALLOWED_ORIGINS = [o.strip() for o in raw.split(",") if o.strip()]

DEBUG = os.getenv("DEBUG", "true").lower() == "true"
PORT = int(os.getenv("PORT", "8000"))

# OpenRouter
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-flash-1.5")

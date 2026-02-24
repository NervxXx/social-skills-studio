"""
SocialSim Backend - AI-Powered Communication Skills Simulator
"""
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv

backend_dir = Path(__file__).parent
env_path = backend_dir / ".env"
if env_path.exists():
    load_dotenv(env_path)
else:
    load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ALLOWED_ORIGINS, ENVIRONMENT
from core.database import create_db_and_tables, engine
from core.security import check_secret_key
from api.auth import router as auth_router
from api.chat import router as chat_router
from api.profiles import router as profiles_router
from api.stats import router as stats_router
from api.scenarios import router as scenarios_router
from api.simulations import router as simulations_router
from services.seed_service import seed_all


@asynccontextmanager
async def lifespan(app: FastAPI):
    import logging
    logger = logging.getLogger(__name__)
    try:
        check_secret_key()
    except ValueError as e:
        logger.warning("SECRET_KEY: %s", e)
    try:
        create_db_and_tables()
        from sqlmodel import Session
        with Session(engine) as db:
            seed_all(db)
    except Exception as e:
        logger.warning(
            "Database unavailable at startup (chat/simulate will work without DB): %s",
            e,
        )
    yield


app = FastAPI(
    title="SocialSim API",
    description="Backend for AI-Powered Communication Skills Simulator",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|172\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+):(\d+)" if ENVIRONMENT != "production" else None,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(profiles_router)
app.include_router(stats_router)
app.include_router(scenarios_router)
app.include_router(simulations_router)


@app.get("/")
def root():
    return {"message": "SocialSim API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

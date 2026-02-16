"""Database setup for SocialSim"""
from sqlmodel import Session, SQLModel, create_engine
from typing import Generator
import os

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL не установлена")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    echo=False,
)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    from models.user import User
    from models.profile import Profile
    from models.category import Category
    from models.scenario import Scenario
    from models.simulation_run import SimulationRun

    SQLModel.metadata.create_all(engine)

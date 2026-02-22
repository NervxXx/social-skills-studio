"""Scenarios API - categories and scenarios"""
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from core.database import get_session
from models.category import Category, CategoryResponse
from models.scenario import Scenario, ScenarioResponse

router = APIRouter(prefix="/scenarios", tags=["scenarios"])


@router.get("/categories", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_session)):
    """Список категорий"""
    cats = db.exec(select(Category)).all()
    return [
        CategoryResponse(id=c.external_id, name=c.name, emoji=c.emoji)
        for c in cats
    ]


@router.get("", response_model=list[ScenarioResponse])
def list_scenarios(
    category: str | None = None,
    difficulty: str | None = None,
    db: Session = Depends(get_session),
):
    """Список сценариев с опциональной фильтрацией"""
    stmt = select(Scenario)
    if category:
        stmt = stmt.where(Scenario.category_id == category)
    if difficulty:
        stmt = stmt.where(Scenario.difficulty == difficulty)
    scenarios = db.exec(stmt.order_by(Scenario.external_id)).all()
    return [
        ScenarioResponse(
            id=s.external_id,
            title=s.title,
            emoji=s.emoji,
            category=s.category_id,
            difficulty=s.difficulty,
            duration=s.duration,
            description=s.description,
            required_level=s.required_level,
        )
        for s in scenarios
    ]


@router.get("/{scenario_id}", response_model=ScenarioResponse)
def get_scenario(scenario_id: str, db: Session = Depends(get_session)):
    """Один сценарий по id"""
    stmt = select(Scenario).where(Scenario.external_id == scenario_id)
    s = db.exec(stmt).first()
    if not s:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Scenario not found")
    return ScenarioResponse(
        id=s.external_id,
        title=s.title,
        emoji=s.emoji,
        category=s.category_id,
        difficulty=s.difficulty,
        duration=s.duration,
        description=s.description,
        required_level=s.required_level,
    )

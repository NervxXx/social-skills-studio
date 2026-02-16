"""Seed categories and scenarios from frontend data"""
from sqlmodel import Session, select

from models.category import Category
from models.scenario import Scenario

# Mirrors frontend/src/lib/data.ts
CATEGORIES = [
    {"id": "romance", "name": "Romance", "emoji": "💕"},
    {"id": "work", "name": "Work", "emoji": "💼"},
    {"id": "family", "name": "Family", "emoji": "👨‍👩‍👧"},
    {"id": "friends", "name": "Friends", "emoji": "🤝"},
    {"id": "conflict", "name": "Conflict", "emoji": "⚡"},
    {"id": "public-speaking", "name": "Public Speaking", "emoji": "🎤"},
]

SCENARIOS = [
    {"id": "first-date", "title": "First date jitters", "emoji": "💕", "category": "romance", "difficulty": "easy", "duration": 5, "description": "You're meeting someone for the first time at a café. Keep the conversation flowing naturally and make a genuine connection."},
    {"id": "ask-raise", "title": "Ask for a raise", "emoji": "💼", "category": "work", "difficulty": "medium", "duration": 8, "description": "You've been excelling at your job for a year. It's time to have that conversation with your manager about a salary increase."},
    {"id": "calm-toddler", "title": "Calm crying toddler", "emoji": "👶", "category": "family", "difficulty": "medium", "duration": 7, "description": "Your 3-year-old is having a meltdown in the grocery store. Use empathy and patience to de-escalate the situation."},
    {"id": "say-no", "title": "Say no to a friend", "emoji": "🤝", "category": "friends", "difficulty": "easy", "duration": 4, "description": "Your friend keeps asking you for favors that drain your energy. Practice setting healthy boundaries with kindness."},
    {"id": "reply-rudeness", "title": "Reply to rudeness", "emoji": "⚡", "category": "conflict", "difficulty": "hard", "duration": 6, "description": "A coworker just made a snarky comment in front of the whole team. Respond assertively without escalating the conflict."},
    {"id": "wedding-toast", "title": "Wedding toast", "emoji": "🥂", "category": "public-speaking", "difficulty": "hard", "duration": 5, "description": "You're the best man/maid of honor. Deliver a heartfelt, funny, and memorable wedding toast to the happy couple."},
]


def seed_categories(db: Session) -> int:
    count = 0
    for c in CATEGORIES:
        stmt = select(Category).where(Category.external_id == c["id"])
        if db.exec(stmt).first():
            continue
        cat = Category(external_id=c["id"], name=c["name"], emoji=c["emoji"])
        db.add(cat)
        count += 1
    db.commit()
    return count


def seed_scenarios(db: Session) -> int:
    count = 0
    for s in SCENARIOS:
        stmt = select(Scenario).where(Scenario.external_id == s["id"])
        if db.exec(stmt).first():
            continue
        scenario = Scenario(
            external_id=s["id"],
            title=s["title"],
            emoji=s["emoji"],
            category_id=s["category"],
            difficulty=s["difficulty"],
            duration=s["duration"],
            description=s["description"],
        )
        db.add(scenario)
        count += 1
    db.commit()
    return count


def seed_all(db: Session) -> dict:
    cat_count = seed_categories(db)
    scenario_count = seed_scenarios(db)
    return {"categories_added": cat_count, "scenarios_added": scenario_count}

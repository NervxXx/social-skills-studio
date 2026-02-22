"""Seed categories and scenarios from frontend data"""
from sqlmodel import Session, select

from models.category import Category
from models.scenario import Scenario

CATEGORIES = [
    {"id": "romance", "name": "Romance", "emoji": "💕"},
    {"id": "work", "name": "Work", "emoji": "💼"},
    {"id": "family", "name": "Family", "emoji": "👨‍👩‍👧"},
    {"id": "friends", "name": "Friends", "emoji": "🤝"},
    {"id": "conflict", "name": "Conflict", "emoji": "⚡"},
    {"id": "public-speaking", "name": "Public Speaking", "emoji": "🎤"},
    {"id": "strangers", "name": "Strangers", "emoji": "🫂"},
    {"id": "negotiations", "name": "Negotiations", "emoji": "🎯"},
]

SCENARIOS = [
    # Romance
    {"id": "first-date", "title": "First date jitters", "emoji": "💕", "category": "romance", "difficulty": "easy", "duration": 5, "required_level": 1, "description": "You're meeting someone for the first time at a café. Keep the conversation flowing naturally and make a genuine connection."},
    {"id": "difficult-talk", "title": "Difficult conversation", "emoji": "💔", "category": "romance", "difficulty": "medium", "duration": 8, "required_level": 3, "description": "Something has been bothering you in the relationship. Have an honest, caring conversation without turning it into a fight."},
    {"id": "meet-parents", "title": "Meet the parents", "emoji": "👨‍👩‍👦", "category": "romance", "difficulty": "hard", "duration": 10, "required_level": 5, "description": "You're meeting your partner's parents for the first time at dinner. Navigate tricky questions and make a good impression."},
    {"id": "breakup", "title": "Compassionate breakup", "emoji": "🥀", "category": "romance", "difficulty": "hard", "duration": 10, "required_level": 8, "description": "The relationship isn't working. End it with honesty and compassion, without causing unnecessary hurt."},

    # Work
    {"id": "job-interview", "title": "Job interview", "emoji": "🎯", "category": "work", "difficulty": "easy", "duration": 8, "required_level": 1, "description": "You're in a job interview. Answer tough questions confidently and show your strengths without bragging."},
    {"id": "ask-raise", "title": "Ask for a raise", "emoji": "💼", "category": "work", "difficulty": "medium", "duration": 8, "required_level": 1, "description": "You've been excelling at your job for a year. It's time to have that conversation with your manager about a salary increase."},
    {"id": "give-feedback", "title": "Give feedback", "emoji": "📋", "category": "work", "difficulty": "medium", "duration": 7, "required_level": 3, "description": "A colleague's work quality has dropped. Give constructive, specific feedback that motivates rather than demoralizes."},
    {"id": "toxic-boss", "title": "Toxic boss", "emoji": "😤", "category": "work", "difficulty": "hard", "duration": 10, "required_level": 7, "description": "Your boss is being unreasonable and micromanaging. Stand up for yourself professionally without burning bridges."},

    # Family
    {"id": "calm-toddler", "title": "Calm crying toddler", "emoji": "👶", "category": "family", "difficulty": "medium", "duration": 7, "required_level": 1, "description": "Your 3-year-old is having a meltdown in the grocery store. Use empathy and patience to de-escalate the situation."},
    {"id": "teen-grades", "title": "Teen's grades", "emoji": "📚", "category": "family", "difficulty": "medium", "duration": 8, "required_level": 3, "description": "Your teenager's grades have been dropping. Talk to them without lecturing — understand what's going on and find a solution together."},
    {"id": "aging-parent", "title": "Aging parent", "emoji": "🧓", "category": "family", "difficulty": "hard", "duration": 10, "required_level": 6, "description": "Your elderly parent is struggling to live alone but refuses help. Gently convince them while respecting their independence."},

    # Friends
    {"id": "say-no", "title": "Say no to a friend", "emoji": "🤝", "category": "friends", "difficulty": "easy", "duration": 4, "required_level": 1, "description": "Your friend keeps asking you for favors that drain your energy. Practice setting healthy boundaries with kindness."},
    {"id": "friend-crisis", "title": "Friend in crisis", "emoji": "💙", "category": "friends", "difficulty": "medium", "duration": 8, "required_level": 3, "description": "Your close friend is going through a tough time and is barely holding it together. Be there for them without giving unsolicited advice."},
    {"id": "apologize", "title": "Sincere apology", "emoji": "🙏", "category": "friends", "difficulty": "medium", "duration": 7, "required_level": 5, "description": "You said something hurtful to a friend and need to apologize. Make it genuine — no excuses, no deflecting."},

    # Conflict
    {"id": "neighbor-noise", "title": "Noisy neighbor", "emoji": "🔊", "category": "conflict", "difficulty": "easy", "duration": 5, "required_level": 1, "description": "Your neighbor's loud music keeps you awake. Ask them to quiet down without starting a feud."},
    {"id": "reply-rudeness", "title": "Reply to rudeness", "emoji": "⚡", "category": "conflict", "difficulty": "hard", "duration": 6, "required_level": 1, "description": "A coworker just made a snarky comment in front of the whole team. Respond assertively without escalating the conflict."},
    {"id": "service-complaint", "title": "Bad service", "emoji": "🍽️", "category": "conflict", "difficulty": "medium", "duration": 6, "required_level": 4, "description": "You received terrible service at a restaurant. Complain effectively to get a resolution, without being rude to the staff."},

    # Public Speaking
    {"id": "elevator-pitch", "title": "Elevator pitch", "emoji": "🚀", "category": "public-speaking", "difficulty": "easy", "duration": 4, "required_level": 2, "description": "You're in an elevator with a potential investor. Pitch your startup idea in 60 seconds — clear, exciting, memorable."},
    {"id": "wedding-toast", "title": "Wedding toast", "emoji": "🥂", "category": "public-speaking", "difficulty": "hard", "duration": 5, "required_level": 1, "description": "You're the best man/maid of honor. Deliver a heartfelt, funny, and memorable wedding toast to the happy couple."},
    {"id": "team-presentation", "title": "Team presentation", "emoji": "📊", "category": "public-speaking", "difficulty": "medium", "duration": 8, "required_level": 4, "description": "Present your project results to the team and stakeholders. Keep it clear, engaging, and handle tough questions."},

    # Strangers
    {"id": "small-talk", "title": "Networking event", "emoji": "🗣️", "category": "strangers", "difficulty": "easy", "duration": 5, "required_level": 2, "description": "You're at a networking event and don't know anyone. Start a conversation with a stranger and keep it going naturally."},
    {"id": "awkward-silence", "title": "Awkward silence", "emoji": "😶", "category": "strangers", "difficulty": "medium", "duration": 6, "required_level": 4, "description": "You're stuck in an elevator with an acquaintance and the conversation died. Revive it without making it more awkward."},
    {"id": "comfort-stranger", "title": "Comfort a stranger", "emoji": "🤗", "category": "strangers", "difficulty": "hard", "duration": 7, "required_level": 7, "description": "A stranger on public transit is visibly upset, quietly crying. Approach with care — offer support without overstepping."},

    # Negotiations
    {"id": "haggle", "title": "Haggle a deal", "emoji": "💰", "category": "negotiations", "difficulty": "easy", "duration": 5, "required_level": 2, "description": "You found a great item at a flea market. Negotiate a fair price — be friendly but don't overpay."},
    {"id": "salary-offer", "title": "Salary negotiation", "emoji": "📈", "category": "negotiations", "difficulty": "medium", "duration": 8, "required_level": 5, "description": "You got a job offer but the salary is below your expectations. Negotiate higher without losing the offer."},
    {"id": "landlord-dispute", "title": "Landlord dispute", "emoji": "🏠", "category": "negotiations", "difficulty": "hard", "duration": 8, "required_level": 7, "description": "Your landlord added unfair charges to your bill. Dispute them calmly but firmly, knowing your rights."},
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
        existing = db.exec(stmt).first()
        if existing:
            existing.required_level = s.get("required_level", 1)
            existing.difficulty = s["difficulty"]
            existing.duration = s["duration"]
            existing.description = s["description"]
            existing.title = s["title"]
            existing.emoji = s["emoji"]
            db.add(existing)
            continue
        scenario = Scenario(
            external_id=s["id"],
            title=s["title"],
            emoji=s["emoji"],
            category_id=s["category"],
            difficulty=s["difficulty"],
            duration=s["duration"],
            description=s["description"],
            required_level=s.get("required_level", 1),
        )
        db.add(scenario)
        count += 1
    db.commit()
    return count


def seed_all(db: Session) -> dict:
    cat_count = seed_categories(db)
    scenario_count = seed_scenarios(db)
    return {"categories_added": cat_count, "scenarios_added": scenario_count}

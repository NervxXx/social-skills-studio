"""Profile service - ensure profile exists, update"""
from sqlmodel import Session, select

from models.profile import Profile


def ensure_profile(db: Session, user_id: int) -> Profile:
    """Создать профиль, если его нет"""
    stmt = select(Profile).where(Profile.user_id == user_id)
    profile = db.exec(stmt).first()
    if profile:
        return profile
    profile = Profile(user_id=user_id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def get_profile(db: Session, user_id: int) -> Profile | None:
    stmt = select(Profile).where(Profile.user_id == user_id)
    return db.exec(stmt).first()


def add_xp(db: Session, user_id: int, xp: int) -> Profile:
    profile = ensure_profile(db, user_id)
    profile.xp += xp
    # Level up every 100 XP
    while profile.xp >= profile.level * 100:
        profile.xp -= profile.level * 100
        profile.level += 1
    from datetime import datetime
    profile.updated_at = datetime.utcnow()
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

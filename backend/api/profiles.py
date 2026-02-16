"""Profile API - get/update profile"""
from fastapi import APIRouter, Depends

from sqlmodel import Session
from core.database import get_session
from core.dependencies import get_current_user
from models.user import User
from models.profile import ProfileUpdate, ProfileResponse
from services.profile_service import ensure_profile, get_profile

router = APIRouter(prefix="/profiles", tags=["profiles"])


def _profile_to_response(p) -> ProfileResponse:
    return ProfileResponse(
        id=p.id,
        user_id=p.user_id,
        avatar_url=p.avatar_url,
        display_name=p.display_name,
        level=p.level,
        xp=p.xp,
        voice_input_enabled=p.voice_input_enabled,
        hint_frequency=p.hint_frequency,
    )


@router.get("/me", response_model=ProfileResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    profile = ensure_profile(db, current_user.id)
    return _profile_to_response(profile)


@router.put("/me", response_model=ProfileResponse)
def update_my_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    profile = ensure_profile(db, current_user.id)
    if data.display_name is not None:
        profile.display_name = data.display_name
    if data.avatar_url is not None:
        profile.avatar_url = data.avatar_url
    if data.voice_input_enabled is not None:
        profile.voice_input_enabled = data.voice_input_enabled
    if data.hint_frequency is not None:
        profile.hint_frequency = data.hint_frequency
    from datetime import datetime
    profile.updated_at = datetime.utcnow()
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return _profile_to_response(profile)

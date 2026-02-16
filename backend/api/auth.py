"""Auth API - register, login, guest, logout"""
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse, Response
from sqlmodel import Session

from core.database import get_session
from core.auth import (
    authenticate_user,
    create_user,
    create_access_token,
    get_user_by_email,
)
from core.dependencies import get_current_user
from config import ACCESS_TOKEN_EXPIRE_MINUTES
from models.user import UserCreate, UserResponse, Token, User

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_token_cookie(response: JSONResponse, access_token: str, max_age: int):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=max_age,
    )


def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        is_guest=user.is_guest,
        created_at=user.created_at,
    )


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_session)):
    """Регистрация нового пользователя"""
    user = create_user(
        db,
        email=data.email,
        password=data.password,
        full_name=data.full_name,
    )
    from services.profile_service import ensure_profile
    ensure_profile(db, user.id)

    expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id},
        expires_delta=expires,
    )
    token_data = Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=_user_to_response(user),
    )
    response = JSONResponse(content=token_data.model_dump(mode="json"), status_code=201)
    _set_token_cookie(response, access_token, ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    return response


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_session),
):
    """Вход по email (username в форме = email)"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id},
        expires_delta=expires,
    )
    token_data = Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=_user_to_response(user),
    )
    response = JSONResponse(content=token_data.model_dump(mode="json"))
    _set_token_cookie(response, access_token, ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    return response


@router.post("/guest", response_model=Token, status_code=status.HTTP_201_CREATED)
def create_guest(db: Session = Depends(get_session)):
    """Создать гостевой аккаунт (Continue as Guest)"""
    import uuid
    guest_id = uuid.uuid4().hex[:8]
    email = f"guest_{guest_id}@socialsim.guest"
    if get_user_by_email(db, email):
        return create_guest(db)

    # Пароль для гостя — не показывается пользователю, должен пройти валидацию
    password = f"Guest1{guest_id}Aa"
    user = create_user(
        db,
        email=email,
        password=password,
        full_name=f"Guest_{guest_id}",
    )
    user.is_guest = True
    db.add(user)
    db.commit()
    db.refresh(user)

    from services.profile_service import ensure_profile
    ensure_profile(db, user.id)

    max_age = ACCESS_TOKEN_EXPIRE_MINUTES * 60 * 24  # 24h for guest
    expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES * 24)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id},
        expires_delta=expires,
    )
    token_data = Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=max_age,
        user=_user_to_response(user),
    )
    response = JSONResponse(content=token_data.model_dump(mode="json"), status_code=201)
    _set_token_cookie(response, access_token, max_age)
    return response


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    """Текущий пользователь"""
    return _user_to_response(current_user)


@router.post("/logout")
def logout():
    """Выход"""
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("access_token")
    return response


@router.get("/verify-token")
def verify_token(current_user: User = Depends(get_current_user)):
    """Проверка валидности токена при загрузке приложения"""
    return {"valid": True, "user": _user_to_response(current_user)}

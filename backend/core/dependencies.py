"""FastAPI dependencies for SocialSim"""
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session

from core.database import get_session
from core.auth import verify_token, get_user_by_id
from models.user import User

security = HTTPBearer(auto_error=False)


def _get_token(request: Request, credentials: HTTPAuthorizationCredentials | None) -> str | None:
    if credentials and credentials.credentials:
        return credentials.credentials
    return request.cookies.get("access_token")


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_session),
) -> User:
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = _get_token(request, credentials)
    if not token:
        raise exc
    token_data = verify_token(token, exc)
    user = get_user_by_id(db, token_data.user_id)
    if user is None or not user.is_active:
        raise exc
    return user


def get_optional_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_session),
) -> User | None:
    try:
        exc = HTTPException(status_code=401, detail="Invalid credentials")
        token = _get_token(request, credentials)
        if not token:
            return None
        token_data = verify_token(token, exc)
        user = get_user_by_id(db, token_data.user_id)
        if user is None or not user.is_active:
            return None
        return user
    except HTTPException:
        return None

"""Authentication utilities for SocialSim"""
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from sqlmodel import Session, select

from config import SECRET_KEY
from core.security import validate_password_strength
from models.user import User, TokenData

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        if username is None or user_id is None:
            raise credentials_exception
        return TokenData(username=username, user_id=user_id)
    except JWTError:
        raise credentials_exception


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    stmt = select(User).where(User.email == email)
    return db.exec(stmt).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    stmt = select(User).where(User.username == username)
    return db.exec(stmt).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.get(User, user_id)


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def create_user(db: Session, email: str, password: str, full_name: Optional[str] = None) -> User:
    is_valid, err = validate_password_strength(password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=err)
    if get_user_by_email(db, email):
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")

    base_username = (email.split("@")[0] or "user")[:30].lower()
    import re
    base_username = re.sub(r"[^a-z0-9._-]", "", base_username) or "user"
    username = base_username
    suffix = 1
    while get_user_by_username(db, username):
        username = f"{base_username[:25]}{suffix}"
        suffix += 1

    user = User(
        username=username,
        email=email,
        full_name=full_name or username,
        hashed_password=get_password_hash(password),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

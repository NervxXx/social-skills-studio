"""Security utilities for SocialSim backend"""
import os
import re
import secrets
from typing import Optional, Tuple

# Password validation
MIN_PASSWORD_LENGTH = 6
MAX_PASSWORD_LENGTH = 128
UPPERCASE_PATTERN = re.compile(r'[A-Z]')
LOWERCASE_PATTERN = re.compile(r'[a-z]')
DIGIT_PATTERN = re.compile(r'\d')


def validate_password_strength(password: str) -> Tuple[bool, Optional[str]]:
    if len(password) < MIN_PASSWORD_LENGTH:
        return False, f"Пароль минимум {MIN_PASSWORD_LENGTH} символов"
    if len(password) > MAX_PASSWORD_LENGTH:
        return False, f"Пароль не более {MAX_PASSWORD_LENGTH} символов"
    if not UPPERCASE_PATTERN.search(password):
        return False, "Нужна хотя бы одна заглавная буква"
    if not LOWERCASE_PATTERN.search(password):
        return False, "Нужна хотя бы одна строчная буква"
    if not DIGIT_PATTERN.search(password):
        return False, "Нужна хотя бы одна цифра"
    return True, None


def check_secret_key() -> None:
    sk = os.getenv("SECRET_KEY")
    if not sk or len(sk) < 32:
        raise ValueError("SECRET_KEY должен быть минимум 32 символа")


def sanitize_filename(filename: str) -> str:
    filename = filename.replace('/', '_').replace('\\', '_').replace('..', '_')
    for c in ['<', '>', ':', '"', '|', '?', '*', '\x00']:
        filename = filename.replace(c, '_')
    return filename[:255]

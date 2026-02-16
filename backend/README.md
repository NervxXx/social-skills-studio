# SocialSim Backend

FastAPI бэкенд для SocialSim — симулятора навыков общения.

## Быстрый старт

### 1. PostgreSQL

```bash
# Из корня проекта
docker compose up -d db
```

Или установите PostgreSQL локально и создайте БД `socialsim`.

### 2. Переменные окружения

```bash
cd backend
cp env.example .env
# Отредактируйте .env — задайте SECRET_KEY и DATABASE_URL
```

Пример `.env`:
```
SECRET_KEY=<сгенерируйте: python -c "import secrets; print(secrets.token_urlsafe(64))">
DATABASE_URL=postgresql://socialsim:socialsim@localhost:5432/socialsim
```

### 3. Запуск

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Документация API: http://localhost:8000/docs

## API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| POST | /auth/register | Регистрация |
| POST | /auth/login | Вход |
| POST | /auth/guest | Гостевой вход |
| GET | /auth/me | Текущий пользователь |
| POST | /auth/logout | Выход |
| GET | /profiles/me | Профиль (level, XP) |
| PUT | /profiles/me | Обновить профиль |
| GET | /scenarios/categories | Категории |
| GET | /scenarios | Список сценариев |
| GET | /scenarios/{id} | Сценарий по id |
| POST | /simulations | Сохранить симуляцию |
| GET | /simulations/recent | Недавние симуляции |

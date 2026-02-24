"""
PersonalityManager — память эмоций персонажа по ходу диалога.

Формирует текст для промпта: история значений E (0–100) за последние ходы,
чтобы LLM учитывал эмоциональную дугу персонажа.
"""
from typing import List

# Сколько последних значений E передавать в промпт
EMOTION_HISTORY_LEN = 10


def format_emotion_history(emotion_history: List[int] | List[float] | None) -> str:
    """
    Форматирует историю эмоций персонажа для вставки в system prompt.

    emotion_history — список значений E (0–100) по ходам, от старых к новым.
    Пустой или None → пустая строка (блок не добавляется).
    """
    if not emotion_history:
        return ""
    # Берём последние N значений
    recent = list(emotion_history)[-EMOTION_HISTORY_LEN:]
    try:
        values = [int(round(float(v))) for v in recent]
    except (TypeError, ValueError):
        return ""
    if not values:
        return ""
    # Текст для LLM: "Your mood over recent turns: 45 → 38 → 52 → ..."
    chain = " → ".join(str(v) for v in values)
    return f"""YOUR EMOTIONAL STATE OVER RECENT TURNS (E 0–100): {chain}
Use this arc to stay consistent — your next response should continue from this momentum."""

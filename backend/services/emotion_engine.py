"""
EmotionEngine — сглаживание эмоции персонажа (E) между ходами.

EWMA уменьшает резкие скачки от одного ответа LLM, сохраняя эмоциональную дугу.
"""

# Вес нового значения (0.35 = плавное сглаживание)
DEFAULT_ALPHA = 0.35


def smooth_emotion(
    prev_smoothed: float | None,
    raw: float,
    alpha: float = DEFAULT_ALPHA,
) -> float:
    """
    Сглаживает значение E (0–100) по EWMA.

    prev_smoothed — предыдущее сглаженное значение (или None для первого хода).
    raw — текущее сырое значение от LLM.
    alpha — вес нового значения (чем больше, тем быстрее реакция).
    """
    raw = max(0.0, min(100.0, float(raw)))
    if prev_smoothed is None:
        return round(raw, 1)
    prev = max(0.0, min(100.0, float(prev_smoothed)))
    smoothed = alpha * raw + (1.0 - alpha) * prev
    return round(max(0.0, min(100.0, smoothed)), 1)

"""
EmotionAnalyzer — анализ эмоций пользователя по тексту сообщения.

- Основной режим: OpenRouter (gemini-flash) — один быстрый запрос, JSON с эмоциями.
- Fallback: rule-based (капслок, повторы, !/?, эмодзи, сарказм).
- Возвращает 8 базовых эмоций с интенсивностью 0-1.
"""
import json
import re
import logging
from dataclasses import dataclass, field
from typing import Dict, Optional, Literal

logger = logging.getLogger(__name__)

# 8 базовых эмоций
EMOTIONS = (
    "joy", "sadness", "anger", "fear",
    "surprise", "disgust", "shame", "hope"
)

# Эмодзи → (эмоция, бонус к интенсивности)
EMOJI_MAP: Dict[str, tuple[str, float]] = {
    "😊": ("joy", 0.3), "😀": ("joy", 0.3), "😁": ("joy", 0.35), "😂": ("joy", 0.3),
    "🥰": ("joy", 0.4), "😍": ("joy", 0.35), "😎": ("joy", 0.2), "🙂": ("joy", 0.2),
    "😢": ("sadness", 0.35), "😭": ("sadness", 0.4), "😞": ("sadness", 0.3),
    "😡": ("anger", 0.4), "😠": ("anger", 0.35), "🤬": ("anger", 0.45),
    "😨": ("fear", 0.35), "😱": ("fear", 0.4), "😰": ("fear", 0.3),
    "😲": ("surprise", 0.35), "😮": ("surprise", 0.3), "🤯": ("surprise", 0.4),
    "😒": ("disgust", 0.3), "🤢": ("disgust", 0.35),
    "😳": ("shame", 0.3), "🥺": ("shame", 0.25),
    "🤞": ("hope", 0.25), "🙏": ("hope", 0.2), "✨": ("hope", 0.15),
}

# Паттерны сарказма
SARCASM_PATTERNS = [
    r"ну\s+конечно", r"как\s+же\s+иначе", r"ах\s+как\s+здорово",
    r"да\s+да\s+конечно", r"о\s+да\s+несомненно", r"ну\s+конечно\s+же",
    r"какой\s+сюрприз", r"вот\s+это\s+да", r"ну\s+спасибо",
    r"отлично\s+просто", r"прекрасно\s+что", r"замечательно",
]
SARCASM_RE = re.compile("|".join(f"({p})" for p in SARCASM_PATTERNS), re.IGNORECASE)

EMOTION_OPENROUTER_PROMPT = """Analyze the emotion in this user message. Reply with ONLY a JSON object, no other text.
Use these keys: "dominant" (one of: joy, sadness, anger, fear, surprise, disgust, shame, hope), "intensity" (0.0 to 1.0), "is_sarcasm" (boolean), "emotions" (object with those 8 keys, values 0.0-1.0).
Example: {"dominant": "joy", "intensity": 0.7, "is_sarcasm": false, "emotions": {"joy": 0.7, "sadness": 0, "anger": 0, "fear": 0, "surprise": 0.1, "disgust": 0, "shame": 0, "hope": 0.2}}"""


@dataclass
class EmotionResult:
    """Результат анализа эмоций."""
    emotions: Dict[str, float] = field(default_factory=dict)
    dominant: str = "hope"
    intensity: float = 0.5
    is_sarcasm: bool = False
    model_used: bool = False

    def to_prompt_hint(self) -> str:
        """Форматирует подсказку для промпта LLM."""
        top = sorted(
            (e, v) for e, v in self.emotions.items() if v > 0.1
        )[::-1][:3]
        if not top:
            return f"User emotion: neutral (intensity {self.intensity:.1f})."
        parts = [f"{e}: {v:.1f}" for e, v in top]
        s = f"User emotion: {', '.join(parts)}. Dominant: {self.dominant}. Intensity: {self.intensity:.1f}."
        if self.is_sarcasm:
            s += " SARCASM detected — user may express opposite sentiment."
        return s


class EmotionAnalyzer:
    """Анализатор эмоций: OpenRouter (основной) или rule-based (fallback)."""

    def __init__(self, backend: Literal["openrouter", "rules"] = "openrouter"):
        self._backend = backend
        self._openai_client = None

    def _get_openai_client(self):
        """Ленивая инициализация клиента OpenRouter."""
        if self._openai_client is not None:
            return self._openai_client
        try:
            from openai import AsyncOpenAI
            from config import OPENROUTER_API_KEY
            if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "dummy-key":
                return None
            self._openai_client = AsyncOpenAI(
                api_key=OPENROUTER_API_KEY,
                base_url="https://openrouter.ai/api/v1",
            )
            return self._openai_client
        except Exception as e:
            logger.warning("OpenRouter client not available: %s", e)
            return None

    async def _analyze_via_openrouter(self, text: str) -> Optional[EmotionResult]:
        """Один запрос к OpenRouter, парсинг JSON."""
        client = self._get_openai_client()
        if not client:
            return None
        try:
            from config import OPENROUTER_MODEL
            model = OPENROUTER_MODEL or "google/gemini-flash-1.5"
        except Exception:
            model = "google/gemini-flash-1.5"
        try:
            resp = await client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": EMOTION_OPENROUTER_PROMPT},
                    {"role": "user", "content": text[:2000]},
                ],
                max_tokens=256,
                temperature=0.2,
            )
            content = (resp.choices[0].message.content or "").strip()
            # Извлечь JSON из ответа (на случай если есть обёртка)
            if "{" in content and "}" in content:
                start = content.index("{")
                end = content.rindex("}") + 1
                content = content[start:end]
            data = json.loads(content)
            dominant = (data.get("dominant") or "hope").lower()
            if dominant not in EMOTIONS:
                dominant = "hope"
            intensity = max(0.0, min(1.0, float(data.get("intensity", 0.5))))
            is_sarcasm = bool(data.get("is_sarcasm", False))
            emotions = {e: 0.0 for e in EMOTIONS}
            for k, v in (data.get("emotions") or {}).items():
                if k in emotions:
                    emotions[k] = max(0.0, min(1.0, float(v)))
            if not any(emotions.values()):
                emotions[dominant] = intensity
            return EmotionResult(
                emotions=emotions,
                dominant=dominant,
                intensity=round(intensity, 2),
                is_sarcasm=is_sarcasm,
                model_used=True,
            )
        except Exception as e:
            logger.warning("OpenRouter emotion call failed: %s", e)
            return None

    def _analyze_text_features(self, text: str) -> tuple[float, bool]:
        """Капслок, повторы, пунктуация, сарказм. Возвращает (intensity_boost, is_sarcasm)."""
        intensity_boost = 0.0
        text_clean = text.strip()
        if len(text_clean) > 3:
            caps_ratio = sum(1 for c in text_clean if c.isupper()) / len(text_clean)
            if caps_ratio > 0.5:
                intensity_boost += 0.2
        repeated = re.findall(r"(.)\1{2,}", text_clean)
        if repeated:
            intensity_boost += min(0.2, len(repeated) * 0.08)
        excl, quest = text_clean.count("!"), text_clean.count("?")
        if excl + quest >= 3:
            intensity_boost += 0.15
        elif excl + quest >= 1:
            intensity_boost += 0.05
        is_sarcasm = bool(SARCASM_RE.search(text_clean))
        return intensity_boost, is_sarcasm

    def _extract_emojis(self, text: str) -> list[tuple[str, float]]:
        result = []
        for emoji, (emotion, bonus) in EMOJI_MAP.items():
            for _ in range(text.count(emoji)):
                result.append((emotion, bonus))
        return result

    def _rule_based_emotions(self, text: str) -> Dict[str, float]:
        """Только правила — без модели."""
        t = text.lower()
        scores: Dict[str, float] = {e: 0.0 for e in EMOTIONS}
        if any(w in t for w in ("рад", "счастье", "отлично", "класс", "супер", "круто")):
            scores["joy"] += 0.4
        if any(w in t for w in ("грустно", "печально", "жаль", "плохо", "ужас")):
            scores["sadness"] += 0.4
        if any(w in t for w in ("злюсь", "зло", "бесит", "раздраж", "возмущ")):
            scores["anger"] += 0.4
        if any(w in t for w in ("боюсь", "страшно", "тревог", "волнуюсь")):
            scores["fear"] += 0.4
        if any(w in t for w in ("надеюсь", "надежда", "верю", "ожидаю")):
            scores["hope"] += 0.35
        if max(scores.values()) == 0:
            scores["hope"] = 0.3
        return scores

    def _apply_rules(self, result: EmotionResult, text: str) -> EmotionResult:
        """Добавляет эмодзи и текстовые особенности к результату."""
        intensity_boost, rule_sarcasm = self._analyze_text_features(text)
        if rule_sarcasm:
            result.is_sarcasm = True
        for emo, bonus in self._extract_emojis(text):
            if emo in result.emotions:
                result.emotions[emo] = min(1.0, result.emotions.get(emo, 0) + bonus)
        for e in result.emotions:
            result.emotions[e] = min(1.0, result.emotions[e] * (1 + intensity_boost))
        result.intensity = min(1.0, round(result.intensity + intensity_boost * 0.5, 2))
        if result.is_sarcasm and max(result.emotions.values()) < 0.5:
            result.emotions["anger"] = min(1.0, result.emotions.get("anger", 0) + 0.25)
            result.emotions["sadness"] = min(1.0, result.emotions.get("sadness", 0) + 0.15)
        if max(result.emotions.values()) > 0:
            result.dominant = max(result.emotions, key=result.emotions.get)
        return result

    def analyze(self, text: str) -> EmotionResult:
        """Синхронный анализ (только rules). Для OpenRouter используйте analyze_async."""
        if not text or not text.strip():
            return EmotionResult(emotions={e: 0.0 for e in EMOTIONS}, dominant="hope", intensity=0.3)
        emotions = self._rule_based_emotions(text.strip())
        intensity_boost, is_sarcasm = self._analyze_text_features(text)
        for e in emotions:
            emotions[e] = min(1.0, emotions[e] * (1 + intensity_boost))
        for emo, bonus in self._extract_emojis(text):
            emotions[emo] = min(1.0, emotions.get(emo, 0) + bonus)
        if is_sarcasm and max(emotions.values()) < 0.5:
            emotions["anger"] = min(1.0, emotions.get("anger", 0) + 0.25)
            emotions["sadness"] = min(1.0, emotions.get("sadness", 0) + 0.15)
        dominant = max(emotions, key=emotions.get) if max(emotions.values()) > 0 else "hope"
        intensity = min(1.0, max(emotions.values()) + intensity_boost * 0.5)
        return EmotionResult(
            emotions=emotions,
            dominant=dominant,
            intensity=round(intensity, 2),
            is_sarcasm=is_sarcasm,
            model_used=False,
        )

    async def analyze_async(self, text: str) -> EmotionResult:
        """Асинхронный анализ: OpenRouter (если backend=openrouter и доступен), иначе rules + правила поверх."""
        if not text or not text.strip():
            return EmotionResult(emotions={e: 0.0 for e in EMOTIONS}, dominant="hope", intensity=0.3)
        text_clean = text.strip()
        result = None
        if self._backend == "openrouter":
            result = await self._analyze_via_openrouter(text_clean)
        if result is None:
            result = self.analyze(text_clean)
        return self._apply_rules(result, text_clean)


_analyzer: Optional[EmotionAnalyzer] = None


def get_emotion_analyzer(backend: Literal["openrouter", "rules"] = "openrouter") -> EmotionAnalyzer:
    global _analyzer
    if _analyzer is None:
        _analyzer = EmotionAnalyzer(backend=backend)
    return _analyzer

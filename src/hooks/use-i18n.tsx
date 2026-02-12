import { createContext, useContext, useState, useCallback } from "react";

export type Locale = "en" | "ru";

const translations = {
  // Layout / Nav
  "nav.home": { en: "Home", ru: "Главная" },
  "nav.explore": { en: "Explore", ru: "Обзор" },
  "nav.stats": { en: "Stats", ru: "Статистика" },
  "nav.profile": { en: "Profile", ru: "Профиль" },
  "nav.settings": { en: "Settings", ru: "Настройки" },
  "nav.subtitle": { en: "Practice with empathy", ru: "Практика с эмпатией" },

  // Home
  "home.welcome": { en: "Welcome back 👋", ru: "С возвращением 👋" },
  "home.greeting": { en: "Good evening, Alex", ru: "Добрый вечер, Алекс" },
  "home.level": { en: "Level 4", ru: "Уровень 4" },
  "home.dailyGoal": { en: "🎯 Daily Goal", ru: "🎯 Цель дня" },
  "home.startNow": { en: "Start Now", ru: "Начать" },
  "home.categories": { en: "Categories", ru: "Категории" },
  "home.recommended": { en: "Recommended for you", ru: "Рекомендации для вас" },
  "home.recent": { en: "Recent Sessions", ru: "Недавние сессии" },
  "home.score": { en: "Score", ru: "Баллы" },
  "home.dayStreak": { en: "Day Streak", ru: "Дней подряд" },
  "home.sessions": { en: "Sessions", ru: "Сессии" },
  "home.avgScore": { en: "Avg Score", ru: "Средний балл" },

  // Explore
  "explore.subtitle": { en: "Find your next challenge", ru: "Найдите следующий вызов" },
  "explore.title": { en: "Explore Scenarios", ru: "Обзор сценариев" },
  "explore.search": { en: "Search scenarios...", ru: "Поиск сценариев..." },
  "explore.scenarios": { en: "scenarios", ru: "сценариев" },
  "explore.all": { en: "All", ru: "Все" },
  "explore.noResults": { en: "No scenarios found", ru: "Сценарии не найдены" },
  "explore.adjustFilters": { en: "Try adjusting your filters", ru: "Попробуйте изменить фильтры" },

  // Difficulties
  "difficulty.all": { en: "All", ru: "Все" },
  "difficulty.easy": { en: "Easy", ru: "Легко" },
  "difficulty.medium": { en: "Medium", ru: "Средне" },
  "difficulty.hard": { en: "Hard", ru: "Сложно" },

  // Categories
  "cat.romance": { en: "Romance", ru: "Романтика" },
  "cat.work": { en: "Work", ru: "Работа" },
  "cat.family": { en: "Family", ru: "Семья" },
  "cat.friends": { en: "Friends", ru: "Друзья" },
  "cat.conflict": { en: "Conflict", ru: "Конфликт" },
  "cat.public-speaking": { en: "Public Speaking", ru: "Публичные выступления" },

  // Scenarios
  "scenario.first-date.title": { en: "First date jitters", ru: "Волнение на первом свидании" },
  "scenario.first-date.desc": { en: "You're meeting someone for the first time at a café. Keep the conversation flowing naturally and make a genuine connection.", ru: "Вы впервые встречаетесь с кем-то в кафе. Поддерживайте естественный разговор и установите искреннюю связь." },
  "scenario.ask-raise.title": { en: "Ask for a raise", ru: "Попросить повышение" },
  "scenario.ask-raise.desc": { en: "You've been excelling at your job for a year. It's time to have that conversation with your manager about a salary increase.", ru: "Вы отлично работали весь год. Пора поговорить с руководителем о повышении зарплаты." },
  "scenario.calm-toddler.title": { en: "Calm crying toddler", ru: "Успокоить плачущего малыша" },
  "scenario.calm-toddler.desc": { en: "Your 3-year-old is having a meltdown in the grocery store. Use empathy and patience to de-escalate the situation.", ru: "Ваш 3-летний ребёнок устроил истерику в магазине. Используйте эмпатию и терпение, чтобы успокоить ситуацию." },
  "scenario.say-no.title": { en: "Say no to a friend", ru: "Отказать другу" },
  "scenario.say-no.desc": { en: "Your friend keeps asking you for favors that drain your energy. Practice setting healthy boundaries with kindness.", ru: "Ваш друг постоянно просит об услугах, которые вас истощают. Практикуйте установление здоровых границ с добротой." },
  "scenario.reply-rudeness.title": { en: "Reply to rudeness", ru: "Ответ на грубость" },
  "scenario.reply-rudeness.desc": { en: "A coworker just made a snarky comment in front of the whole team. Respond assertively without escalating the conflict.", ru: "Коллега только что сделал язвительный комментарий перед всей командой. Ответьте уверенно, не обостряя конфликт." },
  "scenario.wedding-toast.title": { en: "Wedding toast", ru: "Тост на свадьбе" },
  "scenario.wedding-toast.desc": { en: "You're the best man/maid of honor. Deliver a heartfelt, funny, and memorable wedding toast to the happy couple.", ru: "Вы шафер/подружка невесты. Произнесите душевный, весёлый и запоминающийся тост за молодожёнов." },

  // Scenario card
  "scenario.start": { en: "Start", ru: "Начать" },

  // Setup
  "setup.back": { en: "Back", ru: "Назад" },
  "setup.difficulty": { en: "Difficulty", ru: "Сложность" },
  "setup.calm": { en: "Calm", ru: "Спокойно" },
  "setup.normal": { en: "Normal", ru: "Обычно" },
  "setup.challenging": { en: "Challenging", ru: "Напряжённо" },
  "setup.calmDesc": { en: "Relaxed conversation", ru: "Расслабленный разговор" },
  "setup.normalDesc": { en: "Realistic tension", ru: "Реалистичное напряжение" },
  "setup.challengingDesc": { en: "High pressure", ru: "Высокое давление" },
  "setup.aiPersonality": { en: "AI Personality", ru: "Личность ИИ" },
  "setup.characterMood": { en: "Character mood", ru: "Настроение персонажа" },
  "setup.moodCalm": { en: "😌 Calm", ru: "😌 Спокойный" },
  "setup.moodNervous": { en: "😬 Nervous", ru: "😬 Нервный" },
  "setup.moodAggressive": { en: "😡 Aggressive", ru: "😡 Агрессивный" },
  "setup.sliderCalm": { en: "Calm", ru: "Спокойный" },
  "setup.sliderNervous": { en: "Nervous", ru: "Нервный" },
  "setup.sliderAggressive": { en: "Aggressive", ru: "Агрессивный" },
  "setup.yourGoal": { en: "Your Goal", ru: "Ваша цель" },
  "setup.deescalate": { en: "De-escalate", ru: "Деэскалация" },
  "setup.showEmpathy": { en: "Show empathy", ru: "Проявить эмпатию" },
  "setup.getAgreement": { en: "Get agreement", ru: "Достичь согласия" },
  "setup.startSimulation": { en: "Start Simulation", ru: "Начать симуляцию" },

  // Simulation
  "sim.aiPartner": { en: "AI Partner · Active", ru: "ИИ-партнёр · Активен" },
  "sim.endSession": { en: "End Session", ru: "Завершить" },
  "sim.aiEmotion": { en: "AI Emotion", ru: "Эмоция ИИ" },
  "sim.positive": { en: "😊 Positive", ru: "😊 Позитивно" },
  "sim.neutral": { en: "😐 Neutral", ru: "😐 Нейтрально" },
  "sim.tense": { en: "😠 Tense", ru: "😠 Напряжённо" },
  "sim.yourEmpathy": { en: "Your Empathy", ru: "Ваша эмпатия" },
  "sim.great": { en: "Great!", ru: "Отлично!" },
  "sim.keepGoing": { en: "Keep going", ru: "Продолжайте" },
  "sim.goal": { en: "Goal", ru: "Цель" },
  "sim.typeResponse": { en: "Type your response...", ru: "Напишите ответ..." },

  // Hints
  "hint.first-date": { en: "Try asking about their hobbies or sharing something personal!", ru: "Попробуйте спросить об их хобби или поделиться чем-то личным!" },
  "hint.ask-raise": { en: "Focus on your specific achievements and use confident language.", ru: "Сосредоточьтесь на конкретных достижениях и используйте уверенный тон." },
  "hint.calm-toddler": { en: "Get down to their level and validate their feelings first.", ru: "Опуститесь на их уровень и сначала подтвердите их чувства." },
  "hint.say-no": { en: "Use 'I' statements and offer an alternative if possible.", ru: "Используйте 'Я'-высказывания и предложите альтернативу." },
  "hint.reply-rudeness": { en: "Stay calm, acknowledge their point, then redirect professionally.", ru: "Сохраняйте спокойствие, признайте их точку зрения, затем перенаправьте профессионально." },
  "hint.wedding-toast": { en: "Start with a funny memory, then shift to something heartfelt.", ru: "Начните с забавного воспоминания, затем перейдите к чему-то душевному." },
  "hint.default": { en: "Try being empathetic and clear.", ru: "Попробуйте быть эмпатичным и ясным." },

  // Feedback
  "feedback.complete": { en: "Session Complete ✨", ru: "Сессия завершена ✨" },
  "feedback.howYouDid": { en: "Here's how you did — keep practicing to improve!", ru: "Вот ваши результаты — продолжайте практиковаться!" },
  "feedback.overallScore": { en: "Overall Score", ru: "Общий балл" },
  "feedback.skillBreakdown": { en: "Skill Breakdown", ru: "Разбор навыков" },
  "feedback.wentWell": { en: "What went well", ru: "Что получилось хорошо" },
  "feedback.toImprove": { en: "Room to improve", ru: "Есть куда расти" },
  "feedback.tipTitle": { en: "Tip of the Day", ru: "Совет дня" },
  "feedback.tipText": { en: "Mirror the other person's emotions before offering solutions. People feel heard when you reflect their feelings first.", ru: "Отражайте эмоции собеседника, прежде чем предлагать решения. Люди чувствуют, что их слышат, когда вы сначала отражаете их чувства." },
  "feedback.practiceAgain": { en: "Practice Again", ru: "Попробовать снова" },
  "feedback.nextScenario": { en: "Next Scenario", ru: "Следующий сценарий" },

  // Skills
  "skill.empathy": { en: "Empathy", ru: "Эмпатия" },
  "skill.clarity": { en: "Clarity", ru: "Ясность" },
  "skill.emotionalControl": { en: "Emotional Control", ru: "Контроль эмоций" },
  "skill.assertiveness": { en: "Assertiveness", ru: "Уверенность" },

  // Feedback phrases
  "phrase.pos1": { en: '"I understand how you feel"', ru: '"Я понимаю, что вы чувствуете"' },
  "phrase.pos1.note": { en: "Great empathy signal", ru: "Отличный сигнал эмпатии" },
  "phrase.pos2": { en: '"Let\'s find a solution together"', ru: '"Давайте найдём решение вместе"' },
  "phrase.pos2.note": { en: "Collaborative tone", ru: "Тон сотрудничества" },
  "phrase.neg1": { en: '"You always do this"', ru: '"Ты всегда так делаешь"' },
  "phrase.neg1.note": { en: "Avoid generalizations", ru: "Избегайте обобщений" },
  "phrase.neg2": { en: '"Whatever"', ru: '"Да ладно"' },
  "phrase.neg2.note": { en: "Dismissive language reduces trust", ru: "Пренебрежительный тон снижает доверие" },

  // Profile
  "profile.settings": { en: "Settings", ru: "Настройки" },
  "profile.skillProgress": { en: "Skill Progress", ru: "Прогресс навыков" },
  "profile.achievements": { en: "Achievements", ru: "Достижения" },
  "profile.unlocked": { en: "Unlocked", ru: "Разблокировано" },
  "profile.bestScore": { en: "Best Score", ru: "Лучший балл" },
  "profile.streak": { en: "Streak", ru: "Серия" },

  // Achievements
  "ach.first-sim": { en: "First Steps", ru: "Первые шаги" },
  "ach.empathy-master": { en: "Empathy Master", ru: "Мастер эмпатии" },
  "ach.streak-3": { en: "On a Roll", ru: "В ударе" },
  "ach.all-categories": { en: "Well-Rounded", ru: "Разносторонний" },
  "ach.conflict-ace": { en: "Conflict Ace", ru: "Ас конфликтов" },
  "ach.public-star": { en: "Stage Star", ru: "Звезда сцены" },

  // Stats
  "stats.subtitle": { en: "Track your growth", ru: "Отслеживайте свой рост" },
  "stats.title": { en: "Statistics", ru: "Статистика" },
  "stats.totalSessions": { en: "Total Sessions", ru: "Всего сессий" },
  "stats.dayStreak": { en: "Day Streak", ru: "Дней подряд" },
  "stats.avgScore": { en: "Avg Score", ru: "Средний балл" },
  "stats.bestScore": { en: "Best Score", ru: "Лучший балл" },
  "stats.thisWeek": { en: "This Week", ru: "Эта неделя" },
  "stats.skillTrends": { en: "Skill Trends", ru: "Тренды навыков" },
  "stats.recentSessions": { en: "Recent Sessions", ru: "Недавние сессии" },

  // Week days
  "day.mon": { en: "Mon", ru: "Пн" },
  "day.tue": { en: "Tue", ru: "Вт" },
  "day.wed": { en: "Wed", ru: "Ср" },
  "day.thu": { en: "Thu", ru: "Чт" },
  "day.fri": { en: "Fri", ru: "Пт" },
  "day.sat": { en: "Sat", ru: "Сб" },
  "day.sun": { en: "Sun", ru: "Вс" },

  // Recent
  "recent.yesterday": { en: "Yesterday", ru: "Вчера" },
  "recent.2daysAgo": { en: "2 days ago", ru: "2 дня назад" },

  // Settings
  "settings.back": { en: "Back", ru: "Назад" },
  "settings.title": { en: "Settings", ru: "Настройки" },
  "settings.subtitle": { en: "Customize your experience", ru: "Настройте под себя" },
  "settings.simulation": { en: "Simulation", ru: "Симуляция" },
  "settings.voiceInput": { en: "Voice Input", ru: "Голосовой ввод" },
  "settings.voiceInputDesc": { en: "Speak instead of type", ru: "Говорите вместо набора текста" },
  "settings.showHints": { en: "Show Hints", ru: "Показывать подсказки" },
  "settings.showHintsDesc": { en: "Display suggestions during chats", ru: "Показывать советы во время чатов" },
  "settings.hintFrequency": { en: "Hint Frequency", ru: "Частота подсказок" },
  "settings.hintRarely": { en: "Rarely", ru: "Редко" },
  "settings.hintSometimes": { en: "Sometimes", ru: "Иногда" },
  "settings.hintOften": { en: "Often", ru: "Часто" },
  "settings.appearance": { en: "Appearance", ru: "Внешний вид" },
  "settings.darkMode": { en: "Dark Mode", ru: "Тёмная тема" },
  "settings.darkModeDesc": { en: "Easier on the eyes at night", ru: "Легче для глаз ночью" },
  "settings.language": { en: "Language", ru: "Язык" },
  "settings.english": { en: "English", ru: "English" },
  "settings.russian": { en: "Русский", ru: "Русский" },
  "settings.notifications": { en: "Notifications", ru: "Уведомления" },
  "settings.dailyReminders": { en: "Daily Reminders", ru: "Ежедневные напоминания" },
  "settings.dailyRemindersDesc": { en: "Get notified to practice", ru: "Напоминания о практике" },
  "settings.account": { en: "Account", ru: "Аккаунт" },
  "settings.signOut": { en: "Sign Out", ru: "Выйти" },
  "settings.deleteAccount": { en: "Delete Account", ru: "Удалить аккаунт" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("socialsim-locale") as Locale) || "en";
    }
    return "en";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("socialsim-locale", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[key]?.[locale] || key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

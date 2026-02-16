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
  "nav.login": { en: "Log in", ru: "Войти" },
  "nav.register": { en: "Sign up", ru: "Регистрация" },
  "nav.logout": { en: "Log out", ru: "Выйти" },

  // Auth
  "auth.loginTitle": { en: "Welcome back", ru: "С возвращением" },
  "auth.loginSubtitle": { en: "Sign in to continue", ru: "Войдите, чтобы продолжить" },
  "auth.registerTitle": { en: "Create account", ru: "Создать аккаунт" },
  "auth.registerSubtitle": { en: "Start practicing your skills", ru: "Начните практиковать навыки" },
  "auth.email": { en: "Email", ru: "Email" },
  "auth.password": { en: "Password", ru: "Пароль" },
  "auth.fullName": { en: "Full name (optional)", ru: "Имя (необязательно)" },
  "auth.login": { en: "Log in", ru: "Войти" },
  "auth.register": { en: "Sign up", ru: "Зарегистрироваться" },
  "auth.guest": { en: "Continue as Guest", ru: "Продолжить как гость" },
  "auth.noAccount": { en: "Don't have an account?", ru: "Нет аккаунта?" },
  "auth.hasAccount": { en: "Already have an account?", ru: "Уже есть аккаунт?" },
  "auth.passwordHint": { en: "Min 6 chars, uppercase, lowercase, digit", ru: "Мин 6 символов, заглавная, строчная, цифра" },

  // Home
  "home.welcome": { en: "Welcome back 👋", ru: "С возвращением 👋" },
  "home.greeting": { en: "Good evening, Alex", ru: "Добрый вечер, Алекс" },
  "home.level": { en: "Level 4", ru: "Уровень 4" },
  "home.dailyGoal": { en: "🎯 Daily Goal", ru: "🎯 Цель дня" },
  "home.startNow": { en: "Start Now", ru: "Начать" },
  "home.categories": { en: "Categories", ru: "Категории" },
  "home.recommended": { en: "Recommended for you", ru: "Рекомендации для вас" },
  "home.recent": { en: "Recent Sessions", ru: "Недавние сессии" },
  "home.noRecentSessions": { en: "No sessions yet. Start your first practice!", ru: "Сессий пока нет. Начните первую практику!" },
  "home.startFirst": { en: "Start Practice", ru: "Начать практику" },
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

  // Simulation - first AI messages per scenario (locale-aware, engaging openings)
  "sim.firstDate.msg0": { en: "Oh, hi! Sorry, I got here a bit early and was just... staring at the menu. 😅 So nice to finally meet in person! How was your trip over?", ru: "О, привет! Я немного рано пришла и просто... рассматривала меню. 😅 Очень приятно познакомиться лично! Как добрались?" },
  "sim.askRaise.msg0": { en: "Come in, come in. So — you wanted to chat about something? I've got about twenty minutes before my next meeting.", ru: "Заходите, заходите. Так, вы хотели о чём-то поговорить? У меня минут двадцать до следующей встречи." },
  "sim.calmToddler.msg0": { en: "*screaming and kicking* NO! NO! I WANT IT! *flails* THE BLUE ONE! *sobbing* YOU'RE MEAN!", ru: "*орёт и дрыгает ногами* НЕТ! НЕТ! ХОЧУ! *машет руками* СИНЮЮ! *всхлипывает* ТЫ ПЛОХАЯ!" },
  "sim.sayNo.msg0": { en: "Hey, you free this weekend? Listen, I really need someone to watch Max — my dog — just Saturday and Sunday. I know it's last minute, but you're literally the only person I can ask. You'd be saving my life!", ru: "Слушай, ты свободна в выходные? Мне срочно нужен кто-то присмотреть за Максом — моей собакой. Только сб и вс. Знаю, что в последний момент, но ты буквально единственный человек. Ты меня спасёшь!" },
  "sim.replyRudeness.msg0": { en: "*loud enough for the room* Well. Maybe if some people actually hit their deadlines, we wouldn't all be scrambling. Just saying.", ru: "*достаточно громко для кабинета* Ну. Может, если бы некоторые реально сдавали в срок, мы бы все не тушили пожар. Просто к слову." },
  "sim.weddingToast.msg0": { en: "*the room goes quiet. Everyone turns to you, glasses raised. Someone whispers: Go on!*", ru: "*в зале стихают. Все поворачиваются к вам, бокалы подняты. Кто-то шепчет: Давай!*" },
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

  // Hints — specific, actionable tips for natural dialogue
  "hint.first-date": { en: "Ask follow-up questions about what they share. React to specifics — 'That sounds amazing!' beats 'Cool!'.", ru: "Задавайте уточняющие вопросы. Реагируйте на детали — «Звучит здорово!» лучше, чем «Круто»." },
  "hint.ask-raise": { en: "Name 2–3 concrete achievements. Use 'I' and confident tone: 'I delivered X' not 'We kinda did X'.", ru: "Назовите 2–3 конкретных результата. Говорите уверенно: «Я сделал X», а не «Мы вроде как сделали X»." },
  "hint.calm-toddler": { en: "Name their feeling first: 'You're upset because...' Then offer a small choice: 'Juice or water?'", ru: "Сначала назовите чувство: «Ты расстроился, потому что...» Потом дайте выбор: «Сок или вода?»" },
  "hint.say-no": { en: "Be clear and kind: 'I can't do it' + brief reason. Offer an alternative if you can.", ru: "Скажите чётко и доброжелательно: «Я не смогу» + короткая причина. Предложите альтернативу, если возможно." },
  "hint.reply-rudeness": { en: "Stay calm. Name the impact: 'That felt personal.' Ask to talk privately later.", ru: "Сохраняйте спокойствие. Озвучьте эффект: «Это прозвучало как личное.» Предложите поговорить с глазу на глаз." },
  "hint.wedding-toast": { en: "Open with one funny memory, then one heartfelt line. Keep it under 2 min.", ru: "Начните с одной забавной истории, затем — что-то душевное. Держитесь до 2 минут." },
  "hint.default": { en: "Listen to what they said. React to the specifics, not generically.", ru: "Услышьте, что они сказали. Реагируйте на детали, а не шаблонно." },

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
  "feedback.saveError": { en: "Could not save results. Try again later.", ru: "Не удалось сохранить результаты. Попробуйте позже." },
  "feedback.keepTrying": { en: "Keep trying", ru: "Продолжайте попытки" },
  "feedback.keepTrying.note": { en: "Practice makes progress", ru: "Практика ведёт к прогрессу" },
  "feedback.practiceMore": { en: "Practice more scenarios", ru: "Практикуйте больше сценариев" },
  "feedback.practiceMore.note": { en: "Each session helps", ru: "Каждая сессия помогает" },

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
  "stats.noSessions": { en: "No sessions yet. Complete a simulation to see your stats here.", ru: "Сессий пока нет. Пройдите симуляцию, чтобы увидеть статистику." },
  "stats.startFirst": { en: "Explore Scenarios", ru: "Выбрать сценарий" },

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

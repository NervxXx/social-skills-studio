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
  "cat.strangers": { en: "Strangers", ru: "Незнакомцы" },
  "cat.negotiations": { en: "Negotiations", ru: "Переговоры" },

  // Scenarios — Romance
  "scenario.first-date.title": { en: "First date jitters", ru: "Волнение на первом свидании" },
  "scenario.first-date.desc": { en: "You're meeting someone for the first time at a café. Keep the conversation flowing naturally and make a genuine connection.", ru: "Вы впервые встречаетесь с кем-то в кафе. Поддерживайте естественный разговор и установите искреннюю связь." },
  "scenario.difficult-talk.title": { en: "Difficult conversation", ru: "Сложный разговор" },
  "scenario.difficult-talk.desc": { en: "Something has been bothering you in the relationship. Have an honest, caring conversation without turning it into a fight.", ru: "Вас что-то беспокоит в отношениях. Проведите честный и заботливый разговор, не превращая его в ссору." },
  "scenario.meet-parents.title": { en: "Meet the parents", ru: "Знакомство с родителями" },
  "scenario.meet-parents.desc": { en: "You're meeting your partner's parents for the first time at dinner. Navigate tricky questions and make a good impression.", ru: "Вы впервые встречаетесь с родителями вашего партнёра за ужином. Ответьте на каверзные вопросы и произведите хорошее впечатление." },
  "scenario.breakup.title": { en: "Compassionate breakup", ru: "Расставание с достоинством" },
  "scenario.breakup.desc": { en: "The relationship isn't working. End it with honesty and compassion, without causing unnecessary hurt.", ru: "Отношения не складываются. Завершите их честно и с состраданием, не причиняя лишней боли." },

  // Scenarios — Work
  "scenario.job-interview.title": { en: "Job interview", ru: "Собеседование" },
  "scenario.job-interview.desc": { en: "You're in a job interview. Answer tough questions confidently and show your strengths without bragging.", ru: "Вы на собеседовании. Отвечайте на сложные вопросы уверенно и покажите свои сильные стороны без хвастовства." },
  "scenario.ask-raise.title": { en: "Ask for a raise", ru: "Попросить повышение" },
  "scenario.ask-raise.desc": { en: "You've been excelling at your job for a year. It's time to have that conversation with your manager about a salary increase.", ru: "Вы отлично работали весь год. Пора поговорить с руководителем о повышении зарплаты." },
  "scenario.give-feedback.title": { en: "Give feedback", ru: "Дать обратную связь" },
  "scenario.give-feedback.desc": { en: "A colleague's work quality has dropped. Give constructive, specific feedback that motivates rather than demoralizes.", ru: "Качество работы коллеги снизилось. Дайте конструктивную обратную связь, которая мотивирует, а не деморализует." },
  "scenario.toxic-boss.title": { en: "Toxic boss", ru: "Токсичный начальник" },
  "scenario.toxic-boss.desc": { en: "Your boss is being unreasonable and micromanaging. Stand up for yourself professionally without burning bridges.", ru: "Ваш начальник ведёт себя неразумно и контролирует каждый шаг. Отстаивайте себя профессионально, не сжигая мосты." },

  // Scenarios — Family
  "scenario.calm-toddler.title": { en: "Calm crying toddler", ru: "Успокоить плачущего малыша" },
  "scenario.calm-toddler.desc": { en: "Your 3-year-old is having a meltdown in the grocery store. Use empathy and patience to de-escalate the situation.", ru: "Ваш 3-летний ребёнок устроил истерику в магазине. Используйте эмпатию и терпение, чтобы успокоить ситуацию." },
  "scenario.teen-grades.title": { en: "Teen's grades", ru: "Оценки подростка" },
  "scenario.teen-grades.desc": { en: "Your teenager's grades have been dropping. Talk to them without lecturing — understand what's going on.", ru: "Оценки вашего подростка падают. Поговорите с ним без нравоучений — поймите, что происходит." },
  "scenario.aging-parent.title": { en: "Aging parent", ru: "Пожилой родитель" },
  "scenario.aging-parent.desc": { en: "Your elderly parent is struggling to live alone but refuses help. Gently convince them while respecting their independence.", ru: "Вашему пожилому родителю тяжело жить одному, но он отказывается от помощи. Мягко убедите его, уважая независимость." },

  // Scenarios — Friends
  "scenario.say-no.title": { en: "Say no to a friend", ru: "Отказать другу" },
  "scenario.say-no.desc": { en: "Your friend keeps asking you for favors that drain your energy. Practice setting healthy boundaries with kindness.", ru: "Ваш друг постоянно просит об услугах, которые вас истощают. Практикуйте установление здоровых границ с добротой." },
  "scenario.friend-crisis.title": { en: "Friend in crisis", ru: "Друг в беде" },
  "scenario.friend-crisis.desc": { en: "Your close friend is going through a tough time and is barely holding it together. Be there for them.", ru: "Ваш близкий друг переживает тяжёлые времена и еле держится. Будьте рядом, не давая непрошеных советов." },
  "scenario.apologize.title": { en: "Sincere apology", ru: "Искренние извинения" },
  "scenario.apologize.desc": { en: "You said something hurtful to a friend and need to apologize. Make it genuine — no excuses.", ru: "Вы обидели друга и нужно извиниться. Сделайте это искренне — без отговорок и перекладывания вины." },

  // Scenarios — Conflict
  "scenario.neighbor-noise.title": { en: "Noisy neighbor", ru: "Шумный сосед" },
  "scenario.neighbor-noise.desc": { en: "Your neighbor's loud music keeps you awake. Ask them to quiet down without starting a feud.", ru: "Громкая музыка соседа не даёт вам уснуть. Попросите его вести себя тише, не начиная вражду." },
  "scenario.reply-rudeness.title": { en: "Reply to rudeness", ru: "Ответ на грубость" },
  "scenario.reply-rudeness.desc": { en: "A coworker just made a snarky comment in front of the whole team. Respond assertively without escalating the conflict.", ru: "Коллега только что сделал язвительный комментарий перед всей командой. Ответьте уверенно, не обостряя конфликт." },
  "scenario.service-complaint.title": { en: "Bad service", ru: "Плохое обслуживание" },
  "scenario.service-complaint.desc": { en: "You received terrible service at a restaurant. Complain effectively without being rude.", ru: "Вас ужасно обслужили в ресторане. Пожалуйтесь эффективно, не грубя персоналу." },

  // Scenarios — Public Speaking
  "scenario.elevator-pitch.title": { en: "Elevator pitch", ru: "Презентация в лифте" },
  "scenario.elevator-pitch.desc": { en: "You're in an elevator with a potential investor. Pitch your startup idea in 60 seconds.", ru: "Вы в лифте с потенциальным инвестором. Представьте свою идею стартапа за 60 секунд." },
  "scenario.wedding-toast.title": { en: "Wedding toast", ru: "Тост на свадьбе" },
  "scenario.wedding-toast.desc": { en: "You're the best man/maid of honor. Deliver a heartfelt, funny, and memorable wedding toast to the happy couple.", ru: "Вы шафер/подружка невесты. Произнесите душевный, весёлый и запоминающийся тост за молодожёнов." },
  "scenario.team-presentation.title": { en: "Team presentation", ru: "Презентация для команды" },
  "scenario.team-presentation.desc": { en: "Present your project results to the team and stakeholders. Keep it clear and engaging.", ru: "Представьте результаты проекта команде и стейкхолдерам. Будьте ясными и убедительными." },

  // Scenarios — Strangers
  "scenario.small-talk.title": { en: "Networking event", ru: "Нетворкинг-мероприятие" },
  "scenario.small-talk.desc": { en: "You're at a networking event and don't know anyone. Start a conversation with a stranger.", ru: "Вы на мероприятии и никого не знаете. Начните разговор с незнакомцем и поддержите его." },
  "scenario.awkward-silence.title": { en: "Awkward silence", ru: "Неловкая тишина" },
  "scenario.awkward-silence.desc": { en: "You're stuck in an elevator with an acquaintance and the conversation died. Revive it.", ru: "Вы застряли в лифте со знакомым, и разговор умер. Возобновите его, не делая ещё более неловко." },
  "scenario.comfort-stranger.title": { en: "Comfort a stranger", ru: "Утешить незнакомца" },
  "scenario.comfort-stranger.desc": { en: "A stranger on public transit is visibly upset. Approach with care — offer support without overstepping.", ru: "Незнакомец в транспорте явно расстроен и тихо плачет. Подойдите осторожно — предложите поддержку, не навязываясь." },

  // Scenarios — Negotiations
  "scenario.haggle.title": { en: "Haggle a deal", ru: "Торг на рынке" },
  "scenario.haggle.desc": { en: "You found a great item at a flea market. Negotiate a fair price.", ru: "Вы нашли отличную вещь на блошином рынке. Поторгуйтесь за справедливую цену." },
  "scenario.salary-offer.title": { en: "Salary negotiation", ru: "Переговоры о зарплате" },
  "scenario.salary-offer.desc": { en: "You got a job offer but the salary is below your expectations. Negotiate higher.", ru: "Вы получили оффер, но зарплата ниже ожиданий. Договоритесь о большей сумме, не потеряв предложение." },
  "scenario.landlord-dispute.title": { en: "Landlord dispute", ru: "Спор с арендодателем" },
  "scenario.landlord-dispute.desc": { en: "Your landlord added unfair charges to your bill. Dispute them calmly but firmly.", ru: "Арендодатель добавил несправедливые платежи. Оспорьте их спокойно, но твёрдо, зная свои права." },

  // Scenario card
  "scenario.start": { en: "Start", ru: "Начать" },
  "scenario.locked": { en: "Locked", ru: "Заблокировано" },
  "scenario.requiredLevel": { en: "Requires level", ru: "Требуется уровень" },

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
  "setup.sessionLength": { en: "Session Length", ru: "Длительность" },
  "setup.short": { en: "Short", ru: "Короткая" },
  "setup.medium": { en: "Medium", ru: "Средняя" },
  "setup.long": { en: "Long", ru: "Длинная" },
  "setup.shortDesc": { en: "~5 turns", ru: "~5 ходов" },
  "setup.mediumDesc": { en: "~10 turns", ru: "~10 ходов" },
  "setup.longDesc": { en: "~15+ turns", ru: "~15+ ходов" },
  "setup.focusSkill": { en: "Focus Skill", ru: "Навык в фокусе" },
  "setup.focusEmpathy": { en: "Empathy", ru: "Эмпатия" },
  "setup.focusClarity": { en: "Clarity", ru: "Ясность" },
  "setup.focusControl": { en: "Composure", ru: "Самообладание" },
  "setup.focusAll": { en: "All skills", ru: "Все навыки" },
  "setup.aiStyle": { en: "AI Response Style", ru: "Стиль ответа ИИ" },
  "setup.styleRealistic": { en: "Realistic", ru: "Реалистичный" },
  "setup.styleExpressive": { en: "Expressive", ru: "Экспрессивный" },
  "setup.styleLaconic": { en: "Laconic", ru: "Лаконичный" },
  "setup.styleRealisticDesc": { en: "Natural dialogue", ru: "Естественный диалог" },
  "setup.styleExpressiveDesc": { en: "More emotions & actions", ru: "Больше эмоций и действий" },
  "setup.styleLaconicDesc": { en: "Short, dry replies", ru: "Короткие, сухие реплики" },
  "setup.xpPreview": { en: "XP Preview", ru: "Превью XP" },
  "setup.xpMultiplier": { en: "Multiplier", ru: "Множитель" },
  "setup.xpBase": { en: "base", ru: "базовый" },
  "setup.xpEstimate": { en: "Estimated XP", ru: "Ожидаемый XP" },
  "setup.xpBonusDifficulty": { en: "Difficulty bonus", ru: "Бонус за сложность" },
  "setup.xpBonusPersonality": { en: "Mood bonus", ru: "Бонус за настроение" },
  "setup.xpBonusLength": { en: "Length bonus", ru: "Бонус за длительность" },

  // Simulation - first AI messages per scenario
  "sim.firstDate.msg0": { en: "Oh, hi! Sorry, I got here a bit early and was just... staring at the menu. 😅 So nice to finally meet in person! How was your trip over?", ru: "О, привет! Я немного рано пришла и просто... рассматривала меню. 😅 Очень приятно познакомиться лично! Как добрались?" },
  "sim.difficultTalk.msg0": { en: "Hey... you said you wanted to talk about something? You look serious. What's going on?", ru: "Привет... ты говорил, что хочешь о чём-то поговорить? Ты выглядишь серьёзным. Что случилось?" },
  "sim.meetParents.msg0": { en: "*opens the door* Well, finally we get to meet you! Come in, come in. We've heard so much about you!", ru: "*открывает дверь* Ну наконец-то мы с вами познакомимся! Проходите, проходите. Мы столько о вас слышали!" },
  "sim.breakup.msg0": { en: "Hey, what's up? You've been really quiet today. Is everything okay?", ru: "Привет, что такое? Ты сегодня очень тихий. Всё нормально?" },
  "sim.jobInterview.msg0": { en: "Nice to meet you. Please, have a seat. So, tell me — why are you interested in this position?", ru: "Приятно познакомиться. Присаживайтесь. Итак, расскажите — почему вас заинтересовала эта позиция?" },
  "sim.askRaise.msg0": { en: "Come in, come in. So — you wanted to chat about something? I've got about twenty minutes before my next meeting.", ru: "Заходите, заходите. Так, вы хотели о чём-то поговорить? У меня минут двадцать до следующей встречи." },
  "sim.giveFeedback.msg0": { en: "Oh hey, you wanted to chat? Sure, what's up? *leans back in chair*", ru: "О, привет, ты хотел поговорить? Конечно, о чём? *откидывается на стуле*" },
  "sim.toxicBoss.msg0": { en: "You again? Look, I don't have time for a long chat. The quarterly numbers are awful. What do you need?", ru: "Опять ты? Слушай, у меня нет времени на долгие разговоры. Квартальные цифры ужасные. Что тебе нужно?" },
  "sim.calmToddler.msg0": { en: "*screaming and kicking* NO! NO! I WANT IT! *flails* THE BLUE ONE! *sobbing* YOU'RE MEAN!", ru: "*орёт и дрыгает ногами* НЕТ! НЕТ! ХОЧУ! *машет руками* СИНЮЮ! *всхлипывает* ТЫ ПЛОХАЯ!" },
  "sim.teenGrades.msg0": { en: "*doesn't look up from phone* Hmm? What is it?", ru: "*не отрывается от телефона* А? Что такое?" },
  "sim.agingParent.msg0": { en: "Oh, you're here! Sit down, I'll make tea. Don't worry about me — I'm perfectly fine.", ru: "О, ты пришёл! Садись, я поставлю чайник. Не волнуйся за меня — я в полном порядке." },
  "sim.sayNo.msg0": { en: "Hey, you free this weekend? Listen, I really need someone to watch Max — my dog — just Saturday and Sunday. You'd be saving my life!", ru: "Слушай, ты свободна в выходные? Мне срочно нужен кто-то присмотреть за Максом — моей собакой. Только сб и вс. Ты меня спасёшь!" },
  "sim.friendCrisis.msg0": { en: "*barely looks up* Hey. Thanks for coming, I guess. Sorry the place is a mess.", ru: "*еле поднимает глаза* Привет. Спасибо, что пришёл, наверное. Извини за беспорядок." },
  "sim.apologize.msg0": { en: "Oh. It's you. *crosses arms* What do you want?", ru: "О. Это ты. *скрещивает руки* Чего тебе?" },
  "sim.neighborNoise.msg0": { en: "*opens door, music blasting behind* Yeah? What's up?", ru: "*открывает дверь, за спиной грохочет музыка* Да? Что такое?" },
  "sim.replyRudeness.msg0": { en: "*loud enough for the room* Well. Maybe if some people actually hit their deadlines, we wouldn't all be scrambling. Just saying.", ru: "*достаточно громко для кабинета* Ну. Может, если бы некоторые реально сдавали в срок, мы бы все не тушили пожар. Просто к слову." },
  "sim.serviceComplaint.msg0": { en: "*looks frazzled* What can I do for you?", ru: "*выглядит замотанно* Чем могу помочь?" },
  "sim.elevatorPitch.msg0": { en: "*checks watch* Going up? So what do you do? I'm always on the lookout for interesting projects.", ru: "*смотрит на часы* Вверх? Так чем вы занимаетесь? Я всегда ищу интересные проекты." },
  "sim.weddingToast.msg0": { en: "*the room goes quiet. Everyone turns to you, glasses raised. Someone whispers: Go on!*", ru: "*в зале стихают. Все поворачиваются к вам, бокалы подняты. Кто-то шепчет: Давай!*" },
  "sim.teamPresentation.msg0": { en: "*room settles down, people open their laptops* Alright, the floor is yours. What've we got?", ru: "*все рассаживаются, открывают ноутбуки* Ну что, слово за вами. Что у нас?" },
  "sim.smallTalk.msg0": { en: "*standing alone near the drinks table* Oh, hi! I think we're both doing the same thing — avoiding eye contact with the room. *laughs* I'm Alex.", ru: "*стоит один у столика с напитками* О, привет! Похоже, мы оба занимаемся одним и тем же — избегаем зрительного контакта. *смеётся* Я Алекс." },
  "sim.awkwardSilence.msg0": { en: "*stands in elevator, staring at the floor counter* Oh, hey. Fancy meeting you here. *forced smile*", ru: "*стоит в лифте, уставившись на табло* О, привет. Какая встреча. *натянутая улыбка*" },
  "sim.comfortStranger.msg0": { en: "*sitting on the bench, wiping eyes quietly* *notices you looking* Sorry, I'm fine. Just... having a day.", ru: "*сидит на скамейке, тихо вытирает глаза* *замечает ваш взгляд* Извините, я в порядке. Просто... такой день." },
  "sim.haggle.msg0": { en: "Welcome, welcome! This one's a beauty, isn't it? Handmade. One of a kind. For you — fifty.", ru: "Добро пожаловать! Красота, правда? Ручная работа. Единственная в своём роде. Для вас — пятьдесят." },
  "sim.salaryOffer.msg0": { en: "We'd love to have you on the team! The offer is $85,000, plus standard benefits. How does that sound?", ru: "Мы будем рады видеть вас в команде! Предложение — $85,000 плюс стандартный пакет. Как вам?" },
  "sim.landlordDispute.msg0": { en: "What? The charges are right there on the statement. Maintenance fee, cleaning fee, and a late payment surcharge.", ru: "Что? Платежи указаны в выписке. Обслуживание, уборка и штраф за просрочку." },
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
  "sim.skills": { en: "Your Skills", ru: "Ваши навыки" },
  "sim.empathy": { en: "Empathy", ru: "Эмпатия" },
  "sim.clarity": { en: "Clarity", ru: "Ясность" },
  "sim.emotionalControl": { en: "Composure", ru: "Самообладание" },
  "sim.assertiveness": { en: "Assertiveness", ru: "Уверенность" },
  "sim.phase": { en: "Phase", ru: "Фаза" },
  "sim.phaseOpening": { en: "Opening", ru: "Начало" },
  "sim.phaseBuilding": { en: "Building", ru: "Развитие" },
  "sim.phaseDeep": { en: "Deep Talk", ru: "Глубокий диалог" },
  "sim.phaseClosing": { en: "Closing", ru: "Завершение" },
  "sim.turn": { en: "Turn", ru: "Ход" },
  "sim.bestTurn": { en: "Best turn", ru: "Лучший ход" },
  "sim.avgQuality": { en: "Avg quality", ru: "Среднее качество" },
  "sim.emotionHistory": { en: "Emotion Trend", ru: "Динамика эмоций" },
  "sim.aiTip": { en: "AI Coach Tip", ru: "Совет от ИИ" },
  "sim.trustful": { en: "Trustful", ru: "Доверительный" },
  "sim.open": { en: "Open", ru: "Открытый" },
  "sim.neutralMood": { en: "Neutral", ru: "Нейтральный" },
  "sim.tenseMood": { en: "Tense", ru: "Напряжённый" },
  "sim.hostile": { en: "Hostile", ru: "Враждебный" },
  "sim.excellent": { en: "Excellent resonance!", ru: "Отличный резонанс!" },
  "sim.goodProgress": { en: "Good progress", ru: "Хороший прогресс" },
  "sim.keepTrying": { en: "Keep trying...", ru: "Продолжайте..." },
  "sim.stats": { en: "Session Stats", ru: "Статистика сессии" },

  // Hints — specific, actionable tips for natural dialogue
  "hint.first-date": { en: "Ask follow-up questions about what they share. React to specifics — 'That sounds amazing!' beats 'Cool!'.", ru: "Задавайте уточняющие вопросы. Реагируйте на детали — «Звучит здорово!» лучше, чем «Круто»." },
  "hint.difficult-talk": { en: "Use 'I feel...' instead of 'You always...'. Be specific about what bothers you.", ru: "Говорите «Я чувствую...» вместо «Ты всегда...». Будьте конкретны в том, что беспокоит." },
  "hint.meet-parents": { en: "Show genuine interest in their stories. Compliment the home or food. Ask about how they met.", ru: "Проявляйте искренний интерес к их историям. Похвалите дом или еду. Спросите, как они познакомились." },
  "hint.breakup": { en: "Be honest about your reasons. Don't blame them — own your feelings. Give them space to react.", ru: "Будьте честны в причинах. Не обвиняйте — говорите от себя. Дайте им пространство для реакции." },
  "hint.job-interview": { en: "Use the STAR method: Situation, Task, Action, Result. Be specific and quantify achievements.", ru: "Используйте метод STAR: Ситуация, Задача, Действие, Результат. Будьте конкретны и оцифровывайте достижения." },
  "hint.ask-raise": { en: "Name 2–3 concrete achievements. Use 'I' and confident tone: 'I delivered X' not 'We kinda did X'.", ru: "Назовите 2–3 конкретных результата. Говорите уверенно: «Я сделал X», а не «Мы вроде как сделали X»." },
  "hint.give-feedback": { en: "Start with something positive. Be specific: 'The Henderson report had X issue' not 'Your work is bad'.", ru: "Начните с позитивного. Будьте конкретны: «В отчёте Хендерсона была проблема X», а не «Твоя работа плохая»." },
  "hint.toxic-boss": { en: "Stay calm and professional. Use facts, not emotions: 'I completed X on time' not 'You're being unfair'.", ru: "Сохраняйте спокойствие и профессионализм. Используйте факты: «Я сделал X вовремя», а не «Вы несправедливы»." },
  "hint.calm-toddler": { en: "Name their feeling first: 'You're upset because...' Then offer a small choice: 'Juice or water?'", ru: "Сначала назовите чувство: «Ты расстроился, потому что...» Потом дайте выбор: «Сок или вода?»" },
  "hint.teen-grades": { en: "Ask open questions: 'What's going on at school?' Show curiosity, not judgment.", ru: "Задавайте открытые вопросы: «Что происходит в школе?» Проявляйте любопытство, а не осуждение." },
  "hint.aging-parent": { en: "Respect their independence. Offer choices, not ultimatums: 'Would you prefer X or Y?'", ru: "Уважайте их независимость. Предлагайте выбор, а не ультиматумы: «Тебе больше подойдёт X или Y?»" },
  "hint.say-no": { en: "Be clear and kind: 'I can't do it' + brief reason. Offer an alternative if you can.", ru: "Скажите чётко и доброжелательно: «Я не смогу» + короткая причина. Предложите альтернативу, если возможно." },
  "hint.friend-crisis": { en: "Just listen. Don't rush to fix. 'That sounds really hard' is powerful. Let silence be okay.", ru: "Просто слушайте. Не спешите решать. «Звучит очень тяжело» — это мощно. Пусть пауза будет нормой." },
  "hint.apologize": { en: "Take full responsibility. Say what you did wrong. Don't add 'but' or 'if'. Ask what they need.", ru: "Возьмите полную ответственность. Скажите, что вы сделали не так. Не добавляйте «но» или «если». Спросите, что им нужно." },
  "hint.neighbor-noise": { en: "Be friendly, not confrontational. 'Hey, I think the music might be a bit loud' works better than demands.", ru: "Будьте дружелюбны, не конфликтны. «Привет, кажется, музыка немного громкая» работает лучше требований." },
  "hint.reply-rudeness": { en: "Stay calm. Name the impact: 'That felt personal.' Ask to talk privately later.", ru: "Сохраняйте спокойствие. Озвучьте эффект: «Это прозвучало как личное.» Предложите поговорить с глазу на глаз." },
  "hint.service-complaint": { en: "Be specific about the problem. Stay calm and ask for a solution: 'What can we do about this?'", ru: "Конкретизируйте проблему. Будьте спокойны и спросите о решении: «Что мы можем с этим сделать?»" },
  "hint.elevator-pitch": { en: "Lead with the problem you solve, not features. End with a clear ask. Keep it under 60 seconds.", ru: "Начните с проблемы, которую решаете, а не с функций. Завершите чётким предложением. Уложитесь в 60 секунд." },
  "hint.wedding-toast": { en: "Open with one funny memory, then one heartfelt line. Keep it under 2 min.", ru: "Начните с одной забавной истории, затем — что-то душевное. Держитесь до 2 минут." },
  "hint.team-presentation": { en: "Start with the key takeaway. Use data to back your points. Anticipate objections.", ru: "Начните с главного вывода. Подкрепляйте данными. Предвосхищайте возражения." },
  "hint.small-talk": { en: "Ask open-ended questions. Find common ground. 'What brings you here?' is a great opener.", ru: "Задавайте открытые вопросы. Ищите общее. «Что привело вас сюда?» — отличное начало." },
  "hint.awkward-silence": { en: "Reference something specific: last meeting, shared project. Avoid weather talk. Humor helps.", ru: "Упомяните что-то конкретное: встречу, общий проект. Избегайте разговоров о погоде. Юмор помогает." },
  "hint.comfort-stranger": { en: "Be gentle: 'Hey, are you okay?' Give them space to decline. Presence > advice.", ru: "Будьте осторожны: «Привет, вы в порядке?» Дайте им возможность отказаться. Присутствие > советы." },
  "hint.haggle": { en: "Start lower than your target. Be friendly. Show you like the item but have a budget.", ru: "Начните ниже цели. Будьте дружелюбны. Покажите, что вам нравится вещь, но есть бюджет." },
  "hint.salary-offer": { en: "Know your market value. Counter with a specific number + reasoning. Don't accept the first offer.", ru: "Знайте свою рыночную стоимость. Контрпредложите конкретную цифру + обоснование. Не соглашайтесь на первое предложение." },
  "hint.landlord-dispute": { en: "Reference your lease. Stay factual and calm. Document everything in writing.", ru: "Ссылайтесь на договор. Будьте спокойны и оперируйте фактами. Фиксируйте всё письменно." },
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
  "feedback.xpEarned": { en: "XP Earned", ru: "Заработано XP" },
  "feedback.saveError": { en: "Failed to save result", ru: "Не удалось сохранить результат" },
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

  // Achievements — Milestones
  "ach.first-sim": { en: "First Steps", ru: "Первые шаги" },
  "ach.sessions-5": { en: "Getting Started", ru: "Начало пути" },
  "ach.sessions-25": { en: "Regular", ru: "Завсегдатай" },
  "ach.sessions-100": { en: "Veteran", ru: "Ветеран" },
  "ach.sessions-500": { en: "Communication Sensei", ru: "Сенсей общения" },
  "ach.level-3": { en: "Apprentice", ru: "Ученик" },
  "ach.level-5": { en: "Rising Star", ru: "Восходящая звезда" },
  "ach.level-10": { en: "Communication Pro", ru: "Профессионал" },
  "ach.level-20": { en: "Grandmaster", ru: "Грандмастер" },

  // Achievements — Dedication
  "ach.streak-3": { en: "On a Roll", ru: "В ударе" },
  "ach.streak-7": { en: "Week Warrior", ru: "Недельный марафон" },
  "ach.streak-30": { en: "Iron Will", ru: "Железная воля" },
  "ach.streak-100": { en: "Unstoppable", ru: "Неостановимый" },
  "ach.all-categories": { en: "Well-Rounded", ru: "Разносторонний" },
  "ach.all-scenarios": { en: "Explorer", ru: "Исследователь" },

  // Achievements — Skill
  "ach.empathy-70": { en: "Empathetic", ru: "Эмпатичный" },
  "ach.empathy-master": { en: "Empathy Master", ru: "Мастер эмпатии" },
  "ach.clarity-70": { en: "Clear Speaker", ru: "Ясный оратор" },
  "ach.clarity-master": { en: "Crystal Clear", ru: "Кристальная ясность" },
  "ach.control-70": { en: "Composed", ru: "Сдержанный" },
  "ach.control-master": { en: "Zen Master", ru: "Дзен-мастер" },
  "ach.assertive-70": { en: "Assertive", ru: "Уверенный" },
  "ach.assertive-master": { en: "Iron Confidence", ru: "Железная уверенность" },
  "ach.all-skills-80": { en: "Renaissance", ru: "Человек-ренессанс" },

  // Achievements — Category mastery
  "ach.conflict-ace": { en: "Conflict Ace", ru: "Ас конфликтов" },
  "ach.public-star": { en: "Stage Star", ru: "Звезда сцены" },
  "ach.negotiator": { en: "Deal Maker", ru: "Мастер сделок" },
  "ach.romance-pro": { en: "Charmer", ru: "Обаятельный" },
  "ach.family-pro": { en: "Family Whisperer", ru: "Семейный мудрец" },
  "ach.stranger-pro": { en: "Social Butterfly", ru: "Душа компании" },
  "ach.work-pro": { en: "Office Diplomat", ru: "Офисный дипломат" },

  // Achievements — Special
  "ach.perfect-session": { en: "Flawless", ru: "Безупречный" },
  "ach.hard-mode-win": { en: "Against All Odds", ru: "Вопреки всему" },
  "ach.comeback": { en: "Comeback Kid", ru: "Возвращение" },
  "ach.night-owl": { en: "Night Owl", ru: "Ночная сова" },
  "ach.early-bird": { en: "Early Bird", ru: "Ранняя пташка" },
  "ach.marathon": { en: "Marathon Talker", ru: "Марафонец" },
  "ach.speed-run": { en: "Quick Connect", ru: "Быстрый контакт" },

  // Achievement tiers
  "tier.bronze": { en: "Bronze", ru: "Бронза" },
  "tier.silver": { en: "Silver", ru: "Серебро" },
  "tier.gold": { en: "Gold", ru: "Золото" },
  "tier.diamond": { en: "Diamond", ru: "Бриллиант" },

  // Achievement categories
  "achCat.milestone": { en: "Milestones", ru: "Этапы" },
  "achCat.skill": { en: "Skills", ru: "Навыки" },
  "achCat.dedication": { en: "Dedication", ru: "Преданность" },
  "achCat.mastery": { en: "Mastery", ru: "Мастерство" },
  "achCat.social": { en: "Social", ru: "Социальные" },
  "achCat.special": { en: "Special", ru: "Особые" },

  // Personality traits
  "trait.empathy_orientation": { en: "Empathy", ru: "Эмпатия" },
  "trait.assertiveness_drive": { en: "Assertiveness", ru: "Настойчивость" },
  "trait.composure_index": { en: "Composure", ru: "Самообладание" },
  "trait.clarity_precision": { en: "Clarity", ru: "Ясность речи" },
  "trait.adaptability": { en: "Adaptability", ru: "Адаптивность" },
  "trait.persistence": { en: "Growth", ru: "Рост" },

  // Personality trait descriptions
  "traitDesc.empathy_orientation": { en: "Your ability to understand and share others' feelings", ru: "Ваша способность понимать и разделять чувства других" },
  "traitDesc.assertiveness_drive": { en: "How firmly and clearly you stand your ground", ru: "Насколько уверенно и чётко вы отстаиваете свою позицию" },
  "traitDesc.composure_index": { en: "Your emotional regulation under pressure", ru: "Ваша эмоциональная регуляция под давлением" },
  "traitDesc.clarity_precision": { en: "How clear and structured your communication is", ru: "Насколько ясно и структурировано вы общаетесь" },
  "traitDesc.adaptability": { en: "How well you handle diverse social situations", ru: "Насколько хорошо вы справляетесь с разными ситуациями" },
  "traitDesc.persistence": { en: "Your improvement trend over time", ru: "Ваша тенденция к улучшению со временем" },

  // Archetypes
  "archetype.newcomer": { en: "Newcomer", ru: "Новичок" },
  "archetype.diplomat": { en: "Diplomat", ru: "Дипломат" },
  "archetype.leader": { en: "Leader", ru: "Лидер" },
  "archetype.empath": { en: "Empath", ru: "Эмпат" },
  "archetype.analyst": { en: "Analyst", ru: "Аналитик" },
  "archetype.mediator": { en: "Mediator", ru: "Медиатор" },
  "archetype.persuader": { en: "Persuader", ru: "Убеждатель" },

  "archetypeDesc.newcomer": { en: "You're just getting started — keep practicing to discover your communication style!", ru: "Вы только начинаете — продолжайте практику, чтобы раскрыть свой стиль общения!" },
  "archetypeDesc.diplomat": { en: "You balance empathy with composure. People feel safe and heard around you.", ru: "Вы сочетаете эмпатию и самообладание. Рядом с вами люди чувствуют себя в безопасности." },
  "archetypeDesc.leader": { en: "You communicate with clarity and confidence. People follow your direction naturally.", ru: "Вы общаетесь ясно и уверенно. Люди естественно следуют за вашим направлением." },
  "archetypeDesc.empath": { en: "You deeply understand others' emotions. Your warmth creates genuine connections.", ru: "Вы глубоко понимаете эмоции других. Ваша теплота создаёт искренние связи." },
  "archetypeDesc.analyst": { en: "You bring structure and precision to conversations. Your logic cuts through confusion.", ru: "Вы вносите структуру и точность в разговоры. Ваша логика рассеивает путаницу." },
  "archetypeDesc.mediator": { en: "You find common ground where others see conflict. A natural peacemaker.", ru: "Вы находите общий язык там, где другие видят конфликт. Прирождённый миротворец." },
  "archetypeDesc.persuader": { en: "You combine clarity with adaptability. People find your arguments compelling.", ru: "Вы сочетаете ясность с гибкостью. Люди находят ваши аргументы убедительными." },

  // Profile sections
  "profile.personalityProfile": { en: "Communication Profile", ru: "Коммуникативный профиль" },
  "profile.yourArchetype": { en: "Your archetype", ru: "Ваш архетип" },
  "profile.sessionsAnalyzed": { en: "sessions analyzed", ru: "сессий проанализировано" },
  "profile.achievementProgress": { en: "Achievement Progress", ru: "Прогресс достижений" },

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

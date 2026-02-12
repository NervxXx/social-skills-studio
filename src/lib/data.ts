export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface Scenario {
  id: string;
  title: string;
  emoji: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number; // minutes
  description: string;
}

export const categories: Category[] = [
  { id: "romance", name: "Romance", emoji: "💕" },
  { id: "work", name: "Work", emoji: "💼" },
  { id: "family", name: "Family", emoji: "👨‍👩‍👧" },
  { id: "friends", name: "Friends", emoji: "🤝" },
  { id: "conflict", name: "Conflict", emoji: "⚡" },
  { id: "public-speaking", name: "Public Speaking", emoji: "🎤" },
];

export const scenarios: Scenario[] = [
  {
    id: "first-date",
    title: "First date jitters",
    emoji: "💕",
    category: "romance",
    difficulty: "easy",
    duration: 5,
    description: "You're meeting someone for the first time at a café. Keep the conversation flowing naturally and make a genuine connection.",
  },
  {
    id: "ask-raise",
    title: "Ask for a raise",
    emoji: "💼",
    category: "work",
    difficulty: "medium",
    duration: 8,
    description: "You've been excelling at your job for a year. It's time to have that conversation with your manager about a salary increase.",
  },
  {
    id: "calm-toddler",
    title: "Calm crying toddler",
    emoji: "👶",
    category: "family",
    difficulty: "medium",
    duration: 7,
    description: "Your 3-year-old is having a meltdown in the grocery store. Use empathy and patience to de-escalate the situation.",
  },
  {
    id: "say-no",
    title: "Say no to a friend",
    emoji: "🤝",
    category: "friends",
    difficulty: "easy",
    duration: 4,
    description: "Your friend keeps asking you for favors that drain your energy. Practice setting healthy boundaries with kindness.",
  },
  {
    id: "reply-rudeness",
    title: "Reply to rudeness",
    emoji: "⚡",
    category: "conflict",
    difficulty: "hard",
    duration: 6,
    description: "A coworker just made a snarky comment in front of the whole team. Respond assertively without escalating the conflict.",
  },
  {
    id: "wedding-toast",
    title: "Wedding toast",
    emoji: "🥂",
    category: "public-speaking",
    difficulty: "hard",
    duration: 5,
    description: "You're the best man/maid of honor. Deliver a heartfelt, funny, and memorable wedding toast to the happy couple.",
  },
];

export const recentScenarios = [
  { scenarioId: "first-date", score: 82, date: "Yesterday" },
  { scenarioId: "say-no", score: 74, date: "2 days ago" },
];

// Simulated chat responses per scenario
export const simulatedResponses: Record<string, string[]> = {
  "first-date": [
    "Hi! It's so nice to finally meet you in person. I was a little nervous coming here, to be honest. 😊",
    "Oh really? That's so cool! I've always wanted to try that. What got you into it?",
    "Ha, I love that story! You seem like someone who's really passionate about what they do.",
    "So, what's your idea of a perfect weekend? I'm curious!",
  ],
  "ask-raise": [
    "Sure, come on in. What did you want to discuss?",
    "I appreciate you bringing this up. Can you walk me through your contributions this year?",
    "Those are solid points. Let me think about this and get back to you by Friday.",
    "I want to be fair. Let's schedule a follow-up to discuss numbers.",
  ],
  "calm-toddler": [
    "*crying loudly* I WANT THE TOY! I WANT IT NOW!",
    "*sniffling* But... but I really want it...",
    "*calming down slightly* You promise we can come back?",
    "*holds your hand* Okay... can we get juice instead?",
  ],
  "say-no": [
    "Hey! Can you do me a huge favor? I need someone to watch my dog this weekend. You're the best!",
    "Oh come on, it's just for two days! You never say no to me.",
    "I guess I understand... but who else am I going to ask?",
    "You're right, I should plan ahead. Thanks for being honest with me.",
  ],
  "reply-rudeness": [
    "*in front of the team* Well, maybe if SOME people actually finished their work on time, we wouldn't be behind schedule.",
    "I'm just saying what everyone else is thinking. Don't be so sensitive.",
    "...Fine. Maybe I could have said it differently.",
    "You're right. I'll bring it up privately next time. Sorry about that.",
  ],
  "wedding-toast": [
    "*crowd looks at you expectantly, glasses raised*",
    "*laughter from the audience* Keep going, this is great!",
    "*bride/groom wipes a tear* That's so sweet...",
    "*cheers and applause* To the happy couple! 🥂",
  ],
};

export const achievements = [
  { id: "first-sim", name: "First Steps", emoji: "👣", description: "Complete your first simulation", unlocked: true },
  { id: "empathy-master", name: "Empathy Master", emoji: "💖", description: "Score 90%+ in empathy", unlocked: true },
  { id: "streak-3", name: "On a Roll", emoji: "🔥", description: "3-day practice streak", unlocked: false },
  { id: "all-categories", name: "Well-Rounded", emoji: "🌍", description: "Try all 6 categories", unlocked: false },
  { id: "conflict-ace", name: "Conflict Ace", emoji: "🕊️", description: "Ace a conflict scenario", unlocked: false },
  { id: "public-star", name: "Stage Star", emoji: "⭐", description: "Nail a public speaking scenario", unlocked: false },
];

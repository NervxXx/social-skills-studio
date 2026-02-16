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

// Simulated chat responses per scenario (fallback when API fails — natural, varied)
export const simulatedResponses: Record<string, string[]> = {
  "first-date": [
    "Oh, hi! Sorry, I got here early and was just... staring at the menu. 😅 So nice to finally meet! How was your trip?",
    "Wait, you actually do that? That's so interesting — I've always been curious but never tried. What got you into it?",
    "Haha, okay, that story is going to stay with me. You seem like someone who really goes for things. I like that.",
    "A perfect weekend... hm. Low-key, good coffee, maybe a walk? Nothing too crazy. What about you?",
  ],
  "ask-raise": [
    "Come in. So — you wanted to talk about something? I've got about twenty minutes.",
    "Okay. I appreciate you bringing this up. Walk me through it — what's your thinking?",
    "Those are... fair points. I'll need to look at the numbers. Can we reconvene Friday?",
    "I want to be fair. Let me talk to HR and get back to you. No promises, but I'll see what we can do.",
  ],
  "calm-toddler": [
    "*screaming* NO! I WANT IT! *kicks* THE BLUE ONE! *sobbing* YOU'RE MEAN!",
    "*sniffling* But... I really, really wanted it... *big tears*",
    "*quieter* You promise? You promise we come back? *clutching your sleeve*",
    "*nods slowly* Okay... Can we get juice? The red kind? *reaches for your hand*",
  ],
  "say-no": [
    "Hey! Listen, I really need someone to watch Max this weekend. You're literally the only person I can ask. Please?",
    "Come on, it's two days! I'd do it for you in a heartbeat. You never say no to me.",
    "Seriously? I mean... I get it, I guess. But who else am I supposed to ask last minute?",
    "Okay, okay. You're right, I should've asked earlier. Thanks for at least being straight with me.",
  ],
  "reply-rudeness": [
    "*loud enough for everyone* Maybe if some people actually hit their deadlines, we wouldn't all be scrambling. Just saying.",
    "I'm saying what everyone's thinking. Don't take it so personally.",
    "...Fine. Maybe I could've phrased it better. But the point stands.",
    "You're right. I'll bring it up one-on-one next time. Sorry for the drama.",
  ],
  "wedding-toast": [
    "*the room goes quiet. Everyone turns to you, glasses raised. A whisper: Go on!*",
    "*laughter ripples through the crowd* Oh god, that's perfect! Keep going!",
    "*someone dabs their eyes* That's so sweet... *sniffle*",
    "*cheers and glasses clinking* To the happy couple! 🥂",
  ],
};

export const achievements = [
  { id: "first-sim", name: "First Steps", emoji: "👣", description: "Complete your first simulation" },
  { id: "empathy-master", name: "Empathy Master", emoji: "💖", description: "Score 90%+ in empathy" },
  { id: "streak-3", name: "On a Roll", emoji: "🔥", description: "3-day practice streak" },
  { id: "all-categories", name: "Well-Rounded", emoji: "🌍", description: "Try all 6 categories" },
  { id: "conflict-ace", name: "Conflict Ace", emoji: "🕊️", description: "Ace a conflict scenario" },
  { id: "public-star", name: "Stage Star", emoji: "⭐", description: "Nail a public speaking scenario" },
];

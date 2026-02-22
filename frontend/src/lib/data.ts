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
  required_level: number;
}

export const categories: Category[] = [
  { id: "romance", name: "Romance", emoji: "💕" },
  { id: "work", name: "Work", emoji: "💼" },
  { id: "family", name: "Family", emoji: "👨‍👩‍👧" },
  { id: "friends", name: "Friends", emoji: "🤝" },
  { id: "conflict", name: "Conflict", emoji: "⚡" },
  { id: "public-speaking", name: "Public Speaking", emoji: "🎤" },
  { id: "strangers", name: "Strangers", emoji: "🫂" },
  { id: "negotiations", name: "Negotiations", emoji: "🎯" },
];

export const scenarios: Scenario[] = [
  // ── Romance ──
  {
    id: "first-date",
    title: "First date jitters",
    emoji: "💕",
    category: "romance",
    difficulty: "easy",
    duration: 5,
    description: "You're meeting someone for the first time at a café. Keep the conversation flowing naturally and make a genuine connection.",
    required_level: 1,
  },
  {
    id: "difficult-talk",
    title: "Difficult conversation",
    emoji: "💔",
    category: "romance",
    difficulty: "medium",
    duration: 8,
    description: "Something has been bothering you in the relationship. Have an honest, caring conversation without turning it into a fight.",
    required_level: 3,
  },
  {
    id: "meet-parents",
    title: "Meet the parents",
    emoji: "👨‍👩‍👦",
    category: "romance",
    difficulty: "hard",
    duration: 10,
    description: "You're meeting your partner's parents for the first time at dinner. Navigate tricky questions and make a good impression.",
    required_level: 5,
  },
  {
    id: "breakup",
    title: "Compassionate breakup",
    emoji: "🥀",
    category: "romance",
    difficulty: "hard",
    duration: 10,
    description: "The relationship isn't working. End it with honesty and compassion, without causing unnecessary hurt.",
    required_level: 8,
  },

  // ── Work ──
  {
    id: "job-interview",
    title: "Job interview",
    emoji: "🎯",
    category: "work",
    difficulty: "easy",
    duration: 8,
    description: "You're in a job interview. Answer tough questions confidently and show your strengths without bragging.",
    required_level: 1,
  },
  {
    id: "ask-raise",
    title: "Ask for a raise",
    emoji: "💼",
    category: "work",
    difficulty: "medium",
    duration: 8,
    description: "You've been excelling at your job for a year. It's time to have that conversation with your manager about a salary increase.",
    required_level: 1,
  },
  {
    id: "give-feedback",
    title: "Give feedback",
    emoji: "📋",
    category: "work",
    difficulty: "medium",
    duration: 7,
    description: "A colleague's work quality has dropped. Give constructive, specific feedback that motivates rather than demoralizes.",
    required_level: 3,
  },
  {
    id: "toxic-boss",
    title: "Toxic boss",
    emoji: "😤",
    category: "work",
    difficulty: "hard",
    duration: 10,
    description: "Your boss is being unreasonable and micromanaging. Stand up for yourself professionally without burning bridges.",
    required_level: 7,
  },

  // ── Family ──
  {
    id: "calm-toddler",
    title: "Calm crying toddler",
    emoji: "👶",
    category: "family",
    difficulty: "medium",
    duration: 7,
    description: "Your 3-year-old is having a meltdown in the grocery store. Use empathy and patience to de-escalate the situation.",
    required_level: 1,
  },
  {
    id: "teen-grades",
    title: "Teen's grades",
    emoji: "📚",
    category: "family",
    difficulty: "medium",
    duration: 8,
    description: "Your teenager's grades have been dropping. Talk to them without lecturing — understand what's going on and find a solution together.",
    required_level: 3,
  },
  {
    id: "aging-parent",
    title: "Aging parent",
    emoji: "🧓",
    category: "family",
    difficulty: "hard",
    duration: 10,
    description: "Your elderly parent is struggling to live alone but refuses help. Gently convince them while respecting their independence.",
    required_level: 6,
  },

  // ── Friends ──
  {
    id: "say-no",
    title: "Say no to a friend",
    emoji: "🤝",
    category: "friends",
    difficulty: "easy",
    duration: 4,
    description: "Your friend keeps asking you for favors that drain your energy. Practice setting healthy boundaries with kindness.",
    required_level: 1,
  },
  {
    id: "friend-crisis",
    title: "Friend in crisis",
    emoji: "💙",
    category: "friends",
    difficulty: "medium",
    duration: 8,
    description: "Your close friend is going through a tough time and is barely holding it together. Be there for them without giving unsolicited advice.",
    required_level: 3,
  },
  {
    id: "apologize",
    title: "Sincere apology",
    emoji: "🙏",
    category: "friends",
    difficulty: "medium",
    duration: 7,
    description: "You said something hurtful to a friend and need to apologize. Make it genuine — no excuses, no deflecting.",
    required_level: 5,
  },

  // ── Conflict ──
  {
    id: "neighbor-noise",
    title: "Noisy neighbor",
    emoji: "🔊",
    category: "conflict",
    difficulty: "easy",
    duration: 5,
    description: "Your neighbor's loud music keeps you awake. Ask them to quiet down without starting a feud.",
    required_level: 1,
  },
  {
    id: "reply-rudeness",
    title: "Reply to rudeness",
    emoji: "⚡",
    category: "conflict",
    difficulty: "hard",
    duration: 6,
    description: "A coworker just made a snarky comment in front of the whole team. Respond assertively without escalating the conflict.",
    required_level: 1,
  },
  {
    id: "service-complaint",
    title: "Bad service",
    emoji: "🍽️",
    category: "conflict",
    difficulty: "medium",
    duration: 6,
    description: "You received terrible service at a restaurant. Complain effectively to get a resolution, without being rude to the staff.",
    required_level: 4,
  },

  // ── Public Speaking ──
  {
    id: "elevator-pitch",
    title: "Elevator pitch",
    emoji: "🚀",
    category: "public-speaking",
    difficulty: "easy",
    duration: 4,
    description: "You're in an elevator with a potential investor. Pitch your startup idea in 60 seconds — clear, exciting, memorable.",
    required_level: 2,
  },
  {
    id: "wedding-toast",
    title: "Wedding toast",
    emoji: "🥂",
    category: "public-speaking",
    difficulty: "hard",
    duration: 5,
    description: "You're the best man/maid of honor. Deliver a heartfelt, funny, and memorable wedding toast to the happy couple.",
    required_level: 1,
  },
  {
    id: "team-presentation",
    title: "Team presentation",
    emoji: "📊",
    category: "public-speaking",
    difficulty: "medium",
    duration: 8,
    description: "Present your project results to the team and stakeholders. Keep it clear, engaging, and handle tough questions.",
    required_level: 4,
  },

  // ── Strangers ──
  {
    id: "small-talk",
    title: "Networking event",
    emoji: "🗣️",
    category: "strangers",
    difficulty: "easy",
    duration: 5,
    description: "You're at a networking event and don't know anyone. Start a conversation with a stranger and keep it going naturally.",
    required_level: 2,
  },
  {
    id: "awkward-silence",
    title: "Awkward silence",
    emoji: "😶",
    category: "strangers",
    difficulty: "medium",
    duration: 6,
    description: "You're stuck in an elevator with an acquaintance and the conversation died. Revive it without making it more awkward.",
    required_level: 4,
  },
  {
    id: "comfort-stranger",
    title: "Comfort a stranger",
    emoji: "🤗",
    category: "strangers",
    difficulty: "hard",
    duration: 7,
    description: "A stranger on public transit is visibly upset, quietly crying. Approach with care — offer support without overstepping.",
    required_level: 7,
  },

  // ── Negotiations ──
  {
    id: "haggle",
    title: "Haggle a deal",
    emoji: "💰",
    category: "negotiations",
    difficulty: "easy",
    duration: 5,
    description: "You found a great item at a flea market. Negotiate a fair price — be friendly but don't overpay.",
    required_level: 2,
  },
  {
    id: "salary-offer",
    title: "Salary negotiation",
    emoji: "📈",
    category: "negotiations",
    difficulty: "medium",
    duration: 8,
    description: "You got a job offer but the salary is below your expectations. Negotiate higher without losing the offer.",
    required_level: 5,
  },
  {
    id: "landlord-dispute",
    title: "Landlord dispute",
    emoji: "🏠",
    category: "negotiations",
    difficulty: "hard",
    duration: 8,
    description: "Your landlord added unfair charges to your bill. Dispute them calmly but firmly, knowing your rights.",
    required_level: 7,
  },
];

// Simulated chat responses per scenario (fallback when API fails)
export const simulatedResponses: Record<string, string[]> = {
  "first-date": [
    "Oh, hi! Sorry, I got here early and was just... staring at the menu. 😅 So nice to finally meet! How was your trip?",
    "Wait, you actually do that? That's so interesting — I've always been curious but never tried. What got you into it?",
    "Haha, okay, that story is going to stay with me. You seem like someone who really goes for things. I like that.",
    "A perfect weekend... hm. Low-key, good coffee, maybe a walk? Nothing too crazy. What about you?",
  ],
  "difficult-talk": [
    "Hey... you said you wanted to talk about something? You look serious. What's going on?",
    "Okay... I'm listening. But I have to admit, this is making me a little anxious. Just say it.",
    "I... didn't realize you felt that way. I thought everything was fine between us.",
    "I need a moment. This is a lot to process. Can we... take a breath?",
  ],
  "meet-parents": [
    "*opens the door* Well, finally we get to meet you! Come in, come in. We've heard so much about you!",
    "So, what is it that you do? Our child hasn't been very specific. *adjusts glasses and leans forward*",
    "Hmm. And what are your plans for the future? I mean... long-term. *exchanges a look with spouse*",
    "Well, you seem nice enough. *softening* Would you like some more pie? I made it this morning.",
  ],
  "breakup": [
    "Hey, what's up? You've been really quiet today. Is everything okay?",
    "Wait... is this what I think it is? Are you... breaking up with me?",
    "*voice cracks* But I thought we were working through things. What changed?",
    "*long silence* I... I need some time. I can't really talk about this right now.",
  ],
  "job-interview": [
    "Nice to meet you. Please, have a seat. So, tell me — why are you interested in this position?",
    "Interesting. Can you walk me through a time you faced a real challenge at work? What happened?",
    "Okay. And where do you see yourself in three to five years?",
    "Good. Do you have any questions for us? This is your chance to learn about the team.",
  ],
  "ask-raise": [
    "Come in. So — you wanted to talk about something? I've got about twenty minutes.",
    "Okay. I appreciate you bringing this up. Walk me through it — what's your thinking?",
    "Those are... fair points. I'll need to look at the numbers. Can we reconvene Friday?",
    "I want to be fair. Let me talk to HR and get back to you. No promises, but I'll see what we can do.",
  ],
  "give-feedback": [
    "Oh hey, you wanted to chat? Sure, what's up? *leans back in chair*",
    "Hmm... is this about the Henderson report? I know it was a bit rushed.",
    "*shifts uncomfortably* I mean, I've been dealing with a lot. It's not like I don't care.",
    "Okay, fair enough. I appreciate you being straight with me. What should I focus on first?",
  ],
  "toxic-boss": [
    "You again? Look, I don't have time for a long chat. The quarterly numbers are awful. What do you need?",
    "*sighs loudly* Everyone thinks they're overworked. You think I'm not? I need this by end of day.",
    "Are you seriously pushing back on this? I expected more from you, honestly.",
    "*pauses* Fine. Maybe I've been... a bit intense. But don't think this changes the deadline.",
  ],
  "calm-toddler": [
    "*screaming* NO! I WANT IT! *kicks* THE BLUE ONE! *sobbing* YOU'RE MEAN!",
    "*sniffling* But... I really, really wanted it... *big tears*",
    "*quieter* You promise? You promise we come back? *clutching your sleeve*",
    "*nods slowly* Okay... Can we get juice? The red kind? *reaches for your hand*",
  ],
  "teen-grades": [
    "*doesn't look up from phone* Hmm? What is it?",
    "*puts phone down reluctantly* Okay, fine. What do you want to talk about?",
    "It's not that simple, okay? You don't understand what school is like now. Everything is different.",
    "*quieter* I just... I don't see the point sometimes. Like, what does any of this even matter?",
  ],
  "aging-parent": [
    "Oh, you're here! Sit down, I'll make tea. Don't worry about me — I'm perfectly fine.",
    "I don't need a nurse. I've been living alone for thirty years. I know how to take care of myself.",
    "*stubbornly* Your mother managed alone until she was 90. I'm not that old yet.",
    "*long pause* ...I just don't want to be a burden. You have your own life.",
  ],
  "say-no": [
    "Hey! Listen, I really need someone to watch Max this weekend. You're literally the only person I can ask. Please?",
    "Come on, it's two days! I'd do it for you in a heartbeat. You never say no to me.",
    "Seriously? I mean... I get it, I guess. But who else am I supposed to ask last minute?",
    "Okay, okay. You're right, I should've asked earlier. Thanks for at least being straight with me.",
  ],
  "friend-crisis": [
    "*barely looks up* Hey. Thanks for coming, I guess. Sorry the place is a mess.",
    "I don't really want to talk about it. Or maybe I do. I don't even know anymore.",
    "*voice breaking* It just feels like nothing I do matters, you know? Like, what's the point?",
    "*quietly* You really think so? Because right now it's hard to believe anyone actually cares.",
  ],
  "apologize": [
    "Oh. It's you. *crosses arms* What do you want?",
    "You're sorry? That's it? Do you even know what you said? How that made me feel?",
    "*softening slightly* I mean... I appreciate you saying that. But words are easy.",
    "*sighs* Okay. I hear you. I'm not gonna pretend it's fine overnight, but... I appreciate you showing up.",
  ],
  "neighbor-noise": [
    "*opens door, music blasting behind* Yeah? What's up?",
    "Oh, is it loud? Sorry, didn't realize. We're just having a little get-together.",
    "I mean, it's a Saturday night... But okay, I'll try to keep it down a bit. Fair enough?",
    "Alright, deal. Sorry about that. Have a good night!",
  ],
  "reply-rudeness": [
    "*loud enough for everyone* Maybe if some people actually hit their deadlines, we wouldn't all be scrambling. Just saying.",
    "I'm saying what everyone's thinking. Don't take it so personally.",
    "...Fine. Maybe I could've phrased it better. But the point stands.",
    "You're right. I'll bring it up one-on-one next time. Sorry for the drama.",
  ],
  "service-complaint": [
    "*looks annoyed* What can I do for you?",
    "Look, we've been really busy tonight. I'm sorry if the wait was long, but it happens.",
    "*defensive* The kitchen's been slammed. It's not my fault personally, you know.",
    "*calmer* Okay. You're right, that wasn't acceptable. Let me talk to the manager about this.",
  ],
  "elevator-pitch": [
    "*checks watch* Going up? So what do you do? I'm always looking for interesting projects.",
    "Hm, interesting. But there are a lot of apps that do something similar. What's different about yours?",
    "Okay, I'm intrigued. What's your traction so far? Any users? Revenue?",
    "Not bad. Send me a one-pager. *hands you a card* If the numbers check out, let's talk.",
  ],
  "wedding-toast": [
    "*the room goes quiet. Everyone turns to you, glasses raised. A whisper: Go on!*",
    "*laughter ripples through the crowd* Oh god, that's perfect! Keep going!",
    "*someone dabs their eyes* That's so sweet... *sniffle*",
    "*cheers and glasses clinking* To the happy couple! 🥂",
  ],
  "team-presentation": [
    "*room settles down, people open their laptops* Alright, the floor is yours. What've we got?",
    "Interesting numbers. Can you break down Q3 specifically? The stakeholders will ask about that.",
    "Hold on — what about the timeline? Are we still on track for the March release?",
    "Good overview. I have a few follow-ups, but let's take those offline. Nice work.",
  ],
  "small-talk": [
    "*standing alone near the drinks table* Oh, hi! I think we're both doing the same thing — avoiding eye contact with the room. *laughs* I'm Alex.",
    "So what brings you here? Do you actually know anyone, or is this a 'fake it till you make it' situation?",
    "Ha, same. I work in tech — specifically product management. It's not as exciting as it sounds. What about you?",
    "Well, this has been the least awkward networking conversation I've had tonight. We should grab coffee sometime!",
  ],
  "awkward-silence": [
    "*stands in elevator, staring at the floor counter* Oh, hey. Fancy meeting you here. *forced smile*",
    "*long pause* So... weather's been something, huh? *immediately cringes*",
    "*visibly relieved you said something* Oh yeah? That's actually pretty interesting. Tell me more.",
    "*elevator dings* Well, this is me. Actually, that was a great chat. See you around!",
  ],
  "comfort-stranger": [
    "*sitting on the bench, wiping eyes quietly, trying to hide it* *notices you looking* Sorry, I'm fine. Just... having a day.",
    "*surprised you stopped* You... don't have to do this. We don't even know each other.",
    "*voice shaking* It's just... everything kind of fell apart today. And nobody noticed. Until you.",
    "*small smile through tears* Thank you. Seriously. You didn't have to, but... it helped. More than you know.",
  ],
  "haggle": [
    "Welcome, welcome! This one's a beauty, isn't it? Handmade. One of a kind. For you — fifty.",
    "Thirty? Come on, you're killing me! I've got a family to feed. How about forty-five?",
    "*strokes chin* Hmm... You drive a hard bargain. Forty. Final offer. Take it or leave it.",
    "*grins* Alright, thirty-five. But only because you seem like a good person. Deal? *extends hand*",
  ],
  "salary-offer": [
    "We'd love to have you on the team! The offer is $85,000, plus standard benefits. How does that sound?",
    "I see. Well, the market data we have puts this role in that range. What were you thinking?",
    "That's... at the top of our band. I'll need to check with finance. Can you walk me through your reasoning?",
    "Okay. I think we can work with that. Let me get the revised offer letter drafted. Welcome aboard!",
  ],
  "landlord-dispute": [
    "What? The charges are right there on the statement. Maintenance fee, cleaning fee, and a late payment surcharge.",
    "Look, these are standard charges. Everyone in the building pays them. I don't make the rules.",
    "*getting irritated* Are you really going to fight me on a hundred bucks? Fine. Show me your lease if you think it says otherwise.",
    "*sighs* Alright, you've got a point about the cleaning fee. I'll remove that one. But the maintenance stands.",
  ],
};

export type AchievementTier = "bronze" | "silver" | "gold" | "diamond";

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  tier: AchievementTier;
  category: "milestone" | "skill" | "dedication" | "mastery" | "social" | "special";
}

export const achievements: Achievement[] = [
  // ── Milestones (bronze → diamond) ──
  { id: "first-sim", name: "First Steps", emoji: "👣", description: "Complete your first simulation", tier: "bronze", category: "milestone" },
  { id: "sessions-5", name: "Getting Started", emoji: "📖", description: "Complete 5 simulations", tier: "bronze", category: "milestone" },
  { id: "sessions-25", name: "Regular", emoji: "📚", description: "Complete 25 simulations", tier: "silver", category: "milestone" },
  { id: "sessions-100", name: "Veteran", emoji: "🎖️", description: "Complete 100 simulations", tier: "gold", category: "milestone" },
  { id: "sessions-500", name: "Communication Sensei", emoji: "🏯", description: "Complete 500 simulations", tier: "diamond", category: "milestone" },

  // ── Level milestones ──
  { id: "level-3", name: "Apprentice", emoji: "🌱", description: "Reach level 3", tier: "bronze", category: "milestone" },
  { id: "level-5", name: "Rising Star", emoji: "🌟", description: "Reach level 5", tier: "silver", category: "milestone" },
  { id: "level-10", name: "Communication Pro", emoji: "🏆", description: "Reach level 10", tier: "gold", category: "milestone" },
  { id: "level-20", name: "Grandmaster", emoji: "👑", description: "Reach level 20", tier: "diamond", category: "milestone" },

  // ── Dedication (streaks & consistency) ──
  { id: "streak-3", name: "On a Roll", emoji: "🔥", description: "3-day practice streak", tier: "bronze", category: "dedication" },
  { id: "streak-7", name: "Week Warrior", emoji: "⚔️", description: "7-day practice streak", tier: "silver", category: "dedication" },
  { id: "streak-30", name: "Iron Will", emoji: "🛡️", description: "30-day practice streak", tier: "gold", category: "dedication" },
  { id: "streak-100", name: "Unstoppable", emoji: "💎", description: "100-day practice streak", tier: "diamond", category: "dedication" },
  { id: "all-categories", name: "Well-Rounded", emoji: "🌍", description: "Try all 8 categories", tier: "silver", category: "dedication" },
  { id: "all-scenarios", name: "Explorer", emoji: "🗺️", description: "Try every scenario at least once", tier: "gold", category: "dedication" },

  // ── Skill mastery (per-skill achievements) ──
  { id: "empathy-70", name: "Empathetic", emoji: "💛", description: "Score 70%+ empathy in a session", tier: "bronze", category: "skill" },
  { id: "empathy-master", name: "Empathy Master", emoji: "💖", description: "Score 90%+ empathy in a session", tier: "gold", category: "skill" },
  { id: "clarity-70", name: "Clear Speaker", emoji: "💬", description: "Score 70%+ clarity in a session", tier: "bronze", category: "skill" },
  { id: "clarity-master", name: "Crystal Clear", emoji: "💎", description: "Score 90%+ clarity in a session", tier: "gold", category: "skill" },
  { id: "control-70", name: "Composed", emoji: "🧘", description: "Score 70%+ composure in a session", tier: "bronze", category: "skill" },
  { id: "control-master", name: "Zen Master", emoji: "☯️", description: "Score 90%+ composure in a session", tier: "gold", category: "skill" },
  { id: "assertive-70", name: "Assertive", emoji: "✊", description: "Score 70%+ assertiveness in a session", tier: "bronze", category: "skill" },
  { id: "assertive-master", name: "Iron Confidence", emoji: "🦁", description: "Score 90%+ assertiveness in a session", tier: "gold", category: "skill" },
  { id: "all-skills-80", name: "Renaissance", emoji: "🎨", description: "Score 80%+ in ALL four skills in one session", tier: "diamond", category: "skill" },

  // ── Category mastery ──
  { id: "conflict-ace", name: "Conflict Ace", emoji: "🕊️", description: "Score 85%+ in any conflict scenario", tier: "silver", category: "mastery" },
  { id: "public-star", name: "Stage Star", emoji: "⭐", description: "Score 85%+ in a public speaking scenario", tier: "silver", category: "mastery" },
  { id: "negotiator", name: "Deal Maker", emoji: "🤝", description: "Score 85%+ in a negotiation scenario", tier: "silver", category: "mastery" },
  { id: "romance-pro", name: "Charmer", emoji: "💕", description: "Score 85%+ in a romance scenario", tier: "silver", category: "mastery" },
  { id: "family-pro", name: "Family Whisperer", emoji: "👨‍👩‍👧", description: "Score 85%+ in a family scenario", tier: "silver", category: "mastery" },
  { id: "stranger-pro", name: "Social Butterfly", emoji: "🦋", description: "Score 85%+ in a strangers scenario", tier: "silver", category: "mastery" },
  { id: "work-pro", name: "Office Diplomat", emoji: "🏢", description: "Score 85%+ in a work scenario", tier: "silver", category: "mastery" },

  // ── Special / Hard achievements ──
  { id: "perfect-session", name: "Flawless", emoji: "✨", description: "Score 95%+ overall in any session", tier: "diamond", category: "special" },
  { id: "hard-mode-win", name: "Against All Odds", emoji: "🎲", description: "Score 80%+ on hard difficulty with high mood", tier: "gold", category: "special" },
  { id: "comeback", name: "Comeback Kid", emoji: "🔄", description: "Improve your score by 30+ points on the same scenario", tier: "silver", category: "special" },
  { id: "night-owl", name: "Night Owl", emoji: "🦉", description: "Complete a session after midnight", tier: "bronze", category: "special" },
  { id: "early-bird", name: "Early Bird", emoji: "🐦", description: "Complete a session before 7am", tier: "bronze", category: "special" },
  { id: "marathon", name: "Marathon Talker", emoji: "🏃", description: "Complete a session with 15+ turns", tier: "silver", category: "special" },
  { id: "speed-run", name: "Quick Connect", emoji: "⚡", description: "Score 80%+ in a session under 5 turns", tier: "gold", category: "special" },
];

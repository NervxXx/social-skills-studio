

# SocialSim — AI-Powered Communication Skills Simulator

## Overview
A warm, empathetic mobile-first web app that lets users practice real-life social scenarios through simulated AI conversations, receive feedback on their communication skills, and track their progress over time.

---

## Design System
- **Colors:** Warm peach (#FF8A5C) primary, calm blue (#6C9EBF) secondary, soft cream (#FEFCF3) background
- **Font:** Nunito from Google Fonts — rounded and friendly
- **Corners:** Extra-rounded cards (24px), pill-shaped buttons (999px)
- **Vibe:** Empathetic, warm, psychologically safe

---

## Pages & Features

### 1. Home Page (/)
- Personalized greeting with avatar and notification bell
- XP progress bar showing current level
- Daily goal card with a featured scenario and "Start" button
- Horizontally scrollable category pills (Romance, Work, Family, Friends, Conflict, Public Speaking)
- "Recommended for you" section with horizontally scrollable scenario cards
- Recent scenarios list with scores
- Bottom navigation bar (Home, Explore, Stats, Profile, Settings)

### 2. Explore Page (/explore)
- Search bar to find scenarios
- Filter chips for category, difficulty, and duration
- Responsive grid of scenario cards (2 columns on mobile, 4 on desktop)
- Each card shows emoji/icon, title, difficulty dots, duration, and a "Start" button

### 3. Setup Page (/setup/:scenarioId)
- Scenario title and description
- Difficulty selector as radio cards (Calm, Normal, Challenging)
- AI personality slider (calm → nervous → aggressive)
- Goal picker (De-escalate, Show empathy, Get agreement)
- "Start Simulation" button leading to the simulation

### 4. Simulation Page (/simulation)
- Header with scenario name and AI role
- Scrollable chat area with message bubbles (user = peach gradient right-aligned, AI = gray left-aligned with role avatar)
- Emotion meter bar (red → yellow → green gradient) showing AI's current emotional state
- Real-time empathy score bar
- Text input with send button
- "Hint" button that reveals a suggestion
- "End Simulation" button leading to feedback
- Chat is simulated with static pre-written responses for the MVP

### 5. Feedback Page (/feedback)
- Overall score displayed as a large percentage (0–100%)
- Skill breakdown with bars for Empathy, Clarity, Emotional Control, and Assertiveness
- Key phrases analysis highlighting 2 positive and 2 negative examples
- Tip of the day
- "Practice Again" and "Next Scenario" buttons

### 6. Profile Page (/profile)
- Avatar, display name, level, and total XP
- Skill progress bars/rings
- Achievements grid with unlockable badges
- Settings toggles (voice input, hint frequency)

---

## Backend (Supabase)
- **Authentication:** Supabase Auth with a "Continue as Guest" demo flow
- **Profiles table:** Stores username, avatar, level, XP, and preferences
- Auto-created profile on signup via database trigger
- RLS policies so users can only access their own data

---

## Seed Data (visible immediately)
- **6 Categories:** Romance, Work, Family, Friends, Conflict, Public Speaking
- **6 Scenarios:** "First date jitters", "Ask for a raise", "Calm crying toddler", "Say no to a friend", "Reply to rudeness", "Wedding toast" — each with difficulty, duration, and category
- All text in English, no placeholder/lorem ipsum content

---

## Interactions & Polish
- Cards scale to 102% on hover
- Buttons scale to 95% on tap
- Bottom nav highlights active tab with peach color and filled icon
- Smooth page transitions
- Mobile-first responsive layout with shared Layout component (header + bottom nav)
- All buttons and links navigate to real pages (no dead ends)
- Accessible color contrast and focus states


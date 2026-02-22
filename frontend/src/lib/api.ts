/**
 * API client for SocialSim backend
 * Использует тот же хост, что и фронтенд (чтобы работало с 192.168.x.x, localhost и т.д.)
 */
function getApiBaseUrl(): string {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return `http://${host}:8000`;
  }
  return "http://127.0.0.1:8000";
}
const API_URL = getApiBaseUrl();

const REQUEST_TIMEOUT_MS = 15000;

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const config: RequestInit = {
    ...options,
    signal: options.signal ?? controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  };

  try {
    const res = await fetch(url, config);
    clearTimeout(timeoutId);

    if (res.status === 401) {
      throw Object.assign(new Error("Not authenticated"), { status: 401 });
    }

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        detail = typeof data.detail === "string" ? data.detail : detail;
        if (Array.isArray(data.detail)) {
          detail = data.detail.map((e: { msg?: string }) => e.msg).join("; ") || detail;
        }
      } catch {
        // ignore
      }
      const err = new Error(detail) as Error & { status?: number };
      err.status = res.status;
      throw err;
    }

    if (res.status === 204) return {} as T;
    return res.json();
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Сервер не отвечает. Проверьте, что бэкенд запущен на " + API_URL);
    }
    throw e;
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: "PUT", body: data ? JSON.stringify(data) : undefined }),
};

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; full_name?: string }) =>
    api.post<{ access_token: string; user: User; expires_in: number }>("/auth/register", data),

  login: async (email: string, password: string) => {
    try {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);
      const url = `${API_URL}/auth/login`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form,
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        let detail = "Неверный email или пароль";
        try {
          const data = await res.json();
          detail = typeof data.detail === "string" ? data.detail : detail;
        } catch {
          // ignore
        }
        const err = new Error(detail) as Error & { status?: number };
        err.status = res.status;
        throw err;
      }
      return res.json();
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        throw new Error("Сервер не отвечает. Проверьте, что бэкенд запущен на " + API_URL);
      }
      throw e;
    }
  },

  guest: () =>
    api.post<{ access_token: string; user: User; expires_in: number }>("/auth/guest"),

  me: () => api.get<User>("/auth/me"),
  verifyToken: () => api.get<{ valid: boolean; user: User }>("/auth/verify-token"),
  logout: () => api.post("/auth/logout"),
};

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_guest: boolean;
  created_at: string;
}

// Scenarios API (no auth required)
export interface CategoryResponse {
  id: string;
  name: string;
  emoji: string;
}

export interface ScenarioResponse {
  id: string;
  title: string;
  emoji: string;
  category: string;
  difficulty: string;
  duration: number;
  description: string;
  required_level: number;
}

export const scenariosApi = {
  getCategories: () => api.get<CategoryResponse[]>("/scenarios/categories"),
  getScenarios: (category?: string, difficulty?: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (difficulty) params.set("difficulty", difficulty);
    const q = params.toString();
    return api.get<ScenarioResponse[]>(`/scenarios${q ? `?${q}` : ""}`);
  },
};

// Profiles API (auth required)
export interface ProfileResponse {
  id: number;
  user_id: number;
  avatar_url: string | null;
  display_name: string | null;
  level: number;
  xp: number;
  voice_input_enabled: boolean;
  hint_frequency: string;
}

export const profilesApi = {
  getMe: () => api.get<ProfileResponse>("/profiles/me"),
  updateMe: (data: Partial<Pick<ProfileResponse, "display_name" | "avatar_url" | "voice_input_enabled" | "hint_frequency">>) =>
    api.put<ProfileResponse>("/profiles/me", data),
};

// Simulations API (auth required)
export interface SimulationRunResponse {
  id: number;
  scenario_id: string;
  score: number;
  date: string;
  xp_earned: number;
}

export const simulationsApi = {
  save: (data: {
    scenario_id: string;
    score: number;
    empathy_score?: number;
    clarity_score?: number;
    emotional_control_score?: number;
    assertiveness_score?: number;
    difficulty?: string;
    personality?: number;
    session_length?: string;
    turn_count?: number;
  }) => api.post<SimulationRunResponse>("/simulations", data),
  getRecent: (limit?: number) =>
    api.get<SimulationRunResponse[]>(`/simulations/recent${limit ? `?limit=${limit}` : ""}`),
};

// Stats API (auth required)
export interface PersonalityTraits {
  empathy_orientation: number;
  assertiveness_drive: number;
  composure_index: number;
  clarity_precision: number;
  adaptability: number;
  persistence: number;
}

export interface PersonalityProfile {
  traits: PersonalityTraits;
  archetype: string;
  sessions_analyzed: number;
}

export interface UserStatsResponse {
  total_sessions: number;
  avg_score: number;
  best_score: number;
  streak_days: number;
  weekly_sessions: number[];
  skills: { empathy: number; clarity: number; emotional_control: number; assertiveness: number };
  achievements: string[];
  personality: PersonalityProfile;
}

export const statsApi = {
  getMyStats: () => api.get<UserStatsResponse>("/profiles/me/stats"),
};

// Scenario by id (public)
export const getScenarioById = (id: string) => api.get<ScenarioResponse>(`/scenarios/${id}`);

// Chat API (OpenRouter simulation)
export const chatApi = {
  simulate: (data: {
    scenario_id: string;
    scenario_title: string;
    scenario_description: string;
    messages: { sender: string; text: string }[];
    language?: string;
    difficulty?: string;
    personality?: number;
    user_goal?: string;
    ai_style?: string;
    focus_skill?: string;
  }) =>
    api.post<{
      reply: string;
      emotion_after?: number;
      empathy_delta?: number;
      clarity?: number;
      emotional_control?: number;
      turn_quality?: number;
    }>("/chat/simulate", data),
  analyzeFeedback: (data: { scenario_id: string; scenario_title: string; messages: { sender: string; text: string }[]; score: number; language: string }) =>
    api.post<{ skills: Record<string, number>; positives: { phrase: string; note: string }[]; negatives: { phrase: string; note: string }[]; tip: string }>("/chat/analyze-feedback", data),
};

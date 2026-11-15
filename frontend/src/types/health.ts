export type TrafficLightStatus = "green" | "yellow" | "red";

export interface UserProfile {
  name: string;
  age: number; // 16+
  goal: string;
  wakeUpTime: string;
  bedTime: string;
}

export interface WeeklyCheckupEntry {
  id: string;
  weekLabel: string; // e.g., "Week 1", "Week 2"
  date: string;
  psychScore: number; // 0-100 (higher means better mental well-being)
  sleepHours: number; // average sleep duration per week
  sleepQuality: number; // 1-10
  status: TrafficLightStatus;
}

export interface TestSummary {
  depressionScore?: number; // 0-27 (PHQ-9 scale)
  burnoutPercent?: number; // 0-100%
  sleepIndex?: number; // 0-100%
  reactionMs?: number; // ms
}

export interface ExerciseItem {
  id: string;
  day: string;
  title: string;
  duration: string;
  category: "Cardio" | "Back & Posture" | "Relaxation";
  completed: boolean;
}

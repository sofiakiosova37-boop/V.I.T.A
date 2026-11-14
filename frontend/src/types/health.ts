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
  weekLabel: string; // Напр., "Тиж. 1", "Тиж. 2"
  date: string;
  psychScore: number; // 0-100 (чим вище, тим краще психологічне самопочуття)
  sleepHours: number; // середня тривалість сну за тиждень
  sleepQuality: number; // 1-10
  status: TrafficLightStatus;
}

export interface TestSummary {
  depressionScore?: number; // 0-27 (шкала PHQ-9)
  burnoutPercent?: number; // 0-100%
  sleepIndex?: number; // 0-100%
  reactionMs?: number; // мс
}

export interface ExerciseItem {
  id: string;
  day: string;
  title: string;
  duration: string;
  category: "Кардіо" | "Спина та постава" | "Релаксація";
  completed: boolean;
}

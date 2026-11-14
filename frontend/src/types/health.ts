export type MissionOrbit = "LEO" | "MOON" | "MARS";

export type AlertStatus = "green" | "yellow" | "red";

export interface AstronautProfile {
  id: string;
  name: string;
  role: string;
  missionName: string;
  missionStart: string; // ISO date
  missionEnd: string; // ISO date
  bloodType: string;
  baselineHR: number;
}

export interface BloodMetricsInput {
  astronaut_id: string;
  hemoglobin: number;
  white_blood_cells: number;
  hydration_level: number;
  notes?: string;
}

export interface BloodAnalysisResponse {
  status: AlertStatus;
  evaluated_metrics: {
    hemoglobin: number;
    white_blood_cells: number;
    hydration_level: number;
  };
  identified_risks: string[];
  source: "backend-api" | "offline-fallback";
}

export interface TelemetryData {
  heartRate: number; // уд/хв
  spo2: number; // %
  co2Level: number; // ppm (норма на МКС < 3000 ppm)
  radiationDose: number; // мЗв накопичено
}

export interface PsychTestResult {
  date: string;
  isolationScore: number; // 0-100%
  moodExhaustion: number; // 0-100%
  socialAggression: number; // 0-100%
  cognitiveLoad: number; // 0-100%
  totalPercent: number; // 0-30 норма, 31-60 втома, 61-100 критично
}

export interface SleepRecord {
  day: string;
  hours: number;
  quality: number; // 1-10
}

export interface LogEntry {
  id: string;
  missionDay: number;
  timestamp: string;
  mood: "good" | "neutral" | "stressed";
  text: string;
  voiceStressIndex?: number;
}

export interface SansEyeResult {
  timestamp: string;
  trackingAccuracy: number; // %
  blinkRate: number; // моргань/хв
  verdict: string;
  risk: AlertStatus;
}

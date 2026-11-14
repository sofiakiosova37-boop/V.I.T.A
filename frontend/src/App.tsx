import React, { useMemo, useState } from "react";
import { BioSensorsTab } from "./components/BioSensorsTab";
import { DashboardTab } from "./components/DashboardTab";
import { EmergencyBanner } from "./components/EmergencyBanner";
import { PhysicalSleepTab } from "./components/PhysicalSleepTab";
import { PsychAndLogTab } from "./components/PsychAndLogTab";
import { analyzeBloodBiomarkers } from "./services/api";
import {
  AlertStatus,
  AstronautProfile,
  BloodAnalysisResponse,
  BloodMetricsInput,
  LogEntry,
  MissionOrbit,
  PsychTestResult,
  SansEyeResult,
  SleepRecord,
  TelemetryData,
} from "./types/health";

type ActiveTab = "dashboard" | "psych" | "sensors" | "physical" | "profile";

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [orbit, setOrbit] = useState<MissionOrbit>("LEO");
  const [dismissedAlerts, setDismissedAlerts] = useState<boolean>(false);

  // Профіль астронавта (з редагуванням)
  const [profile, setProfile] = useState<AstronautProfile>({
    id: "AST-04-UA",
    name: "Анастасія Зотова",
    role: "Бортінженер / Спеціаліст місії",
    missionName: "ARTEMIS-HORIZON IV",
    missionStart: "2026-09-15T08:00:00Z",
    missionEnd: "2027-03-15T08:00:00Z",
    bloodType: "A(II) Rh+",
    baselineHR: 66,
  });

  // Бортова телеметрія
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    heartRate: 70,
    spo2: 98,
    co2Level: 1200,
    radiationDose: 42.5,
  });

  // Біомаркери крові (для вашого FastAPI)
  const [bloodInput, setBloodInput] = useState<BloodMetricsInput>({
    astronaut_id: profile.id,
    hemoglobin: 14.2,
    white_blood_cells: 6.5,
    hydration_level: 63.0,
    notes: "Плановий забір перед EVA",
  });
  const [bloodResult, setBloodResult] = useState<BloodAnalysisResponse | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Психологія, щоденник, сон, сенсори
  const [psychResult, setPsychResult] = useState<PsychTestResult>({
    date: "14.11.2026",
    isolationScore: 20,
    moodExhaustion: 25,
    socialAggression: 15,
    cognitiveLoad: 20,
    totalPercent: 20,
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      missionDay: 60,
      timestamp: "08:40",
      mood: "good",
      text: "Завершили калібрування спектрометра. Сон був спокійним, самопочуття стабільне.",
    },
  ]);

  const [sleepHistory, setSleepHistory] = useState<SleepRecord[]>([
    { day: "Д-1", hours: 7.5, quality: 8 },
    { day: "Д-2", hours: 6.0, quality: 6 },
    { day: "Д-3", hours: 8.0, quality: 9 },
    { day: "Д-4", hours: 6.5, quality: 7 },
    { day: "Д-5", hours: 7.5, quality: 8 },
  ]);

  const [sansResult, setSansResult] = useState<SansEyeResult | null>(null);
  const [lastReactionMs, setLastReactionMs] = useState<number | null>(245);

  const handleRunBloodAnalysis = async () => {
    setIsAnalyzing(true);
    setDismissedAlerts(false);
    const res = await analyzeBloodBiomarkers({
      ...bloodInput,
      astronaut_id: profile.id,
    });
    setBloodResult(res);
    setIsAnalyzing(false);
  };

  // Автоматичне визначення екстрених сповіщень з усіх модулів
  const { alertStatus, activeAlerts } = useMemo(() => {
    const alerts: string[] = [];
    let status: AlertStatus = "green";

    if (bloodResult && bloodResult.status !== "green") {
      alerts.push(...bloodResult.identified_risks);
      status = bloodResult.status;
    }
    if (telemetry.heartRate > 115) {
      alerts.push(
        `Критичний пульс у стані спокою: ${telemetry.heartRate} уд/хв`,
      );
      status = "red";
    }
    if (telemetry.co2Level > 4500) {
      alerts.push(
        `Небезпечна концентрація CO₂ у житловому модулі: ${telemetry.co2Level} ppm`,
      );
      if (status !== "red") status = "yellow";
    }
    if (psychResult.totalPercent > 60) {
      alerts.push(
        `Критичний індекс психологічної ізоляції: ${psychResult.totalPercent}%`,
      );
      status = "red";
    }

    return { alertStatus: status, activeAlerts: alerts };
  }, [bloodResult, telemetry, psychResult]);

  // Розрахунок індексу готовності до EVA (0-100%)
  const evaReadinessScore = useMemo(() => {
    let score = 100;
    if (telemetry.heartRate > 100) score -= 15;
    if (telemetry.co2Level > 4000) score -= 10;
    if (bloodResult?.status === "yellow") score -= 15;
    if (bloodResult?.status === "red") score -= 35;
    if (psychResult.totalPercent > 30) score -= 10;
    if (psychResult.totalPercent > 60) score -= 25;
    if (lastReactionMs && lastReactionMs > 350) score -= 10;
    if (sansResult?.risk === "yellow") score -= 10;
    return Math.max(0, Math.min(100, score));
  }, [telemetry, bloodResult, psychResult, lastReactionMs, sansResult]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Верхній навбар */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-600 font-bold text-white">
              🚀
            </div>
            <div>
              <h1 className="text-base font-bold tracking-wide text-white">
                ASTRA-MED // Crew Health Monitor
              </h1>
              <p className="text-[11px] text-slate-400">
                NASA Space Apps 2026 • Autonomous Crew Telemetry & HRP System
              </p>
            </div>
          </div>

          {/* Системні нагадування режиму дня */}
          <div className="hidden items-center gap-4 text-xs text-slate-300 xl:flex">
            <span className="rounded-full bg-slate-800 px-3 py-1">
              💧 Гідратація: через 25 хв
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1">
              🏋️ Тренування ARED: 17:00 UTC
            </span>
          </div>

          <button
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs hover:bg-slate-700"
          >
            <span>🧑‍🚀 {profile.name}</span>
            <span className="font-mono text-cyan-400">[{profile.id}]</span>
          </button>
        </div>

        {/* Навігаційні вкладки */}
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pt-1">
          {(
            [
              { id: "dashboard", label: "🛰 Mission Control" },
              { id: "psych", label: "🧠 Психологія та Щоденник" },
              { id: "sensors", label: "👁 SANS-Камера та Реакція" },
              { id: "physical", label: "😴 Сон і Реабілітація" },
              { id: "profile", label: "🪪 Профіль екіпажу" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "border-cyan-400 text-cyan-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Основний контент */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {!dismissedAlerts && (
          <EmergencyBanner
            status={alertStatus}
            alerts={activeAlerts}
            orbit={orbit}
            onDismiss={() => setDismissedAlerts(true)}
          />
        )}

        {activeTab === "dashboard" && (
          <DashboardTab
            profile={profile}
            orbit={orbit}
            onOrbitChange={setOrbit}
            telemetry={telemetry}
            onTelemetryChange={(t) => {
              setTelemetry(t);
              setDismissedAlerts(false);
            }}
            bloodInput={bloodInput}
            onBloodInputChange={setBloodInput}
            bloodResult={bloodResult}
            onRunBloodAnalysis={handleRunBloodAnalysis}
            isAnalyzing={isAnalyzing}
            evaReadinessScore={evaReadinessScore}
          />
        )}

        {activeTab === "psych" && (
          <PsychAndLogTab
            latestPsych={psychResult}
            onSavePsych={(res) => {
              setPsychResult(res);
              setDismissedAlerts(false);
            }}
            logs={logs}
            onAddLog={(entry) => setLogs((prev) => [entry, ...prev])}
            missionDay={60}
          />
        )}

        {activeTab === "sensors" && (
          <BioSensorsTab
            onSansResult={setSansResult}
            lastReactionMs={lastReactionMs}
            onReactionResult={setLastReactionMs}
          />
        )}

        {activeTab === "physical" && (
          <PhysicalSleepTab
            sleepHistory={sleepHistory}
            onAddSleep={(rec) => setSleepHistory((prev) => [...prev, rec])}
          />
        )}

        {activeTab === "profile" && (
          <div className="max-w-xl rounded-xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-lg font-bold text-white">
              🪪 Особиста картка астронавта
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <label className="text-xs text-slate-400">
                  Ім&apos;я та прізвище
                </label>
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">ID екіпажу</label>
                  <input
                    value={profile.id}
                    onChange={(e) =>
                      setProfile({ ...profile, id: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Група крові</label>
                  <input
                    value={profile.bloodType}
                    onChange={(e) =>
                      setProfile({ ...profile, bloodType: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400">
                  Посада на борту
                </label>
                <input
                  value={profile.role}
                  onChange={(e) =>
                    setProfile({ ...profile, role: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

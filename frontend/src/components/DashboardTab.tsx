import React, { useEffect, useState } from "react";
import {
  AstronautProfile,
  BloodAnalysisResponse,
  BloodMetricsInput,
  MissionOrbit,
  TelemetryData,
} from "../types/health";

interface DashboardTabProps {
  profile: AstronautProfile;
  orbit: MissionOrbit;
  onOrbitChange: (orbit: MissionOrbit) => void;
  telemetry: TelemetryData;
  onTelemetryChange: (t: TelemetryData) => void;
  bloodInput: BloodMetricsInput;
  onBloodInputChange: (b: BloodMetricsInput) => void;
  bloodResult: BloodAnalysisResponse | null;
  onRunBloodAnalysis: () => void;
  isAnalyzing: boolean;
  evaReadinessScore: number;
}

const QUOTES = [
  "«Земля — колиска розуму, але не можна вічно жити в колисці.» — К. Ціолковський",
  "«Кожен оберт навколо планети — це новий світанок кожні 90 хвилин.»",
  "«Дисципліна на орбіті — найкраща страховка для повернення додому.»",
  "«Ти не просто спостерігаєш за зірками — ти працюєш серед них.»",
];

export const DashboardTab: React.FC<DashboardTabProps> = ({
  profile,
  orbit,
  onOrbitChange,
  telemetry,
  onTelemetryChange,
  bloodInput,
  onBloodInputChange,
  bloodResult,
  onRunBloodAnalysis,
  isAnalyzing,
  evaReadinessScore,
}) => {
  const [now, setNow] = useState<Date>(new Date());
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startMs = new Date(profile.missionStart).getTime();
  const endMs = new Date(profile.missionEnd).getTime();
  const elapsedDays = Math.max(
    1,
    Math.floor((now.getTime() - startMs) / (1000 * 60 * 60 * 24)),
  );
  const remainingDays = Math.max(
    0,
    Math.ceil((endMs - now.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(((now.getTime() - startMs) / (endMs - startMs)) * 100),
    ),
  );

  // Швидкі пресети для демонстрації журі на хакатоні
  const applyScenario = (
    scenario: "nominal" | "co2_fatigue" | "critical_dehydration",
  ) => {
    if (scenario === "nominal") {
      onTelemetryChange({
        heartRate: 68,
        spo2: 98,
        co2Level: 1200,
        radiationDose: 42.5,
      });
      onBloodInputChange({
        ...bloodInput,
        hemoglobin: 14.5,
        white_blood_cells: 6.4,
        hydration_level: 64.0,
      });
    } else if (scenario === "co2_fatigue") {
      onTelemetryChange({
        heartRate: 96,
        spo2: 94,
        co2Level: 4800,
        radiationDose: 88.2,
      });
      onBloodInputChange({
        ...bloodInput,
        hemoglobin: 11.4,
        white_blood_cells: 3.6,
        hydration_level: 54.0,
      });
    } else {
      onTelemetryChange({
        heartRate: 124,
        spo2: 91,
        co2Level: 5300,
        radiationDose: 112.0,
      });
      onBloodInputChange({
        ...bloodInput,
        hemoglobin: 11.1,
        white_blood_cells: 12.8,
        hydration_level: 44.5,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Верхній рядок: Лічильник місії + Індекс EVA + Режим орбіти */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Таймер місії */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
            <span>⏱ Хронометр місії</span>
            <span className="text-cyan-400">{profile.missionName}</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-bold text-white">
                День {elapsedDays}
              </p>
              <p className="text-xs text-slate-400">від старту екіпажу</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-cyan-300">
                -{remainingDays} дн.
              </p>
              <p className="text-xs text-slate-400">до повернення</p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1.5 text-right font-mono text-xs text-slate-400">
            UTC: {now.toUTCString().slice(17, 25)} ({progressPercent}% місії)
          </p>
        </div>

        {/* Індекс готовності до EVA */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <span className="text-xs uppercase tracking-wider text-slate-400">
            🧑‍🚀 Готовність до виходу (EVA Score)
          </span>
          <div className="mt-3 flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full border-4 text-xl font-extrabold ${
                evaReadinessScore >= 75
                  ? "border-emerald-500 text-emerald-400"
                  : evaReadinessScore >= 50
                    ? "border-amber-500 text-amber-400"
                    : "border-red-500 text-red-400"
              }`}
            >
              {evaReadinessScore}%
            </div>
            <div className="text-sm">
              <p className="font-semibold text-white">
                {evaReadinessScore >= 75
                  ? "Дозвіл на EVA підтверджено"
                  : evaReadinessScore >= 50
                    ? "Обмежений допуск (потрібен відпочинок)"
                    : "Вихід у відкритий космос ЗАБОРОНЕНО"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Розраховано з біометрії, сну, реакції та психотесту
              </p>
            </div>
          </div>
        </div>

        {/* Перемикач орбіти / затримки зв'язку */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <span className="text-xs uppercase tracking-wider text-slate-400">
            🛰 Дистанція та затримка зв&apos;язку
          </span>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["LEO", "MOON", "MARS"] as MissionOrbit[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onOrbitChange(mode)}
                className={`rounded-lg py-2 text-xs font-bold transition ${
                  orbit === mode
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {mode === "LEO"
                  ? "МКС (LEO)"
                  : mode === "MOON"
                    ? "Місяць"
                    : "Марс"}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-300">
            {orbit === "LEO" &&
              "Затримка сигналу: ~0.2 с. Постійний контакт із ЦУП."}
            {orbit === "MOON" &&
              "Затримка сигналу: ~2.6 с. Доступна напівавтономна діагностика."}
            {orbit === "MARS" &&
              "Затримка сигналу: 14 хв 20 с. Екіпаж покладається на бортовий ШІ."}
          </p>
        </div>
      </div>

      {/* Панель сценаріїв для демо */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-900/50 bg-cyan-950/20 p-4">
        <div className="text-sm">
          <span className="font-semibold text-cyan-300">
            🎛 Симулятор стану екіпажу (Demo):
          </span>{" "}
          <span className="text-slate-400">
            миттєва зміна показників датчиків та аналізу крові
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyScenario("nominal")}
            className="rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-medium text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30"
          >
            Штатна норма
          </button>
          <button
            onClick={() => applyScenario("co2_fatigue")}
            className="rounded-lg bg-amber-600/20 px-3 py-1.5 text-xs font-medium text-amber-300 border border-amber-500/40 hover:bg-amber-600/30"
          >
            Високий CO₂ + анемія
          </button>
          <button
            onClick={() => applyScenario("critical_dehydration")}
            className="rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-300 border border-red-500/40 hover:bg-red-600/30"
          >
            Критична дегідратація (SOS)
          </button>
        </div>
      </div>

      {/* Симулятор бортової телеметрії + Аналізатор крові (FastAPI) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Ліва колонка: Живі датчики скафандра/станції */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-base font-bold text-white">
            💓 Бортова телеметрія та середовище
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-slate-950 p-3">
              <label className="text-xs text-slate-400">Пульс (уд/хв)</label>
              <p className="text-2xl font-bold text-rose-400">
                {telemetry.heartRate}
              </p>
              <input
                type="range"
                min={45}
                max={160}
                value={telemetry.heartRate}
                onChange={(e) =>
                  onTelemetryChange({
                    ...telemetry,
                    heartRate: Number(e.target.value),
                  })
                }
                className="mt-2 w-full accent-rose-500"
              />
            </div>

            <div className="rounded-lg bg-slate-950 p-3">
              <label className="text-xs text-slate-400">
                Сатурація SpO₂ (%)
              </label>
              <p className="text-2xl font-bold text-sky-400">
                {telemetry.spo2}%
              </p>
              <input
                type="range"
                min={85}
                max={100}
                value={telemetry.spo2}
                onChange={(e) =>
                  onTelemetryChange({
                    ...telemetry,
                    spo2: Number(e.target.value),
                  })
                }
                className="mt-2 w-full accent-sky-500"
              />
            </div>

            <div className="rounded-lg bg-slate-950 p-3">
              <label className="text-xs text-slate-400">
                Рівень CO₂ у відсіку (ppm)
              </label>
              <p
                className={`text-2xl font-bold ${
                  telemetry.co2Level > 4000
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {telemetry.co2Level}
              </p>
              <input
                type="range"
                min={400}
                max={6000}
                step={100}
                value={telemetry.co2Level}
                onChange={(e) =>
                  onTelemetryChange({
                    ...telemetry,
                    co2Level: Number(e.target.value),
                  })
                }
                className="mt-2 w-full accent-amber-500"
              />
            </div>

            <div className="rounded-lg bg-slate-950 p-3">
              <label className="text-xs text-slate-400">
                Накопичена радіація (мЗв)
              </label>
              <p className="text-2xl font-bold text-purple-400">
                {telemetry.radiationDose}
              </p>
              <input
                type="range"
                min={0}
                max={250}
                step={0.5}
                value={telemetry.radiationDose}
                onChange={(e) =>
                  onTelemetryChange({
                    ...telemetry,
                    radiationDose: Number(e.target.value),
                  })
                }
                className="mt-2 w-full accent-purple-500"
              />
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300">
            <span className="font-semibold text-cyan-400">
              💡 Порада бортового асистента:{" "}
            </span>
            {telemetry.co2Level > 4000
              ? "Підвищений рівень CO₂ знижує когнітивну точність. Перевірте скрубери вуглекислого газу."
              : telemetry.heartRate > 105
                ? "Зафіксовано тахікардію у стані спокою. Виконайте 3 хвилини квадратного дихання."
                : "Фізіологічні параметри та газова суміш відсіку стабільні."}
          </div>
        </div>

        {/* Права колонка: Біомаркери крові -> FastAPI /api/v1/analyze/blood */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              🩸 Аналізатор біомаркерів крові
            </h3>
            <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-cyan-400">
              POST /api/v1/analyze/blood
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400">
                Гемоглобін (г/дл)
              </label>
              <input
                type="number"
                step="0.1"
                value={bloodInput.hemoglobin}
                onChange={(e) =>
                  onBloodInputChange({
                    ...bloodInput,
                    hemoglobin: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400">
                Лейкоцити (тис/мкл)
              </label>
              <input
                type="number"
                step="0.1"
                value={bloodInput.white_blood_cells}
                onChange={(e) =>
                  onBloodInputChange({
                    ...bloodInput,
                    white_blood_cells: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400">
                Гідратація (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={bloodInput.hydration_level}
                onChange={(e) =>
                  onBloodInputChange({
                    ...bloodInput,
                    hydration_level: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <button
            onClick={onRunBloodAnalysis}
            disabled={isAnalyzing}
            className="mt-4 w-full rounded-lg bg-cyan-600 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
          >
            {isAnalyzing ? "Аналіз зразка..." : "Надіслати на аналіз (FastAPI)"}
          </button>

          {bloodResult && (
            <div
              className={`mt-4 rounded-lg border p-3 text-xs ${
                bloodResult.status === "red"
                  ? "border-red-500/50 bg-red-950/40 text-red-200"
                  : bloodResult.status === "yellow"
                    ? "border-amber-500/50 bg-amber-950/40 text-amber-200"
                    : "border-emerald-500/50 bg-emerald-950/40 text-emerald-200"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>Вердикт системи: {bloodResult.status.toUpperCase()}</span>
                <span className="font-mono text-[10px] opacity-75">
                  [
                  {bloodResult.source === "backend-api"
                    ? "FastAPI Live"
                    : "Offline Engine"}
                  ]
                </span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {bloodResult.identified_risks.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Бонус: Мотиваційна цитата на головній сторінці */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-3">
        <p className="text-sm italic text-slate-300">{QUOTES[quoteIndex]}</p>
        <button
          onClick={() => setQuoteIndex((prev) => (prev + 1) % QUOTES.length)}
          className="ml-4 shrink-0 text-xs text-cyan-400 hover:underline"
        >
          Наступна цитата →
        </button>
      </div>
    </div>
  );
};

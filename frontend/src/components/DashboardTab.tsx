import React, { useState } from "react";
import {
  TestSummary,
  TrafficLightStatus,
  WeeklyCheckupEntry,
} from "../types/health";

interface DashboardTabProps {
  history: WeeklyCheckupEntry[];
  onSaveCheckup: (entry: WeeklyCheckupEntry) => void;
  testSummary: TestSummary;
  onGoToTests: () => void;
}

const DAILY_QUOTES = [
  "«Турбота про ментальне здоров’я — це не розкіш, а базова навичка виживання в сучасному ритмі.»",
  "«Навіть 15 хвилин прогулянки без телефону знижують рівень кортизолу краще, ніж годинний скролінг стрічки.»",
  "«Якісний сон сьогодні — це твоя концентрація, настрій та стійкість до стресу завтра.»",
  "«Маленькі регулярні кроки завжди перемагають рідкісні героїчні ривки.»",
];

export const DashboardTab: React.FC<DashboardTabProps> = ({
  history,
  onSaveCheckup,
  testSummary,
  onGoToTests,
}) => {
  const latest = history[history.length - 1];

  // Поля для швидкого щотижневого чекапу
  const [stressLevel, setStressLevel] = useState<number>(4); // 1-10 (де 10 — сильний стрес)
  const [energyLevel, setEnergyLevel] = useState<number>(7); // 1-10
  const [sleepHours, setSleepHours] = useState<number>(
    latest?.sleepHours ?? 7.5,
  );
  const [sleepQuality, setSleepQuality] = useState<number>(
    latest?.sleepQuality ?? 7,
  );
  const [quoteIdx, setQuoteIdx] = useState<number>(0);

  // Розрахунок індексу психологічного стану (0-100)
  const calcPsychScore = () => {
    const raw = (10 - stressLevel) * 5 + energyLevel * 5;
    return Math.min(100, Math.max(0, raw));
  };

  const evaluateTrafficLight = (
    psych: number,
    hours: number,
    quality: number,
  ): TrafficLightStatus => {
    if (psych < 40 || hours < 5.5 || quality <= 3) return "red";
    if (psych < 70 || hours < 7 || quality <= 6) return "yellow";
    return "green";
  };

  const handleSubmitCheckup = (e: React.FormEvent) => {
    e.preventDefault();
    const psychScore = calcPsychScore();
    const status = evaluateTrafficLight(psychScore, sleepHours, sleepQuality);

    onSaveCheckup({
      id: crypto.randomUUID(),
      weekLabel: `Тиж. ${history.length + 1}`,
      date: new Date().toLocaleDateString("uk-UA"),
      psychScore,
      sleepHours,
      sleepQuality,
      status,
    });
  };

  const currentStatus: TrafficLightStatus = latest?.status ?? "green";

  const getRecommendations = (status: TrafficLightStatus) => {
    if (status === "red") {
      return {
        title: "Критичне виснаження — потрібен режим відновлення",
        routine:
          "Зменште вечірнє навантаження, відкладіть робочі/навчальні задачі після 20:00 та лягайте спати на 1 годину раніше.",
        exercises:
          "Дихальна практика 4-7-8 (5 хв) + легка розтяжка шиї та спини без інтенсивного кардіо.",
        tip: "Рекомендуємо пройти детальний тест на вигорання та депресію у вкладці «Тести» і за потреби звернутися до фахівця.",
      };
    }
    if (status === "yellow") {
      return {
        title: "Помірне накопичення втоми — потрібна корекція режиму",
        routine:
          "Фіксований час підйому, мінімум 30 хвилин денного світла в першій половині дня та відмова від екранів за 45 хв до сну.",
        exercises:
          "Швидка ходьба на свіжому повітрі (30 хв) або легка ранкова зарядка на 15 хвилин.",
        tip: "Зверніть увагу на баланс сну: недосип понад 2 дні поспіль різко знижує швидкість реакції.",
      };
    }
    return {
      title: "Оптимальний баланс — чудовий стан",
      routine:
        "Підтримуйте поточний графік сну та робочих перерв (правило 50/10: 50 хв фокусу, 10 хв відпочинку).",
      exercises:
        "Планові силові або кардіо-тренування 3 рази на тиждень за вашим розкладом.",
      tip: "Ваш ресурс у нормі — гарний час для складних інтелектуальних задач або навчання.",
    };
  };

  const recs = getRecommendations(currentStatus);

  return (
    <div className="space-y-6">
      {/* Верхній блок: Світлофор стану + Графік чекапу */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Світлофор (4 колонки) */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-6 lg:col-span-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Статус тижня (Світлофор)
            </span>
            <h2 className="mt-1 text-lg font-bold text-white">
              {currentStatus === "green" && "Зелений рівень: Норма"}
              {currentStatus === "yellow" && "Жовтий рівень: Увага"}
              {currentStatus === "red" && "Червоний рівень: Перевантаження"}
            </h2>
          </div>

          {/* Візуальний індикатор світлофора */}
          <div className="my-5 flex items-center justify-center gap-5 rounded-2xl border border-slate-800 bg-slate-950 py-5">
            <div
              className={`h-12 w-12 rounded-full transition-all ${
                currentStatus === "red"
                  ? "bg-red-500 shadow-[0_0_25px_#ef4444]"
                  : "bg-red-950/40 opacity-35"
              }`}
              title="Критичний стан"
            />
            <div
              className={`h-12 w-12 rounded-full transition-all ${
                currentStatus === "yellow"
                  ? "bg-amber-400 shadow-[0_0_25px_#fbbf24]"
                  : "bg-amber-950/40 opacity-35"
              }`}
              title="Потрібна корекція"
            />
            <div
              className={`h-12 w-12 rounded-full transition-all ${
                currentStatus === "green"
                  ? "bg-emerald-500 shadow-[0_0_25px_#10b981]"
                  : "bg-emerald-950/40 opacity-35"
              }`}
              title="Норма"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Психо-індекс: {latest?.psychScore ?? 75}%</span>
            <span>Сон: {latest?.sleepHours ?? 7.5} год</span>
          </div>
        </div>

        {/* Графік: Лише сон за період часу (8 колонок) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white">
                📊 Динаміка сну за період часу
              </h3>
              <p className="text-xs text-slate-400">
                Якість сну (%) та середня тривалість (год) по тижнях
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-teal-400">
                <span className="h-2.5 w-2.5 rounded-sm bg-teal-400" /> Якість
                сну (%)
              </span>
            </div>
          </div>

          <div className="mt-5 flex h-44 items-end justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 px-5 pt-6 pb-3">
            {history.map((item) => (
              <div key={item.id} className="flex flex-1 flex-col items-center">
                <span className="mb-1 text-[11px] font-semibold text-teal-300">
                  {item.sleepQuality * 10}%
                </span>
                <div className="flex h-24 w-full items-end justify-center">
                  <div
                    style={{ height: `${item.sleepQuality * 10}%` }}
                    className="w-8 rounded-t-md bg-teal-400 transition-all hover:bg-teal-300"
                    title={`Сон: ${item.sleepQuality}/10 (${item.sleepHours} год)`}
                  />
                </div>
                <span className="mt-2 text-xs font-medium text-slate-300">
                  {item.weekLabel}
                </span>
                <span className="text-[10px] text-slate-500">
                  {item.sleepHours}г
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Середній блок: Форма нового щотижневого чекапу + Персональні рекомендації */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Форма чекапу */}
        <form
          onSubmit={handleSubmitCheckup}
          className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4"
        >
          <h3 className="text-base font-bold text-white">
            🗓 Пройти щотижневий чекап
          </h3>

          <div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Рівень стресу та напруги за тиждень (1–10)</span>
              <span className="font-bold text-indigo-400">
                {stressLevel} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="mt-1.5 w-full accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Рівень енергії та мотивації (1–10)</span>
              <span className="font-bold text-indigo-400">
                {energyLevel} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="mt-1.5 w-full accent-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400">
                Середній сон (год/добу)
              </label>
              <input
                type="number"
                step="0.5"
                min={3}
                max={12}
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400">
                Якість сну (1–10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            Оновити світлофор та зберегти тиждень
          </button>
        </form>

        {/* Рекомендації за результатом */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                💡 Рекомендації за результатом
              </h3>
              <button
                onClick={onGoToTests}
                className="text-xs font-medium text-indigo-400 hover:underline"
              >
                Поглиблені тести →
              </button>
            </div>
            <p className="mt-2 text-sm font-semibold text-teal-300">
              {recs.title}
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="rounded-xl bg-slate-950 p-3">
                <span className="font-bold text-white">⏰ Режим дня: </span>
                {recs.routine}
              </div>
              <div className="rounded-xl bg-slate-950 p-3">
                <span className="font-bold text-white">🏃 Вправи: </span>
                {recs.exercises}
              </div>
              <div className="rounded-xl bg-slate-950 p-3">
                <span className="font-bold text-white">🧭 Порада: </span>
                {recs.tip}
              </div>
            </div>
          </div>

          {testSummary.reactionMs && (
            <p className="mt-3 text-[11px] text-slate-400">
              Останній тест реакції:{" "}
              <strong className="text-white">
                {testSummary.reactionMs} мс
              </strong>
              {testSummary.burnoutPercent !== undefined &&
                ` • Індекс вигорання: ${testSummary.burnoutPercent}%`}
            </p>
          )}
        </div>
      </div>

      {/* Цитата дня */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-3.5">
        <p className="text-sm italic text-slate-300">
          {DAILY_QUOTES[quoteIdx]}
        </p>
        <button
          onClick={() =>
            setQuoteIdx((prev) => (prev + 1) % DAILY_QUOTES.length)
          }
          className="ml-4 shrink-0 text-xs font-medium text-indigo-400 hover:underline"
        >
          Інша цитата →
        </button>
      </div>
    </div>
  );
};

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
  "“Taking care of your mental health is not a luxury—it is a core survival skill in a fast-paced world.”",
  "“Even a 15-minute phone-free walk lowers cortisol levels better than an hour of scrolling.”",
  "“Quality sleep tonight is your focus, mood, and stress resilience tomorrow.”",
  "“Small, consistent steps always beat rare heroic sprints.”",
];

export const DashboardTab: React.FC<DashboardTabProps> = ({
  history,
  onSaveCheckup,
  testSummary,
  onGoToTests,
}) => {
  const latest = history[history.length - 1];

  const [stressLevel, setStressLevel] = useState<number>(4);
  const [energyLevel, setEnergyLevel] = useState<number>(7);
  const [sleepHours, setSleepHours] = useState<number>(
    latest?.sleepHours ?? 7.5,
  );
  const [sleepQuality, setSleepQuality] = useState<number>(
    latest?.sleepQuality ?? 7,
  );
  const [quoteIdx, setQuoteIdx] = useState<number>(0);

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
      weekLabel: `Week ${history.length + 1}`,
      date: new Date().toLocaleDateString("en-GB"),
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
        title: "Critical Exhaustion — Recovery Mode Needed",
        routine:
          "Reduce evening workload, pause work/study tasks after 8:00 PM, and go to bed 1 hour earlier.",
        exercises:
          "4-7-8 breathing practice (5 min) + gentle neck and back stretching without intense cardio.",
        tip: 'We recommend taking the detailed burnout and depression tests in the "Tests" tab and consulting a specialist if needed.',
      };
    }
    if (status === "yellow") {
      return {
        title: "Moderate Fatigue — Routine Adjustment Recommended",
        routine:
          "Keep a fixed wake-up time, get at least 30 minutes of daylight in the morning, and avoid screens 45 minutes before bed.",
        exercises:
          "Brisk outdoor walk (30 min) or a light 15-minute morning mobility routine.",
        tip: "Watch your sleep consistency: sleep debt over 2+ consecutive days sharply slows reaction speed.",
      };
    }
    return {
      title: "Optimal Balance — Great Condition",
      routine:
        "Maintain your current sleep schedule and focus intervals (50/10 rule: 50 min focus, 10 min break).",
      exercises:
        "Stick to your scheduled strength or cardio workouts 3 times a week.",
      tip: "Your energy reserves are solid—great time for demanding cognitive tasks or deep study.",
    };
  };

  const recs = getRecommendations(currentStatus);

  return (
    <div className="space-y-6">
      {/* Top section: Traffic Light Status + Sleep Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Traffic Light (4 cols) */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 shadow-xs lg:col-span-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7d75]">
              Weekly Status (Traffic Light)
            </span>
            <h2 className="mt-1 text-lg font-bold text-[#2b3a34]">
              {currentStatus === "green" && "Green Level: Optimal"}
              {currentStatus === "yellow" && "Yellow Level: Caution"}
              {currentStatus === "red" && "Red Level: Overload"}
            </h2>
          </div>

          <div className="my-5 flex items-center justify-center gap-5 rounded-2xl border border-[#e3e6dd] bg-[#f3f2ea] py-5">
            <div
              className={`h-12 w-12 rounded-full transition-all ${
                currentStatus === "red"
                  ? "bg-[#d96b5b] shadow-[0_0_20px_rgba(217,107,91,0.45)]"
                  : "bg-[#e3d5d1] opacity-55"
              }`}
              title="Critical state"
            />
            <div
              className={`h-12 w-12 rounded-full transition-all ${
                currentStatus === "yellow"
                  ? "bg-[#e2a84b] shadow-[0_0_20px_rgba(226,168,75,0.45)]"
                  : "bg-[#e6decb] opacity-55"
              }`}
              title="Needs adjustment"
            />
            <div
              className={`h-12 w-12 rounded-full transition-all ${
                currentStatus === "green"
                  ? "bg-[#5b8e76] shadow-[0_0_20px_rgba(91,142,118,0.45)]"
                  : "bg-[#d4e0d8] opacity-55"
              }`}
              title="Optimal"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-[#586b63]">
            <span>Mental Index: {latest?.psychScore ?? 75}%</span>
            <span>Sleep: {latest?.sleepHours ?? 7.5} hrs</span>
          </div>
        </div>

        {/* Chart: Sleep Only Over Time (8 cols) */}
        <div className="rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 shadow-xs lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#2b3a34]">
                🌿 Sleep Dynamics Over Time
              </h3>
              <p className="text-xs text-[#6b7d75]">
                Sleep quality (%) and average duration (hrs) by week
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#497261]">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#679480]" /> Sleep
                Quality (%)
              </span>
            </div>
          </div>

          <div className="mt-5 flex h-44 items-end justify-between gap-4 rounded-2xl border border-[#e3e6dd] bg-[#f3f2ea] px-5 pt-6 pb-3">
            {history.map((item) => (
              <div key={item.id} className="flex flex-1 flex-col items-center">
                <span className="mb-1 text-[11px] font-bold text-[#497261]">
                  {item.sleepQuality * 10}%
                </span>
                <div className="flex h-24 w-full items-end justify-center">
                  <div
                    style={{ height: `${item.sleepQuality * 10}%` }}
                    className="w-8 rounded-t-lg bg-[#679480] transition-all hover:bg-[#527d6a]"
                    title={`Sleep: ${item.sleepQuality}/10 (${item.sleepHours} hrs)`}
                  />
                </div>
                <span className="mt-2 text-xs font-bold text-[#2b3a34]">
                  {item.weekLabel}
                </span>
                <span className="text-[10px] font-medium text-[#6b7d75]">
                  {item.sleepHours}h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle section: Weekly Checkup Form + Personalized Recommendations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleSubmitCheckup}
          className="space-y-4 rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 shadow-xs"
        >
          <h3 className="text-base font-bold text-[#2b3a34]">
            🗓 Complete Weekly Checkup
          </h3>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#475b52]">
              <span>Weekly Stress &amp; Tension Level (1–10)</span>
              <span className="font-bold text-[#497261]">
                {stressLevel} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="mt-1.5 w-full accent-[#587e6e]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#475b52]">
              <span>Energy &amp; Motivation Level (1–10)</span>
              <span className="font-bold text-[#497261]">
                {energyLevel} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="mt-1.5 w-full accent-[#587e6e]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#586b63]">
                Average Sleep (hrs/night)
              </label>
              <input
                type="number"
                step="0.5"
                min={3}
                max={12}
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[#cfd9d1] bg-[#f6f4ec] px-3 py-2 text-sm text-[#2b3a34] focus:border-[#587e6e] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#586b63]">
                Sleep Quality (1–10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[#cfd9d1] bg-[#f6f4ec] px-3 py-2 text-sm text-[#2b3a34] focus:border-[#587e6e] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#587e6e] py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#48695b]"
          >
            Update Traffic Light &amp; Save Week
          </button>
        </form>

        {/* Recommendations */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2b3a34]">
                💡 Actionable Recommendations
              </h3>
              <button
                onClick={onGoToTests}
                className="rounded-lg bg-[#d68059] px-3 py-1 text-xs font-bold text-white transition hover:bg-[#c26e48]"
              >
                In-depth Tests →
              </button>
            </div>
            <p className="mt-2 text-sm font-bold text-[#3f6656]">
              {recs.title}
            </p>

            <div className="mt-4 space-y-2.5 text-xs text-[#475b52]">
              <div className="rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-3">
                <span className="font-bold text-[#2b3a34]">
                  ⏰ Daily Routine:{" "}
                </span>
                {recs.routine}
              </div>
              <div className="rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-3">
                <span className="font-bold text-[#2b3a34]">🏃 Exercises: </span>
                {recs.exercises}
              </div>
              <div className="rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-3">
                <span className="font-bold text-[#2b3a34]">🧭 Tip: </span>
                {recs.tip}
              </div>
            </div>
          </div>

          {testSummary.reactionMs && (
            <p className="mt-3 text-[11px] font-medium text-[#6b7d75]">
              Latest Reaction Test:{" "}
              <strong className="text-[#2b3a34]">
                {testSummary.reactionMs} ms
              </strong>
              {testSummary.burnoutPercent !== undefined &&
                ` • Burnout Index: ${testSummary.burnoutPercent} pts`}
            </p>
          )}
        </div>
      </div>

      {/* Daily Quote */}
      <div className="flex items-center justify-between rounded-2xl border border-[#d5dfd7] bg-[#eaf0eb]/80 px-5 py-3.5">
        <p className="text-sm italic text-[#3c4f47]">
          {DAILY_QUOTES[quoteIdx]}
        </p>
        <button
          onClick={() =>
            setQuoteIdx((prev) => (prev + 1) % DAILY_QUOTES.length)
          }
          className="ml-4 shrink-0 text-xs font-bold text-[#3f6656] hover:underline"
        >
          Next Quote →
        </button>
      </div>
    </div>
  );
};

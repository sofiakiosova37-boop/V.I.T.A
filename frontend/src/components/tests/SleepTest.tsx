import React, { useMemo, useState } from "react";
import { SingleTestProps } from "./testContract";

interface DaySchedule {
  day: string;
  bedTime: string;
  fallAsleepTime: string;
  wakeUpTime: string;
}

interface SleepBackendPayload {
  needed_hours: string;
  schedule: DaySchedule[];
  enough_sleep: boolean;
  hours: number;
  minutes_to_fall_asleep: number;
  night_awakenings: number;
  quality: number;
  rested: number;
  devices_before_bed: boolean;
  food_or_caffeine: boolean;
  bright_light: boolean;
  noise: boolean;
  temperature: boolean;
  other_distractions: string;
}

interface SleepResult {
  score: number;
  zone: "good" | "attention" | "poor";
  tips: string[];
}

const INITIAL_SCHEDULE: DaySchedule[] = [
  {
    day: "Sunday",
    bedTime: "23:30",
    fallAsleepTime: "23:50",
    wakeUpTime: "08:00",
  },
  {
    day: "Monday",
    bedTime: "23:30",
    fallAsleepTime: "23:50",
    wakeUpTime: "07:30",
  },
  {
    day: "Tuesday",
    bedTime: "23:30",
    fallAsleepTime: "23:45",
    wakeUpTime: "07:30",
  },
  {
    day: "Wednesday",
    bedTime: "00:00",
    fallAsleepTime: "00:20",
    wakeUpTime: "07:30",
  },
  {
    day: "Thursday",
    bedTime: "23:30",
    fallAsleepTime: "23:50",
    wakeUpTime: "07:30",
  },
  {
    day: "Friday",
    bedTime: "00:30",
    fallAsleepTime: "00:45",
    wakeUpTime: "08:30",
  },
  {
    day: "Saturday",
    bedTime: "00:30",
    fallAsleepTime: "00:50",
    wakeUpTime: "09:00",
  },
];

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function diffMinutes(start: string, end: string): number {
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  return e >= s ? e - s : 1440 - s + e;
}

// Локальний дублікат логіки sleep_scoring.py (резерв, якщо бекенд недоступний)
function calculateSleepFallback(d: SleepBackendPayload): SleepResult {
  const tips: string[] = [];
  if (d.hours < 7)
    tips.push(
      "You are sleeping less than 7 hours, which has a negative impact on your health. Try dimming the lights half an hour before bedtime and putting away all electronic devices.",
    );
  if (d.hours > 10)
    tips.push(
      "You might be sleeping too long. Consult with your doctor and try to maintain a consistent sleep schedule.",
    );
  if (d.minutes_to_fall_asleep > 30)
    tips.push(
      "You take a long time to fall asleep. Try to create a relaxing bedtime routine. Dim the lights, avoid using gadgets, and try taking melatonin half an hour before going to bed.",
    );
  if (d.night_awakenings >= 2)
    tips.push(
      "You wake up frequently during the night. Check the temperature, noise, and lighting in your bedroom.",
    );
  if (d.devices_before_bed)
    tips.push(
      "Remove electronic devices from your bedroom at least 30 minutes before sleep.",
    );
  if (d.food_or_caffeine)
    tips.push(
      "Avoid eating heavy meals or consuming caffeine within 3-4 hours of bedtime.",
    );
  if (d.bright_light) tips.push("Dim the lights or use a sleep mask.");
  if (d.noise) tips.push("Try earplugs or white noise.");
  if (d.temperature)
    tips.push("Adjust the temperature in your bedroom for comfort.");
  if (d.rested <= 2 && d.hours >= 7)
    tips.push(
      "You are getting enough sleep, but not feeling rested. If this persists for several days, consider taking a break from your routine or consult with your doctor.",
    );

  let durPts = 0;
  for (const [low, high, pts] of [
    [7, 9, 40],
    [6, 10, 30],
    [5, 99, 20],
    [4, 99, 10],
  ]) {
    if (low <= d.hours && d.hours <= high) {
      durPts = pts;
      break;
    }
  }

  const latency =
    d.minutes_to_fall_asleep <= 15
      ? 10
      : d.minutes_to_fall_asleep <= 30
        ? 7
        : d.minutes_to_fall_asleep <= 60
          ? 3
          : 0;
  const awakeMap: Record<number, number> = { 0: 5, 1: 3, 2: 1 };
  const awake = awakeMap[d.night_awakenings] ?? 0;

  const score =
    durPts +
    Math.round(((d.quality - 1) / 4) * 25) +
    Math.round(((d.rested - 1) / 4) * 20) +
    latency +
    awake;

  const zone = score >= 70 ? "good" : score >= 40 ? "attention" : "poor";
  return {
    score,
    zone,
    tips:
      tips.slice(0, 4).length > 0
        ? tips.slice(0, 4)
        : ["Great sleep! Keep up the good work."],
  };
}

export const SleepTest: React.FC<SingleTestProps> = ({ onSaveResult }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SleepResult | null>(null);

  // Q1 & Q2
  const [neededHours, setNeededHours] = useState<string>("8 hours");
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);

  // Q3 + метрики для calculate_sleep
  const [enoughSleep, setEnoughSleep] = useState<boolean>(true);
  const [quality, setQuality] = useState<number>(4); // 1-5
  const [rested, setRested] = useState<number>(4); // 1-5
  const [nightAwakenings, setNightAwakenings] = useState<number>(0);

  // Q4 - Q10 (Yes/No)
  const [tvOn, setTvOn] = useState<boolean>(false);
  const [musicOn, setMusicOn] = useState<boolean>(false);
  const [lightOn, setLightOn] = useState<boolean>(false);
  const [shareBedroom, setShareBedroom] = useState<boolean>(false);
  const [tempDiscomfort, setTempDiscomfort] = useState<boolean>(false);
  const [devicesInBed, setDevicesInBed] = useState<boolean>(true);
  const [eatBeforeBed, setEatBeforeBed] = useState<boolean>(false);

  // Q11
  const [otherDistractions, setOtherDistractions] = useState<string>("");

  // Автоматичний розрахунок середніх годин сну та часу засинання з таблиці Q2
  const scheduleStats = useMemo(() => {
    const rows = schedule.map((row) => {
      const latency = diffMinutes(row.bedTime, row.fallAsleepTime);
      const sleepMins = diffMinutes(row.fallAsleepTime, row.wakeUpTime);
      return {
        ...row,
        latency,
        sleepMins,
        totalHours: Number((sleepMins / 60).toFixed(1)),
      };
    });

    const totalSleepMins = rows.reduce((sum, r) => sum + r.sleepMins, 0);
    const totalLatencyMins = rows.reduce((sum, r) => sum + r.latency, 0);

    return {
      rows,
      avgHours: Number((totalSleepMins / 7 / 60).toFixed(1)),
      avgLatency: Math.round(totalLatencyMins / 7),
    };
  }, [schedule]);

  const updateDayTime = (
    index: number,
    field: keyof DaySchedule,
    value: string,
  ) => {
    setSchedule((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleCalculate = async () => {
    setLoading(true);
    const payload: SleepBackendPayload = {
      needed_hours: neededHours,
      schedule,
      enough_sleep: enoughSleep,
      hours: scheduleStats.avgHours,
      minutes_to_fall_asleep: scheduleStats.avgLatency,
      night_awakenings: nightAwakenings,
      quality,
      rested,
      devices_before_bed: devicesInBed,
      food_or_caffeine: eatBeforeBed,
      bright_light: lightOn || tvOn,
      noise: musicOn || tvOn || shareBedroom,
      temperature: tempDiscomfort,
      other_distractions: otherDistractions,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/tests/sleep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Backend unavailable");
      const data: SleepResult = await response.json();
      setResult(data);
    } catch {
      // Якщо бекенд ще не підключений або вимкнений — рахуємо за ідентичною формулою локально
      setResult(calculateSleepFallback(payload));
    } finally {
      setLoading(false);
    }
  };

  const zoneStyles = {
    good: "text-emerald-400 border-emerald-800 bg-emerald-950/40",
    attention: "text-amber-400 border-amber-800 bg-amber-950/40",
    poor: "text-red-400 border-red-800 bg-red-950/40",
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">
            🌙 Sleep Quality &amp; Hygiene Survey
          </h3>
          <p className="text-xs text-slate-400">
            Complete the survey based on your average sleep schedule and bedroom
            habits.
          </p>
        </div>
        {!result && (
          <span className="text-xs font-medium text-teal-400">
            Step {step} of 3
          </span>
        )}
      </div>

      {/* КРОК 1: Питання 1 та Таблиця розкладу (Питання 2) */}
      {!result && step === 1 && (
        <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <div>
            <label className="block text-xs font-semibold text-slate-200">
              1. How many hours of sleep do you believe you need each night?
            </label>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {[
                "Less than 6 hours",
                "6 hours",
                "7 hours",
                "8 hours",
                "More than 8 hours",
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setNeededHours(opt)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                    neededHours === opt
                      ? "border-teal-500 bg-teal-950/40 font-semibold text-white"
                      : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-200">
                2. Average sleep schedule during the week
              </label>
              <span className="text-[11px] text-teal-300">
                Avg: <strong>{scheduleStats.avgHours} hrs</strong> • Fall
                asleep: <strong>~{scheduleStats.avgLatency} min</strong>
              </span>
            </div>

            <div className="mt-2.5 overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Day</th>
                    <th className="px-2 py-2">Go to Bed</th>
                    <th className="px-2 py-2">Fall Asleep</th>
                    <th className="px-2 py-2">Wake-Up</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950">
                  {scheduleStats.rows.map((row, idx) => (
                    <tr key={row.day}>
                      <td className="px-3 py-2 font-medium text-slate-300">
                        {row.day}
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="time"
                          value={row.bedTime}
                          onChange={(e) =>
                            updateDayTime(idx, "bedTime", e.target.value)
                          }
                          className="rounded border border-slate-800 bg-slate-900 px-2 py-1 text-slate-200"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="time"
                          value={row.fallAsleepTime}
                          onChange={(e) =>
                            updateDayTime(idx, "fallAsleepTime", e.target.value)
                          }
                          className="rounded border border-slate-800 bg-slate-900 px-2 py-1 text-slate-200"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="time"
                          value={row.wakeUpTime}
                          onChange={(e) =>
                            updateDayTime(idx, "wakeUpTime", e.target.value)
                          }
                          className="rounded border border-slate-800 bg-slate-900 px-2 py-1 text-slate-200"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-teal-400">
                        {row.totalHours}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-500"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* КРОК 2: Питання 3 + Оцінка якості, бадьорості та пробуджень */}
      {!result && step === 2 && (
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <span className="text-xs font-medium text-slate-200">
              3. Do you believe you get enough sleep each night?
            </span>
            <div className="flex gap-2">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setEnoughSleep(val)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                    enoughSleep === val
                      ? "bg-teal-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {val ? "YES" : "NO"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>
                How would you rate your overall sleep quality? (1 = Poor, 5 =
                Excellent)
              </span>
              <span className="font-bold text-teal-400">{quality} / 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="mt-1.5 w-full accent-teal-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>
                How rested do you feel when waking up? (1 = Exhausted, 5 = Fully
                rested)
              </span>
              <span className="font-bold text-teal-400">{rested} / 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={rested}
              onChange={(e) => setRested(Number(e.target.value))}
              className="mt-1.5 w-full accent-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300">
              How many times do you usually wake up during the night?
            </label>
            <div className="mt-2 flex gap-2">
              {[
                { label: "0 times", value: 0 },
                { label: "1 time", value: 1 },
                { label: "2 times", value: 2 },
                { label: "3+ times", value: 3 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setNightAwakenings(opt.value)}
                  className={`rounded-lg border px-3 py-1.5 text-xs ${
                    nightAwakenings === opt.value
                      ? "border-teal-500 bg-teal-950/40 font-semibold text-white"
                      : "border-slate-800 bg-slate-900 text-slate-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-500"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* КРОК 3: Питання 4-10 (YES/NO) та Питання 11 */}
      {!result && step === 3 && (
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="space-y-2.5">
            {(
              [
                {
                  q: "4. Do you sleep with a television on in your bedroom?",
                  val: tvOn,
                  set: setTvOn,
                },
                {
                  q: "5. Do you sleep with music playing in your bedroom?",
                  val: musicOn,
                  set: setMusicOn,
                },
                {
                  q: "6. Do you sleep with any light on in your bedroom?",
                  val: lightOn,
                  set: setLightOn,
                },
                {
                  q: "7. Do you share a bedroom with anyone else?",
                  val: shareBedroom,
                  set: setShareBedroom,
                },
                {
                  q: "8. Do you ever get too hot or cold while sleeping?",
                  val: tempDiscomfort,
                  set: setTempDiscomfort,
                },
                {
                  q: "9. Do you bring electronic devices, such as smartphones, to bed?",
                  val: devicesInBed,
                  set: setDevicesInBed,
                },
                {
                  q: "10. Do you eat or drink anything right before going to bed?",
                  val: eatBeforeBed,
                  set: setEatBeforeBed,
                },
              ] as const
            ).map((item) => (
              <div
                key={item.q}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-xs"
              >
                <span className="text-slate-200">{item.q}</span>
                <div className="flex shrink-0 gap-1.5">
                  {[true, false].map((choice) => (
                    <button
                      key={String(choice)}
                      type="button"
                      onClick={() => item.set(choice)}
                      className={`rounded-md px-3 py-1 font-semibold transition ${
                        item.val === choice
                          ? "bg-teal-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {choice ? "YES" : "NO"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-200">
              11. List anything else that distracts you during the night while
              you are trying to sleep:
            </label>
            <input
              type="text"
              placeholder="e.g., street noise, overthinking, pets..."
              value={otherDistractions}
              onChange={(e) => setOtherDistractions(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Back
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleCalculate}
              className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Calculate Sleep Score"}
            </button>
          </div>
        </div>
      )}

      {/* ЕКРАН РЕЗУЛЬТАТУ (з бекенду sleep_scoring.py) */}
      {result && (
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-5">
          <div className="space-y-2 text-center">
            <h4 className="text-sm font-bold text-white">
              Sleep Assessment Completed!
            </h4>
            <div className="text-sm text-slate-300">
              Sleep Quality Score:{" "}
              <strong className="text-lg text-white">{result.score}</strong> /
              100
            </div>
            <div
              className={`inline-block rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase ${zoneStyles[result.zone]}`}
            >
              Zone: {result.zone}
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs font-bold text-teal-300">
              💡 Personalized Sleep Tips:
            </p>
            <ul className="list-disc space-y-1.5 pl-4 text-xs text-slate-300">
              {result.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setStep(1);
              }}
              className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Retake Survey
            </button>
            <button
              type="button"
              onClick={() => onSaveResult(result.score)}
              className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-teal-950/50 hover:bg-teal-500"
            >
              Save Result
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { SingleTestProps } from "./testContract";
import { get, post } from "../../services/api";

type SleepResult = {
  score: number;
  zone: "good" | "attention" | "poor";
  tips: string[];
};

type SleepEntry = {
  created_at: string;
  hours: number;
  score: number;
};

type FlagKey =
  | "bright_light"
  | "noise"
  | "temperature"
  | "devices_before_bed"
  | "food_or_caffeine";

const FLAGS: { key: FlagKey; label: string }[] = [
  { key: "bright_light", label: "Bright light" },
  { key: "noise", label: "Noise" },
  { key: "temperature", label: "Too hot or cold" },
  { key: "devices_before_bed", label: "Screens before bed" },
  { key: "food_or_caffeine", label: "Food or caffeine before bed" },
];

const ZONES = {
  good: { text: "Good sleep", color: "text-emerald-400 border-emerald-800 bg-emerald-950/40" },
  attention: { text: "Needs attention", color: "text-yellow-400 border-yellow-800 bg-yellow-950/40" },
  poor: { text: "Poor sleep", color: "text-red-400 border-red-800 bg-red-950/40" },
};

const Scale: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <div className="text-xs text-slate-300">{label}</div>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`h-9 w-9 rounded-lg border text-xs font-semibold transition ${
            value === n
              ? "border-teal-500 bg-teal-600 text-white"
              : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  </div>
);

const SleepChart: React.FC<{ entries: SleepEntry[] }> = ({ entries }) => {
  const data = entries.slice(-14);
  if (data.length === 0) return null;

  const W = 560, H = 220, L = 36, R = 12, T = 12, B = 28;
  const maxY = Math.max(12, Math.ceil(Math.max(...data.map((d) => d.hours))));
  const x = (i: number) =>
    data.length === 1 ? (L + W - R) / 2 : L + (i * (W - L - R)) / (data.length - 1);
  const y = (v: number) => T + (H - T - B) * (1 - v / maxY);

  const ticks: number[] = [];
  for (let t = 0; t <= maxY; t += 2) ticks.push(t);

  const points = data.map((d, i) => `${x(i)},${y(d.hours)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <rect x={L} y={y(9)} width={W - L - R} height={y(7) - y(9)} fill="#10b981" opacity="0.12" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#1e293b" />
          <text x={L - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#94a3b8">
            {t}
          </text>
        </g>
      ))}
      <polyline points={points} fill="none" stroke="#2dd4bf" strokeWidth="2" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.hours)} r="4" fill="#2dd4bf">
            <title>{`${d.hours} h, score ${d.score}`}</title>
          </circle>
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">
            {new Date(d.created_at + "Z").toLocaleDateString(undefined, {
              day: "2-digit",
              month: "2-digit",
            })}
          </text>
        </g>
      ))}
    </svg>
  );
};

export const SleepTest: React.FC<SingleTestProps> = ({ userId, onSaveResult }) => {
  const [hours, setHours] = useState("7");
  const [quality, setQuality] = useState(3);
  const [rested, setRested] = useState(3);
  const [minutes, setMinutes] = useState("15");
  const [awakenings, setAwakenings] = useState("0");
  const [flags, setFlags] = useState<Record<FlagKey, boolean>>({
    bright_light: false,
    noise: false,
    temperature: false,
    devices_before_bed: false,
    food_or_caffeine: false,
  });

  const [result, setResult] = useState<SleepResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<SleepEntry[]>([]);

  const loadHistory = async () => {
    if (!userId) return;
    try {
      const { ok, data } = await get(`/tests/sleep/history/${userId}`);
      if (ok) setHistory(data);
    } catch {
      // сервер недоступний: графік просто не показуємо
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const handleSubmit = async () => {
    const h = Number(hours);
    const m = Number(minutes);
    const a = Number(awakenings);

    if (!userId) {
      setError("Please sign in first.");
      return;
    }
    if (hours === "" || Number.isNaN(h) || h < 0 || h > 16) {
      setError("Enter hours of sleep from 0 to 16.");
      return;
    }
    if (!Number.isInteger(m) || m < 0 || m > 300) {
      setError("Minutes to fall asleep: a whole number from 0 to 300.");
      return;
    }
    if (!Number.isInteger(a) || a < 0 || a > 10) {
      setError("Night awakenings: a whole number from 0 to 10.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const { ok, data } = await post("/tests/sleep/submit", {
        user_id: userId,
        hours: h,
        quality,
        rested,
        minutes_to_fall_asleep: m,
        night_awakenings: a,
        ...flags,
      });
      if (!ok) {
        setError(data.detail ?? "Could not save the result.");
        return;
      }
      setResult(data);
      onSaveResult?.(data.score);
      await loadHistory();
    } catch {
      setError("No connection to the server. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
      <div>
        <h3 className="text-base font-bold text-white">🌙 Daily Sleep Log</h3>
        <p className="text-xs text-slate-400">
          Takes about 30 seconds. Log last night once a day.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="space-y-1.5 text-xs text-slate-300">
          Hours of sleep
          <input
            type="number" min={0} max={16} step={0.5}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="space-y-1.5 text-xs text-slate-300">
          Minutes to fall asleep
          <input
            type="number" min={0} max={300}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="space-y-1.5 text-xs text-slate-300">
          Night awakenings
          <input
            type="number" min={0} max={10}
            value={awakenings}
            onChange={(e) => setAwakenings(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </label>
      </div>

      <Scale label="Sleep quality (1 = very poor, 5 = excellent)" value={quality} onChange={setQuality} />
      <Scale label="How rested do you feel? (1 = exhausted, 5 = fully rested)" value={rested} onChange={setRested} />

      <div className="space-y-2">
        <div className="text-xs text-slate-300">What disturbed your sleep?</div>
        <div className="flex flex-wrap gap-2">
          {FLAGS.map((f) => (
            <label
              key={f.key}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs transition ${
                flags[f.key]
                  ? "border-teal-500 bg-teal-950/30 text-white"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={flags[f.key]}
                onChange={() => setFlags((p) => ({ ...p, [f.key]: !p[f.key] }))}
              />
              {f.label}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save today's sleep"}
      </button>

      {error && <div className="text-xs text-red-400">{error}</div>}

      {result && (
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-white">{result.score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${ZONES[result.zone].color}`}>
              {ZONES[result.zone].text}
            </span>
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {result.tips.map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
          <div className="text-[10px] text-slate-500">
            Self-assessment only, not a medical diagnosis.
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-white">Hours of sleep by day</div>
          <SleepChart entries={history} />
          <div className="text-[10px] text-slate-500">
            The green band marks 7-9 hours.
          </div>
        </div>
      )}
    </div>
  );
};
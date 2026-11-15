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
  good: {
    text: "Good sleep",
    color: "text-[#35634e] border-[#b6d3c2] bg-[#dcebe2]",
  },
  attention: {
    text: "Needs attention",
    color: "text-[#8f621d] border-[#e4cfa3] bg-[#f5e7ce]",
  },
  poor: {
    text: "Poor sleep",
    color: "text-[#9b3d30] border-[#e2b6ae] bg-[#f4dcd7]",
  },
};

const Scale: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <div className="text-xs font-semibold text-[#475b52]">{label}</div>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`h-9 w-9 rounded-xl border text-xs font-bold transition ${
            value === n
              ? "border-[#587e6e] bg-[#587e6e] text-white shadow-2xs"
              : "border-[#cfd9d1] bg-[#f6f4ec] text-[#475b52] hover:border-[#86a694]"
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

  const W = 560,
    H = 220,
    L = 36,
    R = 12,
    T = 12,
    B = 28;
  const maxY = Math.max(12, Math.ceil(Math.max(...data.map((d) => d.hours))));
  const x = (i: number) =>
    data.length === 1
      ? (L + W - R) / 2
      : L + (i * (W - L - R)) / (data.length - 1);
  const y = (v: number) => T + (H - T - B) * (1 - v / maxY);

  const ticks: number[] = [];
  for (let t = 0; t <= maxY; t += 2) ticks.push(t);

  const points = data.map((d, i) => `${x(i)},${y(d.hours)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-2"
    >
      <rect
        x={L}
        y={y(9)}
        width={W - L - R}
        height={y(7) - y(9)}
        fill="#5b8e76"
        opacity="0.16"
      />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#dce3dc" />
          <text
            x={L - 6}
            y={y(t) + 3}
            textAnchor="end"
            fontSize="10"
            fill="#6b7d75"
          >
            {t}
          </text>
        </g>
      ))}
      <polyline
        points={points}
        fill="none"
        stroke="#587e6e"
        strokeWidth="2.5"
      />
      {data.map((d, i) => (
        <g key={i}>
          <circle
            cx={x(i)}
            cy={y(d.hours)}
            r="4.5"
            fill="#587e6e"
            stroke="#fcfbf7"
            strokeWidth="1.5"
          >
            <title>{`${d.hours} h, score ${d.score}`}</title>
          </circle>
          <text
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize="10"
            fill="#6b7d75"
          >
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

export const SleepTest: React.FC<SingleTestProps> = ({
  userId,
  onSaveResult,
}) => {
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

  const refreshHistory = async (id: number) => {
    try {
      const { ok, data } = await get(`/tests/sleep/history/${id}`);
      if (ok) setHistory(data);
    } catch {
      // сервер недоступний: графік просто не показуємо
    }
  };

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const { ok, data } = await get(`/tests/sleep/history/${userId}`);
        if (ok && isMounted) setHistory(data);
      } catch {
        // сервер недоступний: графік просто не показуємо
      }
    };

    void fetchHistory();
    return () => {
      isMounted = false;
    };
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
      await refreshHistory(userId);
    } catch {
      setError("No connection to the server. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 shadow-xs">
      <div>
        <h3 className="text-base font-bold text-[#2b3a34]">
          🌙 Daily Sleep Log
        </h3>
        <p className="text-xs text-[#6b7d75]">
          Takes about 30 seconds. Log last night once a day.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="space-y-1.5 text-xs font-semibold text-[#586b63]">
          Hours of sleep
          <input
            type="number"
            min={0}
            max={16}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#cfd9d1] bg-[#f6f4ec] px-3 py-2 text-sm text-[#2b3a34] focus:border-[#587e6e] focus:outline-none"
          />
        </label>
        <label className="space-y-1.5 text-xs font-semibold text-[#586b63]">
          Minutes to fall asleep
          <input
            type="number"
            min={0}
            max={300}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#cfd9d1] bg-[#f6f4ec] px-3 py-2 text-sm text-[#2b3a34] focus:border-[#587e6e] focus:outline-none"
          />
        </label>
        <label className="space-y-1.5 text-xs font-semibold text-[#586b63]">
          Night awakenings
          <input
            type="number"
            min={0}
            max={10}
            value={awakenings}
            onChange={(e) => setAwakenings(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#cfd9d1] bg-[#f6f4ec] px-3 py-2 text-sm text-[#2b3a34] focus:border-[#587e6e] focus:outline-none"
          />
        </label>
      </div>

      <Scale
        label="Sleep quality (1 = very poor, 5 = excellent)"
        value={quality}
        onChange={setQuality}
      />
      <Scale
        label="How rested do you feel? (1 = exhausted, 5 = fully rested)"
        value={rested}
        onChange={setRested}
      />

      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#475b52]">
          What disturbed your sleep?
        </div>
        <div className="flex flex-wrap gap-2">
          {FLAGS.map((f) => (
            <label
              key={f.key}
              className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs transition ${
                flags[f.key]
                  ? "border-[#587e6e] bg-[#eaf0eb] font-bold text-[#2b3a34]"
                  : "border-[#cfd9d1] bg-[#f6f4ec] font-medium text-[#586b63] hover:border-[#86a694]"
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
        className="rounded-xl bg-[#587e6e] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#48695b] disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save today's sleep"}
      </button>

      {error && (
        <div className="text-xs font-semibold text-[#9b3d30]">{error}</div>
      )}

      {result && (
        <div className="space-y-3 rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-[#2b3a34]">
              {result.score}
            </span>
            <span className="text-xs font-semibold text-[#6b7d75]">/ 100</span>
            <span
              className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${ZONES[result.zone].color}`}
            >
              {ZONES[result.zone].text}
            </span>
          </div>
          <ul className="space-y-1 text-xs text-[#475b52]">
            {result.tips.map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
          <div className="text-[10px] text-[#6b7d75]">
            Self-assessment only, not a medical diagnosis.
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-[#2b3a34]">
            Hours of sleep by day
          </div>
          <SleepChart entries={history} />
          <div className="text-[10px] text-[#6b7d75]">
            The sage green band marks 7-9 hours.
          </div>
        </div>
      )}
    </div>
  );
};

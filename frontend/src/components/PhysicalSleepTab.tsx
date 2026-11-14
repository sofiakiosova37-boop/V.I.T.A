import React, { useState } from "react";
import { SleepRecord } from "../types/health";

interface PhysicalSleepTabProps {
  sleepHistory: SleepRecord[];
  onAddSleep: (record: SleepRecord) => void;
}

const REHAB_PROTOCOLS: Record<string, { title: string; exercises: string[] }> =
  {
    back: {
      title: "Поперековий відділ (розтягнення хребта в мікрогравітації)",
      exercises: [
        "Вправа А: Підтягування колін до грудей із фіксацією ременем — 3 підходи по 30 сек.",
        "Вправа Б: Ізометричне напруження м’язів кору на тренажері ARED — 2 хв.",
      ],
    },
    neck: {
      title: "Шийно-комірцева зона (перевантаження після роботи в шоломі)",
      exercises: [
        "Вправа А: Повільні ізометричні нахили голови з легким опором долоні — 10 повторів.",
        "Вправа Б: Зведення лопаток із еспандером — 3 підходи по 12 разів.",
      ],
    },
    knees: {
      title: "Колінні суглоби та гомілковостоп (профілактика остеопенії)",
      exercises: [
        "Вправа А: Присідання з помірним навантаженням на ARED — 3х10.",
        "Вправа Б: Велоергометр CEVIS у низькоударному режимі — 15 хвилин.",
      ],
    },
  };

export const PhysicalSleepTab: React.FC<PhysicalSleepTabProps> = ({
  sleepHistory,
  onAddSleep,
}) => {
  const [hours, setHours] = useState<number>(7.5);
  const [quality, setQuality] = useState<number>(8);
  const [painZone, setPainZone] = useState<"back" | "neck" | "knees">("back");
  const [completedWorkouts, setCompletedWorkouts] = useState<
    Record<string, boolean>
  >({
    cardio: true,
    strength: false,
    stretch: false,
  });

  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSleep({
      day: `Д-${sleepHistory.length + 1}`,
      hours,
      quality,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Опитування та діаграма якості сну */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-base font-bold text-white">
            😴 Моніторинг сну та циркадних ритмів
          </h3>

          {/* Візуальна стовпчикова діаграма */}
          <div className="mt-4 flex h-40 items-end justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950 p-4">
            {sleepHistory.map((rec, idx) => (
              <div
                key={idx}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span className="font-mono text-[10px] text-cyan-300">
                  {rec.hours}г
                </span>
                <div
                  style={{
                    height: `${Math.min(100, (rec.hours / 10) * 100)}%`,
                  }}
                  className={`w-full max-w-[32px] rounded-t transition-all ${
                    rec.hours >= 7 ? "bg-cyan-500" : "bg-amber-500"
                  }`}
                />
                <span className="text-[10px] text-slate-400">{rec.day}</span>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSaveSleep}
            className="mt-4 grid grid-cols-2 gap-3"
          >
            <div>
              <label className="text-xs text-slate-400">
                Тривалість сну (год)
              </label>
              <input
                type="number"
                step="0.5"
                min={2}
                max={12}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">
                Суб&apos;єктивна якість (1–10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-white"
              />
            </div>
            <button
              type="submit"
              className="col-span-2 rounded-lg bg-cyan-600 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
            >
              Додати запис сну до діаграми
            </button>
          </form>
        </div>

        {/* Розклад тренувань + Реабілітація */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
          <h3 className="text-base font-bold text-white">
            🏋️ Фізичний протокол та реабілітація
          </h3>

          {/* Щоденний чек-лист вправ */}
          <div className="mt-3 space-y-2">
            {[
              {
                id: "cardio",
                label: "Бігова доріжка T2 (45 хв кардіо-навантаження)",
              },
              {
                id: "strength",
                label: "Силовий тренажер ARED (профілактика атрофії м’язів)",
              },
              { id: "stretch", label: "Вечірня декомпресія хребта (15 хв)" },
            ].map((w) => (
              <label
                key={w.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-950 p-2.5 text-xs text-slate-200"
              >
                <input
                  type="checkbox"
                  checked={!!completedWorkouts[w.id]}
                  onChange={() =>
                    setCompletedWorkouts((prev) => ({
                      ...prev,
                      [w.id]: !prev[w.id],
                    }))
                  }
                  className="h-4 w-4 accent-cyan-500"
                />
                <span
                  className={
                    completedWorkouts[w.id] ? "line-through text-slate-500" : ""
                  }
                >
                  {w.label}
                </span>
              </label>
            ))}
          </div>

          {/* Підбір реабілітації при болю */}
          <div className="mt-5 border-t border-slate-800 pt-4">
            <p className="text-xs font-semibold text-amber-300">
              🩹 Модуль реабілітації: оберіть зону дискомфорту
            </p>
            <div className="mt-2 flex gap-2">
              {(
                [
                  { id: "back", label: "Поперек" },
                  { id: "neck", label: "Шия / Плечі" },
                  { id: "knees", label: "Коліна" },
                ] as const
              ).map((z) => (
                <button
                  key={z.id}
                  onClick={() => setPainZone(z.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    painZone === z.id
                      ? "bg-amber-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>

            <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs">
              <p className="font-bold text-amber-200">
                {REHAB_PROTOCOLS[painZone].title}
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-slate-300">
                {REHAB_PROTOCOLS[painZone].exercises.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { ExerciseItem, WeeklyCheckupEntry } from "../types/health";

interface HistoryAndScheduleTabProps {
  history: WeeklyCheckupEntry[];
  exercises: ExerciseItem[];
  onToggleExercise: (id: string) => void;
}

export const HistoryAndScheduleTab: React.FC<HistoryAndScheduleTabProps> = ({
  history,
  exercises,
  onToggleExercise,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Weekly History & Trends */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
        <h3 className="text-base font-bold text-white">
          📈 Checkup History &amp; Trends
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Timeline of your weekly sleep and mental well-being assessments
        </p>

        <div className="mt-4 space-y-2.5">
          {[...history].reverse().map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-3.5 w-3.5 rounded-full ${
                    item.status === "green"
                      ? "bg-emerald-500"
                      : item.status === "yellow"
                        ? "bg-amber-400"
                        : "bg-red-500"
                  }`}
                />
                <div>
                  <p className="font-bold text-white">
                    {item.weekLabel}{" "}
                    <span className="font-normal text-slate-400">
                      ({item.date})
                    </span>
                  </p>
                  <p className="mt-0.5 text-slate-400">
                    Mental Index:{" "}
                    <strong className="text-indigo-300">
                      {item.psychScore}%
                    </strong>{" "}
                    • Sleep:{" "}
                    <strong className="text-teal-300">
                      {item.sleepHours} hrs
                    </strong>{" "}
                    ({item.sleepQuality}/10)
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 font-semibold ${
                  item.status === "green"
                    ? "bg-emerald-950 text-emerald-300"
                    : item.status === "yellow"
                      ? "bg-amber-950 text-amber-300"
                      : "bg-red-950 text-red-300"
                }`}
              >
                {item.status === "green"
                  ? "Optimal"
                  : item.status === "yellow"
                    ? "Caution"
                    : "Critical"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Exercise Schedule */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
        <h3 className="text-base font-bold text-white">
          🏃 Weekly Exercise Schedule
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Check off completed workouts to maintain energy and relieve stress
        </p>

        <div className="mt-4 space-y-2.5">
          {exercises.map((ex) => (
            <label
              key={ex.id}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs hover:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={ex.completed}
                  onChange={() => onToggleExercise(ex.id)}
                  className="h-4 w-4 accent-teal-500"
                />
                <div>
                  <p
                    className={`font-semibold ${ex.completed ? "line-through text-slate-500" : "text-white"}`}
                  >
                    {ex.day}: {ex.title}
                  </p>
                  <p className="text-slate-400">
                    {ex.category} • {ex.duration}
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300">
                {ex.completed ? "Completed" : "Scheduled"}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

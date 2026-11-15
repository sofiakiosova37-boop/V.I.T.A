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
      <div className="rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 shadow-xs">
        <h3 className="text-base font-bold text-[#2b3a34]">
          📖 Checkup History &amp; Trends
        </h3>
        <p className="mt-1 text-xs text-[#6b7d75]">
          Timeline of your weekly sleep and mental well-being assessments
        </p>

        <div className="mt-4 space-y-2.5">
          {[...history].reverse().map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-3.5 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-3.5 w-3.5 rounded-full ${
                    item.status === "green"
                      ? "bg-[#5b8e76]"
                      : item.status === "yellow"
                        ? "bg-[#e2a84b]"
                        : "bg-[#d96b5b]"
                  }`}
                />
                <div>
                  <p className="font-bold text-[#2b3a34]">
                    {item.weekLabel}{" "}
                    <span className="font-normal text-[#6b7d75]">
                      ({item.date})
                    </span>
                  </p>
                  <p className="mt-0.5 text-[#586b63]">
                    Mental Index:{" "}
                    <strong className="text-[#4a6f82]">
                      {item.psychScore}%
                    </strong>{" "}
                    • Sleep:{" "}
                    <strong className="text-[#3f6656]">
                      {item.sleepHours} hrs
                    </strong>{" "}
                    ({item.sleepQuality}/10)
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 font-bold ${
                  item.status === "green"
                    ? "bg-[#dcebe2] text-[#35634e]"
                    : item.status === "yellow"
                      ? "bg-[#f5e7ce] text-[#8f621d]"
                      : "bg-[#f4dcd7] text-[#9b3d30]"
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
      <div className="rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 shadow-xs">
        <h3 className="text-base font-bold text-[#2b3a34]">
          🌿 Weekly Exercise Schedule
        </h3>
        <p className="mt-1 text-xs text-[#6b7d75]">
          Check off completed workouts to maintain energy and relieve stress
        </p>

        <div className="mt-4 space-y-2.5">
          {exercises.map((ex) => (
            <label
              key={ex.id}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-3.5 text-xs transition hover:border-[#b7c7bc]"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={ex.completed}
                  onChange={() => onToggleExercise(ex.id)}
                  className="h-4 w-4 rounded accent-[#587e6e]"
                />
                <div>
                  <p
                    className={`font-bold ${
                      ex.completed
                        ? "line-through text-[#899991]"
                        : "text-[#2b3a34]"
                    }`}
                  >
                    {ex.day}: {ex.title}
                  </p>
                  <p className="text-[#6b7d75]">
                    {ex.category} • {ex.duration}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                  ex.completed
                    ? "bg-[#dcebe2] text-[#35634e]"
                    : "bg-[#e7e8df] text-[#586b63]"
                }`}
              >
                {ex.completed ? "Completed" : "Scheduled"}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

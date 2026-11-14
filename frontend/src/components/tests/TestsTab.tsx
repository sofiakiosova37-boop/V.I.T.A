import React, { useState } from "react";
import { TestSummary } from "../../types/health";
import { BurnoutTest } from "./BurnoutTest";
import { DepressionTest } from "./DepressionTest";
import { ReactionTest } from "./ReactionTest";
import { SleepTest } from "./SleepTest";

interface TestsTabProps {
  summary: TestSummary;
  onUpdateSummary: (updated: Partial<TestSummary>) => void;
}

type ActiveTest = "depression" | "burnout" | "sleep" | "reaction";

export const TestsTab: React.FC<TestsTabProps> = ({
  summary,
  onUpdateSummary,
}) => {
  const [selectedTest, setSelectedTest] = useState<ActiveTest>("depression");

  const tabs = [
    {
      id: "depression" as const,
      title: "🌧 Скринінг депресії",
      badge:
        summary.depressionScore !== undefined
          ? `${summary.depressionScore} балів`
          : "Не пройдено",
    },
    {
      id: "burnout" as const,
      title: "🔋 Тест на вигорання",
      badge:
        summary.burnoutPercent !== undefined
          ? `${summary.burnoutPercent}%`
          : "Не пройдено",
    },
    {
      id: "sleep" as const,
      title: "🌙 Якість сну",
      badge:
        summary.sleepIndex !== undefined
          ? `${summary.sleepIndex}%`
          : "Не пройдено",
    },
    {
      id: "reaction" as const,
      title: "⚡ Швидкість реакції",
      badge:
        summary.reactionMs !== undefined
          ? `${summary.reactionMs} мс`
          : "Не пройдено",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Меню вибору тесту */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTest(tab.id)}
            className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
              selectedTest === tab.id
                ? "border-teal-400 bg-teal-950/30 text-white"
                : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700"
            }`}
          >
            <span className="text-sm font-bold">{tab.title}</span>
            <span className="mt-2 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-teal-300">
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Рендер ізольованого компонента кожного розробника */}
      {selectedTest === "depression" && (
        <DepressionTest
          savedResult={summary.depressionScore}
          onSaveResult={(score) => onUpdateSummary({ depressionScore: score })}
        />
      )}

      {selectedTest === "burnout" && (
        <BurnoutTest
          savedResult={summary.burnoutPercent}
          onSaveResult={(percent) =>
            onUpdateSummary({ burnoutPercent: percent })
          }
        />
      )}

      {selectedTest === "sleep" && (
        <SleepTest
          savedResult={summary.sleepIndex}
          onSaveResult={(index) => onUpdateSummary({ sleepIndex: index })}
        />
      )}

      {selectedTest === "reaction" && (
        <ReactionTest
          savedResult={summary.reactionMs}
          onSaveResult={(ms) => onUpdateSummary({ reactionMs: ms })}
        />
      )}
    </div>
  );
};

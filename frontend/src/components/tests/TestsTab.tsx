import React, { useState } from "react";
import { TestSummary } from "../../types/health";
import { BurnoutTest } from "./BurnoutTest";
import { DepressionTest } from "./DepressionTest";
import { ReactionTest } from "./ReactionTest";
import { SleepTest } from "./SleepTest";
import {TwoBackTest} from "./MemoryTest";
import { saveTestResult } from "../../services/api";

interface TestsTabProps {
  summary: TestSummary;
  onUpdateSummary: (updated: Partial<TestSummary>) => void;
}

type ActiveTest = "depression" | "burnout" | "sleep" | "reaction" | "memory";

export const TestsTab: React.FC<TestsTabProps> = ({
  summary,
  onUpdateSummary,
}) => {
  const [selectedTest, setSelectedTest] = useState<ActiveTest>("depression");

  const tabs = [
    {
      id: "depression" as const,
      title: "🌧 Depression Screening",
      badge:
        summary.depressionScore !== undefined
          ? `${summary.depressionScore} pts`
          : "Not taken",
    },
    {
      id: "burnout" as const,
      title: "🔥 Burnout Assessment",
      badge:
        summary.burnoutPercent !== undefined
          ? `${summary.burnoutPercent} pts`
          : "Not taken",
    },
    {
      id: "sleep" as const,
      title: "🌙 Sleep Quality Index",
      badge:
        summary.sleepIndex !== undefined
          ? `${summary.sleepIndex}%`
          : "Not taken",
    },
    {
      id: "reaction" as const,
      title: "⚡ Reaction Speed",
      badge:
        summary.reactionMs !== undefined
          ? `${summary.reactionMs} ms`
          : "Not taken",
    },
    {
      id: "memory" as const,
      title: "🧠 Working Memory (2-Back)",
      badge: summary.memoryScore !== undefined 
        ? `${summary.memoryScore} pts` 
        : "Not taken",
},
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tabs.map((tab) => {
          const isSelected = selectedTest === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTest(tab.id)}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-[#587e6e] bg-[#eaf0eb] text-[#2b3a34] shadow-xs ring-1 ring-[#9eb8a9]"
                  : "border-[#dce3dc] bg-[#fcfbf7] text-[#586b63] hover:border-[#b7c7bc] hover:bg-[#f3f2ea]"
              }`}
            >
              <span className="text-sm font-bold text-[#2b3a34]">
                {tab.title}
              </span>
              <span
                className={`mt-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  isSelected
                    ? "bg-[#587e6e] text-white"
                    : "bg-[#eaf0eb] text-[#3f6656]"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {selectedTest === "depression" && (
        <DepressionTest
          userId={2}
          savedResult={summary.depressionScore}
          onSaveResult={(score) => onUpdateSummary({ depressionScore: score })}
        />
      )}

      {selectedTest === "burnout" && (
        <BurnoutTest
          userId={2}
          savedResult={summary.burnoutPercent}
          onSaveResult={(percent) =>
            onUpdateSummary({ burnoutPercent: percent })
          }
        />
      )}

      {selectedTest === "sleep" && (
        <SleepTest
          userId={2}
          savedResult={summary.sleepIndex}
          onSaveResult={(index) => onUpdateSummary({ sleepIndex: index })}
        />
      )}

      {selectedTest === "reaction" && (
        <ReactionTest
          userId={2}
          savedResult={summary.reactionMs}
          onSaveResult={(ms) => onUpdateSummary({ reactionMs: ms })}
        />
      )}

      {selectedTest === "memory" && (
        <TwoBackTest 
          savedResult={summary.memoryScore}
          onSaveResult={async (score) => {
            onUpdateSummary({ memoryScore: score });
            try {
              await saveTestResult({ memoryScore: score });
            } catch (e) {
              console.error("Failed to sync memory score with backend", e);
            }
          }} 
        />
      )}
    </div>
  );
};

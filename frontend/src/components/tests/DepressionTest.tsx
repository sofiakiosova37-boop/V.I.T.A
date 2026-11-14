import React, { useState } from "react";
import { SingleTestProps } from "./testContract";

export const DepressionTest: React.FC<SingleTestProps> = ({
  savedResult,
  onSaveResult,
}) => {
  const [score, setScore] = useState<number>(savedResult ?? 0);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
      <h3 className="text-base font-bold text-white">
        🌧 Depression Screening Test
      </h3>
      <p className="text-xs text-slate-400">
        [Module in progress] PHQ-9 questionnaire and score calculation will be
        implemented here.
      </p>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={0}
          max={27}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
        <button
          onClick={() => onSaveResult(score)}
          className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500"
        >
          Save Result
        </button>
      </div>
    </div>
  );
};

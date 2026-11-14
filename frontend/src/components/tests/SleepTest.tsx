import React, { useState } from "react";
import { SingleTestProps } from "./testContract";

export const SleepTest: React.FC<SingleTestProps> = ({
  savedResult,
  onSaveResult,
}) => {
  const [sleepIndex, setSleepIndex] = useState<number>(savedResult ?? 80);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
      <h3 className="text-base font-bold text-white">
        🌙 Sleep Quality &amp; Hygiene Assessment
      </h3>
      <p className="text-xs text-slate-400">
        [Module in progress] Sleep quality index (PSQI) questionnaire and
        insights will be implemented here.
      </p>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={0}
          max={100}
          value={sleepIndex}
          onChange={(e) => setSleepIndex(Number(e.target.value))}
          className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
        <button
          onClick={() => onSaveResult(sleepIndex)}
          className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500"
        >
          Save Sleep Index
        </button>
      </div>
    </div>
  );
};

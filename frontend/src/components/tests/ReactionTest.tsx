import React, { useState } from "react";
import { SingleTestProps } from "./testContract";

export const ReactionTest: React.FC<SingleTestProps> = ({
  savedResult,
  onSaveResult,
}) => {
  const [ms, setMs] = useState<number>(savedResult ?? 250);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4">
      <h3 className="text-base font-bold text-white">
        ⚡ Тест швидкості реакції
      </h3>
      <p className="text-xs text-slate-400">
        [Модуль у розробці] Тут буде інтерактивна гра на швидкість кліку (у
        мілісекундах).
      </p>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={100}
          max={2000}
          value={ms}
          onChange={(e) => setMs(Number(e.target.value))}
          className="w-28 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
        <button
          onClick={() => onSaveResult(ms)}
          className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500"
        >
          Зберегти час (мс)
        </button>
      </div>
    </div>
  );
};

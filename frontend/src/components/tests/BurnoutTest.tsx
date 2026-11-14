import React, { useState } from "react";
import { SingleTestProps } from "./testContract";

export const BurnoutTest: React.FC<SingleTestProps> = ({
  savedResult,
  onSaveResult,
}) => {
  const [percent, setPercent] = useState<number>(savedResult ?? 25);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4">
      <h3 className="text-base font-bold text-white">
        🔋 Тест на емоційне та навчальне вигорання
      </h3>
      <p className="text-xs text-slate-400">
        [Модуль у розробці] Тут буде шкала оцінки виснаження та відсоток
        вигорання.
      </p>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={0}
          max={100}
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
          className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
        <button
          onClick={() => onSaveResult(percent)}
          className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500"
        >
          Зберегти результат (%)
        </button>
      </div>
    </div>
  );
};

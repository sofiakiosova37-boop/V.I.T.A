import React, { useState } from "react";
import { LogEntry, PsychTestResult } from "../types/health";

interface PsychAndLogTabProps {
  latestPsych: PsychTestResult;
  onSavePsych: (result: PsychTestResult) => void;
  logs: LogEntry[];
  onAddLog: (entry: LogEntry) => void;
  missionDay: number;
}

export const PsychAndLogTab: React.FC<PsychAndLogTabProps> = ({
  latestPsych,
  onSavePsych,
  logs,
  onAddLog,
  missionDay,
}) => {
  const [isolation, setIsolation] = useState<number>(
    latestPsych.isolationScore,
  );
  const [mood, setMood] = useState<number>(latestPsych.moodExhaustion);
  const [aggression, setAggression] = useState<number>(
    latestPsych.socialAggression,
  );
  const [cognitive, setCognitive] = useState<number>(latestPsych.cognitiveLoad);

  const [logText, setLogText] = useState<string>("");
  const [logMood, setLogMood] = useState<"good" | "neutral" | "stressed">(
    "good",
  );
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);

  const totalPercent = Math.round(
    (isolation + mood + aggression + cognitive) / 4,
  );

  const getInterpretation = (score: number) => {
    if (score <= 30) {
      return {
        label: "0–30%: Нормальна адаптація",
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/30",
        advice:
          "Психоемоційний стан стабільний. Підтримуйте регулярний зв’язок із близькими.",
      };
    }
    if (score <= 60) {
      return {
        label: "31–60%: Накопичення втоми — потрібна корекція",
        color: "text-amber-400 border-amber-500/40 bg-amber-950/30",
        advice:
          "Рекомендовано знизити позапланове навантаження, додати 40 хв відпочинку та світлотерапію.",
      };
    }
    return {
      label: "61–100%: Критичний стан — потрібна допомога!",
      color: "text-red-400 border-red-500/40 bg-red-950/30",
      advice:
        "Активовано протокол психологічної підтримки. Обов’язкова сесія з психологом ЦУП.",
    };
  };

  const interpretation = getInterpretation(totalPercent);

  const handleSaveTest = () => {
    onSavePsych({
      date: new Date().toLocaleDateString("uk-UA"),
      isolationScore: isolation,
      moodExhaustion: mood,
      socialAggression: aggression,
      cognitiveLoad: cognitive,
      totalPercent,
    });
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logText.trim()) return;

    onAddLog({
      id: crypto.randomUUID(),
      missionDay,
      timestamp: new Date().toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mood: logMood,
      text: logText.trim(),
      voiceStressIndex: isRecordingVoice
        ? Math.floor(20 + Math.random() * 45)
        : undefined,
    });
    setLogText("");
    setIsRecordingVoice(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Тест на процент ізоляції (4 категорії) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-base font-bold text-white">
          🧠 Оцінка психологічної ізоляції
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Оцініть кожен блок від 0% (відсутність симптомів) до 100%
          (максимальний дискомфорт)
        </p>

        <div className="mt-4 space-y-4">
          {[
            {
              label: "1. Відчуття ізоляції та замкненого простору",
              val: isolation,
              set: setIsolation,
            },
            {
              label: "2. Настрій та емоційне виснаження",
              val: mood,
              set: setMood,
            },
            {
              label: "3. Соціальна емоційність (напруга, дратівливість)",
              val: aggression,
              set: setAggression,
            },
            {
              label: "4. Когнітивні функції та зниження працездатності",
              val: cognitive,
              set: setCognitive,
            },
          ].map((item, i) => (
            <div key={i} className="rounded-lg bg-slate-950 p-3">
              <div className="flex justify-between text-xs font-medium text-slate-200">
                <span>{item.label}</span>
                <span className="font-mono text-cyan-400">{item.val}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={item.val}
                onChange={(e) => item.set(Number(e.target.value))}
                className="mt-2 w-full accent-cyan-500"
              />
            </div>
          ))}
        </div>

        <div className={`mt-5 rounded-xl border p-4 ${interpretation.color}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">{interpretation.label}</span>
            <span className="text-2xl font-extrabold">{totalPercent}%</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-200">
            {interpretation.advice}
          </p>
        </div>

        <button
          onClick={handleSaveTest}
          className="mt-4 w-full rounded-lg bg-cyan-600 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
        >
          Зафіксувати результат у картці здоров&apos;я
        </button>
      </div>

      {/* Електронний бортовий щоденник */}
      <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-base font-bold text-white">
          📓 Електронний бортовий щоденник
        </h3>
        <form onSubmit={handleCreateLog} className="mt-3 space-y-3">
          <div className="flex gap-2">
            {(
              [
                { id: "good", label: "😊 Норма" },
                { id: "neutral", label: "😐 Втома" },
                { id: "stressed", label: "😣 Напруга" },
              ] as const
            ).map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setLogMood(m.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  logMood === m.id
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {m.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsRecordingVoice((v) => !v)}
              className={`ml-auto rounded-lg border px-3 py-1.5 text-xs font-medium ${
                isRecordingVoice
                  ? "border-rose-500 bg-rose-950/60 text-rose-300"
                  : "border-slate-700 bg-slate-800 text-slate-300"
              }`}
            >
              {isRecordingVoice
                ? "🎙 Аудіо-аналіз увімкнено"
                : "🎙 Додати голосовий маркер"}
            </button>
          </div>

          <textarea
            rows={3}
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            placeholder="Запишіть спостереження щодо самопочуття, сну чи взаємодії в екіпажі..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder-slate-500"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-800 py-2 text-sm font-semibold text-cyan-300 hover:bg-slate-700"
          >
            + Зберегти запис (День місії #{missionDay})
          </button>
        </form>

        <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto max-h-64 pr-1">
          {logs.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span>
                  День #{entry.missionDay} • {entry.timestamp}
                </span>
                <span>
                  {entry.mood === "good"
                    ? "😊"
                    : entry.mood === "neutral"
                      ? "😐"
                      : "😣"}
                  {entry.voiceStressIndex !== undefined &&
                    ` | Стрес голосу: ${entry.voiceStressIndex}%`}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-slate-200">{entry.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

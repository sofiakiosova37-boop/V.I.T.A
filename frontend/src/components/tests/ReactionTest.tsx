import React, { useState, useRef } from "react";
import { SingleTestProps } from "./testContract";
import { post } from "../../services/api";

type GameState =
  | "IDLE"
  | "WAITING"
  | "READY"
  | "RESULT"
  | "TOO_EARLY"
  | "FINAL";

interface ReactionResult {
  avg_ms: number;
  baseline_ms?: number;
  tips: string[];
}

export const ReactionTest: React.FC<SingleTestProps> = ({
  userId,
  onSaveResult,
}) => {
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [currentAttempt, setCurrentAttempt] = useState<number>(1);
  const [currentMs, setCurrentMs] = useState<number>(0);
  const [attempts, setAttempts] = useState<number[]>([]);

  const [result, setResult] = useState<ReactionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const TOTAL_ATTEMPTS = 5;

  const startAttempt = () => {
    setGameState("WAITING");

    const randomDelay = Math.floor(Math.random() * 2000) + 1500;

    timeoutRef.current = window.setTimeout(() => {
      setGameState("READY");
      startTimeRef.current = performance.now();
    }, randomDelay);
  };

  const handleClick = () => {
    if (gameState === "WAITING") {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      setGameState("TOO_EARLY");
    } else if (gameState === "READY") {
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTimeRef.current);
      setCurrentMs(timeMs);

      const newAttempts = [...attempts, timeMs];
      setAttempts(newAttempts);

      if (currentAttempt < TOTAL_ATTEMPTS) {
        setGameState("RESULT");
      } else {
        setGameState("FINAL");
      }
    }
  };

  const handleNextAttempt = () => {
    setCurrentAttempt((prev) => prev + 1);
    startAttempt();
  };

  const getReactionEvaluation = (avgMs: number) => {
    if (avgMs <= 150) {
      return {
        text: "Extremely high (professional esports players, race drivers, record-breaking results).",
        color: "text-[#35634e] border-[#b6d3c2] bg-[#dcebe2]",
      };
    } else if (avgMs <= 200) {
      return {
        text: "Excellent result (fast reaction typical for young active individuals and trained athletes).",
        color: "text-[#3f6656] border-[#c8d6cc] bg-[#eaf0eb]",
      };
    } else if (avgMs <= 250) {
      return {
        text: "Average / normal score (classic human baseline).",
        color: "text-[#8f621d] border-[#e4cfa3] bg-[#f5e7ce]",
      };
    } else if (avgMs <= 300) {
      return {
        text: "Below average (reaction slightly slowed down due to fatigue, distraction, or age).",
        color: "text-[#a95834] border-[#e7cbbd] bg-[#fbf1ec]",
      };
    } else {
      return {
        text: "Slow reaction (may be caused by fatigue, sleep deprivation, external factors, or display hardware lag).",
        color: "text-[#9b3d30] border-[#e2b6ae] bg-[#f4dcd7]",
      };
    }
  };

  const averageMs =
    attempts.length > 0
      ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
      : 0;

  const evaluation = getReactionEvaluation(averageMs);

  const handleSubmitResult = async () => {
    try {
      const { ok, data } = await post("/tests/reaction/submit", {
        user_id: userId,
        attempts,
      });
      if (!ok) {
        setError(data.detail ?? "Не удалось сохранить результат.");
        return;
      }
      setError(null);
      setResult(data);
      onSaveResult?.(data.avg_ms);
    } catch {
      setError("Нет связи с сервером. Запущен ли бэкенд?");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 text-center shadow-xs">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#2b3a34]">
            ⚡ Reaction Speed &amp; Focus Test
          </h3>
          {gameState !== "IDLE" && gameState !== "FINAL" && (
            <span className="text-xs font-semibold text-[#6b7d75]">
              Attempt {currentAttempt} of {TOTAL_ATTEMPTS}
            </span>
          )}
        </div>
        <p className="text-xs text-[#6b7d75]">
          Click the box as soon as it turns green! (5 attempts)
        </p>
      </div>

      {gameState === "IDLE" && (
        <div
          onClick={startAttempt}
          className="cursor-pointer space-y-2 rounded-2xl border border-[#b7c7bc] bg-[#eaf0eb] p-12 transition-all hover:bg-[#dfe9e1]"
        >
          <div className="text-base font-extrabold text-[#2f5243]">
            Click here to start
          </div>
          <div className="text-xs text-[#586b63]">
            Test your reaction across 5 rounds.
          </div>
        </div>
      )}

      {gameState === "WAITING" && (
        <div
          onClick={handleClick}
          className="cursor-pointer select-none space-y-2 rounded-2xl border border-[#e7cbbd] bg-[#fbf1ec] p-12 transition-all"
        >
          <div className="text-base font-extrabold text-[#b3543a]">
            Wait for green...
          </div>
          <div className="text-xs text-[#7d5a4f]">Don't click yet!</div>
        </div>
      )}

      {gameState === "READY" && (
        <div
          onClick={handleClick}
          className="animate-pulse cursor-pointer select-none space-y-2 rounded-2xl border border-[#4a7462] bg-[#5b8e76] p-12 shadow-md transition-all"
        >
          <div className="text-lg font-extrabold text-white">CLICK NOW!</div>
          <div className="text-xs text-[#e5f2eb]">Tap fast!</div>
        </div>
      )}

      {gameState === "TOO_EARLY" && (
        <div className="space-y-4 rounded-2xl border border-[#e4cfa3] bg-[#f5e7ce] p-10">
          <div className="text-sm font-bold text-[#8f621d]">
            Too early! You jumped the gun.
          </div>
          <button
            onClick={startAttempt}
            className="rounded-xl bg-[#587e6e] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#48695b]"
          >
            Try Again This Round
          </button>
        </div>
      )}

      {gameState === "RESULT" && (
        <div className="space-y-4 rounded-2xl border border-[#e3e6dd] bg-[#f3f2ea] p-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#6b7d75]">
              Attempt {currentAttempt}:
            </div>
            <div className="text-3xl font-extrabold text-[#3f6656]">
              {currentMs} ms
            </div>
          </div>
          <button
            onClick={handleNextAttempt}
            className="rounded-xl bg-[#587e6e] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#48695b]"
          >
            Next Attempt ({currentAttempt + 1}/{TOTAL_ATTEMPTS})
          </button>
        </div>
      )}

      {gameState === "FINAL" && (
        <div className="space-y-5 rounded-2xl border border-[#e3e6dd] bg-[#f3f2ea] p-6">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#2b3a34]">
              All 5 attempts completed!
            </h4>
            <div className="text-sm text-[#475b52]">
              Average Reaction Time:{" "}
              <strong className="text-xl font-extrabold text-[#3f6656]">
                {averageMs} ms
              </strong>
            </div>

            <div className="text-xs text-[#6b7d75]">
              Attempts: {attempts.join(" ms, ")} ms
            </div>

            <div
              className={`rounded-xl border p-3 text-xs font-semibold leading-relaxed ${evaluation.color}`}
            >
              <strong>Evaluation:</strong> {evaluation.text}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleSubmitResult}
              className="rounded-xl bg-[#587e6e] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#48695b]"
            >
              Save Average Result ({averageMs} ms)
            </button>
          </div>
          {error && (
            <div className="text-xs font-semibold text-[#9b3d30]">{error}</div>
          )}

          {result && (
            <div className="space-y-1 text-left text-xs text-[#475b52]">
              {result.baseline_ms && (
                <div className="font-bold text-[#2b3a34]">
                  Your usual reaction: {result.baseline_ms} ms
                </div>
              )}
              {result.tips.map((tip: string, i: number) => (
                <div key={i}>• {tip}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

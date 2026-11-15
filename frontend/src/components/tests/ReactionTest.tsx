import React, { useState, useRef } from "react";
import { SingleTestProps } from "./testContract";

type GameState = "IDLE" | "WAITING" | "READY" | "RESULT" | "TOO_EARLY" | "FINAL";

export const ReactionTest: React.FC<SingleTestProps> = ({ userId }) => {
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [currentAttempt, setCurrentAttempt] = useState<number>(1);
  const [currentMs, setCurrentMs] = useState<number>(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  
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
        color: "text-emerald-400 border-emerald-800 bg-emerald-950/40",
      };
    } else if (avgMs <= 200) {
      return {
        text: "Excellent result (fast reaction typical for young active individuals and trained athletes).",
        color: "text-teal-400 border-teal-800 bg-teal-950/40",
      };
    } else if (avgMs <= 250) {
      return {
        text: "Average / normal score (classic human baseline).",
        color: "text-yellow-400 border-yellow-800 bg-yellow-950/40",
      };
    } else if (avgMs <= 300) {
      return {
        text: "Below average (reaction slightly slowed down due to fatigue, distraction, or age).",
        color: "text-orange-400 border-orange-800 bg-orange-950/40",
      };
    } else {
      return {
        text: "Slow reaction (may be caused by fatigue, sleep deprivation, external factors, or display hardware lag).",
        color: "text-red-400 border-red-800 bg-red-950/40",
      };
    }
  };

  const averageMs = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) 
    : 0;

  const evaluation = getReactionEvaluation(averageMs);

  const handleSubmitResult = async () => {
    const { ok, status, data } = await post("/tests/reaction/submit", {
      user_id: userId,
      attempts,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 max-w-xl mx-auto text-center">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-bold text-white">
            ⚡ Reaction Speed &amp; Focus Test
          </h3>
          {gameState !== "IDLE" && gameState !== "FINAL" && (
            <span className="text-xs text-slate-400">
              Attempt {currentAttempt} of {TOTAL_ATTEMPTS}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Click the box as soon as it turns green! (5 attempts)
        </p>
      </div>

      {gameState === "IDLE" && (
        <div 
          onClick={startAttempt}
          className="rounded-xl border border-teal-800/60 bg-teal-950/40 p-12 cursor-pointer hover:bg-teal-900/40 transition-all space-y-2"
        >
          <div className="text-teal-400 font-bold text-base">Click here to start</div>
          <div className="text-xs text-slate-400">Test your reaction across 5 rounds.</div>
        </div>
      )}

      {gameState === "WAITING" && (
        <div 
          onClick={handleClick}
          className="rounded-xl border border-rose-900/60 bg-rose-950/40 p-12 cursor-pointer transition-all space-y-2 select-none"
        >
          <div className="text-rose-400 font-bold text-base">Wait for green...</div>
          <div className="text-xs text-slate-400">Don't click yet!</div>
        </div>
      )}

      {gameState === "READY" && (
        <div 
          onClick={handleClick}
          className="rounded-xl border border-emerald-500 bg-emerald-600 p-12 cursor-pointer transition-all space-y-2 animate-pulse select-none shadow-lg shadow-emerald-950"
        >
          <div className="text-white font-extrabold text-lg">CLICK NOW!</div>
          <div className="text-xs text-emerald-100">Tap fast!</div>
        </div>
      )}

      {gameState === "TOO_EARLY" && (
        <div className="rounded-xl border border-yellow-800/60 bg-yellow-950/40 p-10 space-y-4">
          <div className="text-yellow-400 font-bold text-sm">Too early! You jumped the gun.</div>
          <button
            onClick={startAttempt}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            Try Again This Round
          </button>
        </div>
      )}

      {gameState === "RESULT" && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <div className="text-xs text-slate-400">Attempt {currentAttempt}:</div>
            <div className="text-3xl font-extrabold text-teal-400">{currentMs} ms</div>
          </div>
          <button
            onClick={handleNextAttempt}
            className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-500 transition-colors shadow-lg shadow-teal-950/50"
          >
            Next Attempt ({currentAttempt + 1}/{TOTAL_ATTEMPTS})
          </button>
        </div>
      )}

      {gameState === "FINAL" && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-5 animate-fadeIn">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white">All 5 attempts completed!</h4>
            <div className="text-sm text-slate-300">
              Average Reaction Time: <strong className="text-white text-xl text-teal-400">{averageMs} ms</strong>
            </div>
            
            <div className="text-xs text-slate-400">
              Attempts: {attempts.join(" ms, ")} ms
            </div>

            <div className={`text-xs p-3 rounded-lg border font-medium leading-relaxed ${evaluation.color}`}>
              <strong>Evaluation:</strong> {evaluation.text}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleSubmitResult}
              className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-500 transition-colors shadow-lg shadow-teal-950/50"
            >
              Save Average Result ({averageMs} ms)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
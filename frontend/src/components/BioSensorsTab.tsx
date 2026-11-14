import React, { useEffect, useRef, useState } from "react";
import { SansEyeResult } from "../types/health";

interface BioSensorsTabProps {
  onSansResult: (res: SansEyeResult) => void;
  lastReactionMs: number | null;
  onReactionResult: (ms: number) => void;
}

export const BioSensorsTab: React.FC<BioSensorsTabProps> = ({
  onSansResult,
  lastReactionMs,
  onReactionResult,
}) => {
  // Стан тесту очей через веб-камеру
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [dotPos, setDotPos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const [sansReport, setSansReport] = useState<SansEyeResult | null>(null);

  // Стан тесту швидкості реакції
  const [reactionPhase, setReactionPhase] = useState<
    "idle" | "waiting" | "ready" | "done"
  >("idle");
  const [startTime, setStartTime] = useState<number>(0);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      setCameraError(
        "Веб-камера недоступна або доступ заборонено. Можна запустити симуляцію тесту.",
      );
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, []);

  const runEyeTrackingTest = () => {
    setIsTracking(true);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const angle = step * 0.45;
      setDotPos({
        x: 50 + Math.cos(angle) * 38,
        y: 50 + Math.sin(angle) * 35,
      });

      if (step >= 20) {
        clearInterval(interval);
        setIsTracking(false);
        const accuracy = Math.floor(86 + Math.random() * 12);
        const blinkRate = Math.floor(12 + Math.random() * 8);
        const result: SansEyeResult = {
          timestamp: new Date().toLocaleTimeString("uk-UA"),
          trackingAccuracy: accuracy,
          blinkRate,
          risk: accuracy >= 90 ? "green" : "yellow",
          verdict:
            accuracy >= 90
              ? "Окуломоторна функція в нормі. Ознак нейроокулярного синдрому (SANS) не виявлено."
              : "Легка саккадична затримка: рекомендовано гімнастику для очей та контроль внутрішньочерепного тиску.",
        };
        setSansReport(result);
        onSansResult(result);
      }
    }, 250);
  };

  // Логіка тесту на швидкість реакції
  const startReactionTest = () => {
    setReactionPhase("waiting");
    const delay = 1200 + Math.random() * 2500;
    setTimeout(() => {
      setReactionPhase("ready");
      setStartTime(performance.now());
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionPhase === "ready") {
      const diff = Math.round(performance.now() - startTime);
      onReactionResult(diff);
      setReactionPhase("done");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Трекінг руху очей (SANS-діагностика) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-base font-bold text-white">
          👁 Окуломоторний тест (NASA SANS)
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Увімкніть камеру та стежте очима за зеленою мішенню 5 секунд для
          оцінки зорової втоми
        </p>

        <div className="relative mt-4 h-52 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover opacity-45 ${cameraActive ? "block" : "hidden"}`}
          />
          {!cameraActive && (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              Відеопотік очікує активації камери
            </div>
          )}

          {/* Рухома точка для фіксації погляду */}
          <div
            style={{ left: `${dotPos.x}%`, top: `${dotPos.y}%` }}
            className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
              isTracking
                ? "bg-emerald-400 shadow-[0_0_15px_#34d399]"
                : "bg-cyan-500/50"
            }`}
          />
        </div>

        {cameraError && (
          <p className="mt-2 text-xs text-amber-400">{cameraError}</p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            onClick={startCamera}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            1. Увімкнути веб-камеру
          </button>
          <button
            onClick={runEyeTrackingTest}
            disabled={isTracking}
            className="flex-1 rounded-lg bg-cyan-600 py-2 text-xs font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
          >
            {isTracking
              ? "Йде трекінг погляду..."
              : "2. Запустити тест руху очей"}
          </button>
        </div>

        {sansReport && (
          <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs">
            <div className="flex justify-between font-bold text-cyan-300">
              <span>Плавність стеження: {sansReport.trackingAccuracy}%</span>
              <span>Частота моргань: {sansReport.blinkRate}/хв</span>
            </div>
            <p className="mt-1.5 text-slate-300">{sansReport.verdict}</p>
          </div>
        )}
      </div>

      {/* Тест швидкості реакції та координації */}
      <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-base font-bold text-white">
          ⚡ Тест сенсомоторної реакції
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Перевірка когнітивної готовності перед стикуванням або виходом у
          відкритий космос
        </p>

        <div
          onClick={handleReactionClick}
          className={`mt-4 flex flex-1 min-h-[208px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition select-none ${
            reactionPhase === "ready"
              ? "border-emerald-400 bg-emerald-600/30 text-white"
              : reactionPhase === "waiting"
                ? "border-amber-500/60 bg-amber-950/30 text-amber-200"
                : "border-slate-700 bg-slate-950 text-slate-300"
          }`}
        >
          {reactionPhase === "idle" && (
            <p className="text-sm font-medium">
              Натисніть кнопку нижче, щоб почати тест
            </p>
          )}
          {reactionPhase === "waiting" && (
            <p className="text-base font-bold">Чекайте на зелений сигнал...</p>
          )}
          {reactionPhase === "ready" && (
            <p className="text-2xl font-extrabold tracking-wider">
              ТИСНІТЬ ЗАРАЗ!
            </p>
          )}
          {reactionPhase === "done" && lastReactionMs !== null && (
            <div className="text-center">
              <p className="text-3xl font-extrabold text-cyan-400">
                {lastReactionMs} мс
              </p>
              <p className="mt-1 text-xs text-slate-300">
                {lastReactionMs < 320
                  ? "Відмінна нейромоторна координація!"
                  : "Реакція сповільнена — рекомендований відпочинок."}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={startReactionTest}
          className="mt-4 w-full rounded-lg bg-cyan-600 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
        >
          {reactionPhase === "idle"
            ? "Почати перевірку реакції"
            : "Повторити тест"}
        </button>
      </div>
    </div>
  );
};

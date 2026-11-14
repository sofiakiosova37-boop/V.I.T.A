import React from "react";
import { AlertStatus, MissionOrbit } from "../types/health";

interface EmergencyBannerProps {
  status: AlertStatus;
  alerts: string[];
  orbit: MissionOrbit;
  onDismiss: () => void;
}

const ORBIT_DELAY_INFO: Record<
  MissionOrbit,
  { label: string; delayText: string }
> = {
  LEO: {
    label: "Низька навколоземна орбіта (МКС)",
    delayText: "0.2 сек (прямий канал)",
  },
  MOON: {
    label: "Місячна орбіта (Gateway)",
    delayText: "2.6 сек (обидва боки)",
  },
  MARS: {
    label: "Транзит / Орбіта Марса",
    delayText: "14 хв 20 сек в один бік",
  },
};

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  status,
  alerts,
  orbit,
  onDismiss,
}) => {
  if (status === "green" || alerts.length === 0) return null;

  const isCritical = status === "red";
  const delayInfo = ORBIT_DELAY_INFO[orbit];

  return (
    <div
      className={`mb-6 rounded-xl border p-4 shadow-lg transition-all ${
        isCritical
          ? "border-red-500 bg-red-950/80 text-red-100 animate-pulse"
          : "border-amber-500 bg-amber-950/70 text-amber-100"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
            <span className="text-xl">{isCritical ? "🚨" : "⚠️"}</span>
            <span>
              {isCritical
                ? "КРИТИЧНЕ ЕКСТРЕНЕ ПОВІДОМЛЕННЯ (AUTO-SOS)"
                : "ПОПЕРЕДЖЕННЯ ТЕЛЕМЕТРІЇ"}
            </span>
          </div>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {alerts.map((alert, idx) => (
              <li key={idx}>{alert}</li>
            ))}
          </ul>

          <div className="mt-3 rounded-lg bg-black/40 p-2.5 text-xs">
            <p className="font-semibold text-cyan-300">
              📡 Статус зв&apos;язку з ЦУП ({delayInfo.label}): затримка{" "}
              {delayInfo.delayText}
            </p>
            {orbit !== "LEO" && (
              <p className="mt-1 text-slate-300">
                Активовано <strong>Протокол автономної допомоги екіпажу</strong>
                : не чекайте відповіді Землі, виконайте інструкцію на борту
                негайно.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20"
        >
          Підтвердити отримання
        </button>
      </div>
    </div>
  );
};

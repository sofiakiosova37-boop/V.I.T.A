import React from "react";

interface VitaLogoProps {
  collapsed: boolean;
  onClick: () => void;
}

export const VitaLogo: React.FC<VitaLogoProps> = ({ collapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      title={collapsed ? "Expand menu" : "Collapse menu"}
      className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-teal-500/10 focus:outline-none"
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#091224] ring-1 ring-teal-400/40 transition group-hover:ring-teal-300 group-hover:shadow-[0_0_15px_rgba(45,212,191,0.35)]">
        <svg viewBox="0 0 100 100" className="h-9 w-9">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#45E6C9"
            strokeWidth="2.5"
          />
          <circle
            cx="50"
            cy="8"
            r="3.5"
            fill="#091224"
            stroke="#45E6C9"
            strokeWidth="2"
          />
          <circle
            cx="92"
            cy="50"
            r="3.5"
            fill="#091224"
            stroke="#45E6C9"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="92"
            r="3.5"
            fill="#091224"
            stroke="#45E6C9"
            strokeWidth="2"
          />
          <circle
            cx="8"
            cy="50"
            r="3.5"
            fill="#091224"
            stroke="#45E6C9"
            strokeWidth="2"
          />

          <path
            d="M50 16 Q54 46 84 50 Q54 54 50 84 Q46 54 16 50 Q46 46 50 16 Z"
            fill="#112647"
            stroke="#45E6C9"
            strokeWidth="2.2"
          />

          <polyline
            points="22,50 37,50 42,39 48,63 54,31 60,55 65,47 78,50"
            fill="none"
            stroke="#7CF7E1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {!collapsed && (
        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-[0.22em] text-white">
              V.I.T.A
            </span>
            <span className="text-[10px] text-teal-400 opacity-70 group-hover:opacity-100">
              ◀
            </span>
          </div>
          <p className="truncate text-[10px] text-slate-400">
            Vital Indicators Tracking
          </p>
        </div>
      )}
    </button>
  );
};

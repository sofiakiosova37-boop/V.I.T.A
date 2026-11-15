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
      className="group flex w-full items-center gap-3 rounded-xl p-1.5 text-left transition hover:bg-[#fcfbf7]/60 focus:outline-none"
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fcfbf7] ring-1 ring-[#86a694] shadow-2xs transition group-hover:ring-[#587e6e] group-hover:shadow-sm">
        <svg viewBox="0 0 100 100" className="h-9 w-9">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#587e6e"
            strokeWidth="2.5"
          />
          <circle
            cx="50"
            cy="8"
            r="3.5"
            fill="#fcfbf7"
            stroke="#587e6e"
            strokeWidth="2"
          />
          <circle
            cx="92"
            cy="50"
            r="3.5"
            fill="#fcfbf7"
            stroke="#587e6e"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="92"
            r="3.5"
            fill="#fcfbf7"
            stroke="#587e6e"
            strokeWidth="2"
          />
          <circle
            cx="8"
            cy="50"
            r="3.5"
            fill="#fcfbf7"
            stroke="#587e6e"
            strokeWidth="2"
          />

          <path
            d="M50 16 Q54 46 84 50 Q54 54 50 84 Q46 54 16 50 Q46 46 50 16 Z"
            fill="#eaf0eb"
            stroke="#587e6e"
            strokeWidth="2.2"
          />

          <polyline
            points="22,50 37,50 42,39 48,63 54,31 60,55 65,47 78,50"
            fill="none"
            stroke="#d68059"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {!collapsed && (
        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-[0.22em] text-[#2b3a34]">
              V.I.T.A
            </span>
            <span className="text-[10px] text-[#3f6656] opacity-75 group-hover:opacity-100">
              ◀
            </span>
          </div>
          <p className="truncate text-[10px] font-semibold text-[#586b63]">
            Vital Indicators Tracking
          </p>
        </div>
      )}
    </button>
  );
};

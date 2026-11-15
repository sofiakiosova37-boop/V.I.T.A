import React, { useState, useEffect } from "react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  requiredTests: number;
  iconUrl: string;
}

const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first test in V.I.T.A.",
    requiredTests: 1,
    iconUrl: "/achievements/bronze.png",
  },
  {
    id: 2,
    title: "Space Explorer",
    description: "Complete 3 tests.",
    requiredTests: 3,
    iconUrl: "/achievements/silver.png",
  },
  {
    id: 3,
    title: "Safety Expert",
    description: "Complete 5 tests.",
    requiredTests: 5,
    iconUrl: "/achievements/gold.png",
  },
  {
    id: 4,
    title: "Crew Veteran",
    description: "Complete 10 tests.",
    requiredTests: 10,
    iconUrl: "/achievements/super.png",
  },
];

export const AchievementsPage: React.FC = () => {
  const [completedTests, setCompletedTests] = useState<number>(0);

  useEffect(() => {
    const updateCompletedCount = () => {
      const saved = localStorage.getItem("vita_completed_tests");
      setCompletedTests(saved ? parseInt(saved, 10) : 0);
    };

    updateCompletedCount();

    window.addEventListener("storage", updateCompletedCount);
    return () => window.removeEventListener("storage", updateCompletedCount);
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-4 text-[#2b3a34]">
      <header className="mb-8 rounded-2xl border border-[#d5dfd7] bg-[#eaf0eb]/70 p-6 text-center">
        <h1 className="mb-2 text-2xl font-bold text-[#2f5243]">
          V.I.T.A. Achievements System
        </h1>
        <p className="text-xs text-[#586b63]">
          Complete the required number of tests to unlock unique crew
          achievements.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#c8d6cc] bg-[#fcfbf7] px-5 py-2 shadow-2xs">
          <span className="text-xs font-semibold text-[#475b52]">
            Completed tests:{" "}
            <strong className="text-[#3f6656]">{completedTests}</strong>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {ACHIEVEMENTS_DATA.map((item) => {
          const isUnlocked = completedTests >= item.requiredTests;
          const progress = Math.min(
            100,
            Math.round((completedTests / item.requiredTests) * 100),
          );

          return (
            <div
              key={item.id}
              className={`flex items-center gap-5 rounded-2xl border p-5 transition-all duration-200 ${
                isUnlocked
                  ? "border-[#9eb8a9] bg-[#fcfbf7] shadow-sm hover:-translate-y-0.5"
                  : "border-[#e2e5dc] bg-[#f3f2ea]/80 opacity-85"
              }`}
            >
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#c8d6cc] bg-[#eaf0eb]">
                <img
                  src={item.iconUrl}
                  alt={item.title}
                  className={`h-full w-full object-cover ${
                    !isUnlocked ? "grayscale opacity-50" : ""
                  }`}
                />
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#f6f4ec]/55 text-lg">
                    🔒
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="mb-1 text-base font-bold text-[#2b3a34]">
                  {item.title}
                </h3>
                <p className="mb-3 text-xs text-[#6b7d75]">
                  {item.description}
                </p>

                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e3e6dd]">
                    <div
                      className="h-full rounded-full bg-[#587e6e] transition-all duration-300"
                      style={{ width: `${isUnlocked ? 100 : progress}%` }}
                    ></div>
                  </div>
                  <span className="min-w-[35px] text-right text-[11px] font-bold text-[#497261]">
                    {completedTests} / {item.requiredTests}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPage;

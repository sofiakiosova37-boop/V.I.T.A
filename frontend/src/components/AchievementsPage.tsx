import React, { useState, useEffect } from 'react';

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
    title: 'First Steps',
    description: 'Complete your first test in V.I.T.A.',
    requiredTests: 1,
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Space Explorer',
    description: 'Complete 3 tests.',
    requiredTests: 3,
    iconUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Safety Expert',
    description: 'Complete 5 tests.',
    requiredTests: 5,
    iconUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Crew Veteran',
    description: 'Complete 10 tests.',
    requiredTests: 10,
    iconUrl: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=150&auto=format&fit=crop&q=80',
  },
];

export const AchievementsPage: React.FC = () => {
  const [completedTests, setCompletedTests] = useState<number>(0);

  // Оновлюємо значення при відкритті сторінки та додаємо слухач для оновлення в реальному часі
  useEffect(() => {
    const updateCompletedCount = () => {
      const saved = localStorage.getItem('vita_completed_tests');
      setCompletedTests(saved ? parseInt(saved, 10) : 0);
    };

    updateCompletedCount();

    // Слухач на випадок, якщо тести завершуються в інших компонентах
    window.addEventListener('storage', updateCompletedCount);
    return () => window.removeEventListener('storage', updateCompletedCount);
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6 text-slate-100 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          V.I.T.A. Achievements System
        </h1>
        <p className="text-sm text-slate-400">
          Complete the required number of tests to unlock unique crew achievements.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-3 backdrop-blur">
          <span className="text-sm">
            Completed tests: <strong className="text-teal-300">{completedTests}</strong>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {ACHIEVEMENTS_DATA.map((item) => {
          const isUnlocked = completedTests >= item.requiredTests;
          const progress = Math.min(
            100,
            Math.round((completedTests / item.requiredTests) * 100)
          );

          return (
            <div
              key={item.id}
              className={`flex items-center gap-5 rounded-2xl border p-5 transition-all duration-200 ${
                isUnlocked
                  ? 'border-purple-500/40 bg-slate-900/90 shadow-lg shadow-purple-500/10 hover:-translate-y-1'
                  : 'border-slate-800/80 bg-slate-950/60 opacity-80'
              }`}
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center">
                <img
                  src={item.iconUrl}
                  alt={item.title}
                  className={`h-full w-full object-cover ${
                    !isUnlocked ? 'grayscale brightness-40' : ''
                  }`}
                />
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center text-lg bg-black/40">
                    🔒
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="mb-1 text-base font-bold text-white">{item.title}</h3>
                <p className="mb-3 text-xs text-slate-400">{item.description}</p>

                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${isUnlocked ? 100 : progress}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] text-slate-400 min-w-[35px] text-right">
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
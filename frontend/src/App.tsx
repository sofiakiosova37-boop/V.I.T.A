import React, { useState } from "react";
import { DashboardTab } from "./components/DashboardTab";
import { HistoryAndScheduleTab } from "./components/HistoryAndScheduleTab";
import { TestsTab } from "./components/tests/TestsTab";
import { VitaLogo } from "./components/VitaLogo";
import {
  ExerciseItem,
  TestSummary,
  UserProfile,
  WeeklyCheckupEntry,
} from "./types/health";

type Tab = "dashboard" | "tests" | "history" | "profile";

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: "Анастасія",
    age: 19,
    goal: "Збалансувати навчання, сон та знизити рівень стресу",
    wakeUpTime: "07:30",
    bedTime: "23:30",
  });

  const [history, setHistory] = useState<WeeklyCheckupEntry[]>([
    {
      id: "w1",
      weekLabel: "Тиж. 1",
      date: "25.10.2026",
      psychScore: 62,
      sleepHours: 6.5,
      sleepQuality: 6,
      status: "yellow",
    },
    {
      id: "w2",
      weekLabel: "Тиж. 2",
      date: "01.11.2026",
      psychScore: 74,
      sleepHours: 7.5,
      sleepQuality: 7,
      status: "green",
    },
    {
      id: "w3",
      weekLabel: "Тиж. 3",
      date: "08.11.2026",
      psychScore: 80,
      sleepHours: 8.0,
      sleepQuality: 8,
      status: "green",
    },
  ]);

  const [testSummary, setTestSummary] = useState<TestSummary>({
    reactionMs: 255,
  });

  const [exercises, setExercises] = useState<ExerciseItem[]>([
    {
      id: "1",
      day: "Понеділок",
      title: "Розминка для спини та шиї після комп’ютера",
      duration: "15 хв",
      category: "Спина та постава",
      completed: true,
    },
    {
      id: "2",
      day: "Середа",
      title: "Швидка прогулянка на свіжому повітрі",
      duration: "35 хв",
      category: "Кардіо",
      completed: false,
    },
    {
      id: "3",
      day: "П’ятниця",
      title: "Дихальна релаксація та розтяжка перед сном",
      duration: "20 хв",
      category: "Релаксація",
      completed: false,
    },
    {
      id: "4",
      day: "Неділя",
      title: "Активне кардіо або біг у комфортному темпі",
      duration: "40 хв",
      category: "Кардіо",
      completed: false,
    },
  ]);

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: "dashboard", icon: "🚦", label: "Щотижневий чекап" },
    { id: "tests", icon: "🧪", label: "Тести та реакція" },
    { id: "history", icon: "📈", label: "Історія та вправи" },
    { id: "profile", icon: "⚙️", label: "Профіль" },
  ];

  return (
    <div className="flex min-h-screen bg-[#070d19] text-slate-100 font-sans">
      {/* Ліва бокова панель навігації */}
      <aside
        className={`sticky top-0 flex h-screen flex-col justify-between border-r border-slate-800/80 bg-[#0b1324] p-3 transition-all duration-300 ${
          isSidebarCollapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <div>
          {/* Логотип у верхньому лівому кутку — клік відкриває/закриває панель */}
          <VitaLogo
            collapsed={isSidebarCollapsed}
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          />

          <div className="my-3 border-t border-slate-800/80" />

          {/* Пункти меню */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/40"
                      : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                  } ${isSidebarCollapsed ? "justify-center" : ""}`}
                >
                  <span className="text-base">{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Нижній блок у сайдбарі: швидке нагадування та картка профілю */}
        <div className="space-y-2">
          {!isSidebarCollapsed && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-[11px] text-slate-400">
              <p className="font-semibold text-teal-300">🌙 Режим сну</p>
              <p className="mt-0.5">Відбій заплановано на {profile.bedTime}</p>
            </div>
          )}

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex w-full items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 text-xs hover:border-slate-700 ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500/20 font-bold text-teal-300">
              {profile.name.charAt(0)}
            </span>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden text-left">
                <p className="truncate font-semibold text-white">
                  {profile.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {profile.age} років
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Права робоча область */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Компактна верхня смуга зі статусом та нагадуваннями */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-[#0b1324]/70 px-6 py-3.5 backdrop-blur">
          <div>
            <h1 className="text-sm font-bold text-white">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className="text-[11px] text-slate-400">
              Vital Indicators Tracking &amp; Analysis • Персональний моніторинг
              (16+)
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1">
              💧 Перерва для очей та води
            </span>
            <span className="hidden rounded-full border border-teal-500/30 bg-teal-950/30 px-3 py-1 text-teal-300 sm:inline">
              ⏰ Підйом: {profile.wakeUpTime}
            </span>
          </div>
        </header>

        {/* Основний контент сторінки */}
        <main className="mx-auto w-full max-w-6xl flex-1 p-6">
          {activeTab === "dashboard" && (
            <DashboardTab
              history={history}
              onSaveCheckup={(entry) => setHistory((prev) => [...prev, entry])}
              testSummary={testSummary}
              onGoToTests={() => setActiveTab("tests")}
            />
          )}

          {activeTab === "tests" && (
            <TestsTab
              summary={testSummary}
              onUpdateSummary={(upd) =>
                setTestSummary((prev) => ({ ...prev, ...upd }))
              }
            />
          )}

          {activeTab === "history" && (
            <HistoryAndScheduleTab
              history={history}
              exercises={exercises}
              onToggleExercise={(id) =>
                setExercises((prev) =>
                  prev.map((ex) =>
                    ex.id === id ? { ...ex, completed: !ex.completed } : ex,
                  ),
                )
              }
            />
          )}

          {activeTab === "profile" && (
            <div className="max-w-lg space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
              <h2 className="text-base font-bold text-white">
                ⚙️ Налаштування профілю
              </h2>
              <div>
                <label className="text-xs text-slate-400">Ім&apos;я</label>
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">
                  Вік (від 16 років)
                </label>
                <input
                  type="number"
                  min={16}
                  max={100}
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      age: Math.max(16, Number(e.target.value)),
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">
                    Бажаний підйом
                  </label>
                  <input
                    type="time"
                    value={profile.wakeUpTime}
                    onChange={(e) =>
                      setProfile({ ...profile, wakeUpTime: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">
                    Відбій (нагадування)
                  </label>
                  <input
                    type="time"
                    value={profile.bedTime}
                    onChange={(e) =>
                      setProfile({ ...profile, bedTime: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400">Особиста ціль</label>
                <input
                  value={profile.goal}
                  onChange={(e) =>
                    setProfile({ ...profile, goal: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

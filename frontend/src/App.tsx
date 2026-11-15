import React, { useState } from "react";
import { DashboardTab } from "./components/DashboardTab";
import { HistoryAndScheduleTab } from "./components/HistoryAndScheduleTab";
import { TestsTab } from "./components/tests/TestsTab";
import { VitaLogo } from "./components/VitaLogo";
import { VirtualPet } from "./components/VirtualPet";
import { AchievementsPage } from "./components/AchievementsPage";
import {
  ExerciseItem,
  TestSummary,
  UserProfile,
  WeeklyCheckupEntry,
} from "./types/health";

type Tab = "dashboard" | "tests" | "history" | "profile" | "achievements";

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: "Anastasiia",
    age: 19,
    goal: "Balance university studies, sleep schedule, and lower stress levels",
    wakeUpTime: "07:30",
    bedTime: "23:30",
  });

  const [history, setHistory] = useState<WeeklyCheckupEntry[]>([
    {
      id: "w1",
      weekLabel: "Week 1",
      date: "25/10/2026",
      psychScore: 62,
      sleepHours: 6.5,
      sleepQuality: 6,
      status: "yellow",
    },
    {
      id: "w2",
      weekLabel: "Week 2",
      date: "01/11/2026",
      psychScore: 74,
      sleepHours: 7.5,
      sleepQuality: 7,
      status: "green",
    },
    {
      id: "w3",
      weekLabel: "Week 3",
      date: "08/11/2026",
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
      day: "Monday",
      title: "Neck and back stretch after computer work",
      duration: "15 min",
      category: "Back & Posture",
      completed: true,
    },
    {
      id: "2",
      day: "Wednesday",
      title: "Brisk outdoor walk",
      duration: "35 min",
      category: "Cardio",
      completed: false,
    },
    {
      id: "3",
      day: "Friday",
      title: "Breathing relaxation and bedtime stretch",
      duration: "20 min",
      category: "Relaxation",
      completed: false,
    },
    {
      id: "4",
      day: "Sunday",
      title: "Moderate cardio or jogging",
      duration: "40 min",
      category: "Cardio",
      completed: false,
    },
  ]);

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: "dashboard", icon: "🌿", label: "Weekly Checkup" },
    { id: "tests", icon: "🧪", label: "Tests & Reaction" },
    { id: "history", icon: "📖", label: "History & Exercises" },
    { id: "achievements", icon: "🏅", label: "Achievements" },
    { id: "profile", icon: "⚙️", label: "Profile" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f4ec] text-[#2b3a34]">
      <aside
        className={`sticky top-0 flex h-screen flex-col justify-between border-r border-[#d5dfd7] bg-[#eaf0eb] p-3.5 transition-all duration-300 ${
          isSidebarCollapsed ? "w-[78px]" : "w-64"
        }`}
      >
        <div>
          <div className="rounded-xl bg-[#9eb8a9]/40 p-1">
            <VitaLogo
              collapsed={isSidebarCollapsed}
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            />
          </div>

          <div className="my-3.5 border-t border-[#d5dfd7]" />

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#fcfbf7] text-[#2f5243] shadow-sm ring-1 ring-[#c8d6cc]"
                      : "text-[#586b63] hover:bg-[#fcfbf7]/60 hover:text-[#2b3a34]"
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

        <div className="space-y-2.5">
          {!isSidebarCollapsed && (
            <div className="rounded-2xl border border-[#d5dfd7] bg-[#fcfbf7]/90 p-3.5 text-[11px] text-[#586b63] shadow-xs">
              <p className="font-bold text-[#3f6656]">🌙 Sleep Schedule</p>
              <p className="mt-0.5">Bedtime scheduled at {profile.bedTime}</p>
            </div>
          )}

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex w-full items-center gap-2.5 rounded-2xl border border-[#d5dfd7] bg-[#fcfbf7] p-2.5 text-xs shadow-xs transition hover:border-[#9eb8a9] ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dce7df] font-extrabold text-[#3f6656]">
              {profile.name.charAt(0)}
            </span>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden text-left">
                <p className="truncate font-bold text-[#2b3a34]">
                  {profile.name}
                </p>
                <p className="text-[10px] text-[#6b7d75]">{profile.age} y.o.</p>
              </div>
            )}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e5dc] bg-[#fcfbf7]/85 px-6 py-4 backdrop-blur">
          <div>
            <h1 className="text-lg font-bold text-[#2b3a34]">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-[#6b7d75]">
              Vital Indicators Tracking &amp; Analysis • Personal Health
              Monitoring (16+)
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#475b52]">
            <span className="rounded-full border border-[#d5dfd7] bg-[#eff4f0] px-3.5 py-1.5">
              💧 Eye &amp; Hydration Break
            </span>
            <span className="hidden rounded-full border border-[#e7cbbd] bg-[#fbf1ec] px-3.5 py-1.5 text-[#a95834] sm:inline">
              ☀️ Wake-up: {profile.wakeUpTime}
            </span>
          </div>
        </header>

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

          {activeTab === "achievements" && <AchievementsPage userId={2} />}

          {activeTab === "profile" && (
            <div className="max-w-lg space-y-4 rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 shadow-xs">
              <h2 className="text-lg font-bold text-[#2b3a34]">
                ⚙️ Profile Settings
              </h2>
              <div>
                <label className="text-xs font-semibold text-[#586b63]">
                  Name
                </label>
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#cfd9d1] bg-[#f6f4ec] px-3.5 py-2 text-sm text-[#2b3a34] focus:border-[#587e6e] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#586b63]">
                  Age (16+)
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
                  className="mt-1 w-full rounded-xl border border-[#cfd9d1] bg-[#f6f4ec] px-3.5 py-2 text-sm text-[#2b3a34] focus:border-[#587e6e] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#586b63]">
                    Target Wake-up
                  </label>
                  <input
                    type="time"
                    value={profile.wakeUpTime}
                    onChange={(e) =>
                      setProfile({ ...profile, wakeUpTime: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cfd9d1] bg-[#f6f4ec] px-3.5 py-2 text-sm text-[#2b3a34] focus:border-[#587e6e] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#586b63]">
                    Bedtime Reminder
                  </label>
                  <input
                    type="time"
                    value={profile.bedTime}
                    onChange={(e) =>
                      setProfile({ ...profile, bedTime: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cfd9d1] bg-[#f6f4ec] px-3.5 py-2 text-sm text-[#2b3a34] focus:border-[#587e6e] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#586b63]">
                  Personal Goal
                </label>
                <input
                  value={profile.goal}
                  onChange={(e) =>
                    setProfile({ ...profile, goal: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#cfd9d1] bg-[#f6f4ec] px-3.5 py-2 text-sm text-[#2b3a34] focus:border-[#587e6e] focus:outline-none"
                />
              </div>
            </div>
          )}
        </main>
      </div>
      <VirtualPet />
    </div>
  );
}

export default App;

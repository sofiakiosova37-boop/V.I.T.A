import React, { useState } from "react";
import { SingleTestProps } from "./testContract";

interface Question {
  id: number;
  title: string;
  options: { text: string; score: number }[];
}

// Питання для Блоку А (Exhaustion)
const sectionAQuestions: Question[] = [
  {
    id: 1,
    title: "1. I feel emotionally drained by my work.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 2,
    title: "2. Working with people all day long requires a great deal of effort.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 3,
    title: "3. I feel like my work is breaking me down.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 4,
    title: "4. I feel frustrated by my work.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 5,
    title: "5. I feel I work too hard at my job.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 6,
    title: "6. It stresses me too much to work in direct contact with people.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 7,
    title: "7. I feel like I'm at the end of my tether.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
];

// Питання для Блоку В (Depersonalisation)
const sectionBQuestions: Question[] = [
  {
    id: 1,
    title: "1. I feel I deal with my team/colleagues impersonally, as if they are objects.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 2,
    title: "2. I feel tired when I get up in the morning and have to face another day at work.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 3,
    title: "3. I have the impression that my team/colleagues make me responsible for some of their problems.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 4,
    title: "4. I am at the end of my patience at the end of my work day.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 5,
    title: "5. I really don't care about what happens to some of my team/colleagues.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 6,
    title: "6. I have become more insensitive to people in the workplace.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
  {
    id: 7,
    title: "7. I'm afraid that this job is making me uncaring.",
    options: [
      { text: "Never", score: 0 },
      { text: "A few times per year", score: 1 },
      { text: "Once a month", score: 2 },
      { text: "A few times per month", score: 3 },
      { text: "Once a week", score: 4 },
      { text: "A few times per week", score: 5 },
      { text: "Every day", score: 6 },
    ],
  },
];

export const BurnoutTest: React.FC<SingleTestProps> = ({ onSaveResult }) => {
  // Стан для Блоку А
  const [answersA, setAnswersA] = useState<Record<number, number>>({});
  const [currentIndexA, setCurrentIndexA] = useState<number>(0);

  // Стан для Блоку В
  const [answersB, setAnswersB] = useState<Record<number, number>>({});
  const [currentIndexB, setCurrentIndexB] = useState<number>(0);

  // Логіка для Блоку А
  const currentQ_A = sectionAQuestions[currentIndexA];
  const isLastQ_A = currentIndexA === sectionAQuestions.length - 1;
  const hasAnsweredCurrentA = answersA[currentQ_A?.id] !== undefined;
  const isFinishedA = Object.keys(answersA).length === sectionAQuestions.length;
  const totalScoreA = Object.values(answersA).reduce((acc, val) => acc + val, 0);

  const getInterpretationA = (score: number) => {
    if (score <= 17) {
      return { text: "Total 17 or less: Low-level burnout", color: "text-emerald-400 border-emerald-800 bg-emerald-950/40" };
    } else if (score <= 29) {
      return { text: "Total between 18 and 29 inclusive: Moderate burnout", color: "text-yellow-400 border-yellow-800 bg-yellow-950/40" };
    } else {
      return { text: "Total over 30: High-level burnout", color: "text-red-400 border-red-800 bg-red-950/40" };
    }
  };
  const interpretationA = getInterpretationA(totalScoreA);

  // Логіка для Блоку В
  const currentQ_B = sectionBQuestions[currentIndexB];
  const isLastQ_B = currentIndexB === sectionBQuestions.length - 1;
  const hasAnsweredCurrentB = answersB[currentQ_B?.id] !== undefined;
  const isFinishedB = Object.keys(answersB).length === sectionBQuestions.length;
  const totalScoreB = Object.values(answersB).reduce((acc, val) => acc + val, 0);

  const getInterpretationB = (score: number) => {
    if (score <= 5) {
      return { text: "Total 5 or less: Low-level burnout", color: "text-emerald-400 border-emerald-800 bg-emerald-950/40" };
    } else if (score <= 11) {
      return { text: "Total between 6 and 11 inclusive: Moderate burnout", color: "text-yellow-400 border-yellow-800 bg-yellow-950/40" };
    } else {
      return { text: "Total of 12 and greater: High-level burnout", color: "text-red-400 border-red-800 bg-red-950/40" };
    }
  };
  const interpretationB = getInterpretationB(totalScoreB);

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {/* ЗАГАЛЬНИЙ ЗАГОЛОВОК */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-center">
        <h3 className="text-lg font-bold text-white">🔥 Maslach Burnout Inventory (MBI)</h3>
        <p className="text-xs text-slate-400 mt-1">
          Complete both sections below to assess different dimensions of burnout.
        </p>
      </div>

      {/* ================= SECTION A ================= */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-bold text-teal-400">
              Section A: Exhaustion
            </h4>
            <span className="text-xs text-slate-400">
              Question {currentIndexA + 1} of {sectionAQuestions.length}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Choose the response that best corresponds to how you feel.
          </p>
        </div>

        {!isFinishedA || (!hasAnsweredCurrentA && currentIndexA === sectionAQuestions.length - 1) ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
            <h5 className="text-sm font-semibold text-slate-200">{currentQ_A.title}</h5>
            <div className="space-y-2.5">
              {currentQ_A.options.map((opt, idx) => {
                const isSelected = answersA[currentQ_A.id] === opt.score;
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "border-teal-500 bg-teal-950/30 text-white"
                        : "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`sectionA-q-${currentQ_A.id}`}
                      checked={isSelected}
                      onChange={() => setAnswersA((prev) => ({ ...prev, [currentQ_A.id]: opt.score }))}
                      className="mt-0.5 text-teal-600 focus:ring-teal-500 bg-slate-950 border-slate-700"
                    />
                    <span className="flex-1 leading-relaxed">{opt.text}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => currentIndexA > 0 && setCurrentIndexA((prev) => prev - 1)}
                disabled={currentIndexA === 0}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                  currentIndexA === 0
                    ? "opacity-50 cursor-not-allowed bg-slate-800 text-slate-500"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                Back
              </button>

              <button
                onClick={() => hasAnsweredCurrentA && !isLastQ_A && setCurrentIndexA((prev) => prev + 1)}
                disabled={!hasAnsweredCurrentA || isLastQ_A}
                className={`rounded-xl px-5 py-2 text-xs font-semibold text-white transition-colors ${
                  !hasAnsweredCurrentA || isLastQ_A
                    ? "opacity-50 cursor-not-allowed bg-teal-900/50 text-teal-300"
                    : "bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-950/50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}

        {isFinishedA && (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4 animate-fadeIn">
            <div className="text-center space-y-2">
              <h5 className="text-sm font-bold text-white">Section A Completed!</h5>
              <div className="text-sm text-slate-300">
                Total Score: <strong className="text-white text-base">{totalScoreA}</strong> points
              </div>
              <div className={`text-xs px-3 py-2 rounded-lg border inline-block font-medium ${interpretationA.color}`}>
                {interpretationA.text}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => onSaveResult(totalScoreA)}
                className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-500 transition-colors shadow-lg shadow-teal-950/50"
              >
                Save Section A Result
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= SECTION B ================= */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-bold text-teal-400">
              Section B: Depersonalisation
            </h4>
            <span className="text-xs text-slate-400">
              Question {currentIndexB + 1} of {sectionBQuestions.length}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Choose the response that best corresponds to how you feel.
          </p>
        </div>

        {!isFinishedB || (!hasAnsweredCurrentB && currentIndexB === sectionBQuestions.length - 1) ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
            <h5 className="text-sm font-semibold text-slate-200">{currentQ_B.title}</h5>
            <div className="space-y-2.5">
              {currentQ_B.options.map((opt, idx) => {
                const isSelected = answersB[currentQ_B.id] === opt.score;
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "border-teal-500 bg-teal-950/30 text-white"
                        : "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`sectionB-q-${currentQ_B.id}`}
                      checked={isSelected}
                      onChange={() => setAnswersB((prev) => ({ ...prev, [currentQ_B.id]: opt.score }))}
                      className="mt-0.5 text-teal-600 focus:ring-teal-500 bg-slate-950 border-slate-700"
                    />
                    <span className="flex-1 leading-relaxed">{opt.text}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => currentIndexB > 0 && setCurrentIndexB((prev) => prev - 1)}
                disabled={currentIndexB === 0}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                  currentIndexB === 0
                    ? "opacity-50 cursor-not-allowed bg-slate-800 text-slate-500"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                Back
              </button>

              <button
                onClick={() => hasAnsweredCurrentB && !isLastQ_B && setCurrentIndexB((prev) => prev + 1)}
                disabled={!hasAnsweredCurrentB || isLastQ_B}
                className={`rounded-xl px-5 py-2 text-xs font-semibold text-white transition-colors ${
                  !hasAnsweredCurrentB || isLastQ_B
                    ? "opacity-50 cursor-not-allowed bg-teal-900/50 text-teal-300"
                    : "bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-950/50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}

        {isFinishedB && (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4 animate-fadeIn">
            <div className="text-center space-y-2">
              <h5 className="text-sm font-bold text-white">Section B Completed!</h5>
              <div className="text-sm text-slate-300">
                Total Score: <strong className="text-white text-base">{totalScoreB}</strong> points
              </div>
              <div className={`text-xs px-3 py-2 rounded-lg border inline-block font-medium ${interpretationB.color}`}>
                {interpretationB.text}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => onSaveResult(totalScoreB)}
                className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-500 transition-colors shadow-lg shadow-teal-950/50"
              >
                Save Section B Result
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
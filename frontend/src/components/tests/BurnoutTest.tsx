import React, { useState } from "react";
import { SingleTestProps } from "./testContract";

interface Question {
  id: number;
  title: string;
  options: { text: string; score: number }[];
}

const questions: Question[] = [
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
    title:
      "2. Working with people all day long requires a great deal of effort.",
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

export const BurnoutTest: React.FC<SingleTestProps> = ({ onSaveResult }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnsweredCurrent = answers[currentQuestion?.id] !== undefined;

  const handleOptionSelect = (questionId: number, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  const handleNext = () => {
    if (hasAnsweredCurrent && !isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);
  const isFinished = Object.keys(answers).length === questions.length;

  const getInterpretation = (score: number) => {
    if (score <= 17) {
      return {
        text: "Total 17 or less: Low-level burnout",
        color: "text-emerald-400 border-emerald-800 bg-emerald-950/40",
      };
    } else if (score <= 29) {
      return {
        text: "Total between 18 and 29 inclusive: Moderate burnout",
        color: "text-yellow-400 border-yellow-800 bg-yellow-950/40",
      };
    } else {
      return {
        text: "Total over 30: High-level burnout",
        color: "text-red-400 border-red-800 bg-red-950/40",
      };
    }
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 max-w-xl mx-auto">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-bold text-white">
            🔥 Burnout Self-Test (Section A: Exhaustion)
          </h3>
          <span className="text-xs text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Choose the response that best corresponds to how you feel.
        </p>
      </div>

      {!isFinished ||
      (!hasAnsweredCurrent && currentIndex === questions.length - 1) ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
          <h4 className="text-sm font-semibold text-slate-200">
            {currentQuestion.title}
          </h4>
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = answers[currentQuestion.id] === opt.score;
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
                    name={`question-${currentQuestion.id}`}
                    checked={isSelected}
                    onChange={() =>
                      handleOptionSelect(currentQuestion.id, opt.score)
                    }
                    className="mt-0.5 text-teal-600 focus:ring-teal-500 bg-slate-950 border-slate-700"
                  />
                  <span className="flex-1 leading-relaxed">{opt.text}</span>
                </label>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                currentIndex === 0
                  ? "opacity-50 cursor-not-allowed bg-slate-800 text-slate-500"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent || isLastQuestion}
              className={`rounded-xl px-5 py-2 text-xs font-semibold text-white transition-colors ${
                !hasAnsweredCurrent || isLastQuestion
                  ? "opacity-50 cursor-not-allowed bg-teal-900/50 text-teal-300"
                  : "bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-950/50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {isFinished && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4 animate-fadeIn">
          <div className="text-center space-y-2">
            <h4 className="text-sm font-bold text-white">Test Completed!</h4>
            <div className="text-sm text-slate-300">
              Total Score:{" "}
              <strong className="text-white text-base">{totalScore}</strong>{" "}
              points
            </div>
            <div
              className={`text-xs px-3 py-2 rounded-lg border inline-block font-medium ${interpretation.color}`}
            >
              {interpretation.text}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => onSaveResult(totalScore)}
              className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-500 transition-colors shadow-lg shadow-teal-950/50"
            >
              Save Result
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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
    title: "1. Sadness",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 2,
    title: "2. Pessimism",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 3,
    title: "3. Past failures",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 4,
    title: "4. Loss of pleasure",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 5,
    title: "5. Guilt",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 6,
    title: "6. Feeling punished",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 7,
    title: "7. Self-criticism",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 8,
    title: "8. Self-harm thoughts",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 9,
    title: "9. Crying",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 10,
    title: "10. Irritability",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 11,
    title: "11. Loss of interest",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 12,
    title: "12. Indecisiveness",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 13,
    title: "13. Self-worth",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 14,
    title: "14. Loss of energy",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 15,
    title: "15. Sleep changes",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 16,
    title: "16. Appetite changes",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 17,
    title: "17. Concentration",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 18,
    title: "18. Tiredness",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 19,
    title: "19. Interest in sex",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 20,
    title: "20. Health worries",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
  {
    id: 21,
    title: "21. Work ability",
    options: [
      { text: "I do not notice this, or it feels unchanged", score: 0 },
      { text: "I notice this more than before", score: 1 },
      { text: "It is clear and affects me a lot", score: 2 },
      { text: "It is very intense or hard to bear", score: 3 },
    ],
  },
];

export const DepressionTest: React.FC<SingleTestProps> = ({
  onSaveResult,
}) => {
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
    if (score <= 13) {
      return {
        text: "0–13 points — Minimal depressive symptoms (normal)",
        color: "text-emerald-400 border-emerald-800 bg-emerald-950/40",
      };
    } else if (score <= 19) {
      return {
        text: "14–19 points — Mild severity (subdepression)",
        color: "text-yellow-400 border-yellow-800 bg-yellow-950/40",
      };
    } else if (score <= 28) {
      return {
        text: "20–28 points — Moderate depression",
        color: "text-orange-400 border-orange-800 bg-orange-950/40",
      };
    } else {
      return {
        text: "29–63 points — Severe depression",
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
            🌧 Depression Screening Test
          </h3>
          <span className="text-xs text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Choose the statement that best describes how you have felt during the past week.
        </p>
      </div>

      {!isFinished || (!hasAnsweredCurrent && currentIndex === questions.length - 1) ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
          <h4 className="text-sm font-semibold text-slate-200">{currentQuestion.title}</h4>
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
                    onChange={() => handleOptionSelect(currentQuestion.id, opt.score)}
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
              Total Score: <strong className="text-white text-base">{totalScore}</strong> / 63 points
            </div>
            <div className={`text-xs px-3 py-2 rounded-lg border inline-block font-medium ${interpretation.color}`}>
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
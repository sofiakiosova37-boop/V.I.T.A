import React, { useState } from "react";
import { SingleTestProps } from "./testContract";
import { post } from "../../services/api";

interface Question {
  id: number;
  title: string;
  options: { text: string; score: number }[];
}

interface DepressionResult {
  score: number;
  self_harm_alert?: boolean;
  support_message?: string;
  tips: string[];
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
  userId,
  onSaveResult,
}) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [result, setResult] = useState<DepressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnsweredCurrent = answers[currentQuestion?.id] !== undefined;
  const [saving, setSaving] = useState(false);

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

  const handleSubmitResult = async () => {
    if (!userId) {
      setError("Please sign in first.");
      return;
    }
    setSaving(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, score]) => ({
        question_id: Number(qId),
        value: score,
      }));
      const { ok, data } = await post("/tests/mood/submit", {
        user_id: userId,
        answers: formattedAnswers,
      });
      if (!ok) {
        setError(data.detail ?? "Could not save the result.");
        return;
      }
      setError(null);
      setResult(data);
      onSaveResult?.(data.score);
    } catch {
      setError("No connection to the server. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  const getInterpretation = (score: number) => {
    if (score <= 13) {
      return {
        text: "0–13 points — Minimal depressive symptoms (normal)",
        color: "text-[#35634e] border-[#b6d3c2] bg-[#dcebe2]",
      };
    } else if (score <= 19) {
      return {
        text: "14–19 points — Mild severity (subdepression)",
        color: "text-[#8f621d] border-[#e4cfa3] bg-[#f5e7ce]",
      };
    } else if (score <= 28) {
      return {
        text: "20–28 points — Moderate depression",
        color: "text-[#a95834] border-[#e7cbbd] bg-[#fbf1ec]",
      };
    } else {
      return {
        text: "29–63 points — Severe depression",
        color: "text-[#9b3d30] border-[#e2b6ae] bg-[#f4dcd7]",
      };
    }
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 shadow-xs">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#2b3a34]">
            🌧 Depression Screening Test
          </h3>
          <span className="text-xs font-semibold text-[#6b7d75]">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <p className="text-xs text-[#6b7d75]">
          Choose the statement that best describes how you have felt during the
          past week.
        </p>
      </div>

      {!isFinished ||
      (!hasAnsweredCurrent && currentIndex === questions.length - 1) ? (
        <div className="space-y-4 rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-5">
          <h4 className="text-sm font-bold text-[#2b3a34]">
            {currentQuestion.title}
          </h4>
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = answers[currentQuestion.id] === opt.score;
              return (
                <label
                  key={idx}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs transition-all ${
                    isSelected
                      ? "border-[#587e6e] bg-[#eaf0eb] font-bold text-[#2b3a34] shadow-2xs"
                      : "border-[#dce3dc] bg-[#fcfbf7] text-[#475b52] hover:border-[#b7c7bc] hover:bg-[#f8f7f1]"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={isSelected}
                    onChange={() =>
                      handleOptionSelect(currentQuestion.id, opt.score)
                    }
                    className="mt-0.5 accent-[#587e6e]"
                  />
                  <span className="flex-1 leading-relaxed">{opt.text}</span>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                currentIndex === 0
                  ? "cursor-not-allowed bg-[#e7e8df] text-[#9aa8a1]"
                  : "bg-[#e7e8df] text-[#475b52] hover:bg-[#d8dcd1]"
              }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent || isLastQuestion}
              className={`rounded-xl px-5 py-2 text-xs font-bold text-white transition-colors ${
                !hasAnsweredCurrent || isLastQuestion
                  ? "cursor-not-allowed bg-[#a8beb3]"
                  : "bg-[#587e6e] shadow-xs hover:bg-[#48695b]"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {isFinished && (
        <div className="space-y-4 rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-5">
          <div className="space-y-2 text-center">
            <h4 className="text-sm font-bold text-[#2b3a34]">
              Test Completed!
            </h4>
            <div className="text-sm text-[#475b52]">
              Total Score:{" "}
              <strong className="text-base text-[#2b3a34]">{totalScore}</strong>{" "}
              / 63 points
            </div>
            <div
              className={`inline-block rounded-lg border px-3 py-2 text-xs font-bold ${interpretation.color}`}
            >
              {interpretation.text}
            </div>
          </div>

          {(result?.self_harm_alert || (answers[8] ?? 0) >= 1) && (
            <div className="rounded-xl border border-[#e2b6ae] bg-[#f4dcd7] p-4 text-xs font-medium leading-relaxed text-[#7f2d22]">
              {result?.support_message ??
                "You noted thoughts of harming yourself. Thank you for answering honestly. You do not have to cope with this alone: please talk today to someone you trust, a doctor or a mental health professional. If you are in immediate danger, call your local emergency number."}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              onClick={handleSubmitResult}
              disabled={saving || result !== null}
              className="rounded-xl bg-[#587e6e] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#48695b] disabled:opacity-50"
            >
              {saving ? "Saving..." : result ? "Saved" : "Save Result"}
            </button>
          </div>

          {error && (
            <div className="text-center text-xs font-semibold text-[#9b3d30]">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-1.5 rounded-xl border border-[#dce3dc] bg-[#fcfbf7] p-4 text-left text-xs text-[#475b52]">
              {result.tips.map((tip: string, i: number) => (
                <div key={i}>• {tip}</div>
              ))}
              <div className="pt-2 text-[10px] text-[#6b7d75]">
                Self-assessment only, not a medical diagnosis.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

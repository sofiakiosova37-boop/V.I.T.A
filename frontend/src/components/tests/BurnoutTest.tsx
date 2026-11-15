import React, { useState } from "react";
import { SingleTestProps } from "./testContract";
import { post } from "../../services/api";

interface Question {
  id: number;
  title: string;
}

interface BurnoutResult {
  tips: string[];
}

const OPTIONS = [
  { text: "Never", score: 0 },
  { text: "A few times per year", score: 1 },
  { text: "Once a month", score: 2 },
  { text: "A few times per month", score: 3 },
  { text: "Once a week", score: 4 },
  { text: "A few times per week", score: 5 },
  { text: "Every day", score: 6 },
];

const SECTION_A_TEXTS = [
  "I feel emotionally drained by my work.",
  "Working with people all day long requires a great deal of effort.",
  "I feel like my work is breaking me down.",
  "I feel frustrated by my work.",
  "I feel I work too hard at my job.",
  "It stresses me too much to work in direct contact with people.",
  "I feel like I'm at the end of my tether.",
];

const SECTION_B_TEXTS = [
  "I feel I deal with my team/colleagues impersonally, as if they are objects.",
  "I feel tired when I get up in the morning and have to face another day at work.",
  "I have the impression that my team/colleagues make me responsible for some of their problems.",
  "I am at the end of my patience at the end of my work day.",
  "I really don't care about what happens to some of my team/colleagues.",
  "I have become more insensitive to people in the workplace.",
  "I'm afraid that this job is making me uncaring.",
];

// id блоку A: 1-7, id блоку B: 8-14 (так їх чекає бекенд)
const sectionAQuestions: Question[] = SECTION_A_TEXTS.map((text, i) => ({
  id: i + 1,
  title: `${i + 1}. ${text}`,
}));

const sectionBQuestions: Question[] = SECTION_B_TEXTS.map((text, i) => ({
  id: i + 8,
  title: `${i + 1}. ${text}`,
}));

const LOW = "text-[#35634e] border-[#b6d3c2] bg-[#dcebe2]";
const MID = "text-[#8f621d] border-[#e4cfa3] bg-[#f5e7ce]";
const HIGH = "text-[#9b3d30] border-[#e2b6ae] bg-[#f4dcd7]";

const interpretA = (score: number) =>
  score <= 17
    ? { text: "Low-level exhaustion", color: LOW }
    : score <= 29
      ? { text: "Moderate exhaustion", color: MID }
      : { text: "High-level exhaustion", color: HIGH };

const interpretB = (score: number) =>
  score <= 5
    ? { text: "Low-level depersonalisation", color: LOW }
    : score <= 11
      ? { text: "Moderate depersonalisation", color: MID }
      : { text: "High-level depersonalisation", color: HIGH };

interface SectionProps {
  title: string;
  questions: Question[];
  answers: Record<number, number>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  interpret: (score: number) => { text: string; color: string };
}

const Section: React.FC<SectionProps> = ({
  title,
  questions,
  answers,
  setAnswers,
  interpret,
}) => {
  const [index, setIndex] = useState(0);

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const hasAnswered = answers[current.id] !== undefined;
  const isFinished = Object.keys(answers).length === questions.length;
  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const interpretation = interpret(total);

  return (
    <div className="space-y-5 rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 shadow-xs">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#3f6656]">{title}</h4>
          <span className="text-xs font-semibold text-[#6b7d75]">
            Question {index + 1} of {questions.length}
          </span>
        </div>
        <p className="text-xs text-[#6b7d75]">
          Choose the response that best corresponds to how you feel.
        </p>
      </div>

      {!isFinished || (!hasAnswered && isLast) ? (
        <div className="space-y-4 rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-5">
          <h5 className="text-sm font-bold text-[#2b3a34]">{current.title}</h5>
          <div className="space-y-2">
            {OPTIONS.map((opt) => {
              const isSelected = answers[current.id] === opt.score;
              return (
                <label
                  key={opt.score}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs transition-all ${
                    isSelected
                      ? "border-[#587e6e] bg-[#eaf0eb] font-bold text-[#2b3a34] shadow-2xs"
                      : "border-[#dce3dc] bg-[#fcfbf7] text-[#475b52] hover:border-[#b7c7bc] hover:bg-[#f8f7f1]"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    checked={isSelected}
                    onChange={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [current.id]: opt.score,
                      }))
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
              onClick={() => index > 0 && setIndex((p) => p - 1)}
              disabled={index === 0}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                index === 0
                  ? "cursor-not-allowed bg-[#e7e8df] text-[#9aa8a1]"
                  : "bg-[#e7e8df] text-[#475b52] hover:bg-[#d8dcd1]"
              }`}
            >
              Back
            </button>
            <button
              onClick={() => hasAnswered && !isLast && setIndex((p) => p + 1)}
              disabled={!hasAnswered || isLast}
              className={`rounded-xl px-5 py-2 text-xs font-bold text-white transition-colors ${
                !hasAnswered || isLast
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
        <div className="space-y-2 rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-5 text-center">
          <h5 className="text-sm font-bold text-[#2b3a34]">
            Section completed
          </h5>
          <div className="text-sm text-[#475b52]">
            Score: <strong className="text-base text-[#2b3a34]">{total}</strong>{" "}
            / 42
          </div>
          <div
            className={`inline-block rounded-lg border px-3 py-2 text-xs font-bold ${interpretation.color}`}
          >
            {interpretation.text}
          </div>
        </div>
      )}
    </div>
  );
};

export const BurnoutTest: React.FC<SingleTestProps> = ({
  userId,
  onSaveResult,
}) => {
  const [answersA, setAnswersA] = useState<Record<number, number>>({});
  const [answersB, setAnswersB] = useState<Record<number, number>>({});
  const [result, setResult] = useState<BurnoutResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isFinishedA = Object.keys(answersA).length === sectionAQuestions.length;
  const isFinishedB = Object.keys(answersB).length === sectionBQuestions.length;
  const totalA = Object.values(answersA).reduce((a, b) => a + b, 0);
  const totalB = Object.values(answersB).reduce((a, b) => a + b, 0);

  const handleSubmit = async () => {
    if (!userId) {
      setError("Please sign in first.");
      return;
    }
    const answers = [
      ...Object.entries(answersA),
      ...Object.entries(answersB),
    ].map(([id, value]) => ({ question_id: Number(id), value }));

    setSaving(true);
    try {
      const { ok, data } = await post("/tests/burnout/submit", {
        user_id: userId,
        answers,
      });
      if (!ok) {
        setError(data.detail ?? "Could not save the result.");
        return;
      }
      setError(null);
      setResult(data);
      onSaveResult?.(Math.round(((totalA + totalB) / 84) * 100));
    } catch {
      setError("No connection to the server. Is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-2xl border border-[#d5dfd7] bg-[#eaf0eb]/70 p-6 text-center shadow-2xs">
        <h3 className="text-lg font-bold text-[#2b3a34]">
          🔥 Burnout self-check
        </h3>
        <p className="mt-1 text-xs text-[#586b63]">
          Complete both sections below to assess different dimensions of
          burnout.
        </p>
      </div>

      <Section
        title="Section A: Exhaustion"
        questions={sectionAQuestions}
        answers={answersA}
        setAnswers={setAnswersA}
        interpret={interpretA}
      />

      <Section
        title="Section B: Depersonalisation"
        questions={sectionBQuestions}
        answers={answersB}
        setAnswers={setAnswersB}
        interpret={interpretB}
      />

      {isFinishedA && isFinishedB && (
        <div className="space-y-4 rounded-2xl border border-[#dce3dc] bg-[#fcfbf7] p-6 text-center shadow-xs">
          <h4 className="text-sm font-bold text-[#2b3a34]">
            Both sections completed
          </h4>
          <button
            onClick={handleSubmit}
            disabled={saving || result !== null}
            className="rounded-xl bg-[#587e6e] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#48695b] disabled:opacity-50"
          >
            {saving ? "Saving..." : result ? "Saved" : "Save burnout result"}
          </button>

          {error && (
            <div className="text-xs font-semibold text-[#9b3d30]">{error}</div>
          )}

          {result && (
            <div className="space-y-1.5 rounded-xl border border-[#e3e6dd] bg-[#f3f2ea] p-4 text-left text-xs text-[#475b52]">
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

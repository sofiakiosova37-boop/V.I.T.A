import React, { useState } from "react";
import { SingleTestProps } from "./testContract";
import { post } from "../../services/api";

interface Question {
  id: number;
  title: string;
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

const LOW = "text-emerald-400 border-emerald-800 bg-emerald-950/40";
const MID = "text-yellow-400 border-yellow-800 bg-yellow-950/40";
const HIGH = "text-red-400 border-red-800 bg-red-950/40";

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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-bold text-teal-400">{title}</h4>
          <span className="text-xs text-slate-400">
            Question {index + 1} of {questions.length}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Choose the response that best corresponds to how you feel.
        </p>
      </div>

      {!isFinished || (!hasAnswered && isLast) ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
          <h5 className="text-sm font-semibold text-slate-200">{current.title}</h5>
          <div className="space-y-2.5">
            {OPTIONS.map((opt) => {
              const isSelected = answers[current.id] === opt.score;
              return (
                <label
                  key={opt.score}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "border-teal-500 bg-teal-950/30 text-white"
                      : "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    checked={isSelected}
                    onChange={() =>
                      setAnswers((prev) => ({ ...prev, [current.id]: opt.score }))
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
              onClick={() => index > 0 && setIndex((p) => p - 1)}
              disabled={index === 0}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                index === 0
                  ? "opacity-50 cursor-not-allowed bg-slate-800 text-slate-500"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Back
            </button>
            <button
              onClick={() => hasAnswered && !isLast && setIndex((p) => p + 1)}
              disabled={!hasAnswered || isLast}
              className={`rounded-xl px-5 py-2 text-xs font-semibold text-white transition-colors ${
                !hasAnswered || isLast
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
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-center space-y-2 animate-fadeIn">
          <h5 className="text-sm font-bold text-white">Section completed</h5>
          <div className="text-sm text-slate-300">
            Score: <strong className="text-white text-base">{total}</strong> / 42
          </div>
          <div
            className={`text-xs px-3 py-2 rounded-lg border inline-block font-medium ${interpretation.color}`}
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
  const [result, setResult] = useState<any>(null);
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
    const answers = [...Object.entries(answersA), ...Object.entries(answersB)].map(
      ([id, value]) => ({ question_id: Number(id), value }),
    );

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
    <div className="space-y-8 max-w-xl mx-auto">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-center">
        <h3 className="text-lg font-bold text-white">🔥 Burnout self-check</h3>
        <p className="text-xs text-slate-400 mt-1">
          Complete both sections below to assess different dimensions of burnout.
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 text-center">
          <h4 className="text-sm font-bold text-white">Both sections completed</h4>
          <button
            onClick={handleSubmit}
            disabled={saving || result !== null}
            className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : result ? "Saved" : "Save burnout result"}
          </button>

          {error && <div className="text-xs text-red-400">{error}</div>}

          {result && (
            <div className="text-xs text-slate-300 space-y-1 text-left">
              {result.tips.map((tip: string, i: number) => (
                <div key={i}>• {tip}</div>
              ))}
              <div className="pt-2 text-[10px] text-slate-500">
                Self-assessment only, not a medical diagnosis.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
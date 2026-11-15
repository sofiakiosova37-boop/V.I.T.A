import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface SingleTestProps {
  savedResult?: number;
  onSaveResult: (value: number) => void;
  userId?: number;
}
const SYMBOLS = ['🔺', '⭕', '⏹️', '💎', '⭐', '🍀'];
const TOTAL_STEPS = 15; 
const STEP_DURATION = 2200; 

interface Stats {
  hits: number;
  falseAlarms: number;
  misses: number;
  totalTargets: number;
}

// Используем SingleTestProps вместо кастомного коллбэка
export const TwoBackTest: React.FC<SingleTestProps> = ({ savedResult, onSaveResult, userId }) => {
  const [stage, setStage] = useState<'idle' | 'playing' | 'result'>('idle');
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  
  const [feedback, setFeedback] = useState<'hit' | 'wrong' | null>(null);
  const [stats, setStats] = useState<Stats>({ hits: 0, falseAlarms: 0, misses: 0, totalTargets: 0 });

  const answeredThisStepRef = useRef(false);
  const statsRef = useRef<Stats>({ hits: 0, falseAlarms: 0, misses: 0, totalTargets: 0 });

  const generateSequence = () => {
    const seq: string[] = [];
    let targets = 0;

    for (let i = 0; i < TOTAL_STEPS; i++) {
      if (i >= 2 && Math.random() < 0.35) {
        seq.push(seq[i - 2]);
        targets++;
      } else {
        const forbidden = i >= 2 ? seq[i - 2] : null;
        const pool = SYMBOLS.filter((s) => s !== forbidden);
        seq.push(pool[Math.floor(Math.random() * pool.length)]);
      }
    }
    return { seq, targets };
  };

  const startTest = () => {
    const { seq, targets } = generateSequence();
    const initialStats = { hits: 0, falseAlarms: 0, misses: 0, totalTargets: targets };
    
    setSequence(seq);
    setCurrentIndex(0);
    setFeedback(null);
    setStats(initialStats);
    statsRef.current = initialStats;
    answeredThisStepRef.current = false;
    setStage('playing');
  };

  const handleMatchClick = useCallback(() => {
    if (stage !== 'playing' || answeredThisStepRef.current || currentIndex < 2) return;

    answeredThisStepRef.current = true;
    const isMatch = sequence[currentIndex] === sequence[currentIndex - 2];

    if (isMatch) {
      statsRef.current.hits += 1;
      setFeedback('hit');
    } else {
      statsRef.current.falseAlarms += 1;
      setFeedback('wrong');
    }
    setStats({ ...statsRef.current });
  }, [stage, currentIndex, sequence]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleMatchClick();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleMatchClick]);

  useEffect(() => {
    if (stage !== 'playing') return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIdx) => {
        if (prevIdx >= 2 && sequence[prevIdx] === sequence[prevIdx - 2] && !answeredThisStepRef.current) {
          statsRef.current.misses += 1;
          setStats({ ...statsRef.current });
        }

        const nextIdx = prevIdx + 1;
        if (nextIdx >= TOTAL_STEPS) {
          clearInterval(timer);
          setStage('result');
          
          const { hits, falseAlarms, totalTargets } = statsRef.current;
          const accuracy = totalTargets > 0 ? Math.max(0, (hits - falseAlarms * 0.5) / totalTargets) : 1;
          const finalScore = Math.round(accuracy * 100);
          
          // Вызываем стандартный коллбэк из SingleTestProps для сохранения
          onSaveResult(finalScore);
          
          return prevIdx;
        }

        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);

        answeredThisStepRef.current = false;
        setFeedback(null);
        return nextIdx;
      });
    }, STEP_DURATION);

    return () => clearInterval(timer);
  }, [stage, sequence, onSaveResult]);

  const finalScore = stats.totalTargets > 0
    ? Math.round(Math.max(0, (stats.hits - stats.falseAlarms * 0.5) / stats.totalTargets) * 100)
    : (savedResult ?? 100);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md text-center max-w-md mx-auto select-none">
      <h2 className="text-xl font-bold mb-2">Тест 2-Back (Рабочая память)</h2>
      
      {savedResult !== undefined && stage === 'idle' && (
        <div className="mb-4 text-sm text-indigo-600 bg-indigo-50 p-2 rounded">
          Ваш прошлый результат: <strong>{savedResult} pts</strong>
        </div>
      )}

      {stage === 'idle' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Запоминайте поток символов. Нажимайте <strong>«Совпадает!»</strong> (или клавишу <strong>Пробел</strong>), 
            если текущий символ такой же, как был <strong>2 шага назад</strong>.
          </p>
          <button
            onClick={startTest}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            Начать тест
          </button>
        </div>
      )}

      {stage === 'playing' && (
        <div className="space-y-6">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Шаг {currentIndex + 1} из {TOTAL_STEPS}</span>
            <span>Верно: {stats.hits} | Ошибки: {stats.falseAlarms}</span>
          </div>

          <div
            className={`h-36 flex items-center justify-center rounded-2xl border-2 transition-colors duration-150 ${
              feedback === 'hit'
                ? 'border-green-500 bg-green-50'
                : feedback === 'wrong'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            {!isBlinking && (
              <span className="text-6xl">{sequence[currentIndex]}</span>
            )}
          </div>

          <button
            onClick={handleMatchClick}
            disabled={currentIndex < 2}
            className={`w-full py-3 rounded-xl font-bold text-white transition ${
              currentIndex < 2
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {currentIndex < 2 ? 'Запоминайте...' : 'Совпадает! (Пробел)'}
          </button>
        </div>
      )}

      {stage === 'result' && (
        <div className="space-y-4">
          <div className="text-3xl font-extrabold text-indigo-600">{finalScore}%</div>
          <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 p-3 rounded-lg">
            <div>
              <div className="text-gray-400 text-xs">Попадания</div>
              <div className="font-bold text-green-600">{stats.hits} / {stats.totalTargets}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Пропуски</div>
              <div className="font-bold text-amber-600">{stats.misses}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Ложные</div>
              <div className="font-bold text-red-600">{stats.falseAlarms}</div>
            </div>
          </div>
          <button
            onClick={startTest}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Пройти ещё раз
          </button>
        </div>
      )}
    </div>
  );
};
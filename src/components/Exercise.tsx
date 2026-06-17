import { useState } from 'react';
import { playCorrectSound, playWrongSound } from '../utils/audio';

export interface ExerciseData {
  id: string;
  type: 'choose' | 'fill' | 'translate';
  question: string;
  options?: string[];
  answer: string;
  serbianContext?: string;
}

interface ExerciseProps {
  exercise: ExerciseData;
  onComplete: (correct: boolean) => void;
}

export default function Exercise({ exercise, onComplete }: ExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const correct = option.toLowerCase() === exercise.answer.toLowerCase();
    if (correct) playCorrectSound();
    else playWrongSound();
    setTimeout(() => onComplete(correct), 1200);
  };

  return (
    <div className="card flex flex-col gap-4">
      {exercise.serbianContext && (
        <p className="text-lg text-serbia-blue font-medium text-center">
          {exercise.serbianContext}
        </p>
      )}

      <p className="text-center text-slate-600">{exercise.question}</p>

      {exercise.type === 'choose' && exercise.options && (
        <div className="grid grid-cols-1 gap-2">
          {exercise.options.map((option) => {
            let bgClass = 'bg-slate-50 hover:bg-slate-100';
            if (answered) {
              if (option === exercise.answer) bgClass = 'bg-green-100 border-green-400';
              else if (option === selected) bgClass = 'bg-red-100 border-red-400';
              else bgClass = 'bg-slate-50 opacity-50';
            }
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`p-3 rounded-xl border border-slate-200 text-left transition-all ${bgClass}`}
                disabled={answered}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {exercise.type === 'fill' && (
        <div className="flex flex-col gap-2">
          {exercise.options && exercise.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`p-3 rounded-xl border border-slate-200 text-left transition-all ${
                answered
                  ? option === exercise.answer
                    ? 'bg-green-100 border-green-400'
                    : option === selected
                    ? 'bg-red-100 border-red-400'
                    : 'bg-slate-50 opacity-50'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
              disabled={answered}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {answered && (
        <p className={`text-center font-medium ${selected === exercise.answer ? 'text-green-600' : 'text-red-600'}`}>
          {selected === exercise.answer ? 'Правильно! ✓' : `Неверно. Ответ: ${exercise.answer}`}
        </p>
      )}
    </div>
  );
}

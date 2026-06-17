import { useState } from 'react';
import type { Word } from '../db';
import AudioButton from './AudioButton';

interface WordCardProps {
  word: Word;
  onKnown: () => void;
  onLearning: () => void;
}

export default function WordCard({ word, onKnown, onLearning }: WordCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="card flex flex-col items-center gap-4 min-h-[320px]">
      {!showAnswer ? (
        <>
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <span className="text-4xl font-bold text-serbia-blue">{word.serbian}</span>
            <span className="text-lg text-slate-400">{word.serbianLatin}</span>
            {word.gender && (
              <span className="text-sm text-slate-400 italic">({word.gender})</span>
            )}
          </div>
          <AudioButton text={word.serbian} size="lg" />
          <button
            onClick={() => setShowAnswer(true)}
            className="btn-primary w-full"
          >
            Показать перевод
          </button>
        </>
      ) : (
        <>
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <span className="text-3xl font-bold text-serbia-blue">{word.serbian}</span>
            <span className="text-2xl text-slate-700">{word.russian}</span>
            {word.examples.length > 0 && (
              <div className="mt-4 text-sm text-slate-500 text-center px-2">
                <p className="italic">"{word.examples[0].serbian}"</p>
                <p className="text-slate-400">{word.examples[0].russian}</p>
              </div>
            )}
          </div>
          <AudioButton text={word.serbian} size="lg" />
          <div className="flex gap-3 w-full">
            <button onClick={onLearning} className="btn-secondary flex-1">
              📚 Ещё учить
            </button>
            <button onClick={onKnown} className="btn-primary flex-1">
              ✅ Знаю
            </button>
          </div>
        </>
      )}
    </div>
  );
}

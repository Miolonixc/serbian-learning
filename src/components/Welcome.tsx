import { useState } from 'react';

interface WelcomeProps {
  onComplete: (name: string) => void;
}

export default function Welcome({ onComplete }: WelcomeProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      localStorage.setItem('userName', trimmed);
      onComplete(trimmed);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="text-6xl">🇷🇸</div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-serbia-blue mb-2">Учим српски</h1>
          <p className="text-slate-500">Изучайте сербский язык по 15 минут в день</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="text"
            placeholder="Как вас зовут?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full p-4 rounded-xl border border-slate-200 bg-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="btn-primary w-full disabled:opacity-40"
          >
            Начать обучение
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center">
          Прогресс сохраняется локально
        </p>
      </div>
    </div>
  );
}

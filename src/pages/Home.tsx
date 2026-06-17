import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDailyWords } from '../hooks/useDailyWords';
import { useProgress } from '../hooks/useProgress';
import WordCard from '../components/WordCard';
import ProgressBar from '../components/ProgressBar';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

export default function Home() {
  const { words, loading, markKnown, markLearning } = useDailyWords();
  const { stats, refresh: refreshStats, recordDailyStat } = useProgress();

  const name = localStorage.getItem('userName') || 'Ученик';
  const greeting = getGreeting();
  const accuracy = stats.totalExercises > 0
    ? Math.round((stats.correctExercises / stats.totalExercises) * 100)
    : 0;

  const currentIndex = words.findIndex((_, i) => {
    const completed = parseInt(localStorage.getItem('dailyProgress') || '0', 10);
    return i >= completed;
  });
  const effectiveIndex = currentIndex === -1 ? words.length : currentIndex;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem('dailyProgressDate');
    if (savedDate !== today) {
      localStorage.setItem('dailyProgress', '0');
      localStorage.setItem('dailyProgressDate', today);
    }
  }, []);

  const handleKnown = async () => {
    const word = words[effectiveIndex];
    if (!word || !word.id) return;
    await markKnown(word.id);
    await recordDailyStat('words');
    const next = effectiveIndex + 1;
    localStorage.setItem('dailyProgress', String(next));
    refreshStats();
  };

  const handleLearning = async () => {
    const word = words[effectiveIndex];
    if (!word || !word.id) return;
    await markLearning(word.id);
    const next = effectiveIndex + 1;
    localStorage.setItem('dailyProgress', String(next));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-6xl">📚</p>
        <p className="text-slate-500 text-center">Слова ещё не загружены</p>
      </div>
    );
  }

  const completed = effectiveIndex;
  const isFinished = completed >= words.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-br from-serbia-blue to-primary-700 rounded-2xl p-5 text-white">
        <p className="text-sm opacity-80">{greeting}</p>
        <h1 className="text-xl font-bold mt-1">{name}!</h1>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🔥</span>
              <span className="font-bold">{stats.streak}</span>
              <span className="text-sm opacity-80">дней подряд</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min((stats.todayWordsLearned / 8) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs opacity-70 mt-1">{stats.todayWordsLearned}/8 слов сегодня</p>
          </div>
        </div>
      </div>

      {!isFinished ? (
        <>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Слово {completed + 1} из {words.length}</span>
            <span>{Math.round((completed / words.length) * 100)}%</span>
          </div>
          <ProgressBar current={completed} total={words.length} showLabel={false} />
          <WordCard
            word={words[effectiveIndex]}
            onKnown={handleKnown}
            onLearning={handleLearning}
          />
        </>
      ) : (
        <div className="card flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-serbia-blue">Отлично!</h2>
          <p className="text-slate-500 text-center text-sm">
            Все слова на сегодня изучены
          </p>
          <div className="flex gap-3 w-full mt-2">
            <Link to="/exercises" className="btn-secondary flex-1 text-center">
              Упражнения
            </Link>
            <Link to="/progress" className="btn-primary flex-1 text-center">
              Прогресс
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Link to="/vocabulary" className="card flex flex-col items-center gap-1 py-3">
          <span className="text-xl">📖</span>
          <span className="text-xs text-slate-500">{stats.learnedWords} слов</span>
        </Link>
        <Link to="/grammar" className="card flex flex-col items-center gap-1 py-3">
          <span className="text-xl">📝</span>
          <span className="text-xs text-slate-500">{stats.lessonsCompleted} уроков</span>
        </Link>
        <Link to="/exercises" className="card flex flex-col items-center gap-1 py-3">
          <span className="text-xl">✏️</span>
          <span className="text-xs text-slate-500">{accuracy}% точность</span>
        </Link>
      </div>
    </div>
  );
}

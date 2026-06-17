import { useProgress } from '../hooks/useProgress';

export default function Progress() {
  const { stats, loading } = useProgress();
  const name = localStorage.getItem('userName') || 'Ученик';

  const handleLogout = () => {
    if (confirm('Выйти и очистить данные?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  const accuracy = stats.totalExercises > 0
    ? Math.round((stats.correctExercises / stats.totalExercises) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-br from-serbia-blue to-primary-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{name}</h1>
            <p className="text-sm opacity-80">Серия: {stats.streak} дней</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <span className="text-2xl">📖</span>
          <p className="text-2xl font-bold text-serbia-blue mt-1">{stats.learnedWords}</p>
          <p className="text-xs text-slate-500">Слов изучено</p>
        </div>
        <div className="card text-center">
          <span className="text-2xl">✏️</span>
          <p className="text-2xl font-bold text-serbia-blue mt-1">{accuracy}%</p>
          <p className="text-xs text-slate-500">Точность</p>
        </div>
        <div className="card text-center">
          <span className="text-2xl">📝</span>
          <p className="text-2xl font-bold text-serbia-blue mt-1">{stats.lessonsCompleted}</p>
          <p className="text-xs text-slate-500">Уроков пройдено</p>
        </div>
        <div className="card text-center">
          <span className="text-2xl">🔥</span>
          <p className="text-2xl font-bold text-serbia-blue mt-1">{stats.streak}</p>
          <p className="text-xs text-slate-500">Дней подряд</p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold text-slate-700 mb-3 text-sm">Сегодня</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Слов изучено</span>
              <span className="text-primary-600 font-medium">{stats.todayWordsLearned} / 8</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${Math.min((stats.todayWordsLearned / 8) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Упражнений</span>
              <span className="text-primary-600 font-medium">{stats.todayExercisesDone}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${Math.min((stats.todayExercisesDone / 10) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleLogout} className="text-sm text-slate-400 text-center py-2">
        Выйти
      </button>
    </div>
  );
}

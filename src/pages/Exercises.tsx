import { useState, useEffect } from 'react';
import Exercise, { type ExerciseData } from '../components/Exercise';
import { useProgress } from '../hooks/useProgress';
import { db } from '../db';
import exercisesData from '../data/exercises.json';

export default function Exercises() {
  const [allExercises, setAllExercises] = useState<ExerciseData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<{ exercise: ExerciseData; correct: boolean }[]>([]);
  const { recordDailyStat } = useProgress();

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    const prevResults = await db.exerciseResults.toArray();
    const wrongIds = new Set(
      prevResults.filter(r => !r.correct).map(r => r.exerciseId)
    );

    const wrongExercises = exercisesData.filter(e => wrongIds.has(e.id));
    const otherExercises = exercisesData.filter(e => !wrongIds.has(e.id));

    const shuffledWrong = [...wrongExercises].sort(() => Math.random() - 0.5);
    const shuffledOther = [...otherExercises].sort(() => Math.random() - 0.5);

    const selected = [...shuffledWrong, ...shuffledOther].slice(0, 10);

    if (selected.length === 0) {
      setAllExercises([...exercisesData].sort(() => Math.random() - 0.5).slice(0, 10));
    } else {
      setAllExercises(selected);
    }
  };

  const handleComplete = (correctAnswer: boolean) => {
    const exercise = allExercises[currentIndex];

    if (correctAnswer) setCorrect(c => c + 1);
    setResults(r => [...r, { exercise, correct: correctAnswer }]);
    recordDailyStat('exercises');

    db.exerciseResults.add({
      exerciseId: exercise.id,
      correct: correctAnswer,
      date: new Date(),
    });

    if (currentIndex + 1 >= allExercises.length) {
      setIsFinished(true);
    } else {
      setTimeout(() => setCurrentIndex(i => i + 1), 1300);
    }
  };

  const restart = async () => {
    await loadExercises();
    setCurrentIndex(0);
    setCorrect(0);
    setResults([]);
    setIsFinished(false);
  };

  if (allExercises.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((correct / allExercises.length) * 100);
    const wrongOnes = results.filter(r => !r.correct);

    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <span className="text-5xl">{percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}</span>
        <h2 className="text-xl font-bold text-serbia-blue">
          {percentage >= 80 ? 'Отлично!' : percentage >= 50 ? 'Хорошо!' : 'Продолжайте!'}
        </h2>
        <div className="card w-full text-center">
          <p className="text-4xl font-bold text-primary-600">{percentage}%</p>
          <p className="text-slate-500 mt-1">
            {correct} из {allExercises.length} правильных
          </p>
        </div>

        {wrongOnes.length > 0 && (
          <div className="card w-full">
            <p className="font-medium text-slate-700 mb-2 text-sm">Стоит повторить:</p>
            <div className="space-y-2">
              {wrongOnes.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-red-400">✗</span>
                  <span className="text-serbia-blue font-medium">{r.exercise.serbianContext || r.exercise.question}</span>
                  <span className="text-slate-400">→ {r.exercise.answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={restart} className="btn-primary w-full">
          Ещё раз
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-serbia-blue">Упражнения</h1>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Вопрос {currentIndex + 1} из {allExercises.length}</span>
        <span>Правильных: {correct}</span>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex) / allExercises.length) * 100}%` }}
        />
      </div>

      <Exercise
        key={allExercises[currentIndex].id}
        exercise={allExercises[currentIndex]}
        onComplete={handleComplete}
      />
    </div>
  );
}

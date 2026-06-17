import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../db';
import grammarData from '../data/grammar.json';

interface GrammarLessonData {
  id: string;
  title: string;
  level: string;
  content: string;
  rules: string[];
  examples: { serbian: string; russian: string }[];
  miniExercises?: { question: string; answer: string }[];
}

export default function GrammarLessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState<GrammarLessonData | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const found = grammarData.find(l => l.id === id);
    if (found) setLesson(found);

    db.completedLessons.where('lessonId').equals(id!).first().then((existing) => {
      if (existing) setCompleted(true);
    });
  }, [id]);

  const markComplete = async () => {
    await db.completedLessons.add({
      lessonId: id!,
      completedAt: new Date(),
    });
    setCompleted(true);
  };

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400">Урок не найден</div>
      </div>
    );
  }

  const paragraphs = lesson.content.split('\n').filter(p => p.trim());

  return (
    <div className="flex flex-col gap-4">
      <Link to="/grammar" className="text-primary-600 text-sm">← Назад к урокам</Link>

      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 bg-primary-100 text-primary-600 rounded text-sm font-bold">
          {lesson.level}
        </span>
        <h1 className="text-lg font-bold text-serbia-blue leading-tight">{lesson.title}</h1>
      </div>

      <div className="card">
        <button
          onClick={() => setShowContent(!showContent)}
          className="flex items-center justify-between w-full"
        >
          <span className="font-medium text-slate-700">Теория</span>
          <span className="text-slate-400">{showContent ? '▲' : '▼'}</span>
        </button>
        {showContent && (
          <div className="mt-3 space-y-2 text-sm text-slate-600 leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>

      {lesson.rules.length > 0 && (
        <div className="card">
          <h2 className="font-bold text-slate-700 mb-2 text-sm">Правила:</h2>
          <ul className="space-y-1.5">
            {lesson.rules.map((rule, i) => (
              <li key={i} className="text-xs text-slate-600 flex gap-2">
                <span className="text-primary-500 shrink-0">•</span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lesson.examples.length > 0 && (
        <div className="card">
          <h2 className="font-bold text-slate-700 mb-2 text-sm">Примеры:</h2>
          <div className="space-y-2">
            {lesson.examples.map((ex, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <p className="text-sm text-serbia-blue font-medium leading-snug">{ex.serbian}</p>
                <p className="text-xs text-slate-500">{ex.russian}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!completed ? (
        <button onClick={markComplete} className="btn-primary w-full">
          Урок пройден
        </button>
      ) : (
        <div className="card text-center text-green-600 font-medium text-sm">
          Урок пройден!
        </div>
      )}
    </div>
  );
}

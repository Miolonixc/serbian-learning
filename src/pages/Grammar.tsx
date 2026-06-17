import { useState, useEffect } from 'react';
import { db } from '../db';
import { Link } from 'react-router-dom';
import grammarData from '../data/grammar.json';

interface GrammarLessonData {
  id: string;
  title: string;
  level: string;
  content: string;
  rules: string[];
  examples: { serbian: string; russian: string }[];
}

export default function Grammar() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    db.completedLessons.toArray().then((completed) => {
      setCompletedIds(new Set(completed.map(c => c.lessonId)));
    });
  }, []);

  const levelColors: Record<string, string> = {
    A1: 'bg-green-100 text-green-700',
    A2: 'bg-blue-100 text-blue-700',
    B1: 'bg-yellow-100 text-yellow-700',
    B2: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-serbia-blue">Грамматика</h1>
      <p className="text-slate-500">Уроки сербской грамматики</p>

      <div className="flex flex-col gap-3">
        {grammarData.map((lesson, index) => (
          <Link
            key={lesson.id}
            to={`/grammar/${lesson.id}`}
            className="card flex items-start gap-3 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
              completedIds.has(lesson.id)
                ? 'bg-green-100 text-green-600'
                : levelColors[lesson.level] || 'bg-primary-100 text-primary-600'
            }`}>
              {completedIds.has(lesson.id) ? '✓' : lesson.level}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-400">#{index + 1}</span>
                <p className="font-medium text-sm leading-tight">{lesson.title}</p>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{lesson.content}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

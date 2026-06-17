import { useState, useEffect } from 'react';
import { db, type Word, type WordProgress } from '../db';
import AudioButton from '../components/AudioButton';

export default function Vocabulary() {
  const [words, setWords] = useState<Word[]>([]);
  const [progress, setProgress] = useState<Map<number, WordProgress>>(new Map());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'learned' | 'new' | 'review'>('all');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    const allWords = await db.words.toArray();
    setWords(allWords);

    const allProgress = await db.wordProgress.toArray();
    const progressMap = new Map(allProgress.map(p => [p.wordId, p]));
    setProgress(progressMap);
  };

  const filteredWords = words.filter((word) => {
    const matchSearch = search === '' ||
      word.serbian.toLowerCase().includes(search.toLowerCase()) ||
      word.serbianLatin.toLowerCase().includes(search.toLowerCase()) ||
      word.russian.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    const p = progress.get(word.id!);
    switch (filter) {
      case 'learned':
        return p && p.repetitions >= 3;
      case 'new':
        return !p || p.repetitions === 0;
      case 'review':
        return p && p.repetitions > 0 && p.repetitions < 3;
      default:
        return true;
    }
  });

  const counts = {
    all: words.length,
    learned: words.filter(w => { const p = progress.get(w.id!); return p && p.repetitions >= 3; }).length,
    new: words.filter(w => { const p = progress.get(w.id!); return !p || p.repetitions === 0; }).length,
    review: words.filter(w => { const p = progress.get(w.id!); return p && p.repetitions > 0 && p.repetitions < 3; }).length,
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-serbia-blue">Словарь</h1>

      <input
        type="text"
        placeholder="Поиск слов..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {([
          { key: 'all', label: 'Все' },
          { key: 'learned', label: 'Изученные' },
          { key: 'new', label: 'Новые' },
          { key: 'review', label: 'Повторение' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              filter === key
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      {selectedWord ? (
        <div className="card">
          <button
            onClick={() => setSelectedWord(null)}
            className="text-sm text-primary-600 mb-3"
          >
            ← Назад к списку
          </button>
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl font-bold text-serbia-blue">{selectedWord.serbian}</span>
            <span className="text-lg text-slate-500">{selectedWord.serbianLatin}</span>
            <span className="text-xl text-slate-700">{selectedWord.russian}</span>
            {selectedWord.gender && (
              <span className="text-sm text-slate-400 italic">({selectedWord.gender})</span>
            )}
            <AudioButton text={selectedWord.serbian} size="lg" />
            {selectedWord.examples.length > 0 && (
              <div className="mt-4 text-sm text-slate-500 text-center">
                <p className="font-medium text-slate-600 mb-1">Примеры:</p>
                {selectedWord.examples.map((ex, i) => (
                  <div key={i} className="mb-2">
                    <p className="italic">"{ex.serbian}"</p>
                    <p className="text-slate-400">{ex.russian}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredWords.length === 0 ? (
            <p className="text-center text-slate-400 py-8">Ничего не найдено</p>
          ) : (
            filteredWords.map((word) => {
              const p = progress.get(word.id!);
              const status = !p ? 'new' : p.repetitions >= 3 ? 'learned' : 'review';
              return (
                <button
                  key={word.id}
                  onClick={() => setSelectedWord(word)}
                  className="card flex items-center gap-3 text-left"
                >
                  <AudioButton text={word.serbian} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-serbia-blue truncate">{word.serbian}</p>
                    <p className="text-sm text-slate-400 truncate">{word.serbianLatin}</p>
                  </div>
                  <span className="text-slate-600">{word.russian}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    status === 'learned' ? 'bg-green-100 text-green-600' :
                    status === 'review' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {status === 'learned' ? '✓' : status === 'review' ? '↻' : 'нов'}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

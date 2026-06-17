import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

interface WelcomeProps {
  onComplete: () => void;
}

export default function Welcome({ onComplete }: WelcomeProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onComplete();
    } catch (err: any) {
      const code = err.code;
      if (code === 'auth/email-already-in-use') setError('Email уже зарегистрирован');
      else if (code === 'auth/invalid-email') setError('Некорректный email');
      else if (code === 'auth/weak-password') setError('Пароль минимум 6 символов');
      else if (code === 'auth/user-not-found') setError('Пользователь не найден');
      else if (code === 'auth/wrong-password') setError('Неверный пароль');
      else setError('Ошибка: ' + err.message);
    } finally {
      setLoading(false);
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

        <div className="flex gap-2 w-full">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'register' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Как вас зовут?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 rounded-xl border border-slate-200 bg-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="w-full p-4 rounded-xl border border-slate-200 bg-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-4 rounded-xl border border-slate-200 bg-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-40"
          >
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center">
          Прогресс синхронизируется между устройствами
        </p>
      </div>
    </div>
  );
}

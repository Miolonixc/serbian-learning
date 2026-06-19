import { useState, useEffect, Component, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { seedDatabase } from './utils/seed';
import Welcome from './components/Welcome';
import Layout from './components/Layout';
import Home from './pages/Home';
import Vocabulary from './pages/Vocabulary';
import Grammar from './pages/Grammar';
import GrammarLessonPage from './pages/GrammarLessonPage';
import Exercises from './pages/Exercises';
import Progress from './pages/Progress';

class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('COMPONENT CRASH:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback || (
          <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
            <h2 style={{ color: 'red' }}>Ошибка</h2>
            <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>
              {this.state.error.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: 10, padding: '8px 16px' }}
            >
              Перезагрузить
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    seedDatabase()
      .then(() => {
        const saved = localStorage.getItem('userName');
        setUserName(saved);
        setReady(true);
      })
      .catch((e) => {
        console.error('Seed failed:', e);
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: 40 }}>📚</p>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!userName) {
    return (
      <Welcome
        onComplete={(name) => {
          localStorage.setItem('userName', name);
          setUserName(name);
        }}
      />
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/grammar/:id" element={<GrammarLessonPage />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/progress" element={<Progress />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

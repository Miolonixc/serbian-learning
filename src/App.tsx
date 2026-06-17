import { useState, useEffect } from 'react';
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

export default function App() {
  const [ready, setReady] = useState(false);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setHasUser(true);
    seedDatabase().then(() => setReady(true));
  }, []);

  const handleWelcome = () => {
    setHasUser(true);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl">📚</div>
          <div className="text-slate-400">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!hasUser) {
    return <Welcome onComplete={handleWelcome} />;
  }

  return (
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
  );
}

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import { auth } from './firebase';
import { seedDatabase } from './utils/seed';
import { loadFromCloud } from './utils/sync';
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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    seedDatabase().then(() => {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          await loadFromCloud(firebaseUser.uid);
        }
        setUser(firebaseUser);
        setReady(true);
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

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

  if (!user) {
    return <Welcome onComplete={() => {}} />;
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

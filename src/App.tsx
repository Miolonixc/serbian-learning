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
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    seedDatabase().then(() => {
      const saved = localStorage.getItem('userName');
      setUserName(saved);
      setReady(true);
    }).catch(() => {
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <div style={{padding:40,textAlign:'center'}}>Загрузка...</div>;
  }

  if (!userName) {
    return <Welcome onComplete={(name) => {
      localStorage.setItem('userName', name);
      setUserName(name);
    }} />;
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

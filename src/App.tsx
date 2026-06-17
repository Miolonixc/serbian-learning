import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { seedDatabase } from './utils/seed';

export default function App() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    seedDatabase()
      .then(() => {
        const saved = localStorage.getItem('userName');
        if (saved) setUser(saved);
        setReady(true);
      })
      .catch((e) => {
        setError(String(e));
        setReady(true);
      });
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!ready) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-4">
        <h1>Welcome</h1>
        <input
          type="text"
          placeholder="Name"
          id="name-input"
          className="border p-2"
        />
        <button
          onClick={() => {
            const input = document.getElementById('name-input') as HTMLInputElement;
            const name = input?.value?.trim();
            if (name) {
              localStorage.setItem('userName', name);
              setUser(name);
            }
          }}
          className="ml-2 border p-2"
        >
          Go
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1>Hello {user}!</h1>
      <p>App is working.</p>
    </div>
  );
}

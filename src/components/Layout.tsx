import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Главная', icon: '🏠' },
  { to: '/vocabulary', label: 'Словарь', icon: '📖' },
  { to: '/grammar', label: 'Грамматика', icon: '📝' },
  { to: '/exercises', label: 'Упражнения', icon: '✏️' },
  { to: '/progress', label: 'Прогресс', icon: '📊' },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col pb-20">
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="max-w-lg mx-auto flex justify-around items-center h-16">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 text-xs transition-colors ${
                  isActive ? 'tab-active' : 'tab-inactive'
                }`
              }
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

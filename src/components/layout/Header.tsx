import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/profile', label: '经历管理' },
  { to: '/editor', label: '简历编辑' },
  { to: '/settings', label: '设置' },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-[var(--color-primary-dark)] hover:opacity-80">
          Resume Builder
        </Link>
        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                location.pathname.startsWith(item.to)
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

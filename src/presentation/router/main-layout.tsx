import { NavLink, Outlet } from 'react-router-dom';
import { Home, ListChecks, Search, User } from 'lucide-react';
import { cn } from '@/presentation/utils/cn';

const tabs = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/explorar', label: 'Explorar', icon: Search, end: false },
  { to: '/mi-lista', label: 'Mi Lista', icon: ListChecks, end: false },
  { to: '/perfil', label: 'Perfil', icon: User, end: false },
];

export function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex-1 pb-16">
        <Outlet />
      </div>

      <nav className="fixed inset-x-0 bottom-0 flex h-16 border-t border-border bg-card">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-[11px]',
                isActive ? 'font-bold text-primary' : 'text-muted-foreground',
              )
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

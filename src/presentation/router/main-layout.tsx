import { NavLink, Outlet } from 'react-router-dom';
import { Home, ListChecks, Search, User } from 'lucide-react';
import { cn } from '@/presentation/utils/cn';
import { useAuthStore } from '@/presentation/store/auth.store';

const NAVY = '#1A237E';

const tabs = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/explorar', label: 'Explorar', icon: Search, end: false },
  { to: '/mi-lista', label: 'Mi Lista', icon: ListChecks, end: false },
  { to: '/perfil', label: 'Perfil', icon: User, end: false },
];

export function MainLayout() {
  const username = useAuthStore((s) => s.user?.username);

  return (
    <div className="flex min-h-full flex-col bg-background">
      {/* Navbar superior — solo desktop (lg+). Se ancla al mismo shell estable que el
          bottom nav de mobile (ver app-router.tsx), por eso puede ser `fixed` sin
          heredar el bug de "se mueve con el scroll". `inset-x-0` la estira de punta a
          punta del viewport (el shell ya no tiene max-width en lg); su fila interna sí
          se acota a max-w-7xl para no quedar pegada a los bordes en pantallas anchas. */}
      <header className="fixed inset-x-0 top-0 z-20 hidden h-16 border-b border-border bg-card lg:block">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
          <span className="text-lg font-bold" style={{ color: NAVY }}>
            PreciosEC
          </span>

          <nav className="flex items-center gap-8">
            {tabs.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 text-sm font-semibold',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <span className="text-sm text-muted-foreground">{username ? `Hola, ${username}` : ''}</span>
        </div>
      </header>

      {/* Contenido: en mobile ocupa todo el ancho (pb-16 deja lugar al bottom nav); en
          desktop se acota a max-w-7xl centrado con padding lateral (pt-16 en vez de
          pb-16, porque ahí lo fijo es la navbar de ARRIBA, no un nav de abajo). */}
      <div className="flex-1 pb-16 lg:mx-auto lg:w-full lg:max-w-7xl lg:px-8 lg:pb-0 lg:pt-16">
        <Outlet />
      </div>

      {/* Bottom nav — solo mobile, oculto desde `lg` en adelante. */}
      <nav className="fixed inset-x-0 bottom-0 flex h-16 border-t border-border bg-card lg:hidden">
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

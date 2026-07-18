import { useState, type ComponentType, type ReactNode } from 'react';
import { User, Bell, HelpCircle, Info, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { TiraRombosCentrada } from '@/presentation/components/tira-rombos-centrada';
import { FondoPatron } from '@/presentation/components/fondo-patron';
import { cn } from '@/presentation/utils/cn';

const NAVY = '#1A237E';

const AYUDA_CONTENIDO =
  '1. Elige una categoría (Supermercados, Farmacias o Ferreterías)\n\n' +
  '2. Selecciona una subcategoría\n\n' +
  '3. Toca un producto para ver sus precios en distintos comercios\n\n' +
  '4. Toca "Elegir este" para agregar a tu lista de compras\n\n' +
  '5. En "Mi Lista" puedes pedir delivery o ver dónde recoger';

const ACERCA_DE_CONTENIDO =
  'PreciosEC es un comparador de precios para Ecuador.\n\n' +
  'Compara precios entre supermercados, farmacias y ferreterías para que siempre encuentres la mejor oferta antes de comprar.\n\n' +
  'Versión: 1.0.0\n' +
  'Desarrollado por: Equipo PreciosEC\n' +
  'Universidad: UTE';

interface Opcion {
  icono: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  titulo: string;
  subtitulo: string;
  color: string;
  contenido: string;
}

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [dialogo, setDialogo] = useState<Opcion | null>(null);
  const [confirmarSalir, setConfirmarSalir] = useState(false);

  const username = user?.username ?? '';
  const email = user?.email ?? '';

  const opciones: Opcion[] = [
    {
      icono: User,
      titulo: 'Mi cuenta',
      subtitulo: 'Información personal',
      color: '#1565C0',
      contenido: `Usuario: ${username}\nCorreo: ${email}`,
    },
    {
      icono: Bell,
      titulo: 'Notificaciones',
      subtitulo: 'Alertas de precios y ofertas',
      color: '#FF8F00',
      contenido:
        'Próximamente podrás configurar alertas cuando el precio de un producto baje en cualquier comercio.',
    },
    {
      icono: HelpCircle,
      titulo: 'Ayuda',
      subtitulo: '¿Cómo usar PreciosEC?',
      color: '#2E7D32',
      contenido: AYUDA_CONTENIDO,
    },
    {
      icono: Info,
      titulo: 'Acerca de PreciosEC',
      subtitulo: 'Versión 1.0.0',
      color: '#6A1B9A',
      contenido: ACERCA_DE_CONTENIDO,
    },
  ];

  return (
    <div className="relative min-h-full bg-background">
      <FondoPatron />

      <div className="relative overflow-hidden rounded-b-[28px] bg-white px-5 pt-14 shadow-[0_3px_10px_rgba(0,0,0,0.06)]">
        <div className="absolute left-0 top-2.5">
          <TiraRombosCentrada width={180} height={50} />
        </div>
        <div className="relative pb-4 pt-2.5">
          <p className="text-right text-[22px] font-bold" style={{ color: NAVY }}>
            PreciosEC
          </p>
          <p className="mt-2 text-xl font-bold text-[#333333]">Mi Perfil</p>
        </div>
      </div>

      <div className="relative px-5 pb-8 pt-4">
        <div className="flex items-center gap-4 rounded-[20px] border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div
            className="flex size-[60px] shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: 'color-mix(in srgb, #1A237E 12%, transparent)' }}
          >
            <User className="size-8" style={{ color: NAVY }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold text-foreground">{username}</p>
            <p className="mt-1 truncate text-[13px] text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          {opciones.map((op) => (
            <OpcionTile key={op.titulo} opcion={op} onClick={() => setDialogo(op)} />
          ))}
        </div>

        <div className="my-5 border-t border-border" />

        <OpcionTile
          opcion={{
            icono: LogOut,
            titulo: 'Cerrar sesión',
            subtitulo: 'Salir de tu cuenta',
            color: '#B91C1C',
            contenido: '',
          }}
          esDestructivo
          onClick={() => setConfirmarSalir(true)}
        />
      </div>

      {dialogo && <InfoDialog opcion={dialogo} onClose={() => setDialogo(null)} />}

      {confirmarSalir && (
        <ConfirmDialog
          onCancelar={() => setConfirmarSalir(false)}
          onConfirmar={() => {
            setConfirmarSalir(false);
            logout();
          }}
        />
      )}
    </div>
  );
}

function OpcionTile({
  opcion,
  onClick,
  esDestructivo,
}: {
  opcion: Opcion;
  onClick: () => void;
  esDestructivo?: boolean;
}) {
  const Icono = opcion.icono;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-3.5 text-left shadow-[0_2px_6px_rgba(0,0,0,0.03)]"
    >
      <div
        className="flex size-[42px] shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `color-mix(in srgb, ${opcion.color} 12%, transparent)` }}
      >
        <Icono className="size-5" style={{ color: opcion.color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('font-semibold', esDestructivo ? 'text-destructive' : 'text-foreground')}>
          {opcion.titulo}
        </p>
        <p className="text-xs text-muted-foreground">{opcion.subtitulo}</p>
      </div>
      <ChevronRight className="size-5 shrink-0" style={{ color: opcion.color, opacity: 0.5 }} />
    </button>
  );
}

function DialogOverlay({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-[20px] border border-border bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function InfoDialog({ opcion, onClose }: { opcion: Opcion; onClose: () => void }) {
  const Icono = opcion.icono;
  return (
    <DialogOverlay onClose={onClose}>
      <div className="flex items-center gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: `color-mix(in srgb, ${opcion.color} 12%, transparent)` }}
        >
          <Icono className="size-5" style={{ color: opcion.color }} />
        </div>
        <p className="text-base font-bold text-foreground">{opcion.titulo}</p>
      </div>
      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
        {opcion.contenido}
      </p>
      <div className="mt-5 flex justify-end">
        <button type="button" onClick={onClose} className="px-2 py-1 text-sm font-semibold text-primary">
          Cerrar
        </button>
      </div>
    </DialogOverlay>
  );
}

function ConfirmDialog({ onCancelar, onConfirmar }: { onCancelar: () => void; onConfirmar: () => void }) {
  return (
    <DialogOverlay onClose={onCancelar}>
      <p className="text-base font-bold text-foreground">Cerrar sesión</p>
      <p className="mt-3 text-sm text-muted-foreground">¿Seguro que quieres salir de tu cuenta?</p>
      <div className="mt-5 flex justify-end gap-4">
        <button type="button" onClick={onCancelar} className="px-2 py-1 text-sm font-semibold text-primary">
          Cancelar
        </button>
        <button type="button" onClick={onConfirmar} className="px-2 py-1 text-sm font-semibold text-destructive">
          Cerrar sesión
        </button>
      </div>
    </DialogOverlay>
  );
}

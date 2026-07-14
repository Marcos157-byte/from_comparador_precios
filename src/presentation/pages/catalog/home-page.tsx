import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { useAuthStore } from '@/presentation/store/auth.store';
import { TipoComercio } from '@/domain/enums/tipo-comercio.enum';
import { tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { TiraRombosCentrada } from '@/presentation/components/tira-rombos-centrada';
import { FondoPatron } from '@/presentation/components/fondo-patron';

const NAVY = '#1A237E';
const ANUNCIO_VIDEO_URL = 'https://flutter.github.io/assets-for-api-docs/assets/videos/butterfly.mp4';

export function HomePage() {
  const username = useAuthStore((s) => s.user?.username) ?? '';

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
          <p className="mt-3 text-2xl font-bold" style={{ color: NAVY }}>
            ¡Hola, {username}! 👋
          </p>
          <p className="mt-1 text-sm text-[#666666]">Ahorra comparando antes de comprar</p>
        </div>
      </div>

      <div className="relative px-5 pb-5 pt-1">
        <AnuncioVideo />

        <h2 className="mt-6 text-[22px] font-bold text-foreground">¿Qué quieres comparar hoy?</h2>

        <div className="mt-3.5 grid grid-cols-3 gap-2.5">
          {Object.values(TipoComercio).map((tipo) => (
            <CategoriaTile key={tipo} tipo={tipo} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoriaTile({ tipo }: { tipo: TipoComercio }) {
  const navigate = useNavigate();
  const ui = tipoComercioUi[tipo];

  return (
    <button
      type="button"
      onClick={() => navigate(`/subcategoria/${ui.idCategoriaPadre}`, { state: { tipo } })}
      className="flex aspect-[0.85] flex-col items-center justify-center rounded-[20px] p-3 text-center"
      style={{
        background: `linear-gradient(135deg, ${ui.color}, color-mix(in srgb, ${ui.color} 75%, black))`,
        boxShadow: `0 6px 14px color-mix(in srgb, ${ui.color} 35%, transparent)`,
      }}
    >
      <span
        className="flex size-11 items-center justify-center rounded-2xl text-xl"
        style={{ backgroundColor: 'color-mix(in srgb, white 25%, transparent)' }}
      >
        {ui.emoji}
      </span>
      <span className="mt-2 text-xs font-bold text-white">{ui.label}</span>
    </button>
  );
}

function AnuncioVideo() {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  return (
    <div className="h-[180px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {state === 'error' ? (
        <div className="flex size-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
          <Megaphone className="size-6" />
          <p className="text-xs">Espacio para anuncio publicitario</p>
        </div>
      ) : (
        <div className="relative size-full">
          <video
            src={ANUNCIO_VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setState('ready')}
            onError={() => setState('error')}
            className="size-full object-cover"
          />
          {state === 'ready' && (
            <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white">
              Publicidad
            </span>
          )}
          {state === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

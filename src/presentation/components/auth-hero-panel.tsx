import { TiraRombosCentrada } from '@/presentation/components/tira-rombos-centrada';
import { TarjetaPrecioDestacado } from '@/presentation/components/tarjeta-precio-destacado';
import { NAVY, NAVY_DEEP } from '@/presentation/theme/brand.theme';

// Panel izquierdo de Login/Register en desktop — reutiliza la identidad visual del
// hero de landing-page.tsx (mismo degradado + tarjeta animada de precio real), con
// un mensaje corto adaptado al contexto de cada pantalla. Oculto en mobile (<lg):
// ahí el formulario ocupa toda la pantalla, como ya funcionaba antes.
export function AuthHeroPanel({ titulo, subtitulo }: { titulo: string; subtitulo: string }) {
  return (
    <div
      className="relative hidden w-1/2 shrink-0 flex-col justify-center overflow-hidden px-16 py-20 lg:flex"
      style={{ background: `linear-gradient(155deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}
    >
      <TiraRombosCentrada width={200} height={30} />

      <p className="mt-6 text-sm font-bold tracking-wide text-white/70">PreciosEC</p>

      <h1 className="mt-4 max-w-md font-['Space_Grotesk'] text-[38px] font-bold leading-[1.15] tracking-tight text-white">
        {titulo}
      </h1>

      <p className="mt-4 max-w-sm text-base text-white/70">{subtitulo}</p>

      <div className="mt-10 max-w-sm">
        <TarjetaPrecioDestacado />
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { ComercioLigero } from '@/domain/entities/comercio-ligero.entity';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { comercioBrandColor, comercioLogoEsBlanco } from '@/presentation/theme/comercio-brand.theme';
import { cn } from '@/presentation/utils/cn';

// Compartido entre landing-page.tsx y home-page.tsx. Presentación "solo logo": el logo
// por sí solo identifica al comercio, sin nombre al lado (fila de logos de clientes).
// Placa blanca por defecto; color de marca solo para Coral/Ferrisariato (logo blanco puro).
export function ComercioChip({ comercio }: { comercio: ComercioLigero }) {
  const [logoFallo, setLogoFallo] = useState(false);
  const tipo = tipoComercioFromValue(comercio.tipo);
  const ui = tipoComercioUi[tipo];
  const colorBase = comercioBrandColor(comercio.nombre, ui.color);
  const mostrarLogo = Boolean(comercio.logoUrl) && !logoFallo;
  const placaOscura = comercioLogoEsBlanco(comercio.nombre);

  return (
    <div
      className={cn(
        'flex size-20 shrink-0 items-center justify-center rounded-2xl p-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]',
        mostrarLogo && !placaOscura && 'border border-border bg-white',
      )}
      style={
        mostrarLogo
          ? placaOscura
            ? { backgroundColor: colorBase }
            : undefined
          : { backgroundColor: `color-mix(in srgb, ${colorBase} 10%, transparent)` }
      }
      title={comercio.nombre}
    >
      {mostrarLogo ? (
        <img
          src={comercio.logoUrl ?? undefined}
          alt={comercio.nombre}
          onError={() => setLogoFallo(true)}
          className="size-full object-contain"
        />
      ) : (
        <span className="text-3xl">{ui.emoji}</span>
      )}
    </div>
  );
}

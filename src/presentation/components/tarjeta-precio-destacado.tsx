import { useEffect, useState } from 'react';
import type { Precio } from '@/domain/entities/precio.entity';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { comercioBrandColor } from '@/presentation/theme/comercio-brand.theme';
import { NAVY, MINT, MINT_TEXTO } from '@/presentation/theme/brand.theme';
import { precioUseCases } from '@/infrastructure/factories/precio.factory';
import { cn } from '@/presentation/utils/cn';

// Producto real confirmado (con curl, antes de construir) con precios vigentes en 2
// comercios distintos — es el único caso hoy en el catálogo con más de un comercio.
const ID_PRODUCTO_DESTACADO = 224;
const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// Compartida entre landing-page.tsx y el panel de auth (login/register): hace su
// propia consulta al backend, así cada pantalla que la usa no duplica el fetch.
export function TarjetaPrecioDestacado() {
  const [precios, setPrecios] = useState<Precio[] | null>(null);

  useEffect(() => {
    precioUseCases.listarPorProducto
      .execute(ID_PRODUCTO_DESTACADO)
      .then(setPrecios)
      .catch(() => {});
  }, []);

  return (
    <>
      <style>{`
        @keyframes tarjeta-precio-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 217, 163, 0.45);
            border-color: color-mix(in srgb, ${MINT} 55%, transparent);
          }
          50% {
            box-shadow: 0 0 0 9px rgba(0, 217, 163, 0);
            border-color: ${MINT};
          }
        }
        .tarjeta-precio-pulse {
          animation: tarjeta-precio-pulse 2.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .tarjeta-precio-pulse { animation: none; border-color: ${MINT} !important; }
        }
      `}</style>

      {!precios || precios.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center rounded-3xl border border-white/10 bg-white/5">
          <span className="size-7 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
          <p className="line-clamp-2 text-[15px] font-bold text-foreground">
            {precios[0].productoDetalle?.nombre ?? 'Producto'}
          </p>
          {precios[0].productoDetalle?.marca && (
            <p className="text-xs text-muted-foreground">{precios[0].productoDetalle.marca}</p>
          )}

          <div className="mt-4 flex flex-col gap-2.5">
            {precios.map((precio) => {
              const esElMasBarato = precio.id === precios[0].id;
              const comercio = precio.comercioDetalle;
              const tipo = tipoComercioFromValue(comercio?.tipo ?? '');
              const ui = tipoComercioUi[tipo];
              const colorBase = comercio ? comercioBrandColor(comercio.nombre, ui.color) : ui.color;

              return (
                <div
                  key={precio.id}
                  className={cn(
                    'flex items-center justify-between rounded-2xl border p-3',
                    esElMasBarato && 'tarjeta-precio-pulse',
                  )}
                  style={{
                    borderColor: esElMasBarato ? undefined : 'var(--border)',
                    backgroundColor: esElMasBarato ? 'color-mix(in srgb, #00D9A3 10%, white)' : undefined,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{ui.emoji}</span>
                    <span className="text-sm font-semibold" style={{ color: colorBase }}>
                      {comercio?.nombre ?? 'Comercio'}
                    </span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: esElMasBarato ? MINT_TEXTO : NAVY }}>
                    {formatoPrecio.format(precio.precioEfectivo)}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-center text-[11px] font-semibold" style={{ color: MINT_TEXTO }}>
            ✓ Encontramos el más barato para vos
          </p>
        </div>
      )}
    </>
  );
}

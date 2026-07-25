import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import type { Precio } from '@/domain/entities/precio.entity';
import { NAVY, NAVY_DEEP, MINT } from '@/presentation/theme/brand.theme';
import { precioUseCases } from '@/infrastructure/factories/precio.factory';
import { cn } from '@/presentation/utils/cn';

// Producto real confirmado (con curl, antes de construir) con precios vigentes en 2
// comercios distintos — es el único caso hoy en el catálogo con más de un comercio.
const ID_PRODUCTO_DESTACADO = 224;
const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// Rombos decorativos en las esquinas — mismos colores que TiraRombosCentrada, en un
// cluster chico en vez de la franja horizontal completa (no entra en este formato).
const ROMBOS_ESQUINA = [
  { size: 22, color: '#FFB300' },
  { size: 16, color: '#1565C0' },
  { size: 13, color: '#B71C1C' },
];

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
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 217, 163, 0.5); }
          50% { box-shadow: 0 0 0 10px rgba(0, 217, 163, 0); }
        }
        .tarjeta-precio-pulse {
          animation: tarjeta-precio-pulse 2.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .tarjeta-precio-pulse { animation: none; }
        }
      `}</style>

      {!precios || precios.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center rounded-3xl border border-white/10 bg-white/5">
          <span className="size-7 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
        </div>
      ) : (
        <div
          className="relative overflow-hidden rounded-3xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.4)]"
          style={{ background: `linear-gradient(155deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}
        >
          <div className="absolute left-4 top-4 flex items-center gap-1.5" aria-hidden="true">
            {ROMBOS_ESQUINA.map((r, i) => (
              <span
                key={i}
                className="block shrink-0 rounded-[3px]"
                style={{
                  width: r.size,
                  height: r.size,
                  backgroundColor: r.color,
                  transform: `rotate(45deg) translateY(${i % 2 === 0 ? 0 : 6}px)`,
                }}
              />
            ))}
          </div>
          <div className="absolute right-4 top-4 flex items-center gap-1.5" aria-hidden="true">
            {[...ROMBOS_ESQUINA].reverse().map((r, i) => (
              <span
                key={i}
                className="block shrink-0 rounded-[3px]"
                style={{
                  width: r.size,
                  height: r.size,
                  backgroundColor: r.color,
                  transform: `rotate(45deg) translateY(${i % 2 === 0 ? 6 : 0}px)`,
                }}
              />
            ))}
          </div>

          <p className="relative mt-9 line-clamp-2 text-center text-[15px] font-bold text-white">
            {precios[0].productoDetalle?.nombre ?? 'Producto'}
          </p>
          {precios[0].productoDetalle?.marca && (
            <p className="relative text-center text-xs text-white/60">{precios[0].productoDetalle.marca}</p>
          )}

          <div className="relative mt-6 flex items-end justify-center gap-4">
            {precios.map((precio) => {
              const esElMasBarato = precio.id === precios[0].id;
              const comercio = precio.comercioDetalle;

              return (
                <div
                  key={precio.id}
                  className={cn(
                    'relative flex flex-col items-center gap-1.5 rounded-2xl px-5 py-5',
                    esElMasBarato && 'tarjeta-precio-pulse',
                  )}
                  style={{ backgroundColor: esElMasBarato ? MINT : 'rgba(255,255,255,0.1)' }}
                >
                  {esElMasBarato && (
                    <span
                      className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full"
                      style={{ backgroundColor: NAVY }}
                    >
                      <Check className="size-4" style={{ color: MINT }} />
                    </span>
                  )}
                  <span className="text-xs font-semibold" style={{ color: esElMasBarato ? NAVY_DEEP : 'rgba(255,255,255,0.75)' }}>
                    {comercio?.nombre ?? 'Comercio'}
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: esElMasBarato ? NAVY_DEEP : 'rgba(255,255,255,0.85)' }}
                  >
                    {formatoPrecio.format(precio.precioEfectivo)}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="relative mt-6 text-center text-sm font-bold text-white">Mismo producto, distintos precios</p>
          <p className="relative mt-1 text-center text-xs font-semibold" style={{ color: MINT }}>
            ✓ Encontramos el más barato para vos
          </p>
        </div>
      )}
    </>
  );
}

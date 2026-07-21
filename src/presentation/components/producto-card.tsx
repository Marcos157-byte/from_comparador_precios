import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Producto } from '@/domain/entities/producto.entity';

const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// Compartida entre Catalog, Subcategoria y Home (productos destacados) — misma tarjeta
// de producto en toda la app, con el mismo fallback defensivo de imagen rota.
export function ProductoCard({ producto, emojiFallback }: { producto: Producto; emojiFallback: string }) {
  const navigate = useNavigate();
  const [imagenFallo, setImagenFallo] = useState(false);
  const mostrarImagen = Boolean(producto.imagenUrl) && !imagenFallo;

  return (
    <button
      type="button"
      onClick={() => navigate(`/precios/${producto.id}`)}
      className="flex flex-col overflow-hidden rounded-[20px] border border-border bg-card text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="flex aspect-square items-center justify-center bg-muted">
        {mostrarImagen ? (
          <img
            src={producto.imagenUrl ?? undefined}
            alt={producto.nombre}
            onError={() => setImagenFallo(true)}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-4xl">{emojiFallback}</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <p className="line-clamp-2 text-[13px] font-semibold text-foreground">{producto.nombre}</p>
        {producto.marca && <p className="text-xs text-muted-foreground">{producto.marca}</p>}
        {producto.precioDesde !== null && (
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground">{formatoPrecio.format(producto.precioDesde)}</span>
            {producto.tieneOferta && (
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                style={{ backgroundColor: 'color-mix(in srgb, #F59E0B 15%, transparent)', color: '#B45309' }}
              >
                Oferta
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, Search, ShoppingBag, X } from 'lucide-react';
import type { Producto } from '@/domain/entities/producto.entity';
import { TipoComercio } from '@/domain/enums/tipo-comercio.enum';
import { buscarProductos } from '@/domain/services/buscar-productos.service';
import { useProductoStore } from '@/presentation/store/producto.store';
import { TiraRombosCentrada } from '@/presentation/components/tira-rombos-centrada';
import { FondoPatron } from '@/presentation/components/fondo-patron';

const NAVY = '#1A237E';
const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function ExplorarPage() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  const productosPorTipo = useProductoStore((s) => s.productosPorTipo);
  const cargarPorTipo = useProductoStore((s) => s.cargarPorTipo);

  useEffect(() => {
    Object.values(TipoComercio).forEach((tipo) => cargarPorTipo(tipo));
  }, [cargarPorTipo]);

  const todos: Producto[] = Object.values(TipoComercio).flatMap((tipo) => productosPorTipo[tipo] ?? []);
  const filtrados = busqueda.trim() === '' ? [] : buscarProductos(todos, busqueda);

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
          <p className="mt-2 text-xl font-bold text-[#333333]">Explorar</p>

          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <Search className="size-[18px] shrink-0 text-primary" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto o marca..."
              className="w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {busqueda !== '' && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="flex shrink-0 items-center justify-center text-muted-foreground"
              >
                <X className="size-[18px]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative px-5 pb-8 pt-4">
        {busqueda.trim() === '' ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Search className="size-16 text-muted-foreground" />
            <p className="text-muted-foreground">Escribe para buscar productos</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex justify-center py-20 text-center">
            <p className="text-muted-foreground">No se encontraron productos.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtrados.map((producto) => (
              <ResultadoTile key={producto.id} producto={producto} onClick={() => navigate(`/precios/${producto.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultadoTile({ producto, onClick }: { producto: Producto; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12">
        <ShoppingBag className="size-[22px] text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">{producto.nombre}</p>
        {producto.marca && <p className="truncate text-xs text-muted-foreground">{producto.marca}</p>}
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
      <ArrowRightLeft className="size-[18px] shrink-0 text-primary" />
    </button>
  );
}

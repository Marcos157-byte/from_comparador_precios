import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { ItemComparacion, TotalPorComercio } from '@/domain/entities/lista-comparacion.entity';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { comercioBrandColor } from '@/presentation/theme/comercio-brand.theme';
import { tieneDelivery, urlDelivery, urlMaps } from '@/domain/services/comercio-links.service';
import { useComparadorStore } from '@/presentation/store/comparador.store';
import { TiraRombosCentrada } from '@/presentation/components/tira-rombos-centrada';
import { FondoPatron } from '@/presentation/components/fondo-patron';

const NAVY = '#1A237E';
const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function MiListaPage() {
  const detalle = useComparadorStore((s) => s.detalle);
  const cargando = useComparadorStore((s) => s.cargando);
  const cargarListaActiva = useComparadorStore((s) => s.cargarListaActiva);
  const quitarItem = useComparadorStore((s) => s.quitarItem);

  useEffect(() => {
    cargarListaActiva();
  }, [cargarListaActiva]);

  const sinProductos = !detalle || detalle.items.length === 0;

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
          <p className="mt-2 text-xl font-bold text-[#333333]">Mis listas de compras</p>
        </div>
      </div>

      <div className="relative px-4 pb-8 pt-4">
        {cargando && !detalle ? (
          <div className="flex justify-center py-20">
            <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : sinProductos ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="whitespace-pre-line text-muted-foreground">
              {'Todavía no has elegido ningún producto.\nVe a un producto y toca "Elegir este".'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {detalle.totalesPorComercio.map((total) => (
              <ComercioGrupo
                key={total.idComercio}
                total={total}
                items={detalle.items.filter((item) => item.comercioDetalle.id === total.idComercio)}
                onQuitar={quitarItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ComercioGrupo({
  total,
  items,
  onQuitar,
}: {
  total: TotalPorComercio;
  items: ItemComparacion[];
  onQuitar: (idItem: number) => void;
}) {
  const tipo = tipoComercioFromValue(items[0]?.comercioDetalle.tipo ?? '');
  const ui = tipoComercioUi[tipo];
  const colorBase = comercioBrandColor(total.nombreComercio, ui.color);
  const mostrarDelivery = tieneDelivery(total.nombreComercio);
  const linkMaps = urlMaps(total.nombreComercio);
  const nombresProductos = items.map((i) => i.productoDetalle.nombre).join(' ');
  const linkDelivery = urlDelivery(total.nombreComercio, nombresProductos);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div
        className="flex items-center justify-between p-4"
        style={{ backgroundColor: `color-mix(in srgb, ${colorBase} 8%, transparent)` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{ui.emoji}</span>
          <span className="font-bold text-foreground">{total.nombreComercio}</span>
        </div>
        <span className="font-bold" style={{ color: colorBase }}>
          {formatoPrecio.format(total.total)}
        </span>
      </div>

      <div className="flex flex-col">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 border-t border-border px-4 py-2">
            <span className="flex-1 truncate text-[13px] text-foreground">{item.productoDetalle.nombre}</span>
            <span className="text-sm text-foreground">{formatoPrecio.format(item.precioMomento)}</span>
            <button
              type="button"
              onClick={() => onQuitar(item.id)}
              className="flex size-6 shrink-0 items-center justify-center text-muted-foreground"
              aria-label="Quitar"
            >
              <X className="size-[18px]" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-t border-border p-3">
        {mostrarDelivery && (
          <a
            href={linkDelivery ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-bold text-white"
            style={{ backgroundColor: colorBase }}
          >
            🛵 Delivery
          </a>
        )}
        {linkMaps ? (
          <a
            href={linkMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-[13px] font-bold"
            style={{ borderColor: colorBase, color: colorBase }}
          >
            🏬 Recoger en local
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border py-2.5 text-[13px] font-bold text-muted-foreground opacity-50"
          >
            🏬 Recoger en local
          </button>
        )}
      </div>
    </div>
  );
}

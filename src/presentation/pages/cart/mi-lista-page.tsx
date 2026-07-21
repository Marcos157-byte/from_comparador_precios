import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Scale, X } from 'lucide-react';
import type { ItemComparacion, TotalPorComercio } from '@/domain/entities/lista-comparacion.entity';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { comercioBrandColor, comercioLogoEsBlanco } from '@/presentation/theme/comercio-brand.theme';
import { tieneDelivery, urlDelivery, urlMaps } from '@/domain/services/comercio-links.service';
import { useComparadorStore } from '@/presentation/store/comparador.store';
import { TiraRombosCentrada } from '@/presentation/components/tira-rombos-centrada';
import { FondoPatron } from '@/presentation/components/fondo-patron';
import { cn } from '@/presentation/utils/cn';

const NAVY = '#1A237E';
const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function MiListaPage() {
  const navigate = useNavigate();

  const listas = useComparadorStore((s) => s.listas);
  const listaActivaId = useComparadorStore((s) => s.listaActivaId);
  const detalle = useComparadorStore((s) => s.detalle);
  const cargando = useComparadorStore((s) => s.cargando);
  const cargarListaActiva = useComparadorStore((s) => s.cargarListaActiva);
  const setListaActiva = useComparadorStore((s) => s.setListaActiva);
  const crearLista = useComparadorStore((s) => s.crearLista);
  const quitarItem = useComparadorStore((s) => s.quitarItem);

  const [mostrarNuevaLista, setMostrarNuevaLista] = useState(false);

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

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {listas.map((lista) => (
              <button
                key={lista.id}
                type="button"
                onClick={() => setListaActiva(lista.id)}
                className={cn(
                  'shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold',
                  lista.id === listaActivaId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {lista.nombre}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setMostrarNuevaLista(true)}
              className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-dashed border-border px-4 py-2 text-sm font-bold text-muted-foreground"
            >
              <Plus className="size-4" />
              Nueva lista
            </button>
          </div>

          {listas.length >= 2 && (
            <button
              type="button"
              onClick={() => navigate('/comparar-listas')}
              className="mt-3 flex items-center gap-1.5 text-sm font-bold text-primary"
            >
              <Scale className="size-4" />
              Comparar listas
            </button>
          )}
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

      {mostrarNuevaLista && (
        <NuevaListaDialog
          onCancelar={() => setMostrarNuevaLista(false)}
          onCrear={async (nombre) => {
            await crearLista(nombre);
            setMostrarNuevaLista(false);
          }}
        />
      )}
    </div>
  );
}

function NuevaListaDialog({
  onCancelar,
  onCrear,
}: {
  onCancelar: () => void;
  onCrear: (nombre: string) => Promise<void>;
}) {
  const [nombre, setNombre] = useState('');
  const [creando, setCreando] = useState(false);

  async function handleCrear() {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio || creando) return;
    setCreando(true);
    await onCrear(nombreLimpio);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onCancelar}>
      <div
        className="w-full max-w-sm rounded-[20px] border border-border bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base font-bold text-foreground">Nueva lista</p>
        <input
          autoFocus
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCrear()}
          placeholder="Ej. Lista de la oficina"
          className="mt-4 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        />
        <div className="mt-5 flex justify-end gap-4">
          <button type="button" onClick={onCancelar} className="px-2 py-1 text-sm font-semibold text-muted-foreground">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleCrear}
            disabled={!nombre.trim() || creando}
            className="px-2 py-1 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Crear
          </button>
        </div>
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
  const [logoFallo, setLogoFallo] = useState(false);
  const comercioDetalle = items[0]?.comercioDetalle;
  const tipo = tipoComercioFromValue(comercioDetalle?.tipo ?? '');
  const ui = tipoComercioUi[tipo];
  const colorBase = comercioBrandColor(total.nombreComercio, ui.color);
  const mostrarLogo = Boolean(comercioDetalle?.logoUrl) && !logoFallo;
  const placaOscura = comercioLogoEsBlanco(total.nombreComercio);
  const mostrarDelivery = tieneDelivery(total.nombreComercio);
  const linkMaps = urlMaps(total.nombreComercio);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div
        className="flex items-center justify-between p-4"
        style={{ backgroundColor: `color-mix(in srgb, ${colorBase} 8%, transparent)` }}
      >
        <div className="flex items-center gap-2.5">
          {mostrarLogo ? (
            <div
              className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', !placaOscura && 'border border-border bg-white')}
              style={placaOscura ? { backgroundColor: colorBase } : undefined}
            >
              <img
                src={comercioDetalle?.logoUrl ?? undefined}
                alt={total.nombreComercio}
                onError={() => setLogoFallo(true)}
                className="size-full rounded-xl object-contain p-1.5"
              />
            </div>
          ) : (
            <span className="text-xl">{ui.emoji}</span>
          )}
          <span className="font-bold text-foreground">{total.nombreComercio}</span>
        </div>
        <span className="font-bold" style={{ color: colorBase }}>
          {formatoPrecio.format(total.total)}
        </span>
      </div>

      <div className="flex flex-col">
        {items.map((item) => {
          const linkDeliveryItem = mostrarDelivery
            ? urlDelivery(total.nombreComercio, item.productoDetalle.nombre)
            : null;
          return (
            <div key={item.id} className="flex items-center gap-2 border-t border-border px-4 py-2">
              <span className="flex-1 truncate text-[13px] text-foreground">{item.productoDetalle.nombre}</span>
              <span className="text-sm text-foreground">{formatoPrecio.format(item.precioMomento)}</span>
              {linkDeliveryItem && (
                <a
                  href={linkDeliveryItem}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Pedir "${item.productoDetalle.nombre}" por delivery`}
                  title="Delivery de este producto"
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-xs"
                  style={{ backgroundColor: `color-mix(in srgb, ${colorBase} 15%, transparent)` }}
                >
                  🛵
                </a>
              )}
              <button
                type="button"
                onClick={() => onQuitar(item.id)}
                className="flex size-6 shrink-0 items-center justify-center text-muted-foreground"
                aria-label="Quitar"
              >
                <X className="size-[18px]" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 border-t border-border p-3">
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

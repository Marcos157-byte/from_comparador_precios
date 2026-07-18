import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import type { Precio } from '@/domain/entities/precio.entity';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { comercioBrandColor } from '@/presentation/theme/comercio-brand.theme';
import { usePrecioStore } from '@/presentation/store/precio.store';
import { useComparadorStore } from '@/presentation/store/comparador.store';
import { FondoPatron } from '@/presentation/components/fondo-patron';

const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function PreciosPage() {
  const { idProducto } = useParams<{ idProducto: string }>();
  const idProductoNum = Number(idProducto);
  const navigate = useNavigate();

  const preciosPorProducto = usePrecioStore((s) => s.preciosPorProducto);
  const cargando = usePrecioStore((s) => s.cargando);
  const errores = usePrecioStore((s) => s.error);
  const cargar = usePrecioStore((s) => s.cargar);

  const agregandoAComparador = useComparadorStore((s) => s.cargando);
  const agregarProducto = useComparadorStore((s) => s.agregarProducto);
  const [mensajeToast, setMensajeToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    cargar(idProductoNum);
  }, [cargar, idProductoNum]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  async function handleElegir(idProductoElegido: number, idComercio: number, nombreComercio: string) {
    await agregarProducto(idProductoElegido, idComercio);
    setMensajeToast(`Agregado a tu lista en ${nombreComercio}`);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setMensajeToast(null), 4000);
  }

  const precios = preciosPorProducto[idProductoNum];
  const estaCargando = cargando[idProductoNum] ?? false;
  const errorCarga = errores[idProductoNum] ?? null;

  const precioBarato = precios?.[0];
  const producto = precioBarato?.productoDetalle;
  const comercioBarato = precioBarato?.comercioDetalle;
  const tipoBarato = tipoComercioFromValue(comercioBarato?.tipo ?? '');
  const colorBarato = comercioBarato
    ? comercioBrandColor(comercioBarato.nombre, tipoComercioUi[tipoBarato].color)
    : tipoComercioUi[tipoBarato].color;
  const colorOscuro = `color-mix(in srgb, ${colorBarato} 70%, black)`;

  return (
    <div className="relative min-h-svh bg-background">
      <FondoPatron />

      <div className="relative">
        <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center text-foreground"
          >
            <ArrowLeft className="size-5" />
          </button>
          <span className="text-base font-bold text-foreground">Comparar precios</span>
        </div>

        {producto && (
          <div
            className="px-4 py-4 text-center"
            style={{ background: `linear-gradient(135deg, ${colorBarato}, ${colorOscuro})` }}
          >
            <p className="line-clamp-2 text-base font-bold text-white">{producto.nombre}</p>
            {producto.marca && <p className="mt-1 text-[13px] text-white/70">{producto.marca}</p>}
            <p className="mt-2 text-xs text-white/70">Compara el precio entre comercios</p>
          </div>
        )}

        <div className="px-4 pb-24 pt-4">
          {estaCargando && !precios ? (
            <div className="flex justify-center py-20">
              <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : errorCarga ? (
            <p className="text-center text-destructive">{errorCarga}</p>
          ) : !precios || precios.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <ShoppingCart className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                Todavía no hay precios registrados para este producto.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {precios.map((precio, index) => (
                <PrecioCard
                  key={precio.id}
                  precio={precio}
                  esMasBarato={index === 0 && precios.length > 1}
                  cargando={agregandoAComparador}
                  onElegir={handleElegir}
                />
              ))}
            </div>
          )}
        </div>

        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card px-4 py-3">
          <button
            type="button"
            onClick={() => navigate('/mi-lista')}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground"
          >
            <ShoppingCart className="size-4" />
            Ir a mis listas de compras
          </button>
        </div>

        {mensajeToast && (
          <div className="fixed inset-x-4 bottom-20 z-50 rounded-lg bg-[#323232] px-4 py-3 text-center text-sm text-white shadow-lg">
            {mensajeToast}
          </div>
        )}
      </div>
    </div>
  );
}

function PrecioCard({
  precio,
  esMasBarato,
  cargando,
  onElegir,
}: {
  precio: Precio;
  esMasBarato: boolean;
  cargando: boolean;
  onElegir: (idProducto: number, idComercio: number, nombreComercio: string) => void;
}) {
  const [logoFallo, setLogoFallo] = useState(false);
  const comercio = precio.comercioDetalle;
  const tipo = tipoComercioFromValue(comercio?.tipo ?? '');
  const ui = tipoComercioUi[tipo];
  const colorBase = comercio ? comercioBrandColor(comercio.nombre, ui.color) : ui.color;
  const mostrarLogo = Boolean(comercio?.logoUrl) && !logoFallo;

  return (
    <div
      className="rounded-[18px] border p-4"
      style={{
        backgroundColor: esMasBarato ? `color-mix(in srgb, ${colorBase} 10%, white)` : undefined,
        borderColor: esMasBarato ? `color-mix(in srgb, ${colorBase} 40%, transparent)` : undefined,
      }}
    >
      <div className="flex items-center gap-3.5">
        <div className="flex size-[52px] shrink-0 items-center justify-center rounded-2xl border border-border bg-card">
          {mostrarLogo ? (
            <img
              src={comercio?.logoUrl ?? undefined}
              alt={comercio?.nombre}
              onError={() => setLogoFallo(true)}
              className="size-full rounded-2xl object-contain"
            />
          ) : (
            <span className="text-xl">{ui.emoji}</span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{comercio?.nombre ?? 'Comercio'}</span>
            {esMasBarato && (
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                style={{ backgroundColor: 'color-mix(in srgb, #22C55E 15%, transparent)', color: '#16A34A' }}
              >
                MÁS BARATO
              </span>
            )}
          </div>
          {precio.enOferta && <span className="text-xs text-amber-600">En oferta</span>}
        </div>

        <span
          className="text-xl font-bold"
          style={{ color: esMasBarato ? colorBase : undefined }}
        >
          {formatoPrecio.format(precio.precioEfectivo)}
        </span>
      </div>

      <button
        type="button"
        disabled={cargando || !comercio}
        onClick={() => comercio && onElegir(precio.productoDetalle?.id ?? precio.idProducto, comercio.id, comercio.nombre)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
        style={{ borderColor: colorBase, color: colorBase }}
      >
        <ShoppingCart className="size-4" />
        Elegir este
      </button>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, ShoppingCart } from 'lucide-react';
import type { Precio } from '@/domain/entities/precio.entity';
import type { ListaComparacionResumen } from '@/domain/entities/lista-comparacion.entity';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { comercioBrandColor } from '@/presentation/theme/comercio-brand.theme';
import { usePrecioStore } from '@/presentation/store/precio.store';
import { useComparadorStore } from '@/presentation/store/comparador.store';
import { FondoPatron } from '@/presentation/components/fondo-patron';
import { cn } from '@/presentation/utils/cn';

const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function PreciosPage() {
  const { idProducto } = useParams<{ idProducto: string }>();
  const idProductoNum = Number(idProducto);
  const navigate = useNavigate();

  const preciosPorProducto = usePrecioStore((s) => s.preciosPorProducto);
  const cargando = usePrecioStore((s) => s.cargando);
  const errores = usePrecioStore((s) => s.error);
  const cargar = usePrecioStore((s) => s.cargar);

  const listas = useComparadorStore((s) => s.listas);
  const agregandoAComparador = useComparadorStore((s) => s.cargando);
  const cargarListas = useComparadorStore((s) => s.cargarListas);
  const agregarProducto = useComparadorStore((s) => s.agregarProducto);
  const agregarProductoAListaElegida = useComparadorStore((s) => s.agregarProductoAListaElegida);
  const crearLista = useComparadorStore((s) => s.crearLista);

  const [mensajeToast, setMensajeToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popupElegirLista, setPopupElegirLista] = useState<{
    idProducto: number;
    idComercio: number;
    nombreComercio: string;
  } | null>(null);

  useEffect(() => {
    cargar(idProductoNum);
  }, [cargar, idProductoNum]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  function mostrarToast(nombreComercio: string) {
    setMensajeToast(`Agregado a tu lista en ${nombreComercio}`);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setMensajeToast(null), 4000);
  }

  async function handleElegir(idProductoElegido: number, idComercio: number, nombreComercio: string) {
    const listasActuales = await cargarListas();
    if (listasActuales.length >= 2) {
      setPopupElegirLista({ idProducto: idProductoElegido, idComercio, nombreComercio });
      return;
    }
    await agregarProducto(idProductoElegido, idComercio);
    mostrarToast(nombreComercio);
  }

  async function handleElegirEnLista(idLista: number) {
    if (!popupElegirLista) return;
    await agregarProductoAListaElegida(popupElegirLista.idProducto, popupElegirLista.idComercio, idLista);
    mostrarToast(popupElegirLista.nombreComercio);
    setPopupElegirLista(null);
  }

  async function handleCrearYElegir(nombre: string) {
    if (!popupElegirLista) return;
    const idNueva = await crearLista(nombre);
    if (idNueva == null) return;
    await agregarProductoAListaElegida(popupElegirLista.idProducto, popupElegirLista.idComercio, idNueva);
    mostrarToast(popupElegirLista.nombreComercio);
    setPopupElegirLista(null);
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
    <div className="relative min-h-full bg-background">
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

        <div className="px-4 pb-36 pt-4">
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

        <div className="fixed inset-x-0 bottom-16 border-t border-border bg-card px-4 py-3">
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
          <div className="fixed inset-x-4 bottom-36 z-50 rounded-lg bg-[#323232] px-4 py-3 text-center text-sm text-white shadow-lg">
            {mensajeToast}
          </div>
        )}
      </div>

      {popupElegirLista && (
        <SeleccionarListaDialog
          listas={listas}
          onElegir={handleElegirEnLista}
          onCrearYElegir={handleCrearYElegir}
          onCancelar={() => setPopupElegirLista(null)}
        />
      )}
    </div>
  );
}

function SeleccionarListaDialog({
  listas,
  onElegir,
  onCrearYElegir,
  onCancelar,
}: {
  listas: ListaComparacionResumen[];
  onElegir: (idLista: number) => void;
  onCrearYElegir: (nombre: string) => void;
  onCancelar: () => void;
}) {
  const [creandoNueva, setCreandoNueva] = useState(false);
  const [nombreNueva, setNombreNueva] = useState('');

  function confirmarNueva() {
    const nombreLimpio = nombreNueva.trim();
    if (!nombreLimpio) return;
    onCrearYElegir(nombreLimpio);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onCancelar}>
      <div
        className="w-full max-w-sm rounded-[20px] border border-border bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base font-bold text-foreground">¿A qué lista lo agregamos?</p>

        <div className="mt-4 flex max-h-64 flex-col gap-2 overflow-y-auto">
          {listas.map((lista) => (
            <button
              key={lista.id}
              type="button"
              onClick={() => onElegir(lista.id)}
              className="rounded-xl border border-border px-4 py-3 text-left text-sm font-semibold text-foreground"
            >
              {lista.nombre}
            </button>
          ))}
        </div>

        {creandoNueva ? (
          <div className="mt-4 flex flex-col gap-2">
            <input
              autoFocus
              value={nombreNueva}
              onChange={(e) => setNombreNueva(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmarNueva()}
              placeholder="Ej. Lista de la oficina"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={confirmarNueva}
              disabled={!nombreNueva.trim()}
              className="rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Crear y agregar aquí
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCreandoNueva(true)}
            className="mt-3 flex items-center gap-1.5 text-sm font-bold text-primary"
          >
            <Plus className="size-4" />
            Nueva lista
          </button>
        )}

        <div className="mt-4 flex justify-end">
          <button type="button" onClick={onCancelar} className="px-2 py-1 text-sm font-semibold text-muted-foreground">
            Cancelar
          </button>
        </div>
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
        <div
          className={cn(
            'flex size-[52px] shrink-0 items-center justify-center rounded-2xl',
            !mostrarLogo && 'border border-border bg-card',
          )}
          style={mostrarLogo ? { backgroundColor: colorBase } : undefined}
        >
          {mostrarLogo ? (
            <img
              src={comercio?.logoUrl ?? undefined}
              alt={comercio?.nombre}
              onError={() => setLogoFallo(true)}
              className="size-full rounded-2xl object-contain p-1.5"
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

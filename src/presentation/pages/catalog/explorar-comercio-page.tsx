import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ComercioLigero } from '@/domain/entities/comercio-ligero.entity';
import type { Precio } from '@/domain/entities/precio.entity';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { comercioBrandColor } from '@/presentation/theme/comercio-brand.theme';
import { useComercioStore } from '@/presentation/store/comercio.store';
import { usePrecioStore } from '@/presentation/store/precio.store';
import { FondoPatron } from '@/presentation/components/fondo-patron';

const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function ExplorarComercioPage() {
  const { idComercio } = useParams<{ idComercio?: string }>();
  const idComercioNum = idComercio ? Number(idComercio) : null;
  const navigate = useNavigate();

  const comercios = useComercioStore((s) => s.comercios);
  const cargandoComercios = useComercioStore((s) => s.cargando);
  const errorComercios = useComercioStore((s) => s.error);
  const cargarComercios = useComercioStore((s) => s.cargar);

  const preciosPorComercio = usePrecioStore((s) => s.preciosPorComercio);
  const cargandoPorComercio = usePrecioStore((s) => s.cargandoPorComercio);
  const erroresPorComercio = usePrecioStore((s) => s.errorPorComercio);
  const cargarPorComercio = usePrecioStore((s) => s.cargarPorComercio);
  const siguientePorComercio = usePrecioStore((s) => s.siguientePorComercio);
  const cargandoMasPorComercio = usePrecioStore((s) => s.cargandoMasPorComercio);
  const cargarMasPorComercio = usePrecioStore((s) => s.cargarMasPorComercio);

  useEffect(() => {
    cargarComercios();
  }, [cargarComercios]);

  useEffect(() => {
    if (idComercioNum !== null) cargarPorComercio(idComercioNum);
  }, [cargarPorComercio, idComercioNum]);

  const hayMas = idComercioNum !== null && Boolean(siguientePorComercio[idComercioNum]);
  const cargandoMas = idComercioNum !== null ? (cargandoMasPorComercio[idComercioNum] ?? false) : false;
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hayMas || idComercioNum === null) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) cargarMasPorComercio(idComercioNum);
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cargarMasPorComercio, idComercioNum, hayMas]);

  if (idComercioNum === null) {
    return (
      <div className="relative min-h-full bg-background">
        <FondoPatron />

        <div className="relative">
          <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-3 lg:rounded-2xl lg:border lg:px-6 lg:py-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex size-10 items-center justify-center text-foreground"
            >
              <ArrowLeft className="size-5" />
            </button>
            <span className="text-base font-bold text-foreground lg:text-lg">Explorar por comercio</span>
          </div>

          <div className="px-5 pb-8 pt-5 lg:px-0 lg:pt-6">
            {cargandoComercios && comercios.length === 0 ? (
              <div className="flex justify-center py-20">
                <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : errorComercios ? (
              <p className="text-center text-destructive">{errorComercios}</p>
            ) : (
              <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-6 lg:gap-5">
                {comercios.map((comercio) => (
                  <ComercioTile
                    key={comercio.id}
                    comercio={comercio}
                    onClick={() => navigate(`/explorar-comercio/${comercio.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const comercioActual = comercios.find((c) => c.id === idComercioNum);
  const precios = preciosPorComercio[idComercioNum];
  const estaCargando = cargandoPorComercio[idComercioNum] ?? false;
  const errorCarga = erroresPorComercio[idComercioNum] ?? null;

  const tipo = tipoComercioFromValue(comercioActual?.tipo ?? '');
  const ui = tipoComercioUi[tipo];
  const colorBase = comercioActual ? comercioBrandColor(comercioActual.nombre, ui.color) : ui.color;
  const colorOscuro = `color-mix(in srgb, ${colorBase} 75%, black)`;

  return (
    <div className="relative min-h-full bg-background">
      <FondoPatron />

      <div className="relative">
        <div
          className="flex items-center gap-2 rounded-b-[28px] px-3 pb-6 pt-12 lg:rounded-2xl lg:px-6 lg:py-6"
          style={{ background: `linear-gradient(135deg, ${colorBase}, ${colorOscuro})` }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center text-white"
          >
            <ArrowLeft className="size-5" />
          </button>
          <span className="text-[22px]">{ui.emoji}</span>
          <span className="text-lg font-bold text-white">{comercioActual?.nombre ?? 'Comercio'}</span>
        </div>

        <div className="px-5 pb-5 pt-5 lg:px-0 lg:pt-6">
          {estaCargando && !precios ? (
            <div className="flex justify-center py-20">
              <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : errorCarga ? (
            <p className="text-center text-destructive">{errorCarga}</p>
          ) : !precios || precios.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <span className="text-5xl">{ui.emoji}</span>
              <p className="text-muted-foreground">Todavía no hay productos cargados para este comercio.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-5 lg:gap-5">
                {precios.map((precio) => (
                  <PrecioComercioCard key={precio.id} precio={precio} emojiFallback={ui.emoji} />
                ))}
              </div>
              {hayMas && (
                <div ref={sentinelRef} className="flex justify-center py-6">
                  {cargandoMas && (
                    <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ComercioTile({ comercio, onClick }: { comercio: ComercioLigero; onClick: () => void }) {
  const [logoFallo, setLogoFallo] = useState(false);
  const tipo = tipoComercioFromValue(comercio.tipo);
  const ui = tipoComercioUi[tipo];
  const colorBase = comercioBrandColor(comercio.nombre, ui.color);
  const mostrarLogo = Boolean(comercio.logoUrl) && !logoFallo;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex aspect-square flex-col items-center justify-center gap-2 rounded-[20px] p-3 text-center"
      style={{
        background: `linear-gradient(135deg, ${colorBase}, color-mix(in srgb, ${colorBase} 75%, black))`,
        boxShadow: `0 6px 14px color-mix(in srgb, ${colorBase} 35%, transparent)`,
      }}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20">
        {mostrarLogo ? (
          <img
            src={comercio.logoUrl ?? undefined}
            alt={comercio.nombre}
            onError={() => setLogoFallo(true)}
            className="size-full rounded-2xl object-contain p-1.5"
          />
        ) : (
          <span className="text-2xl">{ui.emoji}</span>
        )}
      </div>
      <span className="text-sm font-bold text-white">{comercio.nombre}</span>
    </button>
  );
}

function PrecioComercioCard({ precio, emojiFallback }: { precio: Precio; emojiFallback: string }) {
  const navigate = useNavigate();
  const [imagenFallo, setImagenFallo] = useState(false);
  const producto = precio.productoDetalle;
  const mostrarImagen = Boolean(producto?.imagenUrl) && !imagenFallo;

  return (
    <button
      type="button"
      onClick={() => navigate(`/precios/${precio.idProducto}`)}
      className="flex flex-col overflow-hidden rounded-[20px] border border-border bg-card text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="flex aspect-square items-center justify-center bg-muted">
        {mostrarImagen ? (
          <img
            src={producto?.imagenUrl ?? undefined}
            alt={producto?.nombre}
            onError={() => setImagenFallo(true)}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-4xl">{emojiFallback}</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <p className="line-clamp-2 text-[13px] font-semibold text-foreground">{producto?.nombre ?? 'Producto'}</p>
        {producto?.marca && <p className="text-xs text-muted-foreground">{producto.marca}</p>}
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-sm font-bold text-foreground">{formatoPrecio.format(precio.precioEfectivo)}</span>
          {precio.enOferta && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
              style={{ backgroundColor: 'color-mix(in srgb, #F59E0B 15%, transparent)', color: '#B45309' }}
            >
              Oferta
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

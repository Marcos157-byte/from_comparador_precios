import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import type { Producto } from '@/domain/entities/producto.entity';
import type { ComercioLigero } from '@/domain/entities/comercio-ligero.entity';
import { useAuthStore } from '@/presentation/store/auth.store';
import { TipoComercio } from '@/domain/enums/tipo-comercio.enum';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { NAVY as NAVY_BRAND, MINT, MINT_TEXTO } from '@/presentation/theme/brand.theme';
import { TiraRombosCentrada } from '@/presentation/components/tira-rombos-centrada';
import { FondoPatron } from '@/presentation/components/fondo-patron';
import { ProductoCard } from '@/presentation/components/producto-card';
import { ComercioChip } from '@/presentation/components/comercio-chip';
import { useRevealOnScroll } from '@/presentation/hooks/use-reveal-on-scroll';
import { productoUseCases } from '@/infrastructure/factories/producto.factory';
import { comercioUseCases } from '@/infrastructure/factories/comercio.factory';
import { precioUseCases } from '@/infrastructure/factories/precio.factory';
import { cn } from '@/presentation/utils/cn';

const NAVY = '#1A237E';

// Confirmados por consulta directa a la base de datos real (curl contra
// /kache/precios/?producto=<id>): cada uno tiene exactamente 2 comercios con
// precio vigente, y ninguno está entre los casos sospechosos de la auditoría de
// falsos positivos. La gran mayoría del catálogo hoy solo tiene 1 comercio, así
// que esta lista asegura que la comparación se vea funcionando de verdad en vez
// de depender de que la búsqueda encuentre uno de los pocos casos reales al azar.
const IDS_PRODUCTOS_DESTACADOS = [224, 179, 608, 748, 211];

const formatoNumero = new Intl.NumberFormat('es-EC');
const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// Propuesta de valor: 4 tarjetas ilustrativas con fondo sólido navy/mint alternado
// (misma placa/tamaño para las 4, aunque el arte interno venga de fuentes distintas
// entre sí — por eso cada imagen además va sobre su propia placa BLANCA interna:
// son imágenes con fondo opaco propio, no recortes con transparencia, así que sin
// esa placa se vería un rectángulo de fondo dispar flotando dentro del círculo de
// color de cada una).
interface TilePropuestaValor {
  key: string;
  src: string;
  alt: string;
  label: string;
  fondo: 'navy' | 'mint';
}

const TILES_PROPUESTA_VALOR: TilePropuestaValor[] = [
  {
    key: 'etiqueta',
    src: '/assets/etiqueta-codigo-barras.png',
    alt: 'Etiqueta de precio con código de barras',
    label: 'Cada producto, identificado',
    fondo: 'navy',
  },
  {
    key: 'manos',
    src: '/assets/manos-comparando-precios.png',
    alt: 'Manos comparando dos etiquetas de precio',
    label: 'Comparás en segundos',
    fondo: 'mint',
  },
  {
    key: 'balanza',
    src: '/assets/balanza-precios.png',
    alt: 'Balanza comparando dos precios',
    label: 'Elegís el más barato',
    fondo: 'navy',
  },
  {
    key: 'dolar-euro',
    src: '/assets/simbolo-dolar-euro.png',
    alt: 'Símbolos de moneda',
    label: 'Ahorrás en cada compra',
    fondo: 'mint',
  },
];

interface ProductoDestacado {
  producto: Producto;
  emoji: string;
  ahorro: number;
}

export function HomePage() {
  const username = useAuthStore((s) => s.user?.username) ?? '';
  const [totalProductos, setTotalProductos] = useState<number | null>(null);
  const [comercios, setComercios] = useState<ComercioLigero[] | null>(null);
  const [conteoPorTipo, setConteoPorTipo] = useState<Partial<Record<TipoComercio, number>>>({});
  const [productosDestacados, setProductosDestacados] = useState<ProductoDestacado[] | null>(null);

  useEffect(() => {
    productoUseCases.listar
      .execute({ page: 1 })
      .then((r) => setTotalProductos(r.count))
      .catch(() => {});

    comercioUseCases.listar
      .execute()
      .then((r) => setComercios(r))
      .catch(() => {});

    // Un pedido por tipo (3 en total, no un N+1): cada uno solo lee el `count` de la
    // respuesta paginada, sin traer el catálogo completo. Confirmado con curl que
    // /kache/productos/?tipo=<tipo> ya filtra del lado del backend.
    Object.values(TipoComercio).forEach((tipo) => {
      productoUseCases.listar
        .execute({ tipo, page: 1 })
        .then((r) => setConteoPorTipo((prev) => ({ ...prev, [tipo]: r.count })))
        .catch(() => {});
    });

    // El ahorro se calcula con los mismos precios que ya hace falta traer para
    // mostrar cada tarjeta destacada — no es una consulta adicional por producto.
    Promise.all(
      IDS_PRODUCTOS_DESTACADOS.map((id) =>
        precioUseCases.listarPorProducto.execute(id).then((precios) => {
          const producto = precios[0]?.productoDetalle;
          if (!producto || precios.length === 0) return null;
          const tipo = tipoComercioFromValue(precios[0].comercioDetalle?.tipo ?? '');
          const efectivos = precios.map((p) => p.precioEfectivo);
          const ahorro = Math.max(...efectivos) - Math.min(...efectivos);
          return { producto, emoji: tipoComercioUi[tipo].emoji, ahorro };
        }),
      ),
    )
      .then((resultados) => {
        const validos = resultados.filter((r): r is ProductoDestacado => r !== null);
        setProductosDestacados(validos);
      })
      .catch(() => {});
  }, []);

  const categoriasReveal = useRevealOnScroll<HTMLDivElement>();
  const propuestaReveal = useRevealOnScroll<HTMLDivElement>();
  const comerciosReveal = useRevealOnScroll<HTMLDivElement>();
  const destacadosReveal = useRevealOnScroll<HTMLDivElement>();

  return (
    <div className="relative min-h-full bg-background">
      <FondoPatron />

      {/* Header interno — solo mobile. Tarjeta con degradado suave (mint muy tenue
          sobre el fondo crema) + stats reales del backend. En desktop la navbar
          superior ya muestra el wordmark "PreciosEC", así que repetirlo acá sería
          duplicado (por eso el bloque de abajo es la versión desktop, sin wordmark). */}
      <div
        className="relative overflow-hidden rounded-b-[28px] px-5 pt-14 shadow-[0_3px_10px_rgba(0,0,0,0.06)] lg:hidden"
        style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${MINT} 12%, white) 0%, white 60%)` }}
      >
        <div className="absolute left-0 top-2.5">
          <TiraRombosCentrada width={180} height={50} />
        </div>
        <div className="relative pb-5 pt-2.5">
          <p className="text-right text-[22px] font-bold" style={{ color: NAVY }}>
            PreciosEC
          </p>
          <p className="mt-3 text-2xl font-bold" style={{ color: NAVY }}>
            ¡Hola, {username}! 👋
          </p>
          <p className="mt-1 text-sm text-[#666666]">Ahorra comparando antes de comprar</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <StatChip valor={totalProductos !== null ? formatoNumero.format(totalProductos) : '—'} etiqueta="productos" />
            <span className="text-border">•</span>
            <StatChip valor={comercios !== null ? String(comercios.length) : '—'} etiqueta="comercios" />
          </div>
        </div>
      </div>

      {/* Saludo — solo desktop. Misma identidad de tarjeta con degradado + stats. */}
      <div
        className="relative hidden overflow-hidden rounded-2xl border border-border px-8 py-8 lg:block"
        style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${MINT} 9%, white) 0%, white 65%)` }}
      >
        <h1 className="text-2xl font-bold text-foreground">¡Hola, {username}! 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ahorra comparando antes de comprar</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <StatChip valor={totalProductos !== null ? formatoNumero.format(totalProductos) : '—'} etiqueta="productos" />
          <span className="text-border">•</span>
          <StatChip valor={comercios !== null ? String(comercios.length) : '—'} etiqueta="comercios" />
        </div>
      </div>

      <div className="relative px-5 pb-5 pt-4 lg:px-0 lg:pb-10 lg:pt-6">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10">
          <div className="lg:order-2">
            <HeroComparacion />
          </div>

          <div
            ref={categoriasReveal.ref}
            className={cn('scroll-reveal lg:order-1', categoriasReveal.visible && 'scroll-reveal-visible')}
          >
            <h2 className="mt-6 text-[22px] font-bold text-foreground lg:mt-0 lg:text-xl">
              ¿Qué quieres comparar hoy?
            </h2>

            <div className="mt-3.5 grid grid-cols-3 gap-2.5 lg:mt-4 lg:max-w-xl lg:gap-3">
              {Object.values(TipoComercio).map((tipo) => (
                <CategoriaTile key={tipo} tipo={tipo} conteo={conteoPorTipo[tipo] ?? null} />
              ))}
            </div>
          </div>
        </div>

        <div
          ref={propuestaReveal.ref}
          className={cn('scroll-reveal mt-8 lg:mt-10', propuestaReveal.visible && 'scroll-reveal-visible')}
        >
          <h2 className="text-[22px] font-bold text-foreground lg:text-xl">¿Por qué comparar con PreciosEC?</h2>
          <div className="mt-3.5 grid grid-cols-2 gap-4 lg:max-w-2xl lg:grid-cols-4 lg:gap-6">
            {TILES_PROPUESTA_VALOR.map((tile) => (
              <TilePropuestaValorCard key={tile.key} tile={tile} />
            ))}
          </div>
        </div>

        {/* El div con el ref debe montarse siempre (no solo cuando `comercios` ya
            llegó): el hook arma su IntersectionObserver una sola vez al montar, así
            que si el contenido tarda en llegar y el div todavía no existe en ese
            momento, el observer nunca se vuelve a intentar y la sección queda con
            opacity:0 para siempre. Por eso el contenido condicional va ADENTRO. */}
        <div
          ref={comerciosReveal.ref}
          className={cn('scroll-reveal mt-8 lg:mt-10', comerciosReveal.visible && 'scroll-reveal-visible')}
        >
          {comercios && comercios.length > 0 && (
            <>
              <h2 className="text-[22px] font-bold text-foreground lg:text-xl">Comparamos entre estos comercios</h2>
              <div className="mt-3.5 flex flex-wrap gap-3">
                {comercios.map((comercio) => (
                  <ComercioChip key={comercio.id} comercio={comercio} />
                ))}
              </div>
            </>
          )}
        </div>

        <div
          ref={destacadosReveal.ref}
          className={cn('scroll-reveal mt-8 lg:mt-10', destacadosReveal.visible && 'scroll-reveal-visible')}
        >
          {productosDestacados && productosDestacados.length > 0 && (
            <>
              <h2 className="text-[22px] font-bold text-foreground lg:text-xl">Compará estos productos ahora</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Productos con precios de más de un comercio, listos para comparar.
              </p>

              <div className="mt-3.5 grid grid-cols-2 gap-3.5 lg:grid-cols-5 lg:gap-4">
                {productosDestacados.map(({ producto, emoji, ahorro }) => (
                  <div key={producto.id} className="relative">
                    <ProductoCard producto={producto} emojiFallback={emoji} />
                    {ahorro > 0 && (
                      <span
                        className="absolute -right-2 -top-2 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md"
                        style={{ backgroundColor: MINT_TEXTO }}
                      >
                        Ahorrás {formatoPrecio.format(ahorro)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatChip({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <span className="text-xs text-muted-foreground lg:text-sm">
      <span className="text-base font-bold lg:text-lg" style={{ color: MINT_TEXTO }}>
        {valor}
      </span>{' '}
      {etiqueta}
    </span>
  );
}

function CategoriaTile({ tipo, conteo }: { tipo: TipoComercio; conteo: number | null }) {
  const navigate = useNavigate();
  const ui = tipoComercioUi[tipo];

  return (
    <button
      type="button"
      onClick={() => navigate(`/subcategoria/${ui.idCategoriaPadre}`, { state: { tipo } })}
      className="flex aspect-[0.85] flex-col items-center justify-center rounded-[20px] p-3 text-center lg:aspect-auto lg:h-24 lg:flex-row lg:justify-start lg:gap-3 lg:rounded-2xl lg:p-4 lg:text-left"
      style={{
        background: `linear-gradient(135deg, ${ui.color}, color-mix(in srgb, ${ui.color} 75%, black))`,
        boxShadow: `0 6px 14px color-mix(in srgb, ${ui.color} 35%, transparent)`,
      }}
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-xl"
        style={{ backgroundColor: 'color-mix(in srgb, white 25%, transparent)' }}
      >
        {ui.emoji}
      </span>
      <div className="mt-2 flex flex-col items-center lg:mt-0 lg:items-start">
        <span className="text-xs font-bold text-white lg:text-sm">{ui.label}</span>
        <span className="text-[10px] text-white/75 lg:text-xs">
          {conteo !== null ? `${formatoNumero.format(conteo)} productos` : '—'}
        </span>
      </div>
    </button>
  );
}

function TilePropuestaValorCard({ tile }: { tile: TilePropuestaValor }) {
  const color = tile.fondo === 'navy' ? NAVY_BRAND : MINT;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex aspect-square w-full items-center justify-center rounded-3xl p-2.5 shadow-[0_6px_16px_rgba(0,0,0,0.12)] lg:p-3.5"
        style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 75%, black))` }}
      >
        <div className="flex size-full items-center justify-center rounded-2xl bg-white p-3">
          <ImagenConFallback src={tile.src} alt={tile.alt} />
        </div>
      </div>
      <span className="text-center text-[11px] font-semibold leading-tight text-foreground lg:text-sm">
        {tile.label}
      </span>
    </div>
  );
}

function ImagenConFallback({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return <ImageOff className="size-8 text-muted-foreground" />;
  }

  return <img src={src} alt={alt} onError={() => setError(true)} className="size-full object-contain" />;
}

function HeroComparacion() {
  const [error, setError] = useState(false);

  return (
    <div className="h-[180px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.04)] lg:aspect-video lg:h-auto">
      {error ? (
        <div className="flex size-full flex-col items-center justify-center gap-1.5 px-4 text-center text-muted-foreground">
          <ImageOff className="size-6" />
          <p className="text-xs">Agrega hero-comparacion.png en public/assets</p>
        </div>
      ) : (
        <img
          src="/assets/hero-comparacion.png"
          alt="Comparación de precios entre comercios"
          onError={() => setError(true)}
          className="size-full object-cover"
        />
      )}
    </div>
  );
}

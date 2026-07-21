import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, Scale, Search } from 'lucide-react';
import type { ComercioLigero } from '@/domain/entities/comercio-ligero.entity';
import type { Precio } from '@/domain/entities/precio.entity';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { comercioBrandColor } from '@/presentation/theme/comercio-brand.theme';
import { TiraRombosCentrada } from '@/presentation/components/tira-rombos-centrada';
import { productoUseCases } from '@/infrastructure/factories/producto.factory';
import { comercioUseCases } from '@/infrastructure/factories/comercio.factory';
import { precioUseCases } from '@/infrastructure/factories/precio.factory';
import { cn } from '@/presentation/utils/cn';

const NAVY = '#12185C';
const NAVY_DEEP = '#050726';
const MINT = '#00D9A3';
const MINT_TEXTO = '#00A37A'; // variante más oscura del mint para texto legible sobre fondos claros

// Producto real confirmado (con curl, antes de construir) con precios vigentes en 2
// comercios distintos — es el único caso hoy en el catálogo con más de un comercio.
const ID_PRODUCTO_DESTACADO = 224;

const pasos = [
  { icon: Search, texto: 'Elegí una categoría de Supermercados, Farmacias o Ferreterías.' },
  { icon: Scale, texto: 'Comparás el precio del mismo producto entre distintos comercios.' },
  { icon: PiggyBank, texto: 'Elegís el más barato y armás tu lista de compras. Así de simple.' },
];

const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export function LandingPage() {
  const navigate = useNavigate();
  const [totalProductos, setTotalProductos] = useState<number | null>(null);
  const [comercios, setComercios] = useState<ComercioLigero[] | null>(null);
  const [preciosDestacados, setPreciosDestacados] = useState<Precio[] | null>(null);

  useEffect(() => {
    productoUseCases.listar
      .execute({ page: 1 })
      .then((r) => setTotalProductos(r.count))
      .catch(() => {});
    comercioUseCases.listar
      .execute()
      .then((r) => setComercios(r))
      .catch(() => {});
    precioUseCases.listarPorProducto
      .execute(ID_PRODUCTO_DESTACADO)
      .then((r) => setPreciosDestacados(r))
      .catch(() => {});
  }, []);

  const formatoNumero = new Intl.NumberFormat('es-EC');

  const statsReveal = useRevealOnScroll<HTMLDivElement>();
  const pasosReveal = useRevealOnScroll<HTMLDivElement>();
  const comerciosReveal = useRevealOnScroll<HTMLDivElement>();
  const ctaReveal = useRevealOnScroll<HTMLDivElement>();

  return (
    <div className="relative min-h-full overflow-x-hidden bg-background">
      <style>{`
        @keyframes landing-price-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 217, 163, 0.45);
            border-color: color-mix(in srgb, ${MINT} 55%, transparent);
          }
          50% {
            box-shadow: 0 0 0 9px rgba(0, 217, 163, 0);
            border-color: ${MINT};
          }
        }
        .landing-price-pulse {
          animation: landing-price-pulse 2.4s ease-in-out infinite;
        }
        .landing-reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .landing-reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-price-pulse { animation: none; border-color: ${MINT} !important; }
          .landing-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

      {/* a) HERO */}
      <div
        className="relative overflow-hidden px-6 pb-14 pt-14 lg:px-16 lg:pb-20 lg:pt-20"
        style={{ background: `linear-gradient(155deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="w-full max-w-md text-center lg:text-left">
            <TiraRombosCentrada width={200} height={30} className="mx-auto lg:mx-0" />

            <p className="mt-4 text-sm font-bold tracking-wide text-white/70">PreciosEC</p>

            <h1 className="mt-4 font-['Space_Grotesk'] text-[34px] font-bold leading-[1.12] tracking-tight text-white lg:text-[52px]">
              Comparás precios antes de comprar.{' '}
              <span style={{ color: MINT }}>Ahorrás</span> en cada compra.
            </h1>

            <p className="mx-auto mt-5 max-w-xs text-sm text-white/70 lg:mx-0 lg:max-w-sm lg:text-base">
              PreciosEC compara precios reales entre los principales supermercados, farmacias y
              ferreterías de Ecuador, para que sepas dónde comprar sin recorrer cada tienda.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="flex h-[52px] items-center justify-center rounded-xl bg-primary px-6 text-[15px] font-bold text-primary-foreground shadow-[0_10px_30px_rgba(201,149,46,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(201,149,46,0.45)]"
              >
                Crear cuenta gratis
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex h-[52px] items-center justify-center rounded-xl border border-white/25 px-6 text-[15px] font-bold text-white transition hover:bg-white/10"
              >
                Iniciar sesión
              </button>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <TarjetaPrecioDestacado precios={preciosDestacados} />
          </div>
        </div>
      </div>

      {/* b) STATS — franja angosta de chips inline */}
      <div
        ref={statsReveal.ref}
        className={cn(
          'landing-reveal border-b border-border/70 bg-card/40 px-5 py-5 lg:px-16',
          statsReveal.visible && 'landing-reveal-visible',
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:justify-start">
          <StatInline valor={totalProductos !== null ? formatoNumero.format(totalProductos) : '—'} etiqueta="productos" />
          <span className="text-border">•</span>
          <StatInline valor={comercios !== null ? String(comercios.length) : '—'} etiqueta="comercios" />
          <span className="text-border">•</span>
          <StatInline valor="3" etiqueta="tipos de comercio" />
        </div>
      </div>

      {/* c) CÓMO FUNCIONA */}
      <div
        ref={pasosReveal.ref}
        className={cn('landing-reveal px-5 pt-10 lg:px-16', pasosReveal.visible && 'landing-reveal-visible')}
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-foreground lg:text-2xl">¿Cómo funciona?</h2>

          <div className="mt-6 flex flex-col gap-7 lg:max-w-2xl">
            {pasos.map((paso, index) => (
              <div key={index} className="relative flex gap-4">
                {index < pasos.length - 1 && (
                  <div className="absolute left-5 top-11 h-[calc(100%+0.4rem)] w-px bg-border" aria-hidden="true" />
                )}
                <div
                  className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full font-['Space_Grotesk'] text-sm font-bold text-white"
                  style={{ backgroundColor: NAVY }}
                >
                  {index + 1}
                </div>
                <div className="flex items-center gap-2 pt-1.5">
                  <paso.icon className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
                  <p className="text-sm text-foreground">{paso.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* d) COMERCIOS — entrada en cascada (los 6 entran en una sola fila, sin scroll) */}
      <div ref={comerciosReveal.ref} className="pt-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-16">
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-foreground lg:text-2xl">
            Comparamos entre estos comercios
          </h2>

          {comercios && comercios.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {comercios.map((comercio, index) => (
                <div
                  key={comercio.id}
                  className={cn('landing-reveal', comerciosReveal.visible && 'landing-reveal-visible')}
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <ComercioChip comercio={comercio} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* e) CTA FINAL */}
      <div
        ref={ctaReveal.ref}
        className={cn(
          'landing-reveal mt-10 px-5 pb-6 pt-8 text-center lg:px-16',
          ctaReveal.visible && 'landing-reveal-visible',
        )}
        style={{ backgroundColor: 'color-mix(in srgb, #12185C 6%, transparent)' }}
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="font-['Space_Grotesk'] text-xl font-bold text-foreground lg:text-2xl">
            ¿Lista para empezar a ahorrar?
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">Crear tu cuenta toma menos de un minuto.</p>
          <div className="mx-auto mt-5 flex max-w-xs flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="flex h-[52px] items-center justify-center rounded-xl bg-primary px-6 text-[15px] font-bold text-primary-foreground transition hover:-translate-y-0.5"
            >
              Crear cuenta gratis
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex h-[52px] items-center justify-center rounded-xl border border-border px-6 text-[15px] font-bold text-foreground transition hover:bg-card"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>

      {/* f) FOOTER */}
      <div className="px-5 py-6 text-center">
        <p className="text-xs text-muted-foreground">PreciosEC · {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}

function StatInline({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <span className="text-sm text-muted-foreground">
      <span className="font-['Space_Grotesk'] text-lg font-bold" style={{ color: MINT_TEXTO }}>
        {valor}
      </span>{' '}
      {etiqueta}
    </span>
  );
}

function ComercioChip({ comercio }: { comercio: ComercioLigero }) {
  const [logoFallo, setLogoFallo] = useState(false);
  const tipo = tipoComercioFromValue(comercio.tipo);
  const ui = tipoComercioUi[tipo];
  const colorBase = comercioBrandColor(comercio.nombre, ui.color);
  const mostrarLogo = Boolean(comercio.logoUrl) && !logoFallo;

  return (
    <div
      className="flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3"
      style={{
        backgroundColor: `color-mix(in srgb, ${colorBase} 8%, transparent)`,
        borderColor: `color-mix(in srgb, ${colorBase} 25%, transparent)`,
      }}
    >
      {mostrarLogo ? (
        <div
          className="flex size-7 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: colorBase }}
        >
          <img
            src={comercio.logoUrl ?? undefined}
            alt={comercio.nombre}
            onError={() => setLogoFallo(true)}
            className="size-full rounded-lg object-contain p-1"
          />
        </div>
      ) : (
        <span className="text-lg">{ui.emoji}</span>
      )}
      <span className="whitespace-nowrap text-sm font-bold" style={{ color: colorBase }}>
        {comercio.nombre}
      </span>
    </div>
  );
}

function TarjetaPrecioDestacado({ precios }: { precios: Precio[] | null }) {
  if (!precios || precios.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-3xl border border-white/10 bg-white/5">
        <span className="size-7 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
      </div>
    );
  }

  const producto = precios[0].productoDetalle;
  const idMasBarato = precios[0].id;

  return (
    <div className="rounded-3xl border border-white/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
      <p className="line-clamp-2 text-[15px] font-bold text-foreground">{producto?.nombre ?? 'Producto'}</p>
      {producto?.marca && <p className="text-xs text-muted-foreground">{producto.marca}</p>}

      <div className="mt-4 flex flex-col gap-2.5">
        {precios.map((precio) => {
          const esElMasBarato = precio.id === idMasBarato;
          const comercio = precio.comercioDetalle;
          const tipo = tipoComercioFromValue(comercio?.tipo ?? '');
          const ui = tipoComercioUi[tipo];
          const colorBase = comercio ? comercioBrandColor(comercio.nombre, ui.color) : ui.color;

          return (
            <div
              key={precio.id}
              className={cn('flex items-center justify-between rounded-2xl border p-3', esElMasBarato && 'landing-price-pulse')}
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
  );
}

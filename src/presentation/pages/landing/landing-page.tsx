import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, Scale, Search } from 'lucide-react';
import type { ComercioLigero } from '@/domain/entities/comercio-ligero.entity';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { comercioBrandColor, comercioLogoEsBlanco } from '@/presentation/theme/comercio-brand.theme';
import { NAVY, NAVY_DEEP, MINT, MINT_TEXTO } from '@/presentation/theme/brand.theme';
import { TiraRombosCentrada } from '@/presentation/components/tira-rombos-centrada';
import { TarjetaPrecioDestacado } from '@/presentation/components/tarjeta-precio-destacado';
import { productoUseCases } from '@/infrastructure/factories/producto.factory';
import { comercioUseCases } from '@/infrastructure/factories/comercio.factory';
import { cn } from '@/presentation/utils/cn';

const pasos = [
  { icon: Search, texto: 'Elegí una categoría de Supermercados, Farmacias o Ferreterías.' },
  { icon: Scale, texto: 'Comparás el precio del mismo producto entre distintos comercios.' },
  { icon: PiggyBank, texto: 'Elegís el más barato y armás tu lista de compras. Así de simple.' },
];

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

  useEffect(() => {
    productoUseCases.listar
      .execute({ page: 1 })
      .then((r) => setTotalProductos(r.count))
      .catch(() => {});
    comercioUseCases.listar
      .execute()
      .then((r) => setComercios(r))
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
            <TarjetaPrecioDestacado />
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
  const placaOscura = comercioLogoEsBlanco(comercio.nombre);

  // Presentación "solo logo": el logo por sí solo identifica al comercio, sin
  // nombre al lado (fila de logos de clientes). Placa blanca por defecto;
  // color de marca solo para Coral/Ferrisariato (logo blanco puro).
  return (
    <div
      className={cn(
        'flex size-20 shrink-0 items-center justify-center rounded-2xl p-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]',
        mostrarLogo && !placaOscura && 'border border-border bg-white',
      )}
      style={
        mostrarLogo
          ? placaOscura
            ? { backgroundColor: colorBase }
            : undefined
          : { backgroundColor: `color-mix(in srgb, ${colorBase} 10%, transparent)` }
      }
      title={comercio.nombre}
    >
      {mostrarLogo ? (
        <img
          src={comercio.logoUrl ?? undefined}
          alt={comercio.nombre}
          onError={() => setLogoFallo(true)}
          className="size-full object-contain"
        />
      ) : (
        <span className="text-3xl">{ui.emoji}</span>
      )}
    </div>
  );
}

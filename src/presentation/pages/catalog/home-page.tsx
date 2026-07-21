import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import type { Producto } from '@/domain/entities/producto.entity';
import { useAuthStore } from '@/presentation/store/auth.store';
import { TipoComercio } from '@/domain/enums/tipo-comercio.enum';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { TiraRombosCentrada } from '@/presentation/components/tira-rombos-centrada';
import { FondoPatron } from '@/presentation/components/fondo-patron';
import { ProductoCard } from '@/presentation/components/producto-card';
import { precioUseCases } from '@/infrastructure/factories/precio.factory';

const NAVY = '#1A237E';
const ANUNCIO_VIDEO_URL = 'https://flutter.github.io/assets-for-api-docs/assets/videos/butterfly.mp4';

// Confirmados por consulta directa a la base de datos real (curl contra
// /kache/precios/?producto=<id>): cada uno tiene exactamente 2 comercios con
// precio vigente, y ninguno está entre los casos sospechosos de la auditoría de
// falsos positivos. La gran mayoría del catálogo hoy solo tiene 1 comercio, así
// que esta lista asegura que la comparación se vea funcionando de verdad en vez
// de depender de que la búsqueda encuentre uno de los pocos casos reales al azar.
const IDS_PRODUCTOS_DESTACADOS = [224, 179, 608, 748, 211];

interface ProductoDestacado {
  producto: Producto;
  emoji: string;
}

export function HomePage() {
  const username = useAuthStore((s) => s.user?.username) ?? '';
  const [productosDestacados, setProductosDestacados] = useState<ProductoDestacado[] | null>(null);

  useEffect(() => {
    Promise.all(
      IDS_PRODUCTOS_DESTACADOS.map((id) =>
        precioUseCases.listarPorProducto.execute(id).then((precios) => {
          const producto = precios[0]?.productoDetalle;
          if (!producto) return null;
          const tipo = tipoComercioFromValue(precios[0].comercioDetalle?.tipo ?? '');
          return { producto, emoji: tipoComercioUi[tipo].emoji };
        }),
      ),
    )
      .then((resultados) => {
        const validos = resultados.filter((r): r is ProductoDestacado => r !== null);
        setProductosDestacados(validos);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative min-h-full bg-background">
      <FondoPatron />

      {/* Header interno — solo mobile. En desktop la navbar superior (main-layout.tsx)
          ya muestra el wordmark "PreciosEC", así que repetirlo acá sería duplicado. */}
      <div className="relative overflow-hidden rounded-b-[28px] bg-white px-5 pt-14 shadow-[0_3px_10px_rgba(0,0,0,0.06)] lg:hidden">
        <div className="absolute left-0 top-2.5">
          <TiraRombosCentrada width={180} height={50} />
        </div>
        <div className="relative pb-4 pt-2.5">
          <p className="text-right text-[22px] font-bold" style={{ color: NAVY }}>
            PreciosEC
          </p>
          <p className="mt-3 text-2xl font-bold" style={{ color: NAVY }}>
            ¡Hola, {username}! 👋
          </p>
          <p className="mt-1 text-sm text-[#666666]">Ahorra comparando antes de comprar</p>
        </div>
      </div>

      {/* Saludo — solo desktop. La navbar ya cubre logo/branding, acá solo el
          título de la página (sin repetir el wordmark). */}
      <div className="relative hidden pt-8 lg:block">
        <h1 className="text-2xl font-bold text-foreground">¡Hola, {username}! 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ahorra comparando antes de comprar</p>
      </div>

      <div className="relative px-5 pb-5 pt-1 lg:px-0 lg:pb-10 lg:pt-6">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10">
          <div className="lg:order-2">
            <AnuncioVideo />
          </div>

          <div className="lg:order-1">
            <h2 className="mt-6 text-[22px] font-bold text-foreground lg:mt-0 lg:text-xl">
              ¿Qué quieres comparar hoy?
            </h2>

            <div className="mt-3.5 grid grid-cols-3 gap-2.5 lg:mt-4 lg:max-w-xl lg:gap-3">
              {Object.values(TipoComercio).map((tipo) => (
                <CategoriaTile key={tipo} tipo={tipo} />
              ))}
            </div>
          </div>
        </div>

        {productosDestacados && productosDestacados.length > 0 && (
          <div className="mt-8 lg:mt-10">
            <h2 className="text-[22px] font-bold text-foreground lg:text-xl">Compará estos productos ahora</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Productos con precios de más de un comercio, listos para comparar.
            </p>

            <div className="mt-3.5 grid grid-cols-2 gap-3.5 lg:grid-cols-5 lg:gap-4">
              {productosDestacados.map(({ producto, emoji }) => (
                <ProductoCard key={producto.id} producto={producto} emojiFallback={emoji} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoriaTile({ tipo }: { tipo: TipoComercio }) {
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
      <span className="mt-2 text-xs font-bold text-white lg:mt-0 lg:text-sm">{ui.label}</span>
    </button>
  );
}

function AnuncioVideo() {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  return (
    <div className="h-[180px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.04)] lg:aspect-video lg:h-auto">
      {state === 'error' ? (
        <div className="flex size-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
          <Megaphone className="size-6" />
          <p className="text-xs">Espacio para anuncio publicitario</p>
        </div>
      ) : (
        <div className="relative size-full">
          <video
            src={ANUNCIO_VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setState('ready')}
            onError={() => setState('error')}
            className="size-full object-cover"
          />
          {state === 'ready' && (
            <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white">
              Publicidad
            </span>
          )}
          {state === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

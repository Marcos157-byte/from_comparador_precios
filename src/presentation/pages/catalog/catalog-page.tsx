import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { Producto } from '@/domain/entities/producto.entity';
import { tipoComercioFromValue, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { useCategoriaStore } from '@/presentation/store/categoria.store';
import { useProductoStore } from '@/presentation/store/producto.store';
import { FondoPatron } from '@/presentation/components/fondo-patron';

const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function CatalogPage() {
  const { tipo, idCategoria } = useParams<{ tipo: string; idCategoria: string }>();
  const idCategoriaNum = Number(idCategoria);
  const location = useLocation();
  const navigate = useNavigate();

  const tipoResuelto = tipoComercioFromValue(tipo ?? '');
  const ui = tipoComercioUi[tipoResuelto];

  const categorias = useCategoriaStore((s) => s.categorias);
  const cargarCategorias = useCategoriaStore((s) => s.cargar);

  const productosPorCategoria = useProductoStore((s) => s.productosPorCategoria);
  const cargando = useProductoStore((s) => s.cargando);
  const errores = useProductoStore((s) => s.error);
  const cargarProductos = useProductoStore((s) => s.cargar);

  const siguientePorCategoria = useProductoStore((s) => s.siguientePorCategoria);
  const cargandoMasPorCategoria = useProductoStore((s) => s.cargandoMasPorCategoria);
  const cargarMas = useProductoStore((s) => s.cargarMas);

  useEffect(() => {
    cargarCategorias();
    cargarProductos(idCategoriaNum);
  }, [cargarCategorias, cargarProductos, idCategoriaNum]);

  const hayMas = Boolean(siguientePorCategoria[idCategoriaNum]);
  const cargandoMas = cargandoMasPorCategoria[idCategoriaNum] ?? false;

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hayMas) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) cargarMas(idCategoriaNum);
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cargarMas, idCategoriaNum, hayMas]);

  const nombreDesdeState = (location.state as { nombreCategoria?: string } | null)?.nombreCategoria;
  const nombreCategoria =
    nombreDesdeState ?? categorias.find((c) => c.id === idCategoriaNum)?.nombre ?? 'Categoría';

  const productos = productosPorCategoria[idCategoriaNum];
  const estaCargando = cargando[idCategoriaNum] ?? false;
  const errorCarga = errores[idCategoriaNum] ?? null;
  const colorOscuro = `color-mix(in srgb, ${ui.color} 75%, black)`;

  return (
    <div className="relative min-h-svh bg-background">
      <FondoPatron />

      <div className="relative">
        <div
          className="flex items-center gap-2 rounded-b-[28px] px-3 pb-6 pt-12"
          style={{ background: `linear-gradient(135deg, ${ui.color}, ${colorOscuro})` }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center text-white"
          >
            <ArrowLeft className="size-5" />
          </button>
          <span className="text-[22px]">{ui.emoji}</span>
          <span className="text-lg font-bold text-white">{nombreCategoria}</span>
        </div>

        <div className="px-5 pb-5 pt-5">
          {estaCargando && !productos ? (
            <div className="flex justify-center py-20">
              <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : errorCarga ? (
            <p className="text-center text-destructive">{errorCarga}</p>
          ) : !productos || productos.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <span className="text-5xl">{ui.emoji}</span>
              <p className="text-muted-foreground">Próximamente más productos</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3.5">
                {productos.map((producto) => (
                  <ProductoCard key={producto.id} producto={producto} emojiFallback={ui.emoji} />
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

function ProductoCard({ producto, emojiFallback }: { producto: Producto; emojiFallback: string }) {
  const navigate = useNavigate();
  const [imagenFallo, setImagenFallo] = useState(false);
  const mostrarImagen = Boolean(producto.imagenUrl) && !imagenFallo;

  return (
    <button
      type="button"
      onClick={() => navigate(`/precios/${producto.id}`)}
      className="flex flex-col overflow-hidden rounded-[20px] border border-border bg-card text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="flex aspect-square items-center justify-center bg-muted">
        {mostrarImagen ? (
          <img
            src={producto.imagenUrl ?? undefined}
            alt={producto.nombre}
            onError={() => setImagenFallo(true)}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-4xl">{emojiFallback}</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <p className="line-clamp-2 text-[13px] font-semibold text-foreground">{producto.nombre}</p>
        {producto.marca && <p className="text-xs text-muted-foreground">{producto.marca}</p>}
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
    </button>
  );
}

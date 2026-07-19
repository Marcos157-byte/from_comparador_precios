import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import type { ListaComparacionDetalle } from '@/domain/entities/lista-comparacion.entity';
import { useComparadorStore } from '@/presentation/store/comparador.store';
import { comparadorUseCases } from '@/infrastructure/factories/comparador.factory';
import { FondoPatron } from '@/presentation/components/fondo-patron';

const formatoPrecio = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function CompararListasPage() {
  const navigate = useNavigate();
  const listas = useComparadorStore((s) => s.listas);
  const cargarListaActiva = useComparadorStore((s) => s.cargarListaActiva);

  useEffect(() => {
    cargarListaActiva();
  }, [cargarListaActiva]);

  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [detalles, setDetalles] = useState<Record<number, ListaComparacionDetalle>>({});
  const [cargandoDetalle, setCargandoDetalle] = useState<Record<number, boolean>>({});

  function alternarSeleccion(id: number) {
    setSeleccionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    if (!detalles[id] && !cargandoDetalle[id]) {
      setCargandoDetalle((prev) => ({ ...prev, [id]: true }));
      comparadorUseCases.obtenerLista
        .execute(id)
        .then((detalle) => setDetalles((prev) => ({ ...prev, [id]: detalle })))
        .finally(() => setCargandoDetalle((prev) => ({ ...prev, [id]: false })));
    }
  }

  const resumenes = seleccionadas
    .map((id) => detalles[id])
    .filter((d): d is ListaComparacionDetalle => Boolean(d))
    .map((d) => ({
      id: d.id,
      nombre: d.nombre,
      total: d.totalesPorComercio.reduce((acc, t) => acc + t.total, 0),
      cantidadItems: d.items.length,
    }));

  const totalMasBajo = resumenes.length > 1 ? Math.min(...resumenes.map((r) => r.total)) : null;

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
          <span className="text-base font-bold text-foreground">Comparar listas</span>
        </div>

        <div className="px-4 pb-8 pt-4">
          {listas.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Scale className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">Todavía no tenés listas para comparar.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Elegí 2 o más listas para comparar sus totales.</p>

              <div className="mt-3 flex flex-col gap-2">
                {listas.map((lista) => {
                  const marcada = seleccionadas.includes(lista.id);
                  return (
                    <label
                      key={lista.id}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                    >
                      <input
                        type="checkbox"
                        checked={marcada}
                        onChange={() => alternarSeleccion(lista.id)}
                        className="size-4 accent-primary"
                      />
                      <span className="text-sm font-semibold text-foreground">{lista.nombre}</span>
                      {cargandoDetalle[lista.id] && (
                        <span className="ml-auto size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      )}
                    </label>
                  );
                })}
              </div>

              {resumenes.length > 0 && (
                <div className="mt-6 flex flex-col gap-3">
                  <h2 className="text-lg font-bold text-foreground">Resultado</h2>
                  {resumenes.map((r) => {
                    const esLaMasBarata = totalMasBajo !== null && r.total === totalMasBajo;
                    return (
                      <div
                        key={r.id}
                        className="rounded-2xl border p-4"
                        style={{
                          backgroundColor: esLaMasBarata ? 'color-mix(in srgb, #22C55E 10%, white)' : undefined,
                          borderColor: esLaMasBarata
                            ? 'color-mix(in srgb, #22C55E 40%, transparent)'
                            : undefined,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{r.nombre}</span>
                          {esLaMasBarata && (
                            <span
                              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                              style={{
                                backgroundColor: 'color-mix(in srgb, #22C55E 15%, transparent)',
                                color: '#16A34A',
                              }}
                            >
                              MÁS BARATA
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {r.cantidadItems} producto{r.cantidadItems === 1 ? '' : 's'}
                        </p>
                        <p
                          className="mt-2 text-2xl font-bold text-foreground"
                          style={{ color: esLaMasBarata ? '#16A34A' : undefined }}
                        >
                          {formatoPrecio.format(r.total)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

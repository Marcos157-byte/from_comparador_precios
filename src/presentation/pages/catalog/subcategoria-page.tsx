import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { TipoComercio } from '@/domain/enums/tipo-comercio.enum';
import { tipoComercioFromIdCategoriaPadre, tipoComercioUi } from '@/presentation/theme/tipo-comercio.theme';
import { useCategoriaStore } from '@/presentation/store/categoria.store';
import { filtrarSubcategorias } from '@/domain/services/filtrar-subcategorias.service';
import { FondoPatron } from '@/presentation/components/fondo-patron';

// Paleta + emojis hardcodeados, réplica exacta de subcategoria_screen.dart
const PALETA = ['#26C6DA', '#66BB6A', '#FF7043', '#7E57C2', '#EF5350', '#26A69A', '#FFCA28', '#42A5F5'];

const EMOJIS_SUBCATEGORIA: Record<string, string> = {
  'Vitaminas y Suplementos': '💊',
  'Gripes y Resfriados': '🤧',
  'Cuidado Personal': '🧴',
  Medicamentos: '💉',
  Lacteos: '🥛',
  Leches: '🥛',
  Ofertas: '🏷️',
  'Herramientas Manuales': '🔨',
  'Herramientas Eléctricas': '⚡',
  Pinturas: '🎨',
};

export function SubcategoriaPage() {
  const { idPadre } = useParams<{ idPadre: string }>();
  const idPadreNum = Number(idPadre);
  const location = useLocation();
  const navigate = useNavigate();

  const tipoDesdeState = (location.state as { tipo?: TipoComercio } | null)?.tipo;
  const tipo = tipoDesdeState ?? tipoComercioFromIdCategoriaPadre(idPadreNum);
  const ui = tipo ? tipoComercioUi[tipo] : null;

  const categorias = useCategoriaStore((s) => s.categorias);
  const cargando = useCategoriaStore((s) => s.cargando);
  const cargadas = useCategoriaStore((s) => s.cargadas);
  const error = useCategoriaStore((s) => s.error);
  const cargar = useCategoriaStore((s) => s.cargar);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (!ui) {
    return (
      <div className="p-6 text-center text-destructive">
        No se reconoce este tipo de comercio.
      </div>
    );
  }

  const subcategorias = filtrarSubcategorias(categorias, idPadreNum);
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
          <span className="text-lg font-bold text-white">{ui.label}</span>
        </div>

        <div className="px-5 pb-5 pt-5">
          {cargando && !cargadas ? (
            <div className="flex justify-center py-20">
              <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : error ? (
            <p className="text-center text-destructive">{error}</p>
          ) : subcategorias.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <span className="text-5xl">{ui.emoji}</span>
              <p className="text-muted-foreground">Próximamente más categorías</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {subcategorias.map((cat, index) => {
                const color = PALETA[index % PALETA.length];
                const emoji = EMOJIS_SUBCATEGORIA[cat.nombre] ?? ui.emoji;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      navigate(`/catalog/${tipo}/${cat.id}`, { state: { nombreCategoria: cat.nombre } })
                    }
                    className="flex aspect-[1.1] flex-col items-center justify-center rounded-[20px] p-4 text-center"
                    style={{
                      background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 75%, black))`,
                      boxShadow: `0 6px 12px color-mix(in srgb, ${color} 30%, transparent)`,
                    }}
                  >
                    <span
                      className="flex size-[52px] items-center justify-center rounded-2xl text-2xl"
                      style={{ backgroundColor: 'color-mix(in srgb, white 22%, transparent)' }}
                    >
                      {emoji}
                    </span>
                    <span className="mt-2.5 line-clamp-2 text-[13px] font-bold text-white">{cat.nombre}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

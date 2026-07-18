import { create } from 'zustand';
import type { Producto } from '@/domain/entities/producto.entity';
import { productoUseCases } from '@/infrastructure/factories/producto.factory';

interface ProductoStore {
  productosPorCategoria: Record<number, Producto[]>;
  cargando: Record<number, boolean>;
  error: Record<number, string | null>;
  cargar: (idCategoria: number) => Promise<void>;

  paginaPorCategoria: Record<number, number>;
  siguientePorCategoria: Record<number, string | null>;
  cargandoMasPorCategoria: Record<number, boolean>;
  cargarMas: (idCategoria: number) => Promise<void>;

  productosPorTipo: Record<string, Producto[]>;
  cargandoTipo: Record<string, boolean>;
  errorTipo: Record<string, string | null>;
  cargarPorTipo: (tipo: string) => Promise<void>;
}

export const useProductoStore = create<ProductoStore>((set, get) => ({
  productosPorCategoria: {},
  cargando: {},
  error: {},

  cargar: async (idCategoria) => {
    if (get().productosPorCategoria[idCategoria] || get().cargando[idCategoria]) return;
    set((state) => ({
      cargando: { ...state.cargando, [idCategoria]: true },
      error: { ...state.error, [idCategoria]: null },
    }));
    try {
      const { results, next } = await productoUseCases.listar.execute({ categoria: idCategoria, page: 1 });
      set((state) => ({
        productosPorCategoria: { ...state.productosPorCategoria, [idCategoria]: results },
        paginaPorCategoria: { ...state.paginaPorCategoria, [idCategoria]: 1 },
        siguientePorCategoria: { ...state.siguientePorCategoria, [idCategoria]: next },
        cargando: { ...state.cargando, [idCategoria]: false },
      }));
    } catch {
      set((state) => ({
        cargando: { ...state.cargando, [idCategoria]: false },
        error: { ...state.error, [idCategoria]: 'No se pudieron cargar los productos.' },
      }));
    }
  },

  paginaPorCategoria: {},
  siguientePorCategoria: {},
  cargandoMasPorCategoria: {},

  cargarMas: async (idCategoria) => {
    if (get().cargandoMasPorCategoria[idCategoria] || !get().siguientePorCategoria[idCategoria]) return;
    set((state) => ({ cargandoMasPorCategoria: { ...state.cargandoMasPorCategoria, [idCategoria]: true } }));
    try {
      const siguientePagina = (get().paginaPorCategoria[idCategoria] ?? 1) + 1;
      const { results, next } = await productoUseCases.listar.execute({
        categoria: idCategoria,
        page: siguientePagina,
      });
      set((state) => ({
        productosPorCategoria: {
          ...state.productosPorCategoria,
          [idCategoria]: [...(state.productosPorCategoria[idCategoria] ?? []), ...results],
        },
        paginaPorCategoria: { ...state.paginaPorCategoria, [idCategoria]: siguientePagina },
        siguientePorCategoria: { ...state.siguientePorCategoria, [idCategoria]: next },
        cargandoMasPorCategoria: { ...state.cargandoMasPorCategoria, [idCategoria]: false },
      }));
    } catch {
      // Si falla traer la siguiente página, no reintentamos solos: cortamos el "hay más"
      // para no martillar el backend en cada scroll: la grilla ya cargada queda intacta.
      set((state) => ({
        siguientePorCategoria: { ...state.siguientePorCategoria, [idCategoria]: null },
        cargandoMasPorCategoria: { ...state.cargandoMasPorCategoria, [idCategoria]: false },
      }));
    }
  },

  productosPorTipo: {},
  cargandoTipo: {},
  errorTipo: {},

  cargarPorTipo: async (tipo) => {
    if (get().productosPorTipo[tipo] || get().cargandoTipo[tipo]) return;
    set((state) => ({
      cargandoTipo: { ...state.cargandoTipo, [tipo]: true },
      errorTipo: { ...state.errorTipo, [tipo]: null },
    }));
    try {
      const acumulado: Producto[] = [];
      let pagina = 1;
      let siguiente: string | null;
      do {
        const { results, next } = await productoUseCases.listar.execute({ tipo, page: pagina });
        acumulado.push(...results);
        siguiente = next;
        pagina += 1;
      } while (siguiente);

      set((state) => ({
        productosPorTipo: { ...state.productosPorTipo, [tipo]: acumulado },
        cargandoTipo: { ...state.cargandoTipo, [tipo]: false },
      }));
    } catch {
      set((state) => ({
        cargandoTipo: { ...state.cargandoTipo, [tipo]: false },
        errorTipo: { ...state.errorTipo, [tipo]: 'No se pudieron cargar los productos.' },
      }));
    }
  },
}));

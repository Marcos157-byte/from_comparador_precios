import { create } from 'zustand';
import type { Precio } from '@/domain/entities/precio.entity';
import { precioUseCases } from '@/infrastructure/factories/precio.factory';

interface PrecioStore {
  preciosPorProducto: Record<number, Precio[]>;
  cargando: Record<number, boolean>;
  error: Record<number, string | null>;
  cargar: (idProducto: number) => Promise<void>;

  preciosPorComercio: Record<number, Precio[]>;
  cargandoPorComercio: Record<number, boolean>;
  errorPorComercio: Record<number, string | null>;
  cargarPorComercio: (idComercio: number) => Promise<void>;

  paginaPorComercio: Record<number, number>;
  siguientePorComercio: Record<number, string | null>;
  cargandoMasPorComercio: Record<number, boolean>;
  cargarMasPorComercio: (idComercio: number) => Promise<void>;
}

export const usePrecioStore = create<PrecioStore>((set, get) => ({
  preciosPorProducto: {},
  cargando: {},
  error: {},

  cargar: async (idProducto) => {
    if (get().preciosPorProducto[idProducto] || get().cargando[idProducto]) return;
    set((state) => ({
      cargando: { ...state.cargando, [idProducto]: true },
      error: { ...state.error, [idProducto]: null },
    }));
    try {
      const precios = await precioUseCases.listarPorProducto.execute(idProducto);
      set((state) => ({
        preciosPorProducto: { ...state.preciosPorProducto, [idProducto]: precios },
        cargando: { ...state.cargando, [idProducto]: false },
      }));
    } catch {
      set((state) => ({
        cargando: { ...state.cargando, [idProducto]: false },
        error: { ...state.error, [idProducto]: 'No se pudieron cargar los precios.' },
      }));
    }
  },

  preciosPorComercio: {},
  cargandoPorComercio: {},
  errorPorComercio: {},

  cargarPorComercio: async (idComercio) => {
    if (get().preciosPorComercio[idComercio] || get().cargandoPorComercio[idComercio]) return;
    set((state) => ({
      cargandoPorComercio: { ...state.cargandoPorComercio, [idComercio]: true },
      errorPorComercio: { ...state.errorPorComercio, [idComercio]: null },
    }));
    try {
      const { results, next } = await precioUseCases.listarPorComercio.execute(idComercio, 1);
      set((state) => ({
        preciosPorComercio: { ...state.preciosPorComercio, [idComercio]: results },
        paginaPorComercio: { ...state.paginaPorComercio, [idComercio]: 1 },
        siguientePorComercio: { ...state.siguientePorComercio, [idComercio]: next },
        cargandoPorComercio: { ...state.cargandoPorComercio, [idComercio]: false },
      }));
    } catch {
      set((state) => ({
        cargandoPorComercio: { ...state.cargandoPorComercio, [idComercio]: false },
        errorPorComercio: { ...state.errorPorComercio, [idComercio]: 'No se pudieron cargar los precios.' },
      }));
    }
  },

  paginaPorComercio: {},
  siguientePorComercio: {},
  cargandoMasPorComercio: {},

  cargarMasPorComercio: async (idComercio) => {
    if (get().cargandoMasPorComercio[idComercio] || !get().siguientePorComercio[idComercio]) return;
    set((state) => ({ cargandoMasPorComercio: { ...state.cargandoMasPorComercio, [idComercio]: true } }));
    try {
      const siguientePagina = (get().paginaPorComercio[idComercio] ?? 1) + 1;
      const { results, next } = await precioUseCases.listarPorComercio.execute(idComercio, siguientePagina);
      set((state) => ({
        preciosPorComercio: {
          ...state.preciosPorComercio,
          [idComercio]: [...(state.preciosPorComercio[idComercio] ?? []), ...results],
        },
        paginaPorComercio: { ...state.paginaPorComercio, [idComercio]: siguientePagina },
        siguientePorComercio: { ...state.siguientePorComercio, [idComercio]: next },
        cargandoMasPorComercio: { ...state.cargandoMasPorComercio, [idComercio]: false },
      }));
    } catch {
      set((state) => ({
        siguientePorComercio: { ...state.siguientePorComercio, [idComercio]: null },
        cargandoMasPorComercio: { ...state.cargandoMasPorComercio, [idComercio]: false },
      }));
    }
  },
}));

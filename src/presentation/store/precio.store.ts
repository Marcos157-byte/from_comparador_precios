import { create } from 'zustand';
import type { Precio } from '@/domain/entities/precio.entity';
import { precioUseCases } from '@/infrastructure/factories/precio.factory';

interface PrecioStore {
  preciosPorProducto: Record<number, Precio[]>;
  cargando: Record<number, boolean>;
  error: Record<number, string | null>;
  cargar: (idProducto: number) => Promise<void>;
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
}));

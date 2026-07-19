import { create } from 'zustand';
import type { ComercioLigero } from '@/domain/entities/comercio-ligero.entity';
import { comercioUseCases } from '@/infrastructure/factories/comercio.factory';

interface ComercioStore {
  comercios: ComercioLigero[];
  cargando: boolean;
  error: string | null;
  cargadas: boolean;
  cargar: () => Promise<void>;
}

export const useComercioStore = create<ComercioStore>((set, get) => ({
  comercios: [],
  cargando: false,
  error: null,
  cargadas: false,

  cargar: async () => {
    if (get().cargadas || get().cargando) return;
    set({ cargando: true, error: null });
    try {
      const comercios = await comercioUseCases.listar.execute();
      set({ comercios, cargando: false, cargadas: true });
    } catch {
      set({ cargando: false, error: 'No se pudieron cargar los comercios.' });
    }
  },
}));

import { create } from 'zustand';
import type { Categoria } from '@/domain/entities/categoria.entity';
import { categoriaUseCases } from '@/infrastructure/factories/categoria.factory';

interface CategoriaStore {
  categorias: Categoria[];
  cargando: boolean;
  error: string | null;
  cargadas: boolean;
  cargar: () => Promise<void>;
}

export const useCategoriaStore = create<CategoriaStore>((set, get) => ({
  categorias: [],
  cargando: false,
  error: null,
  cargadas: false,

  cargar: async () => {
    if (get().cargadas || get().cargando) return;
    set({ cargando: true, error: null });
    try {
      const categorias = await categoriaUseCases.listar.execute();
      set({ categorias, cargando: false, cargadas: true });
    } catch {
      set({ cargando: false, error: 'No se pudieron cargar las categorías.' });
    }
  },
}));

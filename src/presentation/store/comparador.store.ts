import { create } from 'zustand';
import type { ListaComparacionDetalle } from '@/domain/entities/lista-comparacion.entity';
import { comparadorUseCases } from '@/infrastructure/factories/comparador.factory';

interface ComparadorStore {
  listaId: number | null;
  detalle: ListaComparacionDetalle | null;
  cargando: boolean;
  error: string | null;
  cargarListaActiva: () => Promise<void>;
  agregarProducto: (idProducto: number, idComercio: number) => Promise<void>;
  quitarItem: (idItem: number) => Promise<void>;
}

export const useComparadorStore = create<ComparadorStore>((set, get) => ({
  listaId: null,
  detalle: null,
  cargando: false,
  error: null,

  cargarListaActiva: async () => {
    if (get().detalle !== null || get().cargando) return;
    set({ cargando: true, error: null });
    try {
      const detalle = await comparadorUseCases.cargarListaActiva.execute();
      set({ listaId: detalle?.id ?? null, detalle, cargando: false });
    } catch {
      set({ cargando: false, error: 'No se pudo cargar la lista.' });
    }
  },

  agregarProducto: async (idProducto, idComercio) => {
    set({ cargando: true, error: null });
    try {
      const { listaId, detalle } = await comparadorUseCases.agregarProducto.execute(
        get().listaId,
        idProducto,
        idComercio,
      );
      set({ listaId, detalle, cargando: false });
    } catch {
      set({ cargando: false, error: 'No se pudo agregar a la comparación.' });
    }
  },

  quitarItem: async (idItem) => {
    const listaId = get().listaId;
    if (listaId == null) return;
    try {
      const detalle = await comparadorUseCases.quitarItem.execute(idItem, listaId);
      set({ detalle });
    } catch {
      // Igual que en Flutter: fallo silencioso, la lista simplemente no se refresca.
    }
  },
}));

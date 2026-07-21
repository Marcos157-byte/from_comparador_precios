import { create } from 'zustand';
import type { ListaComparacionDetalle, ListaComparacionResumen } from '@/domain/entities/lista-comparacion.entity';
import { comparadorUseCases } from '@/infrastructure/factories/comparador.factory';

const KEY_LISTA_ACTIVA = 'lista_activa_id';

function leerListaActivaGuardada(): number | null {
  const raw = localStorage.getItem(KEY_LISTA_ACTIVA);
  return raw ? Number(raw) : null;
}

function guardarListaActiva(id: number): void {
  localStorage.setItem(KEY_LISTA_ACTIVA, String(id));
}

interface ComparadorStore {
  listas: ListaComparacionResumen[];
  listasCargadas: boolean;

  listaActivaId: number | null;
  detalle: ListaComparacionDetalle | null;
  activaResuelta: boolean;
  cargando: boolean;
  error: string | null;

  cargarListas: () => Promise<ListaComparacionResumen[]>;
  cargarListaActiva: () => Promise<void>;
  setListaActiva: (id: number) => Promise<void>;
  crearLista: (nombre: string) => Promise<number | null>;
  agregarProducto: (idProducto: number, idComercio: number) => Promise<void>;
  agregarProductoAListaElegida: (idProducto: number, idComercio: number, idLista: number) => Promise<void>;
  quitarItem: (idItem: number) => Promise<void>;
  eliminarLista: (id: number) => Promise<void>;
}

export const useComparadorStore = create<ComparadorStore>((set, get) => ({
  listas: [],
  listasCargadas: false,

  listaActivaId: null,
  detalle: null,
  activaResuelta: false,
  cargando: false,
  error: null,

  // Carga liviana: solo el roster de listas (nombre/id), sin resolver "cuál está activa"
  // ni traer ningún detalle. La usa Precios para decidir si hay ambigüedad (2+ listas)
  // antes de mostrar el popup de "elegir lista".
  cargarListas: async () => {
    if (get().listasCargadas || get().cargando) return get().listas;
    set({ cargando: true, error: null });
    try {
      const listas = await comparadorUseCases.listarListas.execute();
      set({ listas, listasCargadas: true, cargando: false });
      return listas;
    } catch {
      set({ cargando: false, error: 'No se pudieron cargar tus listas.' });
      return get().listas;
    }
  },

  cargarListaActiva: async () => {
    if (get().activaResuelta || get().cargando) return;
    set({ cargando: true, error: null });
    try {
      const idPreferido = get().listaActivaId ?? leerListaActivaGuardada();
      const { listas, detalle } = await comparadorUseCases.cargarListaActiva.execute(idPreferido);
      if (detalle) guardarListaActiva(detalle.id);
      set({
        listas,
        listasCargadas: true,
        activaResuelta: true,
        listaActivaId: detalle?.id ?? null,
        detalle,
        cargando: false,
      });
    } catch {
      set({ cargando: false, error: 'No se pudo cargar la lista.' });
    }
  },

  setListaActiva: async (id) => {
    set({ cargando: true, error: null });
    try {
      const detalle = await comparadorUseCases.obtenerLista.execute(id);
      guardarListaActiva(id);
      set({ listaActivaId: id, detalle, activaResuelta: true, cargando: false });
    } catch {
      set({ cargando: false, error: 'No se pudo cargar la lista.' });
    }
  },

  crearLista: async (nombre) => {
    set({ cargando: true, error: null });
    try {
      const nueva = await comparadorUseCases.crearLista.execute(nombre);
      guardarListaActiva(nueva.id);
      set((state) => ({
        listas: [...state.listas, { id: nueva.id, nombre: nueva.nombre }],
        listasCargadas: true,
        listaActivaId: nueva.id,
        detalle: nueva,
        activaResuelta: true,
        cargando: false,
      }));
      return nueva.id;
    } catch {
      set({ cargando: false, error: 'No se pudo crear la lista.' });
      return null;
    }
  },

  // Camino "sin ambigüedad": agrega a listaActivaId (o crea "Mi comparación" si no hay
  // ninguna), y esa pasa a ser la lista activa. Lo usa Precios solo cuando el usuario
  // tiene 0 o 1 listas.
  agregarProducto: async (idProducto, idComercio) => {
    set({ cargando: true, error: null });
    try {
      const { listaId, detalle } = await comparadorUseCases.agregarProducto.execute(
        get().listaActivaId,
        idProducto,
        idComercio,
      );
      guardarListaActiva(listaId);
      set((state) => ({
        listaActivaId: listaId,
        detalle,
        activaResuelta: true,
        cargando: false,
        listas: state.listas.some((l) => l.id === listaId)
          ? state.listas
          : [...state.listas, { id: listaId, nombre: detalle.nombre }],
      }));
    } catch {
      set({ cargando: false, error: 'No se pudo agregar a la comparación.' });
    }
  },

  // Camino "con ambigüedad resuelta explícitamente": el usuario eligió la lista en el
  // popup de Precios. No toca listaActivaId/detalle salvo que justo haya elegido la
  // misma lista que ya estaba activa (ahí sí refrescamos para que Mi Lista no quede
  // desactualizada) — elegir dónde cae UN producto no debe cambiar qué lista ve el
  // usuario por defecto al entrar a Mi Lista.
  agregarProductoAListaElegida: async (idProducto, idComercio, idLista) => {
    set({ cargando: true, error: null });
    try {
      const { listaId, detalle } = await comparadorUseCases.agregarProducto.execute(idLista, idProducto, idComercio);
      set((state) => ({
        cargando: false,
        detalle: listaId === state.listaActivaId ? detalle : state.detalle,
      }));
    } catch {
      set({ cargando: false, error: 'No se pudo agregar a la comparación.' });
    }
  },

  quitarItem: async (idItem) => {
    const listaId = get().listaActivaId;
    if (listaId == null) return;
    try {
      const detalle = await comparadorUseCases.quitarItem.execute(idItem, listaId);
      set({ detalle });
    } catch {
      // Igual que en Flutter: fallo silencioso, la lista simplemente no se refresca.
    }
  },

  eliminarLista: async (id) => {
    set({ cargando: true, error: null });
    try {
      await comparadorUseCases.eliminarLista.execute(id);
      const listasRestantes = get().listas.filter((l) => l.id !== id);
      const eraActiva = get().listaActivaId === id;

      if (!eraActiva) {
        set({ listas: listasRestantes, cargando: false });
        return;
      }

      if (listasRestantes.length === 0) {
        // Mismo estado "sin listas" que ve un usuario que nunca creó ninguna.
        localStorage.removeItem(KEY_LISTA_ACTIVA);
        set({ listas: listasRestantes, listaActivaId: null, detalle: null, cargando: false });
        return;
      }

      const siguienteId = listasRestantes[0].id;
      const detalle = await comparadorUseCases.obtenerLista.execute(siguienteId);
      guardarListaActiva(siguienteId);
      set({ listas: listasRestantes, listaActivaId: siguienteId, detalle, cargando: false });
    } catch {
      set({ cargando: false, error: 'No se pudo eliminar la lista.' });
    }
  },
}));

import type { ComparadorRepository } from '@/domain/ports/comparador-repository.port';
import type {
  ItemComparacion,
  ListaComparacionDetalle,
  ListaComparacionResumen,
  TotalPorComercio,
} from '@/domain/entities/lista-comparacion.entity';
import { axiosClient } from '../http/axios-client';
import { mapProducto, type ProductoRaw } from './producto-http.adapter';
import { mapComercioLigero, type ComercioLigeroRaw } from './precio-http.adapter';

interface ListaComparacionResumenRaw {
  id_lista: number;
  nombre: string;
}

interface ItemComparacionRaw {
  id_item: number;
  producto_detalle: ProductoRaw;
  comercio_detalle: ComercioLigeroRaw;
  precio_momento: string;
}

interface TotalPorComercioRaw {
  id_comercio: number;
  nombre_comercio: string;
  cantidad_productos: number;
  total: number | string;
}

interface ListaComparacionDetalleRaw {
  id_lista: number;
  nombre: string;
  items: ItemComparacionRaw[];
  totales_por_comercio: TotalPorComercioRaw[];
}

interface PaginatedRaw<T> {
  count: number;
  next: string | null;
  results: T[];
}

function mapItemComparacion(raw: ItemComparacionRaw): ItemComparacion {
  return {
    id: raw.id_item,
    productoDetalle: mapProducto(raw.producto_detalle),
    comercioDetalle: mapComercioLigero(raw.comercio_detalle),
    precioMomento: Number(raw.precio_momento),
  };
}

function mapTotalPorComercio(raw: TotalPorComercioRaw): TotalPorComercio {
  return {
    idComercio: raw.id_comercio,
    nombreComercio: raw.nombre_comercio,
    cantidadProductos: raw.cantidad_productos,
    total: Number(raw.total),
  };
}

function mapListaComparacionDetalle(raw: ListaComparacionDetalleRaw): ListaComparacionDetalle {
  return {
    id: raw.id_lista,
    nombre: raw.nombre,
    items: raw.items.map(mapItemComparacion),
    totalesPorComercio: raw.totales_por_comercio.map(mapTotalPorComercio),
  };
}

export class ComparadorHttpAdapter implements ComparadorRepository {
  async listarListas(): Promise<ListaComparacionResumen[]> {
    const { data } = await axiosClient.get<PaginatedRaw<ListaComparacionResumenRaw>>(
      '/kache/listas-comparacion/',
    );
    return data.results.map((raw) => ({ id: raw.id_lista, nombre: raw.nombre }));
  }

  async crearLista(nombre = 'Mi comparación'): Promise<ListaComparacionDetalle> {
    const { data } = await axiosClient.post<ListaComparacionDetalleRaw>('/kache/listas-comparacion/', {
      nombre,
    });
    return mapListaComparacionDetalle(data);
  }

  async obtenerLista(id: number): Promise<ListaComparacionDetalle> {
    const { data } = await axiosClient.get<ListaComparacionDetalleRaw>(`/kache/listas-comparacion/${id}/`);
    return mapListaComparacionDetalle(data);
  }

  async agregarItem(listaId: number, idProducto: number, idComercio: number): Promise<void> {
    await axiosClient.post(`/kache/listas-comparacion/${listaId}/items/`, {
      id_producto: idProducto,
      id_comercio: idComercio,
    });
  }

  async eliminarItem(itemId: number): Promise<void> {
    await axiosClient.delete(`/kache/items-comparacion/${itemId}/`);
  }

  async eliminarLista(id: number): Promise<void> {
    await axiosClient.delete(`/kache/listas-comparacion/${id}/`);
  }

  async renombrarLista(id: number, nuevoNombre: string): Promise<ListaComparacionResumen> {
    const { data } = await axiosClient.patch<ListaComparacionResumenRaw>(`/kache/listas-comparacion/${id}/`, {
      nombre: nuevoNombre,
    });
    return { id: data.id_lista, nombre: data.nombre };
  }
}

import type { PrecioRepository } from '@/domain/ports/precio-repository.port';
import type { Precio } from '@/domain/entities/precio.entity';
import type { Paginated } from '@/domain/entities/paginated.entity';
import type { ComercioLigero } from '@/domain/entities/comercio-ligero.entity';
import { axiosClient } from '../http/axios-client';
import { mapProducto, type ProductoRaw } from './producto-http.adapter';

export interface ComercioLigeroRaw {
  id_comercio: number;
  nombre: string;
  tipo: string;
  logo_url: string | null;
}

interface PrecioRaw {
  id_precio: number;
  id_producto: number;
  id_comercio: number;
  precio_actual: string;
  precio_oferta: string | null;
  en_oferta: boolean;
  precio_efectivo: string;
  fecha_actualizacion: string;
  producto_detalle: ProductoRaw | null;
  comercio_detalle: ComercioLigeroRaw | null;
}

interface PaginatedRaw<T> {
  count: number;
  next: string | null;
  results: T[];
}

export function mapComercioLigero(raw: ComercioLigeroRaw): ComercioLigero {
  return {
    id: raw.id_comercio,
    nombre: raw.nombre,
    tipo: raw.tipo,
    logoUrl: raw.logo_url,
  };
}

function mapPrecio(raw: PrecioRaw): Precio {
  return {
    id: raw.id_precio,
    idProducto: raw.id_producto,
    idComercio: raw.id_comercio,
    precioActual: Number(raw.precio_actual),
    precioOferta: raw.precio_oferta !== null ? Number(raw.precio_oferta) : null,
    enOferta: raw.en_oferta,
    precioEfectivo: Number(raw.precio_efectivo),
    fechaActualizacion: raw.fecha_actualizacion,
    productoDetalle: raw.producto_detalle ? mapProducto(raw.producto_detalle) : null,
    comercioDetalle: raw.comercio_detalle ? mapComercioLigero(raw.comercio_detalle) : null,
  };
}

export class PrecioHttpAdapter implements PrecioRepository {
  async listarPorProducto(idProducto: number): Promise<Precio[]> {
    const { data } = await axiosClient.get<PaginatedRaw<PrecioRaw>>('/kache/precios/', {
      params: { id_producto: idProducto },
    });
    return data.results.map(mapPrecio);
  }

  async listarPorComercio(idComercio: number, page?: number): Promise<Paginated<Precio>> {
    const { data } = await axiosClient.get<PaginatedRaw<PrecioRaw>>('/kache/precios/', {
      params: { comercio: idComercio, page },
    });
    return {
      count: data.count,
      next: data.next,
      results: data.results.map(mapPrecio),
    };
  }
}

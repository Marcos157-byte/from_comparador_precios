import type { ProductoRepository, ListarProductosParams } from '@/domain/ports/producto-repository.port';
import type { Producto } from '@/domain/entities/producto.entity';
import type { Paginated } from '@/domain/entities/paginated.entity';
import { axiosClient } from '../http/axios-client';

interface CategoriaDetalleRaw {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

export interface ProductoRaw {
  id_producto: number;
  nombre: string;
  marca: string;
  codigo_barras: string | null;
  imagen_url: string | null;
  descripcion: string;
  unidad_medida: string;
  id_categoria: number | null;
  categoria_detalle: CategoriaDetalleRaw | null;
  precio_desde?: number | string | null;
  tiene_oferta?: boolean;
}

interface PaginatedRaw<T> {
  count: number;
  next: string | null;
  results: T[];
}

export function mapProducto(raw: ProductoRaw): Producto {
  return {
    id: raw.id_producto,
    nombre: raw.nombre,
    marca: raw.marca,
    codigoBarras: raw.codigo_barras,
    descripcion: raw.descripcion,
    unidadMedida: raw.unidad_medida,
    idCategoria: raw.id_categoria,
    imagenUrl: raw.imagen_url,
    categoriaDetalle: raw.categoria_detalle
      ? {
          id: raw.categoria_detalle.id_categoria,
          nombre: raw.categoria_detalle.nombre,
          descripcion: raw.categoria_detalle.descripcion,
        }
      : null,
    precioDesde: raw.precio_desde != null ? Number(raw.precio_desde) : null,
    tieneOferta: raw.tiene_oferta ?? false,
  };
}

export class ProductoHttpAdapter implements ProductoRepository {
  async listar(params?: ListarProductosParams): Promise<Paginated<Producto>> {
    const { data } = await axiosClient.get<PaginatedRaw<ProductoRaw>>('/kache/productos/', {
      params: { tipo: params?.tipo, categoria: params?.categoria, buscar: params?.buscar, page: params?.page },
    });
    return {
      count: data.count,
      next: data.next,
      results: data.results.map(mapProducto),
    };
  }
}

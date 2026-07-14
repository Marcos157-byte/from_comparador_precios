import type { CategoriaRepository } from '@/domain/ports/categoria-repository.port';
import type { Categoria } from '@/domain/entities/categoria.entity';
import { axiosClient } from '../http/axios-client';

interface CategoriaRaw {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  categoria_padre: number | null;
}

interface PaginatedRaw<T> {
  count: number;
  next: string | null;
  results: T[];
}

function mapCategoria(raw: CategoriaRaw): Categoria {
  return {
    id: raw.id_categoria,
    nombre: raw.nombre,
    descripcion: raw.descripcion,
    categoriaPadre: raw.categoria_padre,
  };
}

export class CategoriaHttpAdapter implements CategoriaRepository {
  async listar(): Promise<Categoria[]> {
    const { data } = await axiosClient.get<PaginatedRaw<CategoriaRaw>>('/kache/categorias/');
    return data.results.map(mapCategoria);
  }
}

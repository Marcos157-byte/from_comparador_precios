import type { ComercioRepository } from '@/domain/ports/comercio-repository.port';
import type { ComercioLigero } from '@/domain/entities/comercio-ligero.entity';
import { axiosClient } from '../http/axios-client';
import { mapComercioLigero, type ComercioLigeroRaw } from './precio-http.adapter';

interface PaginatedRaw<T> {
  count: number;
  next: string | null;
  results: T[];
}

export class ComercioHttpAdapter implements ComercioRepository {
  async listar(): Promise<ComercioLigero[]> {
    const { data } = await axiosClient.get<PaginatedRaw<ComercioLigeroRaw>>('/kache/comercios/');
    return data.results.map(mapComercioLigero);
  }
}

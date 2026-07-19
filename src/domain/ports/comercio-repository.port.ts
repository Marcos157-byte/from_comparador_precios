import type { ComercioLigero } from '../entities/comercio-ligero.entity';

export interface ComercioRepository {
  listar(): Promise<ComercioLigero[]>;
}

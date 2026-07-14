import type { Precio } from '../entities/precio.entity';

export interface PrecioRepository {
  listarPorProducto(idProducto: number): Promise<Precio[]>;
}

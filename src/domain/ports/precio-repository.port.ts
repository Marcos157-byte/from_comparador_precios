import type { Precio } from '../entities/precio.entity';
import type { Paginated } from '../entities/paginated.entity';

export interface PrecioRepository {
  listarPorProducto(idProducto: number): Promise<Precio[]>;
  listarPorComercio(idComercio: number, page?: number): Promise<Paginated<Precio>>;
}

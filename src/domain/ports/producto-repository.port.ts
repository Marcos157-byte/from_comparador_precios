import type { Paginated } from '../entities/paginated.entity';
import type { Producto } from '../entities/producto.entity';

export interface ListarProductosParams {
  tipo?: string;
  buscar?: string;
  categoria?: number;
  page?: number;
}

export interface ProductoRepository {
  listar(params?: ListarProductosParams): Promise<Paginated<Producto>>;
}

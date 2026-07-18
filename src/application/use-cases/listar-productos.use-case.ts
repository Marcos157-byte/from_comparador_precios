import type { ProductoRepository, ListarProductosParams } from '@/domain/ports/producto-repository.port';
import type { Paginated } from '@/domain/entities/paginated.entity';
import type { Producto } from '@/domain/entities/producto.entity';

export class ListarProductosUseCase {
  private readonly productoRepository: ProductoRepository;

  constructor(productoRepository: ProductoRepository) {
    this.productoRepository = productoRepository;
  }

  execute(params?: ListarProductosParams): Promise<Paginated<Producto>> {
    return this.productoRepository.listar(params);
  }
}

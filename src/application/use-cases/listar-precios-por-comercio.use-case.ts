import type { PrecioRepository } from '@/domain/ports/precio-repository.port';
import type { Precio } from '@/domain/entities/precio.entity';
import type { Paginated } from '@/domain/entities/paginated.entity';

export class ListarPreciosPorComercioUseCase {
  private readonly precioRepository: PrecioRepository;

  constructor(precioRepository: PrecioRepository) {
    this.precioRepository = precioRepository;
  }

  execute(idComercio: number, page?: number): Promise<Paginated<Precio>> {
    return this.precioRepository.listarPorComercio(idComercio, page);
  }
}

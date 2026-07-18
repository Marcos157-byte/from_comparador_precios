import type { PrecioRepository } from '@/domain/ports/precio-repository.port';
import type { Precio } from '@/domain/entities/precio.entity';

export class ListarPreciosPorProductoUseCase {
  private readonly precioRepository: PrecioRepository;

  constructor(precioRepository: PrecioRepository) {
    this.precioRepository = precioRepository;
  }

  async execute(idProducto: number): Promise<Precio[]> {
    const precios = await this.precioRepository.listarPorProducto(idProducto);
    return [...precios].sort((a, b) => a.precioEfectivo - b.precioEfectivo);
  }
}

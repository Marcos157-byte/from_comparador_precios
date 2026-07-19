import type { ComparadorRepository } from '@/domain/ports/comparador-repository.port';
import type { ListaComparacionDetalle } from '@/domain/entities/lista-comparacion.entity';

export class ObtenerListaUseCase {
  private readonly comparadorRepository: ComparadorRepository;

  constructor(comparadorRepository: ComparadorRepository) {
    this.comparadorRepository = comparadorRepository;
  }

  execute(id: number): Promise<ListaComparacionDetalle> {
    return this.comparadorRepository.obtenerLista(id);
  }
}

import type { ComparadorRepository } from '@/domain/ports/comparador-repository.port';
import type { ListaComparacionDetalle } from '@/domain/entities/lista-comparacion.entity';

export class QuitarItemUseCase {
  private readonly comparadorRepository: ComparadorRepository;

  constructor(comparadorRepository: ComparadorRepository) {
    this.comparadorRepository = comparadorRepository;
  }

  async execute(itemId: number, listaId: number): Promise<ListaComparacionDetalle> {
    await this.comparadorRepository.eliminarItem(itemId);
    return this.comparadorRepository.obtenerLista(listaId);
  }
}

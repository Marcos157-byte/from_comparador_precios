import type { ComparadorRepository } from '@/domain/ports/comparador-repository.port';
import type { ListaComparacionResumen } from '@/domain/entities/lista-comparacion.entity';

export class RenombrarListaUseCase {
  private readonly comparadorRepository: ComparadorRepository;

  constructor(comparadorRepository: ComparadorRepository) {
    this.comparadorRepository = comparadorRepository;
  }

  execute(id: number, nuevoNombre: string): Promise<ListaComparacionResumen> {
    return this.comparadorRepository.renombrarLista(id, nuevoNombre);
  }
}

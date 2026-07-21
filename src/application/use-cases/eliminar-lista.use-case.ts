import type { ComparadorRepository } from '@/domain/ports/comparador-repository.port';

export class EliminarListaUseCase {
  private readonly comparadorRepository: ComparadorRepository;

  constructor(comparadorRepository: ComparadorRepository) {
    this.comparadorRepository = comparadorRepository;
  }

  execute(id: number): Promise<void> {
    return this.comparadorRepository.eliminarLista(id);
  }
}

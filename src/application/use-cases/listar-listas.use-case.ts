import type { ComparadorRepository } from '@/domain/ports/comparador-repository.port';
import type { ListaComparacionResumen } from '@/domain/entities/lista-comparacion.entity';

export class ListarListasUseCase {
  private readonly comparadorRepository: ComparadorRepository;

  constructor(comparadorRepository: ComparadorRepository) {
    this.comparadorRepository = comparadorRepository;
  }

  execute(): Promise<ListaComparacionResumen[]> {
    return this.comparadorRepository.listarListas();
  }
}

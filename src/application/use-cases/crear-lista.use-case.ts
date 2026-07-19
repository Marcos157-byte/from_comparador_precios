import type { ComparadorRepository } from '@/domain/ports/comparador-repository.port';
import type { ListaComparacionDetalle } from '@/domain/entities/lista-comparacion.entity';

export class CrearListaUseCase {
  private readonly comparadorRepository: ComparadorRepository;

  constructor(comparadorRepository: ComparadorRepository) {
    this.comparadorRepository = comparadorRepository;
  }

  execute(nombre: string): Promise<ListaComparacionDetalle> {
    return this.comparadorRepository.crearLista(nombre);
  }
}

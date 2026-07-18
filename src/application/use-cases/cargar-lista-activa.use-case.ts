import type { ComparadorRepository } from '@/domain/ports/comparador-repository.port';
import type { ListaComparacionDetalle } from '@/domain/entities/lista-comparacion.entity';

export class CargarListaActivaUseCase {
  private readonly comparadorRepository: ComparadorRepository;

  constructor(comparadorRepository: ComparadorRepository) {
    this.comparadorRepository = comparadorRepository;
  }

  async execute(): Promise<ListaComparacionDetalle | null> {
    const listas = await this.comparadorRepository.listarListas();
    if (listas.length === 0) return null;
    return this.comparadorRepository.obtenerLista(listas[0].id);
  }
}

import type { ComparadorRepository } from '@/domain/ports/comparador-repository.port';

export class AsegurarListaActivaUseCase {
  private readonly comparadorRepository: ComparadorRepository;

  constructor(comparadorRepository: ComparadorRepository) {
    this.comparadorRepository = comparadorRepository;
  }

  async execute(): Promise<number> {
    const listas = await this.comparadorRepository.listarListas();
    if (listas.length > 0) return listas[0].id;
    const nueva = await this.comparadorRepository.crearLista();
    return nueva.id;
  }
}

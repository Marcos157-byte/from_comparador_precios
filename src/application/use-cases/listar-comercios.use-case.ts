import type { ComercioRepository } from '@/domain/ports/comercio-repository.port';
import type { ComercioLigero } from '@/domain/entities/comercio-ligero.entity';

export class ListarComerciosUseCase {
  private readonly comercioRepository: ComercioRepository;

  constructor(comercioRepository: ComercioRepository) {
    this.comercioRepository = comercioRepository;
  }

  execute(): Promise<ComercioLigero[]> {
    return this.comercioRepository.listar();
  }
}

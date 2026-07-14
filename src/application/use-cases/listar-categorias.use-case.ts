import type { CategoriaRepository } from '@/domain/ports/categoria-repository.port';
import type { Categoria } from '@/domain/entities/categoria.entity';

export class ListarCategoriasUseCase {
  private readonly categoriaRepository: CategoriaRepository;

  constructor(categoriaRepository: CategoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  execute(): Promise<Categoria[]> {
    return this.categoriaRepository.listar();
  }
}

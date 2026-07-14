import type { Categoria } from '../entities/categoria.entity';

export interface CategoriaRepository {
  listar(): Promise<Categoria[]>;
}

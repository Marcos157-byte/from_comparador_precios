import { CategoriaHttpAdapter } from '../adapters/categoria-http.adapter';
import { ListarCategoriasUseCase } from '@/application/use-cases/listar-categorias.use-case';

const categoriaRepository = new CategoriaHttpAdapter();

export const categoriaUseCases = {
  listar: new ListarCategoriasUseCase(categoriaRepository),
};

import { ProductoHttpAdapter } from '../adapters/producto-http.adapter';
import { ListarProductosUseCase } from '@/application/use-cases/listar-productos.use-case';

const productoRepository = new ProductoHttpAdapter();

export const productoUseCases = {
  listar: new ListarProductosUseCase(productoRepository),
};

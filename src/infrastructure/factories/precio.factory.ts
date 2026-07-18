import { PrecioHttpAdapter } from '../adapters/precio-http.adapter';
import { ListarPreciosPorProductoUseCase } from '@/application/use-cases/listar-precios-por-producto.use-case';

const precioRepository = new PrecioHttpAdapter();

export const precioUseCases = {
  listarPorProducto: new ListarPreciosPorProductoUseCase(precioRepository),
};

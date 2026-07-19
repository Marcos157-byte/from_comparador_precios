import { ComercioHttpAdapter } from '../adapters/comercio-http.adapter';
import { ListarComerciosUseCase } from '@/application/use-cases/listar-comercios.use-case';

const comercioRepository = new ComercioHttpAdapter();

export const comercioUseCases = {
  listar: new ListarComerciosUseCase(comercioRepository),
};

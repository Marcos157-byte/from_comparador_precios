import { ComparadorHttpAdapter } from '../adapters/comparador-http.adapter';
import { AsegurarListaActivaUseCase } from '@/application/use-cases/asegurar-lista-activa.use-case';
import { AgregarProductoALista } from '@/application/use-cases/agregar-producto-a-lista.use-case';
import { QuitarItemUseCase } from '@/application/use-cases/quitar-item.use-case';
import { CargarListaActivaUseCase } from '@/application/use-cases/cargar-lista-activa.use-case';
import { ListarListasUseCase } from '@/application/use-cases/listar-listas.use-case';
import { ObtenerListaUseCase } from '@/application/use-cases/obtener-lista.use-case';
import { CrearListaUseCase } from '@/application/use-cases/crear-lista.use-case';

const comparadorRepository = new ComparadorHttpAdapter();
const asegurarListaActivaUseCase = new AsegurarListaActivaUseCase(comparadorRepository);

export const comparadorUseCases = {
  asegurarListaActiva: asegurarListaActivaUseCase,
  agregarProducto: new AgregarProductoALista(comparadorRepository, asegurarListaActivaUseCase),
  quitarItem: new QuitarItemUseCase(comparadorRepository),
  cargarListaActiva: new CargarListaActivaUseCase(comparadorRepository),
  listarListas: new ListarListasUseCase(comparadorRepository),
  obtenerLista: new ObtenerListaUseCase(comparadorRepository),
  crearLista: new CrearListaUseCase(comparadorRepository),
};

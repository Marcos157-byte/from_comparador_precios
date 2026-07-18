import type { ComparadorRepository } from '@/domain/ports/comparador-repository.port';
import type { ListaComparacionDetalle } from '@/domain/entities/lista-comparacion.entity';
import type { AsegurarListaActivaUseCase } from './asegurar-lista-activa.use-case';

export interface AgregarProductoResultado {
  listaId: number;
  detalle: ListaComparacionDetalle;
}

export class AgregarProductoALista {
  private readonly comparadorRepository: ComparadorRepository;
  private readonly asegurarListaActiva: AsegurarListaActivaUseCase;

  constructor(comparadorRepository: ComparadorRepository, asegurarListaActiva: AsegurarListaActivaUseCase) {
    this.comparadorRepository = comparadorRepository;
    this.asegurarListaActiva = asegurarListaActiva;
  }

  async execute(
    listaIdConocida: number | null,
    idProducto: number,
    idComercio: number,
  ): Promise<AgregarProductoResultado> {
    const listaId = listaIdConocida ?? (await this.asegurarListaActiva.execute());
    await this.comparadorRepository.agregarItem(listaId, idProducto, idComercio);
    const detalle = await this.comparadorRepository.obtenerLista(listaId);
    return { listaId, detalle };
  }
}

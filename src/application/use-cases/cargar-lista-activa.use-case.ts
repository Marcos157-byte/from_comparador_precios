import type { ComparadorRepository } from '@/domain/ports/comparador-repository.port';
import type { ListaComparacionDetalle, ListaComparacionResumen } from '@/domain/entities/lista-comparacion.entity';

export interface CargarListaActivaResultado {
  listas: ListaComparacionResumen[];
  detalle: ListaComparacionDetalle | null;
}

export class CargarListaActivaUseCase {
  private readonly comparadorRepository: ComparadorRepository;

  constructor(comparadorRepository: ComparadorRepository) {
    this.comparadorRepository = comparadorRepository;
  }

  async execute(idPreferido?: number | null): Promise<CargarListaActivaResultado> {
    const listas = await this.comparadorRepository.listarListas();
    const preferidaValida = idPreferido != null && listas.some((l) => l.id === idPreferido);
    const idActivo = preferidaValida ? (idPreferido as number) : (listas[0]?.id ?? null);
    const detalle = idActivo !== null ? await this.comparadorRepository.obtenerLista(idActivo) : null;
    return { listas, detalle };
  }
}

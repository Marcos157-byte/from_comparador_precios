import type {
  ListaComparacionDetalle,
  ListaComparacionResumen,
} from '../entities/lista-comparacion.entity';

export interface ComparadorRepository {
  listarListas(): Promise<ListaComparacionResumen[]>;
  crearLista(nombre?: string): Promise<ListaComparacionDetalle>;
  obtenerLista(id: number): Promise<ListaComparacionDetalle>;
  agregarItem(listaId: number, idProducto: number, idComercio: number): Promise<void>;
  eliminarItem(itemId: number): Promise<void>;
}

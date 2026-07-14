import type { Producto } from './producto.entity';
import type { ComercioLigero } from './comercio-ligero.entity';

export interface ItemComparacion {
  id: number;
  productoDetalle: Producto;
  comercioDetalle: ComercioLigero;
  precioMomento: number;
}

export interface TotalPorComercio {
  idComercio: number;
  nombreComercio: string;
  cantidadProductos: number;
  total: number;
}

export interface ListaComparacionResumen {
  id: number;
  nombre: string;
}

export interface ListaComparacionDetalle {
  id: number;
  nombre: string;
  items: ItemComparacion[];
  totalesPorComercio: TotalPorComercio[];
}

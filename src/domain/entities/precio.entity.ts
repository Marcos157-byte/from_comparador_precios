import type { Producto } from './producto.entity';
import type { ComercioLigero } from './comercio-ligero.entity';

export interface Precio {
  id: number;
  idProducto: number;
  idComercio: number;
  precioActual: number;
  precioOferta: number | null;
  enOferta: boolean;
  precioEfectivo: number;
  fechaActualizacion: string;
  productoDetalle: Producto | null;
  comercioDetalle: ComercioLigero | null;
}

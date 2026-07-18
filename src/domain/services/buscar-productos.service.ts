import type { Producto } from '../entities/producto.entity';

export function buscarProductos(productos: Producto[], texto: string): Producto[] {
  const busqueda = texto.toLowerCase();
  return productos.filter(
    (p) => p.nombre.toLowerCase().includes(busqueda) || p.marca.toLowerCase().includes(busqueda),
  );
}

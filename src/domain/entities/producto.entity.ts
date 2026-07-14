export interface CategoriaDetalle {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  codigoBarras: string | null;
  descripcion: string;
  unidadMedida: string;
  idCategoria: number | null;
  imagenUrl: string | null;
  categoriaDetalle: CategoriaDetalle | null;
}

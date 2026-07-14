export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  categoriaPadre: number | null;
}

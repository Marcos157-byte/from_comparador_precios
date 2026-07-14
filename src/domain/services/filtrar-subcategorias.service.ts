import type { Categoria } from '../entities/categoria.entity';

export function filtrarSubcategorias(categorias: Categoria[], idPadre: number): Categoria[] {
  return categorias.filter((c) => c.categoriaPadre === idPadre);
}

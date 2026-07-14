import { useParams } from 'react-router-dom';

export function CatalogPage() {
  const { tipo, idCategoria } = useParams<{ tipo: string; idCategoria: string }>();
  return (
    <div className="p-6">
      Catálogo — tipo: {tipo}, categoría: {idCategoria} — próximamente
    </div>
  );
}

// El backend pagina por offset sin un orden 100% estable, por lo que un mismo
// id puede aparecer en dos páginas consecutivas al scrollear (confirmado con
// curl contra /kache/precios/?comercio=1: id_precio 17 se repite entre las
// páginas 5 y 6). Se filtra defensivamente al acumular, sin depender de que
// el backend lo resuelva.
export function dedupeById<T extends { id: number }>(existentes: T[], nuevos: T[]): T[] {
  const idsExistentes = new Set(existentes.map((item) => item.id));
  return [...existentes, ...nuevos.filter((item) => !idsExistentes.has(item.id))];
}

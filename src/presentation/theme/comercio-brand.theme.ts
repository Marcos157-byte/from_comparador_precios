const brandColors: Record<string, string> = {
  supermaxi: '#E3000F',
  coral: '#003087',
  fybeca: '#00843D',
  'sana sana': '#0066CC',
  kywi: '#E87722',
};

export function comercioBrandColor(nombreComercio: string, colorTipo: string): string {
  return brandColors[nombreComercio.toLowerCase()] ?? colorTipo;
}

// Coral y Ferrisariato usan un logo en blanco puro (pensado para fondo oscuro):
// sobre una placa blanca desaparecen, así que necesitan la placa de color de
// marca en vez de la blanca por defecto. Son 2 casos fijos y conocidos, no una
// lista que vaya a crecer con cada comercio nuevo.
const LOGOS_BLANCOS = new Set(['coral', 'ferrisariato']);

export function comercioLogoEsBlanco(nombreComercio: string): boolean {
  return LOGOS_BLANCOS.has(nombreComercio.toLowerCase());
}

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

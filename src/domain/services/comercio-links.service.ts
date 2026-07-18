const UTM = 'utm_source=kache&utm_medium=app&utm_campaign=comparador';

const DELIVERY_URLS: Record<string, (q: string) => string> = {
  kywi: (q) => `https://www.kywi.com.ec/${q}?_q=${q}&map=ft&${UTM}`,
  ferrisariato: (q) => `https://www.ferrisariato.com/?s=${q}&${UTM}`,
  fybeca: (q) => `https://www.fybeca.com/?q=${q}&${UTM}`,
  medicity: (q) => `https://www.farmaciasmedicity.com/?q=${q}&${UTM}`,
  supermaxi: (q) => `https://www.supermaxi.com/?s=${q}&${UTM}`,
  coral: (q) => `https://coralhipermercados.com/catalogsearch/result/?q=${q}&${UTM}`,
};

const MAPS_URLS: Record<string, string> = {
  kywi: 'https://maps.google.com/?q=Kywi+Quito+Ecuador',
  ferrisariato: 'https://maps.google.com/?q=Ferrisariato+Quito+Ecuador',
  fybeca: 'https://maps.google.com/?q=Fybeca+Quito+Ecuador',
  medicity: 'https://maps.google.com/?q=Farmacias+Medicity+Quito+Ecuador',
  supermaxi: 'https://maps.google.com/?q=Supermaxi+Quito+Ecuador',
  coral: 'https://maps.google.com/?q=Coral+Hipermercados+Quito+Ecuador',
};

const COMERCIOS_CON_DELIVERY = ['kywi', 'fybeca', 'supermaxi', 'coral'];

export function urlDelivery(nombreComercio: string, nombreProducto: string): string | null {
  const constructor = DELIVERY_URLS[nombreComercio.toLowerCase()];
  if (!constructor) return null;
  return constructor(encodeURIComponent(nombreProducto));
}

export function urlMaps(nombreComercio: string): string | null {
  return MAPS_URLS[nombreComercio.toLowerCase()] ?? null;
}

export function tieneDelivery(nombreComercio: string): boolean {
  return COMERCIOS_CON_DELIVERY.includes(nombreComercio.toLowerCase());
}

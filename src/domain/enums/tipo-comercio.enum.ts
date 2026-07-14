export const TipoComercio = {
  Supermercado: 'supermercado',
  Farmacia: 'farmacia',
  Ferreteria: 'ferreteria',
} as const;

export type TipoComercio = (typeof TipoComercio)[keyof typeof TipoComercio];

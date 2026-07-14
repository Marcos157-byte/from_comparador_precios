import { HardHat, Pill, ShoppingBasket, type LucideIcon } from 'lucide-react';
import { TipoComercio } from '@/domain/enums/tipo-comercio.enum';

interface TipoComercioUi {
  label: string;
  color: string;
  emoji: string;
  idCategoriaPadre: number;
  icon: LucideIcon;
}

export const tipoComercioUi: Record<TipoComercio, TipoComercioUi> = {
  [TipoComercio.Supermercado]: {
    label: 'Supermercados',
    color: '#4CAF50',
    emoji: '🛒',
    idCategoriaPadre: 8,
    icon: ShoppingBasket,
  },
  [TipoComercio.Farmacia]: {
    label: 'Farmacias',
    color: '#26C6DA',
    emoji: '💊',
    idCategoriaPadre: 9,
    icon: Pill,
  },
  [TipoComercio.Ferreteria]: {
    label: 'Ferreterías',
    color: '#EA580C',
    emoji: '🔧',
    idCategoriaPadre: 10,
    icon: HardHat,
  },
};

export function tipoComercioFromValue(value: string): TipoComercio {
  return (Object.values(TipoComercio) as string[]).includes(value)
    ? (value as TipoComercio)
    : TipoComercio.Supermercado;
}

export function tipoComercioFromIdCategoriaPadre(idCategoriaPadre: number): TipoComercio | undefined {
  return (Object.values(TipoComercio) as TipoComercio[]).find(
    (tipo) => tipoComercioUi[tipo].idCategoriaPadre === idCategoriaPadre,
  );
}

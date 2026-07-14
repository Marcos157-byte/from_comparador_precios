interface RomboDef {
  left: number;
  top: number;
  w: number;
  color: string;
}

// Réplica de TiraRombosCentradoPainter (fondo_patron.dart): mismo painter que
// usa Flutter tanto en Login (200x30) como en Home (180x50) — el offsetX de
// centrado depende del ancho recibido, igual que `size.width` en Flutter.
const ESCALA = 0.7;

const rombosDef: RomboDef[] = [
  { left: -6, top: 3, w: 30, color: '#FF8F00' },
  { left: 12, top: -1, w: 16, color: '#FDD835' },
  { left: 20, top: 20, w: 10, color: '#FFCA28' },
  { left: 28, top: 8, w: 22, color: '#FFB300' },
  { left: 40, top: 2, w: 8, color: '#FFF176' },
  { left: 44, top: 18, w: 14, color: '#FFD600' },
  { left: 58, top: 2, w: 32, color: '#0D47A1' },
  { left: 72, top: -2, w: 18, color: '#1565C0' },
  { left: 82, top: 22, w: 11, color: '#1976D2' },
  { left: 90, top: 6, w: 24, color: '#1E88E5' },
  { left: 105, top: 1, w: 9, color: '#42A5F5' },
  { left: 108, top: 18, w: 14, color: '#90CAF9' },
  { left: 124, top: 3, w: 30, color: '#B71C1C' },
  { left: 138, top: -2, w: 18, color: '#C62828' },
  { left: 148, top: 22, w: 10, color: '#D32F2F' },
  { left: 156, top: 5, w: 26, color: '#E53935' },
  { left: 172, top: 1, w: 8, color: '#EF5350' },
  { left: 175, top: 20, w: 15, color: '#FF8A80' },
];

interface TiraRombosCentradaProps {
  width?: number;
  height?: number;
  className?: string;
}

export function TiraRombosCentrada({ width = 200, height = 30, className }: TiraRombosCentradaProps) {
  const offsetX = (width - 105) / 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
    >
      {rombosDef.map((r, i) => {
        const w = r.w * ESCALA;
        const left = r.left * ESCALA + offsetX;
        const top = r.top * ESCALA;
        const cx = left + w / 14;
        const cy = top + w / 2;
        return (
          <rect
            key={i}
            x={cx - w / 2}
            y={cy - w / 2}
            width={w}
            height={w}
            fill={r.color}
            transform={`rotate(45 ${cx} ${cy})`}
          />
        );
      })}
    </svg>
  );
}

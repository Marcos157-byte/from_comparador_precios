import { cn } from '@/presentation/utils/cn';

// Réplica de _PatronPainter (fondo_patron.dart): mismo color/opacidad/espaciado,
// pero tileado con un <pattern> SVG en vez de dibujar cientos de íconos sueltos.
const tile = [
  { x: 27.5, y: 27.5, icon: '🛒', angle: 15 },
  { x: 82.5, y: 27.5, icon: '💊', angle: -20 },
  { x: 0, y: 82.5, icon: '🔧', angle: 40 },
  { x: 55, y: 82.5, icon: '💰', angle: -10 },
  { x: 110, y: 82.5, icon: '🔧', angle: 40 },
];

export function FondoPatron({ className }: { className?: string }) {
  return (
    <svg className={cn('pointer-events-none absolute inset-0 size-full', className)} aria-hidden="true">
      <defs>
        <pattern id="fondo-patron" width={110} height={110} patternUnits="userSpaceOnUse">
          {tile.map((item, i) => (
            <text
              key={i}
              x={item.x}
              y={item.y}
              fontSize={18}
              fill="#D4A843"
              opacity={0.1}
              transform={`rotate(${item.angle} ${item.x} ${item.y})`}
            >
              {item.icon}
            </text>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#fondo-patron)" />
    </svg>
  );
}

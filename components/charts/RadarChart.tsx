'use client';

import { useInView } from './useInView';

interface Axis {
  label: string;
  value: number; // 0..1
}

interface Props {
  data: Axis[];
  size?: number;
}

/** Custom animated radar/spider chart — pure SVG, brand-themed. */
export default function RadarChart({ data, size = 360 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 72;
  const n = data.length;
  const rings = [0.25, 0.5, 0.75, 1];

  const point = (i: number, radius: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  };

  const gridPoly = (factor: number) =>
    data.map((_, i) => point(i, r * factor).join(',')).join(' ');

  const dataPoly = data
    .map((d, i) => point(i, r * (inView ? d.value : 0)).join(','))
    .join(' ');

  return (
    <div ref={ref} className="flex justify-center px-6">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#76b900" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#76b900" stopOpacity="0.12" />
          </radialGradient>
        </defs>

        {/* grid rings */}
        {rings.map((f) => (
          <polygon
            key={f}
            points={gridPoly(f)}
            fill="none"
            stroke="rgba(118,185,0,0.14)"
            strokeWidth="1"
          />
        ))}

        {/* axes + labels */}
        {data.map((d, i) => {
          const [x, y] = point(i, r);
          const [lx, ly] = point(i, r + 26);
          return (
            <g key={d.label}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(118,185,0,0.12)" strokeWidth="1" />
              <text
                x={lx}
                y={ly}
                textAnchor={Math.abs(lx - cx) < 4 ? 'middle' : lx > cx ? 'start' : 'end'}
                dominantBaseline="middle"
                className="fill-[#9aa894] font-mono"
                style={{ fontSize: 11 }}
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* data polygon */}
        <polygon
          points={dataPoly}
          fill="url(#radar-fill)"
          stroke="#76b900"
          strokeWidth="2"
          style={{ transition: 'all 1s cubic-bezier(0.22,1,0.36,1)' }}
        />
        {/* vertices */}
        {data.map((d, i) => {
          const [x, y] = point(i, r * (inView ? d.value : 0));
          return (
            <circle
              key={d.label}
              cx={x}
              cy={y}
              r="3.5"
              fill="#c9ec8a"
              style={{ transition: 'all 1s cubic-bezier(0.22,1,0.36,1)' }}
            />
          );
        })}
      </svg>
    </div>
  );
}

interface Props {
  size?: number;
  className?: string;
  /** when true, renders the rounded badge background */
  badge?: boolean;
}

/**
 * Custom monogram combining the letters of "Ruben Otano":
 * an "O" rendered as the outer ring, an "R" formed inside it.
 */
export default function Logo({ size = 32, className = '', badge = true }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      role="img"
      aria-label="Ruben Otano monogram"
    >
      <defs>
        <linearGradient id="ro-grad" x1="14" y1="14" x2="86" y2="86" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c9ec8a" />
          <stop offset="0.5" stopColor="#76b900" />
          <stop offset="1" stopColor="#477000" />
        </linearGradient>
      </defs>

      {badge && (
        <rect x="2" y="2" width="96" height="96" rx="24" fill="#0b0f0c" stroke="#76b900" strokeOpacity="0.25" strokeWidth="2" />
      )}

      {/* O — outer ring */}
      <circle cx="50" cy="50" r="33" stroke="url(#ro-grad)" strokeWidth="8" />

      {/* R — stem, bowl, leg, sharing the ring's interior */}
      <g stroke="url(#ro-grad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M40 30 V70" />
        <path d="M40 30 H53 a11 11 0 0 1 0 22 H40" />
        <path d="M49 52 L62 70" />
      </g>
    </svg>
  );
}

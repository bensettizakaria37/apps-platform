export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="url(#grad)"/>
      {/* Engrenage */}
      <g transform="translate(16,16)">
        <circle cx="0" cy="0" r="4" fill="white"/>
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = Math.cos(rad) * 5;
          const y1 = Math.sin(rad) * 5;
          const x2 = Math.cos(rad) * 8;
          const y2 = Math.sin(rad) * 8;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2.5" strokeLinecap="round"/>;
        })}
        <circle cx="0" cy="0" r="4" fill="white"/>
        <circle cx="0" cy="0" r="2" fill="url(#grad)"/>
      </g>
      {/* Éclair */}
      <path d="M17 6 L13 14 L16 14 L15 20 L19 12 L16 12 Z" fill="white" opacity="0.95"/>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

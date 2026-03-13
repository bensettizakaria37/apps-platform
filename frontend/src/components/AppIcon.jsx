const ICONS = {
  pdf: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#pdf_bg)"/>
      <rect x="10" y="6" width="20" height="26" rx="2" fill="white" opacity="0.95"/>
      <rect x="10" y="6" width="20" height="26" rx="2" fill="url(#pdf_doc)" opacity="0.15"/>
      <path d="M30 6 L38 14 L30 14 Z" fill="white" opacity="0.7"/>
      <rect x="30" y="14" width="8" height="18" rx="0 2 2 0" fill="white" opacity="0.85"/>
      <path d="M30 6 L30 14 L38 14" fill="none" stroke="rgba(220,80,80,0.4)" strokeWidth="0.5"/>
      <rect x="14" y="16" width="12" height="1.5" rx="0.75" fill="#e05555" opacity="0.8"/>
      <rect x="14" y="20" width="10" height="1.5" rx="0.75" fill="#e05555" opacity="0.5"/>
      <rect x="14" y="24" width="8" height="1.5" rx="0.75" fill="#e05555" opacity="0.3"/>
      <rect x="22" y="28" width="18" height="14" rx="4" fill="url(#pdf_badge)"/>
      <text x="31" y="38" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="Arial">W</text>
      <defs>
        <linearGradient id="pdf_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#ff8a80"/>
          <stop offset="100%" stopColor="#d32f2f"/>
        </linearGradient>
        <linearGradient id="pdf_doc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white"/>
          <stop offset="100%" stopColor="#ffcdd2"/>
        </linearGradient>
        <linearGradient id="pdf_badge" x1="22" y1="28" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1565c0"/>
          <stop offset="100%" stopColor="#0d47a1"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  ocr: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#ocr_bg)"/>
      <rect x="8" y="10" width="22" height="28" rx="3" fill="white" opacity="0.92"/>
      <rect x="12" y="15" width="14" height="1.5" rx="0.75" fill="#7c4dff" opacity="0.5"/>
      <rect x="12" y="19" width="10" height="1.5" rx="0.75" fill="#7c4dff" opacity="0.3"/>
      <rect x="12" y="23" width="12" height="1.5" rx="0.75" fill="#7c4dff" opacity="0.4"/>
      <rect x="12" y="27" width="8" height="1.5" rx="0.75" fill="#7c4dff" opacity="0.25"/>
      <circle cx="33" cy="27" r="9" fill="url(#ocr_lens)" opacity="0.95"/>
      <circle cx="33" cy="27" r="5.5" fill="none" stroke="white" strokeWidth="2"/>
      <circle cx="33" cy="27" r="2" fill="white" opacity="0.6"/>
      <path d="M39 33 L43 37" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="ocr_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#b388ff"/>
          <stop offset="100%" stopColor="#6200ea"/>
        </linearGradient>
        <linearGradient id="ocr_lens" x1="24" y1="18" x2="42" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ce93d8"/>
          <stop offset="100%" stopColor="#7b1fa2"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  compress: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#cmp_bg)"/>
      <rect x="9" y="8" width="14" height="18" rx="2" fill="white" opacity="0.9"/>
      <rect x="9" y="8" width="14" height="18" rx="2" fill="url(#cmp_doc1)" opacity="0.2"/>
      <rect x="25" y="22" width="14" height="14" rx="2" fill="white" opacity="0.75"/>
      <path d="M20 20 L28 28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
      <path d="M24 13 L24 19 M21 16 L24 19 L27 16" stroke="url(#cmp_arr)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M30 27 L30 33 M27 30 L30 33 L33 30" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
      <defs>
        <linearGradient id="cmp_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#80cbc4"/>
          <stop offset="100%" stopColor="#00695c"/>
        </linearGradient>
        <linearGradient id="cmp_doc1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white"/>
          <stop offset="100%" stopColor="#b2dfdb"/>
        </linearGradient>
        <linearGradient id="cmp_arr" x1="24" y1="13" x2="24" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white"/>
          <stop offset="100%" stopColor="#e0f2f1"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  duplicates: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#dup_bg)"/>
      <rect x="8" y="12" width="24" height="4" rx="2" fill="white" opacity="0.9"/>
      <rect x="8" y="19" width="24" height="4" rx="2" fill="white" opacity="0.4"/>
      <rect x="8" y="26" width="24" height="4" rx="2" fill="white" opacity="0.9"/>
      <rect x="8" y="33" width="16" height="4" rx="2" fill="white" opacity="0.4"/>
      <circle cx="36" cy="32" r="9" fill="url(#dup_check)"/>
      <path d="M32 32 L35 35 L40 29" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <defs>
        <linearGradient id="dup_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#ffcc80"/>
          <stop offset="100%" stopColor="#e65100"/>
        </linearGradient>
        <linearGradient id="dup_check" x1="27" y1="23" x2="45" y2="41" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#66bb6a"/>
          <stop offset="100%" stopColor="#2e7d32"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  removelines: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#rl_bg)"/>
      <rect x="8" y="11" width="32" height="4" rx="2" fill="white" opacity="0.9"/>
      <rect x="8" y="19" width="32" height="4" rx="2" fill="white" opacity="0.35"/>
      <rect x="8" y="27" width="32" height="4" rx="2" fill="white" opacity="0.9"/>
      <rect x="8" y="35" width="22" height="4" rx="2" fill="white" opacity="0.6"/>
      <path d="M6 21 L42 21" stroke="white" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8"/>
      <circle cx="36" cy="21" r="7" fill="url(#rl_x)"/>
      <path d="M33 18 L39 24 M39 18 L33 24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="rl_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#f48fb1"/>
          <stop offset="100%" stopColor="#c2185b"/>
        </linearGradient>
        <linearGradient id="rl_x" x1="29" y1="14" x2="43" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef5350"/>
          <stop offset="100%" stopColor="#b71c1c"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  replacer: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#rep_bg)"/>
      <rect x="7" y="10" width="15" height="12" rx="3" fill="white" opacity="0.9"/>
      <text x="14.5" y="19" textAnchor="middle" fill="#0277bd" fontSize="7" fontWeight="800" fontFamily="Arial">AB</text>
      <rect x="26" y="26" width="15" height="12" rx="3" fill="white" opacity="0.9"/>
      <text x="33.5" y="35" textAnchor="middle" fill="#0277bd" fontSize="7" fontWeight="800" fontFamily="Arial">CD</text>
      <path d="M26 16 Q36 16 36 22 L34 20 M36 22 L38 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8"/>
      <path d="M22 32 Q12 32 12 26 L10 28 M12 26 L14 28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8"/>
      <defs>
        <linearGradient id="rep_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#81d4fa"/>
          <stop offset="100%" stopColor="#0277bd"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  secret: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#sec_bg)"/>
      <rect x="12" y="22" width="24" height="20" rx="4" fill="white" opacity="0.92"/>
      <rect x="12" y="22" width="24" height="20" rx="4" fill="url(#sec_door)" opacity="0.1"/>
      <path d="M17 22 V16 A7 7 0 0 1 31 16 V22" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <circle cx="24" cy="32" r="4" fill="url(#sec_key)"/>
      <rect x="22.5" y="33" width="3" height="5" rx="1.5" fill="#455a64"/>
      <defs>
        <linearGradient id="sec_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#78909c"/>
          <stop offset="100%" stopColor="#263238"/>
        </linearGradient>
        <linearGradient id="sec_door" x1="12" y1="22" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white"/>
          <stop offset="100%" stopColor="#cfd8dc"/>
        </linearGradient>
        <linearGradient id="sec_key" x1="20" y1="28" x2="28" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffd54f"/>
          <stop offset="100%" stopColor="#f57f17"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  ssl: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#ssl_bg)"/>
      <path d="M24 6 L38 12 V26 C38 35 31 41 24 44 C17 41 10 35 10 26 V12Z" fill="white" opacity="0.15"/>
      <path d="M24 6 L38 12 V26 C38 35 31 41 24 44 C17 41 10 35 10 26 V12Z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M24 10 L35 15 V26 C35 33 29.5 38 24 40.5 C18.5 38 13 33 13 26 V15Z" fill="white" opacity="0.9"/>
      <path d="M18 26 L22 30 L30 22" stroke="url(#ssl_check)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <defs>
        <linearGradient id="ssl_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#69f0ae"/>
          <stop offset="100%" stopColor="#00695c"/>
        </linearGradient>
        <linearGradient id="ssl_check" x1="18" y1="22" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00897b"/>
          <stop offset="100%" stopColor="#004d40"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  csr: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#csr_bg)"/>
      <rect x="10" y="7" width="20" height="26" rx="3" fill="white" opacity="0.92"/>
      <rect x="14" y="13" width="12" height="2" rx="1" fill="#00838f" opacity="0.7"/>
      <rect x="14" y="18" width="9" height="2" rx="1" fill="#00838f" opacity="0.5"/>
      <rect x="14" y="23" width="11" height="2" rx="1" fill="#00838f" opacity="0.4"/>
      <rect x="14" y="28" width="7" height="2" rx="1" fill="#00838f" opacity="0.3"/>
      <circle cx="33" cy="30" r="10" fill="url(#csr_badge)"/>
      <path d="M29 30 A4 4 0 1 1 37 30" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <rect x="27" y="30" width="12" height="8" rx="2" fill="white" opacity="0.3"/>
      <rect x="31" y="28" width="4" height="2" rx="1" fill="white"/>
      <defs>
        <linearGradient id="csr_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#80deea"/>
          <stop offset="100%" stopColor="#006064"/>
        </linearGradient>
        <linearGradient id="csr_badge" x1="23" y1="20" x2="43" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#26c6da"/>
          <stop offset="100%" stopColor="#00838f"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  certdecoder: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#cert_bg)"/>
      <circle cx="24" cy="20" r="11" fill="white" opacity="0.92"/>
      <circle cx="24" cy="20" r="11" fill="url(#cert_circle)" opacity="0.1"/>
      <path d="M24 10 L26 16 L32 16.5 L27.5 21 L29 27 L24 24 L19 27 L20.5 21 L16 16.5 L22 16Z" fill="url(#cert_star)"/>
      <rect x="14" y="34" width="20" height="3" rx="1.5" fill="white" opacity="0.8"/>
      <rect x="17" y="39" width="14" height="3" rx="1.5" fill="white" opacity="0.5"/>
      <defs>
        <linearGradient id="cert_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#ffe082"/>
          <stop offset="100%" stopColor="#e65100"/>
        </linearGradient>
        <linearGradient id="cert_circle" x1="13" y1="9" x2="35" y2="31" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff9c4"/>
          <stop offset="100%" stopColor="#ffcc02"/>
        </linearGradient>
        <linearGradient id="cert_star" x1="16" y1="10" x2="32" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffd740"/>
          <stop offset="100%" stopColor="#ff6d00"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  whois: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#who_bg)"/>
      <circle cx="24" cy="24" r="15" fill="white" opacity="0.15"/>
      <circle cx="24" cy="24" r="15" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <ellipse cx="24" cy="24" rx="7" ry="15" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <line x1="9" y1="24" x2="39" y2="24" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      <line x1="11" y1="17" x2="37" y2="17" stroke="white" strokeWidth="1.2" opacity="0.45"/>
      <line x1="11" y1="31" x2="37" y2="31" stroke="white" strokeWidth="1.2" opacity="0.45"/>
      <circle cx="24" cy="24" r="4" fill="white" opacity="0.9"/>
      <defs>
        <linearGradient id="who_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#9fa8da"/>
          <stop offset="100%" stopColor="#283593"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  geopeeker: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#geo_bg)"/>
      <circle cx="24" cy="20" r="12" fill="white" opacity="0.15"/>
      <circle cx="24" cy="20" r="12" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <circle cx="24" cy="20" r="7" fill="white" opacity="0.9"/>
      <circle cx="24" cy="20" r="3.5" fill="url(#geo_dot)"/>
      <path d="M24 32 L24 42" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="24" cy="42" rx="5" ry="1.5" fill="white" opacity="0.3"/>
      <defs>
        <linearGradient id="geo_bg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#64b5f6"/>
          <stop offset="100%" stopColor="#0d47a1"/>
        </linearGradient>
        <linearGradient id="geo_dot" x1="20" y1="16" x2="28" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef5350"/>
          <stop offset="100%" stopColor="#b71c1c"/>
        </linearGradient>
      </defs>
    </svg>
  ),
};

export default function AppIcon({ id, size = 40 }) {
  const icon = ICONS[id];
  if (!icon) return null;
  return (
    <div style={{ width:`${size}px`, height:`${size}px`, flexShrink:0, borderRadius:`${size*0.25}px`, overflow:"hidden", boxShadow:"0 3px 10px rgba(0,0,0,0.2)" }}>
      {icon}
    </div>
  );
}

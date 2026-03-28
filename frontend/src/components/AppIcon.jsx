const G = ["#a29bfe","#6c5ce7"];

const ICONS = {
  pdf:         { g:G, icon:<><rect x="12" y="8" width="24" height="32" rx="3" fill="white" opacity="0.95"/><rect x="16" y="16" width="16" height="2.5" rx="1.25" fill="#6c5ce7"/><rect x="16" y="22" width="16" height="2.5" rx="1.25" fill="#6c5ce7" opacity="0.6"/><rect x="16" y="28" width="10" height="2.5" rx="1.25" fill="#6c5ce7" opacity="0.35"/></> },
  ocr:         { g:G, icon:<><rect x="9" y="9" width="30" height="30" rx="5" fill="white" opacity="0.15" stroke="white" strokeWidth="2"/><circle cx="19" cy="19" r="5.5" fill="white" opacity="0.95"/><path d="M27 33 L33 27 L37 31 L31 37Z" fill="white" opacity="0.9"/><line x1="9" y1="9" x2="14" y2="9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="9" y1="9" x2="9" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="39" y1="9" x2="34" y2="9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="39" y1="9" x2="39" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></> },
  compress:    { g:G, icon:<><rect x="12" y="8" width="24" height="32" rx="3" fill="white" opacity="0.95"/><path d="M24 16 L24 32" stroke="#6c5ce7" strokeWidth="2.5" strokeLinecap="round"/><path d="M18 22 L24 16 L30 22" stroke="#6c5ce7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M18 26 L24 32 L30 26" stroke="#6c5ce7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></> },
  duplicates:  { g:G, icon:<><rect x="9" y="12" width="22" height="3" rx="1.5" fill="white"/><rect x="9" y="19" width="22" height="3" rx="1.5" fill="white" opacity="0.4"/><rect x="9" y="26" width="22" height="3" rx="1.5" fill="white"/><rect x="9" y="33" width="16" height="3" rx="1.5" fill="white" opacity="0.4"/><circle cx="37" cy="34" r="8" fill="white"/><path d="M33 34 L36 37 L41 31" stroke="#6c5ce7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></> },
  removelines: { g:G, icon:<><rect x="9" y="12" width="30" height="3" rx="1.5" fill="white"/><rect x="9" y="19" width="30" height="3" rx="1.5" fill="white" opacity="0.35"/><rect x="9" y="26" width="30" height="3" rx="1.5" fill="white"/><rect x="9" y="33" width="20" height="3" rx="1.5" fill="white" opacity="0.6"/><line x1="6" y1="20.5" x2="42" y2="20.5" stroke="white" strokeWidth="2" strokeDasharray="3 2.5"/></> },
  replacer:    { g:G, icon:<><path d="M11 17 Q24 9 37 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M37 31 Q24 39 11 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/><circle cx="24" cy="24" r="5" fill="white" opacity="0.95"/><circle cx="24" cy="24" r="2" fill="#6c5ce7"/></> },
  secret:      { g:G, icon:<><rect x="13" y="22" width="22" height="18" rx="4" fill="white" opacity="0.95"/><path d="M16 22 V16 A8 8 0 0 1 32 16 V22" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/><circle cx="24" cy="31" r="3.5" fill="#6c5ce7"/><rect x="22.5" y="31" width="3" height="5" rx="1.5" fill="#6c5ce7"/></> },
  ssl:         { g:G, icon:<><path d="M24 7 L37 12.5 V25 C37 33 31 38.5 24 41 C17 38.5 11 33 11 25 V12.5Z" fill="white" opacity="0.9"/><path d="M18 25 L22 29 L30 21" stroke="#6c5ce7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></> },
  csr:         { g:G, icon:<><rect x="11" y="8" width="26" height="34" rx="3" fill="white" opacity="0.9"/><rect x="15" y="15" width="18" height="2.5" rx="1.25" fill="#6c5ce7"/><rect x="15" y="21" width="14" height="2.5" rx="1.25" fill="#6c5ce7" opacity="0.6"/><rect x="15" y="27" width="16" height="2.5" rx="1.25" fill="#6c5ce7" opacity="0.4"/><circle cx="24" cy="35" r="3" fill="#6c5ce7" opacity="0.7"/></> },
  certdecoder: { g:G, icon:<><path d="M24 6 L28.5 15.5 L39 17 L31.5 24 L33.5 34.5 L24 29.5 L14.5 34.5 L16.5 24 L9 17 L19.5 15.5Z" fill="white" opacity="0.95"/><circle cx="24" cy="21" r="4" fill="#6c5ce7"/></> },
  whois:       { g:G, icon:<><circle cx="24" cy="24" r="15" stroke="white" strokeWidth="2.5" fill="none"/><ellipse cx="24" cy="24" rx="7" ry="15" stroke="white" strokeWidth="2" fill="none"/><line x1="9" y1="24" x2="39" y2="24" stroke="white" strokeWidth="2"/><line x1="11" y1="16" x2="37" y2="16" stroke="white" strokeWidth="1.5" opacity="0.55"/><line x1="11" y1="32" x2="37" y2="32" stroke="white" strokeWidth="1.5" opacity="0.55"/></> },
  dnslookup: { g:G, icon:<><circle cx="24" cy="24" r="14" fill="white" opacity="0.9"/><path d="M24 10 Q30 17 30 24 Q30 31 24 38" stroke="#6c5ce7" strokeWidth="2" fill="none"/><path d="M24 10 Q18 17 18 24 Q18 31 24 38" stroke="#6c5ce7" strokeWidth="2" fill="none"/><line x1="10" y1="24" x2="38" y2="24" stroke="#6c5ce7" strokeWidth="2"/></>, },
  emailheader: { g:G, icon:<><rect x="8" y="12" width="32" height="24" rx="4" fill="white" opacity="0.9"/><path d="M8 16 L24 26 L40 16" stroke="#6c5ce7" strokeWidth="2.5" fill="none" strokeLinecap="round"/></>, },
  geopeeker:   { g:G, icon:<><circle cx="24" cy="21" r="11" fill="white" opacity="0.9"/><path d="M24 32 L24 42" stroke="white" strokeWidth="3" strokeLinecap="round"/><circle cx="24" cy="21" r="4.5" fill="#6c5ce7"/><path d="M8 42 Q24 35 40 42" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55"/></> },
};

export default function AppIcon({ id, size = 40 }) {
  const app = ICONS[id];
  if (!app) return null;
  return (
    <div style={{
      width:`${size}px`, height:`${size}px`,
      borderRadius:`${size * 0.29}px`,
      background:`linear-gradient(135deg,${app.g[0]},${app.g[1]})`,
      display:"flex", alignItems:"center", justifyContent:"center",
      boxShadow:`0 4px 12px ${app.g[1]}55`, flexShrink:0,
    }}>
      <svg viewBox="0 0 48 48" width={size} height={size} fill="none">{app.icon}</svg>
    </div>
  );
}

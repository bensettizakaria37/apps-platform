import { useState } from "react";

const APPS = [
  { id:"pdf",         title:"PDF to DOCX",             icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g1)"/><rect x="12" y="8" width="24" height="32" rx="3" fill="white" opacity="0.9"/><rect x="16" y="16" width="16" height="2" rx="1" fill="#e74c3c"/><rect x="16" y="21" width="16" height="2" rx="1" fill="#e74c3c" opacity="0.6"/><rect x="16" y="26" width="10" height="2" rx="1" fill="#e74c3c" opacity="0.4"/><defs><linearGradient id="g1" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#ff6b6b"/><stop offset="1" stopColor="#ee5a24"/></linearGradient></defs></svg> },
  { id:"ocr",         title:"OCR — Image to Text",     icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g2)"/><rect x="10" y="10" width="28" height="28" rx="4" fill="white" opacity="0.2" stroke="white" strokeWidth="2"/><circle cx="20" cy="20" r="5" fill="white" opacity="0.9"/><path d="M26 32 L32 26 L36 30 L30 36Z" fill="white"/><defs><linearGradient id="g2" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#a29bfe"/><stop offset="1" stopColor="#6c5ce7"/></linearGradient></defs></svg> },
  { id:"compress",    title:"Compress PDF",            icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g3)"/><path d="M24 10 L24 38 M14 20 L24 10 L34 20 M14 28 L24 38 L34 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g3" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#55efc4"/><stop offset="1" stopColor="#00b894"/></linearGradient></defs></svg> },
  { id:"duplicates",  title:"Remove Duplicates",       icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g4)"/><rect x="10" y="13" width="28" height="3" rx="1.5" fill="white"/><rect x="10" y="20" width="28" height="3" rx="1.5" fill="white" opacity="0.4"/><rect x="10" y="27" width="28" height="3" rx="1.5" fill="white"/><rect x="10" y="34" width="20" height="3" rx="1.5" fill="white" opacity="0.4"/><circle cx="38" cy="35" r="7" fill="#e17055"/><path d="M35 35 L37 37 L41 33" stroke="white" strokeWidth="2" strokeLinecap="round"/><defs><linearGradient id="g4" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#fdcb6e"/><stop offset="1" stopColor="#e17055"/></linearGradient></defs></svg> },
  { id:"removelines", title:"Remove Lines Containing", icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g5)"/><rect x="10" y="13" width="28" height="3" rx="1.5" fill="white"/><rect x="10" y="21" width="28" height="3" rx="1.5" fill="white" opacity="0.5"/><rect x="10" y="29" width="28" height="3" rx="1.5" fill="white"/><line x1="8" y1="22" x2="40" y2="22" stroke="white" strokeWidth="2" strokeDasharray="3 2"/><defs><linearGradient id="g5" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#fd79a8"/><stop offset="1" stopColor="#e84393"/></linearGradient></defs></svg> },
  { id:"replacer",    title:"Text Replacer",           icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g6)"/><path d="M12 18 Q24 10 36 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 30 Q24 38 12 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/><circle cx="24" cy="24" r="4" fill="white"/><defs><linearGradient id="g6" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#74b9ff"/><stop offset="1" stopColor="#0984e3"/></linearGradient></defs></svg> },
  { id:"secret",      title:"Secret Sharing",          icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g7)"/><rect x="14" y="22" width="20" height="16" rx="3" fill="white" opacity="0.9"/><path d="M17 22 V17 A7 7 0 0 1 31 17 V22" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/><circle cx="24" cy="30" r="3" fill="#fdcb6e"/><defs><linearGradient id="g7" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#636e72"/><stop offset="1" stopColor="#2d3436"/></linearGradient></defs></svg> },
  { id:"csr",         title:"CSR Decoder",             icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g8)"/><path d="M24 8 L28 16 L38 17 L31 24 L33 34 L24 29 L15 34 L17 24 L10 17 L20 16Z" fill="white" opacity="0.9"/><defs><linearGradient id="g8" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#81ecec"/><stop offset="1" stopColor="#00cec9"/></linearGradient></defs></svg> },
  { id:"ssl",         title:"SSL Checker",             icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g9)"/><path d="M24 8 L36 13 V24 C36 31 30 37 24 40 C18 37 12 31 12 24 V13Z" fill="white" opacity="0.85"/><path d="M19 24 L22 27 L29 20" stroke="#00b894" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g9" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#00b894"/><stop offset="1" stopColor="#00cec9"/></linearGradient></defs></svg> },
  { id:"certdecoder", title:"Certificate Decoder",     icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g10)"/><rect x="11" y="9" width="26" height="34" rx="3" fill="white" opacity="0.85"/><rect x="16" y="16" width="16" height="2" rx="1" fill="#e17055"/><rect x="16" y="21" width="12" height="2" rx="1" fill="#e17055" opacity="0.6"/><rect x="16" y="26" width="14" height="2" rx="1" fill="#e17055" opacity="0.4"/><circle cx="24" cy="34" r="3" fill="#e17055" opacity="0.7"/><defs><linearGradient id="g10" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#ffeaa7"/><stop offset="1" stopColor="#e17055"/></linearGradient></defs></svg> },
  { id:"whois",       title:"Who.is Lookup",           icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g11)"/><circle cx="24" cy="24" r="13" stroke="white" strokeWidth="2.5" fill="none"/><ellipse cx="24" cy="24" rx="6" ry="13" stroke="white" strokeWidth="2" fill="none"/><line x1="11" y1="24" x2="37" y2="24" stroke="white" strokeWidth="2"/><line x1="13" y1="17" x2="35" y2="17" stroke="white" strokeWidth="1.5" opacity="0.6"/><line x1="13" y1="31" x2="35" y2="31" stroke="white" strokeWidth="1.5" opacity="0.6"/><defs><linearGradient id="g11" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#a29bfe"/><stop offset="1" stopColor="#6c5ce7"/></linearGradient></defs></svg> },
  { id:"geopeeker",   title:"GeoPeeker",               icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g12)"/><circle cx="24" cy="22" r="9" fill="white" opacity="0.9"/><path d="M24 31 L24 40" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><circle cx="24" cy="22" r="3.5" fill="#0984e3"/><path d="M10 40 Q24 34 38 40" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/><defs><linearGradient id="g12" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#74b9ff"/><stop offset="1" stopColor="#0984e3"/></linearGradient></defs></svg> },
];

export default function Home({ setPage }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState(null);

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"system-ui,-apple-system,sans-serif",
      background:"radial-gradient(ellipse at 20% 20%, #c7b8f5 0%, #e8e0ff 30%, #f5e6ff 55%, #ffe0f0 80%, #ffd6e8 100%)"
    }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "220px" : "64px",
        flexShrink: 0,
        background:"rgba(255,255,255,0.5)",
        backdropFilter:"blur(20px)",
        borderRight:"1px solid rgba(255,255,255,0.7)",
        transition:"width 0.25s ease",
        overflow:"hidden",
        display:"flex",
        flexDirection:"column",
      }}>
        {/* Logo */}
        <div style={{ padding:"20px 16px 12px", display:"flex", alignItems:"center", gap:"10px", borderBottom:"1px solid rgba(255,255,255,0.5)" }}>
          <div style={{ width:"36px",height:"36px",flexShrink:0,borderRadius:"10px",background:"linear-gradient(135deg,#6c5ce7,#a29bfe)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2 L12 7 L17 7 L13 11 L15 16 L10 13 L5 16 L7 11 L3 7 L8 7Z" fill="white"/>
            </svg>
          </div>
          {sidebarOpen && <span style={{ fontWeight:"800",fontSize:"15px",color:"#2d3436",whiteSpace:"nowrap" }}>FactoryTools</span>}
        </div>

        {/* Toggle */}
        <button onClick={()=>setSidebarOpen(o=>!o)} style={{ display:"flex",alignItems:"center",justifyContent:sidebarOpen?"flex-end":"center",padding:"8px 14px",background:"none",border:"none",cursor:"pointer",color:"#a29bfe",fontSize:"13px" }}>
          {sidebarOpen ? "◀" : "▶"}
        </button>

        {/* Apps list */}
        <div style={{ flex:1, overflowY:"auto", padding:"4px 8px", display:"flex", flexDirection:"column", gap:"2px" }}>
          {APPS.map(app => (
            <button
              key={app.id}
              onClick={() => setPage(app.id)}
              onMouseEnter={()=>setActive(app.id)}
              onMouseLeave={()=>setActive(null)}
              style={{
                display:"flex", alignItems:"center", gap:"10px",
                padding:"8px 10px", borderRadius:"10px", border:"none",
                background: active===app.id ? "rgba(108,92,231,0.1)" : "transparent",
                cursor:"pointer", transition:"all 0.15s",
                whiteSpace:"nowrap", overflow:"hidden",
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
            >
              <div style={{ width:"30px",height:"30px",flexShrink:0,borderRadius:"8px",overflow:"hidden",boxShadow:"0 2px 6px rgba(0,0,0,0.12)" }}>
                <svg viewBox="0 0 48 48" style={{ width:"100%",height:"100%" }}>{app.icon}</svg>
              </div>
              {sidebarOpen && <span style={{ fontSize:"13px",fontWeight:"500",color:"#2d3436" }}>{app.title}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
        <div style={{ textAlign:"center", maxWidth:"560px" }}>
          <h1 style={{ fontSize:"44px",fontWeight:"800",color:"#2d3436",letterSpacing:"-1.5px",marginBottom:"12px",lineHeight:1.1 }}>
            Your productivity tools,<br/>
            <span style={{ background:"linear-gradient(135deg,#6c5ce7,#a29bfe)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>all in one place.</span>
          </h1>
          <p style={{ fontSize:"16px",color:"#636e72",marginBottom:"40px",lineHeight:1.6 }}>
            Simple, fast and free tools to convert, extract and transform your files.
          </p>

          {/* Grid */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px" }}>
            {APPS.map(app => (
              <div
                key={app.id}
                onClick={() => setPage(app.id)}
                style={{ background:"rgba(255,255,255,0.65)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.8)",borderRadius:"20px",padding:"20px 12px",cursor:"pointer",transition:"all 0.2s",textAlign:"center",boxShadow:"0 2px 10px rgba(108,92,231,0.06)" }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 12px 32px rgba(108,92,231,0.18)";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.background="rgba(255,255,255,0.9)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 10px rgba(108,92,231,0.06)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.background="rgba(255,255,255,0.65)";}}
              >
                <div style={{ width:"48px",height:"48px",margin:"0 auto 10px",borderRadius:"14px",overflow:"hidden",boxShadow:"0 4px 12px rgba(0,0,0,0.12)" }}>
                  <svg viewBox="0 0 48 48" style={{ width:"100%",height:"100%" }}>{app.icon}</svg>
                </div>
                <div style={{ fontSize:"12px",fontWeight:"600",color:"#2d3436",lineHeight:1.3 }}>{app.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

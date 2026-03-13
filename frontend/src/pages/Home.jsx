import { useState } from "react";

const CATEGORIES = [
  { id:"all",      label:"All Tools" },
  { id:"pdf",      label:"PDF Tools" },
  { id:"text",     label:"Text Tools" },
  { id:"security", label:"Security" },
  { id:"network",  label:"Network" },
];

const APPS = [
  { id:"pdf",         cat:"pdf",      title:"PDF to DOCX",             desc:"Convert PDFs into editable Word documents.",           icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g1)"/><rect x="12" y="8" width="24" height="32" rx="3" fill="white" opacity="0.9"/><rect x="16" y="16" width="16" height="2" rx="1" fill="#e74c3c"/><rect x="16" y="21" width="16" height="2" rx="1" fill="#e74c3c" opacity="0.6"/><rect x="16" y="26" width="10" height="2" rx="1" fill="#e74c3c" opacity="0.4"/><defs><linearGradient id="g1" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#ff6b6b"/><stop offset="1" stopColor="#ee5a24"/></linearGradient></defs></svg> },
  { id:"ocr",         cat:"pdf",      title:"OCR — Image to Text",     desc:"Extract text from images and scanned PDFs.",           icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g2)"/><rect x="10" y="10" width="28" height="28" rx="4" fill="white" opacity="0.2" stroke="white" strokeWidth="2"/><circle cx="20" cy="20" r="5" fill="white" opacity="0.9"/><path d="M26 32 L32 26 L36 30 L30 36Z" fill="white"/><defs><linearGradient id="g2" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#a29bfe"/><stop offset="1" stopColor="#6c5ce7"/></linearGradient></defs></svg> },
  { id:"compress",    cat:"pdf",      title:"Compress PDF",            desc:"Reduce PDF size without visible quality loss.",         icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g3)"/><path d="M24 10 L24 38 M14 20 L24 10 L34 20 M14 28 L24 38 L34 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g3" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#55efc4"/><stop offset="1" stopColor="#00b894"/></linearGradient></defs></svg> },
  { id:"duplicates",  cat:"text",     title:"Remove Duplicates",       desc:"Remove duplicate lines from any text instantly.",      icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g4)"/><rect x="10" y="13" width="28" height="3" rx="1.5" fill="white"/><rect x="10" y="20" width="28" height="3" rx="1.5" fill="white" opacity="0.4"/><rect x="10" y="27" width="28" height="3" rx="1.5" fill="white"/><rect x="10" y="34" width="20" height="3" rx="1.5" fill="white" opacity="0.4"/><circle cx="38" cy="35" r="7" fill="#e17055"/><path d="M35 35 L37 37 L41 33" stroke="white" strokeWidth="2" strokeLinecap="round"/><defs><linearGradient id="g4" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#fdcb6e"/><stop offset="1" stopColor="#e17055"/></linearGradient></defs></svg> },
  { id:"removelines", cat:"text",     title:"Remove Lines Containing", desc:"Filter lines by keyword or regular expression.",       icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g5)"/><rect x="10" y="13" width="28" height="3" rx="1.5" fill="white"/><rect x="10" y="21" width="28" height="3" rx="1.5" fill="white" opacity="0.5"/><rect x="10" y="29" width="28" height="3" rx="1.5" fill="white"/><line x1="8" y1="22" x2="40" y2="22" stroke="white" strokeWidth="2" strokeDasharray="3 2"/><defs><linearGradient id="g5" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#fd79a8"/><stop offset="1" stopColor="#e84393"/></linearGradient></defs></svg> },
  { id:"replacer",    cat:"text",     title:"Text Replacer",           desc:"Find and replace text with full Regex support.",       icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g6)"/><path d="M12 18 Q24 10 36 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 30 Q24 38 12 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/><circle cx="24" cy="24" r="4" fill="white"/><defs><linearGradient id="g6" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#74b9ff"/><stop offset="1" stopColor="#0984e3"/></linearGradient></defs></svg> },
  { id:"secret",      cat:"security", title:"Secret Sharing",          desc:"Share secrets via a self-destructing unique link.",    icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g7)"/><rect x="14" y="22" width="20" height="16" rx="3" fill="white" opacity="0.9"/><path d="M17 22 V17 A7 7 0 0 1 31 17 V22" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/><circle cx="24" cy="30" r="3" fill="#fdcb6e"/><defs><linearGradient id="g7" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#636e72"/><stop offset="1" stopColor="#2d3436"/></linearGradient></defs></svg> },
  { id:"csr",         cat:"security", title:"CSR Decoder",             desc:"Decode and inspect Certificate Signing Requests.",     icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g8)"/><path d="M24 8 L28 16 L38 17 L31 24 L33 34 L24 29 L15 34 L17 24 L10 17 L20 16Z" fill="white" opacity="0.9"/><defs><linearGradient id="g8" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#81ecec"/><stop offset="1" stopColor="#00cec9"/></linearGradient></defs></svg> },
  { id:"ssl",         cat:"security", title:"SSL Checker",             desc:"Verify SSL certificate validity for any domain.",      icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g9)"/><path d="M24 8 L36 13 V24 C36 31 30 37 24 40 C18 37 12 31 12 24 V13Z" fill="white" opacity="0.85"/><path d="M19 24 L22 27 L29 20" stroke="#00b894" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g9" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#00b894"/><stop offset="1" stopColor="#00cec9"/></linearGradient></defs></svg> },
  { id:"certdecoder", cat:"security", title:"Certificate Decoder",     desc:"Decode and inspect any X.509 SSL/TLS certificate.",   icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g10)"/><rect x="11" y="9" width="26" height="34" rx="3" fill="white" opacity="0.85"/><rect x="16" y="16" width="16" height="2" rx="1" fill="#e17055"/><rect x="16" y="21" width="12" height="2" rx="1" fill="#e17055" opacity="0.6"/><rect x="16" y="26" width="14" height="2" rx="1" fill="#e17055" opacity="0.4"/><circle cx="24" cy="34" r="3" fill="#e17055" opacity="0.7"/><defs><linearGradient id="g10" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#ffeaa7"/><stop offset="1" stopColor="#e17055"/></linearGradient></defs></svg> },
  { id:"whois",       cat:"network",  title:"Who.is Lookup",           desc:"Get registration details for any domain name.",        icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g11)"/><circle cx="24" cy="24" r="13" stroke="white" strokeWidth="2.5" fill="none"/><ellipse cx="24" cy="24" rx="6" ry="13" stroke="white" strokeWidth="2" fill="none"/><line x1="11" y1="24" x2="37" y2="24" stroke="white" strokeWidth="2"/><line x1="13" y1="17" x2="35" y2="17" stroke="white" strokeWidth="1.5" opacity="0.6"/><line x1="13" y1="31" x2="35" y2="31" stroke="white" strokeWidth="1.5" opacity="0.6"/><defs><linearGradient id="g11" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#a29bfe"/><stop offset="1" stopColor="#6c5ce7"/></linearGradient></defs></svg> },
  { id:"geopeeker",   cat:"network",  title:"GeoPeeker",               desc:"See how your site responds from locations worldwide.", icon:<svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#g12)"/><circle cx="24" cy="22" r="9" fill="white" opacity="0.9"/><path d="M24 31 L24 40" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><circle cx="24" cy="22" r="3.5" fill="#0984e3"/><path d="M10 40 Q24 34 38 40" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/><defs><linearGradient id="g12" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#74b9ff"/><stop offset="1" stopColor="#0984e3"/></linearGradient></defs></svg> },
];

export default function Home({ setPage }) {
  const [activecat, setActivecat] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  const filtered = APPS.filter(a => {
    const matchCat = activecat === "all" || a.cat === activecat;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display:"flex", minHeight:"calc(100vh - 60px)", fontFamily:"system-ui,-apple-system,sans-serif",
      background:"radial-gradient(ellipse at 20% 20%, #c7b8f5 0%, #e8e0ff 30%, #f5e6ff 55%, #ffe0f0 80%, #ffd6e8 100%)"
    }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "200px" : "56px",
        flexShrink: 0,
        background:"rgba(255,255,255,0.55)",
        backdropFilter:"blur(16px)",
        borderRight:"1px solid rgba(255,255,255,0.6)",
        transition:"width 0.25s ease",
        overflow:"hidden",
        display:"flex",
        flexDirection:"column",
        paddingTop:"20px",
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{ display:"flex",alignItems:"center",justifyContent:sidebarOpen?"flex-end":"center",padding:"0 14px",marginBottom:"24px",background:"none",border:"none",cursor:"pointer",color:"#6c5ce7",fontSize:"16px" }}
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>

        <div style={{ display:"flex",flexDirection:"column",gap:"2px",padding:"0 8px" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActivecat(cat.id)}
              style={{
                display:"flex", alignItems:"center", gap:"10px",
                padding:"10px 12px", borderRadius:"10px", border:"none",
                background: activecat===cat.id ? "rgba(108,92,231,0.12)" : "transparent",
                color: activecat===cat.id ? "#6c5ce7" : "#636e72",
                fontWeight: activecat===cat.id ? "700" : "400",
                fontSize:"13px", cursor:"pointer", transition:"all 0.15s",
                whiteSpace:"nowrap", overflow:"hidden",
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
            >
              {!sidebarOpen && <span style={{ fontSize:"15px" }}>
                {cat.id==="all"?"⊞":cat.id==="pdf"?"📄":cat.id==="text"?"✏️":cat.id==="security"?"🔒":"🌐"}
              </span>}
              {sidebarOpen && <span>{cat.label}</span>}
            </button>
          ))}
        </div>

        {sidebarOpen && (
          <div style={{ marginTop:"auto",padding:"16px",fontSize:"11px",color:"#b2bec3",textAlign:"center" }}>
            {APPS.length} tools available
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex:1, padding:"40px 36px", overflowY:"auto" }}>

        {/* Hero */}
        <div style={{ textAlign:"center", marginBottom:"40px" }}>
          <h1 style={{ fontSize:"38px",fontWeight:"800",color:"#2d3436",letterSpacing:"-1px",marginBottom:"8px",lineHeight:1.15 }}>
            Your productivity tools,<br/>
            <span style={{ background:"linear-gradient(135deg,#6c5ce7,#a29bfe)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>all in one place.</span>
          </h1>
          <p style={{ fontSize:"15px",color:"#636e72",marginBottom:"24px" }}>Simple, fast and free tools to convert, extract and transform.</p>

          {/* Search */}
          <div style={{ position:"relative",maxWidth:"400px",margin:"0 auto" }}>
            <span style={{ position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",color:"#b2bec3",fontSize:"14px" }}>🔍</span>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search tools..."
              style={{ width:"100%",padding:"12px 14px 12px 40px",border:"1px solid rgba(255,255,255,0.8)",borderRadius:"12px",fontSize:"13px",outline:"none",background:"rgba(255,255,255,0.7)",backdropFilter:"blur(8px)",boxSizing:"border-box",color:"#2d3436" }}
            />
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"28px",justifyContent:"center" }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={()=>setActivecat(cat.id)} style={{
              padding:"7px 18px",borderRadius:"20px",border:"1px solid rgba(255,255,255,0.6)",
              background: activecat===cat.id ? "linear-gradient(135deg,#6c5ce7,#a29bfe)" : "rgba(255,255,255,0.55)",
              color: activecat===cat.id ? "#fff" : "#636e72",
              fontWeight: activecat===cat.id ? "700" : "400",
              fontSize:"13px",cursor:"pointer",backdropFilter:"blur(8px)",transition:"all 0.15s"
            }}>{cat.label}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"16px" }}>
          {filtered.map(app => (
            <div
              key={app.id}
              onClick={() => setPage(app.id)}
              style={{ background:"rgba(255,255,255,0.65)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.8)",borderRadius:"20px",padding:"24px 16px",cursor:"pointer",transition:"all 0.2s",textAlign:"center",boxShadow:"0 2px 12px rgba(108,92,231,0.06)" }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 12px 32px rgba(108,92,231,0.18)";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.background="rgba(255,255,255,0.85)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(108,92,231,0.06)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.background="rgba(255,255,255,0.65)";}}
            >
              <div style={{ width:"56px",height:"56px",margin:"0 auto 14px",borderRadius:"16px",overflow:"hidden",boxShadow:"0 4px 14px rgba(0,0,0,0.15)" }}>
                <svg viewBox="0 0 48 48" style={{ width:"100%",height:"100%" }}>{app.icon}</svg>
              </div>
              <h3 style={{ fontSize:"13px",fontWeight:"700",color:"#2d3436",lineHeight:"1.3",marginBottom:"6px" }}>{app.title}</h3>
              <p style={{ fontSize:"11px",color:"#636e72",lineHeight:"1.5" }}>{app.desc}</p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center",padding:"60px 20px",color:"#b2bec3" }}>
            <div style={{ fontSize:"40px",marginBottom:"12px" }}>🔍</div>
            <div style={{ fontSize:"16px",fontWeight:"600",color:"#636e72" }}>No tools found</div>
          </div>
        )}
      </div>
    </div>
  );
}

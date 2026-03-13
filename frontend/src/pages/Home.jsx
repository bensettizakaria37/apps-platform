import { useState } from "react";

const CATEGORIES = [
  { id:"all",      label:"All Tools",     icon:"⊞" },
  { id:"pdf",      label:"PDF Tools",     icon:"📄" },
  { id:"text",     label:"Text Tools",    icon:"✏️" },
  { id:"security", label:"Security",      icon:"🔒" },
  { id:"network",  label:"Network",       icon:"🌐" },
];

const APPS = [
  { id:"pdf",         cat:"pdf",      title:"PDF to DOCX",             desc:"Convert PDFs into editable Word documents.",                    gradient:"linear-gradient(135deg,#ff6b6b,#ee5a24)", icon:"📄" },
  { id:"ocr",         cat:"pdf",      title:"OCR — Image to Text",     desc:"Extract text from images and scanned PDFs.",                    gradient:"linear-gradient(135deg,#a29bfe,#6c5ce7)", icon:"🖼️" },
  { id:"compress",    cat:"pdf",      title:"Compress PDF",            desc:"Reduce PDF size without visible quality loss.",                  gradient:"linear-gradient(135deg,#55efc4,#00b894)", icon:"🗜️" },
  { id:"duplicates",  cat:"text",     title:"Remove Duplicates",       desc:"Remove duplicate lines from any text instantly.",               gradient:"linear-gradient(135deg,#fdcb6e,#e17055)", icon:"⚡" },
  { id:"removelines", cat:"text",     title:"Remove Lines Containing", desc:"Filter lines by keyword or regular expression.",                gradient:"linear-gradient(135deg,#fd79a8,#e84393)", icon:"🧹" },
  { id:"replacer",    cat:"text",     title:"Text Replacer",           desc:"Find and replace text with full Regex support.",                gradient:"linear-gradient(135deg,#74b9ff,#0984e3)", icon:"🔁" },
  { id:"secret",      cat:"security", title:"Secret Sharing",          desc:"Share secrets via a self-destructing unique link.",             gradient:"linear-gradient(135deg,#ffeaa7,#fdcb6e)", icon:"🔐" },
  { id:"csr",         cat:"security", title:"CSR Decoder",             desc:"Decode and inspect Certificate Signing Requests.",              gradient:"linear-gradient(135deg,#81ecec,#00cec9)", icon:"🔏" },
  { id:"ssl",         cat:"security", title:"SSL Checker",             desc:"Verify SSL certificate validity for any domain.",               gradient:"linear-gradient(135deg,#55efc4,#00b894)", icon:"🔒" },
  { id:"certdecoder", cat:"security", title:"Certificate Decoder",     desc:"Decode and inspect any X.509 SSL/TLS certificate.",            gradient:"linear-gradient(135deg,#ffeaa7,#e17055)", icon:"📜" },
  { id:"whois",       cat:"network",  title:"Who.is Lookup",           desc:"Get registration details for any domain name.",                 gradient:"linear-gradient(135deg,#a29bfe,#6c5ce7)", icon:"🌐" },
  { id:"geopeeker",   cat:"network",  title:"GeoPeeker",               desc:"See how your site responds from locations worldwide.",          gradient:"linear-gradient(135deg,#74b9ff,#0984e3)", icon:"🌍" },
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
    <div style={{ display:"flex", minHeight:"calc(100vh - 60px)", background:"#f8f9fb", fontFamily:"system-ui,-apple-system,sans-serif" }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "220px" : "60px",
        flexShrink: 0,
        background:"#fff",
        borderRight:"1px solid #e5e7eb",
        transition:"width 0.25s ease",
        overflow:"hidden",
        display:"flex",
        flexDirection:"column",
        paddingTop:"16px",
      }}>
        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{ display:"flex",alignItems:"center",justifyContent: sidebarOpen?"flex-end":"center",padding:"0 14px",marginBottom:"20px",background:"none",border:"none",cursor:"pointer",color:"#6b7280" }}
        >
          <span style={{ fontSize:"18px" }}>{sidebarOpen ? "◀" : "▶"}</span>
        </button>

        {/* Categories */}
        <div style={{ display:"flex",flexDirection:"column",gap:"4px",padding:"0 8px" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActivecat(cat.id)}
              style={{
                display:"flex", alignItems:"center", gap:"12px",
                padding:"10px 12px", borderRadius:"10px", border:"none",
                background: activecat===cat.id ? "#eff6ff" : "transparent",
                color: activecat===cat.id ? "#1d4ed8" : "#6b7280",
                fontWeight: activecat===cat.id ? "600" : "400",
                fontSize:"13px", cursor:"pointer", transition:"all 0.15s",
                whiteSpace:"nowrap", overflow:"hidden",
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
            >
              <span style={{ fontSize:"16px", flexShrink:0 }}>{cat.icon}</span>
              {sidebarOpen && <span>{cat.label}</span>}
            </button>
          ))}
        </div>

        {sidebarOpen && (
          <div style={{ marginTop:"auto",padding:"16px",borderTop:"1px solid #f3f4f6" }}>
            <div style={{ fontSize:"11px",color:"#9ca3af",textAlign:"center" }}>
              {APPS.length} tools available
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex:1, padding:"32px", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ marginBottom:"28px" }}>
          <h1 style={{ fontSize:"26px",fontWeight:"800",color:"#111827",marginBottom:"6px" }}>
            {activecat === "all" ? "All Tools" : CATEGORIES.find(c=>c.id===activecat)?.label}
          </h1>
          <p style={{ fontSize:"14px",color:"#6b7280",marginBottom:"16px" }}>
            {filtered.length} tool{filtered.length !== 1 ? "s" : ""} available
          </p>

          {/* Search */}
          <div style={{ position:"relative",maxWidth:"400px" }}>
            <span style={{ position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#9ca3af",fontSize:"14px" }}>🔍</span>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search tools..."
              style={{ width:"100%",padding:"10px 12px 10px 36px",border:"1px solid #e5e7eb",borderRadius:"10px",fontSize:"13px",outline:"none",background:"#fff",boxSizing:"border-box" }}
            />
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"16px" }}>
          {filtered.map(app => (
            <div
              key={app.id}
              onClick={() => setPage(app.id)}
              style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"24px",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateY(-3px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)";e.currentTarget.style.transform="translateY(0)";}}
            >
              {/* Icon */}
              <div style={{
                width:"52px", height:"52px", borderRadius:"14px",
                background: app.gradient,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"24px", marginBottom:"16px",
                boxShadow:`0 4px 12px rgba(0,0,0,0.15)`
              }}>
                {app.icon}
              </div>
              <h3 style={{ fontSize:"15px",fontWeight:"700",color:"#111827",marginBottom:"6px" }}>{app.title}</h3>
              <p style={{ fontSize:"12px",color:"#6b7280",lineHeight:"1.6",marginBottom:"16px" }}>{app.desc}</p>
              <div style={{ fontSize:"12px",fontWeight:"600",color:"#1d4ed8",display:"flex",alignItems:"center",gap:"4px" }}>
                Open <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center",padding:"60px 20px",color:"#9ca3af" }}>
            <div style={{ fontSize:"40px",marginBottom:"12px" }}>🔍</div>
            <div style={{ fontSize:"16px",fontWeight:"600" }}>No tools found</div>
            <div style={{ fontSize:"13px",marginTop:"4px" }}>Try a different search term</div>
          </div>
        )}
      </div>
    </div>
  );
}

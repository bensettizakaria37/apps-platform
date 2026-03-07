export default function Navbar({ page, setPage }) {

  const navigate = (id) => {
    // Nettoyer l'URL complètement
    window.history.replaceState({}, "", `/?page=${id}`);
    setPage(id);
  };

  return (
    <nav style={{
      background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"0 32px",
      display:"flex", alignItems:"center", height:"60px",
      position:"sticky", top:0, zIndex:100,
      boxShadow:"0 1px 3px rgba(0,0,0,0.06)"
    }}>
      <div onClick={()=>navigate("home")} style={{ display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",marginRight:"40px" }}>
        <div style={{ width:"32px",height:"32px",borderRadius:"8px",background:"linear-gradient(135deg,#1d4ed8,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"800",fontSize:"16px" }}>A</div>
        <span style={{ fontWeight:"700",fontSize:"16px",color:"#111827" }}>AppsPlatform</span>
      </div>
      <div style={{ display:"flex", gap:"4px" }}>
        {[
          { id:"home",     label:"🏠 Accueil" },
          { id:"pdf",      label:"📄 PDF → DOCX" },
          { id:"ocr",      label:"🖼️ OCR" },
          { id:"secret",   label:"🔐 Secret" },
          { id:"compress", label:"🗜️ Compress PDF" },
        ].map(item=>(
          <button key={item.id} onClick={()=>navigate(item.id)} style={{
            padding:"6px 14px", borderRadius:"8px", border:"none",
            background: page===item.id ? "#eff6ff" : "transparent",
            color: page===item.id ? "#1d4ed8" : "#6b7280",
            fontWeight: page===item.id ? "600" : "400",
            fontSize:"13px", cursor:"pointer", transition:"all 0.15s"
          }}>{item.label}</button>
        ))}
      </div>
    </nav>
  );
}

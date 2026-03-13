import Logo from "./Logo";

export default function Navbar({ page, setPage }) {
  const navigate = (id) => {
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
        <Logo size={32} />
        <span style={{ fontWeight:"700",fontSize:"16px",color:"#111827" }}>FactoryTools</span>
      </div>
      <div style={{ display:"flex", gap:"4px" }}>
        {[
          { id:"home",        label:"🏠 Home" },
          { id:"pdf",         label:"📄 PDF to DOCX" },
          { id:"ocr",         label:"🖼️ OCR" },
          { id:"compress",    label:"🗜️ Compress PDF" },
          { id:"duplicates",  label:"⚡ Remove Duplicates" },
          { id:"removelines", label:"🧹 Remove Lines" },
          { id:"replacer",    label:"🔁 Text Replacer" },
          { id:"secret",      label:"🔐 Secret Sharing" },
          { id:"geopeeker",    label:"🌍 GeoPeeker" },
          { id:"certdecoder", label:"📜 Certificate Decoder" },
          { id:"whois",       label:"🌐 Who.is Lookup" },
          { id:"csr",         label:"🔏 CSR Decoder" },
          { id:"ssl",         label:"🔒 SSL Checker" },
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

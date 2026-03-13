const apps = [
  { id:"pdf",        icon:"📄", title:"PDF to DOCX",              desc:"Convert your PDFs into editable Word documents in one click.",         color:"#1d4ed8", bg:"#eff6ff" },
  { id:"ocr",        icon:"🖼️", title:"OCR — Image to Text",       desc:"Extract text from any image or scanned PDF. FR, EN, AR.",              color:"#7c3aed", bg:"#f5f3ff" },
  { id:"compress",   icon:"🗜️", title:"Compress PDF",              desc:"Reduce the size of your PDFs without visible quality loss.",           color:"#059669", bg:"#f0fdf4" },
  { id:"duplicates", icon:"⚡", title:"Remove Duplicate Lines",    desc:"Remove duplicate lines from any text instantly.",                      color:"#0d9488", bg:"#f0fdfa" },
  { id:"removelines",icon:"🧹", title:"Remove Lines Containing",   desc:"Filter and remove lines that contain a keyword or expression.",        color:"#9333ea", bg:"#fdf4ff" },
  { id:"replacer",   icon:"🔁", title:"Text Replacer",             desc:"Find and replace text with Regex support.",                            color:"#ea580c", bg:"#fff7ed" },
  { id:"secret",     icon:"🔐", title:"Secret Sharing",            desc:"Share passwords and secrets via a unique self-destructing link.",      color:"#d97706", bg:"#fffbeb" },
  { id:"certdecoder", icon:"📜", title:"Certificate Decoder", desc:"Decode and inspect any X.509 SSL/TLS certificate.", color:"#ca8a04", bg:"#fefce8" },
  { id:"whois", icon:"🌐", title:"Who.is Lookup", desc:"Get registration and ownership details for any domain.", color:"#9333ea", bg:"#fdf4ff" },
  { id:"csr",        icon:"🔏", title:"CSR Decoder",               desc:"Decode and inspect your Certificate Signing Requests.",               color:"#0ea5e9", bg:"#f0f9ff" },
  { id:"ssl",        icon:"🔒", title:"SSL Checker",               desc:"Check the validity and details of any domain's SSL certificate.",      color:"#059669", bg:"#f0fdf4" },
];

export default function Home({ setPage }) {
  return (
    <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"48px 24px" }}>
      <div style={{ textAlign:"center", marginBottom:"56px" }}>
        <div style={{ display:"inline-block",background:"#eff6ff",color:"#1d4ed8",fontSize:"12px",fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 14px",borderRadius:"20px",marginBottom:"16px" }}>FactoryTools</div>
        <h1 style={{ fontSize:"42px",fontWeight:"800",color:"#111827",letterSpacing:"-1.5px",marginBottom:"14px",lineHeight:1.1 }}>
          Your productivity tools,<br/>
          <span style={{ background:"linear-gradient(135deg,#1d4ed8,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>all in one place.</span>
        </h1>
        <p style={{ color:"#6b7280",fontSize:"16px",maxWidth:"480px",margin:"0 auto" }}>Simple, fast and free tools to convert, extract and transform your files.</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"20px" }}>
        {apps.map(app=>(
          <div key={app.id}
            onClick={()=>setPage(app.id)}
            style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"28px 24px",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateY(-3px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.05)";e.currentTarget.style.transform="translateY(0)";}}>
            <div style={{ width:"48px",height:"48px",borderRadius:"12px",background:app.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",marginBottom:"16px" }}>{app.icon}</div>
            <h3 style={{ fontSize:"15px",fontWeight:"700",color:"#111827",marginBottom:"8px" }}>{app.title}</h3>
            <p style={{ fontSize:"13px",color:"#6b7280",lineHeight:"1.6",marginBottom:"16px" }}>{app.desc}</p>
            <div style={{ color:app.color,fontSize:"13px",fontWeight:"600" }}>Open →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const categories = [
  {
    id: "pdf",
    label: "PDF",
    color: "#1d4ed8",
    bg: "#eff6ff",
    apps: [
      { id:"pdf",      icon:"📄", title:"PDF vers DOCX",   desc:"Convertissez vos PDFs en documents Word éditables.", color:"#1d4ed8", bg:"#eff6ff" },
      { id:"compress", icon:"🗜️", title:"Compresser PDF",  desc:"Réduisez la taille de vos PDFs sans perte visible.", color:"#1d4ed8", bg:"#eff6ff" },
    ]
  },
  {
    id: "image",
    label: "Image",
    color: "#7c3aed",
    bg: "#f5f3ff",
    apps: [
      { id:"ocr", icon:"🖼️", title:"OCR — Image vers Texte", desc:"Extrayez le texte de vos images et PDFs scannés. FR, EN, AR.", color:"#7c3aed", bg:"#f5f3ff" },
    ]
  },
  {
    id: "text",
    label: "Texte",
    color: "#0d9488",
    bg: "#f0fdfa",
    apps: [
      { id:"duplicates", icon:"⚡", title:"Supprimer les doublons", desc:"Supprimez les lignes dupliquées instantanément.",              color:"#0d9488", bg:"#f0fdfa" },
      { id:"replacer",   icon:"🔁", title:"Text Replacer",          desc:"Recherchez et remplacez du texte avec support Regex.",         color:"#ea580c", bg:"#fff7ed" },
      { id:"removelines",icon:"🧹", title:"Supprimer lignes",       desc:"Supprimez les lignes contenant un mot-clé ou expression.",     color:"#9333ea", bg:"#fdf4ff" },
    ]
  },
  {
    id: "security",
    label: "Sécurité",
    color: "#059669",
    bg: "#f0fdf4",
    apps: [
      { id:"ssl",    icon:"🔒", title:"SSL Checker",    desc:"Vérifiez la validité du certificat SSL d'un domaine.",        color:"#059669", bg:"#f0fdf4" },
      { id:"csr",    icon:"🔏", title:"CSR Decoder",    desc:"Décodez et inspectez vos Certificate Signing Requests.",      color:"#0ea5e9", bg:"#f0f9ff" },
      { id:"secret", icon:"🔐", title:"Secret Sharing", desc:"Partagez des secrets via un lien unique qui s'autodétruit.",  color:"#d97706", bg:"#fffbeb" },
    ]
  },
];

export default function Home({ setPage }) {
  return (
    <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"48px 24px" }}>

      {/* Hero */}
      <div style={{ textAlign:"center", marginBottom:"56px" }}>
        <div style={{ display:"inline-block",background:"#eff6ff",color:"#1d4ed8",fontSize:"12px",fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 14px",borderRadius:"20px",marginBottom:"16px" }}>Plateforme d'outils</div>
        <h1 style={{ fontSize:"42px",fontWeight:"800",color:"#111827",letterSpacing:"-1.5px",marginBottom:"14px",lineHeight:1.1 }}>
          Vos outils de productivité,<br/>
          <span style={{ background:"linear-gradient(135deg,#1d4ed8,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>au même endroit.</span>
        </h1>
        <p style={{ color:"#6b7280",fontSize:"16px",maxWidth:"480px",margin:"0 auto" }}>Des outils simples, rapides et gratuits pour convertir, extraire et transformer vos fichiers.</p>
      </div>

      {/* Categories */}
      <div style={{ display:"flex", flexDirection:"column", gap:"40px" }}>
        {categories.map(cat => (
          <div key={cat.id}>
            {/* Category header */}
            <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px" }}>
              <div style={{ height:"1px",flex:1,background:"#e5e7eb" }} />
              <span style={{ fontSize:"11px",fontWeight:"700",color:cat.color,textTransform:"uppercase",letterSpacing:"0.12em",padding:"4px 14px",background:cat.bg,borderRadius:"20px",border:`1px solid ${cat.color}22` }}>{cat.label}</span>
              <div style={{ height:"1px",flex:1,background:"#e5e7eb" }} />
            </div>

            {/* Apps grid */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"16px" }}>
              {cat.apps.map(app => (
                <div key={app.id}
                  onClick={() => setPage(app.id)}
                  style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"24px",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.05)";e.currentTarget.style.transform="translateY(0)";}}>
                  <div style={{ width:"44px",height:"44px",borderRadius:"11px",background:app.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",marginBottom:"14px" }}>{app.icon}</div>
                  <h3 style={{ fontSize:"14px",fontWeight:"700",color:"#111827",marginBottom:"6px" }}>{app.title}</h3>
                  <p style={{ fontSize:"12px",color:"#6b7280",lineHeight:"1.6",marginBottom:"14px" }}>{app.desc}</p>
                  <div style={{ color:app.color,fontSize:"12px",fontWeight:"600" }}>Ouvrir →</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

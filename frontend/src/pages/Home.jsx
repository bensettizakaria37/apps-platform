const apps = [
  { id:"pdf",    icon:"📄", title:"PDF → DOCX",         desc:"Convertissez vos PDFs en documents Word éditables en un clic.",                      color:"#1d4ed8", bg:"#eff6ff", badge:"Disponible" },
  { id:"ocr",    icon:"🖼️", title:"OCR — Image → Texte", desc:"Extrayez le texte de n'importe quelle image ou PDF scanné. FR, EN, AR.",             color:"#7c3aed", bg:"#f5f3ff", badge:"Disponible" },
  { id:"secret", icon:"🔐", title:"Secret Sharing",      desc:"Partagez des mots de passe et secrets via un lien unique qui s'autodétruit.",        color:"#d97706", bg:"#fffbeb", badge:"Disponible" },
  { id:"compress", icon:"🗜️", title:"Compresser PDF", desc:"Réduisez la taille de vos PDFs sans perte de qualité visible.", color:"#059669", bg:"#f0fdf4", badge:"Disponible" },
];

export default function Home({ setPage }) {
  return (
    <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"48px 24px" }}>
      <div style={{ textAlign:"center", marginBottom:"56px" }}>
        <div style={{ display:"inline-block",background:"#eff6ff",color:"#1d4ed8",fontSize:"12px",fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 14px",borderRadius:"20px",marginBottom:"16px" }}>✦ Plateforme d'outils</div>
        <h1 style={{ fontSize:"42px",fontWeight:"800",color:"#111827",letterSpacing:"-1.5px",marginBottom:"14px",lineHeight:1.1 }}>
          Vos outils de productivité,<br/>
          <span style={{ background:"linear-gradient(135deg,#1d4ed8,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>au même endroit.</span>
        </h1>
        <p style={{ color:"#6b7280",fontSize:"16px",maxWidth:"480px",margin:"0 auto" }}>Des outils simples, rapides et gratuits pour convertir, extraire et transformer vos fichiers.</p>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"20px" }}>
        {apps.map(app=>(
          <div key={app.id}
            onClick={()=>app.badge==="Disponible" && setPage(app.id)}
            style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"28px 24px",cursor:app.badge==="Disponible"?"pointer":"default",transition:"all 0.2s",opacity:app.badge==="Bientôt"?0.6:1,boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}
            onMouseEnter={e=>{ if(app.badge==="Disponible"){e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateY(-3px)";}}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.05)";e.currentTarget.style.transform="translateY(0)";}}>
            <div style={{ width:"48px",height:"48px",borderRadius:"12px",background:app.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",marginBottom:"16px" }}>{app.icon}</div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px" }}>
              <h3 style={{ fontSize:"15px",fontWeight:"700",color:"#111827" }}>{app.title}</h3>
              <span style={{ fontSize:"10px",fontWeight:"600",padding:"2px 8px",borderRadius:"10px",background:app.badge==="Disponible"?"#dcfce7":"#f3f4f6",color:app.badge==="Disponible"?"#15803d":"#9ca3af" }}>{app.badge}</span>
            </div>
            <p style={{ fontSize:"13px",color:"#6b7280",lineHeight:"1.6" }}>{app.desc}</p>
            {app.badge==="Disponible" && <div style={{ marginTop:"16px",color:app.color,fontSize:"13px",fontWeight:"600" }}>Ouvrir →</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

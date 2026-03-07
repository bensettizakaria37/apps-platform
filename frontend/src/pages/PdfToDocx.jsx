import { useState, useRef } from "react";

const BACKEND = "https://apps-api.cloudfactory.ma";

function formatSize(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b/1024).toFixed(1) + " KB";
  return (b/1048576).toFixed(1) + " MB";
}

export default function PdfToDocx() {
  const [file, setFile]           = useState(null);
  const [drag, setDrag]           = useState(false);
  const [status, setStatus]       = useState("idle");
  const [progress, setProgress]   = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("");
  const [error, setError]         = useState("");
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f?.name.toLowerCase().endsWith(".pdf")) { setError("Veuillez sélectionner un fichier PDF."); return; }
    setFile(f); setError(""); setStatus("idle"); setDownloadUrl(null);
  };

  const convert = async () => {
    if (!file) return;
    setStatus("converting"); setProgress(10); setError("");
    const interval = setInterval(() => setProgress(p => p < 85 ? p+8 : p), 600);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${BACKEND}/pdf/convert`, { method:"POST", body:fd });
      clearInterval(interval); setProgress(100);
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail); }
      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(file.name.replace(".pdf",".docx"));
      setStatus("done");
    } catch(e) {
      clearInterval(interval); setError(e.message); setStatus("error"); setProgress(0);
    }
  };

  const reset = () => { setFile(null); setStatus("idle"); setDownloadUrl(null); setError(""); setProgress(0); };

  return (
    <div style={{ maxWidth:"520px", margin:"0 auto", padding:"40px 24px" }}>
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px" }}>
          <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}>📄</div>
          <div>
            <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>PDF → DOCX</h2>
            <p style={{ fontSize:"13px",color:"#6b7280" }}>Convertir un PDF en document Word éditable</p>
          </div>
        </div>
      </div>

      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}
        style={{
          border:`2px dashed ${drag?"#1d4ed8":"#d1d5db"}`,
          borderRadius:"14px", padding:"40px 24px", textAlign:"center",
          cursor:"pointer", background: drag?"#eff6ff":"#f9fafb",
          transition:"all 0.2s"
        }}
      >
        <div style={{ fontSize:"36px",marginBottom:"10px" }}>📂</div>
        <p style={{ color:"#6b7280",fontSize:"14px" }}>Glissez votre PDF ici ou <span style={{ color:"#1d4ed8",textDecoration:"underline" }}>parcourez</span></p>
        <input ref={inputRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
      </div>

      {file && (
        <div style={{ background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:"10px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"10px",marginTop:"14px" }}>
          <span>📎</span>
          <span style={{ flex:1,fontSize:"13px",color:"#0369a1",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.name}</span>
          <span style={{ fontSize:"12px",color:"#9ca3af" }}>{formatSize(file.size)}</span>
          <span style={{ cursor:"pointer",color:"#9ca3af",fontSize:"16px" }} onClick={reset}>×</span>
        </div>
      )}

      {error && <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"12px 16px",color:"#dc2626",fontSize:"13px",marginTop:"12px" }}>⚠️ {error}</div>}

      {status==="converting" && (
        <div style={{ marginTop:"16px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:"12px",color:"#6b7280",marginBottom:"6px" }}>
            <span>Conversion en cours...</span><span>{progress}%</span>
          </div>
          <div style={{ background:"#e5e7eb",borderRadius:"6px",height:"6px",overflow:"hidden" }}>
            <div style={{ height:"100%",background:"linear-gradient(90deg,#1d4ed8,#7c3aed)",borderRadius:"6px",width:progress+"%",transition:"width 0.4s" }} />
          </div>
        </div>
      )}

      {status !== "done" && (
        <button onClick={convert} disabled={!file||status==="converting"} style={{
          width:"100%",marginTop:"16px",padding:"14px",border:"none",borderRadius:"12px",
          background:"linear-gradient(135deg,#1d4ed8,#7c3aed)",color:"#fff",
          fontSize:"15px",fontWeight:"700",cursor:!file||status==="converting"?"not-allowed":"pointer",
          opacity:!file||status==="converting"?0.5:1, transition:"all 0.2s"
        }}>
          {status==="converting" ? "⏳ Conversion..." : "⚡ Convertir en DOCX"}
        </button>
      )}

      {status==="done" && (
        <>
          <div style={{ textAlign:"center",padding:"20px 0" }}>
            <div style={{ fontSize:"48px",marginBottom:"8px" }}>✅</div>
            <p style={{ color:"#6b7280",fontSize:"14px" }}>Votre fichier est prêt !</p>
          </div>
          <a href={downloadUrl} download={downloadName} style={{
            display:"block",textAlign:"center",padding:"14px",borderRadius:"12px",
            background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",
            fontSize:"15px",fontWeight:"700",textDecoration:"none"
          }}>⬇️ Télécharger {downloadName}</a>
          <button onClick={reset} style={{ width:"100%",marginTop:"10px",padding:"10px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#fff",color:"#6b7280",fontSize:"13px",cursor:"pointer" }}>
            Convertir un autre fichier
          </button>
        </>
      )}
    </div>
  );
}

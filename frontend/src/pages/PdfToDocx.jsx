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
  const [filename, setFilename]   = useState("");
  const [error, setError]         = useState("");
  const [jobId, setJobId]         = useState(null);
  const inputRef = useRef();
  const pollRef  = useRef(null);

  const handleFile = (f) => {
    if (!f?.name.toLowerCase().endsWith(".pdf")) { setError("Veuillez sélectionner un fichier PDF."); return; }
    if (f.size > 50 * 1024 * 1024) { setError("Fichier trop volumineux. Maximum 50MB."); return; }
    setFile(f); setError(""); setStatus("idle"); setDownloadUrl(null); setJobId(null);
  };

  const pollJob = (jid) => {
    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`${BACKEND}/jobs/${jid}`);
        const data = await res.json();
        setProgress(data.progress || 0);
        if (data.status === "done") {
          clearInterval(pollRef.current);
          const dlUrl = `${BACKEND}/jobs/${jid}/download`;
          setDownloadUrl(dlUrl);
          setFilename(data.filename || "document.docx");
          setStatus("done");
          setProgress(100);
        } else if (data.status === "error") {
          clearInterval(pollRef.current);
          setError(data.error || "Erreur inconnue");
          setStatus("error");
        }
      } catch(e) {
        clearInterval(pollRef.current);
        setError("Erreur de connexion");
        setStatus("error");
      }
    }, 2000);
  };

  const convert = async () => {
    if (!file) return;
    setStatus("uploading"); setProgress(5); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch(`${BACKEND}/pdf/convert`, { method:"POST", body:fd });
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail); }
      const data = await res.json();
      setJobId(data.job_id);
      setStatus("processing");
      setProgress(10);
      pollJob(data.job_id);
    } catch(e) {
      setError(e.message);
      setStatus("error");
      setProgress(0);
    }
  };

  const reset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setFile(null); setStatus("idle"); setDownloadUrl(null);
    setError(""); setProgress(0); setJobId(null);
  };

  const s = {
    btn: { width:"100%", padding:"14px", border:"none", borderRadius:"12px", fontSize:"15px", fontWeight:"700", cursor:"pointer", transition:"all 0.2s" }
  };

  const statusLabel = { uploading:"⬆️ Upload en cours...", processing:"⚙️ Conversion en cours...", done:"✅ Terminé !", error:"❌ Erreur" };

  return (
    <div style={{ maxWidth:"520px", margin:"0 auto", padding:"40px 24px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"28px" }}>
        <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}>📄</div>
        <div>
          <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>PDF → DOCX</h2>
          <p style={{ fontSize:"13px",color:"#6b7280" }}>Convertissez vos PDFs en documents Word éditables</p>
        </div>
      </div>

      {/* Drop Zone */}
      <div onClick={()=>inputRef.current.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}
        style={{ border:`2px dashed ${drag?"#1d4ed8":"#d1d5db"}`,borderRadius:"14px",padding:"40px 24px",textAlign:"center",cursor:"pointer",background:drag?"#eff6ff":"#f9fafb",transition:"all 0.2s" }}>
        <div style={{ fontSize:"36px",marginBottom:"10px" }}>📂</div>
        <p style={{ color:"#6b7280",fontSize:"14px" }}>Glissez votre PDF ici ou <span style={{ color:"#1d4ed8",textDecoration:"underline" }}>parcourez</span></p>
        <p style={{ color:"#9ca3af",fontSize:"12px",marginTop:"4px" }}>Maximum 50MB</p>
        <input ref={inputRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
      </div>

      {file && (
        <div style={{ background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"10px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"10px",marginTop:"14px" }}>
          <span>📎</span>
          <span style={{ flex:1,fontSize:"13px",color:"#1e40af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.name}</span>
          <span style={{ fontSize:"12px",color:"#9ca3af" }}>{formatSize(file.size)}</span>
          <span style={{ cursor:"pointer",color:"#9ca3af",fontSize:"16px" }} onClick={reset}>×</span>
        </div>
      )}

      {error && <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"12px 16px",color:"#dc2626",fontSize:"13px",marginTop:"12px" }}>⚠️ {error}</div>}

      {/* Progress */}
      {(status==="uploading"||status==="processing") && (
        <div style={{ marginTop:"16px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:"12px",color:"#6b7280",marginBottom:"6px" }}>
            <span>{statusLabel[status]}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ background:"#e5e7eb",borderRadius:"6px",height:"8px",overflow:"hidden" }}>
            <div style={{ height:"100%",background:"linear-gradient(90deg,#1d4ed8,#7c3aed)",borderRadius:"6px",width:progress+"%",transition:"width 0.5s" }} />
          </div>
          {status==="processing" && (
            <p style={{ fontSize:"11px",color:"#9ca3af",marginTop:"6px",textAlign:"center" }}>
              Le traitement continue en arrière-plan — vous pouvez attendre ici ⏳
            </p>
          )}
        </div>
      )}

      {status!=="done" && (
        <button onClick={convert} disabled={!file||status==="uploading"||status==="processing"} style={{
          ...s.btn, marginTop:"16px",
          background:"linear-gradient(135deg,#1d4ed8,#7c3aed)", color:"#fff",
          opacity:!file||status==="uploading"||status==="processing"?0.5:1
        }}>
          {status==="uploading"?"⬆️ Upload...":status==="processing"?"⚙️ Conversion...":"📄 Convertir en DOCX"}
        </button>
      )}

      {status==="done" && downloadUrl && (
        <>
          <div style={{ textAlign:"center",marginTop:"20px",marginBottom:"16px" }}>
            <div style={{ fontSize:"40px",marginBottom:"8px" }}>🎉</div>
            <p style={{ fontWeight:"700",color:"#111827" }}>Conversion terminée !</p>
          </div>
          <a href={downloadUrl} download={filename} style={{
            display:"block",textAlign:"center",padding:"14px",borderRadius:"12px",
            background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",
            fontSize:"15px",fontWeight:"700",textDecoration:"none",marginBottom:"10px"
          }}>⬇️ Télécharger {filename}</a>
          <button onClick={reset} style={{ ...s.btn,background:"#f3f4f6",color:"#374151" }}>
            Convertir un autre PDF
          </button>
        </>
      )}
    </div>
  );
}

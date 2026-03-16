import { useState, useRef } from "react";
import AppIcon from "../components/AppIcon";

const BACKEND = "https://apps-api.cloudfactory.ma";

function formatSize(b) {
  if (!b) return "—";
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b/1024).toFixed(1) + " MB";
  return (b/1048576).toFixed(2) + " MB";
}

function formatSpeed(bps) {
  if (bps < 1024) return bps + " B/S";
  if (bps < 1048576) return (bps/1024).toFixed(0) + " KB/S";
  return (bps/1048576).toFixed(1) + " MB/S";
}

export default function PdfToDocx() {
  const [file, setFile]         = useState(null);
  const [drag, setDrag]         = useState(false);
  const [status, setStatus]     = useState("idle");
  const [uploadPct, setUploadPct] = useState(0);
  const [speed, setSpeed]       = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [convProgress, setConvProgress] = useState(0);
  const [downloadUrl, setDownloadUrl]   = useState(null);
  const [filename, setFilename] = useState("");
  const [error, setError]       = useState("");
  const inputRef = useRef();
  const pollRef  = useRef(null);
  const xhrRef   = useRef(null);

  const handleFile = (f) => {
    if (!f?.name.toLowerCase().endsWith(".pdf")) { setError("Veuillez sélectionner un fichier PDF."); return; }
    if (f.size > 50 * 1024 * 1024) { setError("File too large. Maximum 50MB."); return; }
    setFile(f); setError(""); setStatus("idle"); setDownloadUrl(null);
  };

  const pollJob = (jid) => {
    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`${BACKEND}/jobs/${jid}`);
        const data = await res.json();
        setConvProgress(data.progress || 0);
        if (data.status === "done") {
          clearInterval(pollRef.current);
          setDownloadUrl(`${BACKEND}/jobs/${jid}/download`);
          setFilename(data.filename || "document.docx");
          setStatus("done");
          setConvProgress(100);
        } else if (data.status === "error") {
          clearInterval(pollRef.current);
          setError(data.error || "Error inconnue");
          setStatus("error");
        }
      } catch(e) {
        clearInterval(pollRef.current);
        setError("Error de connexion");
        setStatus("error");
      }
    }, 2000);
  };

  const convert = () => {
    if (!file) return;
    setStatus("uploading"); setUploadPct(0); setSpeed(0); setTimeLeft(null); setError("");

    const fd = new FormData();
    fd.append("file", file);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    let startTime = Date.now();
    let lastLoaded = 0;

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const pct      = Math.round((e.loaded / e.total) * 100);
      const elapsed  = (Date.now() - startTime) / 1000;
      const bps      = e.loaded / elapsed;
      const remaining = (e.total - e.loaded) / bps;
      setUploadPct(pct);
      setSpeed(Math.round(bps));
      setTimeLeft(Math.round(remaining));
      lastLoaded = e.loaded;
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        setStatus("converting");
        setConvProgress(10);
        pollJob(data.job_id);
      } else {
        try {
          const e = JSON.parse(xhr.responseText);
          setError(e.detail || "Error serveur");
        } catch { setError("Error serveur"); }
        setStatus("error");
      }
    };

    xhr.onerror = () => { setError("Error de connexion"); setStatus("error"); };
    xhr.open("POST", `${BACKEND}/pdf/convert`);
    xhr.send(fd);
  };

  const reset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (xhrRef.current) xhrRef.current.abort();
    setFile(null); setStatus("idle"); setDownloadUrl(null);
    setError(""); setUploadPct(0); setConvProgress(0);
  };

  const s = {
    card: { background:"#fff", borderRadius:"16px", padding:"24px", border:"1px solid #e5e7eb", marginTop:"16px" },
    btn:  { width:"100%", padding:"14px", border:"none", borderRadius:"12px", fontSize:"15px", fontWeight:"700", cursor:"pointer" },
    bar:  (pct, color) => ({
      height:"100%", width:pct+"%", borderRadius:"6px",
      background: color, transition:"width 0.4s ease"
    })
  };

  return (
    <div style={{ maxWidth:"560px", margin:"0 auto", padding:"40px 24px" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"28px" }}>
        <div style={{ width:"44px",height:"44px",borderRadius:"12px",background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px" }}><AppIcon id="pdf" size={40} /></div>
        <div>
          <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827",margin:0 }}>PDF to DOCX</h2>
          <p style={{ fontSize:"13px",color:"#6b7280",margin:0 }}>Convertissez vos PDFs en documents Word éditables</p>
        </div>
      </div>

      {/* Drop Zone — masqué pendant traitement */}
      {status === "idle" && (
        <>
          <div onClick={()=>inputRef.current.click()}
            onDragOver={e=>{e.preventDefault();setDrag(true)}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}
            style={{ border:`2px dashed ${drag?"#1d4ed8":"#d1d5db"}`,borderRadius:"14px",padding:"48px 24px",textAlign:"center",cursor:"pointer",background:drag?"#eff6ff":"#f9fafb",transition:"all 0.2s" }}>
            <div style={{ fontSize:"40px",marginBottom:"12px" }}></div>
            <p style={{ color:"#374151",fontSize:"15px",fontWeight:"600" }}>Glissez votre PDF ici</p>
            <p style={{ color:"#9ca3af",fontSize:"12px",margin:"4px 0 0" }}>ou <span style={{ color:"#1d4ed8",textDecoration:"underline" }}>parcourez vos fichiers</span> — Maximum 50MB</p>
            <input ref={inputRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
          </div>

          {file && (
            <div style={{ background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"10px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"10px",marginTop:"14px" }}>
              <span style={{ fontSize:"18px" }}></span>
              <span style={{ flex:1,fontSize:"13px",color:"#1e40af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.name}</span>
              <span style={{ fontSize:"12px",color:"#6b7280",whiteSpace:"nowrap" }}>{formatSize(file.size)}</span>
              <span style={{ cursor:"pointer",color:"#9ca3af",fontSize:"18px",lineHeight:1 }} onClick={reset}>×</span>
            </div>
          )}

          {error && (
            <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"12px 16px",color:"#dc2626",fontSize:"13px",marginTop:"12px" }}>
               {error}
            </div>
          )}

          <button onClick={convert} disabled={!file} style={{
            ...s.btn, marginTop:"16px",
            background: file ? "linear-gradient(135deg,#1d4ed8,#7c3aed)" : "#e5e7eb",
            color: file ? "#fff" : "#9ca3af"
          }}>
             Convert to DOCX
          </button>
        </>
      )}

      {/* ── UPLOAD EN COURS ── */}
      {status === "uploading" && (
        <div style={s.card}>
          <p style={{ fontSize:"13px",color:"#6b7280",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"16px" }}>
            Téléchargement du fichier 1 sur 1
          </p>

          {/* File info */}
          <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px" }}>
            <span style={{ fontSize:"22px" }}></span>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:"14px",fontWeight:"600",color:"#111827",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file?.name}</p>
              <p style={{ fontSize:"12px",color:"#6b7280",margin:"2px 0 0" }}>{formatSize(file?.size)}</p>
            </div>
          </div>

          {/* Temps restant + vitesse */}
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:"12px",marginBottom:"8px" }}>
            <span style={{ color:"#374151",fontWeight:"600" }}>
              {timeLeft !== null
                ? `Temps restant ${timeLeft} SECONDE${timeLeft > 1 ? "S" : ""} — Vitesse de téléchargement ${formatSpeed(speed)}`
                : "Calcul en cours..."}
            </span>
            <span style={{ color:"#1d4ed8",fontWeight:"700" }}>{uploadPct}%</span>
          </div>

          {/* Barre upload */}
          <div style={{ background:"#e5e7eb",borderRadius:"6px",height:"10px",overflow:"hidden",marginBottom:"10px" }}>
            <div style={s.bar(uploadPct, "linear-gradient(90deg,#1d4ed8,#7c3aed)")} />
          </div>

          <p style={{ fontSize:"12px",color:"#9ca3af",textAlign:"center" }}>Téléchargé</p>
        </div>
      )}

      {/* ── CONVERSION EN COURS ── */}
      {status === "converting" && (
        <div style={s.card}>
          {/* Spinner animé */}
          <div style={{ textAlign:"center",marginBottom:"20px" }}>
            <div style={{ fontSize:"48px",animation:"spin 2s linear infinite",display:"inline-block" }}></div>
          </div>

          <p style={{ fontSize:"16px",fontWeight:"700",color:"#111827",textAlign:"center",margin:"0 0 8px" }}>
            Conversion PDF en WORD en cours...
          </p>
          <p style={{ fontSize:"13px",color:"#6b7280",textAlign:"center",lineHeight:"1.6",margin:"0 0 20px" }}>
            Ne fermez pas votre navigateur. Merci d'attendre que vos fichiers soient téléchargés et traités 
          </p>

          {/* Barre conversion */}
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:"12px",color:"#6b7280",marginBottom:"6px" }}>
            <span>Processing...</span>
            <span style={{ fontWeight:"700",color:"#7c3aed" }}>{convProgress}%</span>
          </div>
          <div style={{ background:"#e5e7eb",borderRadius:"6px",height:"10px",overflow:"hidden" }}>
            <div style={s.bar(convProgress, "linear-gradient(90deg,#7c3aed,#a855f7)")} />
          </div>

          <div style={{ display:"flex",alignItems:"center",gap:"8px",background:"#faf5ff",border:"1px solid #e9d5ff",borderRadius:"10px",padding:"12px 16px",marginTop:"16px" }}>
            <span></span>
            <p style={{ fontSize:"12px",color:"#7c3aed",margin:0 }}>
              
            </p>
          </div>

          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── TERMINÉ ── */}
      {status === "done" && downloadUrl && (
        <div style={s.card}>
          <div style={{ textAlign:"center",marginBottom:"20px" }}>
            <div style={{ fontSize:"52px",marginBottom:"8px" }}></div>
            <p style={{ fontSize:"18px",fontWeight:"700",color:"#111827",margin:"0 0 4px" }}>Conversion terminée !</p>
            <p style={{ fontSize:"13px",color:"#6b7280",margin:0 }}>Votre fichier est prêt à télécharger</p>
          </div>

          <a href={downloadUrl} download={filename} style={{
            display:"block",textAlign:"center",padding:"16px",borderRadius:"12px",
            background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",
            fontSize:"15px",fontWeight:"700",textDecoration:"none",marginBottom:"10px"
          }}>
             Download {filename}
          </a>

          <button onClick={reset} style={{ ...s.btn,background:"#f3f4f6",color:"#374151",border:"1px solid #e5e7eb" }}>
            Convert another PDF
          </button>
        </div>
      )}

      {/* Error hors idle */}
      {status === "error" && (
        <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"12px",padding:"20px",marginTop:"16px",textAlign:"center" }}>
          <div style={{ fontSize:"36px",marginBottom:"8px" }}>❌</div>
          <p style={{ fontWeight:"700",color:"#dc2626",margin:"0 0 4px" }}>Error</p>
          <p style={{ fontSize:"13px",color:"#dc2626",margin:"0 0 16px" }}>{error}</p>
          <button onClick={reset} style={{ ...s.btn,background:"#dc2626",color:"#fff" }}>Réessayer</button>
        </div>
      )}

    </div>
  );
}

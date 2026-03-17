import { useState, useRef } from "react";
import AppIcon from "../components/AppIcon";

const BACKEND = "https://apps-api.cloudfactory.ma";

function formatSize(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b/1024).toFixed(1) + " KB";
  return (b/1048576).toFixed(1) + " MB";
}

export default function Ocr() {
  const [file, setFile]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [drag, setDrag]     = useState(false);
  const [lang, setLang]     = useState("fra+eng+ara");
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [text, setText]     = useState("");
  const [stats, setStats]   = useState(null);
  const [error, setError]   = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef();
  const ALLOWED = [".jpg",".jpeg",".png",".bmp",".tiff",".tif",".webp",".pdf"];

  const handleFile = (f) => {
    if (f && f.size > 50 * 1024 * 1024) { setError("File too large. Maximum 50MB."); return; }
    if (!f) return;
    const ext = "."+f.name.split(".").pop().toLowerCase();
    if (!ALLOWED.includes(ext)) { setError("Format non supporté."); return; }
    setFile(f); setError(""); setText(""); setStats(null); setStatus("idle");
    setPreview(ext===".pdf" ? "pdf" : URL.createObjectURL(f));
  };

  const pollJob = async (jobId) => {
    for (let i = 0; i < 120; i++) {
      await new Promise(r => setTimeout(r, 1500));
      const res = await fetch(`${BACKEND}/jobs/${jobId}`);
      const job = await res.json();
      setProgress(job.progress || 0);
      if (job.status === "done") {
        // Récupérer le résultat OCR
        const r2 = await fetch(`${BACKEND}/jobs/${jobId}/ocr-result`);
        const data = await r2.json();
        setText(data.text || "");
        setStats({ chars: data.chars || 0, words: data.words || 0 });
        setStatus("done");
        return;
      }
      if (job.status === "error") {
        throw new Error(job.error || "Error OCR");
      }
    }
    throw new Error("Timeout — réessayez avec un fichier plus petit");
  };

  const runOcr = async () => {
    if (!file) return;
    setStatus("loading"); setProgress(5); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${BACKEND}/ocr?lang=${encodeURIComponent(lang)}`, { method:"POST", body:fd });
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail); }
      const data = await res.json();
      await pollJob(data.job_id);
    } catch(e) {
      setError(e.message); setStatus("error"); setProgress(0);
    }
  };

  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const reset = () => { setFile(null); setPreview(null); setText(""); setStats(null); setStatus("idle"); setError(""); setProgress(0); };

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name.replace(/\.[^.]+$/, ".txt");
    a.click();
  };

  return (
    <div style={{ maxWidth:"900px", margin:"0 auto", padding:"40px 24px" }}>
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px" }}>
          <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#f5f3ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}><AppIcon id="ocr" size={40} /></div>
          <div>
            <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>OCR : Image to Text</h2>
            <p style={{ fontSize:"13px",color:"#6b7280" }}>Extrayez le texte de vos images et PDFs scannés</p>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
        {/* LEFT */}
        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"24px" }}>
          <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"14px" }}>Source file</p>

          <div
            onClick={() => inputRef.current.click()}
            onDragOver={e=>{e.preventDefault();setDrag(true)}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}
            style={{ border:`2px dashed ${drag?"#7c3aed":"#d1d5db"}`,borderRadius:"12px",padding:"28px 16px",textAlign:"center",cursor:"pointer",background:drag?"#f5f3ff":"#f9fafb",transition:"all 0.2s" }}
          >
            <div style={{ fontSize:"32px",marginBottom:"8px" }}>🖼️</div>
            <p style={{ color:"#6b7280",fontSize:"13px" }}>Glissez une image ou PDF ou <span style={{ color:"#7c3aed",textDecoration:"underline" }}>parcourez</span></p>
            <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.bmp,.tiff,.tif,.webp,.pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
          </div>

          {preview && preview !== "pdf" && (
            <div style={{ marginTop:"12px",borderRadius:"10px",overflow:"hidden",maxHeight:"160px",display:"flex",alignItems:"center",justifyContent:"center",background:"#f9fafb" }}>
              <img src={preview} alt="preview" style={{ maxWidth:"100%",maxHeight:"160px",objectFit:"contain" }} />
            </div>
          )}
          {preview === "pdf" && (
            <div style={{ marginTop:"12px",background:"#f9fafb",borderRadius:"10px",padding:"24px",textAlign:"center",color:"#6b7280",fontSize:"13px" }}>
              PDF sélectionné — toutes les pages seront traitées
            </div>
          )}

          {file && (
            <div style={{ background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:"10px",padding:"10px 14px",display:"flex",alignItems:"center",gap:"10px",marginTop:"12px" }}>
              <span style={{ flex:1,fontSize:"12px",color:"#6d28d9",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.name}</span>
              <span style={{ fontSize:"11px",color:"#9ca3af" }}>{formatSize(file.size)}</span>
              <span style={{ cursor:"pointer",color:"#9ca3af" }} onClick={reset}>×</span>
            </div>
          )}

          {error && <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"10px 14px",color:"#dc2626",fontSize:"12px",marginTop:"10px" }}>⚠️ {error}</div>}

          <div style={{ marginTop:"14px" }}>
            <label style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",display:"block",marginBottom:"6px" }}>Language</label>
            <select value={lang} onChange={e=>setLang(e.target.value)} style={{ width:"100%",padding:"9px 12px",border:"1px solid #e5e7eb",borderRadius:"10px",fontSize:"13px",background:"#f9fafb" }}>
              <option value="fra+eng+ara">Français + Anglais + Arabe</option>
              <option value="fra">Français</option>
              <option value="eng">Anglais</option>
              <option value="ara">Arabe</option>
              <option value="fra+eng">Français + Anglais</option>
            </select>
          </div>

          {status==="loading" && (
            <div style={{ marginTop:"14px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:"11px",color:"#6b7280",marginBottom:"6px" }}>
                <span>Analyse en cours...</span><span>{progress}%</span>
              </div>
              <div style={{ background:"#e5e7eb",borderRadius:"6px",height:"4px",overflow:"hidden" }}>
                <div style={{ height:"100%",background:"linear-gradient(90deg,#7c3aed,#1d4ed8)",borderRadius:"6px",width:progress+"%",transition:"width 0.4s" }} />
              </div>
            </div>
          )}

          <button onClick={runOcr} disabled={!file||status==="loading"} style={{
            width:"100%",marginTop:"14px",padding:"13px",border:"none",borderRadius:"12px",
            background:"linear-gradient(135deg,#7c3aed,#1d4ed8)",color:"#fff",
            fontSize:"14px",fontWeight:"700",cursor:!file||status==="loading"?"not-allowed":"pointer",
            opacity:!file||status==="loading"?0.5:1
          }}>
            {status==="loading" ? "Extraction en cours..." : "Extraire le texte"}
          </button>
        </div>

        {/* RIGHT */}
        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"24px",display:"flex",flexDirection:"column" }}>
          <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"14px" }}>Extracted text</p>
          <div style={{ flex:1,minHeight:"260px",background:"#f9fafb",borderRadius:"12px",padding:"16px",fontSize:"13px",lineHeight:"1.7",color: text?"#111827":"#9ca3af",whiteSpace:"pre-wrap",overflowY:"auto",fontStyle:text?"normal":"italic" }}>
            {text || "Le texte extrait apparaîtra ici..."}
          </div>

          {stats && (
            <div style={{ display:"flex",gap:"10px",marginTop:"12px" }}>
              {[["Mots",stats.words],["Caractères",stats.chars]].map(([k,v])=>(
                <div key={k} style={{ flex:1,background:"#f3f4f6",borderRadius:"10px",padding:"10px",textAlign:"center" }}>
                  <div style={{ fontSize:"22px",fontWeight:"800",color:"#7c3aed" }}>{v}</div>
                  <div style={{ fontSize:"11px",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em" }}>{k}</div>
                </div>
              ))}
            </div>
          )}

          {text && (
            <div style={{ display:"flex",gap:"8px",marginTop:"12px" }}>
              <button onClick={copy} style={{ flex:1,padding:"9px 6px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#eff6ff",color:"#1d4ed8",fontSize:"12px",fontWeight:"600",cursor:"pointer" }}>
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={downloadText} style={{ flex:1,padding:"9px 6px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#f5f3ff",color:"#7c3aed",fontSize:"12px",fontWeight:"600",cursor:"pointer" }}>
                Download .TXT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

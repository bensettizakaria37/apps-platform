import { useState, useRef } from "react";

const BACKEND = "https://apps-api.cloudfactory.ma";
const LANGS = [
  { value:"fra+eng+ara", label:"🌍 Français + Anglais + Arabe" },
  { value:"fra",         label:"🇫🇷 Français" },
  { value:"eng",         label:"🇬🇧 Anglais" },
  { value:"ara",         label:"🇸🇦 Arabe" },
  { value:"fra+eng",     label:"🇫🇷 Français + Anglais" },
];

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
    if (!f) return;
    const ext = "."+f.name.split(".").pop().toLowerCase();
    if (!ALLOWED.includes(ext)) { setError("Format non supporté."); return; }
    setFile(f); setError(""); setText(""); setStats(null); setStatus("idle");
    setPreview(ext===".pdf" ? "pdf" : URL.createObjectURL(f));
  };

  const runOcr = async () => {
    if (!file) return;
    setStatus("loading"); setProgress(10); setError("");
    const interval = setInterval(() => setProgress(p => p<80 ? p+7 : p), 700);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${BACKEND}/ocr?lang=${lang}&output=text`, { method:"POST", body:fd });
      clearInterval(interval); setProgress(100);
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail); }
      const data = await res.json();
      setText(data.text); setStats({ chars:data.chars, words:data.words }); setStatus("done");
    } catch(e) {
      clearInterval(interval); setError(e.message); setStatus("error"); setProgress(0);
    }
  };

  const download = async (fmt) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${BACKEND}/ocr?lang=${lang}&output=${fmt}`, { method:"POST", body:fd });
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name.replace(/\.[^.]+$/, fmt==="txt"?".txt":".docx");
    a.click();
  };

  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const reset = () => { setFile(null); setPreview(null); setText(""); setStats(null); setStatus("idle"); setError(""); setProgress(0); };

  return (
    <div style={{ maxWidth:"900px", margin:"0 auto", padding:"40px 24px" }}>
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px" }}>
          <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#f5f3ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}>🖼️</div>
          <div>
            <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>OCR — Image → Texte</h2>
            <p style={{ fontSize:"13px",color:"#6b7280" }}>Extrayez le texte de vos images et PDFs scannés</p>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
        {/* LEFT */}
        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"24px" }}>
          <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"14px" }}>Fichier source</p>

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
              📄 PDF sélectionné — toutes les pages seront traitées
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
            <p style={{ fontSize:"11px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"6px" }}>Langue</p>
            <select value={lang} onChange={e=>setLang(e.target.value)} style={{ width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1px solid #e5e7eb",fontSize:"13px",background:"#fff",color:"#111827",outline:"none" }}>
              {LANGS.map(l=><option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>

          {status==="loading" && (
            <div style={{ marginTop:"14px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:"11px",color:"#6b7280",marginBottom:"6px" }}>
                <span>Analyse...</span><span>{progress}%</span>
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
            {status==="loading" ? "⏳ Extraction..." : "🔍 Extraire le texte"}
          </button>
        </div>

        {/* RIGHT */}
        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"24px",display:"flex",flexDirection:"column" }}>
          <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"14px" }}>Texte extrait</p>
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
              {[
                { label: copied?"✅ Copié !":"📋 Copier", action: copy, bg:"#eff6ff", color:"#1d4ed8" },
                { label:"⬇️ .TXT",  action:()=>download("txt"),  bg:"#f5f3ff", color:"#7c3aed" },
                { label:"⬇️ .DOCX", action:()=>download("docx"), bg:"#f0fdf4", color:"#059669" },
              ].map(btn=>(
                <button key={btn.label} onClick={btn.action} style={{
                  flex:1,padding:"9px 6px",border:"1px solid #e5e7eb",borderRadius:"10px",
                  background:btn.bg,color:btn.color,fontSize:"12px",fontWeight:"600",cursor:"pointer"
                }}>{btn.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

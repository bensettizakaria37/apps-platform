import { useState, useRef } from "react";

const BACKEND = "https://apps-api.cloudfactory.ma";

function formatSize(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b/1024).toFixed(1) + " KB";
  return (b/1048576).toFixed(1) + " MB";
}

export default function CompressPdf() {
  const [file, setFile]         = useState(null);
  const [drag, setDrag]         = useState(false);
  const [status, setStatus]     = useState("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f?.name.toLowerCase().endsWith(".pdf")) { setError("Veuillez sélectionner un fichier PDF."); return; }
    setFile(f); setError(""); setStatus("idle"); setResult(null);
  };

  const compress = async () => {
    if (!file) return;
    setStatus("compressing"); setProgress(10); setError("");
    const interval = setInterval(() => setProgress(p => p < 85 ? p+7 : p), 700);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${BACKEND}/pdf/compress`, { method:"POST", body:fd });
      clearInterval(interval); setProgress(100);
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail); }

      const originalSize   = parseInt(res.headers.get("X-Original-Size") || "0");
      const compressedSize = parseInt(res.headers.get("X-Compressed-Size") || "0");
      const reduction      = parseFloat(res.headers.get("X-Reduction") || "0");

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const name = file.name.replace(".pdf", "_compressed.pdf");

      setResult({ url, name, originalSize, compressedSize, reduction });
      setStatus("done");
    } catch(e) {
      clearInterval(interval); setError(e.message); setStatus("error"); setProgress(0);
    }
  };

  const reset = () => { setFile(null); setStatus("idle"); setResult(null); setError(""); setProgress(0); };

  return (
    <div style={{ maxWidth:"520px", margin:"0 auto", padding:"40px 24px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"28px" }}>
        <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}>🗜️</div>
        <div>
          <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>Compresser PDF</h2>
          <p style={{ fontSize:"13px",color:"#6b7280" }}>Réduisez la taille de vos PDFs sans perte de qualité visible</p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}
        style={{ border:`2px dashed ${drag?"#059669":"#d1d5db"}`,borderRadius:"14px",padding:"40px 24px",textAlign:"center",cursor:"pointer",background:drag?"#f0fdf4":"#f9fafb",transition:"all 0.2s" }}
      >
        <div style={{ fontSize:"36px",marginBottom:"10px" }}>📂</div>
        <p style={{ color:"#6b7280",fontSize:"14px" }}>Glissez votre PDF ici ou <span style={{ color:"#059669",textDecoration:"underline" }}>parcourez</span></p>
        <input ref={inputRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
      </div>

      {file && (
        <div style={{ background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"10px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"10px",marginTop:"14px" }}>
          <span>📎</span>
          <span style={{ flex:1,fontSize:"13px",color:"#166534",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.name}</span>
          <span style={{ fontSize:"12px",color:"#9ca3af" }}>{formatSize(file.size)}</span>
          <span style={{ cursor:"pointer",color:"#9ca3af",fontSize:"16px" }} onClick={reset}>×</span>
        </div>
      )}

      {error && <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"12px 16px",color:"#dc2626",fontSize:"13px",marginTop:"12px" }}>⚠️ {error}</div>}

      {status==="compressing" && (
        <div style={{ marginTop:"16px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:"12px",color:"#6b7280",marginBottom:"6px" }}>
            <span>Compression en cours...</span><span>{progress}%</span>
          </div>
          <div style={{ background:"#e5e7eb",borderRadius:"6px",height:"6px",overflow:"hidden" }}>
            <div style={{ height:"100%",background:"linear-gradient(90deg,#059669,#10b981)",borderRadius:"6px",width:progress+"%",transition:"width 0.4s" }} />
          </div>
        </div>
      )}

      {status !== "done" && (
        <button onClick={compress} disabled={!file||status==="compressing"} style={{
          width:"100%",marginTop:"16px",padding:"14px",border:"none",borderRadius:"12px",
          background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",
          fontSize:"15px",fontWeight:"700",
          cursor:!file||status==="compressing"?"not-allowed":"pointer",
          opacity:!file||status==="compressing"?0.5:1,transition:"all 0.2s"
        }}>
          {status==="compressing" ? "⏳ Compression..." : "🗜️ Compresser le PDF"}
        </button>
      )}

      {status==="done" && result && (
        <>
          {/* Stats */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginTop:"20px" }}>
            {[
              { label:"Taille originale", value:formatSize(result.originalSize), color:"#dc2626", bg:"#fef2f2" },
              { label:"Taille compressée", value:formatSize(result.compressedSize), color:"#059669", bg:"#f0fdf4" },
              { label:"Réduction", value:`-${result.reduction}%`, color:"#1d4ed8", bg:"#eff6ff" },
            ].map(s=>(
              <div key={s.label} style={{ background:s.bg,borderRadius:"12px",padding:"14px",textAlign:"center" }}>
                <div style={{ fontSize:"18px",fontWeight:"800",color:s.color }}>{s.value}</div>
                <div style={{ fontSize:"10px",color:"#6b7280",marginTop:"4px",textTransform:"uppercase",letterSpacing:"0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <a href={result.url} download={result.name} style={{
            display:"block",textAlign:"center",padding:"14px",borderRadius:"12px",marginTop:"16px",
            background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",
            fontSize:"15px",fontWeight:"700",textDecoration:"none"
          }}>⬇️ Télécharger {result.name}</a>

          <button onClick={reset} style={{ width:"100%",marginTop:"10px",padding:"10px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#fff",color:"#6b7280",fontSize:"13px",cursor:"pointer" }}>
            Compresser un autre PDF
          </button>
        </>
      )}
    </div>
  );
}

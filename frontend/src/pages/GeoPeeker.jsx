import { useState } from "react";
import AppIcon from "../components/AppIcon";

const BACKEND = "https://apps-api.cloudfactory.ma";

const statusColor = (s) => {
  if (!s) return { bg:"#f3f4f6", color:"#6b7280" };
  if (s < 300) return { bg:"#f0fdf4", color:"#15803d" };
  if (s < 400) return { bg:"#fffbeb", color:"#d97706" };
  return { bg:"#fef2f2", color:"#dc2626" };
};

export default function GeoPeeker() {
  const [url, setUrl]         = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus]   = useState("idle");
  const [error, setError]     = useState("");
  const [checkedUrl, setCheckedUrl] = useState("");

  const check = async () => {
    let u = url.trim();
    if (!u) return;
    if (!u.startsWith("http")) u = "https://" + u;
    setStatus("loading"); setError(""); setResults([]);
    try {
      const res = await fetch(`${BACKEND}/geopeek?url=${encodeURIComponent(u)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResults(data.results);
      setCheckedUrl(data.url);
      setStatus("done");
    } catch(e) {
      setError(e.message); setStatus("error");
    }
  };

  const reset = () => { setUrl(""); setResults([]); setStatus("idle"); setError(""); setCheckedUrl(""); };

  const online  = results.filter(r => r.status && r.status < 400).length;
  const offline = results.filter(r => r.error || (r.status && r.status >= 400)).length;

  return (
    <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px" }}>
          <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}><AppIcon id="geopeeker" size={40} /></div>
          <div>
            <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>GeoPeeker</h2>
            <p style={{ fontSize:"13px",color:"#6b7280" }}>See how your website responds from different locations around the world</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"14px",padding:"20px",marginBottom:"20px" }}>
        <label style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",display:"block",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"0.08em" }}>Website URL</label>
        <div style={{ display:"flex",gap:"10px" }}>
          <input
            value={url}
            onChange={e=>setUrl(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&check()}
            placeholder="e.g. google.com or https://apps.cloudfactory.ma"
            style={{ flex:1,padding:"11px 14px",border:"1px solid #e5e7eb",borderRadius:"10px",fontSize:"13px",outline:"none",background:"#f9fafb",fontFamily:"monospace" }}
          />
          <button onClick={check} disabled={!url.trim()||status==="loading"} style={{
            padding:"11px 24px",border:"none",borderRadius:"10px",
            background:"linear-gradient(135deg,#1d4ed8,#7c3aed)",color:"#fff",
            fontSize:"13px",fontWeight:"700",cursor:url.trim()&&status!=="loading"?"pointer":"not-allowed",
            opacity:url.trim()&&status!=="loading"?1:0.5,whiteSpace:"nowrap"
          }}>
            {status==="loading" ? "Checking..." : "Check Now"}
          </button>
          {results.length > 0 && <button onClick={reset} style={{ padding:"11px 16px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#f9fafb",color:"#6b7280",fontSize:"13px",fontWeight:"600",cursor:"pointer" }}>×</button>}
        </div>

        {status==="loading" && (
          <div style={{ marginTop:"12px",display:"flex",alignItems:"center",gap:"10px",color:"#6b7280",fontSize:"13px" }}>
            <div style={{ width:"16px",height:"16px",border:"2px solid #e5e7eb",borderTop:"2px solid #1d4ed8",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
            Checking from 6 locations worldwide...
          </div>
        )}

        {error && <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"10px 14px",color:"#dc2626",fontSize:"12px",marginTop:"10px" }}>⚠️ {error}</div>}
      </div>

      {/* Summary */}
      {results.length > 0 && (
        <>
          <div style={{ display:"flex",gap:"12px",marginBottom:"20px" }}>
            <div style={{ flex:1,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"12px",padding:"16px",textAlign:"center" }}>
              <div style={{ fontSize:"28px",fontWeight:"800",color:"#15803d" }}>{online}</div>
              <div style={{ fontSize:"12px",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em" }}>Online</div>
            </div>
            <div style={{ flex:1,background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"12px",padding:"16px",textAlign:"center" }}>
              <div style={{ fontSize:"28px",fontWeight:"800",color:"#dc2626" }}>{offline}</div>
              <div style={{ fontSize:"12px",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em" }}>Issues</div>
            </div>
            <div style={{ flex:2,background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:"12px",padding:"16px",display:"flex",alignItems:"center",gap:"10px" }}>
              <span style={{ fontSize:"12px",color:"#6b7280" }}>Checked:</span>
              <span style={{ fontSize:"13px",fontWeight:"600",color:"#111827",fontFamily:"monospace",wordBreak:"break-all" }}>{checkedUrl}</span>
            </div>
          </div>

          {/* Results grid */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px" }}>
            {results.map(r => {
              const sc = statusColor(r.status);
              const hasError = !!r.error;
              return (
                <div key={r.region_id} style={{ background:"#fff",border:`1px solid ${hasError||r.status>=400?"#fecaca":"#e5e7eb"}`,borderRadius:"14px",padding:"20px" }}>

                  {/* Region header */}
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
                      <span style={{ fontSize:"28px" }}>{r.region_flag}</span>
                      <div>
                        <div style={{ fontSize:"15px",fontWeight:"700",color:"#111827" }}>{r.region_name}</div>
                        <div style={{ fontSize:"11px",color:"#9ca3af" }}>{r.colo ? `Colo: ${r.colo}` : ""}</div>
                      </div>
                    </div>
                    <span style={{ fontSize:"12px",fontWeight:"700",padding:"4px 12px",borderRadius:"20px",background:hasError?"#fef2f2":sc.bg,color:hasError?"#dc2626":sc.color }}>
                      {hasError ? "Error" : `${r.status} ${r.status_text||""}`}
                    </span>
                  </div>

                  {hasError ? (
                    <div style={{ fontSize:"12px",color:"#dc2626",background:"#fef2f2",borderRadius:"8px",padding:"10px 12px" }}>{r.error}</div>
                  ) : (
                    <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
                      {/* Response time */}
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"13px" }}>
                        <span style={{ color:"#6b7280" }}>Response time</span>
                        <span style={{ fontWeight:"700",color:r.response_time<500?"#15803d":r.response_time<1500?"#d97706":"#dc2626" }}>{r.response_time}ms</span>
                      </div>
                      {/* Bar */}
                      <div style={{ background:"#f3f4f6",borderRadius:"6px",height:"6px",overflow:"hidden" }}>
                        <div style={{ height:"100%",borderRadius:"6px",width:`${Math.min(r.response_time/30,100)}%`,background:r.response_time<500?"#22c55e":r.response_time<1500?"#f59e0b":"#ef4444",transition:"width 0.8s ease" }} />
                      </div>

                      {r.server && (
                        <div style={{ display:"flex",justifyContent:"space-between",fontSize:"12px",marginTop:"4px" }}>
                          <span style={{ color:"#6b7280" }}>Server</span>
                          <span style={{ fontWeight:"600",color:"#111827",fontFamily:"monospace" }}>{r.server}</span>
                        </div>
                      )}
                      {r.content_type && (
                        <div style={{ display:"flex",justifyContent:"space-between",fontSize:"12px" }}>
                          <span style={{ color:"#6b7280" }}>Content-Type</span>
                          <span style={{ fontWeight:"600",color:"#111827",fontFamily:"monospace",fontSize:"11px" }}>{r.content_type.split(";")[0]}</span>
                        </div>
                      )}
                      {r.block_message && (
                        <div style={{ fontSize:"12px",color:"#dc2626",background:"#fef2f2",borderRadius:"8px",padding:"8px 12px",marginTop:"4px",fontStyle:"italic" }}>⚠️ {r.block_message}</div>
                      )}
                      {r.powered_by && (
                        <div style={{ display:"flex",justifyContent:"space-between",fontSize:"12px" }}>
                          <span style={{ color:"#6b7280" }}>Powered by</span>
                          <span style={{ fontWeight:"600",color:"#111827",fontFamily:"monospace" }}>{r.powered_by}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

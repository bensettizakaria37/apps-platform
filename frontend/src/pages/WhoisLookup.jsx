import { useState } from "react";
import AppIcon from "../components/AppIcon";

const BACKEND = "https://apps-api.cloudfactory.ma";

export default function WhoisLookup() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError]   = useState("");

  const lookup = async () => {
    const d = domain.trim().replace(/https?:\/\//, "").split("/")[0];
    if (!d) return;
    setStatus("loading"); setError(""); setResult(null);
    try {
      const res = await fetch(`${BACKEND}/whois?domain=${encodeURIComponent(d)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResult(data);
      setStatus("done");
    } catch(e) {
      setError(e.message); setStatus("error");
    }
  };

  const reset = () => { setDomain(""); setResult(null); setStatus("idle"); setError(""); };

  const Field = ({ label, value, mono }) => (
    <div style={{ display:"flex",gap:"12px",padding:"9px 0",borderBottom:"1px solid #f3f4f6" }}>
      <span style={{ width:"160px",flexShrink:0,fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",paddingTop:"1px" }}>{label}</span>
      <span style={{ fontSize:"13px",color:"#111827",wordBreak:"break-all",fontFamily:mono?"monospace":"inherit" }}>{value || "—"}</span>
    </div>
  );

  return (
    <div style={{ maxWidth:"860px", margin:"0 auto", padding:"40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px" }}>
          <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#fdf4ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}><AppIcon id="whois" size={40} /></div>
          <div>
            <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>Who.is — Domain Lookup</h2>
            <p style={{ fontSize:"13px",color:"#6b7280" }}>Get registration details and ownership info for any domain</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"14px",padding:"20px",marginBottom:"20px" }}>
        <label style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",display:"block",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"0.08em" }}>Domain Name</label>
        <div style={{ display:"flex",gap:"10px" }}>
          <input
            value={domain}
            onChange={e=>setDomain(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&lookup()}
            placeholder="e.g. google.com or https://google.com"
            style={{ flex:1,padding:"11px 14px",border:"1px solid #e5e7eb",borderRadius:"10px",fontSize:"13px",outline:"none",background:"#f9fafb",fontFamily:"monospace" }}
          />
          <button onClick={lookup} disabled={!domain.trim()||status==="loading"} style={{
            padding:"11px 24px",border:"none",borderRadius:"10px",
            background:"linear-gradient(135deg,#9333ea,#6d28d9)",color:"#fff",
            fontSize:"13px",fontWeight:"700",cursor:domain.trim()&&status!=="loading"?"pointer":"not-allowed",
            opacity:domain.trim()&&status!=="loading"?1:0.5,whiteSpace:"nowrap"
          }}>
            {status==="loading" ? "Looking up..." : "Lookup"}
          </button>
          {result && <button onClick={reset} style={{ padding:"11px 16px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#f9fafb",color:"#6b7280",fontSize:"13px",fontWeight:"600",cursor:"pointer" }}>×</button>}
        </div>

        {status==="loading" && (
          <div style={{ marginTop:"12px",display:"flex",alignItems:"center",gap:"10px",color:"#6b7280",fontSize:"13px" }}>
            <div style={{ width:"16px",height:"16px",border:"2px solid #e5e7eb",borderTop:"2px solid #9333ea",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
            Querying WHOIS servers...
          </div>
        )}

        {error && <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"10px 14px",color:"#dc2626",fontSize:"12px",marginTop:"10px" }}>⚠️ {error}</div>}
      </div>

      {/* Result */}
      {result && (
        <div style={{ display:"flex",flexDirection:"column",gap:"16px" }}>

          {/* Banner */}
          <div style={{ background:"#fdf4ff",border:"1px solid #e9d5ff",borderRadius:"14px",padding:"20px 24px",display:"flex",alignItems:"center",gap:"16px" }}>
            <div style={{ fontSize:"36px" }}>🌐</div>
            <div>
              <div style={{ fontSize:"18px",fontWeight:"800",color:"#111827" }}>{result.domain}</div>
              <div style={{ fontSize:"13px",color:"#6b7280",marginTop:"2px" }}>{result.registrar || "Unknown registrar"}</div>
            </div>
          </div>

          {/* Details */}
          <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"14px",padding:"20px" }}>

            <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px" }}>Registration</p>
            <Field label="Registrar"   value={result.registrar} />
            <Field label="Created"     value={result.creation} />
            <Field label="Expires"     value={result.expiration} />
            <Field label="Updated"     value={result.updated} />
            <Field label="DNSSEC"      value={result.dnssec} mono />

            <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Registrant</p>
            <Field label="Organization" value={result.org} />
            <Field label="Country"      value={result.country} />
            {result.emails?.map((e,i) => <Field key={i} label={i===0?"Email":`Email ${i+1}`} value={e} mono />)}

            {result.name_servers?.length > 0 && (
              <>
                <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Name Servers</p>
                {result.name_servers.map((ns,i) => <Field key={i} label={`NS ${i+1}`} value={ns.toLowerCase()} mono />)}
              </>
            )}

            {result.status?.length > 0 && (
              <>
                <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Status</p>
                <div style={{ display:"flex",flexWrap:"wrap",gap:"6px",paddingTop:"4px" }}>
                  {result.status.map((s,i) => (
                    <span key={i} style={{ fontSize:"11px",fontWeight:"600",padding:"3px 10px",borderRadius:"20px",background:"#f0fdf4",color:"#15803d",border:"1px solid #bbf7d0" }}>
                      {s.split(" ")[0]}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

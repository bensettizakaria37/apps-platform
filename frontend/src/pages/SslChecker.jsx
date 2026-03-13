import { useState } from "react";
import AppIcon from "../components/AppIcon";

const BACKEND = "https://apps-api.cloudfactory.ma";

export default function SslChecker() {
  const [host, setHost]     = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError]   = useState("");

  const check = async () => {
    const h = host.trim().replace(/https?:\/\//, "").split("/")[0];
    if (!h) return;
    setStatus("loading"); setError(""); setResult(null);
    try {
      const res = await fetch(`${BACKEND}/ssl-check?host=${encodeURIComponent(h)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Erreur serveur");
      setResult(data);
      setStatus("done");
    } catch(e) {
      setError(e.message);
      setStatus("error");
    }
  };

  const reset = () => { setHost(""); setResult(null); setStatus("idle"); setError(""); };

  const daysColor = (d) => d > 30 ? "#059669" : d > 7 ? "#d97706" : "#dc2626";
  const daysBg    = (d) => d > 30 ? "#f0fdf4"  : d > 7 ? "#fffbeb"  : "#fef2f2";

  const Field = ({ label, value, mono }) => (
    <div style={{ display:"flex",gap:"12px",padding:"9px 0",borderBottom:"1px solid #f3f4f6" }}>
      <span style={{ width:"180px",flexShrink:0,fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",paddingTop:"1px" }}>{label}</span>
      <span style={{ fontSize:"13px",color:"#111827",wordBreak:"break-all",fontFamily:mono?"monospace":"inherit" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ maxWidth:"860px", margin:"0 auto", padding:"40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px" }}>
          <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}><AppIcon id="ssl" size={40} /></div>
          <div>
            <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>SSL Checker</h2>
            <p style={{ fontSize:"13px",color:"#6b7280" }}>Vérifiez la validité et les détails du certificat SSL d'un domaine</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"14px",padding:"20px",marginBottom:"20px" }}>
        <label style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",display:"block",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"0.08em" }}>Domaine</label>
        <div style={{ display:"flex",gap:"10px" }}>
          <input
            value={host}
            onChange={e=>setHost(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&check()}
            placeholder="ex: google.com ou https://google.com"
            style={{ flex:1,padding:"11px 14px",border:"1px solid #e5e7eb",borderRadius:"10px",fontSize:"13px",outline:"none",background:"#f9fafb",fontFamily:"monospace" }}
          />
          <button onClick={check} disabled={!host.trim()||status==="loading"} style={{
            padding:"11px 24px",border:"none",borderRadius:"10px",
            background:"linear-gradient(135deg,#059669,#0d9488)",color:"#fff",
            fontSize:"13px",fontWeight:"700",cursor:host.trim()&&status!=="loading"?"pointer":"not-allowed",
            opacity:host.trim()&&status!=="loading"?1:0.5,whiteSpace:"nowrap"
          }}>
            {status==="loading" ? "Vérification..." : "Vérifier SSL"}
          </button>
          {result && <button onClick={reset} style={{ padding:"11px 16px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#f9fafb",color:"#6b7280",fontSize:"13px",fontWeight:"600",cursor:"pointer" }}>×</button>}
        </div>

        {status==="loading" && (
          <div style={{ marginTop:"12px",display:"flex",alignItems:"center",gap:"10px",color:"#6b7280",fontSize:"13px" }}>
            <div style={{ width:"16px",height:"16px",border:"2px solid #e5e7eb",borderTop:"2px solid #059669",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
            Connexion au serveur...
          </div>
        )}

        {error && <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"10px 14px",color:"#dc2626",fontSize:"12px",marginTop:"10px" }}>⚠️ {error}</div>}
      </div>

      {/* Result */}
      {result && (
        <div style={{ display:"flex",flexDirection:"column",gap:"16px" }}>

          {/* Status banner */}
          <div style={{ background: result.valid ? "#f0fdf4" : "#fef2f2", border:`1px solid ${result.valid?"#bbf7d0":"#fecaca"}`, borderRadius:"14px", padding:"20px 24px", display:"flex", alignItems:"center", gap:"16px" }}>
            <div style={{ fontSize:"36px" }}>{result.valid ? "🔒" : "🔓"}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"16px",fontWeight:"700",color: result.valid?"#15803d":"#dc2626" }}>
                {result.valid ? "Certificat valide" : "Certificat expiré ou invalide"}
              </div>
              <div style={{ fontSize:"13px",color:"#6b7280",marginTop:"2px" }}>{result.host}</div>
            </div>
            <div style={{ background: daysBg(result.days_left), borderRadius:"12px", padding:"12px 20px", textAlign:"center" }}>
              <div style={{ fontSize:"28px",fontWeight:"800",color: daysColor(result.days_left) }}>{result.days_left}</div>
              <div style={{ fontSize:"11px",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em" }}>jours restants</div>
            </div>
          </div>

          {/* Details */}
          <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"14px",padding:"20px" }}>
            <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px" }}>Certificat</p>
            <Field label="Common Name"  value={result.common_name} />
            <Field label="Organisation" value={result.org || "—"} />
            <Field label="Valide depuis" value={result.not_before} />
            <Field label="Expire le"    value={result.not_after} />

            <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Émetteur</p>
            <Field label="Autorité (CN)"  value={result.issuer_cn} />
            <Field label="Organisation"   value={result.issuer_org || "—"} />

            <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Connexion</p>
            <Field label="Version TLS" value={result.tls_version} mono />
            <Field label="Cipher"      value={result.cipher}      mono />

            {result.sans.length > 0 && (
              <>
                <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Subject Alternative Names ({result.sans.length})</p>
                {result.sans.map((s,i) => <Field key={i} label={`SAN ${i+1}`} value={s} mono />)}
              </>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

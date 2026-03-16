import { useState } from "react";
import AppIcon from "../components/AppIcon";
import * as forge from "node-forge";

export default function CsrDecoder() {
  const [input, setInput]  = useState("");
  const [result, setResult] = useState(null);
  const [error, setError]  = useState("");
  const [copied, setCopied] = useState(false);

  const decode = () => {
    setError(""); setResult(null);
    try {
      const pem = input.trim();
      if (!pem.includes("CERTIFICATE REQUEST")) throw new Error("PEM invalide — collez un bloc -----BEGIN CERTIFICATE REQUEST-----");
      const csr = forge.pki.certificationRequestFromPem(pem);

      const subject = {};
      csr.subject.attributes.forEach(a => {
        const map = { CN:"Common Name", O:"Organisation", OU:"Unité organisationnelle", L:"Ville", ST:"État / Province", C:"Pays", emailAddress:"Email", E:"Email" };
        subject[map[a.shortName] || a.shortName] = a.value;
      });

      // SANs
      const sans = [];
      const exts = csr.getAttribute({ name:"extensionRequest" });
      if (exts) {
        const sanExt = exts.extensions?.find(e => e.name === "subjectAltName");
        if (sanExt) sanExt.altNames?.forEach(n => sans.push(n.value));
      }

      // Clé publique
      const pub = csr.publicKey;
      const keyType = pub.n ? "RSA" : "EC";
      const keySize = pub.n ? pub.n.bitLength() : "N/A";

      // Signature
      const sigAlg = csr.signatureOid;
      const algMap = {
        "1.2.840.113549.1.1.11": "SHA-256 avec RSA",
        "1.2.840.113549.1.1.5":  "SHA-1 avec RSA",
        "1.2.840.113549.1.1.12": "SHA-384 avec RSA",
        "1.2.840.113549.1.1.13": "SHA-512 avec RSA",
        "1.2.840.10045.4.3.2":   "SHA-256 avec ECDSA",
      };

      setResult({
        subject,
        sans,
        keyType,
        keySize,
        sigAlg: algMap[sigAlg] || sigAlg,
        valid: csr.verify(),
      });
    } catch(e) {
      setError(e.message);
    }
  };

  const copy = () => {
    const text = result ? Object.entries(result.subject).map(([k,v])=>`${k}: ${v}`).join("\n") : "";
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };

  const reset = () => { setInput(""); setResult(null); setError(""); };

  const Field = ({ label, value, highlight }) => (
    <div style={{ display:"flex", gap:"12px", padding:"10px 0", borderBottom:"1px solid #f3f4f6" }}>
      <span style={{ width:"220px", flexShrink:0, fontSize:"12px", fontWeight:"600", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", paddingTop:"1px" }}>{label}</span>
      <span style={{ fontSize:"13px", color: highlight ? "#059669" : "#111827", fontWeight: highlight ? "700" : "400", wordBreak:"break-all" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px" }}>
          <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#f0f9ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}><AppIcon id="csr" size={40} /></div>
          <div>
            <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>CSR Decoder</h2>
            <p style={{ fontSize:"13px",color:"#6b7280" }}>Décodez et inspectez un Certificate Signing Request (CSR)</p>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>

        {/* Input */}
        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"20px",display:"flex",flexDirection:"column" }}>
          <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"12px" }}>CSR (PEM)</p>
          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder={"-----BEGIN CERTIFICATE REQUEST-----\nMIIC....\n-----END CERTIFICATE REQUEST-----"}
            spellCheck={false}
            style={{ flex:1,minHeight:"340px",border:"1px solid #e5e7eb",borderRadius:"10px",padding:"12px",fontSize:"12px",lineHeight:"1.6",fontFamily:"monospace",resize:"vertical",outline:"none",color:"#111827",background:"#f9fafb" }}
          />

          {error && (
            <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"10px 14px",color:"#dc2626",fontSize:"12px",marginTop:"10px" }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display:"flex",gap:"8px",marginTop:"12px" }}>
            <button onClick={decode} disabled={!input.trim()} style={{
              flex:2,padding:"11px",border:"none",borderRadius:"10px",
              background:"linear-gradient(135deg,#0ea5e9,#1d4ed8)",color:"#fff",
              fontSize:"13px",fontWeight:"700",cursor:input.trim()?"pointer":"not-allowed",
              opacity:input.trim()?1:0.5
            }}>Decode CSR</button>
            <button onClick={reset} style={{ flex:1,padding:"11px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#f9fafb",color:"#6b7280",fontSize:"13px",fontWeight:"600",cursor:"pointer" }}>Clear</button>
          </div>
        </div>

        {/* Result */}
        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"20px",display:"flex",flexDirection:"column" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px" }}>
            <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em" }}>Informations décodées</p>
            {result && (
              <span style={{ fontSize:"11px",fontWeight:"600",padding:"3px 10px",borderRadius:"20px",background: result.valid?"#dcfce7":"#fef2f2",color:result.valid?"#15803d":"#dc2626" }}>
                {result.valid ? "Signature valide" : "Signature invalide"}
              </span>
            )}
          </div>

          {!result && (
            <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:"13px",fontStyle:"italic" }}>
              Les informations du CSR apparaîtront ici...
            </div>
          )}

          {result && (
            <div style={{ flex:1,overflowY:"auto" }}>
              {/* Subject */}
              <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px" }}>Sujet</p>
              {Object.entries(result.subject).map(([k,v]) => (
                <Field key={k} label={k} value={v} highlight={k==="Common Name"} />
              ))}

              {/* SANs */}
              {result.sans.length > 0 && (
                <>
                  <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Subject Alternative Names</p>
                  {result.sans.map((s,i) => <Field key={i} label={`SAN ${i+1}`} value={s} />)}
                </>
              )}

              {/* Clé & Signature */}
              <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Clé & Signature</p>
              <Field label="Type de clé"         value={result.keyType} />
              <Field label="Key size"       value={`${result.keySize} bits`} />
              <Field label="Algorithme signature" value={result.sigAlg} />
            </div>
          )}

          {result && (
            <button onClick={copy} style={{ marginTop:"12px",padding:"9px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#eff6ff",color:"#1d4ed8",fontSize:"12px",fontWeight:"600",cursor:"pointer" }}>
              {copied ? "Copied!" : "Copy les informations"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import * as forge from "node-forge";

export default function CertificateDecoder() {
  const [input, setInput]  = useState("");
  const [result, setResult] = useState(null);
  const [error, setError]  = useState("");
  const [copied, setCopied] = useState(false);

  const decode = () => {
    setError(""); setResult(null);
    try {
      const pem = input.trim();
      if (!pem.includes("CERTIFICATE")) throw new Error("Invalid PEM — paste a -----BEGIN CERTIFICATE----- block");
      const cert = forge.pki.certificateFromPem(pem);

      const subject = {};
      cert.subject.attributes.forEach(a => {
        const map = { CN:"Common Name", O:"Organization", OU:"Organizational Unit", L:"City", ST:"State / Province", C:"Country", emailAddress:"Email" };
        subject[map[a.shortName] || a.shortName] = a.value;
      });

      const issuer = {};
      cert.issuer.attributes.forEach(a => {
        const map = { CN:"Common Name", O:"Organization", OU:"Organizational Unit", C:"Country" };
        issuer[map[a.shortName] || a.shortName] = a.value;
      });

      // SANs
      const sans = [];
      const sanExt = cert.extensions?.find(e => e.name === "subjectAltName");
      if (sanExt) sanExt.altNames?.forEach(n => sans.push({ type: n.type === 2 ? "DNS" : n.type === 7 ? "IP" : "Other", value: n.value }));

      // Key
      const pub = cert.publicKey;
      const keyType = pub.n ? "RSA" : "EC";
      const keySize = pub.n ? pub.n.bitLength() : "N/A";

      // Dates
      const now = new Date();
      const notAfter = cert.validity.notAfter;
      const daysLeft = Math.floor((notAfter - now) / 86400000);

      // Serial
      const serial = cert.serialNumber;

      // Fingerprint
      const der = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes();
      const md = forge.md.sha256.create();
      md.update(der);
      const fingerprint = md.digest().toHex().match(/.{2}/g).join(":").toUpperCase();

      // Extensions
      const keyUsage   = cert.extensions?.find(e => e.name === "keyUsage");
      const extKeyUsage = cert.extensions?.find(e => e.name === "extKeyUsage");
      const basicConstraints = cert.extensions?.find(e => e.name === "basicConstraints");

      setResult({ subject, issuer, sans, keyType, keySize, serial, fingerprint, daysLeft,
        notBefore: cert.validity.notBefore.toLocaleDateString("en-GB"),
        notAfter:  notAfter.toLocaleDateString("en-GB"),
        isCA: basicConstraints?.cA || false,
        keyUsage:    keyUsage    ? Object.keys(keyUsage).filter(k => keyUsage[k] === true).join(", ")    : "—",
        extKeyUsage: extKeyUsage ? Object.keys(extKeyUsage).filter(k => extKeyUsage[k] === true).join(", ") : "—",
      });
    } catch(e) {
      setError(e.message);
    }
  };

  const copy = () => {
    if (!result) return;
    const lines = [
      ...Object.entries(result.subject).map(([k,v]) => `${k}: ${v}`),
      `Issuer: ${result.issuer["Common Name"] || ""}`,
      `Valid: ${result.notBefore} → ${result.notAfter}`,
      `Days left: ${result.daysLeft}`,
      `Serial: ${result.serial}`,
      `SHA-256: ${result.fingerprint}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => { setInput(""); setResult(null); setError(""); };
  const daysColor = d => d > 30 ? "#059669" : d > 7 ? "#d97706" : "#dc2626";
  const daysBg    = d => d > 30 ? "#f0fdf4"  : d > 7 ? "#fffbeb"  : "#fef2f2";

  const Field = ({ label, value, mono, highlight }) => (
    <div style={{ display:"flex",gap:"12px",padding:"9px 0",borderBottom:"1px solid #f3f4f6" }}>
      <span style={{ width:"200px",flexShrink:0,fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",paddingTop:"1px" }}>{label}</span>
      <span style={{ fontSize:"13px",color:highlight?"#059669":"#111827",fontWeight:highlight?"700":"400",wordBreak:"break-all",fontFamily:mono?"monospace":"inherit" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"40px 24px" }}>
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px" }}>
          <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#fefce8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}>📜</div>
          <div>
            <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>Certificate Decoder</h2>
            <p style={{ fontSize:"13px",color:"#6b7280" }}>Decode and inspect any X.509 SSL/TLS certificate</p>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"20px",display:"flex",flexDirection:"column" }}>
          <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"12px" }}>Certificate (PEM)</p>
          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder={"-----BEGIN CERTIFICATE-----\nMIIF....\n-----END CERTIFICATE-----"}
            spellCheck={false}
            style={{ flex:1,minHeight:"340px",border:"1px solid #e5e7eb",borderRadius:"10px",padding:"12px",fontSize:"12px",lineHeight:"1.6",fontFamily:"monospace",resize:"vertical",outline:"none",color:"#111827",background:"#f9fafb" }}
          />
          {error && <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"10px 14px",color:"#dc2626",fontSize:"12px",marginTop:"10px" }}>⚠️ {error}</div>}
          <div style={{ display:"flex",gap:"8px",marginTop:"12px" }}>
            <button onClick={decode} disabled={!input.trim()} style={{ flex:2,padding:"11px",border:"none",borderRadius:"10px",background:"linear-gradient(135deg,#ca8a04,#d97706)",color:"#fff",fontSize:"13px",fontWeight:"700",cursor:input.trim()?"pointer":"not-allowed",opacity:input.trim()?1:0.5 }}>
              Decode Certificate
            </button>
            <button onClick={reset} style={{ flex:1,padding:"11px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#f9fafb",color:"#6b7280",fontSize:"13px",fontWeight:"600",cursor:"pointer" }}>Clear</button>
          </div>
        </div>

        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"20px",display:"flex",flexDirection:"column" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px" }}>
            <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em" }}>Decoded Information</p>
            {result && (
              <span style={{ fontSize:"11px",fontWeight:"600",padding:"3px 10px",borderRadius:"20px",background:result.daysLeft>0?"#dcfce7":"#fef2f2",color:result.daysLeft>0?"#15803d":"#dc2626" }}>
                {result.daysLeft > 0 ? "Valid" : "Expired"}
              </span>
            )}
          </div>

          {!result && <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:"13px",fontStyle:"italic" }}>Decoded certificate information will appear here...</div>}

          {result && (
            <div style={{ flex:1,overflowY:"auto" }}>
              {/* Validity banner */}
              <div style={{ background:daysBg(result.daysLeft),borderRadius:"10px",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px" }}>
                <div>
                  <div style={{ fontSize:"12px",color:"#6b7280" }}>Expires on</div>
                  <div style={{ fontSize:"14px",fontWeight:"700",color:"#111827" }}>{result.notAfter}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:"28px",fontWeight:"800",color:daysColor(result.daysLeft) }}>{result.daysLeft}</div>
                  <div style={{ fontSize:"11px",color:"#6b7280" }}>days left</div>
                </div>
              </div>

              <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px" }}>Subject</p>
              {Object.entries(result.subject).map(([k,v]) => <Field key={k} label={k} value={v} highlight={k==="Common Name"} />)}

              <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Issuer</p>
              {Object.entries(result.issuer).map(([k,v]) => <Field key={k} label={k} value={v} />)}

              <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Validity</p>
              <Field label="Valid From"  value={result.notBefore} />
              <Field label="Valid Until" value={result.notAfter}  />

              <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Key & Signature</p>
              <Field label="Key Type"   value={result.keyType} />
              <Field label="Key Size"   value={`${result.keySize} bits`} />
              <Field label="Serial"     value={result.serial}      mono />
              <Field label="SHA-256"    value={result.fingerprint} mono />
              <Field label="CA"         value={result.isCA ? "Yes" : "No"} />

              {result.sans.length > 0 && (
                <>
                  <p style={{ fontSize:"11px",fontWeight:"700",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 4px" }}>Subject Alternative Names ({result.sans.length})</p>
                  {result.sans.map((s,i) => <Field key={i} label={s.type} value={s.value} mono />)}
                </>
              )}
            </div>
          )}

          {result && (
            <button onClick={copy} style={{ marginTop:"12px",padding:"9px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#fefce8",color:"#ca8a04",fontSize:"12px",fontWeight:"600",cursor:"pointer" }}>
              {copied ? "Copied!" : "Copy Information"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

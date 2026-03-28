import { useState } from "react";
import AppIcon from "../components/AppIcon";

const STATUS_COLOR = {
  pass: { bg:"#d1fae5", color:"#065f46", icon:"✓" },
  fail: { bg:"#fee2e2", color:"#991b1b", icon:"✗" },
  warn: { bg:"#fef3c7", color:"#92400e", icon:"⚠" },
  info: { bg:"#dbeafe", color:"#1e40af", icon:"ℹ" },
};

export default function DnsHealth() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function check() {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch(`https://apps-api.cloudfactory.ma/dns-check?domain=${domain.trim()}`);
      const data = await res.json();
      if (data.detail) throw new Error(data.detail);
      setResults(data);
    } catch (e) {
      setError(e.message || "Failed to check DNS.");
    }
    setLoading(false);
  }

  const pass = results?.results?.filter(r => r.status === "pass").length || 0;
  const fail = results?.results?.filter(r => r.status === "fail").length || 0;
  const warn = results?.results?.filter(r => r.status === "warn").length || 0;

  return (
    <div style={{ maxWidth:"800px", margin:"0 auto", padding:"32px 16px",
      fontFamily:'"SF Pro Display",-apple-system,sans-serif' }}>
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"32px" }}>
        <AppIcon id="dnshealth" size={48} />
        <div>
          <h2 style={{ fontSize:"24px", fontWeight:"700", color:"#1a1a2e", margin:0 }}>DNS Health Check</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Analyze DNS configuration and detect issues</p>
        </div>
      </div>

      <div style={{ display:"flex", gap:"12px", marginBottom:"16px" }}>
        <input
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder="example.com"
          style={{ flex:1, padding:"12px 16px", borderRadius:"10px",
            border:"1.5px solid #e5e7eb", fontSize:"15px", outline:"none" }}
        />
        <button onClick={check} disabled={loading} style={{
          padding:"12px 24px", background:"linear-gradient(135deg,#a29bfe,#6c5ce7)",
          color:"#fff", border:"none", borderRadius:"10px", fontSize:"15px",
          fontWeight:"600", cursor:"pointer"
        }}>{loading ? "Checking..." : "Check DNS"}</button>
      </div>

      {error && <p style={{ color:"#ef4444", padding:"12px", background:"#fef2f2",
        borderRadius:"8px" }}>{error}</p>}

      {results && (
        <div>
          <div style={{ display:"flex", gap:"12px", marginBottom:"24px" }}>
            <div style={{ flex:1, background:"#d1fae5", borderRadius:"12px",
              padding:"16px", textAlign:"center" }}>
              <div style={{ fontSize:"28px", fontWeight:"800", color:"#065f46" }}>{pass}</div>
              <div style={{ fontSize:"12px", color:"#065f46", fontWeight:"600" }}>PASSED</div>
            </div>
            <div style={{ flex:1, background:"#fef3c7", borderRadius:"12px",
              padding:"16px", textAlign:"center" }}>
              <div style={{ fontSize:"28px", fontWeight:"800", color:"#92400e" }}>{warn}</div>
              <div style={{ fontSize:"12px", color:"#92400e", fontWeight:"600" }}>WARNINGS</div>
            </div>
            <div style={{ flex:1, background:"#fee2e2", borderRadius:"12px",
              padding:"16px", textAlign:"center" }}>
              <div style={{ fontSize:"28px", fontWeight:"800", color:"#991b1b" }}>{fail}</div>
              <div style={{ fontSize:"12px", color:"#991b1b", fontWeight:"600" }}>FAILED</div>
            </div>
          </div>

          <div style={{ background:"#fff", borderRadius:"16px", border:"1px solid #e5e7eb",
            overflow:"hidden" }}>
            {results.results.map((r, i) => {
              const s = STATUS_COLOR[r.status] || STATUS_COLOR.info;
              return (
                <div key={i} style={{ display:"flex", gap:"16px", padding:"16px 20px",
                  borderBottom:"1px solid #f3f4f6", alignItems:"flex-start" }}>
                  <span style={{ padding:"2px 10px", borderRadius:"20px", fontSize:"12px",
                    fontWeight:"700", background:s.bg, color:s.color, whiteSpace:"nowrap",
                    marginTop:"2px" }}>{s.icon} {r.status.toUpperCase()}</span>
                  <div>
                    <div style={{ fontWeight:"600", color:"#1a1a2e", fontSize:"14px",
                      marginBottom:"4px" }}>{r.name}</div>
                    <div style={{ color:"#6b7280", fontSize:"13px",
                      wordBreak:"break-all" }}>{r.info}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

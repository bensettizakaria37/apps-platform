import { useState } from "react";
import AppIcon from "../components/AppIcon";

const STATUS_STYLE = {
  pass: { bg:"#d1fae5", color:"#065f46", icon:"✓" },
  fail: { bg:"#fee2e2", color:"#991b1b", icon:"✗" },
  warn: { bg:"#fef3c7", color:"#92400e", icon:"⚠" },
  info: { bg:"#dbeafe", color:"#1e40af", icon:"ℹ" },
};

const CATEGORIES = ["NS", "SOA", "WWW", "MX", "TXT"];

export default function DnsHealth() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("NS");

  async function check() {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch(`https://apps-api.cloudfactory.ma/dns-check-advanced?domain=${domain.trim()}`);
      const data = await res.json();
      if (data.detail) throw new Error(data.detail);
      setResults(data);
      setActiveTab("NS");
    } catch (e) {
      setError(e.message || "Failed to check DNS.");
    }
    setLoading(false);
  }

  const byCategory = cat => results?.results?.filter(r => r.category === cat) || [];
  const pass = results?.results?.filter(r => r.status === "pass").length || 0;
  const fail = results?.results?.filter(r => r.status === "fail").length || 0;
  const warn = results?.results?.filter(r => r.status === "warn").length || 0;

  return (
    <div style={{ maxWidth:"860px", margin:"0 auto", padding:"32px 16px",
      fontFamily:'"SF Pro Display",-apple-system,sans-serif' }}>
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"32px" }}>
        <AppIcon id="dnshealth" size={48} />
        <div>
          <h2 style={{ fontSize:"24px", fontWeight:"700", color:"#1a1a2e", margin:0 }}>DNS Health Check</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Full DNS analysis — NS, SOA, MX, SPF, DMARC, DKIM</p>
        </div>
      </div>

      <div style={{ display:"flex", gap:"12px", marginBottom:"16px" }}>
        <input value={domain} onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder="example.com"
          style={{ flex:1, padding:"12px 16px", borderRadius:"10px",
            border:"1.5px solid #e5e7eb", fontSize:"15px", outline:"none" }} />
        <button onClick={check} disabled={loading} style={{
          padding:"12px 28px", background:"linear-gradient(135deg,#a29bfe,#6c5ce7)",
          color:"#fff", border:"none", borderRadius:"10px", fontSize:"15px",
          fontWeight:"600", cursor:"pointer" }}>
          {loading ? "Checking..." : "Check DNS"}
        </button>
      </div>

      {error && <p style={{ color:"#ef4444", padding:"12px", background:"#fef2f2",
        borderRadius:"8px" }}>{error}</p>}

      {results && (
        <div>
          <div style={{ display:"flex", gap:"12px", marginBottom:"24px" }}>
            {[["pass","#d1fae5","#065f46",pass,"PASSED"],
              ["warn","#fef3c7","#92400e",warn,"WARNINGS"],
              ["fail","#fee2e2","#991b1b",fail,"FAILED"]].map(([,bg,color,count,label]) => (
              <div key={label} style={{ flex:1, background:bg, borderRadius:"12px",
                padding:"16px", textAlign:"center" }}>
                <div style={{ fontSize:"28px", fontWeight:"800", color }}>{count}</div>
                <div style={{ fontSize:"12px", color, fontWeight:"600" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:"8px", marginBottom:"16px", flexWrap:"wrap" }}>
            {CATEGORIES.map(cat => {
              const catResults = byCategory(cat);
              const hasFail = catResults.some(r => r.status === "fail");
              const hasWarn = catResults.some(r => r.status === "warn");
              const dot = hasFail ? "#ef4444" : hasWarn ? "#f59e0b" : "#10b981";
              return (
                <button key={cat} onClick={() => setActiveTab(cat)} style={{
                  padding:"8px 20px", borderRadius:"20px", border:"none",
                  background: activeTab === cat ? "linear-gradient(135deg,#a29bfe,#6c5ce7)" : "#f3f4f6",
                  color: activeTab === cat ? "#fff" : "#374151",
                  fontWeight:"600", fontSize:"13px", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:"6px" }}>
                  <span style={{ width:"8px", height:"8px", borderRadius:"50%",
                    background: activeTab === cat ? "#fff" : dot, display:"inline-block" }} />
                  {cat}
                </button>
              );
            })}
          </div>

          <div style={{ background:"#fff", borderRadius:"16px", border:"1px solid #e5e7eb",
            overflow:"hidden" }}>
            {byCategory(activeTab).map((r, i) => {
              const s = STATUS_STYLE[r.status] || STATUS_STYLE.info;
              return (
                <div key={i} style={{ display:"flex", gap:"16px", padding:"14px 20px",
                  borderBottom:"1px solid #f3f4f6", alignItems:"flex-start" }}>
                  <span style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"11px",
                    fontWeight:"700", background:s.bg, color:s.color, whiteSpace:"nowrap",
                    marginTop:"2px", minWidth:"60px", textAlign:"center" }}>
                    {s.icon} {r.status.toUpperCase()}
                  </span>
                  <div>
                    <div style={{ fontWeight:"600", color:"#1a1a2e", fontSize:"14px",
                      marginBottom:"4px" }}>{r.name}</div>
                    <div style={{ color:"#6b7280", fontSize:"13px",
                      wordBreak:"break-all", fontFamily:"monospace" }}>{r.info}</div>
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

import { useState } from "react";
import AppIcon from "../components/AppIcon";

const STATUS_STYLE = {
  pass: { bg:"#d1fae5", color:"#065f46", icon:"✓ Pass" },
  fail: { bg:"#fee2e2", color:"#991b1b", icon:"✗ Fail" },
  warn: { bg:"#fef3c7", color:"#92400e", icon:"⚠ Warn" },
  info: { bg:"#dbeafe", color:"#1e40af", icon:"ℹ Info" },
};

const CATEGORY_ORDER = ["NS", "SOA", "MX", "WWW", "TXT"];

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
      const res = await fetch(`https://apps-api.cloudfactory.ma/dns-check-advanced?domain=${domain.trim()}`);
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

  // Group by category preserving order
  const grouped = CATEGORY_ORDER.map(cat => ({
    cat,
    items: results?.results?.filter(r => r.category === cat) || []
  })).filter(g => g.items.length > 0);

  return (
    <div style={{ maxWidth:"900px", margin:"0 auto", padding:"32px 16px",
      fontFamily:'"SF Pro Display",-apple-system,sans-serif' }}>
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"32px" }}>
        <AppIcon id="dnshealth" size={48} />
        <div>
          <h2 style={{ fontSize:"24px", fontWeight:"700", color:"#1a1a2e", margin:0 }}>DNS Health Check</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Full DNS analysis — NS, SOA, MX, SPF, DMARC, DKIM</p>
        </div>
      </div>

      <div style={{ display:"flex", gap:"12px", marginBottom:"24px" }}>
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
        borderRadius:"8px", marginBottom:"16px" }}>{error}</p>}

      {results && (
        <div>
          {/* Summary */}
          <div style={{ display:"flex", gap:"12px", marginBottom:"24px" }}>
            {[["#d1fae5","#065f46",pass,"PASSED"],
              ["#fef3c7","#92400e",warn,"WARNINGS"],
              ["#fee2e2","#991b1b",fail,"FAILED"]].map(([bg,color,count,label]) => (
              <div key={label} style={{ flex:1, background:bg, borderRadius:"12px",
                padding:"16px", textAlign:"center" }}>
                <div style={{ fontSize:"28px", fontWeight:"800", color }}>{count}</div>
                <div style={{ fontSize:"12px", color, fontWeight:"600" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Table like IntoDNS */}
          <div style={{ background:"#fff", borderRadius:"16px", border:"1px solid #e5e7eb",
            overflow:"hidden" }}>
            {/* Header */}
            <div style={{ display:"grid", gridTemplateColumns:"100px 1fr 2fr",
              background:"#f8f9fa", padding:"10px 16px", borderBottom:"2px solid #e5e7eb" }}>
              <span style={{ fontWeight:"700", fontSize:"13px", color:"#374151" }}>Category</span>
              <span style={{ fontWeight:"700", fontSize:"13px", color:"#374151" }}>Status</span>
              <span style={{ fontWeight:"700", fontSize:"13px", color:"#374151" }}>Test name & Information</span>
            </div>

            {grouped.map(({ cat, items }) =>
              items.map((r, i) => {
                const s = STATUS_STYLE[r.status] || STATUS_STYLE.info;
                return (
                  <div key={`${cat}-${i}`} style={{
                    display:"grid", gridTemplateColumns:"100px 1fr 2fr",
                    borderBottom:"1px solid #f3f4f6",
                    background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    {/* Category — only show on first row */}
                    <div style={{ padding:"12px 16px", fontWeight:"700",
                      fontSize:"13px", color:"#6c5ce7",
                      borderRight:"1px solid #f3f4f6",
                      display:"flex", alignItems:"center" }}>
                      {i === 0 ? cat : ""}
                    </div>
                    {/* Status */}
                    <div style={{ padding:"12px 16px", borderRight:"1px solid #f3f4f6",
                      display:"flex", alignItems:"center" }}>
                      <span style={{ padding:"3px 10px", borderRadius:"20px",
                        fontSize:"11px", fontWeight:"700",
                        background:s.bg, color:s.color, whiteSpace:"nowrap" }}>
                        {s.icon}
                      </span>
                    </div>
                    {/* Name + Info */}
                    <div style={{ padding:"12px 16px" }}>
                      <div style={{ fontWeight:"600", color:"#1a1a2e",
                        fontSize:"13px", marginBottom:"4px" }}>{r.name}</div>
                      <div style={{ color:"#6b7280", fontSize:"12px",
                        wordBreak:"break-all", fontFamily:"monospace",
                        lineHeight:"1.5" }}>{r.info}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

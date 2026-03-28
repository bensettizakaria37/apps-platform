import { useState } from "react";
import AppIcon from "../components/AppIcon";

const RECORD_TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA", "PTR", "SRV"];

export default function DnsLookup() {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState("A");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup() {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch(`https://dns.google/resolve?name=${domain.trim()}&type=${type}`);
      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError("Failed to resolve DNS. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth:"800px", margin:"0 auto", padding:"32px 16px",
      fontFamily:'"SF Pro Display",-apple-system,sans-serif' }}>
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"32px" }}>
        <AppIcon id="dnslookup" size={48} />
        <div>
          <h2 style={{ fontSize:"24px", fontWeight:"700", color:"#1a1a2e", margin:0 }}>DNS Lookup</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Query DNS records for any domain</p>
        </div>
      </div>

      <div style={{ display:"flex", gap:"12px", marginBottom:"16px" }}>
        <input
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === "Enter" && lookup()}
          placeholder="example.com"
          style={{ flex:1, padding:"12px 16px", borderRadius:"10px",
            border:"1.5px solid #e5e7eb", fontSize:"15px", outline:"none" }}
        />
        <select value={type} onChange={e => setType(e.target.value)}
          style={{ padding:"12px 16px", borderRadius:"10px",
            border:"1.5px solid #e5e7eb", fontSize:"15px", outline:"none",
            background:"#fff", cursor:"pointer" }}>
          {RECORD_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <button onClick={lookup} disabled={loading} style={{
          padding:"12px 24px", background:"linear-gradient(135deg,#a29bfe,#6c5ce7)",
          color:"#fff", border:"none", borderRadius:"10px", fontSize:"15px",
          fontWeight:"600", cursor:"pointer", whiteSpace:"nowrap"
        }}>{loading ? "..." : "Lookup"}</button>
      </div>

      {error && <p style={{ color:"#ef4444", padding:"12px", background:"#fef2f2",
        borderRadius:"8px" }}>{error}</p>}

      {results && (
        <div style={{ background:"#fff", borderRadius:"16px", padding:"24px",
          border:"1px solid #e5e7eb" }}>
          <div style={{ display:"flex", gap:"16px", marginBottom:"16px" }}>
            <span style={{ padding:"4px 12px", borderRadius:"20px", fontSize:"12px",
              fontWeight:"600", background: results.Status === 0 ? "#d1fae5" : "#fee2e2",
              color: results.Status === 0 ? "#065f46" : "#991b1b" }}>
              {results.Status === 0 ? "✓ Success" : "✗ Failed"}
            </span>
            {results.TC && <span style={{ padding:"4px 12px", borderRadius:"20px",
              fontSize:"12px", background:"#fef3c7", color:"#92400e" }}>Truncated</span>}
          </div>

          {results.Answer && results.Answer.length > 0 ? (
            <>
              <h3 style={{ fontSize:"14px", fontWeight:"700", color:"#6b7280",
                textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"12px" }}>
                {type} Records
              </h3>
              {results.Answer.map((r, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 80px 2fr",
                  gap:"12px", padding:"10px 0", borderBottom:"1px solid #f3f4f6",
                  fontSize:"13px" }}>
                  <span style={{ color:"#374151", wordBreak:"break-all" }}>{r.name}</span>
                  <span style={{ color:"#9ca3af" }}>{r.TTL}s</span>
                  <span style={{ color:"#1a1a2e", fontFamily:"monospace",
                    wordBreak:"break-all" }}>{r.data}</span>
                </div>
              ))}
            </>
          ) : (
            <p style={{ color:"#6b7280" }}>No records found for {domain} ({type})</p>
          )}
        </div>
      )}
    </div>
  );
}

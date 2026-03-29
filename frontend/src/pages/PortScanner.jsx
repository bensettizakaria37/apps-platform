import { useState } from "react";
import AppIcon from "../components/AppIcon";

export default function PortScanner() {
  const [host, setHost] = useState("");
  const [mode, setMode] = useState("common");
  const [customPorts, setCustomPorts] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function scan() {
    if (!host.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const ports = mode === "common" ? "common" : customPorts.trim();
      const res = await fetch(`https://apps-api.cloudfactory.ma/port-scan?host=${host.trim()}&ports=${ports}`);
      const data = await res.json();
      if (data.detail) throw new Error(data.detail);
      setResults(data);
    } catch (e) {
      setError(e.message || "Scan failed.");
    }
    setLoading(false);
  }

  const open = results?.results?.filter(r => r.state === "open") || [];

  return (
    <div style={{ maxWidth:"860px", margin:"0 auto", padding:"32px 16px",
      fontFamily:'"SF Pro Display",-apple-system,sans-serif' }}>

      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"24px" }}>
        <AppIcon id="portscanner" size={48} />
        <div>
          <h2 style={{ fontSize:"24px", fontWeight:"700", color:"#1a1a2e", margin:0 }}>TCP Port Scanner</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Scan open ports on any IP or hostname using Nmap</p>
        </div>
      </div>

      {/* Warning */}
      <div style={{ background:"#fef3c7", border:"1px solid #f59e0b", borderRadius:"10px",
        padding:"12px 16px", marginBottom:"20px", fontSize:"13px", color:"#92400e" }}>
        ⚠ Only scan IPs and hosts you own or have permission to scan. Unauthorized scanning may be illegal.
      </div>

      {/* Input */}
      <div style={{ background:"#fff", borderRadius:"16px", border:"1px solid #e5e7eb",
        padding:"24px", marginBottom:"20px" }}>
        <div style={{ marginBottom:"16px" }}>
          <label style={{ fontSize:"13px", fontWeight:"600", color:"#374151",
            display:"block", marginBottom:"8px" }}>IP Address or Hostname</label>
          <input value={host} onChange={e => setHost(e.target.value)}
            onKeyDown={e => e.key === "Enter" && scan()}
            placeholder="192.168.1.1 or example.com"
            style={{ width:"100%", padding:"12px 16px", borderRadius:"10px",
              border:"1.5px solid #e5e7eb", fontSize:"15px", outline:"none",
              boxSizing:"border-box" }} />
        </div>

        {/* Mode selector */}
        <div style={{ marginBottom:"16px" }}>
          <label style={{ fontSize:"13px", fontWeight:"600", color:"#374151",
            display:"block", marginBottom:"8px" }}>Scan Type</label>
          <div style={{ display:"flex", gap:"12px" }}>
            {[["common", "Common Ports (37 ports)"], ["custom", "Custom Ports"]].map(([val, label]) => (
              <button key={val} onClick={() => setMode(val)} style={{
                padding:"10px 20px", borderRadius:"10px", border:"2px solid",
                borderColor: mode === val ? "#6c5ce7" : "#e5e7eb",
                background: mode === val ? "#f0eeff" : "#fff",
                color: mode === val ? "#6c5ce7" : "#374151",
                fontWeight:"600", fontSize:"13px", cursor:"pointer" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode === "custom" && (
          <div style={{ marginBottom:"16px" }}>
            <label style={{ fontSize:"13px", fontWeight:"600", color:"#374151",
              display:"block", marginBottom:"8px" }}>Ports (comma separated)</label>
            <input value={customPorts} onChange={e => setCustomPorts(e.target.value)}
              placeholder="80, 443, 8080, 3306"
              style={{ width:"100%", padding:"12px 16px", borderRadius:"10px",
                border:"1.5px solid #e5e7eb", fontSize:"15px", outline:"none",
                boxSizing:"border-box" }} />
          </div>
        )}

        <button onClick={scan} disabled={loading} style={{
          width:"100%", padding:"13px", borderRadius:"10px",
          background: loading ? "#9ca3af" : "linear-gradient(135deg,#a29bfe,#6c5ce7)",
          color:"#fff", border:"none", fontSize:"15px", fontWeight:"700",
          cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "🔍 Scanning... (this may take 30-60 seconds)" : "🔍 Start Scan"}
        </button>
      </div>

      {error && (
        <div style={{ background:"#fee2e2", borderRadius:"10px", padding:"12px 16px",
          color:"#991b1b", marginBottom:"16px", fontSize:"13px" }}>{error}</div>
      )}

      {results && (
        <div>
          {/* Summary */}
          <div style={{ display:"flex", gap:"12px", marginBottom:"20px" }}>
            {[
              ["#dbeafe","#1e40af", results.ports_scanned, "PORTS SCANNED"],
              ["#d1fae5","#065f46", results.open_ports, "OPEN"],
              ["#f3f4f6","#374151", results.ports_scanned - results.open_ports, "CLOSED/FILTERED"],
            ].map(([bg, color, count, label]) => (
              <div key={label} style={{ flex:1, background:bg, borderRadius:"12px",
                padding:"16px", textAlign:"center" }}>
                <div style={{ fontSize:"28px", fontWeight:"800", color }}>{count}</div>
                <div style={{ fontSize:"11px", color, fontWeight:"700" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Results table */}
          {open.length > 0 ? (
            <div style={{ background:"#fff", borderRadius:"16px",
              border:"1px solid #e5e7eb", overflow:"hidden" }}>
              {/* Header */}
              <div style={{ display:"grid", gridTemplateColumns:"80px 120px 160px 1fr",
                background:"#6c5ce7", padding:"12px 16px" }}>
                {["Port", "State", "Service", "Product / Version"].map(h => (
                  <span key={h} style={{ fontWeight:"700", fontSize:"12px",
                    color:"#fff", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</span>
                ))}
              </div>
              {open.map((r, i) => (
                <div key={i} style={{
                  display:"grid", gridTemplateColumns:"80px 120px 160px 1fr",
                  padding:"12px 16px",
                  background: i % 2 === 0 ? "#fff" : "#f9f9ff",
                  borderBottom:"1px solid #f3f4f6" }}>
                  <span style={{ fontWeight:"700", color:"#6c5ce7",
                    fontFamily:"monospace", fontSize:"14px" }}>{r.port}</span>
                  <span>
                    <span style={{ background:"#d1fae5", color:"#065f46",
                      padding:"2px 10px", borderRadius:"20px", fontSize:"11px",
                      fontWeight:"700" }}>● OPEN</span>
                  </span>
                  <span style={{ color:"#374151", fontSize:"13px",
                    fontWeight:"600" }}>{r.description}</span>
                  <span style={{ color:"#6b7280", fontSize:"13px" }}>
                    {[r.product, r.version].filter(Boolean).join(" ") || "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background:"#f9fafb", borderRadius:"16px", padding:"40px",
              textAlign:"center", color:"#6b7280" }}>
              <div style={{ fontSize:"40px", marginBottom:"12px" }}>🔒</div>
              <p style={{ fontWeight:"600", fontSize:"16px" }}>No open ports found</p>
              <p style={{ fontSize:"13px" }}>All scanned ports are closed or filtered.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

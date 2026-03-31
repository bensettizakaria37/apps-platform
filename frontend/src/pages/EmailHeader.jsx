import { useState } from "react";
import AppIcon from "../components/AppIcon";

function parseSpf(headers) {
  const line = headers.match(/Received-SPF:\s*(.+)/i);
  if (!line) return null;
  const val = line[1].toLowerCase();
  if (val.includes("pass")) return "pass";
  if (val.includes("fail")) return "fail";
  if (val.includes("softfail")) return "softfail";
  if (val.includes("neutral")) return "neutral";
  return "none";
}

function parseDkim(headers) {
  const line = headers.match(/dkim=(\w+)/i);
  if (!line) return null;
  return line[1].toLowerCase();
}

function parseDmarc(headers) {
  const line = headers.match(/dmarc=(\w+)/i);
  if (!line) return null;
  return line[1].toLowerCase();
}

function parseReceived(headers) {
  const lines = headers.split("\n");
  const received = [];
  let current = "";

  for (const line of lines) {
    if (line.toLowerCase().startsWith("received:")) {
      if (current) received.push(current);
      current = line;
    } else if (current && (line.startsWith(" ") || line.startsWith("\t"))) {
      current += " " + line.trim();
    }
  }
  if (current) received.push(current);

  return received.map((r, i) => {
    const fromMatch = r.match(/from\s+([^\s]+)/i);
    const byMatch = r.match(/by\s+([^\s]+)/i);
    const dateMatch = r.match(/;\s*(.+)$/i);
    const protoMatch = r.match(/with\s+([A-Z0-9]+)/i);

    let timestamp = null;
    if (dateMatch) {
      try { timestamp = new Date(dateMatch[1].trim()); } catch {}
    }

    return {
      index: i,
      from: fromMatch ? fromMatch[1] : "unknown",
      by: byMatch ? byMatch[1] : "unknown",
      protocol: protoMatch ? protoMatch[1] : "SMTP",
      timestamp,
      raw: r
    };
  }).reverse();
}

function calcDelays(hops) {
  return hops.map((hop, i) => {
    if (i === 0 || !hop.timestamp || !hops[i-1].timestamp) return { ...hop, delay: null };
    const diff = Math.round((hop.timestamp - hops[i-1].timestamp) / 1000);
    return { ...hop, delay: diff };
  });
}

function StatusBadge({ status }) {
  const colors = {
    pass:     { bg:"#d1fae5", color:"#065f46", icon:"✓" },
    fail:     { bg:"#fee2e2", color:"#991b1b", icon:"✗" },
    softfail: { bg:"#fef3c7", color:"#92400e", icon:"~" },
    neutral:  { bg:"#dbeafe", color:"#1e40af", icon:"○" },
    none:     { bg:"#f3f4f6", color:"#6b7280", icon:"?" },
  };
  const s = colors[status] || colors.none;
  return (
    <span style={{ background:s.bg, color:s.color, padding:"3px 12px",
      borderRadius:"20px", fontSize:"12px", fontWeight:"700" }}>
      {s.icon} {status?.toUpperCase() || "NONE"}
    </span>
  );
}

export default function EmailHeader() {
  const [headers, setHeaders] = useState("");
  const [results, setResults] = useState(null);

  function analyze() {
    if (!headers.trim()) return;
    const spf   = parseSpf(headers);
    const dkim  = parseDkim(headers);
    const dmarc = parseDmarc(headers);
    const hops  = calcDelays(parseReceived(headers));

    // Subject / From / To / Date
    const get = (field) => {
      const m = headers.match(new RegExp(`^${field}:\\s*(.+)`, "im"));
      return m ? m[1].trim() : "—";
    };

    setResults({
      spf, dkim, dmarc, hops,
      subject: get("Subject"),
      from:    get("From"),
      to:      get("To"),
      date:    get("Date"),
      messageId: get("Message-ID"),
    });
  }

  return (
    <div style={{ maxWidth:"900px", margin:"0 auto", padding:"32px 16px",
      fontFamily:'"SF Pro Display",-apple-system,sans-serif' }}>

      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"28px" }}>
        <AppIcon id="emailheader" size={48} />
        <div>
          <h2 style={{ fontSize:"24px", fontWeight:"700", color:"#1a1a2e", margin:0 }}>Email Header Analyzer</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Trace email origin, routing delays, SPF/DKIM/DMARC</p>
        </div>
      </div>

      <textarea value={headers} onChange={e => setHeaders(e.target.value)}
        placeholder="Paste your full email headers here..."
        rows={8}
        style={{ width:"100%", padding:"16px", borderRadius:"12px",
          border:"1.5px solid #e5e7eb", fontSize:"13px", fontFamily:"monospace",
          resize:"vertical", outline:"none", boxSizing:"border-box", background:"#f9fafb" }} />

      <button onClick={analyze} style={{
        marginTop:"12px", padding:"12px 32px",
        background:"linear-gradient(135deg,#a29bfe,#6c5ce7)",
        color:"#fff", border:"none", borderRadius:"10px", fontSize:"15px",
        fontWeight:"600", cursor:"pointer", width:"100%" }}>
        Analyze Headers
      </button>

      {results && (
        <div style={{ marginTop:"28px" }}>

          {/* SPF / DKIM / DMARC */}
          <div style={{ display:"flex", gap:"16px", marginBottom:"24px", flexWrap:"wrap" }}>
            {[
              { label:"SPF",   value:results.spf,   desc:"Sender Policy Framework" },
              { label:"DKIM",  value:results.dkim,  desc:"DomainKeys Identified Mail" },
              { label:"DMARC", value:results.dmarc, desc:"Domain-based Authentication" },
            ].map(({ label, value, desc }) => (
              <div key={label} style={{ flex:1, minWidth:"200px", background:"#fff",
                borderRadius:"14px", padding:"20px", border:"1px solid #e5e7eb",
                textAlign:"center" }}>
                <div style={{ fontSize:"18px", fontWeight:"800", color:"#1a1a2e",
                  marginBottom:"8px" }}>{label}</div>
                <StatusBadge status={value || "none"} />
                <div style={{ fontSize:"11px", color:"#9ca3af", marginTop:"8px" }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Key fields */}
          <div style={{ background:"#fff", borderRadius:"14px", padding:"20px",
            border:"1px solid #e5e7eb", marginBottom:"24px" }}>
            <h3 style={{ fontSize:"14px", fontWeight:"700", color:"#6b7280",
              textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"16px" }}>
              Message Details
            </h3>
            {[
              ["From",       results.from],
              ["To",         results.to],
              ["Subject",    results.subject],
              ["Date",       results.date],
              ["Message-ID", results.messageId],
            ].map(([k, v]) => (
              <div key={k} style={{ display:"flex", gap:"16px", padding:"10px 0",
                borderBottom:"1px solid #f3f4f6", fontSize:"13px" }}>
                <span style={{ fontWeight:"600", color:"#6c5ce7", minWidth:"120px" }}>{k}</span>
                <span style={{ color:"#374151", wordBreak:"break-all" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Routing table */}
          {results.hops.length > 0 && (
            <div style={{ background:"#fff", borderRadius:"14px",
              border:"1px solid #e5e7eb", overflow:"hidden" }}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid #f3f4f6" }}>
                <h3 style={{ fontSize:"14px", fontWeight:"700", color:"#6b7280",
                  textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>
                  Email Routing — {results.hops.length} hop(s)
                </h3>
              </div>

              {/* Header row */}
              <div style={{ display:"grid", gridTemplateColumns:"50px 1fr 1fr 120px 80px",
                background:"#6c5ce7", padding:"10px 16px" }}>
                {["#", "From", "To (By)", "Time received", "Delay"].map(h => (
                  <span key={h} style={{ fontSize:"11px", fontWeight:"700",
                    color:"#fff", textTransform:"uppercase" }}>{h}</span>
                ))}
              </div>

              {results.hops.map((hop, i) => (
                <div key={i} style={{
                  display:"grid", gridTemplateColumns:"50px 1fr 1fr 120px 80px",
                  padding:"12px 16px", borderBottom:"1px solid #f3f4f6",
                  background: i % 2 === 0 ? "#fff" : "#f9f9ff",
                  fontSize:"12px", alignItems:"center" }}>
                  <span style={{ fontWeight:"700", color:"#6c5ce7" }}>{i}</span>
                  <span style={{ color:"#374151", wordBreak:"break-all",
                    fontFamily:"monospace", paddingRight:"8px" }}>{hop.from}</span>
                  <span style={{ color:"#374151", wordBreak:"break-all",
                    fontFamily:"monospace", paddingRight:"8px" }}>{hop.by}</span>
                  <span style={{ color:"#6b7280" }}>
                    {hop.timestamp ? hop.timestamp.toLocaleString() : "—"}
                  </span>
                  <span style={{
                    fontWeight:"700",
                    color: hop.delay === null ? "#9ca3af"
                         : hop.delay > 30 ? "#ef4444"
                         : hop.delay > 10 ? "#f59e0b" : "#10b981" }}>
                    {hop.delay === null ? "—" : `${hop.delay}s`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import AppIcon from "../components/AppIcon";

export default function EmailHeader() {
  const [headers, setHeaders] = useState("");
  const [results, setResults] = useState(null);

  function parseHeaders(raw) {
    const lines = [];
    const received = [];
    const important = {};

    const fields = ["From", "To", "Subject", "Date", "Message-ID",
                    "Reply-To", "Return-Path", "X-Mailer", "X-Spam-Status",
                    "X-Spam-Score", "DKIM-Signature", "Authentication-Results",
                    "Content-Type"];

    raw.split("\n").forEach(line => {
      fields.forEach(f => {
        if (line.toLowerCase().startsWith(f.toLowerCase() + ":")) {
          important[f] = line.substring(f.length + 1).trim();
        }
      });
      if (line.toLowerCase().startsWith("received:")) {
        received.push(line.substring(9).trim());
      }
    });

    return { important, received };
  }

  function analyze() {
    if (!headers.trim()) return;
    setResults(parseHeaders(headers));
  }

  return (
    <div style={{ maxWidth:"800px", margin:"0 auto", padding:"32px 16px",
      fontFamily:'"SF Pro Display",-apple-system,sans-serif' }}>
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"32px" }}>
        <AppIcon id="emailheader" size={48} />
        <div>
          <h2 style={{ fontSize:"24px", fontWeight:"700", color:"#1a1a2e", margin:0 }}>Email Header Analyzer</h2>
          <p style={{ color:"#6b7280", margin:0 }}>Trace email origin, routing, and detect spoofing</p>
        </div>
      </div>

      <textarea
        value={headers}
        onChange={e => setHeaders(e.target.value)}
        placeholder="Paste your email headers here..."
        rows={10}
        style={{ width:"100%", padding:"16px", borderRadius:"12px",
          border:"1.5px solid #e5e7eb", fontSize:"13px", fontFamily:"monospace",
          resize:"vertical", outline:"none", boxSizing:"border-box",
          background:"#f9fafb" }}
      />

      <button onClick={analyze} style={{
        marginTop:"16px", padding:"12px 32px", background:"linear-gradient(135deg,#a29bfe,#6c5ce7)",
        color:"#fff", border:"none", borderRadius:"10px", fontSize:"15px",
        fontWeight:"600", cursor:"pointer", width:"100%"
      }}>Analyze Headers</button>

      {results && (
        <div style={{ marginTop:"32px" }}>
          {Object.keys(results.important).length > 0 && (
            <div style={{ background:"#fff", borderRadius:"16px", padding:"24px",
              border:"1px solid #e5e7eb", marginBottom:"24px" }}>
              <h3 style={{ fontSize:"16px", fontWeight:"700", color:"#1a1a2e",
                marginBottom:"16px" }}>Key Fields</h3>
              {Object.entries(results.important).map(([k, v]) => (
                <div key={k} style={{ display:"flex", gap:"12px", padding:"10px 0",
                  borderBottom:"1px solid #f3f4f6" }}>
                  <span style={{ fontWeight:"600", color:"#6c5ce7", minWidth:"180px",
                    fontSize:"13px" }}>{k}</span>
                  <span style={{ color:"#374151", fontSize:"13px",
                    wordBreak:"break-all" }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {results.received.length > 0 && (
            <div style={{ background:"#fff", borderRadius:"16px", padding:"24px",
              border:"1px solid #e5e7eb" }}>
              <h3 style={{ fontSize:"16px", fontWeight:"700", color:"#1a1a2e",
                marginBottom:"16px" }}>Email Routing ({results.received.length} hops)</h3>
              {results.received.map((r, i) => (
                <div key={i} style={{ display:"flex", gap:"12px", padding:"10px 0",
                  borderBottom:"1px solid #f3f4f6" }}>
                  <span style={{ fontWeight:"700", color:"#6c5ce7",
                    minWidth:"32px" }}>#{i + 1}</span>
                  <span style={{ color:"#374151", fontSize:"13px",
                    fontFamily:"monospace", wordBreak:"break-all" }}>{r}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

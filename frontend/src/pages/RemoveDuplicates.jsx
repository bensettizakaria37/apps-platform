import { useState } from "react";

export default function RemoveDuplicates() {
  const [input, setInput]   = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats]   = useState(null);
  const [copied, setCopied] = useState(false);

  const [opts, setOpts] = useState({
    caseSensitive: true,
    trimLines: true,
    removeEmpty: false,
    keepOrder: true,
  });

  const process = () => {
    let lines = input.split("\n");
    const total = lines.length;

    if (opts.trimLines)   lines = lines.map(l => l.trim());
    if (opts.removeEmpty) lines = lines.filter(l => l !== "");

    const seen = new Set();
    const result = [];
    for (const line of lines) {
      const key = opts.caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }

    const removed = total - result.length;
    setOutput(result.join("\n"));
    setStats({ total, unique: result.length, removed });
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "deduplicated.txt";
    a.click();
  };

  const reset = () => {
    setInput(""); setOutput(""); setStats(null);
  };

  const toggle = (key) => setOpts(o => ({ ...o, [key]: !o[key] }));

  return (
    <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px" }}>
          <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>⚡</div>
          <div>
            <h2 style={{ fontSize:"20px", fontWeight:"700", color:"#111827" }}>Supprimer les doublons</h2>
            <p style={{ fontSize:"13px", color:"#6b7280" }}>Supprimez les lignes dupliquées de votre texte instantanément</p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"14px", padding:"16px 20px", marginBottom:"20px", display:"flex", flexWrap:"wrap", gap:"20px", alignItems:"center" }}>
        <span style={{ fontSize:"12px", fontWeight:"600", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em" }}>Options</span>
        {[
          { key:"caseSensitive", label:"Sensible à la casse" },
          { key:"trimLines",     label:"Ignorer les espaces" },
          { key:"removeEmpty",   label:"Supprimer lignes vides" },
        ].map(({ key, label }) => (
          <label key={key} style={{ display:"flex", alignItems:"center", gap:"8px", cursor:"pointer", fontSize:"13px", color:"#374151" }}>
            <div
              onClick={() => toggle(key)}
              style={{
                width:"36px", height:"20px", borderRadius:"10px",
                background: opts[key] ? "#059669" : "#d1d5db",
                position:"relative", cursor:"pointer", transition:"background 0.2s"
              }}
            >
              <div style={{
                width:"16px", height:"16px", borderRadius:"50%", background:"#fff",
                position:"absolute", top:"2px",
                left: opts[key] ? "18px" : "2px",
                transition:"left 0.2s"
              }} />
            </div>
            {label}
          </label>
        ))}
      </div>

      {/* Editors */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>

        {/* Input */}
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"16px", padding:"20px", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
            <p style={{ fontSize:"12px", fontWeight:"600", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em" }}>Texte source</p>
            <span style={{ fontSize:"11px", color:"#9ca3af" }}>{input.split("\n").filter(Boolean).length} lignes</span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={"Collez votre texte ici...\n\napple\nbanana\napple\norange\nbanana"}
            style={{
              flex:1, minHeight:"320px", border:"1px solid #e5e7eb", borderRadius:"10px",
              padding:"12px", fontSize:"13px", lineHeight:"1.7", fontFamily:"monospace",
              resize:"vertical", outline:"none", color:"#111827", background:"#f9fafb"
            }}
          />
          <div style={{ display:"flex", gap:"8px", marginTop:"12px" }}>
            <button onClick={process} disabled={!input.trim()} style={{
              flex:2, padding:"11px", border:"none", borderRadius:"10px",
              background:"linear-gradient(135deg,#059669,#0d9488)", color:"#fff",
              fontSize:"13px", fontWeight:"700", cursor: input.trim() ? "pointer" : "not-allowed",
              opacity: input.trim() ? 1 : 0.5
            }}>
              Supprimer les doublons
            </button>
            <button onClick={reset} style={{
              flex:1, padding:"11px", border:"1px solid #e5e7eb", borderRadius:"10px",
              background:"#f9fafb", color:"#6b7280", fontSize:"13px", fontWeight:"600", cursor:"pointer"
            }}>
              Effacer
            </button>
          </div>
        </div>

        {/* Output */}
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"16px", padding:"20px", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
            <p style={{ fontSize:"12px", fontWeight:"600", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em" }}>Résultat</p>
            {stats && <span style={{ fontSize:"11px", color:"#9ca3af" }}>{stats.unique} lignes uniques</span>}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Le résultat apparaîtra ici..."
            style={{
              flex:1, minHeight:"320px", border:"1px solid #e5e7eb", borderRadius:"10px",
              padding:"12px", fontSize:"13px", lineHeight:"1.7", fontFamily:"monospace",
              resize:"vertical", outline:"none", color: output ? "#111827" : "#9ca3af",
              background:"#f9fafb", cursor:"default"
            }}
          />

          {stats && (
            <div style={{ display:"flex", gap:"8px", marginTop:"12px" }}>
              {[
                ["Total",    stats.total,   "#6b7280", "#f3f4f6"],
                ["Uniques",  stats.unique,  "#059669", "#f0fdf4"],
                ["Supprimés",stats.removed, "#dc2626", "#fef2f2"],
              ].map(([label, val, color, bg]) => (
                <div key={label} style={{ flex:1, background:bg, borderRadius:"10px", padding:"10px", textAlign:"center" }}>
                  <div style={{ fontSize:"20px", fontWeight:"800", color }}>{val}</div>
                  <div style={{ fontSize:"11px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {output && (
            <div style={{ display:"flex", gap:"8px", marginTop:"12px" }}>
              <button onClick={copy} style={{ flex:1, padding:"9px 6px", border:"1px solid #e5e7eb", borderRadius:"10px", background:"#eff6ff", color:"#1d4ed8", fontSize:"12px", fontWeight:"600", cursor:"pointer" }}>
                {copied ? "Copié !" : "Copier"}
              </button>
              <button onClick={download} style={{ flex:1, padding:"9px 6px", border:"1px solid #e5e7eb", borderRadius:"10px", background:"#f0fdf4", color:"#059669", fontSize:"12px", fontWeight:"600", cursor:"pointer" }}>
                Télécharger .TXT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

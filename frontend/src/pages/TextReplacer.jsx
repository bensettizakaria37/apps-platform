import { useState } from "react";
import AppIcon from "../components/AppIcon";

export default function TextReplacer() {
  const [input, setInput]   = useState("");
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats]   = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError]   = useState("");

  const [opts, setOpts] = useState({
    caseSensitive: false,
    useRegex: false,
    replaceAll: true,
  });

  const toggle = (key) => setOpts(o => ({ ...o, [key]: !o[key] }));

  const process = () => {
    if (!input.trim()) return;
    if (!search) { setError("Entrez un texte à rechercher."); return; }
    setError("");
    try {
      let count = 0;
      let result;

      if (opts.useRegex) {
        const flags = (opts.replaceAll ? "g" : "") + (opts.caseSensitive ? "" : "i");
        const regex = new RegExp(search, flags);
        const matches = input.match(new RegExp(search, "g" + (opts.caseSensitive ? "" : "i")));
        count = matches ? matches.length : 0;
        result = opts.replaceAll
          ? input.replace(regex, replace)
          : input.replace(new RegExp(search, opts.caseSensitive ? "" : "i"), replace);
      } else {
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const flags = (opts.replaceAll ? "g" : "") + (opts.caseSensitive ? "" : "i");
        const regex = new RegExp(escaped, flags);
        const matches = input.match(new RegExp(escaped, "g" + (opts.caseSensitive ? "" : "i")));
        count = matches ? matches.length : 0;
        result = opts.replaceAll
          ? input.replace(regex, replace)
          : input.replace(new RegExp(escaped, opts.caseSensitive ? "" : "i"), replace);
      }

      setOutput(result);
      setStats({ found: count, replaced: opts.replaceAll ? count : Math.min(count, 1) });
    } catch(e) {
      setError("Regex invalide : " + e.message);
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false), 2000); };
  const download = () => {
    const blob = new Blob([output], { type:"text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "replaced.txt";
    a.click();
  };
  const reset = () => { setInput(""); setSearch(""); setReplace(""); setOutput(""); setStats(null); setError(""); };

  return (
    <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px" }}>
          <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#fff7ed",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}><AppIcon id="replacer" size={40} /></div>
          <div>
            <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>Text Replacer</h2>
            <p style={{ fontSize:"13px",color:"#6b7280" }}>Recherchez et remplacez du texte avec support Regex</p>
          </div>
        </div>
      </div>

      {/* Search / Replace inputs */}
      <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"14px",padding:"20px",marginBottom:"20px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px" }}>
          <div>
            <label style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",display:"block",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.08em" }}>Rechercher</label>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder={opts.useRegex ? "Regular expression..." : "Text to search..."}
              style={{ width:"100%",padding:"10px 12px",border:`1px solid ${error?"#fca5a5":"#e5e7eb"}`,borderRadius:"10px",fontSize:"13px",fontFamily:opts.useRegex?"monospace":"inherit",outline:"none",boxSizing:"border-box",background:"#f9fafb" }}
            />
          </div>
          <div>
            <label style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",display:"block",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.08em" }}>Replace with</label>
            <input
              value={replace}
              onChange={e=>setReplace(e.target.value)}
              placeholder="Nouveau texte (vide pour supprimer)..."
              style={{ width:"100%",padding:"10px 12px",border:"1px solid #e5e7eb",borderRadius:"10px",fontSize:"13px",fontFamily:opts.useRegex?"monospace":"inherit",outline:"none",boxSizing:"border-box",background:"#f9fafb" }}
            />
          </div>
        </div>

        {error && <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"10px 14px",color:"#dc2626",fontSize:"12px",marginBottom:"14px" }}>⚠️ {error}</div>}

        {/* Options */}
        <div style={{ display:"flex",flexWrap:"wrap",gap:"20px",alignItems:"center" }}>
          <span style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em" }}>Options</span>
          {[
            { key:"caseSensitive", label:"Sensible à la casse" },
            { key:"useRegex",      label:"Mode Regex" },
            { key:"replaceAll",    label:"Replace all" },
          ].map(({ key, label }) => (
            <label key={key} style={{ display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",color:"#374151" }}>
              <div onClick={()=>toggle(key)} style={{ width:"36px",height:"20px",borderRadius:"10px",background:opts[key]?"#ea580c":"#d1d5db",position:"relative",cursor:"pointer",transition:"background 0.2s" }}>
                <div style={{ width:"16px",height:"16px",borderRadius:"50%",background:"#fff",position:"absolute",top:"2px",left:opts[key]?"18px":"2px",transition:"left 0.2s" }} />
              </div>
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Editors */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px" }}>

        {/* Input */}
        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"20px",display:"flex",flexDirection:"column" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px" }}>
            <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em" }}>Source text</p>
            <span style={{ fontSize:"11px",color:"#9ca3af" }}>{input.length} caractères</span>
          </div>
          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder="Collez votre texte ici..."
            style={{ flex:1,minHeight:"300px",border:"1px solid #e5e7eb",borderRadius:"10px",padding:"12px",fontSize:"13px",lineHeight:"1.7",fontFamily:"monospace",resize:"vertical",outline:"none",color:"#111827",background:"#f9fafb" }}
          />
          <div style={{ display:"flex",gap:"8px",marginTop:"12px" }}>
            <button onClick={process} disabled={!input.trim()||!search} style={{
              flex:2,padding:"11px",border:"none",borderRadius:"10px",
              background:"linear-gradient(135deg,#ea580c,#d97706)",color:"#fff",
              fontSize:"13px",fontWeight:"700",cursor:input.trim()&&search?"pointer":"not-allowed",
              opacity:input.trim()&&search?1:0.5
            }}>Replace</button>
            <button onClick={reset} style={{ flex:1,padding:"11px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#f9fafb",color:"#6b7280",fontSize:"13px",fontWeight:"600",cursor:"pointer" }}>Clear</button>
          </div>
        </div>

        {/* Output */}
        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"20px",display:"flex",flexDirection:"column" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px" }}>
            <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em" }}>Result</p>
            {stats && <span style={{ fontSize:"11px",color:"#9ca3af" }}>{stats.replaced} remplacement(s)</span>}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Le résultat apparaîtra ici..."
            style={{ flex:1,minHeight:"300px",border:"1px solid #e5e7eb",borderRadius:"10px",padding:"12px",fontSize:"13px",lineHeight:"1.7",fontFamily:"monospace",resize:"vertical",outline:"none",color:output?"#111827":"#9ca3af",background:"#f9fafb",cursor:"default" }}
          />

          {stats && (
            <div style={{ display:"flex",gap:"8px",marginTop:"12px" }}>
              {[
                ["Trouvés",   stats.found,    "#ea580c","#fff7ed"],
                ["Remplacés", stats.replaced, "#059669","#f0fdf4"],
              ].map(([label,val,color,bg])=>(
                <div key={label} style={{ flex:1,background:bg,borderRadius:"10px",padding:"10px",textAlign:"center" }}>
                  <div style={{ fontSize:"20px",fontWeight:"800",color }}>{val}</div>
                  <div style={{ fontSize:"11px",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em" }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {output && (
            <div style={{ display:"flex",gap:"8px",marginTop:"12px" }}>
              <button onClick={copy} style={{ flex:1,padding:"9px 6px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#eff6ff",color:"#1d4ed8",fontSize:"12px",fontWeight:"600",cursor:"pointer" }}>
                {copied?"Copied!":"Copy"}
              </button>
              <button onClick={download} style={{ flex:1,padding:"9px 6px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#fff7ed",color:"#ea580c",fontSize:"12px",fontWeight:"600",cursor:"pointer" }}>
                Download .TXT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

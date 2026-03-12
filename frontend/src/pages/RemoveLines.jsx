import { useState } from "react";

export default function RemoveLines() {
  const [input, setInput]   = useState("");
  const [keyword, setKeyword] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats]   = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError]   = useState("");

  const [opts, setOpts] = useState({
    caseSensitive: false,
    useRegex: false,
    removeEmpty: false,
    invert: false,
  });

  const toggle = (key) => setOpts(o => ({ ...o, [key]: !o[key] }));

  const process = () => {
    if (!input.trim()) return;
    if (!keyword && !opts.removeEmpty) { setError("Entrez un mot-clé à rechercher."); return; }
    setError("");
    try {
      const lines = input.split("\n");
      const total = lines.length;
      let result = [];

      for (const line of lines) {
        let matches = false;

        if (opts.removeEmpty && line.trim() === "") {
          matches = true;
        } else if (keyword) {
          if (opts.useRegex) {
            const flags = opts.caseSensitive ? "" : "i";
            const regex = new RegExp(keyword, flags);
            matches = regex.test(line);
          } else {
            const l = opts.caseSensitive ? line : line.toLowerCase();
            const k = opts.caseSensitive ? keyword : keyword.toLowerCase();
            matches = l.includes(k);
          }
        }

        // invert = garder les lignes qui contiennent le mot-clé
        if (opts.invert ? matches : !matches) {
          result.push(line);
        }
      }

      const removed = total - result.length;
      setOutput(result.join("\n"));
      setStats({ total, kept: result.length, removed });
    } catch(e) {
      setError("Regex invalide : " + e.message);
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false), 2000); };
  const download = () => {
    const blob = new Blob([output], { type:"text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "filtered.txt";
    a.click();
  };
  const reset = () => { setInput(""); setKeyword(""); setOutput(""); setStats(null); setError(""); };

  return (
    <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom:"28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px" }}>
          <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#fdf2f8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}>🧹</div>
          <div>
            <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>Supprimer les lignes contenant</h2>
            <p style={{ fontSize:"13px",color:"#6b7280" }}>Filtrez et supprimez les lignes qui contiennent un mot-clé ou une expression</p>
          </div>
        </div>
      </div>

      {/* Keyword + Options */}
      <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"14px",padding:"20px",marginBottom:"20px" }}>
        <div style={{ marginBottom:"16px" }}>
          <label style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",display:"block",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.08em" }}>
            {opts.invert ? "Garder les lignes contenant" : "Supprimer les lignes contenant"}
          </label>
          <input
            value={keyword}
            onChange={e=>setKeyword(e.target.value)}
            placeholder={opts.useRegex ? "Expression régulière..." : "Mot-clé, phrase..."}
            style={{ width:"100%",padding:"10px 12px",border:`1px solid ${error?"#fca5a5":"#e5e7eb"}`,borderRadius:"10px",fontSize:"13px",fontFamily:opts.useRegex?"monospace":"inherit",outline:"none",boxSizing:"border-box",background:"#f9fafb" }}
          />
        </div>

        {error && <div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"10px 14px",color:"#dc2626",fontSize:"12px",marginBottom:"14px" }}>⚠️ {error}</div>}

        <div style={{ display:"flex",flexWrap:"wrap",gap:"20px",alignItems:"center" }}>
          <span style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em" }}>Options</span>
          {[
            { key:"caseSensitive", label:"Sensible à la casse" },
            { key:"useRegex",      label:"Mode Regex" },
            { key:"removeEmpty",   label:"Supprimer lignes vides" },
            { key:"invert",        label:"Inverser (garder)" },
          ].map(({ key, label }) => (
            <label key={key} style={{ display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",color:"#374151" }}>
              <div onClick={()=>toggle(key)} style={{ width:"36px",height:"20px",borderRadius:"10px",background:opts[key]?"#9333ea":"#d1d5db",position:"relative",cursor:"pointer",transition:"background 0.2s" }}>
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
            <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em" }}>Texte source</p>
            <span style={{ fontSize:"11px",color:"#9ca3af" }}>{input.split("\n").length} lignes</span>
          </div>
          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder={"Collez votre texte ici...\n\napple\nbanana error\norange\nfatal: error found\ngrape"}
            style={{ flex:1,minHeight:"300px",border:"1px solid #e5e7eb",borderRadius:"10px",padding:"12px",fontSize:"13px",lineHeight:"1.7",fontFamily:"monospace",resize:"vertical",outline:"none",color:"#111827",background:"#f9fafb" }}
          />
          <div style={{ display:"flex",gap:"8px",marginTop:"12px" }}>
            <button onClick={process} disabled={!input.trim()||(!keyword&&!opts.removeEmpty)} style={{
              flex:2,padding:"11px",border:"none",borderRadius:"10px",
              background:"linear-gradient(135deg,#9333ea,#6d28d9)",color:"#fff",
              fontSize:"13px",fontWeight:"700",cursor:input.trim()&&(keyword||opts.removeEmpty)?"pointer":"not-allowed",
              opacity:input.trim()&&(keyword||opts.removeEmpty)?1:0.5
            }}>
              {opts.invert ? "Garder les lignes" : "Supprimer les lignes"}
            </button>
            <button onClick={reset} style={{ flex:1,padding:"11px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#f9fafb",color:"#6b7280",fontSize:"13px",fontWeight:"600",cursor:"pointer" }}>Effacer</button>
          </div>
        </div>

        {/* Output */}
        <div style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"20px",display:"flex",flexDirection:"column" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px" }}>
            <p style={{ fontSize:"12px",fontWeight:"600",color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em" }}>Résultat</p>
            {stats && <span style={{ fontSize:"11px",color:"#9ca3af" }}>{stats.kept} lignes conservées</span>}
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
                ["Total",     stats.total,   "#6b7280","#f3f4f6"],
                ["Conservées",stats.kept,    "#9333ea","#fdf4ff"],
                ["Supprimées",stats.removed, "#dc2626","#fef2f2"],
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
                {copied?"Copié !":"Copier"}
              </button>
              <button onClick={download} style={{ flex:1,padding:"9px 6px",border:"1px solid #e5e7eb",borderRadius:"10px",background:"#fdf4ff",color:"#9333ea",fontSize:"12px",fontWeight:"600",cursor:"pointer" }}>
                Télécharger .TXT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

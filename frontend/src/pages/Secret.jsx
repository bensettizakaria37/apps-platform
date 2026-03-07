import { useState } from "react";

const BACKEND = "https://apps-api.cloudfactory.ma";
const BASE_URL = "https://apps.cloudfactory.ma";

const EXPIRY_OPTS = [
  { value:"1h",  label:"1 heure" },
  { value:"24h", label:"24 heures" },
  { value:"7d",  label:"7 jours" },
  { value:"30d", label:"30 jours" },
];

export default function Secret() {
  const [tab, setTab]       = useState("create"); // create | view
  const [content, setContent] = useState("");
  const [expiry, setExpiry]   = useState("24h");
  const [link, setLink]       = useState("");
  const [copied, setCopied]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // View secret
  const [secretId, setSecretId]   = useState("");
  const [revealed, setRevealed]   = useState("");
  const [revealedAt, setRevealedAt] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Check if URL has a secret ID
  const urlParams = new URLSearchParams(window.location.search);
  const urlSecretId = urlParams.get("s");

  const createSecret = async () => {
    if (!content.trim()) { setError("Écrivez un secret d'abord !"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BACKEND}/secrets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, expiry })
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail); }
      const data = await res.json();
      setLink(`${BASE_URL}/?page=secret&s=${data.id}`);
      setContent("");
    } catch(e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const viewSecret = async (id) => {
    const sid = id || secretId;
    if (!sid.trim()) { setError("Entrez un ID de secret"); return; }
    setLoading(true); setError(""); setRevealed("");
    try {
      const res = await fetch(`${BACKEND}/secrets/${sid}`);
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail); }
      const data = await res.json();
      setRevealed(data.content);
      setRevealedAt(data.expires_at);
    } catch(e) {
      setError(e.message);
    }
    setLoading(false);
  };

  // Auto-reveal if URL has secret ID
  const [autoReveal, setAutoReveal] = useState(false);
  if (urlSecretId && !autoReveal) {
    setAutoReveal(true);
    setTab("view");
    setSecretId(urlSecretId);
    setTimeout(() => viewSecret(urlSecretId), 300);
  }

  const copyLink = () => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const copySecret = () => { navigator.clipboard.writeText(revealed); setCopiedSecret(true); setTimeout(()=>setCopiedSecret(false),2000); };
  const reset = () => { setLink(""); setContent(""); setError(""); };

  const s = {
    card: { background:"#fff", border:"1px solid #e5e7eb", borderRadius:"16px", padding:"32px", maxWidth:"580px", margin:"0 auto" },
    label: { fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px", display:"block" },
    textarea: { width:"100%", minHeight:"140px", padding:"14px", border:"1px solid #e5e7eb", borderRadius:"12px", fontSize:"14px", color:"#111827", resize:"vertical", outline:"none", fontFamily:"inherit", lineHeight:"1.6" },
    select: { width:"100%", padding:"11px 14px", border:"1px solid #e5e7eb", borderRadius:"10px", fontSize:"13px", color:"#111827", background:"#fff", outline:"none", cursor:"pointer" },
    btn: { width:"100%", padding:"14px", border:"none", borderRadius:"12px", fontSize:"15px", fontWeight:"700", cursor:"pointer", transition:"all 0.2s" },
    error: { background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", padding:"12px 16px", color:"#dc2626", fontSize:"13px", marginTop:"12px" },
  };

  return (
    <div style={{ maxWidth:"620px", margin:"0 auto", padding:"40px 24px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"28px" }}>
        <div style={{ width:"40px",height:"40px",borderRadius:"10px",background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}>🔐</div>
        <div>
          <h2 style={{ fontSize:"20px",fontWeight:"700",color:"#111827" }}>Secret Sharing</h2>
          <p style={{ fontSize:"13px",color:"#6b7280" }}>Partagez un secret — le lien s'autodétruit après lecture</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:"#f3f4f6", borderRadius:"12px", padding:"4px", marginBottom:"24px", gap:"4px" }}>
        {[["create","✍️ Créer un secret"],["view","👁️ Voir un secret"]].map(([id,label])=>(
          <button key={id} onClick={()=>{setTab(id);setError("");setRevealed("");}} style={{
            flex:1, padding:"9px", border:"none", borderRadius:"9px",
            background: tab===id ? "#fff" : "transparent",
            color: tab===id ? "#111827" : "#6b7280",
            fontWeight: tab===id ? "600" : "400",
            fontSize:"13px", cursor:"pointer",
            boxShadow: tab===id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            transition:"all 0.15s"
          }}>{label}</button>
        ))}
      </div>

      <div style={s.card}>
        {/* CREATE */}
        {tab === "create" && !link && (
          <>
            <div style={{ marginBottom:"16px" }}>
              <label style={s.label}>🔒 Votre secret</label>
              <textarea
                style={s.textarea}
                placeholder="Écrivez votre mot de passe, message confidentiel, clé API..."
                value={content}
                onChange={e=>setContent(e.target.value)}
              />
              <div style={{ textAlign:"right", fontSize:"11px", color:"#9ca3af", marginTop:"4px" }}>
                {content.length} / 50 000 caractères
              </div>
            </div>

            <div style={{ marginBottom:"20px" }}>
              <label style={s.label}>⏱️ Expire dans</label>
              <select style={s.select} value={expiry} onChange={e=>setExpiry(e.target.value)}>
                {EXPIRY_OPTS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {error && <div style={s.error}>⚠️ {error}</div>}

            <button onClick={createSecret} disabled={loading} style={{
              ...s.btn,
              background:"linear-gradient(135deg,#d97706,#f59e0b)",
              color:"#fff",
              opacity: loading ? 0.6 : 1
            }}>
              {loading ? "⏳ Création..." : "🔐 Créer le lien secret"}
            </button>

            <div style={{ marginTop:"16px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:"10px", padding:"12px 16px" }}>
              <p style={{ fontSize:"12px", color:"#92400e", lineHeight:"1.6" }}>
                ⚠️ <strong>Important :</strong> Le secret est chiffré et stocké de façon sécurisée. Le lien ne fonctionne qu'<strong>une seule fois</strong> — après lecture, il est définitivement détruit.
              </p>
            </div>
          </>
        )}

        {/* LINK CREATED */}
        {tab === "create" && link && (
          <>
            <div style={{ textAlign:"center", marginBottom:"24px" }}>
              <div style={{ fontSize:"48px", marginBottom:"8px" }}>🎉</div>
              <h3 style={{ fontSize:"18px", fontWeight:"700", color:"#111827", marginBottom:"6px" }}>Lien créé !</h3>
              <p style={{ fontSize:"13px", color:"#6b7280" }}>Partagez ce lien. Il sera détruit après la première lecture.</p>
            </div>

            <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"14px 16px", marginBottom:"16px", wordBreak:"break-all", fontSize:"13px", color:"#1d4ed8", fontFamily:"monospace" }}>
              {link}
            </div>

            <button onClick={copyLink} style={{
              ...s.btn,
              background: copied ? "linear-gradient(135deg,#059669,#10b981)" : "linear-gradient(135deg,#1d4ed8,#7c3aed)",
              color:"#fff", marginBottom:"10px"
            }}>
              {copied ? "✅ Lien copié !" : "📋 Copier le lien"}
            </button>

            <button onClick={reset} style={{ ...s.btn, background:"#f3f4f6", color:"#374151" }}>
              + Créer un autre secret
            </button>
          </>
        )}

        {/* VIEW */}
        {tab === "view" && !revealed && (
          <>
            <div style={{ marginBottom:"16px" }}>
              <label style={s.label}>🔑 ID du secret</label>
              <input
                style={{ ...s.textarea, minHeight:"auto", padding:"12px 14px" }}
                placeholder="Collez l'ID ou le lien complet ici..."
                value={secretId}
                onChange={e => {
                  const val = e.target.value;
                  const match = val.match(/[?&]s=([a-zA-Z0-9]+)/);
                  setSecretId(match ? match[1] : val);
                }}
              />
            </div>

            {error && <div style={s.error}>⚠️ {error}</div>}

            <div style={{ background:"#fef3c7", border:"1px solid #fde68a", borderRadius:"10px", padding:"12px 16px", marginBottom:"16px" }}>
              <p style={{ fontSize:"12px", color:"#92400e" }}>
                ⚠️ <strong>Attention :</strong> En cliquant sur "Révéler", le secret sera affiché <strong>une seule fois</strong> puis définitivement détruit.
              </p>
            </div>

            <button onClick={()=>viewSecret()} disabled={loading} style={{
              ...s.btn,
              background:"linear-gradient(135deg,#dc2626,#ef4444)",
              color:"#fff",
              opacity: loading ? 0.6 : 1
            }}>
              {loading ? "⏳ Récupération..." : "👁️ Révéler et détruire"}
            </button>
          </>
        )}

        {/* REVEALED */}
        {tab === "view" && revealed && (
          <>
            <div style={{ textAlign:"center", marginBottom:"20px" }}>
              <div style={{ fontSize:"40px", marginBottom:"8px" }}>🔓</div>
              <h3 style={{ fontSize:"17px", fontWeight:"700", color:"#111827" }}>Secret révélé</h3>
              <p style={{ fontSize:"12px", color:"#dc2626", marginTop:"4px" }}>⚠️ Ce secret a été détruit — il ne peut plus être consulté</p>
            </div>

            <div style={{ background:"#f9fafb", border:"2px solid #e5e7eb", borderRadius:"12px", padding:"20px", marginBottom:"16px", whiteSpace:"pre-wrap", fontSize:"14px", color:"#111827", lineHeight:"1.7", wordBreak:"break-all", maxHeight:"300px", overflowY:"auto" }}>
              {revealed}
            </div>

            <button onClick={copySecret} style={{
              ...s.btn,
              background: copiedSecret ? "linear-gradient(135deg,#059669,#10b981)" : "linear-gradient(135deg,#1d4ed8,#7c3aed)",
              color:"#fff", marginBottom:"10px"
            }}>
              {copiedSecret ? "✅ Copié !" : "📋 Copier le secret"}
            </button>

            <button onClick={()=>{setRevealed("");setSecretId("");setTab("create");}} style={{ ...s.btn, background:"#f3f4f6", color:"#374151" }}>
              Créer un nouveau secret
            </button>
          </>
        )}
      </div>
    </div>
  );
}

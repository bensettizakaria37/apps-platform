const APPS = [
  { id:"pdf",         title:"PDF to DOCX",             desc:"Convert your PDFs into editable Word documents in one click.",           g:["#ff6b6b","#ee5a24"], icon:<><rect x="12" y="8" width="24" height="32" rx="3" fill="white" opacity="0.95"/><rect x="16" y="16" width="16" height="2.5" rx="1.25" fill="#ee5a24"/><rect x="16" y="22" width="16" height="2.5" rx="1.25" fill="#ee5a24" opacity="0.6"/><rect x="16" y="28" width="10" height="2.5" rx="1.25" fill="#ee5a24" opacity="0.35"/></> },
  { id:"ocr",         title:"OCR — Image to Text",     desc:"Extract text from any image or scanned PDF. Supports FR, EN, AR.",       g:["#a29bfe","#6c5ce7"], icon:<><rect x="9" y="9" width="30" height="30" rx="5" fill="white" opacity="0.15" stroke="white" strokeWidth="2"/><circle cx="19" cy="19" r="5.5" fill="white" opacity="0.95"/><path d="M27 33 L33 27 L37 31 L31 37Z" fill="white" opacity="0.9"/><line x1="9" y1="9" x2="14" y2="9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="9" y1="9" x2="9" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="39" y1="9" x2="34" y2="9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="39" y1="9" x2="39" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></> },
  { id:"compress",    title:"Compress PDF",             desc:"Reduce the size of your PDFs without visible quality loss.",             g:["#00cec9","#00b894"], icon:<><rect x="12" y="8" width="24" height="32" rx="3" fill="white" opacity="0.95"/><path d="M24 16 L24 32" stroke="#00b894" strokeWidth="2.5" strokeLinecap="round"/><path d="M18 22 L24 16 L30 22" stroke="#00b894" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M18 26 L24 32 L30 26" stroke="#00b894" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></> },
  { id:"duplicates",  title:"Remove Duplicate Lines",  desc:"Remove duplicate lines from any text instantly.",                        g:["#fdcb6e","#e17055"], icon:<><rect x="9" y="12" width="22" height="3" rx="1.5" fill="white"/><rect x="9" y="19" width="22" height="3" rx="1.5" fill="white" opacity="0.4"/><rect x="9" y="26" width="22" height="3" rx="1.5" fill="white"/><rect x="9" y="33" width="16" height="3" rx="1.5" fill="white" opacity="0.4"/><circle cx="37" cy="34" r="8" fill="white"/><path d="M33 34 L36 37 L41 31" stroke="#e17055" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></> },
  { id:"removelines", title:"Remove Lines Containing", desc:"Filter and remove lines that contain a keyword or expression.",           g:["#fd79a8","#e84393"], icon:<><rect x="9" y="12" width="30" height="3" rx="1.5" fill="white"/><rect x="9" y="19" width="30" height="3" rx="1.5" fill="white" opacity="0.35"/><rect x="9" y="26" width="30" height="3" rx="1.5" fill="white"/><rect x="9" y="33" width="20" height="3" rx="1.5" fill="white" opacity="0.6"/><line x1="6" y1="20.5" x2="42" y2="20.5" stroke="white" strokeWidth="2" strokeDasharray="3 2.5"/></> },
  { id:"replacer",    title:"Text Replacer",           desc:"Find and replace text with full Regex support.",                          g:["#74b9ff","#0984e3"], icon:<><path d="M11 17 Q24 9 37 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M37 31 Q24 39 11 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/><circle cx="24" cy="24" r="5" fill="white" opacity="0.95"/><circle cx="24" cy="24" r="2" fill="#0984e3"/></> },
  { id:"secret",      title:"Secret Sharing",          desc:"Share passwords and secrets via a unique self-destructing link.",         g:["#2d3436","#636e72"], icon:<><rect x="13" y="22" width="22" height="18" rx="4" fill="white" opacity="0.95"/><path d="M16 22 V16 A8 8 0 0 1 32 16 V22" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/><circle cx="24" cy="31" r="3.5" fill="#636e72"/><rect x="22.5" y="31" width="3" height="5" rx="1.5" fill="#636e72"/></> },
  { id:"ssl",         title:"SSL Checker",             desc:"Check the validity and details of any domain's SSL certificate.",         g:["#00b894","#55efc4"], icon:<><path d="M24 7 L37 12.5 V25 C37 33 31 38.5 24 41 C17 38.5 11 33 11 25 V12.5Z" fill="white" opacity="0.9"/><path d="M18 25 L22 29 L30 21" stroke="#00b894" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></> },
  { id:"csr",         title:"CSR Decoder",             desc:"Decode and inspect your Certificate Signing Requests.",                   g:["#81ecec","#00cec9"], icon:<><rect x="11" y="8" width="26" height="34" rx="3" fill="white" opacity="0.9"/><rect x="15" y="15" width="18" height="2.5" rx="1.25" fill="#00cec9"/><rect x="15" y="21" width="14" height="2.5" rx="1.25" fill="#00cec9" opacity="0.6"/><rect x="15" y="27" width="16" height="2.5" rx="1.25" fill="#00cec9" opacity="0.4"/><circle cx="24" cy="35" r="3" fill="#00cec9" opacity="0.7"/></> },
  { id:"certdecoder", title:"Certificate Decoder",     desc:"Decode and inspect any X.509 SSL/TLS certificate.",                      g:["#ffeaa7","#fdcb6e"], icon:<><path d="M24 6 L28.5 15.5 L39 17 L31.5 24 L33.5 34.5 L24 29.5 L14.5 34.5 L16.5 24 L9 17 L19.5 15.5Z" fill="white" opacity="0.95"/><circle cx="24" cy="21" r="4" fill="#fdcb6e"/></> },
  { id:"whois",       title:"Who.is Lookup",           desc:"Get registration and ownership details for any domain.",                  g:["#a29bfe","#6c5ce7"], icon:<><circle cx="24" cy="24" r="15" stroke="white" strokeWidth="2.5" fill="none"/><ellipse cx="24" cy="24" rx="7" ry="15" stroke="white" strokeWidth="2" fill="none"/><line x1="9" y1="24" x2="39" y2="24" stroke="white" strokeWidth="2"/><line x1="11" y1="16" x2="37" y2="16" stroke="white" strokeWidth="1.5" opacity="0.55"/><line x1="11" y1="32" x2="37" y2="32" stroke="white" strokeWidth="1.5" opacity="0.55"/></> },
  { id:"geopeeker",   title:"GeoPeeker",               desc:"See how your website responds from different locations worldwide.",       g:["#74b9ff","#0984e3"], icon:<><circle cx="24" cy="21" r="11" fill="white" opacity="0.9"/><path d="M24 32 L24 42" stroke="white" strokeWidth="3" strokeLinecap="round"/><circle cx="24" cy="21" r="4.5" fill="#0984e3"/><path d="M8 42 Q24 35 40 42" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55"/></> },
];

export default function Home({ setPage }) {
  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse at 15% 15%, #d4c5f9 0%, #e8e0ff 25%, #f0e6ff 50%, #fce4f4 75%, #ffd6e8 100%)",
      fontFamily:'"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      padding:"56px 32px",
    }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>

        {/* Hero */}
        <div style={{ textAlign:"center", marginBottom:"56px" }}>
          <div style={{ display:"inline-block",background:"rgba(108,92,231,0.1)",color:"#6c5ce7",fontSize:"12px",fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 14px",borderRadius:"20px",marginBottom:"20px" }}>Tools Platform</div>
          <h1 style={{ fontSize:"48px",fontWeight:"800",color:"#1a1a2e",letterSpacing:"-2px",lineHeight:1.05,marginBottom:"16px" }}>
            Your productivity tools,<br/>
            <span style={{ background:"linear-gradient(135deg,#6c5ce7,#a29bfe,#fd79a8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>all in one place.</span>
          </h1>
          <p style={{ fontSize:"17px",color:"#636e72",lineHeight:1.6,maxWidth:"480px",margin:"0 auto" }}>
            Simple, fast and free tools to convert, extract and transform your files.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"16px" }}>
          {APPS.map(app => (
            <div
              key={app.id}
              onClick={() => setPage(app.id)}
              style={{ background:"rgba(255,255,255,0.75)",backdropFilter:"blur(16px)",borderRadius:"20px",padding:"28px 24px",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 2px 12px rgba(108,92,231,0.07)",border:"1px solid rgba(255,255,255,0.9)" }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 12px 32px rgba(108,92,231,0.18)";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.background="rgba(255,255,255,0.95)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(108,92,231,0.07)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.background="rgba(255,255,255,0.75)";}}
            >
              <div style={{ width:"48px",height:"48px",borderRadius:"14px",background:`linear-gradient(135deg,${app.g[0]},${app.g[1]})`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"18px",boxShadow:`0 4px 12px ${app.g[1]}55` }}>
                <svg viewBox="0 0 48 48" width="48" height="48" fill="none">{app.icon}</svg>
              </div>
              <h3 style={{ fontSize:"16px",fontWeight:"700",color:"#1a1a2e",marginBottom:"8px",letterSpacing:"-0.3px" }}>{app.title}</h3>
              <p style={{ fontSize:"13px",color:"#6b7280",lineHeight:"1.65" }}>{app.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

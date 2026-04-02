import AppIcon from "../components/AppIcon";

const APPS = [
  { id:"pdf",         title:"PDF to DOCX",             desc:"Convert your PDFs into editable Word documents in one click." },
  { id:"ocr",         title:"OCR : Image to Text",     desc:"Extract text from any image or scanned PDF. FR, EN, AR." },
  { id:"compress",    title:"Compress PDF",             desc:"Reduce the size of your PDFs without visible quality loss." },
  { id:"duplicates",  title:"Remove Duplicate Lines",  desc:"Remove duplicate lines from any text instantly." },
  { id:"removelines", title:"Remove Lines Containing", desc:"Filter and remove lines that contain a keyword or expression." },
  { id:"replacer",    title:"Text Replacer",           desc:"Find and replace text with full Regex support." },
  { id:"secret",      title:"Secret Sharing",          desc:"Share passwords and secrets via a unique self-destructing link." },
  { id:"ssl",         title:"SSL Checker",             desc:"Check the validity and details of any domain's SSL certificate." },
  { id:"csr",         title:"CSR Decoder",             desc:"Decode and inspect your Certificate Signing Requests." },
  { id:"certdecoder", title:"Certificate Decoder",     desc:"Decode and inspect any X.509 SSL/TLS certificate." },
  { id:"whois",       title:"Who.is Lookup",           desc:"Get registration and ownership details for any domain." },
  { id:"dnshealth",   title:"DNS Health Check",        desc:"Analyze DNS configuration, NS, SOA, MX, SPF, DMARC and detect issues." },
  { id:"dnslookup",   title:"DNS Lookup",              desc:"Query DNS records (A, MX, TXT, NS...) for any domain instantly." },
  { id:"emailheader",  title:"Email Header Analyzer",  desc:"Analyze email headers to trace origin, routing, and detect spoofing." },
  { id:"geopeeker",   title:"GeoPeeker",               desc:"See how your website responds from different locations worldwide." },
];

export default function Home({ setPage }) {
  return (
    <div style={{
      minHeight:"100vh",
      fontFamily:'"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      padding:"56px 32px",
    }}>
      <div style={{ maxWidth:"960px", margin:"0 auto" }}>

        <div style={{ textAlign:"center", marginBottom:"56px" }}>
          <p style={{ fontSize:"13px",fontWeight:"700",letterSpacing:"0.2em",textTransform:"uppercase",color:"#6c5ce7",marginBottom:"16px",background:"rgba(108,92,231,0.25)",padding:"6px 16px",borderRadius:"20px",display:"inline-block" }}>FACTORY-TOOLS</p>
          <h1 style={{ fontSize:"48px",fontWeight:"800",color:"#f3f4f6",letterSpacing:"-2px",lineHeight:1.05,marginBottom:"14px" }}>
            Your productivity tools,<br/>
            <span style={{ background:"linear-gradient(135deg,#6c5ce7,#a29bfe,#fd79a8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
              all in one place.
            </span>
          </h1>
          <p style={{ fontSize:"16px",color:"#636e72",lineHeight:1.6,maxWidth:"440px",margin:"0 auto" }}>
            Simple, fast and free tools to convert, extract and transform your files.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.9)", overflow:"hidden", boxShadow:"0 4px 32px rgba(108,92,231,0.1)" }}>
          {APPS.map((app, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const isLastRow = Math.floor((APPS.length - 1) / 3) === row;
            return (
              <div
                key={app.id}
                onClick={() => setPage(app.id)}
                style={{
                  padding:"28px 24px", cursor:"pointer", transition:"background 0.15s",
                  borderRight: col < 2 ? "1px solid rgba(0,0,0,0.06)" : "none",
                  borderBottom: !isLastRow ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(108,92,231,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"10px" }}>
                  <AppIcon id={app.id} size={44} />
                  <span style={{ fontSize:"15px",fontWeight:"700",color:"#f3f4f6",letterSpacing:"-0.3px" }}>{app.title}</span>
                </div>
                <p style={{ fontSize:"13px",color:"#9ca3af",lineHeight:"1.6",paddingLeft:"58px" }}>{app.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

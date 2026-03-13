import { useState } from "react";
import Home from "./pages/Home";
import PdfToDocx from "./pages/PdfToDocx";
import Ocr from "./pages/Ocr";
import Secret from "./pages/Secret";
import CompressPdf from "./pages/CompressPdf";
import RemoveDuplicates from "./pages/RemoveDuplicates";
import TextReplacer from "./pages/TextReplacer";
import RemoveLines from "./pages/RemoveLines";
import CsrDecoder from "./pages/CsrDecoder";
import SslChecker from "./pages/SslChecker";
import CertificateDecoder from "./pages/CertificateDecoder";
import WhoisLookup from "./pages/WhoisLookup";
import GeoPeeker from "./pages/GeoPeeker";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlPage = urlParams.get("page");
  const [page, setPage] = useState(urlPage || "home");

  const navigate = (id) => {
    window.history.replaceState({}, "", `/?page=${id}`);
    setPage(id);
  };

  // Sidebar shown on all pages
  const APPS = [
    { id:"pdf",         title:"PDF to DOCX" },
    { id:"ocr",         title:"OCR" },
    { id:"compress",    title:"Compress PDF" },
    { id:"duplicates",  title:"Remove Duplicates" },
    { id:"removelines", title:"Remove Lines" },
    { id:"replacer",    title:"Text Replacer" },
    { id:"secret",      title:"Secret Sharing" },
    { id:"csr",         title:"CSR Decoder" },
    { id:"ssl",         title:"SSL Checker" },
    { id:"certdecoder", title:"Certificate Decoder" },
    { id:"whois",       title:"Who.is Lookup" },
    { id:"geopeeker",   title:"GeoPeeker" },
  ];

  const ICONS = {
    pdf:         <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s1)"/><rect x="12" y="8" width="24" height="32" rx="3" fill="white" opacity="0.9"/><rect x="16" y="16" width="16" height="2" rx="1" fill="#e74c3c"/><rect x="16" y="21" width="16" height="2" rx="1" fill="#e74c3c" opacity="0.6"/><rect x="16" y="26" width="10" height="2" rx="1" fill="#e74c3c" opacity="0.4"/><defs><linearGradient id="s1" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#ff6b6b"/><stop offset="1" stopColor="#ee5a24"/></linearGradient></defs></svg>,
    ocr:         <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s2)"/><rect x="10" y="10" width="28" height="28" rx="4" fill="white" opacity="0.2" stroke="white" strokeWidth="2"/><circle cx="20" cy="20" r="5" fill="white" opacity="0.9"/><path d="M26 32 L32 26 L36 30 L30 36Z" fill="white"/><defs><linearGradient id="s2" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#a29bfe"/><stop offset="1" stopColor="#6c5ce7"/></linearGradient></defs></svg>,
    compress:    <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s3)"/><path d="M24 10 L24 38 M14 20 L24 10 L34 20 M14 28 L24 38 L34 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="s3" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#55efc4"/><stop offset="1" stopColor="#00b894"/></linearGradient></defs></svg>,
    duplicates:  <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s4)"/><rect x="10" y="13" width="28" height="3" rx="1.5" fill="white"/><rect x="10" y="20" width="28" height="3" rx="1.5" fill="white" opacity="0.4"/><rect x="10" y="27" width="28" height="3" rx="1.5" fill="white"/><rect x="10" y="34" width="20" height="3" rx="1.5" fill="white" opacity="0.4"/><circle cx="38" cy="35" r="7" fill="#e17055"/><path d="M35 35 L37 37 L41 33" stroke="white" strokeWidth="2" strokeLinecap="round"/><defs><linearGradient id="s4" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#fdcb6e"/><stop offset="1" stopColor="#e17055"/></linearGradient></defs></svg>,
    removelines: <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s5)"/><rect x="10" y="13" width="28" height="3" rx="1.5" fill="white"/><rect x="10" y="21" width="28" height="3" rx="1.5" fill="white" opacity="0.5"/><rect x="10" y="29" width="28" height="3" rx="1.5" fill="white"/><line x1="8" y1="22" x2="40" y2="22" stroke="white" strokeWidth="2" strokeDasharray="3 2"/><defs><linearGradient id="s5" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#fd79a8"/><stop offset="1" stopColor="#e84393"/></linearGradient></defs></svg>,
    replacer:    <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s6)"/><path d="M12 18 Q24 10 36 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 30 Q24 38 12 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/><circle cx="24" cy="24" r="4" fill="white"/><defs><linearGradient id="s6" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#74b9ff"/><stop offset="1" stopColor="#0984e3"/></linearGradient></defs></svg>,
    secret:      <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s7)"/><rect x="14" y="22" width="20" height="16" rx="3" fill="white" opacity="0.9"/><path d="M17 22 V17 A7 7 0 0 1 31 17 V22" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/><circle cx="24" cy="30" r="3" fill="#fdcb6e"/><defs><linearGradient id="s7" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#636e72"/><stop offset="1" stopColor="#2d3436"/></linearGradient></defs></svg>,
    csr:         <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s8)"/><path d="M24 8 L28 16 L38 17 L31 24 L33 34 L24 29 L15 34 L17 24 L10 17 L20 16Z" fill="white" opacity="0.9"/><defs><linearGradient id="s8" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#81ecec"/><stop offset="1" stopColor="#00cec9"/></linearGradient></defs></svg>,
    ssl:         <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s9)"/><path d="M24 8 L36 13 V24 C36 31 30 37 24 40 C18 37 12 31 12 24 V13Z" fill="white" opacity="0.85"/><path d="M19 24 L22 27 L29 20" stroke="#00b894" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="s9" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#00b894"/><stop offset="1" stopColor="#00cec9"/></linearGradient></defs></svg>,
    certdecoder: <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s10)"/><rect x="11" y="9" width="26" height="34" rx="3" fill="white" opacity="0.85"/><rect x="16" y="16" width="16" height="2" rx="1" fill="#e17055"/><rect x="16" y="21" width="12" height="2" rx="1" fill="#e17055" opacity="0.6"/><rect x="16" y="26" width="14" height="2" rx="1" fill="#e17055" opacity="0.4"/><circle cx="24" cy="34" r="3" fill="#e17055" opacity="0.7"/><defs><linearGradient id="s10" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#ffeaa7"/><stop offset="1" stopColor="#e17055"/></linearGradient></defs></svg>,
    whois:       <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s11)"/><circle cx="24" cy="24" r="13" stroke="white" strokeWidth="2.5" fill="none"/><ellipse cx="24" cy="24" rx="6" ry="13" stroke="white" strokeWidth="2" fill="none"/><line x1="11" y1="24" x2="37" y2="24" stroke="white" strokeWidth="2"/><defs><linearGradient id="s11" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#a29bfe"/><stop offset="1" stopColor="#6c5ce7"/></linearGradient></defs></svg>,
    geopeeker:   <svg viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#s12)"/><circle cx="24" cy="22" r="9" fill="white" opacity="0.9"/><path d="M24 31 L24 40" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><circle cx="24" cy="22" r="3.5" fill="#0984e3"/><defs><linearGradient id="s12" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#74b9ff"/><stop offset="1" stopColor="#0984e3"/></linearGradient></defs></svg>,
  };

  if (page === "home") {
    return <Home setPage={navigate} icons={ICONS} apps={APPS} />;
  }

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f9fafb" }}>
      {/* Sidebar */}
      <div style={{ width:"64px",flexShrink:0,background:"rgba(255,255,255,0.95)",borderRight:"1px solid #e5e7eb",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:"12px",gap:"4px" }}>
        {/* Home button */}
        <button onClick={()=>navigate("home")} style={{ width:"40px",height:"40px",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#6c5ce7,#a29bfe)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"8px",flexShrink:0 }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2 L12 7 L17 7 L13 11 L15 16 L10 13 L5 16 L7 11 L3 7 L8 7Z" fill="white"/></svg>
        </button>
        {APPS.map(app => (
          <button
            key={app.id}
            onClick={() => navigate(app.id)}
            title={app.title}
            style={{ width:"40px",height:"40px",borderRadius:"10px",border:"none",background:page===app.id?"rgba(108,92,231,0.12)":"transparent",cursor:"pointer",padding:"5px",transition:"all 0.15s",flexShrink:0 }}
          >
            <svg viewBox="0 0 48 48" style={{ width:"100%",height:"100%" }}>{ICONS[app.id]}</svg>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {page==="pdf"         && <PdfToDocx />}
        {page==="ocr"         && <Ocr />}
        {page==="secret"      && <Secret />}
        {page==="compress"    && <CompressPdf />}
        {page==="duplicates"  && <RemoveDuplicates />}
        {page==="replacer"    && <TextReplacer />}
        {page==="removelines" && <RemoveLines />}
        {page==="csr"         && <CsrDecoder />}
        {page==="ssl"         && <SslChecker />}
        {page==="certdecoder" && <CertificateDecoder />}
        {page==="whois"       && <WhoisLookup />}
        {page==="geopeeker"   && <GeoPeeker />}
      </div>
    </div>
  );
}

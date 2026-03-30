import { useState, useEffect } from "react";
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
import EmailHeader from "./pages/EmailHeader";
import DnsLookup from "./pages/DnsLookup";
import DnsHealth from "./pages/DnsHealth";

export default function App() {
  const getPage = () => new URLSearchParams(window.location.search).get("page") || "home";
  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const onPop = () => setPage(getPage());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (id) => {
    window.history.pushState({}, "", `/?page=${id}`);
    setPage(id);
  };

  if (page === "home") return <Home setPage={navigate} />;

  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse at 15% 15%, #d4c5f9 0%, #e8e0ff 25%, #f0e6ff 50%, #fce4f4 75%, #ffd6e8 100%)",
      fontFamily:'"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    }}>
      <div style={{ padding:"20px 32px 0" }}>
        <button onClick={()=>navigate("home")} style={{
          display:"inline-flex",alignItems:"center",gap:"6px",
          padding:"8px 16px",borderRadius:"20px",border:"none",
          background:"rgba(255,255,255,0.75)",backdropFilter:"blur(12px)",
          boxShadow:"0 2px 10px rgba(108,92,231,0.12)",
          color:"#6c5ce7",fontWeight:"600",fontSize:"13px",cursor:"pointer",
          transition:"all 0.15s",
        }}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.95)"}
        onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.75)"}
        >
          ← FactoryTools
        </button>
      </div>
      <div>
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
        {page==="emailheader" && <EmailHeader />}
        {page==="dnslookup" && <DnsLookup />}
        {page==="dnshealth" && <DnsHealth />}
      </div>
    </div>
  );
}

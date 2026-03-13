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
  const [page, setPage] = useState(urlParams.get("page") || "home");

  const navigate = (id) => {
    window.history.replaceState({}, "", `/?page=${id}`);
    setPage(id);
  };

  const BackButton = () => (
    <button onClick={()=>navigate("home")} style={{
      position:"fixed", top:"20px", left:"20px", zIndex:100,
      display:"flex", alignItems:"center", gap:"6px",
      padding:"8px 14px", borderRadius:"20px", border:"none",
      background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)",
      boxShadow:"0 2px 12px rgba(0,0,0,0.1)",
      color:"#6c5ce7", fontWeight:"600", fontSize:"13px", cursor:"pointer",
    }}>
      ← FactoryTools
    </button>
  );

  if (page === "home") return <Home setPage={navigate} />;

  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb" }}>
      <BackButton />
      <div style={{ paddingTop:"0" }}>
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

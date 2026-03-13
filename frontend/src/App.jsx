import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PdfToDocx from "./pages/PdfToDocx";
import Ocr from "./pages/Ocr";
import Secret from "./pages/Secret";
import CompressPdf from "./pages/CompressPdf";
import SslChecker from "./pages/SslChecker";
import GeoPeeker from "./pages/GeoPeeker";
import CertificateDecoder from "./pages/CertificateDecoder";
import WhoisLookup from "./pages/WhoisLookup";
import CsrDecoder from "./pages/CsrDecoder";
import RemoveLines from "./pages/RemoveLines";
import TextReplacer from "./pages/TextReplacer";
import RemoveDuplicates from "./pages/RemoveDuplicates";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlPage = urlParams.get("page");
  const [page, setPage] = useState(urlPage || "home");
  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <Navbar page={page} setPage={setPage} />
      {page==="home"       && <Home setPage={setPage} />}
      {page==="pdf"        && <PdfToDocx />}
      {page==="ocr"        && <Ocr />}
      {page==="secret"     && <Secret />}
      {page==="compress"   && <CompressPdf />}
      {page==="ssl" && <SslChecker />}
      {page==="geopeeker" && <GeoPeeker />}
      {page==="certdecoder" && <CertificateDecoder />}
      {page==="whois" && <WhoisLookup />}
      {page==="csr" && <CsrDecoder />}
      {page==="removelines" && <RemoveLines />}
      {page==="replacer" && <TextReplacer />}
      {page==="duplicates" && <RemoveDuplicates />}
    </div>
  );
}

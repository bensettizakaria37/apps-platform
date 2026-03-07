import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PdfToDocx from "./pages/PdfToDocx";
import Ocr from "./pages/Ocr";

export default function App() {
  const [page, setPage] = useState("home");
  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <Navbar page={page} setPage={setPage} />
      {page === "home" && <Home setPage={setPage} />}
      {page === "pdf"  && <PdfToDocx />}
      {page === "ocr"  && <Ocr />}
    </div>
  );
}

import { useState, useEffect } from "react";

export default function QuizGate({ children }) {
  const [passed, setPassed]             = useState(false);
  const [question, setQuestion]         = useState(null);
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState(null);
  const [result, setResult]             = useState(null);
  const [attempts, setAttempts]         = useState(0);
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    const ok = sessionStorage.getItem("quiz_passed");
    if (ok === "true") { setPassed(true); setLoading(false); return; }
    fetch("/aws_quiz.json")
      .then(r => r.json())
      .then(data => { setAllQuestions(data); pickQuestion(data); })
      .catch(() => setLoading(false));
  }, []);

  function pickQuestion(questions) {
    const q = questions[Math.floor(Math.random() * questions.length)];
    setQuestion(q);
    setSelected(null);
    setResult(null);
    setLoading(false);
  }

  function handleAnswer(opt) {
    if (result) return;
    const letter = opt.charAt(0);
    setSelected(opt);
    const isCorrect = letter === question.answer;
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setTimeout(() => { sessionStorage.setItem("quiz_passed", "true"); setPassed(true); }, 1500);
    } else {
      setAttempts(a => a + 1);
      setTimeout(() => pickQuestion(allQuestions), 2500);
    }
  }

  if (passed) return children;

  return (
    <div style={{
      minHeight:"100vh",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:'"SF Pro Display",-apple-system,sans-serif',
      padding:"24px"
    }}>
      <div style={{ maxWidth:"680px", width:"100%" }}>

        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <div style={{ fontSize:"48px", marginBottom:"12px" }}>☁️</div>
          <p style={{ fontSize:"13px", fontWeight:"700", letterSpacing:"0.2em",
            textTransform:"uppercase", color:"#a29bfe", marginBottom:"12px",
            background:"rgba(108,92,231,0.2)", padding:"6px 16px",
            borderRadius:"20px", display:"inline-block",
            border:"1px solid rgba(162,155,254,0.3)" }}>
            FACTORY TOOLS — ACCESS GATE
          </p>
          <h1 style={{ fontSize:"32px", fontWeight:"800", color:"#f3f4f6",
            marginBottom:"8px", letterSpacing:"-1px" }}>AWS Knowledge Check</h1>
          <p style={{ color:"#6b7280", fontSize:"14px" }}>
            Answer correctly to access the tools • SAA-C02
          </p>
        </div>

        <div style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)",
          borderRadius:"20px", border:"1px solid rgba(255,255,255,0.08)",
          padding:"32px", boxShadow:"0 4px 40px rgba(0,0,0,0.4)" }}>

          {loading ? (
            <div style={{ textAlign:"center", padding:"40px" }}>
              <p style={{ color:"#a29bfe", fontWeight:"600" }}>Loading question...</p>
            </div>
          ) : question && (
            <>
              <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
                <span style={{ background:"rgba(108,92,231,0.25)", color:"#a29bfe",
                  padding:"4px 12px", borderRadius:"20px", fontSize:"12px",
                  fontWeight:"700", border:"1px solid rgba(162,155,254,0.2)" }}>
                  SAA-C02 #{question.id}
                </span>
                <span style={{ background:"rgba(255,255,255,0.06)", color:"#9ca3af",
                  padding:"4px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:"600" }}>
                  Solutions Architect Associate
                </span>
                {attempts > 0 && (
                  <span style={{ background:"rgba(239,68,68,0.15)", color:"#f87171",
                    padding:"4px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:"600" }}>
                    Attempt {attempts + 1}
                  </span>
                )}
              </div>

              <p style={{ color:"#f3f4f6", fontSize:"16px", fontWeight:"600",
                lineHeight:"1.7", marginBottom:"24px" }}>{question.question}</p>

              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {question.options.map(opt => {
                  const letter = opt.charAt(0);
                  const isCorrect = letter === question.answer;
                  const isSelected = selected === opt;

                  let bg = "rgba(255,255,255,0.05)";
                  let border = "1px solid rgba(255,255,255,0.1)";
                  let color = "#e5e7eb";

                  if (result && isCorrect) {
                    bg = "rgba(16,185,129,0.2)"; border = "1px solid #10b981"; color = "#6ee7b7";
                  } else if (result && isSelected && !isCorrect) {
                    bg = "rgba(239,68,68,0.2)"; border = "1px solid #ef4444"; color = "#fca5a5";
                  } else if (!result && isSelected) {
                    bg = "rgba(108,92,231,0.25)"; border = "1px solid #6c5ce7"; color = "#a29bfe";
                  }

                  return (
                    <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!result}
                      style={{ padding:"14px 20px", borderRadius:"12px",
                        background:bg, border, color,
                        textAlign:"left", fontSize:"14px", fontWeight:"500",
                        cursor: result ? "default" : "pointer", transition:"all 0.15s",
                        fontFamily:'"SF Pro Display",-apple-system,sans-serif' }}
                      onMouseEnter={e => { if (!result) e.currentTarget.style.background = "rgba(108,92,231,0.15)"; }}
                      onMouseLeave={e => { if (!result && !isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {result && (
                <div style={{ marginTop:"20px", padding:"16px", borderRadius:"12px",
                  background: result === "correct" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  border: `1px solid ${result === "correct" ? "#10b981" : "#ef4444"}` }}>
                  <p style={{ fontWeight:"700", margin:0, fontSize:"15px",
                    color: result === "correct" ? "#6ee7b7" : "#fca5a5" }}>
                    {result === "correct" ? "✓ Correct! Access granted..." : "✗ Wrong! Try another question..."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <p style={{ textAlign:"center", color:"#4b5563", fontSize:"12px", marginTop:"16px" }}>
          200 questions • Amazon AWS Certified Solutions Architect - Associate (SAA-C02)
        </p>
      </div>
    </div>
  );
}

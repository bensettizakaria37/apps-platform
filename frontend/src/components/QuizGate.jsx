import { useState, useEffect } from "react";

export default function QuizGate({ children }) {
  const [passed, setPassed]         = useState(false);
  const [question, setQuestion]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [result, setResult]         = useState(null);
  const [attempts, setAttempts]     = useState(0);
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
      background:"radial-gradient(ellipse at 15% 15%, #d4c5f9 0%, #e8e0ff 25%, #f0e6ff 50%, #fce4f4 75%, #ffd6e8 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:'"SF Pro Display",-apple-system,sans-serif',
      padding:"24px"
    }}>
      <div style={{ maxWidth:"680px", width:"100%" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <div style={{ fontSize:"48px", marginBottom:"12px" }}>☁️</div>
          <p style={{ fontSize:"13px", fontWeight:"700", letterSpacing:"0.2em",
            textTransform:"uppercase", color:"#6c5ce7", marginBottom:"8px",
            background:"rgba(108,92,231,0.08)", padding:"6px 16px",
            borderRadius:"20px", display:"inline-block" }}>
            FACTORY TOOLS — ACCESS GATE
          </p>
          <h1 style={{ fontSize:"28px", fontWeight:"800", color:"#1a1a2e", marginBottom:"8px" }}>
            AWS Knowledge Check
          </h1>
          <p style={{ color:"#6b7280", fontSize:"14px" }}>
            Answer correctly to access the tools • SAA-C02
          </p>
        </div>

        {/* Card */}
        <div style={{ background:"#fff", borderRadius:"20px",
          border:"1px solid #e5e7eb", padding:"32px",
          boxShadow:"0 4px 24px rgba(108,92,231,0.08)" }}>

          {loading ? (
            <div style={{ textAlign:"center", padding:"40px" }}>
              <div style={{ fontSize:"32px", marginBottom:"16px" }}>⚡</div>
              <p style={{ color:"#6c5ce7", fontWeight:"600" }}>Loading question...</p>
            </div>
          ) : question && (
            <>
              {/* Badges */}
              <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
                <span style={{ background:"rgba(108,92,231,0.08)", color:"#6c5ce7",
                  padding:"4px 12px", borderRadius:"20px", fontSize:"12px",
                  fontWeight:"700" }}>SAA-C02 #{question.id}</span>
                <span style={{ background:"#f3f4f6", color:"#6b7280",
                  padding:"4px 12px", borderRadius:"20px", fontSize:"12px",
                  fontWeight:"600" }}>Solutions Architect Associate</span>
                {attempts > 0 && (
                  <span style={{ background:"#fee2e2", color:"#991b1b",
                    padding:"4px 12px", borderRadius:"20px", fontSize:"12px",
                    fontWeight:"600" }}>Attempt {attempts + 1}</span>
                )}
              </div>

              {/* Question */}
              <p style={{ color:"#1a1a2e", fontSize:"16px", fontWeight:"600",
                lineHeight:"1.7", marginBottom:"24px" }}>{question.question}</p>

              {/* Options */}
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {question.options.map(opt => {
                  const letter = opt.charAt(0);
                  const isCorrect = letter === question.answer;
                  const isSelected = selected === opt;

                  let bg = "#f9fafb";
                  let border = "1.5px solid #e5e7eb";
                  let color = "#374151";

                  if (result && isCorrect) {
                    bg = "#d1fae5"; border = "1.5px solid #10b981"; color = "#065f46";
                  } else if (result && isSelected && !isCorrect) {
                    bg = "#fee2e2"; border = "1.5px solid #ef4444"; color = "#991b1b";
                  } else if (!result && isSelected) {
                    bg = "#f0eeff"; border = "1.5px solid #6c5ce7"; color = "#6c5ce7";
                  }

                  return (
                    <button key={opt} onClick={() => handleAnswer(opt)}
                      disabled={!!result}
                      style={{ padding:"14px 20px", borderRadius:"12px",
                        background:bg, border, color,
                        textAlign:"left", fontSize:"14px", fontWeight:"500",
                        cursor: result ? "default" : "pointer",
                        transition:"all 0.15s" }}>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Result */}
              {result && (
                <div style={{ marginTop:"20px", padding:"16px", borderRadius:"12px",
                  background: result === "correct" ? "#d1fae5" : "#fee2e2",
                  border: `1.5px solid ${result === "correct" ? "#10b981" : "#ef4444"}` }}>
                  <p style={{ fontWeight:"700", margin:0, fontSize:"15px",
                    color: result === "correct" ? "#065f46" : "#991b1b" }}>
                    {result === "correct"
                      ? "✓ Correct! Access granted..."
                      : "✗ Wrong! Try another question..."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <p style={{ textAlign:"center", color:"#9ca3af", fontSize:"12px", marginTop:"16px" }}>
          200 questions • Amazon AWS Certified Solutions Architect - Associate (SAA-C02)
        </p>
      </div>
    </div>
  );
}

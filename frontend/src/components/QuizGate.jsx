import { useState, useEffect } from "react";

const DIFFICULTIES = ["Associate", "Professional", "Specialty"];
const SERVICES = ["EC2", "S3", "RDS", "Lambda", "VPC", "IAM", "CloudFront", "Route53", "EKS", "ECS", "DynamoDB", "SQS", "SNS", "CloudWatch", "Glacier"];

export default function QuizGate({ children }) {
  const [passed, setPassed]     = useState(false);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [result, setResult]     = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const ok = sessionStorage.getItem("quiz_passed");
    if (ok === "true") { setPassed(true); setLoading(false); return; }
    generateQuestion();
  }, []);

  async function generateQuestion() {
    setLoading(true);
    setSelected(null);
    setResult(null);
    const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
    const diff    = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate a single AWS certification question (${diff} level) about ${service}.
Return ONLY a JSON object with this exact format, no markdown, no explanation:
{
  "question": "the question text",
  "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
  "correct": "A",
  "explanation": "brief explanation of why this is correct"
}`
          }]
        })
      });

      const data = await res.json();
      const text = data.content[0].text.trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const q = JSON.parse(clean);
      setQuestion({ ...q, service, diff });
    } catch (e) {
      // Fallback question
      setQuestion({
        question: "Which AWS service is used for scalable object storage?",
        options: ["A. Amazon EC2", "B. Amazon S3", "C. Amazon RDS", "D. Amazon EBS"],
        correct: "B",
        explanation: "Amazon S3 (Simple Storage Service) provides scalable object storage in the cloud.",
        service: "S3",
        diff: "Associate"
      });
    }
    setLoading(false);
  }

  function handleAnswer(opt) {
    if (result) return;
    const letter = opt.charAt(0);
    setSelected(opt);
    const isCorrect = letter === question.correct;
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setTimeout(() => {
        sessionStorage.setItem("quiz_passed", "true");
        setPassed(true);
      }, 1500);
    } else {
      setAttempts(a => a + 1);
      setTimeout(() => generateQuestion(), 2500);
    }
  }

  if (passed) return children;

  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse at 60% 0%, #2d1b69 0%, #11082e 40%, #0a0a1a 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:'"SF Pro Display",-apple-system,sans-serif',
      padding:"24px"
    }}>
      <div style={{ maxWidth:"640px", width:"100%" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <div style={{ fontSize:"48px", marginBottom:"12px" }}>☁️</div>
          <p style={{ fontSize:"13px", fontWeight:"700", letterSpacing:"0.2em",
            textTransform:"uppercase", color:"#a29bfe", marginBottom:"8px",
            background:"rgba(108,92,231,0.15)", padding:"6px 16px",
            borderRadius:"20px", display:"inline-block" }}>
            FACTORY TOOLS — ACCESS GATE
          </p>
          <h1 style={{ fontSize:"28px", fontWeight:"800", color:"#fff",
            marginBottom:"8px" }}>AWS Knowledge Check</h1>
          <p style={{ color:"#9ca3af", fontSize:"14px" }}>
            Answer correctly to access the tools
          </p>
        </div>

        {/* Card */}
        <div style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)",
          borderRadius:"20px", border:"1px solid rgba(255,255,255,0.1)",
          padding:"32px" }}>

          {loading ? (
            <div style={{ textAlign:"center", padding:"40px" }}>
              <div style={{ fontSize:"32px", marginBottom:"16px" }}>⚡</div>
              <p style={{ color:"#a29bfe", fontWeight:"600" }}>Generating question...</p>
            </div>
          ) : question && (
            <>
              {/* Badge */}
              <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
                <span style={{ background:"rgba(108,92,231,0.3)", color:"#a29bfe",
                  padding:"4px 12px", borderRadius:"20px", fontSize:"12px",
                  fontWeight:"700" }}>{question.service}</span>
                <span style={{ background:"rgba(255,255,255,0.1)", color:"#9ca3af",
                  padding:"4px 12px", borderRadius:"20px", fontSize:"12px",
                  fontWeight:"600" }}>{question.diff}</span>
                {attempts > 0 && (
                  <span style={{ background:"rgba(239,68,68,0.2)", color:"#f87171",
                    padding:"4px 12px", borderRadius:"20px", fontSize:"12px",
                    fontWeight:"600" }}>Attempt {attempts + 1}</span>
                )}
              </div>

              {/* Question */}
              <p style={{ color:"#f3f4f6", fontSize:"17px", fontWeight:"600",
                lineHeight:"1.6", marginBottom:"24px" }}>{question.question}</p>

              {/* Options */}
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {question.options.map(opt => {
                  const letter = opt.charAt(0);
                  const isCorrect = letter === question.correct;
                  const isSelected = selected === opt;

                  let bg = "rgba(255,255,255,0.05)";
                  let border = "1px solid rgba(255,255,255,0.1)";
                  let color = "#e5e7eb";

                  if (result && isCorrect) {
                    bg = "rgba(16,185,129,0.2)";
                    border = "1px solid #10b981";
                    color = "#6ee7b7";
                  } else if (result && isSelected && !isCorrect) {
                    bg = "rgba(239,68,68,0.2)";
                    border = "1px solid #ef4444";
                    color = "#fca5a5";
                  }

                  return (
                    <button key={opt} onClick={() => handleAnswer(opt)}
                      disabled={!!result}
                      style={{
                        padding:"14px 20px", borderRadius:"12px",
                        background: bg, border, color,
                        textAlign:"left", fontSize:"14px", fontWeight:"500",
                        cursor: result ? "default" : "pointer",
                        transition:"all 0.2s"
                      }}>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Result */}
              {result && (
                <div style={{
                  marginTop:"20px", padding:"16px", borderRadius:"12px",
                  background: result === "correct" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  border: `1px solid ${result === "correct" ? "#10b981" : "#ef4444"}`
                }}>
                  <p style={{ fontWeight:"700", marginBottom:"6px",
                    color: result === "correct" ? "#6ee7b7" : "#fca5a5",
                    fontSize:"15px" }}>
                    {result === "correct" ? "✓ Correct! Access granted..." : "✗ Wrong! Try another question..."}
                  </p>
                  <p style={{ color:"#9ca3af", fontSize:"13px", margin:0 }}>
                    {question.explanation}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <p style={{ textAlign:"center", color:"#4b5563", fontSize:"12px",
          marginTop:"16px" }}>
          Questions powered by Claude AI • AWS Certification Practice
        </p>
      </div>
    </div>
  );
}

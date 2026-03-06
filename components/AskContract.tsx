"use client";
import { useState } from "react";

const suggestions = [
  "What are the payment terms?",
  "Can I terminate this contract?",
  "Who owns the intellectual property?",
  "What happens if there is a dispute?",
];

export default function AskContract({ contractId }: { contractId: string }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (question.trim().length < 5) return;
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, question }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to get answer."); return; }
      setAnswer(data.answer);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="glass" style={{ borderRadius: "14px", padding: "1.5rem" }}>
        <p style={{ fontSize: "0.72rem", color: "var(--green)", letterSpacing: "0.05em", fontWeight: 600, marginBottom: "1rem" }}>
          ASK ABOUT THIS CONTRACT
        </p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input type="text" value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAsk()}
            placeholder="e.g. What are the payment terms?"
            style={{
              flex: 1, background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)", borderRadius: "8px",
              padding: "0.65rem 1rem", color: "var(--text)",
              fontSize: "0.85rem", outline: "none",
            }}
            onFocus={e => e.target.style.borderColor = "var(--green-border)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
          <button onClick={handleAsk} disabled={loading || question.trim().length < 5} style={{
            padding: "0.65rem 1.5rem", borderRadius: "8px",
            background: "var(--green)", color: "#000",
            border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: "0.82rem",
            opacity: loading || question.trim().length < 5 ? 0.5 : 1,
          }}>
            {loading ? "..." : "Ask"}
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.75rem" }}>
          {suggestions.map(q => (
            <button key={q} onClick={() => setQuestion(q)} style={{
              fontSize: "0.72rem", padding: "0.3rem 0.7rem", borderRadius: "6px",
              background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
              color: "var(--muted)", cursor: "pointer", transition: "all 0.15s"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--green-border)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: "0.75rem 1rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", color: "#f87171", fontSize: "0.82rem" }}>
          {error}
        </div>
      )}

      {answer && (
        <div className="glass" style={{ borderRadius: "14px", padding: "1.5rem" }}>
          <p style={{ fontSize: "0.72rem", color: "var(--green)", letterSpacing: "0.05em", fontWeight: 600, marginBottom: "0.75rem" }}>
            ANSWER
          </p>
          <p style={{ color: "rgba(240,244,243,0.85)", fontSize: "0.88rem", lineHeight: 1.8 }}>{answer}</p>
        </div>
      )}
    </div>
  );
}
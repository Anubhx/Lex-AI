"use client";
import { useState } from "react";
import { Clause } from "@/types/contract";

const riskStyle = {
  high: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  low: { color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
};

export default function ClauseCard({ clause }: { clause: Clause }) {
  const [expanded, setExpanded] = useState(false);
  const s = riskStyle[clause.risk] || riskStyle.low;

  return (
    <div className="glass" style={{ borderRadius: "12px", padding: "1.2rem", transition: "border-color 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--green-border)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{
            fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem",
            borderRadius: "100px", background: s.bg, border: `1px solid ${s.border}`, color: s.color
          }}>
            {clause.risk}
          </span>
          <h4 style={{ fontWeight: 600, fontSize: "0.85rem" }}>{clause.title}</h4>
        </div>
        <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.6 }}>{clause.explanation}</p>
          <div style={{
            borderLeft: "2px solid var(--green-border)", paddingLeft: "0.75rem",
            color: "var(--muted)", fontSize: "0.78rem", fontStyle: "italic", opacity: 0.6
          }}>
            {clause.content}
          </div>
        </div>
      )}
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";

export default function RiskScore({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getStyle = () => {
    if (score <= 3) return { color: "#10b981", label: "Low Risk", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" };
    if (score <= 6) return { color: "#f59e0b", label: "Medium Risk", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" };
    return { color: "#ef4444", label: "High Risk", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" };
  };

  const s = getStyle();

  return (
    <div className="glass" style={{ borderRadius: "16px", padding: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.05em" }}>OVERALL RISK SCORE</span>
        <span style={{
          fontSize: "0.72rem", fontWeight: 600, padding: "0.25rem 0.75rem",
          borderRadius: "100px", background: s.bg, border: `1px solid ${s.border}`, color: s.color
        }}>
          {s.label}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "4rem", fontWeight: 800, color: s.color, letterSpacing: "-0.05em", lineHeight: 1, transition: "color 0.5s" }}>
          {score}
        </span>
        <span style={{ color: "var(--muted)", fontSize: "1.2rem" }}>/10</span>
      </div>

      {/* Segmented bar */}
      <div style={{ display: "flex", gap: "3px" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "6px", borderRadius: "3px",
            background: i < animated ? s.color : "rgba(255,255,255,0.06)",
            transition: `background 0.1s ${i * 50}ms`,
            opacity: i < animated ? 1 : 1,
          }} />
        ))}
      </div>
    </div>
  );
}
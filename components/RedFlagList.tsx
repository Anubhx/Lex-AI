"use client";
import { RedFlag } from "@/types/contract";

const sev = {
  high: { color: "#ef4444", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.15)" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.15)" },
  low: { color: "#6366f1", bg: "rgba(99,102,241,0.06)", border: "rgba(99,102,241,0.15)" },
};

export default function RedFlagList({ flags }: { flags: RedFlag[] }) {
  if (!flags || flags.length === 0) return (
    <div className="glass" style={{ borderRadius: "14px", padding: "2rem", textAlign: "center" }}>
      <p style={{ color: "#10b981", fontWeight: 600, fontSize: "0.9rem" }}>✓ No major red flags detected</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {flags.map((flag, i) => {
        const s = sev[flag.severity] || sev.low;
        return (
          <div key={i} className="glass" style={{ borderRadius: "14px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
              <h4 style={{ fontWeight: 600, fontSize: "0.88rem" }}>{flag.title}</h4>
              <span style={{
                fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem",
                borderRadius: "100px", background: s.bg, border: `1px solid ${s.border}`,
                color: s.color, whiteSpace: "nowrap", flexShrink: 0
              }}>
                {flag.severity}
              </span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: flag.quote ? "0.75rem" : 0 }}>
              {flag.description}
            </p>
            {flag.quote && (
              <div style={{
                borderLeft: `2px solid ${s.color}`, paddingLeft: "0.75rem",
                color: "var(--muted)", fontSize: "0.78rem", fontStyle: "italic", opacity: 0.7
              }}>
                "{flag.quote}"
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
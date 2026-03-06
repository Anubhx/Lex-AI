"use client";
import { useRouter } from "next/navigation";
import { Contract } from "@/types/contract";

const riskColor = (score: number) => {
  if (score <= 3) return "#10b981";
  if (score <= 6) return "#f59e0b";
  return "#ef4444";
};

const statusConfig: Record<string, { label: string; color: string }> = {
  done: { label: "Analyzed", color: "#10b981" },
  analyzing: { label: "Analyzing...", color: "#6366f1" },
  pending: { label: "Pending", color: "#6b7f7a" },
  error: { label: "Error", color: "#ef4444" },
};

export default function ContractCard({
  contract,
  onDelete,
}: {
  contract: Contract;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const st = statusConfig[contract.status] || statusConfig.pending;

  return (
    <div className="glass" style={{
      borderRadius: "14px", padding: "1.5rem",
      display: "flex", flexDirection: "column", gap: "1rem",
      transition: "border-color 0.2s, transform 0.2s",
      cursor: "default"
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--green-border)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <h3 style={{ fontWeight: 600, fontSize: "0.9rem", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
          {contract.name}
        </h3>
        <span style={{
          fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem",
          borderRadius: "100px", background: `${st.color}18`,
          border: `1px solid ${st.color}30`, color: st.color,
          whiteSpace: "nowrap", flexShrink: 0
        }}>
          {st.label}
        </span>
      </div>

      {contract.status === "done" && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ flex: 1, display: "flex", gap: "2px" }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: "3px", borderRadius: "2px",
                background: i < contract.risk_score ? riskColor(contract.risk_score) : "rgba(255,255,255,0.06)"
              }} />
            ))}
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: riskColor(contract.risk_score) }}>
            {contract.risk_score}/10
          </span>
        </div>
      )}

      <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
        {new Date(contract.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
      </p>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        {contract.status === "done" && (
          <button onClick={() => router.push(`/analyze/${contract.id}`)} style={{
            flex: 1, padding: "0.5rem", borderRadius: "7px",
            background: "var(--green)", color: "#000",
            border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: "0.78rem"
          }}>
            View Analysis
          </button>
        )}
        <button onClick={() => onDelete(contract.id)} style={{
          padding: "0.5rem 0.75rem", borderRadius: "7px",
          background: "none", color: "var(--muted)",
          border: "1px solid var(--border)", cursor: "pointer",
          fontSize: "0.78rem", transition: "all 0.2s"
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
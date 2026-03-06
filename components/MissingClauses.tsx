export default function MissingClauses({ clauses }: { clauses: string[] }) {
  if (!clauses || clauses.length === 0) return (
    <div className="glass" style={{ borderRadius: "14px", padding: "2rem", textAlign: "center" }}>
      <p style={{ color: "#10b981", fontWeight: 600, fontSize: "0.9rem" }}>✓ All standard clauses present</p>
    </div>
  );

  return (
    <div className="glass" style={{ borderRadius: "14px", padding: "1.8rem" }}>
      <p style={{ fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.05em", marginBottom: "1.2rem" }}>
        {clauses.length} MISSING CLAUSE{clauses.length !== 1 ? "S" : ""}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {clauses.map((clause, i) => (
          <span key={i} style={{
            fontSize: "0.78rem", padding: "0.35rem 0.8rem", borderRadius: "6px",
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
            color: "#f59e0b"
          }}>
            {clause}
          </span>
        ))}
      </div>
    </div>
  );
}
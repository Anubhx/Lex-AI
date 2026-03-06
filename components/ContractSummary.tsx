export default function ContractSummary({ summary }: { summary: string }) {
  return (
    <div className="glass" style={{ borderRadius: "14px", padding: "1.8rem" }}>
      <p style={{ fontSize: "0.75rem", color: "var(--green)", letterSpacing: "0.05em", fontWeight: 600, marginBottom: "1rem" }}>
        PLAIN ENGLISH SUMMARY
      </p>
      <p style={{ color: "rgba(240,244,243,0.8)", fontSize: "0.9rem", lineHeight: 1.8 }}>{summary}</p>
    </div>
  );
}
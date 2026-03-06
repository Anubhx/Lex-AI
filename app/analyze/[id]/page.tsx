"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Analysis, Contract } from "@/types/contract";
import RiskScore from "@/components/RiskScore";
import RedFlagList from "@/components/RedFlagList";
import MissingClauses from "@/components/MissingClauses";
import ClauseCard from "@/components/ClauseCard";
import ContractSummary from "@/components/ContractSummary";
import AskContract from "@/components/AskContract";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "red flags", label: "Red Flags" },
  { id: "clauses", label: "Clauses" },
  { id: "missing", label: "Missing" },
  { id: "ask AI", label: "Ask AI" },
];

export default function AnalyzePage() {
  const { id } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { if (id) fetchAnalysis(); }, [id]);

  const fetchAnalysis = async () => {
    try {
      const res = await fetch(`/api/contracts/${id}`);
      const data = await res.json();
      setContract(data.contract);
      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", margin: "0 auto 1rem",
          border: "2px solid var(--green-border)", borderTopColor: "var(--green)",
          animation: "spin 0.8s linear infinite"
        }} />
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Loading analysis...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen dot-grid" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ borderBottom: "1px solid var(--border)", padding: "0 2rem" }} className="flex items-center justify-between h-14">
        <Link href="/" style={{ textDecoration: "none" }} className="flex items-center gap-2">
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
          <span style={{ fontWeight: 700, letterSpacing: "-0.02em", fontSize: "1rem", color: "var(--text)" }}>LexAI</span>
        </Link>
        <Link href="/dashboard" style={{ fontSize: "0.8rem", color: "var(--muted)", textDecoration: "none" }}
          className="hover:text-white transition-colors">
          ← Dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.72rem", color: "var(--green)", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "0.4rem" }}>
            AI ANALYSIS COMPLETE
          </p>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            {contract?.name}
          </h1>
        </div>

        {analysis && (
          <div style={{ marginBottom: "2rem" }}>
            <RiskScore score={analysis.risk_score} />
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "2rem", background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "3px", border: "1px solid var(--border)" }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: "0.5rem 0.75rem",
              borderRadius: "7px", border: "none", cursor: "pointer",
              fontSize: "0.78rem", fontWeight: 500,
              background: activeTab === tab.id ? "var(--green)" : "transparent",
              color: activeTab === tab.id ? "#000" : "var(--muted)",
              transition: "all 0.15s"
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {analysis && (
          <div className="animate-fade-up">
            {activeTab === "overview" && <ContractSummary summary={analysis.summary} />}
            {activeTab === "red flags" && <RedFlagList flags={analysis.red_flags} />}
            {activeTab === "clauses" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {analysis.clauses?.map((clause, i) => <ClauseCard key={i} clause={clause} />)}
              </div>
            )}
            {activeTab === "missing" && <MissingClauses clauses={analysis.missing_clauses} />}
            {activeTab === "ask AI" && <AskContract contractId={id as string} />}
          </div>
        )}
      </div>
    </main>
  );
}
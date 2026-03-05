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

export default function AnalyzePage() {
  const { id } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) fetchAnalysis();
  }, [id]);

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

  const tabs = ["overview", "red flags", "clauses", "missing", "ask AI"];

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-indigo-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-slate-400">Loading analysis...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-indigo-400 font-bold text-xl">⚖️ LexAI</Link>
        <Link href="/dashboard" className="text-slate-400 text-sm hover:text-white transition">
          ← Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">{contract?.name}</h1>
          <p className="text-slate-400 text-sm">AI analysis complete</p>
        </div>

        {/* Risk Score */}
        {analysis && (
          <div className="mb-6">
            <RiskScore score={analysis.risk_score} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition capitalize ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {analysis && (
          <div>
            {activeTab === "overview" && (
              <ContractSummary summary={analysis.summary} />
            )}
            {activeTab === "red flags" && (
              <RedFlagList flags={analysis.red_flags} />
            )}
            {activeTab === "clauses" && (
              <div className="space-y-3">
                {analysis.clauses?.map((clause, i) => (
                  <ClauseCard key={i} clause={clause} />
                ))}
              </div>
            )}
            {activeTab === "missing" && (
              <MissingClauses clauses={analysis.missing_clauses} />
            )}
            {activeTab === "ask AI" && (
              <AskContract contractId={id as string} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
"use client";
import { useState } from "react";

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
      if (!res.ok) {
        setError(data.error || "Failed to get answer.");
        return;
      }
      setAnswer(data.answer);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="e.g. What are the payment terms? Can I terminate early?"
          className="flex-1 bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          onClick={handleAsk}
          disabled={loading || question.trim().length < 5}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition"
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {answer && (
        <div className="bg-slate-900 border border-slate-600 rounded-xl p-4">
          <p className="text-slate-300 text-sm leading-relaxed">{answer}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {[
          "What are the payment terms?",
          "Can I terminate this contract?",
          "Who owns the intellectual property?",
          "What happens if there is a dispute?",
        ].map((q) => (
          <button
            key={q}
            onClick={() => setQuestion(q)}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-full transition"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
"use client";

export default function ContractSummary({ summary }: { summary: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <p className="text-slate-300 text-sm leading-relaxed">{summary}</p>
    </div>
  );
}
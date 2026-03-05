"use client";

export default function MissingClauses({ clauses }: { clauses: string[] }) {
  if (!clauses || clauses.length === 0) {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded-2xl p-6 text-center">
        <p className="text-green-400 font-semibold">✅ All standard clauses present</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <p className="text-slate-400 text-sm mb-4">
        These standard clauses are missing from your contract:
      </p>
      <div className="flex flex-wrap gap-2">
        {clauses.map((clause, i) => (
          <span
            key={i}
            className="bg-orange-900/30 border border-orange-700 text-orange-300 text-xs px-3 py-1.5 rounded-full"
          >
            ⚠️ {clause}
          </span>
        ))}
      </div>
    </div>
  );
}
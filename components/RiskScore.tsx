"use client";

export default function RiskScore({ score }: { score: number }) {
  const getColor = () => {
    if (score <= 3) return { bar: "bg-green-500", text: "text-green-400", label: "Low Risk" };
    if (score <= 6) return { bar: "bg-yellow-500", text: "text-yellow-400", label: "Medium Risk" };
    return { bar: "bg-red-500", text: "text-red-400", label: "High Risk" };
  };

  const { bar, text, label } = getColor();

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-slate-400 text-sm font-medium mb-3">Overall Risk Score</h3>
      <div className="flex items-end gap-3 mb-4">
        <span className={`text-5xl font-bold ${text}`}>{score}</span>
        <span className="text-slate-500 text-lg mb-1">/10</span>
        <span className={`text-sm font-semibold ${text} mb-1`}>{label}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3">
        <div
          className={`${bar} h-3 rounded-full transition-all duration-700`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}
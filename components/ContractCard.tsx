"use client";
import { useRouter } from "next/navigation";
import { Contract } from "@/types/contract";

const riskColor = (score: number) => {
  if (score <= 3) return "text-green-400";
  if (score <= 6) return "text-yellow-400";
  return "text-red-400";
};

const statusStyles: Record<string, string> = {
  done: "bg-green-900/30 text-green-400 border-green-700",
  analyzing: "bg-indigo-900/30 text-indigo-400 border-indigo-700",
  pending: "bg-slate-700 text-slate-400 border-slate-600",
  error: "bg-red-900/30 text-red-400 border-red-700",
};

export default function ContractCard({
  contract,
  onDelete,
}: {
  contract: Contract;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 hover:border-indigo-600 transition flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-semibold text-sm leading-snug truncate">{contract.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${statusStyles[contract.status]}`}>
          {contract.status}
        </span>
      </div>

      {contract.status === "done" && (
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs">Risk Score:</span>
          <span className={`font-bold text-sm ${riskColor(contract.risk_score)}`}>
            {contract.risk_score}/10
          </span>
        </div>
      )}

      <p className="text-slate-500 text-xs">
        {new Date(contract.created_at).toLocaleDateString("en-US", {
          year: "numeric", month: "short", day: "numeric",
        })}
      </p>

      <div className="flex gap-2 mt-1">
        {contract.status === "done" && (
          <button
            onClick={() => router.push(`/analyze/${contract.id}`)}
            className="flex-1 px-3 py-2 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
          >
            View Analysis
          </button>
        )}
        <button
          onClick={() => onDelete(contract.id)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-600 text-slate-400 hover:bg-red-900/30 hover:border-red-700 hover:text-red-400 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
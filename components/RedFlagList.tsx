"use client";
import { RedFlag } from "@/types/contract";

const severityStyles = {
  high: "bg-red-900/30 border-red-700 text-red-400",
  medium: "bg-yellow-900/30 border-yellow-700 text-yellow-400",
  low: "bg-blue-900/30 border-blue-700 text-blue-400",
};

export default function RedFlagList({ flags }: { flags: RedFlag[] }) {
  if (!flags || flags.length === 0) {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded-2xl p-6 text-center">
        <p className="text-green-400 font-semibold">✅ No major red flags detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {flags.map((flag, i) => (
        <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-white font-semibold">🚨 {flag.title}</h4>
            <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${severityStyles[flag.severity]}`}>
              {flag.severity}
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-3">{flag.description}</p>
          {flag.quote && (
            <blockquote className="border-l-2 border-red-600 pl-3 text-slate-500 text-xs italic">
              &ldquo;{flag.quote}&rdquo;
            </blockquote>
          )}
        </div>
      ))}
    </div>
  );
}
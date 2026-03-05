"use client";
import { useState } from "react";
import { Clause } from "@/types/contract";

const riskStyles = {
  high: "text-red-400 border-red-700",
  medium: "text-yellow-400 border-yellow-700",
  low: "text-green-400 border-green-700",
};

export default function ClauseCard({ clause }: { clause: Clause }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs border px-2 py-1 rounded-full ${riskStyles[clause.risk]}`}>
            {clause.risk}
          </span>
          <h4 className="text-white font-semibold text-sm">{clause.title}</h4>
        </div>
        <span className="text-slate-500 text-sm">{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <div className="mt-4 space-y-3">
          <p className="text-slate-400 text-sm">{clause.explanation}</p>
          <blockquote className="border-l-2 border-indigo-600 pl-3 text-slate-500 text-xs italic">
            {clause.content}
          </blockquote>
        </div>
      )}
    </div>
  );
}
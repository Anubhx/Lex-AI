"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import ContractCard from "@/components/ContractCard";
import UploadZone from "@/components/UploadZone";
import { Contract } from "@/types/contract";

export default function DashboardPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchContracts(); }, []);

  const fetchContracts = async () => {
    try {
      const res = await fetch("/api/contracts/list");
      const data = await res.json();
      setContracts(data.contracts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contract?")) return;
    await fetch(`/api/contracts/${id}`, { method: "DELETE" });
    setContracts(contracts.filter((c) => c.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-indigo-400 font-bold text-xl">⚖️ LexAI</Link>
        <UserButton />
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">My Contracts</h1>
          <p className="text-slate-400 text-sm mt-1">Upload a contract to get instant AI risk analysis.</p>
        </div>

        <div className="mb-10">
          <UploadZone />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-2xl">
            <p className="text-4xl mb-4">📄</p>
            <p className="text-slate-400">No contracts yet. Upload your first one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
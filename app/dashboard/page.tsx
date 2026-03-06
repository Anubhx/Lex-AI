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
    <main className="min-h-screen dot-grid" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ borderBottom: "1px solid var(--border)", padding: "0 2rem" }} className="flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
          <span style={{ fontWeight: 700, letterSpacing: "-0.02em", fontSize: "1rem", color: "var(--text)" }}>LexAI</span>
        </Link>
        <div className="flex items-center gap-4">
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Dashboard</span>
          <UserButton />
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "0.3rem" }}>
            My Contracts
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Upload a contract to get instant AI risk analysis</p>
        </div>

        <div style={{ marginBottom: "3rem" }}>
          <UploadZone />
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass" style={{ height: "140px", borderRadius: "14px", animation: "pulse 2s infinite" }} />
            ))}
          </div>
        ) : contracts.length === 0 ? (
          <div className="glass" style={{
            borderRadius: "16px", padding: "4rem 2rem",
            textAlign: "center", borderStyle: "dashed"
          }}>
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>📄</p>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No contracts yet. Upload your first one above.</p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "1rem", letterSpacing: "0.05em" }}>
              {contracts.length} CONTRACT{contracts.length !== 1 ? "S" : ""}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {contracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
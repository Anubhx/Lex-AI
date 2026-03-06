"use client";
import { useAuth } from "@clerk/nextjs";
import { SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import UploadZone from "@/components/UploadZone";

export default function HomePage() {
  const { isSignedIn } = useAuth();

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Geist', sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "56px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(8,12,14,0.9)",
        backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
          <span style={{ fontWeight: 700, letterSpacing: "-0.02em", fontSize: "1rem" }}>LexAI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button style={{ fontSize: "0.8rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}>
                  Sign in
                </button>
              </SignInButton>
              <Link href="/sign-up" style={{
                fontSize: "0.8rem", fontWeight: 600,
                background: "var(--green)", color: "#000",
                padding: "0.4rem 1rem", borderRadius: "6px",
                textDecoration: "none"
              }}>
                Get started
              </Link>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link href="/dashboard" style={{ fontSize: "0.8rem", color: "var(--muted)", textDecoration: "none" }}>
                Dashboard
              </Link>
              <UserButton />
            </div>
          )}
        </div>
      </nav>

      {/* Dot grid bg */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(16,185,129,0.08) 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      {/* Hero */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "8rem 2rem 4rem",
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          border: "1px solid var(--green-border)", borderRadius: "100px",
          padding: "0.3rem 0.9rem", marginBottom: "2rem",
          background: "var(--green-glow)", fontSize: "0.7rem",
          color: "var(--green)", fontWeight: 500, letterSpacing: "0.05em"
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
          POWERED BY GEMINI AI + RAG
        </div>

        <h1 style={{
          fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
          fontWeight: 800, letterSpacing: "-0.04em",
          lineHeight: 1.05, maxWidth: "820px", marginBottom: "1.5rem",
          textShadow: "0 0 80px rgba(16,185,129,0.2)"
        }}>
          Know What You&apos;re<br />
          <span style={{ color: "var(--green)" }}>Signing Before</span> You Sign
        </h1>

        <p style={{
          color: "var(--muted)", fontSize: "1.05rem",
          maxWidth: "480px", lineHeight: 1.7, marginBottom: "3rem"
        }}>
          Upload any legal contract and get instant AI-powered risk analysis.
          Spot red flags, missing clauses, and risky terms in 60 seconds.
        </p>

        <div style={{ width: "100%", maxWidth: "560px" }}>
          {isSignedIn ? (
            <UploadZone />
          ) : (
            <div style={{
              border: "1px dashed var(--green-border)",
              borderRadius: "16px", padding: "3rem 2rem",
              background: "var(--green-glow)",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "1rem"
            }}>
              <div style={{ fontSize: "2rem" }}>⚖️</div>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Sign up to start analyzing contracts</p>
              <Link href="/sign-up" style={{
                background: "var(--green)", color: "#000",
                padding: "0.7rem 2rem", borderRadius: "8px",
                fontWeight: 700, fontSize: "0.9rem", textDecoration: "none"
              }}>
                Analyze My Contract Free →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section style={{ position: "relative", zIndex: 1, padding: "0 2rem 5rem" }}>
        <div style={{
          maxWidth: "700px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px", border: "1px solid var(--border)",
          borderRadius: "16px", overflow: "hidden"
        }}>
          {[
            { value: "60s", label: "Average analysis time" },
            { value: "18", label: "Clause types checked" },
            { value: "100%", label: "Free to start" },
          ].map((s) => (
            <div key={s.label} style={{
              padding: "2rem", textAlign: "center",
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(12px)"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--green)", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.3rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: "relative", zIndex: 1, padding: "0 2rem 6rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.8rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "3rem" }}>
          Everything you need to review a contract
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          {[
            { icon: "🚨", title: "Red Flag Detection", desc: "Uncapped liability, auto-renewals, one-sided termination — AI catches what lawyers charge $500/hr to find." },
            { icon: "📋", title: "Missing Clause Check", desc: "Automatically checks 18 standard clauses and flags every gap before it becomes a legal problem." },
            { icon: "💬", title: "Ask Anything", desc: "Ask any question in plain English. Get cited answers pulled directly from your contract." },
          ].map((f) => (
            <div key={f.title} style={{
              borderRadius: "14px", padding: "1.8rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(12px)",
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--green-border)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{f.icon}</div>
              <h3 style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.6rem" }}>{f.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid var(--border)", padding: "1.5rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>LexAI</span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>© 2026 · Built with Gemini AI</span>
      </footer>
    </main>
  );
}
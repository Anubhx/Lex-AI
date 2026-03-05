"use client";
import { useAuth } from "@clerk/nextjs";
import { SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  const { isSignedIn } = useAuth();

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <span className="text-indigo-400 font-bold text-xl">⚖️ LexAI</span>
        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition">
                  Sign In
                </button>
              </SignInButton>
              <Link href="/sign-up" className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition">
                Get Started Free
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition">
                Dashboard
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-indigo-900/40 border border-indigo-700 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          Powered by Gemini AI + RAG
        </div>
        <h1 className="text-5xl font-bold text-white leading-tight mb-6">
          Understand Any Contract
          <span className="text-indigo-400"> In 60 Seconds</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          Upload any legal contract and get instant AI-powered risk analysis.
          Spot red flags, missing clauses, and risky terms before you sign.
        </p>
        <div className="flex items-center justify-center gap-4">
          {!isSignedIn ? (
            <Link href="/sign-up" className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition">
              ⚖️ Analyze My Contract Free
            </Link>
          ) : (
            <Link href="/dashboard" className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition">
              ⚖️ Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: "🚨", title: "Red Flag Detection", desc: "AI identifies risky clauses — uncapped liability, auto-renewals, one-sided termination rights and more." },
          { icon: "📋", title: "Missing Clause Check", desc: "Automatically checks for 18 standard clauses every contract should have and flags what's missing." },
          { icon: "💬", title: "Ask Anything", desc: "Ask any question about your contract in plain English and get cited answers instantly." },
        ].map((f) => (
          <div key={f.title} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-white font-semibold mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-slate-600 text-xs">
        Built with Gemini AI · © 2026 LexAI
      </footer>
    </main>
  );
}
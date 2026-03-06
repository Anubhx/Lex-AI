# ⚖️ LexAI — AI-Powered Legal Contract Analyzer

> Upload any legal contract. Get instant AI risk analysis in 60 seconds.

**🔗 Live Demo:** [lexaiapp.vercel.app](https://lexaiapp.vercel.app) &nbsp;|&nbsp; **📦 Stack:** Next.js 16 · Gemini AI · RAG · Supabase pgvector · Clerk · Vercel

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=nextdotjs&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat&logo=google&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat&logo=clerk&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

---

## What It Does

LexAI is a production-grade AI application that analyzes legal contracts using Retrieval-Augmented Generation (RAG). It gives anyone — lawyers, founders, freelancers — the ability to understand what they're signing before they sign it.

**A junior lawyer reviewing a contract manually takes 2–4 hours and costs $400–$800. LexAI does it in 60 seconds at zero cost.**

---

## Core Features

### 🚨 Red Flag Detection
AI identifies 14 categories of legal risk including uncapped liability, auto-renewal traps, one-sided termination rights, broad IP assignment, and non-compete overreach — with exact contract quotes and negotiation recommendations.

### 📋 Missing Clause Check
Checks every contract against an 18-item standard clause checklist. Returns only what's genuinely missing, avoiding noise.

### 💬 RAG-Powered Q&A
Ask any question about your contract in plain English. Answers are grounded in the actual contract text using vector similarity search — no hallucination.

### 📊 Risk Scoring
Every contract receives a 1–10 risk score with an animated visual meter, severity classification, and color-coded breakdown.

### 🔐 Auth & Persistence
Full authentication with Clerk (Google OAuth + email). All analyses saved to your account — revisit, view, and delete anytime from the dashboard.

---

## Tech Stack

| Layer | Technology | Cost | Why |
|-------|-----------|------|-----|
| Framework | Next.js 16 (App Router) | Free | Full-stack React, API routes, server components |
| AI Model | Gemini 2.5 Flash | Free tier | Best free model for long-context document analysis |
| Embeddings | Gemini Embedding 001 | Free tier | 768-dim vectors, Supabase compatible |
| Vector DB | Supabase pgvector | Free tier | PostgreSQL + vectors in one service |
| Auth | Clerk | Free tier | Production auth with Google OAuth in minutes |
| Database | Supabase PostgreSQL | Free tier | Same instance as vector DB |
| PDF Parsing | unpdf | Free | Node.js native, no canvas dependencies |
| Styling | Tailwind + CSS Variables | Free | Custom design system with glass morphism |
| Hosting | Vercel | Free tier | Zero-config Next.js CI/CD |

**Total infrastructure cost: $0/month**

---

## System Architecture

### RAG Pipeline

```
PDF Upload → Parse text → Chunk (500 tokens, 50 overlap)
         → Embed (Gemini Embedding 001, 768 dims)
         → Store in Supabase pgvector (HNSW index)

User Question → Embed question
             → Cosine similarity search (top 5 chunks)
             → Inject chunks into prompt
             → Gemini generates cited answer
```

### Analysis Pipeline

```
POST /api/upload  →  Parse PDF (unpdf)
                 →  Chunk text
                 →  Generate + store embeddings

POST /api/analyze →  analyzeContractPrompt(text)
                 →  Gemini 2.5 Flash
                 →  Parse structured JSON
                 →  Store in Supabase analyses table
                 →  Update contract status → redirect
```

### Database Schema

```sql
contracts (id, user_id, name, status, risk_score, created_at)
analyses  (id, contract_id, summary, risk_score, red_flags jsonb,
           missing_clauses jsonb, clauses jsonb)
contract_chunks (id, contract_id, content, embedding vector(768), chunk_index)
```

---

## Prompt Engineering System

The `/prompts/` directory is the intellectual core of this project. Five specialized prompts engineered for consistent, structured, actionable output:

| Prompt | Purpose |
|--------|---------|
| `analyzeContract.ts` | Master analysis — risk score, summary, full breakdown |
| `detectRisks.ts` | 14-category red flag detection with exact quotes |
| `extractClauses.ts` | Clause identification, categorization, risk rating |
| `findMissing.ts` | 18-item standard clause checklist comparison |
| `answerQuestion.ts` | RAG Q&A with citation enforcement, hallucination prevention |

**Key principles:**
- Critical rules placed at the TOP of every prompt
- Explicit negative constraints prevent hallucination
- Structured JSON output enforced with exact schema
- Defense-in-depth: prompt instructions + post-processing cleanup
- Role prompting: every prompt begins with expert persona assignment

---

## Project Structure

```
lex-ai/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── dashboard/page.tsx          # User contract dashboard
│   ├── analyze/[id]/page.tsx       # Full analysis view
│   ├── sign-in/ & sign-up/         # Clerk auth pages
│   └── api/
│       ├── upload/route.ts         # PDF parse + chunk + embed
│       ├── analyze/route.ts        # AI full analysis
│       ├── ask/route.ts            # RAG Q&A
│       └── contracts/              # CRUD endpoints
├── components/
│   ├── UploadZone.tsx              # Drag-and-drop PDF upload
│   ├── RiskScore.tsx               # Animated segmented risk meter
│   ├── RedFlagList.tsx             # Severity-coded flag cards
│   ├── ClauseCard.tsx              # Expandable clause breakdown
│   ├── MissingClauses.tsx          # Missing clause badges
│   ├── ContractSummary.tsx         # Plain English summary
│   ├── AskContract.tsx             # RAG Q&A interface
│   └── ContractCard.tsx            # Dashboard contract card
├── prompts/                        # Prompt engineering files
│   ├── analyzeContract.ts
│   ├── detectRisks.ts
│   ├── extractClauses.ts
│   ├── findMissing.ts
│   └── answerQuestion.ts
├── lib/
│   ├── geminiClient.ts             # Gemini AI setup
│   ├── supabaseClient.ts           # Supabase client + admin
│   ├── pdfParser.ts                # PDF text extraction
│   ├── chunker.ts                  # Text chunking (500 tokens, 50 overlap)
│   └── embeddings.ts               # Create + store + search vectors
└── types/contract.ts               # TypeScript interfaces
```

---

## Local Setup

### Prerequisites
- Node.js 20+
- Gemini API key — [aistudio.google.com](https://aistudio.google.com)
- Supabase project — [supabase.com](https://supabase.com)
- Clerk application — [clerk.com](https://clerk.com)

### Installation

```bash
git clone https://github.com/Anubhx/Lex-AI.git
cd Lex-AI/lex-ai
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Database Setup

Run in Supabase SQL Editor:

```sql
create extension if not exists vector;

create table contracts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  file_url text,
  status text default 'pending',
  risk_score int default 0,
  created_at timestamp default now()
);

create table analyses (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references contracts(id) on delete cascade,
  summary text,
  risk_score int,
  red_flags jsonb,
  missing_clauses jsonb,
  clauses jsonb,
  created_at timestamp default now()
);

create table contract_chunks (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references contracts(id) on delete cascade,
  content text,
  embedding vector(768),
  chunk_index int
);

create index on contract_chunks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create or replace function match_chunks(
  query_embedding vector(768),
  match_contract_id uuid,
  match_count int
)
returns table (id uuid, content text, similarity float)
language sql stable as $$
  select contract_chunks.id, contract_chunks.content,
    1 - (contract_chunks.embedding <=> query_embedding) as similarity
  from contract_chunks
  where contract_chunks.contract_id = match_contract_id
  order by contract_chunks.embedding <=> query_embedding
  limit match_count;
$$;
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

Deployed on Vercel with automatic CI/CD from GitHub.

1. Connect repo to [vercel.com](https://vercel.com)
2. Set Root Directory: `lex-ai`
3. Add all environment variables in Vercel dashboard
4. Deploy — auto-deploys on every `git push`

---

## Skills Demonstrated

| Area | Details |
|------|---------|
| **Prompt Engineering** | 5 specialized prompts with role prompting, chain-of-thought, output constraints, and hallucination prevention |
| **RAG System Design** | Full ingestion + retrieval pipeline: chunk → embed → store → similarity search → grounded generation |
| **Vector Database** | Supabase pgvector with HNSW indexing, custom SQL match function, cosine similarity |
| **Full-Stack Dev** | Next.js 16 App Router, TypeScript, API routes, protected middleware |
| **AI Integration** | Gemini 2.5 Flash + Gemini Embedding 001, structured output enforcement |
| **Authentication** | Clerk with Google OAuth, user-scoped data access |
| **Database Design** | PostgreSQL relational schema, JSONB for flexible analysis storage |
| **UI/UX Design** | Custom design system, glass morphism, emerald theme, responsive layout |
| **DevOps** | Git, Vercel CI/CD, multi-environment configuration |

---

## Roadmap

- [ ] Stripe payments — Pro plan with higher limits
- [ ] Team workspaces — share contracts across org
- [ ] Contract comparison — diff two versions
- [ ] Export analysis as PDF report
- [ ] Clause suggestion engine — AI drafts missing clauses
- [ ] Jurisdiction-aware analysis — risk based on governing law
- [ ] API access — integrate into law firm workflows

---

## Author

Built by **Anubhav** — Prompt Engineer & Full-Stack Developer

- 🔗 Live: [lexaiapp.vercel.app](https://lexaiapp.vercel.app)
- 📦 GitHub: [github.com/Anubhx](https://github.com/Anubhx)
- 🤖 Also built: [ResumeAI](https://github.com/Anubhx/AI-Resume-Builder) — AI-powered ATS resume builder

---

*Built with Gemini AI · Supabase · Clerk · Next.js · Vercel*
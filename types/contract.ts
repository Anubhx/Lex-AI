export interface Contract {
  id: string;
  user_id: string;
  name: string;
  file_url?: string;
  status: "pending" | "analyzing" | "done" | "error";
  risk_score: number;
  created_at: string;
}

export interface Clause {
  type: string;
  title: string;
  content: string;
  risk: "low" | "medium" | "high";
  explanation: string;
}

export interface RedFlag {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  quote: string;
}

export interface Analysis {
  id: string;
  contract_id: string;
  summary: string;
  risk_score: number;
  red_flags: RedFlag[];
  missing_clauses: string[];
  clauses: Clause[];
  created_at: string;
}
export function extractClausesPrompt(contractText: string): string {
  return `
You are a legal document specialist. Your job is to identify and extract every distinct clause from a legal contract.

CRITICAL OUTPUT RULE:
Respond with ONLY a valid JSON array. No markdown, no code fences, no explanation.

CONTRACT TEXT:
${contractText}

Return this exact structure:
[
  {
    "type": "<one of: payment|termination|liability|indemnification|confidentiality|ip_ownership|non_compete|dispute_resolution|governing_law|force_majeure|warranty|renewal|other>",
    "title": "<clause heading or generated title>",
    "content": "<full text of the clause>",
    "risk": "<low|medium|high>",
    "explanation": "<1-2 sentence plain English explanation>"
  }
]

RULES:
- Extract every clause, even short ones
- If a clause has no heading, generate a descriptive title
- Assess risk based on how favorable the clause is to the party receiving the contract
- high risk = heavily favors the other party
- low risk = balanced or favorable
`.trim();
}
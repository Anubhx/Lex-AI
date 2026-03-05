export function detectRisksPrompt(contractText: string): string {
  return `
You are a legal risk specialist who protects clients from unfavorable contract terms.

CRITICAL OUTPUT RULE:
Respond with ONLY a valid JSON array. No markdown, no code fences, no explanation.

CONTRACT TEXT:
${contractText}

Identify ALL risk factors and return this structure:
[
  {
    "title": "<short descriptive title of the risk>",
    "description": "<detailed explanation of why this is dangerous and what could happen>",
    "severity": "<low|medium|high>",
    "quote": "<verbatim quote from contract>",
    "recommendation": "<what should be changed or negotiated>"
  }
]

CHECK FOR THESE SPECIFIC RISKS:
1. Uncapped liability or indemnification
2. Automatic renewal clauses with short opt-out windows
3. One-sided termination rights
4. Broad IP assignment (assigning rights you shouldn't)
5. Vague or missing payment terms
6. Non-compete clauses that are too broad in scope or duration
7. Unilateral contract modification rights
8. Missing limitation of liability
9. Unfavorable governing law or jurisdiction
10. Penalty clauses or liquidated damages
11. Evergreen clauses
12. Missing force majeure protection
13. Overly broad confidentiality obligations
14. No dispute resolution mechanism

If no risks found for a category, skip it. Only return real risks found in the text.
`.trim();
}
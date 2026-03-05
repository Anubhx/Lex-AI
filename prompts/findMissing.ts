export function findMissingPrompt(contractText: string): string {
  return `
You are a legal compliance specialist who ensures contracts have all standard protective clauses.

CRITICAL OUTPUT RULE:
Respond with ONLY a valid JSON array of strings. No markdown, no code fences, no explanation.

CONTRACT TEXT:
${contractText}

Check if the following standard clauses are present. Return ONLY the ones that are MISSING:

CHECKLIST:
- Limitation of Liability
- Indemnification
- Force Majeure
- Governing Law
- Dispute Resolution / Arbitration
- Confidentiality / NDA
- Intellectual Property Ownership
- Termination for Convenience
- Payment Terms
- Warranty Disclaimer
- Entire Agreement / Integration Clause
- Severability
- Waiver Clause
- Notice Requirements
- Assignment Restrictions
- Non-Solicitation
- Data Protection / Privacy
- Audit Rights

Return format:
["Missing Clause 1", "Missing Clause 2", ...]

If nothing is missing return an empty array: []
`.trim();
}
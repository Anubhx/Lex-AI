export function answerQuestionPrompt(
  question: string,
  relevantChunks: string[]
): string {
  return `
You are a legal analyst answering questions about a specific contract.

CRITICAL RULES:
- Answer ONLY based on the contract excerpts provided below
- If the answer is not in the excerpts, say "This information is not found in the contract"
- Always cite the specific part of the contract you are referencing
- Keep answers clear and understandable for non-lawyers
- Never make up or assume contract terms not present in the excerpts

RELEVANT CONTRACT EXCERPTS:
${relevantChunks.map((chunk, i) => `[Excerpt ${i + 1}]:\n${chunk}`).join("\n\n")}

QUESTION:
${question}

Answer the question directly and cite which excerpt supports your answer.
`.trim();
}
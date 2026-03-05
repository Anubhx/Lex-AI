import { embeddingModel } from "./geminiClient";
import { supabaseAdmin } from "./supabaseClient";

export async function createEmbedding(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

export async function storeChunks(
  contractId: string,
  chunks: string[]
): Promise<void> {
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await createEmbedding(chunks[i]);
    await supabaseAdmin.from("contract_chunks").insert({
      contract_id: contractId,
      content: chunks[i],
      embedding,
      chunk_index: i,
    });
  }
}

export async function searchSimilarChunks(
  contractId: string,
  query: string,
  limit = 5
): Promise<string[]> {
  const queryEmbedding = await createEmbedding(query);

  const { data, error } = await supabaseAdmin.rpc("match_chunks", {
    query_embedding: queryEmbedding,
    match_contract_id: contractId,
    match_count: limit,
  });

  if (error) throw error;
  return (data || []).map((d: { content: string }) => d.content);
}
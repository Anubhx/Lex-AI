import { embeddingModel } from "./geminiClient";
import { supabaseAdmin } from "./supabaseClient";
import { TaskType } from "@google/generative-ai";

export async function createEmbedding(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }], role: "user" },
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });
  return result.embedding.values.slice(0, 768);
}

export async function storeChunks(
  contractId: string,
  chunks: string[]
): Promise<void> {
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await createEmbedding(chunks[i]);
    console.log(`Storing chunk ${i + 1}/${chunks.length}, embedding length: ${embedding.length}`);

    const { error } = await supabaseAdmin.from("contract_chunks").insert({
      contract_id: contractId,
      content: chunks[i],
      embedding,
      chunk_index: i,
    });

    if (error) {
      console.error(`Failed to store chunk ${i}:`, JSON.stringify(error));
    }
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
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { geminiModel } from "@/lib/geminiClient";
import { searchSimilarChunks } from "@/lib/embeddings";
import { answerQuestionPrompt } from "@/prompts/answerQuestion";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contractId, question } = await req.json();

    if (!contractId || !question) {
      return NextResponse.json({ error: "Contract ID and question are required" }, { status: 400 });
    }

    if (question.trim().length < 5) {
      return NextResponse.json({ error: "Question is too short" }, { status: 400 });
    }

    // Verify contract belongs to user
    const { data: contract } = await supabaseAdmin
      .from("contracts")
      .select("id")
      .eq("id", contractId)
      .eq("user_id", userId)
      .single();

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    // RAG — find relevant chunks
    const relevantChunks = await searchSimilarChunks(contractId, question, 5);

    if (relevantChunks.length === 0) {
      return NextResponse.json({
        answer: "Could not find relevant sections in the contract for your question.",
      });
    }

    // Generate answer
    const prompt = answerQuestionPrompt(question, relevantChunks);
    const result = await geminiModel.generateContent(prompt);
    const answer = result.response.text().trim();

    return NextResponse.json({ answer, sources: relevantChunks.length });

  } catch (error) {
    console.error("Ask error:", error);
    return NextResponse.json({ error: "Failed to answer question." }, { status: 500 });
  }
}
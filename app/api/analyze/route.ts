import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { geminiModel } from "@/lib/geminiClient";
import { analyzeContractPrompt } from "@/prompts/analyzeContract";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contractId } = await req.json();
    if (!contractId) {
      return NextResponse.json({ error: "Contract ID required" }, { status: 400 });
    }

    // Get contract
    const { data: contract, error: fetchError } = await supabaseAdmin
      .from("contracts")
      .select("*")
      .eq("id", contractId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    const contractText = contract.file_url;
    if (!contractText) {
      return NextResponse.json({ error: "Contract text not found" }, { status: 400 });
    }

    // Run AI analysis
    const prompt = analyzeContractPrompt(contractText);
    const result = await geminiModel.generateContent(prompt);
    const rawText = result.response.text()
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let analysis;
    try {
      analysis = JSON.parse(rawText);
    } catch {
      console.error("Failed to parse AI response:", rawText);
      return NextResponse.json({ error: "AI returned invalid response. Please try again." }, { status: 500 });
    }

    // Save analysis
    const { data: savedAnalysis, error: saveError } = await supabaseAdmin
      .from("analyses")
      .insert({
        contract_id: contractId,
        summary: analysis.summary,
        risk_score: analysis.risk_score,
        red_flags: analysis.red_flags,
        missing_clauses: analysis.missing_clauses,
        clauses: analysis.clauses,
      })
      .select()
      .single();

    if (saveError) throw saveError;

    // Update contract status
    await supabaseAdmin
      .from("contracts")
      .update({ status: "done", risk_score: analysis.risk_score })
      .eq("id", contractId);

    return NextResponse.json({ analysis: savedAnalysis });

  } catch (error) {
    console.error("Analyze error:", error);
    await supabaseAdmin
      .from("contracts")
      .update({ status: "error" })
      .eq("id", error as string);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
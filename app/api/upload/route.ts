import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { parsePDF } from "@/lib/pdfParser";
import { chunkText } from "@/lib/chunker";
import { storeChunks } from "@/lib/embeddings";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    // Parse PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parsePDF(buffer);

    if (!text || text.trim().length < 100) {
      return NextResponse.json({ error: "Could not extract text from PDF." }, { status: 400 });
    }

    // Save contract record
    const { data: contract, error: contractError } = await supabaseAdmin
      .from("contracts")
      .insert({
        user_id: userId,
        name: file.name.replace(".pdf", ""),
        status: "analyzing",
      })
      .select()
      .single();

    if (contractError) throw contractError;

    // Chunk and embed in background
    const chunks = chunkText(text);
    await storeChunks(contract.id, chunks);

    // Store full text temporarily for analysis
    await supabaseAdmin
      .from("contracts")
      .update({ file_url: text.slice(0, 50000) })
      .eq("id", contract.id);

    return NextResponse.json({
      contractId: contract.id,
      name: contract.name,
      chunks: chunks.length,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { storeChunks } from "@/lib/embeddings";
import { chunkText } from "@/lib/chunker";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contractId, text } = await req.json();
    if (!contractId || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const chunks = chunkText(text);
    await storeChunks(contractId, chunks);

    return NextResponse.json({ success: true, chunks: chunks.length });
  } catch (error) {
    console.error("Embed error:", error);
    return NextResponse.json({ error: "Failed to create embeddings" }, { status: 500 });
  }
}
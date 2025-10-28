import { NextResponse } from "next/server";
import { parseSrt, buildSrt } from "@/lib/parseSrt";
import { syncSubtitles } from "@/lib/syncAlgorithm";
import { SrtSubtitle } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const referenceSrtFile = formData.get("referenceSrt") as File | null;
    const targetSrtFile = formData.get("targetSrt") as File | null;

    if (!referenceSrtFile || !targetSrtFile) {
      return new NextResponse("Missing SRT files", { status: 400 });
    }

    const referenceText = await referenceSrtFile.text();
    const targetText = await targetSrtFile.text();

    const refSubs: SrtSubtitle[] = parseSrt(referenceText);
    const targetSubs: SrtSubtitle[] = parseSrt(targetText);

    if (!Array.isArray(refSubs) || !Array.isArray(targetSubs)) {
      console.error("SRT parsing failed", { refSubs, targetSubs });
      return new NextResponse("Failed to parse SRT files", { status: 500 });
    }

    const syncedSubs = syncSubtitles(refSubs, targetSubs);
    const fixedSrt = buildSrt(syncedSubs);

    return new Response(fixedSrt, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error in sync route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

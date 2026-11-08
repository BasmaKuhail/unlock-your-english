import { NextResponse } from "next/server";
import { completeSection, LearnerAccessError } from "@/lib/learner/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || ![body.levelId, body.sectionId].every((id) => typeof id === "string" && id.length > 0 && id.length <= 1500 && !id.includes("/"))) {
      return NextResponse.json({ error: "A valid level and section are required." }, { status: 400 });
    }
    await completeSection(request.headers.get("authorization"), body.levelId, body.sectionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof LearnerAccessError ? error.message : error instanceof SyntaxError ? "Invalid request." : "Unable to save your progress. Please try again." }, { status: error instanceof LearnerAccessError ? error.status : error instanceof SyntaxError ? 400 : 500 });
  }
}

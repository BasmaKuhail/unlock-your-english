import { NextResponse } from "next/server";
import { LearnerAccessError, loadDashboard } from "@/lib/learner/service";

export async function GET(request: Request) {
  try {
    return NextResponse.json(await loadDashboard(request.headers.get("authorization")), { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof LearnerAccessError ? error.message : "Unable to load your learning journey. Please try again." }, { status: error instanceof LearnerAccessError ? error.status : 500 });
  }
}

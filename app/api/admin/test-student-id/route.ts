import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { generateStudentId } from "@/lib/students/generate-student-id";

export async function POST() {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 401 },
    );
  }

  try {
    const studentId = await generateStudentId();

    return NextResponse.json({
      studentId,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to generate student ID." },
      { status: 500 },
    );
  }
}
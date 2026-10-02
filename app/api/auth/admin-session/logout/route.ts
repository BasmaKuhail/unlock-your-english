import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set("uye_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function DELETE() {
  const cookieStore = await cookies();

  cookieStore.delete("admin_session");

  return NextResponse.json({
    success: true,
  });
}
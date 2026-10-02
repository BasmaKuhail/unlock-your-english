import { NextResponse } from "next/server";

import { adminAuth } from "@/lib/firebase/admin";

const SESSION_DURATION = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (typeof idToken !== "string" || !idToken) {
      return NextResponse.json(
        { error: "ID token is required." },
        { status: 400 },
      );
    }

    console.log("Admin session: token received");

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    console.log("Admin session: token verified", {
      uid: decodedToken.uid,
      isAdmin: decodedToken.admin === true,
    });

    if (decodedToken.admin !== true) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 },
      );
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    });

    console.log("Admin session: session cookie created");

    const response = NextResponse.json({ success: true });

    response.cookies.set("uye_admin_session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION / 1000,
    });

    return response;
  } catch (error) {
    console.error("Failed to create admin session:", error);

    return NextResponse.json(
      { error: "Unable to create admin session." },
      { status: 500 },
    );
  }
}
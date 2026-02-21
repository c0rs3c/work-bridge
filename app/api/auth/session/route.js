import { NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase/admin";
import { getDb } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: "idToken is required." }, { status: 400 });
    }

    const decoded = await verifyIdToken(idToken);
    const db = await getDb();
    let user = await db.collection("users").findOne({ firebaseUid: decoded.uid });

    // Support seeded/mock users where firebaseUid may be a placeholder.
    if (!user && decoded.email) {
      user = await db.collection("users").findOne({ email: decoded.email.toLowerCase() });
      if (user) {
        await db.collection("users").updateOne(
          { _id: user._id },
          { $set: { firebaseUid: decoded.uid, updatedAt: new Date() } }
        );
        user = { ...user, firebaseUid: decoded.uid };
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User profile not found. Register first." }, { status: 404 });
    }

    const response = NextResponse.json({ ok: true, role: user.role });

    response.cookies.set("lc_session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    response.cookies.set("lc_role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message || "Session creation failed." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("lc_session", "", { path: "/", maxAge: 0 });
  response.cookies.set("lc_role", "", { path: "/", maxAge: 0 });
  return response;
}

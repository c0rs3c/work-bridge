import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const context = await getAuthContext(request);
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const userId = context.user._id.toString();
    let displayName = context.user.email;

    if (context.user.role === "executive") {
      const profile = await db.collection("executive_profiles").findOne({ userId });
      if (profile?.name) displayName = profile.name;
    } else if (context.user.role === "supplier") {
      const profile = await db.collection("supplier_profiles").findOne({ userId });
      if (profile?.agencyName) displayName = profile.agencyName;
    } else if (context.user.role === "demand") {
      const profile = await db.collection("demand_profiles").findOne({ userId });
      if (profile?.organizationName) displayName = profile.organizationName;
    }

    return NextResponse.json({
      user: {
        id: userId,
        email: context.user.email,
        role: context.user.role,
        status: context.user.status,
        displayName
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch user." }, { status: 500 });
  }
}

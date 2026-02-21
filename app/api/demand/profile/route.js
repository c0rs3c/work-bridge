import { NextResponse } from "next/server";
import { assertRole, getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["demand", "admin"]);

    const db = await getDb();
    const profile = await db.collection("demand_profiles").findOne({ userId: ctx.user._id.toString() });
    return NextResponse.json({ profile: profile || null });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to fetch demand profile." }, { status });
  }
}

export async function PATCH(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["demand", "admin"]);

    const body = await request.json();
    const db = await getDb();
    const now = new Date();

    await db.collection("demand_profiles").updateOne(
      { userId: ctx.user._id.toString() },
      {
        $set: {
          userId: ctx.user._id.toString(),
          organizationName: body.organizationName?.trim() || "",
          contactDetails: body.contactDetails?.trim() || "",
          defaultLocation: body.defaultLocation?.trim() || "",
          updatedAt: now
        },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to update demand profile." }, { status });
  }
}

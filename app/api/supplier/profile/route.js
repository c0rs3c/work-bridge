import { NextResponse } from "next/server";
import { assertRole, getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { validateSupplierProfile } from "@/lib/validators";

export async function GET(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["supplier", "admin"]);

    const db = await getDb();
    const profile = await db.collection("supplier_profiles").findOne({ userId: ctx.user._id.toString() });
    return NextResponse.json({ profile: profile || null });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to fetch supplier profile." }, { status });
  }
}

export async function PATCH(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["supplier", "admin"]);

    const body = await request.json();
    const validation = validateSupplierProfile(body);
    if (!validation.isValid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    const now = new Date();
    const db = await getDb();

    await db.collection("supplier_profiles").updateOne(
      { userId: ctx.user._id.toString() },
      {
        $set: {
          userId: ctx.user._id.toString(),
          agencyName: body.agencyName.trim(),
          mobileNumber: body.mobileNumber.trim(),
          landlineNumber: body.landlineNumber.trim(),
          teamSize: Number(body.teamSize),
          skill: body.skill.trim(),
          address: body.address.trim(),
          state: body.state.trim(),
          updatedAt: now
        },
        $setOnInsert: {
          isMockData: false,
          createdAt: now
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to update supplier profile." }, { status });
  }
}

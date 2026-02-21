import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { assertRole, getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["admin"]);

    const db = await getDb();
    const users = await db.collection("users").find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      users: users.map((u) => ({
        id: u._id.toString(),
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to list users." }, { status });
  }
}

export async function POST(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["admin"]);

    const { email, role } = await request.json();
    if (!email || !role) {
      return NextResponse.json({ error: "email and role are required." }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date();

    await db.collection("users").updateOne(
      { email: email.toLowerCase().trim() },
      {
        $set: {
          email: email.toLowerCase().trim(),
          role,
          status: "active",
          updatedAt: now
        },
        $setOnInsert: {
          firebaseUid: `pending:${email.toLowerCase().trim()}`,
          createdAt: now
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to manage user." }, { status });
  }
}

export async function PATCH(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["admin"]);

    const { userId, status } = await request.json();
    if (!userId || !["active", "inactive"].includes(status)) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to update user." }, { status });
  }
}

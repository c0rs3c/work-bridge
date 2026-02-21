import { NextResponse } from "next/server";
import { assertRole, getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { loadMockData } from "@/lib/mock-data";

export async function POST(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["admin"]);

    const { users, executive_profiles, supplier_profiles, demand_profiles, entries } = await loadMockData();
    const db = await getDb();

    if (!Array.isArray(users) || users.length < 102) {
      return NextResponse.json({ error: "Mock users are missing or incomplete." }, { status: 400 });
    }
    if (!Array.isArray(supplier_profiles) || supplier_profiles.length !== 50) {
      return NextResponse.json({ error: "Mock supplier profiles must be exactly 50." }, { status: 400 });
    }
    if (!Array.isArray(demand_profiles) || demand_profiles.length !== 50) {
      return NextResponse.json({ error: "Mock demand profiles must be exactly 50." }, { status: 400 });
    }
    if (!Array.isArray(executive_profiles) || executive_profiles.length !== 2) {
      return NextResponse.json({ error: "Mock executive profiles must be exactly 2." }, { status: 400 });
    }
    if (!Array.isArray(entries) || entries.length !== 60) {
      return NextResponse.json({ error: "Mock entries must be exactly 60 (30 per executive)." }, { status: 400 });
    }

    const now = new Date();
    // Clear previous mock records so seed stays idempotent.
    await Promise.all([
      db.collection("users").deleteMany({ isMockData: true }),
      db.collection("executive_profiles").deleteMany({ isMockData: true }),
      db.collection("supplier_profiles").deleteMany({ isMockData: true }),
      db.collection("demand_profiles").deleteMany({ isMockData: true }),
      db.collection("entries").deleteMany({ isMockData: true })
    ]);

    if (users.length) {
      await db.collection("users").insertMany(
        users.map((u) => ({ ...u, createdAt: new Date(u.createdAt || now), updatedAt: new Date(u.updatedAt || now) }))
      );
    }

    if (executive_profiles.length) {
      await db.collection("executive_profiles").insertMany(
        executive_profiles.map((e) => ({ ...e, createdAt: new Date(e.createdAt || now), updatedAt: new Date(e.updatedAt || now) }))
      );
    }

    if (supplier_profiles.length) {
      await db.collection("supplier_profiles").insertMany(
        supplier_profiles.map((s) => ({ ...s, createdAt: new Date(s.createdAt || now), updatedAt: new Date(s.updatedAt || now) }))
      );
    }

    if (demand_profiles.length) {
      await db.collection("demand_profiles").insertMany(
        demand_profiles.map((d) => ({ ...d, createdAt: new Date(d.createdAt || now), updatedAt: new Date(d.updatedAt || now) }))
      );
    }

    if (entries.length) {
      await db.collection("entries").insertMany(
        entries.map((e) => ({ ...e, createdAt: new Date(e.createdAt || now), updatedAt: new Date(e.updatedAt || now) }))
      );
    }

    await db.collection("audit_logs").insertOne({
      actorUserId: ctx.user._id.toString(),
      action: "seed_mock_data",
      entityType: "mock_data",
      entityId: "bulk",
      meta: {
        userCount: users.length,
        executiveProfileCount: executive_profiles.length,
        supplierProfileCount: supplier_profiles.length,
        demandProfileCount: demand_profiles.length,
        entryCount: entries.length
      },
      createdAt: now
    });

    return NextResponse.json({
      ok: true,
      userCount: users.length,
      executiveProfileCount: executive_profiles.length,
      supplierProfileCount: supplier_profiles.length,
      demandProfileCount: demand_profiles.length,
      entryCount: entries.length
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to seed mock data." }, { status });
  }
}

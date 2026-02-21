import { NextResponse } from "next/server";
import { assertRole, getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["admin"]);

    const db = await getDb();
    const [userResult, executiveProfileResult, supplierResult, demandProfileResult, entryResult] = await Promise.all([
      db.collection("users").deleteMany({ isMockData: true }),
      db.collection("executive_profiles").deleteMany({ isMockData: true }),
      db.collection("supplier_profiles").deleteMany({ isMockData: true }),
      db.collection("demand_profiles").deleteMany({ isMockData: true }),
      db.collection("entries").deleteMany({ isMockData: true })
    ]);

    await db.collection("audit_logs").insertOne({
      actorUserId: ctx.user._id.toString(),
      action: "delete_mock_data",
      entityType: "mock_data",
      entityId: "bulk",
      meta: {
        deletedUsers: userResult.deletedCount,
        deletedExecutiveProfiles: executiveProfileResult.deletedCount,
        deletedSuppliers: supplierResult.deletedCount,
        deletedDemandProfiles: demandProfileResult.deletedCount,
        deletedEntries: entryResult.deletedCount
      },
      createdAt: new Date()
    });

    return NextResponse.json({
      ok: true,
      deletedUsers: userResult.deletedCount,
      deletedExecutiveProfiles: executiveProfileResult.deletedCount,
      deletedSuppliers: supplierResult.deletedCount,
      deletedDemandProfiles: demandProfileResult.deletedCount,
      deletedEntries: entryResult.deletedCount
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to delete mock data." }, { status });
  }
}

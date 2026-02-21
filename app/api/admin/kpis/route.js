import { NextResponse } from "next/server";
import { assertRole, getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["admin"]);

    const db = await getDb();
    const [totalUsers, activeExecutives, totalEntries, pendingVerification] = await Promise.all([
      db.collection("users").countDocuments({}),
      db.collection("users").countDocuments({ role: "executive", status: "active" }),
      db.collection("entries").countDocuments({}),
      db.collection("entries").countDocuments({ status: { $in: ["submitted", "draft"] } })
    ]);

    return NextResponse.json({ totalUsers, activeExecutives, totalEntries, pendingVerification });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to fetch KPIs." }, { status });
  }
}

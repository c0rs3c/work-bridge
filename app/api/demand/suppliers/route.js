import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { assertRole, getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

function userLinkKey(user) {
  if (!user) return "";
  if (typeof user.firebaseUid === "string" && user.firebaseUid.startsWith("mock:")) {
    return user.firebaseUid.slice(5);
  }
  return user._id.toString();
}

export async function GET(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["demand", "admin"]);

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();
    const skill = searchParams.get("skill") || "";
    const state = searchParams.get("state") || "";
    const minTeam = Number(searchParams.get("minTeam") || 0);
    const maxTeam = Number(searchParams.get("maxTeam") || 0);
    const listingId = searchParams.get("listingId") || "";

    const db = await getDb();
    const userQuery = { role: "supplier" };
    if (ctx.user.role !== "admin") userQuery.status = "active";

    const [supplierUsers, supplierProfiles, shortlistRows] = await Promise.all([
      db.collection("users").find(userQuery).sort({ createdAt: -1 }).toArray(),
      db.collection("supplier_profiles").find({}).toArray(),
      listingId && ObjectId.isValid(listingId)
        ? db.collection("applications").find({ listingId, status: "shortlisted" }).toArray()
        : Promise.resolve([])
    ]);

    const profileMap = new Map(supplierProfiles.map((p) => [p.userId, p]));
    const shortlistedUserIds = new Set(shortlistRows.map((r) => String(r.applicantUserId)));

    const rows = supplierUsers
      .map((u) => {
        const key = userLinkKey(u);
        const profile = profileMap.get(key) || null;
        return {
          id: u._id.toString(),
          email: u.email,
          status: u.status,
          isMockData: Boolean(u.isMockData || profile?.isMockData),
          agencyName: profile?.agencyName || "",
          mobileNumber: profile?.mobileNumber || "",
          landlineNumber: profile?.landlineNumber || "",
          teamSize: Number(profile?.teamSize || 0),
          skill: profile?.skill || "",
          address: profile?.address || "",
          state: profile?.state || "",
          shortlisted: shortlistedUserIds.has(u._id.toString())
        };
      })
      .filter((row) => {
        if (skill && row.skill !== skill) return false;
        if (state && row.state !== state) return false;
        if (minTeam > 0 && row.teamSize < minTeam) return false;
        if (maxTeam > 0 && row.teamSize > maxTeam) return false;

        if (!q) return true;
        return (
          row.agencyName.toLowerCase().includes(q) ||
          row.email.toLowerCase().includes(q) ||
          row.skill.toLowerCase().includes(q) ||
          row.state.toLowerCase().includes(q) ||
          row.address.toLowerCase().includes(q)
        );
      });

    return NextResponse.json({ suppliers: rows });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to search suppliers." }, { status });
  }
}

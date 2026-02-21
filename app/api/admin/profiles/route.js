import { NextResponse } from "next/server";
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
    assertRole(ctx?.user, ["admin"]);

    const db = await getDb();

    const [supplierUsers, demandUsers, supplierProfiles, demandProfiles] = await Promise.all([
      db.collection("users").find({ role: "supplier" }).sort({ createdAt: -1 }).toArray(),
      db.collection("users").find({ role: "demand" }).sort({ createdAt: -1 }).toArray(),
      db.collection("supplier_profiles").find({}).toArray(),
      db.collection("demand_profiles").find({}).toArray()
    ]);

    const supplierProfileMap = new Map(supplierProfiles.map((p) => [p.userId, p]));
    const demandProfileMap = new Map(demandProfiles.map((p) => [p.userId, p]));

    const suppliers = supplierUsers.map((u) => {
      const profile = supplierProfileMap.get(userLinkKey(u)) || null;
      return {
        id: u._id.toString(),
        email: u.email,
        status: u.status,
        isMockData: Boolean(u.isMockData || profile?.isMockData),
        agencyName: profile?.agencyName || "",
        mobileNumber: profile?.mobileNumber || "",
        landlineNumber: profile?.landlineNumber || "",
        teamSize: profile?.teamSize || "",
        skill: profile?.skill || "",
        address: profile?.address || "",
        state: profile?.state || ""
      };
    });

    const demands = demandUsers.map((u) => {
      const profile = demandProfileMap.get(userLinkKey(u)) || null;
      return {
        id: u._id.toString(),
        email: u.email,
        status: u.status,
        isMockData: Boolean(u.isMockData || profile?.isMockData),
        organizationName: profile?.organizationName || "",
        contactDetails: profile?.contactDetails || "",
        defaultLocation: profile?.defaultLocation || ""
      };
    });

    return NextResponse.json({ suppliers, demands });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to fetch supplier/demand profiles." }, { status });
  }
}

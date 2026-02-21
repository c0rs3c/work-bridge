import { cookies } from "next/headers";
import { verifyIdToken } from "@/lib/firebase/admin";
import { getDb } from "@/lib/mongodb";

export const ROLE_OPTIONS = ["admin", "executive", "supplier", "demand"];

export async function getRequestToken(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookieStore = await cookies();
  return cookieStore.get("lc_session")?.value;
}

export async function getAuthContext(request) {
  const token = await getRequestToken(request);
  if (!token) return null;

  const decoded = await verifyIdToken(token);
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

  if (!user) return null;

  return {
    decoded,
    user
  };
}

export function assertRole(user, allowedRoles) {
  if (!user || !allowedRoles.includes(user.role)) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
  if (user.status === "inactive") {
    const err = new Error("User is inactive");
    err.status = 403;
    throw err;
  }
}

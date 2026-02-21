import { NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase/admin";
import { getDb } from "@/lib/mongodb";
import { ROLE_OPTIONS } from "@/lib/auth";
import { validateSupplierProfile } from "@/lib/validators";

export async function POST(request) {
  try {
    const body = await request.json();
    const { idToken, role, profile = {} } = body;

    if (!idToken || !role || !ROLE_OPTIONS.includes(role)) {
      return NextResponse.json({ error: "Invalid registration request." }, { status: 400 });
    }

    const decoded = await verifyIdToken(idToken);
    const db = await getDb();
    const signInProvider = decoded?.firebase?.sign_in_provider || "";
    const isGoogleSignIn = signInProvider === "google.com";
    const mobileNumber = String(profile.mobileNumber || "").trim();

    const supplierFields = ["agencyName", "mobileNumber", "landlineNumber", "teamSize", "skill", "address", "state"];
    const hasAnySupplierProfileValue = supplierFields.some((field) => String(profile[field] || "").trim().length > 0);

    if (!isGoogleSignIn) {
      if (!mobileNumber) {
        return NextResponse.json({ error: "Mobile number is required for registration." }, { status: 400 });
      }
      if (!/^[0-9]{10}$/.test(mobileNumber)) {
        return NextResponse.json({ error: "Mobile number must be 10 digits." }, { status: 400 });
      }
    }

    if (role === "supplier" && hasAnySupplierProfileValue) {
      const validation = validateSupplierProfile(profile);
      if (!validation.isValid) {
        return NextResponse.json({ errors: validation.errors }, { status: 400 });
      }
    }

    const now = new Date();

    await db.collection("users").updateOne(
      { firebaseUid: decoded.uid },
      {
        $set: {
          firebaseUid: decoded.uid,
          email: decoded.email,
          mobileNumber: mobileNumber || "",
          role,
          status: "active",
          updatedAt: now
        },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true }
    );

    const user = await db.collection("users").findOne({ firebaseUid: decoded.uid });

    if (role === "supplier" && hasAnySupplierProfileValue) {
      await db.collection("supplier_profiles").updateOne(
        { userId: user._id.toString() },
        {
          $set: {
            userId: user._id.toString(),
            agencyName: profile.agencyName?.trim(),
            mobileNumber: profile.mobileNumber?.trim(),
            landlineNumber: profile.landlineNumber?.trim(),
            teamSize: Number(profile.teamSize),
            skill: profile.skill?.trim(),
            address: profile.address?.trim(),
            state: profile.state?.trim(),
            isMockData: false,
            updatedAt: now
          },
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      );
    }

    if (role === "demand") {
      await db.collection("demand_profiles").updateOne(
        { userId: user._id.toString() },
        {
          $set: {
            userId: user._id.toString(),
            organizationName: profile.organizationName?.trim() || decoded.email,
            contactDetails: profile.contactDetails?.trim() || "",
            defaultLocation: profile.defaultLocation?.trim() || "",
            updatedAt: now
          },
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      );
    }

    if (role === "executive") {
      await db.collection("executive_profiles").updateOne(
        { userId: user._id.toString() },
        {
          $set: {
            userId: user._id.toString(),
            name: profile.name?.trim() || decoded.email,
            phone: profile.phone?.trim() || "",
            region: profile.region?.trim() || "",
            updatedAt: now
          },
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Registration failed." }, { status: 500 });
  }
}

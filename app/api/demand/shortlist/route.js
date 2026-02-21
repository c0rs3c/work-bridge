import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { assertRole, getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["demand", "admin"]);

    const body = await request.json();
    const { listingId, supplierUserId, shortlisted } = body;

    if (!listingId || !ObjectId.isValid(listingId)) {
      return NextResponse.json({ error: "Valid listingId is required." }, { status: 400 });
    }
    if (!supplierUserId || !ObjectId.isValid(supplierUserId)) {
      return NextResponse.json({ error: "Valid supplierUserId is required." }, { status: 400 });
    }

    const db = await getDb();
    const listing = await db.collection("marketplace_listings").findOne({ _id: new ObjectId(listingId), listingType: "labour_demand" });
    if (!listing) return NextResponse.json({ error: "Requirement not found." }, { status: 404 });

    if (ctx.user.role !== "admin" && listing.ownerUserId !== ctx.user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supplier = await db.collection("users").findOne({ _id: new ObjectId(supplierUserId), role: "supplier" });
    if (!supplier) return NextResponse.json({ error: "Supplier not found." }, { status: 404 });

    const match = {
      listingId,
      applicantUserId: supplierUserId,
      demandUserId: listing.ownerUserId
    };

    if (shortlisted === false) {
      await db.collection("applications").deleteOne(match);
      return NextResponse.json({ ok: true, shortlisted: false });
    }

    await db.collection("applications").updateOne(
      match,
      {
        $set: {
          status: "shortlisted",
          message: String(body.message || "").trim(),
          updatedAt: new Date(),
          isMockData: false
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, shortlisted: true });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to update shortlist." }, { status });
  }
}

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { assertRole, getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

function normalizeSkills(skills) {
  if (Array.isArray(skills)) return skills.map((s) => String(s).trim()).filter(Boolean);
  return String(skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["demand", "admin"]);

    const db = await getDb();
    const q = ctx.user.role === "admin" ? { listingType: "labour_demand" } : { listingType: "labour_demand", ownerUserId: ctx.user._id.toString() };
    const rows = await db.collection("marketplace_listings").find(q).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      listings: rows.map((r) => ({
        id: r._id.toString(),
        title: r.title,
        location: r.location,
        skills: r.skills || [],
        quantity: r.quantity,
        startDate: r.startDate,
        status: r.status,
        notes: r.notes || "",
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to fetch demand requirements." }, { status });
  }
}

export async function POST(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["demand", "admin"]);

    const body = await request.json();
    const skills = normalizeSkills(body.skills);

    if (!body.title?.trim()) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    if (!body.location?.trim()) return NextResponse.json({ error: "Location is required." }, { status: 400 });
    if (!skills.length) return NextResponse.json({ error: "At least one skill is required." }, { status: 400 });

    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be a positive integer." }, { status: 400 });
    }

    const startDate = body.startDate ? new Date(body.startDate) : null;
    if (!startDate || Number.isNaN(startDate.getTime())) {
      return NextResponse.json({ error: "Valid start date is required." }, { status: 400 });
    }

    const doc = {
      listingType: "labour_demand",
      ownerUserId: ctx.user._id.toString(),
      title: body.title.trim(),
      location: body.location.trim(),
      skills,
      quantity,
      startDate,
      status: "open",
      notes: String(body.notes || "").trim(),
      isMockData: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const db = await getDb();
    const result = await db.collection("marketplace_listings").insertOne(doc);

    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to post labour requirement." }, { status });
  }
}

export async function PATCH(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["demand", "admin"]);

    const body = await request.json();
    const listingId = body.listingId;
    const status = body.status;

    if (!listingId || !["open", "closed"].includes(status)) {
      return NextResponse.json({ error: "listingId and valid status are required." }, { status: 400 });
    }

    const db = await getDb();
    const q = { _id: new ObjectId(listingId), listingType: "labour_demand" };
    const existing = await db.collection("marketplace_listings").findOne(q);
    if (!existing) return NextResponse.json({ error: "Requirement not found." }, { status: 404 });

    if (ctx.user.role !== "admin" && existing.ownerUserId !== ctx.user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("marketplace_listings").updateOne(q, { $set: { status, updatedAt: new Date() } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to update requirement." }, { status });
  }
}

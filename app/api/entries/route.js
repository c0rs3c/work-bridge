import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { assertRole, getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { validateExecutiveEntry } from "@/lib/validators";

export async function GET(request) {
  try {
    const ctx = await getAuthContext(request);
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await getDb();
    const q = ctx.user.role === "admin" ? {} : { enteredBy: ctx.user._id.toString() };
    const rows = await db.collection("entries").find(q).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      entries: rows.map((r) => ({
        id: r._id.toString(),
        entryType: r.entryType,
        payload: r.payload,
        status: r.status,
        enteredBy: r.enteredBy,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to fetch entries." }, { status });
  }
}

export async function POST(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["executive", "admin"]);

    const body = await request.json();
    const validation = validateExecutiveEntry(body);

    if (!validation.isValid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    const doc = {
      entryType: body.entryType || "other",
      enteredBy: ctx.user._id.toString(),
      payload: {
        agencyName: body.agencyName.trim(),
        skill: body.skill.trim(),
        teamSize: Number(body.teamSize),
        wageRateInRupee: Number(body.wageRateInRupee),
        rating: Number(body.rating),
        remarks: body.remarks.trim()
      },
      status: body.status || "submitted",
      isMockData: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const db = await getDb();
    const result = await db.collection("entries").insertOne(doc);

    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to create entry." }, { status });
  }
}

export async function PATCH(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["executive", "admin"]);

    const body = await request.json();
    const { entryId, status, ...payload } = body;

    if (!entryId) {
      return NextResponse.json({ error: "entryId is required." }, { status: 400 });
    }

    const db = await getDb();
    const current = await db.collection("entries").findOne({ _id: new ObjectId(entryId) });
    if (!current) {
      return NextResponse.json({ error: "Entry not found." }, { status: 404 });
    }

    if (ctx.user.role !== "admin" && current.enteredBy !== ctx.user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validation = validateExecutiveEntry({ ...current.payload, ...payload, remarks: payload.remarks ?? current.payload.remarks });
    if (!validation.isValid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    await db.collection("entries").updateOne(
      { _id: new ObjectId(entryId) },
      {
        $set: {
          payload: {
            agencyName: (payload.agencyName ?? current.payload.agencyName ?? "").trim(),
            skill: (payload.skill ?? current.payload.skill).trim(),
            teamSize: Number(payload.teamSize ?? current.payload.teamSize),
            wageRateInRupee: Number(payload.wageRateInRupee ?? current.payload.wageRateInRupee),
            rating: Number(payload.rating ?? current.payload.rating),
            remarks: (payload.remarks ?? current.payload.remarks).trim()
          },
          status: status || current.status,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to update entry." }, { status });
  }
}

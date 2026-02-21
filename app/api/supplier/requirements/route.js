import { NextResponse } from "next/server";
import { assertRole, getAuthContext } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const ctx = await getAuthContext(request);
    assertRole(ctx?.user, ["supplier", "admin"]);

    const { searchParams } = new URL(request.url);
    const q = String(searchParams.get("q") || "").trim().toLowerCase();
    const skill = String(searchParams.get("skill") || "").trim().toLowerCase();
    const state = String(searchParams.get("state") || "").trim().toLowerCase();

    const db = await getDb();
    const rows = await db
      .collection("marketplace_listings")
      .find({ listingType: "labour_demand", status: "open" })
      .sort({ createdAt: -1 })
      .toArray();

    const filtered = rows
      .map((row) => {
        const skills = Array.isArray(row.skills) ? row.skills : [];
        return {
          id: row._id.toString(),
          title: row.title || "",
          location: row.location || "",
          skills,
          quantity: Number(row.quantity || 0),
          startDate: row.startDate || null,
          notes: row.notes || "",
          createdAt: row.createdAt || null
        };
      })
      .filter((row) => {
        const joinedSkills = row.skills.join(" ").toLowerCase();
        const location = String(row.location || "").toLowerCase();
        const title = String(row.title || "").toLowerCase();
        const notes = String(row.notes || "").toLowerCase();

        if (skill && !joinedSkills.includes(skill)) return false;
        if (state && !location.includes(state)) return false;

        if (!q) return true;
        return title.includes(q) || location.includes(q) || joinedSkills.includes(q) || notes.includes(q);
      });

    return NextResponse.json({ requirements: filtered });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || "Failed to fetch demand requirements." }, { status });
  }
}

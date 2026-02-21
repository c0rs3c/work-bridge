const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const { loadEnv } = require("./load-env");

loadEnv();

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "labour_connect";

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const filePath = path.join(process.cwd(), "mock-data", "labour_portal_mock_data.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const {
    users = [],
    executive_profiles = [],
    supplier_profiles = [],
    demand_profiles = [],
    entries = []
  } = data;

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const now = new Date();

    await Promise.all([
      db.collection("users").deleteMany({ isMockData: true }),
      db.collection("executive_profiles").deleteMany({ isMockData: true }),
      db.collection("supplier_profiles").deleteMany({ isMockData: true }),
      db.collection("demand_profiles").deleteMany({ isMockData: true }),
      db.collection("entries").deleteMany({ isMockData: true })
    ]);

    if (users.length) {
      await db.collection("users").insertMany(
        users.map((u) => ({ ...u, createdAt: new Date(u.createdAt || now), updatedAt: new Date(u.updatedAt || now) }))
      );
    }

    if (executive_profiles.length) {
      await db.collection("executive_profiles").insertMany(
        executive_profiles.map((e) => ({ ...e, createdAt: new Date(e.createdAt || now), updatedAt: new Date(e.updatedAt || now) }))
      );
    }

    if (supplier_profiles.length) {
      await db.collection("supplier_profiles").insertMany(
        supplier_profiles.map((s) => ({ ...s, createdAt: new Date(s.createdAt || now), updatedAt: new Date(s.updatedAt || now) }))
      );
    }

    if (demand_profiles.length) {
      await db.collection("demand_profiles").insertMany(
        demand_profiles.map((d) => ({ ...d, createdAt: new Date(d.createdAt || now), updatedAt: new Date(d.updatedAt || now) }))
      );
    }

    if (entries.length) {
      await db.collection("entries").insertMany(
        entries.map((e) => ({ ...e, createdAt: new Date(e.createdAt || now), updatedAt: new Date(e.updatedAt || now) }))
      );
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          users: users.length,
          executive_profiles: executive_profiles.length,
          supplier_profiles: supplier_profiles.length,
          demand_profiles: demand_profiles.length,
          entries: entries.length
        },
        null,
        2
      )
    );
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

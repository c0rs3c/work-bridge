const { MongoClient } = require("mongodb");
const { loadEnv } = require("./load-env");

loadEnv();

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "labour_connect";

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);

    const [users, executiveProfiles, supplierProfiles, demandProfiles, entries] = await Promise.all([
      db.collection("users").deleteMany({ isMockData: true }),
      db.collection("executive_profiles").deleteMany({ isMockData: true }),
      db.collection("supplier_profiles").deleteMany({ isMockData: true }),
      db.collection("demand_profiles").deleteMany({ isMockData: true }),
      db.collection("entries").deleteMany({ isMockData: true })
    ]);

    console.log(
      JSON.stringify(
        {
          ok: true,
          deletedUsers: users.deletedCount,
          deletedExecutiveProfiles: executiveProfiles.deletedCount,
          deletedSupplierProfiles: supplierProfiles.deletedCount,
          deletedDemandProfiles: demandProfiles.deletedCount,
          deletedEntries: entries.deletedCount
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

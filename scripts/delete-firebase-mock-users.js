const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const { loadEnv } = require("./load-env");

loadEnv();

function getPrivateKey() {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  return key ? key.replace(/\\n/g, "\n") : null;
}

function initAdmin() {
  if (admin.apps.length) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY.");
  }

  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey })
  });
}

async function deleteByEmail(auth, email) {
  try {
    const user = await auth.getUserByEmail(email);
    await auth.deleteUser(user.uid);
    return { email, status: "deleted" };
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      return { email, status: "missing" };
    }
    return { email, status: "error", error: err.message };
  }
}

async function main() {
  const app = initAdmin();
  const auth = app.auth();

  const credsPath = path.join(process.cwd(), "mock-data", "mock_account_credentials.json");
  const raw = fs.readFileSync(credsPath, "utf-8");
  const creds = JSON.parse(raw);

  const accounts = [...(creds.admins || []), ...creds.executives, ...creds.suppliers, ...creds.demands];

  const results = [];
  for (const account of accounts) {
    // eslint-disable-next-line no-await-in-loop
    const result = await deleteByEmail(auth, account.email);
    results.push(result);
  }

  const summary = results.reduce(
    (acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    },
    { deleted: 0, missing: 0, error: 0 }
  );

  console.log("Firebase mock user delete summary:", summary);
  if (summary.error > 0) {
    const failed = results.filter((r) => r.status === "error").slice(0, 10);
    console.log("Sample errors:", failed);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

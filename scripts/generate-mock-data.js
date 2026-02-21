const fs = require("fs");
const path = require("path");

const skills = [
  "Mason",
  "Electrician",
  "Welder",
  "Carpenter",
  "Painter",
  "Plumber",
  "Scaffolder",
  "Tile Setter",
  "Steel Fixer",
  "General Helper"
];

const states = [
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Telangana",
  "Andhra Pradesh",
  "Kerala",
  "Gujarat",
  "Rajasthan",
  "Odisha",
  "West Bengal"
];

const cities = [
  "Bengaluru",
  "Chennai",
  "Mumbai",
  "Hyderabad",
  "Vijayawada",
  "Kochi",
  "Ahmedabad",
  "Jaipur",
  "Bhubaneswar",
  "Kolkata"
];

function pick(arr, i) {
  return arr[i % arr.length];
}

const now = new Date().toISOString();
const defaultPassword = "WorkBridge@123";
const adminAccount = {
  key: "mock-admin-1",
  email: "admin.mock@workbridge.dev",
  name: "System Admin"
};

const executives = [
  {
    key: "mock-exec-1",
    email: "executive1.mock@workbridge.dev",
    name: "Ravi Kumar",
    phone: "9000000001",
    region: "South"
  },
  {
    key: "mock-exec-2",
    email: "executive2.mock@workbridge.dev",
    name: "Priya Nair",
    phone: "9000000002",
    region: "West"
  }
];

const supplierUsers = Array.from({ length: 50 }).map((_, idx) => {
  const n = idx + 1;
  return {
    key: `mock-supplier-${n}`,
    email: `supplier${n.toString().padStart(2, "0")}.mock@workbridge.dev`
  };
});

const demandUsers = Array.from({ length: 50 }).map((_, idx) => {
  const n = idx + 1;
  return {
    key: `mock-demand-${n}`,
    email: `demand${n.toString().padStart(2, "0")}.mock@workbridge.dev`
  };
});

const users = [
  {
    firebaseUid: `mock:${adminAccount.key}`,
    email: adminAccount.email,
    role: "admin",
    status: "active",
    isMockData: true,
    createdAt: now,
    updatedAt: now
  },
  ...executives.map((e) => ({
    firebaseUid: `mock:${e.key}`,
    email: e.email,
    role: "executive",
    status: "active",
    isMockData: true,
    createdAt: now,
    updatedAt: now
  })),
  ...supplierUsers.map((s) => ({
    firebaseUid: `mock:${s.key}`,
    email: s.email,
    role: "supplier",
    status: "active",
    isMockData: true,
    createdAt: now,
    updatedAt: now
  })),
  ...demandUsers.map((d) => ({
    firebaseUid: `mock:${d.key}`,
    email: d.email,
    role: "demand",
    status: "active",
    isMockData: true,
    createdAt: now,
    updatedAt: now
  }))
];

const executive_profiles = executives.map((e) => ({
  userId: e.key,
  name: e.name,
  phone: e.phone,
  region: e.region,
  isMockData: true,
  createdAt: now,
  updatedAt: now
}));

const supplier_profiles = supplierUsers.map((s, idx) => ({
  userId: s.key,
  agencyName: `Agency ${idx + 1}`,
  mobileNumber: `9${String(100000000 + idx).padStart(9, "0")}`,
  landlineNumber: `080-${String(300000 + idx).padStart(6, "0")}`,
  teamSize: (idx % 20) + 5,
  skill: pick(skills, idx),
  address: `#${idx + 10}, Industrial Area, Block ${idx % 12}`,
  state: pick(states, idx),
  isMockData: true,
  createdAt: now,
  updatedAt: now
}));

const demand_profiles = demandUsers.map((d, idx) => ({
  userId: d.key,
  organizationName: `Demand Org ${idx + 1}`,
  contactDetails: `+91-98${String(1000000 + idx).slice(0, 8)}`,
  defaultLocation: `${pick(cities, idx)}, ${pick(states, idx)}`,
  isMockData: true,
  createdAt: now,
  updatedAt: now
}));

const entries = [
  ...Array.from({ length: 30 }).map((_, idx) => ({
    entryType: idx % 2 === 0 ? "supplier" : "demand",
    enteredBy: "mock-exec-1",
    payload: {
      skill: pick(skills, idx + 1),
      teamSize: (idx % 15) + 5,
      wageRateInRupee: 700 + (idx % 10) * 60,
      rating: (idx % 5) + 1,
      remarks: `Executive 1 mock remarks ${idx + 1}`
    },
    status: idx % 3 === 0 ? "draft" : idx % 3 === 1 ? "submitted" : "verified",
    isMockData: true,
    createdAt: now,
    updatedAt: now
  })),
  ...Array.from({ length: 30 }).map((_, idx) => ({
    entryType: idx % 2 === 0 ? "demand" : "supplier",
    enteredBy: "mock-exec-2",
    payload: {
      skill: pick(skills, idx + 4),
      teamSize: (idx % 12) + 6,
      wageRateInRupee: 750 + (idx % 10) * 55,
      rating: ((idx + 2) % 5) + 1,
      remarks: `Executive 2 mock remarks ${idx + 1}`
    },
    status: idx % 3 === 0 ? "submitted" : idx % 3 === 1 ? "verified" : "draft",
    isMockData: true,
    createdAt: now,
    updatedAt: now
  }))
];

const credentials = {
  note: "These credentials are for mock/demo accounts. Create matching users in Firebase Authentication if login is required.",
  defaultPassword,
  admins: [{ email: adminAccount.email, password: defaultPassword, role: "admin" }],
  executives: executives.map((e) => ({ email: e.email, password: defaultPassword, role: "executive" })),
  suppliers: supplierUsers.map((s) => ({ email: s.email, password: defaultPassword, role: "supplier" })),
  demands: demandUsers.map((d) => ({ email: d.email, password: defaultPassword, role: "demand" }))
};

const output = { users, executive_profiles, supplier_profiles, demand_profiles, entries, credentials };
const outDir = path.join(process.cwd(), "mock-data");
fs.mkdirSync(outDir, { recursive: true });

const outputPath = path.join(outDir, "labour_portal_mock_data.json");
const credsPath = path.join(outDir, "mock_account_credentials.json");
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
fs.writeFileSync(credsPath, JSON.stringify(credentials, null, 2));

console.log(`Created ${outputPath}`);
console.log(`Created ${credsPath}`);

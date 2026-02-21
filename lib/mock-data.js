import fs from "fs/promises";
import path from "path";

export async function loadMockData() {
  const filePath = path.join(process.cwd(), "mock-data", "labour_portal_mock_data.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

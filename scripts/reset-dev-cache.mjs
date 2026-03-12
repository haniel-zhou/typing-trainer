import fs from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const nextDir = path.join(cwd, ".next");

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function cleanupOldArchives() {
  const entries = await fs.readdir(cwd, { withFileTypes: true });
  const archives = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(".next-archive-"))
    .sort((a, b) => a.name.localeCompare(b.name));

  while (archives.length > 2) {
    const oldest = archives.shift();
    if (!oldest) break;
    await fs.rm(path.join(cwd, oldest.name), { recursive: true, force: true });
  }
}

async function main() {
  if (!(await exists(nextDir))) {
    console.log("No .next cache found. Nothing to reset.");
    return;
  }

  const archiveName = `.next-archive-${Date.now()}`;
  const archiveDir = path.join(cwd, archiveName);
  await fs.rename(nextDir, archiveDir);
  await cleanupOldArchives();
  console.log(`Moved .next to ${archiveName}`);
}

main().catch((error) => {
  console.error("Failed to reset dev cache.");
  console.error(error);
  process.exit(1);
});

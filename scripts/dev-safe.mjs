import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const nextDir = path.join(cwd, ".next");

async function shouldArchiveCache() {
  try {
    const stats = await fs.stat(nextDir);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function archiveCacheIfNeeded() {
  if (!(await shouldArchiveCache())) return;
  const archiveName = `.next-archive-${Date.now()}`;
  await fs.rename(nextDir, path.join(cwd, archiveName));
  console.log(`Archived stale .next cache to ${archiveName}`);
}

async function main() {
  await archiveCacheIfNeeded();

  const child = spawn("next", ["dev", "-p", "3000"], {
    cwd,
    stdio: "inherit",
    shell: true
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error("Failed to start stable dev server.");
  console.error(error);
  process.exit(1);
});

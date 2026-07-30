import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const limit = 250;
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".md"]);
const ignoredDirs = new Set([
  "node_modules",
  ".next",
  ".git",
  "out",
  "build",
  "coverage",
  "playwright-report",
  "test-results",
]);
const ignoredFiles = new Set(["next-env.d.ts", "package-lock.json"]);
const violations = [];

function scan(directory) {
  for (const entry of readdirSync(directory)) {
    const filePath = join(directory, entry);
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      if (!ignoredDirs.has(entry)) scan(filePath);
      continue;
    }
    if (!extensions.has(extname(entry)) || ignoredFiles.has(entry)) continue;
    const lineCount = readFileSync(filePath, "utf8").split(/\r?\n/).length;
    if (lineCount > limit) {
      violations.push({ file: relative(root, filePath), lineCount });
    }
  }
}

scan(root);

if (violations.length > 0) {
  for (const violation of violations) {
    console.error(`${violation.file}: ${violation.lineCount} lines`);
  }
  process.exit(1);
}

console.log(`All maintained source files are within ${limit} lines.`);

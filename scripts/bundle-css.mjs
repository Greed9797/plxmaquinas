import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cssDir = join(root, "src/css");

function stripImport(css) {
  return css.replace(/@import\s+[^;]+;\s*/g, "");
}

const bundle = [
  "/* bundled from src/css — do not edit */",
  readFileSync(join(cssDir, "fonts.css"), "utf8"),
  stripImport(readFileSync(join(cssDir, "tokens.css"), "utf8")),
  stripImport(readFileSync(join(cssDir, "app.css"), "utf8")),
].join("\n\n");

const outDir = join(root, "public/css");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "app.css"), bundle);
console.log(`Wrote public/css/app.css (${bundle.length} bytes)`);

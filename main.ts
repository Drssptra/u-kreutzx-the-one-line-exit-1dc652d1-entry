// The One-Line Exit — a single-line resignation letter, written to be funny.
//
// The program writes the resignation line to entry.txt inside the output
// directory (no trailing newline, exactly as the judge reads it) and prints
// the same line to stdout with a trailing newline. It is deterministic:
// the same line comes out on every run.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I hereby resign, effective immediately: after six years of being told 'we're a family here,' I've found a family that actually pays me.";

// The gate: the sealed scorer only accepts 1 to 140 characters.
const MAX_LINE_CHARS = 140;
if (LINE.length > MAX_LINE_CHARS) {
  console.error(
    `error: resignation line is ${LINE.length} characters, over the ${MAX_LINE_CHARS}-character gate`,
  );
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), LINE, "utf8");
process.stdout.write(LINE + "\n");

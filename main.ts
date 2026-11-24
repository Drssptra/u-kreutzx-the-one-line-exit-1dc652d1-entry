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

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), LINE, "utf8");
process.stdout.write(LINE + "\n");

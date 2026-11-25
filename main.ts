// The One-Line Exit (v2, revised) — one line, one resignation, zero drama.
//
// Premise, in one breath: a lifeguard hands in his notice. The joke is
// the reversal — five years spent pulling other people out of the
// shallow end, and the person he finally rescues is himself.
//
// What this script does, start to finish:
//   1. Assembles the single resignation line from its clauses.
//   2. Runs it through a small battery of structural checks
//      (single line, 1–140 characters, no surrounding whitespace).
//   3. Writes it byte-for-byte into entry.txt — no trailing newline,
//      so the file's contents are exactly the line, nothing more.
//   4. Echoes the line to stdout so the run is visible in logs.
//
// Node 22 standard library only. No network, no randomness, no
// environment dependence beyond MAKEFUN_OUTPUT_DIR.

import { promises as fs } from "node:fs";
import { join } from "node:path";

// --- The line, assembled from its clauses ---------------------------------
//
// Kept as parts rather than one long literal so each beat of the joke is
// visible on its own: the resignation, the tenure, the punchline.

const CLAUSES: readonly string[] = [
  "I resign, effective immediately:",
  "after five years watching people drown in the shallow end,",
  "I have finally decided to save myself.",
];

const LINE = CLAUSES.join(" ");

// --- Validation ------------------------------------------------------------
//
// Every rule the scorer enforces is checked here, and every failure is
// collected before we bail out, so a bad line reports *all* of its
// problems at once instead of one at a time.

const MAX_CHARS = 140;

function collectProblems(text: string): string[] {
  const problems: string[] = [];

  if (text.length === 0) {
    problems.push("line is empty");
  }
  if ([...text].length > MAX_CHARS) {
    problems.push(
      `line is ${[...text].length} characters, over the ${MAX_CHARS}-character cap`,
    );
  }
  if (/[\r\n]/.test(text)) {
    problems.push("line contains a line break");
  }
  if (text !== text.trim()) {
    problems.push("line has leading or trailing whitespace");
  }
  if (text.length > 0 && /\s{2}/.test(text)) {
    problems.push("line contains a doubled space");
  }

  return problems;
}

// --- Output ----------------------------------------------------------------

async function main(): Promise<void> {
  const problems = collectProblems(LINE);
  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`error: ${problem}`);
    }
    process.exitCode = 1;
    return;
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = join(outputDir, "entry.txt");

  await fs.mkdir(outputDir, { recursive: true });
  // A Buffer pins the exact bytes: the UTF-8 encoding of LINE, with no
  // newline appended by any writer.
  await fs.writeFile(target, Buffer.from(LINE, "utf8"));

  // Read the file straight back and confirm it is byte-for-byte the line.
  // If the disk disagrees with what we intended, say so and fail rather
  // than letting a corrupted entry through silently.
  const written = await fs.readFile(target, "utf8");
  if (written !== LINE) {
    console.error(
      "error: entry.txt on disk does not match the resignation line",
    );
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`${LINE}\n`);
}

await main();

/**
 * Disk writer. Runs last, and only after the HITL gate approved.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { GeneratedFile } from './types.js';

/**
 * Resolves a model-supplied path against the output directory and refuses it
 * if it lands anywhere else.
 *
 * The schema gate cannot catch this: its `path` rule is a character allowlist
 * that happily accepts "..", so "pages/../../../etc/evil.ts" is a structurally
 * valid path. Containment is a semantic rule, and this is where it lives.
 *
 * The `+ path.sep` matters. A bare startsWith(root) also accepts a sibling
 * directory whose name merely begins with the root's, e.g. root "output"
 * against "output-escaped/evil.ts".
 */
function resolveInside(outputDir: string, filePath: string, verb: 'read' | 'write'): string {
  const root = path.resolve(outputDir);
  const full = path.resolve(root, filePath);
  if (!full.startsWith(root + path.sep)) {
    throw new Error(`Refusing to ${verb} outside ${outputDir}: "${filePath}"`);
  }
  return full;
}

/**
 * Reads whatever is already at each path, so the HITL gate can show a real
 * before/after instead of pretending every file is new.
 *
 * Guarded exactly like writeFiles(). An escaping path throws rather than
 * reporting "no existing file": a silent miss would render the escape as a
 * clean "(new file)" diff, and the human approving it would have no way to
 * tell they were looking at a file that is not theirs.
 */
export async function readExisting(
  files: GeneratedFile[],
  outputDir: string,
): Promise<Record<string, string>> {
  const existing: Record<string, string> = {};
  for (const file of files) {
    // Outside the try on purpose — this must not be swallowed as "missing".
    const full = resolveInside(outputDir, file.path, 'read');
    try {
      existing[file.path] = await readFile(full, 'utf8');
    } catch {
      // Missing file: it is new. Nothing to show on the "before" side.
    }
  }
  return existing;
}

export async function writeFiles(
  files: GeneratedFile[],
  outputDir: string,
): Promise<string[]> {
  const written: string[] = [];

  for (const file of files) {
    const full = resolveInside(outputDir, file.path, 'write');
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, file.contents, 'utf8');
    written.push(path.relative(process.cwd(), full));
  }

  return written;
}

/**
 * Disk writer. Runs last, and only after the HITL gate approved.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { GeneratedFile } from './types.js';

/**
 * Reads whatever is already at each path, so the HITL gate can show a real
 * before/after instead of pretending every file is new.
 */
export async function readExisting(
  files: GeneratedFile[],
  outputDir: string,
): Promise<Record<string, string>> {
  const existing: Record<string, string> = {};
  for (const file of files) {
    try {
      existing[file.path] = await readFile(path.resolve(outputDir, file.path), 'utf8');
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
  const root = path.resolve(outputDir);
  const written: string[] = [];

  for (const file of files) {
    const full = path.resolve(root, file.path);
    if (!full.startsWith(root + path.sep)) {
      throw new Error(`Refusing to write outside ${outputDir}: "${file.path}"`);
    }
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, file.contents, 'utf8');
    written.push(path.relative(process.cwd(), full));
  }

  return written;
}

#!/usr/bin/env node
// Reprocesa imágenes de public/projects in-place: redimensiona a máx 1920px
// ancho y recomprime. JPG/JPEG → quality 82 mozjpeg. PNG → compressionLevel 9.
// Skip de archivos livianos (<250KB) y no-imagen.

import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const ROOT = "public/projects";
const MAX_WIDTH = 1920;
const JPG_QUALITY = 82;
const SKIP_BYTES = 250 * 1024;

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function processFile(file) {
  const ext = extname(file).toLowerCase();
  const isJpg = ext === ".jpg" || ext === ".jpeg";
  const isPng = ext === ".png";
  if (!isJpg && !isPng) return null;

  const before = (await stat(file)).size;
  if (before < SKIP_BYTES) return { file, skipped: true, before };

  const tmp = `${file}.opt${ext}`;
  const img = sharp(file, { failOn: "none" });
  const meta = await img.metadata();
  const needsResize = (meta.width ?? 0) > MAX_WIDTH;

  let pipeline = sharp(file, { failOn: "none" });
  if (needsResize) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  if (isJpg) pipeline = pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true });
  else pipeline = pipeline.png({ compressionLevel: 9, palette: true });

  await pipeline.toFile(tmp);
  const after = (await stat(tmp)).size;

  if (after >= before) {
    await unlink(tmp);
    return { file, kept: true, before, after };
  }
  await rename(tmp, file);
  return { file, before, after, width: meta.width, resized: needsResize };
}

const fmt = (n) => (n / 1024).toFixed(0) + "K";

const files = await walk(ROOT);
let totalBefore = 0;
let totalAfter = 0;
for (const f of files) {
  try {
    const res = await processFile(f);
    if (!res) continue;
    if (res.skipped) {
      console.log(`skip  ${f}  (${fmt(res.before)})`);
      continue;
    }
    if (res.kept) {
      console.log(`keep  ${f}  ${fmt(res.before)} → ${fmt(res.after)} (no gain)`);
      totalBefore += res.before;
      totalAfter += res.before;
      continue;
    }
    totalBefore += res.before;
    totalAfter += res.after;
    const pct = (((res.before - res.after) / res.before) * 100).toFixed(0);
    const tag = res.resized ? `resize→${MAX_WIDTH}` : "recompress";
    console.log(`ok    ${f}  ${fmt(res.before)} → ${fmt(res.after)}  -${pct}%  ${tag}`);
  } catch (err) {
    console.error(`fail  ${f}:`, err.message);
  }
}
const pct = totalBefore > 0 ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0) : 0;
console.log(`\ntotal: ${fmt(totalBefore)} → ${fmt(totalAfter)} (-${pct}%)`);

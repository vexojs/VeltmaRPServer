import { context, build } from 'esbuild';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = new Set(process.argv.slice(2));
const isWatch = args.has('--watch');
const mode = args.has('--mode=development') ? 'development' : 'production';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const options = {
  absWorkingDir: root,
  bundle: true,
  entryPoints: ['src/client/index.ts'],
  outfile: path.join(root, 'dist', 'client', 'index.js'),
  format: 'iife',
  platform: 'neutral',
  target: 'es2020',
  minify: mode === 'production',
  sourcemap: mode === 'development' ? 'inline' : false,
  legalComments: 'none',
  logLevel: 'info',
};

await rm(path.join(root, 'dist'), { recursive: true, force: true });

if (isWatch) {
  const buildContext = await context(options);
  await buildContext.watch();
  console.log(`[Veltma World] watching ${mode} build`);
} else {
  await mkdir(path.join(root, 'dist', 'client'), { recursive: true });
  await build(options);
  console.log(`[Veltma World] completed ${mode} build`);
}

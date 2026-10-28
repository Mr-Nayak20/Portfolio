// Regression check for the missing standalone study code/assets that caused 0% loaders.
// Run after npm run build; optionally pass a serving origin to check HTTP responses.
import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {studies} from '../web/site/data.js';
const origin = process.argv[2];
const root = path.resolve('dist');
const checked = new Set();
async function exists(relative) {
  const file = path.join(root, relative);
  assert((await stat(file)).isFile(), `Missing built asset: ${relative}`);
  checked.add('/' + relative);
  return file;
}
for (const study of studies) {
  const index = `examples/${study.slug}/index.html`;
  const html = await readFile(await exists(index), 'utf8');
  assert(!html.includes('5190'), `${study.slug} still depends on the secondary server`);
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) await exists(match[1].slice(1));
  await exists(`img/index/${study.slug}.webp`);
  for (const width of [320,640]) await exists(`img/index/${study.slug}-${width}.webp`);
}
async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const file = path.join(dir,entry.name);
    if (entry.isDirectory()) result.push(...await walk(file)); else result.push(file);
  }
  return result;
}
let glbs = 0;
for (const file of await walk(path.join(root, 'models'))) {
  if (!file.endsWith('.glb')) continue;
  const buffer = await readFile(file);
  assert.equal(buffer.toString('ascii',0,4),'glTF', `Invalid model: ${file}`);
  assert.equal(buffer.readUInt32LE(8),buffer.length, `Truncated model: ${file}`);
  const json = JSON.parse(buffer.toString('utf8',20,20+buffer.readUInt32LE(12)));
  for (const resource of [...(json.buffers||[]),...(json.images||[])]) {
    if (resource.uri && !resource.uri.startsWith('data:')) await exists(path.relative(root,path.resolve(path.dirname(file),resource.uri)));
  }
  checked.add('/' + path.relative(root,file)); glbs++;
}
if (origin) {
  const paths = [...checked];
  for (let offset = 0; offset < paths.length; offset += 12) {
    await Promise.all(paths.slice(offset,offset+12).map(async route => {
      const response = await fetch(new URL(route,origin),{method:'HEAD'});
      assert(response.ok, `${response.status}: ${route}`);
      const mime=response.headers.get('content-type') || '';
      if (route.endsWith('.js')) assert(/javascript/.test(mime),`Wrong JS MIME ${mime}: ${route}`);
      if (route.endsWith('.webp')) assert(mime.startsWith('image/'),`Wrong image MIME ${mime}: ${route}`);
      if (route.endsWith('.glb')) assert(!mime.includes('text/html'),`HTML fallback masking a missing model: ${route}`);
    }));
  }
}
console.log(`PASS: ${studies.length} self-contained studies; ${glbs} valid GLBs; ${checked.size} routes/assets${origin?' also verified over HTTP':''}.`);

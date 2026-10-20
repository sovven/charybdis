// node tools/build.mjs  — game-src.html is the only file to edit; everything else is generated from it.
//   charybdis.html / charybdis-mobile.html   artifact copies (desktop / phone)
//   dist/卡律布狄斯-{电脑版,手机版}.html         standalone pages (three.js from CDN)
//   dist/卡律布狄斯-{电脑版,手机版}-离线.html    three.js bundled in, works without network
//   site/index.html + site/m.html              GitHub Pages (phones jump to m.html)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = p => fs.readFileSync(path.join(root, p), 'utf8');
const wr = (p, s) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), s); console.log('  ', p, (s.length / 1024).toFixed(0) + 'KB'); };

const src = rd('game-src.html');
if (!src.includes('const MOBILE=false;')) throw new Error('MOBILE flag not found');
const toMobile = s => s.replace('const MOBILE=false;', 'const MOBILE=true;').replace('<title>卡律布狄斯</title>', '<title>卡律布狄斯 手机版</title>');

const head = extra => `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<meta name="theme-color" content="#0b0907">
<meta name="apple-mobile-web-app-capable" content="yes">
<style>body{margin:0}</style>${extra}
</head>
<body>
`;
const full = (s, extra = '') => head(extra) + s + '\n</body>\n</html>\n';

// offline: bundle the module script + three.js into one classic script
function offline(s) {
  const m = s.match(/<script type="importmap">[\s\S]*?<\/script>\s*<script type="module">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('module script not found');
  const tdir = path.join(root, 'tools');
  if (!fs.existsSync(path.join(tdir, 'node_modules/three')) || !fs.existsSync(path.join(tdir, 'node_modules/esbuild'))) {
    console.log('   installing three@0.160.0 + esbuild into tools/node_modules …');
    execFileSync('npm', ['i', '--no-save', '--prefix', tdir, 'three@0.160.0', 'esbuild@0.24.0'], { stdio: 'inherit', shell: true });
  }
  const entry = path.join(tdir, '.entry.js');
  fs.writeFileSync(entry, m[1]);
  const esb = path.join(tdir, 'node_modules/.bin/esbuild' + (process.platform === 'win32' ? '.cmd' : ''));
  const js = execFileSync(esb, [entry, '--bundle', '--format=iife', '--minify', '--target=es2020', '--log-level=warning'], { cwd: tdir, shell: true, maxBuffer: 64 << 20 }).toString();
  fs.unlinkSync(entry);
  return s.replace(m[0], () => '<script>\n' + js.replace(/<\/script/gi, '<\\/script') + '</script>');
}

const PHONE_JUMP = `\n<script>if(matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<760&&!/[?&]pc\\b/.test(location.search))location.replace('m.html'+location.search)</script>`;

console.log('building from game-src.html');
const mob = toMobile(src);
wr('charybdis.html', src);
wr('charybdis-mobile.html', mob);
wr('dist/卡律布狄斯-电脑版.html', full(src));
wr('dist/卡律布狄斯-手机版.html', full(mob));
wr('dist/卡律布狄斯-电脑版-离线.html', full(offline(src)));
wr('dist/卡律布狄斯-手机版-离线.html', full(offline(mob)));
wr('site/index.html', full(src, PHONE_JUMP));
wr('site/m.html', full(mob));

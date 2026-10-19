/**
 * Build, locally serve and screenshot every independently runnable project.
 * A demo appears in the public manifest only after its actual page renders.
 * Browser snapshots do not prove rights to external imagery or videos.
 * Canonical sources live under projects/<slug> rather than numbered folders.
 */
import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import { extname, resolve, join, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '..');
const site = join(root, 'site');
const catalog = JSON.parse(await fs.readFile(join(site, 'projects.json'), 'utf8'));
const oldSlugs = new Map([[1,'jack-portfolio'],[3,'prisma-landing'],[20,'axion-studio'],[22,'wanderful'],[28,'foundation']]);
const targets = catalog.map(p => ({
  id:p.id, title:p.title, dir:p.path, slug:oldSlugs.get(p.id) || p.path.split('/').at(-1),
}));
const slugs = targets.map(t=>t.slug);
if (new Set(slugs).size !== slugs.length || targets.length!==30) throw Error('Invalid unique target list');
const demoRoot = join(site, 'demos');
const previewRoot = join(site, 'previews');
const projectRoot = resolve(root, 'projects');
const safeSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
for (const target of targets) {
  const project = resolve(root, target.dir);
  const output = resolve(demoRoot, target.slug);
  if (!target.dir.startsWith('projects/') ||
      !project.startsWith(projectRoot + sep) ||
      !safeSlug.test(target.slug) ||
      !output.startsWith(demoRoot + sep)) {
    throw new Error('Unsafe project or demo path for project ' + target.id);
  }
}
await fs.mkdir(demoRoot, { recursive: true });
await fs.mkdir(previewRoot, { recursive: true });

function command(cmd,args,cwd,timeout=190000){
  return new Promise((resolve,reject)=>{
    let logs='', settled=false;
    const child=spawn(cmd,args,{cwd,env:{...process.env,CI:'true'},stdio:['ignore','pipe','pipe']});
    const timer=setTimeout(()=>{if(!settled){settled=true;child.kill('SIGTERM');reject(Error(cmd+' timed out in '+cwd))}},timeout);
    const collect=chunk=>{logs=(logs+chunk.toString()).slice(-3800)};
    child.stdout.on('data',collect);child.stderr.on('data',collect);
    child.on('error',e=>{if(!settled){settled=true;clearTimeout(timer);reject(e)}});
    child.on('close',code=>{if(!settled){settled=true;clearTimeout(timer);code===0?resolve():reject(Error(cmd+' '+args.join(' ')+' exited '+code+'\n'+logs))}});
  });
}
function wait(ms) { return new Promise(resolveWait => setTimeout(resolveWait, ms)); }

async function ready(url) {
  for (let attempt = 0; attempt < 65; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch { /* The server may still be starting. */ }
    await wait(300);
  }
  throw new Error('Local demo failed to respond: ' + url);
}

// Serve files in-process instead of resolving a server executable through PATH.
// Resolve real paths and support byte ranges for local video backgrounds.
async function startStaticServer(directory) {
  const rootDir = await fs.realpath(directory);
  const contentTypes = new Map([
    ['.html', 'text/html; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'],
    ['.mjs', 'text/javascript; charset=utf-8'], ['.css', 'text/css; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'], ['.svg', 'image/svg+xml'],
    ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.png', 'image/png'],
    ['.gif', 'image/gif'], ['.webp', 'image/webp'], ['.avif', 'image/avif'],
    ['.ico', 'image/x-icon'], ['.woff', 'font/woff'], ['.woff2', 'font/woff2'],
    ['.ttf', 'font/ttf'], ['.otf', 'font/otf'], ['.mp4', 'video/mp4'],
    ['.webm', 'video/webm'], ['.m4v', 'video/mp4'], ['.glb', 'model/gltf-binary'],
    ['.gltf', 'model/gltf+json'], ['.bin', 'application/octet-stream'],
  ]);
  const server = createServer(async (request, response) => {
    try {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { Allow: 'GET, HEAD' });
        response.end('Method not allowed');
        return;
      }
      const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
      let file = resolve(rootDir, '.' + pathname);
      if (file !== rootDir && !file.startsWith(rootDir + sep)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
      }
      let info = await fs.stat(file);
      if (info.isDirectory()) file = join(file, 'index.html');
      file = await fs.realpath(file);
      if (file !== rootDir && !file.startsWith(rootDir + sep)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
      }
      info = await fs.stat(file);
      const size = info.size;
      let start = 0;
      let end = size - 1;
      let statusCode = 200;
      const headers = {
        'Content-Type': contentTypes.get(extname(file).toLowerCase()) || 'application/octet-stream',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-store',
      };
      if (request.headers.range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
        if (!match || size === 0) {
          response.writeHead(416, { 'Content-Range': 'bytes */' + size });
          response.end();
          return;
        }
        if (match[1] === '') {
          const suffix = Number(match[2]);
          start = Math.max(0, size - suffix);
        } else {
          start = Number(match[1]);
          end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
        }
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) ||
            start < 0 || start >= size || end < start) {
          response.writeHead(416, { 'Content-Range': 'bytes */' + size });
          response.end();
          return;
        }
        statusCode = 206;
        headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + size;
      }
      headers['Content-Length'] = String(size === 0 ? 0 : end - start + 1);
      response.writeHead(statusCode, headers);
      if (request.method === 'HEAD' || size === 0) {
        response.end();
        return;
      }
      const stream = createReadStream(file, { start, end });
      stream.on('error', () => response.destroy());
      stream.pipe(response);
    } catch (error) {
      const statusCode = error.code === 'ENOENT' ? 404 : error.code === 'EACCES' ? 403 : 500;
      if (!response.headersSent) response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(statusCode === 404 ? 'Not found' : statusCode === 403 ? 'Forbidden' : 'Internal server error');
    }
  });
  await new Promise((resolveListen, rejectListen) => {
    server.once('error', rejectListen);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', rejectListen);
      resolveListen();
    });
  });
  return server;
}

const server = await startStaticServer(site);
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Could not determine local server address');
const origin = 'http://127.0.0.1:' + address.port;
let browser;
const captured = [];
const problems = [];
try {
  await ready(origin + '/');
  browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  let index=0;
  const workers=Array.from({length:Math.min(4,targets.length)},()=> (async()=>{
    while(index<targets.length){
      const target=targets[index++];
      const project=join(root,target.dir),output=join(demoRoot,target.slug);
      console.log('Building',target.id,target.title,target.dir);
      try {
        const pkg=await fs.stat(join(project,'package.json')).catch(()=>null);
        await fs.rm(output,{recursive:true,force:true});
        if(pkg?.isFile()){
          await command('npm',['install','--ignore-scripts','--prefer-offline','--no-audit','--no-fund'],project,240000);
          await command(process.execPath,[join(project,'node_modules/vite/bin/vite.js'),'build','--base=./'],project,150000);
          await fs.cp(join(project,'dist'),output,{recursive:true});
        }else{
          await fs.cp(project,output,{recursive:true,filter:p=> !p.split('/').some(part=>['node_modules','dist','.git'].includes(part))});
        }
        const url = origin + '/demos/' + target.slug + '/';
        await ready(url);
        const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
        try{
          const errors=[];page.on('pageerror',e=>errors.push(e.message.slice(0,120)));
          const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:22000});
          await page.waitForTimeout(1800);
          const data=await page.evaluate(()=>({
            chars:document.body?.innerText?.trim().length||0,
            brokenImages:[...document.images].filter(img=>img.complete&&img.naturalWidth===0).length,
            title:document.title,
          }));
          if (!response?.ok() || data.chars < 35 || errors.length) {
            throw new Error('Browser content gate: ' + JSON.stringify({ status: response?.status(), ...data, pageErrors: errors }));
          }
          const screenshot=join(previewRoot,target.slug+'.jpg');
          await page.screenshot({path:screenshot,type:'jpeg',quality:82,timeout:15000});
          const bytes=(await fs.stat(screenshot)).size;
          if (bytes < 8000) throw new Error('Screenshot unexpectedly small: ' + bytes);
          captured.push({id:target.id,image:'previews/'+target.slug+'.jpg',demo:'demos/'+target.slug+'/'});
          console.log('Verified',target.id,target.slug,'text chars',data.chars,'jpg',bytes,'broken img',data.brokenImages);
        }finally{await page.close()}
      }catch(e){
        const error=String(e).slice(-2200);
        console.warn('Failed to verify',target.id,target.slug,error);
        problems.push({id:target.id,slug:target.slug,error});
        await fs.rm(output,{recursive:true,force:true});
        await fs.rm(join(previewRoot,target.slug+'.jpg'),{force:true});
      }
    }
  })());
  await Promise.all(workers);
 } finally {
  if (browser) await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
captured.sort((a,b)=>a.id-b.id);
await fs.writeFile(join(previewRoot,'manifest.json'),JSON.stringify({captures:captured},null,2)+'\n');
console.log('Build report:', JSON.stringify({ total: targets.length, passed: captured.length, failed: problems.length, problems }));
if(captured.length!==targets.length)process.exitCode=1;

/**
 * Build, locally serve and screenshot every independently runnable project.
 * A demo appears in the public manifest only after its actual page renders.
 * Browser snapshots do not prove rights to external imagery or videos.
 * Canonical sources live under projects/<slug> rather than numbered folders.
 */
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { resolve, join } from 'node:path';
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
const demoRoot=join(site,'demos'), previewRoot=join(site,'previews');
await fs.mkdir(demoRoot,{recursive:true}); await fs.mkdir(previewRoot,{recursive:true});

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
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
async function ready(url){
  for(let i=0;i<65;i++){try{const r=await fetch(url);if(r.ok)return;}catch{} await wait(300)}
  throw Error('Local demo failed to respond: '+url);
}

const server=spawn('python3',['-m','http.server','4189','--bind','127.0.0.1','--directory',site],{cwd:root,stdio:'ignore'});
let browser;const captured=[],problems=[];
try{
  await ready('http://127.0.0.1:4189/');
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
        const url='http://127.0.0.1:4189/demos/'+target.slug+'/';
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
          if(!response?.ok() || data.chars<35 || errors.length) throw Error('Browser content gate: '+JSON.stringify({status:response?.status(),...data,pageErrors:errors}));
          const screenshot=join(previewRoot,target.slug+'.jpg');
          await page.screenshot({path:screenshot,type:'jpeg',quality:82,timeout:15000});
          const bytes=(await fs.stat(screenshot)).size;
          if(bytes<8000)throw Error('Screenshot unexpectedly small: '+bytes);
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
}finally{if(browser)await browser.close();server.kill();}
captured.sort((a,b)=>a.id-b.id);
await fs.writeFile(join(previewRoot,'manifest.json'),JSON.stringify({captures:captured},null,2)+'\n');
await fs.writeFile('/tmp/motionsites-build-report.json',JSON.stringify({total:targets.length,passed:captured.length,failed:problems.length,problems},null,2)+'\n');
console.log('Published preview candidates:',captured.length,'/',targets.length);
if(captured.length!==targets.length)process.exitCode=1;

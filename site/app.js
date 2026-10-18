// MotionSites Gallery. Actual browser captures are recorded in the CI-produced manifest.
const projects=[{"id":1,"path":"1/jack-portfolio","title":"Jack · 3D Creator","tag":"Framer Motion"},{"id":2,"path":"2","title":"Mainframe","tag":"React"},{"id":3,"path":"3/prisma-landing","title":"Prisma — Creative Studio","tag":"Framer Motion"},{"id":4,"path":"4","title":"Velorah","tag":"React"},{"id":5,"path":"5","title":"Password Manager","tag":"Framer Motion"},{"id":6,"path":"6","title":"Aethera","tag":"React"},{"id":7,"path":"7","title":"Venture — Space Travel","tag":"HTML"},{"id":8,"path":"8","title":"VEX","tag":"React"},{"id":9,"path":"10","title":"Forma","tag":"React"},{"id":10,"path":"11","title":"Asme","tag":"React"},{"id":11,"path":"12","title":"Orbis.Nft","tag":"React"},{"id":12,"path":"13","title":"VaultShield","tag":"Framer Motion"},{"id":13,"path":"14","title":"Asme (Motion)","tag":"Framer Motion"},{"id":14,"path":"15","title":"securify","tag":"React"},{"id":15,"path":"16","title":"CINEMATIC","tag":"React"},{"id":16,"path":"17","title":"LinkFlow","tag":"React"},{"id":17,"path":"18","title":"Motion Sites 18","tag":"React"},{"id":18,"path":"19","title":"RIVR","tag":"Motion"},{"id":19,"path":"20","title":"Nexora","tag":"Framer Motion"},{"id":20,"path":"21","title":"Axion Studio","tag":"GSAP"},{"id":21,"path":"21/9","title":"Axion Studio (subproject)","tag":"React"},{"id":22,"path":"22","title":"Wanderful","tag":"GSAP"},{"id":23,"path":"24/mindloop","title":"Mindloop","tag":"Framer Motion"},{"id":24,"path":"25","title":"Equilibrium","tag":"React"},{"id":25,"path":"26","title":"Xero","tag":"React"},{"id":26,"path":"27","title":"Duolingo — Style Guide","tag":"HTML"},{"id":27,"path":"28/newsletter-design","title":"Newsletter Design","tag":"React"},{"id":28,"path":"29","title":"Foundation — New Digital Epoch","tag":"Motion"},{"id":29,"path":"30","title":"dot.","tag":"Motion"},{"id":30,"path":"hero-liquid-glass","title":"Hero Liquid Glass","tag":"React"}];
const grid=document.getElementById('grid');
const search=document.getElementById('search');
const buttons=[...document.querySelectorAll('.chip')];
const counter=document.getElementById('counter');
let active='All';
let captures=new Map();
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const sourceURL=p=>'https://github.com/Jackxiaozhiren/MotionSites/tree/main/'+p.path.split('/').map(encodeURIComponent).join('/');
const gradients=['#54397f','#145e73','#733c64','#55406b','#29535b','#7c523b','#5e485c','#26535b'];
const conceptCover=p=>`<div class="cover cover--concept" style="--a:${gradients[p.id%gradients.length]}"><span class="concept-kicker">MOTION / ${pad(p.id)}</span><strong class="concept-title">${escapeHTML(p.title)}</strong><span class="cover-note">Concept artwork · not a screenshot</span></div>`;
const photoCover=(p,c)=>`<div class="cover cover--photo"><img loading="lazy" decoding="async" src="${c.image}" alt="Actual screenshot of ${escapeHTML(p.title)} captured from its running source project"><span class="cover-note">Actual project screenshot</span></div>`;
function render(){
  const q=search.value.trim().toLowerCase();
  const shown=projects
    .filter(p=>(active==='All'||p.tag===active)&&
      (p.title.toLowerCase().includes(q)||p.tag.toLowerCase().includes(q)||p.path.toLowerCase().includes(q)))
    .sort((a,b)=>Number(captures.has(b.id))-Number(captures.has(a.id)) || a.id-b.id);
  counter.textContent=shown.length+' of '+projects.length+' projects'+(captures.size?' · '+captures.size+' live previews':'');
  grid.innerHTML=shown.map(p=>{
    const c=captures.get(p.id);
    const cover=c?photoCover(p,c):conceptCover(p);
    const badge=c?'<span class="project-badge">Live demo</span>':'<span class="project-badge project-badge--neutral">Source only</span>';
    const demo=c?`<a class="open open--demo" target="_blank" rel="noopener noreferrer" href="${c.demo}" aria-label="Open live demo of ${escapeHTML(p.title)}">Explore live demo ↗</a>`:'';
    return `<article class="card">${cover}<div class="info"><div class="card-eyebrow"><span class="num">PROJECT ${pad(p.id)}</span>${badge}</div><h3>${escapeHTML(p.title)}</h3><div class="meta">${escapeHTML(p.tag)}</div><div class="card-actions">${demo}<a class="open" target="_blank" rel="noopener noreferrer" href="${sourceURL(p)}" aria-label="View source for ${escapeHTML(p.title)}">View source ↗</a></div></div></article>`;
  }).join('');
  document.getElementById('empty').hidden=shown.length!==0;
}
buttons.forEach(b=>b.addEventListener('click',()=>{
  active=b.dataset.tag;
  buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  render();
}));
search.addEventListener('input',render);
render();
(async function loadVerifiedCaptures(){
  try{
    const response=await fetch('previews/manifest.json',{cache:'no-store'});
    if(!response.ok)return;
    const manifest=await response.json();
    if(!Array.isArray(manifest.captures))return;
    captures=new Map(manifest.captures
      .filter(c=>Number.isInteger(c.id)&&/^previews\/[a-z0-9-]+\.webp$/.test(c.image)&&/^demos\/[a-z0-9-]+\/$/.test(c.demo))
      .map(c=>[c.id,c]));
    render();
  }catch(error){console.info('Project previews unavailable; showing concept covers.',error)}
})();

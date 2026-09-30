/* Page Builder plugin - visual page editor (Elementor-style) for this CMS */
(function(){
const BLOCKS={
'Heading + text':'<section class="sec"><div class="wrap ctr"><h2>Your heading</h2><p class="mut">Write your text here. Double-click to edit.</p></div></section>',
'Image + text':'<section class="sec"><div class="wrap two"><div><h2>Heading</h2><p class="mut">Write your text here.</p><a class="btn" href="#">Button →</a></div><img src="/img/about-main.svg" alt=""></div></section>',
'3 cards':'<section class="sec"><div class="wrap cards3"><div class="cardx"><i>⭐</i><h3>Title</h3><p class="mut">Text</p></div><div class="cardx"><i>🎓</i><h3>Title</h3><p class="mut">Text</p></div><div class="cardx"><i>💛</i><h3>Title</h3><p class="mut">Text</p></div></div></section>',
'Call to action':'<section class="sec"><div class="wrap"><div class="cta"><h2>Your heading</h2><p>Short text here.</p><a class="btn alt" href="#">Button</a></div></div></section>',
'Gallery':'<section class="sec"><div class="wrap gal"><img src="/img/gal1.svg" alt=""><img src="/img/gal2.svg" alt=""><img src="/img/gal3.svg" alt=""></div></section>',
'FAQ':'<section class="sec"><div class="wrap"><h2>FAQ</h2><details open><summary>Question one?</summary><p>Answer here.</p></details><details><summary>Question two?</summary><p>Answer here.</p></details></div></section>',
'Button':'<div class="wrap ctr" style="padding:1rem 0"><a class="btn" href="#">Click here</a></div>',
'Spacer':'<div style="height:60px"></div>'};
const hex=c=>{const m=(c||'').match(/\d+(\.\d+)?/g);if(!m||m.length<3||(m[3]!==undefined&&+m[3]===0))return '#ffffff';return '#'+m.slice(0,3).map(x=>(+x).toString(16).padStart(2,'0')).join('')};
const regions=(d,k)=>{const q=k=='header'?'[data-global=header]':'[data-global=footer]';const g=[...d.querySelectorAll(q)];if(g.length)return g;
 return (k=='header'?['.top','.hd','body>header']:['footer']).flatMap(s=>[...d.querySelectorAll(s)])};
CMS.registerTab({id:'builder',label:'Page Builder',icon:'🧱',async render(el){
 let fr,d,sel=null,hist=[],slugNow='';
 el.innerHTML=`<style>.kb{display:flex;gap:1rem;align-items:flex-start}.kb .cv{flex:1;min-width:0;background:#e7eaf1;border-radius:10px;padding:.5rem;text-align:center}.kb iframe{width:100%;height:78vh;margin:0 auto;display:block;transition:width .2s}.kb .pn{width:290px;flex:0 0 290px;max-height:80vh;overflow:auto}.kb .pn label{font-size:13px;margin:.6rem 0 .15rem}.kb .pn input,.kb .pn textarea,.kb .pn select{padding:.4rem}.kb .bt{display:flex;flex-wrap:wrap;gap:.3rem}.kb .bt button{padding:.3rem .55rem;font-size:13px}@media(max-width:900px){.kb{flex-direction:column}.kb .pn{width:100%;flex:none}}</style>
 <div class="card"><div class="row"><b>🧱 Page Builder</b><select id="kbPage" style="width:auto"></select>
 <button data-dv="100%">🖥️</button><button data-dv="768px">📱 Tablet</button><button data-dv="390px">📱 Mobile</button>
 <button id="kbUndo">↶ Undo</button><select id="kbAdd" style="width:auto"><option value="">+ Add block…</option>${Object.keys(BLOCKS).map(k=>'<option>'+k+'</option>').join('')}</select>
 <label style="margin:0;font-weight:400"><input type="checkbox" id="kbSync"> Apply header &amp; footer to all pages</label><button class="p" id="kbSave">Save page</button></div>
 <p class="mut" style="margin:.3rem 0 0">Click any part of the page to select it. Double-click text to type. Change colors, size and spacing on the right. Edit the header/footer here and tick "Apply header &amp; footer to all pages" before saving.</p></div>
 <div class="kb"><div class="cv"><iframe id="kbFrame" title="Builder"></iframe></div><div class="card pn" id="kbP"></div></div>`;
 const $=s=>el.querySelector(s);fr=$('#kbFrame');
 const snap=()=>{if(!d)return;const h=d.body.innerHTML.replace(/ ?kb-(sel|hover)/g,'');if(hist[hist.length-1]!==h){hist.push(h);if(hist.length>40)hist.shift()}};
 const dirs=(await CMS.ls('p')).filter(x=>x.type=='dir').map(x=>x.name);
 const ps=$('#kbPage');dirs.forEach(n=>ps.add(new Option('/p/'+n+'/',n)));
 if(!dirs.length){el.querySelector('#kbP').textContent='No pages yet. Create a page first.';return}
 async function load(n){slugNow=n;sel=null;hist=[];const t=await CMS.readText('p/'+n+'/index.html');
  const base=(typeof siteUrl!=='undefined'&&siteUrl)||location.origin;
  fr.onload=()=>{d=fr.contentDocument;const st=d.createElement('style');st.id='kb-style';st.textContent='.kb-hover{outline:2px dashed #3d5af1!important;outline-offset:-2px;cursor:pointer}.kb-sel{outline:3px solid #3d5af1!important;outline-offset:-3px}[contenteditable=true]{outline:3px solid #1fae6b!important}';d.head.append(st);
   d.addEventListener('mouseover',e=>{d.querySelectorAll('.kb-hover').forEach(x=>x.classList.remove('kb-hover'));if(e.target!==d.body&&e.target!==d.documentElement)e.target.classList.add('kb-hover')});
   d.addEventListener('click',e=>{if(e.target.isContentEditable)return;e.preventDefault();e.stopPropagation();pickEl(e.target)},true);
   d.addEventListener('dblclick',e=>{const t=e.target;if(t===d.body)return;snap();t.contentEditable='true';t.focus();t.addEventListener('blur',()=>{t.removeAttribute('contenteditable');panel()},{once:true})});
   panel()};
  fr.srcdoc=t.replace(/<head[^>]*>/i,m=>m+'<base data-kb href="'+base+'/">')}
 function pickEl(t){d.querySelectorAll('.kb-sel').forEach(x=>x.classList.remove('kb-sel'));sel=(t===d.body||t===d.documentElement)?null:t;if(sel)sel.classList.add('kb-sel');panel()}
 function panel(){const p=$('#kbP');p.innerHTML='';if(!sel){p.innerHTML='<p class="mut">Nothing selected. Click an element on the page.</p>';return}
  const cs=fr.contentWindow.getComputedStyle(sel),tag=sel.tagName.toLowerCase();
  const add=(h)=>{const w=document.createElement('div');w.innerHTML=h;p.append(...w.childNodes);return p};
  const btn=(t,f,c)=>{const b=document.createElement('button');b.textContent=t;if(c)b.className=c;b.onclick=()=>{snap();f()};return b};
  const bar=document.createElement('div');bar.className='bt';
  bar.append(btn('⬆ Parent',()=>{hist.pop();pickEl(sel.parentElement)}),btn('↑',()=>{const s=sel.previousElementSibling;if(s){s.before(sel);panel()}}),btn('↓',()=>{const s=sel.nextElementSibling;if(s){s.after(sel);panel()}}),btn('⧉ Copy',()=>{const c=sel.cloneNode(true);c.classList.remove('kb-sel');sel.after(c);pickEl(c)}),btn('🗑',()=>{const n=sel.parentElement;sel.remove();pickEl(n)},'d'));
  p.append('<'+tag+'> '+(sel.className||'').replace(/kb-\w+/g,''),bar);
  const fld=(label,node,ev,fn)=>{const l=document.createElement('label');l.textContent=label;node.addEventListener('focus',snap);node.addEventListener('mousedown',snap);node.addEventListener(ev||'input',()=>fn(node.value));p.append(l,node);return node};
  const inp=(type,val)=>{const i=document.createElement('input');i.type=type;i.value=val;return i};
  if(!sel.children.length&&!/^(img|hr|br)$/.test(tag)){const t=document.createElement('textarea');t.value=sel.textContent;fld('Text',t,'input',v=>sel.textContent=v)}
  const a=sel.closest('a');if(a)fld('Link URL',inp('text',a.getAttribute('href')||''),'input',v=>a.setAttribute('href',v));
  if(tag=='img'){fld('Image URL',inp('text',sel.getAttribute('src')||''),'input',v=>sel.setAttribute('src',v));p.append(btn('Choose photo',()=>CMS.pickPhoto(u=>{sel.setAttribute('src',u);panel()})))}
  fld('Text color',inp('color',hex(cs.color)),'input',v=>sel.style.color=v);
  fld('Background color',inp('color',hex(cs.backgroundColor)),'input',v=>sel.style.backgroundColor=v);p.append(btn('Clear background',()=>{sel.style.backgroundColor='';panel()}));
  fld('Font size (px)',inp('number',parseInt(cs.fontSize)||16),'input',v=>sel.style.fontSize=v+'px');
  fld('Padding (px)',inp('number',parseInt(cs.paddingTop)||0),'input',v=>sel.style.padding=v+'px');
  fld('Margin bottom (px)',inp('number',parseInt(cs.marginBottom)||0),'input',v=>sel.style.marginBottom=v+'px');
  fld('Corner radius (px)',inp('number',parseInt(cs.borderRadius)||0),'input',v=>sel.style.borderRadius=v+'px');
  const al=document.createElement('select');['left','center','right'].forEach(x=>al.add(new Option(x,x)));al.value=['left','center','right'].includes(cs.textAlign)?cs.textAlign:'left';fld('Text align',al,'change',v=>sel.style.textAlign=v);
  const h=document.createElement('textarea');h.style.minHeight='120px';h.style.fontFamily='monospace';h.value=sel.outerHTML.replace(/ ?kb-(sel|hover)/g,'').replace(/ class=""/g,'');
  fld('HTML of this element',h,'none',()=>{});p.append(btn('Apply HTML',()=>{const t=document.createElement('div');t.innerHTML=h.value;const n=t.firstElementChild;if(n){sel.replaceWith(n);pickEl(n)}}))}
 $('#kbUndo').onclick=()=>{if(!hist.length)return CMS.msg('Nothing to undo.');d.body.innerHTML=hist.pop();sel=null;panel()};
 $('#kbAdd').onchange=e=>{const k=e.target.value;if(!k)return;snap();let t=sel;
  if(t){while(t.parentElement&&t.parentElement!==d.body)t=t.parentElement;t.insertAdjacentHTML('afterend',BLOCKS[k])}
  else{const f=regions(d,'footer')[0];f?f.insertAdjacentHTML('beforebegin',BLOCKS[k]):d.body.insertAdjacentHTML('beforeend',BLOCKS[k])}
  e.target.value='';CMS.msg('Block added. Click it to edit.')};
 el.querySelectorAll('[data-dv]').forEach(b=>b.onclick=()=>fr.style.width=b.dataset.dv);
 const clean=()=>{const c=d.documentElement.cloneNode(true);
  c.querySelectorAll('#kb-style,base[data-kb]').forEach(x=>x.remove());
  c.querySelectorAll('[contenteditable]').forEach(x=>x.removeAttribute('contenteditable'));
  c.querySelectorAll('.kb-sel,.kb-hover').forEach(x=>{x.classList.remove('kb-sel','kb-hover');if(!x.className)x.removeAttribute('class')});
  c.querySelectorAll('#site-menu').forEach(x=>x.innerHTML='');
  return '<!DOCTYPE html>\n'+c.outerHTML};
 $('#kbSave').onclick=async()=>{try{
  if(sel){sel.classList.remove('kb-sel')}
  const html=clean(),files=[{path:'p/'+slugNow+'/index.html',text:html}];
  if((await CMS.readJson('homepage.json',{})).slug==slugNow)files.push({path:'index.html',text:html});
  let skipped=0;
  if($('#kbSync').checked){const src=new DOMParser().parseFromString(html,'text/html');
   for(const n of dirs){if(n==slugNow)continue;const o=new DOMParser().parseFromString(await CMS.readText('p/'+n+'/index.html'),'text/html');let ok=true;
    for(const k of ['header','footer']){const a=regions(src,k),b=regions(o,k);if(a.length&&a.length==b.length)b.forEach((x,i)=>x.replaceWith(a[i].cloneNode(true)));else ok=false}
    if(ok)files.push({path:'p/'+n+'/index.html',text:'<!DOCTYPE html>\n'+o.documentElement.outerHTML});else skipped++}}
  await CMS.commit(files,'Page Builder: edit '+slugNow);
  CMS.msg('Saved '+files.length+' file(s).'+(skipped?' '+skipped+' page(s) skipped (no matching header/footer).':'')+' Live in 1-2 minutes.')}catch(e){CMS.msg('Error: '+e.message)}};
 ps.onchange=()=>load(ps.value);load(dirs.includes('home')?'home':dirs[0]);ps.value=slugNow;
}});
})();

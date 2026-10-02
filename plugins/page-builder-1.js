/* Page Builder v2 - drag & drop visual editor plugin for this CMS */
(function(){
const PH='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#dfe3ec"/><text x="400" y="260" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#7c8697">Select me → Choose / Upload photo</text></svg>');
const col='<div class="kb-c" style="flex:1 1 280px;display:flex;flex-direction:column;gap:12px;padding:12px;min-width:0"></div>';
const row=n=>'<div class="kb-c" style="display:flex;flex-wrap:wrap;gap:24px;padding:16px">'+col.repeat(n)+'</div>';
const WID={
 'Layout':{'Section':['▭','<section class="kb-c" style="display:flex;flex-direction:column;gap:16px;padding:60px 24px"></section>'],
  'Container':['⬚','<div class="kb-c" style="display:flex;flex-direction:column;gap:16px;padding:16px"></div>'],
  '2 Columns':['◫',row(2)],'3 Columns':['▥',row(3)],'4 Columns':['▦',row(4)]},
 'Basic':{'Heading':['H','<h2 style="margin:0">Your heading here</h2>'],
  'Text':['¶','<p style="margin:0">Write your text here. Double-click to edit it.</p>'],
  'Image':['🖼️','<img src="'+PH+'" alt="" style="max-width:100%;height:auto;display:block">'],
  'Button':['🔘','<a href="#" style="display:inline-block;align-self:flex-start;background:#ff4a1c;color:#fff;padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:700">Click here</a>'],
  'Icon box':['⭐','<div style="text-align:center;padding:16px"><div style="font-size:42px">⭐</div><h3 style="margin:8px 0">Title</h3><p style="margin:0">Short description.</p></div>'],
  'Spacer':['↕','<div style="height:40px"></div>'],
  'Divider':['➖','<hr style="border:0;border-top:2px solid #ddd;margin:16px 0;width:100%">'],
  'Video':['▶️','<div style="position:relative;padding-top:56.25%;width:100%"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position:absolute;inset:0;width:100%;height:100%;border:0" allowfullscreen></iframe></div>'],
  'HTML':['</>','<div><p style="margin:0">Custom HTML — select and edit its HTML.</p></div>']},
 'Ready sections (theme)':{
  'Heading + text':['📝','<section class="sec"><div class="wrap ctr"><h2>Your heading</h2><p class="mut">Write your text here.</p></div></section>'],
  'Image + text':['🖼️','<section class="sec"><div class="wrap two"><div><h2>Heading</h2><p class="mut">Write your text here.</p><a class="btn" href="#">Button →</a></div><img src="/img/about-main.svg" alt=""></div></section>'],
  '3 cards':['🗂️','<section class="sec"><div class="wrap cards3"><div class="cardx"><i>⭐</i><h3>Title</h3><p class="mut">Text</p></div><div class="cardx"><i>🎓</i><h3>Title</h3><p class="mut">Text</p></div><div class="cardx"><i>💛</i><h3>Title</h3><p class="mut">Text</p></div></div></section>'],
  'Call to action':['📣','<section class="sec"><div class="wrap"><div class="cta"><h2>Your heading</h2><p>Short text here.</p><a class="btn alt" href="#">Button</a></div></div></section>'],
  'Gallery':['🏞️','<section class="sec"><div class="wrap gal"><img src="/img/gal1.svg" alt=""><img src="/img/gal2.svg" alt=""><img src="/img/gal3.svg" alt=""></div></section>'],
  'FAQ':['❓','<section class="sec"><div class="wrap"><h2>FAQ</h2><details open><summary>Question one?</summary><p>Answer here.</p></details><details><summary>Question two?</summary><p>Answer here.</p></details></div></section>']}};
const FONTS=['Default','Poppins','Inter','Montserrat','Roboto','Open Sans','Lato','Nunito','Fredoka','Raleway','Oswald','Playfair Display','Merriweather','Dancing Script','Georgia','Arial'];
const GF=new Set(['Poppins','Inter','Montserrat','Roboto','Open Sans','Lato','Nunito','Fredoka','Raleway','Oswald','Playfair Display','Merriweather','Dancing Script']);
const hex=c=>{const m=(c||'').match(/[\d.]+/g);if(!m||m.length<3||(m[3]!==undefined&&+m[3]===0))return '#ffffff';return '#'+m.slice(0,3).map(x=>Math.round(+x).toString(16).padStart(2,'0')).join('')};
const regions=(d,k)=>{const g=[...d.querySelectorAll(k=='header'?'[data-global=header]':'[data-global=footer]')];if(g.length)return g;return (k=='header'?['.top','.hd','body>header']:['footer']).flatMap(s=>[...d.querySelectorAll(s)])};
const CONT=/^(BODY|SECTION|DIV|ARTICLE|MAIN|ASIDE|HEADER|FOOTER|FORM)$/;
CMS.registerTab({id:'builder',label:'Page Builder',icon:'🧱',async render(el){
 let fr,d,sel=null,hist=[],fut=[],slugNow='',ptab='widgets',ind,tb,dragging=false;
 el.innerHTML=`<style>.kb{display:flex;gap:1rem;align-items:flex-start}.kb .cv{flex:1;min-width:0;background:#e7eaf1;border-radius:10px;padding:.5rem}.kb iframe{width:100%;height:78vh;margin:0 auto;display:block;transition:width .2s}.kb .pn{width:300px;flex:0 0 300px;max-height:82vh;overflow:auto;padding:.7rem}.kb .pn label{font-size:12px;margin:.5rem 0 .1rem;color:#7c8697}.kb .pn input,.kb .pn textarea,.kb .pn select{padding:.35rem;font-size:14px}.kb .pn input[type=color]{height:34px}.kb .bt{display:flex;flex-wrap:wrap;gap:.3rem}.kb .bt button{padding:.3rem .55rem;font-size:13px}.kb .tabs{display:flex;gap:.3rem;margin-bottom:.6rem}.kb .tabs button{flex:1}.kb .tabs .on{background:#3d5af1;color:#fff}.kb .tl{display:grid;grid-template-columns:1fr 1fr;gap:.4rem}.kb .tile{border:1px solid #e7eaf1;border-radius:8px;padding:.5rem .2rem;text-align:center;cursor:grab;font-size:12px;user-select:none;touch-action:none;background:#fff}.kb .tile:hover{border-color:#3d5af1}.kb .tile b{display:block;font-size:20px;font-weight:400}.kb .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:.25rem}.kb h4{margin:.9rem 0 .2rem;border-top:1px solid #e7eaf1;padding-top:.5rem;font-size:13px}#kbGhost{position:fixed;z-index:99999;background:#3d5af1;color:#fff;padding:.3rem .7rem;border-radius:8px;pointer-events:none;font-size:13px}@media(max-width:900px){.kb{flex-direction:column}.kb .pn{width:100%;flex:none;max-height:none}}</style>
 <div class="card"><div class="row"><b>🧱 Page Builder</b><select id="kbPage" style="width:auto"></select>
 <button data-dv="100%">🖥️ Desktop</button><button data-dv="768px">Tablet</button><button data-dv="390px">📱 Mobile</button>
 <button id="kbUndo">↶</button><button id="kbRedo">↷</button>
 <label style="margin:0;font-weight:400"><input type="checkbox" id="kbSync"> Apply header &amp; footer to all pages</label><button class="p" id="kbSave">Save page</button></div>
 <p class="mut" style="margin:.3rem 0 0">Drag a widget from the right panel onto the page (or just tap it to add). Click anything on the page to style it; drag the ✥ handle to move it. Double-click text to type.</p></div>
 <div class="kb"><div class="cv"><iframe id="kbFrame" title="Builder"></iframe></div><div class="card pn" id="kbP"></div></div>`;
 const $=s=>el.querySelector(s),P=$('#kbP');fr=$('#kbFrame');
 const snapHtml=()=>{const c=d.body.cloneNode(true);c.querySelectorAll('[contenteditable]').forEach(x=>x.removeAttribute('contenteditable'));c.querySelectorAll('.kb-sel,.kb-hover').forEach(x=>x.classList.remove('kb-sel','kb-hover'));return c.innerHTML};
 const snap=()=>{if(!d)return;const h=snapHtml();if(hist[hist.length-1]!==h){hist.push(h);if(hist.length>50)hist.shift();fut=[]}};
 const undo=()=>{if(!hist.length)return CMS.msg('Nothing to undo.');fut.push(snapHtml());d.body.innerHTML=hist.pop();pick(null)};
 const redo=()=>{if(!fut.length)return;hist.push(snapHtml());d.body.innerHTML=fut.pop();pick(null)};
 const dirs=(await CMS.ls('p')).filter(x=>x.type=='dir').map(x=>x.name);
 const ps=$('#kbPage');dirs.forEach(n=>ps.add(new Option('/p/'+n+'/',n)));
 if(!dirs.length){P.textContent='No pages yet. Create a page first.';return}
 const isC=n=>CONT.test(n.tagName)&&!(n.id||'').startsWith('kb-');
 const mk=h=>{const t=d.createElement('template');t.innerHTML=h;return t.content.firstElementChild};
 /* ---------- load page ---------- */
 async function load(n){slugNow=n;sel=null;hist=[];fut=[];const t=await CMS.readText('p/'+n+'/index.html');
  const base=(typeof siteUrl!=='undefined'&&siteUrl)||location.origin;
  fr.onload=()=>{d=fr.contentDocument;const st=d.createElement('style');st.id='kb-style';
   st.textContent='.kb-hover{outline:1px dashed #3d5af1!important;outline-offset:-1px}.kb-sel{outline:2px solid #3d5af1!important;outline-offset:-2px}[contenteditable=true]{outline:2px solid #1fae6b!important}.kb-c:empty{min-height:90px;outline:1px dashed #9aa6d8;outline-offset:-1px;position:relative}.kb-c:empty:before{content:"Drop widgets here";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#7c8ac0;font:13px sans-serif}iframe{pointer-events:none}*{scroll-behavior:auto!important}';
   d.head.append(st);
   ind=d.createElement('div');ind.id='kb-ind';ind.style.cssText='position:absolute;z-index:99998;background:#3d5af1;pointer-events:none;display:none';
   tb=d.createElement('div');tb.id='kb-tb';tb.style.cssText='position:absolute;z-index:99999;background:#3d5af1;color:#fff;border-radius:6px;display:none;font:13px sans-serif;white-space:nowrap';
   const tbtn=(t,f,title)=>{const b=d.createElement('span');b.textContent=t;b.title=title;b.style.cssText='display:inline-block;padding:3px 8px;cursor:pointer';b.onclick=ev=>{ev.stopPropagation();f()};tb.append(b);return b};
   const hd=tbtn('✥',()=>{},'Drag to move');hd.style.cursor='grab';hd.style.touchAction='none';hd.onpointerdown=e=>{if(sel)startDrag(e,hd,{node:sel,label:'Moving'})};
   tbtn('⬆',()=>sel&&sel.parentElement&&pick(sel.parentElement),'Select parent');
   tbtn('⧉',()=>{if(!sel)return;snap();const c=sel.cloneNode(true);c.classList.remove('kb-sel');sel.after(c);pick(c)},'Duplicate');
   tbtn('🗑',()=>{if(!sel)return;snap();const p=sel.parentElement;sel.remove();pick(p)},'Delete');
   d.documentElement.append(ind,tb);
   d.addEventListener('mouseover',e=>{if(dragging)return;d.querySelectorAll('.kb-hover').forEach(x=>x.classList.remove('kb-hover'));if(e.target!==d.body&&e.target!==d.documentElement&&!e.target.closest('#kb-tb'))e.target.classList.add('kb-hover')});
   d.addEventListener('click',e=>{if(e.target.closest('#kb-tb')||e.target.isContentEditable)return;e.preventDefault();e.stopPropagation();pick(e.target)},true);
   d.addEventListener('dblclick',e=>{const t=e.target;if(t===d.body||t.closest('#kb-tb'))return;snap();t.contentEditable='true';t.focus();t.addEventListener('blur',()=>{t.removeAttribute('contenteditable');side()},{once:true})});
   d.addEventListener('keydown',e=>{if(e.target.isContentEditable)return;if((e.key=='Delete'||e.key=='Backspace')&&sel){e.preventDefault();snap();const p=sel.parentElement;sel.remove();pick(p)}if((e.ctrlKey||e.metaKey)&&e.key=='z'){e.preventDefault();undo()}});
   fr.contentWindow.addEventListener('resize',place);side()};
  fr.srcdoc=t.replace(/<head[^>]*>/i,m=>m+'<base data-kb href="'+base+'/">')}
 function pick(t){if(!d)return;d.querySelectorAll('.kb-sel').forEach(x=>x.classList.remove('kb-sel'));sel=(!t||t===d.body||t===d.documentElement)?null:t;if(sel){sel.classList.add('kb-sel');ptab='style'}place();side()}
 function place(){if(!tb)return;if(!sel||!sel.isConnected){tb.style.display='none';return}const r=sel.getBoundingClientRect(),w=fr.contentWindow;tb.style.display='block';tb.style.left=Math.max(0,r.left+w.scrollX)+'px';tb.style.top=(r.top<30?r.top+w.scrollY+4:r.top+w.scrollY-26)+'px'}
 /* ---------- drag & drop ---------- */
 function locate(x,y,mv){let c=d.elementFromPoint(x,y)||d.body;while(c&&(!isC(c)||(mv&&(c===mv||mv.contains(c)))))c=c.parentElement;if(!c)c=d.body;
  const kids=[...c.children].filter(k=>!(k.id||'').startsWith('kb-')&&k!==mv&&!/^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(k.tagName)&&getComputedStyle(k).display!='none');
  if(!kids.length)return{c,mode:'in'};const cs=getComputedStyle(c),horiz=(cs.display.includes('flex')&&cs.flexDirection.startsWith('row'))||cs.display.includes('grid');
  let best=null,bd=1e12;for(const k of kids){const r=k.getBoundingClientRect(),dx=x<r.left?r.left-x:x>r.right?x-r.right:0,dy=y<r.top?r.top-y:y>r.bottom?y-r.bottom:0;if(dx*dx+dy*dy<bd){bd=dx*dx+dy*dy;best=k}}
  const r=best.getBoundingClientRect(),useX=horiz&&y>=r.top&&y<=r.bottom,before=useX?x<r.left+r.width/2:y<r.top+r.height/2;return{c,ref:best,before,useX,mode:'at'}}
 function showInd(t){const w=fr.contentWindow,s=ind.style;s.display='block';
  if(t.mode=='in'){const r=t.c.getBoundingClientRect();s.cssText+=';background:rgba(61,90,241,.15);outline:2px dashed #3d5af1;left:'+(r.left+w.scrollX)+'px;top:'+(r.top+w.scrollY)+'px;width:'+r.width+'px;height:'+r.height+'px';return}
  const r=t.ref.getBoundingClientRect();s.outline='none';s.background='#3d5af1';
  if(t.useX){s.left=(r.left+w.scrollX+(t.before?-2:r.width-2))+'px';s.top=(r.top+w.scrollY)+'px';s.width='4px';s.height=r.height+'px'}
  else{s.left=(r.left+w.scrollX)+'px';s.top=(r.top+w.scrollY+(t.before?-2:r.height-2))+'px';s.width=r.width+'px';s.height='4px'}}
 function startDrag(e,owner,o){e.preventDefault();e.stopPropagation();owner.setPointerCapture(e.pointerId);dragging=true;tb.style.display='none';
  const inParent=owner.ownerDocument!==d,x0=e.clientX,y0=e.clientY;let ghost,tgt=null,moved=false;
  if(inParent){ghost=document.createElement('div');ghost.id='kbGhost';ghost.textContent=o.label;document.body.append(ghost)}
  const pt=ev=>{if(!inParent)return{x:ev.clientX,y:ev.clientY};const r=fr.getBoundingClientRect();return{x:ev.clientX-r.left,y:ev.clientY-r.top}};
  const mv=ev=>{if(Math.abs(ev.clientX-x0)+Math.abs(ev.clientY-y0)>6)moved=true;if(ghost){ghost.style.left=ev.clientX+12+'px';ghost.style.top=ev.clientY+8+'px'}
   const p=pt(ev),W=fr.clientWidth,H=fr.clientHeight;
   if(p.x>=0&&p.y>=0&&p.x<=W&&p.y<=H){if(p.y<40)fr.contentWindow.scrollBy(0,-18);if(p.y>H-40)fr.contentWindow.scrollBy(0,18);tgt=locate(p.x,p.y,o.node);showInd(tgt)}else{tgt=null;ind.style.display='none'}};
  const up=ev=>{owner.removeEventListener('pointermove',mv);owner.removeEventListener('pointerup',up);if(ghost)ghost.remove();ind.style.display='none';dragging=false;
   try{owner.releasePointerCapture(ev.pointerId)}catch(_){}
   let n=o.node;
   if(tgt){snap();if(!n)n=mk(o.html);if(tgt.mode=='in')tgt.c.append(n);else tgt.before?tgt.ref.before(n):tgt.ref.after(n);pick(n)}
   else if(!moved&&o.html){snap();n=mk(o.html);const a=sel;if(a&&a.parentElement)a.after(n);else{const f=regions(d,'footer')[0];f?f.before(n):d.body.append(n)}pick(n);n.scrollIntoView({block:'nearest'})}
   else place()};
  owner.addEventListener('pointermove',mv);owner.addEventListener('pointerup',up)}
 /* ---------- side panel ---------- */
 const mkI=(type,val,ph)=>{const i=document.createElement('input');i.type=type;i.value=val==null?'':val;if(ph)i.placeholder=ph;return i};
 const mkS=(opts,val)=>{const s=document.createElement('select');opts.forEach(o=>{const[v,t]=Array.isArray(o)?o:[o,o];s.add(new Option(t,v))});s.value=val;return s};
 const btn=(t,f,c)=>{const b=document.createElement('button');b.textContent=t;if(c)b.className=c;b.onclick=f;return b};
 const grp=t=>{const h=document.createElement('h4');h.textContent=t;P.append(h)};
 const fld=(label,node,fn,ev)=>{const l=document.createElement('label');l.textContent=label;if(fn){node.addEventListener('focus',snap);node.addEventListener('mousedown',snap);node.addEventListener(ev||'input',()=>{fn(node.value);place()})}P.append(l,node);return node};
 const upload=(f,cb)=>{const r=new FileReader();r.onload=()=>{const go=(b64,ext,url)=>{const path='img/'+(CMS.slug(f.name.replace(/\.[^.]+$/,''))||'photo')+'-'+Date.now().toString(36)+'.'+ext;CMS.msg('Uploading…');CMS.commit([{path,b64}],'Upload '+f.name).then(()=>{cb('/'+path,url);CMS.msg('Uploaded. Shows on the live site in 1-2 minutes.')}).catch(e=>CMS.msg('Error: '+e.message))};
  if(/svg|gif/.test(f.type))return go(r.result.split(',')[1],f.name.split('.').pop().toLowerCase(),r.result);
  const im=new Image();im.onload=()=>{const s=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement('canvas'),png=f.type=='image/png';c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);const u=c.toDataURL(png?'image/png':'image/jpeg',.85);go(u.split(',')[1],png?'png':'jpg',u)};im.src=r.result};r.readAsDataURL(f)};
 const photoRow=(setFn)=>{const b=document.createElement('div');b.className='bt';const fi=mkI('file');fi.accept='image/*';fi.style.display='none';fi.onchange=()=>{if(fi.files[0]){snap();upload(fi.files[0],(path,url)=>setFn(path,url))}};
  b.append(btn('Choose from Media',()=>{snap();CMS.pickPhoto(u=>setFn(u,u))}),btn('⬆ Upload photo',()=>fi.click()),fi);P.append(b)};
 function side(){P.innerHTML='';const tabs=document.createElement('div');tabs.className='tabs';
  [['widgets','➕ Widgets'],['style','🎨 Style']].forEach(([k,t])=>{const b=btn(t,()=>{ptab=k;side()});if(ptab==k)b.className='on';tabs.append(b)});P.append(tabs);
  if(ptab=='widgets'||!sel)return ptab=='widgets'?widgets():(P.append('Click an element on the page to style it.'));style()}
 function widgets(){for(const g in WID){grp(g);const tl=document.createElement('div');tl.className='tl';for(const n in WID[g]){const[ic,html]=WID[g][n],t=document.createElement('div');t.className='tile';t.innerHTML='<b>'+ic+'</b>'+n;t.onpointerdown=e=>startDrag(e,t,{html,label:'+ '+n});tl.append(t)}P.append(tl)}}
 function style(){const w=fr.contentWindow,cs=w.getComputedStyle(sel),tag=sel.tagName.toLowerCase(),S=(p,v)=>sel.style[p]=v;
  const bar=document.createElement('div');bar.className='bt';bar.append('<'+tag+'> ',btn('⬆ Parent',()=>pick(sel.parentElement)),btn('⧉',()=>{snap();const c=sel.cloneNode(true);c.classList.remove('kb-sel');sel.after(c);pick(c)}),btn('↑',()=>{const s=sel.previousElementSibling;if(s){snap();s.before(sel);place()}}),btn('↓',()=>{const s=sel.nextElementSibling;if(s){snap();s.after(sel);place()}}),btn('🗑',()=>{snap();const p=sel.parentElement;sel.remove();pick(p)},'d'));P.append(bar);
  grp('Content');
  if(!sel.children.length&&!/^(img|hr|br|iframe)$/.test(tag))fld('Text',Object.assign(document.createElement('textarea'),{value:sel.textContent}),v=>sel.textContent=v);
  const a=sel.closest('a');if(a)fld('Link URL',mkI('text',a.getAttribute('href')||''),v=>a.setAttribute('href',v));
  if(tag=='img'){fld('Image URL',mkI('text',sel.getAttribute('src')&&sel.getAttribute('src').startsWith('data:')?'':sel.getAttribute('src')),v=>{sel.setAttribute('src',v);sel.removeAttribute('data-kb-src')});fld('Alt text',mkI('text',sel.alt),v=>sel.alt=v);photoRow((path,url)=>{sel.src=url;if(path!=url)sel.setAttribute('data-kb-src',path);else sel.removeAttribute('data-kb-src');side()})}
  const ifr=tag=='iframe'?sel:sel.querySelector('iframe');if(ifr)fld('Video / embed URL',mkI('text',ifr.getAttribute('src')),v=>ifr.setAttribute('src',v.replace(/watch\?v=/,'embed/')));
  grp('Typography');
  const cur=(cs.fontFamily||'').split(',')[0].replace(/["']/g,'').trim();fld('Font',mkS(FONTS,FONTS.includes(cur)?cur:'Default'),v=>{if(v=='Default')S('fontFamily','');else{S('fontFamily',"'"+v+"',sans-serif");if(GF.has(v)&&!d.querySelector('link[data-kb-font="'+v+'"]')){const l=d.createElement('link');l.rel='stylesheet';l.setAttribute('data-kb-font',v);l.href='https://fonts.googleapis.com/css2?family='+v.replace(/ /g,'+')+':wght@300;400;500;600;700;800&display=swap';d.head.append(l)}}},'change');
  fld('Size (px)',mkI('number',parseInt(cs.fontSize)),v=>S('fontSize',v+'px'));
  fld('Weight',mkS([300,400,500,600,700,800].map(String),String(Math.round(parseInt(cs.fontWeight)/100)*100)),v=>S('fontWeight',v),'change');
  fld('Line height',mkI('number',(parseFloat(cs.lineHeight)/parseFloat(cs.fontSize)||1.5).toFixed(2)),v=>S('lineHeight',v));
  fld('Letter spacing (px)',mkI('number',parseFloat(cs.letterSpacing)||0),v=>S('letterSpacing',v+'px'));
  fld('Text color',mkI('color',hex(cs.color)),v=>S('color',v));
  fld('Align',mkS(['left','center','right','justify'],['left','center','right','justify'].includes(cs.textAlign)?cs.textAlign:'left'),v=>S('textAlign',v),'change');
  grp('Background');
  fld('Color',mkI('color',hex(cs.backgroundColor)),v=>S('backgroundColor',v));P.append(btn('Clear color',()=>{snap();S('backgroundColor','');side()}));
  const bgset=(path,url)=>{sel.style.backgroundImage='url("'+url+'")';sel.style.backgroundSize=sel.style.backgroundSize||'cover';sel.style.backgroundPosition=sel.style.backgroundPosition||'center';if(path!=url)sel.setAttribute('data-kb-bg',path);else sel.removeAttribute('data-kb-bg');side()};
  photoRow(bgset);
  fld('Image size',mkS(['cover','contain','auto'],sel.style.backgroundSize||'cover'),v=>S('backgroundSize',v),'change');
  fld('Image position',mkS(['center','top','bottom','left','right'],sel.style.backgroundPosition||'center'),v=>S('backgroundPosition',v),'change');
  P.append(btn('Remove image',()=>{snap();S('backgroundImage','');sel.removeAttribute('data-kb-bg');side()}));
  grp('Layout');
  const g4=(lbl,pre)=>{const l=document.createElement('label');l.textContent=lbl+' (px)  top · right · bottom · left';const g=document.createElement('div');g.className='g4';['Top','Right','Bottom','Left'].forEach(s=>{const i=mkI('number',parseInt(cs[pre+s])||0);i.addEventListener('focus',snap);i.oninput=()=>{S(pre+s,i.value+'px');place()};g.append(i)});P.append(l,g)};
  g4('Padding','padding');g4('Margin','margin');
  fld('Width (e.g. 100%, 50%, 300px)',mkI('text',sel.style.width,'auto'),v=>S('width',v));
  fld('Max width',mkI('text',sel.style.maxWidth,'none'),v=>S('maxWidth',v));
  fld('Min height (px)',mkI('number',parseInt(sel.style.minHeight)||0),v=>S('minHeight',v+'px'));
  fld('Corner radius (px)',mkI('number',parseInt(cs.borderRadius)||0),v=>S('borderRadius',v+'px'));
  fld('Border width (px)',mkI('number',parseInt(cs.borderTopWidth)||0),v=>{S('borderWidth',v+'px');S('borderStyle','solid')});
  fld('Border color',mkI('color',hex(cs.borderTopColor)),v=>{S('borderColor',v);if(!sel.style.borderStyle)S('borderStyle','solid')});
  fld('Shadow',mkS([['','None'],['0 2px 10px rgba(0,0,0,.12)','Soft'],['0 10px 30px rgba(0,0,0,.25)','Strong']],sel.style.boxShadow||''),v=>S('boxShadow',v),'change');
  if(isC(sel)){grp('Container layout');
   fld('Direction',mkS([['column','Vertical ↓'],['row','Horizontal →']],cs.flexDirection.startsWith('row')?'row':'column'),v=>{S('display','flex');S('flexDirection',v);if(v=='row')S('flexWrap','wrap')},'change');
   fld('Gap (px)',mkI('number',parseInt(cs.rowGap)||0),v=>{S('display','flex');S('gap',v+'px')});
   fld('Justify',mkS(['flex-start','center','flex-end','space-between','space-around'],'flex-start'),v=>{S('display','flex');S('justifyContent',v)},'change');
   fld('Align items',mkS(['stretch','flex-start','center','flex-end'],'stretch'),v=>{S('display','flex');S('alignItems',v)},'change')}
  grp('Advanced');
  fld('CSS class',mkI('text',(sel.className||'').replace(/kb-(sel|hover)/g,'').trim()),v=>{sel.className=v+' kb-sel'});
  const h=Object.assign(document.createElement('textarea'),{value:sel.outerHTML.replace(/ ?kb-(sel|hover)/g,'').replace(/ class=""/g,'')});h.style.cssText='min-height:110px;font-family:monospace;font-size:12px';fld('HTML',h);
  P.append(btn('Apply HTML',()=>{snap();const n=mk(h.value);if(n){sel.replaceWith(n);pick(n)}}))}
 /* ---------- toolbar, save ---------- */
 $('#kbUndo').onclick=undo;$('#kbRedo').onclick=redo;
 el.querySelectorAll('[data-dv]').forEach(b=>b.onclick=()=>{fr.style.width=b.dataset.dv;setTimeout(place,250)});
 const clean=()=>{const c=d.documentElement.cloneNode(true);
  c.querySelectorAll('#kb-style,#kb-ind,#kb-tb,base[data-kb]').forEach(x=>x.remove());
  c.querySelectorAll('[contenteditable]').forEach(x=>x.removeAttribute('contenteditable'));
  c.querySelectorAll('.kb-sel,.kb-hover').forEach(x=>{x.classList.remove('kb-sel','kb-hover');if(!x.className.trim())x.removeAttribute('class')});
  c.querySelectorAll('[data-kb-src]').forEach(x=>{x.setAttribute('src',x.getAttribute('data-kb-src'));x.removeAttribute('data-kb-src')});
  c.querySelectorAll('[data-kb-bg]').forEach(x=>{x.style.backgroundImage='url("'+x.getAttribute('data-kb-bg')+'")';x.removeAttribute('data-kb-bg')});
  c.querySelectorAll('#site-menu').forEach(x=>x.innerHTML='');
  return '<!DOCTYPE html>\n'+c.outerHTML};
 $('#kbSave').onclick=async()=>{try{
  const html=clean(),files=[{path:'p/'+slugNow+'/index.html',text:html}];
  if((await CMS.readJson('homepage.json',{})).slug==slugNow)files.push({path:'index.html',text:html});
  let skipped=0;
  if($('#kbSync').checked){const src=new DOMParser().parseFromString(html,'text/html');
   for(const n of dirs){if(n==slugNow)continue;const o=new DOMParser().parseFromString(await CMS.readText('p/'+n+'/index.html'),'text/html');let ok=true;
    for(const k of ['header','footer']){const a=regions(src,k),b=regions(o,k);if(a.length&&a.length==b.length)b.forEach((x,i)=>x.replaceWith(a[i].cloneNode(true)));else ok=false}
    if(ok)files.push({path:'p/'+n+'/index.html',text:'<!DOCTYPE html>\n'+o.documentElement.outerHTML});else skipped++}}
  await CMS.commit(files,'Page Builder: edit '+slugNow);
  CMS.msg('Saved '+files.length+' file(s).'+(skipped?' '+skipped+' page(s) skipped (no matching header/footer).':'')+' Live in 1-2 minutes.')}catch(e){CMS.msg('Error: '+e.message)}};
 ps.onchange=()=>load(ps.value);ptab='widgets';load(dirs.includes('home')?'home':dirs[0]);ps.value=slugNow;side();
}});
})();

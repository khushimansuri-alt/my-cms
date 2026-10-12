/* Page Builder v2 - drag & drop visual editor plugin for this CMS */
(function(){
const PH='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#dfe3ec"/><text x="400" y="260" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#7c8697">Select me → Choose / Upload photo</text></svg>');
const uid=()=>Math.random().toString(36).slice(2,7);
const AV='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="#dfe3ec"/><circle cx="48" cy="38" r="16" fill="#aab4c8"/><rect x="20" y="58" width="56" height="44" rx="22" fill="#aab4c8"/></svg>');
const BTN=(t,bg,fg,hbg,bd)=>`<a class="kb-btn" href="#" style="--bg:${bg||'#ff4a1c'};--fg:${fg||'#ffffff'};--hbg:${hbg||'#d93a10'};--hfg:${fg||'#ffffff'};--bd:${bd||'transparent'}">${t}</a>`;
const STAR='<div class="kb-stars">★★★★★</div>';
const TESTI=(q,n,r)=>`<div class="kb-card kb-testi">${STAR}<p class="q">${q}</p><div class="who"><img src="${AV}" alt=""><div><b>${n}</b><br><small>${r}</small></div></div></div>`;
const T3=()=>TESTI('Excellent school! My child has grown in confidence and loves going every day.','Parent Name','Parent')+TESTI('Caring teachers and a safe campus. Highly recommended for every family.','Parent Name','Parent')+TESTI('Great activities and a wonderful learning environment.','Parent Name','Parent');
const col=(st)=>'<div class="kb-c kb-col" style="'+(st||'flex:1 1 280px')+';display:flex;flex-direction:column;gap:12px;padding:12px;min-width:0"></div>';
const row=(...c)=>'<div class="kb-c kb-row" style="display:flex;flex-wrap:wrap;gap:24px;padding:16px">'+c.join('')+'</div>';
const cw=(p,g)=>'flex:0 0 calc('+p+'% - '+(g*(1-p/100)).toFixed(1)+'px)';
const SEC=(inner,st,ist)=>'<section class="kb-c kb-sec" style="padding:60px 24px;'+(st||'')+'"><div class="kb-c kb-inner" style="max-width:1140px;margin:0 auto;display:flex;flex-direction:column;gap:16px;'+(ist||'')+'">'+(inner||'')+'</div></section>';
const IBOX=(i,t)=>`<div style="text-align:center;padding:16px"><div style="font-size:42px">${i}</div><h3 style="margin:8px 0">${t}</h3><p style="margin:0">Short description of this feature.</p></div>`;
const WID={
 'Layout':{'Section':['▭',SEC()],'Container':['⬚','<div class="kb-c" style="display:flex;flex-direction:column;gap:16px;padding:16px"></div>'],
  '2 Columns':['◫',row(col(),col())],'3 Columns':['▥',row(col(),col(),col())],'4 Columns':['▦',row(col(),col(),col(),col())],
  '66 / 33':['◧',row(col(cw(66.66,24)),col(cw(33.33,24)))],'33 / 66':['◨',row(col(cw(33.33,24)),col(cw(66.66,24)))]},
 'Basic':{'Heading':['H','<h2 style="margin:0">Your heading here</h2>'],
  'Text':['¶','<p style="margin:0">Write your text here. Double-click to edit it.</p>'],
  'Image':['🖼️','<img src="'+PH+'" alt="" style="max-width:100%;height:auto;display:block">'],
  'Button':['🔘',BTN('Click here')],
  'Button group':['🔘🔘','<div style="display:flex;flex-wrap:wrap;gap:12px">'+BTN('Get started')+BTN('Learn more','transparent','#ff4a1c','#ff4a1c','#ff4a1c')+'</div>'],
  'Icon box':['⭐',IBOX('⭐','Title')],
  'Image box':['🖼️','<div class="kb-card" style="text-align:center"><img src="'+PH+'" alt="" style="max-width:100%;border-radius:12px"><h3 style="margin:12px 0 6px">Title</h3><p style="margin:0">Description goes here.</p></div>'],
  'Icon list':['✅','<ul class="kb-ilist"><li><span>✅</span><span>First list item</span></li><li><span>✅</span><span>Second list item</span></li><li><span>✅</span><span>Third list item</span></li></ul>'],
  'Star rating':['⭐',STAR],
  'Social icons':['🔗','<div class="kb-soc"><a href="#">f</a><a href="#">in</a><a href="#">yt</a><a href="#">ig</a></div>'],
  'Alert':['⚠️','<div class="kb-alert"><b>Note:</b> Write an important message here.</div>'],
  'Counter':['🔢','<div class="kb-cnt"><b>500+</b><span>Happy students</span></div>'],
  'Progress bar':['📊','<div><div style="display:flex;justify-content:space-between;font-weight:700"><span>Skill name</span><span>80%</span></div><div class="kb-prog"><i style="width:80%"></i></div></div>'],
  'Spacer':['↕','<div style="height:40px"></div>'],'Divider':['➖','<hr style="border:0;border-top:2px solid #ddd;margin:16px 0;width:100%">'],
  'Video':['▶️','<div style="position:relative;padding-top:56.25%;width:100%"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position:absolute;inset:0;width:100%;height:100%;border:0" allowfullscreen></iframe></div>'],
  'HTML':['</>','<div><p style="margin:0">Custom HTML — select and edit its HTML.</p></div>']},
 'Reviews & testimonials':{'Testimonial':['💬',TESTI('Write the customer review here. Double-click to edit.','Customer Name','Designation')],
  'Testimonial slider':['🎠',()=>'<div class="kb-car">'+T3()+'</div>'],
  'Reviews grid':['🌟',()=>'<div style="width:100%"><div style="text-align:center;margin-bottom:20px">'+STAR+'<b>4.9 rating from 799+ Google reviews</b></div><div class="kb-grid">'+T3()+'</div></div>']},
 'Business':{'Pricing table':['💰',()=>'<div class="kb-grid">'+['Basic|₹999','Standard|₹1,999','Premium|₹2,999'].map(x=>{const[a,b]=x.split('|');return '<div class="kb-price"><h3>'+a+'</h3><div class="pr">'+b+'</div><small>per month</small><ul><li>Feature one</li><li>Feature two</li><li>Feature three</li></ul>'+BTN('Choose plan')+'</div>'}).join('')+'</div>'],
  'Team member':['🧑‍🏫','<div class="kb-card" style="text-align:center"><img src="'+AV+'" alt="" style="width:120px;height:120px;border-radius:50%;margin:0 auto 12px;object-fit:cover"><h3 style="margin:0">Name Surname</h3><small>Designation</small><div class="kb-soc" style="justify-content:center;margin-top:12px"><a href="#">f</a><a href="#">in</a></div></div>'],
  'Accordion (FAQ)':['❓','<div class="kb-acc"><details open><summary>Question one?</summary><p>Answer goes here.</p></details><details><summary>Question two?</summary><p>Answer goes here.</p></details><details><summary>Question three?</summary><p>Answer goes here.</p></details></div>'],
  'Tabs':['🗂️',()=>{const u=uid();return '<div class="kb-tabs">'+[1,2,3].map(i=>'<input type="radio" name="t'+u+'" id="t'+u+i+'"'+(i==1?' checked':'')+'><label for="t'+u+i+'">Tab '+i+'</label>').join('')+[1,2,3].map(i=>'<div class="p"><p>Content of tab '+i+'. Edit this text.</p></div>').join('')+'</div>'}],
  'Contact form':['✉️',`<form class="kb-form" data-wa="919039000822" onsubmit="event.preventDefault();var f=this;window.open('https://wa.me/'+f.dataset.wa+'?text='+encodeURIComponent('Name: '+f.n.value+'\\nPhone: '+f.t.value+'\\n'+f.m.value),'_blank')"><input name="n" placeholder="Your name" required><input name="t" placeholder="Phone number" required><textarea name="m" placeholder="Message"></textarea>${BTN('Send message').replace('<a class="kb-btn" href="#"','<button type="submit" class="kb-btn"').replace('</a>','</button>')}</form>`],
  'Google map':['📍','<iframe src="https://www.google.com/maps?q=India&output=embed" style="width:100%;height:320px;border:0;border-radius:12px" loading="lazy"></iframe>'],
  'Image gallery':['🏞️','<div class="kb-grid kb-gal">'+('<img src="'+PH+'" alt="">').repeat(6)+'</div>']},
 'Ready sections':{
  'Hero':['🦸',SEC('<h1 style="margin:0;font-size:3rem">Your big headline here</h1><p style="max-width:640px;margin:0">A short description that tells visitors what you do.</p>'+BTN('Get started'),'padding:90px 24px;background:#fff2cc;text-align:center','align-items:center')],
  'Call to action':['📣',SEC('<h2 style="margin:0">Ready to get started?</h2><p style="margin:0">Short supporting text goes here.</p>'+BTN('Contact us','#ffffff','#ff4a1c','#f0f0f0'),'background:#ff4a1c;color:#fff;text-align:center','align-items:center')],
  'Features (3)':['🧩',SEC(row(col(),col(),col()).replace(/<div class="kb-c kb-col"([^>]*)><\/div>/g,(m,a)=>'<div class="kb-c kb-col"'+a+'>'+IBOX('⭐','Feature title')+'</div>')),'']},
 'Theme blocks (GVN theme)':{
  'Heading + text':['📝','<section class="sec"><div class="wrap ctr"><h2>Your heading</h2><p class="mut">Write your text here.</p></div></section>'],
  'Image + text':['🖼️','<section class="sec"><div class="wrap two"><div><h2>Heading</h2><p class="mut">Write your text here.</p><a class="btn" href="#">Button →</a></div><img src="/img/about-main.svg" alt=""></div></section>'],
  '3 cards':['🗂️','<section class="sec"><div class="wrap cards3"><div class="cardx"><i>⭐</i><h3>Title</h3><p class="mut">Text</p></div><div class="cardx"><i>🎓</i><h3>Title</h3><p class="mut">Text</p></div><div class="cardx"><i>💛</i><h3>Title</h3><p class="mut">Text</p></div></div></section>'],
  'Gallery':['🏞️','<section class="sec"><div class="wrap gal"><img src="/img/gal1.svg" alt=""><img src="/img/gal2.svg" alt=""><img src="/img/gal3.svg" alt=""></div></section>']}};
const WCSS=`.kb-btn{display:inline-block;align-self:flex-start;background:var(--bg,#ff4a1c);color:var(--fg,#fff);padding:14px 28px;border-radius:40px;text-decoration:none;font-weight:700;border:2px solid var(--bd,transparent);cursor:pointer;font-family:inherit;font-size:16px;transition:.2s}.kb-btn:hover{background:var(--hbg,var(--bg,#ff4a1c));color:var(--hfg,var(--fg,#fff))}
.kb-card{background:#fff;border-radius:16px;padding:24px;box-shadow:0 4px 18px rgba(0,0,0,.08)}.kb-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;width:100%}.kb-gal img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:14px}
.kb-stars{color:#ffb400;letter-spacing:2px;font-size:20px}.kb-testi .q{margin:12px 0;font-size:1.02rem}.kb-testi .who{display:flex;align-items:center;gap:12px}.kb-testi .who img{width:48px;height:48px;border-radius:50%;object-fit:cover}
.kb-car{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px 2px 16px;width:100%}.kb-car>*{flex:0 0 min(360px,85%);scroll-snap-align:start}
.kb-price{text-align:center;border:2px solid #eee;border-radius:18px;padding:28px;background:#fff}.kb-price .pr{font-size:2.6rem;font-weight:800;line-height:1.2}.kb-price ul{list-style:none;padding:0;margin:16px 0}.kb-price li{padding:7px 0;border-bottom:1px solid #f0f0f0}
.kb-prog{background:#eee;border-radius:99px;height:12px;overflow:hidden}.kb-prog i{display:block;height:100%;background:#ff4a1c;border-radius:99px}.kb-cnt{text-align:center}.kb-cnt b{display:block;font-size:3rem;line-height:1.1;color:#ff4a1c}
.kb-alert{padding:14px 18px;border-radius:10px;background:#fff3cd;border-left:5px solid #ffb400}.kb-ilist{list-style:none;padding:0;margin:0}.kb-ilist li{padding:6px 0;display:flex;gap:10px}
.kb-soc{display:flex;gap:10px}.kb-soc a{width:40px;height:40px;border-radius:50%;background:#1f1f3d;color:#fff;display:flex;align-items:center;justify-content:center;text-decoration:none;font-weight:700}
.kb-acc details{border:1px solid #eee;border-radius:10px;padding:12px 16px;margin-bottom:10px;background:#fff}.kb-acc summary{font-weight:700;cursor:pointer}.kb-acc p{margin:10px 0 0}
.kb-tabs>input{display:none}.kb-tabs>label{display:inline-block;padding:10px 18px;border-bottom:3px solid transparent;cursor:pointer;font-weight:700}.kb-tabs>.p{display:none;padding:18px 0}
.kb-tabs>input:nth-of-type(1):checked~label:nth-of-type(1),.kb-tabs>input:nth-of-type(2):checked~label:nth-of-type(2),.kb-tabs>input:nth-of-type(3):checked~label:nth-of-type(3){border-color:#ff4a1c;color:#ff4a1c}
.kb-tabs>input:nth-of-type(1):checked~.p:nth-of-type(1),.kb-tabs>input:nth-of-type(2):checked~.p:nth-of-type(2),.kb-tabs>input:nth-of-type(3):checked~.p:nth-of-type(3){display:block}
.kb-form{display:grid;gap:12px;max-width:560px;width:100%}.kb-form input,.kb-form textarea{width:100%;padding:12px 14px;border:1.5px solid #ddd;border-radius:10px;font:inherit}.kb-form textarea{min-height:110px}
@media(max-width:768px){.kb-col{flex:1 1 100%!important;max-width:100%!important}body:not(.kb-edit) .kb-hm{display:none!important}}
@media(min-width:769px) and (max-width:1024px){body:not(.kb-edit) .kb-ht{display:none!important}}@media(min-width:1025px){body:not(.kb-edit) .kb-hd{display:none!important}}`;
const ensureCss=doc=>{let x=doc.querySelector('style[data-kb-wcss]');if(!x){x=doc.createElement('style');x.setAttribute('data-kb-wcss','');doc.head.append(x)}x.textContent=WCSS};
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
   d.head.append(st);ensureCss(d);d.body.classList.add('kb-edit');
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
 function locate(x,y,mv){let c=d.elementFromPoint(x,y)||d.body;while(c&&(!isC(c)||(mv&&(c===mv||mv.contains(c)))))c=c.parentElement;if(!c)c=d.body;if(c.classList.contains('kb-sec')){const inn=[...c.children].find(k=>k.classList.contains('kb-inner'));if(inn)c=inn}
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
   if(tgt){snap();if(!n)n=mk(typeof o.html=='function'?o.html():o.html);if(tgt.mode=='in')tgt.c.append(n);else tgt.before?tgt.ref.before(n):tgt.ref.after(n);pick(n)}
   else if(!moved&&o.html){snap();n=mk(typeof o.html=='function'?o.html():o.html);const a=sel;if(a&&a.parentElement)a.after(n);else{const f=regions(d,'footer')[0];f?f.before(n):d.body.append(n)}pick(n);n.scrollIntoView({block:'nearest'})}
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
 function widgets(){const q=document.createElement('input');q.placeholder='🔍 Search widgets…';P.append(q);const gs=[];
  for(const g in WID){const h=document.createElement('h4');h.textContent=g;P.append(h);const tl=document.createElement('div');tl.className='tl';const tiles=[];
   for(const n in WID[g]){const[ic,html]=WID[g][n],t=document.createElement('div');t.className='tile';t.dataset.n=n.toLowerCase();t.innerHTML='<b>'+ic+'</b>'+n;t.onpointerdown=e=>startDrag(e,t,{html,label:'+ '+n});tl.append(t);tiles.push(t)}P.append(tl);gs.push([h,tl,tiles])}
  q.oninput=()=>{const v=q.value.toLowerCase();gs.forEach(([h,tl,ts])=>{let k=0;ts.forEach(t=>{const m=t.dataset.n.includes(v);t.style.display=m?'':'none';if(m)k++});h.style.display=tl.style.display=k?'':'none'})}}
 function style(){const w=fr.contentWindow,cs=w.getComputedStyle(sel),tag=sel.tagName.toLowerCase(),S=(p,v)=>sel.style[p]=v;
  const bar=document.createElement('div');bar.className='bt';bar.append('<'+tag+'> ',btn('⬆ Parent',()=>pick(sel.parentElement)),btn('⧉',()=>{snap();const c=sel.cloneNode(true);c.classList.remove('kb-sel');sel.after(c);pick(c)}),btn('↑',()=>{const s=sel.previousElementSibling;if(s){snap();s.before(sel);place()}}),btn('↓',()=>{const s=sel.nextElementSibling;if(s){snap();s.after(sel);place()}}),btn('🗑',()=>{snap();const p=sel.parentElement;sel.remove();pick(p)},'d'));P.append(bar);
  grp('Content');
  const kbB=sel.closest('.kb-btn');
  if(kbB){const B=kbB,V=(k,v)=>B.style.setProperty(k,v),gv=(k,d)=>B.style.getPropertyValue(k).trim()||d,hx=v=>/^#[0-9a-f]{6}$/i.test(v)?v:hex(v);
   fld('Button style',mkS([['','Choose preset…'],['primary','Primary (filled)'],['outline','Outline'],['dark','Dark'],['green','Green'],['light','Light']],''),v=>{const m={primary:['#ff4a1c','#ffffff','#d93a10','#ffffff','transparent'],outline:['transparent','#ff4a1c','#ff4a1c','#ffffff','#ff4a1c'],dark:['#1f1f3d','#ffffff','#000000','#ffffff','transparent'],green:['#1fae6b','#ffffff','#17925a','#ffffff','transparent'],light:['#ffffff','#1f1f3d','#f0f0f0','#1f1f3d','#dddddd']}[v];if(m){['--bg','--fg','--hbg','--hfg','--bd'].forEach((k,i)=>V(k,m[i]));side()}},'change');
   fld('Button size',mkS([['','Choose…'],['s','Small'],['m','Medium'],['l','Large']],''),v=>{const m={s:['8px 18px','14px'],m:['14px 28px','16px'],l:['18px 40px','19px']}[v];if(m){B.style.padding=m[0];B.style.fontSize=m[1];side()}},'change');
   [['Button background','--bg','#ff4a1c'],['Button text color','--fg','#ffffff'],['Hover background','--hbg','#d93a10'],['Hover text color','--hfg','#ffffff'],['Border color','--bd','#ff4a1c']].forEach(([l,k,dv])=>fld(l,mkI('color',hx(gv(k,dv))),v=>V(k,v)));
   const fw=document.createElement('input');fw.type='checkbox';fw.checked=B.style.display=='block';fw.onchange=()=>{snap();B.style.display=fw.checked?'block':'';B.style.alignSelf=fw.checked?'stretch':'';B.style.textAlign=fw.checked?'center':''};const fl=document.createElement('label');fl.style.cssText='display:flex;gap:.4rem;align-items:center;font-size:13px';fl.append(fw,'Full width button');P.append(fl);
   const nt=document.createElement('input');nt.type='checkbox';nt.checked=B.target=='_blank';nt.onchange=()=>{snap();if(nt.checked){B.target='_blank';B.rel='noopener'}else{B.removeAttribute('target');B.removeAttribute('rel')}};const nl=document.createElement('label');nl.style.cssText='display:flex;gap:.4rem;align-items:center;font-size:13px';nl.append(nt,'Open link in new tab');P.append(nl)}
  const fm=sel.closest('form[data-wa]');if(fm)fld('WhatsApp number (with country code)',mkI('text',fm.dataset.wa),v=>fm.dataset.wa=v.replace(/\D/g,''));
  if(/^(H[1-6]|P|SPAN)$/i.test(tag)||(tag=='div'&&!sel.children.length&&!sel.classList.contains('kb-c')))fld('HTML tag',mkS(['h1','h2','h3','h4','h5','h6','p','div','span'],tag),v=>{const n=d.createElement(v);[...sel.attributes].forEach(a=>n.setAttribute(a.name,a.value));n.innerHTML=sel.innerHTML;sel.replaceWith(n);pick(n)},'change');
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
  fld('Text transform',mkS(['none','uppercase','capitalize','lowercase'],cs.textTransform),v=>S('textTransform',v),'change');
  fld('Font style',mkS([['normal','Normal'],['italic','Italic']],cs.fontStyle=='italic'?'italic':'normal'),v=>S('fontStyle',v),'change');
  grp('Background');
  fld('Color',mkI('color',hex(cs.backgroundColor)),v=>S('backgroundColor',v));P.append(btn('Clear color',()=>{snap();S('backgroundColor','');side()}));
  const bgset=(path,url)=>{sel.style.backgroundImage='url("'+url+'")';sel.style.backgroundSize=sel.style.backgroundSize||'cover';sel.style.backgroundPosition=sel.style.backgroundPosition||'center';if(path!=url)sel.setAttribute('data-kb-bg',path);else sel.removeAttribute('data-kb-bg');side()};
  photoRow(bgset);
  fld('Image size',mkS(['cover','contain','auto'],sel.style.backgroundSize||'cover'),v=>S('backgroundSize',v),'change');
  fld('Image position',mkS(['center','top','bottom','left','right'],sel.style.backgroundPosition||'center'),v=>S('backgroundPosition',v),'change');
  P.append(btn('Remove image',()=>{snap();S('backgroundImage','');sel.removeAttribute('data-kb-bg');side()}));
  grp('Gradient & overlay');
  const gc1=mkI('color','#ff4a1c'),gc2=mkI('color','#ffb400'),ga=mkI('number',135),gap=()=>S('backgroundImage','linear-gradient('+ga.value+'deg,'+gc1.value+','+gc2.value+')');
  [['Gradient color 1',gc1],['Gradient color 2',gc2],['Gradient angle (deg)',ga]].forEach(([l,n])=>fld(l,n,gap));
  const oc=mkI('color','#000000'),oo=mkI('range',0);oo.min=0;oo.max=90;oo.value=0;
  const ov=()=>{const h=oc.value,r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);S('boxShadow',+oo.value>0?'inset 0 0 0 9999px rgba('+r+','+g+','+b+','+oo.value/100+')':'')};
  fld('Overlay color (on top of background image)',oc,ov);fld('Overlay strength %',oo,ov);
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
  const par=sel.parentElement,pcs=par?w.getComputedStyle(par):null,inRow=pcs&&pcs.display.includes('flex')&&pcs.flexDirection.startsWith('row');
  if(isC(sel)){grp('Container width');
   const bw=sel.style.maxWidth&&sel.style.maxWidth!='none'?'b:'+sel.style.maxWidth:'full';
   fld('Width type',mkS([['full','Full width'],['b:1140px','Boxed 1140px'],['b:960px','Boxed 960px'],['b:720px','Boxed 720px'],['b:540px','Boxed 540px']],['full','b:1140px','b:960px','b:720px','b:540px'].includes(bw)?bw:'full'),v=>{if(v=='full'){S('maxWidth','');S('marginLeft','');S('marginRight','');S('width','')}else{S('maxWidth',v.slice(2));S('marginLeft','auto');S('marginRight','auto');S('width','100%')}},'change');
   fld('Content width (px) — type any value',mkI('number',parseInt(sel.style.maxWidth)||''),v=>{if(v){S('maxWidth',v+'px');S('marginLeft','auto');S('marginRight','auto');S('width','100%')}});
   fld('Height',mkS([['','Auto (fit content)'],['100vh','Full screen'],['70vh','70% of screen'],['50vh','50% of screen'],['400px','400px']],sel.style.minHeight||''),v=>S('minHeight',v),'change');
   fld('Wrap items',mkS(['wrap','nowrap'],cs.flexWrap=='nowrap'?'nowrap':'wrap'),v=>{S('display','flex');S('flexWrap',v)},'change')}
  if(inRow){grp('Column width');
   fld('Width',mkS([['','Auto'],['100','100%'],['83.33','83%'],['75','75%'],['66.66','66%'],['50','50%'],['33.33','33%'],['25','25%'],['20','20%']],''),v=>{const g=parseFloat(pcs.columnGap)||0;if(!v)S('flex','1 1 280px');else S('flex','0 0 calc('+v+'% - '+(g*(1-v/100)).toFixed(1)+'px)');sel.classList.add('kb-col')},'change');
   const st=document.createElement('input');st.type='checkbox';st.checked=sel.classList.contains('kb-col');st.onchange=()=>{snap();sel.classList.toggle('kb-col',st.checked)};const lb=document.createElement('label');lb.style.cssText='display:flex;gap:.4rem;align-items:center;font-size:13px';lb.append(st,'Stack on mobile');P.append(lb)}
  grp('Show / hide');
  [['kb-hd','Hide on desktop'],['kb-ht','Hide on tablet'],['kb-hm','Hide on mobile']].forEach(([c,t])=>{const k=document.createElement('input');k.type='checkbox';k.checked=sel.classList.contains(c);k.onchange=()=>{snap();sel.classList.toggle(c,k.checked)};const l=document.createElement('label');l.style.cssText='display:flex;gap:.4rem;align-items:center;font-size:13px';l.append(k,t);P.append(l)});
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
  c.querySelector('body').classList.remove('kb-edit');if(!c.querySelector('body').className.trim())c.querySelector('body').removeAttribute('class');
  if(!c.querySelector('[class*="kb-"]'))c.querySelectorAll('style[data-kb-wcss]').forEach(x=>x.remove());
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

const $=s=>document.querySelector(s);
const state={data:null,filter:'all',query:'',sort:'newest',view:localStorage.getItem('cianx-view')||'grid',maxDate:''};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const favicon=url=>{try{return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`}catch{return 'favicon.svg'}};
const iconFor=i=>i.icon||favicon(i.url);
const iconBox=i=>`<div class="icon-box"><img src="${esc(iconFor(i))}" alt="" loading="lazy" onerror="this.onerror=null;this.src='favicon.svg'"></div>`;
const UI={"all": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" /> </svg>", "featured": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" /> </svg>", "software": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\" /> <line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\" /> <line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\" /> </svg>", "extension": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z\" /> </svg>", "skill": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z\" /> </svg>", "website": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /> <path d=\"M2 12h20\" /> </svg>", "tool": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z\" /> </svg>", "sun": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <circle cx=\"12\" cy=\"12\" r=\"4\" /> <path d=\"M12 2v2\" /> <path d=\"M12 20v2\" /> <path d=\"m4.93 4.93 1.41 1.41\" /> <path d=\"m17.66 17.66 1.41 1.41\" /> <path d=\"M2 12h2\" /> <path d=\"M20 12h2\" /> <path d=\"m6.34 17.66-1.41 1.41\" /> <path d=\"m19.07 4.93-1.41 1.41\" /> </svg>", "moon": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\" /> </svg>"};
const uiIcon=id=>UI[id]||UI.all;
const cat=id=>state.data.categories.find(c=>c.id===id)||{label:id,icon:'🔗'};
const priceClass=p=>({'Free':'price-free','Freemium':'price-freemium','Paid':'price-paid'}[p]||'');

function badges(i){
  return i.featured?'<div class="badges"><span class="badge badge-star">★ Nổi bật</span></div>':'';
}
function cardHTML(i){
  return `<article class="card" data-id="${esc(i.id)}" tabindex="0" role="button" aria-label="${esc(i.name)}">
    ${badges(i)}
    <div class="card-head">
      ${iconBox(i)}
      <div><h3>${esc(i.name)}</h3><div class="type">${uiIcon(i.type)} ${esc(cat(i.type).label)}</div></div>
    </div>
    <p>${esc(i.description)}</p>
    <div class="tags">${(i.tags||[]).slice(0,4).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    <div class="meta"><span>${esc((i.platform||[]).join(' · '))}</span><span style="display:flex;gap:10px;align-items:center"><span class="price ${priceClass(i.pricing)}">${esc(i.pricing||'')}</span><span class="open-hint">Mở ↗</span></span></div>
  </article>`;
}
function bindCards(scope){
  scope.querySelectorAll('[data-id]').forEach(c=>{c.onclick=()=>openDetail(c.dataset.id);c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(c.dataset.id)}}});
}
function renderFilters(){
  const counts={};state.data.items.forEach(i=>counts[i.type]=(counts[i.type]||0)+1);
  const featCount=state.data.items.filter(i=>i.featured).length;
  const all=[{id:'all',label:'Tất cả',icon:'✦'},...(featCount?[{id:'featured',label:'Nổi bật',icon:'★'}]:[]),...state.data.categories];
  $('#filters').innerHTML=all.map(c=>`<button class="chip" data-id="${esc(c.id)}" aria-pressed="${state.filter===c.id}">${uiIcon(c.id)} ${esc(c.label)} <span class="n">${c.id==='all'?state.data.items.length:c.id==='featured'?featCount:(counts[c.id]||0)}</span></button>`).join('');
  document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{state.filter=b.dataset.id;renderFilters();render()});
}
function filtered(){
  let items=[...state.data.items];
  if(state.filter==='featured')items=items.filter(i=>i.featured);
  else if(state.filter!=='all')items=items.filter(i=>i.type===state.filter);
  if(state.query){const q=state.query.toLowerCase();items=items.filter(i=>[i.name,i.description,(i.tags||[]).join(' '),(i.platform||[]).join(' '),cat(i.type).label].join(' ').toLowerCase().includes(q))}
  if(state.sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name));
  else if(state.sort==='featured')items.sort((a,b)=>(b.featured-a.featured)||String(b.dateAdded).localeCompare(a.dateAdded));
  else items.sort((a,b)=>String(b.dateAdded).localeCompare(a.dateAdded));
  return items;
}
function render(){
  let items=filtered();
  $('#resultCount').textContent=state.query||state.filter!=='all'?`${items.length} kết quả`:`${state.data.items.length} mục đã lưu`;
  $('#empty').hidden=items.length>0||filtered().length>0;
  if(!items.length&&filtered().length)$('#grid').innerHTML='';
  else{$('#grid').className='grid'+(state.view==='list'?' list':'');$('#grid').innerHTML=items.map(i=>cardHTML(i)).join('');bindCards($('#grid'));}
}
function openDetail(id){
  const i=state.data.items.find(x=>x.id===id);if(!i)return;
  $('#detailBody').innerHTML=`
    <div class="card-head">${iconBox(i)}
    <div><h3 style="margin:0">${esc(i.name)}</h3><div class="type">${uiIcon(i.type)} ${esc(cat(i.type).label)}${i.featured?' · ★ Nổi bật':''}</div></div></div>
    <p class="desc">${esc(i.description)}</p>
    ${i.note?`<p class="desc"><b style="color:var(--text)">Ghi chú:</b> ${esc(i.note)}</p>`:''}
    <div class="tags">${(i.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    <div class="detail-meta">
      <div><span>Nền tảng</span><b>${esc((i.platform||[]).join(', ')||'—')}</b></div>
      <div><span>Giá</span><b>${esc(i.pricing||'—')}</b></div>
      <div><span>Ngày thêm</span><b>${esc(i.dateAdded||'—')}</b></div>
      <div><span>Loại</span><b>${esc(cat(i.type).label)}</b></div>
    </div>
    <div class="dialog-actions">
      <a class="visit" href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">Mở trang chính thức ↗</a>
      <button class="copy" type="button" id="copyLink">Sao chép link</button>
    </div>`;
  $('#copyLink').onclick=async e=>{try{await navigator.clipboard.writeText(i.url);e.target.textContent='Đã sao chép ✓'}catch{e.target.textContent=i.url}};
  $('#detail').showModal();
}
async function init(){
  const saved=localStorage.getItem('cianx-theme');if(saved)document.documentElement.dataset.theme=saved;
  const paintTheme=()=>{$('#themeToggle').innerHTML=document.documentElement.dataset.theme==='dark'?UI.sun:UI.moon};
  paintTheme();
  $('#themeToggle').onclick=()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.setItem('cianx-theme',t);paintTheme()};
  $('#year').textContent=new Date().getFullYear();
  $('#grid').innerHTML='<div class="skeleton"></div>'.repeat(6);
  window.addEventListener('scroll',()=>{$('#toTop').classList.toggle('show',window.scrollY>600)},{passive:true});
  $('#toTop').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
  state.data=await (await fetch('data/catalog.json',{cache:'no-cache'})).json();
  state.maxDate=state.data.items.map(i=>i.dateAdded||'').sort().pop()||'';
  if(state.data.site?.tagline)$('#tagline').textContent=state.data.site.tagline;
  const featured=state.data.items.filter(i=>i.featured).length;
  $('#stats').innerHTML=`
    <div class="stat"><b>${state.data.items.length}</b><span>mục đã lưu</span></div>
    <div class="stat"><b>${state.data.categories.length}</b><span>nhóm danh mục</span></div>
    <div class="stat"><b>${featured}</b><span>mục nổi bật</span></div>`;
  $('#topCount').textContent=`${state.data.items.length} mục`;
  renderFilters();render();
  $('#search').addEventListener('input',e=>{state.query=e.target.value.trim();render()});
  $('#sort').addEventListener('change',e=>{state.sort=e.target.value;render()});
  const setView=v=>{state.view=v;localStorage.setItem('cianx-view',v);$('#viewGrid').setAttribute('aria-pressed',v==='grid');$('#viewList').setAttribute('aria-pressed',v==='list');render()};
  $('#viewGrid').onclick=()=>setView('grid');$('#viewList').onclick=()=>setView('list');
  setView(state.view);
  $('#clearFilters').onclick=()=>{state.filter='all';state.query='';$('#search').value='';renderFilters();render()};
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#search').focus()}});
  document.querySelector('dialog .close').onclick=()=>$('#detail').close();
  $('#detail').addEventListener('click',e=>{if(e.target.id==='detail')$('#detail').close()});
}
init().catch(err=>{$('#grid').innerHTML='';$('#empty').hidden=false;$('#empty p').textContent='Không tải được dữ liệu: '+err.message});

const $=s=>document.querySelector(s);
const state={data:null,filter:'all',query:'',sort:'newest',view:localStorage.getItem('cianx-view')||'grid',maxDate:''};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const favicon=url=>{try{return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`}catch{return 'favicon.svg'}};
const cat=id=>state.data.categories.find(c=>c.id===id)||{label:id,icon:'🔗'};
const priceClass=p=>({'Free':'price-free','Freemium':'price-freemium','Paid':'price-paid'}[p]||'');
const isNew=i=>i.dateAdded&&i.dateAdded===state.maxDate;

function badges(i){
  let b='';
  if(isNew(i))b+='<span class="badge badge-new">Mới</span>';
  if(i.featured)b+='<span class="badge badge-star">★ Nổi bật</span>';
  return b?`<div class="badges">${b}</div>`:'';
}
function featureHTML(i){
  return `<article class="feature-card" data-id="${esc(i.id)}" tabindex="0" role="button" aria-label="${esc(i.name)}">
    <div class="icon-box"><img src="${favicon(i.url)}" alt="" loading="lazy" onerror="this.src='favicon.svg'"></div>
    <div class="feature-main">
      <h3>${esc(i.name)}</h3>
      <div class="type">${esc(cat(i.type).icon)} ${esc(cat(i.type).label)} · ${esc((i.platform||[]).join(' · '))}</div>
      <p>${esc(i.description)}</p>
      <div class="tags">${(i.tags||[]).slice(0,5).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    </div>
    <span class="price ${priceClass(i.pricing)}" style="align-self:flex-start">${esc(i.pricing||'')}</span>
  </article>`;
}
function cardHTML(i){
  return `<article class="card" data-id="${esc(i.id)}" tabindex="0" role="button" aria-label="${esc(i.name)}">
    ${badges(i)}
    <div class="card-head">
      <div class="icon-box"><img src="${favicon(i.url)}" alt="" loading="lazy" onerror="this.src='favicon.svg'"></div>
      <div><h3>${esc(i.name)}</h3><div class="type">${esc(cat(i.type).icon)} ${esc(cat(i.type).label)}</div></div>
    </div>
    <p>${esc(i.description)}</p>
    <div class="tags">${(i.tags||[]).slice(0,4).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    <div class="meta"><span>${esc((i.platform||[]).join(' · '))}</span><span style="display:flex;gap:10px;align-items:center"><span class="price ${priceClass(i.pricing)}">${esc(i.pricing||'')}</span><span class="open-hint">Mở ↗</span></span></div>
  </article>`;
}
function bindCards(scope){
  scope.querySelectorAll('[data-id]').forEach(c=>{c.onclick=()=>openDetail(c.dataset.id);c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(c.dataset.id)}}});
}
function renderFeatured(){
  const feat=state.data.items.filter(i=>i.featured);
  const show=feat.length>0&&state.filter==='all'&&!state.query;
  $('#featuredSection').hidden=!show;
  if(show){$('#featuredGrid').innerHTML=feat.map(featureHTML).join('');bindCards($('#featuredGrid'));}
}
function renderFilters(){
  const counts={};state.data.items.forEach(i=>counts[i.type]=(counts[i.type]||0)+1);
  const all=[{id:'all',label:'Tất cả',icon:'✦'},...state.data.categories];
  $('#filters').innerHTML=all.map(c=>`<button class="chip" data-id="${esc(c.id)}" aria-pressed="${state.filter===c.id}">${esc(c.icon)} ${esc(c.label)} <span class="n">${c.id==='all'?state.data.items.length:(counts[c.id]||0)}</span></button>`).join('');
  document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{state.filter=b.dataset.id;renderFilters();render()});
}
function filtered(){
  let items=[...state.data.items];
  if(state.filter!=='all')items=items.filter(i=>i.type===state.filter);
  if(state.query){const q=state.query.toLowerCase();items=items.filter(i=>[i.name,i.description,(i.tags||[]).join(' '),(i.platform||[]).join(' '),cat(i.type).label].join(' ').toLowerCase().includes(q))}
  if(state.sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name));
  else if(state.sort==='featured')items.sort((a,b)=>(b.featured-a.featured)||String(b.dateAdded).localeCompare(a.dateAdded));
  else items.sort((a,b)=>String(b.dateAdded).localeCompare(a.dateAdded));
  return items;
}
function render(){
  renderFeatured();
  let items=filtered();
  // In the default view, featured items live in their own section — don't duplicate them in the grid.
  if(state.filter==='all'&&!state.query)items=items.filter(i=>!i.featured);
  $('#resultCount').textContent=state.query||state.filter!=='all'?`${items.length} kết quả`:`${state.data.items.length} mục đã lưu`;
  $('#empty').hidden=items.length>0||filtered().length>0;
  if(!items.length&&filtered().length)$('#grid').innerHTML='';
  else{$('#grid').className='grid'+(state.view==='list'?' list':'');$('#grid').innerHTML=items.map(i=>cardHTML(i)).join('');bindCards($('#grid'));}
}
function openDetail(id){
  const i=state.data.items.find(x=>x.id===id);if(!i)return;
  $('#detailBody').innerHTML=`
    <div class="card-head"><div class="icon-box"><img src="${favicon(i.url)}" alt="" onerror="this.src='favicon.svg'"></div>
    <div><h3 style="margin:0">${esc(i.name)}</h3><div class="type">${esc(cat(i.type).icon)} ${esc(cat(i.type).label)}${i.featured?' · ★ Nổi bật':''}</div></div></div>
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
  const paintTheme=()=>{$('#themeToggle').textContent=document.documentElement.dataset.theme==='dark'?'☀️':'🌙'};
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

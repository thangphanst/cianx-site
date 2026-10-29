const $=s=>document.querySelector(s);
const state={data:null,filter:'all',query:'',sort:'newest'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const favicon=url=>{try{return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`}catch{return 'favicon.svg'}};
function cat(id){return state.data.categories.find(c=>c.id===id)||{label:id,icon:'🔗'}}
function renderFilters(){
  const counts={}; state.data.items.forEach(i=>counts[i.type]=(counts[i.type]||0)+1);
  const all=[{id:'all',label:'Tất cả',icon:'✦'},...state.data.categories];
  $('#filters').innerHTML=all.map(c=>`<button class="chip" data-id="${esc(c.id)}" aria-pressed="${state.filter===c.id}">${esc(c.icon)} ${esc(c.label)} · ${c.id==='all'?state.data.items.length:(counts[c.id]||0)}</button>`).join('');
  document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{state.filter=b.dataset.id;renderFilters();render()});
}
function filtered(){
  let items=[...state.data.items];
  if(state.filter!=='all')items=items.filter(i=>i.type===state.filter);
  if(state.query){const q=state.query.toLowerCase();items=items.filter(i=>[i.name,i.description,(i.tags||[]).join(' '),(i.platform||[]).join(' ')].join(' ').toLowerCase().includes(q))}
  if(state.sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name));
  else if(state.sort==='featured')items.sort((a,b)=>(b.featured-a.featured)||String(b.dateAdded).localeCompare(a.dateAdded));
  else items.sort((a,b)=>String(b.dateAdded).localeCompare(a.dateAdded));
  return items;
}
function render(){
  const items=filtered();
  $('#resultCount').textContent=`${items.length} mục`;
  $('#empty').hidden=items.length>0;
  $('#grid').innerHTML=items.map(i=>`<article class="card" data-id="${esc(i.id)}" tabindex="0">
    <div class="card-head"><img src="${favicon(i.url)}" alt="" loading="lazy" onerror="this.src='favicon.svg'"><div><h3>${esc(i.name)} ${i.featured?'<span class="star">★</span>':''}</h3><div class="type">${esc(cat(i.type).icon)} ${esc(cat(i.type).label)}</div></div></div>
    <p>${esc(i.description)}</p>
    <div class="tags">${(i.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    <div class="meta"><span>${esc((i.platform||[]).join(' · '))}</span><span class="price">${esc(i.pricing||'')}</span></div>
  </article>`).join('');
  document.querySelectorAll('.card').forEach(c=>{c.onclick=()=>openDetail(c.dataset.id);c.onkeydown=e=>{if(e.key==='Enter')openDetail(c.dataset.id)}});
}
function openDetail(id){
  const i=state.data.items.find(x=>x.id===id); if(!i)return;
  $('#detailBody').innerHTML=`<div class="card-head"><img src="${favicon(i.url)}" alt="" onerror="this.src='favicon.svg'"><div><h3>${esc(i.name)}</h3><div class="type">${esc(cat(i.type).icon)} ${esc(cat(i.type).label)} · Thêm ${esc(i.dateAdded||'')}</div></div></div>
  <p>${esc(i.description)}</p>${i.note?`<p><b>Ghi chú:</b> ${esc(i.note)}</p>`:''}
  <div class="tags">${(i.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
  <p class="meta"><span>${esc((i.platform||[]).join(' · '))}</span><span class="price">${esc(i.pricing||'')}</span></p>
  <a class="visit" href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">Mở trang chính thức ↗</a>`;
  $('#detail').showModal();
}
async function init(){
  const saved=localStorage.getItem('cianx-theme'); if(saved)document.documentElement.dataset.theme=saved;
  $('#themeToggle').textContent=document.documentElement.dataset.theme==='dark'?'☀️':'🌙';
  $('#themeToggle').onclick=()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.setItem('cianx-theme',t);$('#themeToggle').textContent=t==='dark'?'☀️':'🌙'};
  $('#year').textContent=new Date().getFullYear();
  state.data=await (await fetch('data/catalog.json',{cache:'no-cache'})).json();
  if(state.data.site?.tagline)$('#tagline').textContent=state.data.site.tagline;
  $('#stats').innerHTML=`<span><b>${state.data.items.length}</b> mục đã lưu</span><span><b>${state.data.categories.length}</b> nhóm</span><span><b>${state.data.items.filter(i=>i.featured).length}</b> nổi bật</span>`;
  renderFilters(); render();
  $('#search').addEventListener('input',e=>{state.query=e.target.value.trim();render()});
  $('#sort').addEventListener('change',e=>{state.sort=e.target.value;render()});
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#search').focus()}});
  document.querySelector('dialog .close').onclick=()=>$('#detail').close();
}
init().catch(err=>{$('#grid').innerHTML=`<p class="empty">Không tải được dữ liệu: ${esc(err.message)}</p>`});

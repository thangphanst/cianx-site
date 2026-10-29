const $=s=>document.querySelector(s);
const detectLang=()=>{try{const l=((navigator.languages&&navigator.languages[0])||navigator.language||'en').toLowerCase();return l.startsWith('vi')?'vi':'en'}catch{return 'en'}};
const state={data:null,filter:'all',query:'',sort:'newest',view:localStorage.getItem('cianx-view')||'grid',maxDate:'',lang:localStorage.getItem('cianx-lang')||detectLang()};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const favicon=url=>{try{return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`}catch{return 'favicon.svg'}};
const iconFor=i=>i.icon||favicon(i.url);
const iconBox=i=>`<div class="icon-box"><img src="${esc(iconFor(i))}" alt="" loading="lazy" onerror="this.onerror=null;this.src='favicon.svg'"></div>`;
const UI={"all": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" /> </svg>", "featured": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" /> </svg>", "software": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\" /> <line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\" /> <line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\" /> </svg>", "extension": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z\" /> </svg>", "skill": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z\" /> </svg>", "website": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /> <path d=\"M2 12h20\" /> </svg>", "tool": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z\" /> </svg>", "sun": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <circle cx=\"12\" cy=\"12\" r=\"4\" /> <path d=\"M12 2v2\" /> <path d=\"M12 20v2\" /> <path d=\"m4.93 4.93 1.41 1.41\" /> <path d=\"m17.66 17.66 1.41 1.41\" /> <path d=\"M2 12h2\" /> <path d=\"M20 12h2\" /> <path d=\"m6.34 17.66-1.41 1.41\" /> <path d=\"m19.07 4.93-1.41 1.41\" /> </svg>", "moon": "<svg class=\"ic\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" > <path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\" /> </svg>"};
const uiIcon=id=>UI[id]||UI.all;
const I18N={
vi:{all:'Tất cả',featured:'Nổi bật',saved:n=>`${n} mục đã lưu`,results:n=>`${n} kết quả`,statSaved:'mục đã lưu',statCats:'nhóm danh mục',statFeat:'mục nổi bật',open:'Mở ↗',platform:'Nền tảng',pricing:'Giá',dateAdded:'Ngày thêm',type:'Loại',note:'Ghi chú:',visit:'Mở trang chính thức ↗',copy:'Sao chép link',copied:'Đã sao chép ✓',unit:'mục',hero_badge:'Thư viện cá nhân của Cian',h1a:'Mọi công cụ tin dùng,',h1b:'gom ở một nơi.',catalog_h:'Danh mục',search_ph:'Tìm theo tên, mô tả, tag… (ví dụ: database, AI agent)',sort_label:'Sắp xếp',sort_new:'Mới thêm',sort_name:'Tên A–Z',sort_feat:'Nổi bật trước',view_grid:'Dạng lưới',view_list:'Dạng danh sách',empty_h:'Không tìm thấy mục nào',empty_p:'Thử từ khoá khác, hoặc bỏ bớt bộ lọc nhé.',clear_btn:'Xoá bộ lọc',footer_brand:'Thư viện phần mềm, extension, skill và website hữu ích của Cian — cập nhật liên tục.',footer_explore:'Khám phá',footer_all:'Toàn bộ danh mục',footer_system:'Hệ thống',footer_src:'Mã nguồn GitHub',footer_data:'Dữ liệu (JSON)',footer_bottom:'CianX · Host trên Cloudflare Pages · Cập nhật tự động qua GitHub',pageTitle:'CianX — Thư viện phần mềm, extension, skill & website'},
en:{all:'All',featured:'Featured',saved:n=>`${n} saved items`,results:n=>`${n} results`,statSaved:'saved items',statCats:'categories',statFeat:'featured',open:'Open ↗',platform:'Platform',pricing:'Pricing',dateAdded:'Date added',type:'Type',note:'Note:',visit:'Visit official site ↗',copy:'Copy link',copied:'Copied ✓',unit:'items',hero_badge:"Cian's personal library",h1a:'Every trusted tool,',h1b:'in one place.',catalog_h:'Catalog',search_ph:'Search by name, description, tags… (e.g. database, AI agent)',sort_label:'Sort',sort_new:'Newest',sort_name:'Name A–Z',sort_feat:'Featured first',view_grid:'Grid view',view_list:'List view',empty_h:'No items found',empty_p:'Try a different keyword, or clear some filters.',clear_btn:'Clear filters',footer_brand:"Cian's library of useful software, extensions, skills and websites — updated continuously.",footer_explore:'Explore',footer_all:'Full catalog',footer_system:'System',footer_src:'GitHub source',footer_data:'Data (JSON)',footer_bottom:'CianX · Hosted on Cloudflare Pages · Auto-updated via GitHub',pageTitle:"CianX — Cian's library of software, extensions, skills & websites"}};
const t=k=>I18N[state.lang][k];
const descOf=i=>state.lang==='en'?(i.description_en||i.description):i.description;
const noteOf=i=>state.lang==='en'?(i.note_en||i.note):i.note;
const labelOf=c=>state.lang==='en'?(c.label_en||c.label):c.label;
function renderStats(){
  const featured=state.data.items.filter(i=>i.featured).length;
  $('#stats').innerHTML=`
    <div class="stat"><b>${state.data.items.length}</b><span>${t('statSaved')}</span></div>
    <div class="stat"><b>${state.data.categories.length}</b><span>${t('statCats')}</span></div>
    <div class="stat"><b>${featured}</b><span>${t('statFeat')}</span></div>`;
  $('#topCount').textContent=`${state.data.items.length} ${t('unit')}`;
}
function applyLang(){
  document.documentElement.lang=state.lang;
  document.title=t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(el=>{const v=t(el.dataset.i18n);if(typeof v==='string')el.textContent=v});
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{el.placeholder=t(el.dataset.i18nPh)});
  document.querySelectorAll('[data-i18n-title]').forEach(el=>{el.title=t(el.dataset.i18nTitle)});
  const lv=$('#langVi'),le=$('#langEn');
  if(lv)lv.setAttribute('aria-pressed',state.lang==='vi');
  if(le)le.setAttribute('aria-pressed',state.lang==='en');
  if(state.data){
    const site=state.data.site||{};
    const tg=state.lang==='en'?(site.tagline_en||site.tagline):site.tagline;
    if(tg)$('#tagline').textContent=tg;
    const md=state.lang==='en'?(site.description_en||site.description):site.description;
    const meta=$('#metaDesc');if(md&&meta)meta.setAttribute('content',md);
    renderStats();renderFilters();render();
  }
}
function setLang(l){if(l===state.lang)return;state.lang=l;localStorage.setItem('cianx-lang',l);applyLang();}
const cat=id=>state.data.categories.find(c=>c.id===id)||{label:id,icon:'🔗'};
const priceClass=p=>({'Free':'price-free','Freemium':'price-freemium','Paid':'price-paid'}[p]||'');

function badges(i){
  return i.featured?`<div class="badges"><span class="badge badge-star">★ ${t('featured')}</span></div>`:'';
}
function cardHTML(i){
  return `<article class="card" data-id="${esc(i.id)}" tabindex="0" role="button" aria-label="${esc(i.name)}">
    ${badges(i)}
    <div class="card-head">
      ${iconBox(i)}
      <div><h3>${esc(i.name)}</h3><div class="type">${uiIcon(i.type)} ${esc(labelOf(cat(i.type)))}</div></div>
    </div>
    <p>${esc(descOf(i))}</p>
    <div class="tags">${(i.tags||[]).slice(0,4).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    <div class="meta"><span>${esc((i.platform||[]).join(' · '))}</span><span style="display:flex;gap:10px;align-items:center"><span class="price ${priceClass(i.pricing)}">${esc(i.pricing||'')}</span><span class="open-hint">${t('open')}</span></span></div>
  </article>`;
}
function bindCards(scope){
  scope.querySelectorAll('[data-id]').forEach(c=>{c.onclick=()=>openDetail(c.dataset.id);c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(c.dataset.id)}}});
}
function renderFilters(){
  const counts={};state.data.items.forEach(i=>counts[i.type]=(counts[i.type]||0)+1);
  const featCount=state.data.items.filter(i=>i.featured).length;
  const all=[{id:'all',label:t('all')},...(featCount?[{id:'featured',label:t('featured')}]:[]),...state.data.categories.map(c=>({id:c.id,label:labelOf(c)}))];
  $('#filters').innerHTML=all.map(c=>`<button class="chip" data-id="${esc(c.id)}" aria-pressed="${state.filter===c.id}">${uiIcon(c.id)} ${esc(c.label)} <span class="n">${c.id==='all'?state.data.items.length:c.id==='featured'?featCount:(counts[c.id]||0)}</span></button>`).join('');
  document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{state.filter=b.dataset.id;renderFilters();render()});
}
function filtered(){
  let items=[...state.data.items];
  if(state.filter==='featured')items=items.filter(i=>i.featured);
  else if(state.filter!=='all')items=items.filter(i=>i.type===state.filter);
  if(state.query){const q=state.query.toLowerCase();items=items.filter(i=>[i.name,i.description,i.description_en||'',(i.tags||[]).join(' '),(i.platform||[]).join(' '),cat(i.type).label,cat(i.type).label_en||''].join(' ').toLowerCase().includes(q))}
  if(state.sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name));
  else if(state.sort==='featured')items.sort((a,b)=>(b.featured-a.featured)||String(b.dateAdded).localeCompare(a.dateAdded));
  else items.sort((a,b)=>String(b.dateAdded).localeCompare(a.dateAdded));
  return items;
}
function render(){
  let items=filtered();
  $('#resultCount').textContent=state.query||state.filter!=='all'?t('results')(items.length):t('saved')(state.data.items.length);
  $('#empty').hidden=items.length>0||filtered().length>0;
  if(!items.length&&filtered().length)$('#grid').innerHTML='';
  else{$('#grid').className='grid'+(state.view==='list'?' list':'');$('#grid').innerHTML=items.map(i=>cardHTML(i)).join('');bindCards($('#grid'));}
}
function openDetail(id){
  const i=state.data.items.find(x=>x.id===id);if(!i)return;
  $('#detailBody').innerHTML=`
    <div class="card-head">${iconBox(i)}
    <div><h3 style="margin:0">${esc(i.name)}</h3><div class="type">${uiIcon(i.type)} ${esc(labelOf(cat(i.type)))}${i.featured?' · ★ '+t('featured'):''}</div></div></div>
    <p class="desc">${esc(descOf(i))}</p>
    ${noteOf(i)?`<p class="desc"><b style="color:var(--text)">${t('note')}</b> ${esc(noteOf(i))}</p>`:''}
    <div class="tags">${(i.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    <div class="detail-meta">
      <div><span>${t('platform')}</span><b>${esc((i.platform||[]).join(', ')||'—')}</b></div>
      <div><span>${t('pricing')}</span><b>${esc(i.pricing||'—')}</b></div>
      <div><span>${t('dateAdded')}</span><b>${esc(i.dateAdded||'—')}</b></div>
      <div><span>${t('type')}</span><b>${esc(labelOf(cat(i.type)))}</b></div>
    </div>
    <div class="dialog-actions">
      <a class="visit" href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">${t('visit')}</a>
      <button class="copy" type="button" id="copyLink">${t('copy')}</button>
    </div>`;
  $('#copyLink').onclick=async e=>{try{await navigator.clipboard.writeText(i.url);e.target.textContent=t('copied')}catch{e.target.textContent=i.url}};
  $('#detail').showModal();
}
async function init(){
  const saved=localStorage.getItem('cianx-theme');if(saved)document.documentElement.dataset.theme=saved;
  const paintTheme=()=>{$('#themeToggle').innerHTML=document.documentElement.dataset.theme==='dark'?UI.sun:UI.moon};
  paintTheme();
  $('#langVi').onclick=()=>setLang('vi');
  $('#langEn').onclick=()=>setLang('en');
  applyLang();
  $('#themeToggle').onclick=()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.setItem('cianx-theme',t);paintTheme()};
  $('#year').textContent=new Date().getFullYear();
  $('#grid').innerHTML='<div class="skeleton"></div>'.repeat(6);
  window.addEventListener('scroll',()=>{$('#toTop').classList.toggle('show',window.scrollY>600)},{passive:true});
  $('#toTop').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
  state.data=await (await fetch('data/catalog.json',{cache:'no-cache'})).json();
  state.maxDate=state.data.items.map(i=>i.dateAdded||'').sort().pop()||'';
  applyLang();
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

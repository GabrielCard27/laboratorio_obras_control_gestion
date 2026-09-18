/* =========================================================
   SHELL.JS
   Responsable único del Panel General: lee config/modules.json,
   renderiza el resumen y la grilla de módulos, y arma los links
   de navegación. No importa ni ejecuta código de ningún módulo —
   ese es exactamente el límite del contrato panel/módulo.
   ========================================================= */
const STATUS_LABEL = { active: 'Disponible', planned: 'Planificado', wip: 'En desarrollo' };

async function loadRegistry(){
  const res = await fetch('config/modules.json');
  if(!res.ok) throw new Error('No se pudo cargar el registro de módulos');
  return res.json();
}

function moduleCardHtml(m){
  const isActive = m.status === 'active';
  const tag = isActive ? 'a' : 'div';
  const href = isActive ? `href="${m.path}"` : '';
  return `<${tag} class="mcard ${isActive?'is-active':'is-disabled'}" ${href}>
    <div class="mcard-top">
      <div class="mcard-icon">${m.icon || '▫'}</div>
      <span class="mcard-id">${m.id}</span>
    </div>
    <h3>${m.title}</h3>
    <p>${m.description}</p>
    <div class="mcard-foot">
      <span>v${m.version}</span>
      <span class="status-pill ${m.status}">${STATUS_LABEL[m.status] || m.status}</span>
    </div>
  </${tag}>`;
}

function overviewHtml(registry){
  const total = registry.modules.length;
  const activos = registry.modules.filter(m=>m.status==='active').length;
  const planificados = registry.modules.filter(m=>m.status==='planned').length;
  return `
    <div class="ov-card">
      <div class="ov-label">Obra</div>
      <div class="ov-val" style="font-size:15px">${registry.project.obra}</div>
      <div class="ov-note">${registry.project.periodo}</div>
    </div>
    <div class="ov-card">
      <div class="ov-label">Módulos disponibles</div>
      <div class="ov-val">${activos}</div>
      <div class="ov-note">de ${total} registrados</div>
    </div>
    <div class="ov-card">
      <div class="ov-label">Módulos planificados</div>
      <div class="ov-val">${planificados}</div>
      <div class="ov-note">próximas incorporaciones</div>
    </div>
    <div class="ov-card">
      <div class="ov-label">Fuente de datos</div>
      <div class="ov-val" style="font-size:15px">Demo local</div>
      <div class="ov-note">preparado para Supabase / API</div>
    </div>`;
}

async function renderShell(){
  const app = document.getElementById('app');
  try{
    const registry = await loadRegistry();
    const modules = [...registry.modules].sort((a,b)=>a.order-b.order);
    document.getElementById('overview').innerHTML = overviewHtml(registry);
    document.getElementById('module-grid').innerHTML = modules.map(moduleCardHtml).join('');
    document.title = registry.project.name;
    document.getElementById('brand-title').textContent = registry.project.name;
  }catch(err){
    app.innerHTML = `<div class="ov-card" style="border-color:var(--critico)">
      <div class="ov-label">Error</div>
      <div class="ov-note">${err.message}. Si estás abriendo el archivo directamente desde el disco, serví la carpeta con un servidor local (ej. <code>npx serve</code>) — el navegador bloquea <code>fetch()</code> sobre <code>file://</code>.</div>
    </div>`;
  }
}

renderShell();

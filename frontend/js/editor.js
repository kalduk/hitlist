
let chart = null;
async function loadLatest(){
  const res = await fetch('/api/charts/latest');
  chart = await res.json();
  if(!chart) chart = {entries:[]};
  renderEditor();
}
function renderEditor(){
  const rows = document.getElementById('rows');
  rows.innerHTML = '';
  (chart.entries||[]).slice(0,100).forEach(e=>{
    rows.appendChild(makeRow(e));
  });
}
function makeRow(e){
  const el = document.createElement('div');
  el.className='row card';
  el.innerHTML = `
    <div class="pos">${e.position}</div>
    <div><input class="titleInput" value="${escapeHtml(e.title||'')}" /></div>
    <div><input class="artistInput" value="${escapeHtml(e.artist||'')}" /></div>
    <div><select class="statusSel"><option value="">Auto</option><option value="N">N</option><option value="RE">RE</option><option value="DEL">DEL</option></select></div>
    <div><input class="linkInput" placeholder="link Spotify / Apple / Discogs" value="${e.source_link||''}" /></div>
    <div class="meta">${'[ '+(e.previous_position||'-')+' ] w.'+(e.weeks_on_chart||0)+' ^'+(e.peak_position||e.position)}</div>
  `;
  // set status if manual
  if(e.status) el.querySelector('.statusSel').value = e.status;
  // attach change handlers
  el.querySelector('.titleInput').addEventListener('input', ()=> e.title = el.querySelector('.titleInput').value);
  el.querySelector('.artistInput').addEventListener('input', ()=> e.artist = el.querySelector('.artistInput').value);
  el.querySelector('.statusSel').addEventListener('change', ()=> e.status = el.querySelector('.statusSel').value);
  el.querySelector('.linkInput').addEventListener('change', async ()=>{
    e.source_link = el.querySelector('.linkInput').value;
    try{
      const r = await fetch('/api/metadata', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url:e.source_link})});
      if(r.ok){ const d = await r.json(); if(d.title) { e.title = d.title; e.artist = d.artist; el.querySelector('.titleInput').value = d.title; el.querySelector('.artistInput').value = d.artist; } }
    }catch(err){ console.log('metadata error', err); }
  });
  return el;
}
function escapeHtml(str){ if(!str) return ''; return String(str).replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]); }

document.getElementById('addBtn').addEventListener('click', ()=>{
  const title = document.getElementById('newTitle').value.trim();
  const artist = document.getElementById('newArtist').value.trim();
  const status = document.getElementById('newStatus').value;
  const nextPos = (chart.entries.length?Math.max(...chart.entries.map(x=>x.position))+1:1);
  const entry = { id: 'tmp-'+Date.now(), position: nextPos, title, artist, status, source_link:'', previous_position:null, weeks_on_chart:0, peak_position: nextPos };
  chart.entries.push(entry);
  renderEditor();
  document.getElementById('newTitle').value=''; document.getElementById('newArtist').value=''; document.getElementById('newStatus').value='';
});

document.getElementById('saveDraft').addEventListener('click', async ()=>{
  await saveChart(false);
});
document.getElementById('publish').addEventListener('click', async ()=>{
  await saveChart(true);
});

async function saveChart(publish=false){
  const payload = { ...chart, published: publish };
  const res = await fetch('/api/charts/save', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  if(res.ok){ alert(publish? 'Opublikowano' : 'Zapisano jako szkic'); loadLatest(); }
  else alert('Błąd zapisu');
}

document.getElementById('loadPrevious').addEventListener('click', async ()=>{
  const res = await fetch('/api/charts/previous');
  if(res.ok){ chart = await res.json(); chart.entries = (chart.entries||[]).map(e=> ({...e})); renderEditor(); }
});

// Init
loadLatest();

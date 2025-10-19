
async function fetchLatest(){
  try{
    const res = await fetch('/api/charts/latest');
    const data = await res.json();
    renderChart(data);
  }catch(e){
    document.getElementById('chart').innerHTML = '<div class="card">Błąd pobierania danych. Uruchom backend lub sprawdź konsolę.</div>';
  }
}
function renderChart(data){
  const container = document.getElementById('chart');
  container.innerHTML = '';
  const entries = data.entries.slice(0,40 || data.entries.length);
  entries.forEach(e=>{
    const div = document.createElement('div');
    div.className='row card';
    div.innerHTML = `
      <div class="pos">${e.position}</div>
      <div>
        <div class="title">${escapeHtml(e.title)}</div>
        <div class="artist">${escapeHtml(e.artist)}</div>
      </div>
      <div class="meta">[${e.previous_position||'-'}] w.${e.weeks_on_chart||0} ^${e.peak_position||e.position}</div>
      <div></div>
      <div></div>
      <div></div>
    `;
    container.appendChild(div);
  });
}
function escapeHtml(str){ if(!str) return ''; return str.replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]); }
fetchLatest();

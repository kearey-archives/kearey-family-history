
(function(){
  async function fetchIndex(){
    try{
      const res = await fetch('search_index.json',{cache:'no-store'});
      if(!res.ok) return null;
      return await res.json();
    }catch(e){ return null; }
  }
  function resultsContainer(){
    let el = document.getElementById('results');
    if(!el){
      el = document.createElement('div');
      el.id='results'; el.className='results';
      document.getElementById('content').appendChild(el);
    }
    el.innerHTML='';
    return el;
  }
  function highlightSnippet(text, q){
    const low=text.toLowerCase(), query=q.toLowerCase();
    const i = low.indexOf(query);
    if(i<0) return text.slice(0,160)+'…';
    const start = Math.max(0, i-60), end = Math.min(text.length, i+query.length+60);
    const pre = text.slice(start, i), hit = text.slice(i, i+query.length), post=text.slice(i+query.length, end);
    return (start>0?'…':'' ) + pre + '<mark>'+hit+'</mark>' + post + (end<text.length?'…':'');
  }
  window.__SITE_SEARCH = async function(){
    const qEl = document.getElementById('q');
    if(!qEl) return;
    const q = qEl.value.trim(); const countEl = document.getElementById('qcount');
    const resEl = resultsContainer();
    resEl.innerHTML='';
    if(!q){ if(countEl) countEl.textContent=''; return; }
    const idx = await fetchIndex();
    if(!idx){ resEl.innerHTML='<div class="result">Search index unavailable.</div>'; return; }
    let total=0;
    idx.pages.forEach(p=>{
      const low = p.text.toLowerCase(), query=q.toLowerCase();
      const has = low.indexOf(query)>-1;
      if(has){
        total++;
        const snippet = highlightSnippet(p.text, q);
        const card = document.createElement('div');
        card.className='result';
        card.innerHTML = '<b><a href="'+p.path+'">'+p.title+'</a></b><div>'+snippet+'</div>';
        resEl.appendChild(card);
      }
    });
    if(countEl) countEl.textContent = total? (total+' page'+(total>1?'s':'')) : 'No matches';
  };
})();
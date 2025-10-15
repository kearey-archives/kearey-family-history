
window.KEARY=(function(){
  const PAGES=[
    {id:'index',url:'index.html',title:'Overview'},
    {id:'origins',url:'origins.html',title:'I–III Origins'},
    {id:'succession',url:'succession.html',title:'IV–V Succession'},
    {id:'families',url:'families.html',title:'VI–VII Families & Census'},
    {id:'london',url:'london.html',title:'VIII London Offshoot'},
    {id:'context',url:'context.html',title:'IX Commentary & References'}
  ];
  async function fetchText(u){const r=await fetch(u,{cache:'no-store'});return await r.text();}
  async function search(){
    const q=(document.getElementById('q')?.value||'').trim();
    const box=document.getElementById('search-results'); if(!box)return;
    box.innerHTML=''; if(!q) return;
    const needle=q.toLowerCase(); const hits=[];
    for(const p of PAGES){
      try{
        const html=await fetchText(p.url);
        const text=html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').toLowerCase();
        const i=text.indexOf(needle);
        if(i>=0){const s=Math.max(0,i-90),e=Math.min(text.length,i+needle.length+90);hits.push({page:p,snippet:text.slice(s,e)});}
      }catch(e){}
    }
    const wrap=document.createElement('div'); wrap.className='results';
    const h3=document.createElement('h3'); h3.textContent=hits.length?`Search results for “${q}”`:`No results for “${q}”`; wrap.appendChild(h3);
    hits.forEach(h=>{const d=document.createElement('div'); d.className='hit'; const a=document.createElement('a'); a.href=h.page.url+'#top'; a.textContent=h.page.title+' — open';
      const sn=document.createElement('div'); sn.textContent='… '+h.snippet+' …'; d.appendChild(a); d.appendChild(sn); wrap.appendChild(d);});
    box.appendChild(wrap);
  }
  function printPDF(){window.print();}
  return {search, printPDF};
})();
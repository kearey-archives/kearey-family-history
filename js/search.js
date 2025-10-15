
(function(){
  function clearMarks(el){
    el.querySelectorAll('mark.__hl').forEach(m=>{
      const t=document.createTextNode(m.textContent);
      m.replaceWith(t);
    });
    el.normalize();
  }
  function highlight(root, query){
    if(!query) return 0;
    const walker=document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode:n=>{
        if(!n.parentElement) return NodeFilter.FILTER_REJECT;
        const tag=n.parentElement.tagName;
        if(['SCRIPT','STYLE','NOSCRIPT'].includes(tag)) return NodeFilter.FILTER_REJECT;
        return n.textContent.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
      }
    });
    const q=query.toLowerCase(); let nodes=[], count=0;
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const text=node.textContent, low=text.toLowerCase();
      let i=0, last=0, frag=null, changed=false;
      while((i=low.indexOf(q,i))>-1){
        if(!frag){ frag=document.createDocumentFragment(); }
        if(i>last) frag.appendChild(document.createTextNode(text.slice(last,i)));
        const mark=document.createElement('mark'); mark.className='__hl'; mark.textContent=text.slice(i, i+q.length);
        frag.appendChild(mark); count++; i+=q.length; last=i; changed=true;
      }
      if(changed){
        if(last<text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      }
    });
    return count;
  }
  window.__KEAREY_SEARCH=function(){
    const q=(document.getElementById('q')||{}).value||'';
    const area=document.getElementById('content');
    const counter=document.getElementById('qcount');
    clearMarks(area);
    if(!q.trim()){counter.textContent='';return;}
    const n=highlight(area,q.trim());
    counter.textContent = n? (n+' match'+(n>1?'es':'')) : 'No matches';
    if(n){
      const first=area.querySelector('mark.__hl');
      if(first) first.scrollIntoView({behavior:'smooth',block:'center'});
    }
  };
})();
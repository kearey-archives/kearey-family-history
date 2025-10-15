
(function(){
  function clearMarks(el){
    const marks = el.querySelectorAll('mark.__hl');
    marks.forEach(m=>{
      const parent=m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
  }
  function highlight(root, query){
    if(!query) return 0;
    const walker=document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode:n=>{
      if(!n.parentElement) return NodeFilter.FILTER_REJECT;
      const tag=n.parentElement.tagName;
      if(['SCRIPT','STYLE','NOSCRIPT'].includes(tag)) return NodeFilter.FILTER_REJECT;
      const t=n.textContent.trim();
      return t?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    const q=query.toLowerCase();
    let count=0, nodes=[];
    while(walker.nextNode()){ nodes.push(walker.currentNode); }
    nodes.forEach(node=>{
      const text=node.textContent;
      const lower=text.toLowerCase();
      let idx=0, parent=node.parentNode, last=0, frag=document.createDocumentFragment(), hit=false;
      while((idx=lower.indexOf(q, idx))>-1){
        hit=true;
        if(idx>last) frag.appendChild(document.createTextNode(text.slice(last, idx)));
        const mark=document.createElement('mark'); mark.className='__hl'; mark.textContent=text.slice(idx, idx+q.length);
        frag.appendChild(mark); count++; idx+=q.length; last=idx;
      }
      if(hit){
        if(last<text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        parent.replaceChild(frag, node);
      }
    });
    return count;
  }
  window.__KEARY_SEARCH = function(){
    const q=document.getElementById('q')?.value.trim();
    const area=document.getElementById('content');
    const counter=document.getElementById('qcount');
    clearMarks(area);
    if(!q){ counter.textContent=''; return; }
    const n=highlight(area, q);
    counter.textContent = n? (n+' match'+(n>1?'es':'')) : 'No matches';
    if(n){
      const first=area.querySelector('mark.__hl');
      if(first){ first.scrollIntoView({behavior:'smooth', block:'center'}); }
    }
  };
})();

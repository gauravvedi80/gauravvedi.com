/* Dansk Coach — js/12-features.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   PHASE 3.2 — connector list completion (9 more, with explicit flags)
   ===================================================================== */
CONNECTORS.push(
  { w:'skønt', en:'although (formal)', type:'sav', ex:'Han kom, skønt han ikke var inviteret.', note:'Formal twin of selvom — same SAV order.' },
  { w:'medmindre', en:'unless', type:'sav', ex:'Vi cykler, medmindre det ikke kan lade sig gøre.', note:'= hvis ikke. Subordinate order after it.' },
  { w:'dog', en:'however / though', type:'inv', ex:'Dog kan man også vælge et aftenhold.', note:'Fronted → inversion. Mid-sentence: after the verb ("Det er dog dyrt").' },
  { w:'derimod', en:'on the other hand / by contrast', type:'inv', ex:'Derimod foretrækker jeg vinteren.', note:'Contrast word — never between subject and verb.' },
  { w:'nemlig', en:'namely / you see', type:'inv', ex:'Han kommer nemlig ikke i dag.', note:'Almost always mid-sentence after the verb — rarely fronted.' },
  { w:'enten … eller', en:'either … or', type:'normal', ex:'Vi tager enten bussen eller toget.', note:'BUT fronted "Enten" triggers inversion: "Enten kommer han, eller også kommer han ikke."' },
  { w:'hverken … eller', en:'neither … nor', type:'normal', ex:'Hun drikker hverken kaffe eller te.', note:'Pairs around the things denied — no word-order change mid-sentence.' },
  { w:'både … og', en:'both … and', type:'normal', ex:'Jeg taler både dansk og engelsk.', note:'Simple pairing — no order change.' },
  { w:'endelig', en:'finally / at last', type:'inv', ex:'Endelig fandt vi en lejlighed.', note:'Fronted → inversion. Mid: "Vi fandt endelig…".' }
);
/* show explicit Inversion?/SAV? flags + common-mistake label */
DC.connRender = function(){
  const chips = document.getElementById('conn-chips'), list = document.getElementById('conn-list');
  if (!chips || !list) return;
  let ch = '<button onclick="DC.connState.type=\'all\';DC.connRender()" class="text-[11px] font-bold rounded-lg px-2.5 py-1.5 border '+(DC.connState.type==='all'?'bg-slate-700 border-slate-500 text-slate-100':'bg-slate-900 border-slate-800 text-slate-500')+'">All ('+CONNECTORS.length+')</button>';
  Object.keys(CONN_TYPES).forEach(t=>{
    const n = CONNECTORS.filter(c=>c.type===t).length;
    ch += '<button onclick="DC.connState.type=\''+t+'\';DC.connRender()" class="text-[11px] font-bold rounded-lg px-2.5 py-1.5 border '+(DC.connState.type===t?CONN_TYPES[t].cls:'bg-slate-900 border-slate-800 text-slate-500')+'">'+CONN_TYPES[t].short+' ('+n+')</button>';
  });
  chips.innerHTML = ch;
  const q = DC.connState.q.trim().toLowerCase();
  let rows = CONNECTORS.filter(c=> (DC.connState.type==='all'||c.type===DC.connState.type) &&
    (!q || c.w.toLowerCase().includes(q) || c.en.toLowerCase().includes(q) || c.ex.toLowerCase().includes(q) || (c.note||'').toLowerCase().includes(q)));
  if (!rows.length){ list.innerHTML = '<div class="text-sm text-slate-500 text-center py-4">No connector matches "'+esc(DC.connState.q)+'".</div>'; return; }
  const catName = {sav:'subordinating', normal:'coordinating', inv:'sentence adverb'};
  let h = '';
  if (DC.connState.type!=='all') h += '<div class="text-xs text-slate-400 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 mb-1">'+esc(CONN_TYPES[DC.connState.type].desc)+'</div>';
  rows.forEach(c=>{
    const t = CONN_TYPES[c.type];
    h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5"><div class="flex items-center gap-2 flex-wrap mb-1">'+
      '<span class="font-bold text-slate-100">'+esc(c.w)+'</span><span class="text-xs text-slate-500">'+esc(c.en)+' · '+catName[c.type]+'</span>'+
      '<span class="ml-auto flex gap-1"><span class="text-[10px] font-bold px-2 py-0.5 rounded-full '+(c.type==='inv'?'bg-indigo-500/15 text-indigo-300':'bg-slate-800 text-slate-500')+'">Inversion: '+(c.type==='inv'?'yes':'no')+'</span>'+
      '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full '+(c.type==='sav'?'bg-rose-500/15 text-rose-300':'bg-slate-800 text-slate-500')+'">SAV: '+(c.type==='sav'?'yes':'no')+'</span></span></div>'+
      '<div class="text-sm text-slate-300 italic">'+esc(c.ex)+'</div>'+
      (c.note?'<div class="text-[11px] text-amber-200/80 mt-1 flex items-start gap-1"><i data-lucide="alert-triangle" class="w-3 h-3 mt-0.5 shrink-0"></i><b class="mr-1">Common mistake:</b> '+esc(c.note)+'</div>':'')+'</div>';
  });
  list.innerHTML = h;
  DC.icons();
};
(function(){ /* track opens for the Connector Expert badge */
  const _cg = DC.connectorGuide;
  DC.connectorGuide = function(){ DC.state.connOpens = (DC.state.connOpens||0)+1; DC.save(); _cg(); };
})();

/* =====================================================================
   PHASE 3.1 — QUICK REFERENCE (floating, bottom-right, every page)
   ===================================================================== */
DC.quickRef = function(){
  let h = '<div><div class="flex items-center justify-between mb-1"><h3 class="font-bold text-slate-100 flex items-center gap-2"><i data-lucide="zap" class="w-5 h-5 text-indigo-300"></i>Grammar Quick Reference</h3>'+
    '<button onclick="DC.closeModal()" class="text-slate-500 hover:text-slate-300"><i data-lucide="x" class="w-5 h-5"></i></button></div>'+
    '<p class="text-xs text-slate-400 mb-3">The whole word-order system on one card. Open it whenever you write or speak — until you no longer need to.</p><div class="space-y-2">';
  QUICKREF.forEach(s=>{
    h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5"><div class="font-semibold text-sm text-slate-100 flex items-center gap-2 mb-1"><i data-lucide="'+s.icon+'" class="w-4 h-4 text-indigo-300"></i>'+s.t+'</div><div class="text-sm text-slate-300 leading-relaxed">'+s.body+'</div></div>';
  });
  h += '</div><button onclick="DC.closeModal();DC.connectorGuide()" class="mt-3 w-full px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm flex items-center justify-center gap-2"><i data-lucide="link-2" class="w-4 h-4 text-indigo-300"></i>Open the full Connector Master List</button></div>';
  DC.modal(h);
};
(function(){
  const fab = document.createElement('button');
  fab.id = 'qr-fab';
  fab.className = 'no-print fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold';
  fab.style.boxShadow = '0 2px 10px rgba(20,20,20,.12)';
  fab.innerHTML = '<i data-lucide="zap" class="w-4 h-4"></i><span class="hidden sm:inline">Quick Reference</span>';
  fab.title = 'Grammar Quick Reference — V2, SAV, adverbs, tenses (always available)';
  fab.onclick = function(){ DC.quickRef(); };
  document.body.appendChild(fab);
})();

/* =====================================================================
   PHASE 2.1 INTEGRATION — extended reading tabs
   ===================================================================== */
/* generic insertion-task engine (used by o4c + exam sims) */
DC.insRender = function(boxId, task, prefix){
  let h = '<p class="text-xs text-slate-400 mb-3 bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-2">'+esc(task.instruction||('Vælg for hvert hul den sætning (A–'+String.fromCharCode(64+task.pool.length)+'), der passer. To sætninger skal ikke bruges.'))+'</p>';
  h += '<div class="text-[15px] leading-8 text-slate-200 whitespace-pre-line">';
  let gapN = 0;
  task.parts.forEach(p=>{
    if (typeof p === 'string') h += esc(p);
    else { h += ' <select id="'+prefix+'-g'+p.g+'" class="gapsel"><option value="">— hul '+(p.g+1)+': vælg —</option>'+task.pool.map(o=>'<option value="'+o.letter+'">'+o.letter+'</option>').join('')+'</select> '; gapN++; }
  });
  h += '</div><div class="mt-3 bg-slate-900/70 border border-slate-800 rounded-xl p-3"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Sætninger (to skal ikke bruges)</div>';
  task.pool.forEach(o=> h += '<div class="text-sm text-slate-300 mb-1"><b class="text-indigo-300">'+o.letter+':</b> '+esc(o.text)+'</div>');
  h += '</div><div id="'+prefix+'-fb" class="mt-3 space-y-2"></div>';
  document.getElementById(boxId).innerHTML = h;
};
DC.insCheck = function(task, prefix){
  const gaps = task.pool.filter(o=>o.gap!==null && o.gap!==undefined);
  const items = []; let fb = '';
  let unfilled = false;
  gaps.forEach(o=>{ if(!document.getElementById(prefix+'-g'+o.gap) || document.getElementById(prefix+'-g'+o.gap).value==='') unfilled = true; });
  if (unfilled) return null;
  gaps.sort((a,b)=>a.gap-b.gap).forEach(corr=>{
    const sel = document.getElementById(prefix+'-g'+corr.gap);
    const chosen = sel.value, ok = chosen===corr.letter;
    sel.classList.add(ok?'opt-correct':'opt-wrong'); sel.disabled = true;
    const chosenOpt = task.pool.find(o=>o.letter===chosen);
    fb += '<div class="text-sm rounded-xl px-3 py-2 border '+(ok?'bg-emerald-500/10 border-emerald-500/30':'bg-rose-500/10 border-rose-500/30')+'"><b>Hul '+(corr.gap+1)+':</b> '+(ok?'✓ '+corr.letter+'. ':'✗ du valgte '+chosen+' — rigtigt er <b>'+corr.letter+'</b>. ')+esc(corr.why)+(!ok&&chosenOpt&&chosenOpt.why?'<br><b>Hvorfor '+chosen+' ikke passer:</b> '+esc(chosenOpt.why):'')+'</div>';
    items.push({ concept:task.concept||'r-4', qid:(task.id||prefix)+'-g'+corr.gap, question:'"'+task.title+'" — hul '+(corr.gap+1),
      userAnswer:chosen+(chosenOpt?': '+chosenOpt.text:''), correctAnswer:corr.letter+': '+corr.text, ok,
      mistakeType:'Coherence / text-structure error', explanation:corr.why,
      snapshot:{ kind:'mc', tag:'Indsæt sætninger', prompt:'Which sentence fits gap '+(corr.gap+1)+' in "'+esc(task.title)+'"?', options: shuffle(task.pool.map(o=>({text:o.text, ok:o.letter===corr.letter, mistakeType:'Wrong sentence for the gap', why:(o.letter===corr.letter?corr.why:(o.why||'Does not fit this gap.'))})).slice(0,4)), explanation:corr.why, concept:task.concept||'r-4' } });
  });
  document.getElementById(prefix+'-fb').innerHTML = fb;
  return items;
};

/* o3 tab: add comprehension task */
(function(){
  const _rdO3 = DC.rdO3;
  DC.rdO3 = function(){
    if ((DC.sub.o3Task||'o3')!=='o3c') {
      _rdO3();
      const bar = document.querySelector('#reading-body .flex.gap-2');
      if (bar) { const b=document.createElement('button'); b.className='px-3 py-1.5 rounded-lg text-xs font-semibold border bg-slate-900 border-slate-800 text-slate-400'; b.textContent=READING.o3c.title; b.onclick=function(){DC.sub.o3Task='o3c';DC.rdO3();DC.icons();}; bar.appendChild(b); }
      return;
    }
    const t = READING.o3c;
    const prev = (DC.state.reading.o3||{}).o3c;
    let h = '<div class="max-w-3xl space-y-3"><div class="flex gap-2 flex-wrap">';
    [READING.o3, READING.o3b, READING.o3c].forEach(x=> h += '<button onclick="DC.sub.o3Task=\''+x.id+'\';DC.rdO3();DC.icons()" class="px-3 py-1.5 rounded-lg text-xs font-semibold border '+(x.id==='o3c'?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400')+'">'+esc(x.title)+'</button>');
    h += '</div><div class="card p-5"><div class="flex items-center justify-between flex-wrap gap-2"><h3 class="font-bold text-slate-100">'+t.opgave+': '+esc(t.title)+'</h3>'+
      '<div class="flex items-center gap-2 text-sm"><i data-lucide="timer" class="w-4 h-4 text-amber-300"></i><span id="o3-timer" class="font-mono font-bold text-amber-300">12:00</span><button onclick="DC.startTimer(\'o3\',720,\'o3-timer\',function(){DC.toast(\'Time is up — answer what you can and submit.\',\'warn\')})" class="text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-2 py-1">Start 12 min</button>'+(prev?'<span class="text-xs text-slate-500 ml-2">last: '+prev.score+'/'+prev.total+'</span>':'')+'</div></div>';
    h += '<p class="text-xs text-slate-400 mt-2 mb-3 bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-2">'+esc(t.instruction)+'</p>';
    h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-[15px] leading-7 text-slate-200 whitespace-pre-line mb-4">'+esc(t.text)+'</div>';
    t.questions.forEach((q,i)=>{
      h += '<div class="mb-4 pb-4 border-b border-slate-800"><div class="font-semibold text-sm text-slate-100 mb-2">'+(i+1)+'. '+esc(q.q)+'</div><div class="grid gap-1.5">';
      q.options.forEach((o,j)=> h += '<button id="o3c-'+i+'-'+j+'" onclick="DC.o3cPick('+i+','+j+')" class="opt-btn text-left text-sm px-3 py-2 rounded-xl bg-slate-900 border border-slate-700">'+esc(o.text)+'</button>');
      h += '</div><div id="o3c-fb-'+i+'" class="mt-2"></div></div>';
    });
    h += '<button onclick="DC.o3cCheck()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Check answers</button><div id="o3c-conf"></div></div></div>';
    document.getElementById('reading-body').innerHTML = h;
    DC.o3cSel = {}; DC.rdStartTs = Date.now();
  };
})();
DC.o3cPick = function(i,j){
  if (DC.o3cLocked) return;
  DC.o3cSel[i]=j;
  READING.o3c.questions[i].options.forEach((o,k)=> document.getElementById('o3c-'+i+'-'+k).classList.toggle('!border-indigo-400', k===j));
};
DC.o3cCheck = function(){
  const t = READING.o3c;
  if (Object.keys(DC.o3cSel).length < t.questions.length){ DC.toast('Answer all '+t.questions.length+' questions first.','warn'); return; }
  DC.stopTimer('o3'); DC.o3cLocked = true;
  const items = [];
  t.questions.forEach((q,i)=>{
    const j = DC.o3cSel[i], ok = q.options[j].ok;
    const correct = q.options.find(o=>o.ok);
    q.options.forEach((o,k)=>{ const el=document.getElementById('o3c-'+i+'-'+k); el.disabled=true; if(o.ok) el.classList.add('opt-correct'); if(k===j&&!o.ok) el.classList.add('opt-wrong'); });
    document.getElementById('o3c-fb-'+i).innerHTML = '<div class="text-xs rounded-lg px-2.5 py-2 '+(ok?'bg-emerald-500/10 text-emerald-200':'bg-rose-500/10 text-rose-200')+'">'+(ok?'✓ ':'✗ ')+esc(correct.why)+(!ok?'<br><b>Your choice:</b> '+esc(q.options[j].why):'')+'</div>';
    items.push({ concept:q.concept||t.concept, qid:'o3c-q'+i, question:'"'+t.title+'": '+q.q, userAnswer:q.options[j].text, correctAnswer:correct.text, ok,
      mistakeType:'Comprehension error', explanation:correct.why,
      snapshot:{ kind:'mc', tag:'Opgave 3 · Comprehension', prompt:q.q+'<br><span class="text-xs text-slate-400">(text: "'+esc(t.title)+'")</span>', options:q.options, explanation:correct.why, concept:q.concept||t.concept } });
  });
  DC.pendingReading = { items, opgave:'Opgave 3 (comprehension)', store:'o3', taskKey:'o3c', time:Math.round((Date.now()-DC.rdStartTs)/1000), confBox:'o3c-conf' };
  DC.o3cLocked = false;
  DC.readingAskConf('o3c-conf');
};

/* o4 tab: add insertion task */
(function(){
  const _rdO4 = DC.rdO4;
  DC.rdO4 = function(){
    if ((DC.sub.o4Task||'o4')!=='o4c'){
      _rdO4();
      const bar = document.querySelector('#reading-body .flex.gap-2');
      if (bar){ const b=document.createElement('button'); b.className='px-3 py-1.5 rounded-lg text-xs font-semibold border bg-slate-900 border-slate-800 text-slate-400'; b.textContent=READING.o4c.title; b.onclick=function(){DC.sub.o4Task='o4c';DC.rdO4();DC.icons();}; bar.appendChild(b); }
      return;
    }
    const t = READING.o4c;
    const prev = (DC.state.reading.o4||{}).o4c;
    let h = '<div class="max-w-3xl space-y-3"><div class="flex gap-2 flex-wrap">';
    [READING.o4, READING.o4b, READING.o4c].forEach(x=> h += '<button onclick="DC.sub.o4Task=\''+x.id+'\';DC.rdO4();DC.icons()" class="px-3 py-1.5 rounded-lg text-xs font-semibold border '+(x.id==='o4c'?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400')+'">'+esc(x.title)+'</button>');
    h += '</div><div class="card p-5"><div class="flex items-center justify-between flex-wrap gap-2 mb-2"><h3 class="font-bold text-slate-100">'+t.opgave+': '+esc(t.title)+'</h3>'+(prev?'<span class="text-xs text-slate-500">last: '+prev.score+'/'+prev.total+'</span>':'')+'</div><div id="o4c-box"></div>'+
      '<button onclick="DC.o4cCheck()" class="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Check answers</button><div id="o4c-conf"></div></div></div>';
    document.getElementById('reading-body').innerHTML = h;
    DC.insRender('o4c-box', t, 'o4c');
    DC.rdStartTs = Date.now();
  };
})();
DC.o4cCheck = function(){
  const items = DC.insCheck(READING.o4c, 'o4c');
  if (!items){ DC.toast('Fill every gap first.','warn'); return; }
  DC.pendingReading = { items, opgave:'Opgave 4 (indsæt)', store:'o4', taskKey:'o4c', time:Math.round((Date.now()-DC.rdStartTs)/1000), confBox:'o4c-conf' };
  DC.readingAskConf('o4c-conf');
};

/* 2A tab: chats + skim/scan mode */
(function(){
  const _rdChat = DC.rdChat;
  DC.rdChat = function(){
    if (DC.sub.chatMode==='skim') return DC.rdSkim();
    _rdChat();
    const bar = document.querySelector('#reading-body .flex.gap-2');
    if (bar){ const b=document.createElement('button'); b.className='px-3 py-1.5 rounded-lg text-xs font-semibold border bg-amber-500/10 border-amber-500/30 text-amber-300'; b.innerHTML='⚡ Skim & scan (3 tekster)'; b.onclick=function(){DC.sub.chatMode='skim';DC.rdChat();DC.icons();}; bar.insertBefore(b, bar.lastElementChild); }
  };
})();
DC.rdSkim = function(){
  const t = READING.skim;
  const prev = (DC.state.reading.chat||{}).skim;
  let h = '<div class="max-w-3xl space-y-3"><div class="flex gap-2 flex-wrap items-center">'+
    '<button onclick="DC.sub.chatMode=null;DC.readingTab(\'chat\')" class="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-slate-900 border-slate-800 text-slate-400">← Chats</button>'+
    '<span class="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-indigo-500/15 border-indigo-500/40 text-indigo-200">Skim & scan · 3 tekster</span>'+
    '<div class="ml-auto flex items-center gap-2 text-sm"><i data-lucide="timer" class="w-4 h-4 text-amber-300"></i><span id="skim-timer" class="font-mono font-bold text-amber-300">5:00</span><button onclick="DC.startTimer(\'skim\',300,\'skim-timer\',function(){DC.toast(\'5 minutes! Submit what you have.\',\'warn\')})" class="text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-2 py-1">Start 5 min</button></div></div>';
  h += '<div class="card p-5"><div class="flex items-center justify-between flex-wrap gap-2 mb-1"><h3 class="font-bold text-slate-100">Opgave 2A-træning: Skim & scan</h3>'+(prev?'<span class="text-xs text-slate-500">last: '+prev.score+'/'+prev.total+'</span>':'')+'</div>'+
    '<p class="text-xs text-slate-400 mb-4 bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-2">'+esc(t.instruction)+'</p>';
  let qn = 0;
  t.texts.forEach((tx,ti)=>{
    h += '<div class="mb-5 pb-5 border-b border-slate-800"><div class="font-semibold text-slate-100 mb-2">'+(ti+1)+'. '+esc(tx.title)+'</div>'+
      '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-sm leading-6 text-slate-300 mb-3">'+esc(tx.text)+'</div>';
    tx.questions.forEach((q,qi)=>{
      const id = 'sk-'+ti+'-'+qi;
      h += '<div class="mb-2.5"><div class="text-sm font-medium text-slate-200 mb-1.5">'+esc(q.q)+'</div><div class="grid gap-1.5">';
      q.options.forEach((o,oi)=> h += '<button id="'+id+'-'+oi+'" onclick="DC.skPick('+ti+','+qi+','+oi+')" class="opt-btn text-left text-sm px-3 py-2 rounded-xl bg-slate-900 border border-slate-700">'+esc(o.text)+'</button>');
      h += '</div><div id="'+id+'-fb"></div></div>';
      qn++;
    });
    h += '</div>';
  });
  h += '<button onclick="DC.skCheck()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Check all answers ('+qn+')</button><div id="sk-conf"></div></div></div>';
  document.getElementById('reading-body').innerHTML = h;
  DC.skSel = {}; DC.rdStartTs = Date.now();
  DC.icons();
};
DC.skPick = function(ti,qi,oi){
  if (DC.skLocked) return;
  DC.skSel[ti+'-'+qi]=oi;
  READING.skim.texts[ti].questions[qi].options.forEach((o,k)=> document.getElementById('sk-'+ti+'-'+qi+'-'+k).classList.toggle('!border-indigo-400', k===oi));
};
DC.skCheck = function(){
  const t = READING.skim;
  let total = 0; t.texts.forEach(tx=> total += tx.questions.length);
  if (Object.keys(DC.skSel).length < total){ DC.toast('Answer every question first — never leave blanks.','warn'); return; }
  DC.stopTimer('skim'); DC.skLocked = true;
  const items = [];
  t.texts.forEach((tx,ti)=> tx.questions.forEach((q,qi)=>{
    const j = DC.skSel[ti+'-'+qi], ok = q.options[j].ok;
    const correct = q.options.find(o=>o.ok);
    q.options.forEach((o,k)=>{ const el=document.getElementById('sk-'+ti+'-'+qi+'-'+k); el.disabled=true; if(o.ok) el.classList.add('opt-correct'); if(k===j&&!o.ok) el.classList.add('opt-wrong'); });
    document.getElementById('sk-'+ti+'-'+qi+'-fb').innerHTML = '<div class="text-xs mt-1 rounded-lg px-2 py-1.5 '+(ok?'bg-emerald-500/10 text-emerald-200':'bg-rose-500/10 text-rose-200')+'">'+(ok?'✓ ':'✗ ')+esc(correct.why)+'</div>';
    items.push({ concept:t.concept, qid:'sk-'+ti+'-'+qi, question:'"'+tx.title+'": '+q.q, userAnswer:q.options[j].text, correctAnswer:correct.text, ok,
      mistakeType:'Scan / detail error', explanation:correct.why,
      snapshot:{ kind:'mc', tag:'Skim & scan', prompt:q.q+'<br><span class="text-xs text-slate-400">("'+esc(tx.title)+'")</span>', options:q.options, explanation:correct.why, concept:t.concept } });
  }));
  DC.pendingReading = { items, opgave:'Opgave 2A (skim)', store:'chat', taskKey:'skim', time:Math.round((Date.now()-DC.rdStartTs)/1000), confBox:'sk-conf' };
  DC.skLocked = false;
  DC.readingAskConf('sk-conf');
};

/* =====================================================================
   PHASE 3.3 — MISTAKE PATTERN ANALYZER
   ===================================================================== */
(function(){
  const _wk = Brain.weaknesses;
  Brain.weaknesses = function(){
    const out = _wk();
    const s = DC.state, b = s.behavior;
    const det = s.patterns = s.patterns||{};
    const hist = id => (s.concepts[id]||{history:[]}).history;
    // Time Marker Blindness: inv-time accuracy low while v2-main (subject-first) decent
    const invT = hist('inv-time'), v2 = hist('v2-main');
    const acc = h => h.length? h.filter(x=>x.ok).length/h.length : null;
    if (invT.length>=3 && acc(invT)<0.5 && (acc(v2)===null || acc(v2)>=0.6)){
      det.timeMarker = Date.now();
      out.unshift({ name:'Time Marker Blindness', evidence:'V2 fails after time expressions ('+Math.round(acc(invT)*100)+'% on inversion) although subject-first sentences go fine.',
        meaning:'You apply V2 only when the sentence LOOKS English. Fronted time words switch the rule off in your head.',
        advice:'Look for the verb in position 2 every time a sentence starts with a time word. Train: cover the time phrase, find the verb, uncover.',
        action:'Drill inversion now', actionFn:"DC.go('gym');DC.sub.gym='sb';DC.renderGym()" });
    }
    // Fordi Trap
    const fordiErrs = s.errors.filter(e=>(e.concept==='sav-conn'||e.concept==='adv-sub') && /fordi|selvom|hvis/.test(e.question+e.userAnswer)).length;
    if (fordiErrs>2){
      det.fordiTrap = Date.now();
      out.unshift({ name:'The Fordi Trap', evidence:fordiErrs+' errors with main-clause order after fordi/selvom/hvis.',
        meaning:'Your main-clause habit follows you into subordinate clauses.',
        advice:'After fordi, ikke jumps LEFT of the verb. Say it as a rhythm: for-di-jeg-IKKE-kan.',
        action:'Review Lesson 4 (SAV)', actionFn:"DC.go('learn');DC.openLesson('l4')" });
    }
    // Confidence-Accuracy Gap
    if (b.answers>=10 && b.confWrong/Math.max(1,b.answers) > 0.30){
      det.confGap = Date.now();
      out.unshift({ name:'Confidence-Accuracy Gap', evidence:Math.round(100*b.confWrong/b.answers)+'% of your answers were confident-but-wrong.',
        meaning:'Your inner certainty meter is mis-calibrated — dangerous on exam day, where checking feels unnecessary.',
        advice:'Slow down and use the staged hints BEFORE answering, even when you feel sure. Confidence must be earned back through verified answers.',
        action:'Open Review Queue', actionFn:"DC.go('review')" });
    }
    // Avoidance Behavior
    const sc = s.sessionCount||0;
    const wGap = sc - (s.lastWritingSession||0), oGap = sc - (s.lastOralSession||0);
    if (sc>=4 && (wGap>=3 || oGap>=3)){
      det.avoidance = Date.now();
      const which = [wGap>=3?'Writing':null, oGap>=3?'Oral':null].filter(Boolean).join(' and ');
      out.unshift({ name:'Avoidance Behavior', evidence:which+' not opened for '+Math.max(wGap,oGap)+' sessions in a row.',
        meaning:'You train what you like, not what the exam asks. Modul 3.3 tests all skills equally.',
        advice:'The exam tests all skills equally — give the avoided module the FIRST ten minutes of your next session, while energy is high.',
        action:'Open '+(wGap>=oGap?'Writing Lab':'Oral Strategist'), actionFn:wGap>=oGap?"DC.go('writing')":"DC.go('oral')" });
    }
    // SAV Reversal
    const savErrs = s.errors.filter(e=>e.mistakeType && /main-clause order|Main-clause order/i.test(e.mistakeType)).length;
    if (savErrs>=3){
      det.savReversal = Date.now();
      out.unshift({ name:'SAV Reversal', evidence:savErrs+' answers used main-clause order inside subordinate clauses.',
        meaning:'You hear the connector but keep driving with main-clause word order.',
        advice:'After subordinating conjunctions, switch to SAV: Subject + Adverb + Verb. Pin the QuickRef card open while you write.',
        action:'Open Quick Reference', actionFn:'DC.quickRef()' });
    }
    DC.save();
    return out.slice(0,4);
  };
})();

/* =====================================================================
   PHASE 3.4 — WRITING STRUCTURE VISUALIZER
   ===================================================================== */
const OPENER_PHRASES = ['jeg skriver til','jeg skriver, fordi','jeg skriver fordi','grunden til','jeg vil gerne','jeg kontakter','tak for din mail','tak for jeres','jeg har fået','mit navn er','jeg hedder','tusind tak for'];
const CLOSER_PHRASES = ['på forhånd tak','venlig hilsen','med venlig hilsen','mange hilsner','jeg ser frem','knus','hilsen','vi ses','kærlig hilsen','god dag'];
DC.checkStructure = function(){
  const taskId = DC.sub.writing||'w1a';
  const t = WRITING.tasks.find(x=>x.id===taskId);
  const text = ((document.getElementById('w-final')||{}).value||'').trim() || ((document.getElementById('w-draft')||{}).value||'').trim();
  if (!text){ DC.toast('Write something in the draft or final box first — then I can analyse the structure.','warn'); return; }
  const low = text.toLowerCase();
  const paras = text.split(/\n\s*\n/).filter(p=>p.trim());
  const words = wordCount(text);
  const firstSentence = (text.split(/[.!?]/)[0]||'').toLowerCase();
  const hasOpener = OPENER_PHRASES.some(p=> low.slice(0, 220).includes(p));
  const hasCloser = CLOSER_PHRASES.some(p=> low.slice(-160).includes(p));
  const connWords = WRITING.connectors.map(c=>c.w).filter(w=>w.length>2);
  let connCount = 0; const found = [];
  connWords.forEach(w=>{ const m = (low.match(new RegExp('(^|[^a-zæøå])'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'($|[^a-zæøå])','g'))||[]).length; if (m>0){ connCount+=m; found.push(w); } });
  // SAV spot-check
  const savBad = [...text.matchAll(/\b(fordi|selvom|hvis|når|at)\s+(\w+)\s+(er|var|har|havde|kan|kunne|vil|ville|skal|skulle|må|bliver|blev|kommer|gør|går)\s+(ikke|aldrig|altid|tit)\b/gi)];
  const savGood = [...text.matchAll(/\b(fordi|selvom|hvis|når|at)\s+(\w+)\s+(ikke|aldrig|altid|tit)\b/gi)];
  // highlighted text
  let hl = esc(text);
  found.forEach(w=>{ hl = hl.replace(new RegExp('\\b('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')\\b','gi'), '<mark style="background:#d9ebf4;color:#0b6584;border-radius:3px;padding:0 2px">$1</mark>'); });
  const okLen = words>=t.minWords && words<=t.maxWords+40;
  const warns = [];
  if (!hasOpener) warns.push('No clear reason-for-writing in the opening. Start with "Jeg skriver til jer, fordi…" or "Tak for din mail…".');
  if (connCount<3) warns.push('Only '+connCount+' connector'+(connCount===1?'':'s')+' found — the censor looks for fordi/derfor/men/desuden. Aim for at least 3-4.');
  if (!hasCloser) warns.push('No closing phrase detected. End with "På forhånd tak…" + "Venlig hilsen" (or warm equivalents to a friend).');
  if (!okLen) warns.push('Length: '+words+' words — the task requires '+(t.opgave==='Opgave 1'?t.minWords+'–'+t.maxWords:'min. '+t.minWords)+'.');
  if (paras.length<3) warns.push('Only '+paras.length+' paragraph'+(paras.length===1?'':'s')+'. Use blank lines: greeting/opening → body (1-2) → closing.');
  savBad.forEach(m=> warns.push('Possible SAV error: "…'+esc(m[0])+'…" — after '+m[1]+' the adverb usually moves BEFORE the verb ("'+m[1]+' '+m[2]+' '+m[4]+' '+m[3]+'").'));
  const op = paras.length? wordCount(paras[0]) : 0, cl = paras.length>1? wordCount(paras[paras.length-1]) : 0, body = Math.max(0, words-op-cl);
  const seg = (n,color,label)=> '<div class="h-full flex items-center justify-center text-[10px] font-bold text-white" style="width:'+Math.max(6,pct(n,words))+'%;background:'+color+'">'+label+'</div>';
  let h = '<div><div class="flex items-center justify-between mb-1"><h3 class="font-bold text-slate-100 flex items-center gap-2"><i data-lucide="scan-line" class="w-5 h-5 text-indigo-300"></i>Structure check</h3><button onclick="DC.closeModal()" class="text-slate-500 hover:text-slate-300"><i data-lucide="x" class="w-5 h-5"></i></button></div>';
  h += '<div class="grid grid-cols-3 gap-2 my-3 text-center">'+
    '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-2"><div class="text-lg font-extrabold '+(okLen?'text-emerald-300':'text-amber-300')+'">'+words+'</div><div class="text-[10px] uppercase text-slate-500">words</div></div>'+
    '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-2"><div class="text-lg font-extrabold text-slate-200">'+paras.length+'</div><div class="text-[10px] uppercase text-slate-500">paragraphs</div></div>'+
    '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-2"><div class="text-lg font-extrabold '+(connCount>=3?'text-emerald-300':'text-amber-300')+'">'+connCount+'</div><div class="text-[10px] uppercase text-slate-500">connectors</div></div></div>';
  h += '<div class="flex h-7 rounded-lg overflow-hidden border border-slate-700 mb-1">'+seg(op,(hasOpener?'#2e7d32':'#b78103'),'Opening '+op)+seg(body,'#0d7090','Body '+body)+seg(cl,(hasCloser?'#2e7d32':'#b78103'),'Closing '+cl)+'</div>';
  h += '<div class="text-[10px] text-slate-500 mb-3">green = phrase detected · amber = expected phrase missing</div>';
  h += '<div class="flex flex-wrap gap-1.5 mb-3">'+
    badgeFlag(hasOpener,'Reason-for-writing opener')+badgeFlag(connCount>=3,'3+ connectors')+badgeFlag(hasCloser,'Closing phrase')+badgeFlag(okLen,'Length OK')+badgeFlag(savBad.length===0,'SAV spot-check'+(savGood.length?' ('+savGood.length+' correct found)':''))+'</div>';
  if (warns.length){ h += '<div class="space-y-1.5 mb-3">'+warns.map(w=>'<div class="text-xs text-amber-100 bg-amber-500/10 border border-amber-500/30 rounded-lg px-2.5 py-1.5 flex items-start gap-1.5"><i data-lucide="alert-triangle" class="w-3.5 h-3.5 mt-0.5 shrink-0"></i>'+w+'</div>').join('')+'</div>'; }
  else h += '<div class="text-sm text-emerald-300 mb-3 flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4"></i>Structure looks complete — now read it aloud once for rhythm and spelling.</div>';
  h += '<div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Your text (connectors highlighted)</div>'+
    '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-sm leading-6 text-slate-200 whitespace-pre-line max-h-60 overflow-y-auto">'+hl+'</div></div>';
  DC.modal(h);
};
function badgeFlag(ok,label){ return '<span class="text-[11px] font-semibold rounded-lg px-2 py-1 '+(ok?'bg-emerald-500/15 text-emerald-300':'bg-amber-500/15 text-amber-300')+'">'+(ok?'✓ ':'△ ')+label+'</span>'; }
(function(){ /* inject the button into the Writing Lab */
  const _rw = DC.renderWriting;
  DC.renderWriting = function(){
    _rw();
    const btnRow = document.getElementById('w-actions');
    if (btnRow){
      const b = document.createElement('button');
      b.className = 'px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2';
      b.innerHTML = '<i data-lucide="scan-line" class="w-4 h-4"></i>Check My Structure';
      b.onclick = DC.checkStructure;
      btnRow.insertBefore(b, btnRow.firstChild);
      const c = document.createElement('button');
      c.className = 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2';
      c.innerHTML = '<i data-lucide="clipboard-copy" class="w-4 h-4"></i>Copy correction prompt';
      c.onclick = function(){ DC.copyCensorPrompt(DC.sub.writing||'w1a','lab'); };
      btnRow.insertBefore(c, btnRow.children[1]);
      const d = document.createElement('button');
      d.className = 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2';
      d.innerHTML = '<i data-lucide="clipboard-check" class="w-4 h-4"></i>Log corrections';
      d.onclick = function(){ DC.ingestCensorReply(DC.sub.writing||'w1a','lab'); };
      btnRow.insertBefore(d, btnRow.children[2]);
      DC.icons();
    }
    DC.state.lastWritingSession = DC.state.sessionCount||0; DC.save();
  };
})();

/* =====================================================================
   LLM-AS-CENSOR — copy a grading prompt for ChatGPT/Claude/Gemini
   ===================================================================== */
DC.buildCensorPrompt = function(task, text){
  const lenReq = task.opgave==='Opgave 1' ? task.minWords+'–'+task.maxWords+' words' : 'minimum '+task.minWords+' words';
  let p = 'You are an experienced censor (examiner) for the Danish Danskuddannelse 3, Modul 3.3 written modultest (skriftlig kommunikation). Grade the text below as if a kursist had handed it in for the real exam. Be strict but fair — this level expects simple, mostly correct Danish, not perfect Danish.\n\n';
  p += 'TASK ('+task.opgave+'): '+task.taskIntro+'\n';
  p += 'Situation: '+task.situation+'\n';
  if (task.email) p += 'The e-mail the kursist is replying to:\n'+task.email+'\n';
  p += 'Points the text must cover:\n' + task.bullets.map(b=>'- '+b).join('\n') + '\n';
  p += 'Length requirement: '+lenReq+'\n\n';
  p += 'RUBRIC — score 1 point per line the text genuinely satisfies, out of '+EXAM.rubric.length+' (grouped by assessment dimension):\n' + EXAM.rubric.map(r=>'- ['+r.cat+'] '+r.text).join('\n') + '\n\n';
  p += "KURSIST'S TEXT:\n\"\"\"\n"+text+'\n"""\n\n';
  p += 'Reply in English with three parts:\n';
  p += '(1) A score out of '+EXAM.rubric.length+', one line per rubric point (met / not met + why).\n';
  p += '(2) Every language error found (word order/V2, SAV in subordinate clauses, adjective agreement, verb forms, spelling, prepositions), each on its OWN line in EXACTLY this format so it can be parsed automatically:\nERROR: wrong text here → correct text here :: one-line English explanation\n';
  p += '(3) A corrected rewrite of the whole text at a clear passing level.';
  return p;
};
DC.copyCensorPrompt = function(taskId, source){
  let task, text;
  if (source==='exam'){
    task = EXAM.writing[taskId];
    text = ((document.getElementById('exw-'+taskId)||{}).value) || (DC.examS&&DC.examS.texts?DC.examS.texts[taskId]:'') || '';
  } else if (source==='sim'){
    const ex = EXAMSETS[DC.sim.si];
    task = ex.writing[taskId];
    text = ((document.getElementById('simw-'+taskId)||{}).value) || (DC.sim&&DC.sim.texts?DC.sim.texts[taskId]:'') || '';
  } else {
    task = WRITING.tasks.find(x=>x.id===taskId);
    text = ((document.getElementById('w-final')||{}).value) || ((document.getElementById('w-draft')||{}).value) || '';
  }
  text = (text||'').trim();
  if (!task){ return; }
  if (!text){ DC.toast('Write something first — then I can build the correction prompt.','warn'); return; }
  const prompt = DC.buildCensorPrompt(task, text);
  const done = function(){ DC.toast('Correction prompt copied! Paste it into ChatGPT, Claude or Gemini to get a graded, corrected version.','ok'); };
  const fail = function(){ DC.toast('Could not copy automatically — select and copy the prompt manually.','err'); DC.modal('<div class="text-sm text-slate-100 mb-2 font-bold">Correction prompt</div><textarea readonly rows="14" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono">'+esc(prompt)+'</textarea>'); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(prompt).then(done, fail);
  else fail();
};
/* paste the censor's reply back in — every "ERROR: wrong → correct :: explanation" line
   becomes a real Error Notebook entry, so writing mistakes actually feed the review loop */
DC.ingestCensorReply = function(taskId, source){
  let task;
  if (source==='exam') task = EXAM.writing[taskId];
  else if (source==='sim') task = EXAMSETS[DC.sim.si].writing[taskId];
  else task = WRITING.tasks.find(x=>x.id===taskId);
  if (!task) return;
  DC._censorTask = task;
  DC.modal('<div class="text-sm text-slate-100 mb-2 font-bold">Log the censor’s corrections</div>'+
    '<p class="text-xs text-slate-400 mb-2">Paste the LLM’s full reply below — every line formatted like <code>ERROR: wrong → correct :: explanation</code> is logged as a mistake in your Error Notebook.</p>'+
    '<textarea id="censor-paste" rows="10" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono mb-3" placeholder="Paste the censor’s reply here…"></textarea>'+
    '<button onclick="DC.parseCensorReply()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Parse &amp; save to Error Notebook</button>');
  DC.icons();
};
DC.parseCensorReply = function(){
  const task = DC._censorTask || {};
  const raw = (document.getElementById('censor-paste')||{}).value || '';
  const re = /ERROR:\s*(.+?)\s*(?:→|->)\s*(.+?)\s*::\s*(.+)/gi;
  let m, n = 0;
  while ((m = re.exec(raw))){
    const wrong = m[1].trim(), correct = m[2].trim(), why = m[3].trim();
    if (!wrong || !correct) continue;
    Brain.record({ module:'Writing', opgave:task.opgave||'Skrivning', concept:task.concept||'w-check', correct:false, confidence:'sure', hintsUsed:0, timeSpent:0,
      question:'Censor correction — '+(task.title||'writing task'), userAnswer:wrong, correctAnswer:correct, mistakeType:'Censor-flagged language error', explanation:why, snapshot:null });
    n++;
  }
  if (!n){ DC.toast('No "ERROR: wrong → correct :: explanation" lines found — check the pasted text matches the requested format.','warn'); return; }
  DC.closeModal();
  DC.toast(n+' correction'+(n>1?'s':'')+' logged to your Error Notebook.','ok');
};

/* =====================================================================
   PHASE 3.5 + 3.6 + 2.4 — oral practice timer, vocab builder, pressure
   ===================================================================== */
DC.oralSessions = function(){ return DC.state.oral.sessions||(DC.state.oral.sessions=[]); };
DC.oralPanelHTML = function(type, topicId){
  const sess = DC.oralSessions().filter(x=>x.type===type);
  const avg = k => sess.length? (sess.reduce((t,x)=>t+x[k],0)/sess.length).toFixed(1) : '—';
  return '<div class="card p-5 !border-emerald-500/30"><div class="flex items-center gap-2 mb-1"><i data-lucide="mic" class="w-5 h-5 text-emerald-300"></i><h3 class="font-bold text-slate-100">Practice Speaking — '+(type==='o1'?'2-minute presentation':'5-minute conversation')+'</h3>'+
    '<span class="ml-auto text-xs text-slate-500">'+sess.length+' session'+(sess.length===1?'':'s')+' · avg fluency '+avg('flu')+'/5 · avg vocab '+avg('voc')+'/5</span></div>'+
    '<p class="text-xs text-slate-400 mb-3">'+(type==='o1'?'Keep the mindmap visible, start the timer and present OUT LOUD for the full two minutes. No stopping, no English.':'Start the timer, reveal one examiner question at a time and answer each aloud with PREP before revealing the next.')+'</p>'+
    '<div id="oral-prac" class="space-y-3"><button onclick="DC.oralPracStart(\''+type+'\',\''+(topicId||'')+'\')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="play" class="w-4 h-4"></i>Start '+(type==='o1'?'2-min presentation':'5-min practice')+' timer</button></div></div>';
};
DC.oralPracStart = function(type, topicId){
  DC.oralPrac = { type, topicId, qi:0, start:Date.now() };
  const secs = type==='o1' ? 120 : 300;
  let h = '<div class="flex items-center gap-3"><span class="text-3xl font-mono font-extrabold text-amber-300" id="oprac-timer">'+fmtTime(secs)+'</span><button onclick="DC.stopTimer(\'oprac\');DC.oralPracAssess()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Finish early</button></div>';
  if (type==='o2'){
    const sc = ORAL.scenarios.find(x=>x.id===(topicId||'sc1')) || ORAL.scenarios[0];
    DC.oralPrac.pool = sc.del2.map(d=>d.q).concat(sc.followChallenges);
    h += '<div id="oprac-qs" class="space-y-2"></div><button id="oprac-next" onclick="DC.oralPracNextQ()" class="px-3 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-500/80 text-white text-sm font-semibold">Reveal question 1 of '+DC.oralPrac.pool.length+'</button>';
  }
  h += DC.recBoothHTML('oprac-rec');
  document.getElementById('oral-prac').innerHTML = h;
  DC.startTimer('oprac', secs, 'oprac-timer', function(){ DC.toast('Time! How did it feel? Assess yourself honestly below.','warn'); DC.oralPracAssess(); });
  DC.icons();
};
/* ---------- record-yourself booth (native MediaRecorder — no library, no persistence:
   the point is hearing your own fluency right after speaking, not building an audio archive) ---------- */
DC._rec = {};
DC.recBoothHTML = function(id){
  return '<div class="flex items-center gap-2 flex-wrap mt-2 pt-2 border-t border-slate-800" id="'+id+'-wrap">'+
    '<button onclick="DC.recToggle(\''+id+'\')" id="'+id+'-btn" class="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5"><i data-lucide="mic" class="w-3.5 h-3.5"></i>Record yourself</button>'+
    '<span id="'+id+'-status" class="text-xs text-slate-500"></span>'+
    '<div id="'+id+'-player" class="w-full"></div></div>';
};
DC.recToggle = function(id){
  const active = DC._rec[id];
  if (active && active.mr && active.mr.state==='recording'){ active.mr.stop(); return; }
  if (!navigator.mediaDevices || !window.MediaRecorder){ DC.toast('Recording is not supported in this browser.','warn'); return; }
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    const chunks = [];
    const mr = new MediaRecorder(stream);
    DC._rec[id] = { mr, stream };
    mr.ondataavailable = function(e){ if (e.data.size>0) chunks.push(e.data); };
    mr.onstop = function(){
      stream.getTracks().forEach(t=>t.stop());
      const url = URL.createObjectURL(new Blob(chunks, {type:'audio/webm'}));
      const player = document.getElementById(id+'-player');
      if (player) player.innerHTML = '<audio controls src="'+url+'" class="w-full mt-1"></audio>';
      const btn = document.getElementById(id+'-btn');
      if (btn){ btn.innerHTML = '<i data-lucide="mic" class="w-3.5 h-3.5"></i>Record again'; DC.icons(); }
      const status = document.getElementById(id+'-status'); if (status) status.textContent = '';
    };
    mr.start();
    const btn = document.getElementById(id+'-btn');
    if (btn){ btn.innerHTML = '<i data-lucide="square" class="w-3.5 h-3.5"></i>Stop recording'; DC.icons(); }
    const status = document.getElementById(id+'-status'); if (status) status.textContent = 'Recording… speak now.';
  }).catch(function(){ DC.toast('Microphone access was blocked or unavailable.','warn'); });
};
DC.oralPracNextQ = function(){
  const p = DC.oralPrac;
  if (p.qi >= p.pool.length) return;
  document.getElementById('oprac-qs').insertAdjacentHTML('beforeend','<div class="fade-in text-sm bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2"><b class="text-amber-300">'+(p.qi+1)+'.</b> '+esc(p.pool[p.qi])+'</div>');
  if (DC.state.oral.examinerVoice) DC.speak(p.pool[p.qi]);
  p.qi++;
  const btn = document.getElementById('oprac-next');
  if (p.qi>=p.pool.length) btn.style.display='none'; else btn.textContent = 'Reveal question '+(p.qi+1)+' of '+p.pool.length;
};
DC.oralPracAssess = function(){
  DC.stopTimer('oprac');
  const checksDef = ['I spoke the full time without long silences','I covered all branches / answered every question','I used at least two concrete examples','I used opinion phrases (jeg synes, efter min mening …)','I used connectors (fordi, derfor, men, selvom …)','I used thinking-time phrases instead of stopping'];
  DC.oralPrac.checks = checksDef.map(()=>false); DC.oralPrac.flu = 0; DC.oralPrac.voc = 0;
  let h = '<div class="fade-in space-y-2"><div class="font-semibold text-sm text-slate-100">Self-assessment — be honest, it calibrates your coaching:</div>';
  checksDef.forEach((c,i)=> h += '<label class="flex items-start gap-2 text-sm text-slate-300 cursor-pointer"><input type="checkbox" onchange="DC.oralPrac.checks['+i+']=this.checked" class="mt-0.5 accent-emerald-500">'+c+'</label>');
  ['flu|Fluency (flow, pauses)','voc|Vocabulary (range, precision)'].forEach(x=>{
    const [k,label] = x.split('|');
    h += '<div class="flex items-center gap-2 text-sm"><span class="w-52 text-slate-400">'+label+':</span>'+[1,2,3,4,5].map(n=>'<button onclick="DC.oralPrac.'+k+'='+n+';this.parentElement.querySelectorAll(\'button\').forEach((b,i)=>b.classList.toggle(\'!border-indigo-400\',i<'+n+'))" class="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 font-bold text-slate-400">'+n+'</button>').join('')+'</div>';
  });
  h += '<button onclick="DC.oralPracSave()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold mt-1">Save session</button></div>';
  document.getElementById('oral-prac').innerHTML = h;
};
DC.oralPracSave = function(){
  const p = DC.oralPrac;
  if (!p.flu || !p.voc){ DC.toast('Rate fluency and vocabulary (1–5) first.','warn'); return; }
  DC.oralSessions().push({ ts:Date.now(), type:p.type, topic:p.topicId, checks:p.checks.filter(Boolean).length, flu:p.flu, voc:p.voc });
  const good = p.checks.filter(Boolean).length>=4 && (p.flu+p.voc)>=6;
  ['o-expand','o-mindmap'].forEach(c=> DC.state.concepts[p.type==='o1'?c:(c==='o-mindmap'?'o-conversation':c)].history.push({ok:good, conf:'unsure', ts:Date.now(), hints:0}));
  DC.state.behavior.lastOral = Date.now();
  DC.state.lastOralSession = DC.state.sessionCount||0;
  DC.save();
  DC.toast('Session saved — '+p.checks.filter(Boolean).length+'/6 checks, fluency '+p.flu+'/5, vocab '+p.voc+'/5. '+(good?'Stærkt!':'Keep at it — averages move with every session.'), good?'ok':'info');
  DC.renderOral();
};
/* inject panels into oral views */
(function(){
  const _o1 = DC.oralO1, _o2 = DC.oralO2;
  DC.oralO1 = function(){
    _o1();
    const mmId = DC.sub.mm || 'mm1';
    const body = document.getElementById('oral-body');
    let extra = DC.oralPanelHTML('o1', mmId);
    /* vocabulary builder */
    const vocab = ORAL_VOCAB[mmId]||[];
    const known = DC.state.vocabKnown = DC.state.vocabKnown||{};
    const kn = vocab.filter((v,i)=>known[mmId+'-'+i]).length;
    extra += '<div class="card p-5 mt-3"><div class="flex items-center gap-2 mb-1"><i data-lucide="book-a" class="w-5 h-5 text-indigo-300"></i><h3 class="font-bold text-slate-100">Vocabulary Builder · '+esc((ORAL.mindmaps.find(m=>m.id===mmId)||{}).title||'')+'</h3><span class="ml-auto text-xs font-bold text-emerald-300">'+kn+'/'+vocab.length+' known</span></div>'+
      '<p class="text-xs text-slate-400 mb-3">25 exam-relevant words. Read the example aloud, then mark the ones you can USE (not just recognise).</p><div class="grid md:grid-cols-2 gap-2">';
    vocab.forEach((v,i)=>{
      const k = known[mmId+'-'+i];
      extra += '<div class="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 flex items-start gap-2"><div class="flex-1"><b class="text-slate-100">'+esc(v.da)+'</b> <span class="text-[10px] text-slate-500">'+v.pos+'</span> <span class="text-xs text-slate-400">— '+esc(v.en)+'</span><div class="text-xs text-slate-400 italic mt-0.5">'+esc(v.ex)+'</div></div>'+
        '<button onclick="DC.vocabToggle(\''+mmId+'\','+i+')" class="shrink-0 text-[10px] font-bold rounded-lg px-2 py-1 border '+(k?'bg-emerald-500/20 border-emerald-500/40 text-emerald-300':'bg-slate-800 border-slate-700 text-slate-500')+'">'+(k?'✓':'know it?')+'</button></div>';
    });
    extra += '</div></div>';
    /* examiner pressure training */
    const ep = EXAMINER_PRESSURE.find(x=>x.topic===mmId);
    if (ep){
      extra += '<div class="card p-5 mt-3 !border-rose-500/30"><div class="flex items-center gap-2 mb-1"><i data-lucide="flame" class="w-5 h-5 text-rose-300"></i><h3 class="font-bold text-slate-100">Examiner Pressure Training</h3></div>'+
        '<p class="text-xs text-slate-400 mb-3">Real examiners ask follow-ups in CHAINS that dig deeper. Answer each aloud, then open "What is tested" to compare your instinct with the strategy.</p>';
      ep.chains.forEach(ch=>{
        let body2 = '';
        ch.steps.forEach((st,si)=>{
          body2 += '<div class="mb-2 bg-slate-900/70 border border-slate-800 rounded-xl p-3"><div class="text-sm font-semibold text-slate-100 mb-1.5">'+(si+1)+'. “'+esc(st.q)+'”</div>'+
            accHTML('What is tested + how to answer','<div class="text-xs"><b class="text-rose-300">Tests:</b> '+esc(st.tests)+'</div><div class="text-xs mt-1"><b class="text-emerald-300">Approach:</b> '+esc(st.approach)+'</div>','target',false)+'</div>';
        });
        extra += accHTML('<span class="text-rose-200">'+esc(ch.name)+' ('+ch.steps.length+' escalating questions)</span>', body2, 'flame', false);
        extra += '<div class="h-2"></div>';
      });
      extra += '</div>';
    }
    body.insertAdjacentHTML('beforeend', extra);
    DC.icons();
  };
  DC.oralO2 = function(){
    _o2();
    document.getElementById('oral-body').insertAdjacentHTML('beforeend', DC.oralPanelHTML('o2', DC.sub.sc||'sc1'));
    DC.icons();
  };
})();
DC.vocabToggle = function(mmId, i){
  const k = DC.state.vocabKnown = DC.state.vocabKnown||{};
  k[mmId+'-'+i] = !k[mmId+'-'+i];
  DC.save(); DC.renderOral();
};

/* =====================================================================
   PHASE 4 — SKILLS GYM
   ===================================================================== */
DC.renderGym = function(){
  const tab = DC.sub.gym || 'dict';
  const g = DC.state.gym = DC.state.gym||{dict:{},sb:{},tr:{},se:{}};
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<div class="card p-4"><div class="flex items-center gap-2 mb-3"><i data-lucide="dumbbell" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Skills Gym — four ways to drill the same muscles</h2></div><div class="flex gap-1.5 flex-wrap">';
  [['dict','Dictation','ear'],['sb','Sentence Builder','blocks'],['tr','Translation','languages'],['se','Spot the Error','search-x']].forEach(t=>{
    const done = Object.keys(g[t[0]]||{}).length;
    const total = {dict:DICTATION.length, sb:BUILDER.length, tr:TRANSLATE.length, se:SPOTERR.length}[t[0]];
    h += '<button onclick="DC.sub.gym=\''+t[0]+'\';DC.renderGym()" class="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 '+(tab===t[0]?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200')+'"><i data-lucide="'+t[2]+'" class="w-3.5 h-3.5"></i>'+t[1]+' <span class="text-slate-500">'+done+'/'+total+'</span></button>';
  });
  h += '</div></div><div id="gym-body"></div></div>';
  document.getElementById('main').innerHTML = h;
  ({dict:DC.gymDict, sb:DC.gymSB, tr:DC.gymTR, se:DC.gymSE}[tab])();
  DC.icons();
};
/* ---- 4.1 dictation ---- */
DC.gymDict = function(){
  const g = DC.state.gym.dict;
  const i = DC.sub.dictI!=null? DC.sub.dictI : DICTATION.findIndex((x,n)=>!(n in g));
  const idx = i===-1?0:i;
  const d = DICTATION[idx];
  let h = '<div class="card p-5"><div class="flex items-center justify-between flex-wrap gap-2 mb-2"><h3 class="font-bold text-slate-100 text-sm">Dictation '+(idx+1)+' of '+DICTATION.length+' <span class="text-slate-500 font-normal">· focus: '+esc(d.focus)+'</span></h3>'+
    '<div class="flex gap-1 flex-wrap">'+DICTATION.map((x,n)=>'<button onclick="DC.sub.dictI='+n+';DC.renderGym()" class="w-6 h-6 rounded text-[10px] font-bold border '+(n===idx?'ring-2 ring-indigo-400 ':'')+((''+n) in g? (g[n]>=0.85?'bg-emerald-500/20 text-emerald-300 border-emerald-500/40':'bg-amber-500/20 text-amber-300 border-amber-500/40'):'bg-slate-900 border-slate-800 text-slate-500')+'">'+(n+1)+'</button>').join('')+'</div></div>';
  h += '<p class="text-xs text-slate-400 mb-3">The sentence shows for <b>5 seconds</b>. Memorise it, then type it from memory — spelling (æ/ø/å!), word order and every word count.</p>';
  h += '<div id="dict-stage"><button onclick="DC.dictShow('+idx+')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="eye" class="w-4 h-4"></i>Show the sentence (5 s)</button></div></div>';
  document.getElementById('gym-body').innerHTML = h;
};
DC.dictShow = function(idx){
  const d = DICTATION[idx];
  document.getElementById('dict-stage').innerHTML = '<div class="text-xl font-semibold text-slate-100 bg-slate-900/70 border border-indigo-500/40 rounded-xl p-4 text-center fade-in">'+esc(d.da)+'</div><div class="text-center text-xs text-slate-500 mt-2">Memorising… <span id="dict-cd">5</span></div>';
  let left = 5;
  const int = setInterval(()=>{
    left--;
    const el = document.getElementById('dict-cd');
    if (el) el.textContent = left;
    if (left<=0){ clearInterval(int); DC.dictType(idx); }
  },1000);
};
DC.dictType = function(idx){
  document.getElementById('dict-stage').innerHTML = '<textarea id="dict-in" rows="2" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none" placeholder="Type the sentence from memory…" autofocus></textarea>'+
    '<button onclick="DC.dictCheck('+idx+')" class="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Check</button>';
  document.getElementById('dict-in').focus();
};
DC.dictCheck = function(idx){
  const d = DICTATION[idx];
  const norm = s => s.toLowerCase().replace(/[.,!?;:"”„]/g,'').trim().split(/\s+/).filter(Boolean);
  const target = norm(d.da), typed = norm((document.getElementById('dict-in')||{}).value||'');
  let correct = 0;
  const out = target.map((w,i)=>{
    if (typed[i]===w){ correct++; return '<span class="font-semibold" style="color:#2e7d32">'+esc(d.da.split(/\s+/)[i])+'</span>'; }
    if (typed.includes(w)){ correct+=0.5; return '<span class="font-semibold" style="color:#b78103" title="right word, wrong place">'+esc(d.da.split(/\s+/)[i])+'</span>'; }
    if (typed[i]) return '<span class="font-semibold" style="color:#c62828" title="you wrote: '+esc(typed[i])+'">'+esc(d.da.split(/\s+/)[i])+'</span>';
    return '<span class="font-semibold" style="color:#b78103" title="missing">'+esc(d.da.split(/\s+/)[i])+'</span>';
  }).join(' ');
  const score = correct/target.length;
  DC.state.gym.dict[idx] = score;
  Brain.record({ module:'Skills Gym', opgave:'Dictation', concept:'w-check', qid:'dict-'+idx, question:'Dictation: '+d.da,
    userAnswer:(document.getElementById('dict-in')||{}).value||'', correctAnswer:d.da, correct:score>=0.85, confidence:'sure',
    mistakeType:'Spelling / word-order from memory', explanation:'Target: "'+d.da+'". Green = correct in place, amber = right word wrong place or missing, red = misspelled/wrong word.',
    memoryTrick:d.focus, hintsUsed:0, timeSpent:0, snapshot:null });
  document.getElementById('dict-stage').innerHTML = '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-lg leading-8">'+out+'</div>'+
    '<div class="text-sm mt-2 '+(score>=0.85?'text-emerald-300':'text-amber-300')+'">'+Math.round(score*100)+'% — '+(score>=0.85?'flot hukommelse!':'replay it and listen for the small words (ikke, så, til).')+'</div>'+
    '<div class="flex gap-2 mt-3"><button onclick="DC.dictShow('+idx+')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Try again</button>'+
    (idx<DICTATION.length-1?'<button onclick="DC.sub.dictI='+(idx+1)+';DC.renderGym()" class="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Next sentence →</button>':'<button onclick="DC.sub.dictI=0;DC.renderGym()" class="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Start over</button>')+'</div>';
};
/* ---- 4.2 sentence builder ---- */
DC.gymSB = function(){
  const g = DC.state.gym.sb;
  const idx = DC.sub.sbI!=null? DC.sub.sbI : Math.max(0, BUILDER.findIndex((x,n)=>!(n in g)));
  const q = BUILDER[idx===-1?0:idx];
  let h = '<div class="card p-5"><div class="flex items-center justify-between flex-wrap gap-2 mb-3"><h3 class="font-bold text-slate-100 text-sm">Builder '+(idx+1)+' of '+BUILDER.length+'</h3>'+
    '<div class="flex gap-1 flex-wrap">'+BUILDER.map((x,n)=>'<button onclick="DC.sub.sbI='+n+';DC.renderGym()" class="w-6 h-6 rounded text-[10px] font-bold border '+(n===idx?'ring-2 ring-indigo-400 ':'')+((''+n) in g? (g[n]?'bg-emerald-500/20 text-emerald-300 border-emerald-500/40':'bg-rose-500/20 text-rose-300 border-rose-500/40'):'bg-slate-900 border-slate-800 text-slate-500')+'">'+(n+1)+'</button>').join('')+'</div></div>'+
    '<div id="sb-box"></div><div id="sb-next" class="mt-3"></div></div>';
  document.getElementById('gym-body').innerHTML = h;
  DC.qStart('sb-box', Object.assign({prompt:'Arrange the words into a correct sentence:'}, q), { module:'Skills Gym', opgave:'Sentence Builder', qid:q.id,
    onDone:function(sess){
      DC.state.gym.sb[idx] = sess.ok; DC.save();
      document.getElementById('sb-next').innerHTML = (idx<BUILDER.length-1?'<button onclick="DC.sub.sbI='+(idx+1)+';DC.renderGym()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Next →</button>':'<button onclick="DC.sub.sbI=0;DC.renderGym()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Round complete — start over</button>');
    }});
};
/* ---- 4.3 translation ---- */
DC.gymTR = function(){
  const g = DC.state.gym.tr;
  const idx = DC.sub.trI!=null? DC.sub.trI : Math.max(0, TRANSLATE.findIndex((x,n)=>!(n in g)));
  const t = TRANSLATE[idx===-1?0:idx];
  let h = '<div class="card p-5"><div class="flex items-center justify-between flex-wrap gap-2 mb-2"><h3 class="font-bold text-slate-100 text-sm">Translation '+(idx+1)+' of '+TRANSLATE.length+' <span class="text-slate-500 font-normal">· '+esc(CONCEPTS[t.concept].name)+'</span></h3>'+
    '<div class="flex gap-1 flex-wrap">'+TRANSLATE.map((x,n)=>'<button onclick="DC.sub.trI='+n+';DC.renderGym()" class="w-6 h-6 rounded text-[10px] font-bold border '+(n===idx?'ring-2 ring-indigo-400 ':'')+((''+n) in g? (g[n]?'bg-emerald-500/20 text-emerald-300 border-emerald-500/40':'bg-rose-500/20 text-rose-300 border-rose-500/40'):'bg-slate-900 border-slate-800 text-slate-500')+'">'+(n+1)+'</button>').join('')+'</div></div>';
  h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-base font-medium text-slate-100 mb-3">“'+esc(t.en)+'”</div>'+
    '<textarea id="tr-in" rows="2" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none" placeholder="Skriv den danske sætning…"></textarea>'+
    '<div id="tr-stage"><button onclick="DC.trReveal('+idx+')" class="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Show model answer</button></div></div>';
  document.getElementById('gym-body').innerHTML = h;
};
DC.trReveal = function(idx){
  const t = TRANSLATE[idx];
  document.getElementById('tr-stage').innerHTML = '<div class="fade-in mt-3 space-y-3">'+
    '<div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3"><div class="text-[10px] uppercase font-bold text-emerald-300 mb-1">Model</div><div class="text-base font-semibold text-slate-100">'+esc(t.da)+'.</div><div class="text-xs text-slate-400 mt-1">'+esc(t.note)+'</div></div>'+
    deconHTML(t.decon)+
    '<div class="text-sm font-semibold text-slate-100">Compare your STRUCTURE with the model (word choice may differ):</div>'+
    '<div class="flex gap-2 flex-wrap">'+
    '<button onclick="DC.trMark('+idx+',2)" class="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold">✓ Structure matched</button>'+
    '<button onclick="DC.trMark('+idx+',1)" class="px-3 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-500/80 text-white text-sm font-semibold">≈ Close, small slips</button>'+
    '<button onclick="DC.trMark('+idx+',0)" class="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold">✗ Wrong structure</button></div></div>';
  DC.icons();
};
DC.trMark = function(idx, level){
  const t = TRANSLATE[idx];
  DC.state.gym.tr[idx] = level>0;
  Brain.record({ module:'Skills Gym', opgave:'Translation', concept:t.concept, qid:'tr-'+idx, question:'Translate: "'+t.en+'"',
    userAnswer:(document.getElementById('tr-in')||{}).value||'(not typed)', correctAnswer:t.da+'.', correct:level===2, confidence:level===2?'sure':(level===1?'guessed':'unsure'),
    mistakeType:'Structural transfer from English', explanation:t.note, memoryTrick:'', hintsUsed:0, timeSpent:0,
    snapshot:{ kind:'order', tag:'Translation rebuild', prompt:'Rebuild the Danish for: “'+t.en+'”', words:t.da.split(' '), answer:t.da, explanation:t.note, wrongWhy:t.note, decon:t.decon, concept:t.concept } });
  DC.toast(level===2?'Logged as mastered structure.':'Logged — it will come back in your review queue as a rebuild exercise.', level===2?'ok':'info');
  if (idx<TRANSLATE.length-1){ DC.sub.trI = idx+1; } else DC.sub.trI = 0;
  DC.renderGym();
};
/* ---- 4.4 spot the error ---- */
DC.gymSE = function(){
  const g = DC.state.gym.se;
  const idx = DC.sub.seI!=null? DC.sub.seI : Math.max(0, SPOTERR.findIndex((x,n)=>!(n in g)));
  const q = SPOTERR[idx===-1?0:idx];
  DC.seState = { idx, stage:0, hits:0 };
  let h = '<div class="card p-5"><div class="flex items-center justify-between flex-wrap gap-2 mb-2"><h3 class="font-bold text-slate-100 text-sm">Spot the Error '+(idx+1)+' of '+SPOTERR.length+'</h3>'+
    '<div class="flex gap-1 flex-wrap">'+SPOTERR.map((x,n)=>'<button onclick="DC.sub.seI='+n+';DC.renderGym()" class="w-6 h-6 rounded text-[10px] font-bold border '+(n===idx?'ring-2 ring-indigo-400 ':'')+((''+n) in g? (g[n]?'bg-emerald-500/20 text-emerald-300 border-emerald-500/40':'bg-rose-500/20 text-rose-300 border-rose-500/40'):'bg-slate-900 border-slate-800 text-slate-500')+'">'+(n+1)+'</button>').join('')+'</div></div>';
  h += '<p class="text-xs text-slate-400 mb-3"><b>Step 1:</b> click the word that sits in the WRONG place (or is the wrong word).</p>';
  h += '<div class="flex flex-wrap gap-2 mb-3">'+q.sentence.map((w,i)=>'<button id="se-w-'+i+'" onclick="DC.seWord('+i+')" class="chip px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-medium">'+esc(w)+'</button>').join('')+'</div>';
  h += '<div id="se-stage2"></div><div id="se-stage3"></div><div id="se-fb"></div></div>';
  document.getElementById('gym-body').innerHTML = h;
};
DC.seWord = function(i){
  const st = DC.seState, q = SPOTERR[st.idx];
  if (st.stage!==0) return;
  st.stage = 1;
  const ok = i===q.wrong;
  if (ok) st.hits++;
  q.sentence.forEach((w,k)=>{ const el=document.getElementById('se-w-'+k); el.disabled=true; if(k===q.wrong) el.classList.add('opt-correct'); if(k===i&&!ok) el.classList.add('opt-wrong'); });
  let h = '<div class="text-xs mb-2 '+(ok?'text-emerald-300':'text-rose-300')+'">'+(ok?'✓ Exactly — that element breaks the pattern.':'✗ The culprit is "'+esc(q.sentence[q.wrong])+'".')+'</div>';
  h += '<p class="text-xs text-slate-400 mb-2"><b>Step 2:</b> which rule is broken?</p><div class="grid gap-1.5 mb-3">';
  shuffle(q.rules.map((r,ri)=>({r,ri}))).forEach(x=> h += '<button onclick="DC.seRule(\''+esc(x.r).replace(/'/g,"\\'")+'\')" class="opt-btn text-left text-sm px-3 py-2 rounded-xl bg-slate-900 border border-slate-700">'+esc(x.r)+'</button>');
  h += '</div>';
  document.getElementById('se-stage2').innerHTML = h;
};
DC.seRule = function(rule){
  const st = DC.seState, q = SPOTERR[st.idx];
  if (st.stage!==1) return;
  st.stage = 2;
  const ok = rule===q.rule;
  if (ok) st.hits++;
  document.querySelectorAll('#se-stage2 .opt-btn').forEach(b=>{ b.disabled=true; if(b.textContent===q.rule) b.classList.add('opt-correct'); if(b.textContent===rule&&!ok) b.classList.add('opt-wrong'); });
  let h = '<p class="text-xs text-slate-400 mb-2"><b>Step 3:</b> choose the corrected sentence.</p><div class="grid gap-1.5 mb-3">';
  shuffle(q.fixes.map((f,fi)=>({f,fi}))).forEach(x=> h += '<button onclick="DC.seFix('+x.fi+')" class="opt-btn text-left text-sm px-3 py-2 rounded-xl bg-slate-900 border border-slate-700">'+esc(x.f)+'</button>');
  h += '</div>';
  document.getElementById('se-stage3').innerHTML = h;
};
DC.seFix = function(fi){
  const st = DC.seState, q = SPOTERR[st.idx];
  if (st.stage!==2) return;
  st.stage = 3;
  const ok = fi===q.fix;
  if (ok) st.hits++;
  document.querySelectorAll('#se-stage3 .opt-btn').forEach(b=>{ b.disabled=true; if(b.textContent===q.fixes[q.fix]) b.classList.add('opt-correct'); if(b.textContent===q.fixes[fi]&&!ok) b.classList.add('opt-wrong'); });
  const all = st.hits===3;
  DC.state.gym.se[st.idx] = all;
  Brain.record({ module:'Skills Gym', opgave:'Spot the Error', concept:q.concept, qid:q.id, question:'Find the error: "'+q.sentence.join(' ')+'"',
    userAnswer:st.hits+'/3 steps correct', correctAnswer:q.fixes[q.fix], correct:all, confidence:'sure',
    mistakeType:q.rule, explanation:q.explanation, memoryTrick:q.trick, hintsUsed:0, timeSpent:0,
    snapshot:{ kind:'mc', tag:'Spot the Error', prompt:'Choose the CORRECT version of: "'+q.sentence.join(' ')+'"', options:q.fixes.map((f,k)=>({text:f, ok:k===q.fix, mistakeType:q.rule, why:q.explanation})), explanation:q.explanation, trick:q.trick, decon:q.decon, concept:q.concept } });
  document.getElementById('se-fb').innerHTML = '<div class="card p-4 '+(all?'!border-emerald-500/40':'!border-amber-500/40')+' fade-in space-y-2">'+
    '<div class="font-bold '+(all?'text-emerald-300':'text-amber-300')+'">'+st.hits+'/3 steps correct</div>'+
    '<div class="text-sm text-slate-300">'+esc(q.explanation)+'</div>'+
    '<div class="flex items-start gap-2 text-sm bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-3 py-2"><i data-lucide="sparkles" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i><span><b>Memory trick:</b> '+esc(q.trick)+'</span></div>'+
    deconHTML(q.decon)+
    '<button onclick="DC.sub.seI='+((st.idx+1)%SPOTERR.length)+';DC.renderGym()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">'+(st.idx<SPOTERR.length-1?'Next →':'Start over')+'</button></div>';
  DC.icons();
};

/* =====================================================================
   PHASE 5 — STREAKS, BADGES, JOURNEY, COUNTDOWN
   ===================================================================== */
(function(){
  const _ds = DC.defaultState;
  DC.defaultState = function(){
    const s = _ds();
    s.days = {}; s.journal = {}; s.badges = {}; s.patterns = {};
    s.gym = {dict:{},sb:{},tr:{},se:{}}; s.vocabKnown = {}; s.connOpens = 0;
    s.examDate = null; s.sessionCount = 0; s.lastWritingSession = 0; s.lastOralSession = 0; s.longestStreak = 1;
    return s;
  };
})();
const BADGES = [
  { id:'first-step', name:'First Step', icon:'footprints', req:'Answer your first question', check:s=>s.behavior.answers>=1 },
  { id:'gram-starter', name:'Grammar Starter', icon:'puzzle', req:'Attempt 5 grammar questions', check:s=>Object.keys(s.grammarDone).length>=5 },
  { id:'gram-master', name:'Grammar Master', icon:'crown', req:'All grammar questions attempted, 80%+ correct', check:s=>{ const d=Object.values(s.grammarDone); return d.length>=GRAMMAR_QUESTIONS.length && d.filter(x=>x.correct).length/d.length>=0.8; } },
  { id:'read-explorer', name:'Reading Explorer', icon:'compass', req:'Complete a task in every reading Opgave type', check:s=>['cloze','chat','o3','o4'].every(k=>Object.keys(s.reading[k]||{}).length>0) },
  { id:'read-pro', name:'Reading Pro', icon:'glasses', req:'80%+ reading accuracy (min. 15 answers)', check:s=>{ const h=['r-2a','r-3','r-4','r-keywords'].flatMap(k=>(s.concepts[k]||{history:[]}).history); return h.length>=15 && h.filter(x=>x.ok).length/h.length>=0.8; } },
  { id:'first-draft', name:'First Draft', icon:'pen-line', req:'Save your first writing draft', check:s=>Object.values(s.writing.drafts).some(d=>wordCount(d.draft||d.final||'')>=20) },
  { id:'write-champ', name:'Writing Champion', icon:'trophy', req:'Complete 3 writing tasks', check:s=>Object.keys(s.writing.completed).length>=3 },
  { id:'speaker', name:'Speaker', icon:'mic', req:'Complete an oral practice session', check:s=>(s.oral.sessions||[]).length>=1 },
  { id:'conv-ready', name:'Conversation Ready', icon:'messages-square', req:'3 oral sessions or a confident conversation topic', check:s=>(s.oral.sessions||[]).length>=3 || Object.entries(s.oral.tracker).some(([k,v])=>k.startsWith('sc')&&v.includes('confident')) },
  { id:'streak-7', name:'Week of Fire', icon:'flame', req:'7-day study streak', check:s=>(s.longestStreak||s.streak)>=7 },
  { id:'streak-30', name:'Month of Fire', icon:'sun', req:'30-day study streak', check:s=>(s.longestStreak||s.streak)>=30 },
  { id:'error-hunter', name:'Error Hunter', icon:'bug', req:'Mark 20 notebook errors as understood', check:s=>s.errors.filter(e=>e.understood).length>=20 },
  { id:'misc-buster', name:'Misconception Buster', icon:'hammer', req:'Resolve 5 confident-wrong errors', check:s=> s.errors.filter(e=>e.confidence==='confident'&&e.understood).length + s.review.filter(r=>r.misconception&&r.mastered).length >= 5 },
  { id:'exam-ready', name:'Exam Ready', icon:'award', req:'No Weak concepts; 60%+ Improving or Mastered', check:s=>{ const ks=Object.keys(CONCEPTS); const st=ks.map(Brain.conceptStatus); return !st.includes('Weak') && st.filter(x=>x==='Improving'||x==='Mastered').length/ks.length>=0.6; } },
  { id:'conn-expert', name:'Connector Expert', icon:'link-2', req:'Open the Connector Master List 5 times', check:s=>(s.connOpens||0)>=5 },
  { id:'vocab-builder', name:'Vocabulary Builder', icon:'book-a', req:'Mark 40 words as known (small talk + topic vocab)', check:s=> Object.values(s.smalltalk.known||{}).filter(Boolean).length + Object.values(s.vocabKnown||{}).filter(Boolean).length >= 40 }
];
DC.checkBadges = function(){
  const s = DC.state;
  BADGES.forEach(b=>{
    if (!s.badges[b.id] && b.check(s)){
      s.badges[b.id] = Date.now();
      DC.journalNote('badge', b.name);
      DC.toast('<b>🏅 Badge unlocked: '+b.name+'</b><br><span class="text-xs">'+b.req+'</span>','ok');
    }
  });
};
DC.journalNote = function(kind, val){
  const s = DC.state, d = new Date().toDateString();
  const j = s.journal[d] = s.journal[d]||{ a:0, c:0, mods:{}, badges:[], imp:[] };
  if (kind==='badge') j.badges.push(val);
  if (kind==='imp' && !j.imp.includes(val)) j.imp.push(val);
};
(function(){ /* journal + badge hooks on every recorded answer */
  const _rec = Brain.record;
  Brain.record = function(res){
    const before = res.concept? Brain.conceptStatus(res.concept) : null;
    _rec(res);
    const s = DC.state, d = new Date().toDateString();
    const j = s.journal[d] = s.journal[d]||{ a:0, c:0, mods:{}, badges:[], imp:[] };
    j.a++; if (res.correct) j.c++;
    j.mods[res.module] = (j.mods[res.module]||0)+1;
    if (res.concept){
      const after = Brain.conceptStatus(res.concept);
      if (after!==before && (after==='Improving'||after==='Mastered')) DC.journalNote('imp', CONCEPTS[res.concept].name+' → '+after);
    }
    s.days[d] = true;
    DC.checkBadges();
    DC.save();
  };
})();
/* streak bookkeeping on load */
(function(){
  const _load = DC.load;
  DC.load = function(){
    _load();
    const s = DC.state;
    s.days = s.days||{}; s.days[new Date().toDateString()] = true;
    s.longestStreak = Math.max(s.longestStreak||1, s.streak||1);
    s.sessionCount = (s.sessionCount||0)+1;
    DC.save();
  };
})();
/* dashboard additions */
(function(){
  const _rd = DC.renderDashboard;
  DC.renderDashboard = function(){
    _rd();
    const s = DC.state;
    const main = document.getElementById('main').firstElementChild;
    let h = '';
    /* exam countdown + sim history + streak calendar row */
    h += '<div class="grid lg:grid-cols-3 gap-4">';
    // countdown
    let cd = '<div class="card p-5"><div class="flex items-center gap-2 mb-2"><i data-lucide="calendar-clock" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100 text-sm">Exam countdown</h2></div>';
    if (s.examDate){
      const days = Math.ceil((new Date(s.examDate+'T09:00') - Date.now())/86400000);
      const col = days>30?'text-emerald-300':days>=15?'text-amber-300':'text-rose-300';
      const weak = Brain.weakConcepts().slice(0,2).map(k=>CONCEPTS[k].name);
      cd += '<div class="text-center my-2"><span class="text-4xl font-extrabold '+col+'">'+(days>=0?days:0)+'</span><div class="text-[10px] uppercase tracking-wider text-slate-500">day'+(days===1?'':'s')+' until '+esc(s.examDate)+'</div></div>'+
        '<div class="text-xs text-slate-400 mb-2">'+(weak.length?'<b>Recommended focus:</b> '+esc(weak.join(' · ')):'<b>Focus:</b> keep reviews green and simulate full exams.')+'</div>'+
        '<label class="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Change exam date</label>'+
        '<input type="date" value="'+esc(s.examDate)+'" onchange="DC.setExamDate(this.value)" class="gapsel w-full">'+
        '<button onclick="DC.setExamDate(null)" class="mt-2 text-[11px] text-slate-500 hover:text-slate-300">remove date</button>';
    } else {
      cd += '<p class="text-xs text-slate-400 mb-2">Set your modultest date and I plan backwards from it.</p>'+
        '<label class="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Exam date</label>'+
        '<input type="date" onchange="DC.setExamDate(this.value)" class="gapsel w-full">';
    }
    cd += '</div>';
    h += cd;
    // streak calendar
    let cal = '<div class="card p-5"><div class="flex items-center gap-2 mb-2"><i data-lucide="flame" class="w-5 h-5 text-amber-300"></i><h2 class="font-bold text-slate-100 text-sm">Streak 🔥 '+s.streak+' day'+(s.streak===1?'':'s')+'</h2><span class="ml-auto text-[10px] text-slate-500">longest: '+(s.longestStreak||s.streak)+'</span></div><div class="flex flex-wrap gap-1">';
    for (let i=29;i>=0;i--){
      const d = new Date(); d.setDate(d.getDate()-i);
      const on = !!s.days[d.toDateString()];
      cal += '<div title="'+d.toLocaleDateString('da-DK')+'" class="w-4 h-4 rounded" style="background:'+(on?'#2e7d32':'#eef0f2')+'"></div>';
    }
    cal += '</div><div class="text-[10px] text-slate-500 mt-2">last 30 days · green = studied</div></div>';
    h += cal;
    // exam history
    const exams = (s.exams||[]);
    let eh = '<div class="card p-5"><div class="flex items-center gap-2 mb-2"><i data-lucide="clipboard-check" class="w-5 h-5 text-rose-300"></i><h2 class="font-bold text-slate-100 text-sm">Exam simulations</h2></div>';
    if (exams.length){
      const last = exams[exams.length-1];
      const best = Math.max.apply(null, exams.map(e=>e.overall));
      const trend = exams.length>1 ? (last.overall - exams[exams.length-2].overall) : 0;
      eh += '<div class="flex items-center gap-3 mb-2"><span class="text-3xl font-extrabold '+(best>=80?'text-emerald-300':best>=65?'text-amber-300':'text-rose-300')+'">'+best+'%</span><div class="text-[10px] uppercase text-slate-500">best score<br>'+exams.length+' attempt'+(exams.length===1?'':'s')+(trend!==0?' · trend '+(trend>0?'▲ +':'▼ ')+trend+'%':'')+'</div></div>';
      eh += exams.slice(-3).reverse().map(e=>'<div class="text-[11px] text-slate-400 flex items-center gap-2 mb-1"><span class="w-20">'+new Date(e.ts).toLocaleDateString('da-DK')+'</span><div class="flex-1">'+bar(e.overall, e.overall>=80?'bg-emerald-500':e.overall>=65?'bg-amber-500':'bg-rose-500')+'</div><span class="w-9 text-right font-bold">'+e.overall+'%</span></div>').join('');
    } else eh += '<p class="text-xs text-slate-400">No simulations yet. The full mock exams are the truest readiness signal — about a fifth of your score.</p>';
    eh += '<button onclick="DC.go(\'sim\')" class="mt-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-2.5 py-1.5">Open Exam Simulation</button></div>';
    h += eh + '</div>';
    /* badges */
    h += '<div class="card p-5"><div class="flex items-center gap-2 mb-3"><i data-lucide="medal" class="w-5 h-5 text-amber-300"></i><h2 class="font-bold text-slate-100">Achievements</h2><span class="ml-auto text-xs text-slate-500">'+Object.keys(s.badges||{}).length+'/'+BADGES.length+' unlocked</span></div><div class="grid grid-cols-3 md:grid-cols-4 gap-2">';
    BADGES.forEach(b=>{
      const got = (s.badges||{})[b.id];
      h += '<div class="rounded-xl border p-3 text-center '+(got?'bg-amber-500/10 border-amber-500/30':'bg-slate-900/50 border-slate-800 opacity-60')+'" title="'+esc(b.req)+'">'+
        '<i data-lucide="'+b.icon+'" class="w-6 h-6 mx-auto mb-1 '+(got?'text-amber-300':'text-slate-600')+'"></i>'+
        '<div class="text-[11px] font-bold '+(got?'text-slate-100':'text-slate-500')+'">'+b.name+'</div>'+
        '<div class="text-[9px] text-slate-500 leading-tight mt-0.5">'+(got?new Date(got).toLocaleDateString('da-DK'):esc(b.req))+'</div></div>';
    });
    h += '</div></div>';
    /* journey */
    h += '<div class="card p-5"><div class="flex items-center gap-2 mb-3"><i data-lucide="route" class="w-5 h-5 text-emerald-300"></i><h2 class="font-bold text-slate-100">My Journey — last 14 days</h2></div>';
    let any = false; let tl = '<div class="space-y-0">';
    for (let i=0;i<14;i++){
      const d = new Date(); d.setDate(d.getDate()-i);
      const j = (s.journal||{})[d.toDateString()];
      if (!j) continue;
      any = true;
      tl += '<div class="flex gap-3"><div class="flex flex-col items-center"><div class="w-2.5 h-2.5 rounded-full mt-1.5" style="background:#42B0D5"></div><div class="w-px flex-1" style="background:#e5e7e9"></div></div>'+
        '<div class="pb-4"><div class="text-xs font-bold text-slate-100">'+d.toLocaleDateString('da-DK',{weekday:'short',day:'numeric',month:'short'})+'</div>'+
        '<div class="text-xs text-slate-400">'+j.a+' answer'+(j.a===1?'':'s')+' · '+pct(j.c,j.a)+'% correct · '+Object.keys(j.mods).join(', ')+'</div>'+
        (j.imp.length?'<div class="text-[11px] text-emerald-300 mt-0.5">↑ '+j.imp.slice(0,3).map(esc).join(' · ')+'</div>':'')+
        (j.badges.length?'<div class="text-[11px] text-amber-300 mt-0.5">🏅 '+j.badges.map(esc).join(' · ')+'</div>':'')+'</div></div>';
    }
    tl += '</div>';
    h += any? tl : '<p class="text-xs text-slate-400">Your story starts with the first answer — everything you practice lands here, day by day.</p>';
    h += '</div>';
    main.insertAdjacentHTML('beforeend', h);
    DC.icons();
  };
})();

/* =====================================================================
   PHASE 6 — REAL-WORLD DANISH (tabs inside Hverdagsdansk)
   ===================================================================== */
(function(){
  const _talk = DC.renderTalk;
  DC.renderTalk = function(){
    const tab = DC.sub.talk || 'daily';
    if (tab==='daily'){ _talk(); DC.talkTabs('daily'); return; }
    let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto"><div id="talk-tabbar"></div>';
    if (tab==='life'){
      h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="map-pin" class="w-5 h-5 text-emerald-300"></i><h2 class="font-bold text-slate-100">Danish in Real Life — 10 situations</h2></div><p class="text-xs text-slate-400">Key phrases, a model dialogue, a cultural tip and the classic mistake — for the situations you WILL meet.</p></div>';
      REALLIFE.forEach(c=>{
        let body = '<div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">Key phrases</div>';
        c.phrases.forEach(p=> body += '<div class="mb-1.5"><div class="text-sm font-medium text-slate-100">'+esc(p.da)+'</div><div class="text-[11px] text-slate-500">'+esc(p.en)+'</div></div>');
        body += '<div class="text-[10px] uppercase tracking-widest text-slate-500 mt-3 mb-1.5">Mini-dialogue</div><div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-1">';
        c.dialogue.forEach(l=> body += '<div class="text-sm '+(l.startsWith('Dig')?'text-slate-100 font-medium':'text-slate-400')+'">'+esc(l)+'</div>');
        body += '</div><div class="flex items-start gap-2 text-xs bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 mt-3"><i data-lucide="lightbulb" class="w-3.5 h-3.5 text-emerald-300 mt-0.5 shrink-0"></i><span><b>Cultural tip:</b> '+esc(c.tip)+'</span></div>'+
          '<div class="flex items-start gap-2 text-xs bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2 mt-2"><i data-lucide="x-octagon" class="w-3.5 h-3.5 text-rose-300 mt-0.5 shrink-0"></i><span><b>Common mistake:</b> '+esc(c.mistake)+'</span></div>';
        h += accHTML('<span class="flex items-center gap-2"><i data-lucide="'+c.icon+'" class="w-4 h-4 text-emerald-300"></i>'+esc(c.title)+'</span>', body, null, false) + '<div class="h-1"></div>';
      });
    } else {
      h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="book-heart" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Danish Culture Notes</h2></div><p class="text-xs text-slate-400">Six things that explain Denmark — and that examiners love hearing you reflect on.</p></div>';
      h += '<div class="grid md:grid-cols-2 gap-3">';
      CULTURE.forEach(c=> h += '<div class="card p-4"><div class="flex items-center gap-2 mb-2"><i data-lucide="'+c.icon+'" class="w-5 h-5 text-indigo-300"></i><h3 class="font-bold text-slate-100 text-sm">'+esc(c.t)+'</h3></div><p class="text-sm text-slate-300 leading-relaxed">'+c.body+'</p></div>');
      h += '</div>';
    }
    h += '</div>';
    document.getElementById('main').innerHTML = h;
    DC.talkTabs(tab);
    DC.icons();
  };
  DC.talkTabs = function(active){
    const bar = '<div class="card p-3 flex gap-1.5 flex-wrap">'+
      [['daily','Daily 5 & sentences','coffee'],['life','Real-life situations','map-pin'],['culture','Culture notes','book-heart']].map(t=>
        '<button onclick="DC.sub.talk=\''+t[0]+'\';DC.renderTalk()" class="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 '+(active===t[0]?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200')+'"><i data-lucide="'+t[2]+'" class="w-3.5 h-3.5"></i>'+t[1]+'</button>').join('')+'</div>';
    const holder = document.getElementById('talk-tabbar');
    if (holder) holder.outerHTML = bar;
    else document.getElementById('main').firstElementChild.insertAdjacentHTML('afterbegin', bar);
    DC.icons();
  };
})();

/* exam-day checklist into Exam Strategy; connector card into Learn Mode */
(function(){
  const _st = DC.renderStrategy;
  DC.renderStrategy = function(){
    _st();
    let h = '<div class="card p-5 mt-4 !border-emerald-500/40"><div class="flex items-center gap-2 mb-3"><i data-lucide="calendar-check-2" class="w-5 h-5 text-emerald-300"></i><h2 class="font-bold text-slate-100">Exam Day Checklist</h2></div><div class="grid md:grid-cols-2 gap-3">';
    EXAMDAY.forEach(c=> h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-4"><div class="font-semibold text-sm text-slate-100 flex items-center gap-2 mb-2"><i data-lucide="'+c.icon+'" class="w-4 h-4 text-emerald-300"></i>'+c.t+'</div><ul class="text-sm text-slate-300 space-y-1.5 list-disc list-inside">'+c.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>');
    h += '</div></div>';
    document.getElementById('main').firstElementChild.insertAdjacentHTML('beforeend', h);
    DC.icons();
  };
  const _lm = DC.renderLearn;
  DC.renderLearn = function(){
    _lm();
    document.getElementById('main').firstElementChild.insertAdjacentHTML('beforeend',
      '<div class="card p-5 !border-indigo-500/30 flex items-center gap-4 flex-wrap"><div class="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0"><i data-lucide="link-2" class="w-5 h-5 text-indigo-300"></i></div>'+
      '<div class="flex-1 min-w-[200px]"><div class="font-bold text-slate-100 text-sm">Connector Master List — '+CONNECTORS.length+' connectors</div><div class="text-xs text-slate-400">Which words trigger SAV, which trigger inversion, which change nothing. Searchable, always one click away.</div></div>'+
      '<button onclick="DC.connectorGuide()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Open the list</button></div>');
    DC.icons();
  };
})();

/* =====================================================================
   PHASE 7 — EXAM SIMULATION (capstone)
   ===================================================================== */
DC.renderSim = function(){
  if (!DC.sim || DC.sim.phase==='menu') return DC.simMenu();
  DC.saveExamResume();
  const ph = DC.sim.phase;
  ({gate:DC.simGate, reading:DC.simReading, rres:DC.simRRes, writing:DC.simWriting, wrub:DC.simWRub, oral1:DC.simOral1, oral2:DC.simOral2, report:DC.simReport}[ph])();
};
DC.simMenu = function(){
  const hist = DC.state.exams||[];
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  const resume = DC.checkExamResume();
  if (resume && resume.kind==='sim'){
    h += '<div class="card p-5 !border-amber-500/50 bg-amber-500/5"><div class="flex items-center gap-3 flex-wrap"><i data-lucide="rotate-ccw" class="w-6 h-6 text-amber-300 shrink-0"></i><div class="flex-1 min-w-[200px]"><div class="font-bold text-slate-100">Unfinished sitting found</div><div class="text-xs text-slate-400">You left mid-simulation ('+esc(EXAMSETS[resume.si].title)+') during '+(EXAM_PHASE_LABEL[resume.phase]||resume.phase)+'. Resume with your time remaining, or discard and start fresh.</div></div>'+
      '<button onclick="DC.resumeExam()" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold">Resume</button>'+
      '<button onclick="DC.clearExamResume();DC.renderSim()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs">Discard</button></div></div>';
  }
  h += '<div class="card p-6"><div class="flex items-center gap-3 mb-2"><div class="w-11 h-11 rounded-xl bg-indigo-500/15 flex items-center justify-center"><i data-lucide="graduation-cap" class="w-6 h-6 text-indigo-300"></i></div><div><h2 class="font-bold text-lg text-slate-100">Exam Simulation — the capstone</h2><div class="text-xs text-slate-400">Three all-three-parts training exams (3A/3B/3C): Reading 50 min (cloze + two chat threads + Opgave 3 + Opgave 4) · Writing 2×45 min (one task at a time, own timer) · Oral with prep timers. ~2.5 hours each.</div></div></div></div>';
  h += '<div class="grid gap-3">';
  EXAMSETS.forEach((ex,i)=>{
    const attempts = hist.filter(e=>e.setId===ex.id);
    const best = attempts.length? Math.max.apply(null, attempts.map(e=>e.overall)) : null;
    h += '<div class="card p-5 flex items-center gap-4 flex-wrap"><div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-extrabold text-indigo-300">'+(i+1)+'</div>'+
      '<div class="flex-1 min-w-[200px]"><div class="font-bold text-slate-100">'+esc(ex.title)+'</div><div class="text-xs text-slate-400">'+(attempts.length? attempts.length+' attempt'+(attempts.length===1?'':'s')+' · best '+best+'%':'Not attempted yet')+'</div></div>'+
      '<button onclick="DC.sim={phase:\'gate\',si:'+i+'};DC.renderSim()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">'+(attempts.length?'Retake':'Start')+'</button></div>';
  });
  h += '</div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.simGate = function(){
  const ex = EXAMSETS[DC.sim.si];
  const r = Brain.readiness();
  let h = '<div class="fade-in max-w-2xl mx-auto"><div class="card p-6 text-center">'+
    '<i data-lucide="shield-alert" class="w-10 h-10 text-amber-300 mx-auto mb-3"></i>'+
    '<h2 class="font-bold text-lg text-slate-100 mb-2">'+esc(ex.title)+'</h2>'+
    '<p class="text-sm text-slate-400 mb-3">One sitting, <b>~2.5 hours</b>.<br>Reading 50 min (real budget) · Writing 2×45 min, one task at a time (real budget) · Oral with prep and presentation timers.<br><b>Timers cannot be paused.</b> Are you ready?</p>'+
    '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 mb-4 inline-block"><span class="text-[10px] uppercase tracking-wider text-slate-500">Your readiness score</span><div class="text-2xl font-extrabold '+(r>=60?'text-emerald-300':'text-amber-300')+'">'+r+'%</div>'+
    '<div class="text-[11px] text-slate-500">'+(r>=60?'Above the recommended 60% — go for it.':'Below the recommended 60% — you can still take it, but expect gaps. Diagnosis is also training!')+'</div></div>'+
    '<label class="flex items-start gap-2.5 text-sm text-slate-300 cursor-pointer bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2.5 mb-4 text-left"><input type="checkbox" id="sim-dress-toggle" class="mt-0.5 accent-indigo-500"><span><b class="text-slate-100">Eksamensdag mode</b> — hide your Del 1 score until the full report at the end, just like the real test.</span></label>'+
    '<div class="flex justify-center gap-2"><button onclick="DC.simStart(document.getElementById(\'sim-dress-toggle\').checked)" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">Start Exam</button>'+
    '<button onclick="DC.sim=null;DC.renderSim()" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Not Yet</button></div></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.simStart = function(dress){
  DC.sim.phase='reading'; DC.sim.t0=Date.now(); DC.sim.times={}; DC.sim.dress=!!dress;
  DC.renderSim();
  DC.startTimer('sim-read', 50*60, 'sim-timer', function(){ DC.toast('50 minutes — reading auto-submitted.','err'); DC.simReadSubmit(true); });
};
function simHead(label, mins){
  return '<div class="card p-4 sticky top-16 lg:top-20 z-30 flex items-center gap-3"><i data-lucide="clipboard-check" class="w-5 h-5 text-indigo-300"></i><div class="font-bold text-slate-100 text-sm">'+label+'</div><div class="ml-auto flex items-center gap-2"><i data-lucide="timer" class="w-4 h-4 text-amber-300"></i><span id="sim-timer" class="font-mono font-bold text-amber-300 text-lg">'+fmtTime(mins*60)+'</span></div></div>';
}
DC.simReading = function(){
  const ex = EXAMSETS[DC.sim.si], rd = ex.reading;
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">'+simHead(ex.title+' · Del 1 Læsning (50 min)', 50);
  /* Opgave 1 cloze */
  const c = rd.cloze;
  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-1">Opgave 1: '+esc(c.title)+'</h3><p class="text-xs text-slate-400 mb-3">'+esc(c.instruction)+'</p>'+
    '<div class="text-[11px] uppercase tracking-widest text-slate-500 mb-1.5">Ordbank</div><div class="flex flex-wrap gap-1.5 mb-3">'+c.bank.map(w=>'<span class="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">'+esc(w)+'</span>').join('')+'</div>'+
    '<div class="text-[15px] leading-8 text-slate-200">';
  c.parts.forEach(p=>{
    if (typeof p==='string') h += esc(p);
    else { h += '<select id="simc-'+p.g+'" class="gapsel mx-1"><option value="">— vælg —</option>'; shuffle(c.bank.slice()).forEach(w=> h += '<option value="'+esc(w)+'">'+esc(w)+'</option>'); h += '</select>'; }
  });
  h += '</div></div>';
  /* Opgave 2A — two chat threads */
  const CHATS = DC.sim.chatsShuffled || (DC.sim.chatsShuffled = [relabelChat(rd.chat), relabelChat(rd.chat2)]);
  CHATS.forEach((ch,ci)=>{
    h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-1">Opgave 2A · chat '+(ci+1)+': '+esc(ch.title)+'</h3><p class="text-xs text-slate-400 mb-3">'+esc(ch.situation)+' Find de svar, der passer (A–'+ch.options[ch.options.length-1].letter+'). Tre svar skal ikke bruges.</p>';
    h += chatBubble(ch.personX, ch.example.x)+'<div class="flex justify-end mb-2"><div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-3 py-2 text-sm max-w-[85%]"><div class="text-[10px] uppercase font-bold text-emerald-300">'+esc(ch.personY)+' · eksempel = Z</div>'+esc(ch.example.reply)+'</div></div>';
    ch.turns.forEach((t,i)=>{
      h += chatBubble(ch.personX, t.x)+'<div class="flex justify-end mb-2"><div class="bg-slate-800/80 border border-slate-700 rounded-2xl px-3 py-2 text-sm w-[80%]"><select id="simch-'+ci+'-'+i+'" class="gapsel w-full"><option value="">— svar '+(i+1)+' (A–'+ch.options[ch.options.length-1].letter+') —</option>'+ch.options.map(o=>'<option value="'+o.letter+'">'+o.letter+': '+esc(o.text.slice(0,55))+(o.text.length>55?'…':'')+'</option>').join('')+'</select></div></div>';
    });
    h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 mt-2 space-y-1.5">'+ch.options.map(o=>'<div class="text-xs"><b class="text-indigo-300">'+o.letter+':</b> '+esc(o.text)+'</div>').join('')+'</div></div>';
  });
  /* o3 */
  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-1">Opgave 3: '+esc(rd.o3.title)+'</h3><p class="text-xs text-slate-400 mb-3">I hvert afsnit mangler der en sætning. Vælg den, der passer (A–D).</p>';
  rd.o3.paragraphs.forEach((p,i)=>{
    const ord = shuffle(p.options.map((o,j)=>j));
    h += '<div class="mb-4 pb-4 border-b border-slate-800"><div class="text-sm leading-7 text-slate-200"><b class="text-slate-500">'+(i+1)+'.</b> '+esc(p.pre)+'<span class="text-indigo-300">[ ____ ]</span>'+esc(p.post)+'</div>'+
      '<div class="grid gap-1 mt-1.5">'+ord.map((j,pos)=>'<div class="text-xs text-slate-400"><b class="text-indigo-300">'+String.fromCharCode(65+pos)+'.</b> '+esc(p.options[j].text)+'</div>').join('')+'</div>'+
      '<div class="mt-1.5 text-sm">Svar: <select id="simo3-'+i+'" class="gapsel">'+'<option value="">—</option>'+ord.map((j,pos)=>'<option value="'+j+'">'+String.fromCharCode(65+pos)+'</option>').join('')+'</select></div></div>';
  });
  h += '</div>';
  /* Opgave 4 — real person-match */
  const o4 = DC.sim.o4Shuffled || (DC.sim.o4Shuffled = relabelO4(rd.o4));
  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-1">Opgave 4: '+esc(o4.title)+'</h3><p class="text-xs text-slate-400 mb-3">'+esc(o4.instruction)+'</p><div class="grid lg:grid-cols-3 gap-3 mb-4">';
  o4.persons.forEach(p=> h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3"><div class="font-bold text-indigo-300 mb-1">'+p.label+'. '+esc(p.name)+'</div><div class="text-xs text-slate-300 leading-5">'+esc(p.text)+'</div></div>');
  h += '</div><div class="text-xs text-slate-500 mb-2">Eksempel (0): '+esc(o4.example.q)+' → <b class="text-emerald-300">'+o4.example.answer+'</b></div>';
  o4.questions.forEach((q,i)=>{
    h += '<div class="flex items-center gap-2 mb-1.5 text-sm"><span class="text-slate-500 w-5">'+(i+1)+'.</span><span class="flex-1">'+esc(q.q)+'</span>'+examSelect('simo4-'+i, o4.persons.map(p=>({v:p.label, t:p.label+' ('+p.name+')'})))+'</div>';
  });
  h += '</div>';
  h += '<div class="card p-4 flex items-center gap-3"><button onclick="DC.simReadSubmit()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">Submit Del 1 · Læsning</button><span class="text-xs text-slate-500">Unanswered counts as wrong — guess first!</span></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.simReadSubmit = function(auto){
  const ex = EXAMSETS[DC.sim.si], rd = ex.reading;
  const CHATS = DC.sim.chatsShuffled || (DC.sim.chatsShuffled = [relabelChat(rd.chat), relabelChat(rd.chat2)]);
  const o4 = DC.sim.o4Shuffled || (DC.sim.o4Shuffled = relabelO4(rd.o4));
  if (!auto){
    let missing = 0;
    rd.cloze.gaps.forEach((g,i)=>{ if(!document.getElementById('simc-'+i) || document.getElementById('simc-'+i).value==='') missing++; });
    CHATS.forEach((ch,ci)=> ch.turns.forEach((t,i)=>{ if(!document.getElementById('simch-'+ci+'-'+i).value) missing++; }));
    rd.o3.paragraphs.forEach((p,i)=>{ if(!document.getElementById('simo3-'+i).value) missing++; });
    o4.questions.forEach((q,i)=>{ if(!document.getElementById('simo4-'+i).value) missing++; });
    if (missing && !DC.sim.warned){ DC.sim.warned=true; DC.toast(missing+' blank answer'+(missing>1?'s':'')+'. Submit again to hand in anyway.','warn'); return; }
  }
  DC.stopTimer('sim-read');
  DC.sim.times.reading = Math.round((Date.now()-DC.sim.t0)/60000);
  const val = id => { const el=document.getElementById(id); return el?el.value:''; };
  const wrongs = [], rights = [];
  const push = (ok, obj) => (ok?rights:wrongs).push(obj);
  const sect = { cloze:[0,0], chat:[0,0], o3:[0,0], o4:[0,0] };
  rd.cloze.gaps.forEach((g,i)=>{ const v=val('simc-'+i); const ok=v!==''&&v===g.correct; sect.cloze[1]++; if(ok)sect.cloze[0]++;
    push(ok,{ concept:'r-keywords', qid:ex.id+'-cz'+i, label:'Opg.1 hul '+(i+1), question:'"'+rd.cloze.title+'", gap '+(i+1), userAnswer:(v===''?'(blank)':v), correctAnswer:g.correct, ok, mistakeType:'Wrong word in context', explanation:g.why,
      snapshot:{kind:'mc', tag:'Exam · Cloze', prompt:'Choose the word that fits (gap '+(i+1)+' of "'+esc(rd.cloze.title)+'"):', options:rd.cloze.bank.map(w=>({text:w, ok:w===g.correct, mistakeType:'Wrong word in context', why:g.why})), explanation:g.why, concept:'r-keywords'} }); });
  CHATS.forEach((ch,ci)=> ch.turns.forEach((t,i)=>{ const v=val('simch-'+ci+'-'+i); const ok=v===t.correct; sect.chat[1]++; if(ok)sect.chat[0]++;
    push(ok,{ concept:'r-2a', qid:ex.id+'-ch'+ci+'-'+i, label:'2A chat '+(ci+1)+' · svar '+(i+1), question:'Exam chat "'+ch.title+'": reply to "'+t.x+'"', userAnswer:v||'(blank)', correctAnswer:t.correct, ok, mistakeType:'Reply does not fit the flow', explanation:t.why,
      snapshot:{kind:'mc', tag:'Exam · Chat', prompt:esc(ch.personX)+': "'+t.x+'" — choose the reply:', options:shuffle(ch.options.filter(o=>o.letter===t.correct||o.distractorWhy).slice(0,4).map(o=>({text:o.text, ok:o.letter===t.correct, mistakeType:'Wrong reply', why:o.letter===t.correct?t.why:o.distractorWhy}))), explanation:t.why, concept:'r-2a'} }); }));
  rd.o3.paragraphs.forEach((p,i)=>{ const v=val('simo3-'+i); const ok=v!==''&&p.options[parseInt(v,10)].ok; const corr=p.options.find(o=>o.ok); sect.o3[1]++; if(ok)sect.o3[0]++;
    push(ok,{ concept:'r-3', qid:ex.id+'-o3-'+i, label:'Opg.3 afsnit '+(i+1), question:'"'+rd.o3.title+'" — afsnit '+(i+1), userAnswer:v===''?'(blank)':p.options[parseInt(v,10)].text, correctAnswer:corr.text, ok, mistakeType:'Coherence error', explanation:corr.why,
      snapshot:{kind:'mc', tag:'Exam · Opg.3', prompt:'Which sentence fits?<br><span class="text-xs text-slate-400">'+esc(p.pre)+' ____ '+esc(p.post)+'</span>', options:p.options, explanation:corr.why, concept:'r-3'} }); });
  o4.questions.forEach((q,i)=>{ const v=val('simo4-'+i); const ok=v===q.answer; sect.o4[1]++; if(ok)sect.o4[0]++;
    push(ok,{ concept:'r-4', qid:ex.id+'-o4-'+i, label:'Opg.4 spm. '+(i+1), question:'"'+o4.title+'": '+q.q, userAnswer:'Person '+(v||'(blank)'), correctAnswer:'Person '+q.answer, ok, mistakeType:'Matching / detail-trap error', explanation:q.why,
      snapshot:{kind:'mc', tag:'Exam · Matching', prompt:q.q+'<br><span class="text-xs text-slate-400">("'+esc(o4.title)+'" — recall the evidence.)</span>', options:o4.persons.map(p=>({text:p.label+'. '+p.name, ok:p.label===q.answer, mistakeType:'Wrong person', why:q.why})), explanation:q.why, concept:'r-4'} }); });
  /* rights recorded immediately (concept tracking); wrongs wait for the notebook button.
     Both are kept on DC.sim.reading (not just wrongs) so the results screen can show a full answer sheet. */
  rights.forEach(r=> Brain.record(Object.assign({module:'Exam Simulation', opgave:'Læsning', correct:true, confidence:'sure', hintsUsed:0, timeSpent:0}, r)));
  DC.sim.reading = { sect, wrongs, rights, score: Object.values(sect).reduce((t,x)=>t+x[0],0), total: Object.values(sect).reduce((t,x)=>t+x[1],0) };
  DC.sim.phase='rres'; DC.renderSim();
};
DC.simRRes = function(){
  const r = DC.sim.reading;
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  if (DC.sim.dress){
    h += '<div class="card p-6 text-center"><div class="w-12 h-12 rounded-full bg-indigo-500/15 flex items-center justify-center mx-auto mb-3"><i data-lucide="check" class="w-6 h-6 text-indigo-300"></i></div>'+
      '<h2 class="font-bold text-lg text-slate-100 mb-1">Del 1 · Læsning handed in</h2>'+
      '<p class="text-sm text-slate-400 max-w-md mx-auto">Eksamensdag mode: your score stays hidden until the full report at the end.</p></div>';
  } else {
    const p = pct(r.score, r.total);
    h += '<div class="card p-6 text-center"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Del 1 · Læsning</div>'+
      '<div class="text-4xl font-extrabold '+(p>=70?'text-emerald-300':p>=55?'text-amber-300':'text-rose-300')+'">'+r.score+' / '+r.total+'</div>'+
      '<div class="text-sm text-slate-400">'+p+'% · '+DC.sim.times.reading+' of 50 minutes used'+(p>=62?' · likely over the typical pass threshold for this section (real pass lines are confidential)':'')+'</div></div>';
    if (r.wrongs.length) h += accHTML('Your '+r.wrongs.length+' wrong answers (read now — fresh memory learns fastest)', r.wrongs.map(w=>'<div class="mb-2 text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2"><b>'+esc(w.label)+':</b> '+esc(String(w.userAnswer).slice(0,80))+' → <b>'+esc(String(w.correctAnswer).slice(0,80))+'</b><br><span class="text-xs">'+esc(w.explanation)+'</span></div>').join(''), 'x-octagon', true);
    /* full answer sheet (right AND wrong): retaking the same simulation is only useful if you
       understand every answer, not just remember which letter you clicked last time */
    const allQs = (r.rights||[]).concat(r.wrongs).sort((a,b)=> (a.qid||'').localeCompare(b.qid||''));
    h += accHTML('Full answer sheet — all '+allQs.length+' questions',
      allQs.map(w=>'<div class="mb-2 text-sm '+(w.ok?'bg-emerald-500/10 border border-emerald-500/30':'bg-rose-500/10 border border-rose-500/30')+' rounded-xl px-3 py-2"><b>'+(w.ok?'✓':'✗')+' '+esc(w.label)+':</b> '+esc(String(w.userAnswer).slice(0,80))+(w.ok?'':' → <b>'+esc(String(w.correctAnswer).slice(0,80))+'</b>')+'<br><span class="text-xs">'+esc(w.explanation)+'</span></div>').join(''), 'list-checks', false);
  }
  h += '<div class="card p-4 flex gap-2 flex-wrap"><button onclick="DC.sim.phase=\'writing\';DC.sim.wTask=0;DC.sim.texts=[];DC.renderSim();DC.simWriteTimerStart()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">Continue: Del 2 · Skrivning (2×45 min)</button></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.simWriteTimerStart = function(){
  DC.startTimer('sim-write', 45*60, 'sim-timer', function(){
    DC.toast('Time is up for this task — submitting now, just like the real test.','err');
    DC.simWSubmit(true);
  });
};
DC.simWriting = function(){
  const ex = EXAMSETS[DC.sim.si];
  const wi = DC.sim.wTask||0;
  const t = ex.writing[wi];
  const saved = (DC.sim.texts && DC.sim.texts[wi]) || '';
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">'+simHead(ex.title+' · Del 2 Skrivning — '+t.opgave+' af '+ex.writing.length+' (45 min)', 45);
  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-1">'+t.opgave+': '+esc(t.title)+'</h3>'+
    '<div class="text-sm text-slate-300 mb-2"><b>Situation:</b> '+esc(t.situation)+'</div>'+
    (t.email?'<div class="bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-[13px] font-mono whitespace-pre-line mb-2">'+esc(t.email)+'</div>':'')+
    '<div class="text-sm text-slate-300 mb-1"><b>Opgave:</b> '+esc(t.taskIntro)+'</div><ul class="mb-3">'+t.bullets.map(b=>'<li class="text-sm text-slate-200 flex items-start gap-2"><i data-lucide="square-check" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i>'+esc(b)+'</li>').join('')+'</ul>'+
    '<textarea id="simw-plan-'+wi+'" lang="da" spellcheck="true" rows="2" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs mb-2" placeholder="Planning box — one line per bullet"></textarea>'+
    '<textarea id="simw-'+wi+'" lang="da" spellcheck="true" oninput="document.getElementById(\'simw-c-'+wi+'\').textContent=wordCount(this.value)" rows="12" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm">'+esc(saved)+'</textarea>'+
    '<div class="text-[11px] text-slate-500 mt-1"><span id="simw-c-'+wi+'">'+wordCount(saved)+'</span> words · required '+(t.opgave==='Opgave 1'?t.minWords+'–'+t.maxWords:'min. '+t.minWords)+'</div></div>';
  h += '<div class="card p-4"><button onclick="DC.simWSubmit()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">'+(wi<ex.writing.length-1?'Submit '+t.opgave+' — start '+ex.writing[wi+1].opgave:'Submit Del 2 · Skrivning')+'</button></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.simWSubmit = function(auto){
  const ex = EXAMSETS[DC.sim.si];
  const wi = DC.sim.wTask||0;
  const t = ex.writing[wi];
  const text = (document.getElementById('simw-'+wi)||{}).value || '';
  if (!auto && wordCount(text)<t.minWords && !DC.sim.wWarned){ DC.sim.wWarned=true; DC.toast(t.opgave+' under minimum length — on the real test that fails the task. Submit again to proceed anyway.','err'); return; }
  DC.sim.wWarned = false;
  DC.sim.texts = DC.sim.texts || [];
  DC.sim.texts[wi] = text;
  const timer = DC.timers['sim-write'];
  DC.sim.wTimes = DC.sim.wTimes || [];
  DC.sim.wTimes[wi] = 45 - Math.ceil((timer?timer.left:0)/60);
  DC.stopTimer('sim-write');
  if (wi < ex.writing.length-1){
    DC.sim.wTask = wi+1;
    DC.renderSim();
    DC.simWriteTimerStart();
  } else {
    DC.sim.times.writing = Math.round((Date.now()-DC.sim.t0)/60000) - DC.sim.times.reading;
    DC.sim.rubric = [EXAM.rubric.map(()=>false), EXAM.rubric.map(()=>false)];
    DC.sim.phase='wrub'; DC.renderSim();
  }
};
DC.simWRub = function(){
  const ex = EXAMSETS[DC.sim.si];
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto"><div class="card p-5"><h2 class="font-bold text-slate-100 flex items-center gap-2"><i data-lucide="scale" class="w-5 h-5 text-amber-300"></i>Self-score your writing (10 points per task)</h2><p class="text-xs text-slate-400">Compare with the model, tick honestly. The structure checklist IS the censor’s checklist.</p></div>';
  ex.writing.forEach((t,ti)=>{
    h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-2">'+t.opgave+': '+esc(t.title)+' <span class="text-xs text-slate-500 font-normal">('+wordCount(DC.sim.texts[ti])+' words)</span></h3>'+
      '<div class="grid lg:grid-cols-2 gap-3 mb-3"><div><div class="text-[10px] uppercase text-slate-500 mb-1">Your answer</div><div class="bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-[13px] font-mono whitespace-pre-line max-h-72 overflow-y-auto">'+esc(DC.sim.texts[ti]||'(empty)')+'</div></div>'+
      '<div><div class="text-[10px] uppercase text-emerald-400/80 mb-1">Model answer</div><div class="bg-slate-900/80 border border-emerald-700/50 rounded-xl p-3 text-[13px] font-mono whitespace-pre-line max-h-72 overflow-y-auto">'+esc(t.model||t.modelStrong)+'</div></div></div>'+
      '<button onclick="DC.copyCensorPrompt('+ti+',\'sim\')" class="mb-3 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"><i data-lucide="clipboard-copy" class="w-3.5 h-3.5"></i>Copy correction prompt for '+t.opgave+'</button>'+
      '<button onclick="DC.ingestCensorReply('+ti+',\'sim\')" class="mb-3 ml-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"><i data-lucide="clipboard-check" class="w-3.5 h-3.5"></i>Log corrections</button>';
    RUBRIC_CATS.forEach(cat=>{
      h += '<div class="mb-3"><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-bold mb-1.5">'+esc(cat)+'</div><div class="space-y-1.5">';
      EXAM.rubric.forEach((r,ri)=>{
        if (r.cat!==cat) return;
        h += '<label class="flex items-start gap-2.5 text-sm text-slate-300 cursor-pointer bg-slate-900/60 rounded-lg px-2.5 py-2"><input type="checkbox" onchange="DC.sim.rubric['+ti+']['+ri+']=this.checked" class="mt-0.5 accent-amber-500">'+esc(r.text)+'</label>';
      });
      h += '</div></div>';
    });
    h += '</div>';
  });
  h += '<div class="card p-4"><button onclick="DC.sim.w1=DC.sim.rubric[0].filter(Boolean).length;DC.sim.w2=DC.sim.rubric[1].filter(Boolean).length;DC.sim.phase=\'oral1\';DC.renderSim()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">Continue: Del 3 · Mundtlig</button></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.simOral1 = function(){
  const ex = EXAMSETS[DC.sim.si], o1 = ex.oral.o1;
  const mm = o1.mm? ORAL.mindmaps.find(m=>m.id===o1.mm) : null;
  const branches = mm? mm.branches.map(b=>b.title) : o1.branches;
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">'+simHead(ex.title+' · Del 3 Mundtlig — Opgave 1 (emneopgave)', 5);
  h += '<div class="card p-5"><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">Emne (lodtrukket)</div><h3 class="font-bold text-lg text-slate-100 mb-3">'+esc(o1.topic)+'</h3>'+
    '<div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">'+branches.map(b=>'<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-center text-sm font-medium text-slate-100">'+esc(b)+'</div>').join('')+'</div>'+
    '<div id="simo1-stage"><p class="text-xs text-slate-400 mb-2"><b>Step 1 — preparation (5 min):</b> note KEYWORDS for each branch on paper, like before the real test. The timer above is running!</p>'+
    '<button onclick="DC.stopTimer(\'sim-oprep\');DC.simO1Present()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">I am ready — start the 3-min presentation</button></div></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.startTimer('sim-oprep', 5*60, 'sim-timer', function(){ DC.toast('Preparation over — present NOW, like the real test.','warn'); DC.simO1Present(); });
  DC.icons();
};
DC.simO1Present = function(){
  DC.stopTimer('sim-oprep');
  const ex = EXAMSETS[DC.sim.si], o1 = ex.oral.o1;
  const st = document.getElementById('simo1-stage');
  if (!st) return;
  st.innerHTML = '<div class="fade-in"><div class="flex items-center gap-3 mb-3"><span class="text-3xl font-mono font-extrabold text-amber-300" id="simo1-t">3:00</span><span class="text-sm text-slate-400">Present OUT LOUD — cover every branch.</span></div>'+
    '<button onclick="DC.stopTimer(\'sim-opres\');DC.simO1Follow()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Finished — examiner takes over</button>'+
    DC.recBoothHTML('simo1-rec')+'</div>';
  DC.startTimer('sim-opres', 180, 'simo1-t', function(){ DC.toast('Time — now come the follow-up questions.','warn'); DC.simO1Follow(); });
};
DC.simO1Follow = function(){
  DC.stopTimer('sim-opres');
  const ex = EXAMSETS[DC.sim.si], o1 = ex.oral.o1;
  DC.sim.fq = 0;
  const st = document.getElementById('simo1-stage');
  st.innerHTML = '<div class="fade-in"><div class="font-semibold text-sm text-slate-100 mb-2">Examiner follow-ups (answer each aloud, then reveal the next):</div><div id="simo1-qs" class="space-y-2 mb-2"></div>'+
    '<button id="simo1-next" onclick="DC.simO1Next()" class="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-500/80 text-white text-sm font-semibold">Reveal question 1 of '+o1.followUps.length+'</button>'+
    '<button id="simo1-done" onclick="DC.simAssess(1)" class="hidden px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">Done — self-assess</button></div>';
};
DC.simO1Next = function(){
  const o1 = EXAMSETS[DC.sim.si].oral.o1;
  const q = o1.followUps[DC.sim.fq];
  document.getElementById('simo1-qs').insertAdjacentHTML('beforeend','<div class="fade-in bg-slate-900/70 border border-slate-800 rounded-xl p-3"><div class="text-sm font-semibold text-slate-100 mb-1">'+(DC.sim.fq+1)+'. “'+esc(q.q)+'”</div>'+accHTML('What is tested + approach','<div class="text-xs"><b class="text-rose-300">Tests:</b> '+esc(q.tests)+'</div><div class="text-xs mt-1"><b class="text-emerald-300">Approach:</b> '+esc(q.approach)+'</div>','target',false)+'</div>');
  if (DC.state.oral.examinerVoice) DC.speak(q.q);
  DC.sim.fq++;
  const btn = document.getElementById('simo1-next');
  if (DC.sim.fq>=o1.followUps.length){ btn.classList.add('hidden'); document.getElementById('simo1-done').classList.remove('hidden'); }
  else btn.textContent = 'Reveal question '+(DC.sim.fq+1)+' of '+o1.followUps.length;
  DC.icons();
};
DC.simAssess = function(part){
  DC.stopAllTimers();
  const checks = ['Spoke the full time / answered every question','Covered all branches / topics','Used concrete examples','Used opinion phrases','Used connectors (fordi, derfor, selvom …)','Used thinking-time phrases when stuck'];
  DC.sim['as'+part] = { checks:checks.map(()=>false), flu:0, voc:0 };
  let h = '<div class="space-y-4 fade-in max-w-2xl mx-auto"><div class="card p-5"><h3 class="font-bold text-slate-100 mb-2">Self-assessment — Oral '+(part===1?'Opgave 1':'Opgave 2')+'</h3><div class="space-y-1.5 mb-3">';
  checks.forEach((c,i)=> h += '<label class="flex items-start gap-2.5 text-sm text-slate-300 cursor-pointer bg-slate-900/60 rounded-lg px-2.5 py-2"><input type="checkbox" onchange="DC.sim.as'+part+'.checks['+i+']=this.checked" class="mt-0.5 accent-emerald-500">'+c+'</label>');
  ['flu|Fluency','voc|Vocabulary'].forEach(x=>{ const [k,l]=x.split('|');
    h += '<div class="flex items-center gap-2 text-sm mb-1"><span class="w-28 text-slate-400">'+l+' (1–5):</span>'+[1,2,3,4,5].map(n=>'<button onclick="DC.sim.as'+part+'.'+k+'='+n+';this.parentElement.querySelectorAll(\'button\').forEach((b,i)=>b.classList.toggle(\'!border-indigo-400\',i<'+n+'))" class="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 font-bold text-slate-400">'+n+'</button>').join('')+'</div>'; });
  h += '</div><button onclick="DC.simAssessDone('+part+')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">'+(part===1?'Continue: Oral Opgave 2':'Finish exam — see my results')+'</button></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.simAssessDone = function(part){
  const a = DC.sim['as'+part];
  if (!a.flu || !a.voc){ DC.toast('Rate fluency and vocabulary first (1–5).','warn'); return; }
  if (part===1){ DC.sim.phase='oral2'; DC.renderSim(); }
  else { DC.simFinish(); }
};
DC.simOral2 = function(){
  const ex = EXAMSETS[DC.sim.si], o2 = ex.oral.o2;
  DC.sim.fq2 = 0;
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">'+simHead(ex.title+' · Del 3 Mundtlig — Opgave 2 (samtale)', 2);
  h += '<div class="card p-5"><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">Emne</div><h3 class="font-bold text-lg text-slate-100 mb-2">'+esc(o2.title)+'</h3>'+
    '<div class="bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-sm italic text-slate-200 mb-3">“'+esc(o2.intro)+'”</div>'+
    '<div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">'+o2.images.map(im=>'<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-center"><i data-lucide="'+im.icon+'" class="w-6 h-6 text-indigo-300 mx-auto mb-1"></i><div class="text-xs font-medium text-slate-100">'+esc(im.label)+'</div></div>').join('')+'</div>'+
    '<div id="simo2-stage"><p class="text-xs text-slate-400 mb-2"><b>Preparation (2 min):</b> think about your preference for each picture — and WHY. Timer is running.</p>'+
    '<button onclick="DC.stopTimer(\'sim-o2prep\');DC.simO2Del1()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">Ready — start Del 1</button></div></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.startTimer('sim-o2prep', 120, 'sim-timer', function(){ DC.toast('Prep over — Del 1 begins.','warn'); DC.simO2Del1(); });
  DC.icons();
};
/* Del 1 — pair task (ca. 4 min): the real test puts a partner opposite you here, which solo
   simulation can't replicate, so this mirrors free-practice's DC.partnerStart — a timer plus a
   TTS "examiner's backup prompt" for when the conversation runs dry. */
DC.simO2Del1 = function(){
  DC.stopTimer('sim-o2prep');
  const o2 = EXAMSETS[DC.sim.si].oral.o2;
  DC._simO2Backup = o2.del1Backup || '';
  const st = document.getElementById('simo2-stage');
  st.innerHTML = '<div class="fade-in"><div class="flex items-center gap-3 mb-2"><span class="text-3xl font-mono font-extrabold text-amber-300" id="simo2-t">4:00</span><span class="text-sm text-slate-400">Del 1 — parsamtale: react to the pictures with a partner (or run both roles yourself).</span></div>'+
    '<button onclick="DC.speak(DC._simO2Backup)" class="w-full px-4 py-2.5 rounded-xl bg-amber-600/80 hover:bg-amber-500/80 text-white text-sm font-semibold flex items-center justify-center gap-2 mb-2"><i data-lucide="volume-2" class="w-4 h-4"></i>Stuck? Hear the examiner’s backup prompt</button>'+
    '<button onclick="DC.stopTimer(\'sim-o2d1\');DC.simO2Qs()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Finished Del 1 — start Del 2</button></div>';
  DC.startTimer('sim-o2d1', 240, 'simo2-t', function(){ DC.toast('4 minutes — Del 1 is over. Move on to Del 2.','warn'); DC.simO2Qs(); });
  DC.icons();
};
DC.simO2Qs = function(){
  DC.stopTimer('sim-o2d1');
  const o2 = EXAMSETS[DC.sim.si].oral.o2;
  const st = document.getElementById('simo2-stage');
  st.innerHTML = '<div class="fade-in"><div class="font-semibold text-sm text-slate-100 mb-2">Del 2 — individuel opfølgning (ca. 3 min), '+o2.questions.length+' questions — answer each ALOUD with PREP before revealing the next:</div><div id="simo2-qs" class="space-y-2 mb-2"></div>'+
    '<button id="simo2-next" onclick="DC.simO2Next()" class="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-500/80 text-white text-sm font-semibold">Reveal question 1 of '+o2.questions.length+'</button>'+
    '<button id="simo2-done" onclick="DC.simAssess(2)" class="hidden px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">Done — self-assess</button>'+
    DC.recBoothHTML('simo2-rec')+'</div>';
  DC.startTimer('sim-o2d2', 180, 'sim-timer', function(){ DC.toast('Time — wrap up Del 2 and self-assess.','warn'); });
  DC.icons();
};
DC.simO2Next = function(){
  const o2 = EXAMSETS[DC.sim.si].oral.o2;
  document.getElementById('simo2-qs').insertAdjacentHTML('beforeend','<div class="fade-in text-sm bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2"><b class="text-amber-300">'+(DC.sim.fq2+1)+'.</b> '+esc(o2.questions[DC.sim.fq2])+'</div>');
  if (DC.state.oral.examinerVoice) DC.speak(o2.questions[DC.sim.fq2]);
  DC.sim.fq2++;
  const btn = document.getElementById('simo2-next');
  if (DC.sim.fq2>=o2.questions.length){ btn.classList.add('hidden'); document.getElementById('simo2-done').classList.remove('hidden'); }
  else btn.textContent = 'Reveal question '+(DC.sim.fq2+1)+' of '+o2.questions.length;
};
DC.simFinish = function(){
  const ex = EXAMSETS[DC.sim.si];
  const r = DC.sim.reading;
  const rPct = pct(r.score, r.total);
  const w = (DC.sim.w1||0)+(DC.sim.w2||0), wPct = pct(w,20);
  const oScore = a => Math.round((a.checks.filter(Boolean).length/6)*50 + ((a.flu+a.voc)/10)*50);
  const o1s = oScore(DC.sim.as1), o2s = oScore(DC.sim.as2), oPct = Math.round((o1s+o2s)/2);
  const overall = Math.round((rPct+wPct+oPct)/3);
  ['w-opg1','w-opg2','w-check'].forEach(c=> DC.state.concepts[c].history.push({ok:w>=14, conf:'unsure', ts:Date.now(), hints:0}));
  ['o-mindmap','o-conversation','o-followup'].forEach(c=> DC.state.concepts[c].history.push({ok:oPct>=65, conf:'unsure', ts:Date.now(), hints:0}));
  const result = { ts:Date.now(), kind:'sim', setId:ex.id, overall,
    reading:{ score:r.score, total:r.total, sections:r.sect, minutes:DC.sim.times.reading },
    writing:{ self:w, total:20, t1:DC.sim.w1, t2:DC.sim.w2, minutes:DC.sim.times.writing, times:DC.sim.wTimes||[], catScores:rubricCatScores(DC.sim.rubric) },
    oral:{ o1:o1s, o2:o2s, pct:oPct } };
  DC.state.exams.push(result);
  DC.state.behavior.lastWriting = DC.state.behavior.lastOral = Date.now();
  DC.checkBadges(); DC.save();
  DC.sim.result = result; DC.sim.phase='report'; DC.renderSim();
};
DC.simReport = function(){
  const ex = EXAMSETS[DC.sim.si], e = DC.sim.result, r = DC.sim.reading;
  /* verdict follows the weakest delprøve — the real test requires EVERY part to pass */
  const weakestPct = Math.min(pct(e.reading.score,e.reading.total), pct(e.writing.self,20), e.oral.pct);
  const verdict = weakestPct>=80? ['emerald','Exam-ready (writing/oral self-scored)'] : weakestPct>=65? ['amber','On track — weakest part decides ('+weakestPct+'%)'] : ['rose','Foundation first — weakest part would fail ('+weakestPct+'%)'];
  const sectNames = { cloze:'Opgave 1 · Cloze', chat:'Opgave 2A · Chat', o3:'Opgave 3', o4:'Opgave 4' };
  const sorted = Object.entries(e.reading.sections).sort((a,b)=>pct(a[1][0],a[1][1])-pct(b[1][0],b[1][1]));
  const weakest = sorted[0], strongest = sorted[sorted.length-1];
  const weakC = Brain.weakConcepts();
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<div class="card p-6 text-center"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1">'+esc(ex.title)+' — final report</div>'+
    '<div class="text-5xl font-extrabold text-'+verdict[0]+'-300 mb-1">'+e.overall+'%</div><div class="font-bold text-'+verdict[0]+'-200">'+verdict[1]+'</div></div>';
  h += '<div class="grid md:grid-cols-3 gap-3">';
  h += '<div class="card p-4"><div class="font-semibold text-sm text-slate-100 mb-1">Læsning</div><div class="text-2xl font-extrabold text-slate-100">'+e.reading.score+'/'+e.reading.total+'</div>'+bar(pct(e.reading.score,e.reading.total))+'<div class="text-[11px] text-slate-500 mt-1">'+e.reading.minutes+' of 50 min</div>'+
    Object.entries(e.reading.sections).map(([k,v])=>'<div class="flex items-center gap-2 text-[11px] text-slate-400 mt-1"><span class="w-24">'+sectNames[k]+'</span><div class="flex-1">'+bar(pct(v[0],v[1]),pct(v[0],v[1])===100?'bg-emerald-500':'bg-indigo-500')+'</div><span>'+v[0]+'/'+v[1]+'</span></div>').join('')+'</div>';
  const wt = e.writing.times||[];
  h += '<div class="card p-4"><div class="font-semibold text-sm text-slate-100 mb-1">Skrivning (self-scored)</div><div class="text-2xl font-extrabold text-slate-100">'+e.writing.self+'/20</div>'+bar(pct(e.writing.self,20))+'<div class="text-[11px] text-slate-500 mt-1">'+e.writing.minutes+' of 90 min · Opg.1: '+e.writing.t1+'/10'+(wt[0]!=null?' ('+wt[0]+'/45 min)':'')+' · Opg.2: '+e.writing.t2+'/10'+(wt[1]!=null?' ('+wt[1]+'/45 min)':'')+'</div></div>';
  h += '<div class="card p-4"><div class="font-semibold text-sm text-slate-100 mb-1">Mundtlig (self-assessed)</div><div class="text-2xl font-extrabold text-slate-100">'+e.oral.pct+'%</div>'+bar(e.oral.pct)+'<div class="text-[11px] text-slate-500 mt-1">Opg.1: '+e.oral.o1+'% · Opg.2: '+e.oral.o2+'%</div></div>';
  h += '</div>';
  if (e.writing.catScores){
    h += '<div class="card p-4"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Skrivning by assessment dimension</div><div class="space-y-1.5">'+
      RUBRIC_CATS.map(cat=>{ const x=e.writing.catScores[cat]; return '<div class="flex items-center gap-2 text-xs text-slate-400"><span class="w-40">'+esc(cat)+'</span><div class="flex-1">'+bar(pct(x[0],x[1]), pct(x[0],x[1])===100?'bg-emerald-500':'bg-indigo-500')+'</div><span class="w-8 text-right">'+x[0]+'/'+x[1]+'</span></div>'; }).join('')+
      '</div></div>';
  }
  h += '<div class="card p-4 text-sm text-slate-300 flex items-start gap-2"><i data-lucide="graduation-cap" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i><span><b>Teacher Brain summary:</b> Strongest reading section: <b>'+sectNames[strongest[0]]+'</b> ('+strongest[1][0]+'/'+strongest[1][1]+'). Weakest: <b>'+sectNames[weakest[0]]+'</b> — train it first. Time management: you used '+e.reading.minutes+'/50 reading and '+e.writing.minutes+'/90 writing minutes'+(e.reading.minutes>=48?' — the reading clock beat you; practise the time budget.':' — fine margins.')+(weakC.length?' Grammar focus: <b>'+esc(CONCEPTS[weakC[0]].name)+'</b> is still weak; fix it before the next attempt.':' No weak grammar concepts right now — flot!')+'</span></div>';
  if (r.wrongs.length){
    h += '<div class="card p-4 flex items-center gap-3 flex-wrap"><div class="text-sm text-slate-300 flex-1">'+r.wrongs.length+' reading mistake'+(r.wrongs.length>1?'s':'')+' with full explanations are ready for your Error Notebook and spaced review.</div>'+
      '<button id="sim-send" onclick="DC.simSendErrors()" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold">Send mistakes to Error Notebook</button></div>';
  }
  h += '<div class="card p-4 flex gap-2 flex-wrap"><button onclick="DC.sim=null;DC.renderSim()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Back to exam menu</button>'+
    '<button onclick="DC.go(\'dashboard\')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Dashboard</button></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.simSendErrors = function(){
  const r = DC.sim.reading;
  r.wrongs.forEach(w=> Brain.record(Object.assign({module:'Exam Simulation', opgave:'Læsning', correct:false, confidence:'sure', hintsUsed:0, timeSpent:0}, w)));
  const b = document.getElementById('sim-send');
  if (b){ b.disabled = true; b.textContent = '✓ Sent — opening notebook'; }
  DC.toast(r.wrongs.length+' mistakes saved with explanations and scheduled for review.','ok');
  setTimeout(()=>DC.go('notebook'), 900);
};

/* =====================================================================
   7.5 — READINESS FORMULA — core (mastery 35 · accuracy 25 · mock 25 · review 10 · calibration 5).
   Recomputed fresh on every call, so it can go down as well as up. Dojo + vocab mastery are
   blended in by Brain.readiness further down, once those modules are loaded (see readinessCore usage).
   ===================================================================== */
Brain.readinessCore = function(){
  const s = DC.state;
  const mastery = ['Grammar','Writing','Reading','Oral'].reduce((t,a)=>t+Brain.areaScore(a),0)/4;
  const recent = s.activity.slice(-50);
  const accuracy = recent.length ? pct(recent.filter(a=>a.ok).length, recent.length) : (s.behavior.answers ? pct(s.behavior.correct, s.behavior.answers) : 0);
  /* calibration from the recent window, not lifetime counters — early misconceptions must be forgivable */
  const cw = recent.filter(a=>!a.ok && a.conf==='confident').length;
  const gr = recent.filter(a=>a.ok && a.conf==='guessed').length;
  const calib = recent.length ? clamp(100 - cw*12 - gr*4, 0, 100) : 0;
  /* review credit: mastered fully, scheduled-and-survived-one-interval half; empty queue → component drops out */
  const hasReviews = s.review.length > 0;
  const reviewDone = hasReviews ? pct(s.review.filter(r=>r.mastered).length + s.review.filter(r=>!r.mastered && r.stage>=1 && r.due>Date.now()).length*0.5, s.review.length) : 0;
  const exams = (s.exams||[]).slice(-3);
  const mock = exams.length ? exams.reduce((t,e)=>t+e.overall,0)/exams.length : null;
  /* weighted sum over the components that actually exist, renormalized — no free points for empty queues */
  let sum = mastery*0.35 + accuracy*0.25 + calib*0.05, w = 0.65;
  if (mock!==null){ sum += mock*0.25; w += 0.25; }
  if (hasReviews){ sum += reviewDone*0.10; w += 0.10; }
  return sum / w;
};

/* =====================================================================
   NAVIGATION — Skills Gym + Exam Simulation
   ===================================================================== */
VIEW_TITLES.gym = 'Skills Gym — dictation, building, translation, error-spotting';
VIEW_TITLES.sim = 'Exam Simulation — full mock exams';
(function(){
  const _go = DC.go;
  function goGymSim(view){
    DC.stopAllTimers();
    DC.view = view;
    DC.state.behavior.moduleVisits[view] = (DC.state.behavior.moduleVisits[view]||0)+1;
    document.querySelectorAll('.nav-btn').forEach(el=>el.classList.toggle('active', el.dataset.nav===view));
    const t = document.getElementById('header-title'); if (t) t.textContent = VIEW_TITLES[view];
    if (view==='gym') DC.renderGym(); else { DC.sim = DC.sim && DC.sim.phase!=='menu' ? DC.sim : null; DC.renderSim(); }
    DC.save(); window.scrollTo({top:0});
  }
  DC.go = function(view){
    if (view==='gym' || view==='sim'){
      if (DC.examLikeActive() && DC.view!==view){
        DC.confirmBox('Leave the exam?',
          'You are mid-sitting — leaving now stops your timer and abandons this attempt. It will not be scored.',
          'Yes, leave', function(){ DC.examS=null; DC.sim=null; DC.clearExamResume(); goGymSim(view); });
        return;
      }
      goGymSim(view);
      return;
    }
    _go(view);
  };
})();


/* =====================================================================
   MOBILE LAYER — drawer, mini-timer, navigation hooks
   ===================================================================== */
DC.drawer = function(open){
  const d = document.getElementById('side-drawer');
  const b = document.getElementById('drawer-backdrop');
  if (!d) return;
  d.classList.toggle('-translate-x-full', !open);
  if (b) b.classList.toggle('hidden', !open);
  document.body.style.overflow = (open && window.innerWidth<1024) ? 'hidden' : '';
};
(function(){
  const _go = DC.go;
  DC.go = function(view){ DC.drawer(false); _go(view); };
})();
(function(){
  function mini(){
    let el = document.getElementById('mini-timer');
    if (!el){
      el = document.createElement('div');
      el.id = 'mini-timer';
      el.className = 'lg:hidden no-print fixed z-[60] font-mono font-bold text-sm px-3 py-2 rounded-full';
      el.style.cssText = 'top:60px;right:12px;background:#fff;border:1px solid #ddc98e;color:#b78103;box-shadow:0 2px 8px rgba(20,20,20,.15);display:none';
      document.body.appendChild(el);
    }
    return el;
  }
  function refresh(){
    const el = mini();
    const ids = Object.keys(DC.timers);
    if (!ids.length || window.innerWidth>=1024){ el.style.display='none'; return; }
    const t = DC.timers[ids[0]];
    el.textContent = '⏱ '+fmtTime(Math.max(0, t.left));
    el.style.display = 'block';
    el.style.color = t.left<=60 ? '#c62828' : '#b78103';
  }
  const _st = DC.startTimer, _sp = DC.stopTimer;
  DC.startTimer = function(id, seconds, displayId, onEnd){
    _st(id, seconds, displayId, onEnd);
    if (DC._miniInt) clearInterval(DC._miniInt);
    DC._miniInt = setInterval(refresh, 1000);
    refresh();
  };
  DC.stopTimer = function(id){ _sp(id); refresh(); };
})();



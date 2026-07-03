/* Dansk Coach — js/07-render-modules.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   RENDER CORE — navigation, shared components, question engine
   ===================================================================== */
const VIEW_TITLES = { dashboard:'Dashboard', learn:'Learn Mode', grammar:'Grammar Trainer',
  reading:'Reading Simulator · Læsning', writing:'Writing Lab · Skrivning',
  oral:'Oral Strategist · Mundtlig', notebook:'Personal Error Notebook',
  review:'Spaced Repetition Review', strategy:'Exam Strategy', today:'Today’s Session' };


DC.renderHeader = function(){
  const r = Brain.readiness();
  const due = DC.allDue();
  const set = (id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set('header-readiness', r+'%'); set('header-due', due); set('header-streak', DC.state.streak);
  set('mob-readiness', r+'%'); set('mob-streak', '🔥'+DC.state.streak);
  const bar = document.getElementById('header-readiness-bar'); if (bar) bar.style.width = r+'%';
  const nb = document.getElementById('nb-count');
  const open = DC.state.errors.filter(e=>!e.understood).length;
  if (nb){ nb.textContent = open; nb.classList.toggle('hidden', open===0); }
  const itemDue = Brain.dueReviews().length;
  const rq = document.getElementById('rq-count');
  if (rq){ rq.textContent = itemDue; rq.classList.toggle('hidden', itemDue===0); }
  const tc = document.getElementById('today-count');
  if (tc){ DC.todayReset(); const steps = DC.todaySteps(); const left = steps.filter(st=>DC.state.today.done.indexOf(st.key)<0).length; tc.textContent = left; tc.classList.toggle('hidden', left===0); }
};

/* ---------- shared visual components ---------- */
function statusBadge(st){ return '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full status-'+st+'">'+st+'</span>'; }

function deconHTML(d){
  if (!d) return '';
  const heads = d.type==='main' ? ['Position 1','Verb','Subject','Adverb','Rest'] : ['Connector','Subject','Adverb','Verb','Rest'];
  const colors = d.type==='main' ? ['text-indigo-300','text-emerald-300','text-sky-300','text-amber-300','text-slate-400']
                                 : ['text-rose-300','text-sky-300','text-amber-300','text-emerald-300','text-slate-400'];
  let h = '<div class="overflow-x-auto"><table class="text-sm border-separate" style="border-spacing:6px 2px"><tr>';
  heads.forEach((x,i)=> h+='<th class="pos-cell text-[10px] uppercase tracking-wider font-semibold '+colors[i]+' text-left px-3">'+x+'</th>');
  h += '</tr><tr>';
  d.cells.forEach((c,i)=> h+='<td class="pos-cell bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 font-medium '+(c==='—'?'text-slate-600':'text-slate-100')+'">'+esc(c)+'</td>');
  h += '</tr></table></div>'+
    '<div class="text-[11px] text-slate-500 mt-1 flex items-center flex-wrap gap-1">'+(d.type==='main'?'Main clause: the finite verb is locked in position 2.':'Subordinate clause: Subject + Adverb + Verb — no inversion after the connector.')+
    (typeof DC!=='undefined'&&DC.spk?DC.spk(d.cells.filter(c=>c&&c!=='—').join(' ').replace(/→/g,''),'Hør'):'')+'</div>';
  return h;
}

function bar(p, color){
  return '<div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden"><div class="h-full rounded-full '+(color||'bg-indigo-500')+'" style="width:'+clamp(p,0,100)+'%"></div></div>';
}

DC.toggleAcc = function(el){ el.closest('.accordion').classList.toggle('open'); DC.icons(); };
function accHTML(title, body, icon, open){
  return '<div class="accordion card overflow-hidden '+(open?'open':'')+'">'+
    '<button onclick="DC.toggleAcc(this)" class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-800/40">'+
    (icon?'<i data-lucide="'+icon+'" class="w-4 h-4 text-indigo-300 shrink-0"></i>':'')+
    '<span class="font-semibold text-sm text-slate-100 flex-1">'+title+'</span>'+
    '<i data-lucide="chevron-down" class="w-4 h-4 text-slate-500 acc-chev"></i></button>'+
    '<div class="accordion-body px-4 pb-4 text-sm text-slate-300">'+body+'</div></div>';
}

/* =====================================================================
   QUESTION ENGINE (multiple choice + word ordering) with hints,
   confidence rating, teacher feedback, error logging, SRS hookup
   ===================================================================== */
const CONF_LEVELS = [
  { id:'guessed', label:'I guessed', icon:'dices' },
  { id:'unsure', label:'I was unsure', icon:'help-circle' },
  { id:'sure', label:'I was fairly sure', icon:'thumbs-up' },
  { id:'confident', label:'I was confident', icon:'star' }
];

DC.qStart = function(cid, qdef, ctx){
  DC.q[cid] = { qdef, ctx, hints:0, start:Date.now(), answered:false, order:[] };
  const box = document.getElementById(cid);
  if (!box) return;
  let h = '<div class="fade-in">';
  h += '<div class="flex items-center gap-2 mb-3 flex-wrap">';
  if (qdef.tag) h += '<span class="text-[10px] uppercase tracking-wider font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-2.5 py-1">'+esc(qdef.tag)+'</span>';
  if (qdef.difficulty) h += '<span class="text-[10px] font-bold rounded-full px-2.5 py-1 '+(qdef.difficulty==='Easy'?'bg-emerald-500/10 text-emerald-300':qdef.difficulty==='Medium'?'bg-amber-500/10 text-amber-300':'bg-rose-500/10 text-rose-300')+'">'+qdef.difficulty+'</span>';
  if (qdef.concept && CONCEPTS[qdef.concept]) h += '<span class="text-[10px] text-slate-500">'+esc(CONCEPTS[qdef.concept].name)+'</span>';
  h += '</div>';
  h += '<div class="font-semibold text-slate-100 mb-4 text-[15px]">'+qdef.prompt+'</div>';
  if (qdef.type==='order'){
    h += '<div class="text-xs text-slate-400 mb-2">Click the chips in the correct order:</div>';
    h += '<div id="'+cid+'-ans" class="min-h-[3rem] card !bg-slate-900/60 p-3 mb-3 flex flex-wrap gap-2"></div>';
    h += '<div id="'+cid+'-pool" class="flex flex-wrap gap-2 mb-4">';
    shuffle(qdef.words.map((w,i)=>({w,i}))).forEach(o=>{
      h += '<button class="chip px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium" data-i="'+o.i+'" onclick="DC.qChip(\''+cid+'\',this)">'+esc(o.w)+'</button>';
    });
    h += '</div>';
    h += '<div class="flex gap-2 flex-wrap"><button id="'+cid+'-submit" onclick="DC.qSubmitOrder(\''+cid+'\')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-40" disabled>Check sentence</button>'+
         '<button onclick="DC.qResetOrder(\''+cid+'\')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Start over</button>'+
         DC.hintBtn(cid)+'</div>';
  } else {
    h += '<div class="grid gap-2 mb-4">';
    (DC.q[cid].optOrder = shuffle(qdef.options.map((o,i)=>i))).forEach(i=>{
      h += '<button id="'+cid+'-opt-'+i+'" onclick="DC.qSubmitMC(\''+cid+'\','+i+')" class="opt-btn text-left px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm hover:bg-slate-800/60">'+esc(qdef.options[i].text)+'</button>';
    });
    h += '</div><div class="flex gap-2">'+DC.hintBtn(cid)+'</div>';
  }
  h += '<div id="'+cid+'-hints" class="mt-3 space-y-2"></div>';
  h += '<div id="'+cid+'-fb" class="mt-3"></div></div>';
  box.innerHTML = h;
  DC.icons();
};
DC.hintBtn = function(cid){
  return '<button id="'+cid+'-hintbtn" onclick="DC.qHint(\''+cid+'\')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm flex items-center gap-2"><i data-lucide="lightbulb" class="w-4 h-4 text-amber-300"></i>Hint <span class="text-slate-500" id="'+cid+'-hintn"></span></button>';
};
DC.qHint = function(cid){
  const s = DC.q[cid]; if (!s || s.answered) return;
  const hints = s.qdef.hints || ['Identify whether it is a main clause or a subordinate clause.','Identify position 1 or the connector.','Identify the finite verb.','Build the sentence skeleton in your head.','Eliminate options that break the pattern.'];
  if (s.hints >= hints.length){ DC.toast('No more hints — trust your skeleton and answer!','warn'); return; }
  const el = document.getElementById(cid+'-hints');
  el.innerHTML += '<div class="fade-in flex items-start gap-2 text-sm bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2"><i data-lucide="lightbulb" class="w-4 h-4 text-amber-300 shrink-0 mt-0.5"></i><span class="text-amber-100">Hint '+(s.hints+1)+': '+esc(hints[s.hints])+'</span></div>';
  s.hints++;
  const n = document.getElementById(cid+'-hintn'); if(n) n.textContent = '('+s.hints+'/'+hints.length+')';
  DC.icons();
};
DC.qChip = function(cid, btn){
  const s = DC.q[cid]; if (!s || s.answered) return;
  const ans = document.getElementById(cid+'-ans');
  const inPool = btn.parentElement.id === cid+'-pool';
  if (inPool){ ans.appendChild(btn); } else { document.getElementById(cid+'-pool').appendChild(btn); }
  const done = document.getElementById(cid+'-pool').children.length===0;
  document.getElementById(cid+'-submit').disabled = !done;
};
DC.qResetOrder = function(cid){
  const s = DC.q[cid]; if (!s || s.answered) return;
  DC.qStart(cid, s.qdef, s.ctx);
};
DC.qSubmitOrder = function(cid){
  const s = DC.q[cid]; if (!s || s.answered) return;
  const ans = document.getElementById(cid+'-ans');
  const built = Array.from(ans.children).map(b=>b.textContent).join(' ').replace(/\s+/g,' ').trim();
  const ok = built.toLowerCase() === s.qdef.answer.toLowerCase();
  ans.classList.add(ok?'opt-correct':'opt-wrong');
  document.getElementById(cid+'-submit').disabled = true;
  DC.qFinish(cid, ok, built);
};
DC.qSubmitMC = function(cid, idx){
  const s = DC.q[cid]; if (!s || s.answered) return;
  const q = s.qdef;
  q.options.forEach((o,i)=>{
    const el = document.getElementById(cid+'-opt-'+i);
    el.disabled = true;
    if (o.ok) el.classList.add('opt-correct');
    if (i===idx && !o.ok) el.classList.add('opt-wrong');
  });
  DC.qFinish(cid, q.options[idx].ok, q.options[idx].text, idx);
};
DC.qFinish = function(cid, ok, given, idx){
  const s = DC.q[cid]; s.answered = true; s.ok = ok; s.given = given; s.idx = idx;
  s.time = Math.round((Date.now()-s.start)/1000);
  // ask confidence
  let h = '<div class="card !border-indigo-500/40 p-4 fade-in"><div class="text-sm font-semibold text-slate-100 mb-2">How sure were you?</div><div class="conf-grid flex flex-wrap gap-2">';
  CONF_LEVELS.forEach(c=>{
    h += '<button onclick="DC.qConfidence(\''+cid+'\',\''+c.id+'\')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600/40 border border-slate-700 text-sm flex items-center gap-2"><i data-lucide="'+c.icon+'" class="w-4 h-4"></i>'+c.label+'</button>';
  });
  h += '</div></div>';
  document.getElementById(cid+'-fb').innerHTML = h;
  DC.icons();
};
DC.qConfidence = function(cid, conf){
  const s = DC.q[cid]; if (!s || s.conf) return;
  s.conf = conf;
  const q = s.qdef, ctx = s.ctx;
  const correctOpt = q.type==='order' ? {text:q.answer} : q.options.find(o=>o.ok);
  const chosenOpt = q.type==='order' ? null : q.options[s.idx];
  const snapshot = q.type==='order'
    ? { kind:'order', tag:q.tag, prompt:q.prompt, words:q.words, answer:q.answer, explanation:q.explanation, trick:q.trick, decon:q.decon, hints:q.hints, concept:q.concept, difficulty:q.difficulty, wrongWhy:q.wrongWhy }
    : { kind:'mc', tag:q.tag, prompt:q.prompt, options:q.options, explanation:q.explanation, trick:q.trick, decon:q.decon, hints:q.hints, concept:q.concept, difficulty:q.difficulty };
  Brain.record({
    module: ctx.module, opgave: ctx.opgave, concept: q.concept, extraConcepts: q.extraConcepts,
    qid: ctx.qid || q.id || cid, question: q.prompt,
    userAnswer: s.given, correctAnswer: correctOpt.text,
    mistakeType: s.ok ? null : (chosenOpt && chosenOpt.mistakeType) || (q.type==='order'?'Wrong word order':'Wrong answer'),
    explanation: q.explanation, memoryTrick: q.trick,
    correct: s.ok, confidence: conf, hintsUsed: s.hints, timeSpent: s.time,
    snapshot: ctx.noReview ? null : snapshot
  });
  // teacher feedback panel
  let fb = '';
  const teacherLine = DC.teacherLine(s, chosenOpt);
  fb += '<div class="card p-4 fade-in space-y-3 '+(s.ok?'!border-emerald-500/40':'!border-rose-500/40')+'">';
  fb += '<div class="flex items-center gap-2 font-bold '+(s.ok?'text-emerald-300':'text-rose-300')+'"><i data-lucide="'+(s.ok?'check-circle-2':'x-circle')+'" class="w-5 h-5"></i>'+(s.ok?'Correct':'Not quite')+
        ' <span class="text-xs font-normal text-slate-500">· '+s.time+'s · '+s.hints+' hint'+(s.hints===1?'':'s')+'</span></div>';
  fb += '<div class="text-sm text-slate-200">'+teacherLine+'</div>';
  if (!s.ok && chosenOpt && chosenOpt.why) fb += '<div class="text-sm text-rose-200/90 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2"><b>Your answer:</b> '+esc(chosenOpt.text)+'<br><b>Mistake type:</b> '+esc(chosenOpt.mistakeType||'—')+'. '+esc(chosenOpt.why)+'</div>';
  if (!s.ok && q.type==='order') fb += '<div class="text-sm text-rose-200/90 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2"><b>Your sentence:</b> '+esc(s.given)+'<br>'+esc(q.wrongWhy||'')+'<br><b>Correct:</b> '+esc(q.answer)+'</div>';
  fb += '<div class="text-sm text-slate-300"><b class="text-slate-100">Teacher explanation:</b> '+esc(q.explanation)+'</div>';
  if (q.trick) fb += '<div class="flex items-start gap-2 text-sm bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-3 py-2"><i data-lucide="sparkles" class="w-4 h-4 text-indigo-300 shrink-0 mt-0.5"></i><span><b>Memory trick:</b> '+esc(q.trick)+'</span></div>';
  if (q.decon) fb += '<div>'+deconHTML(q.decon)+'</div>';
  if (s.ok && q.type==='mc'){
    const wrongs = q.options.filter(o=>!o.ok);
    fb += accHTML('Why the other options are wrong', wrongs.map(o=>'<div class="mb-2"><b class="text-rose-300">'+esc(o.text)+'</b><br><span class="text-xs text-slate-400">'+esc(o.mistakeType||'')+'</span> — '+esc(o.why)+'</div>').join(''), 'x-octagon', false);
  }
  fb += '</div>';
  document.getElementById(cid+'-fb').innerHTML = fb;
  DC.icons();
  DC.renderHeader();
  if (ctx.onDone) ctx.onDone(s);
};
DC.teacherLine = function(s, chosenOpt){
  const ok = s.ok, conf = s.conf;
  if (ok && conf==='confident') return 'Correct and confident — that is a strong mastery signal. This pattern is becoming automatic.';
  if (ok && conf==='sure') return 'Correct and fairly sure. One or two more confident repetitions and this is mastered.';
  if (ok && conf==='unsure') return 'Correct, but you hesitated. Read the explanation anyway — naming WHY it is right makes it stick.';
  if (ok && conf==='guessed') return 'You guessed correctly. This is not mastered yet, so it has been added to your review queue — luck is not a strategy we rely on.';
  if (!ok && conf==='confident') return 'You were confident but wrong. That usually means this is a misconception, not just a memory slip — I am marking it for reteaching. Reread the lesson before retrying.';
  if (!ok && conf==='sure') return 'Close to a misconception: you felt fairly sure but the rule fired wrongly. Study the deconstruction below slowly.';
  return 'Wrong, and you felt it. Good self-awareness — now let us fix the rule so the doubt disappears. It is in your review queue.';
};

/* =====================================================================
   DASHBOARD
   ===================================================================== */
DC.renderDashboard = function(){
  const s = DC.state;
  const r = Brain.readiness();
  const due = Brain.dueReviews().length;
  const overdue = s.review.filter(x=>!x.mastered && x.due < Date.now()-24*3600*1000).length;
  const acc = s.behavior.answers ? pct(s.behavior.correct, s.behavior.answers) : null;

  let h = '<div class="space-y-6 fade-in">';
  // hero
  h += '<div class="card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">';
  h += '<div class="relative w-28 h-28 shrink-0 mx-auto md:mx-0">'+
       '<svg viewBox="0 0 36 36" class="w-28 h-28 -rotate-90"><circle cx="18" cy="18" r="15.9" fill="none" stroke="#eef0f2" stroke-width="3.5"/><circle cx="18" cy="18" r="15.9" fill="none" stroke="#42B0D5" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="'+r+',100"/></svg>'+
       '<div class="absolute inset-0 flex flex-col items-center justify-center"><span class="text-2xl font-extrabold text-slate-100">'+r+'%</span><span class="text-[9px] uppercase tracking-wider text-slate-500">ready</span></div></div>';
  h += '<div class="flex-1"><div class="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-1">Exam readiness · Modul 3.3</div>'+
       '<p class="text-slate-200 leading-relaxed">'+Brain.encouragement()+'</p>'+
       '<div class="mt-3 flex items-start gap-2 text-sm bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-3 py-2"><i data-lucide="graduation-cap" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i><span><b>Teacher’s note:</b> '+Brain.advice()+'</span></div></div>';
  h += '<div class="grid grid-cols-3 md:grid-cols-1 gap-3 text-center md:text-right shrink-0">'+
       '<div><div class="text-xl font-extrabold text-emerald-300">'+s.streak+'</div><div class="text-[10px] uppercase text-slate-500">day streak</div></div>'+
       '<div><div class="text-xl font-extrabold '+(acc===null?'text-slate-500':'text-indigo-300')+'">'+(acc===null?'—':acc+'%')+'</div><div class="text-[10px] uppercase text-slate-500">accuracy</div></div>'+
       '<div><div class="text-xl font-extrabold '+(due?'text-amber-300':'text-slate-400')+'">'+due+'</div><div class="text-[10px] uppercase text-slate-500">reviews due</div></div></div>';
  h += '</div>';

  // progress cards
  const rd = id => { const a = Brain.conceptAcc(id); return a===null?'<span class="text-slate-600">—</span>':a+'%'; };
  const wDone = o => Object.keys(s.writing.completed).filter(k=>k.startsWith(o)).length;
  const oralStates = id => (s.oral.tracker[id]||[]);
  const oralScore = ids => { let n=0,t=0; ids.forEach(i=>{ t++; const st=oralStates(i); if(st.includes('confident')) n+=1; else if(st.includes('practiced')) n+=0.6; }); return pct(n,t); };
  h += '<div class="grid md:grid-cols-2 xl:grid-cols-5 gap-3">';
  h += progCard('Grammar', Brain.areaScore('Grammar'), 'puzzle', "DC.go('grammar')",
    '<div class="text-[11px] text-slate-400 mt-1">'+GRAMMAR_QUESTIONS.filter(q=>s.grammarDone[q.id]&&s.grammarDone[q.id].correct).length+'/'+GRAMMAR_QUESTIONS.length+' questions solved correctly</div>');
  h += progCard('Reading · Læsning', Brain.areaScore('Reading'), 'file-search', "DC.go('reading')",
    '<div class="text-[11px] text-slate-400 mt-1 grid grid-cols-3 gap-1"><span>2A: '+rd('r-2a')+'</span><span>Opg3: '+rd('r-3')+'</span><span>Opg4: '+rd('r-4')+'</span></div>');
  h += progCard('Writing · Skrivning', Brain.areaScore('Writing'), 'pen-line', "DC.go('writing')",
    '<div class="text-[11px] text-slate-400 mt-1 grid grid-cols-2 gap-1"><span>Opg1: '+wDone('w1')+'/'+WRITING.tasks.filter(t=>t.id.startsWith('w1')).length+' done</span><span>Opg2: '+wDone('w2')+'/'+WRITING.tasks.filter(t=>t.id.startsWith('w2')).length+' done</span></div>');
  h += progCard('Oral · Mundtlig', Brain.areaScore('Oral'), 'mic', "DC.go('oral')",
    '<div class="text-[11px] text-slate-400 mt-1 grid grid-cols-2 gap-1"><span>Opg1: '+oralScore(['mm1','mm2','mm3'])+'% self-marked</span><span>Opg2: '+oralScore(['sc1','sc2','sc3'])+'% self-marked</span></div>');
  const rqp = s.review.length ? pct(s.review.filter(x=>x.mastered).length, s.review.length) : 0;
  h += progCard('Review Queue', rqp, 'brain', "DC.go('review')",
    '<div class="text-[11px] text-slate-400 mt-1">'+due+' due · '+s.review.filter(x=>x.mastered).length+' mastered of '+s.review.length+'</div>');
  h += '</div>';

  // study plan + weaknesses
  h += '<div class="grid lg:grid-cols-2 gap-4">';
  /* one daily plan, not two: this card mirrors Today's Session exactly (same steps, same order, same ticks) */
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-3"><i data-lucide="calendar-check" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Today’s Session</h2><button onclick="DC.go(\'today\')" class="ml-auto text-xs font-semibold text-indigo-300 hover:text-indigo-200">Open →</button></div><div class="space-y-2">';
  DC.todaySteps().forEach((p,pi)=>{
    const done = DC.state.today.done.indexOf(p.key)>=0;
    h += '<div class="flex items-center gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5'+(done?' opacity-60':'')+'"><i data-lucide="'+(done?'check':p.icon)+'" class="w-4 h-4 '+(done?'text-emerald-400':'text-slate-400')+' shrink-0"></i><span class="text-sm flex-1">'+(pi+1)+'. '+esc(p.label)+'</span><button onclick="DC.todayMark(\''+p.key+'\');'+p.fn+'" class="text-xs font-semibold text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-2.5 py-1.5 shrink-0">'+(done?'Again':'Go')+'</button></div>';
  });
  h += '</div></div>';
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-3"><i data-lucide="activity" class="w-5 h-5 text-rose-300"></i><h2 class="font-bold text-slate-100">Dynamic Weakness Ledger</h2></div>';
  const wk = Brain.weaknesses();
  if (!wk.length) h += '<div class="text-sm text-slate-400">No recurring weaknesses detected yet. Practice more so I can diagnose your patterns — mistakes are data!</div>';
  else wk.forEach(w=>{
    h += '<div class="mb-3 bg-slate-900/70 border border-slate-800 rounded-xl p-3"><div class="font-semibold text-rose-300 text-sm mb-1">'+esc(w.name)+'</div>'+
      '<div class="text-xs text-slate-400 mb-1"><b class="text-slate-300">Evidence:</b> '+esc(w.evidence)+'</div>'+
      '<div class="text-xs text-slate-400 mb-1"><b class="text-slate-300">What it means:</b> '+esc(w.meaning)+'</div>'+
      '<div class="text-xs text-slate-300 mb-2"><b>Teacher advice:</b> '+esc(w.advice)+'</div>'+
      '<button onclick="'+w.actionFn+'" class="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-2.5 py-1.5">'+esc(w.action)+'</button></div>';
  });
  h += '</div></div>';

  // mastery map
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="map" class="w-5 h-5 text-emerald-300"></i><h2 class="font-bold text-slate-100">Concept Mastery Map</h2></div>'+
       '<div class="text-xs text-slate-500 mb-4">Status updates from correctness + confidence + review performance. Self-assessed activities (oral practice, writing self-scores) can raise Learning but never mint Mastered.</div>';
  ['Grammar','Writing','Reading','Oral'].forEach(area=>{
    h += '<div class="mb-3"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">'+area+'</div><div class="flex flex-wrap gap-1.5">';
    Object.keys(CONCEPTS).filter(k=>CONCEPTS[k].area===area).forEach(k=>{
      const st = Brain.conceptStatus(k);
      const a = Brain.conceptAcc(k);
      h += '<span class="inline-flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 rounded-full pl-3 pr-1 py-1">'+esc(CONCEPTS[k].name)+(a!==null?' <span class="text-slate-500">'+a+'%</span>':'')+' '+statusBadge(st)+'</span>';
    });
    h += '</div></div>';
  });
  h += '</div>';

  // review due panel
  const upcoming = s.review.filter(x=>!x.mastered && x.due>Date.now()).length;
  const weakC = Brain.weakConcepts();
  const mastC = Object.keys(CONCEPTS).filter(k=>Brain.conceptStatus(k)==='Mastered');
  h += '<div class="grid md:grid-cols-4 gap-3">';
  h += dueCard('Due now / today', due, 'alarm-clock', due?'text-amber-300':'text-slate-400', "DC.go('review')");
  h += dueCard('Overdue', overdue, 'alarm-clock-off', overdue?'text-rose-300':'text-slate-400', "DC.go('review')");
  h += dueCard('Weak concepts', weakC.length, 'trending-down', weakC.length?'text-rose-300':'text-slate-400', "DC.go('learn')");
  h += dueCard('Mastered concepts', mastC.length, 'award', mastC.length?'text-emerald-300':'text-slate-400', "DC.go('review')");
  h += '</div>';
  h += '<div class="text-[11px] text-slate-600 text-center">'+upcoming+' more review item'+(upcoming===1?'':'s')+' scheduled for later. Spacing: 10 min → 1 day → 3 days → 7 days → mastered.</div>';
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
function progCard(title, p, icon, fn, sub){
  return '<button onclick="'+fn+'" class="card p-4 text-left hover:border-indigo-500/50 transition-colors"><div class="flex items-center gap-2 mb-2"><i data-lucide="'+icon+'" class="w-4 h-4 text-indigo-300"></i><span class="font-semibold text-sm text-slate-100">'+title+'</span><span class="ml-auto text-sm font-bold text-slate-200">'+p+'%</span></div>'+bar(p)+sub+'</button>';
}
function dueCard(label, n, icon, color, fn){
  return '<button onclick="'+fn+'" class="card p-4 text-left hover:border-indigo-500/50 transition-colors flex items-center gap-3"><i data-lucide="'+icon+'" class="w-6 h-6 '+color+'"></i><div><div class="text-xl font-extrabold '+color+'">'+n+'</div><div class="text-[10px] uppercase tracking-wider text-slate-500">'+label+'</div></div></button>';
}

/* =====================================================================
   LEARN MODE
   ===================================================================== */
DC.renderLearn = function(){
  const s = DC.state;
  let h = '<div class="space-y-4 fade-in">';
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="book-open" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Learn Mode — teach first, test after</h2></div>'+
       '<p class="text-sm text-slate-400">Each lesson teaches a rule with examples, sentence maps, contrast pairs, memory tricks and exam traps — then checks you with guided mini-practice. Finish a lesson before drilling it in the trainers.</p></div>';
  h += '<div class="grid md:grid-cols-2 gap-3">';
  LESSONS.forEach((l,i)=>{
    const done = (s.lessons[l.id]||{}).completed;
    h += '<button onclick="DC.openLesson(\''+l.id+'\')" class="card p-4 text-left hover:border-indigo-500/50 transition-colors flex items-start gap-3">'+
      '<div class="w-9 h-9 rounded-xl '+(done?'bg-emerald-500/15':'bg-indigo-500/15')+' flex items-center justify-center shrink-0"><i data-lucide="'+(done?'check':l.icon)+'" class="w-5 h-5 '+(done?'text-emerald-300':'text-indigo-300')+'"></i></div>'+
      '<div class="flex-1"><div class="font-semibold text-slate-100 text-sm">Lesson '+(i+1)+': '+esc(l.title)+'</div><div class="text-xs text-slate-400 mt-0.5">'+esc(l.subtitle)+'</div>'+
      '<div class="flex gap-1.5 mt-2 flex-wrap">'+l.concepts.map(c=>statusBadge(Brain.conceptStatus(c))).join('')+(done?'<span class="text-[10px] text-emerald-400 font-semibold ml-1">✓ completed</span>':'')+'</div></div></button>';
  });
  h += '</div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};

DC.openLesson = function(id){
  DC.view='learn';
  document.querySelectorAll('.nav-btn').forEach(el=>el.classList.toggle('active', el.dataset.nav==='learn'));
  const l = LESSONS.find(x=>x.id===id);
  const idx = LESSONS.indexOf(l);
  DC.lessonMini = { done:0, need:l.mini.length, id };
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<button onclick="DC.go(\'learn\')" class="text-sm text-slate-400 hover:text-slate-200 flex items-center gap-1"><i data-lucide="arrow-left" class="w-4 h-4"></i>All lessons</button>';
  h += '<div class="card p-6"><div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center"><i data-lucide="'+l.icon+'" class="w-5 h-5 text-indigo-300"></i></div><div><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">Lesson '+(idx+1)+' · Teach</div><h2 class="font-bold text-lg text-slate-100">'+esc(l.title)+'</h2><div class="text-xs text-slate-400">'+esc(l.subtitle)+'</div></div></div>'+
       '<p class="text-sm text-slate-300 leading-relaxed">'+l.explain+'</p></div>';
  // examples
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-3"><i data-lucide="quote" class="w-4 h-4 text-emerald-300"></i><h3 class="font-bold text-slate-100 text-sm">Demonstrate — Danish examples</h3></div><div class="space-y-2">';
  l.examples.forEach(e=> h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2"><div class="font-medium text-slate-100 flex items-center justify-between gap-2"><span>'+esc(e.da)+'</span>'+DC.spk(e.da)+'</div><div class="text-xs text-slate-400">'+esc(e.en)+'</div></div>');
  h += '</div></div>';
  // sentence maps
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-3"><i data-lucide="table" class="w-4 h-4 text-sky-300"></i><h3 class="font-bold text-slate-100 text-sm">Visual sentence map</h3></div><div class="space-y-4">';
  l.maps.forEach(m=> h += '<div>'+deconHTML(m)+'<div class="text-xs text-indigo-300 mt-1">'+esc(m.note)+'</div></div>');
  h += '</div></div>';
  // mistakes + contrasts
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-3"><i data-lucide="x-octagon" class="w-4 h-4 text-rose-300"></i><h3 class="font-bold text-slate-100 text-sm">Common learner mistakes</h3></div><ul class="space-y-1.5 text-sm text-slate-300 list-disc list-inside">';
  l.mistakes.forEach(m=> h += '<li>'+esc(m)+'</li>');
  h += '</ul><div class="mt-4 space-y-3">';
  l.contrasts.forEach(c=>{
    h += '<div class="grid md:grid-cols-2 gap-2"><div class="bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2 text-sm"><span class="text-rose-300 font-bold">✗</span> '+esc(c.bad)+'</div>'+
         '<div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm"><span class="text-emerald-300 font-bold">✓</span> '+esc(c.good)+'</div></div>'+
         '<div class="text-xs text-slate-400 -mt-1 mb-1 px-1">'+esc(c.why)+'</div>';
  });
  h += '</div></div>';
  // trick + trap
  h += '<div class="grid md:grid-cols-2 gap-3">'+
    '<div class="card p-4 !border-indigo-500/40"><div class="flex items-center gap-2 mb-2"><i data-lucide="sparkles" class="w-4 h-4 text-indigo-300"></i><span class="font-bold text-sm text-indigo-200">Memory trick</span></div><p class="text-sm text-slate-300">'+esc(l.trick)+'</p></div>'+
    '<div class="card p-4 !border-amber-500/40"><div class="flex items-center gap-2 mb-2"><i data-lucide="alert-triangle" class="w-4 h-4 text-amber-300"></i><span class="font-bold text-sm text-amber-200">Exam trap</span></div><p class="text-sm text-slate-300">'+esc(l.trap)+'</p></div></div>';
  // say it aloud
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-2"><i data-lucide="volume-2" class="w-4 h-4 text-emerald-300"></i><h3 class="font-bold text-slate-100 text-sm">Say it aloud — 4 drills</h3></div>'+
       '<p class="text-xs text-slate-400 mb-3">Read each line OUT LOUD three times. Your mouth learns word order faster than your eyes.</p><div class="flex flex-wrap gap-2">';
  l.drill.forEach(d=> h += '<span class="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-medium">'+esc(d)+'</span>');
  h += '</div></div>';
  // mini practice
  h += '<div class="card p-5 !border-indigo-500/30"><div class="flex items-center gap-2 mb-1"><i data-lucide="pencil-ruler" class="w-4 h-4 text-indigo-300"></i><h3 class="font-bold text-slate-100 text-sm">Guided mini-practice</h3></div>'+
       '<p class="text-xs text-slate-400 mb-4">Apply the rule right away. Wrong answers go to your Error Notebook and Review Queue automatically.</p>';
  l.mini.forEach((q,i)=>{ h += '<div class="mb-5 pb-5 '+(i<l.mini.length-1?'border-b border-slate-800':'')+'" id="lm-'+q.qid+'"></div>'; });
  h += '</div>';
  // recap + complete
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-2"><i data-lucide="list-checks" class="w-4 h-4 text-emerald-300"></i><h3 class="font-bold text-slate-100 text-sm">Quick recap</h3></div><ul class="space-y-1.5 text-sm text-slate-300 list-disc list-inside">';
  l.recap.forEach(x=> h += '<li>'+esc(x)+'</li>');
  h += '</ul><div class="flex flex-wrap gap-2 mt-4">'+
    '<button id="lesson-complete-btn" onclick="DC.completeLesson(\''+l.id+'\')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold disabled:opacity-40" '+((DC.state.lessons[l.id]||{}).completed?'':'disabled')+'>'+((DC.state.lessons[l.id]||{}).completed?'✓ Lesson completed':'Mark lesson complete')+'</button>'+
    '<button onclick="'+l.practice.fn+'" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">'+esc(l.practice.label)+' →</button></div>'+
    '<div id="lesson-complete-note" class="text-xs text-slate-500 mt-2">'+((DC.state.lessons[l.id]||{}).completed?'':'Answer both mini-practice questions to unlock completion.')+'</div></div>';
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  l.mini.forEach(q=>{
    DC.qStart('lm-'+q.qid, q, { module:'Learn Mode', opgave:'Lesson '+(idx+1), qid:q.qid,
      onDone: function(){ DC.lessonMini.done++; if (DC.lessonMini.done>=DC.lessonMini.need){
        const btn=document.getElementById('lesson-complete-btn'); if(btn) btn.disabled=false;
        const n=document.getElementById('lesson-complete-note'); if(n) n.textContent='Mini-practice done — you can mark the lesson complete.';
      }}});
  });
  DC.icons();
};
DC.completeLesson = function(id){
  DC.state.lessons[id] = { completed:true, ts:Date.now() };
  DC.save();
  DC.toast('Lesson completed! Now drill it — practice answers are what move your readiness score.','ok');
  DC.openLesson(id);
};

/* =====================================================================
   GRAMMAR TRAINER
   ===================================================================== */
DC.renderGrammar = function(){
  const s = DC.state;
  const doneN = Object.keys(s.grammarDone).length;
  const okN = GRAMMAR_QUESTIONS.filter(q=>s.grammarDone[q.id]&&s.grammarDone[q.id].correct).length;
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="puzzle" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Grammar Trainer — '+GRAMMAR_QUESTIONS.length+' exam-grade questions</h2></div>'+
       '<p class="text-sm text-slate-400 mb-3">V2, inversion, central adverbs, SAV after fordi/at/hvis/når/selvom, modals. Use hints in stages, rate your confidence, and let the Teacher Brain do the bookkeeping.</p>'+
       '<div class="flex items-center gap-3">'+bar(pct(okN,GRAMMAR_QUESTIONS.length),'bg-emerald-500')+'<span class="text-xs text-slate-400 shrink-0">'+okN+'/'+GRAMMAR_QUESTIONS.length+' correct · '+doneN+'/'+GRAMMAR_QUESTIONS.length+' attempted</span></div></div>';
  h += '<div class="card p-4"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Question navigator</div><div class="flex flex-wrap gap-1.5">';
  GRAMMAR_QUESTIONS.forEach((q,i)=>{
    const d = s.grammarDone[q.id];
    const cls = !d ? 'bg-slate-800 text-slate-300 border-slate-700' : d.correct ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    h += '<button onclick="DC.grammarQ('+i+')" class="w-9 h-9 rounded-lg border text-sm font-bold '+cls+' '+(DC.gIdx===i?'ring-2 ring-indigo-400':'')+'">'+(i+1)+'</button>';
  });
  h += '</div></div>';
  h += '<div class="card p-5" id="grammar-q"></div>';
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  if (DC.gIdx===undefined || DC.gIdx===null) DC.gIdx = Math.max(0, GRAMMAR_QUESTIONS.findIndex(q=>!s.grammarDone[q.id]));
  DC.grammarQ(DC.gIdx===-1?0:DC.gIdx);
};
DC.grammarQ = function(i){
  DC.gIdx = i;
  const q = GRAMMAR_QUESTIONS[i];
  const s = DC.state;
  document.querySelectorAll('#main .w-9.h-9').forEach((el,j)=>el.classList.toggle('ring-2',j===i));
  const head = '<div class="flex items-center justify-between mb-3"><div class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Question '+(i+1)+' of '+GRAMMAR_QUESTIONS.length+'</div>'+
    (s.grammarDone[q.id]?'<span class="text-[10px] '+(s.grammarDone[q.id].correct?'text-emerald-400':'text-rose-400')+' font-semibold">answered before — try again for mastery</span>':'')+'</div>';
  document.getElementById('grammar-q').innerHTML = head + '<div id="gq-box"></div><div id="gq-next" class="mt-4"></div>';
  DC.qStart('gq-box', q, { module:'Grammar', opgave:'Trainer', qid:q.id,
    onDone: function(sess){
      const prev = s.grammarDone[q.id]||{attempts:0};
      s.grammarDone[q.id] = { correct: sess.ok, confidence: sess.conf, ts: Date.now(), attempts: prev.attempts+1 };
      DC.save();
      let nx = '<div class="flex gap-2 flex-wrap">';
      if (i<GRAMMAR_QUESTIONS.length-1) nx += '<button onclick="DC.grammarQ('+(i+1)+')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Next question →</button>';
      else nx += '<button onclick="DC.renderGrammar()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Finish — back to overview</button>';
      if (!sess.ok) nx += '<button onclick="DC.grammarQ('+i+')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Retry now</button>';
      nx += '<button onclick="DC.go(\'review\')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Review queue</button></div>';
      document.getElementById('gq-next').innerHTML = nx;
      DC.icons();
      // refresh navigator colors
      const navBtns = document.querySelectorAll('#main .w-9.h-9');
      const d = s.grammarDone[q.id];
      if (navBtns[i]){ navBtns[i].className = 'w-9 h-9 rounded-lg border text-sm font-bold ring-2 ring-indigo-400 '+(d.correct?'bg-emerald-500/20 text-emerald-300 border-emerald-500/40':'bg-rose-500/20 text-rose-300 border-rose-500/40'); }
    }});
};

/* =====================================================================
   READING SIMULATOR (Læsning)
   ===================================================================== */
DC.readingTab = function(tab){ DC.sub.reading = tab; DC.renderReading(); };
DC.renderReading = function(){
  const tab = DC.sub.reading || 'strategy';
  const tabs = [['strategy','Strategy','compass'],['cloze','Opgave 1 · Cloze','text-cursor-input'],['chat','Opgave 2A · Chat','messages-square'],['skim','Opgave 2B · Skim','zap'],['o3','Opgave 3 · Indsæt','between-horizontal-start'],['o4','Opgave 4 · Match','users'],['reflect','Reflection','sparkles']];
  let h = '<div class="space-y-4 fade-in">';
  h += '<div class="card p-4"><div class="flex items-center gap-2 mb-3"><i data-lucide="file-search" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Reading Simulator — official SIRI Modul 3.3 formats</h2><span class="ml-auto text-[11px] text-slate-500 hidden md:block">Real test: 50 minutes, all tasks, no aids</span></div><div class="flex gap-1.5 flex-wrap wrap-tabs">';
  tabs.forEach(t=> h += '<button onclick="DC.readingTab(\''+t[0]+'\')" class="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 '+(tab===t[0]?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200')+'"><i data-lucide="'+t[2]+'" class="w-3.5 h-3.5"></i>'+t[1]+'</button>');
  h += '</div></div><div id="reading-body"></div></div>';
  document.getElementById('main').innerHTML = h;
  ({strategy:DC.rdStrategy, cloze:DC.rdCloze, chat:DC.rdChat, skim:DC.rdSkim, o3:DC.rdO3, o4:DC.rdO4, reflect:DC.rdReflect}[tab])();
  DC.icons();
};

DC.rdStrategy = function(){
  let h = '<div class="space-y-3">';
  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-1">Reading Strategy Lesson</h3><p class="text-sm text-slate-400 mb-4">Six habits that win reading points. Learn them here, then apply them in the simulators — the post-task reflection will ask if you actually used them.</p><div class="grid md:grid-cols-2 gap-3">';
  READING.strategy.points.forEach(p=> h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex gap-3"><i data-lucide="'+p.icon+'" class="w-5 h-5 text-indigo-300 shrink-0 mt-0.5"></i><div><div class="font-semibold text-sm text-slate-100">'+esc(p.t)+'</div><div class="text-xs text-slate-400 mt-0.5">'+esc(p.d)+'</div></div></div>');
  h += '</div></div>';
  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-2 text-sm">What the real test looks like (per the official SIRI materials)</h3><ul class="text-sm text-slate-300 space-y-1.5 list-disc list-inside">'+
    '<li><b>Opgave 1:</b> cloze — insert missing words in a text (careful local reading).</li>'+
    '<li><b>Opgave 2A + 2B:</b> a chat between two people where one person’s replies are removed — match the replies (three are never used).</li>'+
    '<li><b>Opgave 3:</b> a text in five paragraphs; in each paragraph one sentence is missing — choose from four options.</li>'+
    '<li><b>Opgave 4:</b> three short texts + seven questions — find the person who matches each question.</li></ul>'+
    '<div class="text-xs text-slate-500 mt-2">You get 50 minutes for everything and may not use a dictionary. All simulators below mirror these formats exactly.</div></div>';
  h += '</div>';
  document.getElementById('reading-body').innerHTML = h;
};

/* ---------- confidence + recording pipeline for reading tasks ---------- */
DC.readingAskConf = function(boxId){
  let h = '<div class="card !border-indigo-500/40 p-4 fade-in mt-4"><div class="text-sm font-semibold text-slate-100 mb-2">How sure were you overall?</div><div class="conf-grid flex flex-wrap gap-2">';
  CONF_LEVELS.forEach(c=> h += '<button onclick="DC.readingFinish(\''+c.id+'\')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600/40 border border-slate-700 text-sm flex items-center gap-2"><i data-lucide="'+c.icon+'" class="w-4 h-4"></i>'+c.label+'</button>');
  h += '</div></div>';
  document.getElementById(boxId).innerHTML = h;
  DC.icons();
};
DC.readingFinish = function(conf){
  const p = DC.pendingReading; if (!p) return;
  p.items.forEach(it=>{
    Brain.record({ module:'Reading', opgave:p.opgave, concept:it.concept, qid:it.qid,
      question:it.question, userAnswer:it.userAnswer, correctAnswer:it.correctAnswer,
      mistakeType: it.ok?null:(it.mistakeType||'Wrong choice'), explanation:it.explanation,
      memoryTrick:it.trick||'', correct:it.ok, confidence:conf,
      hintsUsed:0, timeSpent:Math.round(p.time/p.items.length), snapshot:it.snapshot });
  });
  const sc = p.items.filter(i=>i.ok).length, tot = p.items.length;
  DC.state.reading[p.store] = DC.state.reading[p.store]||{};
  DC.state.reading[p.store][p.taskKey] = { score:sc, total:tot, ts:Date.now() };
  DC.save();
  const wrong = tot-sc;
  let msg;
  if (wrong===0) msg = 'Full score on '+p.opgave+'! '+(conf==='confident'?'Strong and sure — this Opgave type is in good shape.':'All correct — now we work on making you FEEL as sure as you are.');
  else msg = sc+'/'+tot+' on '+p.opgave+'. The '+wrong+' miss'+(wrong>1?'es are':' is')+' now in your Error Notebook with explanations, and scheduled for review.';
  DC.toast(msg, wrong===0?'ok':'warn');
  document.getElementById(p.confBox).innerHTML = '<div class="card p-4 mt-4 text-sm text-slate-300 flex items-start gap-2"><i data-lucide="graduation-cap" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i><span>'+msg+' Scroll up to read the explanation under every item — the WHY is where the learning happens.</span></div>';
  DC.pendingReading = null;
  DC.icons(); DC.renderHeader();
};

function stringAroundGap(c, gi){
  let out=''; c.parts.forEach((p,idx)=>{
    if (typeof p==='string') out+=p;
    else out += (p.g===gi?' [___] ':' '+c.gaps[p.g].correct+' ');
  });
  const pos = out.indexOf('[___]');
  return out.slice(Math.max(0,pos-60), pos+65);
}

/* ---------- Opgave 2A: chat matching ---------- */
DC.rdChat = function(){
  const which = DC.sub.chat || 'chat1';
  const base = READING.chats.find(x=>x.id===which);
  /* relabel option letters per attempt so 'gap 2 = B' can't be memorised — content unchanged */
  const newLetters = shuffle(base.options.map(o=>o.letter));
  const map = {}; base.options.forEach((o,i)=>{ map[o.letter] = newLetters[i]; });
  const task = Object.assign({}, base, {
    options: base.options.map(o=>Object.assign({}, o, { letter: map[o.letter] })).sort((a,b)=>a.letter.localeCompare(b.letter)),
    turns: base.turns.map(t=>Object.assign({}, t, { correct: map[t.correct] }))
  });
  DC.curChat = task;
  let h = '<div class="max-w-3xl space-y-3">';
  h += '<div class="flex gap-2">';
  READING.chats.forEach(c=> h += '<button onclick="DC.sub.chat=\''+c.id+'\';DC.rdChat();DC.icons()" class="px-3 py-1.5 rounded-lg text-xs font-semibold border '+(which===c.id?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400')+'">'+esc(c.title)+'</button>');
  h += '<div class="ml-auto flex items-center gap-2 text-sm"><i data-lucide="timer" class="w-4 h-4 text-amber-300"></i><span id="chat-timer" class="font-mono font-bold text-amber-300">5:00</span><button onclick="DC.startTimer(\'chat\',300,\'chat-timer\',function(){DC.toast(\'Time! On the real test you would move on now.\',\'warn\')})" class="text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-2 py-1">Start 5 min</button></div></div>';
  const prev = (DC.state.reading.chat||{})[task.id];
  h += '<div class="card p-5"><div class="flex items-center justify-between flex-wrap gap-2"><h3 class="font-bold text-slate-100">'+task.opgave+': '+esc(task.title)+'</h3>'+(prev?'<span class="text-xs text-slate-500">last: '+prev.score+'/'+prev.total+'</span>':'')+'</div>';
  h += '<p class="text-xs text-slate-400 mt-1 mb-4 bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-2"><b>'+esc(task.situation)+'</b><br>'+esc(task.instruction)+'</p>';
  h += '<div class="grid lg:grid-cols-5 gap-4"><div class="lg:col-span-3 space-y-3">';
  // example
  h += chatBubble(task.personX, task.example.x, false);
  h += '<div class="flex items-start gap-2 justify-end"><div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl rounded-tr-sm px-3 py-2 text-sm max-w-[85%]"><div class="text-[10px] uppercase font-bold text-emerald-300 mb-0.5">'+esc(task.personY)+' · eksempel (0) = Z</div>'+esc(task.example.reply)+'</div></div>';
  task.turns.forEach((t,i)=>{
    h += chatBubble(task.personX, t.x, false);
    h += '<div class="flex justify-end"><div class="bg-slate-800/80 border border-slate-700 rounded-2xl rounded-tr-sm px-3 py-2 text-sm w-[85%]"><div class="text-[10px] uppercase font-bold text-slate-400 mb-1">'+esc(task.personY)+' · svar '+(i+1)+'</div>'+
      '<select id="chg-'+i+'" class="gapsel w-full"><option value="">— vælg svar (A–'+task.options[task.options.length-1].letter+') —</option>'+task.options.map(o=>'<option value="'+o.letter+'">'+o.letter+': '+esc(o.text.length>60?o.text.slice(0,60)+'…':o.text)+'</option>').join('')+'</select>'+
      '<div id="chg-fb-'+i+'" class="mt-1"></div></div></div>';
  });
  h += '</div><div class="lg:col-span-2"><div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 sticky top-24"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Svar A–'+task.options[task.options.length-1].letter+' ('+(task.options.length-task.turns.length)+' skal ikke bruges)</div><div class="space-y-2">';
  task.options.forEach(o=> h += '<div class="text-xs bg-slate-800/70 border border-slate-700 rounded-lg px-2.5 py-2"><b class="text-indigo-300">'+o.letter+':</b> '+esc(o.text)+'</div>');
  h += '</div></div></div></div>';
  h += '<button onclick="DC.chatCheck(\''+task.id+'\')" class="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Check answers</button><div id="chat-conf"></div></div></div>';
  document.getElementById('reading-body').innerHTML = h;
  DC.rdStartTs = Date.now();
};
function chatBubble(name, text, right){
  return '<div class="flex items-start gap-2"><div class="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-3 py-2 text-sm max-w-[85%]"><div class="text-[10px] uppercase font-bold text-sky-300 mb-0.5">'+esc(name)+'</div>'+esc(text)+'</div></div>';
}
DC.chatCheck = function(id){
  const task = (DC.curChat && DC.curChat.id===id) ? DC.curChat : READING.chats.find(x=>x.id===id);
  for (let i=0;i<task.turns.length;i++){ if(!document.getElementById('chg-'+i).value){ DC.toast('Choose a reply for every gap first.','warn'); return; } }
  DC.stopTimer('chat');
  const items = [];
  const used = {};
  task.turns.forEach((t,i)=>{
    const sel = document.getElementById('chg-'+i);
    const chosen = sel.value; used[chosen]=true;
    const ok = chosen===t.correct;
    sel.classList.add(ok?'opt-correct':'opt-wrong'); sel.disabled=true;
    const chosenOpt = task.options.find(o=>o.letter===chosen);
    const fb = document.getElementById('chg-fb-'+i);
    fb.innerHTML = '<div class="text-xs mt-1 rounded-lg px-2 py-1.5 '+(ok?'bg-emerald-500/10 text-emerald-200':'bg-rose-500/10 text-rose-200')+'">'+(ok?'✓ ':'✗ Correct: <b>'+t.correct+'</b>. ')+esc(t.why)+(!ok&&chosenOpt&&chosenOpt.distractorWhy?'<br><b>Why '+chosen+' fails:</b> '+esc(chosenOpt.distractorWhy):'')+'</div>';
    const distractors = task.options.filter(o=>o.letter!==t.correct && o.distractorWhy).slice(0,3);
    items.push({ concept:task.concept, qid:task.id+'-g'+i,
      question:'Chat "'+task.title+'": reply to "'+t.x+'"',
      userAnswer: chosen+': '+(chosenOpt?chosenOpt.text:''), correctAnswer: t.correct+': '+task.options.find(o=>o.letter===t.correct).text,
      ok, mistakeType:'Reply does not fit the dialogue flow', explanation:t.why,
      snapshot:{ kind:'mc', tag:'Opgave 2A · Chat', prompt:esc(task.personX)+' writes: "'+t.x+'" — choose '+esc(task.personY)+'’s reply:',
        options: shuffle([{text:task.options.find(o=>o.letter===t.correct).text, ok:true, why:t.why}].concat(distractors.map(d=>({text:d.text, ok:false, mistakeType:'Does not fit the flow', why:d.distractorWhy})))),
        explanation:t.why, concept:task.concept } });
  });
  DC.pendingReading = { items, opgave:'Opgave 2A', store:'chat', taskKey:task.id, time:Math.round((Date.now()-DC.rdStartTs)/1000), confBox:'chat-conf' };
  DC.readingAskConf('chat-conf');
};

/* ---------- reflection ---------- */
DC.rdReflect = function(){
  const refl = DC.state.reading.reflections||{};
  let h = '<div class="card p-5 max-w-2xl"><h3 class="font-bold text-slate-100 mb-1">Post-reading reflection</h3><p class="text-xs text-slate-400 mb-4">Honest answers train your strategy. The Teacher Brain uses this to tune your study plan.</p><div class="space-y-3">';
  READING.reflection.forEach(q=>{
    const v = refl[q.id];
    h += '<div class="flex items-center gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5"><span class="text-sm flex-1">'+esc(q.q)+'</span>'+
      '<button onclick="DC.reflSet(\''+q.id+'\',true)" class="px-3 py-1.5 rounded-lg text-xs font-bold border '+(v===true?'bg-emerald-500/20 border-emerald-500/40 text-emerald-300':'bg-slate-800 border-slate-700 text-slate-400')+'">Yes</button>'+
      '<button onclick="DC.reflSet(\''+q.id+'\',false)" class="px-3 py-1.5 rounded-lg text-xs font-bold border '+(v===false?'bg-rose-500/20 border-rose-500/40 text-rose-300':'bg-slate-800 border-slate-700 text-slate-400')+'">No</button></div>';
  });
  h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5"><div class="text-sm mb-2">Which Opgave type felt hardest?</div><div class="flex gap-2 flex-wrap">';
  [['r-2a','2A · Chat'],['r-3','Opgave 3'],['r-4','Opgave 4'],['cloze','Opgave 1']].forEach(o=>{
    h += '<button onclick="DC.reflSet(\'hardest\',\''+o[0]+'\')" class="px-3 py-1.5 rounded-lg text-xs font-bold border '+(refl.hardest===o[0]?'bg-indigo-500/20 border-indigo-500/40 text-indigo-300':'bg-slate-800 border-slate-700 text-slate-400')+'">'+o[1]+'</button>';
  });
  h += '</div></div></div><div id="refl-advice" class="mt-4">'+DC.reflAdvice()+'</div></div>';
  document.getElementById('reading-body').innerHTML = h;
};
DC.reflSet = function(id, v){
  DC.state.reading.reflections = DC.state.reading.reflections||{};
  DC.state.reading.reflections[id] = v;
  DC.save(); DC.rdReflect(); DC.icons();
};
DC.reflAdvice = function(){
  const r = DC.state.reading.reflections||{};
  const tips = [];
  if (r.qfirst===false) tips.push('You read the text before the questions. Flip it: questions first means you read with a purpose and find answers twice as fast.');
  if (r.scan===false) tips.push('Train scanning: give yourself 30 seconds to find every name and number in a text before reading it properly.');
  if (r.translate===true) tips.push('You translate too much. Next practice: underline only the words you NEED for the questions and ignore the rest.');
  if (r.pronoun===false) tips.push('Pronoun-checking is the single best Opgave 3 habit: every det/den/de must have an owner.');
  if (r.hardest){ const nm={'r-2a':'Opgave 2A','r-3':'Opgave 3','r-4':'Opgave 4','cloze':'Opgave 1'}[r.hardest]; tips.push(nm+' feels hardest — your study plan will now prioritise it. Do it FIRST in each session, while you are fresh.'); }
  if (!tips.length) return '<div class="text-sm text-slate-400">Answer the questions above and I will turn your habits into advice.</div>';
  return '<div class="card !border-indigo-500/30 p-4 space-y-2">'+tips.map(t=>'<div class="flex items-start gap-2 text-sm"><i data-lucide="graduation-cap" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i><span>'+esc(t)+'</span></div>').join('')+'</div>';
};

/* =====================================================================
   WRITING LAB (Skrivning)
   ===================================================================== */
DC.renderWriting = function(){
  const taskId = DC.sub.writing || 'w1a';
  const t = WRITING.tasks.find(x=>x.id===taskId);
  const s = DC.state;
  const draft = s.writing.drafts[taskId] || { plan:'', draft:'', final:'' };
  const checks = s.writing.checks[taskId] || WRITING.checklist.map(()=>false);
  const completed = s.writing.completed[taskId];

  let h = '<div class="space-y-4 fade-in">';
  h += '<div class="card p-4"><div class="flex items-center gap-2 mb-3"><i data-lucide="pen-line" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Writing Lab — official SIRI task formats</h2></div><div class="flex gap-1.5 flex-wrap">';
  WRITING.tasks.forEach(x=>{
    const done = s.writing.completed[x.id];
    h += '<button onclick="DC.sub.writing=\''+x.id+'\';DC.renderWriting()" class="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 '+(taskId===x.id?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200')+'">'+(done?'<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i>':'')+x.opgave+': '+esc(x.title)+'</button>';
  });
  h += '</div></div>';

  h += '<div class="grid lg:grid-cols-2 gap-4 items-start">';
  /* ---------- LEFT: teaching pane ---------- */
  h += '<div class="space-y-3">';
  h += '<div class="card p-5"><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">'+t.opgave+' · '+(t.opgave==='Opgave 1'?'Halvformel henvendelse':'E-mail')+'</div>'+
       '<h3 class="font-bold text-slate-100 mb-2">'+esc(t.title)+'</h3>'+
       '<div class="text-sm text-slate-300 mb-2"><b class="text-slate-100">Situation:</b> '+esc(t.situation)+'</div>';
  if (t.email) h += '<div class="bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 whitespace-pre-line mb-2 font-mono text-[13px]">'+esc(t.email)+'</div>';
  h += '<div class="text-sm text-slate-300"><b class="text-slate-100">Opgave:</b> '+esc(t.taskIntro)+'</div><ul class="mt-1 space-y-1">';
  t.bullets.forEach(b=> h += '<li class="text-sm text-slate-200 flex items-start gap-2"><i data-lucide="square-check" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i>'+esc(b)+'</li>');
  h += '</ul><div class="text-xs text-amber-300/90 mt-3 flex items-center gap-1.5"><i data-lucide="ruler" class="w-3.5 h-3.5"></i>Length: '+(t.opgave==='Opgave 1'?'100–200 words':'minimum 90 words')+'</div></div>';

  h += accHTML('Recommended structure', '<ol class="space-y-1.5 list-decimal list-inside">'+t.structure.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>', 'list-ordered', true);
  h += accHTML('Planning guide', '<p>'+esc(t.planning)+'</p><p class="mt-2 text-xs text-slate-400">Write your own plan in the planning box on the right — one line per bullet. Five minutes of planning saves fifteen minutes of rewriting.</p>', 'pencil-ruler', false);

  let pb = '<p class="text-xs text-slate-400 mb-3">Click a phrase to insert it into whichever box you last clicked in (planning, draft or final).</p>';
  WRITING.phrases.forEach((g,gi)=>{
    pb += '<div class="mb-3"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 flex items-center gap-1.5"><i data-lucide="'+g.icon+'" class="w-3.5 h-3.5"></i>'+g.cat+'</div><div class="flex flex-wrap gap-1.5">';
    g.items.forEach((p,pi)=> pb += '<button onclick="DC.insertPhrase('+gi+','+pi+')" class="chip text-xs bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 rounded-lg px-2.5 py-1.5 text-left">'+esc(p)+'</button>');
    pb += '</div></div>';
  });
  h += accHTML('Formal & semi-formal phrase bank', pb, 'library', false);
  h += accHTML('Connector bank', '<div class="flex flex-wrap gap-1.5">'+WRITING.connectors.map(c=>'<span class="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5"><b class="text-indigo-300">'+esc(c.w)+'</b> <span class="text-slate-500">'+esc(c.e)+'</span></span>').join('')+'</div><p class="text-xs text-amber-300/80 mt-2">Remember: derfor/desuden/bagefter first in a sentence → inversion. fordi/hvis/når/selvom → SAV.</p>', 'link-2', false);
  h += accHTML('Model answer — passing level', '<div class="bg-slate-900/80 border border-slate-700 rounded-xl p-3 whitespace-pre-line font-mono text-[13px] text-slate-200">'+esc(t.modelPassing)+'</div><div class="text-xs text-slate-500 mt-2">'+wordCount(t.modelPassing)+' words. Covers every bullet simply and correctly — this passes.</div>', 'file-check', false);
  h += accHTML('Model answer — strong level', '<div class="bg-slate-900/80 border border-emerald-700/50 rounded-xl p-3 whitespace-pre-line font-mono text-[13px] text-slate-200">'+esc(t.modelStrong)+'</div><div class="text-xs text-slate-500 mt-2">'+wordCount(t.modelStrong)+' words.</div>', 'file-badge', false);
  h += accHTML('Why the strong answer is better', '<ul class="space-y-1.5 list-disc list-inside">'+t.whyBetter.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>', 'trending-up', false);
  h += accHTML('Common mistakes to avoid', '<ul class="space-y-1.5 list-disc list-inside">'+t.commonMistakes.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>', 'x-octagon', false);
  h += '</div>';

  /* ---------- RIGHT: workspace ---------- */
  h += '<div class="space-y-3">';
  const left = s.writing.timerLeft;
  const wTotal = s.writing.timerTotal || 2700;
  h += '<div id="w-timer-card" class="card p-4 flex items-center gap-3 flex-wrap"><i data-lucide="timer" class="w-5 h-5 text-amber-300"></i><div><div class="text-[10px] uppercase tracking-wider text-slate-500">Exam simulation</div><div id="writing-timer" class="font-mono font-bold text-amber-300 text-lg">'+fmtTime(left!=null?left:wTotal)+'</div></div>'+
    '<div class="ml-auto flex gap-2">'+
    (left!=null&&left>0
      ? '<button onclick="DC.writingTimerStart()" class="text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2">Resume</button>'
      : '<button onclick="DC.writingTimerStart(1200)" class="text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2">Warm-up · 20 min</button>'+
        '<button onclick="DC.writingTimerStart(2700)" class="text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2">Full task · 45 min (real budget)</button>')+
    '<button onclick="DC.stopTimer(\'writing\');DC.state.writing.timerLeft=null;DC.save();DC.renderWriting()" class="text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2">Reset</button></div></div>';

  h += '<div class="card p-4"><div class="flex items-center justify-between mb-2"><label class="text-xs font-bold uppercase tracking-wider text-slate-400">1 · Planning box</label><span class="text-[10px] text-slate-600">one line per bullet</span></div>'+
       '<textarea id="w-plan" lang="da" spellcheck="true" onfocus="DC.wFocus=\'w-plan\'" oninput="DC.wAutosave(\''+taskId+'\')" rows="4" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none" placeholder="1) …&#10;2) …&#10;3) …&#10;4) …">'+esc(draft.plan)+'</textarea></div>';
  h += '<div class="card p-4"><div class="flex items-center justify-between mb-2"><label class="text-xs font-bold uppercase tracking-wider text-slate-400">2 · Draft</label><span class="text-[10px] text-slate-500"><span id="w-draft-count">'+wordCount(draft.draft)+'</span> words</span></div>'+
       '<textarea id="w-draft" lang="da" spellcheck="true" onfocus="DC.wFocus=\'w-draft\'" oninput="DC.wAutosave(\''+taskId+'\');DC.wCount()" rows="9" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none" placeholder="Write freely here — structure beats perfection in the draft.">'+esc(draft.draft)+'</textarea></div>';
  h += '<div class="card p-4 !border-indigo-500/30"><div class="flex items-center justify-between mb-2"><label class="text-xs font-bold uppercase tracking-wider text-indigo-300">3 · Final answer</label><span class="text-[10px]" id="w-final-len"></span></div>'+
       '<textarea id="w-final" lang="da" spellcheck="true" onfocus="DC.wFocus=\'w-final\'" oninput="DC.wAutosave(\''+taskId+'\');DC.wCount()" rows="9" class="w-full bg-slate-900 border border-indigo-500/30 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none" placeholder="Copy your corrected text here. This is what you would hand in.">'+esc(draft.final)+'</textarea>'+
       '<div class="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5"><i data-lucide="save" class="w-3.5 h-3.5"></i><span id="w-save-note">Saved automatically in this browser.</span></div></div>';

  h += '<div class="card p-4"><div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">4 · Self-correction checklist</div><div class="space-y-1.5">';
  WRITING.checklist.forEach((c,i)=>{
    h += '<label class="flex items-start gap-2.5 text-sm text-slate-300 cursor-pointer bg-slate-900/60 rounded-lg px-2.5 py-2 hover:bg-slate-900"><input type="checkbox" onchange="DC.wCheck(\''+taskId+'\','+i+',this.checked)" '+(checks[i]?'checked':'')+' class="mt-0.5 accent-indigo-500">'+esc(c)+'</label>';
  });
  h += '</div></div>';
  h += '<div id="w-actions" class="card p-4 flex flex-wrap gap-2 items-center">'+
    '<button onclick="DC.wComplete(\''+taskId+'\')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold">'+(completed?'✓ Completed — submit again':'Finish & self-assess')+'</button>'+
    '<button onclick="DC.wClear(\''+taskId+'\')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-600/40 text-sm">Clear draft</button>'+
    (completed?'<span class="text-xs text-emerald-400">Completed '+ago(completed.ts)+' · '+completed.words+' words</span>':'')+
    '</div>';
  h += '</div></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.wCount();
  DC.icons();
};
DC.writingTimerStart = function(seconds){
  const left = DC.state.writing.timerLeft;
  const total = (left!=null && left>0) ? (DC.state.writing.timerTotal||2700) : (seconds||2700);
  DC.state.writing.timerTotal = total;
  DC.startTimer('writing', (left!=null&&left>0)?left:total, 'writing-timer', function(){
    DC.state.writing.timerLeft = null; DC.save();
    DC.toast(Math.round(total/60)+' minutes are up — pens down! Read your text once more for V2 and SAV before "handing in".','warn');
  });
};
DC.wAutosave = function(taskId){
  clearTimeout(DC._wsT);
  DC._wsT = setTimeout(function(){
    DC.state.writing.drafts[taskId] = {
      plan: (document.getElementById('w-plan')||{}).value||'',
      draft: (document.getElementById('w-draft')||{}).value||'',
      final: (document.getElementById('w-final')||{}).value||''
    };
    DC.save();
    const n = document.getElementById('w-save-note'); if (n) n.textContent = 'Saved '+new Date().toLocaleTimeString('da-DK',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }, 500);
};
DC.wCount = function(){
  const t = WRITING.tasks.find(x=>x.id===(DC.sub.writing||'w1a'));
  const d = document.getElementById('w-draft'), f = document.getElementById('w-final');
  if (d) document.getElementById('w-draft-count').textContent = wordCount(d.value);
  if (f){
    const n = wordCount(f.value);
    const okLen = n>=t.minWords && n<=t.maxWords+40;
    const el = document.getElementById('w-final-len');
    el.innerHTML = '<span class="'+(n===0?'text-slate-600':okLen?'text-emerald-400':'text-amber-400')+' font-bold">'+n+'</span> <span class="text-slate-600">/ '+(t.opgave==='Opgave 1'?t.minWords+'–'+t.maxWords:'min. '+t.minWords)+' words</span>';
  }
};
DC.wFocusEl = function(){ return document.getElementById(DC.wFocus||'w-draft') || document.getElementById('w-draft'); };
DC.insertPhrase = function(gi, pi){
  const phrase = WRITING.phrases[gi].items[pi];
  const el = DC.wFocusEl(); if (!el) return;
  const pos = el.selectionStart!=null ? el.selectionStart : el.value.length;
  el.value = el.value.slice(0,pos) + phrase + ' ' + el.value.slice(pos);
  el.focus(); el.selectionStart = el.selectionEnd = pos + phrase.length + 1;
  DC.wAutosave(DC.sub.writing||'w1a'); DC.wCount();
  DC.toast('Inserted: <i>'+esc(phrase)+'</i>','info');
};
DC.wCheck = function(taskId, i, v){
  const arr = DC.state.writing.checks[taskId] || WRITING.checklist.map(()=>false);
  arr[i] = v; DC.state.writing.checks[taskId] = arr; DC.save();
};
DC.wClear = function(taskId){
  DC.confirmBox('Clear this draft?','Planning box, draft and final answer for this task will be deleted. The teaching panels stay.','Clear it',function(){
    delete DC.state.writing.drafts[taskId];
    DC.state.writing.checks[taskId] = WRITING.checklist.map(()=>false);
    DC.save(); DC.renderWriting();
  });
};
DC.wComplete = function(taskId){
  const t = WRITING.tasks.find(x=>x.id===taskId);
  const final = (document.getElementById('w-final')||{}).value||'';
  const n = wordCount(final);
  const checks = DC.state.writing.checks[taskId]||[];
  const ticked = checks.filter(Boolean).length;
  if (n < t.minWords){ DC.toast('Your final answer has '+n+' words — the task requires at least '+t.minWords+'. The censor counts, and so do I!','err'); return; }
  if (ticked < WRITING.checklist.length){ DC.toast('Go through the whole self-correction checklist first ('+ticked+'/'+WRITING.checklist.length+' ticked). Checking IS the skill.','warn'); return; }
  DC.stopTimer('writing');
  DC.state.writing.completed[taskId] = { ts:Date.now(), words:n };
  /* completion is tracked, but it must NOT mint concept mastery — only real feedback
     (the LLM censor round trip) can judge whether the Danish was actually correct */
  DC.state.behavior.lastWriting = Date.now();
  DC.save();
  DC.modal('<div class="text-center"><div class="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-3"><i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-300"></i></div>'+
    '<h3 class="font-bold text-slate-100 mb-2">Task completed — '+n+' words</h3>'+
    '<p class="text-sm text-slate-400 mb-3 text-left">Now do the most valuable step: <b>compare your text with the strong model answer</b> (left pane). Look specifically at:</p>'+
    '<ul class="text-sm text-slate-300 text-left list-disc list-inside space-y-1 mb-4"><li>Did you cover every bullet as clearly?</li><li>Are your sentence openings varied (Derfor…, Desuden…)?</li><li>Is every fordi/hvis/selvom-clause in SAV order?</li><li>Is your closing as polite and complete?</li></ul>'+
    '<p class="text-xs text-slate-500 mb-4">Since I cannot read free text like a human censor, this comparison is your feedback loop — and it is exactly what strong writers do.</p>'+
    '<button onclick="DC.closeModal();DC.renderWriting()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Compare with models</button></div>');
};

/* =====================================================================
   ORAL STRATEGIST (Mundtlig)
   ===================================================================== */
DC.renderOral = function(){
  const tab = DC.sub.oral || 'o1';
  let h = '<div class="space-y-4 fade-in">';
  h += '<div class="card p-4"><div class="flex items-center gap-2 mb-3 flex-wrap"><i data-lucide="mic" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Oral Strategist — official SIRI Modul 3.3 format</h2>'+
    '<div class="ml-auto flex items-center gap-3"><label class="flex items-center gap-1.5 text-xs font-semibold text-slate-400 cursor-pointer" title="Speak every revealed examiner question aloud"><input type="checkbox" '+(DC.state.oral.examinerVoice?'checked':'')+' onchange="DC.state.oral.examinerVoice=this.checked;DC.save()" class="accent-indigo-500"><i data-lucide="volume-2" class="w-3.5 h-3.5"></i>Examiner voice</label>'+
    '<button onclick="DC.oralRandom()" class="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-2 flex items-center gap-1.5"><i data-lucide="shuffle" class="w-3.5 h-3.5"></i>Random examiner question</button></div></div>'+
    '<div class="flex gap-1.5 flex-wrap">';
  [['o1','Opgave 1 · Mindmap presentation','presentation'],['o2','Opgave 2 · Conversation','users-round'],['tools','Oral toolbox & phrases','wrench']].forEach(t=>{
    h += '<button onclick="DC.sub.oral=\''+t[0]+'\';DC.renderOral()" class="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 '+(tab===t[0]?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200')+'"><i data-lucide="'+t[2]+'" class="w-3.5 h-3.5"></i>'+t[1]+'</button>';
  });
  h += '</div></div><div id="oral-body"></div></div>';
  document.getElementById('main').innerHTML = h;
  ({o1:DC.oralO1, o2:DC.oralO2, tools:DC.oralTools}[tab])();
  DC.icons();
};

/* ---------- tracker ---------- */
DC.trackerHTML = function(id){
  const states = DC.state.oral.tracker[id]||[];
  let h = '<div class="flex flex-wrap gap-1.5 items-center"><span class="text-[10px] uppercase tracking-wider text-slate-500 mr-1">Track:</span>';
  ORAL.trackerStates.forEach(t=>{
    const on = states.includes(t.id);
    h += '<button onclick="DC.trackToggle(\''+id+'\',\''+t.id+'\')" class="text-[11px] font-semibold rounded-lg px-2.5 py-1.5 border flex items-center gap-1 '+(on?t.cls+' border-transparent':'bg-slate-900 border-slate-800 text-slate-500')+'"><i data-lucide="'+t.icon+'" class="w-3 h-3"></i>'+t.label+'</button>';
  });
  return h+'</div>';
};
DC.trackToggle = function(id, st){
  const tr = DC.state.oral.tracker;
  tr[id] = tr[id]||[];
  const i = tr[id].indexOf(st);
  const turningOn = i===-1;
  if (turningOn) tr[id].push(st); else tr[id].splice(i,1);
  if (turningOn){
    const concept = id.startsWith('mm') ? 'o-mindmap' : 'o-conversation';
    if (st==='practiced') DC.state.concepts[concept].history.push({ok:true, conf:'unsure', ts:Date.now(), hints:0});
    if (st==='confident') DC.state.concepts[concept].history.push({ok:true, conf:'confident', ts:Date.now(), hints:0});
    if (st==='hard') DC.state.concepts[concept].history.push({ok:false, conf:'unsure', ts:Date.now(), hints:0});
    if (st==='practiced'||st==='confident') DC.state.behavior.lastOral = Date.now();
  }
  DC.save(); DC.renderOral();
};

/* ---------- Opgave 1: mindmaps ---------- */
/* the student's own two Opgave 1 topics — the real exam requires bringing TWO topics of your
   own to draw by lot, as keyword-only mindmaps (never full sentences) */
DC.myTopicsHTML = function(){
  const mt = DC.state.oral.myTopics;
  let h = '<div class="card p-5"><div class="flex items-center gap-2 mb-2"><i data-lucide="edit-3" class="w-4 h-4 text-indigo-300"></i><h3 class="font-bold text-slate-100 text-sm">Mine to emner — prepare your own two topics</h3></div>'+
    '<p class="text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mb-3">The real test requires TWO topics of your own, with keyword-only mindmaps (no full sentences) — you draw ONE by lot. Pick topics with real substance (arbejde, uddannelse, medborgerskab/hverdagsliv). Too-simple topics like "Min familie" or "Min bolig" are rejected.</p>'+
    '<div class="grid md:grid-cols-2 gap-3 mb-3">';
  mt.forEach((t,ti)=>{
    h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3">'+
      '<input value="'+esc(t.title)+'" placeholder="Emne '+(ti+1)+' — titel, fx Min jobsøgning" oninput="DC.myTopicEdit('+ti+',-1,this.value)" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-100 mb-2">'+
      '<div class="grid grid-cols-2 gap-1.5">'+t.branches.map((b,bi)=>'<input value="'+esc(b)+'" placeholder="Stikord '+(bi+1)+'" oninput="DC.myTopicEdit('+ti+','+bi+',this.value)" class="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200">').join('')+'</div></div>';
  });
  h += '</div>';
  const ready = mt.every(t=>t.title.trim());
  h += '<button '+(ready?'onclick="DC.drawMyTopic()"':'disabled title="Fill in both topic titles first"')+' class="px-4 py-2 rounded-xl '+(ready?'bg-indigo-600 hover:bg-indigo-500':'bg-slate-800 opacity-50 cursor-not-allowed')+' text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="dices" class="w-4 h-4"></i>Træk lod — draw one at random</button>';
  if (DC.state.oral.myDrawn!=null && mt[DC.state.oral.myDrawn]){
    const t = mt[DC.state.oral.myDrawn];
    /* NOTE: reuses the shared #oral-prac timer widget the panel below always renders —
       don't call oralPanelHTML here too, it would duplicate that element's id. */
    h += '<div class="mt-3 fade-in"><div class="bg-sky-500/15 border-2 border-sky-500/50 rounded-2xl px-4 py-3 text-center font-bold text-sky-200 mb-2">'+esc(t.title)+'</div>'+
      '<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">'+t.branches.filter(b=>b.trim()).map(b=>'<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-2 text-center text-xs font-semibold text-slate-100">'+esc(b)+'</div>').join('')+'</div>'+
      '<button onclick="DC.oralPracStart(\'o1\',\'my'+DC.state.oral.myDrawn+'\')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="play" class="w-4 h-4"></i>Start 2-min presentation timer for this topic</button></div>';
  }
  h += '</div>';
  return h;
};
DC.myTopicEdit = function(ti, bi, val){
  const t = DC.state.oral.myTopics[ti]; if (!t) return;
  if (bi<0) t.title = val; else t.branches[bi] = val;
  DC.save();
};
DC.drawMyTopic = function(){
  DC.state.oral.myDrawn = Math.floor(Math.random()*DC.state.oral.myTopics.length);
  DC.save(); DC.renderOral();
};
DC.oralO1 = function(){
  const mmId = DC.sub.mm || 'mm1';
  const mm = ORAL.mindmaps.find(m=>m.id===mmId);
  let h = '<div class="space-y-3">';
  h += '<div class="card p-4 text-sm text-slate-300 flex items-start gap-2"><i data-lucide="info" class="w-4 h-4 text-sky-300 mt-0.5 shrink-0"></i><span>'+esc(ORAL.format.o1)+'</span></div>';
  h += DC.myTopicsHTML();
  h += '<div class="flex gap-2 flex-wrap">';
  ORAL.mindmaps.forEach(m=> h += '<button onclick="DC.sub.mm=\''+m.id+'\';DC.sub.branch=null;DC.renderOral()" class="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 '+(mmId===m.id?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400')+'"><i data-lucide="'+m.icon+'" class="w-3.5 h-3.5"></i>'+esc(m.title)+'</button>');
  h += '</div>';
  // how to present
  h += accHTML('How to present from a mindmap (read me first)', '<ul class="space-y-1.5 list-disc list-inside">'+ORAL.presentTips.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>', 'presentation', false);
  // mindmap
  h += '<div class="card p-5"><div class="text-xs text-slate-500 mb-3">'+esc(mm.note)+' Click a branch to open its coaching panel.</div>';
  h += '<div class="max-w-2xl mx-auto"><div class="bg-sky-500/15 border-2 border-sky-500/50 rounded-2xl px-4 py-3 text-center font-bold text-sky-200 mb-4">'+esc(mm.center)+'</div><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">';
  mm.branches.forEach((b,i)=>{
    const active = DC.sub.branch===i;
    h += '<button onclick="DC.sub.branch='+(active?'null':i)+';DC.renderOral()" class="branch-card card p-3 text-center '+(active?'active':'')+'"><div class="font-semibold text-sm text-slate-100">'+esc(b.title)+'</div><div class="text-[10px] text-slate-500 mt-0.5">'+esc(b.hint)+'</div></button>';
  });
  h += '</div></div>';
  if (DC.sub.branch!=null){
    const b = mm.branches[DC.sub.branch];
    h += '<div class="mt-4 card !bg-slate-900/80 p-4 fade-in"><div class="font-bold text-indigo-300 mb-3 flex items-center gap-2"><i data-lucide="git-branch" class="w-4 h-4"></i>Branch: '+esc(b.title)+'</div><div class="grid md:grid-cols-2 gap-4 text-sm">';
    h += '<div><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">Key vocabulary (stikord)</div><div class="flex flex-wrap gap-1.5">'+b.vocab.map(v=>'<span class="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs">'+esc(v)+'</span>').join('')+'</div>';
    h += '<div class="text-[10px] uppercase tracking-widest text-slate-500 mt-3 mb-1.5">Useful phrases</div>'+b.phrases.map(p=>'<div class="text-slate-200 mb-1">· '+esc(p)+'</div>').join('');
    h += '</div><div>';
    h += '<div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">Personal example ideas</div>'+b.examples.map(e=>'<div class="text-slate-300 mb-1">· '+esc(e)+'</div>').join('');
    h += '<div class="text-[10px] uppercase tracking-widest text-slate-500 mt-3 mb-1.5">Opinions you could express</div>'+b.opinions.map(o=>'<div class="text-slate-300 mb-1">· '+esc(o)+'</div>').join('');
    h += '<div class="text-[10px] uppercase tracking-widest text-emerald-400/80 mt-3 mb-1.5">Link to Denmark</div><div class="text-emerald-200/90">'+esc(b.dk)+'</div>';
    h += '</div></div></div>';
  }
  h += '</div>';
  // teacher information sheet simulator
  const revealed = DC.state.oral.revealed[mmId]||0;
  const allQs = [];
  mm.branches.forEach(b=> b.followUps.forEach(q=> allQs.push({branch:b.title, q})));
  h += '<div class="card p-5 !border-amber-500/30"><div class="flex items-center gap-2 mb-1"><i data-lucide="clipboard-list" class="w-5 h-5 text-amber-300"></i><h3 class="font-bold text-slate-100">Teacher Information Sheet Simulator</h3></div>'+
    '<p class="text-xs text-slate-400 mb-3">The examiner has a sheet with follow-up questions like these ('+allQs.length+' for this topic). Reveal one at a time, answer OUT LOUD with PREP (Point → Reason → Example → Personal link), then reveal the next.</p>';
  for (let i=0;i<Math.min(revealed, allQs.length);i++){
    h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5 mb-2 fade-in"><div class="text-[10px] uppercase text-amber-300/80 font-bold mb-0.5">'+esc(allQs[i].branch)+'</div><div class="text-sm text-slate-100">'+esc(allQs[i].q)+'</div></div>';
  }
  if (revealed < allQs.length) h += '<button onclick="DC.revealQ(\''+mmId+'\')" class="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-500/80 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="eye" class="w-4 h-4"></i>Reveal next examiner question ('+revealed+'/'+allQs.length+')</button>';
  else h += '<div class="text-sm text-emerald-300 flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4"></i>You have faced every follow-up for this topic. Mark it in the tracker below!</div>'+
    '<button onclick="DC.state.oral.revealed[\''+mmId+'\']=0;DC.save();DC.renderOral()" class="mt-2 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-1.5">Reset questions</button>';
  h += '</div>';
  h += '<div class="card p-4">'+DC.trackerHTML(mmId)+'</div>';
  h += '</div>';
  document.getElementById('oral-body').innerHTML = h;
};
DC.revealQ = function(id){
  const idx = DC.state.oral.revealed[id]||0;
  DC.state.oral.revealed[id] = idx+1;
  DC.state.concepts['o-followup'].history.push({ok:true, conf:'unsure', ts:Date.now(), hints:0});
  DC.state.behavior.lastOral = Date.now();
  DC.save(); DC.renderOral();
  if (DC.state.oral.examinerVoice){
    const mm = ORAL.mindmaps.find(m=>m.id===id), allQs=[];
    if (mm){ mm.branches.forEach(b=>b.followUps.forEach(q=>allQs.push(q))); if (allQs[idx]) DC.speak(allQs[idx]); }
  }
};

/* ---------- Opgave 2: scenarios ---------- */
DC.oralO2 = function(){
  const scId = DC.sub.sc || 'sc1';
  const sc = ORAL.scenarios.find(x=>x.id===scId);
  let h = '<div class="space-y-3">';
  h += '<div class="card p-4 text-sm text-slate-300 flex items-start gap-2"><i data-lucide="info" class="w-4 h-4 text-sky-300 mt-0.5 shrink-0"></i><span>'+esc(ORAL.format.o2)+'</span></div>';
  h += '<div class="flex gap-2 flex-wrap">';
  ORAL.scenarios.forEach(x=> h += '<button onclick="DC.sub.sc=\''+x.id+'\';DC.renderOral()" class="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 '+(scId===x.id?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400')+'"><i data-lucide="'+x.icon+'" class="w-3.5 h-3.5"></i>'+esc(x.title)+'</button>');
  h += '</div>';
  // task sheet (opgaveark)
  h += '<div class="card p-5"><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-2">Opgaveark · what you and your partner see</div>'+
    '<div class="bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 italic mb-4">“'+esc(sc.testerIntro)+'”</div>'+
    '<div class="grid grid-cols-2 lg:grid-cols-4 gap-3">';
  sc.images.forEach(im=> h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-center"><i data-lucide="'+im.icon+'" class="w-8 h-8 text-indigo-300 mx-auto mb-2"></i><div class="font-semibold text-sm text-slate-100">'+esc(im.label)+'</div><div class="text-[11px] text-slate-500 mt-1">'+esc(im.desc)+'</div></div>');
  h += '</div></div>';
  // del 1
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-2"><i data-lucide="users-round" class="w-4 h-4 text-emerald-300"></i><h3 class="font-bold text-slate-100 text-sm">Del 1 — paropgave (ca. 4 min)</h3></div><ul class="text-sm text-slate-300 space-y-1.5 list-disc list-inside mb-3">'+sc.del1Help.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+
    '<div class="text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mb-3">'+esc(sc.del1Backup)+'</div>'+
    '<button onclick="DC.partnerStart(\''+scId+'\')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="users-round" class="w-4 h-4"></i>Partner-øvelse — practice Del 1 with a classmate</button></div>';
  // del 2: examiner sheet with reveal
  const key = scId+'-d2';
  const rev = DC.state.oral.revealed[key]||0;
  h += '<div class="card p-5 !border-amber-500/30"><div class="flex items-center gap-2 mb-1"><i data-lucide="clipboard-list" class="w-5 h-5 text-amber-300"></i><h3 class="font-bold text-slate-100">Del 2 — Examiner Sheet Simulator (ca. 3 min)</h3></div>'+
    '<p class="text-xs text-slate-400 mb-3">These are the guided questions on the tester’s sheet. Reveal one, answer out loud, then open the structure and sample for comparison.</p>';
  sc.del2.forEach((d,i)=>{
    if (i < rev){
      h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 mb-2 fade-in"><div class="text-sm font-semibold text-slate-100 mb-2">'+(i+1)+'. '+esc(d.q)+'</div>'+
        accHTML('Suggested answer structure','<p>'+esc(d.structure)+'</p>','list-ordered',false)+
        '<div class="h-2"></div>'+
        accHTML('Sample strong answer (compare AFTER answering aloud)','<p class="italic text-slate-200">“'+esc(d.sample)+'”</p>','quote',false)+'</div>';
    }
  });
  if (rev < sc.del2.length) h += '<button onclick="DC.revealD2(\''+key+'\')" class="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-500/80 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="eye" class="w-4 h-4"></i>Reveal examiner question '+(rev+1)+' of '+sc.del2.length+'</button>';
  else h += '<button onclick="DC.state.oral.revealed[\''+key+'\']=0;DC.save();DC.renderOral()" class="text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-1.5">Reset questions</button>';
  h += '</div>';
  // follow-up challenges, vocab, hooks
  h += '<div class="grid md:grid-cols-2 gap-3">';
  h += '<div class="card p-4"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Possible follow-up challenges</div>'+sc.followChallenges.map(f=>'<div class="text-sm text-slate-300 mb-1.5">· '+esc(f)+'</div>').join('')+'</div>';
  h += '<div class="card p-4"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Useful vocabulary</div><div class="flex flex-wrap gap-1.5 mb-3">'+sc.vocab.map(v=>'<span class="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs">'+esc(v)+'</span>').join('')+'</div>'+
    '<div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Hooks — steer the conversation</div>'+sc.hooks.map(x=>'<div class="text-sm text-indigo-200/90 mb-1.5">· '+esc(x)+'</div>').join('')+'</div>';
  h += '</div>';
  h += '<div class="card p-4">'+DC.trackerHTML(scId)+'</div>';
  h += '</div>';
  document.getElementById('oral-body').innerHTML = h;
};
DC.revealD2 = function(key){
  const idx = DC.state.oral.revealed[key]||0;
  DC.state.oral.revealed[key] = idx+1;
  DC.state.concepts['o-conversation'].history.push({ok:true, conf:'unsure', ts:Date.now(), hints:0});
  DC.state.behavior.lastOral = Date.now();
  DC.save(); DC.renderOral();
  if (DC.state.oral.examinerVoice){
    const sc = ORAL.scenarios.find(x=>x.id===key.replace(/-d2$/,''));
    if (sc && sc.del2[idx]) DC.speak(sc.del2[idx].q);
  }
};
/* Partner-øvelse — Del 1 is a PAIR task and the one part solo self-study can't rehearse.
   This gives two classmates (or one student running both roles) the opgaveark, a 4-min
   timer, and a TTS "stuck?" button that speaks the examiner's real backup prompt aloud. */
DC.partnerStart = function(scId){
  const sc = ORAL.scenarios.find(x=>x.id===scId);
  const m = sc.del1Backup.match(/"([^"]+)"/);
  DC._partnerBackup = m ? m[1] : sc.del1Backup;
  let h = '<div class="max-w-lg mx-auto"><div class="text-center mb-3"><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">Partner-øvelse · Del 1 (4 min)</div><h3 class="font-bold text-slate-100">'+esc(sc.title)+'</h3></div>'+
    '<div class="bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 italic mb-4">"'+esc(sc.testerIntro)+'"</div>'+
    '<div class="grid grid-cols-2 gap-3 mb-4">'+sc.images.map(im=>'<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-center"><i data-lucide="'+im.icon+'" class="w-7 h-7 text-indigo-300 mx-auto mb-1"></i><div class="font-semibold text-xs text-slate-100">'+esc(im.label)+'</div></div>').join('')+'</div>'+
    '<div class="flex items-center justify-center gap-3 mb-3"><span class="text-3xl font-mono font-extrabold text-amber-300" id="partner-timer">4:00</span>'+
    '<button onclick="DC.stopTimer(\'partner\')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Stop</button></div>'+
    '<p class="text-xs text-slate-400 mb-3 text-center">Sit with a classmate (or run both roles yourself). Take turns asking about each picture, react to each other, and justify your preference — just like the real Del 1.</p>'+
    '<button onclick="DC.speak(DC._partnerBackup)" class="w-full px-4 py-2.5 rounded-xl bg-amber-600/80 hover:bg-amber-500/80 text-white text-sm font-semibold flex items-center justify-center gap-2 mb-2"><i data-lucide="volume-2" class="w-4 h-4"></i>Stuck? Hear the examiner’s backup prompt</button>'+
    DC.recBoothHTML('partner-rec')+
    '<button onclick="DC.stopTimer(\'partner\');DC.closeModal()" class="w-full px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm mt-2">Close</button></div>';
  DC.modal(h);
  DC.icons();
  DC.startTimer('partner', 240, 'partner-timer', function(){ DC.toast('4 minutes — Del 1 is over. Move on to Del 2.','warn'); });
};

/* ---------- toolbox ---------- */
const PHRASE_CONCEPT = { 'Giving opinions':'o-opinion','Agreeing & disagreeing':'o-conversation','Comparing':'o-compare','Giving examples':'o-expand','Buying thinking time':'o-thinking','Clarifying':'o-followup','Concluding':'o-hooks','Introducing a new point':'o-hooks','Connecting to Danish society':'o-compare' };
DC.oralTools = function(){
  let h = '<div class="space-y-3">';
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-2"><i data-lucide="layers" class="w-5 h-5 text-indigo-300"></i><h3 class="font-bold text-slate-100">The PREP answer framework</h3></div>'+
    '<p class="text-xs text-slate-400 mb-3">Every oral answer can follow these five steps — about 30–45 seconds of connected Danish.</p><div class="grid md:grid-cols-5 gap-2">';
  ORAL.prep.forEach((p,i)=> h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3"><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">'+(i+1)+' · '+p.step+'</div><div class="text-sm font-medium text-slate-100 mb-1">'+esc(p.da)+'</div><div class="text-[11px] text-slate-400">'+esc(p.d)+'</div></div>');
  h += '</div></div>';
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="message-square-quote" class="w-5 h-5 text-emerald-300"></i><h3 class="font-bold text-slate-100">Useful oral phrases ('+ORAL.phraseGroups.reduce((t,g)=>t+g.items.length,0)+')</h3></div>'+
    '<p class="text-xs text-slate-400 mb-4">Say each phrase aloud three times, then press “Practiced aloud” — it feeds your oral mastery tracking.</p><div class="grid md:grid-cols-2 gap-3">';
  ORAL.phraseGroups.forEach((g,gi)=>{
    h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3"><div class="flex items-center gap-2 mb-2"><i data-lucide="'+g.icon+'" class="w-4 h-4 text-indigo-300"></i><span class="font-semibold text-sm text-slate-100">'+g.cat+'</span>'+
      '<button onclick="DC.phrasePracticed('+gi+')" class="ml-auto text-[10px] font-bold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 rounded-lg px-2 py-1">Practiced aloud ✓</button></div>';
    g.items.forEach(p=> h += '<div class="text-sm text-slate-300 mb-1">· '+esc(p)+'</div>');
    h += '</div>';
  });
  h += '</div></div></div>';
  document.getElementById('oral-body').innerHTML = h;
};
DC.phrasePracticed = function(gi){
  const g = ORAL.phraseGroups[gi];
  const cid = PHRASE_CONCEPT[g.cat]||'o-opinion';
  DC.state.concepts[cid].history.push({ok:true, conf:'unsure', ts:Date.now(), hints:0});
  DC.state.behavior.lastOral = Date.now();
  DC.save();
  DC.toast('"'+esc(g.cat)+'" logged. Saying it aloud is the practice that counts!','ok');
};

/* ---------- randomizer ---------- */
DC.oralRandom = function(){
  const pool = [];
  ORAL.mindmaps.forEach(m=> m.branches.forEach(b=> b.followUps.forEach(q=> pool.push({src:m.title+' · '+b.title, q}))));
  ORAL.scenarios.forEach(s=>{ s.del2.forEach(d=> pool.push({src:s.title+' · Del 2', q:d.q})); s.followChallenges.forEach(q=> pool.push({src:s.title+' · follow-up', q})); });
  const p = pick(pool);
  const think = pick(ORAL.phraseGroups.find(g=>g.cat==='Buying thinking time').items);
  DC.modal('<div><div class="flex items-center gap-2 mb-3"><div class="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center"><i data-lucide="mic" class="w-5 h-5 text-amber-300"></i></div><div><div class="text-[10px] uppercase tracking-widest text-amber-300 font-bold">Examiner asks…</div><div class="text-xs text-slate-500">'+esc(p.src)+'</div></div></div>'+
    '<div class="text-lg font-semibold text-slate-100 mb-4">“'+esc(p.q)+'”</div>'+
    '<div class="text-sm text-slate-400 mb-1">Answer OUT LOUD for at least 30 seconds. Structure:</div>'+
    '<div class="text-xs text-slate-300 mb-3">Point → fordi… → for eksempel… → i mit hjemland / i Danmark… → link back.</div>'+
    '<div class="text-xs text-indigo-200 bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-3 py-2 mb-4">Need a moment? Say: “'+esc(think)+'”</div>'+
    '<div class="flex gap-2 flex-wrap"><button onclick="DC.oralRandomDone()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold">I answered aloud ✓</button>'+
    '<button onclick="DC.oralRandom()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Another question</button>'+
    '<button onclick="DC.closeModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Close</button></div></div>');
  if (DC.state.oral.examinerVoice) DC.speak(p.q);
};
DC.oralRandomDone = function(){
  ['o-followup','o-expand'].forEach(c=> DC.state.concepts[c].history.push({ok:true, conf:'unsure', ts:Date.now(), hints:0}));
  DC.state.behavior.lastOral = Date.now();
  DC.save(); DC.closeModal();
  DC.toast('Logged! Out-loud practice is what moves the oral score.','ok');
};

/* =====================================================================
   PERSONAL ERROR NOTEBOOK
   ===================================================================== */
DC.renderNotebook = function(){
  const s = DC.state;
  const fM = DC.sub.nbM||'all', fC = DC.sub.nbC||'all', fO = DC.sub.nbO||'all';
  let list = s.errors.slice();
  if (fM!=='all') list = list.filter(e=>e.module===fM);
  if (fC!=='all') list = list.filter(e=>e.concept===fC);
  if (fO!=='all') list = list.filter(e=>e.opgave===fO);
  const repeatCount = {};
  s.errors.forEach(e=>{ if(e.qid) repeatCount[e.qid]=(repeatCount[e.qid]||0)+1; });
  const modules = ['all'].concat([...new Set(s.errors.map(e=>e.module))]);
  const concepts = ['all'].concat([...new Set(s.errors.map(e=>e.concept))]);
  const opgaver = ['all'].concat([...new Set(s.errors.map(e=>e.opgave))]);

  let h = '<div class="space-y-4 fade-in">';
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="notebook-pen" class="w-5 h-5 text-rose-300"></i><h2 class="font-bold text-slate-100">Personal Error Notebook</h2></div>'+
    '<p class="text-sm text-slate-400">Every wrong answer lands here automatically — with the diagnosis, the explanation and the memory trick. Retry until "I understand now" is honestly true.</p>'+
    '<div class="mt-3 flex items-start gap-2 text-sm bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-3 py-2"><i data-lucide="graduation-cap" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i><span><b>Latest teacher advice:</b> '+Brain.advice()+'</span></div></div>';
  // filters
  const selCls = 'gapsel text-xs';
  h += '<div class="card p-4 flex flex-wrap gap-3 items-center"><i data-lucide="filter" class="w-4 h-4 text-slate-500"></i>'+
    '<label class="text-xs text-slate-400">Module <select class="'+selCls+' ml-1" onchange="DC.sub.nbM=this.value;DC.renderNotebook()">'+modules.map(m=>'<option value="'+m+'" '+(fM===m?'selected':'')+'>'+(m==='all'?'All':m)+'</option>').join('')+'</select></label>'+
    '<label class="text-xs text-slate-400">Opgave <select class="'+selCls+' ml-1" onchange="DC.sub.nbO=this.value;DC.renderNotebook()">'+opgaver.map(m=>'<option value="'+m+'" '+(fO===m?'selected':'')+'>'+(m==='all'?'All':m)+'</option>').join('')+'</select></label>'+
    '<label class="text-xs text-slate-400">Concept <select class="'+selCls+' ml-1" onchange="DC.sub.nbC=this.value;DC.renderNotebook()">'+concepts.map(m=>'<option value="'+m+'" '+(fC===m?'selected':'')+'>'+(m==='all'?'All':(CONCEPTS[m]?CONCEPTS[m].name:m))+'</option>').join('')+'</select></label>'+
    '<span class="ml-auto text-xs text-slate-500">'+list.length+' entr'+(list.length===1?'y':'ies')+' · '+s.errors.filter(e=>!e.understood).length+' still open</span></div>';
  if (!list.length) h += '<div class="card p-8 text-center text-slate-500 text-sm">No errors here'+(s.errors.length?' with these filters':' yet — go practice! Mistakes are the raw material of mastery')+'.</div>';
  list.forEach(e=>{
    const rep = e.qid ? repeatCount[e.qid] : 1;
    h += '<div class="card p-4 '+(e.understood?'opacity-60':'')+'"><div class="flex flex-wrap items-center gap-2 mb-2">'+
      '<span class="text-[10px] font-bold uppercase tracking-wider bg-slate-800 rounded-full px-2.5 py-1 text-slate-300">'+esc(e.module)+'</span>'+
      '<span class="text-[10px] font-bold bg-indigo-500/15 text-indigo-300 rounded-full px-2.5 py-1">'+esc(e.opgave)+'</span>'+
      (CONCEPTS[e.concept]?'<span class="text-[10px] text-slate-500">'+esc(CONCEPTS[e.concept].name)+'</span>':'')+
      (rep>1?'<span class="text-[10px] font-bold bg-rose-500/15 text-rose-300 rounded-full px-2.5 py-1">repeated ×'+rep+'</span>':'')+
      '<span class="ml-auto text-[10px] text-slate-600">'+fmtDate(e.ts)+' · confidence: '+esc(e.confidence)+' · hints: '+e.hints+'</span></div>'+
      '<div class="text-sm font-semibold text-slate-100 mb-1.5">'+e.question+'</div>'+
      '<div class="grid md:grid-cols-2 gap-2 mb-2"><div class="text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2"><b class="text-rose-300">Your answer:</b> '+esc(e.userAnswer)+'<div class="text-[11px] text-rose-200/70 mt-0.5">'+esc(e.mistakeType)+'</div></div>'+
      '<div class="text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2"><b class="text-emerald-300">Correct:</b> '+esc(e.correctAnswer)+'</div></div>'+
      '<div class="text-sm text-slate-300 mb-2"><b class="text-slate-100">Teacher explanation:</b> '+esc(e.explanation)+'</div>'+
      (e.memoryTrick?'<div class="flex items-start gap-2 text-sm bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-3 py-2 mb-3"><i data-lucide="sparkles" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i><span><b>Memory trick:</b> '+esc(e.memoryTrick)+'</span></div>':'')+
      '<div class="flex flex-wrap gap-2 items-center">'+
      (e.snapshot?'<button onclick="DC.retryError(\''+e.id+'\')" class="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>Retry this question</button>':'')+
      '<label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer"><input type="checkbox" '+(e.understood?'checked':'')+' onchange="DC.errUnderstood(\''+e.id+'\',this.checked)" class="accent-emerald-500">I understand now</label>'+
      '</div></div>';
  });
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.errUnderstood = function(id, v){
  const e = DC.state.errors.find(x=>x.id===id);
  if (e){ e.understood = v; DC.save(); DC.renderNotebook(); }
};
DC.retryError = function(id){
  const e = DC.state.errors.find(x=>x.id===id);
  if (!e || !e.snapshot) return;
  DC.modal('<div class="flex items-center justify-between mb-3"><h3 class="font-bold text-slate-100">Retry — beat your past self</h3><button onclick="DC.closeModal()" class="text-slate-500 hover:text-slate-300"><i data-lucide="x" class="w-5 h-5"></i></button></div><div id="retry-box"></div>');
  DC.qStart('retry-box', e.snapshot, { module:e.module, opgave:e.opgave, qid:e.qid,
    onDone:function(sess){ if (sess.ok && (sess.conf==='confident'||sess.conf==='sure')){
      DC.toast('Correct and sure — consider ticking "I understand now" on this entry.','ok'); } }});
};

/* =====================================================================
   SPACED REPETITION REVIEW QUEUE
   ===================================================================== */
DC.renderReview = function(){
  const s = DC.state;
  const now = Date.now(), eod = new Date(); eod.setHours(23,59,59,999);
  const due = s.review.filter(r=>!r.mastered && r.due<=now);
  const today = s.review.filter(r=>!r.mastered && r.due>now && r.due<=eod.getTime());
  const overdue = due.filter(r=>r.due < now-24*3600*1000);
  const upcoming = s.review.filter(r=>!r.mastered && r.due>eod.getTime()).sort((a,b)=>a.due-b.due);
  const mastered = s.review.filter(r=>r.mastered);

  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="brain" class="w-5 h-5 text-amber-300"></i><h2 class="font-bold text-slate-100">Spaced Repetition Review</h2></div>'+
    '<p class="text-sm text-slate-400">Mistakes return at scientifically spaced intervals: <b>10 minutes → 1 day → 3 days → 7 days</b>. Two confident correct answers at the end = mastered. Misconceptions (confident-but-wrong) are flagged for reteaching.</p></div>';
  h += '<div class="grid grid-cols-2 md:grid-cols-4 gap-3">'+
    dueCard('Due now', due.length, 'alarm-clock', due.length?'text-amber-300':'text-slate-400','')+
    dueCard('Overdue', overdue.length, 'alarm-clock-off', overdue.length?'text-rose-300':'text-slate-400','')+
    dueCard('Upcoming', upcoming.length+today.length, 'calendar', 'text-sky-300','')+
    dueCard('Mastered', mastered.length, 'award', mastered.length?'text-emerald-300':'text-slate-400','')+'</div>';
  { const dojoDue = DC.dojoDueCount(), vocDue = DC.vocDue();
    if (dojoDue || vocDue){
      h += '<p class="text-xs text-slate-500">Two more spaced-review queues live elsewhere in the app:</p><div class="grid grid-cols-2 gap-3">'+
        dueCard('Dojo re-tests due', dojoDue, 'target', dojoDue?'text-amber-300':'text-slate-400', "DC.go('dojo')")+
        dueCard('Ordforråd words due', vocDue, 'book-marked', vocDue?'text-amber-300':'text-slate-400', "DC.go('vocab');DC.vocabSetMode('flash')")+
        '</div>';
    }
  }
  if (due.length){
    h += '<div class="card p-5 !border-amber-500/40"><div class="flex items-center justify-between flex-wrap gap-2 mb-2"><h3 class="font-bold text-slate-100 text-sm">'+due.length+' item'+(due.length>1?'s':'')+' ready for review</h3>'+
      '<button onclick="DC.reviewSession()" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="play" class="w-4 h-4"></i>Start review session</button></div>'+
      '<div class="space-y-1.5">'+due.slice(0,8).map(r=>'<div class="text-xs text-slate-400 flex items-center gap-2"><i data-lucide="'+(r.misconception?'alert-triangle':'rotate-ccw')+'" class="w-3.5 h-3.5 '+(r.misconception?'text-rose-400':'text-slate-500')+'"></i>'+
        (CONCEPTS[r.concept]?esc(CONCEPTS[r.concept].name):esc(r.concept))+' · stage '+(r.stage+1)+'/4 · '+esc(r.opgave)+(r.misconception?' · <b class="text-rose-300">misconception — reread the lesson first!</b>':'')+'</div>').join('')+'</div>'+
      (due.some(r=>r.misconception)?'<button onclick="DC.go(\'learn\')" class="mt-3 text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">Open Learn Mode for the flagged misconceptions</button>':'')+'</div>';
  } else {
    h += '<div class="card p-6 text-center text-sm text-slate-400"><i data-lucide="check-circle-2" class="w-8 h-8 text-emerald-400 mx-auto mb-2"></i>Nothing due right now. '+(upcoming.length||today.length?'Next review: '+fmtDate((today[0]||upcoming[0]).due)+'.':'Make some brave mistakes in the trainers and I will schedule them.')+'</div>';
  }
  h += '<div id="review-session"></div>';
  if (today.length||upcoming.length){
    h += '<div class="card p-4"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Scheduled next</div>'+
      today.concat(upcoming).slice(0,10).map(r=>'<div class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i data-lucide="clock" class="w-3.5 h-3.5 text-slate-600"></i>'+fmtDate(r.due)+' · '+(CONCEPTS[r.concept]?esc(CONCEPTS[r.concept].name):'')+' · stage '+(r.stage+1)+'/4</div>').join('')+'</div>';
  }
  if (mastered.length){
    h += '<div class="card p-4"><div class="text-[10px] uppercase tracking-widest text-emerald-400/80 mb-2">Mastered after review ('+mastered.length+')</div>'+
      mastered.slice(-10).reverse().map(r=>'<div class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i data-lucide="award" class="w-3.5 h-3.5 text-emerald-400"></i>'+(CONCEPTS[r.concept]?esc(CONCEPTS[r.concept].name):'')+' · '+esc(r.opgave)+' · mastered '+ago(r.masteredTs||r.due)+'</div>').join('')+'</div>';
  }
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.reviewSession = function(){
  DC.rq.items = Brain.dueReviews();
  DC.rq.i = 0; DC.rq.ok = 0;
  DC.reviewNext();
};
DC.reviewNext = function(){
  const box = document.getElementById('review-session');
  if (!box) return;
  if (DC.rq.i >= DC.rq.items.length){
    box.innerHTML = '<div class="card p-5 !border-emerald-500/40 text-center fade-in"><i data-lucide="party-popper" class="w-8 h-8 text-emerald-300 mx-auto mb-2"></i><div class="font-bold text-slate-100 mb-1">Session done: '+DC.rq.ok+'/'+DC.rq.items.length+' correct</div><div class="text-sm text-slate-400">Items you nailed move to the next interval; misses start over at 10 minutes. Come back when the header counter lights up.</div></div>';
    DC.icons(); DC.renderHeader();
    return;
  }
  const item = DC.rq.items[DC.rq.i];
  box.innerHTML = '<div class="card p-5 !border-indigo-500/40 fade-in"><div class="flex items-center justify-between mb-3"><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">Review '+(DC.rq.i+1)+' of '+DC.rq.items.length+' · stage '+(item.stage+1)+'/4'+(item.misconception?' · <span class="text-rose-300">misconception</span>':'')+'</div></div>'+
    (item.misconception?'<div class="text-xs text-rose-200/90 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2 mb-3">You were once confident-but-wrong here. Slow down: name the rule BEFORE answering.</div>':'')+
    '<div id="rq-box"></div><div id="rq-next" class="mt-3"></div></div>';
  DC.qStart('rq-box', item.snapshot, { module:item.module, opgave:item.opgave, qid:item.qid, noReview:true,
    onDone:function(sess){
      Brain.reviewAnswer(item, sess.ok, sess.conf);
      if (sess.ok) DC.rq.ok++;
      let msg = '';
      if (item.mastered) msg = '<span class="text-emerald-300 font-semibold">Mastered! This item retires from the queue.</span>';
      else if (sess.ok) msg = 'Next review: '+fmtDate(item.due)+'.';
      else msg = '<span class="text-rose-300">Back to stage 1 — it returns in 10 minutes.</span>';
      document.getElementById('rq-next').innerHTML = '<div class="text-xs text-slate-400 mb-2">'+msg+'</div><button onclick="DC.rq.i++;DC.reviewNext()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">'+(DC.rq.i+1>=DC.rq.items.length?'Finish session':'Next item →')+'</button>';
      DC.icons();
    }});
};

/* =====================================================================
   EXAM STRATEGY
   ===================================================================== */
DC.renderStrategy = function(){
  let h = '<div class="space-y-4 fade-in">';
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="target" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Exam Strategy — Modul 3.3 tactics</h2></div>'+
    '<p class="text-sm text-slate-400">Thirteen strategy cards covering every Opgave type, each with its own exam-trap warning. Read them the week before the test — and again the night before instead of cramming grammar.</p></div>';
  h += '<div class="grid md:grid-cols-2 gap-3">';
  STRATEGY.forEach(c=>{
    h += '<div class="card p-4"><div class="flex items-center gap-2 mb-2"><i data-lucide="'+c.icon+'" class="w-5 h-5 text-indigo-300 shrink-0"></i><div><div class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">'+esc(c.part)+'</div><div class="font-bold text-slate-100 text-sm">'+esc(c.title)+'</div></div></div>'+
      '<ul class="text-sm text-slate-300 space-y-1.5 list-disc list-inside mb-3">'+c.points.map(p=>'<li>'+esc(p)+'</li>').join('')+'</ul>'+
      '<div class="flex items-start gap-2 text-xs bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2"><i data-lucide="alert-triangle" class="w-4 h-4 text-amber-300 shrink-0 mt-0.5"></i><span class="text-amber-100">'+esc(c.trap)+'</span></div></div>';
  });
  h += '</div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};

/* =====================================================================
   INIT
   ===================================================================== */
document.addEventListener('DOMContentLoaded', function(){
  DC.load();
  DC.go('dashboard');
  DC.icons();
});
document.getElementById('modal').addEventListener('click', function(e){ if (e.target===this) DC.closeModal(); });


/* Dansk Coach — js/09-exam-engine.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   EXTENSION PACK 2 — engine upgrades: multi-task reading, mock exam,
   daily small talk, navigation
   ===================================================================== */

/* ---------- state additions ---------- */
(function(){
  const _ds = DC.defaultState;
  DC.defaultState = function(){
    const s = _ds();
    s.exams = [];
    s.smalltalk = { known:{}, doneDays:{} };
    return s;
  };
})();

/* ---------- navigation additions ---------- */
VIEW_TITLES.exam = 'Mock Exam — full test simulation';
VIEW_TITLES.talk = 'Hverdagsdansk — Daily Small Talk';
VIEW_TITLES.report = 'Coach Report — your full progress at a glance';
DC._goExamBase = function(view){
  DC.stopAllTimers();
  DC.view = view;
  const b = DC.state.behavior;
  b.moduleVisits[view] = (b.moduleVisits[view]||0)+1;
  document.querySelectorAll('.nav-btn').forEach(el=>el.classList.toggle('active', el.dataset.nav===view));
  const t = document.getElementById('header-title'); if (t) t.textContent = VIEW_TITLES[view]||view;
  const r = { dashboard:DC.renderDashboard, learn:DC.renderLearn, grammar:DC.renderGrammar,
    reading:DC.renderReading, writing:DC.renderWriting, oral:DC.renderOral,
    notebook:DC.renderNotebook, review:DC.renderReview, strategy:DC.renderStrategy,
    exam:DC.renderExam, talk:DC.renderTalk, today:DC.renderToday, report:DC.renderReport }[view];
  if (r) r();
  DC.save();
  window.scrollTo({top:0});
};
DC.go = function(view){
  if (DC.examLikeActive() && DC.view!==view){
    DC.confirmBox('Leave the exam?',
      'You are mid-sitting — leaving now stops your timer and abandons this attempt. It will not be scored.',
      'Yes, leave', function(){ DC.examS=null; DC.sim=null; DC.clearExamResume(); DC._goExamBase(view); });
    return;
  }
  DC._goExamBase(view);
};


/* ---------- multi-task CLOZE ---------- */
DC.rdCloze = function(){
  const tasks = [READING.cloze, READING.clozeB];
  const cur = DC.sub.clozeTask || 'cloze';
  const c = tasks.find(t=>t.id===cur) || tasks[0];
  DC.curCloze = c;
  const prev = (DC.state.reading.cloze||{})[c.id];
  let h = '<div class="max-w-3xl space-y-3"><div class="flex gap-2 flex-wrap">';
  tasks.forEach(t=> h += '<button onclick="DC.sub.clozeTask=\''+t.id+'\';DC.rdCloze();DC.icons()" class="px-3 py-1.5 rounded-lg text-xs font-semibold border '+(c.id===t.id?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400')+'">'+esc(t.title)+'</button>');
  h += '</div><div class="card p-5"><div class="flex items-center justify-between flex-wrap gap-2 mb-1"><h3 class="font-bold text-slate-100">'+c.opgave+': '+esc(c.title)+'</h3>'+(prev?'<span class="text-xs text-slate-500">last: '+prev.score+'/'+prev.total+'</span>':'')+'</div>';
  h += '<p class="text-xs text-slate-400 mb-4 bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-2">'+esc(c.instruction)+'</p>';
  h += '<div class="text-[11px] uppercase tracking-widest text-slate-500 mb-1.5">Ordbank</div><div class="flex flex-wrap gap-1.5 mb-3">'+c.bank.map(w=>'<span class="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">'+esc(w)+'</span>').join('')+'</div>';
  h += '<div class="prose-da text-[15px] leading-8 text-slate-200">';
  c.parts.forEach(p=>{
    if (typeof p === 'string') h += esc(p);
    else {
      h += '<select id="cz-'+p.g+'" class="gapsel mx-1"><option value="">— vælg —</option>';
      shuffle(c.bank.slice()).forEach(w=> h += '<option value="'+esc(w)+'">'+esc(w)+'</option>');
      h += '</select>';
    }
  });
  h += '</div><div id="cz-fb" class="mt-4 space-y-2"></div>';
  h += '<button onclick="DC.czCheck()" class="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Check answers</button>';
  h += '<div id="cz-conf"></div></div></div>';
  document.getElementById('reading-body').innerHTML = h;
  DC.rdStartTs = Date.now();
};
DC.czCheck = function(){
  const c = DC.curCloze || READING.cloze;
  let unfilled = false;
  c.gaps.forEach((g,i)=>{ if (document.getElementById('cz-'+i).value==='') unfilled = true; });
  if (unfilled){ DC.toast('Fill every gap first — on the real test you never leave blanks.','warn'); return; }
  const items = []; let fb = '';
  c.gaps.forEach((g,i)=>{
    const sel = document.getElementById('cz-'+i);
    const chosen = sel.value;
    const ok = chosen===g.correct;
    sel.classList.add(ok?'opt-correct':'opt-wrong'); sel.disabled = true;
    fb += '<div class="text-sm rounded-xl px-3 py-2 border '+(ok?'bg-emerald-500/10 border-emerald-500/30':'bg-rose-500/10 border-rose-500/30')+'"><b>Gap '+(i+1)+':</b> '+(ok?'✓':'✗ you chose "'+esc(chosen)+'" —')+' correct is <b>"'+esc(g.correct)+'"</b>. '+esc(g.why)+'</div>';
    items.push({ concept:c.concept, qid:c.id+'-g'+i, question:'Cloze "'+c.title+'", gap '+(i+1),
      userAnswer:chosen, correctAnswer:g.correct, ok,
      mistakeType:'Wrong word in context', explanation:g.why,
      snapshot:{ kind:'mc', tag:'Opgave 1 · Cloze', prompt:'Choose the word that fits: "…'+esc(stringAroundGap(c,i))+'…"', options:c.bank.map(w=>({text:w, ok:w===g.correct, mistakeType:'Wrong word in context', why:g.why})), explanation:g.why, concept:c.concept } });
  });
  document.getElementById('cz-fb').innerHTML = fb;
  DC.pendingReading = { items, opgave:'Opgave 1 (cloze)', store:'cloze', taskKey:c.id, time:Math.round((Date.now()-DC.rdStartTs)/1000), confBox:'cz-conf' };
  DC.readingAskConf('cz-conf');
};

/* ---------- multi-task OPGAVE 3 ---------- */
DC.rdO3 = function(){
  const tasks = [READING.o3, READING.o3b];
  const cur = DC.sub.o3Task || 'o3';
  const t = tasks.find(x=>x.id===cur) || tasks[0];
  DC.curO3 = t;
  const prev = (DC.state.reading.o3||{})[t.id];
  let h = '<div class="max-w-3xl space-y-3"><div class="flex gap-2 flex-wrap">';
  tasks.forEach(x=> h += '<button onclick="DC.sub.o3Task=\''+x.id+'\';DC.rdO3();DC.icons()" class="px-3 py-1.5 rounded-lg text-xs font-semibold border '+(t.id===x.id?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400')+'">'+esc(x.title)+'</button>');
  h += '</div><div class="card p-5"><div class="flex items-center justify-between flex-wrap gap-2"><h3 class="font-bold text-slate-100">'+t.opgave+': '+esc(t.title)+'</h3>'+
    '<div class="flex items-center gap-2 text-sm"><i data-lucide="timer" class="w-4 h-4 text-amber-300"></i><span id="o3-timer" class="font-mono font-bold text-amber-300">12:00</span><button onclick="DC.startTimer(\'o3\',720,\'o3-timer\',function(){DC.toast(\'12 minutes are up — submit what you have.\',\'warn\')})" class="text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-2 py-1">Start 12 min</button>'+(prev?'<span class="text-xs text-slate-500 ml-2">last: '+prev.score+'/'+prev.total+'</span>':'')+'</div></div>';
  h += '<p class="text-xs text-slate-400 mt-2 mb-4 bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-2">'+esc(t.instruction)+'</p>';
  t.paragraphs.forEach((p,i)=>{
    h += '<div class="mb-5 pb-5 border-b border-slate-800"><div class="text-[15px] leading-7 text-slate-200"><b class="text-slate-500 mr-1">'+(i+1)+'.</b>'+esc(p.pre)+'<span id="o3-gap-'+i+'" class="inline-block min-w-[8rem] border-b-2 border-dashed border-indigo-400 text-indigo-300 text-sm px-2">________________</span>'+esc(p.post)+'</div>';
    h += '<div class="grid gap-1.5 mt-3">';
    shuffle(p.options.map((o,j)=>j)).forEach((j,pos)=>{
      h += '<button id="o3-'+i+'-'+j+'" onclick="DC.o3Pick('+i+','+j+')" class="opt-btn text-left text-sm px-3 py-2 rounded-xl bg-slate-900 border border-slate-700"><b class="text-indigo-300 mr-1">'+String.fromCharCode(65+pos)+'.</b>'+esc(p.options[j].text)+'</button>';
    });
    h += '</div><div id="o3-fb-'+i+'" class="mt-2"></div></div>';
  });
  if (t.extra){
    h += '<div class="mb-4" id="o3-extra"><div class="font-semibold text-sm text-slate-100 mb-2">'+esc(t.extra.q)+'</div><div class="grid gap-1.5">';
    shuffle(t.extra.options.map((o,j)=>j)).forEach(j=> h += '<button id="o3x-'+j+'" onclick="DC.o3PickX('+j+')" class="opt-btn text-left text-sm px-3 py-2 rounded-xl bg-slate-900 border border-slate-700">'+esc(t.extra.options[j].text)+'</button>');
    h += '</div><div id="o3-fb-x" class="mt-2"></div></div>';
  }
  h += '<button onclick="DC.o3Check()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Check answers</button><div id="o3-conf"></div></div></div>';
  document.getElementById('reading-body').innerHTML = h;
  DC.o3Sel = {}; DC.o3SelX = null; DC.rdStartTs = Date.now();
};
DC.o3Pick = function(i,j){
  if (DC.o3Locked) return;
  const t = DC.curO3;
  DC.o3Sel[i]=j;
  t.paragraphs[i].options.forEach((o,k)=> document.getElementById('o3-'+i+'-'+k).classList.toggle('!border-indigo-400', k===j));
  document.getElementById('o3-gap-'+i).textContent = t.paragraphs[i].options[j].text;
};
DC.o3PickX = function(j){
  if (DC.o3Locked) return;
  DC.o3SelX=j;
  DC.curO3.extra.options.forEach((o,k)=> document.getElementById('o3x-'+k).classList.toggle('!border-indigo-400', k===j));
};
DC.o3Check = function(){
  const t = DC.curO3;
  if (Object.keys(DC.o3Sel).length < t.paragraphs.length || (t.extra && DC.o3SelX===null)){ DC.toast('Choose a sentence for every paragraph'+(t.extra?' and answer the bonus question':'')+'.','warn'); return; }
  DC.stopTimer('o3'); DC.o3Locked = true;
  const items = [];
  t.paragraphs.forEach((p,i)=>{
    const j = DC.o3Sel[i], ok = p.options[j].ok;
    p.options.forEach((o,k)=>{
      const el = document.getElementById('o3-'+i+'-'+k);
      el.disabled = true;
      if (o.ok) el.classList.add('opt-correct');
      if (k===j && !o.ok) el.classList.add('opt-wrong');
    });
    const correct = p.options.find(o=>o.ok);
    document.getElementById('o3-fb-'+i).innerHTML = '<div class="text-xs rounded-lg px-2.5 py-2 '+(ok?'bg-emerald-500/10 text-emerald-200':'bg-rose-500/10 text-rose-200')+'">'+(ok?'✓ ':'✗ ')+esc(correct.why)+(!ok?'<br><b>Your choice fails because:</b> '+esc(p.options[j].why):'')+'</div>';
    items.push({ concept:t.concept, qid:t.id+'-p'+i, question:'"'+t.title+'" — missing sentence in paragraph '+(i+1),
      userAnswer:p.options[j].text, correctAnswer:correct.text, ok,
      mistakeType:'Coherence / text-structure error', explanation:correct.why,
      snapshot:{ kind:'mc', tag:'Opgave 3 · Indsæt sætning', prompt:'Which sentence fits the gap?<br><span class="text-xs text-slate-400">'+esc(p.pre)+' ____ '+esc(p.post)+'</span>', options:p.options, explanation:correct.why, concept:t.concept } });
  });
  if (t.extra){
    const xo = t.extra.options[DC.o3SelX], xc = t.extra.options.find(o=>o.ok);
    t.extra.options.forEach((o,k)=>{ const el=document.getElementById('o3x-'+k); el.disabled=true; if(o.ok) el.classList.add('opt-correct'); if(k===DC.o3SelX&&!o.ok) el.classList.add('opt-wrong'); });
    document.getElementById('o3-fb-x').innerHTML = '<div class="text-xs rounded-lg px-2.5 py-2 '+(xo.ok?'bg-emerald-500/10 text-emerald-200':'bg-rose-500/10 text-rose-200')+'">'+(xo.ok?'✓ ':'✗ ')+esc(xc.why)+(!xo.ok?'<br>'+esc(xo.why):'')+'</div>';
    items.push({ concept:t.extra.concept, qid:t.id+'-extra', question:t.extra.q, userAnswer:xo.text, correctAnswer:xc.text, ok:xo.ok,
      mistakeType:'Main-idea / inference error', explanation:xc.why,
      snapshot:{ kind:'mc', tag:'Opgave 3 · Main idea', prompt:t.extra.q+' (text: "'+t.title+'")', options:t.extra.options, explanation:xc.why, concept:t.extra.concept } });
  }
  DC.pendingReading = { items, opgave:'Opgave 3', store:'o3', taskKey:t.id, time:Math.round((Date.now()-DC.rdStartTs)/1000), confBox:'o3-conf' };
  DC.o3Locked = false;
  DC.readingAskConf('o3-conf');
};

/* relabel persons A/B/C (etc.) freshly each attempt, so 'question 3 = C' can't be memorised —
   content stays the same, only which letter points at which person changes. Shared by practice
   (DC.rdO4), the Mock Exam and the Exam Simulation, so retaking any of them re-shuffles too. */
function relabelO4(base){
  const shuffledLabels = shuffle(base.persons.map(x=>x.label));
  const relabel = {};
  base.persons.forEach((p,idx)=>{ relabel[p.label] = shuffledLabels[idx]; });
  return Object.assign({}, base, {
    persons: base.persons.map(p=>Object.assign({}, p, { label: relabel[p.label] })).sort((a,b)=>a.label.localeCompare(b.label)),
    questions: base.questions.map(q=>Object.assign({}, q, { answer: relabel[q.answer] })),
    example: Object.assign({}, base.example, { answer: relabel[base.example.answer] })
  });
}
/* same idea for chat reply lettering (A–F): fixed data-file letters would otherwise let a
   retake be solved by memorising "svar 2 = B" instead of re-reading the dialogue */
function relabelChat(ch){
  const letters = ch.options.map(o=>o.letter);
  const shuffled = shuffle(letters.slice());
  const relabel = {};
  letters.forEach((old,idx)=>{ relabel[old] = shuffled[idx]; });
  return Object.assign({}, ch, {
    options: ch.options.map(o=>Object.assign({}, o, { letter: relabel[o.letter] })).sort((a,b)=>a.letter.localeCompare(b.letter)),
    turns: ch.turns.map(t=>Object.assign({}, t, { correct: relabel[t.correct] }))
  });
}
/* ---------- multi-task OPGAVE 4 ---------- */
DC.rdO4 = function(){
  const tasks = [READING.o4, READING.o4b];
  const cur = DC.sub.o4Task || 'o4';
  const base = tasks.find(x=>x.id===cur) || tasks[0];
  const t = relabelO4(base);
  DC.curO4 = t;
  const prev = (DC.state.reading.o4||{})[t.id];
  let h = '<div class="space-y-3"><div class="flex gap-2 flex-wrap">';
  tasks.forEach(x=> h += '<button onclick="DC.sub.o4Task=\''+x.id+'\';DC.rdO4();DC.icons()" class="px-3 py-1.5 rounded-lg text-xs font-semibold border '+(t.id===x.id?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400')+'">'+esc(x.title)+'</button>');
  h += '</div><div class="card p-5"><div class="flex items-center justify-between flex-wrap gap-2"><h3 class="font-bold text-slate-100">'+t.opgave+': '+esc(t.title)+'</h3>'+(prev?'<span class="text-xs text-slate-500">last: '+prev.score+'/'+prev.total+'</span>':'')+'</div>';
  h += '<p class="text-xs text-slate-400 mt-2 mb-4 bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-2">'+esc(t.instruction)+'</p>';
  h += '<div class="grid lg:grid-cols-3 gap-3 mb-5">';
  t.persons.forEach(p=> h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-4"><div class="font-bold text-indigo-300 mb-2">'+p.label+'. '+esc(p.name)+'</div><div class="text-sm text-slate-300 leading-6">'+esc(p.text)+'</div></div>');
  h += '</div>';
  h += '<div class="overflow-x-auto"><table class="w-full text-sm"><tr class="text-left text-[10px] uppercase tracking-wider text-slate-500"><th class="py-2 pr-2"></th><th class="py-2 pr-2">Spørgsmål</th>'+t.persons.map(p=>'<th class="py-2 px-3 text-center">'+esc(p.name)+'</th>').join('')+'</tr>';
  h += '<tr class="border-t border-slate-800 text-slate-400"><td class="py-2 pr-2">0.</td><td class="py-2 pr-2 italic">'+esc(t.example.q)+' <span class="text-[10px] text-slate-500">(eksempel)</span></td>'+t.persons.map(p=>'<td class="text-center">'+(p.label===t.example.answer?'<span class="text-emerald-300 font-bold">✗</span>':'')+'</td>').join('')+'</tr>';
  t.questions.forEach((q,i)=>{
    h += '<tr class="border-t border-slate-800"><td class="py-2 pr-2 text-slate-500">'+(i+1)+'.</td><td class="py-2 pr-2">'+esc(q.q)+'<div id="o4-fb-'+i+'"></div></td>';
    t.persons.forEach(p=>{
      h += '<td class="text-center px-3"><button id="o4-'+i+'-'+p.label+'" onclick="DC.o4Pick('+i+',\''+p.label+'\')" class="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 hover:border-indigo-400 font-bold text-slate-400">'+p.label+'</button></td>';
    });
    h += '</tr>';
  });
  h += '</table></div>';
  h += '<button onclick="DC.o4Check()" class="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Check answers</button><div id="o4-conf"></div></div></div>';
  document.getElementById('reading-body').innerHTML = h;
  DC.o4Sel = {}; DC.rdStartTs = Date.now();
};
DC.o4Pick = function(i, label){
  if (DC.o4Locked) return;
  DC.o4Sel[i]=label;
  DC.curO4.persons.forEach(p=>{
    const el = document.getElementById('o4-'+i+'-'+p.label);
    el.classList.toggle('!border-indigo-400', p.label===label);
    el.classList.toggle('text-indigo-200', p.label===label);
  });
};
DC.o4Check = function(){
  const t = DC.curO4;
  if (Object.keys(DC.o4Sel).length < t.questions.length){ DC.toast('Answer all seven questions first.','warn'); return; }
  DC.o4Locked = true;
  const items = [];
  t.questions.forEach((q,i)=>{
    const chosen = DC.o4Sel[i], ok = chosen===q.answer;
    t.persons.forEach(p=>{
      const el = document.getElementById('o4-'+i+'-'+p.label); el.disabled=true;
      if (p.label===q.answer) el.classList.add('opt-correct');
      if (p.label===chosen && !ok) el.classList.add('opt-wrong');
    });
    document.getElementById('o4-fb-'+i).innerHTML = '<div class="text-xs mt-1 rounded-lg px-2 py-1.5 '+(ok?'bg-emerald-500/10 text-emerald-200':'bg-rose-500/10 text-rose-200')+'">'+(ok?'✓ ':'✗ Correct: '+q.answer+'. ')+esc(q.why)+'</div>';
    items.push({ concept:t.concept, qid:t.id+'-q'+i, question:'"'+t.title+'": '+q.q,
      userAnswer:'Person '+chosen, correctAnswer:'Person '+q.answer+' ('+t.persons.find(p=>p.label===q.answer).name+')', ok,
      mistakeType:'Matching / detail-trap error', explanation:q.why,
      snapshot:{ kind:'mc', tag:'Opgave 4 · Matching', prompt:q.q+'<br><span class="text-xs text-slate-400">(Texts: '+t.persons.map(p=>p.name).join(', ')+' — "'+esc(t.title)+'". Recall the evidence.)</span>',
        options:t.persons.map(p=>({text:p.label+'. '+p.name, ok:p.label===q.answer, mistakeType:'Wrong person', why:q.why})), explanation:q.why, concept:t.concept } });
  });
  DC.pendingReading = { items, opgave:'Opgave 4', store:'o4', taskKey:t.id, time:Math.round((Date.now()-DC.rdStartTs)/1000), confBox:'o4-conf' };
  DC.o4Locked = false;
  DC.readingAskConf('o4-conf');
};

/* =====================================================================
   MOCK EXAM ENGINE
   ===================================================================== */
DC.renderExam = function(){
  if (!DC.examS || DC.examS.phase==='intro') return DC.examIntro();
  DC.saveExamResume();
  if (DC.examS.phase==='reading') return DC.examReadingRender();
  if (DC.examS.phase==='rdone') return DC.examReadingResult();
  if (DC.examS.phase==='writing') return DC.examWritingRender();
  if (DC.examS.phase==='wscore') return DC.examRubricRender();
  if (DC.examS.phase==='report') return DC.examReport();
};
const EXAM_PHASE_LABEL = { reading:'Læsning', rdone:'Læsning results', writing:'Skrivning', wscore:'Skrivning self-score',
  rres:'Læsning results', wrub:'Skrivning self-score', oral1:'Mundtlig Opgave 1', oral2:'Mundtlig Opgave 2' };
DC.examIntro = function(){
  const hist = DC.state.exams||[];
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  const resume = DC.checkExamResume();
  if (resume && resume.kind==='exam'){
    h += '<div class="card p-5 !border-amber-500/50 bg-amber-500/5"><div class="flex items-center gap-3 flex-wrap"><i data-lucide="rotate-ccw" class="w-6 h-6 text-amber-300 shrink-0"></i><div class="flex-1 min-w-[200px]"><div class="font-bold text-slate-100">Unfinished sitting found</div><div class="text-xs text-slate-400">You left mid-exam during '+(EXAM_PHASE_LABEL[resume.phase]||resume.phase)+'. Resume with your time remaining, or discard and start fresh.</div></div>'+
      '<button onclick="DC.resumeExam()" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold">Resume</button>'+
      '<button onclick="DC.clearExamResume();DC.renderExam()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs">Discard</button></div></div>';
  }
  h += '<div class="card p-6"><div class="flex items-center gap-3 mb-3"><div class="w-11 h-11 rounded-xl bg-rose-500/15 flex items-center justify-center"><i data-lucide="clipboard-check" class="w-6 h-6 text-rose-300"></i></div><div><h2 class="font-bold text-lg text-slate-100">Full Mock Exam — Modul 3.3</h2><div class="text-xs text-slate-400">Fresh tasks you have NOT seen in practice. Exam conditions.</div></div></div>'+
    '<div class="grid md:grid-cols-2 gap-3 mb-4">'+
    '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-4"><div class="font-semibold text-sm text-slate-100 mb-1 flex items-center gap-2"><i data-lucide="file-search" class="w-4 h-4 text-indigo-300"></i>Del 1 · Læsning — '+EXAM.readingMinutes+' min</div><ul class="text-xs text-slate-400 space-y-1 list-disc list-inside"><li>Opgave 1: cloze (6 huller)</li><li>Opgave 2A: to chat-tråde (3+3 svar)</li><li>Opgave 3: indsæt sætninger (5 afsnit)</li><li>Opgave 4: match personer (7 spørgsmål)</li><li>Scored automatically — 24 points</li></ul></div>'+
    '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-4"><div class="font-semibold text-sm text-slate-100 mb-1 flex items-center gap-2"><i data-lucide="pen-line" class="w-4 h-4 text-indigo-300"></i>Del 2 · Skrivning — 2×'+EXAM.writingMinutes+' min</div><ul class="text-xs text-slate-400 space-y-1 list-disc list-inside"><li>Opgave 1: halvformel klage ('+EXAM.writingMinutes+' min, own timer)</li><li>Opgave 2: e-mail-svar, min. 90 ord ('+EXAM.writingMinutes+' min, own timer)</li><li>Scored by YOU against a model + 10-point rubric per task</li><li>20 points</li></ul></div></div>'+
    '<div class="text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mb-4"><b>Exam rules (as on the real test):</b> Del 1 Læsning — no aids at all. Del 2 Skrivning — dictionaries and the verbeliste ARE allowed on the real test, so keep one within reach and practice looking things up fast. Each writing task gets its OWN '+EXAM.writingMinutes+'-minute clock, just like the real test. No Learn Mode, no hints, no leaving this page (answers are not saved until you submit each part). Find '+(EXAM.readingMinutes+2*EXAM.writingMinutes)+' quiet minutes. Wrong answers are explained afterwards and added to your Error Notebook — even the exam teaches.</div>'+
    '<label class="flex items-start gap-2.5 text-sm text-slate-300 cursor-pointer bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2.5 mb-4"><input type="checkbox" id="exam-dress-toggle" class="mt-0.5 accent-indigo-500"><span><b class="text-slate-100">Eksamensdag mode</b> — hide your Del 1 score until the very end. On the real test you never see the reading result before writing Del 2; this rehearses that exact feeling instead of easing your nerves early.</span></label>'+
    '<button onclick="DC.examStart(document.getElementById(\'exam-dress-toggle\').checked)" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2"><i data-lucide="play" class="w-4 h-4"></i>Start Del 1 · Læsning ('+EXAM.readingMinutes+' min)</button></div>';
  if (hist.length){
    h += '<div class="card p-5"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Your exam history</div>';
    hist.slice().reverse().forEach(e=>{
      h += '<div class="flex items-center gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5 mb-2"><span class="text-xs text-slate-500 w-32 shrink-0">'+fmtDate(e.ts)+'</span>'+
        '<div class="flex-1">'+bar(e.overall, e.overall>=80?'bg-emerald-500':e.overall>=65?'bg-amber-500':'bg-rose-500')+'</div>'+
        '<span class="text-sm font-bold w-12 text-right '+(e.overall>=80?'text-emerald-300':e.overall>=65?'text-amber-300':'text-rose-300')+'">'+e.overall+'%</span>'+
        '<span class="text-[10px] text-slate-500 w-28 text-right">read '+e.reading.score+'/'+e.reading.total+' · write '+e.writing.self+'/'+e.writing.total+'</span></div>';
    });
    h += '</div>';
  }
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.examStart = function(dress){
  DC.examS = { phase:'reading', start:Date.now(), dress:!!dress };
  DC.renderExam();
  DC.startTimer('exam-read', EXAM.readingMinutes*60, 'exam-timer', function(){
    DC.toast('Time is up! Submitting your reading answers now.','err');
    DC.examReadingSubmit(true);
  });
};
/* resume an abandoned sitting: restores the PHASE and remaining TIME, not
   in-progress DOM selections within that phase — see DC.saveExamResume. */
DC.resumeExam = function(){
  const snap = DC.checkExamResume();
  if (!snap) return;
  DC.clearExamResume();
  const left = snap.endTs ? Math.round((snap.endTs-Date.now())/1000) : null;
  if (snap.kind==='exam'){
    DC.go('exam');
    DC.examS = { phase:snap.phase, start:snap.start||Date.now(), dress:!!snap.dress };
    DC.renderExam();
    if (snap.phase==='reading' && left>0) DC.startTimer('exam-read', left, 'exam-timer', function(){ DC.toast('Time is up! Submitting your reading answers now.','err'); DC.examReadingSubmit(true); });
    else if (snap.phase==='writing' && left>0) DC.startTimer('exam-write', left, 'exam-timer', function(){ DC.toast('Writing time is up — submit now.','err'); });
  } else if (snap.kind==='sim'){
    DC.go('sim');
    DC.sim = { phase:snap.phase, si:snap.si, t0:snap.t0||Date.now(), times:snap.times||{}, dress:!!snap.dress };
    DC.renderSim();
    if (snap.phase==='reading' && left>0) DC.startTimer('sim-read', left, 'sim-timer', function(){ DC.toast('50 minutes — reading auto-submitted.','err'); DC.simReadSubmit(true); });
    else if (snap.phase==='writing' && left>0) DC.startTimer('sim-write', left, 'sim-timer', function(){ DC.toast('45 minutes — writing closes now.','err'); });
  }
  DC.toast('Resumed where you left off.','ok');
};
function examSelect(id, opts){
  let h = '<select id="'+id+'" class="gapsel mx-1"><option value="">— vælg —</option>';
  opts.forEach(o=> h += '<option value="'+o.v+'">'+esc(o.t)+'</option>');
  return h+'</select>';
}
DC.examReadingRender = function(){
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<div class="card p-4 sticky top-16 lg:top-20 z-30 !bg-slate-950/95 flex items-center gap-3"><i data-lucide="file-search" class="w-5 h-5 text-rose-300"></i><div class="font-bold text-slate-100 text-sm">Mock Exam · Del 1 Læsning</div><div class="ml-auto flex items-center gap-2"><i data-lucide="timer" class="w-4 h-4 text-amber-300"></i><span id="exam-timer" class="font-mono font-bold text-amber-300 text-lg">'+fmtTime(EXAM.readingMinutes*60)+'</span></div></div>';
  // Opgave 1 cloze
  const c = EXAM.cloze;
  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-1">Opgave 1: '+esc(c.title)+'</h3><p class="text-xs text-slate-400 mb-3">'+esc(c.instruction)+'</p>'+
    '<div class="text-[11px] uppercase tracking-widest text-slate-500 mb-1.5">Ordbank</div><div class="flex flex-wrap gap-1.5 mb-3">'+c.bank.map(w=>'<span class="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">'+esc(w)+'</span>').join('')+'</div>'+
    '<div class="text-[15px] leading-8 text-slate-200">';
  c.parts.forEach(p=>{
    if (typeof p==='string') h += esc(p);
    else h += examSelect('exc-'+p.g, shuffle(c.bank.map(w=>({v:w,t:w}))));
  });
  h += '</div></div>';
  // Opgave 2A chat — the official test has TWO separate chat threads per sitting
  const CHATS = DC.examS.chatsShuffled || (DC.examS.chatsShuffled = [relabelChat(EXAM.chat), relabelChat(EXAM.chat2)]);
  CHATS.forEach((ch,ci)=>{
    h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-1">Opgave 2A · chat '+(ci+1)+': '+esc(ch.title)+'</h3><p class="text-xs text-slate-400 mb-3"><b>'+esc(ch.situation)+'</b><br>'+esc(ch.instruction)+'</p>';
    h += '<div class="grid lg:grid-cols-5 gap-4"><div class="lg:col-span-3 space-y-3">';
    h += chatBubble(ch.personX, ch.example.x);
    h += '<div class="flex justify-end"><div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl rounded-tr-sm px-3 py-2 text-sm max-w-[85%]"><div class="text-[10px] uppercase font-bold text-emerald-300 mb-0.5">'+esc(ch.personY)+' · eksempel (0) = Z</div>'+esc(ch.example.reply)+'</div></div>';
    ch.turns.forEach((t,i)=>{
      h += chatBubble(ch.personX, t.x);
      h += '<div class="flex justify-end"><div class="bg-slate-800/80 border border-slate-700 rounded-2xl rounded-tr-sm px-3 py-2 text-sm w-[85%]"><div class="text-[10px] uppercase font-bold text-slate-400 mb-1">'+esc(ch.personY)+' · svar '+(i+1)+'</div>'+
        examSelect('exch-'+ci+'-'+i, ch.options.map(o=>({v:o.letter, t:o.letter+': '+(o.text.length>55?o.text.slice(0,55)+'…':o.text)})))+'</div></div>';
    });
    h += '</div><div class="lg:col-span-2"><div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Svar A–'+ch.options[ch.options.length-1].letter+'</div><div class="space-y-2">';
    ch.options.forEach(o=> h += '<div class="text-xs bg-slate-800/70 border border-slate-700 rounded-lg px-2.5 py-2"><b class="text-indigo-300">'+o.letter+':</b> '+esc(o.text)+'</div>');
    h += '</div></div></div></div></div>';
  });
  // Opgave 3
  const o3 = EXAM.o3;
  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-1">Opgave 3: '+esc(o3.title)+'</h3><p class="text-xs text-slate-400 mb-3">'+esc(o3.instruction)+'</p>';
  o3.paragraphs.forEach((p,i)=>{
    const ord = shuffle(p.options.map((o,j)=>j));
    h += '<div class="mb-4 pb-4 border-b border-slate-800"><div class="text-sm leading-7 text-slate-200"><b class="text-slate-500 mr-1">'+(i+1)+'.</b>'+esc(p.pre)+'<span class="text-indigo-300">[ ____ ]</span>'+esc(p.post)+'</div>'+
      '<div class="mt-2 text-sm">Vælg: '+examSelect('exo3-'+i, ord.map((j,pos)=>({v:j, t:String.fromCharCode(65+pos)+'. '+(p.options[j].text.length>70?p.options[j].text.slice(0,70)+'…':p.options[j].text)})))+'</div>'+
      '<div class="grid gap-1 mt-1.5">'+ord.map((j,pos)=>'<div class="text-xs text-slate-400"><b class="text-indigo-300">'+String.fromCharCode(65+pos)+'.</b> '+esc(p.options[j].text)+'</div>').join('')+'</div></div>';
  });
  h += '</div>';
  // Opgave 4
  const o4 = DC.examS.o4Shuffled || (DC.examS.o4Shuffled = relabelO4(EXAM.o4));
  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-1">Opgave 4: '+esc(o4.title)+'</h3><p class="text-xs text-slate-400 mb-3">'+esc(o4.instruction)+'</p><div class="grid lg:grid-cols-3 gap-3 mb-4">';
  o4.persons.forEach(p=> h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3"><div class="font-bold text-indigo-300 mb-1">'+p.label+'. '+esc(p.name)+'</div><div class="text-xs text-slate-300 leading-5">'+esc(p.text)+'</div></div>');
  h += '</div><div class="text-xs text-slate-500 mb-2">Eksempel (0): '+esc(o4.example.q)+' → <b class="text-emerald-300">'+o4.example.answer+'</b></div>';
  o4.questions.forEach((q,i)=>{
    h += '<div class="flex items-center gap-2 mb-1.5 text-sm"><span class="text-slate-500 w-5">'+(i+1)+'.</span><span class="flex-1">'+esc(q.q)+'</span>'+examSelect('exo4-'+i, o4.persons.map(p=>({v:p.label, t:p.label+' ('+p.name+')'})))+'</div>';
  });
  h += '</div>';
  h += '<div class="card p-4 flex items-center gap-3"><button onclick="DC.examReadingSubmit()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">Submit Del 1 · Læsning</button><span class="text-xs text-slate-500">24 answers in total. Unanswered counts as wrong — just like the real test.</span></div>';
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.examReadingSubmit = function(auto){
  const CHATS = DC.examS.chatsShuffled || (DC.examS.chatsShuffled = [relabelChat(EXAM.chat), relabelChat(EXAM.chat2)]);
  const o4 = DC.examS.o4Shuffled || (DC.examS.o4Shuffled = relabelO4(EXAM.o4));
  if (!auto){
    let missing = 0;
    EXAM.cloze.gaps.forEach((g,i)=>{ if(!document.getElementById('exc-'+i) || document.getElementById('exc-'+i).value==='') missing++; });
    CHATS.forEach((ch,ci)=> ch.turns.forEach((t,i)=>{ if(document.getElementById('exch-'+ci+'-'+i).value==='') missing++; }));
    EXAM.o3.paragraphs.forEach((p,i)=>{ if(document.getElementById('exo3-'+i).value==='') missing++; });
    o4.questions.forEach((q,i)=>{ if(document.getElementById('exo4-'+i).value==='') missing++; });
    if (missing>0 && !DC.examS.warned){ DC.examS.warned = true; DC.toast(missing+' answer'+(missing>1?'s are':' is')+' still empty. Press submit again to hand in anyway.','warn'); return; }
  }
  DC.stopTimer('exam-read');
  const det = { cloze:[], chat:[], o3:[], o4:[] };
  const rec = [];
  const val = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  EXAM.cloze.gaps.forEach((g,i)=>{
    const v = val('exc-'+i); const ok = v!=='' && v===g.correct;
    det.cloze.push({ label:'Gap '+(i+1), your:(v===''?'(blank)':v), correct:g.correct, ok, why:g.why });
    rec.push({ concept:EXAM.cloze.concept, qid:'ex-cz-'+i, question:'Exam cloze "'+EXAM.cloze.title+'", gap '+(i+1), userAnswer:(v===''?'(blank)':v), correctAnswer:g.correct, ok, mistakeType:'Wrong word in context', explanation:g.why,
      snapshot:{ kind:'mc', tag:'Exam · Cloze', prompt:'Choose the word that fits (from the mock exam, "'+EXAM.cloze.title+'"), gap '+(i+1)+':', options:EXAM.cloze.bank.map(w=>({text:w, ok:w===g.correct, mistakeType:'Wrong word in context', why:g.why})), explanation:g.why, concept:EXAM.cloze.concept } });
  });
  CHATS.forEach((ch,ci)=> ch.turns.forEach((t,i)=>{
    const v = val('exch-'+ci+'-'+i); const ok = v===t.correct;
    const chosen = ch.options.find(o=>o.letter===v);
    det.chat.push({ label:'Chat '+(ci+1)+' · svar '+(i+1), your:(v===''?'(blank)':v), correct:t.correct, ok, why:t.why });
    const distractors = ch.options.filter(o=>o.letter!==t.correct && o.distractorWhy).slice(0,3);
    rec.push({ concept:ch.concept, qid:'ex-ch'+ci+'-'+i, question:'Exam chat "'+ch.title+'": reply to "'+t.x+'"', userAnswer:(chosen?v+': '+chosen.text:'(blank)'), correctAnswer:t.correct+': '+ch.options.find(o=>o.letter===t.correct).text, ok, mistakeType:'Reply does not fit the dialogue flow', explanation:t.why,
      snapshot:{ kind:'mc', tag:'Exam · Chat', prompt:esc(ch.personX)+' writes: "'+t.x+'" — choose the reply:', options: shuffle([{text:ch.options.find(o=>o.letter===t.correct).text, ok:true, why:t.why}].concat(distractors.map(d=>({text:d.text, ok:false, mistakeType:'Does not fit the flow', why:d.distractorWhy})))), explanation:t.why, concept:ch.concept } });
  }));
  EXAM.o3.paragraphs.forEach((p,i)=>{
    const v = val('exo3-'+i); const ok = v!=='' && p.options[parseInt(v,10)].ok;
    const correct = p.options.find(o=>o.ok);
    det.o3.push({ label:'Afsnit '+(i+1), your:(v===''?'(blank)':'"'+p.options[parseInt(v,10)].text.slice(0,60)+'…"'), correct:'"'+correct.text.slice(0,60)+'…"', ok, why:correct.why });
    rec.push({ concept:EXAM.o3.concept, qid:'ex-o3-'+i, question:'Exam "'+EXAM.o3.title+'" — missing sentence, paragraph '+(i+1), userAnswer:(v===''?'(blank)':p.options[parseInt(v,10)].text), correctAnswer:correct.text, ok, mistakeType:'Coherence / text-structure error', explanation:correct.why,
      snapshot:{ kind:'mc', tag:'Exam · Indsæt sætning', prompt:'Which sentence fits the gap?<br><span class="text-xs text-slate-400">'+esc(p.pre)+' ____ '+esc(p.post)+'</span>', options:p.options, explanation:correct.why, concept:EXAM.o3.concept } });
  });
  o4.questions.forEach((q,i)=>{
    const v = val('exo4-'+i); const ok = v===q.answer;
    det.o4.push({ label:'Spm. '+(i+1), your:(v===''?'(blank)':v), correct:q.answer, ok, why:q.why });
    rec.push({ concept:o4.concept, qid:'ex-o4-'+i, question:'Exam "'+o4.title+'": '+q.q, userAnswer:'Person '+(v||'(blank)'), correctAnswer:'Person '+q.answer, ok, mistakeType:'Matching / detail-trap error', explanation:q.why,
      snapshot:{ kind:'mc', tag:'Exam · Matching', prompt:q.q+'<br><span class="text-xs text-slate-400">("'+esc(o4.title)+'" — recall the evidence.)</span>', options:o4.persons.map(p=>({text:p.label+'. '+p.name, ok:p.label===q.answer, mistakeType:'Wrong person', why:q.why})), explanation:q.why, concept:o4.concept } });
  });
  const time = Math.round((Date.now()-DC.examS.start)/1000);
  rec.forEach(r=>{ r.module='Mock Exam'; r.opgave='Exam · Læsning'; r.correct=r.ok; r.confidence='sure'; r.hintsUsed=0; r.timeSpent=Math.round(time/rec.length); Brain.record(r); });
  const score = s => s.filter(x=>x.ok).length;
  DC.examS.reading = { det,
    sections:{ cloze:[score(det.cloze),det.cloze.length], chat:[score(det.chat),det.chat.length], o3:[score(det.o3),det.o3.length], o4:[score(det.o4),det.o4.length] },
    score: score(det.cloze)+score(det.chat)+score(det.o3)+score(det.o4), total: 24, minutes: Math.round(time/60) };
  DC.examS.phase = 'rdone';
  DC.renderExam();
};
DC.examReadingResult = function(){
  const r = DC.examS.reading;
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  if (DC.examS.dress){
    h += '<div class="card p-6 text-center"><div class="w-12 h-12 rounded-full bg-indigo-500/15 flex items-center justify-center mx-auto mb-3"><i data-lucide="check" class="w-6 h-6 text-indigo-300"></i></div>'+
      '<h2 class="font-bold text-lg text-slate-100 mb-1">Del 1 · Læsning handed in</h2>'+
      '<p class="text-sm text-slate-400 max-w-md mx-auto">Eksamensdag mode: your score stays hidden until the full report at the end — just like the real test, where you never learn Del 1\'s result before writing Del 2.</p></div>';
  } else {
    const p = pct(r.score, r.total);
    h += '<div class="card p-6 text-center"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Del 1 · Læsning — result</div>'+
      '<div class="text-4xl font-extrabold '+(p>=80?'text-emerald-300':p>=65?'text-amber-300':'text-rose-300')+' mb-1">'+r.score+' / '+r.total+'</div>'+
      '<div class="text-sm text-slate-400 mb-4">'+p+'% · finished in '+r.minutes+' of '+EXAM.readingMinutes+' minutes</div>'+
      '<div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-left">'+
      [['Opg. 1 Cloze','cloze'],['Opg. 2A Chat','chat'],['Opg. 3 Indsæt','o3'],['Opg. 4 Match','o4']].map(x=>{
        const s = r.sections[x[1]];
        return '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3"><div class="text-[10px] uppercase text-slate-500 mb-1">'+x[0]+'</div><div class="font-bold '+(s[0]===s[1]?'text-emerald-300':'text-slate-200')+'">'+s[0]+'/'+s[1]+'</div>'+bar(pct(s[0],s[1]), s[0]===s[1]?'bg-emerald-500':'bg-indigo-500')+'</div>';
      }).join('')+'</div></div>';
    const allQs = [].concat(r.det.cloze, r.det.chat, r.det.o3, r.det.o4);
    const wrongs = allQs.filter(x=>!x.ok);
    if (wrongs.length){
      h += accHTML('Review your '+wrongs.length+' wrong answer'+(wrongs.length>1?'s':'')+' (explanations — read them NOW while it is fresh)',
        wrongs.map(w=>'<div class="mb-2 text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2"><b>'+esc(w.label)+':</b> you: '+esc(w.your)+' → correct: <b>'+esc(w.correct)+'</b><br><span class="text-xs">'+esc(w.why)+'</span></div>').join(''), 'x-octagon', true);
    } else {
      h += '<div class="card p-4 text-sm text-emerald-300 flex items-center gap-2"><i data-lucide="party-popper" class="w-5 h-5"></i>Perfect reading score under exam conditions. Fremragende!</div>';
    }
    /* full answer sheet (right AND wrong): retaking the same mock exam is only useful if you
       understand every answer, not just remember which letter you clicked last time */
    h += accHTML('Full answer sheet — all '+allQs.length+' questions',
      allQs.map(w=>'<div class="mb-2 text-sm '+(w.ok?'bg-emerald-500/10 border border-emerald-500/30':'bg-rose-500/10 border border-rose-500/30')+' rounded-xl px-3 py-2"><b>'+(w.ok?'✓':'✗')+' '+esc(w.label)+':</b> you: '+esc(w.your)+(w.ok?'':' → correct: <b>'+esc(w.correct)+'</b>')+'<br><span class="text-xs">'+esc(w.why)+'</span></div>').join(''), 'list-checks', false);
  }
  h += '<div class="card p-4 flex items-center gap-3 flex-wrap"><button onclick="DC.examS.phase=\'writing\';DC.examS.wTask=0;DC.examS.texts=[];DC.renderExam();DC.examWriteTimerStart()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2"><i data-lucide="pen-line" class="w-4 h-4"></i>Continue: Del 2 · Skrivning (2×'+EXAM.writingMinutes+' min)</button>'+
    '<span class="text-xs text-slate-500">Take a 5-minute break first if you like — the real test has one too.</span></div>';
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.examWriteTimerStart = function(){
  DC.startTimer('exam-write', EXAM.writingMinutes*60, 'exam-timer', function(){
    DC.toast('Time is up for this task — submitting now, just like the real test.','err');
    DC.examWritingSubmit(true);
  });
};
DC.examWritingRender = function(){
  const wi = DC.examS.wTask||0;
  const t = EXAM.writing[wi];
  const saved = (DC.examS.texts && DC.examS.texts[wi]) || '';
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<div class="card p-4 sticky top-16 lg:top-20 z-30 !bg-slate-950/95 flex items-center gap-3"><i data-lucide="pen-line" class="w-5 h-5 text-rose-300"></i><div class="font-bold text-slate-100 text-sm">Mock Exam · Del 2 Skrivning — '+t.opgave+' af '+EXAM.writing.length+'</div><div class="ml-auto flex items-center gap-2"><i data-lucide="timer" class="w-4 h-4 text-amber-300"></i><span id="exam-timer" class="font-mono font-bold text-amber-300 text-lg">'+fmtTime(EXAM.writingMinutes*60)+'</span></div></div>';
  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-1">'+t.opgave+': '+esc(t.title)+'</h3>'+
    '<div class="text-sm text-slate-300 mb-2"><b class="text-slate-100">Situation:</b> '+esc(t.situation)+'</div>';
  if (t.email) h += '<div class="bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 whitespace-pre-line mb-2 font-mono text-[13px]">'+esc(t.email)+'</div>';
  h += '<div class="text-sm text-slate-300 mb-1"><b class="text-slate-100">Opgave:</b> '+esc(t.taskIntro)+'</div><ul class="mb-3">'+t.bullets.map(b=>'<li class="text-sm text-slate-200 flex items-start gap-2"><i data-lucide="square-check" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i>'+esc(b)+'</li>').join('')+'</ul>';
  h += '<textarea id="exw-'+wi+'" lang="da" spellcheck="true" oninput="DC.examWCount('+wi+')" rows="14" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-rose-500 outline-none" placeholder="Skriv dit svar her…">'+esc(saved)+'</textarea>'+
    '<div class="text-[11px] text-slate-500 mt-1"><span id="exw-count-'+wi+'">'+wordCount(saved)+'</span> words · required: '+(t.opgave==='Opgave 1'?t.minWords+'–'+t.maxWords:'min. '+t.minWords)+'</div></div>';
  h += '<div class="card p-4 flex items-center gap-3"><button onclick="DC.examWritingSubmit()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">'+(wi<EXAM.writing.length-1?'Submit '+t.opgave+' — start '+EXAM.writing[wi+1].opgave:'Submit Del 2 · Skrivning')+'</button><span class="text-xs text-slate-500">Leave 5 minutes to check V2 and SAV before submitting!</span></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.examWCount = function(i){
  document.getElementById('exw-count-'+i).textContent = wordCount(document.getElementById('exw-'+i).value);
};
DC.examWritingSubmit = function(auto){
  const wi = DC.examS.wTask||0;
  const t = EXAM.writing[wi];
  const text = (document.getElementById('exw-'+wi)||{}).value || '';
  if (!auto && wordCount(text) < t.minWords && !DC.examS.wWarned){
    DC.examS.wWarned = true;
    DC.toast(t.opgave+' is under the minimum word count. On the real exam this fails the task. Press submit again to hand in anyway.','err');
    return;
  }
  DC.examS.wWarned = false;
  DC.examS.texts = DC.examS.texts || [];
  DC.examS.texts[wi] = text;
  const timer = DC.timers['exam-write'];
  DC.examS.wTimes = DC.examS.wTimes || [];
  DC.examS.wTimes[wi] = EXAM.writingMinutes - Math.ceil((timer?timer.left:0)/60);
  DC.stopTimer('exam-write');
  if (wi < EXAM.writing.length-1){
    DC.examS.wTask = wi+1;
    DC.renderExam();
    DC.examWriteTimerStart();
  } else {
    DC.examS.rubric = [EXAM.rubric.map(()=>false), EXAM.rubric.map(()=>false)];
    DC.examS.phase = 'wscore';
    DC.state.behavior.lastWriting = Date.now();
    DC.renderExam();
  }
};
DC.examRubricToggle = function(t, i, v){ DC.examS.rubric[t][i] = v; };
DC.examRubricRender = function(){
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<div class="card p-5"><h2 class="font-bold text-slate-100 mb-1 flex items-center gap-2"><i data-lucide="scale" class="w-5 h-5 text-amber-300"></i>Self-scoring — be your own censor</h2><p class="text-xs text-slate-400">Compare each of your texts with the model answer, then tick every rubric point your text honestly fulfils. 1 point each, 10 per task. Honesty here = an accurate readiness picture.</p></div>';
  EXAM.writing.forEach((t,ti)=>{
    h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-3">'+t.opgave+': '+esc(t.title)+'</h3>';
    h += '<div class="grid lg:grid-cols-2 gap-3 mb-4"><div><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">Your answer ('+wordCount(DC.examS.texts[ti])+' words)</div><div class="bg-slate-900/80 border border-slate-700 rounded-xl p-3 whitespace-pre-line text-[13px] font-mono text-slate-200 max-h-80 overflow-y-auto">'+esc(DC.examS.texts[ti]||'(empty)')+'</div></div>'+
      '<div><div class="text-[10px] uppercase tracking-widest text-emerald-400/80 mb-1.5">Model answer</div><div class="bg-slate-900/80 border border-emerald-700/50 rounded-xl p-3 whitespace-pre-line text-[13px] font-mono text-slate-200 max-h-80 overflow-y-auto">'+esc(t.model)+'</div></div></div>';
    h += '<button onclick="DC.copyCensorPrompt('+ti+',\'exam\')" class="mb-3 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"><i data-lucide="clipboard-copy" class="w-3.5 h-3.5"></i>Copy correction prompt for '+t.opgave+'</button>';
    h += '<button onclick="DC.ingestCensorReply('+ti+',\'exam\')" class="mb-3 ml-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"><i data-lucide="clipboard-check" class="w-3.5 h-3.5"></i>Log corrections</button>';
    RUBRIC_CATS.forEach(cat=>{
      h += '<div class="mb-3"><div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-bold mb-1.5">'+esc(cat)+'</div><div class="space-y-1.5">';
      EXAM.rubric.forEach((rIt,ri)=>{
        if (rIt.cat!==cat) return;
        h += '<label class="flex items-start gap-2.5 text-sm text-slate-300 cursor-pointer bg-slate-900/60 rounded-lg px-2.5 py-2 hover:bg-slate-900"><input type="checkbox" onchange="DC.examRubricToggle('+ti+','+ri+',this.checked)" class="mt-0.5 accent-amber-500">'+esc(rIt.text)+'</label>';
      });
      h += '</div></div>';
    });
    h += '</div>';
  });
  h += '<div class="card p-4"><button onclick="DC.examFinish()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2"><i data-lucide="flag" class="w-4 h-4"></i>Calculate my final exam result</button></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
/* per-dimension rubric breakdown (Opgaveløsning / Kommunikativ værdi / Sammenhæng & struktur /
   Sproglig korrekthed), combining both writing tasks — shown on the final report so a student
   sees WHICH assessment dimension is weak, not just a flat total */
function rubricCatScores(rubricArrays){
  const out = {}; RUBRIC_CATS.forEach(c=> out[c]=[0,0]);
  rubricArrays.forEach(arr=> EXAM.rubric.forEach((r,ri)=>{ out[r.cat][1]++; if(arr[ri]) out[r.cat][0]++; }));
  return out;
}
DC.examFinish = function(){
  const w1 = DC.examS.rubric[0].filter(Boolean).length;
  const w2 = DC.examS.rubric[1].filter(Boolean).length;
  const r = DC.examS.reading;
  const rPct = pct(r.score, r.total), wPct = pct(w1+w2, 20);
  const overall = Math.round((rPct+wPct)/2);
  const result = { ts:Date.now(), reading:{ score:r.score, total:r.total, sections:r.sections }, writing:{ self:w1+w2, total:20, t1:w1, t2:w2, times:DC.examS.wTimes||[], catScores:rubricCatScores(DC.examS.rubric) }, overall };
  DC.state.exams.push(result);
  ['w-opg1','w-opg2','w-check'].forEach(cid=> DC.state.concepts[cid].history.push({ ok:(w1+w2)>=14, conf:'unsure', ts:Date.now(), hints:0 }));
  DC.save();
  DC.examS.phase = 'report';
  DC.renderExam();
};
DC.examReport = function(){
  const e = DC.state.exams[DC.state.exams.length-1];
  const rPct = pct(e.reading.score, e.reading.total), wPct = pct(e.writing.self, e.writing.total);
  /* the real test is bestået/ikke-bestået PER delprøve — every part must pass,
     so the verdict follows the WEAKEST part, never the average */
  const weakestPct = Math.min(rPct, wPct);
  const verdict = weakestPct>=80
    ? { c:'emerald', t:'Exam-ready level (writing self-scored)', d:'Both parts are strong — even your weakest part has a solid margin. Keep your review queue empty, do one timed refresher the week of the test — and remember the oral part needs a human partner.' }
    : weakestPct>=65
    ? { c:'amber', t:'On track — but every part must pass', d:'The real test is pass/fail PER part, and your weakest part ('+(rPct<wPct?'Læsning':'Skrivning — self-scored, so be honest')+' at '+weakestPct+'%) is what decides. Ten focused sessions there move you into the safe zone. Retake in a week.' }
    : { c:'rose', t:'Not yet — your weakest part would fail', d:'Do not panic: you now know EXACTLY what to train — '+(rPct<wPct?'Læsning':'Skrivning')+' at '+weakestPct+'%. Go back to Learn Mode for your weak concepts, clear the Error Notebook from this exam, and retake when your readiness score passes 60%.' };
  const sections = [['Opgave 1 · Cloze','cloze'],['Opgave 2A · Chat','chat'],['Opgave 3 · Indsæt','o3'],['Opgave 4 · Match','o4']];
  const weakest = sections.slice().sort((a,b)=> pct(e.reading.sections[a[1]][0],e.reading.sections[a[1]][1]) - pct(e.reading.sections[b[1]][0],e.reading.sections[b[1]][1]))[0];
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<div class="card p-6 text-center !border-'+verdict.c+'-500/40"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Mock exam — final report</div>'+
    '<div class="text-5xl font-extrabold text-'+verdict.c+'-300 mb-1">'+e.overall+'%</div>'+
    '<div class="font-bold text-'+verdict.c+'-200 mb-2">'+verdict.t+'</div>'+
    '<p class="text-sm text-slate-300 max-w-xl mx-auto">'+verdict.d+'</p></div>';
  h += '<div class="grid md:grid-cols-2 gap-3">';
  h += '<div class="card p-4"><div class="flex items-center justify-between mb-1"><span class="font-semibold text-sm text-slate-100">Læsning</span><span class="font-bold text-slate-200">'+e.reading.score+'/'+e.reading.total+' ('+rPct+'%)</span></div>'+bar(rPct)+'<div class="mt-3 space-y-1.5">'+
    sections.map(s=>{ const x=e.reading.sections[s[1]]; return '<div class="flex items-center gap-2 text-xs text-slate-400"><span class="w-32">'+s[0]+'</span><div class="flex-1">'+bar(pct(x[0],x[1]), pct(x[0],x[1])===100?'bg-emerald-500':'bg-indigo-500')+'</div><span class="w-8 text-right">'+x[0]+'/'+x[1]+'</span></div>'; }).join('')+'</div></div>';
  const wt = e.writing.times||[];
  h += '<div class="card p-4"><div class="flex items-center justify-between mb-1"><span class="font-semibold text-sm text-slate-100">Skrivning (self-scored)</span><span class="font-bold text-slate-200">'+e.writing.self+'/'+e.writing.total+' ('+wPct+'%)</span></div>'+bar(wPct)+
    '<div class="mt-3 space-y-1.5"><div class="flex items-center gap-2 text-xs text-slate-400"><span class="w-32">Opgave 1 · Klage</span><div class="flex-1">'+bar(e.writing.t1*10)+'</div><span class="w-8 text-right">'+e.writing.t1+'/10</span>'+(wt[0]!=null?'<span class="w-16 text-right">'+wt[0]+'/'+EXAM.writingMinutes+' min</span>':'')+'</div>'+
    '<div class="flex items-center gap-2 text-xs text-slate-400"><span class="w-32">Opgave 2 · E-mail</span><div class="flex-1">'+bar(e.writing.t2*10)+'</div><span class="w-8 text-right">'+e.writing.t2+'/10</span>'+(wt[1]!=null?'<span class="w-16 text-right">'+wt[1]+'/'+EXAM.writingMinutes+' min</span>':'')+'</div></div></div>';
  h += '</div>';
  if (e.writing.catScores){
    h += '<div class="card p-4"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Skrivning by assessment dimension</div><div class="space-y-1.5">'+
      RUBRIC_CATS.map(cat=>{ const x=e.writing.catScores[cat]; return '<div class="flex items-center gap-2 text-xs text-slate-400"><span class="w-40">'+esc(cat)+'</span><div class="flex-1">'+bar(pct(x[0],x[1]), pct(x[0],x[1])===100?'bg-emerald-500':'bg-indigo-500')+'</div><span class="w-8 text-right">'+x[0]+'/'+x[1]+'</span></div>'; }).join('')+
      '</div></div>';
  }
  h += '<div class="card p-4 text-sm text-slate-300 flex items-start gap-2"><i data-lucide="graduation-cap" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i><span><b>Teacher’s next step:</b> Your weakest reading section was <b>'+weakest[0]+'</b> ('+e.reading.sections[weakest[1]][0]+'/'+e.reading.sections[weakest[1]][1]+'). Every wrong exam answer is already in your Error Notebook with an explanation and scheduled for spaced review — clear those first, then retrain that section in the Reading Simulator before your next attempt.</span></div>';
  h += '<div class="card p-4 flex gap-2 flex-wrap"><button onclick="DC.go(\'notebook\')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Open Error Notebook</button>'+
    '<button onclick="DC.go(\'reading\')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Reading Simulator</button>'+
    '<button onclick="DC.examS=null;DC.renderExam()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Back to exam overview</button></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};

/* =====================================================================
   DAILY SMALL TALK (Hverdagsdansk)
   ===================================================================== */
function talkAllItems(){
  const out = [];
  SMALLTALK.forEach(c=> c.items.forEach((it,i)=> out.push(Object.assign({ id:c.id+'-'+i, cat:c.cat }, it))));
  return out;
}
function talkDailyFive(){
  const all = talkAllItems();
  const day = Math.floor(Date.now()/86400000);
  const start = (day*5) % all.length;
  const out = [];
  for (let i=0;i<5;i++) out.push(all[(start+i)%all.length]);
  return out;
}
DC.renderTalk = function(){
  const st = DC.state.smalltalk;
  const all = talkAllItems();
  const known = all.filter(it=>st.known[it.id]).length;
  const today = new Date().toDateString();
  const doneToday = !!st.doneDays[today];
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<div class="card p-5"><div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center"><i data-lucide="coffee" class="w-5 h-5 text-emerald-300"></i></div><div><h2 class="font-bold text-slate-100">Hverdagsdansk — Daily Small Talk</h2><div class="text-xs text-slate-400">'+all.length+' sentences for real life in Denmark: the office, the shops and the eternal weather.</div></div>'+
    '<div class="ml-auto text-right"><div class="text-xl font-extrabold text-emerald-300">'+known+'/'+all.length+'</div><div class="text-[10px] uppercase text-slate-500">mastered</div></div></div>'+bar(pct(known,all.length),'bg-emerald-500')+
    '<p class="text-xs text-slate-500 mt-2">Small talk is not in the exam — but it IS where your oral fluency is built, one coffee machine conversation at a time. Five sentences a day, said OUT LOUD.</p></div>';
  // daily five
  h += '<div class="card p-5 !border-emerald-500/30"><div class="flex items-center gap-2 mb-2"><i data-lucide="calendar-heart" class="w-5 h-5 text-emerald-300"></i><h3 class="font-bold text-slate-100">Today’s 5 sentences</h3>'+(doneToday?'<span class="ml-auto text-xs text-emerald-400 font-semibold">✓ done today — flot!</span>':'')+'</div>';
  h += '<div id="talk-daily">';
  if (DC.talkS && DC.talkS.active) h += '';
  else h += '<p class="text-xs text-slate-400 mb-3">You see the English — say the Danish OUT LOUD before revealing. Self-mark honestly.</p><button onclick="DC.talkStart()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="play" class="w-4 h-4"></i>'+(doneToday?'Practice today’s 5 again':'Start today’s 5')+'</button>';
  h += '</div></div>';
  // categories
  h += '<div class="space-y-3">';
  SMALLTALK.forEach(c=>{
    const catKnown = c.items.filter((it,i)=>st.known[c.id+'-'+i]).length;
    let body = '<div class="space-y-2">';
    c.items.forEach((it,i)=>{
      const id = c.id+'-'+i, k = !!st.known[id];
      body += '<div class="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2.5 flex items-start gap-3"><div class="flex-1"><div class="font-medium text-slate-100 text-sm">'+esc(it.da)+'</div><div class="text-xs text-slate-400 mt-0.5">'+esc(it.en)+'</div>'+(it.note?'<div class="text-[11px] text-emerald-300/80 mt-1 flex items-start gap-1"><i data-lucide="lightbulb" class="w-3 h-3 mt-0.5 shrink-0"></i>'+esc(it.note)+'</div>':'')+'</div>'+
        '<button onclick="DC.talkKnow(\''+id+'\')" class="shrink-0 text-[10px] font-bold rounded-lg px-2 py-1.5 border '+(k?'bg-emerald-500/20 border-emerald-500/40 text-emerald-300':'bg-slate-800 border-slate-700 text-slate-500')+'">'+(k?'✓ I say this':'mark known')+'</button></div>';
    });
    body += '</div>';
    h += accHTML('<span class="flex items-center gap-2"><i data-lucide="'+c.icon+'" class="w-4 h-4 text-emerald-300"></i>'+esc(c.cat)+' <span class="text-xs text-slate-500 font-normal">'+catKnown+'/'+c.items.length+'</span></span>', body, null, false);
  });
  h += '</div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.talkKnow = function(id){
  DC.state.smalltalk.known[id] = !DC.state.smalltalk.known[id];
  DC.save(); DC.renderTalk();
};
DC.talkStart = function(){
  DC.talkS = { items: talkDailyFive(), i:0, got:0, active:true };
  DC.talkCard();
};
DC.talkCard = function(){
  const s = DC.talkS;
  const box = document.getElementById('talk-daily');
  if (!box) return;
  if (s.i >= s.items.length){
    const today = new Date().toDateString();
    DC.state.smalltalk.doneDays[today] = true;
    DC.state.concepts['o-conversation'].history.push({ ok:s.got>=4, conf:'unsure', ts:Date.now(), hints:0 });
    DC.state.behavior.lastOral = Date.now();
    DC.save();
    box.innerHTML = '<div class="text-center py-4 fade-in"><i data-lucide="party-popper" class="w-8 h-8 text-emerald-300 mx-auto mb-2"></i><div class="font-bold text-slate-100">'+s.got+'/5 said with confidence!</div><div class="text-sm text-slate-400 mt-1">Use at least one of them in real life today — at the kaffemaskine or the kasse. That is when it becomes YOURS.</div></div>';
    DC.talkS = null;
    DC.icons(); DC.renderHeader();
    return;
  }
  const it = s.items[s.i];
  let h = '<div class="fade-in"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Sentence '+(s.i+1)+' of 5 · '+esc(it.cat)+'</div>'+
    '<div class="bg-slate-900/80 border border-slate-700 rounded-xl p-4 mb-3"><div class="text-xs text-slate-500 mb-1">Say this in Danish — OUT LOUD:</div><div class="text-lg font-semibold text-slate-100">'+esc(it.en)+'</div>'+
    '<div id="talk-reveal" class="hidden mt-3 pt-3 border-t border-slate-700"><div class="text-lg font-bold text-emerald-300">'+esc(it.da)+'</div>'+(it.note?'<div class="text-[11px] text-emerald-200/70 mt-1.5">'+esc(it.note)+'</div>':'')+'</div></div>'+
    '<div class="flex gap-2 flex-wrap" id="talk-btns"><button onclick="document.getElementById(\'talk-reveal\').classList.remove(\'hidden\');document.getElementById(\'talk-btns\').innerHTML=document.getElementById(\'talk-after\').innerHTML;DC.icons()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Reveal the Danish</button></div>'+
    '<div id="talk-after" class="hidden"><button onclick="DC.talkMark(true)" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold">✓ I said it (almost) right</button>'+
    '<button onclick="DC.talkMark(false)" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm ml-2">Need more practice</button></div></div>';
  box.innerHTML = h;
  DC.icons();
};
DC.talkMark = function(ok){
  const s = DC.talkS;
  const it = s.items[s.i];
  if (ok){ s.got++; DC.state.smalltalk.known[it.id] = true; }
  else DC.state.smalltalk.known[it.id] = false;
  DC.save();
  s.i++;
  DC.talkCard();
};



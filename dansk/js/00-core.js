/* Dansk Coach — js/00-core.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
'use strict';
/* =====================================================================
   DANSK COACH 3.3 — application core
   ===================================================================== */
const LS_KEY = 'danskCoach33_v1';

/* ---------- concept registry (the mastery map) ---------- */
const CONCEPTS = {
  'v2-main':        { name:'V2 word order in main clauses', area:'Grammar' },
  'inv-time':       { name:'Inversion after time expressions', area:'Grammar' },
  'inv-place':      { name:'Inversion after place expressions', area:'Grammar' },
  'adv-main':       { name:'Central adverbs in main clauses', area:'Grammar' },
  'adv-sub':        { name:'Central adverbs in subordinate clauses', area:'Grammar' },
  'sav-conn':       { name:'SAV word order after fordi, at, hvis, når, selvom', area:'Grammar' },
  'modal':          { name:'Modal verbs', area:'Grammar' },
  'tense-present':  { name:'Present tense', area:'Grammar' },
  'tense-past':     { name:'Past tense', area:'Grammar' },
  'tense-perfect':  { name:'Perfect tense', area:'Grammar' },
  'adj-agree':      { name:'Adjective agreement (en/et/plural)', area:'Grammar' },
  'sin-sit':        { name:'sin/sit/sine vs hans/hendes', area:'Grammar' },
  'w-opg1':         { name:'Halvformel henvendelse structure (Opgave 1)', area:'Writing' },
  'w-opg2':         { name:'Email structure (Opgave 2)', area:'Writing' },
  'w-polite':       { name:'Polite openings and closings', area:'Writing' },
  'w-connectors':   { name:'Connectors and transitions', area:'Writing' },
  'w-reasons':      { name:'Giving reasons', area:'Writing' },
  'w-problems':     { name:'Describing problems', area:'Writing' },
  'w-requests':     { name:'Making requests', area:'Writing' },
  'w-check':        { name:'Checking word order in writing', area:'Writing' },
  'r-2a':           { name:'Chat matching / skim and scan (Opgave 2A)', area:'Reading' },
  'r-3':            { name:'Sentence insertion in paragraphs (Opgave 3)', area:'Reading' },
  'r-4':            { name:'Matching texts with questions (Opgave 4)', area:'Reading' },
  'r-keywords':     { name:'Finding keywords / words from context', area:'Reading' },
  'r-inference':    { name:'Inference questions', area:'Reading' },
  'r-opinion':      { name:'Understanding opinions and arguments', area:'Reading' },
  'o-mindmap':      { name:'Mindmap presentation structure (Oral Opgave 1)', area:'Oral' },
  'o-conversation': { name:'Task-based conversation skills (Oral Opgave 2)', area:'Oral' },
  'o-opinion':      { name:'Opinion phrases', area:'Oral' },
  'o-expand':       { name:'Answer expansion', area:'Oral' },
  'o-compare':      { name:'Comparing Denmark with personal experience', area:'Oral' },
  'o-thinking':     { name:'Thinking-time phrases', area:'Oral' },
  'o-followup':     { name:'Handling follow-up questions', area:'Oral' },
  'o-hooks':        { name:'Steering the conversation with hooks', area:'Oral' }
};

/* ---------- global app object ---------- */
const DC = {
  state: null,
  view: 'dashboard',
  timers: {},
  q: {},            // live question session data
  rq: {},           // live review session data
  sub: {}           // remembered sub-tab per module
};

/* ---------- state ---------- */
DC.defaultState = function(){
  const concepts = {};
  Object.keys(CONCEPTS).forEach(k => concepts[k] = { history: [], hints: 0 });
  return {
    v: 2,                              // save-schema version — bump when a migration is needed in DC.load
    created: Date.now(),
    lastVisit: new Date().toDateString(),
    streak: 1,
    concepts,
    lessons: {},                       // lessonId -> {completed, miniDone}
    grammarDone: {},                   // qid -> {correct, confidence, ts, attempts}
    reading: { cloze:{}, chat:{}, o3:{}, o4:{}, reflections:{} },
    writing: { drafts:{}, checks:{}, completed:{}, timerLeft:null },
    oral: { tracker:{}, revealed:{}, practiced:[], myDrawn:null, examinerVoice:false,
      myTopics:[ {title:'', branches:['','','','','','']}, {title:'', branches:['','','','','','']} ] },  // the student's own two Opgave 1 topics (title + 6 keyword branches, per the real exam rule)
    errors: [],
    review: [],
    behavior: { answers:0, correct:0, hintsTotal:0, fastWrong:0, confWrong:0, guessRight:0,
                timeSum:0, moduleVisits:{}, lastWriting:null, lastOral:null, lastReading:null },
    activity: [],
    today: { date:'', done:[] },        // today's guided session: {date: toDateString, done: [stepKey,...]}
    readinessLog: [],                   // one snapshot per active day: {date, readiness} — feeds the end-of-session sparkline
    customVocab: []                     // user-imported words (pasted from an LLM the student ran outside the app)
  };
};
/* shared by DC.load (from localStorage) and DC.importProgress (from a backup file) —
   both need the same forward-compatible merge against a fresh defaultState() */
DC.mergeState = function(s){
  const d = DC.defaultState();
  DC.state = Object.assign(d, s);
  DC.state.behavior = Object.assign(d.behavior, s.behavior||{});
  DC.state.reading = Object.assign(d.reading, s.reading||{});
  DC.state.writing = Object.assign(d.writing, s.writing||{});
  DC.state.oral = Object.assign(d.oral, s.oral||{});
  Object.keys(CONCEPTS).forEach(k => { if(!DC.state.concepts[k]) DC.state.concepts[k] = {history:[],hints:0}; });
  /* pre-v2 saves need no structural migration (review snapshots are self-contained);
     future format changes go here, gated on DC.state.v */
  if (!DC.state.v) DC.state.v = 2;
};
DC.load = function(){
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) DC.mergeState(JSON.parse(raw));
    else DC.state = DC.defaultState();
  } catch(e){ DC.state = DC.defaultState(); }
  // streak
  const today = new Date().toDateString();
  if (DC.state.lastVisit !== today){
    const y = new Date(); y.setDate(y.getDate()-1);
    DC.state.streak = (DC.state.lastVisit === y.toDateString()) ? (DC.state.streak||0)+1 : 1;
    DC.state.lastVisit = today;
  }
  DC.save();
};
DC.save = function(){
  try { localStorage.setItem(LS_KEY, JSON.stringify(DC.state)); } catch(e){}
  /* header repaint is throttled: save() fires on every keystroke/answer, and the header
     recomputes readiness + all three SRS queues — once per 300ms is plenty */
  if (!DC._hdrT) DC._hdrT = setTimeout(function(){ DC._hdrT = null; DC.renderHeader(); }, 300);
};

/* ---------- tiny helpers ---------- */
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function pct(n,d){ return d>0 ? Math.round(100*n/d) : 0; }
function clamp(n,a,b){ return Math.max(a,Math.min(b,n)); }
function wordCount(t){ return (t||'').trim() ? t.trim().split(/\s+/).length : 0; }
function fmtTime(s){ const m=Math.floor(s/60), x=s%60; return m+':'+String(x).padStart(2,'0'); }
function fmtDate(ts){ return new Date(ts).toLocaleString('da-DK',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}); }
function ago(ts){
  const d = Date.now()-ts, m=Math.round(d/60000);
  if (m<1) return 'just now'; if (m<60) return m+' min ago';
  const h=Math.round(m/60); if (h<24) return h+' h ago';
  return Math.round(h/24)+' d ago';
}
function shuffle(a){ const x=a.slice(); for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];} return x; }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

DC.icons = function(){ try{ lucide.createIcons(); }catch(e){} };
DC.toast = function(msg, type){
  type = type||'info';
  const colors = { info:'border-indigo-500/40 text-indigo-200', ok:'border-emerald-500/40 text-emerald-200',
                   warn:'border-amber-500/40 text-amber-200', err:'border-rose-500/40 text-rose-200' };
  const el = document.createElement('div');
  el.className = 'card px-4 py-3 text-sm max-w-sm fade-in border '+colors[type];
  el.innerHTML = msg;
  document.getElementById('toast-wrap').appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .4s'; setTimeout(()=>el.remove(),420); }, 4200);
};
DC.modal = function(html){
  const m = document.getElementById('modal');
  document.getElementById('modal-box').innerHTML = html;
  m.classList.remove('hidden'); m.classList.add('flex');
  DC.icons();
};
DC.closeModal = function(){
  const m = document.getElementById('modal');
  m.classList.add('hidden'); m.classList.remove('flex');
};
DC.confirmBox = function(title, msg, okLabel, fn){
  DC._confirmFn = fn;
  DC.modal('<div class="flex items-start gap-3"><div class="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center shrink-0"><i data-lucide="alert-triangle" class="w-5 h-5 text-rose-300"></i></div>'+
    '<div><h3 class="font-bold text-slate-100 mb-1">'+esc(title)+'</h3><p class="text-sm text-slate-400 mb-4">'+msg+'</p>'+
    '<div class="flex gap-2"><button onclick="DC._confirmFn();DC.closeModal()" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold">'+esc(okLabel)+'</button>'+
    '<button onclick="DC.closeModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Cancel</button></div></div></div>');
};
/* full legal notice — linked from the footer so it's reachable from every page */
DC.legalModal = function(){
  DC.modal('<div class="flex items-center justify-between mb-3"><h3 class="font-bold text-slate-100 flex items-center gap-2"><i data-lucide="scale" class="w-5 h-5 text-indigo-300"></i>Legal notice &amp; disclaimer</h3><button onclick="DC.closeModal()" class="text-slate-500 hover:text-slate-300"><i data-lucide="x" class="w-5 h-5"></i></button></div>'+
    '<div class="text-sm text-slate-300 space-y-3">'+
    '<div><b class="text-slate-100">No affiliation.</b> Dansk Coach is an independent, unofficial study tool. It is not affiliated with, endorsed by, approved by, or connected to SIRI (Styrelsen for International Rekruttering og Integration), Udlændinge- og Integrationsministeriet, Gyldendal, danskuddannelse providers, sprogcentre, or any examining body. All names of institutions and tests are used only to describe factually what this tool helps you practise for.</div>'+
    '<div><b class="text-slate-100">Original materials.</b> All practice content (reading texts, dialogues, writing tasks, oral topics, vocabulary, model answers) is original and written for this app. It mirrors the publicly known <i>format</i> of the Modul 3.3 modultest but does not reproduce any actual exam paper or copyrighted test item.</div>'+
    '<div><b class="text-slate-100">No guarantee of results.</b> This tool is a study aid, not a substitute for formal instruction. Scores, readiness percentages, and self-assessments are informal estimates for practice purposes only — they do not predict, guarantee, or certify any real exam outcome. Real pass thresholds are set by the examining authorities and are not published.</div>'+
    '<div><b class="text-slate-100">No professional advice.</b> Nothing in this app constitutes legal, immigration, educational, or professional advice. For questions about your danskuddannelse, exam registration, or residency requirements, contact your sprogcenter or the relevant authority.</div>'+
    '<div><b class="text-slate-100">Provided “as is”.</b> This app is provided free of charge, as is, without warranty of any kind, express or implied, including fitness for a particular purpose. To the maximum extent permitted by law, the author accepts no liability for any loss or damage arising from its use, including lost progress data or exam results.</div>'+
    '<div><b class="text-slate-100">Privacy.</b> This app runs entirely in your browser. It sends no data anywhere: no accounts, no cookies set by the app, no analytics, no external requests. All progress is stored only in your own browser\'s localStorage and can be deleted at any time via “Reset Progress” or your browser settings. If you use the optional “copy prompt” features with an external AI chatbot, anything you paste there is governed by that service\'s own terms — not this app\'s.</div>'+
    '<div><b class="text-slate-100">Third-party software.</b> This app bundles Tailwind CSS (© Tailwind Labs, Inc.) and Lucide Icons (© Lucide Contributors), both used under the MIT License. See the LICENSES file distributed with the app.</div>'+
    '</div>'+
    '<button onclick="DC.closeModal()" class="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Close</button>');
};
DC.resetProgress = function(){
  DC.confirmBox('Reset all progress?',
    'This permanently deletes <b>everything</b>: lesson completion, quiz history, your error notebook, review queue, writing drafts, oral practice and concept mastery. This cannot be undone.',
    'Yes, delete everything', function(){
      localStorage.removeItem(LS_KEY);
      DC.state = DC.defaultState();
      DC.save(); DC.go('dashboard');
      DC.toast('All progress has been reset. Velkommen tilbage — we start fresh!','warn');
    });
};

/* ---------- backup: export/import the whole progress blob as a JSON file ---------- */
DC.exportProgress = function(){
  const blob = new Blob([JSON.stringify(DC.state, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'dansk-coach-backup-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(a.href);
  DC.toast('Backup downloaded.','ok');
};
DC.importProgress = function(input){
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(){
    let s;
    try { s = JSON.parse(reader.result); } catch(e){ s = null; }
    if (!s || typeof s!=='object' || !s.concepts){
      DC.toast('That file doesn\'t look like a Dansk Coach backup.','warn');
      return;
    }
    DC.confirmBox('Import this backup?',
      'This replaces your current progress with the backup file\'s contents. This cannot be undone.',
      'Yes, import', function(){
        DC.mergeState(s);
        DC.save(); DC.go('dashboard');
        DC.toast('Progress imported from backup.','ok');
      });
  };
  reader.readAsText(file);
  input.value = '';
};

/* ---------- timers ---------- */
/* endTs-based (not a per-tick decrement): a backgrounded tab or a sleeping
   laptop can silently pause/throttle setInterval, so remaining time is always
   recomputed from the wall clock rather than trusting how many ticks fired. */
DC.startTimer = function(id, seconds, displayId, onEnd){
  DC.stopTimer(id);
  const endTs = Date.now() + seconds*1000;
  const t = { endTs, left: seconds, displayId, onEnd, int: setInterval(()=>{
    t.left = Math.max(0, Math.round((t.endTs - Date.now())/1000));
    const el = document.getElementById(displayId);
    if (el){
      el.textContent = fmtTime(t.left);
      el.classList.toggle('timer-danger', t.left <= 60 && t.left > 0);
    }
    if (id==='writing'){ DC.state.writing.timerLeft = t.left; if(t.left%15===0) DC.save(); }
    if (t.left <= 0){ DC.stopTimer(id); if (onEnd) onEnd(); }
  }, 1000)};
  DC.timers[id] = t;
  const el = document.getElementById(displayId);
  if (el) el.textContent = fmtTime(seconds);
  if (typeof DC.saveExamResume==='function') DC.saveExamResume();
};
DC.stopTimer = function(id){
  if (DC.timers[id]){ clearInterval(DC.timers[id].int); delete DC.timers[id]; }
};
DC.stopAllTimers = function(){ Object.keys(DC.timers).forEach(DC.stopTimer); };

/* ---------- exam/sim sitting guard: an active timed exam or simulation ---------- */
DC.examLikeActive = function(){
  if (DC.examS && DC.examS.phase && DC.examS.phase!=='intro' && DC.examS.phase!=='report') return true;
  if (DC.sim && DC.sim.phase && DC.sim.phase!=='menu' && DC.sim.phase!=='gate' && DC.sim.phase!=='report') return true;
  return false;
};
window.addEventListener('beforeunload', function(e){
  if (!DC.examLikeActive()) return;
  e.preventDefault();
  e.returnValue = '';
});

/* ---------- exam/sim resume: survive an accidental refresh or crash ----------
   Per-question answers still live only in the DOM until each part is submitted
   (same as before) — this restores the correct PHASE and remaining TIME, not
   in-progress selections, which is what turns "lost the whole 2-hour sitting"
   into "redo the last few clicks". */
const EXAM_RESUME_KEY = 'danskCoach33_examResume_v1';
const SIM_TIMER_IDS = ['sim-read','sim-write','sim-oprep','sim-opres','sim-o2prep'];
DC.saveExamResume = function(){
  let snap = null;
  if (DC.examS && DC.examS.phase && DC.examS.phase!=='intro' && DC.examS.phase!=='report'){
    const tid = DC.timers['exam-read'] ? 'exam-read' : (DC.timers['exam-write'] ? 'exam-write' : null);
    snap = { kind:'exam', phase:DC.examS.phase, start:DC.examS.start, dress:DC.examS.dress, endTs: tid?DC.timers[tid].endTs:null, ts:Date.now() };
  } else if (DC.sim && DC.sim.phase && DC.sim.phase!=='menu' && DC.sim.phase!=='gate' && DC.sim.phase!=='report'){
    const tid = SIM_TIMER_IDS.find(id=>DC.timers[id]);
    snap = { kind:'sim', si:DC.sim.si, phase:DC.sim.phase, t0:DC.sim.t0, times:DC.sim.times, dress:DC.sim.dress, endTs: tid?DC.timers[tid].endTs:null, ts:Date.now() };
  }
  if (snap) localStorage.setItem(EXAM_RESUME_KEY, JSON.stringify(snap));
  else localStorage.removeItem(EXAM_RESUME_KEY);
};
DC.clearExamResume = function(){ localStorage.removeItem(EXAM_RESUME_KEY); };
DC.checkExamResume = function(){
  let snap;
  try{ snap = JSON.parse(localStorage.getItem(EXAM_RESUME_KEY)); }catch(e){ snap = null; }
  if (!snap || !snap.ts) return null;
  if (Date.now()-snap.ts > 6*60*60*1000){ DC.clearExamResume(); return null; }
  if (snap.endTs && snap.endTs <= Date.now()){ DC.clearExamResume(); return null; }
  return snap;
};

/* =====================================================================
   TEACHER BRAIN — concept mastery, diagnosis, advice, planning
   ===================================================================== */
const Brain = {};

/* record one practice result. res = {module, opgave, concept, extraConcepts, qid, question,
   userAnswer, correctAnswer, mistakeType, explanation, memoryTrick, correct, confidence,
   hintsUsed, timeSpent, snapshot} */
Brain.record = function(res){
  const s = DC.state;
  const conceptIds = [res.concept].concat(res.extraConcepts||[]).filter(c=>CONCEPTS[c]);
  conceptIds.forEach(cid=>{
    const c = s.concepts[cid];
    c.history.push({ ok: !!res.correct, conf: res.confidence, ts: Date.now(), hints: res.hintsUsed||0 });
    if (c.history.length > 30) c.history = c.history.slice(-30);
    c.hints += (res.hintsUsed||0);
  });
  const b = s.behavior;
  b.answers++; if (res.correct) b.correct++;
  b.hintsTotal += (res.hintsUsed||0);
  b.timeSum += (res.timeSpent||0);
  if (!res.correct && (res.timeSpent||99) < 8) b.fastWrong++;
  if (!res.correct && res.confidence==='confident') b.confWrong++;
  if (res.correct && res.confidence==='guessed') b.guessRight++;
  if (res.module==='Reading') b.lastReading = Date.now();
  if (res.module==='Writing') b.lastWriting = Date.now();
  if (res.module==='Oral') b.lastOral = Date.now();
  s.activity.push({ ts: Date.now(), module: res.module, opgave: res.opgave||'', ok: !!res.correct, conf: res.confidence||'', fast: !res.correct && (res.timeSpent||99) < 8 });
  if (s.activity.length > 200) s.activity = s.activity.slice(-200);

  if (!res.correct){
    s.errors.unshift({
      id: 'e'+Date.now()+Math.floor(Math.random()*999),
      ts: Date.now(), module: res.module, opgave: res.opgave||'—', concept: res.concept,
      question: res.question, userAnswer: res.userAnswer, correctAnswer: res.correctAnswer,
      mistakeType: res.mistakeType||'Wrong answer', explanation: res.explanation,
      memoryTrick: res.memoryTrick||'', confidence: res.confidence, hints: res.hintsUsed||0,
      understood: false, qid: res.qid||null, snapshot: res.snapshot||null
    });
    Brain.addReview(res, res.confidence==='confident');
  } else if (res.confidence==='guessed'){
    Brain.addReview(res, false, true);
  }
  DC.save();
};

/* spaced repetition: stage intervals */
Brain.INTERVALS = [10*60*1000, 24*3600*1000, 3*24*3600*1000, 7*24*3600*1000];
Brain.addReview = function(res, misconception, light){
  const s = DC.state;
  if (!res.snapshot) return;
  let item = s.review.find(r => r.qid && res.qid && r.qid === res.qid && !r.mastered);
  if (item){
    item.stage = 0;
    item.due = Date.now() + (light ? Brain.INTERVALS[1] : Brain.INTERVALS[0]);
    item.misconception = item.misconception || !!misconception;
  } else {
    s.review.push({
      id: 'r'+Date.now()+Math.floor(Math.random()*999),
      qid: res.qid||null, concept: res.concept, module: res.module, opgave: res.opgave||'—',
      snapshot: res.snapshot, stage: light ? 1 : 0,
      due: Date.now() + (light ? Brain.INTERVALS[1] : Brain.INTERVALS[0]),
      misconception: !!misconception, light: !!light, mastered: false, history: []
    });
  }
};
Brain.reviewAnswer = function(item, correct, confidence){
  item.history.push({ ok: correct, conf: confidence, ts: Date.now() });
  DC.state.activity.push({ ts: Date.now(), module: 'Review', opgave: item.opgave||'', ok: !!correct, conf: confidence||'' });
  if (DC.state.activity.length > 200) DC.state.activity = DC.state.activity.slice(-200);
  if (!correct){
    item.stage = 0;
    item.due = Date.now() + Brain.INTERVALS[0];
    item.misconception = item.misconception || confidence==='confident';
  } else if (confidence==='confident' || confidence==='sure'){
    item.stage++;
    if (item.stage >= Brain.INTERVALS.length){
      const confOk = item.history.slice(-2).every(h=>h.ok && (h.conf==='confident'||h.conf==='sure'));
      if (confOk){ item.mastered = true; item.masteredTs = Date.now(); }
      else { item.stage = Brain.INTERVALS.length-1; item.due = Date.now()+Brain.INTERVALS[3]; }
    }
    if (!item.mastered) item.due = Date.now() + Brain.INTERVALS[Math.min(item.stage, Brain.INTERVALS.length-1)];
  } else {
    // correct but shaky: repeat current stage
    item.due = Date.now() + Brain.INTERVALS[Math.max(0, item.stage-0)] / 2;
  }
  DC.save();
};
Brain.dueReviews = function(){
  const now = Date.now();
  return DC.state.review.filter(r=>!r.mastered && r.due <= now);
};
/* behaviour signals over the recent activity window — advice must describe the student
   THIS week, not week 1 forever (lifetime counters in s.behavior stay for badges only) */
Brain.recentBehavior = function(){
  const recent = DC.state.activity.slice(-50);
  return {
    confWrong: recent.filter(a=>!a.ok && a.conf==='confident').length,
    guessRight: recent.filter(a=>a.ok && a.conf==='guessed').length,
    fastWrong: recent.filter(a=>a.fast).length
  };
};

/* concept status */
Brain.conceptStatus = function(cid){
  const c = DC.state.concepts[cid];
  if (!c || c.history.length===0) return 'New';
  const h = c.history, n = h.length;
  const acc = h.filter(x=>x.ok).length/n;
  const recent = h.slice(-3);
  const recentAcc = recent.filter(x=>x.ok).length/recent.length;
  const confWrong = h.slice(-5).filter(x=>!x.ok && x.conf==='confident').length;
  const lastTwoStrong = n>=2 && h.slice(-2).every(x=>x.ok && (x.conf==='confident'||x.conf==='sure'));
  if (n>=3 && acc>=0.8 && lastTwoStrong && confWrong===0) return 'Mastered';
  if (n<3) return 'Learning';
  if (confWrong>=2 || acc<0.45) return 'Weak';
  if (recentAcc > acc && recentAcc>=0.66) return 'Improving';
  if (acc<0.6) return 'Weak';
  return 'Learning';
};
Brain.conceptAcc = function(cid){
  const c = DC.state.concepts[cid];
  if (!c || !c.history.length) return null;
  return pct(c.history.filter(x=>x.ok).length, c.history.length);
};
Brain.areaScore = function(area){
  const ids = Object.keys(CONCEPTS).filter(k=>CONCEPTS[k].area===area);
  const vals = { 'New':0,'Learning':40,'Weak':20,'Improving':65,'Mastered':100 };
  return Math.round(ids.reduce((t,k)=>t+vals[Brain.conceptStatus(k)],0)/ids.length);
};
Brain.weakConcepts = function(){
  return Object.keys(CONCEPTS).filter(k=>Brain.conceptStatus(k)==='Weak');
};

/* recurring weakness ledger */
Brain.weaknesses = function(){
  const s = DC.state, out = [];
  const errByConcept = {};
  s.errors.forEach(e=>{ errByConcept[e.concept]=(errByConcept[e.concept]||0)+1; });
  const add = (name, evidence, meaning, advice, action, actionFn) => out.push({name, evidence, meaning, advice, action, actionFn});

  const savErr = (errByConcept['sav-conn']||0)+(errByConcept['adv-sub']||0);
  if (savErr>=2) add('Subordinate Clause SAV Confusion',
    savErr+' mistakes in clauses with fordi/at/hvis/når/selvom.',
    'After these connectors the order changes to Subject + Adverb + Verb — ikke moves in front of the verb.',
    'Stop at every fordi/at/hvis/når/selvom and ask: did ikke move before the verb? Use the sentence map before answering.',
    'Review Lesson 4 (SAV)', "DC.go('learn');DC.openLesson('l4')");
  const invErr = (errByConcept['inv-time']||0)+(errByConcept['inv-place']||0)+(errByConcept['v2-main']||0);
  if (invErr>=2) add('V2 Inversion Failure',
    invErr+' word-order mistakes after a fronted time/place expression.',
    'When the sentence starts with i morgen, i Danmark etc., the verb must still be the 2nd element — so the subject moves behind it.',
    'You often miss V2 when the sentence starts with a time expression. Slow down: find position 1, then put the finite verb in seat 2.',
    'Review Lesson 2 (Inversion)', "DC.go('learn');DC.openLesson('l2')");
  const advErr = (errByConcept['adv-main']||0)+(errByConcept['modal']||0);
  if (advErr>=2) add('Central Adverb Placement Error',
    advErr+' mistakes placing ikke/altid/aldrig/tit.',
    'In main clauses the central adverb follows the finite verb; with modals it sits between the modal and the infinitive.',
    'Say the skeleton aloud: subject – verb – ADVERB – rest. If a modal is present, ikke comes right after the modal.',
    'Review Lesson 3 (Adverbs)', "DC.go('learn');DC.openLesson('l3')");
  const recentB = Brain.recentBehavior();
  if (recentB.confWrong>=2) add('Confident Misconception',
    recentB.confWrong+' recent answers were wrong although you felt confident.',
    'Confident-but-wrong usually means a rule is stored incorrectly — it is not a memory slip.',
    'You were confident but wrong. That usually means this is a misconception, not just a memory slip. Reread the lesson before retrying.',
    'Open Review Queue', "DC.go('review')");
  if (recentB.fastWrong>=3) add('Rushing / Low Checking Behavior',
    recentB.fastWrong+' recent wrong answers were given in under 8 seconds.',
    'You answer faster than you check. Most word-order questions are lost to speed, not knowledge.',
    'Before submitting, point at the finite verb and count its position. Two extra seconds saves the point.',
    'Try the Grammar Trainer slowly', "DC.go('grammar')");
  const rErr = ['r-2a','r-3','r-4'].map(k=>({k, n: errByConcept[k]||0})).sort((a,b)=>b.n-a.n);
  if (rErr[0].n>=2){
    const nm = {'r-2a':'Opgave 2A (chat matching)','r-3':'Opgave 3 (sentence insertion)','r-4':'Opgave 4 (matching)'};
    add('Weak '+nm[rErr[0].k], rErr[0].n+' reading mistakes in this task type.',
      'This Opgave type tests text structure and coherence — pronouns (det/den/han), connectors and logical flow.',
      'Read what comes before AND after the gap. Check what every pronoun points back to before you choose.',
      'Practice this Opgave', "DC.go('reading')");
  }
  const wErr = (errByConcept['w-opg1']||0)+(errByConcept['w-opg2']||0)+(errByConcept['w-polite']||0);
  if (wErr>=2) add('Writing Structure Incomplete',
    wErr+' mistakes on writing-structure questions.',
    'The SIRI writing test rewards covering every bullet point with a clear beginning, middle and end.',
    'Use the planning box: one line per bullet point in the task, then write. Tick the checklist before you finish.',
    'Open Writing Lab', "DC.go('writing')");
  if (recentB.guessRight>=3) add('Fragile Correct Answers',
    recentB.guessRight+' recent correct answers were guesses.',
    'Guessed-correct is not mastery — the knowledge will not survive exam pressure.',
    'You guessed correctly. This is not mastered yet, so it has been added to your review queue.',
    'Do due reviews', "DC.go('review')");
  out.sort((a,b)=> (parseInt(b.evidence)||0) - (parseInt(a.evidence)||0));
  return out.slice(0,3);
};

/* behaviour-based teacher advice (one rotating line) */
Brain.advice = function(){
  const s = DC.state, tips = [];
  const b = s.behavior, rb = Brain.recentBehavior();
  if (b.answers===0) return 'Welcome! Start in Learn Mode — the app teaches first and tests afterwards. Lesson 1 (V2) is the foundation of everything else.';
  const due = Brain.dueReviews().length;
  if (due>0) tips.push(due+' review item'+(due>1?'s are':' is')+' due. Reviews at the right moment are how mistakes become permanent knowledge.');
  if (rb.confWrong>=2) tips.push('You were confident but wrong '+rb.confWrong+' times recently. I marked those as misconceptions — revisit the lesson before retrying, because the rule itself is stored wrong.');
  const weak = Brain.weakConcepts();
  if (weak.length) tips.push('Weakest right now: '+CONCEPTS[weak[0]].name+'. Ten focused minutes there beats an hour of random practice.');
  if (rb.guessRight>=2) tips.push('Several recent correct answers were guesses. They are in your review queue so they become stable knowledge instead of luck.');
  if (rb.fastWrong>=3) tips.push('You rush: '+rb.fastWrong+' recent errors came in under 8 seconds. Find the finite verb and count its position before answering.');
  if (b.hintsTotal/Math.max(1,b.answers) > 1.2) tips.push('You lean on hints a lot. Try answering from the sentence map first — hints should confirm, not decide.');
  const week = 7*24*3600*1000;
  if (!b.lastWriting || Date.now()-b.lastWriting>week) tips.push('You have not practiced writing this week. Try a quick Opgave 1 halvformel henvendelse to stay sharp.');
  if (!b.lastOral || Date.now()-b.lastOral>week) tips.push('Oral practice is getting dusty. Open a mindmap and talk for two minutes — out loud, not in your head.');
  if (!tips.length) tips.push('Solid, balanced work. Keep alternating: one lesson, one practice set, then clear your review queue.');
  return tips[0]; /* deterministic: the highest-priority tip, not a random rotation */
};
Brain.encouragement = function(){
  const r = Brain.readiness(), s = DC.state;
  if (s.behavior.answers===0) return 'Hej! I am your coach. We will learn the rules, train them in real SIRI task formats, and make them stick. Skridt for skridt — step by step.';
  if (r<25) return 'Every expert was once a beginner — and you have already started. Focus on Learn Mode this week; the score will follow.';
  if (r<50) return 'Du er godt i gang! The foundation is forming. Keep turning Weak concepts into Improving ones — that is where points live.';
  if (r<75) return 'Flot arbejde! You are past the halfway mark. Now polish: clear reviews on time and simulate full tasks with the timers on.';
  return 'Du er næsten klar til testen! Keep your reviews green and do one full timed simulation of each part this week.';
};



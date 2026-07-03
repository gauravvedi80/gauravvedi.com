/* Dansk Coach — js/14-path-audio.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   GUIDED FLOW — onboarding, "your next step" hero, Learning Path,
   area-grouped dojo overview. Solves "where do I start / go next".
   ===================================================================== */
const DOJO_GRAMMAR = DOJO_ORDER;                                   // 12 grammar topics
const DOJO_ALL = DOJO_GRAMMAR.concat(RW_READING_ORDER, RW_WRITING_ORDER);
window.DOJO_ALL = DOJO_ALL;
(function(){ const _ds = DC.defaultState; DC.defaultState = function(){ const s=_ds(); s.onboarded=false; return s; }; })();

/* ---------- dojo overview: grouped by area ---------- */
DC.renderDojo = function(){
  const s = DC.state;
  const due = DOJO_ALL.filter(id=>DC.dojoStatus(id)==='Review due').length;
  const masteredAll = DOJO_ALL.filter(id=>DC.dojoState(id).mastered).length;
  let h = '<div class="space-y-4 fade-in">';
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="target" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Topic Mastery Dojo — drill one topic to perfection</h2></div>'+
    '<p class="text-sm text-slate-400">Pick a topic and stay in it: <b>Teach → Worked → Guided → Independent → Speed → Mastery test</b>, with fresh items every time. A topic is only "Mastered" when you pass a fresh test at 90%+. Grammar items are computer-generated (endless); reading & writing items are drawn from authored Danish banks.</p>'+
    '<div class="mt-3 flex flex-wrap items-center gap-3"><div class="flex items-center gap-2"><div class="w-36 h-2 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-emerald-500 rounded-full" style="width:'+pct(masteredAll,DOJO_ALL.length)+'%"></div></div><span class="text-xs text-slate-400">'+masteredAll+'/'+DOJO_ALL.length+' mastered</span></div>'+
    (due?'<span class="text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-2.5 py-1">'+due+' due for re-test</span>':'')+
    '<button onclick="DC.dojoSession()" class="ml-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="timer" class="w-4 h-4"></i>45-min mastery block</button></div></div>';
  [['Grammar',DOJO_GRAMMAR,'puzzle','Word order made automatic — endless generated items'],
   ['Reading · Læsning',RW_READING_ORDER,'file-search','The closed skills that crack every text'],
   ['Writing · Skrivning',RW_WRITING_ORDER,'pen-line','The sub-skills a censor rewards']].forEach(([area,ids,icon,sub])=>{
    const m = ids.filter(id=>DC.dojoState(id).mastered).length;
    h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="'+icon+'" class="w-5 h-5 text-indigo-300"></i><h3 class="font-bold text-slate-100">'+area+'</h3><span class="ml-auto text-xs text-slate-500">'+m+'/'+ids.length+' mastered</span></div>'+
      '<div class="text-xs text-slate-500 mb-3">'+sub+'</div><div class="grid md:grid-cols-2 gap-3">';
    ids.forEach(id=>{
      const t=DOJO_TOPICS[id], st=DC.dojoState(id), status=DC.dojoStatus(id);
      const bestTest = st.tests.length? Math.max.apply(null, st.tests.map(x=>x.score)):null;
      h += '<button onclick="DC.dojoOpen(\''+id+'\')" class="card p-4 text-left hover:border-indigo-500/50 transition-colors"><div class="flex items-start gap-3"><div class="w-9 h-9 rounded-xl '+(st.mastered?'bg-emerald-500/15':'bg-indigo-500/15')+' flex items-center justify-center shrink-0"><i data-lucide="'+(st.mastered?'check-circle-2':t.icon)+'" class="w-5 h-5 '+(st.mastered?'text-emerald-300':'text-indigo-300')+'"></i></div>'+
        '<div class="flex-1 min-w-0"><div class="font-semibold text-slate-100 text-sm">'+esc(t.title)+'</div><div class="flex items-center gap-2 mt-1 flex-wrap"><span class="text-[10px] font-bold px-2 py-0.5 rounded-full '+dojoStatusCls(status)+'">'+status+'</span><span class="text-[10px] text-slate-500">'+st.drilled+' drilled'+(bestTest!=null?' · best '+Math.round(bestTest*100)+'%':'')+'</span></div>'+
        '<div class="mt-2 w-full h-1.5 rounded-full bg-slate-800 overflow-hidden"><div class="h-full '+(st.mastered?'bg-emerald-500':'bg-indigo-500')+' rounded-full" style="width:'+clamp(pct(st.drilled,DOJO_TARGET_DRILL),0,100)+'%"></div></div></div></div></button>';
    });
    h += '</div></div>';
  });
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.dojoSession = function(){
  const due = DOJO_ALL.find(id=>DC.dojoStatus(id)==='Review due');
  const next = due || DOJO_ALL.find(id=>!DC.dojoState(id).mastered) || DOJO_ALL[0];
  DC.dojoSess = { start:Date.now(), topic:next };
  DC.dojoOpen(next, true);
  DC.startTimer('dojo-sess', 45*60, 'dojo-sess-timer', function(){ DC.toast('45-minute block done — great focus!','ok'); });
  DC.toast('45-minute block on <b>'+esc(DOJO_TOPICS[next].title)+'</b>'+(due?' (re-test due)':'')+'.','info');
};

/* ---------- the learning path ---------- */
function pathStages(){
  const s = DC.state;
  const lessonsDone = Object.values(s.lessons).filter(l=>l.completed).length;
  const mastered = ids => ids.filter(id=>DC.dojoState(id).mastered).length;
  const firstUnmastered = ids => ids.find(id=>!DC.dojoState(id).mastered);
  const touchedFormat = (Object.keys(s.reading.o3||{}).length||Object.keys(s.reading.chat||{}).length?1:0)
                      + (Object.keys(s.writing.completed).length?1:0)
                      + ((s.oral.sessions||[]).length?1:0);
  return [
    { id:'orient', icon:'compass', title:'1 · Kom godt i gang', why:'Set your exam date so I can plan backwards — and learn how the app works.',
      prog: s.examDate?1:0, act:{label:s.examDate?'Exam date set ✓ — review the dashboard':'Set your exam date', fn:"DC.go('dashboard')"} },
    { id:'learn', icon:'book-open', title:'2 · Understand the rules', why:'Learn the grammar in Learn Mode before you drill it. Six short lessons.',
      prog: lessonsDone/LESSONS.length, act:(()=>{ const l=LESSONS.find(x=>!(s.lessons[x.id]||{}).completed); return l?{label:'Open: '+l.title, fn:"DC.go('learn');DC.openLesson('"+l.id+"')"}:{label:'Lessons complete ✓ — revisit any', fn:"DC.go('learn')"}; })() },
    { id:'grammar', icon:'target', title:'3 · Master the grammar', why:'Drill every grammar topic to a 90% mastery test in the Dojo. This is where word order becomes automatic.',
      prog: mastered(DOJO_GRAMMAR)/DOJO_GRAMMAR.length, act:(()=>{ const id=firstUnmastered(DOJO_GRAMMAR); return id?{label:'Master: '+DOJO_TOPICS[id].title, fn:"DC.go('dojo');DC.dojoOpen('"+id+"')"}:{label:'Grammar mastered ✓', fn:"DC.go('dojo')"}; })() },
    { id:'reading', icon:'file-search', title:'4 · Master reading', why:'Reading is a closed skill — drill pronouns, signal words, paraphrase, inference and traps to mastery.',
      prog: mastered(RW_READING_ORDER)/RW_READING_ORDER.length, act:(()=>{ const id=firstUnmastered(RW_READING_ORDER); return id?{label:'Master: '+DOJO_TOPICS[id].title, fn:"DC.go('dojo');DC.dojoOpen('"+id+"')"}:{label:'Reading mastered ✓', fn:"DC.go('dojo')"}; })() },
    { id:'writing', icon:'pen-line', title:'5 · Master writing', why:'Drill the writing sub-skills (word order, connectors, register, coverage, openings). Get a teacher to correct 3–5 real texts too.',
      prog: mastered(RW_WRITING_ORDER)/RW_WRITING_ORDER.length, act:(()=>{ const id=firstUnmastered(RW_WRITING_ORDER); return id?{label:'Master: '+DOJO_TOPICS[id].title, fn:"DC.go('dojo');DC.dojoOpen('"+id+"')"}:{label:'Writing sub-skills mastered ✓', fn:"DC.go('dojo')"}; })() },
    { id:'format', icon:'layers', title:'6 · Practise in exam format', why:'Apply your skills in the real SIRI task formats — reading simulator, writing lab, oral strategist.',
      prog: touchedFormat/3, act:(()=>{ if(!(Object.keys(s.reading.o3||{}).length||Object.keys(s.reading.chat||{}).length)) return {label:'Try the Reading Simulator', fn:"DC.go('reading')"}; if(!Object.keys(s.writing.completed).length) return {label:'Try the Writing Lab', fn:"DC.go('writing')"}; if(!(s.oral.sessions||[]).length) return {label:'Try the Oral Strategist', fn:"DC.go('oral')"}; return {label:'All formats tried ✓', fn:"DC.go('reading')"}; })() },
    { id:'simulate', icon:'graduation-cap', title:'7 · Simulate the exam', why:'Take the full timed mock exams to test yourself under real pressure.',
      prog: clamp((s.exams||[]).length/3,0,1), act:{label:(s.exams||[]).length?'Take another simulation':'Open Exam Simulation', fn:"DC.go('sim')"} },
    { id:'maintain', icon:'refresh-cw', title:'8 · Maintain until exam day', why:'Keep your reviews and re-tests green so nothing slips before the test.',
      prog: (Brain.dueReviews().length + DOJO_ALL.filter(id=>DC.dojoStatus(id)==='Review due').length)?0.5:1, act:{label:'Open Review Queue', fn:"DC.go('review')"} }
  ];
}
Brain.nextStep = function(){
  DC.todayReset();
  const steps = DC.todaySteps();
  const doneCount = steps.filter(st=>DC.state.today.done.indexOf(st.key)>=0).length;
  if (steps.length && doneCount < steps.length){
    const next = steps.find(st=>DC.state.today.done.indexOf(st.key)<0);
    return { icon:'sparkles', label: doneCount ? 'Continue today’s session ('+doneCount+'/'+steps.length+')' : 'Start today’s session',
      why: next.label, btn:'Open session', fn:"DC.go('today')" };
  }
  const stages = pathStages();
  const stage = stages.find(st=>st.prog<1) || stages[stages.length-1];
  return { icon:stage.icon, label:stage.act.label, why:stage.why, btn:'Continue', fn:stage.act.fn, stage:stage.title };
};
DC.renderPath = function(){
  const s = DC.state, ns = Brain.nextStep(), stages = pathStages();
  const curIdx = stages.findIndex(st=>st.prog<1);
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  // next-step hero
  h += '<div class="card p-6 !border-indigo-500/40"><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">👉 Your next step</div>'+
    '<h2 class="font-bold text-xl text-slate-100 mb-1">'+esc(ns.label)+'</h2>'+
    '<p class="text-sm text-slate-400 mb-4">'+esc(ns.why)+'</p>'+
    '<button onclick="'+ns.fn+'" class="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2"><i data-lucide="'+ns.icon+'" class="w-4 h-4"></i>'+esc(ns.btn)+' →</button></div>';
  // the whole journey
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="map" class="w-5 h-5 text-emerald-300"></i><h2 class="font-bold text-slate-100">Your learning path</h2></div>'+
    '<p class="text-xs text-slate-400 mb-4">The whole journey from beginner to exam-ready. You can jump anywhere, but following the order builds the strongest foundation. "You are here" marks where to focus next.</p><div class="space-y-0">';
  stages.forEach((st,i)=>{
    const p = Math.round(st.prog*100);
    const done = st.prog>=1, here = i===curIdx;
    h += '<div class="flex gap-3"><div class="flex flex-col items-center"><div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 '+(done?'bg-emerald-500/20':here?'bg-indigo-500/20 ring-2 ring-indigo-400':'bg-slate-800')+'"><i data-lucide="'+(done?'check':st.icon)+'" class="w-4 h-4 '+(done?'text-emerald-300':here?'text-indigo-300':'text-slate-500')+'"></i></div>'+(i<stages.length-1?'<div class="w-px flex-1 min-h-[1.5rem]" style="background:'+(done?'#b1d2b3':'#e5e7e9')+'"></div>':'')+'</div>'+
      '<div class="flex-1 pb-5"><div class="flex items-center gap-2 flex-wrap"><span class="font-semibold text-sm text-slate-100">'+esc(st.title)+'</span>'+(here?'<span class="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded-full px-2 py-0.5">DU ER HER</span>':'')+(done?'<span class="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full px-2 py-0.5">done</span>':'')+'</div>'+
      '<div class="text-xs text-slate-400 mt-0.5 mb-2">'+esc(st.why)+'</div>'+
      '<div class="flex items-center gap-2"><div class="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div class="h-full '+(done?'bg-emerald-500':'bg-indigo-500')+' rounded-full" style="width:'+p+'%"></div></div><span class="text-[10px] text-slate-500 w-8 text-right">'+p+'%</span>'+
      '<button onclick="'+st.act.fn+'" class="text-xs font-semibold '+(done?'text-slate-400':'text-indigo-300')+' hover:text-indigo-200 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-2.5 py-1.5 shrink-0">'+(done?'Revisit':'Go')+'</button></div></div></div>';
  });
  h += '</div></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};

/* ---------- next-step hero on the dashboard ---------- */
(function(){
  const _rdash = DC.renderDashboard;
  DC.renderDashboard = function(){
    _rdash();
    const ns = Brain.nextStep();
    const hero = '<div class="card p-5 !border-indigo-500/40 mb-2"><div class="flex items-start gap-4 flex-wrap"><div class="w-11 h-11 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0"><i data-lucide="'+ns.icon+'" class="w-6 h-6 text-indigo-300"></i></div>'+
      '<div class="flex-1 min-w-[220px]"><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-0.5">👉 Your next step</div><div class="font-bold text-slate-100">'+esc(ns.label)+'</div><div class="text-xs text-slate-400 mt-0.5">'+esc(ns.why)+'</div></div>'+
      '<div class="flex gap-2 shrink-0"><button onclick="'+ns.fn+'" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">'+esc(ns.btn)+' →</button>'+
      '<button onclick="DC.go(\'path\')" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold">See full path</button></div></div></div>';
    const wrap = document.getElementById('main').firstElementChild;
    if (wrap) wrap.insertAdjacentHTML('afterbegin', hero);
    DC.icons();
  };
})();

/* ---------- onboarding (first run) ---------- */
DC.onboard = function(force){
  const s = DC.state;
  if (!force && s.onboarded) return;
  DC.modal('<div class="text-center"><div class="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center mx-auto mb-3"><i data-lucide="graduation-cap" class="w-6 h-6 text-indigo-300"></i></div>'+
    '<h3 class="font-bold text-lg text-slate-100 mb-1">Velkommen til Dansk Coach 3.3</h3>'+
    '<p class="text-sm text-slate-400 mb-4">Your personal coach for the Modul 3.3 exam. Here is how it works — three simple steps:</p>'+
    '<div class="text-left space-y-2 mb-4">'+
    '<div class="flex items-start gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5"><div class="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0 text-indigo-300 font-bold text-sm">1</div><div><div class="font-semibold text-sm text-slate-100">Follow "Your next step"</div><div class="text-xs text-slate-400">On the dashboard and the Learning Path, I always tell you the single next thing to do. Never wonder where to go.</div></div></div>'+
    '<div class="flex items-start gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5"><div class="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0 text-indigo-300 font-bold text-sm">2</div><div><div class="font-semibold text-sm text-slate-100">Learn, then drill to mastery</div><div class="text-xs text-slate-400">Learn the rule, then drill it in the Topic Dojo until you pass a 90% test. Grammar, reading and writing all have dojos.</div></div></div>'+
    '<div class="flex items-start gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5"><div class="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0 text-indigo-300 font-bold text-sm">3</div><div><div class="font-semibold text-sm text-slate-100">Simulate the real exam</div><div class="text-xs text-slate-400">When you are ready, take the full timed mock exams. Your mistakes feed your review queue automatically.</div></div></div>'+
    '</div>'+
    '<div class="bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-3 mb-4 text-left"><label class="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-1.5"><i data-lucide="calendar-clock" class="w-4 h-4 text-indigo-300"></i>When is your exam? (optional — I will plan backwards)</label><input type="date" id="onb-date" class="gapsel w-full"></div>'+
    '<button onclick="DC.onboardDone()" class="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold">Start my path →</button></div>');
};
DC.onboardDone = function(){
  const d = (document.getElementById('onb-date')||{}).value;
  if (d) DC.state.examDate = d;
  DC.state.onboarded = true;
  DC.save();
  DC.closeModal();
  DC.go('path');
};

/* ---------- navigation: Learning Path as the first stop ---------- */
VIEW_TITLES.path = 'Learning Path — your guided journey';
(function(){
  const _go = DC.go;
  DC.go = function(view){
    if (view==='path'){
      DC.stopAllTimers(); DC.view='path';
      DC.state.behavior.moduleVisits.path=(DC.state.behavior.moduleVisits.path||0)+1;
      document.querySelectorAll('.nav-btn').forEach(el=>el.classList.toggle('active', el.dataset.nav==='path'));
      const t=document.getElementById('header-title'); if(t) t.textContent=VIEW_TITLES.path;
      DC.renderPath(); DC.save(); window.scrollTo({top:0});
      if (typeof DC.drawer==='function') DC.drawer(false);
      return;
    }
    _go(view);
  };
})();
/* first-run: show onboarding + land on the path */
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    if (!DC.state.onboarded && (DC.state.behavior.answers||0)===0){
      DC.go('path');
      DC.onboard();
    }
  }, 60);
});


/* =====================================================================
   READING → 100%: Cloze dojo (Opgave 1), Chat-matching dojo (2A/2B),
   and the Reading 100% Challenge (timed, zero-error-to-win).
   ===================================================================== */
CONCEPTS['r-cloze'] = { name:'Cloze · missing words (Opgave 1)', area:'Reading' };
CONCEPTS['r-chat']  = { name:'Chat matching (Opgave 2A/2B)', area:'Reading' };

/* ---------- Opgave 1: cloze bank (function words, prepositions, collocations) ---------- */
BANK['rd-cloze'] = [
  { type:'mc', concept:'r-cloze', tag:'Cloze · cause', prompt:'Vælg det ord, der mangler: "Jeg blev hjemme, ___ jeg var syg."',
    options:[{text:'fordi', ok:true, why:'Årsag i en bisætning → "fordi".'},{text:'men', ok:false, mistakeType:'Wrong logic', why:'"men" er en modsætning — der er ingen modsætning her.'},{text:'selvom', ok:false, mistakeType:'Wrong logic', why:'"selvom" betyder "på trods af" — det passer ikke til en grund.'}],
    explanation:'Sygdom er ÅRSAGEN til at blive hjemme → "fordi".', trick:'Læs hele sætningen, og test hvert ord på både grammatik og mening.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · result', prompt:'Vælg det ord, der mangler: "Det regnede meget, ___ jeg tog bussen."',
    options:[{text:'så', ok:true, why:'Resultat → "så" (sideordnende).'},{text:'fordi', ok:false, mistakeType:'Reversed logic', why:'Bussen er ikke årsag til regnen.'},{text:'men', ok:false, mistakeType:'Wrong logic', why:'Ingen modsætning.'}],
    explanation:'Regn → konsekvens (tog bussen) → "så".', trick:'Årsag/konsekvens: fordi peger bagud, så peger fremad.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · indirect q', prompt:'Vælg det ord, der mangler: "Hun spørger, ___ jeg vil med i biografen."',
    options:[{text:'om', ok:true, why:'Indirekte ja/nej-spørgsmål → "om" (= whether).'},{text:'hvis', ok:false, mistakeType:'hvis = condition', why:'"hvis" er betingelse, ikke indirekte spørgsmål.'},{text:'at', ok:false, mistakeType:'at = statement', why:'"at" indleder et udsagn, ikke et spørgsmål.'}],
    explanation:'Efter "spørger" (et spørgeverbum) → "om".', trick:'Kan du sige "whether"? Så er det "om".' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · adverb', prompt:'Vælg det ord, der mangler: "Han kommer ___ klokken seks, så vi spiser sent."',
    options:[{text:'først', ok:true, why:'"først klokken seks" = ikke før klokken seks (deraf den sene middag).'},{text:'allerede', ok:false, mistakeType:'Opposite', why:'"allerede" ville betyde tidligt — modsat den sene middag.'},{text:'aldrig', ok:false, mistakeType:'Illogical', why:'Han KOMMER jo, så "aldrig" passer ikke.'}],
    explanation:'"først kl. seks" forklarer den sene middag.', trick:'Tjek at ordet passer med resten ("så vi spiser sent").' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · preposition', prompt:'Vælg det ord, der mangler: "Jeg glæder mig ___ at se dig på lørdag."',
    options:[{text:'til', ok:true, why:'Fast forbindelse: "glæde sig TIL".'},{text:'på', ok:false, mistakeType:'Wrong collocation', why:'"glæde sig på" findes ikke.'},{text:'for', ok:false, mistakeType:'Wrong collocation', why:'"glæde sig for" findes ikke.'}],
    explanation:'Kollokation: glæde sig TIL noget.', trick:'Lær faste forbindelser udenad: glæde sig til, passe på, vente på.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · concession', prompt:'Vælg det ord, der mangler: "Selvom det var dyrt, købte jeg ___ bilen."',
    options:[{text:'alligevel', ok:true, why:'"selvom dyrt … alligevel" = på trods af prisen.'},{text:'aldrig', ok:false, mistakeType:'Contradicts', why:'Han KØBTE bilen — "aldrig" modsiger det.'},{text:'snart', ok:false, mistakeType:'Wrong meaning', why:'"snart" handler om tid, ikke om at trodse prisen.'}],
    explanation:'"Selvom …, alligevel …" hører sammen: trods prisen.', trick:'selvom-sætning peger ofte på "alligevel".' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · until', prompt:'Vælg det ord, der mangler: "Kan du vente, ___ jeg er færdig?"',
    options:[{text:'indtil', ok:true, why:'"vente indtil" = vente til et tidspunkt.'},{text:'fordi', ok:false, mistakeType:'Wrong logic', why:'Det er ikke en årsag.'},{text:'som', ok:false, mistakeType:'Wrong word', why:'"som" indleder en relativsætning, ikke en ventetid.'}],
    explanation:'"vente indtil" = vente på, at noget sker.', trick:'indtil/før/efter markerer tid.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · indirect q (time)', prompt:'Vælg det ord, der mangler: "Jeg ved ikke, ___ bussen kører."',
    options:[{text:'hvornår', ok:true, why:'Indirekte spørgsmål om TID → "hvornår".'},{text:'hvis', ok:false, mistakeType:'Wrong word', why:'"hvis" er betingelse.'},{text:'at', ok:false, mistakeType:'Wrong word', why:'"at" indleder et udsagn — her mangler et tidsspørgsmål.'}],
    explanation:'Et indirekte tidsspørgsmål kræver "hvornår".', trick:'hv-ord i indirekte spørgsmål: hvornår, hvor, hvad.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · result (derfor)', prompt:'Vælg det ord, der mangler: "Det er koldt i dag. ___ tager jeg en jakke på."',
    options:[{text:'Derfor', ok:true, why:'Konsekvens forrest → "Derfor" (+ inversion: tager jeg).'},{text:'Fordi', ok:false, mistakeType:'Cannot start like this', why:'"Fordi" indleder en bisætning, ikke en selvstændig konsekvens-sætning.'},{text:'Men', ok:false, mistakeType:'Wrong logic', why:'Ingen modsætning.'}],
    explanation:'Kulden → konsekvens (jakke) → "Derfor" forrest.', trick:'Derfor forrest = konsekvens + inversion.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · contrast', prompt:'Vælg det ord, der mangler: "Han er flink, ___ han kan godt være lidt streng."',
    options:[{text:'men', ok:true, why:'Flink ↔ streng er en modsætning → "men".'},{text:'fordi', ok:false, mistakeType:'Wrong logic', why:'Det ene er ikke årsag til det andet.'},{text:'så', ok:false, mistakeType:'Wrong logic', why:'Det er ikke et resultat.'}],
    explanation:'To modsatte egenskaber → "men".', trick:'Modsætning = men.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · preposition (material)', prompt:'Vælg det ord, der mangler: "Bordet er lavet ___ træ."',
    options:[{text:'af', ok:true, why:'Materiale: "lavet AF træ".'},{text:'på', ok:false, mistakeType:'Wrong collocation', why:'"lavet på træ" betyder noget andet (et sted).'},{text:'til', ok:false, mistakeType:'Wrong collocation', why:'"lavet til" = beregnet til, ikke materiale.'}],
    explanation:'Materiale udtrykkes med "af".', trick:'lavet af = hvilket materiale.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · since', prompt:'Vælg det ord, der mangler: "Vi har boet her, ___ vi kom til Danmark."',
    options:[{text:'siden', ok:true, why:'Tidspunkt for start → "siden" (sammen med førnutid "har boet").'},{text:'fordi', ok:false, mistakeType:'Wrong logic', why:'Det er ikke en årsag.'},{text:'mens', ok:false, mistakeType:'Wrong meaning', why:'"mens" = samtidig, men her er det startpunktet.'}],
    explanation:'"har boet … siden …" markerer hvornår noget begyndte.', trick:'siden = startpunkt i tid (+ førnutid).' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · verb particle', prompt:'Vælg det ord, der mangler: "Pas ___ dig selv — det er glat udenfor."',
    options:[{text:'på', ok:true, why:'Fast udtryk: "passe PÅ".'},{text:'til', ok:false, mistakeType:'Wrong collocation', why:'"passe til" betyder "matche".'},{text:'af', ok:false, mistakeType:'Wrong collocation', why:'"passe af" findes ikke.'}],
    explanation:'"passe på" = være forsigtig / tage sig af.', trick:'Partikelverber: passe på, holde af, tænke på.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · pronoun', prompt:'Vælg det ord, der mangler: "Børnene fik en gave. ___ var meget glade."',
    options:[{text:'De', ok:true, why:'"Børnene" er flertal → "De".'},{text:'Den', ok:false, mistakeType:'Wrong number', why:'"Den" er ental (en-ord).'},{text:'Det', ok:false, mistakeType:'Wrong number', why:'"Det" er ental (et-ord).'}],
    explanation:'Pronomenet skal matche flertallet "børnene" → "De".', trick:'Matchpronomen efter tal/køn: den/det/de.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · wait for', prompt:'Vælg det ord, der mangler: "Jeg står og venter ___ bussen."',
    options:[{text:'på', ok:true, why:'Fast forbindelse: "vente PÅ".'},{text:'til', ok:false, mistakeType:'Wrong collocation', why:'"vente til" bruges om tid (vente til klokken tre).'},{text:'efter', ok:false, mistakeType:'Wrong collocation', why:'"vente efter" findes ikke i standarddansk.'}],
    explanation:'"vente på" noget/nogen.', trick:'vente PÅ noget, vente TIL et tidspunkt.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · when', prompt:'Vælg det ord, der mangler: "___ jeg får løn, betaler jeg huslejen først."',
    options:[{text:'Når', ok:true, why:'Gentaget/fremtidig betingelse → "Når" (+ inversion: betaler jeg).'},{text:'Som', ok:false, mistakeType:'Wrong word', why:'"Som" indleder en relativsætning.'},{text:'Mens', ok:false, mistakeType:'Wrong meaning', why:'"Mens" = samtidig — det passer ikke til "får løn → betaler".'}],
    explanation:'"Når jeg får løn" = hver gang/når det sker.', trick:'Når = gentaget/fremtid; da = én gang i fortiden.' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · with', prompt:'Vælg det ord, der mangler: "De bor i et stort hus ___ en dejlig have."',
    options:[{text:'med', ok:true, why:'"hus med have" = huset HAR en have → "med".'},{text:'på', ok:false, mistakeType:'Wrong preposition', why:'"hus på en have" giver ikke mening.'},{text:'af', ok:false, mistakeType:'Wrong preposition', why:'"af" bruges om materiale/ophav, ikke tilbehør.'}],
    explanation:'"med" = som har / tilhørende.', trick:'med = "der har".' },
  { type:'mc', concept:'r-cloze', tag:'Cloze · only/just', prompt:'Vælg det ord, der mangler: "Det er ikke noget særligt — jeg ringer ___ for at høre, hvordan du har det."',
    options:[{text:'bare', ok:true, why:'"bare" = blot/kun, blødgør og betyder "intet stort".'},{text:'altid', ok:false, mistakeType:'Wrong meaning', why:'"altid" handler om hyppighed, ikke om "kun lige".'},{text:'aldrig', ok:false, mistakeType:'Contradicts', why:'Han RINGER jo — "aldrig" modsiger det.'}],
    explanation:'"bare" = kun/blot, en blød tilføjelse.', trick:'bare = kun lige / blot.' }
];

/* ---------- Opgave 2A/2B: chat-matching bank ---------- */
BANK['rd-chat'] = [
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Skal vi mødes klokken 14 på caféen?" — Vælg det svar, der passer:',
    options:[{text:'Ja, det passer fint. Vi ses!', ok:true, why:'Svarer direkte JA på forslaget om tid og sted.'},{text:'Nej, jeg kan ikke lide kaffe.', ok:false, mistakeType:'Off-topic', why:'Spørgsmålet handler om at mødes, ikke om kaffe.'},{text:'Bussen var forsinket i morges.', ok:false, mistakeType:'Unrelated', why:'Svarer slet ikke på spørgsmålet.'}],
    explanation:'Svaret skal besvare X’ spørgsmål. Et ja/nej-forslag kræver et ja/nej-svar.', trick:'Match svaret til BÅDE spørgsmålet og det, X siger bagefter.' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Hvad tid kommer du i aften?" — Vælg det svar, der passer:',
    options:[{text:'Jeg er der omkring klokken 18.', ok:true, why:'Et "hvad tid"-spørgsmål kræver et klokkeslæt.'},{text:'Ja, meget gerne.', ok:false, mistakeType:'Wrong type', why:'"Ja" besvarer ikke et tidsspørgsmål.'},{text:'Det var en hyggelig aften.', ok:false, mistakeType:'Wrong tense/topic', why:'Handler om fortiden, ikke om hvornår.'}],
    explanation:'Hv-spørgsmål (hvad tid) → svar med en konkret tid.', trick:'Hv-spørgsmål kræver en konkret oplysning, ikke "ja".' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Jeg er desværre blevet syg og kommer ikke i dag." — Vælg det svar, der passer:',
    options:[{text:'Av, god bedring! Bare bliv hjemme og hvil dig.', ok:true, why:'Reagerer passende på en sygemelding med medfølelse.'},{text:'Tillykke!', ok:false, mistakeType:'Wrong reaction', why:'Man ønsker ikke tillykke med sygdom.'},{text:'Hvor skal vi hen?', ok:false, mistakeType:'Ignores message', why:'Ignorerer at personen er syg.'}],
    explanation:'Reaktionen skal passe til indholdet — sygdom kalder på "god bedring".', trick:'Følg tonen: dårlig nyhed → medfølelse.' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Kan du hjælpe mig med at flytte på lørdag?" — Vælg det svar, der passer:',
    options:[{text:'Ja, det vil jeg gerne. Hvad tid skal jeg komme?', ok:true, why:'Siger ja OG stiller et logisk opfølgende spørgsmål.'},{text:'Nej, jeg elsker at flytte.', ok:false, mistakeType:'Contradiction', why:'"Nej" og "elsker at flytte" modsiger hinanden.'},{text:'Flyttebilen er rød.', ok:false, mistakeType:'Off-topic', why:'Svarer ikke på, om personen vil hjælpe.'}],
    explanation:'En anmodning besvares med ja/nej + ofte et opfølgende spørgsmål.', trick:'Et godt svar fører naturligt videre til X’ næste besked.' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Tusind tak for hjælpen i går!" — Vælg det svar, der passer:',
    options:[{text:'Det var så lidt — sig endelig til en anden gang.', ok:true, why:'Den naturlige reaktion på en tak.'},{text:'Ja tak, meget gerne.', ok:false, mistakeType:'Wrong type', why:'"Ja tak" besvarer et tilbud, ikke en tak.'},{text:'Hvornår skal vi mødes?', ok:false, mistakeType:'Ignores', why:'Ignorerer takken.'}],
    explanation:'En tak besvares med "Det var så lidt / Selv tak".', trick:'Tak → "det var så lidt".' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Skal vi cykle eller tage bussen til stranden?" — Vælg det svar, der passer:',
    options:[{text:'Lad os cykle — vejret er jo så flot i dag.', ok:true, why:'Vælger ét af de to alternativer og begrunder kort.'},{text:'Ja, det lyder godt.', ok:false, mistakeType:'Does not choose', why:'Et enten/eller-spørgsmål kræver et VALG, ikke "ja".'},{text:'Bussen var dyr sidste år.', ok:false, mistakeType:'Avoids choice', why:'Vælger ikke og er off-topic.'}],
    explanation:'Et "enten/eller"-spørgsmål kræver, at du vælger.', trick:'enten/eller → træf et valg.' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Har du set min telefon? Jeg kan ikke finde den." — Vælg det svar, der passer:',
    options:[{text:'Ja, den ligger på køkkenbordet.', ok:true, why:'Besvarer "har du set den" med hvor den er.'},{text:'Nej, jeg ringer aldrig.', ok:false, mistakeType:'Off-topic', why:'Handler ikke om at finde telefonen.'},{text:'Telefonen er helt ny.', ok:false, mistakeType:'Keyword trap', why:'Nævner "telefon" men hjælper ikke med at finde den.'}],
    explanation:'Spørgsmålet "har du set…" besvares med hvor tingen er.', trick:'Pas på keyword-fælder: samme ord ≠ rigtigt svar.' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Jeg kan desværre ikke komme til din fest på lørdag." — Vælg det svar, der passer:',
    options:[{text:'Det var ærgerligt! Hvorfor kan du ikke?', ok:true, why:'Reagerer på afbuddet og spørger naturligt videre.'},{text:'Tillykke med festen!', ok:false, mistakeType:'Wrong reaction', why:'Det er et afbud, ikke en grund til tillykke.'},{text:'Ja, festen var rigtig god.', ok:false, mistakeType:'Wrong tense', why:'Festen har ikke været endnu.'}],
    explanation:'Et afbud kalder på skuffelse + evt. et opfølgende spørgsmål.', trick:'Tjek tiden: festen er i fremtiden, ikke fortiden.' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Vil du med i biografen i aften?" — Vælg det svar, der passer:',
    options:[{text:'Ja, gerne! Hvad skal vi se?', ok:true, why:'Siger ja og fører samtalen videre.'},{text:'Biografen er en stor bygning.', ok:false, mistakeType:'Off-topic', why:'Besvarer ikke invitationen.'},{text:'Jeg så en god film i sidste uge.', ok:false, mistakeType:'Off-topic', why:'Svarer ikke på invitationen til i aften.'}],
    explanation:'En invitation besvares med ja/nej + en naturlig fortsættelse.', trick:'Et godt svar åbner for X’ næste besked.' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Undskyld, jeg kommer ti minutter for sent." — Vælg det svar, der passer:',
    options:[{text:'Det gør ikke noget — vi er heller ikke helt klar endnu.', ok:true, why:'Beroliger og reagerer passende på undskyldningen.'},{text:'Tak for i dag!', ok:false, mistakeType:'Wrong timing', why:'Man siger ikke farvel, før man er mødtes.'},{text:'Hvor skal du hen?', ok:false, mistakeType:'Ignores', why:'Ignorerer beskeden om at komme for sent.'}],
    explanation:'En undskyldning besvares med at berolige ("det gør ikke noget").', trick:'Læs hensigten: en undskyldning vil beroliges.' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Hvornår har du fri i denne uge?" — Vælg det svar, der passer:',
    options:[{text:'Jeg har fri torsdag og fredag.', ok:true, why:'Et "hvornår"-spørgsmål besvares med dage/tidspunkt.'},{text:'Ja, det har jeg.', ok:false, mistakeType:'Wrong type', why:'"Ja" besvarer ikke "hvornår".'},{text:'Fri er virkelig dejligt.', ok:false, mistakeType:'Keyword trap', why:'Bruger ordet "fri" men svarer ikke på hvornår.'}],
    explanation:'"Hvornår" → svar med tidspunkt/dage.', trick:'Hv-spørgsmål → konkret oplysning.' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Kan du anbefale en god læge i området?" — Vælg det svar, der passer:',
    options:[{text:'Ja, min egen læge er rigtig dygtig — jeg sender dig adressen.', ok:true, why:'Besvarer anmodningen om en anbefaling konkret.'},{text:'Nej, jeg er slet ikke syg.', ok:false, mistakeType:'Misreads', why:'X spørger om en anbefaling, ikke om DU er syg.'},{text:'Lægen havde lukket i går.', ok:false, mistakeType:'Off-topic', why:'Anbefaler ikke nogen.'}],
    explanation:'En anmodning om en anbefaling besvares med en konkret anbefaling.', trick:'Svar på det, X faktisk beder om.' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Vil du have kaffe eller te til kagen?" — Vælg det svar, der passer:',
    options:[{text:'Te, tak — gerne med lidt mælk.', ok:true, why:'Vælger ét af alternativerne (te).'},{text:'Klokken tre er fint.', ok:false, mistakeType:'Wrong type', why:'Et tidssvar passer ikke til et "kaffe eller te"-spørgsmål.'},{text:'Ja, kagen ser lækker ud.', ok:false, mistakeType:'Does not choose', why:'Vælger ikke mellem kaffe og te.'}],
    explanation:'"X eller Y?" → vælg X eller Y.', trick:'enten/eller → vælg.' },
  { type:'mc', concept:'r-chat', tag:'Chat · reply', prompt:'X: "Mit tog er fremme klokken 16.30. Kan du hente mig?" — Vælg det svar, der passer:',
    options:[{text:'Det kan jeg godt. Jeg holder uden for stationen.', ok:true, why:'Besvarer "kan du hente mig" med et ja + en praktisk detalje.'},{text:'Ja, toget er altid forsinket.', ok:false, mistakeType:'Avoids the question', why:'Svarer ikke på, om du kan hente.'},{text:'Nej, jeg elsker at køre bil.', ok:false, mistakeType:'Contradiction', why:'"Nej" + "elsker at køre" hænger ikke sammen.'}],
    explanation:'En anmodning om hjælp besvares med ja/nej + det praktiske.', trick:'Svar konkret på anmodningen.' }
];

/* ---------- two new reading dojos ---------- */
Object.assign(DOJO_TOPICS, {
'rd-cloze': { gen:DC.bankGen('rd-cloze'), icon:'text-cursor-input', area:'Reading', title:'Cloze · missing words (Opgave 1)', concepts:['r-cloze'],
  teach:{ rule:'Opgave 1 removes words from a text; you pick each one from a small box (with extra distractors). It tests careful LOCAL reading — the missing word is decided by the grammar and logic of its own sentence. Most gaps are function words: connectors, prepositions, adverbs and fixed collocations.',
    formula:'Read the whole sentence → test each candidate on <b>grammar AND meaning</b>',
    points:['Connectors are decided by logic: cause (fordi/så/derfor), contrast (men/selvom/alligevel), condition (hvis/når).','Prepositions live in fixed collocations: glæde sig TIL, vente PÅ, lavet AF, passe PÅ.','Pronouns match number/gender: den/det/de.','Indirect questions use om (yes/no) or a hv-word (hvornår/hvor).'],
    edge:['"for" ≠ "fordi"; "så" can be result (normal order) or "then" (inversion).','Some adverbs flip meaning entirely: "først kl. 6" (not until 6) vs "allerede kl. 6".'],
    contrast:[{bad:'Jeg glæder mig på at se dig.', good:'Jeg glæder mig til at se dig.', why:'Fast forbindelse: glæde sig TIL.'}],
    trap:'A distractor often fits the grammar but breaks the meaning — or fits the meaning but breaks a fixed collocation. The right word must satisfy BOTH.' } },
'rd-chat': { gen:DC.bankGen('rd-chat'), icon:'messages-square', area:'Reading', title:'Chat matching (Opgave 2A/2B)', concepts:['r-chat','r-2a'],
  teach:{ rule:'In Opgave 2A/2B one person’s replies are removed; you slot the right reply into each gap. A correct reply must (1) answer the message before it AND (2) lead naturally into the message after it. Three replies are never used.',
    formula:'Reply must fit <b>both</b> the message before and the one after',
    points:['A yes/no question needs a yes/no answer; a "hvad tid/hvornår" needs a time; an "enten/eller" needs a choice.','Match the reaction to the news: bad news → sympathy, a thank-you → "det var så lidt".','Eliminate replies that are off-topic, ignore the question, or just repeat a keyword.'],
    edge:['Watch the timeline: a reply about the past cannot answer a question about a future plan.','The reply often ends with a question that the NEXT message answers — use that to confirm.'],
    contrast:[{bad:'(til "Har du set min telefon?") "Telefonen er helt ny."', good:'"Ja, den ligger på køkkenbordet."', why:'Keyword overlap ("telefon") is a trap; the reply must actually help find it.'}],
    trap:'A wrong reply usually shares a keyword with the message. Match the FUNCTION (does it answer?), not the words.' } }
});
RW_READING_ORDER.push('rd-cloze','rd-chat');
if (typeof DOJO_ALL!=='undefined'){ DOJO_ALL.push('rd-cloze','rd-chat'); }

/* =====================================================================
   READING 100% CHALLENGE — timed, fresh items, zero-error-to-win
   ===================================================================== */
(function(){ const _ds=DC.defaultState; DC.defaultState=function(){const s=_ds(); s.read100={best:0,perfectStreak:0,attempts:0,perfects:0}; return s;}; })();
const READ100_SKILLS = ['rd-cloze','rd-chat','rd-pronoun','rd-signal','rd-para','rd-infer','rd-trap','rd-vocab'];
const READ100_N = 12, READ100_SECS = 8*60;
DC.read100Intro = function(){
  const st = DC.state.read100||{best:0,perfectStreak:0,attempts:0,perfects:0};
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<button onclick="DC.go(\'dojo\')" class="text-sm text-slate-400 hover:text-slate-200 flex items-center gap-1"><i data-lucide="arrow-left" class="w-4 h-4"></i>Back to Dojo</button>';
  h += '<div class="card p-6 !border-emerald-500/40 text-center"><div class="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-3"><i data-lucide="trophy" class="w-6 h-6 text-emerald-300"></i></div>'+
    '<h2 class="font-bold text-lg text-slate-100 mb-1">Reading 100% Challenge</h2>'+
    '<p class="text-sm text-slate-400 mb-4 max-w-xl mx-auto">'+READ100_N+' fresh questions across ALL reading skills (cloze, chat, pronouns, signal words, paraphrase, inference, traps, vocabulary) in '+(READ100_SECS/60)+' minutes. No hints. The exam rewards perfection — so only <b>'+READ100_N+'/'+READ100_N+'</b> counts as a win. Build the streak.</p>'+
    '<div class="grid grid-cols-3 gap-2 mb-4 max-w-sm mx-auto">'+
    '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-2"><div class="text-xl font-extrabold text-emerald-300">'+st.best+'/'+READ100_N+'</div><div class="text-[10px] uppercase text-slate-500">best</div></div>'+
    '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-2"><div class="text-xl font-extrabold text-amber-300">'+st.perfectStreak+'</div><div class="text-[10px] uppercase text-slate-500">perfect streak</div></div>'+
    '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-2"><div class="text-xl font-extrabold text-slate-200">'+(st.perfects||0)+'</div><div class="text-[10px] uppercase text-slate-500">perfect runs</div></div></div>'+
    '<button onclick="DC.read100Start()" class="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center gap-2 mx-auto"><i data-lucide="play" class="w-4 h-4"></i>Start the challenge</button></div>';
  h += '<div class="card p-4 text-xs text-slate-400 flex items-start gap-2"><i data-lucide="info" class="w-4 h-4 text-indigo-300 mt-0.5 shrink-0"></i><span>Wrong answers go to your Error Notebook + review queue. The last point on exam day is often vocabulary — so if you miss a vocab item, also do 15 minutes of real Danish reading (DR.dk, Aula). That is the one gap drilling alone cannot fully close.</span></div>';
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.read100Start = function(){
  DC.r100 = { i:0, c:0, wrong:[], items: shuffle(READ100_SKILLS).concat(shuffle(READ100_SKILLS)).slice(0,READ100_N).map(id=>({id, q:DOJO_TOPICS[id].gen(2)})) };
  DC.read100Render();
  DC.startTimer('read100', READ100_SECS, 'r100-timer', function(){ DC.toast('Time! Submitting your challenge.','warn'); DC.read100Finish(); });
};
DC.read100Render = function(){
  const r = DC.r100;
  if (r.i>=r.items.length) return DC.read100Finish();
  const { id, q } = r.items[r.i];
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">'+
    '<div class="card p-3 sticky top-16 lg:top-20 z-30 flex items-center gap-3"><i data-lucide="trophy" class="w-5 h-5 text-emerald-300"></i><div class="font-bold text-slate-100 text-sm">Reading 100% Challenge</div>'+
    '<span class="text-xs text-slate-400">Q '+(r.i+1)+'/'+READ100_N+' · ✓ '+r.c+'</span>'+
    '<div class="ml-auto flex items-center gap-2"><i data-lucide="timer" class="w-4 h-4 text-amber-300"></i><span id="r100-timer" class="font-mono font-bold text-amber-300">'+fmtTime(READ100_SECS)+'</span></div></div>';
  h += '<div class="card p-5"><div class="text-[10px] uppercase tracking-wider font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-2.5 py-1 inline-block mb-3">'+esc(DOJO_TOPICS[id].title)+'</div>'+
    '<div class="font-semibold text-slate-100 mb-3 text-[15px]">'+q.prompt+'</div><div class="grid gap-2">';
  q.options.forEach((o,j)=> h += '<button id="r100-opt-'+j+'" onclick="DC.read100Answer('+j+')" class="opt-btn text-left px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm hover:bg-slate-800/60">'+esc(o.text)+'</button>');
  h += '</div><div id="r100-fb" class="mt-3"></div></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
DC.read100Answer = function(j){
  const r = DC.r100, { id, q } = r.items[r.i];
  if (r.answered) return; r.answered = true;
  const ok = q.options[j].ok;
  q.options.forEach((o,k)=>{ const el=document.getElementById('r100-opt-'+k); el.disabled=true; if(o.ok) el.classList.add('opt-correct'); if(k===j&&!o.ok) el.classList.add('opt-wrong'); });
  if (ok) r.c++; else r.wrong.push({id, q, chosen:q.options[j]});
  Brain.record({ module:'Reading 100%', opgave:DOJO_TOPICS[id].title, concept:q.concept, qid:'r100-'+id+'-'+r.i,
    question:q.prompt, userAnswer:q.options[j].text, correctAnswer:(q.options.find(o=>o.ok)||{}).text,
    mistakeType: ok?null:(q.options[j].mistakeType||'Wrong choice'), explanation:q.explanation, memoryTrick:q.trick,
    correct:ok, confidence:'sure', hintsUsed:0, timeSpent:0, snapshot:Object.assign({kind:'mc'}, q) });
  DC.save();
  document.getElementById('r100-fb').innerHTML = '<div class="text-sm '+(ok?'text-emerald-300':'text-rose-300')+' flex items-start gap-2"><i data-lucide="'+(ok?'check':'x')+'" class="w-4 h-4 mt-0.5 shrink-0"></i><span>'+(ok?'Correct.':'Wrong — '+esc((q.options.find(o=>o.ok)||{}).text)+'. '+esc(q.explanation))+'</span></div>'+
    '<button onclick="DC.r100.i++;DC.r100.answered=false;DC.read100Render()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold mt-2">'+(r.i<READ100_N-1?'Next →':'See result')+'</button>';
  DC.icons();
};
DC.read100Finish = function(){
  DC.stopTimer('read100');
  const r = DC.r100, st = DC.state.read100;
  const perfect = r.c===READ100_N;
  st.attempts++;
  st.best = Math.max(st.best, r.c);
  if (perfect){ st.perfects=(st.perfects||0)+1; st.perfectStreak=(st.perfectStreak||0)+1; } else st.perfectStreak=0;
  DC.checkBadges(); DC.save();
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto"><div class="card p-6 text-center '+(perfect?'!border-emerald-500/50':'!border-amber-500/40')+'">'+
    '<div class="text-5xl font-extrabold '+(perfect?'text-emerald-300':r.c>=10?'text-amber-300':'text-rose-300')+' mb-1">'+r.c+'/'+READ100_N+'</div>'+
    '<div class="font-bold '+(perfect?'text-emerald-200':'text-amber-200')+' mb-2">'+(perfect?'🏆 PERFECT! Streak: '+st.perfectStreak:'So close — '+READ100_N+'/'+READ100_N+' is the target')+'</div>'+
    '<p class="text-sm text-slate-400 mb-3 max-w-xl mx-auto">'+(perfect?'This is the automaticity the exam demands. Keep the streak alive — repeat it until perfect runs are routine, not lucky.':'Every miss is now in your Error Notebook. Read the explanations, then run it again — fresh questions each time. Aim for repeatable perfection.')+'</p>';
  if (r.wrong.length){ h += '<div class="text-left space-y-2 max-w-xl mx-auto mb-3">'+r.wrong.map(w=>'<div class="text-xs bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2"><b>'+esc(DOJO_TOPICS[w.id].title)+':</b> '+esc(w.q.explanation)+'</div>').join('')+'</div>'; }
  h += '<div class="flex justify-center gap-2"><button onclick="DC.read100Start()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold">Run again (fresh)</button>'+
    '<button onclick="DC.read100Intro()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Stats</button>'+
    (r.wrong.length?'<button onclick="DC.go(\'review\')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Review misses</button>':'')+'</div></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
  if (perfect) DC.toast('🏆 Perfect reading run! Streak: '+st.perfectStreak,'ok');
};
/* route + inject a launch card into the dojo Reading section */
(function(){
  const _go = DC.go;
  DC.go = function(view){
    if (view==='read100'){ DC.stopAllTimers(); DC.view='dojo'; document.querySelectorAll('.nav-btn').forEach(el=>el.classList.toggle('active', el.dataset.nav==='dojo')); const t=document.getElementById('header-title'); if(t) t.textContent='Reading 100% Challenge'; DC.read100Intro(); DC.save(); window.scrollTo({top:0}); if(typeof DC.drawer==='function') DC.drawer(false); return; }
    _go(view);
  };
  const _rdojo = DC.renderDojo;
  DC.renderDojo = function(){
    _rdojo();
    const cards = document.querySelectorAll('#main > div > .card');
    // the Reading section is the card after the intro + grammar (index varies) — find by heading text
    let readingCard=null;
    document.querySelectorAll('#main h3').forEach(hd=>{ if(hd.textContent.indexOf('Reading')===0) readingCard=hd.closest('.card'); });
    const banner = document.createElement('div');
    banner.className='card p-4 !border-emerald-500/40 flex items-center gap-3 flex-wrap mb-3';
    banner.innerHTML='<div class="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0"><i data-lucide="trophy" class="w-5 h-5 text-emerald-300"></i></div><div class="flex-1 min-w-[180px]"><div class="font-bold text-slate-100 text-sm">Reading 100% Challenge</div><div class="text-xs text-slate-400">Timed, all reading skills, zero errors to win — the drill that turns a pass into a top score.</div></div><button onclick="DC.go(\'read100\')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold">Start</button>';
    if (readingCard) readingCard.parentNode.insertBefore(banner, readingCard);
    DC.icons();
  };
})();


/* =====================================================================
   GIVE IT A VOICE — Web Speech API (single-file, no backend, offline TTS)
   - text-to-speech (da-DK) on every Danish sentence
   - Listen & Pronounce area with speech recognition feedback
   - audio dictation (hear, then type)
   ===================================================================== */
(function(){ const _ds=DC.defaultState; DC.defaultState=function(){const s=_ds(); s.speech={rate:0.92, on:true}; s.pron={attempts:0, good:0}; return s;}; })();

DC.spx = { ready:false, voice:null, danish:false };
DC.spxPick = function(){
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices()||[];
  const v = vs.find(x=>/^da([-_]|$)/i.test(x.lang)) || vs.find(x=>/dan(sk|ish)/i.test(x.name)) || null;
  DC.spx.voice = v; DC.spx.danish = !!v; DC.spx.ready = true;
};
if ('speechSynthesis' in window){ DC.spxPick(); window.speechSynthesis.onvoiceschanged = DC.spxPick; }
DC._utterq = [];   /* keep references so Chrome's GC cannot kill mid-speech */
DC.speak = function(text, cb, opts){
  if (!('speechSynthesis' in window) || !text) { if(cb) cb('error','no-api'); return; }
  const synth = window.speechSynthesis;
  try{
    if (!DC.spx.voice) DC.spxPick();                 /* voices may have loaded since page start */
    if (synth.speaking || synth.pending) synth.cancel();  /* only interrupt when needed (keeps the user-gesture for Safari) */
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = 'da-DK';
    u.rate = (opts && opts.rate) || (DC.state.speech && DC.state.speech.rate) || 0.92;
    if (DC.spx.voice) u.voice = DC.spx.voice;
    DC._utterq.push(u);                              /* << the GC fix */
    u.onstart = function(){ if(cb) cb('start'); };
    u.onend   = function(){ const i=DC._utterq.indexOf(u); if(i>=0) DC._utterq.splice(i,1); if(cb) cb('end'); };
    u.onerror = function(e){ const i=DC._utterq.indexOf(u); if(i>=0) DC._utterq.splice(i,1); if(cb) cb('error', e&&e.error); };
    synth.speak(u);
    if (synth.paused) synth.resume();                /* Chrome sometimes starts paused */
  }catch(e){ if(cb) cb('error', e.message); }
};
DC.testVoice = function(){
  if (!('speechSynthesis' in window)){ DC.toast('This browser has no speech support. Open the file in Safari or Chrome.','err'); return; }
  DC.spxPick();
  DC.toast(DC.spx.danish ? 'Danish voice found: <b>'+esc((DC.spx.voice||{}).name||'Danish')+'</b> — speaking now…'
    : 'No dedicated Danish voice on this device — using the default voice. For real Danish sound, open in Safari on Mac (it has “Sara”), or add a Danish voice in your OS language settings.', DC.spx.danish?'ok':'warn');
  let started=false;
  DC.speak('Goddag! Jeg hedder Dansk Coach, og jeg taler dansk.', function(ev,err){
    if (ev==='start') started=true;
    if (ev==='error') DC.toast('Audio error: '+esc(err||'unknown')+'. Check the tab is not muted and the volume is up.','err');
  });
  setTimeout(function(){ if(!started) DC.toast('No sound started. If you are viewing inside a preview pane, open <b>dansk-coach.html</b> directly in Safari or Chrome — preview sandboxes cannot play audio.','warn'); }, 1300);
};
/* inline speaker button (data-attr is URI-encoded → safe inside any quotes) */
DC.spk = function(text, label){
  if (!text) return '';
  return '<button type="button" class="spk-btn" data-speak="'+encodeURIComponent(String(text))+'" title="Hør på dansk">'+
    '<span class="spk-ico">🔊</span>'+(label?'<span class="spk-lbl">'+esc(label)+'</span>':'')+'</button>';
};
/* one delegated handler for every speaker button, now and forever */
document.addEventListener('click', function(e){
  const b = e.target.closest && e.target.closest('.spk-btn');
  if (!b) return;
  e.preventDefault(); e.stopPropagation();
  if (!(DC.state.speech && DC.state.speech.on)){ DC.toast('Audio is off — turn it on in Oral › Lyt & Udtal.','warn'); return; }
  DC.speak(decodeURIComponent(b.dataset.speak));
}, true);
/* styles */
(function(){
  const st = document.createElement('style');
  st.textContent = '.spk-btn{display:inline-flex;align-items:center;gap:.25rem;vertical-align:middle;border:1px solid #c9e3f0;background:#ecf5f9;color:#0d7090;border-radius:6px;padding:.1rem .4rem;font-size:.8rem;line-height:1;cursor:pointer;margin-left:.35rem}.spk-btn:hover{background:#d9ebf4}.spk-btn .spk-lbl{font-weight:600}@media (max-width:767.5px){.spk-btn{min-height:36px;min-width:34px;justify-content:center;padding:.4rem .6rem}}';
  document.head.appendChild(st);
})();

/* =====================================================================
   ORAL › LYT & UDTAL — listening library + pronunciation practice
   ===================================================================== */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
function norm(s){ return String(s).toLowerCase().replace(/[.,!?;:"'""„…()-]/g,'').replace(/\s+/g,' ').trim(); }

DC.oralListen = function(){
  const s = DC.state;
  const rate = (s.speech&&s.speech.rate)||0.92, on = !(s.speech&&s.speech.on===false);
  let h = '<div class="space-y-3">';
  // settings + status
  h += '<div class="card p-4"><div class="flex items-center gap-2 mb-2"><i data-lucide="volume-2" class="w-5 h-5 text-indigo-300"></i><h3 class="font-bold text-slate-100">Lyt & Udtal — hear and speak Danish</h3></div>'+
    '<p class="text-xs text-slate-400 mb-3">Danish is a spoken language where the spelling hides the sound. Tap 🔊 to hear any line, then practise saying it. Audio uses your device’s built-in Danish voice — no internet needed once loaded.</p>'+
    '<div class="text-[11px] text-amber-200/90 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mb-3 flex items-start gap-1.5"><i data-lucide="info" class="w-3.5 h-3.5 mt-0.5 shrink-0"></i><span>No sound? Tap <b>Test the voice</b> for a diagnosis. The most common cause: you are viewing this in a <b>preview pane</b> that can’t output audio — open <b>dansk-coach.html</b> directly in <b>Safari</b> (Mac, has the Danish “Sara” voice) or Chrome, make sure the tab isn’t muted, and tap a 🔊 once (browsers require one tap before audio).</span></div>'+
    '<div class="flex flex-wrap items-center gap-2 text-xs">'+
    '<span class="text-slate-400">Speed:</span>'+
    [['Meget langsom',0.6],['Langsom',0.7],['Middel',0.85],['Normal',1.0]].map(o=>'<button onclick="DC.setRate('+o[1]+')" class="px-2.5 py-1.5 rounded-lg border '+(Math.abs(rate-o[1])<0.01?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400')+'">'+o[0]+'</button>').join('')+
    '<span class="mx-1 text-slate-600">·</span>'+
    '<button onclick="DC.toggleAudio()" class="px-2.5 py-1.5 rounded-lg border '+(on?'bg-emerald-500/15 border-emerald-500/40 text-emerald-300':'bg-slate-900 border-slate-800 text-slate-500')+'">Audio: '+(on?'ON':'OFF')+'</button>'+
    '<button onclick="DC.testVoice()" class="px-2.5 py-1.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-400">🔊 Test the voice</button>'+
    '</div>'+
    (DC.spx.ready && !DC.spx.danish ? '<div class="text-[11px] text-amber-300 mt-2">No dedicated Danish voice was found on this device — your browser will still try, but for the best sound install a Danish voice (Settings › Accessibility/Language › Danish), or use Safari on Mac, which ships one.</div>':'')+
    '</div>';
  // pronunciation practice
  h += '<div class="card p-5 !border-emerald-500/30"><div class="flex items-center gap-2 mb-1"><i data-lucide="mic" class="w-5 h-5 text-emerald-300"></i><h3 class="font-bold text-slate-100">Pronunciation practice</h3>'+
    '<span class="ml-auto text-xs text-slate-500">'+(DC.state.pron.attempts? Math.round(100*DC.state.pron.good/DC.state.pron.attempts)+'% understood':'')+'</span></div>';
  if (!SR){
    h += '<p class="text-xs text-amber-300">Your browser does not support Danish speech recognition (try Chrome or Safari). You can still use 🔊 to listen and shadow the audio — say it out loud right after the voice.</p>';
  } else {
    h += '<p class="text-xs text-slate-400 mb-3">Hear the phrase, tap the mic, and say it. The computer shows what it heard — Danish recognition is imperfect, so treat it as a friendly mirror, not a judge.</p>'+
      '<div id="pron-card" class="bg-slate-900/70 border border-slate-800 rounded-xl p-4"></div>'+
      '<button onclick="DC.pronNext()" class="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold">'+(DC.pronCur?'New phrase':'Start')+'</button>';
  }
  h += '</div>';
  // speed-ladder drill
  h += '<div class="card p-5 !border-indigo-500/30"><div class="flex items-center gap-2 mb-1"><i data-lucide="gauge" class="w-5 h-5 text-indigo-300"></i><h3 class="font-bold text-slate-100">Speed-ladder drill</h3></div>'+
    '<p class="text-xs text-slate-400 mb-3">The real exam is spoken at normal speed. Train your ear by hearing the SAME phrase get faster, rung by rung — Meget langsom → Langsom → Middel → Normal.</p>'+
    '<div id="ladder-body"></div></div>';
  // listening library
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="headphones" class="w-5 h-5 text-indigo-300"></i><h3 class="font-bold text-slate-100">Listening library</h3></div>'+
    '<p class="text-xs text-slate-400 mb-3">Every useful oral phrase and topic word — now with sound. Tap 🔊, then shadow it (say it immediately after).</p>';
  ORAL.phraseGroups.forEach(g=>{
    let body = g.items.map(p=>'<div class="flex items-start gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 mb-1"><span class="text-sm text-slate-200 flex-1">'+esc(p)+'</span>'+DC.spk(p)+'</div>').join('');
    h += accHTML('<span class="flex items-center gap-2"><i data-lucide="'+g.icon+'" class="w-4 h-4 text-indigo-300"></i>'+esc(g.cat)+'</span>', body, null, false)+'<div class="h-1"></div>';
  });
  ['mm1','mm2','mm3'].forEach(mid=>{
    const title=(ORAL.mindmaps.find(m=>m.id===mid)||{}).title||'';
    let body=(ORAL_VOCAB[mid]||[]).map(v=>'<div class="flex items-start gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 mb-1"><div class="flex-1"><span class="font-medium text-slate-100">'+esc(v.da)+'</span> <span class="text-xs text-slate-500">'+esc(v.en)+'</span><div class="text-xs text-slate-400 italic">'+esc(v.ex)+'</div></div><div class="flex flex-col gap-1">'+DC.spk(v.da)+DC.spk(v.ex,'sætning')+'</div></div>').join('');
    h += accHTML('<span class="flex items-center gap-2"><i data-lucide="book-a" class="w-4 h-4 text-indigo-300"></i>Ordforråd · '+esc(title)+'</span>', body, null, false)+'<div class="h-1"></div>';
  });
  h += '</div></div>';
  document.getElementById('oral-body').innerHTML = h;
  if (SR && DC.pronCur) DC.pronRender();
  DC.ladderRender();
  DC.icons();
};
DC.setRate = function(r){ DC.state.speech.rate=r; DC.save(); DC.speak('Sådan lyder det.'); DC.oralListen(); };
DC.toggleAudio = function(){ DC.state.speech.on=!DC.state.speech.on; DC.save(); DC.oralListen(); };
/* speed-ladder drill: same phrase, four rungs of increasing speed — trains the ear for real exam pace */
DC.LADDER_RATES = [0.6, 0.7, 0.85, 1.0];
DC.LADDER_LABELS = ['Meget langsom','Langsom','Middel','Normal'];
DC.ladderStart = function(){
  DC.ladder = { phrase: pick(DC.pronPool()), rung: 0 };
  DC.ladderRender();
  DC.ladderPlay();
};
DC.ladderPlay = function(){
  if (!DC.ladder) return;
  DC.speak(DC.ladder.phrase, null, { rate: DC.LADDER_RATES[DC.ladder.rung] });
};
DC.ladderNext = function(){
  const l = DC.ladder; if (!l) return;
  if (l.rung < DC.LADDER_RATES.length-1){ l.rung++; DC.ladderRender(); DC.ladderPlay(); }
  else {
    DC.toast('Ladder complete — you followed "'+esc(l.phrase)+'" all the way up to normal speed!','ok');
    DC.ladder = null; DC.ladderRender();
  }
};
DC.ladderRender = function(){
  const el = document.getElementById('ladder-body'); if (!el) return;
  if (!DC.ladder){ el.innerHTML = '<button onclick="DC.ladderStart()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Start speed ladder</button>'; DC.icons(); return; }
  const l = DC.ladder;
  el.innerHTML = '<div class="text-sm text-slate-100 font-medium mb-2">“'+esc(l.phrase)+'”</div>'+
    '<div class="flex items-center gap-1.5 mb-3">'+DC.LADDER_LABELS.map((lab,i)=>'<span class="text-[10px] font-bold px-2 py-1 rounded-full '+(i<l.rung?'bg-emerald-500/15 text-emerald-300':i===l.rung?'bg-indigo-500/15 text-indigo-200':'bg-slate-800 text-slate-500')+'">'+lab+'</span>').join('')+'</div>'+
    '<div class="flex gap-2 flex-wrap"><button onclick="DC.ladderPlay()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm flex items-center gap-1.5"><i data-lucide="volume-2" class="w-3.5 h-3.5"></i>Play rung '+(l.rung+1)+'</button>'+
    '<button onclick="DC.ladderNext()" class="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">'+(l.rung<DC.LADDER_LABELS.length-1?'Understood — next rung ▸':'Finish')+'</button></div>';
  DC.icons();
};
/* pronunciation: pick a phrase, record, compare */
const PRON_BANK = [
  'Jeg vil gerne lære dansk.','Det er et godt spørgsmål.','Jeg skal lige tænke mig om.',
  'Hvor er det dejligt at høre fra dig.','Kan du gentage spørgsmålet?','Jeg synes, at det er vigtigt.',
  'I mit hjemland er det anderledes.','Tak for hjælpen.','Jeg cykler til arbejde hver dag.',
  'På den ene side, på den anden side.','Det har jeg ikke tænkt over før.','Vi ses i morgen.',
  'Undskyld, jeg kommer for sent.','Jeg er ikke helt enig.','Det afhænger af situationen.'
];
/* pronunciation practice draws from the material the student must actually SAY on test day
   (oral phrases + topic vocab examples), not just the 15 starter phrases */
DC.pronPool = function(){
  let pool = PRON_BANK.slice();
  try {
    ORAL.phraseGroups.forEach(g=> pool = pool.concat(g.items.filter(p=>p.length>12 && p.indexOf('…')===-1)));
    Object.values(ORAL_VOCAB).forEach(list=> list.forEach(v=>{ if(v.ex) pool.push(v.ex); }));
  } catch(e){}
  return pool;
};
DC.pronNext = function(){ DC.pronCur = pick(DC.pronPool()); DC.pronResult=null; DC.pronRender(); };
DC.pronRender = function(){
  const el = document.getElementById('pron-card'); if (!el) return;
  let h = '<div class="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Say this:</div>'+
    '<div class="flex items-center gap-2 mb-3"><span class="text-lg font-semibold text-slate-100">'+esc(DC.pronCur)+'</span>'+DC.spk(DC.pronCur)+'</div>'+
    '<button id="pron-mic" onclick="DC.pronRecord()" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="mic" class="w-4 h-4"></i>Tap and say it</button>'+
    '<div id="pron-out" class="mt-3"></div>';
  el.innerHTML = h;
  if (DC.pronResult) DC.pronShow(DC.pronResult);
  DC.icons();
};
DC.pronRecord = function(){
  if (!SR){ return; }
  const mic = document.getElementById('pron-mic');
  const rec = new SR(); rec.lang='da-DK'; rec.interimResults=false; rec.maxAlternatives=3;
  mic.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Lytter… sig sætningen nu'; DC.icons();
  let got=false;
  rec.onresult = function(ev){
    got=true;
    const heard = ev.results[0][0].transcript;
    const target = norm(DC.pronCur), said = norm(heard);
    const tw = target.split(' '), sw = said.split(' ');
    const matched = tw.filter(w=>sw.includes(w)).length;
    const pctm = Math.round(100*matched/tw.length);
    const good = pctm>=70;
    DC.state.pron.attempts++; if(good) DC.state.pron.good++;
    if (good) DC.state.concepts['o-mindmap'].history.push({ok:true,conf:'unsure',ts:Date.now(),hints:0});
    DC.save();
    DC.pronResult = { heard, pctm, good, tw, sw };
    DC.pronShow(DC.pronResult);
  };
  rec.onerror = function(ev){ document.getElementById('pron-out').innerHTML='<div class="text-xs text-amber-300">Could not hear you ('+esc(ev.error||'error')+'). Check microphone permission and try again.</div>'; resetMic(); };
  rec.onend = function(){ if(!got) resetMic(); };
  function resetMic(){ const m=document.getElementById('pron-mic'); if(m){ m.innerHTML='<i data-lucide="mic" class="w-4 h-4"></i>Tap and say it'; DC.icons(); } }
  try{ rec.start(); }catch(e){ resetMic(); }
};
DC.pronShow = function(r){
  const out = document.getElementById('pron-out'); if(!out) return;
  const heardHl = r.tw.map(w=> r.sw.includes(w)?'<span style="color:#2e7d32;font-weight:600">'+esc(w)+'</span>':'<span style="color:#c62828">'+esc(w)+'</span>').join(' ');
  out.innerHTML = '<div class="fade-in space-y-2">'+
    '<div class="text-xs text-slate-400">The computer heard: <span class="italic text-slate-200">"'+esc(r.heard)+'"</span></div>'+
    '<div class="text-sm">Word match: '+heardHl+'</div>'+
    '<div class="text-sm font-semibold '+(r.good?'text-emerald-300':'text-amber-300')+'">'+r.pctm+'% of the words came through — '+(r.good?'rigtig godt! 🎉':'keep shadowing the 🔊 and try again.')+'</div>'+
    '<div class="flex gap-2"><button onclick="DC.pronRecord()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Try again</button><button onclick="DC.pronNext()" class="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold">Next phrase →</button></div>'+
    '<div class="text-[10px] text-slate-500">Danish speech recognition is rough — a low score often means the computer, not you. Trust your ear and the 🔊 model most.</div></div>';
  DC.icons();
};
/* add the Lyt & Udtal tab to the Oral Strategist */
(function(){
  const _ro = DC.renderOral;
  DC.renderOral = function(){
    if ((DC.sub.oral||'o1')==='listen'){
      // build shell with the tab bar, then the listen body
      let h = '<div class="space-y-4 fade-in"><div class="card p-4"><div class="flex items-center gap-2 mb-3 flex-wrap"><i data-lucide="mic" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Oral Strategist — official SIRI Modul 3.3 format</h2>'+
        '<button onclick="DC.oralRandom()" class="ml-auto text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-2 flex items-center gap-1.5"><i data-lucide="shuffle" class="w-3.5 h-3.5"></i>Random examiner question</button></div>'+
        '<div class="flex gap-1.5 flex-wrap">'+
        [['o1','Opgave 1 · Mindmap presentation','presentation'],['o2','Opgave 2 · Conversation','users-round'],['tools','Oral toolbox & phrases','wrench'],['listen','🔊 Lyt & Udtal','volume-2']].map(t=>
          '<button onclick="DC.sub.oral=\''+t[0]+'\';DC.renderOral()" class="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 '+(t[0]==='listen'?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200')+'"><i data-lucide="'+t[2]+'" class="w-3.5 h-3.5"></i>'+t[1]+'</button>').join('')+
        '</div></div><div id="oral-body"></div></div>';
      document.getElementById('main').innerHTML = h;
      DC.oralListen();
      DC.icons();
      return;
    }
    _ro();
    // inject the Lyt & Udtal tab button into the existing tab bar
    const bar = document.querySelector('#main .card .flex.gap-1\\.5.flex-wrap');
    if (bar && !bar.querySelector('[data-listen-tab]')){
      const b=document.createElement('button');
      b.setAttribute('data-listen-tab','1');
      b.className='px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
      b.innerHTML='<i data-lucide="volume-2" class="w-3.5 h-3.5"></i>🔊 Lyt & Udtal';
      b.onclick=function(){ DC.sub.oral='listen'; DC.renderOral(); };
      bar.appendChild(b);
      DC.icons();
    }
  };
})();

/* =====================================================================
   AUDIO DICTATION — hear it, then type it (true listening skill)
   ===================================================================== */
(function(){
  const _gd = DC.gymDict;
  DC.gymDict = function(){
    _gd();
    const stage = document.getElementById('dict-stage');
    if (stage){
      const idx = (DC.sub.dictI!=null?DC.sub.dictI:0);
      stage.insertAdjacentHTML('afterbegin', '<button onclick="DC.dictAudio('+idx+')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2 mb-2"><i data-lucide="volume-2" class="w-4 h-4"></i>🔊 Audio dictation (listen, don’t look)</button>');
      DC.icons();
    }
  };
})();
DC.dictAudio = function(idx){
  const d = DICTATION[idx];
  DC.speak(d.da);
  document.getElementById('dict-stage').innerHTML = '<div class="bg-slate-900/70 border border-emerald-500/30 rounded-xl p-4 text-center fade-in"><div class="text-sm text-slate-300 mb-2">Listen and type what you hear — æ/ø/å count!</div>'+
    '<button onclick="DC.speak(DICTATION['+idx+'].da)" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm flex items-center gap-2 mx-auto"><i data-lucide="rotate-ccw" class="w-4 h-4"></i>Play again</button></div>'+
    '<textarea id="dict-in" rows="2" class="w-full mt-3 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none" placeholder="Skriv det, du hører…" autofocus></textarea>'+
    '<button onclick="DC.dictCheck('+idx+')" class="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Check</button>';
  const ta=document.getElementById('dict-in'); if(ta) ta.focus();
  DC.icons();
};


/* =====================================================================
   GLOBAL AUDIO — a 🔊 on every Danish sentence, app-wide & automatic.
   Plus: slower default speed for beginners, and a keep-alive so long
   passages don't cut off in Chrome.
   ===================================================================== */

/* ---- slower default for beginners + migrate existing users ---- */
(function(){ const _ds=DC.defaultState; DC.defaultState=function(){ const s=_ds(); s.speech.rate=0.7; return s; }; })();
(function(){ const _load=DC.load; DC.load=function(){ _load(); if(DC.state.speech && DC.state.speech.rate>=0.9){ DC.state.speech.rate=0.7; DC.save(); } }; })();

/* ---- keep speech alive for long texts (Chrome pauses after ~15s) ---- */
(function(){
  const _speak = DC.speak;
  DC.speak = function(text, cb, opts){
    _speak(text, function(ev, err){
      const synth = window.speechSynthesis;
      if (ev==='start'){
        if (DC._ka) clearInterval(DC._ka);
        DC._ka = setInterval(function(){ if(synth && synth.speaking){ try{ synth.pause(); synth.resume(); }catch(e){} } else { clearInterval(DC._ka); DC._ka=null; } }, 9000);
      }
      if (ev==='end' || ev==='error'){ if(DC._ka){ clearInterval(DC._ka); DC._ka=null; } }
      if (cb) cb(ev, err);
    }, opts);
  };
})();

/* ---- Danish detector (precise enough to skip English explanations) ---- */
const DA_WORDS = new Set(('jeg du han hun vi de det den er var har havde ikke og at på til med en et som fordi men så vil skal kan må der hvor hvad hvornår hvordan hvorfor om af for hej tak god goddag mit min dit din os jer sig hvis når selvom alligevel derfor desuden gerne meget også nu lige bare først aldrig altid tit ofte vej dag mad arbejde dansk her' ).split(' '));
const EN_WORDS = new Set(('the you your this that with because sentence verb adverb clause word answer correct wrong means after before must main subject position exam reading writing which when place time here they have does from into about only then note tip common mistake should would could where what why how use using learn learner practice every each option clause-order pronoun connector fits gap text question topic skill drill score points'.split(' ')));
function looksDanish(t){
  t = (t||'').trim();
  if (t.length < 8) return false;
  const words = (t.toLowerCase().match(/[a-zæøåéü]+/g)) || [];
  if (words.length < 3) return false;
  let dc=0, ec=0;
  words.forEach(w=>{ if(DA_WORDS.has(w)) dc++; if(EN_WORDS.has(w)) ec++; });
  const special = /[æøå]/i.test(t);
  if (ec >= 2) return false;                                    // looks like an English explanation
  if (special && ec===0 && dc>=1) return true;                  // æ/ø/å + no English markers → Danish
  if (dc>=2 && dc/words.length>=0.28 && ec===0) return true;    // strong Danish word density
  return false;
}

/* ---- the enhancer: add a speaker to Danish text leaves not already covered ---- */
DC.audioEnhance = function(root){
  if (!('speechSynthesis' in window) || !root || !DC.spk) return;
  const els = root.querySelectorAll('p,li,div,blockquote,figcaption,dd,td');
  for (let k=0;k<els.length;k++){
    const el = els[k];
    if (el.dataset.spkd) continue;
    if (el.querySelector('.spk-btn')) { el.dataset.spkd='1'; continue; }     // already has one (decon, examples, library)
    if (el.closest('button,select,textarea,a')) { el.dataset.spkd='1'; continue; } // never inside an interactive control
    if (el.querySelector('p,li,div,table,textarea,button,input,select,ul,ol')) continue; // only true text leaves
    const txt = (el.textContent||'').replace(/\s+/g,' ').trim();
    el.dataset.spkd='1';
    if (!looksDanish(txt)) continue;
    el.insertAdjacentHTML('beforeend', DC.spk(txt));
  }
  /* second pass: Danish sentences that live INSIDE option/phrase buttons.
     A <span class="spk-btn"> is valid inside a <button>, and the capture-phase
     click handler speaks it + stops propagation, so the answer is NOT triggered. */
  const opts = root.querySelectorAll('button.opt-btn, button.chip');
  for (let j=0;j<opts.length;j++){
    const b = opts[j];
    if (b.dataset.spkd) continue; b.dataset.spkd='1';
    if (b.querySelector('.spk-btn')) continue;
    const t = (b.textContent||'').replace(/\s+/g,' ').trim();
    if (!looksDanish(t)) continue;
    b.insertAdjacentHTML('beforeend', DC.spk(t));
  }
};

/* ---- run it on every render (in-place feedback, modals, view changes) ---- */
(function(){
  let pending=false, obs=null;
  function run(){
    pending=false;
    if (obs) obs.disconnect();
    try{ DC.audioEnhance(document.getElementById('main')); DC.audioEnhance(document.getElementById('modal-box')); }catch(e){}
    attach();
  }
  function schedule(){ if(pending) return; pending=true; setTimeout(run, 120); }
  function attach(){
    const m=document.getElementById('main'), md=document.getElementById('modal');
    if (!obs) obs = new MutationObserver(schedule);
    if (m) obs.observe(m, {childList:true, subtree:true});
    if (md) obs.observe(md, {childList:true, subtree:true});
  }
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ attach(); run(); }, 150); });
})();



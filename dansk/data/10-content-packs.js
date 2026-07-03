/* Dansk Coach — data/10-content-packs.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   EXTENSION PACK 3 — audit additions: extra grammar questions,
   phrase-bank additions, connector master list (always accessible)
   ===================================================================== */

/* ---------- 1. extra grammar questions (16–18) ---------- */
GRAMMAR_QUESTIONS.push(
{ id:'g16', type:'mc', difficulty:'Medium', concept:'sav-conn', extraConcepts:['adv-sub','inv-time'], tag:'når triggers SAV',
  prompt:'Choose the completely correct sentence:',
  options:[
    {text:'Når jeg ikke kan sove, hører jeg rolig musik.', ok:true, why:'SAV inside the når-clause ("jeg ikke kan") AND inversion in the main clause after the comma ("hører jeg"). Both rules respected.'},
    {text:'Når jeg kan ikke sove, hører jeg rolig musik.', ok:false, mistakeType:'Main-clause order after når', why:'"kan ikke" is main-clause order. After når the adverb must move before the verb: "jeg ikke kan sove".'},
    {text:'Når jeg ikke kan sove, jeg hører rolig musik.', ok:false, mistakeType:'No inversion after fronted clause', why:'The når-clause fills position 1, so the main clause must start with its verb: "…, hører jeg rolig musik."'}
  ],
  explanation:'"når" is a FAHNS-family connector: inside its clause the order is Subject + Adverb + Verb. And because the whole når-clause stands first, the main clause after the comma must invert.',
  trick:'når = SAV inside, springboard outside: comma → verb jumps over the subject.',
  decon:{type:'sub', cells:['Når','jeg','ikke','kan','sove → hører jeg rolig musik']},
  hints:['"når" is a connector → the first half is a subordinate clause.',
    'Inside the når-clause: where does "ikke" stand relative to "kan"?',
    'The whole når-clause is position 1 of the sentence. What must come right after the comma?',
    'Skeletons: Når + jeg + ikke + kan + sove | , + hører + jeg + rolig musik.',
    'Answer: "Når jeg ikke kan sove, hører jeg rolig musik."'] },

{ id:'g17', type:'mc', difficulty:'Easy', concept:'modal', extraConcepts:['adv-main'], tag:'Modal + aldrig',
  prompt:'Place "aldrig" correctly: "Hun vil ___ flyve igen." Which full sentence is right?',
  options:[
    {text:'Hun vil aldrig flyve igen.', ok:true, why:'"vil" is the finite verb (the modal), so "aldrig" parks right after it and before the infinitive "flyve".'},
    {text:'Hun aldrig vil flyve igen.', ok:false, mistakeType:'Subordinate order in main clause', why:'Adverb before the finite verb is the subordinate pattern — wrong in a main clause.'},
    {text:'Hun vil flyve aldrig igen.', ok:false, mistakeType:'Adverb after infinitive', why:'"aldrig" may not trail after the infinitive "flyve". It belongs between the two verbs.'}
  ],
  explanation:'Exactly the same rule as with ikke: with modal verbs the chain is modal + central adverb + infinitive. "Hun vil aldrig flyve igen."',
  trick:'Two verbs? The adverb goes between them — ikke, aldrig, altid and tit all obey.',
  decon:{type:'main', cells:['Hun','vil','—','aldrig','flyve igen']},
  hints:['Main clause or subordinate clause? No connector → main clause.',
    'Position 1 is the subject "Hun".',
    'There are two verbs: "vil" (finite modal) and "flyve" (infinitive). Which one does the adverb shadow?',
    'Skeleton: Hun + vil + aldrig + flyve + igen.',
    'Answer: "Hun vil aldrig flyve igen."'] },

{ id:'g18', type:'mc', difficulty:'Hard', concept:'inv-place', extraConcepts:['sav-conn'], tag:'Identify the mistake',
  prompt:'Find the mistake: "På mit arbejde vi holder pause klokken ti, fordi vi ikke må arbejde for længe uden pause."',
  options:[
    {text:'"vi holder" is wrong — it should be "holder vi".', ok:true, why:'"På mit arbejde" is a fronted place expression, so the verb must come second: "På mit arbejde holder vi pause…". The fordi-clause was already correct.'},
    {text:'"vi ikke må" is wrong — it should be "vi må ikke".', ok:false, mistakeType:'Missed correct SAV', why:'"fordi vi ikke må" is CORRECT subordinate order — ikke stands before the verb after fordi. Changing it would CREATE an error.'},
    {text:'The sentence is completely correct.', ok:false, mistakeType:'Missed inversion after place expression', why:'"På mit arbejde vi holder" leaves the verb in 3rd position — a fronted place expression demands inversion.'}
  ],
  explanation:'Two clauses, one error: the main clause needs inversion after the fronted place expression ("holder vi"), while the fordi-clause already shows perfect SAV ("vi ikke må"). The trap is "fixing" the part that was right.',
  trick:'Check each half on its own rule: PLACE first → swap; fordi → ikke before the verb.',
  decon:{type:'main', cells:['På mit arbejde','holder','vi','—','pause klokken ti']},
  hints:['There are two clauses. Test the main clause and the fordi-clause separately.',
    'Main clause: what fills position 1? "På mit arbejde" — a place expression.',
    'Where must the finite verb "holder" stand, and where is it now?',
    'Now the fordi-clause: is "vi ikke må" correct SAV? (Yes!)',
    'Answer: only "vi holder" is wrong → "På mit arbejde holder vi pause klokken ti, …"'] }
);

/* ---------- 2. phrase-bank additions ---------- */
(function(){
  const cat = name => WRITING.phrases.find(p=>p.cat===name);
  cat('Openings').items.push('Tak for jeres hurtige svar.');
  cat('Asking politely').items.push('Jeg håber, at I kan hjælpe mig.');
  cat('Closings').items.splice(cat('Closings').items.indexOf('Venlig hilsen'), 0, 'Med venlig hilsen');
  cat('Adding information').items.push('På den ene side … på den anden side …');
  WRITING.connectors.push(
    { w:'desværre', e:'unfortunately (inversion!)' },
    { w:'på den anden side', e:'on the other hand (inversion!)' },
    { w:'heldigvis', e:'luckily (inversion!)' }
  );
  const comp = ORAL.phraseGroups.find(g=>g.cat==='Comparing');
  if (comp && !comp.items.some(x=>x.indexOf('På den ene side')===0)) comp.items.push('På den ene side … på den anden side …');
})();

/* ---------- 6. CONNECTOR MASTER LIST — always accessible ---------- */
const CONNECTORS = [
  /* SAV — subordinating: Subject + Adverb + Verb, no inversion inside */
  { w:'fordi', en:'because', type:'sav', ex:'Jeg bliver hjemme, fordi jeg ikke har det godt.', note:'THE classic. Never "fordi jeg har ikke…". Compare with "for" below!' },
  { w:'at', en:'that', type:'sav', ex:'Hun siger, at hun aldrig drikker kaffe.', note:'Quiet but deadly — learners forget that at-clauses flip the order too.' },
  { w:'hvis', en:'if', type:'sav', ex:'Hvis du ikke kan komme, skal du ringe.', note:'Fronted hvis-clause = position 1 → the main clause after the comma inverts.' },
  { w:'når', en:'when (repeated / future)', type:'sav', ex:'Når jeg ikke kan sove, hører jeg musik.', note:'Habits and future. One-time past events use "da".' },
  { w:'da', en:'when (one time, past) / since', type:'sav', ex:'Da jeg kom til Danmark, kunne jeg ikke et ord dansk.', note:'da = once in the past; når = every time / in the future.' },
  { w:'selvom', en:'even though', type:'sav', ex:'Han kommer, selvom han aldrig har tid.', note:'' },
  { w:'om', en:'whether / if (yes-no)', type:'sav', ex:'Jeg ved ikke, om de ikke kommer.', note:'Indirect yes/no-questions: "Jeg ved ikke, om…".' },
  { w:'som', en:'who / which / that', type:'sav', ex:'Det er en vane, som jeg ikke kan ændre.', note:'Relative clauses count as subordinate — adverb before the verb.' },
  { w:'der', en:'who / which (subject)', type:'sav', ex:'Jeg har en nabo, der altid larmer.', note:'Only used when it IS the subject of the relative clause.' },
  { w:'mens', en:'while', type:'sav', ex:'Hun læser, mens børnene ikke er hjemme.', note:'' },
  { w:'før / inden', en:'before', type:'sav', ex:'Ring til mig, før du tager af sted.', note:'' },
  { w:'efter at', en:'after', type:'sav', ex:'Efter at vi havde spist, gik vi en tur.', note:'In speech often just "efter". Fronted → main clause inverts.' },
  { w:'indtil', en:'until', type:'sav', ex:'Vi venter, indtil regnen ikke er så kraftig.', note:'' },
  { w:'siden', en:'since (time)', type:'sav', ex:'Jeg har boet her, siden jeg kom til Danmark.', note:'' },
  { w:'så snart', en:'as soon as', type:'sav', ex:'Jeg ringer, så snart jeg ikke har travlt.', note:'' },
  { w:'hvor / hvad / hvem / hvorfor / hvordan', en:'indirect questions', type:'sav', ex:'Kan du fortælle mig, hvornår bussen ikke kører?', note:'After a question word INSIDE a sentence: subordinate order, no inversion.' },
  /* NORMAL — coordinating: nothing changes */
  { w:'og', en:'and', type:'normal', ex:'Jeg arbejder, og min kone studerer.', note:'' },
  { w:'men', en:'but', type:'normal', ex:'Jeg vil gerne komme, men jeg kan ikke.', note:'Main-clause order on both sides: "men jeg kan ikke" (ikke AFTER the verb).' },
  { w:'eller', en:'or', type:'normal', ex:'Vil du have kaffe, eller drikker du te?', note:'' },
  { w:'for', en:'because / for', type:'normal', ex:'Jeg bliver hjemme, for jeg har ikke tid.', note:'THE TRAP: "for" keeps normal order ("jeg har ikke"), but "fordi" forces SAV ("fordi jeg ikke har"). Same meaning, opposite word order!' },
  { w:'så', en:'so (result)', type:'normal', ex:'Det regnede, så vi tog bussen.', note:'As a RESULT conjunction: normal order. But see "så (then)" below — double agent!' },
  /* INV — adverbials: inversion when they stand first */
  { w:'derfor', en:'therefore', type:'inv', ex:'Derfor tager jeg bussen i dag.', note:'Means the same as "so" — but as position 1 it forces verb-second: "Derfor TAGER jeg…".' },
  { w:'desuden', en:'furthermore', type:'inv', ex:'Desuden har jeg et spørgsmål om huslejen.', note:'Gold for writing tasks — shows structure AND correct inversion.' },
  { w:'alligevel', en:'nevertheless / anyway', type:'inv', ex:'Alligevel cyklede han til arbejde.', note:'' },
  { w:'bagefter / derefter', en:'afterwards', type:'inv', ex:'Bagefter spiste vi kage i kantinen.', note:'' },
  { w:'så', en:'then (sequence)', type:'inv', ex:'Så kom chefen ind i lokalet.', note:'The double agent: "så" = then (fronted) → inversion; "så" = so (conjunction) → normal order.' },
  { w:'måske', en:'maybe', type:'inv', ex:'Måske kommer han i morgen.', note:'Standard Danish inverts: "Måske KOMMER han". (You will hear "måske han kommer" in speech — avoid it in the test.)' },
  { w:'heldigvis', en:'luckily', type:'inv', ex:'Heldigvis fandt jeg mine nøgler.', note:'' },
  { w:'desværre', en:'unfortunately', type:'inv', ex:'Desværre kan jeg ikke komme på fredag.', note:'Perfect polite-complaint opener — and a free inversion point in writing.' },
  { w:'pludselig', en:'suddenly', type:'inv', ex:'Pludselig begyndte det at regne.', note:'' },
  { w:'senere / samtidig', en:'later / at the same time', type:'inv', ex:'Senere ringede hun til lægen.', note:'' },
  { w:'til gengæld', en:'on the other hand / in return', type:'inv', ex:'Til gengæld smider vi aldrig mad ud.', note:'Frequent in Opgave 4 texts — watch for it when reading, use it when speaking.' },
  { w:'på den anden side', en:'on the other hand', type:'inv', ex:'På den anden side er det dyrt at have bil.', note:'Pair it with "På den ene side …" for a balanced oral answer.' },
  { w:'først / til sidst', en:'first / finally', type:'inv', ex:'Først læste jeg spørgsmålene. Til sidst tjekkede jeg mine svar.', note:'' },
  { w:'for eksempel', en:'for example', type:'inv', ex:'For eksempel cykler jeg til arbejde hver dag.', note:'Fronted → inversion. In the middle of a sentence it changes nothing.' },
  { w:'tidsudtryk (i dag, i går, i morgen, om vinteren, hver dag …)', en:'time phrases', type:'inv', ex:'I morgen skal jeg til samtale. Om vinteren bliver det tidligt mørkt.', note:'Any fronted time phrase = position 1 → the verb must come next.' },
  { w:'stedsudtryk (i Danmark, på arbejdet, hjemme hos os …)', en:'place phrases', type:'inv', ex:'I Danmark cykler mange til arbejde. Hjemme hos os spiser vi klokken 18.', note:'Place works exactly like time: front it — flip it.' }
];

const CONN_TYPES = {
  sav:    { label:'SAV — subordinate clause', short:'SAV', cls:'bg-rose-500/15 text-rose-300 border-rose-500/40', desc:'Connector + Subject + ADVERB + Verb. No inversion inside the clause. (fordi jeg IKKE kan…)' },
  normal: { label:'No change — main clause order', short:'No change', cls:'bg-emerald-500/15 text-emerald-300 border-emerald-500/40', desc:'Coordinating words: both halves keep normal main-clause order. (men jeg kan IKKE…)' },
  inv:    { label:'Inversion — when it stands first', short:'Inversion', cls:'bg-indigo-500/15 text-indigo-300 border-indigo-500/40', desc:'Fronted adverbial fills position 1 → verb second, subject third. (Derfor TAGER JEG bussen.)' }
};

DC.connState = { q:'', type:'all' };
DC.connectorGuide = function(){
  DC.connState = { q:'', type:'all' };
  DC.modal('<div>'+
    '<div class="flex items-center justify-between mb-1"><h3 class="font-bold text-slate-100 flex items-center gap-2"><i data-lucide="link-2" class="w-5 h-5 text-indigo-300"></i>Connector Master List</h3>'+
    '<button onclick="DC.closeModal()" class="text-slate-500 hover:text-slate-300"><i data-lucide="x" class="w-5 h-5"></i></button></div>'+
    '<p class="text-xs text-slate-400 mb-3">Which connectors flip the word order? The three groups below decide every word-order point in Modul 3.3. Search or filter — this guide is available from every screen via the floating button.</p>'+
    '<input id="conn-search" oninput="DC.connState.q=this.value;DC.connRender()" placeholder="Search… (fx fordi, derfor, men, because, then)" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 outline-none mb-2">'+
    '<div class="flex gap-1.5 flex-wrap mb-3" id="conn-chips"></div>'+
    '<div id="conn-list" class="space-y-2"></div>'+
    '<div class="mt-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-3 py-2.5 text-xs text-indigo-100 space-y-1">'+
    '<div><b>The 3-second check:</b> see a connector → ask "which group?" → place ikke/the verb accordingly.</div>'+
    '<div><b>Trap 1:</b> for ≠ fordi. Same meaning, opposite order.</div>'+
    '<div><b>Trap 2:</b> så = "so" (no change) but also "then" (inversion when fronted).</div>'+
    '<div><b>Trap 3:</b> a fronted SAV-clause ("Hvis det regner, …") is position 1 — the main clause after the comma inverts.</div></div>'+
    '</div>');
  DC.connRender();
  const inp = document.getElementById('conn-search'); if (inp) inp.focus();
};
/* floating always-accessible button */
(function(){
  const fab = document.createElement('button');
  fab.id = 'conn-fab';
  fab.className = 'no-print fixed bottom-5 left-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-xl shadow-indigo-950/60';
  fab.innerHTML = '<i data-lucide="link-2" class="w-4 h-4"></i><span class="hidden sm:inline">Connectors</span>';
  fab.title = 'Connector Master List — which words flip the word order? (always available)';
  fab.onclick = function(){ DC.connectorGuide(); };
  document.body.appendChild(fab);
})();


/* =====================================================================
   PHASE 2 — MORE READING + WRITING CONTENT
   ===================================================================== */

/* ---------- 2.1a Opgave 3 set C: long comprehension passage ---------- */
READING.o3c = {
  id:'o3c', concept:'r-3', opgave:'Opgave 3 · Comprehension', kind:'comprehension',
  title:'Sundhed, stress og balance i hverdagen',
  instruction:'Læs teksten, og svar på spørgsmålene. Vælg det svar, der passer bedst. (Comprehension training: main ideas, opinions, inference and vocabulary from context.)',
  text:'Mange danskere taler om balance i hverdagen, men hvad betyder det egentlig? For de fleste handler det om at få arbejde, familie, motion og fritid til at hænge sammen — uden at blive stresset undervejs.\n\nIfølge Sundhedsstyrelsen føler cirka hver fjerde voksne dansker sig ofte stresset. Det er især børnefamilier og unge under 30, der oplever et stort pres. Forskerne peger på flere årsager: lange arbejdsdage, mange aftaler, sociale medier og en kultur, hvor man gerne vil nå det hele. "Vi har fået travlt med at have travlt," siger stressforsker Mette Holm i et interview. Hun mener, at mange forveksler en fyldt kalender med et godt liv.\n\nSamtidig viser undersøgelser, at danskerne faktisk har flere redskaber mod stress end de fleste. Arbejdsugen er på 37 timer, mange arbejdspladser har flekstid, og det er normalt at gå hjem klokken 16 for at hente børn. Frokostpausen er kort, men den holdes næsten altid sammen med kollegerne, og det sociale fællesskab beskytter mod stress. Desuden cykler mange til arbejde, og hverdagsmotion er måske den billigste medicin, der findes.\n\nMette Holm anbefaler tre enkle vaner. For det første: Planlæg pauser, ligesom man planlægger møder — en gåtur efter frokost tæller. For det andet: Læg telefonen væk en time før sengetid, fordi skærmen stjæler den søvn, som hjernen skal bruge til at rydde op. For det tredje: Lær at sige nej. "Hver gang du siger ja til noget, siger du samtidig nej til noget andet — ofte til din egen hvile," forklarer hun.\n\nMen balance er ikke kun den enkeltes ansvar, understreger hun. Arbejdspladser, der forventer svar på mails om aftenen, er en del af problemet. Flere danske firmaer har derfor indført mailfri weekend, og nogle kommuner tilbyder gratis kurser i stresshåndtering. Kritikere mener dog, at den slags tilbud kun behandler symptomerne, mens det egentlige problem er, at vi vil for meget på for lidt tid.\n\nMåske er den vigtigste pointe denne: Balance er ikke en præstation, man kan blive færdig med. Det er små valg, der gentages hver dag — et nej i kalenderen, en cykeltur i regnen, en aften uden skærm. Som Mette Holm siger til sidst i interviewet: "Det perfekte liv findes ikke. Men et roligt tirsdagsaftensliv — det kan de fleste af os faktisk nå."',
  questions:[
    { q:'Hvad er tekstens hovedpointe?', concept:'r-3',
      options:[
        {text:'Balance skabes gennem små daglige valg — ikke gennem én stor løsning.', ok:true, why:'The conclusion states it directly: balance "er ikke en præstation, man kan blive færdig med. Det er små valg, der gentages hver dag."'},
        {text:'Danskerne er de mest stressede mennesker i Europa.', ok:false, why:'The text never compares Denmark with Europe — and it even says Danes have MORE tools against stress than most.'},
        {text:'Man skal sige sit job op, hvis man føler sig stresset.', ok:false, why:'Quitting is never suggested; the advice is pauses, less screen and saying no.'},
        {text:'Stress kan kun løses af arbejdspladsen.', ok:false, why:'The text says balance is BOTH personal habits and workplace culture — not only one side.'}
      ]},
    { q:'Sandt, falsk eller står der ikke i teksten? — "Cirka 25 % af voksne danskere føler sig ofte stressede."', concept:'r-keywords',
      options:[
        {text:'Sandt', ok:true, why:'"hver fjerde voksne dansker" = every fourth = ca. 25 %. You must convert the Danish fraction to a percentage.'},
        {text:'Falsk', ok:false, why:'"Hver fjerde" means exactly one in four — 25 %. The statement matches.'},
        {text:'Det står der ikke i teksten', ok:false, why:'It IS in the text, just written as "hver fjerde" instead of a percentage — a classic rephrasing trap.'}
      ]},
    { q:'Sandt, falsk eller står der ikke i teksten? — "Mette Holm anbefaler at træne i et fitnesscenter tre gange om ugen."', concept:'r-keywords',
      options:[
        {text:'Det står der ikke i teksten', ok:true, why:'Her three habits are pauses, no screen before bed, and saying no. Fitness centres are never mentioned — everyday cycling is, but that is not her recommendation list.'},
        {text:'Sandt', ok:false, why:'Check her three pieces of advice — none of them mentions a fitness centre.'},
        {text:'Falsk', ok:false, why:'Careful: "falsk" requires the text to CONTRADICT the claim. The text simply never discusses fitness centres — so the answer is "not stated".'}
      ]},
    { q:'Hvorfor holder frokostpausen ifølge teksten stress nede?', concept:'r-inference',
      options:[
        {text:'Fordi man spiser den sammen med kollegerne, og fællesskab beskytter mod stress.', ok:true, why:'"den holdes næsten altid sammen med kollegerne, og det sociale fællesskab beskytter mod stress."'},
        {text:'Fordi den er meget lang.', ok:false, why:'The text says the opposite: "Frokostpausen er kort".'},
        {text:'Fordi man må gå hjem efter frokost.', ok:false, why:'Going home at 16 is mentioned separately — not as a result of lunch.'},
        {text:'Fordi maden i danske kantiner er sund.', ok:false, why:'Food quality is never discussed.'}
      ]},
    { q:'Hvad betyder udtrykket "skærmen stjæler den søvn, som hjernen skal bruge til at rydde op"?', concept:'r-inference',
      options:[
        {text:'Telefonbrug om aftenen ødelægger den søvn, hjernen har brug for til at restituere.', ok:true, why:'"stjæler søvn" is a metaphor: screen time takes the sleep the brain needs; "rydde op" = the brain’s nightly recovery work.'},
        {text:'Man skal rydde op i sine apps, før man sover.', ok:false, why:'"rydde op" refers to the BRAIN’s cleaning process — not the phone’s.'},
        {text:'Skærme bliver væk, når man sover.', ok:false, why:'Reads the metaphor literally.'},
        {text:'Hjernen arbejder bedst foran en skærm.', ok:false, why:'The opposite of the point being made.'}
      ]},
    { q:'Hvad mener kritikerne om kommunernes stresskurser?', concept:'r-opinion',
      options:[
        {text:'At de kun behandler symptomerne og ikke det egentlige problem.', ok:true, why:'"Kritikere mener dog, at den slags tilbud kun behandler symptomerne, mens det egentlige problem er, at vi vil for meget på for lidt tid." The signal word "dog" marks the opposing view.'},
        {text:'At de er for dyre for kommunerne.', ok:false, why:'Price is never the critics’ point — the courses are even described as free.'},
        {text:'At alle burde have pligt til at tage dem.', ok:false, why:'Nobody suggests mandatory courses.'},
        {text:'At de virker rigtig godt.', ok:false, why:'That would be praise — "dog" introduces criticism, not support.'}
      ]}
  ]
};

/* ---------- 2.1b Opgave 4 set C: sentence-insertion text ---------- */
READING.o4c = {
  id:'o4c', concept:'r-4', opgave:'Opgave 4 · Indsæt sætninger', kind:'insertion',
  title:'Uddannelse og livslang læring i Danmark',
  instruction:'Læs teksten. Der mangler fire sætninger (1–4). Vælg for hvert hul den sætning fra listen (A–F), der passer. Der er to sætninger, du ikke skal bruge.',
  parts:[
    'I Danmark hører man tit udtrykket "livslang læring". Det betyder, at uddannelse ikke slutter, når man forlader skolen som ung — man bliver ved med at lære hele livet. ',
    {g:0},
    ' Mange voksne læser om aftenen, i weekenden eller ved siden af deres arbejde.\n\nMulighederne er mange. På VUC kan voksne tage fag fra folkeskolen eller gymnasiet, som de mangler. ',
    {g:1},
    ' Derudover findes der aftenskoler, hvor man kan lære alt fra madlavning og keramik til regnskab og fremmedsprog. Kurserne er åbne for alle, og staten betaler en del af prisen.\n\nFor mange nye danskere er sprogskolen det første møde med det danske uddannelsessystem. ',
    {g:2},
    ' Det giver adgang til både arbejde, videre uddannelse og i sidste ende permanent ophold.\n\nArbejdspladserne spiller også en vigtig rolle. Mange firmaer betaler kurser for deres medarbejdere, og fagforeningerne tilbyder billig efteruddannelse til deres medlemmer. ',
    {g:3},
    ' På den måde bliver læring en naturlig del af arbejdslivet — og ikke noget, man kun gjorde, da man var ung.'
  ],
  pool:[
    { letter:'A', text:'Derfor er det helt almindeligt, at en dansker på 45 år sidder på skolebænken igen.', gap:0, why:'"Derfor" follows from the definition of livslang læring, and the 45-year-old on the school bench leads into the next sentence about adults studying in the evenings.' },
    { letter:'B', text:'Erhvervsskolerne uddanner desuden voksne lærlinge, som skifter fag midt i livet.', gap:1, why:'The paragraph lists education options (VUC → aftenskoler). "desuden" adds another option in the chain — exactly what the gap needs.' },
    { letter:'C', text:'Her lærer man ikke kun sproget, men også hvordan samfundet fungerer.', gap:2, why:'"Her" points directly back at "sprogskolen" in the sentence before, and the content explains why language school opens doors (work, education, residence).' },
    { letter:'D', text:'Nogle brancher kræver endda, at man tager kurser hvert år for at beholde sit certifikat.', gap:3, why:'The paragraph is about workplaces and unions paying for courses; the yearly certificate requirement intensifies that point and leads into "På den måde bliver læring en naturlig del af arbejdslivet".' },
    { letter:'E', text:'Børnehaver er gratis for alle familier i Danmark.', gap:null, why:'Distractor: kindergartens have nothing to do with adult education — topic trap.' },
    { letter:'F', text:'Derfor holder de fleste danskere op med at lære efter folkeskolen.', gap:null, why:'Distractor: directly contradicts the whole text about lifelong learning.' }
  ]
};

/* ---------- 2.1c Opgave 2A set: skim & scan texts ---------- */
READING.skim = {
  id:'skim', concept:'r-2a', opgave:'Opgave 2A · Skim & scan',
  instruction:'Læs hurtigt — find fakta. Du skal IKKE læse hvert ord: scan efter navne, tal, datoer og steder. 5 minutter til alle tre tekster.',
  texts:[
  { title:'Jobopslag: Servicemedarbejder til Hotel Søborg',
    text:'Hotel Søborg søger en servicemedarbejder til vores morgenrestaurant. Arbejdstiden er mandag til fredag fra kl. 6.30 til 12.30 — ingen weekendarbejde. Dine opgaver bliver at dække bord, fylde buffeten op og hjælpe vores gæster. Du skal kunne tale dansk i hverdagssituationer, og erfaring fra hotel eller café er en fordel, men ikke et krav. Vi tilbyder fast løn efter overenskomst, gratis morgenmad og gode kolleger fra hele verden. Send en kort ansøgning til job@hotelsoeborg.dk senest fredag den 24. maj. Har du spørgsmål, kan du ringe til Pia på 44 12 88 90 mellem kl. 10 og 14.',
    questions:[
      { q:'Hvornår er arbejdstiden?', options:[
        {text:'Mandag–fredag kl. 6.30–12.30', ok:true, why:'Stated directly: scan for "Arbejdstiden er…". Note "ingen weekendarbejde" confirms it.'},
        {text:'Alle ugens dage kl. 6.30–12.30', ok:false, why:'The ad explicitly says no weekend work.'},
        {text:'Mandag–fredag kl. 10–14', ok:false, why:'10–14 is Pias telephone time — a number trap.'}]},
      { q:'Skal man have erfaring fra hotel?', options:[
        {text:'Nej — det er en fordel, men ikke et krav', ok:true, why:'"erfaring … er en fordel, men ikke et krav".'},
        {text:'Ja, mindst to års erfaring', ok:false, why:'No experience requirement is stated anywhere.'},
        {text:'Ja, men kun fra café', ok:false, why:'Hotel OR café experience is an advantage — neither is required.'}]},
      { q:'Hvordan søger man jobbet?', options:[
        {text:'Send en kort ansøgning på mail senest den 24. maj', ok:true, why:'"Send en kort ansøgning til job@hotelsoeborg.dk senest fredag den 24. maj."'},
        {text:'Ring til Pia og søg telefonisk', ok:false, why:'The phone number is only for QUESTIONS, not applications.'},
        {text:'Mød op på hotellet inden kl. 14', ok:false, why:'Showing up is never mentioned.'}]}
    ]},
  { title:'Besked fra boligforeningen: Renovering af badeværelser',
    text:'Kære beboere i Blok C. Fra mandag den 3. juni begynder håndværkerne at renovere badeværelserne i jeres blok. Arbejdet tager cirka tre uger pr. opgang og foregår på hverdage mellem kl. 7.30 og 16. I kan ikke bruge jeres eget badeværelse, mens der arbejdes i lejligheden — det drejer sig om cirka fem arbejdsdage pr. lejlighed. I de dage kan I gratis bruge badet i fælleshuset, som har åbent døgnet rundt. Husk at fjerne alle personlige ting fra badeværelset, inden arbejdet starter. I får en seddel i postkassen senest en uge før, håndværkerne kommer til netop jeres lejlighed. Spørgsmål? Kontakt varmemester Jan på kontoret tirsdag og torsdag kl. 9–11.',
    questions:[
      { q:'Hvor længe kan man ikke bruge sit eget badeværelse?', options:[
        {text:'Cirka fem arbejdsdage', ok:true, why:'"det drejer sig om cirka fem arbejdsdage pr. lejlighed". The three weeks is per OPGANG — a number trap.'},
        {text:'Tre uger', ok:false, why:'Three weeks is the time per stairwell (opgang), not per apartment.'},
        {text:'Hele juni', ok:false, why:'June 3rd is only the start date for the block.'}]},
      { q:'Hvad kan man gøre, mens ens badeværelse renoveres?', options:[
        {text:'Bruge badet i fælleshuset gratis — det har åbent hele døgnet', ok:true, why:'"kan I gratis bruge badet i fælleshuset, som har åbent døgnet rundt".'},
        {text:'Bade hos varmemester Jan', ok:false, why:'Jan answers questions — he does not lend out his bathroom!'},
        {text:'Få rabat på huslejen', ok:false, why:'Rent reduction is never mentioned.'}]},
      { q:'Hvordan får man at vide, hvornår ens egen lejlighed står for tur?', options:[
        {text:'Man får en seddel i postkassen senest en uge før', ok:true, why:'"I får en seddel i postkassen senest en uge før".'},
        {text:'Man skal selv ringe til håndværkerne', ok:false, why:'No phone number for the workers is given.'},
        {text:'Det står på opslagstavlen i fælleshuset', ok:false, why:'The notice board is never mentioned.'}]},
      { q:'Hvornår kan man træffe varmemesteren?', options:[
        {text:'Tirsdag og torsdag kl. 9–11', ok:true, why:'Last line: "tirsdag og torsdag kl. 9–11".'},
        {text:'Hverdage kl. 7.30–16', ok:false, why:'That is the craftsmen’s working time — a classic scan trap.'},
        {text:'Mandag den 3. juni', ok:false, why:'That is the renovation start date.'}]}
    ]},
  { title:'Kommunen inviterer: International madfestival i Byparken',
    text:'Holstebro Kommune inviterer alle borgere til international madfestival lørdag den 17. august kl. 11–17 i Byparken. Over 30 boder serverer mad fra hele verden — fra syriske falafler til vietnamesisk pho. Der er gratis entré, og børn under 12 år spiser gratis ved alle boder mellem kl. 11 og 13. På scenen kan du opleve musik og dans fra fem forskellige lande, og kl. 14 er der fælles folkedans for alle, der har lyst. Tag selv tæppe eller stole med — der er begrænsede siddepladser. Festivalen holdes i år for ottende gang og arrangeres af kommunen i samarbejde med 12 lokale foreninger. Vil din forening have en bod næste år? Skriv til kultur@holstebro.dk inden den 1. oktober.',
    questions:[
      { q:'Hvad koster det at komme ind på festivalen?', options:[
        {text:'Ingenting — der er gratis entré', ok:true, why:'"Der er gratis entré". Children under 12 even eat free 11–13.'},
        {text:'Det er kun gratis for børn', ok:false, why:'Entry is free for ALL; the children’s deal is about the FOOD.'},
        {text:'30 kr. pr. bod', ok:false, why:'"Over 30 boder" is the number of stalls — number trap.'}]},
      { q:'Hvad sker der klokken 14?', options:[
        {text:'Fælles folkedans for alle', ok:true, why:'"kl. 14 er der fælles folkedans for alle, der har lyst".'},
        {text:'Festivalen lukker', ok:false, why:'It runs until 17.'},
        {text:'Børn spiser gratis', ok:false, why:'The children’s offer is 11–13.'}]},
      { q:'Hvad skal man selv huske at tage med?', options:[
        {text:'Tæppe eller stole', ok:true, why:'"Tag selv tæppe eller stole med — der er begrænsede siddepladser."'},
        {text:'Mad og drikke', ok:false, why:'Food is what the 30 stalls sell!'},
        {text:'Billetter', ok:false, why:'Entry is free — no tickets exist.'}]},
      { q:'Hvor mange gange er festivalen blevet holdt før i år?', options:[
        {text:'Syv gange — i år er ottende gang', ok:true, why:'"holdes i år for ottende gang" → seven previous editions. You must do the small calculation.'},
        {text:'Tolv gange', ok:false, why:'12 is the number of local foreninger — number trap.'},
        {text:'Fem gange', ok:false, why:'Five is the number of countries on stage.'}]}
    ]}
  ]
};

/* ---------- 2.2 four new writing tasks ---------- */
WRITING.tasks.push(
{ id:'w1d', opgave:'Opgave 1', concept:'w-opg1', minWords:100, maxWords:200,
  title:'Henvendelse: Forkert holdniveau på sprogskolen',
  situation:'Du går på sprogskole, men du synes, at dit hold er for nemt for dig. Du lærte hurtigt i starten, og nu keder du dig i timerne. Du vil skrive til din lærer og skolens kontor.',
  taskIntro:'Skriv en henvendelse til sprogskolen. Du skal fortælle:',
  bullets:['hvem du er, og hvilket hold du går på','hvad problemet er','hvorfor du tror, at et andet hold passer bedre til dig','hvad du gerne vil have, at skolen gør.'],
  structure:['Greeting','Who you are: name, team, how long (bullet 1)','The problem: level too easy, concrete examples (bullet 2)','Your evidence: homework finished fast, test results (bullet 3)','Request: a level test or a move to a faster team (bullet 4)','Polite closing + contact'],
  planning:'Plan: 1) navn, hold 2A, 4 måneder. 2) keder mig, kan stoffet. 3) laver lektier på 10 min, fik topkarakter i sidste test. 4) niveautest / flyt mig op.',
  modelPassing:'Kære Sprogcenter Vest\n\nJeg hedder Ana Silva, og jeg går på hold 2A hos Peter. Jeg har gået på holdet i fire måneder.\n\nJeg skriver til jer, fordi jeg synes, at holdet er for nemt for mig. Jeg er altid hurtigt færdig med opgaverne, og så sidder jeg bare og venter. Jeg keder mig i timerne, og jeg lærer ikke nok nyt.\n\nJeg tror, at et hurtigere hold passer bedre til mig. Jeg laver mine lektier på ti minutter, og jeg fik 95 % rigtige i den sidste test. Min lærer siger også, at jeg er klar til mere.\n\nKan I give mig en niveautest? Eller kan I flytte mig til et hold på et højere niveau?\n\nPå forhånd tak for hjælpen.\n\nVenlig hilsen\nAna Silva',
  modelStrong:'Kære Sprogcenter Vest\n\nMit navn er Ana Silva, kursistnummer 312-90, og jeg har de sidste fire måneder gået på hold 2A hos Peter Madsen.\n\nJeg skriver til jer, fordi jeg er kommet i tvivl, om holdets niveau passer til mig. Da jeg startede, var niveauet perfekt, men nu er jeg næsten altid færdig med opgaverne længe før de andre. Derfor keder jeg mig desværre i en stor del af timerne, og jeg er bange for, at jeg ikke udvikler mig hurtigt nok.\n\nJeg tror, at et hold på et højere niveau ville passe bedre. Jeg bruger højst ti minutter på lektierne, jeg fik 95 % i den seneste modulprøve, og Peter har selv sagt, at jeg sprogligt ligger i toppen af holdet. Hjemme taler jeg desuden dansk med min mand hver dag, så jeg får meget træning.\n\nJeg vil derfor gerne bede om en niveautest, så I kan vurdere, hvilket hold der passer bedst. Hvis der er venteliste, hører jeg gerne, hvor lang den er.\n\nI kan kontakte mig på telefon 42 17 65 28 eller på denne mail. På forhånd tak — jeg er rigtig glad for skolen og vil bare gerne lære mest muligt.\n\nVenlig hilsen\nAna Silva',
  whyBetter:['Polite framing: "kommet i tvivl, om niveauet passer" instead of "holdet er dårligt" — criticism without blame.','Strong evidence chain: time on homework, test score, the teacher’s own words, Danish at home.','Concrete request plus a fallback (venteliste) — easy for the office to act on.','Inversion and SAV everywhere: "Derfor keder jeg mig…", "fordi jeg er kommet i tvivl", "så I kan vurdere…".','Ends warmly — complaining about the level while praising the school keeps every relationship intact.'],
  commonMistakes:['Sounding arrogant ("holdet er alt for dumt for mig") — frame it as a wish to learn, not superiority.','No evidence — without examples the office cannot judge anything.','Forgetting the actual request (bullet 4): test me / move me.','"fordi jeg keder mig altid" word order: altid before the verb only AFTER a connector — check it.']
},
{ id:'w1e', opgave:'Opgave 1', concept:'w-opg1', minWords:100, maxWords:200,
  title:'Klage: Støj fra renovering i ejendommen',
  situation:'Boligforeningen renoverer lejligheder i din opgang. Håndværkerne starter hver dag klokken 6 om morgenen — selvom reglerne siger klokken 7.30 — og de larmer også i weekenden. Du arbejder om aftenen og sover om morgenen. Du vil skrive en klage til boligforeningen.',
  taskIntro:'Skriv en klage til boligforeningen Søparken. Du skal fortælle:',
  bullets:['hvem du er, og hvor du bor','hvad problemet er','hvordan problemet påvirker dig','hvad du forventer, at boligforeningen gør.'],
  structure:['Greeting','Who + where you live (bullet 1)','The problem: noise BEFORE the allowed time + weekends (bullet 2)','The impact: evening work, morning sleep, health (bullet 3)','Expectation: enforce the rules 7.30–16, no weekends (bullet 4)','Polite closing + contact'],
  planning:'Plan: 1) navn, Søparken 14, 3.th. 2) håndværkere starter kl. 6 + weekend — reglerne siger 7.30. 3) jeg arbejder aften/nat → kan ikke sove. 4) overhold reglerne, informér håndværkerne.',
  modelPassing:'Kære Boligforeningen Søparken\n\nJeg hedder Daniel Costa, og jeg bor på Søparken 14, 3. th.\n\nJeg skriver til jer, fordi der er store problemer med støj fra renoveringen i vores opgang. Håndværkerne starter hver morgen klokken 6, men reglerne siger, at de først må starte klokken 7.30. De arbejder også om lørdagen.\n\nDet er et stort problem for mig, fordi jeg arbejder om aftenen på et hotel. Jeg kommer hjem klokken 1 om natten og skal sove om morgenen. Nu sover jeg kun fire-fem timer, og jeg er meget træt på arbejdet.\n\nJeg forventer, at I taler med firmaet, så håndværkerne følger reglerne. De skal først starte klokken 7.30, og de skal ikke arbejde i weekenden.\n\nPå forhånd tak for hjælpen.\n\nVenlig hilsen\nDaniel Costa, Søparken 14, 3. th.',
  modelStrong:'Kære Boligforeningen Søparken\n\nMit navn er Daniel Costa, og jeg bor på Søparken 14, 3. th. — altså i den opgang, hvor der lige nu renoveres lejligheder.\n\nLad mig først sige, at jeg er glad for, at ejendommen bliver sat i stand. Jeg skriver derfor ikke for at klage over selve renoveringen, men over arbejdstiderne. Ifølge jeres egen information må håndværkerne arbejde mellem klokken 7.30 og 16 på hverdage. Alligevel starter de hver morgen klokken 6, og de sidste to lørdage har de også boret og hamret fra tidlig morgen.\n\nDet rammer mig hårdt, fordi jeg arbejder aftenvagter på Hotel Phønix og først er hjemme klokken 1 om natten. Når larmen begynder klokken 6, får jeg kun fire-fem timers søvn. Efter to uger er jeg så træt, at det går ud over mit arbejde og mit helbred.\n\nJeg forventer derfor, at I kontakter firmaet og sørger for, at reglerne bliver overholdt: start tidligst 7.30, og ingen arbejde i weekenden. Hvis støjen fortsætter uden for de aftalte tider, vil jeg gerne høre, hvilke muligheder jeg så har.\n\nI kan kontakte mig på telefon 31 44 90 12 — gerne efter klokken 12.\n\nPå forhånd tak for en hurtig løsning.\n\nVenlig hilsen\nDaniel Costa\nSøparken 14, 3. th.',
  whyBetter:['Opens positively ("glad for, at ejendommen bliver sat i stand") before complaining — disarming and very Danish.','Quotes the foreningens OWN rule (7.30–16) — the strongest card in any complaint.','Concrete impact: night shifts, exact sleep hours, two weeks of data.','"Alligevel starter de…" — inversion after a contrast adverb, exactly what censors reward.','Clear escalation path ("hvilke muligheder jeg så har") while staying polite — pressure without anger.','Practical detail: call after 12 (because he sleeps!) — the text lives its own story.'],
  commonMistakes:['Attacking the craftsmen personally — the complaint is about RULES, not people.','Forgetting bullet 3 (how it affects you) — without impact, there is no urgency.','"fordi jeg kommer hjem ikke før kl. 1" — ikke must stand before the verb after fordi: "fordi jeg ikke kommer hjem før…".','No deadline or consequence — end with what you expect to HAPPEN.']
},
{ id:'w2d', opgave:'Opgave 2', concept:'w-opg2', minWords:90, maxWords:200,
  title:'Svar til din kollega Jonas om mødet',
  situation:'Du har fået en e-mail fra din kollega, Jonas.',
  taskIntro:'Læs e-mailen, og skriv et svar til Jonas. Du skal svare på alle Jonas’ spørgsmål. Du skal skrive minimum 90 ord.',
  email:'Hej!\nVi har jo projektmøde i morgen klokken 13, men jeg kan se i kalenderen, at du har sagt nej. Hvorfor kan du ikke komme? Mødet er ret vigtigt — skal vi finde et andet tidspunkt, hvor du kan? Hvilke dage passer dig i denne uge? Og kan du eventuelt sende dine tal til mig inden mødet, så jeg kan vise dem?\nHilsen\nJonas',
  bullets:['Hvorfor kan du ikke komme til mødet?','Skal I finde et andet tidspunkt?','Hvilke dage passer dig i denne uge?','Kan du sende dine tal inden mødet?'],
  structure:['Greeting + acknowledge the situation (apologise briefly)','Answer 1: the reason you cannot come','Answer 2+3: yes to new time + concrete days/times','Answer 4: yes to sending the numbers + when','Friendly professional closing'],
  planning:'Plan: 1) tandlægetid kl. 12.30 — har ventet 2 måneder. 2) ja, gerne nyt tidspunkt. 3) torsdag efter 10 eller fredag hele dagen. 4) sender tal i aften.',
  modelPassing:'Hej Jonas\n\nTak for din mail — og undskyld, at jeg ikke har forklaret det.\n\nJeg kan ikke komme i morgen, fordi jeg skal til tandlæge klokken 12.30. Jeg har ventet to måneder på tiden, så jeg kan desværre ikke flytte den.\n\nJa, lad os meget gerne finde et andet tidspunkt. Mødet er også vigtigt for mig.\n\nI denne uge passer torsdag efter klokken 10 eller fredag hele dagen mig fint. Vælg bare det, der passer flest.\n\nOg ja — jeg sender mine tal til dig i aften, så du har dem til i morgen, hvis I holder mødet alligevel.\n\nVi ses!\n\nVenlig hilsen\nSamira',
  modelStrong:'Hej Jonas\n\nTak, fordi du skriver — og beklager, at jeg kun svarede nej i kalenderen uden at forklare hvorfor.\n\nGrunden er, at jeg skal til tandlæge klokken 12.30 i morgen. Det er en behandling, jeg har ventet to måneder på, så den kan jeg desværre ikke flytte. Ellers var jeg selvfølgelig kommet, for jeg ved godt, at mødet er vigtigt.\n\nJeg vil meget gerne finde et nyt tidspunkt. I denne uge kan jeg torsdag efter klokken 10 og hele fredagen. Hvis torsdag klokken 13 passer jer, kan vi måske bare flytte mødet dertil — så skal ingen ændre resten af dagen.\n\nMine tal sender jeg til dig i aften inden klokken 20. Sig endelig til, hvis du vil have dem i et andet format, eller hvis jeg skal skrive to linjer om, hvordan de skal læses.\n\nGod mødeforberedelse — og tak, fordi du tænkte på at spørge!\n\nVenlig hilsen\nSamira',
  whyBetter:['Apologises for the missing explanation FIRST — owning the small mistake builds trust.','Gives the reason with credible detail (two months waiting) — no one doubts it.','Does Jonas’ thinking for him: proposes Thursday 13 so "ingen skal ændre resten af dagen".','Offers extra help with the numbers (format, explanation) — collegial gold.','Clean structure: every question answered in order, correct SAV ("fordi jeg skal…", "hvis torsdag … passer jer").'],
  commonMistakes:['Giving no reason ("jeg kan bare ikke") — workplace emails need the why.','Answering the meeting questions but forgetting the numbers question at the end.','"så jeg kan ikke flytte den" after fordi-style reasoning — check whether your clause needs SAV.','Too short: four questions + greeting + closing should naturally pass 90 words.']
},
{ id:'w2e', opgave:'Opgave 2', concept:'w-opg2', minWords:90, maxWords:200,
  title:'Svar til din søns skole',
  situation:'Du har fået en e-mail fra din søns klasselærer, Lone.',
  taskIntro:'Læs e-mailen, og skriv et svar til Lone. Du skal svare på alle Lones spørgsmål. Du skal skrive minimum 90 ord.',
  email:'Kære forældre til Adam\nJeg kan se, at Adam ikke har været i skole mandag og tirsdag. Vil I fortælle mig, hvorfor han har været væk? Ved I, hvornår han kommer tilbage? Vi har desuden skole-hjem-samtaler i næste uge: Kan I komme onsdag den 12. klokken 16.30? Og er der noget særligt, I gerne vil tale om til samtalen?\nVenlig hilsen\nLone, klasselærer 3.B',
  bullets:['Hvorfor har Adam været væk?','Hvornår kommer han tilbage?','Kan I komme til samtalen onsdag kl. 16.30?','Er der noget særligt, I vil tale om?'],
  structure:['Greeting + thanks','Answer 1: the reason for the absence','Answer 2: expected return (with a small reservation: "hvis han er rask")','Answer 3: yes/no to Wednesday 16.30 — if no, suggest an alternative','Answer 4: one or two topics for the meeting','Warm, polite closing'],
  planning:'Plan: 1) feber og halsbetændelse, læge tirsdag. 2) tilbage torsdag, hvis feberfri. 3) ja, onsdag 16.30 passer — begge kommer. 4) tale om: Adams læsning + trivsel i frikvartererne.',
  modelPassing:'Kære Lone\n\nTak for din mail.\n\nAdam har været syg. Han fik feber søndag aften, og mandag havde han også ondt i halsen. Vi var hos lægen tirsdag, og hun sagde, at det er halsbetændelse.\n\nAdam har det bedre i dag. Hvis han ikke har feber i morgen tidlig, kommer han i skole torsdag.\n\nJa, vi kan godt komme til samtalen onsdag den 12. klokken 16.30. Vi kommer begge to.\n\nVi vil gerne tale om Adams læsning. Vi synes, det går lidt langsomt, og vi vil gerne høre, hvordan vi kan hjælpe ham derhjemme.\n\nVenlig hilsen\nFatima og Karim, Adams forældre',
  modelStrong:'Kære Lone\n\nMange tak for din mail — og undskyld, at vi ikke selv fik skrevet til dig i mandags.\n\nAdam har desværre været syg. Han fik høj feber søndag aften, og da han mandag også fik ondt i halsen, bestilte vi tid hos lægen. Tirsdag fik vi at vide, at det er halsbetændelse, og han er nu i behandling.\n\nHeldigvis har han det allerede meget bedre. Hvis han er feberfri i morgen tidlig, kommer han i skole torsdag — ellers først fredag. Vi skriver til dig, hvis det ændrer sig.\n\nOnsdag den 12. klokken 16.30 passer os fint, og vi kommer begge to til samtalen.\n\nDer er to ting, vi gerne vil tale om: For det første Adams læsning — vi synes, den går lidt langsomt, og vi vil gerne vide, hvordan vi bedst støtter ham derhjemme. For det andet vil vi gerne høre, hvordan han trives i frikvartererne, for han fortæller ikke så meget selv.\n\nTak, fordi du holder øje med ham.\n\nVenlig hilsen\nFatima og Karim, Adams forældre',
  whyBetter:['Opens by apologising for the missing notification — exactly what a Danish school hopes to hear.','Precise illness timeline with doctor visit — credible and complete.','Smart conditional answer: "torsdag, hvis han er feberfri — ellers fredag" + a promise to update.','Two clear meeting topics with reasons, signposted "For det første… For det andet…".','SAV under control: "hvis han er feberfri", "fordi han ikke fortæller så meget selv" pattern, "at vi ikke selv fik skrevet".'],
  commonMistakes:['Forgetting question 4 (topics for the meeting) — the last question is the most often missed.','"han kommer tilbage når han er rask" without comma and SAV check — "når han er rask" is a subordinate clause.','Too informal ("Hej Lone! :)") — a class teacher gets warm-but-polite, no emojis in the test.','Not saying WHO comes to the meeting — schools plan chairs and time!']
});

/* =====================================================================
   PHASE 2.3 — TEN MORE GRAMMAR QUESTIONS (g19–g28)
   ===================================================================== */
CONCEPTS['rel-clause'] = { name:'Relative clauses (som/der)', area:'Grammar' };
CONCEPTS['indirect-q'] = { name:'Indirect questions (om/hvad/hvor/hvornår)', area:'Grammar' };
CONCEPTS['reflexive']  = { name:'Reflexive verbs (sig)', area:'Grammar' };

GRAMMAR_QUESTIONS.push(
{ id:'g19', type:'mc', difficulty:'Medium', concept:'rel-clause', extraConcepts:['sav-conn'], tag:'som or der?',
  prompt:'Choose the correct word: "Filmen, ___ vi så i går, var fantastisk."',
  options:[
    {text:'som', ok:true, why:'The relative pronoun is the OBJECT here (vi så filmen) — and only "som" can be the object. "der" works only as subject.'},
    {text:'der', ok:false, mistakeType:'der used as object', why:'"der" can ONLY be the subject of the relative clause. Here "vi" is the subject, so the pronoun is an object → must be "som".'},
    {text:'hvad', ok:false, mistakeType:'Question word as relative', why:'"hvad" is for free relatives ("alt, hvad jeg ved") — not after a specific noun like "filmen".'}
  ],
  explanation:'Rule: subject → som OR der ("manden, der/som bor her"). Object → ONLY som ("filmen, som vi så"). Test it: if the relative clause already has a subject (vi), choose som.',
  trick:'Already a subject inside? Then som. "der" only when the pronoun itself does the verb.',
  decon:{type:'sub', cells:['som','vi','—','så','i går']},
  hints:['The relative clause is "___ vi så i går" — a subordinate clause.','Who does the seeing inside the clause? "vi" — so the clause already has a subject.','If the pronoun is NOT the subject, can it be "der"?','Skeleton: filmen + som + vi + så + i går.','Answer: "som". "der" is subject-only.'] },

{ id:'g20', type:'mc', difficulty:'Medium', concept:'rel-clause', extraConcepts:['adv-sub'], tag:'SAV in relative clauses',
  prompt:'Choose the correct sentence:',
  options:[
    {text:'Jeg har en nabo, som aldrig hilser på mig.', ok:true, why:'A relative clause is a subordinate clause → SAV: subject(=som) + ADVERB + verb. "aldrig" before "hilser".'},
    {text:'Jeg har en nabo, som hilser aldrig på mig.', ok:false, mistakeType:'Main-clause order in relative clause', why:'"hilser aldrig" is main-clause order. Relative clauses follow SAV like every other subordinate clause.'},
    {text:'Jeg har en nabo, aldrig som hilser på mig.', ok:false, mistakeType:'Adverb before connector', why:'Nothing can stand between the noun and its relative pronoun.'}
  ],
  explanation:'som/der-clauses are subordinate clauses, so the central adverb moves before the verb: "som aldrig hilser", "der ikke virker".',
  trick:'som/der = members of the FAHNS family. Adverb dives in front of the verb.',
  decon:{type:'sub', cells:['som','(naboen)','aldrig','hilser','på mig']},
  hints:['"som … hilser" is a relative clause — main or subordinate?','Subordinate clauses use which pattern for adverbs?','Where must "aldrig" stand relative to "hilser"?','Skeleton: som + aldrig + hilser + på mig.','Answer: "…, som aldrig hilser på mig."'] },

{ id:'g21', type:'mc', difficulty:'Medium', concept:'indirect-q', extraConcepts:['sav-conn'], tag:'om — not hvis!',
  prompt:'Complete: "Min chef spørger, ___ jeg kan arbejde på lørdag."',
  options:[
    {text:'om', ok:true, why:'Indirect yes/no-questions use "om" (= whether): "Hun spørger, OM jeg kan…".'},
    {text:'hvis', ok:false, mistakeType:'hvis = if (condition) only', why:'THE classic trap: English "if" covers both, but Danish "hvis" is ONLY conditional. After spørge/vide/undersøge you need "om".'},
    {text:'at', ok:false, mistakeType:'at after a question verb', why:'"at" reports statements ("Hun siger, at…"), not questions. Questions need om or a hv-word.'}
  ],
  explanation:'English "if" splits in two in Danish: condition → hvis ("Hvis det regner…"); indirect yes/no-question → om ("Jeg ved ikke, om han kommer").',
  trick:'Can you replace "if" with "whether" in English? Then it is OM in Danish.',
  decon:{type:'sub', cells:['om','jeg','—','kan','arbejde på lørdag']},
  hints:['The main verb is "spørger" — a question verb.','Is "___ jeg kan arbejde" a condition or a reported question?','English test: "asks IF/WHETHER I can work" — whether fits → which Danish word?','Skeleton: spørger, + om + jeg + kan + arbejde…','Answer: "om". (hvis would mean "in the case that" — wrong here.)'] },

{ id:'g22', type:'mc', difficulty:'Hard', concept:'indirect-q', extraConcepts:['v2-main'], tag:'No inversion in indirect questions',
  prompt:'Choose the correct sentence:',
  options:[
    {text:'Ved du, hvornår bussen kører?', ok:true, why:'Inside an indirect question the order is statement order: hv-word + SUBJECT + verb. No inversion after "hvornår" here.'},
    {text:'Ved du, hvornår kører bussen?', ok:false, mistakeType:'Direct-question order in indirect question', why:'"kører bussen" is DIRECT question order. After "Ved du, …" the clause becomes subordinate: hvornår + bussen + kører.'},
    {text:'Ved du, bussen hvornår kører?', ok:false, mistakeType:'Question word misplaced', why:'The hv-word must come directly after the comma — it IS the connector of the clause.'}
  ],
  explanation:'Direct: "Hvornår kører bussen?" (inversion). Indirect: "Jeg ved ikke, hvornår bussen kører." (no inversion — subject before verb). The hv-word becomes a connector and the clause turns subordinate.',
  trick:'Question inside a sentence? Un-flip it: hv-word + subject + verb.',
  decon:{type:'sub', cells:['hvornår','bussen','—','kører','—']},
  hints:['Is "hvornår … kører" a question standing alone or inside another sentence?','Inside a sentence the hv-clause becomes a SUBORDINATE clause.','Do subordinate clauses ever invert subject and verb?','Skeleton: Ved du, + hvornår + bussen + kører?','Answer: "Ved du, hvornår bussen kører?"'] },

{ id:'g23', type:'mc', difficulty:'Medium', concept:'tense-past', extraConcepts:['tense-perfect'], tag:'Past vs perfect',
  prompt:'Complete: "I går ___ jeg hos lægen."',
  options:[
    {text:'var', ok:true, why:'"I går" pins the event to a finished, specific time → præteritum (simple past): "I går var jeg…".'},
    {text:'har været', ok:false, mistakeType:'Perfect with specific past time', why:'Perfect tense cannot combine with a finished time point like i går/sidste uge/i 2020. Specific time = simple past.'},
    {text:'er været', ok:false, mistakeType:'Wrong auxiliary', why:'"være" forms its perfect with "har" (har været) — and perfect is wrong here anyway because of "i går".'}
  ],
  explanation:'Rule of thumb: a WHEN-word that is over (i går, sidste år, i mandags) forces simple past. Perfect (har/er + participle) is for experience and results without a specific time.',
  trick:'i går → datid. nogensinde/aldrig/lige/allerede → førnutid.',
  decon:{type:'main', cells:['I går','var','jeg','—','hos lægen']},
  hints:['Find the time expression: "I går". Is that time finished?','Finished, specific time points combine with which tense?','Can you say "I går har jeg været…"? (No — perfect refuses specific past times.)','Skeleton: I går + var + jeg + hos lægen (note the inversion too!).','Answer: "I går var jeg hos lægen."'] },

{ id:'g24', type:'mc', difficulty:'Medium', concept:'tense-perfect', extraConcepts:['tense-past','adv-main'], tag:'Past vs perfect',
  prompt:'Complete: "Jeg ___ sushi, men det vil jeg gerne prøve."',
  options:[
    {text:'har aldrig smagt', ok:true, why:'Life experience up to NOW (never in my life) → perfect: "har aldrig smagt". And "aldrig" parks right after "har".'},
    {text:'smagte aldrig', ok:false, mistakeType:'Simple past for open life experience', why:'"smagte aldrig" describes a CLOSED period (e.g. as a child). The sentence is about your whole life until now → perfect.'},
    {text:'har smagt aldrig', ok:false, mistakeType:'Adverb after participle', why:'Even with the right tense, "aldrig" cannot follow the participle — it follows har/er.'}
  ],
  explanation:'Experience until now (aldrig, nogensinde, tit, allerede, endnu ikke) takes the perfect: har/er + participle. The central adverb sits after the auxiliary: "har aldrig smagt".',
  trick:'Open until now? → har/er. And the adverb shadows har/er — never the participle.',
  decon:{type:'main', cells:['Jeg','har','—','aldrig','smagt sushi']},
  hints:['Is the period finished ("when I was young") or open until now ("in my life so far")?','Open-until-now experience takes which tense?','Where does "aldrig" stand in a perfect-tense main clause?','Skeleton: Jeg + har + aldrig + smagt + sushi.','Answer: "Jeg har aldrig smagt sushi…"'] },

{ id:'g25', type:'mc', difficulty:'Medium', concept:'reflexive', extraConcepts:['tense-present'], tag:'Reflexive verbs',
  prompt:'Complete: "Hun glæder ___ til sommerferien."',
  options:[
    {text:'sig', ok:true, why:'"at glæde sig til" is reflexive, and in 3rd person (han/hun/de) the reflexive pronoun is "sig".'},
    {text:'hende', ok:false, mistakeType:'Object pronoun instead of reflexive', why:'"hende" would mean she delights some OTHER woman. When subject and object are the same person in 3rd person → "sig".'},
    {text:'sin', ok:false, mistakeType:'Possessive instead of reflexive', why:'"sin" is the possessive (her own) — verbs need the pronoun "sig", not a possessive.'}
  ],
  explanation:'Reflexive chain: jeg glæder MIG, du glæder DIG, han/hun/de glæder SIG, vi glæder OS, I glæder JER. Common reflexives: glæde sig til, skynde sig, føle sig, slappe af … øve sig, sætte sig.',
  trick:'3rd person mirror = sig. "Hun glæder sig, jeg glæder mig."',
  decon:{type:'main', cells:['Hun','glæder','—','—','sig til sommerferien']},
  hints:['"glæde … til" needs a pronoun pointing back at the subject.','Subject is "hun" (3rd person). What is the 3rd-person reflexive pronoun?','Would "hende" point at the subject or at another woman?','Pattern: jeg→mig, du→dig, hun→SIG.','Answer: "Hun glæder sig til sommerferien."'] },

{ id:'g26', type:'mc', difficulty:'Easy', concept:'v2-main', extraConcepts:['inv-time'], tag:'desuden first',
  prompt:'Complete: "Lejligheden er for lille. Desuden ___ alt for meget i husleje."',
  options:[
    {text:'betaler vi', ok:true, why:'"Desuden" fills position 1, so the verb comes second and the subject third: "Desuden betaler vi…".'},
    {text:'vi betaler', ok:false, mistakeType:'No inversion after desuden', why:'"Desuden vi betaler" leaves the verb in 3rd position — sentence adverbs in front trigger inversion exactly like time words.'},
    {text:'betaler', ok:false, mistakeType:'Missing subject', why:'Danish sentences need an explicit subject — "Desuden betaler alt for meget" has nobody paying.'}
  ],
  explanation:'desuden, derfor, alligevel, dog, derimod: when they open the sentence they ARE position 1 → finite verb next, subject after.',
  trick:'The Big Five openers (derfor, desuden, alligevel, dog, derimod) all flip the sentence.',
  decon:{type:'main', cells:['Desuden','betaler','vi','—','alt for meget i husleje']},
  hints:['"Desuden" starts the sentence — what position does it occupy?','In a main clause the finite verb is always element number…?','So what must come right after "Desuden"?','Skeleton: Desuden + betaler + vi + rest.','Answer: "Desuden betaler vi alt for meget i husleje."'] },

{ id:'g27', type:'mc', difficulty:'Medium', concept:'v2-main', extraConcepts:['adv-main'], tag:'alligevel — two homes',
  prompt:'Which sentence is correct?',
  options:[
    {text:'Det regnede, men han cyklede alligevel til arbejde.', ok:true, why:'Mid-sentence "alligevel" behaves like a central adverb: it follows the finite verb ("cyklede alligevel"). Correct.'},
    {text:'Det regnede, men han alligevel cyklede til arbejde.', ok:false, mistakeType:'Adverb before finite verb in main clause', why:'After "men" the clause keeps MAIN-clause order — the adverb may not stand before the verb.'},
    {text:'Det regnede, men alligevel han cyklede til arbejde.', ok:false, mistakeType:'No inversion after fronted alligevel', why:'If "alligevel" opens the clause, it takes position 1 → "men alligevel CYKLEDE HAN til arbejde". Fronting without inversion is the error.'}
  ],
  explanation:'"alligevel" has two legal homes: after the verb mid-sentence ("han cyklede alligevel"), or first with inversion ("Alligevel cyklede han"). The illegal third option — before the verb without inversion — is exactly what learners produce.',
  trick:'Adverbial first? Flip. Adverbial inside? After the verb. Never directly before the verb in a main clause.',
  decon:{type:'main', cells:['(men) han','cyklede','—','alligevel','til arbejde']},
  hints:['"men" starts a MAIN clause (coordinating) — no SAV here.','Two correct homes exist for "alligevel". Which options match them?','Option C fronts "alligevel" — what must then happen to verb and subject?','Skeleton: han + cyklede + alligevel + til arbejde.','Answer: "…, men han cyklede alligevel til arbejde."'] },

{ id:'g28', type:'mc', difficulty:'Hard', concept:'v2-main', extraConcepts:['inv-place'], tag:'derimod / dog',
  prompt:'Complete the contrast: "Min søster elsker vinteren. ___ sommeren meget bedre."',
  options:[
    {text:'Jeg kan derimod lide', ok:true, why:'"derimod" sits comfortably after the finite verb: "Jeg kan derimod lide sommeren meget bedre." Main-clause order intact.'},
    {text:'Derimod jeg kan lide', ok:false, mistakeType:'No inversion after fronted derimod', why:'Fronted "Derimod" takes position 1 → it must be "Derimod kan jeg lide…". Subject before verb breaks V2.'},
    {text:'Jeg derimod kan lide', ok:false, mistakeType:'Adverb between subject and verb', why:'In a Danish main clause nothing squeezes between subject and finite verb — "derimod" goes after the verb or first (with inversion).'}
  ],
  explanation:'Contrast adverbs (derimod, dog, til gengæld) follow the same law as derfor/desuden: first position → inversion; mid-position → right after the finite verb. Between subject and verb is never an option.',
  trick:'Subject-VERB are glued in main clauses. Adverbials go before the pair (then flip) or after the verb — never inside.',
  decon:{type:'main', cells:['Jeg','kan','—','derimod','lide sommeren meget bedre']},
  hints:['Where can a sentence adverb legally stand in a main clause? (Two places.)','Option B fronts "Derimod" — does the rest of that option invert?','Option C splits subject and verb — is that ever allowed?','Skeleton: Jeg + kan + derimod + lide + sommeren…','Answer: "Jeg kan derimod lide sommeren meget bedre."'] }
);

/* =====================================================================
   PHASE 4 — SKILLS GYM DATA
   ===================================================================== */
const DICTATION = [
  { da:'Jeg cykler altid til arbejde om sommeren.', focus:'adverb efter verbum + årstid' },
  { da:'I morgen skal jeg til møde med min chef.', focus:'inversion efter tidsudtryk' },
  { da:'Hun kommer ikke, fordi hendes datter er syg.', focus:'fordi + SAV' },
  { da:'Vi har boet i Danmark i næsten tre år.', focus:'førnutid + æøå' },
  { da:'Hvis det regner, tager vi bussen i stedet.', focus:'hvis-sætning + inversion' },
  { da:'Min nabo spiller tit høj musik om natten.', focus:'tit efter verbum' },
  { da:'Om vinteren bliver det mørkt klokken fire.', focus:'inversion + ø' },
  { da:'Han siger, at han aldrig drikker kaffe.', focus:'at + SAV' },
  { da:'Vi skal købe ind, før gæsterne kommer.', focus:'før-sætning' },
  { da:'Jeg glæder mig til at se dig på lørdag.', focus:'refleksivt verbum' },
  { da:'Desværre kan jeg ikke komme til festen.', focus:'desværre + inversion' },
  { da:'Børnene leger i haven, mens vi laver mad.', focus:'mens-sætning' },
  { da:'Hun spørger, om vi vil med i biografen.', focus:'om — ikke hvis' },
  { da:'Derfor tager jeg toget i stedet for bilen.', focus:'derfor + inversion' },
  { da:'Vi sorterer altid vores affald derhjemme.', focus:'altid + æøå' },
  { da:'Selvom han er træt, træner han hver aften.', focus:'selvom + inversion efter komma' },
  { da:'Jeg vil gerne bede om en pose, tak.', focus:'høflig anmodning' },
  { da:'Lægen siger, at jeg skal slappe mere af.', focus:'at-sætning' },
  { da:'Når jeg får løn, betaler jeg huslejen først.', focus:'når + inversion' },
  { da:'Det bedste ved Danmark er den friske luft.', focus:'superlativ + struktur' }
];

const BUILDER = [
  { id:'sb1', type:'order', tag:'Main clause · V2', difficulty:'Easy', concept:'inv-time', words:['I weekenden','besøger','vi','min svigermor'], answer:'I weekenden besøger vi min svigermor', wrongWhy:'Time expression first → verb second, subject third.', explanation:'"I weekenden" fills position 1, so "besøger" must follow immediately.', trick:'Front it — flip it.', decon:{type:'main', cells:['I weekenden','besøger','vi','—','min svigermor']} },
  { id:'sb2', type:'order', tag:'Main clause · V2', difficulty:'Easy', concept:'inv-time', words:['Hver morgen','drikker','jeg','to kopper kaffe'], answer:'Hver morgen drikker jeg to kopper kaffe', wrongWhy:'Fronted time → inversion.', explanation:'Position 1 = "Hver morgen", verb in seat 2.', trick:'Verb is glued to seat 2.', decon:{type:'main', cells:['Hver morgen','drikker','jeg','—','to kopper kaffe']} },
  { id:'sb3', type:'order', tag:'Main clause · V2', difficulty:'Medium', concept:'inv-place', words:['På mit arbejde','taler','vi','kun','dansk'], answer:'På mit arbejde taler vi kun dansk', wrongWhy:'Place expression first → verb second, then subject, then the adverb.', explanation:'Inverted skeleton: place + verb + subject + adverb + rest.', trick:'PLACE first? Swap!', decon:{type:'main', cells:['På mit arbejde','taler','vi','kun','dansk']} },
  { id:'sb4', type:'order', tag:'Main clause · V2', difficulty:'Medium', concept:'v2-main', words:['Derfor','tager','hun','altid','cyklen'], answer:'Derfor tager hun altid cyklen', wrongWhy:'"Derfor" = position 1 → verb + subject + adverb.', explanation:'Sentence adverbs in front behave like time expressions.', trick:'derfor/desuden/alligevel = flip-words.', decon:{type:'main', cells:['Derfor','tager','hun','altid','cyklen']} },
  { id:'sb5', type:'order', tag:'Main clause · V2', difficulty:'Medium', concept:'tense-perfect', words:['Jeg','har','aldrig','prøvet','vinterbadning'], answer:'Jeg har aldrig prøvet vinterbadning', wrongWhy:'Perfect tense: subject + har + ADVERB + participle.', explanation:'"aldrig" shadows "har", never the participle.', trick:'The adverb stands in the shadow of har/er.', decon:{type:'main', cells:['Jeg','har','—','aldrig','prøvet vinterbadning']} },
  { id:'sb6', type:'order', tag:'Subordinate · SAV', difficulty:'Medium', concept:'sav-conn', words:['fordi','jeg','ikke','har','tid i dag'], answer:'fordi jeg ikke har tid i dag', wrongWhy:'fordi + subject + ikke + verb.', explanation:'SAV: the adverb dives in front of the verb.', trick:'In the sub, the adverb SUBmarines.', decon:{type:'sub', cells:['fordi','jeg','ikke','har','tid i dag']} },
  { id:'sb7', type:'order', tag:'Subordinate · SAV', difficulty:'Medium', concept:'sav-conn', words:['hvis','du','ikke','kan','komme'], answer:'hvis du ikke kan komme', wrongWhy:'hvis + subject + ikke + verbs.', explanation:'No inversion after a connector; ikke before the modal.', trick:'FAHNS word → ikke moves forward.', decon:{type:'sub', cells:['hvis','du','ikke','kan','komme']} },
  { id:'sb8', type:'order', tag:'Subordinate · SAV', difficulty:'Medium', concept:'adv-sub', words:['at','hun','tit','arbejder','om aftenen'], answer:'at hun tit arbejder om aftenen', wrongWhy:'at-clauses use SAV too.', explanation:'"tit" stands between subject and verb in the at-clause.', trick:'"at" is quiet but flips the order.', decon:{type:'sub', cells:['at','hun','tit','arbejder','om aftenen']} },
  { id:'sb9', type:'order', tag:'Subordinate · SAV', difficulty:'Medium', concept:'sav-conn', words:['selvom','vi','aldrig','har','penge'], answer:'selvom vi aldrig har penge', wrongWhy:'selvom + subject + aldrig + verb.', explanation:'Same SAV pattern with every subordinating connector.', trick:'fordi-at-hvis-når-selvom: one family, one pattern.', decon:{type:'sub', cells:['selvom','vi','aldrig','har','penge']} },
  { id:'sb10', type:'order', tag:'Subordinate · SAV', difficulty:'Hard', concept:'sav-conn', words:['da','jeg','ikke','var','hjemme'], answer:'da jeg ikke var hjemme', wrongWhy:'da (when, past) is subordinating → SAV.', explanation:'"da" introduces a one-time past clause with subordinate order.', trick:'da = once in the past — and SAV inside.', decon:{type:'sub', cells:['da','jeg','ikke','var','hjemme']} },
  { id:'sb11', type:'order', tag:'Mixed · two clauses', difficulty:'Hard', concept:'sav-conn', words:['Hvis det regner','tager','jeg','bussen'], answer:'Hvis det regner tager jeg bussen', wrongWhy:'The fronted hvis-clause is position 1 → main clause starts with its verb.', explanation:'Springboard comma: "Hvis det regner, TAGER JEG bussen."', trick:'Comma = springboard.', decon:{type:'main', cells:['Hvis det regner','tager','jeg','—','bussen']} },
  { id:'sb12', type:'order', tag:'Mixed · two clauses', difficulty:'Hard', concept:'inv-time', words:['Når jeg får løn','køber','jeg','nye sko'], answer:'Når jeg får løn køber jeg nye sko', wrongWhy:'Fronted når-clause forces inversion in the main clause.', explanation:'The whole når-clause occupies position 1.', trick:'Sub-clause first? Main clause flips.', decon:{type:'main', cells:['Når jeg får løn','køber','jeg','—','nye sko']} },
  { id:'sb13', type:'order', tag:'Mixed · modal + SAV', difficulty:'Hard', concept:'modal', words:['Hun siger','at','hun','ikke','vil','flytte'], answer:'Hun siger at hun ikke vil flytte', wrongWhy:'at-clause: subject + ikke + modal + infinitive.', explanation:'"ikke" stands before the whole verb cluster in subordinate clauses.', trick:'Sub + modal: ikke first, then both verbs.', decon:{type:'sub', cells:['at','hun','ikke','vil','flytte']} },
  { id:'sb14', type:'order', tag:'Mixed · relative', difficulty:'Hard', concept:'rel-clause', words:['Jeg har','en bil','der','aldrig','starter'], answer:'Jeg har en bil der aldrig starter', wrongWhy:'der-clause is subordinate → aldrig before the verb.', explanation:'Relative clauses follow SAV: "der aldrig starter".', trick:'som/der are FAHNS members too.', decon:{type:'sub', cells:['der','(bilen)','aldrig','starter','—']} },
  { id:'sb15', type:'order', tag:'Mixed · indirect question', difficulty:'Hard', concept:'indirect-q', words:['Ved du','hvornår','toget','kører'], answer:'Ved du hvornår toget kører', wrongWhy:'Indirect question: hv-word + subject + verb (no inversion).', explanation:'"hvornår kører toget?" un-flips inside a sentence.', trick:'Question inside a sentence? Un-flip it.', decon:{type:'sub', cells:['hvornår','toget','—','kører','—']} }
];

const TRANSLATE = [
  { en:'Tomorrow I am going to the doctor.', da:'I morgen skal jeg til lægen', concept:'inv-time', note:'English keeps subject-verb; Danish flips after the fronted time word.', decon:{type:'main', cells:['I morgen','skal','jeg','—','til lægen']} },
  { en:'I am staying home because I am not feeling well.', da:'Jeg bliver hjemme fordi jeg ikke har det godt', concept:'sav-conn', note:'English: "am not"; Danish: ikke BEFORE the verb after fordi.', decon:{type:'sub', cells:['fordi','jeg','ikke','har','det godt']} },
  { en:'In Denmark many people cycle to work.', da:'I Danmark cykler mange til arbejde', concept:'inv-place', note:'Place phrase first → verb before subject — impossible in English!', decon:{type:'main', cells:['I Danmark','cykler','mange','—','til arbejde']} },
  { en:'She says that she never eats meat.', da:'Hun siger at hun aldrig spiser kød', concept:'adv-sub', note:'never/aldrig moves in front of the verb inside the at-clause.', decon:{type:'sub', cells:['at','hun','aldrig','spiser','kød']} },
  { en:'I cannot come on Friday.', da:'Jeg kan ikke komme på fredag', concept:'modal', note:'Modal + ikke + infinitive — like English "cannot come", luckily.', decon:{type:'main', cells:['Jeg','kan','—','ikke','komme på fredag']} },
  { en:'Therefore we take the bus today.', da:'Derfor tager vi bussen i dag', concept:'v2-main', note:'"Therefore we take" — but Danish must flip: Derfor TAGER VI.', decon:{type:'main', cells:['Derfor','tager','vi','—','bussen i dag']} },
  { en:'If it rains, I take the train.', da:'Hvis det regner tager jeg toget', concept:'sav-conn', note:'After the fronted hvis-clause, the main clause inverts: tager jeg.', decon:{type:'main', cells:['Hvis det regner','tager','jeg','—','toget']} },
  { en:'I have never been to Jutland.', da:'Jeg har aldrig været i Jylland', concept:'tense-perfect', note:'Same order as English here — enjoy it, it is rare!', decon:{type:'main', cells:['Jeg','har','—','aldrig','været i Jylland']} },
  { en:'Yesterday I worked until eight.', da:'I går arbejdede jeg til klokken otte', concept:'tense-past', note:'Yesterday = specific past → simple past + inversion after "I går".', decon:{type:'main', cells:['I går','arbejdede','jeg','—','til klokken otte']} },
  { en:'He asks if I can help.', da:'Han spørger om jeg kan hjælpe', concept:'indirect-q', note:'if = om here (whether), NOT hvis!', decon:{type:'sub', cells:['om','jeg','—','kan','hjælpe']} },
  { en:'Even though he is tired, he trains every evening.', da:'Selvom han er træt træner han hver aften', concept:'sav-conn', note:'Two rules: selvom-clause + inversion after the comma (træner han).', decon:{type:'main', cells:['Selvom han er træt','træner','han','—','hver aften']} },
  { en:'On Mondays we always eat fish.', da:'Om mandagen spiser vi altid fisk', concept:'inv-time', note:'Time first → verb + subject + altid. Three rules in six words.', decon:{type:'main', cells:['Om mandagen','spiser','vi','altid','fisk']} },
  { en:'She is looking forward to the holiday.', da:'Hun glæder sig til ferien', concept:'reflexive', note:'"look forward to" = glæde SIG til — the reflexive is mandatory.', decon:{type:'main', cells:['Hun','glæder','—','—','sig til ferien']} },
  { en:'I do not know when the shop opens.', da:'Jeg ved ikke hvornår butikken åbner', concept:'indirect-q', note:'Indirect question: hvornår + SUBJECT + verb — no flip inside.', decon:{type:'sub', cells:['hvornår','butikken','—','åbner','—']} },
  { en:'Unfortunately I cannot find my keys.', da:'Desværre kan jeg ikke finde mine nøgler', concept:'v2-main', note:'Fronted "Desværre" forces kan before jeg.', decon:{type:'main', cells:['Desværre','kan','jeg','ikke','finde mine nøgler']} },
  { en:'We have lived here since 2022.', da:'Vi har boet her siden 2022', concept:'tense-perfect', note:'Still living here → perfect with "siden".', decon:{type:'main', cells:['Vi','har','—','—','boet her siden 2022']} },
  { en:'I have a neighbour who never says hello.', da:'Jeg har en nabo der aldrig hilser', concept:'rel-clause', note:'who = der (subject) — and aldrig BEFORE hilser (SAV in the relative clause).', decon:{type:'sub', cells:['der','(naboen)','aldrig','hilser','—']} },
  { en:'After work I usually buy groceries.', da:'Efter arbejde køber jeg som regel ind', concept:'inv-time', note:'"Efter arbejde" = position 1 → køber jeg. "som regel" = usually.', decon:{type:'main', cells:['Efter arbejde','køber','jeg','som regel','ind']} },
  { en:'He hurries because the bus is leaving.', da:'Han skynder sig fordi bussen kører nu', concept:'reflexive', note:'hurry = skynde SIG — plus a fordi-clause.', decon:{type:'main', cells:['Han','skynder','—','—','sig, fordi bussen kører nu']} },
  { en:'Now the days are getting longer again.', da:'Nu bliver dagene længere igen', concept:'v2-main', note:'"Nu" first → bliver before dagene. Small word, full inversion.', decon:{type:'main', cells:['Nu','bliver','dagene','—','længere igen']} }
];

const SPOTERR = [
  { id:'se1', sentence:['I morgen','jeg','skal','til frisøren'], wrong:1, concept:'inv-time', rule:'V2: fronted time expression demands inversion',
    rules:['V2: fronted time expression demands inversion','SAV: ikke before the verb after fordi','Reflexive pronoun missing'],
    fixes:['I morgen skal jeg til frisøren.','I morgen jeg til frisøren skal.','Jeg i morgen skal til frisøren.'], fix:0,
    explanation:'"I morgen" fills position 1, so the verb must come next: "I morgen SKAL JEG…". The subject in slot 2 is the error.', trick:'Time first? Swap!', decon:{type:'main', cells:['I morgen','skal','jeg','—','til frisøren']} },
  { id:'se2', sentence:['Om sommeren','vi','griller','næsten hver aften'], wrong:1, concept:'inv-time', rule:'V2: fronted time expression demands inversion',
    rules:['Perfect tense needs har/er','V2: fronted time expression demands inversion','om vs hvis confusion'],
    fixes:['Om sommeren griller vi næsten hver aften.','Om sommeren vi næsten griller hver aften.','Vi om sommeren griller næsten hver aften.'], fix:0,
    explanation:'Fronted "Om sommeren" → griller before vi.', trick:'Front it — flip it.', decon:{type:'main', cells:['Om sommeren','griller','vi','—','næsten hver aften']} },
  { id:'se3', sentence:['I Danmark','man','cykler','hele året'], wrong:1, concept:'inv-place', rule:'V2: fronted place expression demands inversion',
    rules:['V2: fronted place expression demands inversion','SAV in relative clauses','Adverb after the infinitive'],
    fixes:['I Danmark cykler man hele året.','I Danmark man hele året cykler.','Man cykler i Danmark hele året, ikke.'], fix:0,
    explanation:'Place expressions trigger inversion exactly like time: "I Danmark CYKLER MAN…".', trick:'PLACE first? Swap!', decon:{type:'main', cells:['I Danmark','cykler','man','—','hele året']} },
  { id:'se4', sentence:['Derfor','jeg','tager','bussen i dag'], wrong:1, concept:'v2-main', rule:'V2: sentence adverb in front demands inversion',
    rules:['V2: sentence adverb in front demands inversion','Past tense after i går','der vs som confusion'],
    fixes:['Derfor tager jeg bussen i dag.','Derfor jeg bussen tager i dag.','Tager derfor jeg bussen i dag.'], fix:0,
    explanation:'"Derfor" occupies position 1 → "Derfor TAGER JEG…".', trick:'derfor/desuden/alligevel = flip-words.', decon:{type:'main', cells:['Derfor','tager','jeg','—','bussen i dag']} },
  { id:'se5', sentence:['Jeg bliver hjemme,','fordi','jeg','har','ikke','tid'], wrong:4, concept:'sav-conn', rule:'SAV: ikke must stand before the verb after fordi',
    rules:['V2: fronted time expression demands inversion','SAV: ikke must stand before the verb after fordi','Reflexive pronoun missing'],
    fixes:['Jeg bliver hjemme, fordi jeg ikke har tid.','Jeg bliver hjemme, fordi har jeg ikke tid.','Jeg bliver hjemme, fordi ikke jeg har tid.'], fix:0,
    explanation:'After fordi: subject + IKKE + verb. "har ikke" is main-clause order leaking in.', trick:'In the sub, ikke SUBmarines in front of the verb.', decon:{type:'sub', cells:['fordi','jeg','ikke','har','tid']} },
  { id:'se6', sentence:['Hun siger,','at','hun','kan','ikke','sove'], wrong:4, concept:'sav-conn', rule:'SAV: ikke before the verb cluster in at-clauses',
    rules:['SAV: ikke before the verb cluster in at-clauses','V2 after place expressions','Perfect vs past confusion'],
    fixes:['Hun siger, at hun ikke kan sove.','Hun siger, at kan hun ikke sove.','Hun siger, at hun kan sove ikke.'], fix:0,
    explanation:'In the at-clause, ikke stands before the modal: "at hun IKKE KAN sove".', trick:'"at" is quiet but flips the order.', decon:{type:'sub', cells:['at','hun','ikke','kan','sove']} },
  { id:'se7', sentence:['Han kommer,','selvom','han','er','aldrig','inviteret'], wrong:4, concept:'sav-conn', rule:'SAV: aldrig before the verb after selvom',
    rules:['om vs hvis confusion','SAV: aldrig before the verb after selvom','Missing subject'],
    fixes:['Han kommer, selvom han aldrig er inviteret.','Han kommer, selvom er han aldrig inviteret.','Han kommer, selvom aldrig han er inviteret.'], fix:0,
    explanation:'selvom-clause: subject + ALDRIG + verb.', trick:'FAHNS family: one pattern for all.', decon:{type:'sub', cells:['selvom','han','aldrig','er','inviteret']} },
  { id:'se8', sentence:['Jeg cykler,','hvis','det','regner','ikke'], wrong:4, concept:'sav-conn', rule:'SAV: ikke before the verb after hvis',
    rules:['SAV: ikke before the verb after hvis','V2 after time expressions','der vs som confusion'],
    fixes:['Jeg cykler, hvis det ikke regner.','Jeg cykler, hvis regner det ikke.','Jeg cykler, hvis ikke det regner meget mere i dag.'], fix:0,
    explanation:'"hvis det IKKE regner" — the adverb moves in front of the verb in the hvis-clause.', trick:'hvis → SAV inside.', decon:{type:'sub', cells:['hvis','det','ikke','regner','—']} },
  { id:'se9', sentence:['Jeg','ikke','spiser','kød'], wrong:1, concept:'adv-main', rule:'Main clause: the adverb follows the finite verb',
    rules:['Main clause: the adverb follows the finite verb','SAV after fordi','Inversion after derfor'],
    fixes:['Jeg spiser ikke kød.','Ikke jeg spiser kød.','Jeg spiser kød ikke.'], fix:0,
    explanation:'No connector → main clause → "spiser ikke", never "ikke spiser".', trick:'Main clause: Subject + Verb + Adverb.', decon:{type:'main', cells:['Jeg','spiser','—','ikke','kød']} },
  { id:'se10', sentence:['Hun','kan','komme','ikke','i morgen'], wrong:3, concept:'modal', rule:'With modals, ikke stands between modal and infinitive',
    rules:['With modals, ikke stands between modal and infinitive','Reflexive pronoun missing','Perfect tense formation'],
    fixes:['Hun kan ikke komme i morgen.','Hun ikke kan komme i morgen.','Hun kan komme i morgen ikke.'], fix:0,
    explanation:'Two verbs → ikke between them: "kan IKKE komme".', trick:'Two verbs? ikke goes between them.', decon:{type:'main', cells:['Hun','kan','—','ikke','komme i morgen']} },
  { id:'se11', sentence:['Vi','har','set','aldrig','den film'], wrong:3, concept:'tense-perfect', rule:'Perfect tense: the adverb follows har/er, not the participle',
    rules:['Past tense after i går','Perfect tense: the adverb follows har/er, not the participle','om vs hvis confusion'],
    fixes:['Vi har aldrig set den film.','Vi aldrig har set den film.','Vi har set den film aldrig.'], fix:0,
    explanation:'"har ALDRIG set" — the adverb shadows the auxiliary.', trick:'The adverb stands in the shadow of har/er.', decon:{type:'main', cells:['Vi','har','—','aldrig','set den film']} },
  { id:'se12', sentence:['Når jeg kommer hjem,','jeg','laver','aftensmad'], wrong:1, concept:'inv-time', rule:'Inversion after a fronted subordinate clause',
    rules:['SAV inside the når-clause','Inversion after a fronted subordinate clause','Reflexive pronoun missing'],
    fixes:['Når jeg kommer hjem, laver jeg aftensmad.','Når jeg kommer hjem, aftensmad laver jeg.','Når kommer jeg hjem, laver jeg aftensmad.'], fix:0,
    explanation:'The fronted når-clause is position 1 → the main clause starts with its verb: "laver jeg".', trick:'The comma is a springboard.', decon:{type:'main', cells:['Når jeg kommer hjem','laver','jeg','—','aftensmad']} },
  { id:'se13', sentence:['Hvis du har tid,','du','skal','ringe til mig'], wrong:1, concept:'inv-time', rule:'Inversion after a fronted subordinate clause',
    rules:['Inversion after a fronted subordinate clause','Adverb after infinitive','at vs om confusion'],
    fixes:['Hvis du har tid, skal du ringe til mig.','Hvis du har tid, ringe du skal til mig.','Hvis har du tid, skal du ringe til mig.'], fix:0,
    explanation:'After the comma: verb first — "skal du ringe".', trick:'Sub-clause first? Main clause flips.', decon:{type:'main', cells:['Hvis du har tid','skal','du','—','ringe til mig']} },
  { id:'se14', sentence:['Jeg ved ikke,','hvis','han','kommer','i dag'], wrong:1, concept:'indirect-q', rule:'Indirect yes/no-questions use om, not hvis',
    rules:['Indirect yes/no-questions use om, not hvis','V2 after time expressions','SAV after fordi'],
    fixes:['Jeg ved ikke, om han kommer i dag.','Jeg ved ikke, at han kommer i dag.','Jeg ved ikke, hvornår han kommer i dag, eller.'], fix:0,
    explanation:'"whether he comes" → OM. "hvis" is only conditional (in the case that).', trick:'Replaceable with "whether"? Then om.', decon:{type:'sub', cells:['om','han','—','kommer','i dag']} },
  { id:'se15', sentence:['Jeg bliver hjemme,','for','jeg','ikke','har','det godt'], wrong:3, concept:'sav-conn', rule:'for is coordinating — main-clause order after it',
    rules:['for is coordinating — main-clause order after it','der vs som confusion','Perfect tense formation'],
    fixes:['Jeg bliver hjemme, for jeg har ikke det godt.','Jeg bliver hjemme, for jeg det godt ikke har.','Jeg bliver hjemme, for har jeg ikke det godt.'], fix:0,
    explanation:'THE for/fordi trap in reverse: after "for" (coordinating) the clause keeps MAIN order — "jeg har ikke". (With fordi it would be "jeg ikke har"!)', trick:'for ≠ fordi: same meaning, opposite order.', decon:{type:'main', cells:['(for) jeg','har','—','ikke','det godt']} }
];

/* =====================================================================
   PHASE 2.4 — EXAMINER PRESSURE CHAINS (what is tested + how to answer)
   ===================================================================== */
const EXAMINER_PRESSURE = [
{ topic:'mm1', title:'Mine sunde/usunde vaner', chains:[
  { name:'The why-chain', steps:[
    { q:'Du siger, du gerne vil leve sundere. Hvorfor egentlig?', tests:'Whether you can give REASONS, not just facts.', approach:'One health reason + one life reason: "fordi jeg vil have mere energi — og fordi jeg gerne vil kunne lege med mine børn."' },
    { q:'Men hvorfor er det så svært at ændre vaner, tror du?', tests:'Abstract reflection — can you leave the rehearsed script?', approach:'Thinking-time phrase first, then a simple theory + example: "Det er et godt spørgsmål. Jeg tror, det er fordi gamle vaner er automatiske. For eksempel køber jeg slik uden at tænke over det."' },
    { q:'Hvad ville du sige til en ven, der ryger og ikke vil stoppe?', tests:'Hypothetical language and opinion under pressure.', approach:'"Jeg ville sige, at…" + respect + example: "…at det er hans valg, men at jeg gerne vil have ham i mange år endnu."' }
  ]},
  { name:'The challenge-chain', steps:[
    { q:'Du siger, du træner to gange om ugen. Er det nok, synes du?', tests:'Can you defend or revise a statement without panicking?', approach:'Concede gracefully OR defend with a reason: "Måske ikke — eksperterne siger tre gange. Men to gange er realistisk med mit arbejde, og det er bedre end nul!"' },
    { q:'Mange siger, sund mad er for dyr. Hvad siger du til det?', tests:'Handling a counter-argument (opinions and arguments).', approach:'Both sides + own conclusion: "På den ene side er økologi dyrt. På den anden side er havregryn og grøntsager faktisk billige. Så jeg synes, det handler mere om vaner end om penge."' },
    { q:'Hvordan tror du, dine vaner ser ud om fem år?', tests:'Future tense and connected speculation.', approach:'"Om fem år håber jeg, at…" + one realistic change + why: "…at jeg stadig cykler, og at jeg er stoppet med natslik, fordi mine børn skal se gode vaner."' }
  ]}
]},
{ topic:'mm2', title:'Mine grønne vaner', chains:[
  { name:'The why-chain', steps:[
    { q:'Du sorterer affald — men hjælper det egentlig, når én person gør det?', tests:'Argumentation against a provocation. Examiners love this question.', approach:'Concede + counter: "Det er rigtigt, at én person ikke redder kloden. Men hvis alle tænker sådan, sker der ingenting. Og mine børn lærer det af mig."' },
    { q:'Hvad er sværest for dig ved at leve grønt?', tests:'Honesty + vocabulary range beyond rehearsed positives.', approach:'Pick one real struggle: "Helt ærligt? At lade være med at flyve. Min familie bor langt væk, så det er et dilemma for mig."' },
    { q:'Skal det være dyrere at flyve, synes du?', tests:'A pure opinion question on society level.', approach:'Opinion + reason + personal cost: "Ja, måske — fordi prisen skal vise, hvad det koster naturen. Men det rammer også familier som min, der har familie i udlandet. Det er svært."' }
  ]},
  { name:'The compare-chain', steps:[
    { q:'Hvordan er forskellen på affald og genbrug her og i dit hjemland?', tests:'Comparison structures (her/derhjemme, mere/mindre end).', approach:'One concrete difference + your reaction: "I mit hjemland smed vi alt i én pose. Her sorterer vi i otte spande! I starten var det forvirrende, men nu synes jeg, det giver mening."' },
    { q:'Hvad kunne Danmark lære af dit hjemland — og omvendt?', tests:'Balanced two-way comparison — advanced but high-scoring.', approach:'One thing each way: "Danmark kunne lære at reparere mere — derhjemme reparerer vi alt. Og mit hjemland kunne lære pantsystemet, det er genialt."' },
    { q:'Tror du, dine børn bliver mere grønne end dig?', tests:'Future + reasons across generations.', approach:'"Ja, helt sikkert, fordi de lærer det i skolen fra første klasse. Min datter retter mig allerede, hvis jeg sorterer forkert!"' }
  ]}
]},
{ topic:'mm3', title:'At lære dansk', chains:[
  { name:'The depth-chain', steps:[
    { q:'Du siger, udtalen er svær. Kan du give et konkret eksempel?', tests:'Can you support claims with examples — instantly.', approach:'Have 2-3 examples ready: "Ja — det bløde d! Ordet hedder driller mig stadig. Og forskellen på køn og kjole tog mig en måned."' },
    { q:'Hvad gør du helt konkret, når du ikke forstår en dansker?', tests:'Communication strategies — a core exam criterion.', approach:'List your real strategies: "Først siger jeg: Undskyld, kan du sige det igen? Hvis det ikke hjælper, beder jeg dem tale langsommere — og som det sidste spørger jeg på engelsk."' },
    { q:'Hvorfor skifter danskerne til engelsk, tror du — og hvad gør du så?', tests:'Inference + assertiveness in conversation.', approach:'Theory + your counter-move: "Jeg tror, de vil være høflige og effektive. Men jeg siger venligt: Jeg vil gerne øve mit danske — må vi fortsætte på dansk? Det virker næsten altid."' }
  ]},
  { name:'The motivation-chain', steps:[
    { q:'Hvad har været dit største øjeblik med det danske sprog?', tests:'Narrative past tense + emotional vocabulary.', approach:'One small, true victory story: "Da lægen ringede, og jeg klarede hele samtalen på dansk. Jeg var så stolt bagefter!"' },
    { q:'Og dit værste øjeblik?', tests:'Self-irony and resilience — examiners remember honest answers.', approach:'Laugh at yourself: "Jeg bestilte engang ti rugbrød i stedet for ét. Bageren grinede — og jeg spiste rugbrød i to uger!"' },
    { q:'Hvor god vil du være om to år — og hvordan kommer du derhen?', tests:'Goals + plan = connected future speech.', approach:'Goal + 2 concrete actions: "Om to år vil jeg tage Prøve i Dansk 3. Derfor ser jeg danske nyheder hver aften, og jeg har fundet en dansk sprogven på biblioteket."' }
  ]}
]}
];

/* =====================================================================
   PHASE 3.6 — VOCABULARY BUILDER PER ORAL TOPIC (25 × 3)
   ===================================================================== */
const ORAL_VOCAB = {
mm1:[
  {da:'kost', en:'diet', pos:'n.', ex:'En sund kost giver energi.'},
  {da:'motion', en:'exercise', pos:'n.', ex:'Motion er den billigste medicin.'},
  {da:'træning', en:'training/workout', pos:'n.', ex:'Min træning ligger om morgenen.'},
  {da:'søvn', en:'sleep', pos:'n.', ex:'God søvn er vigtig for humøret.'},
  {da:'stress', en:'stress', pos:'n.', ex:'Jeg får stress af for mange aftaler.'},
  {da:'vaner', en:'habits', pos:'n. pl.', ex:'Gamle vaner er svære at ændre.'},
  {da:'sundhed', en:'health', pos:'n.', ex:'Sundhed handler om balance.'},
  {da:'usund', en:'unhealthy', pos:'adj.', ex:'Fastfood er usundt men hurtigt.'},
  {da:'sund', en:'healthy', pos:'adj.', ex:'Vi prøver at spise sundt i hverdagen.'},
  {da:'livsstil', en:'lifestyle', pos:'n.', ex:'Jeg har ændret min livsstil helt.'},
  {da:'overvægt', en:'overweight', pos:'n.', ex:'Overvægt er et voksende problem.'},
  {da:'rygning', en:'smoking', pos:'n.', ex:'Rygning er forbudt på caféer.'},
  {da:'alkohol', en:'alcohol', pos:'n.', ex:'Jeg drikker kun alkohol til fester.'},
  {da:'hvile', en:'rest', pos:'n.', ex:'Kroppen har brug for hvile.'},
  {da:'meditation', en:'meditation', pos:'n.', ex:'Meditation hjælper mod stress.'},
  {da:'at løbe', en:'to run', pos:'v.', ex:'Jeg løber en tur to gange om ugen.'},
  {da:'at svømme', en:'to swim', pos:'v.', ex:'Om onsdagen svømmer jeg med en kollega.'},
  {da:'fitness', en:'fitness/gym', pos:'n.', ex:'Fitness er for dyrt, synes jeg.'},
  {da:'grøntsager', en:'vegetables', pos:'n. pl.', ex:'Vi spiser grøntsager hver dag.'},
  {da:'frugt', en:'fruit', pos:'n.', ex:'Jeg tager frugt med på arbejde.'},
  {da:'sukkervarer', en:'sweets/sugary goods', pos:'n. pl.', ex:'Sukkervarer hører til fredag aften.'},
  {da:'fastfood', en:'fast food', pos:'n.', ex:'Fastfood frister, når man har travlt.'},
  {da:'kalorier', en:'calories', pos:'n. pl.', ex:'Sodavand har mange tomme kalorier.'},
  {da:'fedme', en:'obesity', pos:'n.', ex:'Fedme kan give sygdomme senere.'},
  {da:'kostvejleder', en:'dietician', pos:'n.', ex:'Min kostvejleder gav mig en madplan.'}
],
mm2:[
  {da:'genbrug', en:'recycling/reuse', pos:'n.', ex:'Genbrug er blevet en vane for os.'},
  {da:'affald', en:'waste/garbage', pos:'n.', ex:'Vi sorterer vores affald i otte spande.'},
  {da:'sortering', en:'sorting', pos:'n.', ex:'Sortering var forvirrende i starten.'},
  {da:'plastik', en:'plastic', pos:'n.', ex:'Plastik skal i den gule spand.'},
  {da:'pant', en:'bottle deposit', pos:'n.', ex:'Børnene samler pant og tjener lommepenge.'},
  {da:'energi', en:'energy', pos:'n.', ex:'Vi sparer på energien derhjemme.'},
  {da:'strøm', en:'electricity', pos:'n.', ex:'Strøm er dyrest om aftenen.'},
  {da:'cykel', en:'bicycle', pos:'n.', ex:'Min cykel er mit vigtigste transportmiddel.'},
  {da:'offentlig transport', en:'public transport', pos:'n.', ex:'Offentlig transport er godt for klimaet.'},
  {da:'CO2', en:'CO2', pos:'n.', ex:'Flyrejser udleder meget CO2.'},
  {da:'klimaforandringer', en:'climate change', pos:'n. pl.', ex:'Klimaforandringer påvirker hele verden.'},
  {da:'bæredygtig', en:'sustainable', pos:'adj.', ex:'Vi prøver at leve mere bæredygtigt.'},
  {da:'økologisk', en:'organic', pos:'adj.', ex:'Jeg køber økologisk mælk og æg.'},
  {da:'forbrug', en:'consumption', pos:'n.', ex:'Vores forbrug er blevet mindre.'},
  {da:'emballage', en:'packaging', pos:'n.', ex:'Der er alt for meget emballage på varerne.'},
  {da:'madspild', en:'food waste', pos:'n.', ex:'Vi undgår madspild med en madplan.'},
  {da:'genbrugsstationen', en:'the recycling centre', pos:'n.', ex:'Vi kører til genbrugsstationen hver måned.'},
  {da:'miljøvenlig', en:'environmentally friendly', pos:'adj.', ex:'Cyklen er det mest miljøvenlige valg.'},
  {da:'solenergi', en:'solar energy', pos:'n.', ex:'Naboen har fået solenergi på taget.'},
  {da:'vindenergi', en:'wind energy', pos:'n.', ex:'Danmark er kendt for vindenergi.'},
  {da:'el-bil', en:'electric car', pos:'n.', ex:'Min chef har lige købt en el-bil.'},
  {da:'drivhusgas', en:'greenhouse gas', pos:'n.', ex:'Drivhusgasser gør kloden varmere.'},
  {da:'fodaftryk', en:'footprint', pos:'n.', ex:'Jeg vil gerne gøre mit fodaftryk mindre.'},
  {da:'bevidst', en:'conscious/aware', pos:'adj.', ex:'Vi er blevet mere bevidste forbrugere.'},
  {da:'vandforbrug', en:'water consumption', pos:'n.', ex:'Korte brusebade sænker vandforbruget.'}
],
mm3:[
  {da:'sprog', en:'language', pos:'n.', ex:'Sprog åbner døre til mennesker.'},
  {da:'udtale', en:'pronunciation', pos:'n.', ex:'Udtalen er det sværeste ved dansk.'},
  {da:'grammatik', en:'grammar', pos:'n.', ex:'Dansk grammatik er logisk, når man ser systemet.'},
  {da:'ordforråd', en:'vocabulary', pos:'n.', ex:'Mit ordforråd vokser hver uge.'},
  {da:'lytning', en:'listening', pos:'n.', ex:'Lytning er sværere end læsning.'},
  {da:'læsning', en:'reading', pos:'n.', ex:'Læsning af aviser hjælper mit dansk.'},
  {da:'skrivning', en:'writing', pos:'n.', ex:'Skrivning kræver styr på ordstillingen.'},
  {da:'mundtlig', en:'oral', pos:'adj.', ex:'Den mundtlige test varer cirka ti minutter.'},
  {da:'øvelse', en:'practice/exercise', pos:'n.', ex:'Øvelse gør mester — også på dansk.'},
  {da:'fejl', en:'mistake', pos:'n.', ex:'Fejl er en del af at lære.'},
  {da:'fremskridt', en:'progress', pos:'n.', ex:'Jeg kan mærke fremskridt hver måned.'},
  {da:'kursus', en:'course', pos:'n.', ex:'Mit kursus ligger tirsdag og torsdag.'},
  {da:'sprogskole', en:'language school', pos:'n.', ex:'På sprogskolen møder jeg hele verden.'},
  {da:'integration', en:'integration', pos:'n.', ex:'Sproget er nøglen til integration.'},
  {da:'motivation', en:'motivation', pos:'n.', ex:'Min familie er min største motivation.'},
  {da:'dagligdag', en:'everyday life', pos:'n.', ex:'Jeg øver dansk i min dagligdag.'},
  {da:'samtale', en:'conversation', pos:'n.', ex:'En god samtale er den bedste træning.'},
  {da:'udtryk', en:'expression', pos:'n.', ex:'Danske udtryk som "hyggeligt" er svære at oversætte.'},
  {da:'ordbog', en:'dictionary', pos:'n.', ex:'Min ordbog ligger på telefonen.'},
  {da:'selvtillid', en:'self-confidence', pos:'n.', ex:'Selvtillid kommer af små sejre.'},
  {da:'sætning', en:'sentence', pos:'n.', ex:'Jeg bygger sætninger med verbet på plads to.'},
  {da:'verbum', en:'verb', pos:'n.', ex:'Verbet skal stå på plads nummer to.'},
  {da:'navneord', en:'noun', pos:'n.', ex:'Navneord har køn på dansk: en eller et.'},
  {da:'tillægsord', en:'adjective', pos:'n.', ex:'Tillægsord bøjes efter navneordet.'},
  {da:'bindeord', en:'conjunction/connector', pos:'n.', ex:'Bindeord som fordi ændrer ordstillingen.'}
]
};

/* =====================================================================
   PHASE 3.1 — GRAMMAR QUICK REFERENCE CARD
   ===================================================================== */
const QUICKREF = [
{ t:'V2 — the iron rule', icon:'anchor', body:'In every MAIN clause the finite verb is element no. 2. Position 1 can change — the verb cannot.<br><b>I morgen skal jeg til lægen.</b> (time first → subject moves behind the verb)' },
{ t:'SAV — subordinate clauses', icon:'git-branch', body:'After a subordinating connector: Subject + ADVERB + Verb. No inversion inside.<br><b>… fordi jeg ikke kan komme.</b> (ikke BEFORE the verb)' },
{ t:'Central adverbs', icon:'move-horizontal', body:'ikke · altid · aldrig · tit · ofte · snart · allerede · også · desværre · heldigvis<br>Main clause: AFTER the finite verb. Subordinate clause: BEFORE the verb. Modal: between the two verbs (<b>kan ikke komme</b>). Perfect: after har/er (<b>har aldrig set</b>).' },
{ t:'Main clause pattern', icon:'table', body:'<span class="font-mono text-[13px]">Position 1 | VERB | Subject | Adverb | Rest</span><br><b>I morgen | skal | jeg | ikke | arbejde</b>' },
{ t:'Subordinate clause pattern', icon:'table-2', body:'<span class="font-mono text-[13px]">Connector | Subject | ADVERB | Verb | Rest</span><br><b>fordi | jeg | ikke | kan | komme</b>' },
{ t:'SAV-triggers (subordinating)', icon:'corner-down-left', body:'<b>fordi · at · hvis · når · selvom · da · mens · inden/før · om · skønt · medmindre · som · der · efter at · indtil · så snart</b> + hv-words in indirect questions.' },
{ t:'NO SAV (coordinating)', icon:'equal', body:'<b>og · men · eller · for · så (=so)</b> — both halves keep normal main-clause order.<br>Trap: <b>for</b> ≠ <b>fordi</b>! "for jeg har ikke tid" but "fordi jeg ikke har tid".' },
{ t:'Inversion-triggers (fronted)', icon:'flip-vertical', body:'<b>derfor · desuden · alligevel · dog · derimod · bagefter · derefter · først · til sidst · endelig · nemlig*</b> + ALL fronted time/place phrases + fronted hvis/når-clauses.<br><span class="text-[11px]">*nemlig usually sits mid-sentence: "Han kommer nemlig ikke."</span>' },
{ t:'Perfect tense formation', icon:'history', body:'<b>har</b> + participle for most verbs: <b>har boet, har lavet, har set</b>.<br><b>er</b> + participle for movement/change: <b>er kommet, er flyttet, er begyndt, er blevet</b>.' },
{ t:'Past vs perfect — quick guide', icon:'clock', body:'Finished time word (i går, sidste uge, i 2020, da jeg var barn) → <b>datid</b>: "I går VAR jeg syg."<br>Open until now (aldrig, nogensinde, lige, allerede, endnu ikke, siden) → <b>førnutid</b>: "Jeg HAR ALDRIG været i Jylland."' }
];

/* =====================================================================
   PHASE 3.7 — EXAM DAY CHECKLIST
   ===================================================================== */
const EXAMDAY = [
{ t:'What to bring', icon:'briefcase', items:['Photo ID (passport/opholdskort) — checked at the door','Two pens that work (blue/black)','A bottle of water and a small snack for the break','Arrive at least 15 minutes early — find the room calmly','Your mindmaps for the oral topics (keywords only!)'] },
{ t:'Time management', icon:'timer', items:['Reading: 50 min for everything — budget ~8 min (Opg.1), ~10 (2A+2B), ~12 (Opg.3), ~12 (Opg.4), 8 min buffer','Writing Opgave 2: 30 minutes — plan 5, write 20, check 5','Never leave a gap blank — guess before you move on','Wear a watch: phones are not allowed on the desk'] },
{ t:'Mental preparation', icon:'brain', items:['Three deep breaths before each section — oxygen beats panic','Forgot a word? DESCRIBE it: "det er en ting, man bruger til at…"','Blackout in the oral? Use a thinking-time phrase and restart smaller','One bad task does not fail the test — points add up ACROSS tasks','Sleep beats cramming: stop studying by 20:00 the night before'] },
{ t:'Last-minute grammar scan', icon:'spell-check', items:['Time/place word first? → verb SECOND (I morgen SKAL jeg…)','fordi/selvom/hvis/når/at → ikke BEFORE the verb','Two verbs? ikke between them (kan ikke komme)','har/er + aldrig/lige/allerede + participle','for ≠ fordi — opposite word order!'] },
{ t:'Emergency oral phrases', icon:'life-buoy', items:['"Det er et godt spørgsmål. Jeg skal lige tænke mig om."','"Undskyld, kan du gentage spørgsmålet?"','"Hvad betyder …? Jeg kender ikke det ord."','"Jeg er ikke sikker, men jeg tror, at …"','"Kan jeg sige det på en anden måde? Jeg mener, at …"'] }
];

/* =====================================================================
   PHASE 6 — REAL-WORLD DANISH
   ===================================================================== */
const REALLIFE = [
{ id:'laege', title:'Hos lægen', icon:'stethoscope',
  phrases:[
    {da:'Jeg vil gerne bestille en tid hos lægen.', en:'I would like to book a doctor’s appointment.'},
    {da:'Jeg har haft ondt i halsen i tre dage.', en:'I have had a sore throat for three days.'},
    {da:'Det gør ondt her, når jeg trykker.', en:'It hurts here when I press.'},
    {da:'Er det noget alvorligt?', en:'Is it something serious?'},
    {da:'Hvor tit skal jeg tage medicinen?', en:'How often should I take the medicine?'},
    {da:'Skal jeg komme igen, hvis det ikke bliver bedre?', en:'Should I come back if it does not improve?'}
  ],
  dialogue:['Sekretær: Lægehuset, goddag.','Dig: Goddag. Jeg vil gerne bestille en tid. Jeg har haft feber i to dage.','Sekretær: Vi har en tid i morgen klokken 10.20. Hvad er dit CPR-nummer?','Dig: Det er 120589-XXXX.','Sekretær: Så er du skrevet ind. God bedring!','Dig: Tusind tak. Farvel!'],
  tip:'Ring mellem kl. 8 og 9, hvis du vil tale med selve lægen — ellers får du sekretæren. Akut syg efter 16? Ring til lægevagten/1813.',
  mistake:'Saying "Jeg er dårlig" (I am bad/untalented). Say "Jeg har det dårligt" (I feel unwell) — the lille "det" changes everything.' },
{ id:'kommune', title:'På kommunen / Borgerservice', icon:'landmark',
  phrases:[
    {da:'Jeg skal trække et nummer, ikke?', en:'I need to take a queue number, right?'},
    {da:'Jeg kommer, fordi jeg har fået et brev fra jer.', en:'I am here because I received a letter from you.'},
    {da:'Jeg forstår ikke brevet helt — kan du forklare det?', en:'I do not fully understand the letter — can you explain it?'},
    {da:'Hvilke papirer skal I bruge fra mig?', en:'Which documents do you need from me?'},
    {da:'Kan jeg få det på skrift?', en:'Can I get that in writing?'},
    {da:'Hvor lang er sagsbehandlingstiden?', en:'How long is the processing time?'}
  ],
  dialogue:['Medarbejder: Nummer 47? Hvad kan jeg hjælpe med?','Dig: Goddag. Jeg har fået det her brev om boligstøtte, men jeg forstår ikke, hvad I mangler.','Medarbejder: Lad mig se… I mangler at uploade din lejekontrakt.','Dig: Okay. Kan jeg gøre det her, eller skal det være digitalt?','Medarbejder: Du kan gøre det på borger.dk med MitID. Skal jeg vise dig hvordan?','Dig: Ja tak, det ville være en stor hjælp.'],
  tip:'Næsten alt foregår digitalt via borger.dk og MitID. Kommunens medarbejdere MÅ gerne hjælpe dig ved skærmen — bare spørg.',
  mistake:'Arriving without documents "to ask first". Bring everything (pas, opholdskort, kontrakt, lønsedler) — every visit without papers costs you a week.' },
{ id:'arbejde', title:'På arbejde', icon:'briefcase',
  phrases:[
    {da:'Godmorgen! Har du haft en god weekend?', en:'Good morning! Did you have a good weekend?'},
    {da:'Jeg er desværre syg i dag, så jeg bliver hjemme.', en:'I am unfortunately ill today, so I am staying home.'},
    {da:'Hvem skal jeg give besked, når jeg er syg?', en:'Who should I notify when I am ill?'},
    {da:'Jeg er frisk igen og kommer i morgen.', en:'I am well again and will come in tomorrow.'},
    {da:'Kan vi lige vende det efter frokost?', en:'Can we go over it after lunch?'},
    {da:'Skal jeg tage en uge mere af min ferie i juli?', en:'Should I take another week of my holiday in July?'}
  ],
  dialogue:['Dig (telefon, kl. 7.02): Godmorgen, det er Amir. Jeg er desværre blevet syg, så jeg kommer ikke i dag.','Chef: God bedring! Er det noget med feber?','Dig: Ja, jeg har feber og ondt i halsen. Jeg håber, jeg er frisk i morgen.','Chef: Tag den med ro. Ring eller skriv i morgen tidlig, ikke?','Dig: Det gør jeg. Tak — og undskyld besværet.','Chef: Det skal du ikke tænke på. God bedring!'],
  tip:'Sygemelding sker ALTID inden arbejdstid — typisk med et opkald eller en sms direkte til din leder før kl. 8. Du behøver ikke forklare alle detaljer.',
  mistake:'Saying nothing and just staying home. In Denmark no-show without a call is a serious problem — the call itself is the rule.' },
{ id:'supermarked', title:'I supermarkedet', icon:'shopping-cart',
  phrases:[
    {da:'Undskyld, hvor finder jeg melet?', en:'Excuse me, where do I find the flour?'},
    {da:'Er der tilbud på kaffen i denne uge?', en:'Is the coffee on offer this week?'},
    {da:'Hvad er forskellen på de to?', en:'What is the difference between these two?'},
    {da:'Jeg skal bede om en pose, tak.', en:'A bag, please.'},
    {da:'Kan jeg betale halvt med kort og halvt kontant?', en:'Can I pay half by card and half in cash?'},
    {da:'Hvor er pantautomaten?', en:'Where is the bottle-deposit machine?'}
  ],
  dialogue:['Dig: Undskyld, hvor finder jeg rugbrødet?','Medarbejder: Gang 4, lige ved siden af det friske brød.','Dig: Tak! Og har I flere af de økologiske æg? Hylden er tom.','Medarbejder: Jeg tjekker lige på lageret… Ja, jeg henter en bakke til dig.','Dig: Tusind tak. Det var sødt af dig.','Medarbejder: Selv tak — fortsat god dag!'],
  tip:'Pak selv dine varer — og pak HURTIGT, for den næste kundes varer kommer straks. Tilbudsaviser (app: eTilbudsavis) er en folkesport.',
  mistake:'Waiting for the cashier to pack your bags. They never will — have your bag open before the first item rolls down.' },
{ id:'skole', title:'På skolen (forældre)', icon:'school',
  phrases:[
    {da:'Min søn kommer ikke i skole i dag, fordi han er syg.', en:'My son is not coming to school today because he is ill.'},
    {da:'Hvordan går det med ham fagligt og socialt?', en:'How is he doing academically and socially?'},
    {da:'Hvad kan vi gøre derhjemme for at støtte hende?', en:'What can we do at home to support her?'},
    {da:'Kan vi få en tolk til samtalen?', en:'Can we get an interpreter for the meeting?'},
    {da:'Hvad betyder beskeden på Aula?', en:'What does the message on Aula mean?'},
    {da:'Må hun holde fri på fredag? Vi skal til familiefest.', en:'May she take Friday off? We have a family celebration.'}
  ],
  dialogue:['Lærer: Velkommen til skole-hjem-samtale! Adam er blevet rigtig god til at læse.','Dig: Det er dejligt at høre. Vi læser sammen hver aften.','Lærer: Det kan vi mærke. Socialt går det også fint — han har gode venner.','Dig: Vi vil gerne høre, hvordan vi kan hjælpe med matematikken?','Lærer: Spil med tal og penge derhjemme — det virker bedst i den alder.','Dig: Det gør vi. Tak for en god samtale!'],
  tip:'Al kommunikation med skolen foregår på appen Aula — tjek den dagligt. Sygemelding sker også dér, inden kl. 8.',
  mistake:'Treating skole-hjem-samtalen as a problem meeting. It is 10 friendly minutes twice a year — bring questions, not defence.' },
{ id:'bank', title:'I banken', icon:'piggy-bank',
  phrases:[
    {da:'Jeg vil gerne åbne en konto.', en:'I would like to open an account.'},
    {da:'Jeg har brug for en NemKonto til min løn.', en:'I need a NemKonto for my salary.'},
    {da:'Hvilke papirer skal I se?', en:'Which documents do you need to see?'},
    {da:'Hvad koster det at have kontoen?', en:'What does the account cost?'},
    {da:'Hvordan får jeg MitID?', en:'How do I get MitID?'},
    {da:'Kan jeg få et betalingskort til kontoen?', en:'Can I get a debit card for the account?'}
  ],
  dialogue:['Rådgiver: Hvad kan jeg hjælpe med?','Dig: Jeg er lige flyttet til Danmark og skal åbne en konto. Min arbejdsgiver spørger efter en NemKonto.','Rådgiver: Det klarer vi. Jeg skal se pas, opholdskort og din ansættelseskontrakt.','Dig: Dem har jeg med her. Hvor lang tid tager det?','Rådgiver: Kontoen er klar om tre-fire dage, og kortet kommer med posten.','Dig: Perfekt. Tak for hjælpen!'],
  tip:'NemKonto er den konto, det offentlige bruger til udbetalinger (løn, skat, boligstøtte). Din bank registrerer den for dig — bare bed om det.',
  mistake:'Booking a meeting without documents. Bring pas + opholdskort + kontrakt + CPR-bevis to the FIRST meeting and save two weeks.' },
{ id:'naboer', title:'Med naboerne', icon:'home',
  phrases:[
    {da:'Hej! Vi er lige flyttet ind i nummer 12.', en:'Hi! We just moved into number 12.'},
    {da:'Sig endelig til, hvis vi larmer for meget.', en:'Do say if we make too much noise.'},
    {da:'Vi holder fest på lørdag — jeg håber, det er okay.', en:'We are having a party on Saturday — I hope that is okay.'},
    {da:'Kan jeg låne en boremaskine et par timer?', en:'Could I borrow a drill for a couple of hours?'},
    {da:'Undskyld, men musikken er ret høj — kan I skrue lidt ned?', en:'Sorry, but the music is quite loud — could you turn it down a bit?'},
    {da:'Skal jeg tage en pakke ind for jer i næste uge?', en:'Shall I take in a parcel for you next week?'}
  ],
  dialogue:['Dig: Hej! Undskyld, jeg forstyrrer. Vi er lige flyttet ind ved siden af.','Nabo: Nå, velkommen til! Hvor kommer I fra?','Dig: Tak! Vi kommer fra Indien — vi har boet i Danmark i to år.','Nabo: Hyggeligt! Sig til, hvis I mangler noget i starten.','Dig: Tusind tak. Og sig endelig til, hvis vi larmer — vi har en lille søn!','Nabo: Haha, bare rolig. Det har vi også!'],
  tip:'En fest? Hæng en venlig seddel i opgangen et par dage før ("Vi holder fest lørdag — sig til, hvis det bliver for højt"). Det forebygger 90 % af alle klager.',
  mistake:'Complaining about noise via the boligforening FIRST. Danes expect you to knock kindly first — the formal complaint is step two.' },
{ id:'telefon', title:'Telefonsamtaler', icon:'phone',
  phrases:[
    {da:'Goddag, du taler med Amira Hassan.', en:'Hello, this is Amira Hassan speaking.'},
    {da:'Jeg ringer, fordi jeg gerne vil bestille en tid.', en:'I am calling because I would like to book an appointment.'},
    {da:'Kan du tale lidt langsommere? Jeg er ved at lære dansk.', en:'Could you speak a bit slower? I am learning Danish.'},
    {da:'Kan jeg få dig til at gentage det sidste?', en:'Could you repeat the last part?'},
    {da:'Vil du lægge en besked til ham?', en:'Will you leave a message for him?'},
    {da:'Tak for hjælpen. Hav en god dag!', en:'Thanks for the help. Have a good day!'}
  ],
  dialogue:['Klinik: Tandlægehuset, det er Mia.','Dig: Goddag, du taler med Pavel Novak. Jeg vil gerne bestille en tid til tandrensning.','Klinik: Det kan vi godt. Hvad med onsdag den 9. klokken 14?','Dig: Kan du sige datoen igen? Jeg vil lige skrive den ned.','Klinik: Onsdag den niende klokken fjorten.','Dig: Perfekt, den tager jeg. Tak for hjælpen!'],
  tip:'Danskere præsenterer sig med navn, når de tager telefonen — gør det samme: "Du taler med…". Skriv tal og datoer ned og gentag dem højt.',
  mistake:'Pretending to understand numbers and times. ALWAYS repeat back: "Onsdag den 9. klokken 14, ikke?" — misheard appointments are the classic newcomer disaster.' },
{ id:'apotek', title:'På apoteket', icon:'pill',
  phrases:[
    {da:'Jeg skal hente medicin — lægen har sendt en recept.', en:'I need to collect medicine — the doctor sent a prescription.'},
    {da:'Hvordan skal jeg tage den — og hvor tit?', en:'How should I take it — and how often?'},
    {da:'Skal den tages med mad?', en:'Should it be taken with food?'},
    {da:'Har I noget i håndkøb mod hoste?', en:'Do you have something over the counter for a cough?'},
    {da:'Er der bivirkninger, jeg skal kende?', en:'Are there side effects I should know about?'},
    {da:'Må børn tage den her?', en:'Can children take this?'}
  ],
  dialogue:['Apoteker: Goddag! Hvad kan jeg hjælpe med?','Dig: Goddag. Jeg skal hente medicin til min datter. Lægen har sendt recepten.','Apoteker: CPR-nummer, tak. … Her er den: én tablet morgen og aften i ti dage.','Dig: Skal den tages med mad?','Apoteker: Ja, helst — så undgår hun ondt i maven. Og husk at tage ALLE tabletterne, også når hun får det bedre.','Dig: Forstået. Tusind tak!'],
  tip:'Recepter er digitale — lægen sender dem direkte, og du henter med CPR-nummer. "I håndkøb" betyder uden recept.',
  mistake:'Stopping antibiotics when you feel better. The pharmacist says "tag dem alle" for a reason — finish the course.' },
{ id:'jobsamtale', title:'Til jobsamtale', icon:'user-check',
  phrases:[
    {da:'Tak, fordi I ville mødes med mig.', en:'Thank you for meeting with me.'},
    {da:'Jeg har fem års erfaring som … fra mit hjemland.', en:'I have five years of experience as a … from my home country.'},
    {da:'Jeg lærer hurtigt, og mit dansk bliver bedre hver måned.', en:'I learn fast, and my Danish improves every month.'},
    {da:'Hvordan ser en typisk arbejdsdag ud her?', en:'What does a typical workday look like here?'},
    {da:'Hvad er det vigtigste i jobbet de første tre måneder?', en:'What matters most in the job for the first three months?'},
    {da:'Hvornår kan jeg forvente at høre fra jer?', en:'When can I expect to hear from you?'}
  ],
  dialogue:['Chef: Velkommen! Fortæl lidt om dig selv.','Dig: Tak! Jeg hedder Elena, jeg er uddannet kok, og jeg har arbejdet fem år i restauranter i Rumænien.','Chef: Hvorfor vil du arbejde hos os?','Dig: Fordi jeres køkken bruger lokale råvarer — det brænder jeg for. Og jeg vil gerne lære det danske køkken.','Chef: Dit dansk er fint! Har du spørgsmål til os?','Dig: Ja — hvordan ser en typisk vagt ud, og hvem skal jeg arbejde tættest sammen med?'],
  tip:'Danske jobsamtaler er uformelle i tonen men grundige. ALTID forbered 2-3 spørgsmål til dem — ingen spørgsmål signalerer ingen interesse.',
  mistake:'Underselling yourself. Danish modesty (janteloven) does NOT apply to job interviews — state your experience plainly and confidently.' }
];

const CULTURE = [
{ t:'Work culture', icon:'briefcase', body:'Danish workplaces are flat: you call your boss by first name and are expected to speak up. The <b>frokostpause</b> (lunch break) is short — often 29 minutes — but sacred and social: eat WITH your colleagues, not at your desk. Most workers join a <b>fagforening</b> (union) and an <b>a-kasse</b> (unemployment insurance); both are normal, not political statements. Working hours are 37/week, and leaving at 16 to pick up children is respected, not career-limiting. Parental leave (<b>barsel</b>) is long and increasingly shared between parents. Overtime exists but is the exception — efficiency within hours is the ideal.' },
{ t:'Health culture', icon:'heart-pulse', body:'Healthcare (<b>sundhedsvæsenet</b>) is tax-funded: doctor visits and hospitals are free, and everyone has a fixed family doctor (<b>egen læge</b>) who is the gateway to specialists. Expect fewer tests and more "see it on" (<b>vent og se</b>) than in many countries — this surprises newcomers. Prevention is cultural: Danes cycle everywhere in all weather, and <b>motion</b> (everyday exercise) is considered medicine. Pharmacies (<b>apotek</b>) handle prescriptions digitally via CPR. After 16:00 and weekends, you call <b>lægevagten</b> — never just show up at the hospital.' },
{ t:'Environmental culture', icon:'leaf', body:'Denmark runs on green pride. The <b>pant</b> system refunds money for every bottle and can — children collect them as pocket money. Waste sorting (<b>genbrug</b> and <b>affaldssortering</b>) is detailed: food, plastic, metal, glass, cardboard, residual — and your neighbours notice if you do it wrong. <b>Vindenergi</b> (wind power) supplies a huge share of electricity, and wind turbines are a national symbol. Organic (<b>økologisk</b>, the red Ø-mark) food has one of the world’s highest market shares. Buying second-hand is high-status, not a sign of poverty.' },
{ t:'Education culture', icon:'graduation-cap', body:'Education is free at every level, and university students are even paid a monthly grant (<b>SU</b>). The <b>folkeskole</b> (public school, age 6–16) values group work, discussion and independence over tests and ranking — newcomer parents are often surprised how informal teachers are. Lifelong learning is the norm: adults retrain through <b>voksenundervisning</b>, VUC and evening schools (<b>aftenskoler</b>), often supported by employers and unions. Asking questions is seen as engagement, never as weakness — in class and at work alike.' },
{ t:'Hygge & social life', icon:'coffee', body:'<b>Hygge</b> is the art of cosy togetherness: candles, coffee, no agenda, no hurry. It is how Danes socialise — quiet evenings rather than big spontaneous gatherings. Friendships form slowly but run deep; the fast lane in is <b>foreningslivet</b> — clubs and associations for everything from running to chess. Over 90 % of Danes belong to at least one forening, and they are the heart of the local <b>fællesskab</b> (community). Invitations are planned weeks ahead; "drop by anytime" is rarely meant literally. Bring cake on your birthday — yes, YOU bring it.' },
{ t:'Integration & language', icon:'languages', body:'The state offers new residents free Danish lessons (<b>danskuddannelse</b>) in three tracks; DU3 is the fastest. Language tests (<b>sprogprøver</b>) are gateways: Prøve i Dansk 3 is required for permanent residency and citizenship applications, alongside an active citizenship element (<b>medborgerskab</b>). Danes will switch to English to be "helpful" — politely insisting on Danish ("Jeg vil gerne øve mig!") is respected and usually works. Speaking even imperfect Danish opens social doors that English keeps shut: the language is the difference between living IN Denmark and living WITH Denmark.' }
];


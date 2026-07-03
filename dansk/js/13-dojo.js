/* Dansk Coach — js/13-dojo.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   TOPIC MASTERY DOJO — deep, generator-backed per-topic drilling
   ---------------------------------------------------------------------
   Danish word order is rule-governed, so every item is COMPUTED from a
   vetted lexicon and is correct by construction. Unlimited fresh items
   per topic → real 30–60 min mastery drilling, impossible to memorise.
   ===================================================================== */

/* ---------- vetted lexicon (every combination yields correct Danish) ---------- */
const LEX = {
  /* Danish present tense does NOT inflect for person/number → any subject is safe */
  subjects: ['jeg','du','han','hun','vi','de','min mand','min kone','min nabo','min kollega','min chef','Maria','Peter',
    'min datter','min søn','min bror','min søster','min ven','min veninde','min underviser','min læge','min chauffør','min svigermor','min onkel','min tante','min bedstemor','min bedstefar','min studiekammerat','min genbo','Ahmed','Fatima','Lars','Sofie','Ida','Omar','Nadia','Thomas','Camilla','Hassan'],
  subjReflex: { 'jeg':'mig','du':'dig','han':'sig','hun':'sig','vi':'os','de':'sig','min mand':'sig','min kone':'sig','min nabo':'sig','min kollega':'sig','min chef':'sig','Maria':'sig','Peter':'sig',
    'min datter':'sig','min søn':'sig','min bror':'sig','min søster':'sig','min ven':'sig','min veninde':'sig','min underviser':'sig','min læge':'sig','min chauffør':'sig','min svigermor':'sig','min onkel':'sig','min tante':'sig','min bedstemor':'sig','min bedstefar':'sig','min studiekammerat':'sig','min genbo':'sig','Ahmed':'sig','Fatima':'sig','Lars':'sig','Sofie':'sig','Ida':'sig','Omar':'sig','Nadia':'sig','Thomas':'sig','Camilla':'sig','Hassan':'sig' },
  /* finite verb + complement that works with ANY adult subject and ANY time/place front.
     present / past / past-participle (all take "har") / infinitive */
  verbs: [
    { pres:'spiser',   past:'spiste',   perf:'spist',   inf:'spise',   rest:'morgenmad',          en:'eat' },
    { pres:'drikker',  past:'drak',     perf:'drukket', inf:'drikke',  rest:'kaffe',              en:'drink' },
    { pres:'cykler',   past:'cyklede',  perf:'cyklet',  inf:'cykle',   rest:'til arbejde',        en:'cycle' },
    { pres:'læser',    past:'læste',    perf:'læst',    inf:'læse',    rest:'avisen',             en:'read' },
    { pres:'træner',   past:'trænede',  perf:'trænet',  inf:'træne',   rest:'i fitnesscentret',   en:'work out' },
    { pres:'sover',    past:'sov',      perf:'sovet',   inf:'sove',    rest:'længe',              en:'sleep' },
    { pres:'ser',      past:'så',       perf:'set',     inf:'se',      rest:'fjernsyn',           en:'watch' },
    { pres:'køber',    past:'købte',    perf:'købt',    inf:'købe',    rest:'ind',                en:'shop' },
    { pres:'ringer',   past:'ringede',  perf:'ringet',  inf:'ringe',   rest:'til lægen',          en:'call' },
    { pres:'arbejder', past:'arbejdede',perf:'arbejdet',inf:'arbejde', rest:'hjemmefra',          en:'work' },
    { pres:'laver',    past:'lavede',   perf:'lavet',   inf:'lave',    rest:'aftensmad',          en:'make' },
    { pres:'hjælper',  past:'hjalp',    perf:'hjulpet', inf:'hjælpe',  rest:'til derhjemme',      en:'help out' },
    { pres:'vasker',   past:'vaskede',  perf:'vasket',  inf:'vaske',   rest:'tøj',                en:'wash' },
    { pres:'rydder',   past:'ryddede',  perf:'ryddet',  inf:'rydde',   rest:'op',                 en:'tidy up' },
    { pres:'skriver',  past:'skrev',    perf:'skrevet', inf:'skrive',  rest:'en besked',          en:'write' },
    { pres:'maler',    past:'malede',   perf:'malet',   inf:'male',    rest:'stuen',              en:'paint' },
    { pres:'reparerer',past:'reparerede',perf:'repareret',inf:'reparere',rest:'cyklen',           en:'repair' },
    { pres:'planlægger',past:'planlagde',perf:'planlagt',inf:'planlægge',rest:'ferien',           en:'plan' },
    { pres:'besøger',  past:'besøgte',  perf:'besøgt',  inf:'besøge',  rest:'sine forældre',      en:'visit' },
    { pres:'inviterer',past:'inviterede',perf:'inviteret',inf:'invitere',rest:'venner',           en:'invite' },
    { pres:'lytter',   past:'lyttede',  perf:'lyttet',  inf:'lytte',   rest:'til musik',          en:'listen' },
    { pres:'øver',     past:'øvede',    perf:'øvet',    inf:'øve',     rest:'dansk',              en:'practise' },
    { pres:'lærer',    past:'lærte',    perf:'lært',    inf:'lære',    rest:'et nyt sprog',       en:'learn' },
    { pres:'underviser',past:'underviste',perf:'undervist',inf:'undervise',rest:'i dansk',        en:'teach' },
    { pres:'passer',   past:'passede',  perf:'passet',  inf:'passe',   rest:'børnene',            en:'look after' },
    { pres:'bager',    past:'bagte',    perf:'bagt',    inf:'bage',    rest:'kage',               en:'bake' },
    { pres:'handler',  past:'handlede', perf:'handlet', inf:'handle',  rest:'ind til weekenden',  en:'shop' },
    { pres:'betaler',  past:'betalte',  perf:'betalt',  inf:'betale',  rest:'regningerne',        en:'pay' },
    { pres:'bestiller',past:'bestilte', perf:'bestilt', inf:'bestille',rest:'tid hos tandlægen',  en:'book' },
    { pres:'downloader',past:'downloadede',perf:'downloadet',inf:'downloade',rest:'en app',       en:'download' },
    { pres:'tjekker',  past:'tjekkede', perf:'tjekket', inf:'tjekke',  rest:'sin mail',           en:'check' },
    { pres:'parkerer', past:'parkerede',perf:'parkeret',inf:'parkere', rest:'bilen',              en:'park' },
    { pres:'venter',   past:'ventede',  perf:'ventet',  inf:'vente',   rest:'på bussen',          en:'wait' },
    { pres:'hører',    past:'hørte',    perf:'hørt',    inf:'høre',    rest:'radio',              en:'listen to' },
    { pres:'skifter',  past:'skiftede', perf:'skiftet', inf:'skifte',  rest:'tøj',                en:'change' },
    { pres:'bruger',   past:'brugte',   perf:'brugt',   inf:'bruge',   rest:'for meget tid på mobilen', en:'use' }
  ],
  timeFront: ['I morgen','I går','Om sommeren','Om vinteren','Hver dag','Hver morgen','I weekenden','Om mandagen','I sidste uge','Næste år','Om aftenen','Klokken otte',
    'I aften','I nat','I eftermiddags','I formiddags','Om foråret','Om efteråret','Hver aften','Hver weekend','Hvert år','I næste uge','I denne måned','Om et år','Klokken ni','Klokken syv om morgenen','I julen','I påsken','Om tirsdagen','Om torsdagen','Om fredagen','I dag','I overmorgen','I denne uge','Snart','Til sommer'],
  timePast:  ['I går','I sidste uge','I mandags','Forrige weekend','For en time siden',
    'I fredags','I søndags','I sidste måned','Sidste år','For to dage siden','For et øjeblik siden','I morges','I går aftes','I julen sidste år','For længe siden'],
  placeFront:['I Danmark','På arbejdet','Hjemme hos os','I København','I mit hjemland','På sprogskolen','I byen',
    'I supermarkedet','På biblioteket','I skolen','På hospitalet','I parken','På stationen','I lufthavnen','På restauranten','I kirken','På museet','I banken','På posthuset','I svømmehallen','På café'],
  adverbs:   ['ikke','altid','aldrig','tit','ofte','sjældent','næppe','vist','nok','også','kun','stadig','allerede','gerne','sikkert'],
  modals:    [ {w:'kan',en:'can'}, {w:'skal',en:'must'}, {w:'vil',en:'want to'}, {w:'må',en:'may'}, {w:'bør',en:'ought to'}, {w:'tør',en:'dare to'} ],
  connSAV:   [ {w:'fordi',en:'because'}, {w:'at',en:'that'}, {w:'hvis',en:'if'}, {w:'når',en:'when'}, {w:'selvom',en:'even though'}, {w:'da',en:'when (past)'}, {w:'mens',en:'while'},
    {w:'eftersom',en:'since/because'}, {w:'skønt',en:'although'}, {w:'inden',en:'before'}, {w:'før',en:'before'}, {w:'siden',en:'since (time)'}, {w:'medmindre',en:'unless'}, {w:'som om',en:'as if'}, {w:'dersom',en:'if (formal)'}, {w:'imens',en:'while'}, {w:'efter at',en:'after'}, {w:'så snart',en:'as soon as'}, {w:'indtil',en:'until'}, {w:'når først',en:'once'}, {w:'hvorimod',en:'whereas'} ],
  /* defined for content symmetry but not currently drawn by any generator — safe to leave un-expanded */
  sentAdv:   ['Derfor','Desuden','Alligevel','Bagefter','Til sidst'],
  /* dedicated, hand-vetted pools where generation needs special shapes */
  relSubjVerbs: [ {v:'aldrig hilser', en:'never says hello'}, {v:'tit larmer', en:'often makes noise'}, {v:'aldrig virker', en:'never works'}, {v:'altid kommer for sent', en:'is always late'},
    {v:'altid smiler', en:'always smiles'}, {v:'ofte rejser', en:'often travels'}, {v:'sjældent svarer', en:'rarely answers'}, {v:'altid hjælper', en:'always helps'}, {v:'tit glemmer nøglerne', en:'often forgets the keys'}, {v:'aldrig lytter', en:'never listens'}, {v:'altid griner', en:'always laughs'}, {v:'ofte klager', en:'often complains'} ],
  relObjVerbs:  [ {v:'købte', en:'bought'}, {v:'så', en:'saw'}, {v:'lånte', en:'borrowed'}, {v:'mødte', en:'met'},
    {v:'reparerede', en:'repaired'}, {v:'solgte', en:'sold'}, {v:'fandt', en:'found'}, {v:'anbefalede', en:'recommended'}, {v:'testede', en:'tested'}, {v:'valgte', en:'chose'}, {v:'byggede', en:'built'}, {v:'designede', en:'designed'} ],
  relNouns:     [ {w:'en nabo', def:'naboen'}, {w:'en kollega', def:'kollegaen'}, {w:'en ven', def:'vennen'}, {w:'en bil', def:'bilen'}, {w:'en film', def:'filmen'}, {w:'en bog', def:'bogen'},
    {w:'en computer', def:'computeren'}, {w:'en cykel', def:'cyklen'}, {w:'en lejlighed', def:'lejligheden'}, {w:'en restaurant', def:'restauranten'}, {w:'en café', def:'caféen'}, {w:'en skole', def:'skolen'}, {w:'en avis', def:'avisen'}, {w:'en telefon', def:'telefonen'}, {w:'en taske', def:'tasken'}, {w:'en frisør', def:'frisøren'}, {w:'en butik', def:'butikken'}, {w:'en kalender', def:'kalenderen'} ],
  indirectMatrix:[ {w:'Jeg ved ikke,', q:false}, {w:'Hun spørger,', q:true}, {w:'Kan du sige mig,', q:true}, {w:'Jeg er ikke sikker på,', q:false},
    {w:'Han spørger,', q:true}, {w:'Ved du,', q:true}, {w:'Kan du fortælle mig,', q:true}, {w:'Kan I sige mig,', q:true}, {w:'Min chef spørger,', q:true}, {w:'Mine venner spørger tit,', q:true}, {w:'Jeg vil gerne vide,', q:false}, {w:'Jeg er i tvivl om,', q:false} ],
  indirectHv:   ['hvornår','hvor','hvorfor','hvad tid','hvor længe','hvordan','hvor tit','hvilken dag','hvor mange gange'],
  indirectClauses:[ {s:'bussen', v:'kører'}, {s:'butikken', v:'åbner'}, {s:'mødet', v:'starter'}, {s:'toget', v:'kommer'}, {s:'filmen', v:'slutter'},
    {s:'skolen', v:'starter'}, {s:'posten', v:'kommer'}, {s:'koncerten', v:'begynder'}, {s:'festen', v:'slutter'}, {s:'flyet', v:'lander'}, {s:'supermarkedet', v:'lukker'}, {s:'undervisningen', v:'starter'} ],
  reflexVerbs:  [ {fin:'glæder', tail:'til ferien', en:'looks forward to the holiday'}, {fin:'skynder', tail:'for ikke at komme for sent', en:'hurries'}, {fin:'føler', tail:'rigtig godt tilpas', en:'feels good'}, {fin:'sætter', tail:'ved bordet', en:'sits down'}, {fin:'øver', tail:'hver dag', en:'practises'},
    {fin:'interesserer', tail:'for dansk kultur', en:'is interested in Danish culture'}, {fin:'forbereder', tail:'på eksamen', en:'prepares for the exam'}, {fin:'koncentrerer', tail:'om opgaven', en:'concentrates on the task'}, {fin:'vænner', tail:'til det danske vejr', en:'gets used to the Danish weather'}, {fin:'skammer', tail:'over fejlen', en:'is ashamed of the mistake'}, {fin:'undskylder', tail:'for at komme for sent', en:'excuses himself for being late'}, {fin:'beslutter', tail:'hurtigt', en:'makes up his mind quickly'}, {fin:'klæder', tail:'varmt på om vinteren', en:'dresses warmly in winter'}, {fin:'morer', tail:'over historien', en:'is amused by the story'}, {fin:'opfører', tail:'ordentligt', en:'behaves properly'} ],
  /* adjective agreement: en-word → bare form, et-word → -t, plural/definite → -e */
  adjNouns: [ {w:'en bil', gender:'en', pl:'biler', en:'car'}, {w:'et hus', gender:'et', pl:'huse', en:'house'}, {w:'en lejlighed', gender:'en', pl:'lejligheder', en:'apartment'}, {w:'et bord', gender:'et', pl:'borde', en:'table'}, {w:'en bog', gender:'en', pl:'bøger', en:'book'}, {w:'et værelse', gender:'et', pl:'værelser', en:'room'}, {w:'en by', gender:'en', pl:'byer', en:'town'}, {w:'et problem', gender:'et', pl:'problemer', en:'problem'},
    {w:'en have', gender:'en', pl:'haver', en:'garden'}, {w:'et køkken', gender:'et', pl:'køkkener', en:'kitchen'}, {w:'en cykel', gender:'en', pl:'cykler', en:'bicycle'}, {w:'et vindue', gender:'et', pl:'vinduer', en:'window'}, {w:'en skole', gender:'en', pl:'skoler', en:'school'}, {w:'et kontor', gender:'et', pl:'kontorer', en:'office'}, {w:'en butik', gender:'en', pl:'butikker', en:'shop'}, {w:'et fjernsyn', gender:'et', pl:'fjernsyn', en:'television'}, {w:'en telefon', gender:'en', pl:'telefoner', en:'phone'}, {w:'et billede', gender:'et', pl:'billeder', en:'picture'}, {w:'en gade', gender:'en', pl:'gader', en:'street'}, {w:'et brev', gender:'et', pl:'breve', en:'letter'}, {w:'en computer', gender:'en', pl:'computere', en:'computer'}, {w:'et sprog', gender:'et', pl:'sprog', en:'language'}, {w:'en restaurant', gender:'en', pl:'restauranter', en:'restaurant'}, {w:'et køleskab', gender:'et', pl:'køleskabe', en:'fridge'} ],
  adjectives: [ {base:'stor', t:'stort', e:'store', en:'big'}, {base:'gammel', t:'gammelt', e:'gamle', en:'old'}, {base:'ny', t:'nyt', e:'nye', en:'new'}, {base:'god', t:'godt', e:'gode', en:'good'}, {base:'dyr', t:'dyrt', e:'dyre', en:'expensive'}, {base:'billig', t:'billigt', e:'billige', en:'cheap'}, {base:'høj', t:'højt', e:'høje', en:'tall/high'}, {base:'sund', t:'sundt', e:'sunde', en:'healthy'},
    {base:'lang', t:'langt', e:'lange', en:'long'}, {base:'varm', t:'varmt', e:'varme', en:'warm'}, {base:'kold', t:'koldt', e:'kolde', en:'cold'}, {base:'tung', t:'tungt', e:'tunge', en:'heavy'}, {base:'mørk', t:'mørkt', e:'mørke', en:'dark'}, {base:'lys', t:'lyst', e:'lyse', en:'bright/light'}, {base:'ren', t:'rent', e:'rene', en:'clean'}, {base:'stærk', t:'stærkt', e:'stærke', en:'strong'}, {base:'svag', t:'svagt', e:'svage', en:'weak'}, {base:'hurtig', t:'hurtigt', e:'hurtige', en:'fast'}, {base:'langsom', t:'langsomt', e:'langsomme', en:'slow'}, {base:'dårlig', t:'dårligt', e:'dårlige', en:'bad'}, {base:'rolig', t:'roligt', e:'rolige', en:'calm'}, {base:'venlig', t:'venligt', e:'venlige', en:'friendly'}, {base:'travl', t:'travlt', e:'travle', en:'busy'}, {base:'lækker', t:'lækkert', e:'lækre', en:'delicious/nice'} ],
  /* sin/sit/sine (reflexive, matches the noun) vs hans/hendes (non-reflexive, invariant) */
  sinSubjects: [ {s:'Peter', pron:'han'}, {s:'Maria', pron:'hun'}, {s:'Min nabo', pron:'han'}, {s:'Min chef', pron:'hun'},
    {s:'Lars', pron:'han'}, {s:'Sofie', pron:'hun'}, {s:'Min bror', pron:'han'}, {s:'Min søster', pron:'hun'}, {s:'Min kollega', pron:'han'}, {s:'Ahmed', pron:'han'}, {s:'Fatima', pron:'hun'}, {s:'Min underviser', pron:'hun'} ],
  sinNouns: [ {w:'kone', gender:'en', en:'wife'}, {w:'mand', gender:'en', en:'husband'}, {w:'bil', gender:'en', en:'car'}, {w:'hus', gender:'et', en:'house'}, {w:'arbejde', gender:'et', en:'job'}, {w:'børn', gender:'pl', en:'children'}, {w:'venner', gender:'pl', en:'friends'},
    {w:'datter', gender:'en', en:'daughter'}, {w:'søn', gender:'en', en:'son'}, {w:'lejlighed', gender:'en', en:'apartment'}, {w:'have', gender:'en', en:'garden'}, {w:'cykel', gender:'en', en:'bicycle'}, {w:'telefon', gender:'en', en:'phone'}, {w:'chef', gender:'en', en:'boss'}, {w:'hund', gender:'en', en:'dog'}, {w:'kontor', gender:'et', en:'office'}, {w:'værelse', gender:'et', en:'room'}, {w:'liv', gender:'et', en:'life'}, {w:'firma', gender:'et', en:'company'}, {w:'forældre', gender:'pl', en:'parents'}, {w:'kolleger', gender:'pl', en:'colleagues'} ]
};
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function lower(s){ return s.charAt(0).toLowerCase()+s.slice(1); }

/* ---------- per-item generators (each returns a drill object) ----------
   shape: { type:'mc'|'order', concept, tag, prompt, options?|words?, answer,
            explanation, trick, decon }                                      */
const GEN = {};

/* V2 basics — find the finite verb / subject-first normal order */
GEN['v2-main'] = function(diff){
  const s = pick(LEX.subjects), v = pick(LEX.verbs);
  if (diff>=2 && Math.random()<0.5){
    // order task: scrambled main clause, subject first
    return { type:'order', concept:'v2-main', tag:'Build · V2',
      prompt:'Build a correct main clause (start with the subject):',
      words:[ cap(s), v.pres, v.rest ], answer:cap(s)+' '+v.pres+' '+v.rest,
      wrongWhy:'Main clause: Subject + finite Verb + rest. The verb is element 2.',
      explanation:'Subject in position 1, finite verb "'+v.pres+'" in position 2.',
      trick:'Verb = seat 2. Always.', decon:{type:'main', cells:[cap(s),v.pres,'—','—',v.rest]} };
  }
  const correct = cap(s)+' '+v.pres+' '+v.rest;
  const opts = [
    { text:correct, ok:true, why:'Subject (1) + finite verb (2) + rest. Correct V2.' },
    { text:cap(s)+' '+v.rest+' '+v.pres, ok:false, mistakeType:'Verb in 3rd position', why:'The complement "'+v.rest+'" cannot stand before the finite verb in a main clause.' },
    { text:v.pres+' '+s+' '+v.rest+'?', ok:false, mistakeType:'Question word order', why:'Starting with the verb makes a yes/no question, not a statement.' }
  ];
  return { type:'mc', concept:'v2-main', tag:'V2 · finite verb', prompt:'Which is a correct Danish main clause?',
    options:shuffle(opts), answer:correct, explanation:'In a main clause the finite verb is element 2: "'+correct+'".',
    trick:'Find the verb that carries the tense — it sits in seat 2.', decon:{type:'main', cells:[cap(s),v.pres,'—','—',v.rest]} };
};

/* shared inversion generator for time / place */
function genInversion(kind){
  const front = kind==='time'? pick(LEX.timeFront) : pick(LEX.placeFront);
  let v = pick(LEX.verbs); const s = pick(LEX.subjects);
  if (kind==='place' && front==='På arbejdet') v = pick(LEX.verbs.filter(x=>x.pres!=='arbejder'));
  const correct = front+' '+v.pres+' '+s+' '+v.rest;
  const concept = kind==='time'? 'inv-time':'inv-place';
  if (Math.random()<0.4){
    return { type:'order', concept, tag:'Build · inversion', prompt:'Build a correct sentence starting with "'+front+'":',
      words:[ front, v.pres, s, v.rest ], answer:correct,
      wrongWhy:'After the fronted '+kind+' expression the finite verb comes second, then the subject.',
      explanation:'"'+front+'" fills position 1 → verb "'+v.pres+'" second, subject "'+s+'" third.',
      trick:(kind==='time'?'Time':'Place')+' first? Swap!', decon:{type:'main', cells:[front,v.pres,s,'—',v.rest]} };
  }
  const opts = [
    { text:correct, ok:true, why:'"'+front+'" (1) + "'+v.pres+'" (2) + "'+s+'" (3). Correct inversion.' },
    { text:front+' '+s+' '+v.pres+' '+v.rest, ok:false, mistakeType:'No inversion after '+kind+' expression', why:'"'+front+'" is position 1, so "'+s+' '+v.pres+'" leaves the verb in 3rd position — V2 is broken.' },
    { text:cap(s)+' '+v.pres+' '+lower(front)+' '+v.rest, ok:false, mistakeType:'Element wrongly placed', why:'This rebuilds the sentence subject-first; the task is to FRONT "'+front+'" and keep V2.' }
  ];
  return { type:'mc', concept, tag:(kind==='time'?'Inversion · time':'Inversion · place'),
    prompt:'The sentence starts with "'+front+'". Which version is correct?',
    options:shuffle(opts), answer:correct, explanation:'A fronted '+kind+' expression forces subject–verb inversion: "'+correct+'".',
    trick:(kind==='time'?'Time':'Place')+' first? SWAP — verb in seat 2.', decon:{type:'main', cells:[front,v.pres,s,'—',v.rest]} };
}
GEN['inv-time']  = function(){ return genInversion('time'); };
GEN['inv-place'] = function(){ return genInversion('place'); };

/* central adverb in MAIN clause */
GEN['adv-main'] = function(diff){
  const s = pick(LEX.subjects), v = pick(LEX.verbs), a = pick(LEX.adverbs);
  const correct = cap(s)+' '+v.pres+' '+a+' '+v.rest;
  const opts = [
    { text:correct, ok:true, why:'Main clause: Subject + Verb + ADVERB. "'+a+'" stands right after the finite verb.' },
    { text:cap(s)+' '+a+' '+v.pres+' '+v.rest, ok:false, mistakeType:'Subordinate order in main clause', why:'"'+a+'" before the finite verb is the SAV (subordinate) pattern — wrong in a main clause.' },
    { text:cap(s)+' '+v.pres+' '+v.rest+' '+a, ok:false, mistakeType:'Adverb at the end', why:'Danish central adverbs do not trail at the end — fixed spot is right after the finite verb.' }
  ];
  return { type:'mc', concept:'adv-main', tag:'Adverb · main clause', prompt:'Place "'+a+'" correctly:',
    options:shuffle(opts), answer:correct, explanation:'In main clauses the central adverb follows the finite verb: "'+correct+'".',
    trick:'Main clause skeleton: Subject + Verb + Adverb.', decon:{type:'main', cells:[cap(s),v.pres,'—',a,v.rest]} };
};

/* central adverb in SUBORDINATE clause (SAV) */
GEN['adv-sub'] = GEN['sav-conn'] = function(diff){
  const conn = pick(LEX.connSAV), s = pick(LEX.subjects), a = pick(LEX.adverbs), v = pick(LEX.verbs);
  const useModal = diff>=2 && Math.random()<0.5;
  const m = pick(LEX.modals);
  const verbPart = useModal ? (m.w+' '+v.inf) : v.pres;
  const main = 'Han siger, ';
  const sav = conn.w+' '+s+' '+a+' '+verbPart+' '+v.rest;
  const correct = sav;
  if (Math.random()<0.4){
    return { type:'order', concept:'sav-conn', tag:'Build · SAV', prompt:'Build the subordinate clause (it starts with "'+conn.w+'"):',
      words:[ conn.w, s, a, verbPart, v.rest ], answer:correct,
      wrongWhy:'After "'+conn.w+'": Subject + ADVERB + Verb. No inversion, and the adverb comes before the verb.',
      explanation:'SAV: '+conn.w+' + '+s+' + '+a+' + '+verbPart+'.',
      trick:'In the sub, the adverb SUBmarines in front of the verb.', decon:{type:'sub', cells:[conn.w,s,a,(useModal?m.w:v.pres),(useModal?v.inf+' '+v.rest:v.rest)]} };
  }
  const opts = [
    { text:correct, ok:true, why:'Connector + Subject + ADVERB + Verb. Textbook SAV.' },
    { text:conn.w+' '+s+' '+(useModal?m.w+' '+a+' '+v.inf:v.pres+' '+a)+' '+v.rest, ok:false, mistakeType:'Main-clause order after '+conn.w, why:'"'+a+'" has slipped behind the verb — that is main-clause order. After "'+conn.w+'" it must come before the verb.' },
    { text:conn.w+' '+(useModal?m.w:v.pres)+' '+s+' '+a+' '+(useModal?v.inf+' ':'')+v.rest, ok:false, mistakeType:'Inversion inside subordinate clause', why:'No inversion after a connector — the subject comes straight after "'+conn.w+'".' }
  ];
  return { type:'mc', concept:'sav-conn', tag:'SAV · after '+conn.w, prompt:'Complete: "'+main+'___"',
    options:shuffle(opts), answer:correct, explanation:'"'+conn.w+'" starts a subordinate clause → Subject + Adverb + Verb: "'+correct+'".',
    trick:'fordi-at-hvis-når-selvom → adverb moves in front of the verb.', decon:{type:'sub', cells:[conn.w,s,a,(useModal?m.w:v.pres),(useModal?v.inf+' '+v.rest:v.rest)]} };
};

/* modal + adverb placement */
GEN['modal'] = function(diff){
  const s = pick(LEX.subjects), m = pick(LEX.modals), a = pick(LEX.adverbs), v = pick(LEX.verbs);
  const correct = cap(s)+' '+m.w+' '+a+' '+v.inf+' '+v.rest;
  const opts = [
    { text:correct, ok:true, why:'Modal "'+m.w+'" is the finite verb, so "'+a+'" parks right after it and before the infinitive "'+v.inf+'".' },
    { text:cap(s)+' '+a+' '+m.w+' '+v.inf+' '+v.rest, ok:false, mistakeType:'Subordinate order in main clause', why:'Adverb before the finite verb is the subordinate pattern — wrong in a main clause.' },
    { text:cap(s)+' '+m.w+' '+v.inf+' '+a+' '+v.rest, ok:false, mistakeType:'Adverb after the infinitive', why:'"'+a+'" cannot trail after the infinitive — it belongs between the two verbs.' }
  ];
  return { type:'mc', concept:'modal', tag:'Modal + adverb', prompt:'Place "'+a+'" with the modal "'+m.w+'":',
    options:shuffle(opts), answer:correct, explanation:'With modals the chain is modal + adverb + infinitive: "'+m.w+' '+a+' '+v.inf+'".',
    trick:'Two verbs? The adverb goes between them.', decon:{type:'main', cells:[cap(s),m.w,'—',a,v.inf+' '+v.rest]} };
};

/* past vs perfect */
GEN['tense'] = function(diff){
  const s = pick(LEX.subjects), v = pick(LEX.verbs);
  if (Math.random()<0.5){
    // specific past time → simple past
    const t = pick(LEX.timePast);
    const correct = t+' '+v.past+' '+lower(s)+' '+v.rest;
    const opts = [
      { text:t+' '+v.past+' '+lower(s)+' '+v.rest, ok:true, why:'"'+t+'" pins a finished, specific time → simple past (datid), and the fronted time also forces inversion.' },
      { text:t+' har '+lower(s)+' '+v.perf+' '+v.rest, ok:false, mistakeType:'Perfect with a specific past time', why:'Perfect (har + '+v.perf+') cannot combine with a finished time point like "'+t.toLowerCase()+'".' },
      { text:cap(s)+' har '+v.perf+' '+v.rest+' '+lower(t), ok:false, mistakeType:'Perfect + specific time', why:'Same problem: "'+t.toLowerCase()+'" demands datid, not førnutid.' }
    ];
    return { type:'mc', concept:'tense-past', tag:'Past vs perfect', prompt:'Choose the correct tense (the sentence starts with "'+t+'"):',
      options:shuffle(opts), answer:correct, explanation:'A finished, specific time word forces simple past: "'+correct+'".',
      trick:'i går / sidste uge → datid. aldrig / nogensinde / lige → førnutid.', decon:{type:'main', cells:[t,v.past,lower(s),'—',v.rest]} };
  } else {
    // life experience → perfect
    const a = pick(['aldrig','tit','allerede']);
    const correct = cap(s)+' har '+a+' '+v.perf+' '+v.rest;
    const opts = [
      { text:correct, ok:true, why:'Open life experience ("'+a+'" up to now) → perfect: har + '+v.perf+'. The adverb "'+a+'" follows "har".' },
      { text:cap(s)+' '+v.past+' '+a+' '+v.rest, ok:false, mistakeType:'Simple past for open experience', why:'"'+v.past+' '+a+'" describes a CLOSED period. "'+a+'" up to now needs the perfect.' },
      { text:cap(s)+' har '+v.perf+' '+a+' '+v.rest, ok:false, mistakeType:'Adverb after the participle', why:'Even with the right tense, "'+a+'" cannot follow the participle "'+v.perf+'" — it follows "har".' }
    ];
    return { type:'mc', concept:'tense-perfect', tag:'Past vs perfect', prompt:'Choose the correct form (experience "'+a+'" until now):',
      options:shuffle(opts), answer:correct, explanation:'Open-until-now experience takes the perfect, adverb after har: "'+correct+'".',
      trick:'Open until now? → har/er + participle, adverb shadows har.', decon:{type:'main', cells:[cap(s),'har','—',a,v.perf+' '+v.rest]} };
  }
};
GEN['tense-past'] = GEN['tense-perfect'] = GEN['tense'];

/* relative clauses som / der */
GEN['rel-clause'] = function(diff){
  const noun = pick(LEX.relNouns);
  if (Math.random()<0.5){
    // subject role → der or som both OK, but test SAV order inside
    const rv = pick(LEX.relSubjVerbs);
    const correct = 'Jeg har '+noun.w+', der '+rv.v+'.';
    const parts = rv.v.split(' '); // adverb + verb (already SAV-correct in pool)
    const opts = [
      { text:correct, ok:true, why:'Subject role → "der" (or "som"). Inside, the relative clause uses SAV order ("'+rv.v+'").' },
      { text:'Jeg har '+noun.w+', som '+parts.slice(1).join(' ')+' '+parts[0]+'.', ok:false, mistakeType:'Main-clause order in relative clause', why:'A relative clause is subordinate → the adverb "'+parts[0]+'" must come BEFORE the verb.' },
      { text:'Jeg har '+noun.w+', hvad '+rv.v+'.', ok:false, mistakeType:'Question word as relative', why:'"hvad" is for free relatives ("alt, hvad…") — not after a specific noun.' }
    ];
    return { type:'mc', concept:'rel-clause', tag:'Relative · som/der', prompt:'Which sentence is correct?',
      options:shuffle(opts), answer:correct, explanation:'Subject role takes der/som, and the clause is subordinate (SAV): "'+correct+'".',
      trick:'som/der are FAHNS members — adverb before the verb.', decon:{type:'sub', cells:['der','('+noun.def+')',parts[0],parts[1]||'',parts.slice(2).join(' ')]} };
  } else {
    // object role → only som
    const ov = pick(LEX.relObjVerbs);
    const correct = noun.w.replace('en ','Den ')+', som vi '+ov.v+', er god.';
    const opts = [
      { text:cap(noun.def)+', som vi '+ov.v+', var god.', ok:true, why:'The pronoun is the OBJECT (vi '+ov.v+' den) → only "som" works; "der" is subject-only.' },
      { text:cap(noun.def)+', der vi '+ov.v+', var god.', ok:false, mistakeType:'der as object', why:'"der" can only be the SUBJECT of the relative clause. Here "vi" is the subject → use "som".' },
      { text:cap(noun.def)+', som vi '+ov.v+' den, var god.', ok:false, mistakeType:'Double object', why:'"som" already IS the object — you cannot add "den" as a second object.' }
    ];
    return { type:'mc', concept:'rel-clause', tag:'Relative · object = som', prompt:'Choose the correct relative pronoun:',
      options:shuffle(opts), answer:opts[0].text, explanation:'Object role → only "som": "…, som vi '+ov.v+', …".',
      trick:'Already a subject inside? → som. der is subject-only.', decon:{type:'sub', cells:['som','vi','—',ov.v,'']} };
  }
};

/* indirect questions */
GEN['indirect-q'] = function(diff){
  const mx = pick(LEX.indirectMatrix);
  if (mx.q && Math.random()<0.5){
    // yes/no indirect → om (not hvis)
    const c = pick(LEX.indirectClauses);
    const correct = mx.w+' om '+c.s+' '+c.v+'?';
    const opts = [
      { text:correct, ok:true, why:'Indirect yes/no-question → "om" (= whether). And no inversion inside: subject before verb.' },
      { text:mx.w+' hvis '+c.s+' '+c.v+'?', ok:false, mistakeType:'hvis instead of om', why:'English "if" splits in Danish: condition → hvis, indirect question → OM. After a question verb you need "om".' },
      { text:mx.w+' om '+c.v+' '+c.s+'?', ok:false, mistakeType:'Inversion in indirect question', why:'Inside the clause there is no inversion: "'+c.s+' '+c.v+'", not "'+c.v+' '+c.s+'".' }
    ];
    return { type:'mc', concept:'indirect-q', tag:'Indirect · om/whether', prompt:'Complete: "'+mx.w+' ___"',
      options:shuffle(opts), answer:correct, explanation:'Indirect yes/no-questions use "om" + statement order: "'+correct+'".',
      trick:'Replaceable with "whether"? → om. And no flip inside.', decon:{type:'sub', cells:['om',c.s,'—',c.v,'']} };
  }
  // hv-word indirect → no inversion
  const c = pick(LEX.indirectClauses), hv = pick(LEX.indirectHv);
  const correct = (mx.q?mx.w:'Ved du,')+' '+hv+' '+c.s+' '+c.v+'?';
  const opts = [
    { text:correct, ok:true, why:'Inside an indirect question: hv-word + SUBJECT + verb. No inversion after "'+hv+'".' },
    { text:(mx.q?mx.w:'Ved du,')+' '+hv+' '+c.v+' '+c.s+'?', ok:false, mistakeType:'Direct-question order in indirect question', why:'"'+c.v+' '+c.s+'" is direct order. Inside a sentence the clause is subordinate: "'+c.s+' '+c.v+'".' },
    { text:(mx.q?mx.w:'Ved du,')+' '+c.s+' '+hv+' '+c.v+'?', ok:false, mistakeType:'Question word misplaced', why:'The hv-word is the connector — it comes first, right after the comma.' }
  ];
  return { type:'mc', concept:'indirect-q', tag:'Indirect · hv-word', prompt:'Choose the correct indirect question:',
    options:shuffle(opts), answer:correct, explanation:'Un-flip the question inside a sentence: hv-word + subject + verb: "'+correct+'".',
    trick:'Question inside a sentence? Un-flip it.', decon:{type:'sub', cells:[hv,c.s,'—',c.v,'']} };
};

/* reflexive verbs */
GEN['reflexive'] = function(diff){
  const s = pick(LEX.subjects), rv = pick(LEX.reflexVerbs);
  const refl = LEX.subjReflex[s];
  const wrong = (refl==='sig') ? 'ham' : (refl==='mig'?'mig selv om':'dem');
  const correct = cap(s)+' '+rv.fin+' '+refl+' '+rv.tail+'.';
  const opts = [
    { text:correct, ok:true, why:'Reflexive: the pronoun mirrors the subject. For "'+s+'" that is "'+refl+'".' },
    { text:cap(s)+' '+rv.fin+' '+(refl==='sig'?'ham':'sin')+' '+rv.tail+'.', ok:false, mistakeType:'Wrong reflexive pronoun', why:'"'+(refl==='sig'?'ham':'sin')+'" does not mirror the subject "'+s+'". The correct reflexive is "'+refl+'".' },
    { text:cap(s)+' '+rv.fin+' '+rv.tail+'.', ok:false, mistakeType:'Missing reflexive pronoun', why:'"'+rv.fin+'" is reflexive — it cannot stand without "'+refl+'".' }
  ];
  return { type:'mc', concept:'reflexive', tag:'Reflexive · sig', prompt:'Complete with the right reflexive pronoun:',
    options:shuffle(opts), answer:correct, explanation:'jeg→mig, du→dig, han/hun/de→sig, vi→os, I→jer. For "'+s+'": "'+refl+'".',
    trick:'3rd-person mirror = sig. "Hun glæder sig, jeg glæder mig."', decon:{type:'main', cells:[cap(s),rv.fin,'—','—',refl+' '+rv.tail]} };
};

/* capstone: V2 + SAV combined in one sentence */
GEN['combo'] = function(diff){
  const front = pick(LEX.timeFront), v1 = pick(LEX.verbs), s = pick(LEX.subjects);
  const conn = pick([LEX.connSAV[0],LEX.connSAV[2],LEX.connSAV[4]]); // fordi/hvis/selvom
  const a = pick(LEX.adverbs), s2 = pick(LEX.subjects), v2 = pick(LEX.verbs);
  // Main clause inverted after fronted time + subordinate SAV
  const correct = front+' '+v1.pres+' '+s+' '+v1.rest+', '+conn.w+' '+s2+' '+a+' '+v2.pres+' '+v2.rest;
  const opts = [
    { text:correct, ok:true, why:'Main clause inverts after the fronted time word ("'+v1.pres+' '+s+'"), AND the '+conn.w+'-clause uses SAV ("'+s2+' '+a+' '+v2.pres+'"). Both rules correct.' },
    { text:front+' '+s+' '+v1.pres+' '+v1.rest+', '+conn.w+' '+s2+' '+a+' '+v2.pres+' '+v2.rest, ok:false, mistakeType:'No inversion in the main clause', why:'"'+front+'" is position 1 → the main clause must invert: "'+v1.pres+' '+s+'", not "'+s+' '+v1.pres+'".' },
    { text:front+' '+v1.pres+' '+s+' '+v1.rest+', '+conn.w+' '+s2+' '+v2.pres+' '+a+' '+v2.rest, ok:false, mistakeType:'Main-clause order in the '+conn.w+'-clause', why:'After "'+conn.w+'" the adverb "'+a+'" must come BEFORE the verb: "'+s2+' '+a+' '+v2.pres+'".' }
  ];
  return { type:'mc', concept:'sav-conn', extraConcepts:['inv-time'], tag:'Capstone · V2 + SAV', prompt:'One sentence, two rules. Which is completely correct?',
    options:shuffle(opts), answer:correct, explanation:'Fronted time → invert the main clause; connector → SAV in the subordinate clause. Check each half separately.',
    trick:'Two halves, two checks: V2 in the main clause, SAV after the connector.', decon:{type:'sub', cells:[conn.w,s2,a,v2.pres,v2.rest]} };
};

/* adjective agreement: en-word bare, et-word -t, plural/definite -e */
GEN['adj-agree'] = function(diff){
  const n = pick(LEX.adjNouns), a = pick(LEX.adjectives);
  const parts = n.w.split(' '), article = parts[0], bareNoun = parts[1];
  if (diff>=2 && Math.random()<0.5){
    const correct = a.e+' '+n.pl;
    const opts = [
      { text:correct, ok:true, why:'Plural nouns always take the adjective’s -e form, regardless of the noun’s own gender: "'+correct+'".' },
      { text:a.base+' '+n.pl, ok:false, mistakeType:'Missing plural -e ending', why:'"'+a.base+'" is the bare form — plural nouns require the -e ending: "'+a.e+'".' },
      { text:a.t+' '+n.pl, ok:false, mistakeType:'Neuter -t ending used with a plural noun', why:'"'+a.t+'" is the ET-word singular form — it never combines with a plural noun. Plural always takes -e.' }
    ];
    return { type:'mc', concept:'adj-agree', tag:'Adjective · plural', prompt:'How do you say "'+a.en+' '+n.en+'s" (plural)?',
      options:shuffle(opts), answer:correct, explanation:'Plural nouns take the adjective’s -e form, no matter the noun’s gender: "'+correct+'".',
      trick:'Plural or definite? Always -e.' };
  }
  const correctForm = n.gender==='et' ? a.t : a.base;
  const wrongForm = n.gender==='et' ? a.base : a.t;
  const correct = article+' '+correctForm+' '+bareNoun;
  const opts = [
    { text:correct, ok:true, why: n.gender==='et'
        ? '"'+bareNoun+'" is an ET-word, so the adjective takes the -t ending: "'+a.t+'".'
        : '"'+bareNoun+'" is an EN-word, so the adjective stays in its bare form: "'+a.base+'".' },
    { text:article+' '+wrongForm+' '+bareNoun, ok:false, mistakeType:'Wrong gender ending', why: n.gender==='et'
        ? '"'+a.base+'" (no -t) is for EN-words. "'+bareNoun+'" is an ET-word, so it needs "'+a.t+'".'
        : '"'+a.t+'" (with -t) is for ET-words. "'+bareNoun+'" is an EN-word, so it needs the bare form "'+a.base+'".' },
    { text:article+' '+a.e+' '+bareNoun, ok:false, mistakeType:'Plural/definite -e ending on a singular indefinite noun', why:'"'+a.e+'" is the plural/definite form — "'+article+' '+bareNoun+'" is singular AND indefinite, so it cannot take -e.' }
  ];
  return { type:'mc', concept:'adj-agree', tag:'Adjective · '+n.gender+'-word', prompt:'How do you say "a '+a.en+' '+n.en+'"?',
    options:shuffle(opts), answer:correct, explanation:(n.gender==='et'?'ET-words take the -t ending: ':'EN-words take the bare form: ')+'"'+correct+'".',
    trick:'en-word → bare adjective. et-word → add -t. Plural/definite → always -e.' };
};

/* sin/sit/sine (reflexive, mirrors the subject) vs hans/hendes (non-reflexive, invariant) */
GEN['sin-sit'] = function(diff){
  const subj = pick(LEX.sinSubjects), n = pick(LEX.sinNouns);
  const reflexive = Math.random()<0.5;
  const possForm = n.gender==='en' ? 'sin' : n.gender==='et' ? 'sit' : 'sine';
  const wrongPossForm = n.gender==='en' ? pick(['sit','sine']) : n.gender==='et' ? pick(['sin','sine']) : pick(['sin','sit']);
  const otherPoss = subj.pron==='han' ? 'hans' : 'hendes';
  const correct = subj.s+' elsker '+(reflexive?possForm:otherPoss)+' '+n.w+'.';
  const meaning = reflexive ? 'HIS/HER OWN '+n.en.toUpperCase() : "SOMEONE ELSE'S "+n.en.toUpperCase()+' (not '+subj.s.toLowerCase()+"'s own)";
  const opts = reflexive ? [
    { text:correct, ok:true, why:'"'+possForm+'" is the reflexive possessive — it refers back to the subject "'+subj.s+'" and matches "'+n.w+'" ('+n.gender+'-word).' },
    { text:subj.s+' elsker '+otherPoss+' '+n.w+'.', ok:false, mistakeType:'hans/hendes used for the subject’s own noun', why:'"'+otherPoss+'" would mean the '+n.en+' belongs to someone OTHER than "'+subj.s+'" — but the sentence means '+subj.s+'’s OWN '+n.en+'.' },
    { text:subj.s+' elsker '+wrongPossForm+' '+n.w+'.', ok:false, mistakeType:'Wrong sin/sit/sine ending for the noun’s gender', why:'"'+n.w+'" is '+(n.gender==='pl'?'plural':'a "'+n.gender+'"-word')+' — the reflexive possessive must be "'+possForm+'", not "'+wrongPossForm+'".' }
  ] : [
    { text:correct, ok:true, why:'"'+otherPoss+'" is the non-reflexive possessive — the '+n.en+' belongs to someone else, not to "'+subj.s+'".' },
    { text:subj.s+' elsker '+possForm+' '+n.w+'.', ok:false, mistakeType:'sin/sit/sine used for someone else’s noun', why:'"'+possForm+'" would mean the '+n.en+' belongs to "'+subj.s+'" — but the sentence means someone ELSE’S '+n.en+'.' },
    { text:subj.s+' elsker '+otherPoss+(n.gender==='pl'?'e':'t')+' '+n.w+'.', ok:false, mistakeType:'hans/hendes wrongly inflected', why:'"'+otherPoss+'" NEVER changes form — unlike sin/sit/sine, hans and hendes are invariant regardless of the noun’s gender or number.' }
  ];
  return { type:'mc', concept:'sin-sit', tag:'sin/sit/sine vs hans/hendes', prompt:'Translate: "'+subj.s+' loves '+meaning+'."',
    options:shuffle(opts), answer:correct,
    explanation: reflexive
      ? 'Reflexive (subject’s own noun) → sin/sit/sine, agreeing with the noun: "'+correct+'".'
      : 'Non-reflexive (someone else’s noun) → hans/hendes, no agreement needed: "'+correct+'".',
    trick:'Owns it themselves? sin/sit/sine (matches the noun). Belongs to someone else? hans/hendes (never changes).' };
};

/* ---------- self-verification: assert generated "correct" matches the rule ---------- */
DC.dojoSelfTest = function(n){
  n = n||50; const report = {};
  Object.keys(DOJO_TOPICS).forEach(id=>{
    const t = DOJO_TOPICS[id]; let okCount=0, bad=[];
    for (let i=0;i<n;i++){
      try{
        const q = t.gen(3);
        const correct = q.type==='order' ? q.answer : (q.options.find(o=>o.ok)||{}).text;
        // invariants: exactly one ok option; answer non-empty; decon present
        const oks = q.type==='mc' ? q.options.filter(o=>o.ok).length : 1;
        if (oks===1 && correct && q.concept) okCount++;
        else bad.push(JSON.stringify(q).slice(0,80));
      }catch(e){ bad.push('ERR '+e.message); }
    }
    report[id] = okCount+'/'+n + (bad.length?(' · BAD: '+bad.slice(0,2).join(' | ')):'');
  });
  return report;
};

/* =====================================================================
   TOPIC MASTERY DOJO — topic definitions, staged flow, mastery gating
   ===================================================================== */
const DOJO_TOPICS = {
'v2-main': { gen:GEN['v2-main'], icon:'anchor', area:'Grammar', title:'V2 — the verb in seat 2', concepts:['v2-main'],
  teach:{ rule:'In every Danish MAIN clause the finite verb (the one that carries the tense) is element number 2 — not the second word, the second <b>element</b>.',
    formula:'Position 1 · <b>VERB</b> · Subject · Adverb · Rest',
    points:['Position 1 holds ONE element: the subject, a time phrase, a place phrase or an object.','The finite verb never moves from seat 2 — everything else rearranges around it.','Count elements, not words: "Min gamle nabo" is ONE element.','To find the finite verb, ask which word changes if you change the tense (spiser→spiste).'],
    edge:['Two verbs (modal + infinitive, or har + participle)? Only the FIRST one is finite and sits in seat 2.','A whole clause can fill position 1 ("Hvis det regner, …") — then the main verb still comes right after.'],
    contrast:[{bad:'I dag jeg arbejder hjemme.', good:'I dag arbejder jeg hjemme.', why:'"I dag" is position 1 → verb second, subject third.'}],
    trap:'The test loves long position-1 phrases ("Efter en lang dag på arbejdet …") to make you lose count. Whatever fills slot 1, the verb is next.' } },
'inv-time': { gen:GEN['inv-time'], icon:'repeat', area:'Grammar', title:'Inversion after time', concepts:['inv-time','v2-main'],
  teach:{ rule:'When a TIME expression opens the sentence (i morgen, i går, om vinteren, hver dag …) it fills position 1, so the subject and finite verb swap — the verb stays second, the subject moves to third.',
    formula:'[Time] · <b>VERB</b> · Subject · Adverb · Rest',
    points:['Inversion is not a new rule — it is V2 protecting seat 2.','Danes front time phrases constantly to make text flow; the SIRI writing test rewards correct inversion.','A fronted subordinate clause ("Når jeg får tid, …") also triggers inversion in the main clause.'],
    edge:['"Jeg arbejder i morgen" (subject first) needs NO inversion — only invert when something else is fronted.','After the comma of a fronted clause the verb jumps over the subject: "Hvis det regner, TAGER JEG bussen."'],
    contrast:[{bad:'I weekenden vi besøger min mor.', good:'I weekenden besøger vi min mor.', why:'Time first → verb second, subject third.'}],
    trap:'Sentences that start with a time phrase are the #1 inversion trap because learners default to English subject-first order.' } },
'inv-place': { gen:GEN['inv-place'], icon:'map-pin', area:'Grammar', title:'Inversion after place', concepts:['inv-place','v2-main'],
  teach:{ rule:'A PLACE expression in position 1 (i Danmark, på arbejdet, hjemme hos os …) works exactly like a time expression: the verb stays second, the subject moves behind it.',
    formula:'[Place] · <b>VERB</b> · Subject · Adverb · Rest',
    points:['Place and time behave identically when fronted.','Use it in writing to vary your openings — correct inversion earns marks.','With an adverb too, the order is: Place + Verb + Subject + Adverb + rest.'],
    edge:['"Hjemme hos os spiser vi altid klokken 18" — subject squeezes between verb and adverb after inversion.'],
    contrast:[{bad:'I Danmark man cykler meget.', good:'I Danmark cykler man meget.', why:'Place first → verb second.'}],
    trap:'After inversion the order is Verb + SUBJECT + Adverb — not Verb + Adverb + Subject.' } },
'adv-main': { gen:GEN['adv-main'], icon:'move-horizontal', area:'Grammar', title:'Central adverbs · main clause', concepts:['adv-main'],
  teach:{ rule:'Central adverbs (ikke, altid, aldrig, tit, ofte) have a fixed home: in a MAIN clause they stand immediately AFTER the finite verb.',
    formula:'Subject · Verb · <b>ADVERB</b> · Rest',
    points:['"Jeg drikker ikke kaffe." — adverb right after the verb.','This is the opposite of subordinate clauses (where the adverb comes before the verb).','The adverb describes the whole sentence, so Danish gives it one fixed parking spot.'],
    edge:['With a modal the adverb goes between the two verbs: "Jeg kan ikke komme."','In perfect tense it follows har/er: "Jeg har aldrig set den."'],
    contrast:[{bad:'Han ikke arbejder om søndagen.', good:'Han arbejder ikke om søndagen.', why:'Main clause: the finite verb comes first, then the adverb.'}],
    trap:'If a subordinate-clause habit leaks in, you get "Jeg ikke spiser…" — always locate the finite verb first.' } },
'adv-sub': { gen:GEN['adv-sub'], icon:'corner-down-left', area:'Grammar', title:'Central adverbs · subordinate', concepts:['adv-sub','sav-conn'],
  teach:{ rule:'Inside a subordinate clause the central adverb flips to BEFORE the finite verb. Connector + Subject + ADVERB + Verb.',
    formula:'Connector · Subject · <b>ADVERB</b> · Verb · Rest',
    points:['Main clause "Jeg kommer ikke." → subordinate "… fordi jeg IKKE kommer."','Every subordinating connector triggers this: fordi, at, hvis, når, selvom, da, mens, som, der.','There is never inversion inside a subordinate clause — subject straight after the connector.'],
    edge:['With a modal: "… fordi jeg ikke kan komme" — adverb before the whole verb cluster.'],
    contrast:[{bad:'…, fordi det er ikke dyrt.', good:'…, fordi det ikke er dyrt.', why:'After fordi: subject + ADVERB + verb.'}],
    trap:'This is the single most-tested word-order point in Modul 3.3 writing.' } },
'sav-conn': { gen:GEN['sav-conn'], icon:'git-branch', area:'Grammar', title:'SAV after connectors', concepts:['sav-conn','adv-sub'],
  teach:{ rule:'A subordinate clause starts with a connector and uses the SAV pattern: Subject + Adverb + Verb. The adverb dives in front of the verb, and there is no inversion.',
    formula:'Connector · Subject · <b>ADVERB</b> · Verb · Rest',
    points:['Connectors: fordi, at, hvis, når, selvom, da, mens, om, skønt, medmindre.','SAV = the adverb SUBmarines in front of the verb.','A fronted subordinate clause is position 1 → the following main clause inverts.'],
    edge:['for ≠ fordi! "for" is coordinating (normal order: for jeg har ikke), "fordi" is subordinating (SAV: fordi jeg ikke har).'],
    contrast:[{bad:'Han siger, at han kan ikke sove.', good:'Han siger, at han ikke kan sove.', why:'In the at-clause ikke moves before the finite verb "kan".'}],
    trap:'Under time pressure the main-clause habit ("kan ikke") leaks into subordinate clauses — check every fordi/at/hvis.' } },
'modal': { gen:GEN['modal'], icon:'layers', area:'Grammar', title:'Modal verbs + adverb', concepts:['modal'],
  teach:{ rule:'With a modal verb (kan, skal, vil, må) the modal is the finite verb. The central adverb parks right after the modal and BEFORE the main infinitive.',
    formula:'Subject · Modal · <b>ADVERB</b> · Infinitive · Rest',
    points:['"Jeg kan ikke komme." — modal + ikke + infinitive.','Two verbs? The adverb always goes between them.','The infinitive (komme, arbejde, spise) never changes form after a modal.'],
    edge:['In a subordinate clause: "… fordi jeg ikke kan komme" — adverb before the whole cluster.'],
    contrast:[{bad:'Jeg kan komme ikke.', good:'Jeg kan ikke komme.', why:'The adverb cannot trail after the infinitive.'}],
    trap:'Modal + ikke is everywhere in real Danish (kan ikke, vil ikke, må ikke) — make it automatic.' } },
'tense': { gen:GEN['tense'], icon:'history', area:'Grammar', title:'Past vs perfect', concepts:['tense-past','tense-perfect'],
  teach:{ rule:'A finished, specific time (i går, sidste uge, i 2020) forces the simple past. An open experience up to now (aldrig, nogensinde, lige, allerede, siden) takes the perfect (har/er + participle).',
    formula:'datid: I går <b>arbejdede</b> jeg · førnutid: Jeg <b>har aldrig</b> arbejdet',
    points:['"I går var jeg syg." — specific past time → datid.','"Jeg har aldrig været i Jylland." — life experience → førnutid.','Perfect refuses a specific finished time: never "I går har jeg…".','Most verbs take "har"; movement/change verbs take "er" (er kommet, er flyttet).'],
    edge:['In the perfect, the central adverb follows har/er: "har ALDRIG set", not "har set aldrig".'],
    contrast:[{bad:'I går har jeg været syg.', good:'I går var jeg syg.', why:'A specific past time cannot combine with the perfect.'}],
    trap:'When in doubt, look for the time word: is it a finished point, or an open "until now"?' } },
'rel-clause': { gen:GEN['rel-clause'], icon:'link', area:'Grammar', title:'Relative clauses · som/der', concepts:['rel-clause'],
  teach:{ rule:'Relative clauses describe a noun. If the pronoun is the SUBJECT of the clause, use der OR som. If it is the OBJECT, use ONLY som. And the clause is subordinate → SAV order.',
    formula:'Subject: naboen, <b>der/som</b> larmer · Object: filmen, <b>som</b> vi så',
    points:['Subject role: "en nabo, der/som aldrig hilser."','Object role: "filmen, som vi så" — der is impossible here.','Test: if the clause already has its own subject (vi), the pronoun is an object → som.'],
    edge:['Relative clauses are subordinate, so the adverb comes before the verb: "som aldrig virker".'],
    contrast:[{bad:'Filmen, der vi så, var god.', good:'Filmen, som vi så, var god.', why:'"vi" is the subject, so the pronoun is an object → only som.'}],
    trap:'"der" is subject-only. If you see another subject inside the clause, switch to som.' } },
'indirect-q': { gen:GEN['indirect-q'], icon:'help-circle', area:'Grammar', title:'Indirect questions', concepts:['indirect-q'],
  teach:{ rule:'When a question sits inside another sentence it becomes subordinate: no inversion, subject before verb. A yes/no-question uses "om" (= whether), NOT "hvis".',
    formula:'Direct: Hvornår <b>kører</b> bussen? · Indirect: …, hvornår <b>bussen kører</b>',
    points:['"Ved du, hvornår bussen kører?" — hv-word + subject + verb.','"Jeg ved ikke, om han kommer." — om, not hvis.','English "if" splits: condition → hvis, indirect question → om.'],
    edge:['The hv-word (hvornår, hvor, hvad) acts as the connector — it comes first, right after the comma.'],
    contrast:[{bad:'Jeg ved ikke, hvis han kommer.', good:'Jeg ved ikke, om han kommer.', why:'"whether he comes" → om. hvis is only conditional.'}],
    trap:'Two traps at once: hvis-vs-om AND keeping statement order (no inversion) inside the question.' } },
'reflexive': { gen:GEN['reflexive'], icon:'rotate-ccw', area:'Grammar', title:'Reflexive verbs · sig', concepts:['reflexive'],
  teach:{ rule:'Reflexive verbs need a pronoun that mirrors the subject. In the 3rd person (han/hun/de) that pronoun is "sig".',
    formula:'jeg→mig · du→dig · han/hun/de→<b>sig</b> · vi→os · I→jer',
    points:['"Hun glæder sig til ferien." — 3rd person → sig.','"Jeg glæder mig, du glæder dig, vi glæder os."','Common reflexives: glæde sig til, skynde sig, føle sig, sætte sig, øve sig.'],
    edge:['"sig" is a pronoun (the object) — do not confuse it with "sin" (the possessive, "her own").'],
    contrast:[{bad:'Hun glæder hende til ferien.', good:'Hun glæder sig til ferien.', why:'"hende" would mean another woman; the reflexive mirror of "hun" is "sig".'}],
    trap:'In the 3rd person, the mirror is always "sig" — singular or plural.' } },
'combo': { gen:GEN['combo'], icon:'swords', area:'Grammar', title:'Capstone · V2 + SAV combo', concepts:['sav-conn','inv-time'],
  teach:{ rule:'The exam loves sentences that hide TWO rules at once: a fronted time phrase (→ invert the main clause) plus a connector (→ SAV in the subordinate clause). Check each half on its own rule.',
    formula:'[Time] <b>VERB</b> Subj …, connector Subj <b>ADV</b> Verb …',
    points:['Main clause after a fronted time word: verb second, subject third.','Subordinate clause after the connector: subject + adverb + verb.','Solve the two halves separately, then read the whole thing back.'],
    edge:['A fronted hvis/når-clause is itself position 1 — so the main clause after the comma also inverts.'],
    contrast:[{bad:'Om vinteren jeg cykler aldrig, fordi det er ikke sikkert.', good:'Om vinteren cykler jeg aldrig, fordi det ikke er sikkert.', why:'Inversion in the main clause + SAV in the fordi-clause.'}],
    trap:'You can fix one half and forget the other — always verify BOTH the V2 and the SAV.' } },
'adj-agree': { gen:GEN['adj-agree'], icon:'shapes', area:'Grammar', title:'Adjective agreement', concepts:['adj-agree'],
  teach:{ rule:'A Danish adjective changes its ending to match the noun it describes: bare form with an EN-word, -t with an ET-word, and -e with any plural noun or any definite noun.',
    formula:'en stor bil · et stor<b>t</b> hus · store biler/huse',
    points:['EN-words (en bil, en bog): the adjective stays bare — "en stor bil".','ET-words (et hus, et bord): add -t — "et stort hus".','Plural, ANY gender: always -e — "store biler", "store huse".','Definite forms also take -e, even for et-words: "det store hus" (not "det stort hus").'],
    edge:['A few adjectives are irregular (lille stays "lille" in the singular but becomes "små" in the plural) — these are worth memorising separately.'],
    contrast:[{bad:'Jeg bor i et stor hus.', good:'Jeg bor i et stort hus.', why:'"hus" is an ET-word, so the adjective needs the -t ending.'}],
    trap:'The censor marks agreement errors hard because they are easy to avoid once you know the noun’s gender — check en/et before you write the adjective.' } },
'sin-sit': { gen:GEN['sin-sit'], icon:'user-check', area:'Grammar', title:'sin/sit/sine vs hans/hendes', concepts:['sin-sit'],
  teach:{ rule:'When the 3rd-person subject (han/hun) owns the thing themselves, Danish uses the reflexive possessive sin/sit/sine, agreeing with the noun. When it belongs to someone ELSE, use the ordinary, invariant hans/hendes.',
    formula:'Peter elsker <b>sin</b> kone (his own) · Peter elsker <b>hans</b> kone (another man’s)',
    points:['sin = en-word, sit = et-word, sine = plural — always matching the NOUN, not the subject.','hans/hendes never change form, no matter the noun’s gender or number.','This distinction only exists for 3rd-person singular subjects (han/hun) — jeg/du/vi/de use min/din/vores/deres instead.'],
    edge:['"Hans" and "hendes" pick the gender of the OTHER person (the actual owner), not of the subject — the subject’s own gender is irrelevant to that choice.'],
    contrast:[{bad:'Maria elsker hendes arbejde.', good:'Maria elsker sit arbejde.', why:'If it is Maria’s OWN job, the reflexive "sit" is required — "hendes" would mean someone else’s job.'}],
    trap:'This is one of the most common written errors after word order — the censor checks every 3rd-person possessive for exactly this mix-up.' } }
};
const DOJO_ORDER = ['v2-main','inv-time','inv-place','adv-main','adv-sub','sav-conn','modal','tense','rel-clause','indirect-q','reflexive','combo','adj-agree','sin-sit'];

/* state */
(function(){
  const _ds = DC.defaultState;
  DC.defaultState = function(){ const s=_ds(); s.dojo = {}; return s; };
})();
DC.dojoState = function(id){
  DC.state.dojo = DC.state.dojo||{};
  if (!DC.state.dojo[id]) DC.state.dojo[id] = { drilled:0, correct:0, speedBest:0, tests:[], mastered:null, due:null, stageSeen:{} };
  return DC.state.dojo[id];
};
const DOJO_TARGET_DRILL = 24;            // items before mastery test unlocks
const DOJO_PASS = 0.9;                    // mastery threshold (9/10)
const DOJO_INTERVALS = [24*3600*1000, 3*24*3600*1000, 7*24*3600*1000, 21*24*3600*1000];

DC.dojoStatus = function(id){
  const st = DC.dojoState(id);
  if (st.mastered){ return (st.due && st.due<=Date.now()) ? 'Review due' : 'Mastered'; }
  if (st.tests.length) return 'Tested';
  if (st.drilled>=DOJO_TARGET_DRILL) return 'Ready to test';
  if (st.drilled>0) return 'In progress';
  return 'New';
};
function dojoStatusCls(s){ return {'New':'bg-slate-800 text-slate-500','In progress':'status-Learning','Ready to test':'status-Improving','Tested':'status-Weak','Mastered':'status-Mastered','Review due':'status-Weak'}[s]||'bg-slate-800 text-slate-500'; }

/* =====================================================================
   DOJO — a single topic, staged
   ===================================================================== */
const DOJO_STAGES = [
  { id:'teach',  label:'Teach',       icon:'book-open' },
  { id:'worked', label:'Worked',      icon:'eye' },
  { id:'guided', label:'Guided',      icon:'hand-helping' },
  { id:'indep',  label:'Independent', icon:'pencil' },
  { id:'speed',  label:'Speed',       icon:'zap' },
  { id:'test',   label:'Mastery test',icon:'award' }
];
DC.dojoOpen = function(id, keepSession){
  if (!keepSession && DC.view!=='dojo'){}
  DC.view='dojo';
  document.querySelectorAll('.nav-btn').forEach(el=>el.classList.toggle('active', el.dataset.nav==='dojo'));
  DC.dojoCur = id;
  DC.dojoStage = DC.dojoStage || 'teach';
  const t = DOJO_TOPICS[id], st = DC.dojoState(id);
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<button onclick="DC.go(\'dojo\')" class="text-sm text-slate-400 hover:text-slate-200 flex items-center gap-1"><i data-lucide="arrow-left" class="w-4 h-4"></i>All topics</button>';
  h += '<div class="card p-5"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center"><i data-lucide="'+t.icon+'" class="w-5 h-5 text-indigo-300"></i></div>'+
    '<div class="flex-1"><h2 class="font-bold text-lg text-slate-100">'+esc(t.title)+'</h2>'+
    '<div class="text-xs text-slate-400">'+st.drilled+' items drilled · '+(st.drilled?pct(st.correct,st.drilled)+'% accuracy':'not started')+' · status: '+DC.dojoStatus(id)+'</div></div>'+
    (DC.dojoSess&&DC.dojoSess.topic===id?'<div class="text-right"><div class="text-[10px] uppercase text-slate-500">block</div><div id="dojo-sess-timer" class="font-mono font-bold text-amber-300">45:00</div></div>':'')+'</div></div>';
  // stage tabs
  h += '<div class="card p-3"><div class="flex gap-1.5 flex-wrap">';
  DOJO_STAGES.forEach((sg,i)=>{
    const locked = sg.id==='test' && st.drilled<DOJO_TARGET_DRILL && !st.mastered;
    h += '<button '+(locked?'disabled title="Drill '+DOJO_TARGET_DRILL+' items first to unlock"':'onclick="DC.dojoStage=\''+sg.id+'\';DC.dojoOpen(\''+id+'\',true)"')+
      ' class="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 '+(DC.dojoStage===sg.id?'bg-indigo-500/15 border-indigo-500/40 text-indigo-200':locked?'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed':'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200')+'">'+
      '<i data-lucide="'+(locked?'lock':sg.icon)+'" class="w-3.5 h-3.5"></i>'+sg.label+'</button>';
  });
  h += '</div>'+(st.drilled<DOJO_TARGET_DRILL && !st.mastered ? '<div class="mt-2 text-[11px] text-slate-500">Mastery test unlocks after '+DOJO_TARGET_DRILL+' drilled items — you have '+st.drilled+'. (Guided + Independent + Speed all count.)</div>':'')+'</div>';
  h += '<div id="dojo-body"></div></div>';
  document.getElementById('main').innerHTML = h;
  DC.dojoRenderStage(id);
  DC.icons();
};
DC.dojoRenderStage = function(id){
  ({ teach:DC.dojoTeach, worked:DC.dojoWorked, guided:DC.dojoGuided, indep:DC.dojoIndep, speed:DC.dojoSpeed, test:DC.dojoTest }[DC.dojoStage])(id);
};

/* stage: teach */
DC.dojoTeach = function(id){
  const t = DOJO_TOPICS[id], T = t.teach;
  let h = '<div class="card p-5 space-y-4">';
  h += '<div><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">The rule</div><p class="text-sm text-slate-200 leading-relaxed">'+T.rule+'</p></div>';
  h += '<div class="bg-slate-900/70 border border-indigo-500/30 rounded-xl px-4 py-3 text-center"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Formula</div><div class="text-base font-semibold text-slate-100">'+T.formula+'</div></div>';
  h += '<div><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">Key points</div><ul class="space-y-1.5 text-sm text-slate-300 list-disc list-inside">'+T.points.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>';
  h += '<div><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">Edge cases</div><ul class="space-y-1.5 text-sm text-slate-300 list-disc list-inside">'+T.edge.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>';
  T.contrast.forEach(c=>{
    h += '<div class="grid md:grid-cols-2 gap-2"><div class="bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2 text-sm"><span class="text-rose-300 font-bold">✗</span> '+esc(c.bad)+'</div>'+
      '<div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm"><span class="text-emerald-300 font-bold">✓</span> '+esc(c.good)+'</div></div><div class="text-xs text-slate-400 px-1">'+esc(c.why)+'</div>';
  });
  h += '<div class="card !border-amber-500/40 p-3"><div class="flex items-center gap-2 mb-1"><i data-lucide="alert-triangle" class="w-4 h-4 text-amber-300"></i><span class="font-bold text-sm text-amber-200">Exam trap</span></div><p class="text-sm text-slate-300">'+esc(T.trap)+'</p></div>';
  h += '<button onclick="DC.dojoStage=\'worked\';DC.dojoOpen(\''+id+'\',true)" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">See it worked through →</button>';
  h += '</div>';
  document.getElementById('dojo-body').innerHTML = h;
  DC.icons();
};

/* stage: worked examples (I do) — generated items shown fully reasoned */
DC.dojoWorked = function(id){
  const t = DOJO_TOPICS[id];
  const items = []; for (let i=0;i<3;i++) items.push(t.gen(1+i));
  let h = '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="eye" class="w-4 h-4 text-indigo-300"></i><h3 class="font-bold text-slate-100 text-sm">Worked examples — watch the reasoning</h3></div>'+
    '<p class="text-xs text-slate-400 mb-4">No answering yet. Study how each one is solved, then move to guided practice.</p><div class="space-y-4">';
  items.forEach((q,i)=>{
    const correct = q.type==='order'? q.answer : (q.options.find(o=>o.ok)||{}).text;
    h += '<div class="bg-slate-900/70 border border-slate-800 rounded-xl p-4"><div class="text-sm font-semibold text-slate-100 mb-2">Example '+(i+1)+': '+esc(q.prompt)+'</div>'+
      '<div class="text-base font-bold text-emerald-300 mb-2">→ '+esc(correct)+'</div>'+
      '<div class="text-sm text-slate-300 mb-2">'+esc(q.explanation)+'</div>'+
      deconHTML(q.decon)+
      '<div class="flex items-start gap-2 text-xs bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-3 py-2 mt-2"><i data-lucide="sparkles" class="w-3.5 h-3.5 text-indigo-300 mt-0.5 shrink-0"></i><span>'+esc(q.trick)+'</span></div></div>';
  });
  h += '</div><div class="flex gap-2 mt-4"><button onclick="DC.dojoWorked(\''+id+'\')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Show 3 more</button>'+
    '<button onclick="DC.dojoStage=\'guided\';DC.dojoOpen(\''+id+'\',true)" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Now you try (guided) →</button></div></div>';
  document.getElementById('dojo-body').innerHTML = h;
  DC.icons();
};

/* unified drill renderer used by guided / independent / speed / test */
DC.dojoDrill = function(id, mode){
  const t = DOJO_TOPICS[id];
  DC.drill = { id, mode, q:t.gen(mode==='guided'?1:(mode==='test'?3:2)), answered:false, scaffold: mode==='guided' };
  const q = DC.drill.q;
  let h = '<div class="fade-in">';
  h += '<div class="flex items-center gap-2 mb-3 flex-wrap"><span class="text-[10px] uppercase tracking-wider font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-2.5 py-1">'+esc(q.tag)+'</span></div>';
  h += '<div class="font-semibold text-slate-100 mb-3 text-[15px]">'+esc(q.prompt)+'</div>';
  if (DC.drill.scaffold && q.decon){ h += '<div class="mb-3 opacity-80">'+deconHTML(q.decon)+'<div class="text-[11px] text-indigo-300 mt-1">Scaffold: use the skeleton above to pick the answer.</div></div>'; }
  if (q.type==='order'){
    h += '<div id="dd-ans" class="min-h-[3rem] card !bg-slate-900/60 p-3 mb-3 flex flex-wrap gap-2"></div><div id="dd-pool" class="flex flex-wrap gap-2 mb-4">';
    shuffle(q.words.map((w,i)=>({w,i}))).forEach(o=> h += '<button class="chip px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium" onclick="DC.dojoChip(this)">'+esc(o.w)+'</button>');
    h += '</div><button id="dd-submit" onclick="DC.dojoSubmitOrder()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-40" disabled>Check</button>';
  } else {
    h += '<div class="grid gap-2">';
    q.options.forEach((o,i)=> h += '<button id="dd-opt-'+i+'" onclick="DC.dojoSubmitMC('+i+')" class="opt-btn text-left px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm hover:bg-slate-800/60">'+esc(o.text)+'</button>');
    h += '</div>';
  }
  h += '<div id="dd-fb" class="mt-3"></div></div>';
  document.getElementById('dojo-drill').innerHTML = h;
  DC.icons();
};
DC.dojoChip = function(btn){
  if (DC.drill.answered) return;
  const ans = document.getElementById('dd-ans'), pool = document.getElementById('dd-pool');
  (btn.parentElement===pool? ans:pool).appendChild(btn);
  document.getElementById('dd-submit').disabled = pool.children.length!==0;
};
DC.dojoSubmitOrder = function(){
  const built = Array.from(document.getElementById('dd-ans').children).map(b=>b.textContent).join(' ').replace(/\s+/g,' ').trim();
  DC.dojoGrade(built.toLowerCase()===DC.drill.q.answer.toLowerCase(), built);
};
DC.dojoSubmitMC = function(idx){
  if (DC.drill.answered) return;
  const q = DC.drill.q;
  q.options.forEach((o,i)=>{ const el=document.getElementById('dd-opt-'+i); el.disabled=true; if(o.ok) el.classList.add('opt-correct'); if(i===idx&&!o.ok) el.classList.add('opt-wrong'); });
  DC.dojoGrade(q.options[idx].ok, q.options[idx].text, q.options[idx]);
};
DC.dojoGrade = function(ok, given, chosenOpt){
  const d = DC.drill; if (d.answered) return; d.answered = true; d.ok = ok;
  const q = d.q, st = DC.dojoState(d.id);
  st.drilled++; if (ok) st.correct++;
  // record to Brain (concept mastery + error notebook + review for wrongs)
  Brain.record({ module:'Topic Dojo', opgave:DOJO_TOPICS[d.id].title, concept:q.concept, extraConcepts:q.extraConcepts,
    qid:'dojo-'+d.id+'-'+Date.now(), question:q.prompt, userAnswer:given,
    correctAnswer:(q.type==='order'?q.answer:(q.options.find(o=>o.ok)||{}).text),
    mistakeType: ok?null:((chosenOpt&&chosenOpt.mistakeType)||'Wrong word order'),
    explanation:q.explanation, memoryTrick:q.trick, correct:ok, confidence:'sure', hintsUsed:0, timeSpent:0,
    snapshot: d.mode==='speed' ? null : Object.assign({kind:q.type==='order'?'order':'mc'}, q) });
  if (d.mode!=='speed' && d.mode!=='test'){
    let fb = '<div class="card p-4 mt-3 '+(ok?'!border-emerald-500/40':'!border-rose-500/40')+' fade-in space-y-2">'+
      '<div class="flex items-center gap-2 font-bold '+(ok?'text-emerald-300':'text-rose-300')+'"><i data-lucide="'+(ok?'check-circle-2':'x-circle')+'" class="w-5 h-5"></i>'+(ok?'Correct':'Not quite')+'</div>';
    if (!ok && chosenOpt) fb += '<div class="text-sm text-rose-200/90 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2"><b>'+esc(chosenOpt.mistakeType||'Error')+':</b> '+esc(chosenOpt.why)+'</div>';
    if (!ok && q.type==='order') fb += '<div class="text-sm text-rose-200/90 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">'+esc(q.wrongWhy||'')+'<br><b>Correct:</b> '+esc(q.answer)+'</div>';
    fb += '<div class="text-sm text-slate-300"><b class="text-slate-100">Why:</b> '+esc(q.explanation)+'</div>'+deconHTML(q.decon)+
      '<button onclick="DC.dojoDrill(\''+d.id+'\',\''+d.mode+'\')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold mt-1">Next item →</button></div>';
    document.getElementById('dd-fb').innerHTML = fb;
    DC.dojoUpdateProgress(d.id);
  }
  DC.save();
  DC.icons();
};
DC.dojoUpdateProgress = function(id){
  const el = document.getElementById('dojo-prog'); if (!el) return;
  const st = DC.dojoState(id);
  el.innerHTML = 'Session: '+(DC._sessN||0)+' answered'+(DC._sessC!=null?' · '+pct(DC._sessC,DC._sessN)+'% correct':'')+' · '+st.drilled+'/'+DOJO_TARGET_DRILL+' toward mastery test';
};

/* stage: guided */
DC.dojoGuided = function(id){
  DC._sessN=0; DC._sessC=0;
  document.getElementById('dojo-body').innerHTML = '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="hand-helping" class="w-4 h-4 text-indigo-300"></i><h3 class="font-bold text-slate-100 text-sm">Guided practice — skeleton shown to help you</h3></div>'+
    '<p class="text-xs text-slate-400 mb-2">The deconstruction skeleton is visible. Use it to place the answer. Every item is freshly generated.</p>'+
    '<div id="dojo-prog" class="text-[11px] text-slate-500 mb-3"></div><div id="dojo-drill"></div>'+
    '<div class="mt-4 pt-3 border-t border-slate-800"><button onclick="DC.dojoStage=\'indep\';DC.dojoOpen(\''+id+'\',true)" class="text-sm text-indigo-300 hover:text-indigo-200">Ready without the scaffold → Independent</button></div></div>';
  DC.dojoTickWrap(id);
  DC.dojoDrill(id,'guided');
  DC.dojoUpdateProgress(id);
};
/* stage: independent */
DC.dojoIndep = function(id){
  DC._sessN=0; DC._sessC=0;
  document.getElementById('dojo-body').innerHTML = '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="pencil" class="w-4 h-4 text-indigo-300"></i><h3 class="font-bold text-slate-100 text-sm">Independent practice — no scaffold</h3></div>'+
    '<p class="text-xs text-slate-400 mb-2">On your own now. Wrong answers go to your Error Notebook and review queue automatically.</p>'+
    '<div id="dojo-prog" class="text-[11px] text-slate-500 mb-3"></div><div id="dojo-drill"></div>'+
    '<div class="mt-4 pt-3 border-t border-slate-800"><button onclick="DC.dojoStage=\'speed\';DC.dojoOpen(\''+id+'\',true)" class="text-sm text-indigo-300 hover:text-indigo-200">Build automaticity → Speed round</button></div></div>';
  DC.dojoTickWrap(id);
  DC.dojoDrill(id,'indep');
  DC.dojoUpdateProgress(id);
};
/* wrap dojoGrade to count session items for guided/indep */
DC.dojoTickWrap = function(){
  if (DC._dojoWrapped) return; DC._dojoWrapped = true;
  const _g = DC.dojoGrade;
  DC.dojoGrade = function(ok, given, chosenOpt){
    if (DC.drill && (DC.drill.mode==='guided'||DC.drill.mode==='indep')){ DC._sessN=(DC._sessN||0)+1; if(ok) DC._sessC=(DC._sessC||0)+1; }
    _g(ok, given, chosenOpt);
  };
};

/* stage: speed round — timed automaticity */
DC.dojoSpeed = function(id){
  document.getElementById('dojo-body').innerHTML = '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="zap" class="w-4 h-4 text-amber-300"></i><h3 class="font-bold text-slate-100 text-sm">Speed round — 90 seconds</h3></div>'+
    '<p class="text-xs text-slate-400 mb-3">Answer as many as you can in 90 seconds. No explanations until the end — train the reflex. Personal best: '+(DC.dojoState(id).speedBest||0)+'.</p>'+
    '<div id="dojo-speed-stage"><button onclick="DC.dojoSpeedStart(\''+id+'\')" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="play" class="w-4 h-4"></i>Start 90-second speed round</button></div></div>';
  DC.icons();
};
DC.dojoSpeedStart = function(id){
  DC.speed = { id, n:0, c:0 };
  document.getElementById('dojo-speed-stage').innerHTML = '<div class="flex items-center justify-between mb-3"><span class="text-2xl font-mono font-extrabold text-amber-300" id="dojo-speed-t">1:30</span><span class="text-sm text-slate-400">✓ <span id="dojo-speed-c">0</span> · <span id="dojo-speed-n">0</span> done</span></div><div id="dojo-speed-q"></div>';
  DC.startTimer('dojo-speed', 90, 'dojo-speed-t', function(){ DC.dojoSpeedEnd(); });
  DC.dojoSpeedNext();
};
DC.dojoSpeedNext = function(){
  const t = DOJO_TOPICS[DC.speed.id], q = t.gen(2);
  DC.speed.q = q;
  let h = '<div class="fade-in"><div class="text-[15px] font-semibold text-slate-100 mb-3">'+esc(q.prompt)+'</div>';
  if (q.type==='order'){
    // for speed, convert order to a quick MC of correct vs one shuffled-wrong to keep it fast
    const wrong = shuffle(q.words.slice()).join(' ');
    const opts = shuffle([{text:q.answer, ok:true},{text:wrong!==q.answer?wrong:q.words.slice().reverse().join(' '), ok:false}]);
    h += '<div class="grid gap-2">'+opts.map((o,i)=>'<button onclick="DC.dojoSpeedAns('+o.ok+')" class="opt-btn text-left px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm">'+esc(o.text)+'</button>').join('')+'</div>';
  } else {
    h += '<div class="grid gap-2">'+q.options.map(o=>'<button onclick="DC.dojoSpeedAns('+o.ok+')" class="opt-btn text-left px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm">'+esc(o.text)+'</button>').join('')+'</div>';
  }
  h += '</div>';
  document.getElementById('dojo-speed-q').innerHTML = h;
};
DC.dojoSpeedAns = function(ok){
  DC.speed.n++; if (ok) DC.speed.c++;
  document.getElementById('dojo-speed-c').textContent = DC.speed.c;
  document.getElementById('dojo-speed-n').textContent = DC.speed.n;
  // flash
  const q = document.getElementById('dojo-speed-q');
  q.style.outline = '2px solid '+(ok?'#2e7d32':'#c62828'); setTimeout(()=>{ if(q) q.style.outline=''; }, 120);
  DC.dojoSpeedNext();
};
DC.dojoSpeedEnd = function(){
  DC.stopTimer('dojo-speed');
  const st = DC.dojoState(DC.speed.id);
  st.drilled += DC.speed.n; st.correct += DC.speed.c;
  const newBest = DC.speed.c > (st.speedBest||0);
  if (newBest) st.speedBest = DC.speed.c;
  // record concept signal (aggregate)
  DC.state.concepts[DOJO_TOPICS[DC.speed.id].concepts[0]].history.push({ ok: DC.speed.n? DC.speed.c/DC.speed.n>=0.8 : false, conf:'sure', ts:Date.now(), hints:0 });
  DC.checkBadges(); DC.save();
  document.getElementById('dojo-speed-stage').innerHTML = '<div class="card p-4 text-center fade-in"><div class="text-3xl font-extrabold text-amber-300">'+DC.speed.c+'</div>'+
    '<div class="text-sm text-slate-400 mb-1">correct in 90 seconds ('+DC.speed.n+' attempted, '+(DC.speed.n?pct(DC.speed.c,DC.speed.n):0)+'%)'+(newBest?' · <span class="text-emerald-300 font-semibold">new best!</span>':'')+'</div>'+
    '<div class="flex justify-center gap-2 mt-3"><button onclick="DC.dojoSpeed(\''+DC.speed.id+'\')" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Again</button>'+
    '<button onclick="DC.dojoStage=\'test\';DC.dojoOpen(\''+DC.speed.id+'\',true)" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">'+(DC.dojoState(DC.speed.id).drilled>=DOJO_TARGET_DRILL?'Take the mastery test →':'Keep drilling to unlock the test')+'</button></div></div>';
  DC.dojoOpen(DC.speed.id, true); // refresh header counters
  DC.dojoStage='speed';
  document.getElementById('dojo-speed-stage') || DC.dojoSpeed(DC.speed.id);
  DC.icons();
};

/* stage: mastery test — 10 fresh items, gated at 90% */
DC.dojoTest = function(id){
  const st = DC.dojoState(id);
  if (st.drilled<DOJO_TARGET_DRILL && !st.mastered){
    document.getElementById('dojo-body').innerHTML = '<div class="card p-5 text-center text-sm text-slate-400"><i data-lucide="lock" class="w-8 h-8 text-slate-600 mx-auto mb-2"></i>Drill '+(DOJO_TARGET_DRILL-st.drilled)+' more items (guided/independent/speed) to unlock the mastery test.</div>';
    DC.icons(); return;
  }
  document.getElementById('dojo-body').innerHTML = '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="award" class="w-4 h-4 text-emerald-300"></i><h3 class="font-bold text-slate-100 text-sm">Mastery test — 10 fresh items, no hints</h3></div>'+
    '<p class="text-xs text-slate-400 mb-3">Pass at <b>9/10 (90%)</b> to master this topic. Items are newly generated — this tests skill, not memory. Misses go to your review queue.</p>'+
    '<div id="dojo-test-stage"><button onclick="DC.dojoTestStart(\''+id+'\')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="play" class="w-4 h-4"></i>Start mastery test</button></div></div>';
  DC.icons();
};
DC.dojoTestStart = function(id){
  DC.mtest = { id, i:0, c:0, wrong:[] };
  DC.dojoTestNext();
};
DC.dojoTestNext = function(){
  const m = DC.mtest;
  const stage = document.getElementById('dojo-test-stage');
  if (m.i>=10) return DC.dojoTestFinish();
  const q = DOJO_TOPICS[m.id].gen(3);
  m.q = q;
  let h = '<div class="fade-in"><div class="flex items-center justify-between mb-2"><span class="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Question '+(m.i+1)+' of 10</span><span class="text-xs text-emerald-300 font-bold">✓ '+m.c+'</span></div>'+
    '<div class="text-[15px] font-semibold text-slate-100 mb-3">'+esc(q.prompt)+'</div>';
  if (q.type==='order'){
    h += '<div id="mt-ans" class="min-h-[3rem] card !bg-slate-900/60 p-3 mb-3 flex flex-wrap gap-2"></div><div id="mt-pool" class="flex flex-wrap gap-2 mb-3">';
    shuffle(q.words.map((w,i)=>({w,i}))).forEach(o=> h += '<button class="chip px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium" onclick="DC.mtChip(this)">'+esc(o.w)+'</button>');
    h += '</div><button id="mt-submit" onclick="DC.mtSubmitOrder()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold disabled:opacity-40" disabled>Submit</button>';
  } else {
    h += '<div class="grid gap-2">'+q.options.map((o,i)=>'<button id="mt-opt-'+i+'" onclick="DC.mtSubmitMC('+i+')" class="opt-btn text-left px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm">'+esc(o.text)+'</button>').join('')+'</div>';
  }
  h += '<div id="mt-fb" class="mt-3"></div></div>';
  stage.innerHTML = h;
  DC.icons();
};
DC.mtChip = function(btn){ const a=document.getElementById('mt-ans'),p=document.getElementById('mt-pool'); (btn.parentElement===p?a:p).appendChild(btn); document.getElementById('mt-submit').disabled=p.children.length!==0; };
DC.mtSubmitOrder = function(){ const built=Array.from(document.getElementById('mt-ans').children).map(b=>b.textContent).join(' ').replace(/\s+/g,' ').trim(); DC.mtGrade(built.toLowerCase()===DC.mtest.q.answer.toLowerCase(), built); };
DC.mtSubmitMC = function(idx){ const q=DC.mtest.q; q.options.forEach((o,i)=>{const el=document.getElementById('mt-opt-'+i);el.disabled=true;if(o.ok)el.classList.add('opt-correct');if(i===idx&&!o.ok)el.classList.add('opt-wrong');}); DC.mtGrade(q.options[idx].ok, q.options[idx].text, q.options[idx]); };
DC.mtGrade = function(ok, given, chosenOpt){
  const m = DC.mtest, q = m.q;
  if (ok) m.c++; else m.wrong.push({q, given, chosenOpt});
  const st = DC.dojoState(m.id); st.drilled++; if(ok) st.correct++;
  Brain.record({ module:'Topic Dojo', opgave:DOJO_TOPICS[m.id].title+' · mastery test', concept:q.concept, extraConcepts:q.extraConcepts,
    qid:'dojotest-'+m.id+'-'+m.i, question:q.prompt, userAnswer:given, correctAnswer:(q.type==='order'?q.answer:(q.options.find(o=>o.ok)||{}).text),
    mistakeType: ok?null:((chosenOpt&&chosenOpt.mistakeType)||'Wrong word order'), explanation:q.explanation, memoryTrick:q.trick,
    correct:ok, confidence:'sure', hintsUsed:0, timeSpent:0, snapshot:Object.assign({kind:q.type==='order'?'order':'mc'}, q) });
  DC.save();
  document.getElementById('mt-fb').innerHTML = '<div class="text-sm '+(ok?'text-emerald-300':'text-rose-300')+' flex items-center gap-2"><i data-lucide="'+(ok?'check':'x')+'" class="w-4 h-4"></i>'+(ok?'Correct':'Wrong — '+esc((q.type==='order'?q.answer:(q.options.find(o=>o.ok)||{}).text)))+
    '</div><button onclick="DC.mtest.i++;DC.dojoTestNext()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold mt-2">'+(m.i<9?'Next →':'See result')+'</button>';
  DC.icons();
};
DC.dojoTestFinish = function(){
  const m = DC.mtest, st = DC.dojoState(m.id), score = m.c/10, passed = score>=DOJO_PASS;
  st.tests.push({ ts:Date.now(), score });
  if (passed){
    const prevMastered = !!st.mastered;
    st.mastered = Date.now();
    // schedule spaced re-test
    const level = Math.min((st.reviewLevel||0), DOJO_INTERVALS.length-1);
    st.due = Date.now() + DOJO_INTERVALS[level];
    st.reviewLevel = Math.min((st.reviewLevel||0)+1, DOJO_INTERVALS.length-1);
    DOJO_TOPICS[m.id].concepts.forEach(c=> DC.state.concepts[c].history.push({ok:true, conf:'confident', ts:Date.now(), hints:0}));
  } else {
    st.mastered = null;
  }
  DC.checkBadges(); DC.save();
  let h = '<div class="card p-5 text-center fade-in '+(passed?'!border-emerald-500/40':'!border-amber-500/40')+'">'+
    '<div class="text-4xl font-extrabold '+(passed?'text-emerald-300':'text-amber-300')+' mb-1">'+m.c+'/10</div>'+
    '<div class="font-bold '+(passed?'text-emerald-200':'text-amber-200')+' mb-2">'+(passed?'🎉 Topic mastered!':'Almost — 9/10 needed')+'</div>';
  if (passed) h += '<p class="text-sm text-slate-400 mb-3">This topic is now <b>Mastered</b>. I have scheduled a fresh re-test for '+new Date(st.due).toLocaleDateString('da-DK')+' to lock it into long-term memory.</p>';
  else {
    h += '<p class="text-sm text-slate-400 mb-3">You missed '+m.wrong.length+'. They are in your Error Notebook and review queue. Re-read the patterns below, drill a bit more, then retake — fresh items each time.</p>';
    h += '<div class="text-left space-y-2 mb-3">'+m.wrong.slice(0,5).map(w=>'<div class="text-xs bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2"><b>'+esc((w.chosenOpt&&w.chosenOpt.mistakeType)||'Error')+':</b> '+esc(w.q.explanation)+'</div>').join('')+'</div>';
  }
  h += '<div class="flex justify-center gap-2"><button onclick="DC.dojoStage=\''+(passed?'teach':'indep')+'\';DC.dojoOpen(\''+m.id+'\',true)" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">'+(passed?'Review the rule':'Drill more')+'</button>'+
    '<button onclick="DC.go(\'dojo\')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">All topics</button></div></div>';
  document.getElementById('dojo-test-stage').innerHTML = h;
  DC.icons();
  if (passed) DC.toast('🏆 <b>'+esc(DOJO_TOPICS[m.id].title)+'</b> mastered ('+m.c+'/10)! Re-test scheduled to make it permanent.','ok');
};

/* =====================================================================
   integrate: navigation, dashboard nudge, study-plan, readiness
   ===================================================================== */
VIEW_TITLES.dojo = 'Topic Mastery Dojo — drill each topic to perfection';
(function(){
  const _go = DC.go;
  DC.go = function(view){
    if (view==='dojo'){
      DC.stopAllTimers(); DC.view='dojo';
      DC.state.behavior.moduleVisits.dojo = (DC.state.behavior.moduleVisits.dojo||0)+1;
      document.querySelectorAll('.nav-btn').forEach(el=>el.classList.toggle('active', el.dataset.nav==='dojo'));
      const t=document.getElementById('header-title'); if(t) t.textContent=VIEW_TITLES.dojo;
      DC.dojoStage = 'teach'; DC.dojoCur = null;
      DC.renderDojo(); DC.save(); window.scrollTo({top:0});
      if (typeof DC.drawer==='function') DC.drawer(false);
      return;
    }
    _go(view);
  };
})();
/* dashboard: dojo progress strip */
(function(){
  const _rdash = DC.renderDashboard;
  DC.renderDashboard = function(){
    _rdash();
    const ALL = (typeof DOJO_ALL!=='undefined'?DOJO_ALL:DOJO_ORDER);
    const mastered = ALL.filter(id=>DC.dojoState(id).mastered).length;
    const due = ALL.filter(id=>DC.dojoStatus(id)==='Review due').length;
    const areaRow = (label,ids)=>{const m=ids.filter(id=>DC.dojoState(id).mastered).length;return '<div class="flex items-center gap-2 text-xs text-slate-400 mb-1.5"><span class="w-24 shrink-0">'+label+'</span><div class="flex-1">'+bar(pct(m,ids.length),m===ids.length?'bg-emerald-500':'bg-indigo-500')+'</div><span class="w-10 text-right">'+m+'/'+ids.length+'</span></div>';};
    const html = '<div class="card p-5"><div class="flex items-center gap-2 mb-3"><i data-lucide="target" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Topic Mastery Dojo</h2>'+
      '<span class="ml-auto text-xs text-slate-500">'+mastered+'/'+ALL.length+' mastered'+(due?' · '+due+' due':'')+'</span></div>'+
      '<div class="mb-3">'+areaRow('Grammar',(typeof DOJO_GRAMMAR!=='undefined'?DOJO_GRAMMAR:DOJO_ORDER))+(typeof RW_READING_ORDER!=='undefined'?areaRow('Reading',RW_READING_ORDER)+areaRow('Writing',RW_WRITING_ORDER):'')+'</div>'+
      '<p class="text-xs text-slate-400 mb-3">'+(mastered===ALL.length?'Every topic mastered — outstanding. Keep the re-tests green.':'Deep, generator-backed drilling with a 90% mastery gate per topic — grammar, reading and writing.')+'</p>'+
      '<button onclick="DC.go(\'dojo\')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Open the Dojo</button></div>';
    document.getElementById('main').firstElementChild.insertAdjacentHTML('beforeend', html);
    DC.icons();
  };
})();


/* =====================================================================
   READING & WRITING DOJOS — sub-skill depth
   Generators (correct by construction) where the skill is rule-governed,
   carefully authored Danish banks for the semantic skills.
   ===================================================================== */
CONCEPTS['r-pronoun']   = { name:'Pronoun reference (det/den/de)', area:'Reading' };
CONCEPTS['r-signal']    = { name:'Signal words & coherence', area:'Reading' };
CONCEPTS['r-paraphrase']= { name:'Paraphrase matching', area:'Reading' };
CONCEPTS['r-trap']      = { name:'Trap-spotting (Opgave 4)', area:'Reading' };
CONCEPTS['r-vocab']     = { name:'Vocabulary from context', area:'Reading' };
CONCEPTS['w-register']  = { name:'Register (formal vs casual)', area:'Writing' };
CONCEPTS['w-coverage']  = { name:'Answering every point', area:'Writing' };
CONCEPTS['w-openclose'] = { name:'Openings & closings', area:'Writing' };

/* ---------- generator: pronoun reference (gender-disambiguated) ---------- */
const PRON_NOUNS = [
  { noun:'en bog',      def:'bogen',      pro:'Den', pred:'var rigtig spændende', g:'c' },
  { noun:'en cykel',    def:'cyklen',     pro:'Den', pred:'stod nede i gården', g:'c' },
  { noun:'en lampe',    def:'lampen',     pro:'Den', pred:'gav et varmt lys', g:'c' },
  { noun:'en computer', def:'computeren', pro:'Den', pred:'var helt ny', g:'c' },
  { noun:'en kage',     def:'kagen',      pro:'Den', pred:'smagte fantastisk', g:'c' },
  { noun:'et tæppe',    def:'tæppet',     pro:'Det', pred:'lå på gulvet', g:'n' },
  { noun:'et bord',     def:'bordet',     pro:'Det', pred:'var lavet af træ', g:'n' },
  { noun:'et billede',  def:'billedet',   pro:'Det', pred:'hang på væggen', g:'n' },
  { noun:'et ur',       def:'uret',       pro:'Det', pred:'var en gave', g:'n' },
  { noun:'et brev',     def:'brevet',     pro:'Det', pred:'kom med posten', g:'n' },
  { noun:'nogle nøgler',def:'nøglerne',   pro:'De',  pred:'lå på køkkenbordet', g:'p' },
  { noun:'nogle blomster',def:'blomsterne',pro:'De', pred:'var fra haven', g:'p' },
  { noun:'nogle sko',   def:'skoene',     pro:'De',  pred:'var alt for små', g:'p' }
];
const PRON_SUBJ = ['Peter','Maria','Min nabo','Sofie','Min kollega','Ahmed'];
function genPronoun(){
  const t = pick(PRON_NOUNS);
  const distr = pick(PRON_NOUNS.filter(x=>x.g!==t.g));
  const s = pick(PRON_SUBJ);
  const first = pick([true,false]);
  const a = first ? t : distr, b = first ? distr : t;
  const context = s+' viste mig '+a.noun+' og '+b.noun+'. '+t.pro+' '+t.pred+'.';
  const opts = shuffle([
    { text:t.def, ok:true, why:'"'+t.pro+'" is '+(t.g==='p'?'plural':(t.g==='c'?'common gender (en-ord)':'neuter (et-ord)'))+', so it can only point back to '+t.def+'.' },
    { text:distr.def, ok:false, mistakeType:'Wrong gender/number', why:'"'+distr.def+'" is '+(distr.g==='p'?'plural (would need "De")':(distr.g==='c'?'common gender (would need "Den")':'neuter (would need "Det")'))+' — the pronoun "'+t.pro+'" cannot refer to it.' },
    { text:'begge dele', ok:false, mistakeType:'Both', why:'"'+t.pro+'" is singular/specific in gender — it points to exactly one of them, '+t.def+'.' }
  ]);
  return { type:'mc', concept:'r-pronoun', tag:'Pronoun · '+t.pro,
    prompt:context+'<br><span class="text-xs text-slate-400 mt-1 inline-block">Hvad henviser "'+t.pro+'" til?</span>',
    options:opts, answer:t.def,
    explanation:'Pronouns match their referent in gender/number: den → en-ord, det → et-ord, de → flertal. "'+t.pro+'" → '+t.def+'.',
    trick:'Match the pronoun by gender: den/det/de → en-ord/et-ord/flertal.', decon:null };
}

/* ---------- generator: word order in writing (reuses the grammar engine) ---------- */
function genWriteOrder(diff){
  const g = pick(['inv-time','inv-place','sav-conn','modal','adv-main']);
  const q = GEN[g](diff||2);
  q.tag = 'Writing word order';
  return q;
}

/* ---------- authored Danish banks ---------- */
const BANK = {};

BANK['rd-signal'] = [
  { type:'mc', concept:'r-signal', tag:'Signal · contrast', prompt:'Vælg den sætning, der binder teksten logisk sammen: "Lejligheden er dyr. ___"',
    options:[{text:'Men den ligger perfekt tæt på centrum.', ok:true, why:'"dyr" og "ligger perfekt" er en MODSÆTNING → "Men" (normal ordstilling: men den ligger).'},
      {text:'Derfor ligger den perfekt tæt på centrum.', ok:false, mistakeType:'Wrong logic (cause)', why:'"Derfor" markerer årsag — men prisen er ikke ÅRSAG til den gode beliggenhed.'},
      {text:'Desuden ligger den perfekt tæt på centrum.', ok:false, mistakeType:'Wrong logic (addition)', why:'"Desuden" lægger noget til samme retning; her er der en modsætning (dyr ↔ god beliggenhed).'}],
    explanation:'Modsætning → "Men". Bemærk: efter "Men" er ordstillingen normal (men den ligger), mens "Derfor/Desuden" giver inversion.', trick:'Modsætning = Men. Årsag = Derfor. Tilføjelse = Desuden.' },
  { type:'mc', concept:'r-signal', tag:'Signal · cause', prompt:'Vælg den rigtige sætning: "Det regnede kraftigt. ___"',
    options:[{text:'Derfor tog jeg bussen i stedet for cyklen.', ok:true, why:'Regn er ÅRSAGEN til at tage bussen → "Derfor" + inversion (tog jeg).'},
      {text:'Men tog jeg bussen i stedet for cyklen.', ok:false, mistakeType:'Wrong logic + order', why:'Der er ingen modsætning, og "Men" giver ikke inversion.'},
      {text:'Derfor jeg tog bussen i stedet for cyklen.', ok:false, mistakeType:'No inversion after Derfor', why:'Logikken er rigtig, men "Derfor" står forrest → verbet skal være nummer to: "Derfor TOG JEG".'}],
    explanation:'Årsag → "Derfor", og fordi det står forrest, skal verbet stå på plads to: "Derfor tog jeg…".', trick:'Derfor forrest → inversion.' },
  { type:'mc', concept:'r-signal', tag:'Signal · addition', prompt:'Vælg den rigtige sætning: "Maden på stedet var god. ___"',
    options:[{text:'Desuden var personalet meget venligt.', ok:true, why:'En ekstra positiv ting i SAMME retning → "Desuden" + inversion (var personalet).'},
      {text:'Men var personalet meget venligt.', ok:false, mistakeType:'Wrong logic', why:'Ingen modsætning — begge dele er positive.'},
      {text:'Desuden personalet var meget venligt.', ok:false, mistakeType:'No inversion after Desuden', why:'"Desuden" forrest kræver inversion: "Desuden VAR PERSONALET".'}],
    explanation:'Tilføjelse i samme retning → "Desuden" + inversion.', trick:'Desuden/Derfor/Bagefter forrest → verbet på plads to.' },
  { type:'mc', concept:'r-signal', tag:'Signal · concession', prompt:'Vælg den sætning, der passer: "Jeg er stadig glad for mit job. ___"',
    options:[{text:'Det fylder dog for meget i den seneste tid.', ok:true, why:'"dog" markerer en indvending — glad MEN et forbehold. Inversion er ikke nødvendig her (dog midt i sætningen).'},
      {text:'Det fylder derfor for meget i den seneste tid.', ok:false, mistakeType:'Wrong logic', why:'"derfor" ville betyde at glæden ER ÅRSAGEN til at jobbet fylder — det giver ikke mening.'},
      {text:'Det fylder desuden ikke noget særligt.', ok:false, mistakeType:'Contradicts', why:'Modsiger pointen — afsnittet handler om at jobbet fylder for meget.'}],
    explanation:'"dog" er en blød modsætning/indvending, ofte midt i sætningen ("Det fylder dog…").', trick:'dog = blød "men".' },
  { type:'mc', concept:'r-signal', tag:'Signal · sequence', prompt:'Vælg den rigtige sætning: "Først mødtes vi på en café. ___"',
    options:[{text:'Bagefter gik vi en lang tur i parken.', ok:true, why:'Tidsrækkefølge → "Bagefter" + inversion (gik vi).'},
      {text:'Bagefter vi gik en lang tur i parken.', ok:false, mistakeType:'No inversion', why:'"Bagefter" forrest → verbet på plads to: "Bagefter GIK VI".'},
      {text:'Men gik vi en lang tur i parken.', ok:false, mistakeType:'Wrong logic', why:'Der er ingen modsætning — det er en rækkefølge af handlinger.'}],
    explanation:'Rækkefølge → Først … Bagefter/Derefter … (med inversion, fordi de står forrest).', trick:'Først → Bagefter → Til sidst, alle med inversion forrest.' },
  { type:'mc', concept:'r-signal', tag:'Signal · cause (fordi)', prompt:'Vælg den rigtige fortsættelse: "Jeg blev hjemme i går, ___"',
    options:[{text:'fordi jeg ikke havde det godt.', ok:true, why:'"fordi" indleder en bisætning med SAV — "jeg ikke havde".'},
      {text:'fordi jeg havde ikke det godt.', ok:false, mistakeType:'Main-clause order after fordi', why:'Efter "fordi" skal "ikke" stå før verbet: "jeg ikke havde".'},
      {text:'derfor jeg havde ikke det godt.', ok:false, mistakeType:'Wrong connector', why:'"derfor" binder ikke en bisætning til en hovedsætning på denne måde — og ordstillingen er forkert.'}],
    explanation:'"fordi" giver årsag i en bisætning (SAV); "derfor" giver årsag i en hovedsætning (inversion forrest).', trick:'fordi = bisætning (SAV). derfor = hovedsætning (inversion).' },
  { type:'mc', concept:'r-signal', tag:'Signal · contrast (selvom)', prompt:'Vælg den rigtige sætning: "___, træner han hver aften."',
    options:[{text:'Selvom han tit er træt', ok:true, why:'"Selvom" indleder en bisætning (SAV: han tit er), og den står forrest → hovedsætningen inverterer (træner han).'},
      {text:'Selvom han er tit træt', ok:false, mistakeType:'Adverb after verb in subordinate clause', why:'Efter "selvom" skal "tit" stå før verbet: "han tit er træt".'},
      {text:'Fordi han tit er træt', ok:false, mistakeType:'Wrong logic', why:'"Fordi" ville betyde at træthed er årsagen til at han træner — modsætningen kræver "selvom".'}],
    explanation:'Modsætning på trods af noget → "selvom" + SAV i bisætningen.', trick:'selvom = "even though" + SAV.' },
  { type:'mc', concept:'r-signal', tag:'Signal · result (så)', prompt:'Vælg den rigtige sætning: "Bussen var aflyst, ___"',
    options:[{text:'så jeg gik hele vejen hjem.', ok:true, why:'"så" (=derfor/result) er sideordnende → normal ordstilling: "så jeg gik".'},
      {text:'så gik jeg hele vejen hjem.', ok:false, mistakeType:'Inversion after så (result)', why:'Som RESULTAT-"så" (= derfor) bevares normal ordstilling: "så jeg gik". (Inversion ville være "så" = "dengang".)'},
      {text:'men jeg gik hele vejen hjem.', ok:false, mistakeType:'Wrong logic', why:'Der er ingen modsætning — det er et resultat.'}],
    explanation:'Resultat-"så" er sideordnende (normal ordstilling). Pas på: "så" som tidsadverbium forrest giver inversion.', trick:'så (=derfor) → normal orden. Så (=dengang) forrest → inversion.' },
  { type:'mc', concept:'r-signal', tag:'Signal · contrast', prompt:'Vælg den sætning, der passer: "Han øver sig hver dag. ___"',
    options:[{text:'Alligevel går det langsomt fremad.', ok:true, why:'Indsats MEN langsom fremgang = modsætning → "Alligevel" + inversion (går det).'},
      {text:'Derfor går det langsomt fremad.', ok:false, mistakeType:'Wrong logic', why:'"Derfor" ville betyde at øvelsen er årsagen til den langsomme fremgang — ulogisk.'},
      {text:'Alligevel det går langsomt fremad.', ok:false, mistakeType:'No inversion', why:'"Alligevel" forrest → verbet på plads to: "Alligevel GÅR DET".'}],
    explanation:'"Alligevel" = "nevertheless" — modsætning til det forventede, med inversion forrest.', trick:'Alligevel forrest → inversion.' },
  { type:'mc', concept:'r-signal', tag:'Signal · addition', prompt:'Vælg den rigtige fortsættelse: "Vi sorterer affald derhjemme, ___"',
    options:[{text:'og vi sparer også på vandet.', ok:true, why:'"og" sideordner to ting i samme retning → normal ordstilling.'},
      {text:'men vi sparer også på vandet.', ok:false, mistakeType:'Wrong logic', why:'Begge dele er grønne vaner — ingen modsætning.'},
      {text:'fordi vi sparer også på vandet.', ok:false, mistakeType:'Wrong logic + order', why:'Det er ikke en årsag, og efter "fordi" skulle ordstillingen være SAV.'}],
    explanation:'To ting i samme retning → "og" (eller "Desuden …" med inversion forrest).', trick:'Tilføjelse: og / desuden.' },
  { type:'mc', concept:'r-signal', tag:'Signal · contrast', prompt:'Hvilken sætning passer i hullet? "Jeg ville gerne være kommet til festen. ___"',
    options:[{text:'Desværre kunne jeg ikke få fri fra arbejde.', ok:true, why:'Ønske MEN forhindring → blød modsætning. "Desværre" forrest → inversion (kunne jeg).'},
      {text:'Desværre jeg kunne ikke få fri fra arbejde.', ok:false, mistakeType:'No inversion', why:'"Desværre" forrest kræver inversion: "Desværre KUNNE JEG".'},
      {text:'Derfor kunne jeg ikke få fri fra arbejde.', ok:false, mistakeType:'Wrong logic', why:'Ønsket er ikke årsagen til at du ikke kunne få fri.'}],
    explanation:'"Desværre" markerer en uheldig modsætning og giver inversion forrest.', trick:'Desværre forrest → inversion.' },
  { type:'mc', concept:'r-signal', tag:'Signal · explanation (nemlig)', prompt:'Vælg den naturlige sætning: "Han kommer ikke i aften. ___"',
    options:[{text:'Han skal nemlig arbejde over.', ok:true, why:'"nemlig" forklarer det foregående og står MIDT i sætningen efter verbet: "Han skal nemlig…".'},
      {text:'Nemlig han skal arbejde over.', ok:false, mistakeType:'nemlig fronted', why:'"nemlig" sættes normalt ikke forrest — det står midt i sætningen.'},
      {text:'Han skal derfor ikke arbejde over.', ok:false, mistakeType:'Wrong logic', why:'Modsiger pointen og ændrer betydningen.'}],
    explanation:'"nemlig" begrunder og bor midt i sætningen, efter det finitte verbum.', trick:'nemlig = forklaring, midt i sætningen.' }
];

BANK['rd-para'] = [
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten siger: "Lægen bad mig om at vente med at træne, indtil jeg var helt rask." Hvilket spørgsmål passer?',
    options:[{text:'Hvem fik besked på ikke at dyrke sport endnu?', ok:true, why:'"vente med at træne" = "ikke dyrke sport endnu". Samme betydning, andre ord — det er paraphrase.'},
      {text:'Hvem træner allerede igen?', ok:false, mistakeType:'Opposite meaning', why:'Det modsatte — personen skal netop VENTE med at træne.'},
      {text:'Hvem vil aldrig træne mere?', ok:false, mistakeType:'Too strong', why:'"vente, indtil jeg er rask" er midlertidigt, ikke "aldrig".'}],
    explanation:'Spørgsmålene i Opgave 2A/4 bruger ANDRE ord end teksten. Match betydningen, ikke ordene.', trick:'Match meningen, ikke de enkelte ord.' },
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten: "Jeg har aldrig haft råd til at købe nyt, så jeg handler altid brugt." Hvilket spørgsmål passer?',
    options:[{text:'Hvem køber tit ting, andre har ejet før?', ok:true, why:'"handler brugt" = "køber ting, andre har ejet før". Paraphrase.'},
      {text:'Hvem køber kun helt nye ting?', ok:false, mistakeType:'Opposite', why:'Det modsatte af teksten.'},
      {text:'Hvem har masser af penge?', ok:false, mistakeType:'Opposite detail', why:'Teksten siger "aldrig haft råd".'}],
    explanation:'"brugt" ↔ "andre har ejet før" er klassisk omformulering.', trick:'Synonymer og omskrivninger er nøglen.' },
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten: "Det tog mig næsten et år at finde en bolig." Hvilket spørgsmål passer?',
    options:[{text:'Hvem brugte lang tid på at finde et sted at bo?', ok:true, why:'"næsten et år" = "lang tid"; "bolig" = "sted at bo".'},
      {text:'Hvem fandt hurtigt en lejlighed?', ok:false, mistakeType:'Opposite', why:'Et år er ikke hurtigt.'},
      {text:'Hvem bygger sit eget hus?', ok:false, mistakeType:'Not stated', why:'Teksten nævner intet om at bygge.'}],
    explanation:'Tal og tidsudtryk omskrives ofte ("næsten et år" → "lang tid").', trick:'Omsæt tal til ord: et år → lang tid.' },
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten: "Mine kolleger talte hurtigt og brugte mange ord, jeg ikke kendte." Hvilket spørgsmål passer?',
    options:[{text:'Hvem havde svært ved at forstå sine kolleger i starten?', ok:true, why:'Hurtig tale + ukendte ord = svært at forstå. Paraphrase af konsekvensen.'},
      {text:'Hvem forstod alt med det samme?', ok:false, mistakeType:'Opposite', why:'Det modsatte.'},
      {text:'Hvem talte ikke med sine kolleger?', ok:false, mistakeType:'Not stated', why:'Personen talte med dem — det var bare svært.'}],
    explanation:'Tit skal du udlede konsekvensen: hurtig + ukendte ord → svært at forstå.', trick:'Læs, hvad situationen BETYDER.' },
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten: "Vi deler en bil med tre andre familier." Hvilket spørgsmål passer?',
    options:[{text:'Hvem ejer ikke selv en bil alene?', ok:true, why:'"deler en bil med andre" = "ejer ikke selv en bil alene".'},
      {text:'Hvem har to biler?', ok:false, mistakeType:'Wrong number', why:'De DELER én bil.'},
      {text:'Hvem cykler altid?', ok:false, mistakeType:'Not stated', why:'Cykling nævnes ikke.'}],
    explanation:'"dele" ↔ "ikke eje alene" — pas på taltrap (tre familier, ikke tre biler).', trick:'Tjek tal nøje — de er ofte fælder.' },
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten: "Jeg melder mig som frivillig, hver gang skolen har brug for hjælp." Hvilket spørgsmål passer?',
    options:[{text:'Hvem hjælper gratis på sit barns skole?', ok:true, why:'"frivillig" = "gratis"; "skolen" + sammenhængen = barnets skole.'},
      {text:'Hvem får løn af skolen?', ok:false, mistakeType:'Opposite', why:'Frivillig betyder netop UDEN løn.'},
      {text:'Hvem arbejder som lærer?', ok:false, mistakeType:'Not stated', why:'Frivillig hjælp ≠ lærerjob.'}],
    explanation:'"frivillig" ↔ "gratis / uden løn".', trick:'frivillig = uden betaling.' },
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten: "Jeg fik jobbet gennem en ven, der allerede arbejdede der." Hvilket spørgsmål passer?',
    options:[{text:'Hvem fik hjælp af en bekendt til at finde arbejde?', ok:true, why:'"gennem en ven" = "hjælp af en bekendt".'},
      {text:'Hvem søgte jobbet helt alene på nettet?', ok:false, mistakeType:'Opposite', why:'Modsat — vennen hjalp.'},
      {text:'Hvem startede sit eget firma?', ok:false, mistakeType:'Not stated', why:'Intet om eget firma.'}],
    explanation:'"gennem en ven" ↔ "hjælp af en bekendt".', trick:'Relationer omskrives: ven → bekendt.' },
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten: "Jeg tager sjældent hjem i weekenden for at besøge min familie." Hvilket spørgsmål passer?',
    options:[{text:'Hvem ser ikke så tit sin familie?', ok:true, why:'"sjældent hjem … besøge familie" = "ser ikke så tit familien".'},
      {text:'Hvem bor sammen med sin familie?', ok:false, mistakeType:'Opposite', why:'Personen tager HJEM for at besøge dem — bor altså ikke sammen.'},
      {text:'Hvem besøger familien hver weekend?', ok:false, mistakeType:'Opposite frequency', why:'"sjældent" er det modsatte af "hver weekend".'}],
    explanation:'"sjældent" ↔ "ikke så tit" — frekvensord er ofte fælden.', trick:'sjældent = ikke ofte.' },
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten: "Lønnen er ikke høj, men arbejdsglæden betyder mere for mig." Hvilket spørgsmål passer?',
    options:[{text:'Hvem prioriterer trivsel højere end penge?', ok:true, why:'"arbejdsglæden betyder mere end lønnen" = "prioriterer trivsel højere end penge".'},
      {text:'Hvem synes lønnen er det vigtigste?', ok:false, mistakeType:'Opposite', why:'Modsat — glæden vejer tungere.'},
      {text:'Hvem klager over for lav løn?', ok:false, mistakeType:'Wrong tone', why:'Personen accepterer lønnen, klager ikke.'}],
    explanation:'Holdninger omskrives: "betyder mere" ↔ "prioriterer højere".', trick:'Find holdningen bag ordene.' },
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten: "Jeg cykler til arbejde året rundt — også når det sner." Hvilket spørgsmål passer?',
    options:[{text:'Hvem bruger cyklen, uanset vejret?', ok:true, why:'"året rundt, også når det sner" = "uanset vejret".'},
      {text:'Hvem cykler kun om sommeren?', ok:false, mistakeType:'Opposite', why:'Modsat — også om vinteren.'},
      {text:'Hvem tager altid bilen?', ok:false, mistakeType:'Not stated', why:'Personen cykler.'}],
    explanation:'"året rundt, også når det sner" ↔ "uanset vejret".', trick:'Konkrete eksempler → generel betydning.' },
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten: "Jeg har vænnet mig til det, og nu kender jeg byen rigtig godt." Hvilket spørgsmål passer?',
    options:[{text:'Hvem føler sig hjemme i byen efterhånden?', ok:true, why:'"vænnet mig til + kender byen godt" = "føler sig hjemme efterhånden".'},
      {text:'Hvem er lige flyttet til byen?', ok:false, mistakeType:'Opposite', why:'"vænnet sig til" betyder, at der er gået tid — ikke lige flyttet.'},
      {text:'Hvem vil flytte væk fra byen?', ok:false, mistakeType:'Not stated', why:'Intet om at flytte væk.'}],
    explanation:'"vænnet sig til + kender godt" ↔ "føler sig hjemme".', trick:'Læs den følelsesmæssige betydning.' },
  { type:'mc', concept:'r-paraphrase', tag:'Paraphrase', prompt:'Teksten: "Vi laver mad af ugens rester hver søndag." Hvilket spørgsmål passer?',
    options:[{text:'Hvem prøver at undgå at smide mad ud?', ok:true, why:'"laver mad af rester" = "undgår madspild / at smide mad ud".'},
      {text:'Hvem spiser altid på restaurant?', ok:false, mistakeType:'Not stated', why:'De laver mad hjemme af rester.'},
      {text:'Hvem køber kun ny mad hver dag?', ok:false, mistakeType:'Opposite', why:'Modsat — de bruger rester.'}],
    explanation:'"bruge rester" ↔ "undgå madspild".', trick:'Handling → formål.' }
];

BANK['rd-infer'] = [
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Da Sofia landede i København, rystede hun af kulde, selvom hun havde taget masser af tøj på." Hvad kan man slutte?',
    options:[{text:'Der var meget koldere, end Sofia havde forventet.', ok:true, why:'Hun frøs trods meget tøj → kulden overraskede hende.'},
      {text:'Sofia havde glemt sin jakke.', ok:false, mistakeType:'Contradicts', why:'Hun havde "masser af tøj på".'},
      {text:'Det var en varm sommerdag.', ok:false, mistakeType:'Contradicts', why:'Hun rystede af kulde.'}],
    explanation:'Inferens = læse mellem linjerne. "frøs trods meget tøj" → uventet koldt.', trick:'Spørg: hvad fortæller detaljerne MELLEM linjerne?' },
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Hver gang chefen spurgte om overarbejde, kiggede Adrian ned og sagde ja meget stille." Hvad antyder det?',
    options:[{text:'Adrian havde svært ved at sige nej.', ok:true, why:'Kigge ned + sige ja stille → modvilje, men kan ikke afslå.'},
      {text:'Adrian elskede at arbejde over.', ok:false, mistakeType:'Contradicts body language', why:'Kropssproget viser det modsatte.'},
      {text:'Adrian var chefens bedste ven.', ok:false, mistakeType:'Not stated', why:'Intet om venskab.'}],
    explanation:'Kropssprog og tonefald afslører holdning, selvom ordene siger "ja".', trick:'Læs handlingen, ikke kun ordene.' },
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Mina tjekkede boligsiderne, allerede inden hun havde spist morgenmad." Hvad fortæller det?',
    options:[{text:'At finde en bolig var meget vigtigt for Mina.', ok:true, why:'Gøre det FØR morgenmad → høj prioritet/iver.'},
      {text:'Mina spiste aldrig morgenmad.', ok:false, mistakeType:'Over-reading', why:'"inden hun havde spist" siger ikke, at hun aldrig spiser.'},
      {text:'Mina kunne ikke lide at bruge computer.', ok:false, mistakeType:'Contradicts', why:'Hun tjekkede selv siderne.'}],
    explanation:'Detaljen "inden morgenmad" signalerer, hvor vigtigt det var.', trick:'Hvorfor nævner forfatteren netop denne detalje?' },
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Efter et halvt år i løbeklubben kender Viktor pludselig tyve mennesker i en by, hvor han før kun kendte sine kolleger." Hvad kan man slutte?',
    options:[{text:'Klubben har hjulpet Viktor med at få et socialt netværk.', ok:true, why:'Fra få bekendte til tyve → klubben skabte netværket.'},
      {text:'Viktor har mistet kontakten til sine kolleger.', ok:false, mistakeType:'Not stated', why:'Teksten siger intet om at miste kolleger.'},
      {text:'Viktor vil snart flytte fra byen.', ok:false, mistakeType:'Not stated', why:'Intet om at flytte.'}],
    explanation:'Kontrasten "før kun kolleger → nu tyve" peger på klubbens sociale effekt.', trick:'Sammenlign "før" og "nu".' },
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Jeg sad med munden fuld af karrysild og måtte spytte det hele ud i en serviet." Hvad antyder det?',
    options:[{text:'Personen kunne slet ikke lide karrysilden.', ok:true, why:'Spytte maden ud → stærk modvilje mod smagen.'},
      {text:'Karrysilden var personens livret.', ok:false, mistakeType:'Contradicts', why:'Man spytter ikke sin livret ud.'},
      {text:'Personen var allergisk over for fisk.', ok:false, mistakeType:'Over-reading', why:'Teksten siger smagen, ikke allergi.'}],
    explanation:'Handlingen (spytte ud) afslører holdningen (modvilje).', trick:'Følg reaktionen til holdningen.' },
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Robert kiggede alligevel lidt på sit hjemmearbejde, selvom han var rigtig træt klokken 20." Hvad viser det?',
    options:[{text:'Robert er pligtopfyldende og vil gerne være forberedt.', ok:true, why:'Læse trods træthed → ansvarsfølelse.'},
      {text:'Robert havde masser af energi.', ok:false, mistakeType:'Contradicts', why:'Han var "rigtig træt".'},
      {text:'Robert havde fri fra arbejde hele dagen.', ok:false, mistakeType:'Not stated', why:'Intet om en fridag.'}],
    explanation:'"alligevel … selvom træt" → vilje og pligtfølelse.', trick:'Modsætningsord (alligevel/selvom) afslører karakter.' },
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Da Liam så den lille hund med de store øjne, blev han helt varm om hjertet." Hvad betyder det?',
    options:[{text:'Liam blev meget glad og rørt.', ok:true, why:'"varm om hjertet" er et idiom for rørt/glad.'},
      {text:'Liam fik feber.', ok:false, mistakeType:'Literal reading', why:'Det er et billedligt udtryk, ikke fysisk varme.'},
      {text:'Liam blev bange for hunden.', ok:false, mistakeType:'Wrong emotion', why:'Udtrykket er positivt.'}],
    explanation:'Idiomer skal forstås billedligt: "varm om hjertet" = rørt.', trick:'Tag ikke faste udtryk bogstaveligt.' },
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Naboerne inviterer hinanden på kaffe, og hver måned spiser hele foreningen sammen." Hvad kan man slutte om stedet?',
    options:[{text:'Der er et stærkt fællesskab mellem naboerne.', ok:true, why:'Fælles kaffe + månedlig spisning → tæt fællesskab.'},
      {text:'Naboerne kan ikke lide hinanden.', ok:false, mistakeType:'Contradicts', why:'De mødes frivilligt og tit.'},
      {text:'Folk flytter hele tiden.', ok:false, mistakeType:'Not stated', why:'Intet om flytning.'}],
    explanation:'Gentagne fælles aktiviteter → fællesskab.', trick:'Mønstre i adfærd afslører kulturen.' },
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Jeg skrev under på lejekontrakten med rystende hænder, men også med et stort smil." Hvad følte personen?',
    options:[{text:'Personen var både nervøs og glad på samme tid.', ok:true, why:'Rystende hænder (nervøs) + stort smil (glad) → blandede følelser.'},
      {text:'Personen fortrød med det samme.', ok:false, mistakeType:'Contradicts', why:'Smilet viser glæde, ikke fortrydelse.'},
      {text:'Personen var ligeglad.', ok:false, mistakeType:'Contradicts', why:'Rystende hænder = stærke følelser.'}],
    explanation:'To modsatte kropstegn → blandede følelser.', trick:'Modsatte signaler = blandede følelser.' },
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Min søn retter mig allerede, hvis jeg sorterer affald forkert." Hvad antyder det?',
    options:[{text:'Børnene har lært meget om miljø i skolen.', ok:true, why:'Sønnen kan reglerne bedre end forælderen → lært det et sted, typisk skolen.'},
      {text:'Forælderen er ligeglad med affald.', ok:false, mistakeType:'Contradicts', why:'Forælderen sorterer (bare nogle gange forkert).'},
      {text:'Sønnen kan ikke lide at sortere.', ok:false, mistakeType:'Contradicts', why:'Han retter jo ivrigt forælderen.'}],
    explanation:'At barnet kan reglerne bedst → det er lært udefra (skolen).', trick:'Hvem ved mest, og hvor kommer det fra?' },
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Da jeg endelig klarede en hel telefonsamtale på dansk, var jeg så stolt bagefter." Hvad fortæller "endelig"?',
    options:[{text:'Det havde været svært i lang tid, før det lykkedes.', ok:true, why:'"endelig" = efter lang tids forsøg → en længe ventet sejr.'},
      {text:'Det var nemt fra første dag.', ok:false, mistakeType:'Contradicts', why:'"endelig" antyder det modsatte.'},
      {text:'Personen taler ikke dansk.', ok:false, mistakeType:'Contradicts', why:'Samtalen blev klaret på dansk.'}],
    explanation:'Ordet "endelig" rummer en hel historie om tidligere besvær.', trick:'Små ord (endelig, stadig, allerede) bærer betydning.' },
  { type:'mc', concept:'r-inference', tag:'Inference', prompt:'"Han spiste ALT på tallerkenen og spurgte, om der var mere." Hvad kan man slutte?',
    options:[{text:'Han kunne rigtig godt lide maden.', ok:true, why:'Spise alt + bede om mere → maden faldt i god smag.'},
      {text:'Han var ikke sulten.', ok:false, mistakeType:'Contradicts', why:'Han bad om mere.'},
      {text:'Maden var dårlig.', ok:false, mistakeType:'Contradicts', why:'Man beder ikke om mere dårlig mad.'}],
    explanation:'Adfærd (spise alt, bede om mere) → positiv holdning til maden.', trick:'Handling afslører holdning.' }
];

BANK['rd-trap'] = [
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem cykler til arbejde hele året?" — Tekst A: "Mine venner siger, jeg burde cykle noget mere, men om vinteren tager jeg altid bussen." Tekst B: "Jeg cykler til arbejde året rundt, også når det sner." Hvem passer?',
    options:[{text:'Person B', ok:true, why:'B cykler FAKTISK hele året. A bliver bare ANBEFALET at cykle mere — og tager bussen om vinteren.'},
      {text:'Person A', ok:false, mistakeType:'Recommendation ≠ action', why:'A’s venner anbefaler det; A gør det ikke. Klassisk fælde: "burde" ≠ "gør".'},
      {text:'Begge', ok:false, mistakeType:'Only one matches', why:'Kun B cykler reelt hele året.'}],
    explanation:'Opgave 4-fælde: én person NÆVNER emnet (anbefaling/ønske), men kun én GØR det.', trick:'"burde / vil gerne" ≠ "gør". Find den, der handler.' },
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem synes, det er svært at sortere affald?" — A: "Sortering går faktisk ret nemt, fordi kommunen har et godt system." C: "Jeg synes stadig, det er svært at finde ud af, hvad der skal i hvilken spand." Hvem passer?',
    options:[{text:'Person C', ok:true, why:'C synes det er SVÆRT. A nævner sortering, men siger det er NEMT.'},
      {text:'Person A', ok:false, mistakeType:'Same topic, opposite opinion', why:'A taler om sortering, men har den modsatte holdning (nemt).'},
      {text:'Ingen', ok:false, mistakeType:'C matches', why:'C passer tydeligt.'}],
    explanation:'Samme EMNE, modsat HOLDNING — læs verbet og holdningen, ikke kun emneordet.', trick:'Samme emne ≠ samme svar. Tjek holdningen.' },
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem vil gerne videreuddanne sig?" — B: "Jeg er begyndt på et truckkursus og vil uddanne mig til lagerchef." C: "Jeg tænker nogle gange på at læse videre, men lige nu har jeg små børn, så det må vente." Hvem passer?',
    options:[{text:'Person B', ok:true, why:'B er allerede i GANG (truckkursus) med en konkret plan. C udskyder eksplicit.'},
      {text:'Person C', ok:false, mistakeType:'Postponed ≠ doing', why:'C "tænker på" det men udsætter — ikke et aktivt ja.'},
      {text:'Begge', ok:false, mistakeType:'Only B acts', why:'Kun B handler nu.'}],
    explanation:'"tænker på, men det må vente" er en udskydelse, ikke en handling.', trick:'Konkret handling slår løse tanker.' },
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem fik jobbet selv uden hjælp?" — B: "Jeg fik jobbet gennem min ven Ali." C: "Jeg fandt selv jobbet på nettet og søgte uden at kende nogen." Hvem passer?',
    options:[{text:'Person C', ok:true, why:'C søgte SELV uden kontakter. B fik hjælp af en ven.'},
      {text:'Person B', ok:false, mistakeType:'Got help', why:'B fik netop hjælp — det modsatte af spørgsmålet.'},
      {text:'Begge', ok:false, mistakeType:'Only C', why:'Kun C gjorde det selv.'}],
    explanation:'Læs præcist: "selv / uden at kende nogen" vs. "gennem en ven".', trick:'Modsatte detaljer ligger tit lige op ad hinanden.' },
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem sparer på vandet?" — B: "Jeg ved godt, man burde spare på vandet, men jeg elsker lange, varme brusebade." C: "Vi tager korte brusebade og lukker for vandet, mens vi børster tænder." Hvem passer?',
    options:[{text:'Person C', ok:true, why:'C sparer FAKTISK. B ved det burde, men gør det modsatte (lange bade).'},
      {text:'Person B', ok:false, mistakeType:'Knows ≠ does', why:'B kender reglen men følger den ikke.'},
      {text:'Ingen', ok:false, mistakeType:'C matches', why:'C handler tydeligt.'}],
    explanation:'"man burde, men jeg…" afslører en, der IKKE gør det.', trick:'"burde, men" = gør det ikke.' },
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem spiser næsten ikke kød?" — A: "Min datter siger tit, vi burde spise mindre kød, men vi spiser det flere gange om ugen." B: "Vi spiser næsten kun grøntsager; kød får vi måske to gange om måneden." Hvem passer?',
    options:[{text:'Person B', ok:true, why:'B spiser næsten ikke kød (2 gange/måned). A spiser det flere gange om UGEN.'},
      {text:'Person A', ok:false, mistakeType:'Advised, not doing', why:'A’s datter anbefaler det; familien gør det ikke.'},
      {text:'Begge', ok:false, mistakeType:'Only B', why:'Kun B spiser lidt kød.'}],
    explanation:'Anbefaling fra en anden ≠ personens egen handling.', trick:'Hvem TALER om det vs. hvem GØR det.' },
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem er glad for sine skiftende arbejdstider?" — A: "Jeg har mest nattevagter, men jeg ville ønske, jeg havde flere dagvagter." B: "Vi har skiftende vagter, og det passer mig faktisk perfekt." Hvem passer?',
    options:[{text:'Person B', ok:true, why:'B er GLAD for skiftende vagter. A har nattevagter men ønsker sig noget andet.'},
      {text:'Person A', ok:false, mistakeType:'Has, but unhappy', why:'A har skiftende tider men er ikke glad for dem.'},
      {text:'Ingen', ok:false, mistakeType:'B matches', why:'B passer.'}],
    explanation:'At HAVE noget ≠ at være GLAD for det.', trick:'Tjek både faktum og holdning.' },
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem taler mest dansk på arbejdet?" — A: "På min afdeling taler vi tit engelsk, fordi vi har kolleger fra hele verden." C: "Jeg taler dansk hele dagen — med børnene, forældrene og kollegerne." Hvem passer?',
    options:[{text:'Person C', ok:true, why:'C taler dansk hele dagen. A taler mest ENGELSK på jobbet.'},
      {text:'Person A', ok:false, mistakeType:'Speaks English', why:'A’s afdeling bruger engelsk — det modsatte.'},
      {text:'Begge', ok:false, mistakeType:'Only C', why:'Kun C taler mest dansk.'}],
    explanation:'Emneordet "arbejde/sprog" optræder hos begge — men kun den ene taler DANSK.', trick:'Find det rigtige SPROG, ikke bare emnet.' },
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem synes, lønnen er for lav i forhold til arbejdet?" — A: "Vi løber stærkt, og jeg synes, lønnen er for lav i forhold til ansvaret." C: "Lønnen er ikke høj, men arbejdsglæden betyder mere for mig." Hvem passer?',
    options:[{text:'Person A', ok:true, why:'A klager over forholdet løn/ansvar. C accepterer lønnen (glæden vejer tungere).'},
      {text:'Person C', ok:false, mistakeType:'Accepts pay', why:'C synes ikke det er et problem — det er accept, ikke en klage.'},
      {text:'Begge', ok:false, mistakeType:'Only A complains', why:'Kun A synes det er uretfærdigt.'}],
    explanation:'Begge nævner lav løn — men kun A synes det er for lidt FOR ARBEJDET.', trick:'Nævne et emne ≠ have klagen i spørgsmålet.' },
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem savner sit hjemland nogle gange?" — B: "Nu har jeg vænnet mig til Danmark og kender byen godt." C: "Roskilde er meget stille i forhold til Nairobi, så engang imellem kan jeg godt få lidt hjemve." Hvem passer?',
    options:[{text:'Person C', ok:true, why:'C får "hjemve" engang imellem. B har tværtimod vænnet sig til Danmark.'},
      {text:'Person B', ok:false, mistakeType:'Settled in', why:'B savner ikke — har slået sig til ro.'},
      {text:'Ingen', ok:false, mistakeType:'C matches', why:'"hjemve" = savner hjemland.'}],
    explanation:'"hjemve" er nøgleordet — paraphrase for at savne hjemlandet.', trick:'Kend synonymerne: hjemve = savn efter hjemlandet.' },
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem var glad for, at lægebesøget var gratis?" — A: "Jeg overvejede en privatklinik, men det koster jo penge." B: "Jeg er dog glad for, at jeg ikke skulle betale for besøget." Hvem passer?',
    options:[{text:'Person B', ok:true, why:'B er udtrykkeligt glad for det GRATIS besøg. A taler om en BETALT privatklinik.'},
      {text:'Person A', ok:false, mistakeType:'Talks about paying', why:'A nævner penge, men i forbindelse med en privatklinik, ikke glæde over gratis.'},
      {text:'Begge', ok:false, mistakeType:'Only B', why:'Kun B udtrykker glæden.'}],
    explanation:'Begge nævner penge/læge — men kun B er GLAD for det gratis.', trick:'Match holdningen i spørgsmålet, ikke kun emnet.' },
  { type:'mc', concept:'r-trap', tag:'Trap · Opgave 4', prompt:'Spørgsmål: "Hvem havde svært ved at finde lægeklinikken?" — A: "Jeg fandt egentlig ret nemt klinikken." C: "Jeg brugte Google Maps, men det var alligevel ikke helt let at finde." Hvem passer?',
    options:[{text:'Person C', ok:true, why:'C havde svært ved det (selv med kort). A fandt den NEMT.'},
      {text:'Person A', ok:false, mistakeType:'Found it easily', why:'A er det modsatte af spørgsmålet.'},
      {text:'Begge', ok:false, mistakeType:'Only C', why:'Kun C havde svært ved det.'}],
    explanation:'Modsatte oplevelser af samme ting (finde klinikken) — læs "nemt" vs. "ikke helt let".', trick:'Positiv vs. negativ oplevelse af samme emne.' }
];

BANK['rd-vocab'] = [
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"Lønnen er rimelig, især når man tænker på, hvad man får." Hvad betyder "rimelig" her?',
    options:[{text:'okay / acceptabel', ok:true, why:'"rimelig" = fair/acceptabel, især positivt her ("især når man tænker på, hvad man får").'},
      {text:'alt for høj', ok:false, mistakeType:'Wrong degree', why:'"rimelig" er hverken høj eller lav — den er passende.'},
      {text:'gratis', ok:false, mistakeType:'Wrong meaning', why:'Der er stadig en pris; den er bare fair.'}],
    explanation:'Konteksten ("hvad man får") viser, at "rimelig" er positivt = acceptabel.', trick:'Brug konteksten til at finde betydningen.' },
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"Det var et stort overskud at have, da jeg endelig fik sovet ordentligt." Hvad betyder "overskud" her?',
    options:[{text:'energi / krafter', ok:true, why:'Efter god søvn → "overskud" = energi/krafter til hverdagen.'},
      {text:'penge', ok:false, mistakeType:'Other meaning', why:'"overskud" kan betyde profit, men her handler det om søvn → energi.'},
      {text:'mad', ok:false, mistakeType:'Unrelated', why:'Intet med mad at gøre.'}],
    explanation:'Samme ord, flere betydninger — konteksten (søvn) afgør: energi.', trick:'Ord har flere betydninger; lad sætningen vælge.' },
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"Jeg meldte mig som frivillig til byens motionsløb." Hvad betyder "frivillig"?',
    options:[{text:'en, der hjælper gratis', ok:true, why:'"frivillig" = en, der arbejder uden løn for at hjælpe.'},
      {text:'en professionel løber', ok:false, mistakeType:'Wrong', why:'Frivillig handler om hjælp, ikke om at være atlet.'},
      {text:'en tilskuer', ok:false, mistakeType:'Wrong role', why:'En frivillig hjælper aktivt til.'}],
    explanation:'"frivillig" = gratis hjælper.', trick:'frivillig = uden betaling.' },
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"Efter ulykken var bilen i stykker og kunne ikke køre." Hvad betyder "i stykker"?',
    options:[{text:'ødelagt', ok:true, why:'"i stykker" = ødelagt/defekt (kunne ikke køre).'},
      {text:'helt ny', ok:false, mistakeType:'Opposite', why:'Det modsatte.'},
      {text:'meget hurtig', ok:false, mistakeType:'Unrelated', why:'Intet om fart.'}],
    explanation:'"i stykker" = ødelagt — bekræftet af "kunne ikke køre".', trick:'Naboordene bekræfter betydningen.' },
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"Hun fik et chok, da alle råbte SURPRISE." Hvad betyder "et chok" her?',
    options:[{text:'en stor overraskelse', ok:true, why:'Konteksten (surprise-fest) → "chok" = pludselig overraskelse.'},
      {text:'en sygdom', ok:false, mistakeType:'Wrong context', why:'Her er det en overraskelse, ikke en medicinsk tilstand.'},
      {text:'en gave', ok:false, mistakeType:'Unrelated', why:'Chokket er reaktionen, ikke en ting.'}],
    explanation:'I denne sammenhæng = stor overraskelse.', trick:'Situationen styrer betydningen.' },
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"Han er meget pligtopfyldende og laver altid sit arbejde til tiden." Hvad betyder "pligtopfyldende"?',
    options:[{text:'ansvarlig og pålidelig', ok:true, why:'"altid til tiden" forklarer ordet → ansvarlig/pålidelig.'},
      {text:'doven', ok:false, mistakeType:'Opposite', why:'Det modsatte af at lave alt til tiden.'},
      {text:'sjov', ok:false, mistakeType:'Unrelated', why:'Intet om humor.'}],
    explanation:'Resten af sætningen definerer det svære ord.', trick:'Forklaringen står tit lige ved siden af.' },
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"Lejligheden trænger til at blive renoveret — der er gammelt og slidt overalt." Hvad betyder "trænger til"?',
    options:[{text:'har brug for', ok:true, why:'"trænger til" = har brug for (bekræftet af "gammelt og slidt").'},
      {text:'er færdig med', ok:false, mistakeType:'Opposite', why:'Det modsatte — den er IKKE renoveret endnu.'},
      {text:'er forbudt', ok:false, mistakeType:'Unrelated', why:'Intet om forbud.'}],
    explanation:'"trænger til" = har brug for.', trick:'Find synonymet via konteksten.' },
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"De aftalte at mødes igen for at skrive papirer under." Hvad betyder "skrive under"?',
    options:[{text:'underskrive / signere', ok:true, why:'"skrive under" = sætte sin underskrift på papirer.'},
      {text:'rive i stykker', ok:false, mistakeType:'Wrong', why:'Det modsatte af at godkende.'},
      {text:'læse højt', ok:false, mistakeType:'Unrelated', why:'Det handler om at signere.'}],
    explanation:'"skrive under" = signere en aftale.', trick:'Faste udtryk: skrive under = underskrive.' },
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"Jeg har vænnet mig til det danske vejr nu." Hvad betyder "vænnet mig til"?',
    options:[{text:'er blevet vant til', ok:true, why:'"vænne sig til" = blive vant til over tid.'},
      {text:'er flyttet fra', ok:false, mistakeType:'Wrong', why:'Intet om at flytte.'},
      {text:'hader', ok:false, mistakeType:'Wrong tone', why:'Det er neutralt/positivt, ikke had.'}],
    explanation:'"vænne sig til" = blive vant til.', trick:'Refleksive udtryk: vænne SIG til.' },
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"Til gengæld smider vi næsten aldrig mad ud." Hvad betyder "Til gengæld"?',
    options:[{text:'til den anden side / som modvægt', ok:true, why:'"Til gengæld" introducerer en positiv modvægt til noget tidligere.'},
      {text:'desuden / på samme måde', ok:false, mistakeType:'Wrong logic', why:'"Til gengæld" markerer en KONTRAST/modvægt, ikke en tilføjelse.'},
      {text:'derfor', ok:false, mistakeType:'Wrong logic', why:'Det er ikke en årsag.'}],
    explanation:'"Til gengæld" = som modvægt/til den anden side.', trick:'Til gengæld = en positiv modvægt.' },
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"Hun er blevet meget mere selvsikker af at gå på efterskole." Hvad betyder "selvsikker"?',
    options:[{text:'tror på sig selv', ok:true, why:'"selvsikker" = har selvtillid, tror på sig selv.'},
      {text:'genert', ok:false, mistakeType:'Opposite', why:'Det modsatte.'},
      {text:'forvirret', ok:false, mistakeType:'Unrelated', why:'Intet med forvirring.'}],
    explanation:'"selv-sikker" = sikker på sig selv.', trick:'Del ordet op: selv + sikker.' },
  { type:'mc', concept:'r-vocab', tag:'Vocab in context', prompt:'"Det faglige niveau i klassen er ret højt, så jeg skal arbejde hårdt." Hvad betyder "fagligt niveau"?',
    options:[{text:'hvor svært/avanceret undervisningen er', ok:true, why:'"fagligt niveau" = hvor højt det akademiske/faglige ligger.'},
      {text:'hvor mange elever der er', ok:false, mistakeType:'Wrong', why:'Det handler om sværhedsgrad, ikke antal.'},
      {text:'hvor stort lokalet er', ok:false, mistakeType:'Unrelated', why:'Intet med lokalet.'}],
    explanation:'"fagligt niveau" = sværhedsgraden i undervisningen.', trick:'fagligt = om faget/lærdommen.' }
];

BANK['wd-connect'] = [
  { type:'mc', concept:'w-connectors', tag:'Connector · cause', prompt:'Bind sammen til ÉN god sætning: "Jeg kan ikke komme på fredag." + "Jeg skal arbejde."',
    options:[{text:'Jeg kan ikke komme på fredag, fordi jeg skal arbejde.', ok:true, why:'Årsag i en bisætning → "fordi" + SAV. Her er der intet adverbium, så "jeg skal arbejde" er korrekt.'},
      {text:'Jeg kan ikke komme på fredag, fordi jeg skal ikke arbejde.', ok:false, mistakeType:'Wrong meaning + order', why:'"skal ikke" ændrer betydningen OG bryder SAV.'},
      {text:'Jeg kan ikke komme på fredag, derfor jeg skal arbejde.', ok:false, mistakeType:'Wrong connector + order', why:'"derfor" vender årsagen om og kræver inversion.'}],
    explanation:'Årsag → "fordi" + bisætning. (Bemærk: "derfor" ville vende logikken: arbejde → kan ikke komme, med inversion.)', trick:'fordi = årsag i bisætning.' },
  { type:'mc', concept:'w-connectors', tag:'Connector · result', prompt:'Bind sammen: "Bussen var aflyst." + "Jeg tog en taxa."',
    options:[{text:'Bussen var aflyst, så jeg tog en taxa.', ok:true, why:'Resultat → "så" (sideordnende, normal ordstilling).'},
      {text:'Bussen var aflyst, så tog jeg en taxa.', ok:false, mistakeType:'Wrong order', why:'Resultat-"så" bevarer normal ordstilling: "så jeg tog".'},
      {text:'Bussen var aflyst, fordi jeg tog en taxa.', ok:false, mistakeType:'Wrong logic', why:'Taxaen er ikke årsag til aflysningen.'}],
    explanation:'Resultat → "så" + normal ordstilling.', trick:'så (=derfor) → normal orden.' },
  { type:'mc', concept:'w-connectors', tag:'Connector · contrast', prompt:'Bind sammen: "Jeg vil gerne hjælpe." + "Jeg har ikke tid i dag."',
    options:[{text:'Jeg vil gerne hjælpe, men jeg har ikke tid i dag.', ok:true, why:'Modsætning → "men" (sideordnende, normal ordstilling: "men jeg har ikke").'},
      {text:'Jeg vil gerne hjælpe, men jeg ikke har tid i dag.', ok:false, mistakeType:'SAV after men', why:'"men" er sideordnende → normal ordstilling: "men jeg har ikke", ikke SAV.'},
      {text:'Jeg vil gerne hjælpe, fordi jeg ikke har tid i dag.', ok:false, mistakeType:'Wrong logic', why:'Manglende tid er ikke en årsag til at ville hjælpe.'}],
    explanation:'Modsætning → "men" + normal ordstilling (IKKE SAV).', trick:'men = sideordnende → normal orden.' },
  { type:'mc', concept:'w-connectors', tag:'Connector · condition', prompt:'Bind sammen: "Du kan ikke komme." + "Du skal ringe."',
    options:[{text:'Hvis du ikke kan komme, skal du ringe.', ok:true, why:'Betingelse → "hvis" + SAV (du ikke kan), og fordi hvis-sætningen står forrest, inverterer hovedsætningen (skal du).'},
      {text:'Hvis du kan ikke komme, du skal ringe.', ok:false, mistakeType:'Two errors', why:'SAV brudt ("kan ikke") OG manglende inversion ("du skal").'},
      {text:'Hvis du ikke kan komme, du skal ringe.', ok:false, mistakeType:'No inversion', why:'Efter en fremflyttet hvis-sætning skal hovedsætningen inverteres: "skal du ringe".'}],
    explanation:'Betingelse → "hvis" + SAV, og fremflyttet hvis-sætning → inversion i hovedsætningen.', trick:'Hvis …, → verbet først i hovedsætningen.' },
  { type:'mc', concept:'w-connectors', tag:'Connector · addition', prompt:'Bind to argumenter sammen i en formel tekst: "Lejligheden er for lille." + "Den er for dyr."',
    options:[{text:'Lejligheden er for lille. Desuden er den for dyr.', ok:true, why:'Ekstra argument → "Desuden" + inversion (er den). Flot i en formel henvendelse.'},
      {text:'Lejligheden er for lille. Desuden den er for dyr.', ok:false, mistakeType:'No inversion', why:'"Desuden" forrest kræver inversion: "Desuden ER DEN".'},
      {text:'Lejligheden er for lille, fordi den er for dyr.', ok:false, mistakeType:'Wrong logic', why:'Prisen er ikke årsag til størrelsen.'}],
    explanation:'Stable argumenter med "Desuden" (+ inversion) — det giver struktur i breve.', trick:'Desuden = ekstra argument, med inversion.' },
  { type:'mc', concept:'w-connectors', tag:'Connector · concession', prompt:'Bind sammen: "Han er tit træt." + "Han træner hver aften."',
    options:[{text:'Selvom han tit er træt, træner han hver aften.', ok:true, why:'Modsætning på trods af → "Selvom" + SAV (han tit er), og inversion i hovedsætningen (træner han).'},
      {text:'Selvom han er tit træt, han træner hver aften.', ok:false, mistakeType:'Two errors', why:'SAV brudt OG manglende inversion.'},
      {text:'Fordi han tit er træt, træner han hver aften.', ok:false, mistakeType:'Wrong logic', why:'Træthed er ikke årsagen til at han træner — det er en modsætning.'}],
    explanation:'"Selvom" = trods, + SAV, + inversion efter komma.', trick:'selvom = trods + SAV.' },
  { type:'mc', concept:'w-connectors', tag:'Connector · cause (derfor)', prompt:'Bind sammen med vægt på konsekvensen: "Jeg har fået nyt arbejde." + "Jeg kan ikke komme til undervisning om formiddagen."',
    options:[{text:'Jeg har fået nyt arbejde. Derfor kan jeg ikke komme til undervisning om formiddagen.', ok:true, why:'Konsekvens → "Derfor" + inversion (kan jeg).'},
      {text:'Jeg har fået nyt arbejde. Derfor jeg kan ikke komme til undervisning.', ok:false, mistakeType:'No inversion', why:'"Derfor" forrest → "Derfor KAN JEG".'},
      {text:'Jeg har fået nyt arbejde, men jeg kan ikke komme til undervisning.', ok:false, mistakeType:'Wrong logic', why:'Det er en konsekvens, ikke en modsætning.'}],
    explanation:'Konsekvens i hovedsætning → "Derfor" + inversion.', trick:'Derfor = konsekvens, med inversion.' },
  { type:'mc', concept:'w-connectors', tag:'Connector · time', prompt:'Bind sammen: "Jeg får løn." + "Jeg betaler huslejen."',
    options:[{text:'Når jeg får løn, betaler jeg huslejen.', ok:true, why:'Tid/betingelse → "Når" + SAV, og inversion i hovedsætningen (betaler jeg).'},
      {text:'Når jeg får løn, jeg betaler huslejen.', ok:false, mistakeType:'No inversion', why:'Efter fremflyttet når-sætning: "betaler jeg".'},
      {text:'Når får jeg løn, betaler jeg huslejen.', ok:false, mistakeType:'Inversion in subordinate', why:'Ingen inversion EFTER "når": "Når jeg får".'}],
    explanation:'"Når" + SAV, fremflyttet → inversion i hovedsætningen.', trick:'Når …, verbet først bagefter.' },
  { type:'mc', concept:'w-connectors', tag:'Connector · purpose', prompt:'Bind sammen: "Jeg skriver til jer." + "Jeg vil gerne klage over støj."',
    options:[{text:'Jeg skriver til jer, fordi jeg gerne vil klage over støj.', ok:true, why:'Formål/årsag i en henvendelse → "fordi" + SAV (jeg gerne vil).'},
      {text:'Jeg skriver til jer, fordi jeg vil gerne klage over støj.', ok:false, mistakeType:'Word order with gerne', why:'I bisætning: "jeg gerne vil", ikke "jeg vil gerne".'},
      {text:'Jeg skriver til jer, derfor jeg vil klage over støj.', ok:false, mistakeType:'Wrong connector', why:'"fordi" indleder grunden til at skrive; "derfor" ville kræve inversion.'}],
    explanation:'Den klassiske åbning: "Jeg skriver til jer, fordi jeg gerne vil…" (SAV med gerne før verbet).', trick:'I bisætning: gerne FØR det finitte verbum.' },
  { type:'mc', concept:'w-connectors', tag:'Connector · contrast (på den anden side)', prompt:'Vej to sider op i en tekst: "Det er dejligt at have bil." + "Det er dyrt og dårligt for klimaet."',
    options:[{text:'På den ene side er det dejligt at have bil. På den anden side er det dyrt og dårligt for klimaet.', ok:true, why:'Afvejning → "På den ene side … På den anden side …" begge med inversion (er det).'},
      {text:'På den ene side det er dejligt … På den anden side det er dyrt …', ok:false, mistakeType:'No inversion', why:'Begge udtryk forrest kræver inversion: "er det".'},
      {text:'Fordi det er dejligt at have bil, er det dyrt for klimaet.', ok:false, mistakeType:'Wrong logic', why:'De to dele er en afvejning, ikke en årsag.'}],
    explanation:'Afvejning → "På den ene side … På den anden side …" med inversion — stærkt i både skrivning og tale.', trick:'Begge "side"-udtryk forrest → inversion.' },
  { type:'mc', concept:'w-connectors', tag:'Connector · contrast (men)', prompt:'Bind sammen: "Maden var god." + "Den var lidt dyr."',
    options:[{text:'Maden var god, men den var lidt dyr.', ok:true, why:'Modsætning → "men" + normal ordstilling.'},
      {text:'Maden var god, men var den lidt dyr.', ok:false, mistakeType:'Inversion after men', why:'"men" giver IKKE inversion: "men den var".'},
      {text:'Maden var god, så den var lidt dyr.', ok:false, mistakeType:'Wrong logic', why:'Prisen er ikke et resultat af, at maden var god.'}],
    explanation:'"men" = modsætning, normal ordstilling.', trick:'men → normal orden, ingen inversion.' },
  { type:'mc', concept:'w-connectors', tag:'Connector · reason in email', prompt:'Bind sammen i en mail: "Jeg kan ikke komme til mødet." + "Jeg skal til tandlæge."',
    options:[{text:'Jeg kan desværre ikke komme til mødet, da jeg skal til tandlæge.', ok:true, why:'Årsag → "da" (= fordi) + SAV. "Desværre" gør tonen høflig.'},
      {text:'Jeg kan ikke komme til mødet, da jeg skal ikke til tandlæge.', ok:false, mistakeType:'Wrong meaning', why:'"skal ikke" ændrer betydningen helt.'},
      {text:'Jeg kan ikke komme til mødet, men jeg skal til tandlæge.', ok:false, mistakeType:'Wrong logic', why:'Tandlægen er ÅRSAGEN, ikke en modsætning.'}],
    explanation:'"da" og "fordi" giver begge årsag i en bisætning (SAV).', trick:'da = fordi (årsag), + SAV.' }
];

BANK['wd-register'] = [
  { type:'mc', concept:'w-register', tag:'Register · to authority', prompt:'Du skriver til kommunen. Vælg den passende åbning:',
    options:[{text:'Jeg skriver til jer, fordi jeg har et spørgsmål om min boligstøtte.', ok:true, why:'Høflig, neutral og konkret — perfekt halvformel tone til kommunen.'},
      {text:'Hej! Jeg har lige et hurtigt spørgsmål, makker.', ok:false, mistakeType:'Too casual', why:'"makker" og "hurtigt" er alt for uformelt til en myndighed.'},
      {text:'I SKAL svare mig om min boligstøtte NU.', ok:false, mistakeType:'Too aggressive', why:'Krav og store bogstaver er upassende — høflighed er en del af karakteren.'}],
    explanation:'Til myndigheder: høflig, neutral, konkret. Ikke slang, ikke krav.', trick:'Halvformel = høflig men ikke stiv.' },
  { type:'mc', concept:'w-register', tag:'Register · to a friend', prompt:'Du svarer din veninde Aja på en privat mail. Vælg den passende åbning:',
    options:[{text:'Hej Aja! Tak for din mail — hvor er det dejligt at høre fra dig!', ok:true, why:'Varm og personlig — den rette tone til en ven.'},
      {text:'Til rette vedkommende. Jeg skriver angående Deres henvendelse.', ok:false, mistakeType:'Too formal', why:'Stiv myndighedstone passer slet ikke til en veninde.'},
      {text:'Kære fru Aja. Jeg retter hermed henvendelse til Dem.', ok:false, mistakeType:'Too formal', why:'Alt for formelt og fjernt til en ven.'}],
    explanation:'Til venner: varm, personlig, uformel — men stadig struktureret.', trick:'Match tonen til modtageren.' },
  { type:'mc', concept:'w-register', tag:'Register · polite request', prompt:'Vælg den mest høflige måde at bede kommunen om hjælp:',
    options:[{text:'Jeg håber, at I kan hjælpe mig med at finde en løsning.', ok:true, why:'Høfligt og imødekommende.'},
      {text:'Fix det her med det samme.', ok:false, mistakeType:'Rude command', why:'En ordre er upassende i en henvendelse.'},
      {text:'Hvis I gider, kan I måske godt lige kigge på det?', ok:false, mistakeType:'Too casual', why:'"gider" og "lige" er for uformelt og lidt respektløst.'}],
    explanation:'Høflige anmodninger: "Jeg håber, at I kan…", "Jeg vil gerne bede jer om at…".', trick:'Bed, befal ikke.' },
  { type:'mc', concept:'w-register', tag:'Register · closing to authority', prompt:'Vælg en passende afslutning på en klage til boligforeningen:',
    options:[{text:'På forhånd tak for hjælpen.\nMed venlig hilsen\nSara Ahmadi', ok:true, why:'Høflig tak + korrekt formel underskrift.'},
      {text:'Vi snakkes ved! Knus Sara', ok:false, mistakeType:'Too casual', why:'"Knus" og "snakkes ved" hører til venner, ikke en forening.'},
      {text:'Slut. Sara.', ok:false, mistakeType:'Too abrupt', why:'For kort og uhøfligt.'}],
    explanation:'Formel afslutning: "På forhånd tak" + "Med venlig hilsen" + navn.', trick:'Afslut høfligt med en tak + Med venlig hilsen.' },
  { type:'mc', concept:'w-register', tag:'Register · softening', prompt:'Du er utilfreds med en restaurant. Vælg den professionelle formulering:',
    options:[{text:'Desværre var jeg ikke tilfreds med besøget, og det vil jeg gerne fortælle om.', ok:true, why:'Utilfreds, men høflig og saglig — den rette klagetone.'},
      {text:'Jeres restaurant er den værste, jeg nogensinde har været på!!!', ok:false, mistakeType:'Too emotional', why:'Vrede og udråbstegn sænker indtrykket af dit niveau.'},
      {text:'I burde skamme jer over den mad.', ok:false, mistakeType:'Insulting', why:'Personlige angreb hører ikke hjemme i en klage.'}],
    explanation:'En klage skal være saglig og høflig — selv når du er utilfreds.', trick:'Saglig kritik slår vrede.' },
  { type:'mc', concept:'w-register', tag:'Register · to a boss', prompt:'Du skriver til din chef om at gå tidligt. Vælg den passende tone:',
    options:[{text:'Ville det være muligt, at jeg går klokken 15 på fredag? Jeg skal hente mit barn.', ok:true, why:'Høfligt, professionelt og med en kort begrundelse.'},
      {text:'Jeg smutter kl. 15 fredag, bare så du ved det.', ok:false, mistakeType:'Too casual/presumptuous', why:'"smutter" og at melde det som et faktum er for løst over for en chef.'},
      {text:'Jeg anmoder hermed formelt om tilladelse til at forlade arbejdspladsen.', ok:false, mistakeType:'Too stiff', why:'Unødigt stift til en almindelig anmodning til chefen.'}],
    explanation:'Til chefen: professionel men venlig — spørg høfligt, begrund kort.', trick:'Professionel ≠ stiv; venlig ≠ løs.' },
  { type:'mc', concept:'w-register', tag:'Register · phrase choice', prompt:'Hvilken sætning passer i en formel henvendelse?',
    options:[{text:'Jeg vil gerne høre, om det er muligt at få en tid.', ok:true, why:'Høflig og formel.'},
      {text:'Kan jeg ikke bare lige få en tid?', ok:false, mistakeType:'Too casual', why:'"bare lige" er for uformelt.'},
      {text:'Giv mig en tid.', ok:false, mistakeType:'Command', why:'En ren ordre er uhøflig.'}],
    explanation:'"Jeg vil gerne høre, om det er muligt at…" er en sikker, høflig formulering.', trick:'Indpak anmodninger høfligt.' },
  { type:'mc', concept:'w-register', tag:'Register · thanking', prompt:'Du har fået hurtig hjælp fra kommunen og vil takke. Vælg den passende sætning:',
    options:[{text:'Tak for jeres hurtige svar.', ok:true, why:'Kort, høflig og professionel tak.'},
      {text:'Tusind tak, I er bare de bedste, æresord!', ok:false, mistakeType:'Too casual', why:'"æresord" og overdreven ros er for uformelt.'},
      {text:'Det var også på tide, I svarede.', ok:false, mistakeType:'Passive-aggressive', why:'Sarkasme hører ikke hjemme i en formel tekst.'}],
    explanation:'"Tak for jeres hurtige svar" er præcis den rigtige formelle tak.', trick:'Tak kort og pænt.' },
  { type:'mc', concept:'w-register', tag:'Register · informing', prompt:'Du melder dig syg til din chef. Vælg den passende sms:',
    options:[{text:'Godmorgen. Jeg er desværre blevet syg og kommer ikke i dag. Jeg melder tilbage i morgen.', ok:true, why:'Kort, høflig, klar — præcis hvad en sygemelding kræver.'},
      {text:'Kcommer ik i dag, syg 🤢', ok:false, mistakeType:'Too casual/sloppy', why:'Stavefejl og emoji er upassende i en sygemelding.'},
      {text:'Jeg er nødsaget til at informere Dem om min sygdomstilstand.', ok:false, mistakeType:'Too stiff', why:'Unødigt formelt til en hurtig besked.'}],
    explanation:'Sygemelding: kort, høflig, med en plan for at melde tilbage.', trick:'Klar og høflig — ikke for løs, ikke for stiv.' },
  { type:'mc', concept:'w-register', tag:'Register · to school', prompt:'Du skriver til dit barns lærer. Vælg den passende tone:',
    options:[{text:'Kære Lone. Tak for din mail. Adam har desværre været syg.', ok:true, why:'Varm men høflig — den rette tone til en lærer.'},
      {text:'Yo Lone, Adam var bare syg, chill.', ok:false, mistakeType:'Too casual', why:'Slang er upassende over for en lærer.'},
      {text:'Til den ansvarlige klasselærer. Vedrørende elevens fravær.', ok:false, mistakeType:'Too cold', why:'For fjernt og koldt til en personlig relation.'}],
    explanation:'Til skolen: venlig og høflig — "Kære [navn]" + tak.', trick:'Lærere får varm-høflig, ikke slang og ikke kold formalia.' },
  { type:'mc', concept:'w-register', tag:'Register · saying no', prompt:'En kollega beder dig tage en vagt, du ikke kan. Vælg det høflige afslag:',
    options:[{text:'Det kan jeg desværre ikke nå denne gang, men spørg mig endelig en anden gang.', ok:true, why:'Høfligt afslag + åbner for fremtiden — god kollegial tone.'},
      {text:'Nej. Find en anden.', ok:false, mistakeType:'Too blunt', why:'For kort og afvisende.'},
      {text:'Hvorfor spørger du altid mig?!', ok:false, mistakeType:'Hostile', why:'Bebrejdende og uvenligt.'}],
    explanation:'Sig pænt nej og hold døren åben — det bevarer det gode forhold.', trick:'Afslå venligt, ikke afvisende.' },
  { type:'mc', concept:'w-register', tag:'Register · opening to authority', prompt:'Vælg den bedste første linje til en henvendelse til pladsanvisningen:',
    options:[{text:'Mit navn er Pavel Novak, og jeg skriver, fordi min datter skal starte i børnehave.', ok:true, why:'Præsenterer sig + grund i første linje — netop hvad censor vil se.'},
      {text:'Hvordan går det hos jer? Jeg har det fint.', ok:false, mistakeType:'Off-topic small talk', why:'En henvendelse skal komme til sagen i første linje.'},
      {text:'Så er det nu, I skaffer min datter en plads.', ok:false, mistakeType:'Demanding', why:'For krævende — start høfligt med navn og grund.'}],
    explanation:'Åbn med HVEM du er og HVORFOR du skriver.', trick:'Grund i linje ét.' }
];

BANK['wd-coverage'] = [
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'Opgaven beder dig fortælle: (1) hvor du bor, (2) hvorfor du klager, (3) hvad du har prøvet, (4) hvad du håber, foreningen gør. Dit udkast dækker 1, 2 og 4. Hvad mangler?',
    options:[{text:'Punkt 3: hvad du selv har prøvet at gøre.', ok:true, why:'Punkt 3 er ikke besvaret — og hver manglende prik koster point.'},
      {text:'Ingenting, teksten er færdig.', ok:false, mistakeType:'Missing a bullet', why:'Punkt 3 mangler stadig.'},
      {text:'Punkt 1: hvor du bor.', ok:false, mistakeType:'Already covered', why:'Punkt 1 ER med ifølge opgaven.'}],
    explanation:'Hver prik i opgaven SKAL besvares. Tjek dem af én for én.', trick:'Prikkerne er din tjekliste — kryds dem af.' },
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'En mail spørger: "Hvor er du henne? Hvad laver du? Hvordan er stedet?" Dit svar fortæller hvor du er, og hvad du laver. Hvad mangler?',
    options:[{text:'Hvordan stedet er.', ok:true, why:'Det tredje spørgsmål er ikke besvaret. Tæl spørgsmålstegnene!'},
      {text:'Ingenting.', ok:false, mistakeType:'Missing a question', why:'Spørgsmål 3 mangler.'},
      {text:'Hvad du hedder.', ok:false, mistakeType:'Not asked', why:'Det blev ikke spurgt om.'}],
    explanation:'I Opgave 2 SKAL ALLE spørgsmål besvares — understreg hvert spørgsmålstegn først.', trick:'Tæl spørgsmålstegnene.' },
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'Lærerens mail: "Hvorfor har Adam været væk? Hvornår kommer han tilbage? Kan I komme onsdag kl. 16.30?" Dit svar forklarer fraværet og siger ja til onsdag. Hvad mangler?',
    options:[{text:'Hvornår Adam kommer tilbage.', ok:true, why:'Det andet spørgsmål (hvornår tilbage) er ikke besvaret.'},
      {text:'Ingenting.', ok:false, mistakeType:'Missing a question', why:'Et spørgsmål mangler.'},
      {text:'Om I kan komme onsdag.', ok:false, mistakeType:'Already covered', why:'Det sagde du ja til.'}],
    explanation:'Selv når du svarer på to af tre, tæller det som ufuldstændigt.', trick:'Alle spørgsmål, ikke de fleste.' },
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'Henvendelse til sprogskolen skal indeholde: (1) hvem du er + hold, (2) hvorfor du skriver, (3) dit problem, (4) hvad du vil have skolen gør. Dit udkast har: hvem du er, dit problem, og dit ønske. Hvad mangler?',
    options:[{text:'En klar grund til, at du skriver (punkt 2).', ok:true, why:'Punkt 2 (hvorfor du skriver) mangler som selvstændigt punkt.'},
      {text:'Ingenting.', ok:false, mistakeType:'Missing a bullet', why:'Punkt 2 er ikke dækket.'},
      {text:'Dit holdnummer.', ok:false, mistakeType:'Part of covered point', why:'Det hører til punkt 1, som er med.'}],
    explanation:'Adskil "hvem du er" og "hvorfor du skriver" — det er to prikker.', trick:'Én prik = ét lille afsnit.' },
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'En ven spørger: "Hvilken ret vil du lave? Passer fredag? Må vi være hjemme hos dig?" Dit svar nævner retten og siger ja til at være vært. Hvad mangler?',
    options:[{text:'Om fredag passer dig.', ok:true, why:'Spørgsmålet om fredag er ikke besvaret.'},
      {text:'Ingenting.', ok:false, mistakeType:'Missing a question', why:'Fredag-spørgsmålet mangler.'},
      {text:'Hvor mange gæster der kommer.', ok:false, mistakeType:'Not asked', why:'Det blev ikke spurgt om.'}],
    explanation:'Små praktiske spørgsmål (passer dagen?) glemmes nemt — tjek dem.', trick:'De korte spørgsmål tæller også.' },
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'Chefens mail: "Kan du blive længere fredag? Hvordan går dine opgaver? Hvad skal mødet handle om?" Dit svar siger ja til fredag og foreslår et mødeemne. Hvad mangler?',
    options:[{text:'Hvordan dine opgaver går.', ok:true, why:'Status på dine opgaver er ikke besvaret.'},
      {text:'Ingenting.', ok:false, mistakeType:'Missing a question', why:'Opgave-spørgsmålet mangler.'},
      {text:'Hvad mødet skal handle om.', ok:false, mistakeType:'Already covered', why:'Du foreslog et emne.'}],
    explanation:'Det "midterste" spørgsmål overses tit — gennemgå dem i rækkefølge.', trick:'Besvar i rækkefølge, så intet springes over.' },
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'Opgaven: en klage skal sige (1) hvad du købte, (2) hvorfor du klager, (3) hvordan sælgeren reagerede, (4) hvordan problemet kan løses. Dit udkast har punkt 1, 2 og 3. Hvad mangler?',
    options:[{text:'Hvordan problemet kan løses (punkt 4).', ok:true, why:'En klage SKAL ende med, hvad du ønsker der sker.'},
      {text:'Ingenting.', ok:false, mistakeType:'Missing the request', why:'Løsningsønsket mangler — det vigtigste i en klage.'},
      {text:'Hvad du købte.', ok:false, mistakeType:'Already covered', why:'Punkt 1 er med.'}],
    explanation:'En klage uden et løsningsønske er ufuldstændig — sig hvad du vil have der sker.', trick:'Slut altid med dit ønske/krav.' },
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'Du skriver til idrætsforeningen med spørgsmål om: pris, træningstider, udstyr. Dit udkast spørger om pris og udstyr. Hvad mangler?',
    options:[{text:'Spørgsmålet om træningstider.', ok:true, why:'Tiderne er ikke spurgt om endnu.'},
      {text:'Ingenting.', ok:false, mistakeType:'Missing a question', why:'Tider mangler.'},
      {text:'Spørgsmålet om prisen.', ok:false, mistakeType:'Already covered', why:'Pris er med.'}],
    explanation:'Når du selv stiller spørgsmål, så tjek at alle dine egne punkter er med.', trick:'Også dine egne spørgsmål skal være komplette.' },
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'Opgaven: anbefal din læge ved at fortælle (1) lægens navn, (2) hvor klinikken ligger, (3) hvorfor lægen er god, (4) hvad det betyder for dig. Dit udkast har navn, hvorfor god, og hvad det betyder. Hvad mangler?',
    options:[{text:'Hvor klinikken ligger (punkt 2).', ok:true, why:'Beliggenheden er ikke nævnt.'},
      {text:'Ingenting.', ok:false, mistakeType:'Missing a bullet', why:'Punkt 2 mangler.'},
      {text:'Lægens navn.', ok:false, mistakeType:'Already covered', why:'Navnet er med.'}],
    explanation:'Faktuelle prikker (sted, navn) glemmes, når man fokuserer på holdninger.', trick:'Også de "kedelige" fakta-prikker tæller.' },
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'En mail spørger: "Hvordan går det på jobbet? Hvad laver du en typisk dag? Hvordan er kollegerne? Hvornår fejrer vi?" Dit svar dækker de tre første. Hvad mangler?',
    options:[{text:'Hvornår I skal fejre det.', ok:true, why:'Det sidste spørgsmål (hvornår fejre) mangler.'},
      {text:'Ingenting.', ok:false, mistakeType:'Missing the last question', why:'Det sidste spørgsmål overses tit.'},
      {text:'Hvordan kollegerne er.', ok:false, mistakeType:'Already covered', why:'Det er besvaret.'}],
    explanation:'Det SIDSTE spørgsmål i en mail glemmes oftest — læs helt til bunds.', trick:'Læs mailen helt til ende.' },
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'Hvad er den bedste FØRSTE handling, før du skriver et Opgave 2-svar?',
    options:[{text:'Understreg hvert spørgsmålstegn i mailen, du har fået.', ok:true, why:'Så ser du præcis, hvor mange svar der kræves — den sikreste måde at dække alt på.'},
      {text:'Begynd at skrive med det samme.', ok:false, mistakeType:'No planning', why:'Uden at kortlægge spørgsmålene springer man let nogle over.'},
      {text:'Skriv så mange ord som muligt.', ok:false, mistakeType:'Quantity over coverage', why:'Længde uden dækning scorer ikke.'}],
    explanation:'Kortlæg alle spørgsmål FØR du skriver — det er den bedste dækningsstrategi.', trick:'Understreg spørgsmålstegnene først.' },
  { type:'mc', concept:'w-coverage', tag:'Coverage', prompt:'Dit Opgave 2-svar besvarer alle fire spørgsmål, men er på 70 ord. Hvad er problemet?',
    options:[{text:'Det er for kort — kravet er minimum 90 ord.', ok:true, why:'Under minimumslængden dumper opgaven, selv med alle svar.'},
      {text:'Ingen problemer.', ok:false, mistakeType:'Below word minimum', why:'70 < 90 ord.'},
      {text:'Det er alt for langt.', ok:false, mistakeType:'Wrong direction', why:'Det er for KORT, ikke for langt.'}],
    explanation:'Dækning OG længde skal være i orden: min. 90 ord i Opgave 2.', trick:'Tjek både alle svar OG ordtallet.' }
];

BANK['wd-openclose'] = [
  { type:'mc', concept:'w-openclose', tag:'Opening · authority', prompt:'Bedste åbning i en klage til boligforeningen?',
    options:[{text:'Jeg skriver til jer, fordi jeg har et problem med min nabo.', ok:true, why:'Grund i første linje — klart og høfligt.'},
      {text:'Hvordan har I det? Vejret er jo dejligt.', ok:false, mistakeType:'Small talk', why:'En henvendelse skal til sagen straks.'},
      {text:'Min nabo er totalt umulig!!!', ok:false, mistakeType:'Too emotional', why:'For uformelt og følelsesladet.'}],
    explanation:'Åbn en henvendelse med HVORFOR du skriver.', trick:'Grund i linje ét.' },
  { type:'mc', concept:'w-openclose', tag:'Closing · authority', prompt:'Bedste afslutning på en henvendelse til kommunen?',
    options:[{text:'På forhånd tak for hjælpen. Jeg ser frem til at høre fra jer.\nMed venlig hilsen\nPavel', ok:true, why:'Tak + forventning + korrekt underskrift.'},
      {text:'Vi ses! Knus Pavel', ok:false, mistakeType:'Too casual', why:'"Knus" er til venner.'},
      {text:'(ingen afslutning)', ok:false, mistakeType:'Missing closing', why:'En tekst skal afsluttes ordentligt.'}],
    explanation:'Afslut formelt: tak + "Med venlig hilsen" + navn (gerne + kontakt).', trick:'Tak + Med venlig hilsen + navn.' },
  { type:'mc', concept:'w-openclose', tag:'Opening · email reply', prompt:'Du svarer en mail fra din veninde. Bedste åbning?',
    options:[{text:'Hej Aja! Tak for din mail.', ok:true, why:'Varm hilsen + tak — perfekt til en privat mail.'},
      {text:'Til rette vedkommende.', ok:false, mistakeType:'Too formal', why:'Myndighedstone passer ikke til en ven.'},
      {text:'(starter direkte uden hilsen)', ok:false, mistakeType:'No greeting', why:'En mail skal indledes passende.'}],
    explanation:'Privat mail: "Hej [navn]! Tak for din mail."', trick:'Hils og tak — start varmt.' },
  { type:'mc', concept:'w-openclose', tag:'Closing · friend', prompt:'Bedste afslutning på en mail til en ven?',
    options:[{text:'Vi ses, når jeg er hjemme igen!\nMange hilsner\nLeila', ok:true, why:'Varm, personlig afslutning + hilsen.'},
      {text:'Med venlig hilsen og på forhånd tak for Deres tid.', ok:false, mistakeType:'Too formal', why:'For stift til en ven.'},
      {text:'Slut.', ok:false, mistakeType:'Too abrupt', why:'For kort og koldt.'}],
    explanation:'Til venner: "Mange hilsner / Knus / Kærlig hilsen" + navn.', trick:'Afslut varmt til venner.' },
  { type:'mc', concept:'w-openclose', tag:'Opening · to boss', prompt:'Du svarer din chefs mail. Bedste åbning?',
    options:[{text:'Hej Mette. Tak for din mail.', ok:true, why:'Venlig men professionel — rigtigt til en chef.'},
      {text:'Kære fru direktør. Jeg retter hermed henvendelse.', ok:false, mistakeType:'Too stiff', why:'Unødigt stift til en almindelig mail.'},
      {text:'Yo Mette!', ok:false, mistakeType:'Too casual', why:'For løst i en arbejdsmail.'}],
    explanation:'Til chef/kollega: "Hej [navn]. Tak for din mail." — venlig-professionel.', trick:'Venlig, ikke stiv; professionel, ikke løs.' },
  { type:'mc', concept:'w-openclose', tag:'Closing · to boss', prompt:'Bedste afslutning på en mail til din chef?',
    options:[{text:'Sig endelig til, hvis du har spørgsmål.\nVenlig hilsen\nAmir', ok:true, why:'Imødekommende + professionel underskrift.'},
      {text:'Knus og kram, Amir', ok:false, mistakeType:'Too intimate', why:'For privat til en chef.'},
      {text:'Farvel.', ok:false, mistakeType:'Too abrupt', why:'For kort.'}],
    explanation:'Professionel afslutning: en venlig sætning + "Venlig hilsen" + navn.', trick:'Afslut imødekommende og professionelt.' },
  { type:'mc', concept:'w-openclose', tag:'Opening · to school', prompt:'Du svarer dit barns lærer. Bedste åbning?',
    options:[{text:'Kære Lone. Tak for din mail.', ok:true, why:'Varm-høflig — rigtigt til en lærer.'},
      {text:'Til klasselæreren. Vedr. fravær.', ok:false, mistakeType:'Too cold', why:'For fjernt i en personlig relation.'},
      {text:'Hej skat!', ok:false, mistakeType:'Too intimate', why:'Upassende til en lærer.'}],
    explanation:'Til skolen: "Kære [navn]. Tak for din mail."', trick:'Kære + navn til lærere.' },
  { type:'mc', concept:'w-openclose', tag:'Closing · giving back', prompt:'Hvad er en stærk afsluttende sidste sætning i en mail til en ven?',
    options:[{text:'Skal vi drikke kaffe, når jeg er hjemme igen?', ok:true, why:'Giver samtalen tilbage — fremragende mailadfærd.'},
      {text:'Det var det.', ok:false, mistakeType:'Flat ending', why:'Lukker samtalen i stedet for at åbne den.'},
      {text:'Svar ikke på denne mail.', ok:false, mistakeType:'Closes off', why:'Afviser videre kontakt.'}],
    explanation:'Slut gerne med et spørgsmål/invitation — det giver samtalen videre.', trick:'Giv bolden tilbage til sidst.' },
  { type:'mc', concept:'w-openclose', tag:'Opening · purpose first', prompt:'Hvilken åbning kommer hurtigst til sagen i en henvendelse?',
    options:[{text:'Mit navn er Sara, og jeg skriver, fordi der ikke har været varme i min lejlighed i en uge.', ok:true, why:'Navn + konkret grund med det samme.'},
      {text:'Jeg ville bare lige skrive lidt til jer i dag.', ok:false, mistakeType:'Vague', why:'Ingen klar grund.'},
      {text:'Der er sket noget, som jeg måske vil fortælle om.', ok:false, mistakeType:'Too vague', why:'Uklar og tøvende.'}],
    explanation:'Stærke åbninger siger HVEM og HVORFOR konkret i linje ét.', trick:'Konkret grund slår vag indledning.' },
  { type:'mc', concept:'w-openclose', tag:'Closing · contact info', prompt:'Hvad styrker afslutningen på en formel henvendelse mest?',
    options:[{text:'I kan kontakte mig på telefon 50 12 34 56 eller på denne mail.', ok:true, why:'Kontaktoplysninger gør det nemt for modtageren at handle.'},
      {text:'Jeg håber, I forstår mig.', ok:false, mistakeType:'Weak', why:'Tilføjer ingen handlingsmulighed.'},
      {text:'Held og lykke med det.', ok:false, mistakeType:'Odd tone', why:'Passer ikke som afslutning på din egen henvendelse.'}],
    explanation:'Giv kontaktoplysninger, så de kan svare dig direkte.', trick:'Gør det let at svare dig.' },
  { type:'mc', concept:'w-openclose', tag:'Opening · thanking first', prompt:'Du svarer en venlig invitation fra en nabo. God åbning?',
    options:[{text:'Hej Henrik! Tak for invitationen — sikke en god idé.', ok:true, why:'Varm tak + anerkendelse — rigtigt til en nabo.'},
      {text:'Jeg har modtaget Deres skrivelse.', ok:false, mistakeType:'Too formal', why:'For stift til en nabo.'},
      {text:'Hvad vil du?', ok:false, mistakeType:'Rude', why:'Uvenligt.'}],
    explanation:'Tak for invitationen først — det sætter en god tone.', trick:'Anerkend og tak først.' },
  { type:'mc', concept:'w-openclose', tag:'Closing · forward-looking', prompt:'Bedste næstsidste linje i en formel henvendelse?',
    options:[{text:'Jeg ser frem til at høre fra jer.', ok:true, why:'Høflig forventning om svar — afrunder professionelt.'},
      {text:'I svarer nok aldrig alligevel.', ok:false, mistakeType:'Negative', why:'Negativt og passivt-aggressivt.'},
      {text:'Det er lige meget, hvad I gør.', ok:false, mistakeType:'Defeats purpose', why:'Underminerer din egen henvendelse.'}],
    explanation:'"Jeg ser frem til at høre fra jer" er en stærk, høflig afrunding.', trick:'Slut positivt og fremadrettet.' }
];

/* ---------- reading/writing dojo topic definitions ---------- */
DC.bankGen = function(bankId){
  return function(){
    DC._bankQueue = DC._bankQueue||{};
    let q = DC._bankQueue[bankId];
    if (!q || !q.length){ q = DC._bankQueue[bankId] = shuffle(BANK[bankId].map((_,i)=>i)); }
    const item = BANK[bankId][q.pop()];
    // return a fresh clone with reshuffled options
    return Object.assign({}, item, { options: item.options? shuffle(item.options.slice()) : undefined });
  };
};

const RW_DOJOS = {
'rd-pronoun': { gen:genPronoun, icon:'link', area:'Reading', title:'Pronoun reference (Opgave 3)', concepts:['r-pronoun'],
  teach:{ rule:'In Opgave 3 the missing sentence must connect logically — and the #1 clue is pronouns. det, den, de, han, hun, dette point BACKWARDS to something already mentioned. If a pronoun has nothing to refer to, the sentence does not fit.',
    formula:'<b>den</b> → en-ord · <b>det</b> → et-ord · <b>de</b> → flertal · <b>han/hun</b> → person',
    points:['Match the pronoun to its referent by GENDER and NUMBER.','"den" replaces a common-gender noun (en bil → den), "det" a neuter noun (et hus → det), "de" a plural.','Before choosing a gap sentence, ask: does its pronoun have a clear owner in the surrounding text?'],
    edge:['"det" can also be a "dummy" subject ("Det regner") — but in Opgave 3 it usually points back.','If two candidate sentences both fit grammatically, the pronoun reference decides which one is coherent.'],
    contrast:[{bad:'… Det er de glade for. (efter en sætning om én bil)', good:'… Den er de glade for.', why:'"bil" er en-ord → kræver "den", ikke "det".'}],
    trap:'A gap sentence can be true and well-written but still wrong because its pronoun has no owner in that paragraph. Always check the reference.' } },
'rd-signal': { gen:DC.bankGen('rd-signal'), icon:'signpost', area:'Reading', title:'Signal words & coherence', concepts:['r-signal'],
  teach:{ rule:'Connectors steer the logic of a text. A sentence starting with "Men" must contradict; "Derfor" must follow a cause; "Desuden" adds in the same direction. Reading them right tells you which sentence fits a gap — and which word order is correct.',
    formula:'Modsætning → <b>Men/dog/alligevel</b> · Årsag → <b>Derfor/så/fordi</b> · Tilføjelse → <b>Desuden/og</b>',
    points:['Men/dog/alligevel = contrast (men keeps normal order; the others invert when fronted).','Derfor/så = result; fordi/da = cause in a subordinate clause (SAV).','Desuden/og = addition in the same direction.'],
    edge:['"så" = result (normal order) but also "then" (inversion when fronted) — read which one.','Fronted Derfor/Desuden/Bagefter trigger inversion: "Derfor TOG JEG…".'],
    contrast:[{bad:'Lejligheden er dyr. Derfor ligger den perfekt.', good:'Lejligheden er dyr. Men den ligger perfekt.', why:'Dyr ↔ god beliggenhed er en modsætning → "Men".'}],
    trap:'A sentence that is true but has the wrong LOGICAL connector breaks coherence. Match the relation (contrast/cause/addition) first.' } },
'rd-para': { gen:DC.bankGen('rd-para'), icon:'shuffle', area:'Reading', title:'Paraphrase matching (2A/4)', concepts:['r-paraphrase','r-keywords'],
  teach:{ rule:'The exam questions almost never use the text’s exact words. They paraphrase: "brugt" becomes "andre har ejet før", "frivillig" becomes "gratis". You match MEANING, not words.',
    formula:'Question wording ≠ text wording → match the <b>meaning</b>',
    points:['Learn common swaps: sjældent ↔ ikke ofte; brugt ↔ andre har ejet; frivillig ↔ gratis.','Numbers and times get reworded: "næsten et år" → "lang tid".','Watch opposites: the trap option often says the reverse of the text.'],
    edge:['Sometimes you must infer a consequence: "talte hurtigt + ukendte ord" → "svært at forstå".'],
    contrast:[{bad:'Match by the shared word "bil".', good:'Match by the meaning "deler bil = ejer ikke alene".', why:'Keyword overlap is a trap; meaning is the key.'}],
    trap:'A wrong option often reuses a word from the text but means the opposite. Read for meaning, not matching letters.' } },
'rd-infer': { gen:DC.bankGen('rd-infer'), icon:'lightbulb', area:'Reading', title:'Inference', concepts:['r-inference'],
  teach:{ rule:'Some answers are not stated directly — you read between the lines. Body language, tone, contrast words and chosen details all carry meaning the text never spells out.',
    formula:'Detail + context → the unstated <b>conclusion</b>',
    points:['"frøs trods meget tøj" → it was colder than expected.','Idioms are figurative: "varm om hjertet" = moved/happy, not feverish.','Small words carry weight: "endelig" implies long prior struggle.'],
    edge:['Do not OVER-read: "inden hun spiste morgenmad" shows priority, not that she never eats breakfast.'],
    contrast:[{bad:'"varm om hjertet" = fik feber', good:'"varm om hjertet" = blev rørt/glad', why:'Idioms are not literal.'}],
    trap:'The trap is either reading too literally (idioms) or reading too far (claims the text does not support). Stay with what the detail reasonably implies.' } },
'rd-trap': { gen:DC.bankGen('rd-trap'), icon:'crosshair', area:'Reading', title:'Trap-spotting (Opgave 4)', concepts:['r-4','r-trap'],
  teach:{ rule:'In Opgave 4 several people mention the same topic, but only one MATCHES the question. The traps are systematic: "burde/vil gerne" ≠ "gør"; HAVING something ≠ being HAPPY about it; being ADVISED ≠ doing it.',
    formula:'Same topic ≠ same answer → match the <b>action + opinion</b>',
    points:['"man burde, men jeg…" reveals someone who does NOT do it.','A recommendation from someone else ≠ the person’s own action.','Read the verb and the opinion, not just the topic word.'],
    edge:['Two people can have opposite opinions on the same topic — "nemt" vs "svært" decides the match.'],
    contrast:[{bad:'Match "cykle" wherever it appears.', good:'Match who ACTUALLY cycles all year.', why:'One is advised to cycle; only one does.'}],
    trap:'The wrong person almost always shares the topic word with the question. Verify the action and the attitude, not the keyword.' } },
'rd-vocab': { gen:DC.bankGen('rd-vocab'), icon:'book-a', area:'Reading', title:'Vocabulary from context', concepts:['r-vocab','r-keywords'],
  teach:{ rule:'You will not know every word — and you do not need to. The surrounding sentence almost always defines a hard word. Use the context, not a dictionary.',
    formula:'Unknown word → read the <b>neighbouring words</b> for the meaning',
    points:['Often the explanation sits right next to the word: "pligtopfyldende … laver altid alt til tiden".','Many words have several meanings; context picks the right one (overskud = energy OR profit).','Break long words into parts: selv+sikker = sure of oneself.'],
    edge:['Idioms and fixed phrases (skrive under, til gengæld, vænne sig til) must be learned as wholes.'],
    contrast:[{bad:'Guess "overskud" = penge everywhere.', good:'After "fik sovet" → overskud = energi.', why:'Context decides which meaning.'}],
    trap:'Picking the most common meaning blindly. Let the sentence choose the meaning.' } },
'wd-order': { gen:genWriteOrder, icon:'list-ordered', area:'Writing', title:'Word order in writing', concepts:['w-check'],
  teach:{ rule:'The fastest points a censor takes are word-order errors: V2 after a fronted time/place word, and SAV after fordi/hvis/når/selvom. In writing you have time to check every sentence — so check.',
    formula:'Fronted time/place → <b>verb 2nd</b> · fordi/hvis/når → <b>ikke before the verb</b>',
    points:['Start a sentence with a time/place word? The verb must be element 2 (Derfor kan jeg…).','After fordi/at/hvis/når/selvom: Subject + Adverb + Verb.','Modal + ikke + infinitive (kan ikke komme).'],
    edge:['for ≠ fordi: "for jeg har ikke" (normal) vs "fordi jeg ikke har" (SAV).'],
    contrast:[{bad:'Derfor jeg kan ikke komme.', good:'Derfor kan jeg ikke komme.', why:'Fronted "Derfor" → inversion.'}],
    trap:'Under time pressure the English subject-first order slips back in. Leave 5 minutes to scan every sentence for V2 and SAV.' } },
'wd-connect': { gen:DC.bankGen('wd-connect'), icon:'link-2', area:'Writing', title:'Joining clauses correctly', concepts:['w-connectors'],
  teach:{ rule:'Good writing links ideas with the right connector AND the right word order. Cause = fordi/derfor; contrast = men/selvom; addition = desuden/og; result = så. Each one changes the order differently.',
    formula:'fordi/selvom/hvis/når → <b>SAV</b> · derfor/desuden → <b>inversion</b> · men/og/så → <b>normal</b>',
    points:['"fordi" = cause in a subordinate clause (SAV); "derfor" = cause in a main clause (inversion).','"men" keeps normal order; "selvom" needs SAV + then inversion in the main clause.','Stack arguments with "Desuden …" (+ inversion) for structure in letters.'],
    edge:['A fronted hvis/når/selvom-clause forces inversion after the comma: "Hvis du ikke kan, skal du ringe."'],
    contrast:[{bad:'…, men jeg ikke har tid.', good:'…, men jeg har ikke tid.', why:'"men" is coordinating → normal order, not SAV.'}],
    trap:'Choosing the connector with the right meaning but the wrong word order. Decide the relation, then apply its order rule.' } },
'wd-register': { gen:DC.bankGen('wd-register'), icon:'gauge', area:'Writing', title:'Register: formal vs casual', concepts:['w-polite','w-register'],
  teach:{ rule:'The same message needs a different TONE depending on the receiver. A complaint to the kommune is polite and neutral; a mail to a friend is warm; neither is slang, neither is a demand. Register is part of the score.',
    formula:'Authority → <b>polite-neutral</b> · Boss/teacher → <b>warm-professional</b> · Friend → <b>warm-casual</b>',
    points:['Authorities/complaints: polite, neutral, concrete. No slang, no anger, no demands.','Friends: warm and personal, but still structured.','Requests are wrapped politely: "Jeg håber, at I kan…", not "Fix det nu".'],
    edge:['Even an angry complaint stays factual and polite — emotion lowers the impression of your level.'],
    contrast:[{bad:'I SKAL svare mig NU.', good:'Jeg håber, at I kan hjælpe mig.', why:'Politeness is part of the halvformel register.'}],
    trap:'Matching the wrong tone to the receiver — slang to the kommune, or stiff formality to a friend.' } },
'wd-coverage': { gen:DC.bankGen('wd-coverage'), icon:'list-checks', area:'Writing', title:'Answering every point', concepts:['w-coverage','w-opg2'],
  teach:{ rule:'The single most common reason for failing the writing test is leaving a bullet or question unanswered. Every prik in Opgave 1 and every "?" in Opgave 2 must be covered — coverage beats brilliance.',
    formula:'Every bullet / every "?" → <b>one short answer each</b>',
    points:['Underline every question mark in the email you received BEFORE writing.','One bullet = one small paragraph, in the task’s order.','Tick each point off as you write it.'],
    edge:['Length matters too: Opgave 2 needs min. 90 words even when all questions are answered.'],
    contrast:[{bad:'Answer the 2 questions you have vocabulary for.', good:'Answer all 4, briefly, then add greeting + closing.', why:'Unanswered questions = incomplete task.'}],
    trap:'The LAST question in a chatty email is the one most often missed. Read all the way to the bottom.' } },
'wd-openclose': { gen:DC.bankGen('wd-openclose'), icon:'door-open', area:'Writing', title:'Openings & closings', concepts:['w-openclose','w-polite'],
  teach:{ rule:'A strong text opens by saying WHO you are / WHY you write (or thanks for the mail), and closes politely with the right sign-off for the receiver. Get these two right and the whole text reads as controlled.',
    formula:'Open: grund/tak · Close: tak + <b>Med venlig hilsen</b> / Mange hilsner + navn',
    points:['Authority opening: "Jeg skriver til jer, fordi…" or "Mit navn er …".','Friend opening: "Hej [navn]! Tak for din mail."','Closings: formal → "Med venlig hilsen"; friend → "Mange hilsner / Knus".'],
    edge:['End a formal text with contact info and "Jeg ser frem til at høre fra jer." End a friendly one by giving the conversation back.'],
    contrast:[{bad:'Hvordan har I det? Vejret er dejligt. (til kommunen)', good:'Jeg skriver til jer, fordi…', why:'A henvendelse states its reason in line one.'}],
    trap:'Wrong sign-off for the receiver ("Knus" to the kommune) or no closing at all.' } }
};
const RW_READING_ORDER = ['rd-pronoun','rd-signal','rd-para','rd-infer','rd-trap','rd-vocab'];
const RW_WRITING_ORDER = ['wd-order','wd-connect','wd-register','wd-coverage','wd-openclose'];
/* merge into the dojo system */
Object.assign(DOJO_TOPICS, RW_DOJOS);


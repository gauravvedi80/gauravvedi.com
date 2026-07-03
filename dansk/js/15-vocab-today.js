/* Dansk Coach — js/15-vocab-today.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   ORDFORRÅD — vocabulary tab: mini-dictionary + spaced-repetition
   flashcards + quick test. Exam-high-yield core for DU3 Modul 3.3.
   Every entry: gender + full forms + real example + collocation + note.
   ===================================================================== */

const VOCAB_THEMES = [
  {k:'health',  t:'Sundhed & vaner',        e:'🥗'},
  {k:'green',   t:'Grønne vaner & miljø',   e:'🌱'},
  {k:'lang',    t:'At lære dansk',          e:'🗣️'},
  {k:'work',    t:'Arbejde & job',          e:'💼'},
  {k:'shop',    t:'Indkøb & penge',         e:'🛒'},
  {k:'home',    t:'Hjem & hverdag',         e:'🏠'},
  {k:'body',    t:'Krop, sygdom & læge',    e:'🩺'},
  {k:'feel',    t:'Følelser & holdninger',  e:'💬'},
  {k:'time',    t:'Tid, sted & mængde',     e:'🕐'},
  {k:'formal',  t:'Formelle brevvendinger', e:'✉️'},
  {k:'connect', t:'Forbindere & meninger',  e:'🔗'},
  {k:'custom',  t:'Importeret (LLM)',       e:'✨'}
];
const VOCAB_POS = {
  sb:{da:'substantiv', en:'noun', c:'text-sky-300 bg-sky-500/10 border-sky-500/30'},
  vb:{da:'udsagnsord', en:'verb', c:'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'},
  adj:{da:'tillægsord', en:'adjective', c:'text-amber-300 bg-amber-500/10 border-amber-500/30'},
  adv:{da:'biord', en:'adverb', c:'text-violet-300 bg-violet-500/10 border-violet-500/30'},
  udtryk:{da:'udtryk', en:'phrase', c:'text-rose-300 bg-rose-500/10 border-rose-500/30'},
  forb:{da:'forbinder', en:'connector', c:'text-indigo-300 bg-indigo-500/10 border-indigo-500/30'},
  prep:{da:'forholdsord', en:'preposition', c:'text-teal-300 bg-teal-500/10 border-teal-500/30'}
};

/* v(da, en, pos, gender, forms, theme, examples[[da,en]], collocation, note) */
function v(da,en,pos,g,b,th,ex,col,note){
  return {da:da,en:en,pos:pos,g:g||'',b:b||'',th:th,ex:(ex||[]).map(p=>({da:p[0],en:p[1]})),col:col||'',note:note||''};
}

const VOCAB = [
/* ---------- SUNDHED & VANER ---------- */
v('sundhed','health','sb','en','en sundhed – sundheden','health',[['Min sundhed er vigtig for mig.','My health is important to me.']],'god for sundheden = good for your health',''),
v('vane','habit','sb','en','en vane – vanen – vaner – vanerne','health',[['Jeg vil ændre mine dårlige vaner.','I want to change my bad habits.']],'','sund vane = good habit; dårlig/usund vane = bad habit.'),
v('motion','exercise','sb','en','en motion – motionen','health',[['Jeg får motion hver dag.','I get exercise every day.']],'dyrke motion = to exercise','Say "dyrke motion", not "lave motion".'),
v('at træne','to train / work out','vb','','at træne – træner – trænede – har trænet','health',[['Jeg træner i fitnesscenter tre gange om ugen.','I work out at the gym three times a week.']],'',''),
v('at dyrke','to do (sport) / cultivate','vb','','at dyrke – dyrker – dyrkede – har dyrket','health',[['Jeg dyrker yoga og løb.','I do yoga and running.']],'dyrke sport / dyrke motion',''),
v('kost','diet (food)','sb','en','en kost – kosten','health',[['En sund kost giver mere energi.','A healthy diet gives more energy.']],'','kost = diet in the nutritional sense.'),
v('at spise','to eat','vb','','at spise – spiser – spiste – har spist','health',[['Jeg spiser grøntsager hver dag.','I eat vegetables every day.']],'',''),
v('søvn','sleep','sb','en','en søvn – søvnen','health',[['God søvn er vigtig for sundheden.','Good sleep is important for health.']],'få nok søvn = get enough sleep',''),
v('at sove','to sleep','vb','','at sove – sover – sov – har sovet','health',[['Jeg sover otte timer om natten.','I sleep eight hours a night.']],'',''),
v('stress','stress','sb','en','stress – stressen (utælleligt; oftest uden artikel)','health',[['Jeg prøver at undgå stress.','I try to avoid stress.']],'',''),
v('at slappe af','to relax','vb','','at slappe af – slapper af – slappede af – har slappet af','health',[['Jeg slapper af om aftenen.','I relax in the evening.']],'','The particle moves: "jeg slapper AF".'),
v('rygning','smoking','sb','en','en rygning – rygningen','health',[['Rygning er meget usundt.','Smoking is very unhealthy.']],'holde op med at ryge = to quit smoking',''),
v('at ryge','to smoke','vb','','at ryge – ryger – røg – har røget','health',[['Han er holdt op med at ryge.','He has quit smoking.']],'',''),
v('alkohol','alcohol','sb','en','en alkohol – alkoholen','health',[['Jeg drikker ikke meget alkohol.','I do not drink much alcohol.']],'',''),
v('sukker','sugar','sb','et','et sukker – sukkeret','health',[['Jeg spiser desværre for meget sukker.','Unfortunately I eat too much sugar.']],'',''),
v('grøntsag','vegetable','sb','en','en grøntsag – grøntsagen – grøntsager – grøntsagerne','health',[['Grøntsager er sunde og billige.','Vegetables are healthy and cheap.']],'',''),
v('frugt','fruit','sb','en','en frugt – frugten – frugter – frugterne','health',[['Jeg spiser et stykke frugt hver dag.','I eat a piece of fruit every day.']],'',''),
v('sund','healthy','adj','','sund – sundt – sunde','health',[['Det er sundt at gå en tur.','It is healthy to go for a walk.']],'',''),
v('usund','unhealthy','adj','','usund – usundt – usunde','health',[['Fastfood er usundt.','Fast food is unhealthy.']],'',''),
v('krop','body','sb','en','en krop – kroppen – kroppe – kroppene','health',[['Motion er godt for kroppen.','Exercise is good for the body.']],'',''),
v('energi','energy','sb','en','en energi – energien','health',[['Jeg har mere energi, når jeg sover godt.','I have more energy when I sleep well.']],'',''),
v('at gå en tur','to go for a walk','udtryk','','','health',[['Jeg går en tur hver morgen.','I go for a walk every morning.']],'',''),
v('at løbe','to run','vb','','at løbe – løber – løb – har løbet','health',[['Jeg løber i parken om søndagen.','I run in the park on Sundays.']],'',''),
v('at undgå','to avoid','vb','','at undgå – undgår – undgik – har undgået','health',[['Jeg prøver at undgå sukker og fastfood.','I try to avoid sugar and fast food.']],'',''),

/* ---------- GRØNNE VANER & MILJØ ---------- */
v('miljø','environment','sb','et','et miljø – miljøet – miljøer – miljøerne','green',[['Vi skal passe på miljøet.','We must take care of the environment.']],'passe på miljøet','Spelled with -ø: miljø.'),
v('klima','climate','sb','et','et klima – klimaet','green',[['Klimaet ændrer sig hurtigt.','The climate is changing fast.']],'klimaforandringer = climate change',''),
v('at genbruge','to recycle / reuse','vb','','at genbruge – genbruger – genbrugte – har genbrugt','green',[['Jeg genbruger plastik og papir.','I recycle plastic and paper.']],'',''),
v('genbrug','recycling','sb','et','et genbrug – genbruget','green',[['Genbrug er godt for miljøet.','Recycling is good for the environment.']],'',''),
v('affald','waste / rubbish','sb','et','et affald – affaldet','green',[['Vi sorterer vores affald derhjemme.','We sort our waste at home.']],'sortere affald = to sort waste',''),
v('at sortere','to sort','vb','','at sortere – sorterer – sorterede – har sorteret','green',[['Jeg sorterer affald i fire spande.','I sort waste into four bins.']],'',''),
v('plastik','plastic','sb','en','plastik – plastikken (også: et plastik)','green',[['Vi skal bruge mindre plastik.','We should use less plastic.']],'',''),
v('at spare','to save (resources/money)','vb','','at spare – sparer – sparede – har sparet','green',[['Jeg sparer på vandet og strømmen.','I save water and electricity.']],'spare på = economise on',''),
v('cykel','bicycle','sb','en','en cykel – cyklen – cykler – cyklerne','green',[['Jeg tager cyklen på arbejde.','I take the bike to work.']],'tage cyklen = go by bike',''),
v('at cykle','to cycle','vb','','at cykle – cykler – cyklede – har cyklet','green',[['Jeg cykler hver dag, fordi det er godt for miljøet.','I cycle every day because it is good for the environment.']],'',''),
v('offentlig transport','public transport','udtryk','','','green',[['Jeg bruger offentlig transport i stedet for bil.','I use public transport instead of a car.']],'',''),
v('bil','car','sb','en','en bil – bilen – biler – bilerne','green',[['Vi har solgt vores bil for at spare penge.','We have sold our car to save money.']],'',''),
v('strøm','electricity / power','sb','en','en strøm – strømmen','green',[['Husk at slukke for strømmen.','Remember to turn off the power.']],'slukke for strømmen',''),
v('at slukke','to turn off','vb','','at slukke – slukker – slukkede – har slukket','green',[['Jeg slukker lyset, når jeg går.','I turn off the light when I leave.']],'slukke for lyset',''),
v('at tænde','to turn on','vb','','at tænde – tænder – tændte – har tændt','green',[['Tænd ikke for mange lamper.','Do not turn on too many lamps.']],'tænde for lyset',''),
v('vand','water','sb','et','et vand – vandet','green',[['Vi skal spare på vandet.','We must save water.']],'',''),
v('natur','nature','sb','en','en natur – naturen','green',[['Jeg elsker at være ude i naturen.','I love being out in nature.']],'',''),
v('grøn','green','adj','','grøn – grønt – grønne','green',[['Jeg prøver at leve mere grønt.','I try to live greener.']],'','"grønne vaner" = eco-friendly habits.'),
v('økologisk','organic','adj','','økologisk – økologisk – økologiske','green',[['Jeg køber økologiske grøntsager.','I buy organic vegetables.']],'',''),
v('forurening','pollution','sb','en','en forurening – forureningen','green',[['Biler giver forurening i byen.','Cars cause pollution in the city.']],'',''),

/* ---------- AT LÆRE DANSK ---------- */
v('sprog','language','sb','et','et sprog – sproget – sprog – sprogene','lang',[['Dansk er et svært, men smukt sprog.','Danish is a difficult but beautiful language.']],'','No plural ending: ét sprog, flere sprog.'),
v('at lære','to learn','vb','','at lære – lærer – lærte – har lært','lang',[['Jeg lærer dansk på sprogskolen.','I learn Danish at the language school.']],'',''),
v('at øve sig','to practise','vb','','at øve sig – øver sig – øvede sig – har øvet sig','lang',[['Jeg øver mig hver dag i ti minutter.','I practise every day for ten minutes.']],'','Reflexive: jeg øver MIG, du øver DIG.'),
v('udtale','pronunciation','sb','en','en udtale – udtalen','lang',[['Min udtale bliver bedre og bedre.','My pronunciation is getting better and better.']],'',''),
v('at udtale','to pronounce','vb','','at udtale – udtaler – udtalte – har udtalt','lang',[['Jeg kan ikke udtale ordet "rødgrød".','I cannot pronounce the word "rødgrød".']],'',''),
v('ord','word','sb','et','et ord – ordet – ord – ordene','lang',[['Jeg lærer ti nye ord hver dag.','I learn ten new words every day.']],'','No plural ending: ét ord, mange ord.'),
v('sætning','sentence','sb','en','en sætning – sætningen – sætninger – sætningerne','lang',[['Lav en sætning med det nye ord.','Make a sentence with the new word.']],'',''),
v('grammatik','grammar','sb','en','en grammatik – grammatikken','lang',[['Dansk grammatik er faktisk ret logisk.','Danish grammar is actually quite logical.']],'',''),
v('fejl','mistake / error','sb','en','en fejl – fejlen – fejl – fejlene','lang',[['Man lærer af sine fejl.','You learn from your mistakes.']],'','No plural ending: én fejl, mange fejl.'),
v('at forstå','to understand','vb','','at forstå – forstår – forstod – har forstået','lang',[['Jeg forstår det meste nu.','I understand most of it now.']],'',''),
v('at tale','to speak','vb','','at tale – taler – talte – har talt','lang',[['Jeg taler dansk med mine kolleger.','I speak Danish with my colleagues.']],'tale med = talk to',''),
v('at læse','to read','vb','','at læse – læser – læste – har læst','lang',[['Jeg læser en let bog på dansk.','I read an easy book in Danish.']],'',''),
v('at skrive','to write','vb','','at skrive – skriver – skrev – har skrevet','lang',[['Jeg skriver en e-mail på dansk.','I write an email in Danish.']],'',''),
v('at lytte','to listen','vb','','at lytte – lytter – lyttede – har lyttet','lang',[['Jeg lytter til dansk radio i bilen.','I listen to Danish radio in the car.']],'lytte til = listen to',''),
v('sprogskole','language school','sb','en','en sprogskole – sprogskolen – sprogskoler – sprogskolerne','lang',[['Jeg går på sprogskole tre aftener om ugen.','I attend language school three evenings a week.']],'gå på sprogskole',''),
v('lektie','homework','sb','en','en lektie – lektien – lektier – lektierne','lang',[['Jeg laver mine lektier hver aften.','I do my homework every evening.']],'lave lektier',''),
v('svær','difficult','adj','','svær – svært – svære','lang',[['Udtalen er den svære del.','Pronunciation is the difficult part.']],'',''),
v('let','easy','adj','','let – let – lette','lang',[['Grammatikken er ikke så let.','The grammar is not so easy.']],'','Also "nem – nemt – nemme".'),
v('at forbedre','to improve','vb','','at forbedre – forbedrer – forbedrede – har forbedret','lang',[['Jeg vil forbedre mit dansk inden eksamen.','I want to improve my Danish before the exam.']],'',''),
v('ordforråd','vocabulary','sb','et','et ordforråd – ordforrådet','lang',[['Mit ordforråd vokser hver dag.','My vocabulary grows every day.']],'',''),
v('tålmodig','patient','adj','','tålmodig – tålmodigt – tålmodige','lang',[['Man skal være tålmodig, når man lærer et sprog.','You must be patient when you learn a language.']],'',''),

/* ---------- ARBEJDE & JOB ---------- */
v('arbejde','work / job','sb','et','et arbejde – arbejdet – arbejder – arbejderne','work',[['Jeg er glad for mit arbejde.','I am happy with my work.']],'på arbejde = at work',''),
v('at arbejde','to work','vb','','at arbejde – arbejder – arbejdede – har arbejdet','work',[['Jeg arbejder i en stor virksomhed.','I work in a big company.']],'arbejde med = work with',''),
v('job','job','sb','et','et job – jobbet – job – jobbene','work',[['Jeg søger et nyt job lige nu.','I am looking for a new job right now.']],'søge job = apply for a job',''),
v('kollega','colleague','sb','en','en kollega – kollegaen – kolleger – kollegerne','work',[['Mine kolleger er flinke og hjælpsomme.','My colleagues are nice and helpful.']],'','Plural: kolleger.'),
v('chef','boss / manager','sb','en','en chef – chefen – chefer – cheferne','work',[['Min chef er meget hjælpsom.','My boss is very helpful.']],'',''),
v('møde','meeting','sb','et','et møde – mødet – møder – møderne','work',[['Jeg har et møde klokken ti.','I have a meeting at ten.']],'holde et møde = hold a meeting',''),
v('virksomhed','company','sb','en','en virksomhed – virksomheden – virksomheder – virksomhederne','work',[['Jeg arbejder i en international virksomhed.','I work in an international company.']],'',''),
v('løn','salary / wage','sb','en','en løn – lønnen – lønninger – lønningerne','work',[['Jeg får løn den sidste dag i måneden.','I get paid on the last day of the month.']],'',''),
v('ansøgning','application','sb','en','en ansøgning – ansøgningen – ansøgninger – ansøgningerne','work',[['Jeg sender en ansøgning til jobbet.','I send an application for the job.']],'',''),
v('at søge','to apply / search','vb','','at søge – søger – søgte – har søgt','work',[['Jeg søger et job som dataanalytiker.','I am applying for a job as a data analyst.']],'søge om = apply for',''),
v('erfaring','experience','sb','en','en erfaring – erfaringen – erfaringer – erfaringerne','work',[['Jeg har mange års erfaring med salg.','I have many years of experience with sales.']],'erfaring med = experience with',''),
v('uddannelse','education','sb','en','en uddannelse – uddannelsen – uddannelser – uddannelserne','work',[['Jeg har en uddannelse i økonomi.','I have a degree in economics.']],'',''),
v('arbejdsplads','workplace','sb','en','en arbejdsplads – arbejdspladsen – arbejdspladser – arbejdspladserne','work',[['Vi har en god stemning på arbejdspladsen.','We have a good atmosphere at the workplace.']],'',''),
v('opgave','task / assignment','sb','en','en opgave – opgaven – opgaver – opgaverne','work',[['Jeg har mange opgaver i dag.','I have many tasks today.']],'',''),
v('at samarbejde','to cooperate','vb','','at samarbejde – samarbejder – samarbejdede – har samarbejdet','work',[['Vi samarbejder godt i teamet.','We cooperate well in the team.']],'samarbejde med',''),
v('travl','busy','adj','','travl – travlt – travle','work',[['Jeg har travlt i dag.','I am busy today.']],'have travlt = to be busy','Fixed phrase: "have travlt", NOT "være travl".'),
v('ferie','holiday / vacation','sb','en','en ferie – ferien – ferier – ferierne','work',[['Jeg holder ferie i juli.','I take holiday in July.']],'holde ferie = take a holiday',''),
v('på fuldtid','full-time','udtryk','','','work',[['Jeg arbejder på fuldtid.','I work full-time.']],'','på deltid = part-time.'),
v('at få','to get / receive','vb','','at få – får – fik – har fået','work',[['Jeg får løn hver måned.','I get paid every month.']],'',''),
v('at begynde','to begin','vb','','at begynde – begynder – begyndte – har begyndt','work',[['Jeg begynder på arbejde klokken otte.','I start work at eight.']],'begynde på / med',''),
v('at slutte','to finish / end','vb','','at slutte – slutter – sluttede – har sluttet','work',[['Kurset slutter i juni.','The course ends in June.']],'',''),
v('at hjælpe','to help','vb','','at hjælpe – hjælper – hjalp – har hjulpet','work',[['Kan du hjælpe mig med opgaven?','Can you help me with the task?']],'hjælpe med = help with',''),

/* ---------- INDKØB & PENGE ---------- */
v('at købe','to buy','vb','','at købe – køber – købte – har købt','shop',[['Jeg køber ind om lørdagen.','I do the shopping on Saturdays.']],'købe ind = do the shopping',''),
v('at handle','to shop','vb','','at handle – handler – handlede – har handlet','shop',[['Jeg handler i Netto, fordi det er billigt.','I shop at Netto because it is cheap.']],'','Also "handle om" = to be about.'),
v('butik','shop','sb','en','en butik – butikken – butikker – butikkerne','shop',[['Butikken åbner klokken otte.','The shop opens at eight.']],'',''),
v('supermarked','supermarket','sb','et','et supermarked – supermarkedet – supermarkeder – supermarkederne','shop',[['Der er et supermarked tæt på.','There is a supermarket nearby.']],'',''),
v('pris','price','sb','en','en pris – prisen – priser – priserne','shop',[['Prisen er desværre for høj.','The price is unfortunately too high.']],'til en god pris = at a good price',''),
v('penge','money','sb','','penge – pengene (kun flertal)','shop',[['Jeg har ikke mange penge tilbage.','I do not have much money left.']],'','Always plural: mange penge.'),
v('at betale','to pay','vb','','at betale – betaler – betalte – har betalt','shop',[['Jeg betaler med kort.','I pay by card.']],'betale for = pay for',''),
v('kvittering','receipt','sb','en','en kvittering – kvitteringen – kvitteringer – kvitteringerne','shop',[['Må jeg få en kvittering?','May I have a receipt?']],'',''),
v('tilbud','offer / sale','sb','et','et tilbud – tilbuddet – tilbud – tilbuddene','shop',[['Mælken er på tilbud i dag.','The milk is on sale today.']],'på tilbud = on sale',''),
v('rabat','discount','sb','en','en rabat – rabatten – rabatter – rabatterne','shop',[['Jeg fik ti procent rabat.','I got a ten percent discount.']],'',''),
v('dyr','expensive','adj','','dyr – dyrt – dyre','shop',[['Det er alt for dyrt.','That is far too expensive.']],'','Also means "animal" (et dyr) — different word.'),
v('billig','cheap','adj','','billig – billigt – billige','shop',[['Tøjet var billigt i tilbud.','The clothes were cheap on sale.']],'',''),
v('at koste','to cost','vb','','at koste – koster – kostede – har kostet','shop',[['Hvor meget koster det?','How much does it cost?']],'',''),
v('indkøbsliste','shopping list','sb','en','en indkøbsliste – indkøbslisten – indkøbslister – indkøbslisterne','shop',[['Jeg skriver altid en indkøbsliste.','I always write a shopping list.']],'',''),
v('at bytte','to exchange / return','vb','','at bytte – bytter – byttede – har byttet','shop',[['Kan jeg bytte den her bluse?','Can I exchange this blouse?']],'',''),
v('kasse','checkout / till','sb','en','en kasse – kassen – kasser – kasserne','shop',[['Der er lang kø ved kassen.','There is a long queue at the checkout.']],'',''),
v('at bruge','to use / spend','vb','','at bruge – bruger – brugte – har brugt','shop',[['Jeg bruger for mange penge på mad.','I spend too much money on food.']],'bruge tid/penge på',''),

/* ---------- HJEM & HVERDAG ---------- */
v('hjem','home','sb','et','et hjem – hjemmet – hjem – hjemmene','home',[['Vi har et hyggeligt hjem.','We have a cosy home.']],'','As adverb: "gå hjem" = go home; "hjemme" = at home.'),
v('lejlighed','flat / opportunity','sb','en','en lejlighed – lejligheden – lejligheder – lejlighederne','home',[['Vi bor i en lejlighed i København.','We live in a flat in Copenhagen.']],'','Also means "opportunity": en god lejlighed.'),
v('hus','house','sb','et','et hus – huset – huse – husene','home',[['De har lige købt et hus.','They have just bought a house.']],'',''),
v('værelse','room','sb','et','et værelse – værelset – værelser – værelserne','home',[['Lejligheden har tre værelser.','The flat has three rooms.']],'',''),
v('køkken','kitchen','sb','et','et køkken – køkkenet – køkkener – køkkenerne','home',[['Vi spiser morgenmad i køkkenet.','We eat breakfast in the kitchen.']],'',''),
v('at lave mad','to cook','udtryk','','','home',[['Jeg laver mad hver aften.','I cook every evening.']],'',''),
v('at gøre rent','to clean','vb','','at gøre rent – gør rent – gjorde rent – har gjort rent','home',[['Jeg gør rent om lørdagen.','I clean on Saturdays.']],'',''),
v('at vaske op','to wash up','vb','','at vaske op – vasker op – vaskede op – har vasket op','home',[['Han vasker op efter aftensmaden.','He washes up after dinner.']],'',''),
v('at vaske tøj','to do laundry','udtryk','','','home',[['Jeg vasker tøj to gange om ugen.','I do laundry twice a week.']],'',''),
v('nabo','neighbour','sb','en','en nabo – naboen – naboer – naboerne','home',[['Min nabo er meget venlig.','My neighbour is very friendly.']],'',''),
v('hverdag','everyday / weekday','sb','en','en hverdag – hverdagen – hverdage – hverdagene','home',[['I min hverdag står jeg tidligt op.','In my everyday life I get up early.']],'i hverdagen = in daily life',''),
v('at stå op','to get up','vb','','at stå op – står op – stod op – har stået op','home',[['Jeg står op klokken seks.','I get up at six.']],'',''),
v('at gå i seng','to go to bed','udtryk','','','home',[['Jeg går i seng klokken elleve.','I go to bed at eleven.']],'',''),
v('morgenmad','breakfast','sb','en','en morgenmad – morgenmaden','home',[['Jeg spiser morgenmad klokken syv.','I eat breakfast at seven.']],'','Meals: morgenmad, frokost, aftensmad.'),
v('frokost','lunch','sb','en','en frokost – frokosten – frokoster – frokosterne','home',[['Vi spiser frokost klokken tolv.','We have lunch at twelve.']],'',''),
v('aftensmad','dinner','sb','en','en aftensmad – aftensmaden','home',[['Vi spiser aftensmad klokken seks.','We eat dinner at six.']],'',''),
v('fritid','free time','sb','en','en fritid – fritiden','home',[['I min fritid løber jeg og læser.','In my free time I run and read.']],'',''),
v('at hygge sig','to have a cosy time','vb','','at hygge sig – hygger sig – hyggede sig – har hygget sig','home',[['Vi hygger os med en film og te.','We have a cosy time with a film and tea.']],'','Very Danish. Reflexive: jeg hygger MIG.'),
v('familie','family','sb','en','en familie – familien – familier – familierne','home',[['Min familie betyder alt for mig.','My family means everything to me.']],'',''),
v('at bo','to live / reside','vb','','at bo – bor – boede – har boet','home',[['Jeg bor i Aarhus med min familie.','I live in Aarhus with my family.']],'',''),
v('at flytte','to move (house)','vb','','at flytte – flytter – flyttede – er flyttet','home',[['Vi er flyttet til en ny lejlighed.','We have moved to a new flat.']],'','Uses ER in the perfect: "er flyttet".'),
v('at komme','to come','vb','','at komme – kommer – kom – er kommet','home',[['Jeg kommer oprindeligt fra Indien.','I originally come from India.']],'','Uses ER in the perfect: "er kommet".'),
v('at tage','to take','vb','','at tage – tager – tog – har taget','home',[['Jeg tager bussen til arbejde.','I take the bus to work.']],'',''),

/* ---------- KROP, SYGDOM & LÆGE ---------- */
v('læge','doctor','sb','en','en læge – lægen – læger – lægerne','body',[['Jeg har en tid hos lægen i morgen.','I have an appointment with the doctor tomorrow.']],'gå til lægen = go to the doctor',''),
v('sygdom','illness','sb','en','en sygdom – sygdommen – sygdomme – sygdommene','body',[['Influenza er en almindelig sygdom om vinteren.','Flu is a common illness in winter.']],'',''),
v('syg','ill / sick','adj','','syg – sygt – syge','body',[['Jeg er syg og bliver hjemme i dag.','I am ill and am staying home today.']],'melde sig syg = call in sick','blive syg = get ill.'),
v('rask','well / recovered','adj','','rask – raskt – raske','body',[['Nu er jeg rask igen.','Now I am well again.']],'','rask = recovered; sund = healthy in general.'),
v('smerte','pain','sb','en','en smerte – smerten – smerter – smerterne','body',[['Jeg har smerter i ryggen.','I have pain in my back.']],'',''),
v('at have ondt','to be in pain / hurt','udtryk','','','body',[['Jeg har ondt i hovedet.','I have a headache.']],'have ondt i + body part',''),
v('hoved','head','sb','et','et hoved – hovedet – hoveder – hovederne','body',[['Jeg har ondt i hovedet.','My head hurts.']],'',''),
v('mave','stomach','sb','en','en mave – maven – maver – maverne','body',[['Jeg har ondt i maven.','I have a stomach ache.']],'',''),
v('ryg','back','sb','en','en ryg – ryggen – rygge – ryggene','body',[['Min ryg gør ondt om morgenen.','My back hurts in the morning.']],'',''),
v('medicin','medicine','sb','en','en medicin – medicinen','body',[['Jeg tager medicin to gange om dagen.','I take medicine twice a day.']],'tage medicin',''),
v('tid','appointment / time','sb','en','en tid – tiden – tider – tiderne','body',[['Jeg vil gerne bestille en tid.','I would like to book an appointment.']],'bestille en tid = book an appointment','"tid" = both "time" and "appointment".'),
v('apotek','pharmacy','sb','et','et apotek – apoteket – apoteker – apotekerne','body',[['Jeg henter medicin på apoteket.','I pick up medicine at the pharmacy.']],'',''),
v('at føle sig','to feel (oneself)','vb','','at føle sig – føler sig – følte sig – har følt sig','body',[['Jeg føler mig træt og uoplagt.','I feel tired and out of sorts.']],'','Reflexive: jeg føler MIG godt tilpas.'),
v('træt','tired','adj','','træt – træt – trætte','body',[['Jeg er meget træt om aftenen.','I am very tired in the evening.']],'træt af = tired of',''),
v('forkølet','having a cold','adj','','forkølet – forkølet – forkølede','body',[['Jeg er forkølet og hoster meget.','I have a cold and cough a lot.']],'',''),
v('feber','fever','sb','en','en feber – feberen','body',[['Barnet har feber og skal blive hjemme.','The child has a fever and must stay home.']],'have feber',''),

/* ---------- FØLELSER & HOLDNINGER ---------- */
v('at synes','to think / feel (opinion)','vb','','at synes – synes – syntes – har syntes','feel',[['Jeg synes, at dansk er svært, men sjovt.','I think Danish is hard but fun.']],'','synes = personal impression; tro = guess; mene = firm view.'),
v('at tro','to believe / think','vb','','at tro – tror – troede – har troet','feel',[['Jeg tror, at det bliver regn i morgen.','I think it will rain tomorrow.']],'tro på = believe in',''),
v('at mene','to mean / hold a view','vb','','at mene – mener – mente – har ment','feel',[['Jeg mener, at vi skal spare på energien.','I believe we should save energy.']],'',''),
v('mening','opinion / meaning','sb','en','en mening – meningen – meninger – meningerne','feel',[['Hvad er din mening om det?','What is your opinion about it?']],'efter min mening = in my opinion',''),
v('holdning','attitude / stance','sb','en','en holdning – holdningen – holdninger – holdningerne','feel',[['Jeg har en klar holdning til miljøet.','I have a clear stance on the environment.']],'holdning til = attitude towards',''),
v('glad','happy','adj','','glad – gladt – glade','feel',[['Jeg er glad for mit nye job.','I am happy with my new job.']],'glad for = happy about','Preposition is "for", not "med".'),
v('ked af det','sad','udtryk','','','feel',[['Jeg er ked af det i dag.','I am sad today.']],'','Fixed phrase "være ked af det" = to be sad.'),
v('vigtig','important','adj','','vigtig – vigtigt – vigtige','feel',[['Det er vigtigt at sove godt.','It is important to sleep well.']],'vigtig for = important for',''),
v('enig','in agreement','adj','','enig – enigt – enige','feel',[['Jeg er helt enig med dig.','I completely agree with you.']],'enig med (person) / enig i (noget)',''),
v('uenig','disagreeing','adj','','uenig – uenigt – uenige','feel',[['Jeg er uenig i den beslutning.','I disagree with that decision.']],'',''),
v('bange','afraid','adj','','bange (uændret)','feel',[['Jeg er ikke bange for at lave fejl.','I am not afraid of making mistakes.']],'bange for = afraid of','Never changes form: bange.'),
v('nervøs','nervous','adj','','nervøs – nervøst – nervøse','feel',[['Jeg er lidt nervøs før eksamen.','I am a little nervous before the exam.']],'nervøs for = nervous about',''),
v('at håbe','to hope','vb','','at håbe – håber – håbede – har håbet','feel',[['Jeg håber, at jeg består eksamen.','I hope I pass the exam.']],'håbe på = hope for',''),
v('at foretrække','to prefer','vb','','at foretrække – foretrækker – foretrak – har foretrukket','feel',[['Jeg foretrækker te frem for kaffe.','I prefer tea over coffee.']],'foretrække A frem for B',''),
v('heldig','lucky','adj','','heldig – heldigt – heldige','feel',[['Jeg var heldig at få jobbet.','I was lucky to get the job.']],'heldig med = lucky with',''),
v('spændende','exciting','adj','','spændende (uændret)','feel',[['Det er spændende at lære et nyt sprog.','It is exciting to learn a new language.']],'',''),
v('kedelig','boring','adj','','kedelig – kedeligt – kedelige','feel',[['Filmen var desværre lidt kedelig.','The film was unfortunately a bit boring.']],'',''),
v('at give','to give','vb','','at give – giver – gav – har givet','feel',[['Motion giver mig mere energi.','Exercise gives me more energy.']],'',''),
v('at skulle','shall / must / be going to','vb','','at skulle – skal – skulle – har skullet','feel',[['Jeg skal til møde klokken to.','I have a meeting at two.']],'','skal = must/plan; vil = want; kan = can.'),
v('at ville','to want / will','vb','','at ville – vil – ville – har villet','feel',[['Jeg vil gerne lære dansk rigtig godt.','I really want to learn Danish well.']],'vil gerne = would like to',''),
v('at kunne','can / be able to','vb','','at kunne – kan – kunne – har kunnet','feel',[['Jeg kan tale lidt dansk nu.','I can speak a little Danish now.']],'',''),
v('at måtte','may / be allowed / must','vb','','at måtte – må – måtte – har måttet','feel',[['Må jeg åbne vinduet?','May I open the window?']],'','må = may/allowed; in negatives = must not.'),

/* ---------- TID, STED & MÆNGDE ---------- */
v('tit','often','adv','','tit / ofte','time',[['Jeg går tit i fitnesscenter.','I often go to the gym.']],'','tit and ofte mean the same.'),
v('altid','always','adv','','','time',[['Jeg drikker altid kaffe om morgenen.','I always drink coffee in the morning.']],'',''),
v('aldrig','never','adv','','','time',[['Jeg ryger aldrig.','I never smoke.']],'','If first: triggers inversion — "Aldrig ryger jeg."'),
v('af og til','sometimes / now and then','udtryk','','','time',[['Af og til spiser jeg fastfood.','Now and then I eat fast food.']],'','Same: nogle gange.'),
v('sjældent','rarely','adv','','','time',[['Jeg drikker sjældent alkohol.','I rarely drink alcohol.']],'',''),
v('om ugen','per week','udtryk','','','time',[['Jeg træner tre gange om ugen.','I train three times a week.']],'','... gange om dagen/ugen/måneden.'),
v('for tiden','at the moment','udtryk','','','time',[['For tiden lærer jeg dansk.','At the moment I am learning Danish.']],'',''),
v('tidligt','early','adv','','tidlig – tidligt – tidlige','time',[['Jeg står tidligt op hver dag.','I get up early every day.']],'',''),
v('sent','late','adv','','sen – sent – sene','time',[['Jeg går sent i seng i weekenden.','I go to bed late on the weekend.']],'',''),
v('cirka','approximately','adv','','','time',[['Det tager cirka en time.','It takes approximately one hour.']],'','Often written "ca.".'),
v('mindst','at least','adv','','','time',[['Man skal sove mindst syv timer.','You should sleep at least seven hours.']],'',''),
v('for meget','too much','udtryk','','','time',[['Jeg spiser for meget sukker.','I eat too much sugar.']],'','for lidt = too little.'),
v('nok','enough','adv','','','time',[['Jeg får ikke nok søvn.','I do not get enough sleep.']],'','Also a softener meaning "probably".'),
v('weekend','weekend','sb','en','en weekend – weekenden – weekender – weekenderne','time',[['I weekenden slapper jeg af.','On the weekend I relax.']],'',''),
v('om aftenen','in the evening','udtryk','','','time',[['Om aftenen ser jeg tv.','In the evening I watch TV.']],'','om morgenen / om eftermiddagen / om aftenen / om natten.'),
v('klokken','o’clock','udtryk','','','time',[['Jeg står op klokken seks.','I get up at six o’clock.']],'','Telling time: klokken er halv otte = 7:30.'),
v('i morgen','tomorrow','udtryk','','','time',[['I morgen skal jeg til lægen.','Tomorrow I am going to the doctor.']],'','i går = yesterday; i dag = today. NOT "om morgenen".'),

/* ---------- FORMELLE BREVVENDINGER ---------- */
v('Kære...','Dear...','udtryk','','','formal',[['Kære Mette.','Dear Mette.']],'','Standard greeting in letters and emails.'),
v('Tak for din mail','Thanks for your email','udtryk','','','formal',[['Tak for din mail af 3. juni.','Thanks for your email of 3 June.']],'',''),
v('Jeg skriver til dig, fordi...','I am writing to you because...','udtryk','','','formal',[['Jeg skriver til dig, fordi jeg har et spørgsmål.','I am writing to you because I have a question.']],'','Strong opening for Opgave 1 (henvendelse).'),
v('Jeg vil gerne...','I would like to...','udtryk','','','formal',[['Jeg vil gerne høre, om du kan hjælpe.','I would like to know if you can help.']],'jeg vil gerne + verb',''),
v('Kunne du...?','Could you...?','udtryk','','','formal',[['Kunne du sende mig programmet?','Could you send me the programme?']],'','Polite request — more formal than "kan du".'),
v('Jeg håber, at...','I hope that...','udtryk','','','formal',[['Jeg håber, at du kan hjælpe mig.','I hope that you can help me.']],'',''),
v('På forhånd tak','Thanks in advance','udtryk','','','formal',[['På forhånd tak for hjælpen.','Thanks in advance for the help.']],'','Common polite closing before the sign-off.'),
v('Jeg ser frem til at høre fra dig','I look forward to hearing from you','udtryk','','','formal',[['Jeg ser frem til at høre fra dig.','I look forward to hearing from you.']],'',''),
v('Med venlig hilsen','Kind regards','udtryk','','','formal',[['Med venlig hilsen, Gaurav.','Kind regards, Gaurav.']],'','Standard formal sign-off (short: "Mvh").'),
v('Mange tak','Many thanks','udtryk','','','formal',[['Mange tak for hjælpen.','Many thanks for the help.']],'',''),
v('henvendelse','inquiry / message','sb','en','en henvendelse – henvendelsen – henvendelser – henvendelserne','formal',[['Tak for din henvendelse.','Thank you for your inquiry.']],'','Opgave 1 is a "halvformel henvendelse".'),
v('besked','message','sb','en','en besked – beskeden – beskeder – beskederne','formal',[['Jeg sender dig en besked senere.','I will send you a message later.']],'give besked = let someone know',''),
v('svar','answer / reply','sb','et','et svar – svaret – svar – svarene','formal',[['Jeg venter på dit svar.','I am waiting for your reply.']],'',''),
v('at svare','to answer / reply','vb','','at svare – svarer – svarede – har svaret','formal',[['Kan du svare så hurtigt som muligt?','Can you reply as soon as possible?']],'svare på = answer (a question)',''),
v('Undskyld, men...','Sorry, but...','udtryk','','','formal',[['Undskyld, men jeg kan desværre ikke komme.','Sorry, but unfortunately I cannot come.']],'',''),

/* ---------- FORBINDERE & MENINGSUDTRYK ---------- */
v('fordi','because','forb','','','connect',[['Jeg cykler, fordi det er sundt.','I cycle because it is healthy.']],'','Subordinator: ..., fordi det ER sundt. Adverb before verb: ..., fordi jeg IKKE kan.'),
v('men','but','forb','','','connect',[['Jeg vil gerne, men jeg har ikke tid.','I would like to, but I do not have time.']],'','Coordinator → normal word order, no inversion.'),
v('og','and','forb','','','connect',[['Jeg spiser sundt og dyrker motion.','I eat healthily and exercise.']],'',''),
v('eller','or','forb','','','connect',[['Vil du have te eller kaffe?','Would you like tea or coffee?']],'',''),
v('så','so / therefore','forb','','','connect',[['Jeg var træt, så jeg gik i seng.','I was tired, so I went to bed.']],'','As "therefore" it triggers inversion: ..., så GIK jeg i seng.'),
v('derfor','therefore','adv','','','connect',[['Det regnede, derfor blev jeg hjemme.','It rained, therefore I stayed home.']],'','Triggers inversion: derfor BLEV jeg hjemme.'),
v('selvom','although','forb','','','connect',[['Jeg gik en tur, selvom det regnede.','I went for a walk although it was raining.']],'','Subordinator: selvom det REGNEDE.'),
v('hvis','if','forb','','','connect',[['Hvis jeg har tid, går jeg en tur.','If I have time, I go for a walk.']],'','Main clause after the if-clause inverts: Hvis..., GÅR jeg.'),
v('når','when (future/repeated)','forb','','','connect',[['Når jeg kommer hjem, laver jeg mad.','When I get home, I cook.']],'','når = whenever/future; da = a single past event.'),
v('da','when (single past)','forb','','','connect',[['Da jeg var ung, boede jeg i Indien.','When I was young, I lived in India.']],'','da = one time in the past; når = repeated/future.'),
v('for eksempel','for example','udtryk','','','connect',[['Jeg spiser sundt, for eksempel grøntsager.','I eat healthily, for example vegetables.']],'','Often written "fx".'),
v('desuden','moreover / besides','adv','','','connect',[['Det er billigt. Desuden er det godt for miljøet.','It is cheap. Moreover it is good for the environment.']],'','Triggers inversion: desuden ER det...'),
v('i stedet for','instead of','udtryk','','','connect',[['Jeg tager cyklen i stedet for bilen.','I take the bike instead of the car.']],'',''),
v('på grund af','because of','udtryk','','','connect',[['Jeg kom for sent på grund af bussen.','I was late because of the bus.']],'','på grund af + noun; fordi + clause.'),
v('både... og...','both... and...','udtryk','','','connect',[['Jeg taler både dansk og engelsk.','I speak both Danish and English.']],'',''),
v('hverken... eller...','neither... nor...','udtryk','','','connect',[['Jeg drikker hverken kaffe eller te.','I drink neither coffee nor tea.']],'',''),
v('efter min mening','in my opinion','udtryk','','','connect',[['Efter min mening er det meget vigtigt.','In my opinion it is very important.']],'','Triggers inversion: efter min mening ER det...'),
v('på den anden side','on the other hand','udtryk','','','connect',[['Det er sundt. På den anden side er det dyrt.','It is healthy. On the other hand it is expensive.']],'',''),
v('først... så...','first... then...','udtryk','','','connect',[['Først spiser jeg, så går jeg en tur.','First I eat, then I go for a walk.']],'',''),
v('det vil sige','that is (to say)','udtryk','','','connect',[['Jeg kommer senere, det vil sige cirka klokken to.','I will come later, that is around two o’clock.']],'','Often shortened to "dvs.".')
];

/* built-in words + anything the student imported from an LLM they ran outside the app */
DC.allVocab = function(){ return VOCAB.concat(DC.state.customVocab||[]); };

/* ---------- vocab state + spaced repetition ---------- */
(function(){ const _ds=DC.defaultState; DC.defaultState=function(){ const s=_ds(); s.vocab={srs:{}}; return s; }; })();
(function(){ const _load=DC.load; DC.load=function(){ _load(); if(!DC.state.vocab) DC.state.vocab={srs:{}}; if(!DC.state.vocab.srs) DC.state.vocab.srs={}; }; })();

const VOC_INT = [60*1000, 10*60*1000, 24*3600*1000, 3*24*3600*1000, 7*24*3600*1000, 21*24*3600*1000, 60*24*3600*1000];
DC.vocSrs = function(da){
  if(!DC.state.vocab) DC.state.vocab={srs:{}};
  if(!DC.state.vocab.srs[da]) DC.state.vocab.srs[da]={stage:0,due:0,reps:0,lapses:0,mastered:false};
  return DC.state.vocab.srs[da];
};
DC.vocSchedule = function(da, rating){
  const st = DC.vocSrs(da), now = Date.now(); st.reps++;
  if(rating==='again'){ st.stage=0; st.lapses++; st.due=now+VOC_INT[0]; st.mastered=false; }
  else if(rating==='hard'){ st.stage=Math.max(1,st.stage); st.due=now+Math.round(VOC_INT[Math.min(st.stage,VOC_INT.length-1)]*0.5); }
  else if(rating==='good'){ st.stage=Math.min(st.stage+1,VOC_INT.length-1); st.due=now+VOC_INT[st.stage]; }
  else if(rating==='easy'){ st.stage=Math.min(st.stage+2,VOC_INT.length-1); st.due=now+VOC_INT[st.stage]; }
  if((rating==='good'||rating==='easy') && st.stage>=4) st.mastered=true;
  DC.state.activity.push({ ts: now, module: 'Vocab', opgave: 'Ordforråd', ok: rating!=='again', conf: '' });
  if (DC.state.activity.length > 200) DC.state.activity = DC.state.activity.slice(-200);
  DC.save();
};
DC.vocLearned = function(){ return DC.allVocab().filter(w=>DC.vocSrs(w.da).mastered).length; };
DC.vocDue = function(){ const now=Date.now(); return DC.allVocab().filter(w=>{ const s=DC.vocSrs(w.da); return s.reps>0 && !s.mastered && s.due<=now; }).length; };
/* single 'due today' number across all three SRS queues (item reviews, dojo re-tests, vocab) */
DC.dojoDueCount = function(){ return DOJO_ALL.filter(id=>DC.dojoStatus(id)==='Review due').length; };
DC.allDue = function(){ return Brain.dueReviews().length + DC.dojoDueCount() + DC.vocDue(); };

/* =====================================================================
   "TODAY'S SESSION" — one deterministic, sequenced, trackable plan:
   due reviews -> due dojo re-test -> due vocab -> weakest concept -> one micro-task.
   ===================================================================== */
DC.todayReset = function(){
  const today = new Date().toDateString();
  /* snapshot the plan once per day — steps must not vanish when their due-count clears mid-day */
  if (DC.state.today.date !== today || !DC.state.today.steps){
    /* a new day started: log yesterday's final readiness before resetting the plan */
    if (DC.state.today.date){
      const log = DC.state.readinessLog || (DC.state.readinessLog = []);
      if (!log.length || log[log.length-1].date !== DC.state.today.date){
        log.push({ date: DC.state.today.date, readiness: Brain.readiness() });
        if (log.length > 30) DC.state.readinessLog = log.slice(-30);
      }
    }
    DC.state.today = { date: today, done: [], steps: DC.todayBuildSteps() };
  }
};
DC.weakestConceptStep = function(){
  const weak = Brain.weakConcepts();
  if (!weak.length) return null;
  const id = weak[0], name = CONCEPTS[id] ? CONCEPTS[id].name : id;
  const why = 'This concept is flagged Weak — a focused round now is the fastest way to fix it before it costs you exam points.';
  if (DOJO_TOPICS[id]) return { key:'weak', icon:'flame', label:'Drill your weakest topic: '+name, why, fn:"DC.go('dojo');DC.dojoOpen('"+id+"')" };
  const areaFn = { Grammar:"DC.go('grammar')", Writing:"DC.go('writing')", Reading:"DC.go('reading')", Oral:"DC.go('oral')" };
  const area = CONCEPTS[id] ? CONCEPTS[id].area : 'Grammar';
  return { key:'weak', icon:'flame', label:'Practice your weakest area: '+name, why, fn: areaFn[area] || "DC.go('grammar')" };
};
/* how close the exam is changes what today's plan SHOULD contain, not just what's due:
   exam-eve wants light recognition-only review, mid-countdown wants a full timed rehearsal,
   and an unset baseline this close to the date needs a first real mock exam */
DC.examAwareStep = function(){
  const ed = DC.state.examDate;
  if (!ed) return null;
  const daysLeft = Math.ceil((new Date(ed+'T09:00') - Date.now())/86400000);
  if (daysLeft < 0) return null;
  const exams = DC.state.exams || [];
  if (daysLeft <= 2){
    return { key:'exameve', icon:'moon-star', label:'Exam in '+daysLeft+' day'+(daysLeft===1?'':'s')+' — light review only',
      why:'New material will not stick this close to the test. Skim your Error Notebook, do one quick vocab pass, and save your energy — do not cram new grammar now.',
      fn:"DC.go('notebook')" };
  }
  const recentTimedRun = exams.some(e => Date.now()-e.ts < 7*86400000);
  if (daysLeft <= 10 && !recentTimedRun){
    return { key:'examsim', icon:'graduation-cap', label:'Exam in '+daysLeft+' days — run a full dress-rehearsal simulation',
      why:'A complete timed run under real conditions, this close to the test, is the single best way to know you are ready.',
      fn:"DC.go('sim')" };
  }
  if (daysLeft <= 30 && !exams.length){
    return { key:'firstmock', icon:'clipboard-check', label:'Exam in '+daysLeft+' days — take a Mock Exam to find your baseline',
      why:'You have not yet taken a full mock exam. Doing one now shows exactly where your remaining weeks should go.',
      fn:"DC.go('exam')" };
  }
  return null;
};
DC.todayBuildSteps = function(){
  const steps = [];
  const examStep = DC.examAwareStep();
  const examEve = examStep && examStep.key==='exameve';
  const due = Brain.dueReviews().length;
  if (due) steps.push({ key:'reviews', icon:'brain', label:'Clear due reviews ('+Math.min(due,10)+(due>10?' of '+due:'')+')',
    why:'Answers waiting in spaced repetition are the highest-value minutes of the day — do these while they are still fresh.',
    fn:"DC.go('review');DC.reviewSession()" });
  /* exam-eve: skip fresh, effortful drilling (dojo re-tests, weakest-concept practice) —
     recognition-only reviews above and vocab below are the appropriate load two days out */
  if (!examEve){
    const dueDojo = DOJO_ALL.find(id=>DC.dojoStatus(id)==='Review due');
    if (dueDojo) steps.push({ key:'dojo', icon:'target', label:'Dojo re-test: '+DOJO_TOPICS[dueDojo].title,
      why:'A mastered topic has come back up for its spaced re-test — keep it in long-term memory.',
      fn:"DC.go('dojo');DC.dojoOpen('"+dueDojo+"')" });
  }
  const vocDue = DC.vocDue();
  if (vocDue) steps.push({ key:'vocab', icon:'book-marked', label:'Review '+Math.min(vocDue,10)+(vocDue>10?' of '+vocDue:'')+' due word'+(vocDue===1?'':'s'),
    why:'Vocabulary decays fastest of everything you learn — a few minutes of flashcards keeps it retrievable on exam day.',
    fn:"DC.go('vocab');DC.vocabSetMode('flash')" });
  if (!examEve){
    const weakStep = DC.weakestConceptStep();
    if (weakStep) steps.push(weakStep);
  }
  /* new/early users with nothing due yet: learn first, produce second — matches the taught pedagogy
     (skipped on exam-eve: no new lessons two days out) */
  if (!steps.length && !examEve){
    const notDone = LESSONS.find(l=>!(DC.state.lessons[l.id]||{}).completed);
    if (notDone) steps.push({ key:'learn', icon:'book-open', label:'Lesson: '+notDone.title,
      why:'Learn the rule first — the drills and reviews will build on it.',
      fn:"DC.go('learn');DC.openLesson('"+notDone.id+"')" });
  }
  if (!examEve) steps.push((new Date().getDate()%2!==0)
    ? { key:'micro', icon:'mic', label:'Oral micro-task: 2 minutes out loud from one mindmap branch',
        why:'Speaking production is easy to neglect in self-study — two minutes out loud, every day, is what makes it automatic.', fn:"DC.go('oral')" }
    : { key:'micro', icon:'pen-line', label:'Writing micro-task: plan + first 5 lines of a task',
        why:'Free production is what the exam actually grades — a few lines a day keeps your typed Danish exam-ready, not just recognition.', fn:"DC.go('writing')" });
  if (examStep) steps.unshift(examStep);
  return steps;
};
DC.todaySteps = function(){
  DC.todayReset();
  return DC.state.today.steps;
};
DC.todayMark = function(key){
  DC.todayReset();
  if (DC.state.today.done.indexOf(key)===-1) DC.state.today.done.push(key);
  DC.save();
};
DC.renderToday = function(){
  DC.todayReset();
  const steps = DC.todaySteps();
  const doneKeys = DC.state.today.done;
  const doneCount = steps.filter(s=>doneKeys.indexOf(s.key)>=0).length;
  let h = '<div class="space-y-4 fade-in max-w-2xl mx-auto">';
  h += '<div class="card p-5"><div class="flex items-center gap-2 mb-1"><i data-lucide="sparkles" class="w-5 h-5 text-indigo-300"></i><h2 class="font-bold text-slate-100">Today’s Session</h2></div>'+
    '<p class="text-sm text-slate-400">One sequenced plan: reviews, then re-tests, then vocab, then your weakest spot, then one production task. Work through it in order and tick each one off.</p>'+
    '<div class="mt-3 h-2 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-indigo-500 rounded-full" style="width:'+(steps.length?pct(doneCount,steps.length):100)+'%"></div></div></div>';
  if (!steps.length){
    h += '<div class="card p-6 text-center text-sm text-slate-400"><i data-lucide="check-circle-2" class="w-8 h-8 text-emerald-400 mx-auto mb-2"></i>Nothing scheduled right now — practice something and today’s session will fill in.</div>';
  } else {
    steps.forEach((s,i)=>{
      const done = doneKeys.indexOf(s.key)>=0;
      h += '<div class="card p-4 flex items-start gap-3'+(done?' opacity-60':'')+'"><div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 '+(done?'bg-emerald-500/20':'bg-indigo-500/15')+'"><i data-lucide="'+(done?'check':s.icon)+'" class="w-4 h-4 '+(done?'text-emerald-300':'text-indigo-300')+'"></i></div>'+
        '<div class="flex-1"><div class="font-semibold text-sm text-slate-100">'+(i+1)+'. '+esc(s.label)+'</div><div class="text-xs text-slate-400 mt-0.5">'+esc(s.why)+'</div></div>'+
        '<button onclick="DC.todayMark(\''+s.key+'\');'+s.fn+'" class="px-3 py-2 rounded-xl text-xs font-semibold shrink-0 '+(done?'bg-slate-800 text-slate-400 hover:bg-slate-700':'bg-indigo-600 hover:bg-indigo-500 text-white')+'">'+(done?'Do again':'Mark done & go →')+'</button></div>';
    });
  }
  if (steps.length && doneCount>=steps.length){
    const doneSteps = steps.filter(s=>doneKeys.indexOf(s.key)>=0);
    const trend = (DC.state.readinessLog||[]).slice(-13).concat([{date:'I dag', readiness:Brain.readiness()}]);
    h += '<div class="card p-5 !border-emerald-500/40"><div class="text-center mb-4"><i data-lucide="party-popper" class="w-8 h-8 text-emerald-300 mx-auto mb-2"></i><div class="font-bold text-slate-100">Session done for today</div><div class="text-xs text-slate-400 mt-1">Kom tilbage i morgen — a new session unlocks then.</div></div>'+
      '<div class="border-t border-slate-800 pt-3"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">What you did today</div><ul class="text-sm text-slate-300 space-y-1 mb-4">'+
      doneSteps.map(s=>'<li class="flex items-center gap-2"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i>'+esc(s.label)+'</li>').join('')+'</ul>'+
      '<div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Readiness trend</div>'+
      DC.sparklineHTML(trend)+'</div></div>';
  }
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};
/* tiny CSS-bar sparkline — first data-viz in the app, kept to plain flexbox (no canvas/SVG/library needed) */
DC.sparklineHTML = function(points){
  if (!points || points.length < 2) return '<div class="text-xs text-slate-500">Come back after a few more study days to see your trend.</div>';
  return '<div class="flex items-end gap-1 h-16">'+points.map(p=>{
    const h = Math.max(4, Math.round(p.readiness));
    return '<div class="flex-1 h-full flex items-end" title="'+esc(p.date)+': '+p.readiness+'%"><div class="w-full rounded-t bg-indigo-500" style="height:'+h+'%"></div></div>';
  }).join('')+'</div>';
};

/* =====================================================================
   COACH REPORT — one printable page synthesizing everything the app
   already tracks (readiness, area scores, weak concepts, timed-practice
   history). Read-only: no new data collected, just an honest snapshot.
   ===================================================================== */
DC.renderReport = function(){
  const s = DC.state;
  const areas = ['Grammar','Reading','Writing','Oral'];
  const weak = Brain.weakConcepts();
  const exams = (s.exams||[]).slice(-8);
  const trend = (s.readinessLog||[]).slice(-13).concat([{date:'I dag', readiness:Brain.readiness()}]);
  let h = '<div class="space-y-4 fade-in max-w-3xl mx-auto">';
  h += '<div class="card p-6"><div class="flex items-center gap-3 mb-2"><div class="w-11 h-11 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0"><i data-lucide="bar-chart-3" class="w-6 h-6 text-indigo-300"></i></div>'+
    '<div class="flex-1"><h2 class="font-bold text-lg text-slate-100">Coach Report</h2><div class="text-xs text-slate-400">Your full progress at a glance — print or save it before exam day.</div></div>'+
    '<button onclick="window.print()" class="no-print px-3 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-slate-100 text-xs font-semibold flex items-center gap-1.5 shrink-0"><i data-lucide="printer" class="w-3.5 h-3.5"></i>Print</button></div>'+
    '<p class="text-sm text-slate-300 italic">“'+esc(Brain.encouragement())+'”</p></div>';

  h += '<div class="card p-5"><div class="flex items-center justify-between mb-2"><h3 class="font-bold text-slate-100">Exam readiness</h3><span class="text-2xl font-extrabold text-indigo-300">'+Brain.readiness()+'%</span></div>'+
    DC.sparklineHTML(trend)+'</div>';

  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-3">By skill area</h3><div class="space-y-3">'+
    areas.map(a=>{
      const sc = Brain.areaScore(a);
      return '<div><div class="flex items-center justify-between text-sm mb-1"><span class="text-slate-300">'+a+'</span><span class="font-semibold text-slate-100">'+sc+'%</span></div>'+
        '<div class="h-2 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-indigo-500 rounded-full" style="width:'+sc+'%"></div></div></div>';
    }).join('')+'</div></div>';

  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-2">Focus areas</h3>'+
    (weak.length ? '<ul class="text-sm text-slate-300 space-y-1.5">'+weak.map(id=>'<li class="flex items-center gap-2"><i data-lucide="flame" class="w-3.5 h-3.5 text-rose-400 shrink-0"></i>'+esc(CONCEPTS[id].name)+' <span class="text-xs text-slate-500">('+CONCEPTS[id].area+')</span></li>').join('')+'</ul>'
      : '<div class="text-sm text-slate-400">Nothing flagged Weak right now — nice and stable.</div>')+
    '<div class="mt-3 text-xs text-indigo-200 bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-3 py-2"><b>Coach’s note:</b> '+esc(Brain.advice())+'</div></div>';

  h += '<div class="card p-5"><h3 class="font-bold text-slate-100 mb-2">Timed practice history</h3>'+
    (exams.length ? '<div class="space-y-2">'+exams.slice().reverse().map(e=>
      '<div class="flex items-center gap-3 text-sm bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 flex-wrap"><span class="text-slate-400 w-32 shrink-0">'+fmtDate(e.ts)+'</span>'+
      '<span class="flex-1 min-w-[160px]">Reading '+pct(e.reading.score,e.reading.total)+'% · Writing '+e.writing.self+'/'+e.writing.total+'</span>'+
      '<span class="font-bold text-indigo-300 shrink-0">'+e.overall+'%</span></div>').join('')+'</div>'
      : '<div class="text-sm text-slate-400">No full Mock Exam or Simulation yet — take one to establish your baseline.</div>')+
    '</div>';

  h += '</div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
};

/* ---------- small render helpers ---------- */
/* explicit hex colours so chips stay readable in the light theme (violet tokens are not remapped) */
function vocGenderChip(w){
  if(w.pos!=='sb' || !w.g) return '';
  const hex = w.g==='en' ? '#0d7090' : '#7c3aed';
  return '<span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="color:'+hex+';background:'+hex+'1a;border:1px solid '+hex+'55">'+w.g+'</span>';
}
const VOC_POS_HEX = { sb:'#0d7090', vb:'#2e7d32', adj:'#b78103', adv:'#7c3aed', udtryk:'#c62828', forb:'#4338ca', prep:'#0f766e' };
function vocPosChip(w){
  const p = VOCAB_POS[w.pos]; if(!p) return '';
  const hex = VOC_POS_HEX[w.pos] || '#475569';
  return '<span class="text-[10px] font-medium px-1.5 py-0.5 rounded" style="color:'+hex+';background:'+hex+'14;border:1px solid '+hex+'44">'+p.da+'</span>';
}
function vocThemeMeta(k){ return VOCAB_THEMES.find(t=>t.k===k) || {t:k,e:'•'}; }

function vocCardHTML(w){
  const st = DC.vocSrs(w.da);
  const badge = st.mastered
    ? '<span class="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/40 rounded px-1.5 py-0.5 flex items-center gap-1"><i data-lucide="check" class="w-3 h-3"></i>kan</span>'
    : (st.reps>0 ? '<span class="text-[10px] font-medium text-amber-300/90">øver</span>' : '');
  let h = '<div class="card p-3.5">';
  h += '<div class="flex items-start justify-between gap-3 flex-wrap">';
  h += '<div class="min-w-0"><div class="flex items-center gap-2 flex-wrap">'+
        '<span class="font-bold text-base text-slate-100">'+esc(w.da)+'</span>'+DC.spk(w.da)+
        vocGenderChip(w)+vocPosChip(w)+'</div>'+
        '<div class="text-sm text-slate-300 mt-0.5">'+esc(w.en)+'</div></div>';
  h += '<div class="shrink-0">'+badge+'</div>';
  h += '</div>';
  if(w.b){ h += '<div class="mt-2 text-xs text-slate-400 flex items-center gap-1.5 flex-wrap"><span class="font-mono text-slate-300">'+esc(w.b)+'</span>'+DC.spk(w.b.split('–')[0].replace(/^(at|en|et)\s+/,'').trim()||w.da)+'</div>'; }
  if(w.ex && w.ex.length){
    h += '<div class="mt-2 space-y-1">';
    w.ex.forEach(e=>{ h += '<div class="text-sm text-slate-200 flex items-start gap-1.5 flex-wrap"><span class="text-slate-100">'+esc(e.da)+'</span>'+DC.spk(e.da)+'<span class="text-slate-500 text-xs italic">— '+esc(e.en)+'</span></div>'; });
    h += '</div>';
  }
  if(w.col){ h += '<div class="mt-2 text-xs text-teal-300/90 flex items-center gap-1"><i data-lucide="link" class="w-3 h-3"></i>'+esc(w.col)+'</div>'; }
  if(w.note){ h += '<div class="mt-1.5 text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5">💡 '+esc(w.note)+'</div>'; }
  h += '</div>';
  return h;
}

/* ---------- the view ---------- */
DC.vocabMode = 'dict';
DC.vocabTheme = 'all';
DC.vocabQuery = '';
DC.vocabDir = 'en2da';

DC.renderVocab = function(){
  const total = DC.allVocab().length, learned = DC.vocLearned(), due = DC.vocDue();
  const tab = (id,ico,lbl)=> '<button onclick="DC.vocabSetMode(\''+id+'\')" class="flex-1 min-w-[110px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border '+(DC.vocabMode===id?'bg-indigo-600 text-white border-indigo-500':'text-slate-300 border-slate-700 hover:bg-slate-900')+'"><i data-lucide="'+ico+'" class="w-4 h-4"></i>'+lbl+'</button>';
  let h = '<div class="space-y-4 fade-in max-w-4xl mx-auto">';
  h += '<div class="card p-5"><div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0"><i data-lucide="book-marked" class="w-5 h-5 text-indigo-300"></i></div>'+
       '<div class="flex-1"><h2 class="font-bold text-slate-100">Ordforråd — '+total+' must-know words & phrases</h2>'+
       '<div class="text-xs text-slate-400">Every word with gender, full forms, a real example, the tricky preposition, and audio. Learn it by heart with spaced-repetition flashcards.</div></div>'+
       '<button onclick="DC.vocabImportModal()" class="shrink-0 px-3 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-slate-100 text-xs font-semibold flex items-center gap-1.5"><i data-lucide="sparkles" class="w-3.5 h-3.5"></i>Import words</button></div>';
  h += '<div class="grid grid-cols-3 gap-3 mb-3">'+
        '<div class="rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2.5 text-center"><div class="text-xl font-bold text-slate-100">'+total+'</div><div class="text-[10px] uppercase tracking-wider text-slate-500">i alt</div></div>'+
        '<div class="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2.5 text-center"><div class="text-xl font-bold text-emerald-300">'+learned+'</div><div class="text-[10px] uppercase tracking-wider text-emerald-400/80">kan udenad</div></div>'+
        '<div class="rounded-xl '+(due>0?'bg-amber-500/10 border-amber-500/30':'bg-slate-900/60 border-slate-800')+' border px-3 py-2.5 text-center"><div class="text-xl font-bold '+(due>0?'text-amber-300':'text-slate-100')+'">'+due+'</div><div class="text-[10px] uppercase tracking-wider text-slate-500">klar til genlæsning</div></div></div>';
  h += '<div class="flex gap-2 flex-wrap">'+tab('dict','search','Ordbog')+tab('flash','layers','Flashcards')+tab('test','check-circle','Test')+'</div>';
  h += '</div>';
  if(DC.vocabMode==='dict') h += DC.vocabDictHTML();
  else if(DC.vocabMode==='flash') h += '<div id="voc-flash"></div>';
  else h += '<div id="voc-test"></div>';
  h += '</div>';
  document.getElementById('main').innerHTML = h;
  DC.icons();
  if(DC.vocabMode==='flash') DC.vocFlashStart();
  else if(DC.vocabMode==='test') DC.vocTestStart();
  else { const inp=document.getElementById('voc-search'); if(inp){ inp.value=DC.vocabQuery; } }
};
DC.vocabSetMode = function(m){ DC.vocabMode=m; DC.renderVocab(); window.scrollTo({top:0}); };

/* ---------- import extra words generated by an LLM the student runs outside the app ----------
   same round-trip pattern as DC.copyCensorPrompt/DC.ingestCensorReply: copy a prompt, run it in
   any chatbot, paste the reply back, parse it. Keeps the app's zero-API-calls, fully-offline rule. */
DC.vocabImportModal = function(){
  DC.modal('<div class="text-sm text-slate-100 mb-2 font-bold">Import words from an LLM</div>'+
    '<p class="text-xs text-slate-400 mb-3">Run a prompt in ChatGPT, Claude, Gemini or any chatbot — outside this app, which stays fully offline — then paste the reply back in below.</p>'+
    '<input id="vocab-import-topic" type="text" placeholder="Topic (e.g. i køkkenet, på hospitalet, til jobsamtale)…" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm mb-2">'+
    '<button onclick="DC.copyVocabPrompt()" class="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 mb-3"><i data-lucide="clipboard-copy" class="w-3.5 h-3.5"></i>Copy prompt</button>'+
    '<textarea id="vocab-paste" rows="8" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono mb-3" placeholder="Paste the LLM’s reply here…"></textarea>'+
    '<button onclick="DC.parseVocabImport()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Parse &amp; add to Ordforråd</button>');
  DC.icons();
};
DC.copyVocabPrompt = function(){
  const topic = ((document.getElementById('vocab-import-topic')||{}).value || '').trim() || 'everyday life in Denmark';
  const prompt = 'Generate 15 Danish vocabulary words for a Danskuddannelse 3 (Module 3.3) student about: '+topic+'.\n'+
    'Format EXACTLY one word per line, nothing else — no numbering, no headings, no extra commentary — like this:\n'+
    'dansk ord — English translation — Et dansk eksempel med ordet.';
  const done = function(){ DC.toast('Prompt copied! Paste it into ChatGPT, Claude or Gemini, then paste the reply below.','ok'); };
  const fail = function(){ DC.toast('Could not copy automatically — select and copy the prompt manually.','err'); DC.modal('<div class="text-sm text-slate-100 mb-2 font-bold">Vocabulary prompt</div><textarea readonly rows="8" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono">'+esc(prompt)+'</textarea>'); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(prompt).then(done, fail);
  else fail();
};
DC.parseVocabImport = function(){
  const raw = (document.getElementById('vocab-paste')||{}).value || '';
  const re = /^\s*([^\n—–-]+?)\s*[—–-]\s*([^\n—–-]+?)\s*[—–-]\s*(.+?)\s*$/gm;
  const known = new Set(DC.allVocab().map(w=>w.da.toLowerCase()));
  const added = [];
  let m;
  while ((m = re.exec(raw))){
    const da = m[1].trim(), en = m[2].trim(), exDa = m[3].trim();
    if (!da || !en || known.has(da.toLowerCase())) continue;
    known.add(da.toLowerCase());
    added.push({ da, en, pos:'', g:'', b:'', th:'custom', ex:(exDa?[{da:exDa, en:''}]:[]), col:'', note:'Imported from an LLM' });
  }
  if (!added.length){ DC.toast('No "word — translation — example" lines found — check the pasted text matches the format.','warn'); return; }
  DC.state.customVocab = (DC.state.customVocab||[]).concat(added);
  DC.save();
  DC.closeModal();
  DC.toast(added.length+' new word'+(added.length>1?'s':'')+' added to your Ordforråd.','ok');
  if (DC.view==='vocab') DC.renderVocab();
};

/* ---- dictionary ---- */
DC.vocabDictHTML = function(){
  let h = '<div class="card p-4">';
  h += '<div class="relative mb-3"><i data-lucide="search" class="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"></i>'+
       '<input id="voc-search" type="search" oninput="DC.vocabFilter()" placeholder="Søg på dansk eller engelsk…" class="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500" autocomplete="off"></div>';
  h += '<div class="flex gap-1.5 flex-wrap">';
  const chip = (k,lbl)=> '<button onclick="DC.vocabSetTheme(\''+k+'\')" data-vth="'+k+'" class="text-xs font-medium px-2.5 py-1.5 rounded-lg border '+(DC.vocabTheme===k?'bg-indigo-600 text-white border-indigo-500':'text-slate-300 border-slate-700 hover:bg-slate-900')+'">'+lbl+'</button>';
  h += chip('all','Alle');
  VOCAB_THEMES.forEach(t=> h += chip(t.k, t.e+' '+t.t));
  h += '</div></div>';
  h += '<div id="voc-list">'+DC.vocabListHTML()+'</div>';
  return h;
};
DC.vocabListHTML = function(){
  const q = (DC.vocabQuery||'').toLowerCase().trim();
  let list = DC.allVocab().filter(w=>{
    if(DC.vocabTheme!=='all' && w.th!==DC.vocabTheme) return false;
    if(!q) return true;
    return (w.da+' '+w.en+' '+w.b+' '+w.col).toLowerCase().indexOf(q)>=0
        || w.ex.some(e=>(e.da+' '+e.en).toLowerCase().indexOf(q)>=0);
  });
  if(!list.length) return '<div class="card p-6 text-center text-sm text-slate-400"><i data-lucide="search-x" class="w-7 h-7 text-slate-600 mx-auto mb-2"></i>Ingen ord matcher "'+esc(DC.vocabQuery)+'". Prøv et andet ord.</div>';
  let h = '<div class="text-xs text-slate-500 mb-2 mt-3">'+list.length+' ord'+(DC.vocabTheme!=='all'?' i temaet':'')+'</div>';
  // group by theme (when showing all) for structure
  if(DC.vocabTheme==='all' && !q){
    VOCAB_THEMES.forEach(t=>{
      const items = list.filter(w=>w.th===t.k);
      if(!items.length) return;
      h += '<div class="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mt-4 mb-2 flex items-center gap-2"><span>'+t.e+'</span>'+esc(t.t)+'<span class="text-slate-700">·</span><span class="text-slate-600 normal-case tracking-normal">'+items.length+'</span></div>';
      h += '<div class="space-y-2.5">'+items.map(vocCardHTML).join('')+'</div>';
    });
  } else {
    h += '<div class="space-y-2.5">'+list.map(vocCardHTML).join('')+'</div>';
  }
  return h;
};
DC.vocabFilter = function(){
  const inp = document.getElementById('voc-search');
  DC.vocabQuery = inp ? inp.value : '';
  const box = document.getElementById('voc-list');
  if(box){ box.innerHTML = DC.vocabListHTML(); DC.icons(); }
};
DC.vocabSetTheme = function(k){
  DC.vocabTheme = k;
  document.querySelectorAll('[data-vth]').forEach(el=>{
    const on = el.dataset.vth===k;
    el.className = 'text-xs font-medium px-2.5 py-1.5 rounded-lg border '+(on?'bg-indigo-600 text-white border-indigo-500':'text-slate-300 border-slate-700 hover:bg-slate-900');
  });
  const box = document.getElementById('voc-list');
  if(box){ box.innerHTML = DC.vocabListHTML(); DC.icons(); }
};

/* ---- flashcards ---- */
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
DC.vocFlashStart = function(){
  let pool = DC.allVocab().filter(w=> DC.vocabTheme==='all' || w.th===DC.vocabTheme);
  const now = Date.now();
  const due = pool.filter(w=>{ const s=DC.vocSrs(w.da); return s.reps>0 && !s.mastered && s.due<=now; });
  const fresh = pool.filter(w=>{ const s=DC.vocSrs(w.da); return s.reps===0; });
  const rest = pool.filter(w=>{ const s=DC.vocSrs(w.da); return s.reps>0 && (s.mastered || s.due>now); });
  DC.vocDeck = shuffle(due).concat(shuffle(fresh)).concat(shuffle(rest)).slice(0,40);
  DC.vocI = 0; DC.vocShown = false; DC.vocRight = 0;
  DC.vocFlashRender();
};
DC.vocFlashRender = function(){
  const box = document.getElementById('voc-flash'); if(!box) return;
  const scope = DC.vocabTheme==='all' ? 'alle temaer' : vocThemeMeta(DC.vocabTheme).t;
  if(DC.vocI >= DC.vocDeck.length){
    box.innerHTML = '<div class="card p-6 text-center fade-in !border-emerald-500/40"><i data-lucide="party-popper" class="w-9 h-9 text-emerald-300 mx-auto mb-2"></i>'+
      '<div class="font-bold text-slate-100 mb-1">Runde færdig — '+DC.vocDeck.length+' kort gennemgået</div>'+
      '<div class="text-sm text-slate-400 mb-4">Ord, du markerede <b>Igen</b>, kommer hurtigt igen. <b>Kan udenad: '+DC.vocLearned()+' / '+DC.allVocab().length+'</b>.</div>'+
      '<div class="flex gap-2 justify-center flex-wrap"><button onclick="DC.vocFlashStart()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2"><i data-lucide="rotate-ccw" class="w-4 h-4"></i>En runde til</button>'+
      '<button onclick="DC.vocabSetMode(\'test\')" class="px-4 py-2 rounded-xl border border-slate-700 text-slate-200 text-sm font-semibold">Tag en test</button></div></div>';
    DC.icons(); DC.renderHeader(); return;
  }
  const w = DC.vocDeck[DC.vocI];
  const dirBtn = (id,lbl)=> '<button onclick="DC.vocFlashDir(\''+id+'\')" class="text-xs font-semibold px-2.5 py-1 rounded-lg border '+(DC.vocabDir===id?'bg-slate-200 text-slate-900 border-slate-200':'text-slate-300 border-slate-700')+'">'+lbl+'</button>';
  const front = DC.vocabDir==='en2da' ? esc(w.en) : esc(w.da)+' '+DC.spk(w.da);
  const frontSub = DC.vocabDir==='en2da' ? 'engelsk → dansk' : 'dansk → engelsk';
  let h = '<div class="card p-5 fade-in !border-indigo-500/30">';
  h += '<div class="flex items-center justify-between mb-3 flex-wrap gap-2"><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">Kort '+(DC.vocI+1)+' / '+DC.vocDeck.length+' · '+esc(scope)+'</div>'+
       '<div class="flex gap-1.5">'+dirBtn('en2da','EN → DA')+dirBtn('da2en','DA → EN')+'</div></div>';
  h += '<div class="text-center py-6"><div class="text-[10px] uppercase tracking-widest text-slate-500 mb-2">'+frontSub+'</div>'+
       '<div class="text-2xl font-bold text-slate-100 flex items-center justify-center gap-2 flex-wrap">'+front+'</div>';
  if(DC.vocShown){
    const back = DC.vocabDir==='en2da' ? esc(w.da) : esc(w.en);
    h += '<div class="mt-4 pt-4 border-t border-slate-800">';
    h += '<div class="text-2xl font-bold text-emerald-200 flex items-center justify-center gap-2 flex-wrap mb-2">'+back+(DC.vocabDir==='en2da'?DC.spk(w.da):'')+vocGenderChip(w)+'</div>';
    if(w.b) h += '<div class="text-xs font-mono text-slate-400 mb-2">'+esc(w.b)+'</div>';
    if(w.ex && w.ex[0]) h += '<div class="text-sm text-slate-300 flex items-center justify-center gap-2 flex-wrap">'+esc(w.ex[0].da)+DC.spk(w.ex[0].da)+'<span class="text-slate-500 italic text-xs">— '+esc(w.ex[0].en)+'</span></div>';
    if(w.note) h += '<div class="text-xs text-amber-200/90 mt-2">💡 '+esc(w.note)+'</div>';
    h += '</div>';
  }
  h += '</div>';
  if(!DC.vocShown){
    h += '<button onclick="DC.vocFlashShow()" class="w-full py-3 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-semibold text-sm flex items-center justify-center gap-2"><i data-lucide="eye" class="w-4 h-4"></i>Vis svar</button>';
  } else {
    h += '<div class="grid grid-cols-4 gap-2">'+
      '<button onclick="DC.vocRate(\'again\')" class="py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-bold">Igen<div class="text-[9px] font-normal text-rose-300/70">1 min</div></button>'+
      '<button onclick="DC.vocRate(\'hard\')" class="py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-bold">Svær</button>'+
      '<button onclick="DC.vocRate(\'good\')" class="py-2.5 rounded-xl bg-sky-500/15 border border-sky-500/40 text-sky-200 text-xs font-bold">Godt</button>'+
      '<button onclick="DC.vocRate(\'easy\')" class="py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-bold">Let<div class="text-[9px] font-normal text-emerald-300/70">kan det</div></button></div>';
  }
  h += '</div>';
  box.innerHTML = h; DC.icons();
};
DC.vocFlashShow = function(){ DC.vocShown=true; DC.vocFlashRender(); };
DC.vocFlashDir = function(d){ DC.vocabDir=d; DC.vocFlashRender(); };
DC.vocRate = function(r){
  const w = DC.vocDeck[DC.vocI];
  if(w){ DC.vocSchedule(w.da, r); if(r==='good'||r==='easy') DC.vocRight++; }
  DC.vocI++; DC.vocShown=false; DC.vocFlashRender();
};

/* ---- quick test (multiple choice) ---- */
DC.vocTestStart = function(){
  let pool = DC.allVocab().filter(w=> DC.vocabTheme==='all' || w.th===DC.vocabTheme);
  const items = shuffle(pool).slice(0, Math.min(10, pool.length)).map(w=>{
    const distract = shuffle(DC.allVocab().filter(x=>x.da!==w.da)).slice(0,3).map(x=>x.da);
    return { w:w, options: shuffle([w.da].concat(distract)) };
  });
  DC.vocT = { items:items, i:0, score:0 };
  DC.vocTestRender();
};
DC.vocTestRender = function(){
  const box = document.getElementById('voc-test'); if(!box) return;
  const T = DC.vocT;
  if(T.i >= T.items.length){
    const pc = Math.round(T.score/T.items.length*100);
    box.innerHTML = '<div class="card p-6 text-center fade-in '+(pc>=80?'!border-emerald-500/40':'')+'"><div class="text-3xl font-bold '+(pc>=80?'text-emerald-300':'text-slate-100')+' mb-1">'+T.score+' / '+T.items.length+'</div>'+
      '<div class="text-sm text-slate-400 mb-4">'+(pc>=80?'Flot! Det sidder godt fast.':'Godt øvet — kør en runde flashcards på de svære ord.')+'</div>'+
      '<div class="flex gap-2 justify-center flex-wrap"><button onclick="DC.vocTestStart()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Ny test</button>'+
      '<button onclick="DC.vocabSetMode(\'flash\')" class="px-4 py-2 rounded-xl border border-slate-700 text-slate-200 text-sm font-semibold">Til flashcards</button></div></div>';
    DC.icons(); DC.renderHeader(); return;
  }
  const it = T.items[T.i];
  let h = '<div class="card p-5 fade-in"><div class="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-2">Spørgsmål '+(T.i+1)+' / '+T.items.length+'</div>'+
    '<div class="text-sm text-slate-400 mb-1">Hvad hedder det på dansk?</div>'+
    '<div class="text-xl font-bold text-slate-100 mb-4">'+esc(it.w.en)+'</div>';
  h += '<div class="space-y-2" id="voc-test-opts">';
  it.options.forEach((opt,idx)=>{ h += '<button onclick="DC.vocTestAnswer('+idx+')" data-opt="'+idx+'" class="opt-btn w-full text-left px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:border-indigo-500 text-slate-100 text-sm font-medium flex items-center justify-between gap-2"><span>'+esc(opt)+'</span></button>'; });
  h += '</div><div id="voc-test-fb" class="mt-3"></div></div>';
  box.innerHTML = h; DC.icons();
};
DC.vocTestAnswer = function(idx){
  const T = DC.vocT, it = T.items[T.i];
  const chosen = it.options[idx], correct = it.w.da, ok = chosen===correct;
  if(ok){ T.score++; DC.vocSchedule(it.w.da,'good'); } else { DC.vocSchedule(it.w.da,'again'); }
  document.querySelectorAll('#voc-test-opts [data-opt]').forEach(b=>{
    b.disabled = true;
    const o = it.options[+b.dataset.opt];
    if(o===correct) b.className = 'opt-btn w-full text-left px-4 py-3 rounded-xl border border-emerald-500 bg-emerald-500/15 text-emerald-100 text-sm font-medium flex items-center justify-between gap-2';
    else if(+b.dataset.opt===idx) b.className = 'opt-btn w-full text-left px-4 py-3 rounded-xl border border-rose-500 bg-rose-500/15 text-rose-100 text-sm font-medium flex items-center justify-between gap-2';
    else b.className = 'opt-btn w-full text-left px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-500 text-sm font-medium flex items-center justify-between gap-2';
  });
  const fb = document.getElementById('voc-test-fb');
  if(fb){
    fb.innerHTML = '<div class="text-sm '+(ok?'text-emerald-300':'text-rose-300')+' font-semibold mb-1">'+(ok?'Rigtigt!':'Det rigtige er: '+esc(correct))+'</div>'+
      '<div class="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">'+esc(it.w.b||it.w.da)+DC.spk(correct)+(it.w.ex[0]?'<span class="text-slate-500">· '+esc(it.w.ex[0].da)+'</span>'+DC.spk(it.w.ex[0].da):'')+'</div>'+
      '<button onclick="DC.vocTestNext()" class="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2">Næste<i data-lucide="arrow-right" class="w-4 h-4"></i></button>';
    DC.icons();
  }
};
DC.vocTestNext = function(){ DC.vocT.i++; DC.vocTestRender(); };

/* ---------- navigation wiring ---------- */
VIEW_TITLES.vocab = 'Ordforråd — vocabulary & mini-dictionary';
(function(){
  const _go = DC.go;
  DC.go = function(view){
    if(view==='vocab'){
      DC.stopAllTimers(); DC.view='vocab';
      if(DC.state.behavior && DC.state.behavior.moduleVisits) DC.state.behavior.moduleVisits.vocab = (DC.state.behavior.moduleVisits.vocab||0)+1;
      document.querySelectorAll('.nav-btn').forEach(el=>el.classList.toggle('active', el.dataset.nav==='vocab'));
      const t=document.getElementById('header-title'); if(t) t.textContent=VIEW_TITLES.vocab;
      DC.vocabMode='dict';
      DC.renderVocab(); DC.save(); window.scrollTo({top:0});
      if(typeof DC.drawer==='function') DC.drawer(false);
      return;
    }
    _go(view);
  };
})();

/* nav badge: words due for review */
(function(){
  const _rh = DC.renderHeader;
  DC.renderHeader = function(){
    _rh();
    const el = document.getElementById('voc-count');
    if(el){ const d=DC.vocDue(); el.textContent=d; el.classList.toggle('hidden', d===0); }
  };
})();


/* readiness: fold in dojo (grammar + reading/writing) and vocab mastery as real weighted
   components — core 75% (mastery/accuracy/mock/review/calibration) + dojo 15% + vocab 10%.
   Everything here is recomputed fresh on every call, so the number can rise AND fall. */
(function(){
  Brain.readiness = function(){
    const core = Brain.readinessCore();
    /* 'Mastered' status excludes topics whose spaced re-test is overdue — skipping re-tests costs the credit */
    const dojoPart = pct(DOJO_ALL.filter(id=>DC.dojoStatus(id)==='Mastered').length, DOJO_ALL.length);
    /* mastered words older than 60 days without a re-look count half */
    const staleMs = 60*24*3600*1000, now = Date.now();
    const vocScore = DC.allVocab().reduce((t,w)=>{ const st=DC.vocSrs(w.da); if(!st.mastered) return t; return t + ((now - (st.due||now)) > staleMs ? 0.5 : 1); }, 0);
    const vocabPart = pct(Math.round(vocScore), DC.allVocab().length);
    return Math.round(core*0.75 + dojoPart*0.15 + vocabPart*0.10);
  };
})();



/* =====================================================================
   EXAM DATE — an always-visible control in the header + a simple modal,
   reachable from EVERY page (no more hunting on the dashboard).
   ===================================================================== */
DC.setExamDate = function(v){
  DC.state.examDate = v||null; DC.save();
  if (typeof DC.renderHeader==='function') DC.renderHeader();
  if (DC.view==='dashboard' && typeof DC.renderDashboard==='function') DC.renderDashboard();
};
DC.examDateModal = function(){
  const cur = DC.state.examDate || '';
  let info = '';
  if (cur){
    const days = Math.ceil((new Date(cur+'T09:00') - Date.now())/86400000);
    info = '<div class="text-xs text-slate-400 mb-3">Currently set to <b class="text-slate-200">'+esc(cur)+'</b> — '+(days>=0?days+' day'+(days===1?'':'s')+' to go.':'that date has passed.')+'</div>';
  }
  DC.modal(
    '<div class="flex items-center justify-between mb-3"><h3 class="font-bold text-slate-100 flex items-center gap-2"><i data-lucide="calendar-clock" class="w-5 h-5 text-indigo-300"></i>Your exam date</h3><button onclick="DC.closeModal()" class="text-slate-500 hover:text-slate-300"><i data-lucide="x" class="w-5 h-5"></i></button></div>'+
    '<p class="text-sm text-slate-400 mb-3">Pick your SIRI Modul 3.3 modultest date. I will count down and plan your focus backwards from it.</p>'+
    info+
    '<input type="date" id="exam-date-input" value="'+esc(cur)+'" class="gapsel w-full mb-4">'+
    '<div class="flex items-center gap-2">'+
      '<button onclick="DC.saveExamDateFromModal()" class="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2"><i data-lucide="check" class="w-4 h-4"></i>Save date</button>'+
      (cur?'<button onclick="DC.removeExamDate()" class="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-slate-100 text-sm font-semibold">Remove</button>':'')+
    '</div>'
  );
  setTimeout(function(){ const el=document.getElementById('exam-date-input'); if(el){ try{ el.focus(); if(el.showPicker) el.showPicker(); }catch(e){} } }, 60);
};
DC.saveExamDateFromModal = function(){
  const el = document.getElementById('exam-date-input');
  const v = el ? el.value : '';
  if (!v){ DC.toast('Please pick a date first.','warn'); return; }
  DC.setExamDate(v);
  DC.closeModal();
  DC.toast('Exam date set to '+v+'. Counting down!','ok');
};
DC.removeExamDate = function(){
  DC.setExamDate(null);
  DC.closeModal();
  DC.toast('Exam date removed.','ok');
};

/* keep the header chip in sync with state */
(function(){
  const _rh = DC.renderHeader;
  DC.renderHeader = function(){
    _rh();
    const cur = DC.state.examDate;
    let label = 'Set date', days = null;
    if (cur){
      days = Math.ceil((new Date(cur+'T09:00') - Date.now())/86400000);
      const dt = new Date(cur+'T09:00');
      const short = isNaN(dt.getTime()) ? cur : dt.toLocaleDateString('en-GB',{day:'numeric',month:'short'});
      label = (days>=0 ? short : 'past');
    }
    const v1 = document.getElementById('header-examdate-val');
    if (v1) v1.textContent = label;
    const v2 = document.getElementById('mob-examdate');
    if (v2) v2.title = cur ? (days>=0?days+' days to exam':'exam date passed') : 'Set your exam date';
  };
})();



/* Dansk Coach — data/08-exam-pack.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   EXTENSION PACK 1 — more reading tasks, more writing tasks,
   full mock exam content, daily small talk
   ===================================================================== */

/* ---------- extra chat tasks (Opgave 2A) — auto-picked up by the chat tab ---------- */
READING.chats.push(
{ id:'chat3', concept:'r-2a', opgave:'Opgave 2A',
  title:'Mia skriver til sin kollega Anders',
  situation:'Situation: Mia skriver til sin kollega Anders.',
  instruction:'Læs Mias og Anders’ chat. Der er 3 beskeder fra Mia. Find de svar fra Anders, der passer (A–F). Der er tre svar, du ikke skal bruge. Se eksemplet (0).',
  personX:'Mia', personY:'Anders',
  example:{ x:'Hej Anders! Har du to minutter?', reply:'Hej Mia! Ja, hvad så?', letter:'Z' },
  turns:[
    { x:'Det er Karins sidste dag på fredag. Skal vi købe en gave til hende fra hele teamet?', correct:'C',
      why:'Mia proposes a shared gift; C agrees AND asks what to give — which Mia answers next ("en god flaske vin og nogle blomster").' },
    { x:'Måske en god flaske vin og nogle blomster?', correct:'E',
      why:'E accepts the idea and asks about the price per person — exactly what Mia answers next ("30 kroner per person").' },
    { x:'Hvis vi er ti personer, bliver det cirka 30 kroner per person.', correct:'A',
      why:'A accepts the amount and offers to collect the money — and Mia thanks him for it in her next message.' }
  ],
  options:[
    { letter:'A', text:'Det er helt okay. Skal jeg samle pengene ind i frokostpausen?' },
    { letter:'B', text:'Nej tak, jeg drikker ikke vin.', distractorWhy:'Keyword trap ("vin") — but nobody offers Anders wine; the wine is a gift for Karin.' },
    { letter:'C', text:'God idé! Hvad tænker du, vi skal give hende?' },
    { letter:'D', text:'Jeg kan desværre ikke komme til mødet i dag.', distractorWhy:'No meeting is mentioned anywhere in this chat — it answers a question nobody asked.' },
    { letter:'E', text:'Det lyder fint. Hvor meget skal vi hver især betale?' },
    { letter:'F', text:'Blomsterne var rigtig flotte til festen i går.', distractorWhy:'Tense trap: it talks about flowers at a party YESTERDAY — the gift is for Friday and has not been bought yet.' }
  ]
},
{ id:'chat4', concept:'r-2a', opgave:'Opgave 2A',
  title:'Jonas skriver til sin veninde Sofia',
  situation:'Situation: Jonas skriver til sin veninde Sofia.',
  instruction:'Læs Jonas’ og Sofias chat. Der er 3 beskeder fra Jonas. Find de svar fra Sofia, der passer (A–F). Der er tre svar, du ikke skal bruge. Se eksemplet (0).',
  personX:'Jonas', personY:'Sofia',
  example:{ x:'Hej Sofia! Hvad laver du på lørdag?', reply:'Hej Jonas! Ikke noget særligt. Hvorfor spørger du?', letter:'Z' },
  turns:[
    { x:'Vi holder fødselsdag for min søn Oscar. Han bliver seks år. Vil du komme?', correct:'D',
      why:'An invitation gets an acceptance plus a practical question about the time — which Jonas answers next ("Klokken 14").' },
    { x:'Klokken 14 hjemme hos os. Vi griller, hvis vejret er godt.', correct:'F',
      why:'F reacts to the plan and offers to bring food — and Jonas answers exactly that ("En salat ville være perfekt").' },
    { x:'En salat ville være perfekt. Vi bliver cirka tolv personer.', correct:'B',
      why:'B confirms the salad for a big group AND asks about a present — which Jonas answers next ("dinosaurer").' }
  ],
  options:[
    { letter:'A', text:'Tillykke med dit nye arbejde!', distractorWhy:'Nobody mentions a new job — a congratulations with no target.' },
    { letter:'B', text:'Så laver jeg en stor pastasalat. Hvad ønsker Oscar sig i gave?' },
    { letter:'C', text:'Nej, jeg har desværre travlt hele weekenden.', distractorWhy:'Contradiction trap: the rest of the chat shows Sofia IS coming and even brings a salad.' },
    { letter:'D', text:'Det vil jeg meget gerne! Hvad tid begynder festen?' },
    { letter:'E', text:'Oscar går i min datters klasse, ikke?', distractorWhy:'A question that nothing in the chat asks for — it fits no gap and gets no answer.' },
    { letter:'F', text:'Super! Skal jeg tage noget med — måske en kage eller en salat?' }
  ]
});

/* ---------- second cloze task ---------- */
READING.clozeB = {
  id:'clozeB', concept:'r-keywords', opgave:'Opgave 1',
  title:'Besked til alle medarbejdere',
  instruction:'Læs teksten. Der mangler seks ord. Vælg for hvert hul det ord, der passer bedst, blandt de 12 ord i ordbanken.',
  parts:[
    'Kære alle. Kantinen holder lukket ', {g:0}, ' uge 28 til uge 30. I kan stadig købe kaffe og te i automaten på første ', {g:1},
    '. Husk også, at I skal ', {g:2}, ' jeres ferie i systemet senest den 1. juni. Hvis I har spørgsmål, kan I ', {g:3},
    ' til Lone i HR. Hun sidder på kontoret ved ', {g:4}, ' af gangen. Vi ønsker jer alle en rigtig god ', {g:5}, '!'
  ],
  bank:['dør','enden','fra','glemme','om','registrere','sal','siden','skrive','sommer','svare','weekend'],
  gaps:[
    { correct:'fra', why:'Periods use "fra … til …": closed FROM week 28 TO week 30.' },
    { correct:'sal', why:'Danish floors are "sal": "på første sal" = on the first floor.' },
    { correct:'registrere', why:'You register ("registrere") your holiday in the system.' },
    { correct:'skrive', why:'"skrive til nogen" = write to someone.' },
    { correct:'enden', why:'"ved enden af gangen" = at the end of the corridor.' },
    { correct:'sommer', why:'The text is about ugerne 28–30 — the summer holiday. "Vi ønsker jer en rigtig god sommer!"' }
  ]
};

/* ---------- second Opgave 3 task ---------- */
READING.o3b = {
  id:'o3b', concept:'r-3', opgave:'Opgave 3',
  title:'Ahmeds nye job',
  instruction:'Læs teksten "Ahmeds nye job". Der er fem afsnit. I hvert afsnit mangler der en sætning. Vælg den sætning, der passer i afsnittet. Der er tre sætninger i hvert afsnit, du ikke skal bruge.',
  paragraphs:[
  { pre:'Ahmed kom til Danmark fra Syrien for fire år siden. I sit hjemland arbejdede han som elektriker i mere end ti år, og han var rigtig dygtig til sit fag. Men i Danmark kunne han ikke bare fortsætte i sit gamle arbejde. ',
    post:' For uden dansk kunne han hverken tale med kunder eller forstå sikkerhedsreglerne på en dansk arbejdsplads.',
    options:[
      {text:'Derfor brugte han de første to år på at lære sproget på sprogskolen.', ok:true, why:'"Derfor" points back to the problem (he could not continue directly), and learning the language is exactly what the next sentence gives the reason for ("For uden dansk…").'},
      {text:'Derfor fandt han allerede den første uge et job som elektriker.', ok:false, why:'Contradicts both the sentence before (he could NOT just continue) and the next sentence about needing Danish first.'},
      {text:'Men han ville ikke lære dansk.', ok:false, why:'The next sentence explains why Danish was necessary — refusing it breaks the logic of the whole paragraph.'},
      {text:'Han havde aldrig arbejdet i sit hjemland.', ok:false, why:'Directly contradicts "arbejdede han som elektriker i mere end ti år".'}
    ]},
  { pre:'Da Ahmed var færdig med modul 4, foreslog hans sagsbehandler i jobcentret en praktikplads hos et elfirma i Kolding. Ahmed var nervøs i starten, fordi han ikke kendte de danske regler og standarder i faget. ',
    post:' Efter tre måneders praktik tilbød firmaet ham en fast stilling med rigtig løn.',
    options:[
      {text:'Derfor sagde han nej tak til praktikpladsen.', ok:false, why:'He clearly took the internship — the next sentence says the firm offered him a permanent job after three months THERE.'},
      {text:'Men hans nye kolleger hjalp ham, og han lærte de danske regler hurtigt.', ok:true, why:'"Men" turns the nervousness around, and the help explains why the internship ended in a job offer. Signal word + logic both fit.'},
      {text:'Han kunne ikke lide sine kolleger.', ok:false, why:'Clashes with the positive outcome — and nothing in the text supports it.'},
      {text:'Firmaet lukkede efter en uge.', ok:false, why:'Impossible: the same firm offers him a permanent position three months later.'}
    ]},
  { pre:'Det sværeste ved jobbet var ikke selve arbejdet, men sproget. Kunderne talte hurtigt, og kollegerne brugte mange fagord, som Ahmed aldrig havde hørt på sprogskolen. ',
    post:' Den ligger nu altid i hans arbejdsbil, og han kigger i den næsten hver dag.',
    options:[
      {text:'Derfor lavede en ældre kollega en lille ordbog til ham med de vigtigste fagord.', ok:true, why:'The pronoun "Den" in the next sentence needs something to point at — the little dictionary. Pronoun reference is the key here.'},
      {text:'Derfor holdt han op med at tale med kunderne.', ok:false, why:'Avoiding customers solves nothing and gives "Den" in the next sentence nothing to refer to.'},
      {text:'Han købte derfor en ny arbejdsbil.', ok:false, why:'Keyword trap ("arbejdsbil")! But then "Den ligger i hans arbejdsbil" would mean the car lies in the car — the reference collapses.'},
      {text:'Kunderne ville ikke tale med ham.', ok:false, why:'Contradicts the friendly tone of the text and leaves "Den" with no owner.'}
    ]},
  { pre:'I dag har Ahmed været i firmaet i halvandet år, og han tjener nu nok til at forsørge sin familie. Hans kone Leila er begyndt på modul 3 på sprogskolen, og deres to børn taler allerede flydende dansk. ',
    post:' Det giver hele familien mere ro og tryghed i hverdagen.',
    options:[
      {text:'Familien er derfor flyttet fra det midlertidige boligcenter til deres egen lejlighed i Kolding.', ok:true, why:'"Det" in the next sentence refers to this move — a stable home is what gives the family "ro og tryghed".'},
      {text:'Børnene kan endnu ikke sige et ord på dansk.', ok:false, why:'Directly contradicts "deres to børn taler allerede flydende dansk".'},
      {text:'Leila er holdt op med at gå på sprogskole.', ok:false, why:'Contradicts the sentence right before the gap.'},
      {text:'Ahmed har mistet sit arbejde igen.', ok:false, why:'Contradicts the whole paragraph about his stable job and income.'}
    ]},
  { pre:'Ahmed har store planer for fremtiden. Han vil tage det danske elektrikerbevis, så han kan få mere ansvar — og måske en dag starte sit eget firma. ',
    post:' Ahmed synes, det er et godt råd, for han ved, at kunderne kommer, når man både er dygtig og taler godt dansk.',
    options:[
      {text:'Hans chef siger, at han først skal blive endnu bedre til dansk.', ok:true, why:'"det er et godt råd" needs an actual piece of advice to point back to — the boss’ recommendation about Danish, which the rest of the sentence then supports.'},
      {text:'Hans chef synes, at han skal finde et helt andet fag.', ok:false, why:'Ahmed would hardly call that "et godt råd" given his plans within the trade.'},
      {text:'Men han vil helst arbejde så lidt som muligt.', ok:false, why:'Contradicts "store planer" and the ambition described before the gap.'},
      {text:'Derfor er han holdt op med at gå på arbejde.', ok:false, why:'Absurd in context — his plans build on his job, not on quitting it.'}
    ]}
  ],
  extra:{ q:'Hvad er tekstens hovedbudskab? (main idea — bonus comprehension question)', concept:'r-inference',
    options:[
      {text:'Sprog, tålmodighed og hjælp fra andre åbnede døren til arbejdslivet i Danmark.', ok:true, why:'The text follows exactly that arc: language school → internship with helpful colleagues → permanent job → plans for more.'},
      {text:'Udenlandske håndværkere kan ikke arbejde i Danmark.', ok:false, why:'The text proves the opposite.'},
      {text:'Det er umuligt at lære fagord på dansk.', ok:false, why:'Ahmed learns them — with a colleague’s home-made dictionary.'},
      {text:'Man skal starte sit eget firma så hurtigt som muligt.', ok:false, why:'The text recommends patience: first the certificate and better Danish, THEN maybe a firm.'}
    ]}
};

/* ---------- second Opgave 4 task ---------- */
READING.o4b = {
  id:'o4b', concept:'r-4', opgave:'Opgave 4',
  title:'Tre personer fortæller om deres arbejde',
  instruction:'Læs de tre tekster, og læs spørgsmålene (1–7). Find den person, der passer til hvert spørgsmål. Sæt kryds ud for den person (A, B eller C), der passer. Se eksemplet (0).',
  persons:[
    { label:'A', name:'Elena', text:'Jeg arbejder som sygeplejerske på et stort hospital, og jeg har mest nattevagter. Det er roligt om natten, men jeg ville ærligt talt ønske, at jeg havde flere dagvagter, for min krop bliver meget træt af at sove om dagen. Vi løber stærkt på afdelingen, og jeg synes, at lønnen er for lav i forhold til ansvaret. På min afdeling taler vi tit engelsk, fordi vi har kolleger fra hele verden — så mit dansk får faktisk ikke så meget træning på jobbet. Jeg tager toget på arbejde, fordi jeg bor langt væk. Jeg er færdiguddannet og har ingen planer om at læse mere; nu vil jeg bare gerne have en hverdag, der hænger bedre sammen.' },
    { label:'B', name:'Tom', text:'Jeg arbejder på et stort lager uden for byen. Jeg fik jobbet gennem min ven Ali, som har arbejdet der i mange år — han anbefalede mig til chefen, og to dage senere var jeg i gang. Vi har skiftende vagter, og det passer mig faktisk perfekt: Nogle uger arbejder jeg tidligt og kan hente mine børn, og andre uger har jeg fri om formiddagen. Lønnen er okay, synes jeg. Vi taler ikke så meget sammen i løbet af dagen, for vi har travlt, og alle går med høretelefoner. Til gengæld vil jeg gerne videre: Jeg er begyndt på et truckkursus, og om nogle år vil jeg gerne uddanne mig til lagerchef. Jeg kører på arbejde i bil, for der går ingen bus derud.' },
    { label:'C', name:'Fatima', text:'Jeg arbejder som pædagogmedhjælper i en børnehave, og jeg cykler derhen hver morgen — det tager kun et kvarter. Jeg fandt selv jobbet på nettet og søgte uden at kende nogen. Det bedste ved mit arbejde er helt klart mine kolleger: Vi hjælper hinanden, griner meget og spiser frokost sammen hver dag. Jeg taler dansk hele dagen — med børnene, forældrene og kollegerne — så mit sprog er blevet meget bedre, siden jeg startede. Engang imellem tænker jeg på at læse til pædagog, men lige nu har jeg små børn derhjemme, så det må vente nogle år. Lønnen er ikke høj, men arbejdsglæden betyder mere for mig.' }
  ],
  example:{ q:'Hvem arbejder mest om natten?', answer:'A' },
  questions:[
    { q:'Hvem cykler til arbejde?', answer:'C', why:'Fatima: "jeg cykler derhen hver morgen". Trap: Elena takes the train, Tom drives.' },
    { q:'Hvem vil gerne videreuddanne sig?', answer:'B', why:'Tom: truck course now, "uddanne mig til lagerchef" later. Trap: Fatima only "tænker på" it and explicitly postpones it; Elena has NO plans to study more.' },
    { q:'Hvem synes, at lønnen er for lav i forhold til arbejdet?', answer:'A', why:'Elena: "lønnen er for lav i forhold til ansvaret". Trap: Fatima says the pay is not high but job joy matters more — that is acceptance, not a complaint about fairness.' },
    { q:'Hvem er glad for sine skiftende arbejdstider?', answer:'B', why:'Tom: "det passer mig faktisk perfekt". Trap: Elena has night shifts but explicitly wishes for more day shifts.' },
    { q:'Hvem taler mest dansk på sit arbejde?', answer:'C', why:'Fatima: "Jeg taler dansk hele dagen". Trap: Elena’s ward often speaks English; Tom’s colleagues barely talk.' },
    { q:'Hvem har fået sit job gennem en ven?', answer:'B', why:'Tom: through his friend Ali. Trap: Fatima FOUND her job herself online "uden at kende nogen".' },
    { q:'Hvem synes, at det sociale er det bedste ved jobbet?', answer:'C', why:'Fatima: "Det bedste ved mit arbejde er helt klart mine kolleger". Trap: Tom’s workplace is quiet with headphones on.' }
  ]
};

/* ---------- two extra writing tasks ---------- */
WRITING.tasks.push(
{ id:'w1c', opgave:'Opgave 1', concept:'w-opg1', minWords:100, maxWords:200,
  title:'Henvendelse til sprogskolen',
  situation:'Du går på sprogskole på Modul 3 om formiddagen. Du har fået nyt arbejde og kan ikke længere komme til undervisning om formiddagen. Du vil skrive til sprogskolens kontor.',
  taskIntro:'Skriv en henvendelse til sprogskolens kontor. Du skal fortælle:',
  bullets:['hvem du er, og hvilket hold du går på','hvorfor du skriver','hvad dit problem er','hvad du gerne vil have, at skolen gør.'],
  structure:['Greeting: "Kære Sprogcenter …" or "Til kontoret på …"','Who you are: name, module, team, teacher (bullet 1)','Why you write: new job (bullet 2)','The problem: work hours collide with lessons (bullet 3)','Your request: evening class — ask a concrete question (bullet 4)','Closing + thanks + contact info'],
  planning:'Plan: 1) navn, Modul 3, hold 3B. 2) nyt arbejde fra 1. juli. 3) arbejde 8–16 → kan ikke komme om formiddagen. 4) flyt mig til aftenhold — er der plads?',
  modelPassing:'Kære Sprogcenter Midt\n\nJeg hedder Carlos Mendes, og jeg går på Modul 3 på hold 3B. Vi har undervisning tirsdag og torsdag om formiddagen.\n\nJeg skriver til jer, fordi jeg har fået nyt arbejde i et køkken. Jeg starter den 1. juli, og jeg skal arbejde hver dag fra klokken 8 til 16.\n\nDerfor kan jeg desværre ikke længere komme til undervisning om formiddagen. Det er et stort problem for mig, fordi jeg gerne vil tage modultesten til december.\n\nJeg vil derfor gerne flytte til et aftenhold. Er der plads på et hold om aftenen? Og hvornår kan jeg starte?\n\nPå forhånd tak for hjælpen.\n\nVenlig hilsen\nCarlos Mendes',
  modelStrong:'Kære Sprogcenter Midt\n\nMit navn er Carlos Mendes, og jeg går på Modul 3 på hold 3B hos Anne Holm. Mit kursistnummer er 245-178. Vi har undervisning tirsdag og torsdag formiddag.\n\nJeg skriver til jer, fordi min situation har ændret sig: Jeg har fået fast arbejde i køkkenet på Hotel Skanderborg, og jeg starter allerede den 1. juli. Min arbejdstid bliver mandag til fredag fra klokken 8 til 16.\n\nDet betyder desværre, at jeg ikke længere kan følge undervisningen om formiddagen. Det er jeg rigtig ked af, fordi jeg er glad for mit hold, og fordi jeg gerne vil tage modultesten til december som planlagt.\n\nJeg vil derfor høre, om I kan flytte mig til et aftenhold efter klokken 17. Hvis der ikke er plads med det samme, vil jeg gerne skrives på venteliste. Er det desuden muligt at låne materialerne, så jeg kan øve hjemme, indtil jeg kan starte?\n\nI kan kontakte mig på telefon 60 11 22 33 eller på denne mail.\n\nPå forhånd tak for hjælpen.\n\nVenlig hilsen\nCarlos Mendes',
  whyBetter:['Identifies himself completely (team, teacher, kursistnummer) — the office can act immediately.','States the change of situation precisely with dates and times — no follow-up questions needed.','Asks for a concrete solution PLUS a fallback (venteliste, materials) — proactive and realistic.','Word order under control: "Det betyder desværre, at jeg ikke længere kan følge…", "fordi jeg gerne vil tage…".','Polite, warm and constructive — exactly the halvformel register.'],
  commonMistakes:['Explaining the new job in detail but forgetting the actual REQUEST (bullet 4).','Writing "jeg kan ikke komme mere" with no reason or dates — always give the why and the when.','"fordi jeg vil gerne tage testen" — gerne must follow vil, and the whole clause needs SAV after fordi.','Demanding instead of asking: "I skal flytte mig til aftenholdet" sounds like an order.']
},
{ id:'w2c', opgave:'Opgave 2', concept:'w-opg2', minWords:90, maxWords:200,
  title:'Svar til din nabo Henrik',
  situation:'Du har fået en e-mail fra din nabo, Henrik.',
  taskIntro:'Læs e-mailen, og skriv et svar til Henrik. Du skal svare på alle Henriks spørgsmål. Du skal skrive minimum 90 ord.',
  email:'Hej!\nPå søndag holder vi den årlige arbejdsdag i gården klokken 10. Kan du være med? Vi skal male hegnet og plante blomster — hvad vil du helst hjælpe med? Bagefter bestiller vi pizza til alle. Hvad kan du godt lide? Og en sidste ting: Har du en stige, vi kan låne?\nHilsen\nHenrik, nr. 12',
  bullets:['Kan du være med på søndag?','Hvad vil du helst hjælpe med — male eller plante?','Hvilken pizza kan du godt lide?','Har du en stige, de kan låne?'],
  structure:['Friendly greeting + thanks for the invitation','Answer 1: yes/no to Sunday (+ when you can come)','Answer 2: choose a task and say why','Answer 3: your pizza wish','Answer 4: the ladder — yes/no + practical detail','Warm closing'],
  planning:'Plan: 1) ja, fra kl. 10. 2) helst male — god til det. 3) margherita / vegetar. 4) ja, stige i kælderen, tager den med.',
  modelPassing:'Hej Henrik\n\nTak for din mail!\n\nJa, jeg vil gerne være med på søndag. Jeg kommer klokken 10, men jeg skal desværre gå klokken 15, fordi vi skal til fødselsdag.\n\nJeg vil helst male hegnet. Jeg har malet meget i min gamle lejlighed, så det er jeg ret god til.\n\nPizza lyder godt! Jeg kan bedst lide margherita, men jeg spiser næsten alt.\n\nOg ja — jeg har en stige i kælderen. Den er fire meter lang. Jeg tager den med på søndag.\n\nVi ses i gården!\n\nMange hilsner\nDina, nr. 8',
  modelStrong:'Hej Henrik\n\nTusind tak for din mail — og sikke en god idé med en arbejdsdag!\n\nJa, jeg er helt sikkert med på søndag. Jeg kommer klokken 10, og jeg kan blive hele dagen, hvis der er brug for det.\n\nHvis jeg selv må vælge, vil jeg helst male hegnet. Da vi boede i vores gamle lejlighed, malede jeg både køkken og stue, så jeg har lidt erfaring. Men jeg hjælper selvfølgelig også gerne med blomsterne, hvis I mangler hænder dér.\n\nPizza bagefter lyder perfekt! Jeg kan bedst lide vegetarpizza, men ærligt talt spiser jeg næsten alt, så bestil bare.\n\nOg ja, I må meget gerne låne min stige. Den står i kælderen og er fire meter lang, så den er god til hegnet. Jeg tager den med op søndag morgen.\n\nSkal jeg også tage kaffe med til pausen?\n\nVi ses på søndag!\n\nMange hilsner\nDina, nr. 8',
  whyBetter:['All four questions answered in Henriks order — plus a friendly extra offer (coffee) that keeps the neighbour relationship warm.','Concrete details everywhere: times, the ladder’s length and location, painting experience.','Inversion handled naturally: "Da vi boede i vores gamle lejlighed, malede jeg…", "så bestil bare".','SAV correct: "hvis der er brug for det", "hvis I mangler hænder".','Ends by giving something back — the mark of a real email, not an exam answer.'],
  commonMistakes:['Forgetting the ladder question — small practical questions at the end of a mail are easy to miss. Count the question marks!','Answering "ja" to Sunday without saying WHEN you can come.','"fordi jeg er ret god til male" — remember "til AT male".','Under 90 words: four answered questions plus greeting and closing should carry you past 90 naturally.']
});

/* ---------- MOCK EXAM — completely fresh content, used only here ---------- */
const EXAM = {
readingMinutes: 50, writingMinutes: 45,
cloze: {
  title:'Information fra biblioteket', concept:'r-keywords',
  instruction:'Læs teksten. Der mangler seks ord. Vælg for hvert hul det ord, der passer bedst, blandt de 12 ord i ordbanken.',
  parts:[
    'Kære lånere. Fra den 1. august får biblioteket nye ', {g:0},
    '. Vi åbner hver dag klokken 8, men der er først personale ', {g:1},
    ' klokken 10. Om aftenen har vi åbent ', {g:2},
    ' klokken 21. Husk, at du skal bruge dit sundhedskort, når du ', {g:3},
    ' bøger. Du kan ', {g:4},
    ' dine bøger i automaten ved indgangen — også når biblioteket er lukket. Vi glæder os til at ', {g:5}, ' jer!'
  ],
  bank:['adresser','aflevere','fra','hente','høre','køber','låner','på','se','til','ved','åbningstider'],
  gaps:[
    { correct:'åbningstider', why:'The text then describes WHEN the library is open — so the new thing is "åbningstider" (opening hours).' },
    { correct:'fra', why:'"der er først personale FRA klokken 10" — staff present from 10 onwards.' },
    { correct:'til', why:'"åbent til klokken 21" — open UNTIL 21.' },
    { correct:'låner', why:'At a library you "låner" (borrow) books — and that is when the card is needed.' },
    { correct:'aflevere', why:'"aflevere" = return/hand in. The machine at the entrance takes RETURNED books.' },
    { correct:'se', why:'The fixed friendly closing is "Vi glæder os til at se jer!" (we look forward to seeing you).' }
  ]
},
chat: {
  title:'Lars skriver til sin kollega Nadia', concept:'r-2a',
  situation:'Situation: Lars skriver til sin kollega Nadia.',
  instruction:'Læs Lars’ og Nadias chat. Find de svar fra Nadia, der passer (A–F). Der er tre svar, du ikke skal bruge. Se eksemplet (0).',
  personX:'Lars', personY:'Nadia',
  example:{ x:'Hej Nadia! Jeg har brug for en lille tjeneste i morgen.', reply:'Hej Lars! Selvfølgelig, hvad har du brug for?', letter:'Z' },
  turns:[
    { x:'Jeg skal til tandlæge klokken 10. Kan du tage telefonen for mig et par timer?', correct:'D',
      why:'D accepts and asks when Lars is back — which Lars answers next ("Senest klokken 12.30").' },
    { x:'Senest klokken 12.30, tror jeg. Det er bare en almindelig kontrol.', correct:'B',
      why:'B confirms and asks the natural follow-up about meetings — which Lars answers next ("ingen møder før klokken 14").' },
    { x:'Nej, jeg har heldigvis ingen møder før klokken 14.', correct:'F',
      why:'F closes the practical part: no problem, and she will text him if it gets busy.' }
  ],
  options:[
    { letter:'A', text:'Min tandlæge holder lukket om mandagen.', distractorWhy:'Keyword trap ("tandlæge") — nobody asks about Nadias dentist.' },
    { letter:'B', text:'Helt fint. Skal jeg også tage dine møder, hvis der kommer nogen?' },
    { letter:'C', text:'Ja, mødet klokken 14 er desværre aflyst.', distractorWhy:'Lars SAYS he has a meeting at 14 — nobody says it is cancelled. Contradiction trap.' },
    { letter:'D', text:'Det kan jeg sagtens. Hvornår er du tilbage på kontoret?' },
    { letter:'E', text:'Nej tak, jeg drikker aldrig kaffe om aftenen.', distractorWhy:'Coffee trap: Lars offers Friday coffee as a thank-you at work — evening habits are irrelevant.' },
    { letter:'F', text:'Perfekt, så er der ingen problemer. Jeg skriver en besked til dig, hvis det bliver travlt.' }
  ]
},
/* second Opgave 2A chat thread — the official test has TWO threads per sitting */
chat2: {
  title:'Peter skriver til sin nabo Ditte', concept:'r-2a', situation:'Situation: Peter skriver til sin nabo Ditte.',
  instruction:'Læs Peters og Dittes chat. Find de svar fra Ditte, der passer (A–F). Der er tre svar, du ikke skal bruge. Se eksemplet (0).',
  personX:'Peter', personY:'Ditte',
  example:{ x:'Hej Ditte! Har du et øjeblik?', reply:'Hej Peter! Ja, hvad kan jeg hjælpe med?' },
  turns:[
    { x:'Hej Ditte! Må jeg låne din trailer i weekenden?', correct:'C',
      why:'C accepts and asks the natural follow-up question — what Peter needs the trailer for — which Peter answers next ("en sofa på loppemarkedet").' },
    { x:'Jeg skal hente en sofa på loppemarkedet på lørdag. Er traileren fri den dag?', correct:'E',
      why:'E confirms the trailer is free on Saturday and asks what time — which Peter answers next ("klokken 10").' },
    { x:'Klokken 10 om formiddagen, hvis det passer dig.', correct:'A',
      why:'A confirms 10 o\'clock works and gives the practical info Peter needs to actually get the trailer (where the key is).' }
  ],
  options:[
    { letter:'A', text:'Klokken 10 er fint. Nøglen til traileren hænger i skuret.' },
    { letter:'B', text:'Nej, jeg skal selv bruge traileren på lørdag til at flytte min sofa.', distractorWhy:'Contradiction trap — Ditte never says she needs the trailer herself; option E already confirms it is free on Saturday, so B contradicts the story.' },
    { letter:'C', text:'Ja, det er helt fint. Hvad skal du bruge den til?' },
    { letter:'D', text:'Jeg har desværre solgt sofaen for en uge siden.', distractorWhy:'Keyword trap ("sofa") — it is PETER who is buying a sofa at the flea market, not Ditte selling one. Wrong person owns the sofa.' },
    { letter:'E', text:'Ja, den er ledig hele lørdagen. Hvad tid skal du bruge den?' },
    { letter:'F', text:'Loppemarkedet holder lukket om lørdagen, kun søndag.', distractorWhy:'Contradiction trap — Peter already states the pickup is on lørdag; nobody in the chat says the market is closed that day, so this rewrites the agreed plan.' }
  ]
},
o3: {
  title:'Aisha og løbeklubben', concept:'r-3',
  instruction:'Læs teksten. Der er fem afsnit. I hvert afsnit mangler der en sætning. Vælg den sætning, der passer i afsnittet.',
  paragraphs:[
  { pre:'Da Aisha flyttede til Horsens for tre år siden, kendte hun ikke et eneste menneske i byen. Hendes mand var på arbejde hele dagen, og børnene var i skole. Hun følte sig ofte ensom, især om vinteren, hvor det bliver tidligt mørkt. ',
    post:' For hun ville gerne møde nye mennesker og komme ud af lejligheden.',
    options:[
      {text:'Derfor besluttede hun at melde sig ind i en forening.', ok:true, why:'"Derfor" follows from the loneliness, and joining a forening matches the reason given in the next sentence (meeting people, getting out).'},
      {text:'Derfor besluttede hun at blive hjemme hele vinteren.', ok:false, why:'Staying home contradicts the next sentence about wanting to get out and meet people.'},
      {text:'Hun havde mange gode venner i byen.', ok:false, why:'Contradicts "kendte hun ikke et eneste menneske".'},
      {text:'Hendes mand var altid hjemme om dagen.', ok:false, why:'Contradicts "Hendes mand var på arbejde hele dagen".'}
    ]},
  { pre:'Aisha valgte en løbeklub, fordi hun gerne ville i bedre form. Den første aften var hun meget nervøs og overvejede at blive i bilen og køre hjem igen. ',
    post:' Efter træningen drak alle kaffe sammen i klubhuset, og flere spurgte interesseret til hendes historie.',
    options:[
      {text:'Men de andre løbere tog godt imod hende fra det første minut.', ok:true, why:'"Men" flips the nervousness, and the warm welcome leads naturally into the friendly coffee scene after training.'},
      {text:'Derfor kørte hun hjem uden at træne.', ok:false, why:'Then she could not have been at the training the next sentence describes ("Efter træningen…").'},
      {text:'Klubben havde ingen andre medlemmer.', ok:false, why:'Contradicts "alle drak kaffe sammen" og "flere spurgte".'},
      {text:'Hun har altid hadet at løbe.', ok:false, why:'Clashes with her own choice of a running club to get in shape.'}
    ]},
  { pre:'I begyndelsen forstod Aisha ikke alt, hvad de andre sagde. De talte hurtigt, brugte mange talemåder og lavede sjov med hinanden. ',
    post:' Det blev en slags gratis danskundervisning to gange om ugen.',
    options:[
      {text:'Hun turde alligevel spørge, hver gang der var et ord, hun ikke forstod.', ok:true, why:'Daring to ask is what turns the runs into "gratis danskundervisning" — the next sentence sums exactly that up.'},
      {text:'Derfor holdt hun helt op med at lytte til dem.', ok:false, why:'Not listening cannot become "gratis danskundervisning".'},
      {text:'Hun talte kun engelsk med de andre løbere.', ok:false, why:'English-only contradicts the free DANISH lessons in the next sentence.'},
      {text:'De andre ville ikke tale med hende.', ok:false, why:'Contradicts the welcoming tone established in the previous paragraph.'}
    ]},
  { pre:'Sidste sommer spurgte klubben, om Aisha ville hjælpe som frivillig, da byen holdt sit store motionsløb. ',
    post:' Det var en lang dag, men hun fik ny erfaring, nye venner — og et diplom, som nu hænger i køkkenet.',
    options:[
      {text:'Hun sagde ja og stod hele dagen ved et vanddepot og delte vand ud til løberne.', ok:true, why:'Accepting and working the water station IS the "lang dag" the next sentence describes. Cause and effect line up.'},
      {text:'Hun sagde nej, fordi hun skulle på ferie.', ok:false, why:'Saying no leaves no "lang dag" og no diploma to talk about.'},
      {text:'Løbet blev aflyst på grund af regn.', ok:false, why:'A cancelled race contradicts the long day and the new experiences.'},
      {text:'Hun deltog selv og vandt løbet.', ok:false, why:'The question was about volunteering — and winning does not match "stod ved et vanddepot"-style helper experience the paragraph sets up.'}
    ]},
  { pre:'I dag er det svært at forestille sig Aishas liv uden klubben. Hun løber tre gange om ugen, og hendes dansk er blevet så godt, at hun nu hjælper nye medlemmer, der ikke taler så meget dansk endnu. ',
    post:' Aisha siger selv, at foreningen har lært hende mere dansk — og mere om Danmark — end nogen bog.',
    options:[
      {text:'I foråret blev hun desuden valgt ind i klubbens bestyrelse.', ok:true, why:'The board position is the natural climax of her journey and fits right before her own conclusion about what the forening gave her.'},
      {text:'Hun er derfor stoppet i klubben.', ok:false, why:'Contradicts everything — especially "svært at forestille sig livet uden klubben".'},
      {text:'Hun har stadig ikke lært nogen at kende.', ok:false, why:'Contradicts "nye venner" and her helping new members.'},
      {text:'Klubben lukkede sidste år.', ok:false, why:'She runs there three times a week today.'}
    ]}
  ]
},
o4: {
  title:'Tre personer fortæller om deres bolig', concept:'r-4',
  instruction:'Læs de tre tekster, og læs spørgsmålene (1–7). Find den person, der passer til hvert spørgsmål. Se eksemplet (0).',
  persons:[
    { label:'A', name:'Pavel', text:'Jeg bor i en toværelses lejlighed på Nørrebro i København sammen med min kæreste. Vi elsker kvarteret med alle caféerne og parkerne, men huslejen æder næsten halvdelen af min løn, og det synes jeg ærligt talt er for meget. Vi vil gerne flytte til noget større, når vi engang får børn — måske en lejlighed med tre værelser lidt uden for byen. Vores naboer hilser pænt på trappen, men vi kender dem ikke rigtigt; sådan er det vist tit i store byer. Jeg arbejder inde i centrum og tager cyklen eller metroen, alt efter vejret.' },
    { label:'B', name:'Mariam', text:'Vi bor til leje i et rækkehus i Odense, og det tog os næsten et år at finde det — der var ventelister overalt, og jeg synes virkelig, det er svært at finde en god bolig i Danmark. Men det var ventetiden værd. Jeg kan gå på arbejde på ti minutter, og det sparer både penge og tid. Det bedste er nu vores naboer: Vi holder fællesspisning i gården en gang om måneden, og børnene leger sammen hver dag. Huslejen er helt rimelig, synes jeg, især når man tænker på, hvad man får.' },
    { label:'C', name:'Kenji', text:'For to år siden købte min kone og jeg et gammelt hus på landet uden for Vejle. Det var billigere end en lejlighed i byen, og vi har fået en kæmpe have, hvor jeg dyrker grøntsager hele sommeren. Min kones forældre bor i en lille lejlighed, vi har lavet i den ene ende af huset, så de kan hjælpe med børnene. Jeg kører tre kvarter til arbejde hver dag, og det er den eneste ulempe, synes jeg. Men vi flytter aldrig herfra — her skal vi blive boende, til vi bliver gamle.' }
  ],
  example:{ q:'Hvem bor i lejlighed?', answer:'A' },
  questions:[
    { q:'Hvem har købt et hus?', answer:'C', why:'Kenji: "købte min kone og jeg et gammelt hus på landet". Pavel and Mariam both rent.' },
    { q:'Hvem vil gerne flytte til noget større?', answer:'A', why:'Pavel: "Vi vil gerne flytte til noget større, når vi engang får børn". Trap: Kenji says they will NEVER move.' },
    { q:'Hvem synes, det er svært at finde en bolig i Danmark?', answer:'B', why:'Mariam: a year of searching and waiting lists — "det er svært at finde en god bolig i Danmark".' },
    { q:'Hvem bor tæt på sit arbejde?', answer:'B', why:'Mariam walks to work in ten minutes. Trap: Kenji drives 45 minutes; Pavel commutes into the centre.' },
    { q:'Hvem er rigtig glad for sine naboer?', answer:'B', why:'Mariam: fællesspisning every month, children play daily. Trap: Pavels neighbours only greet on the stairs.' },
    { q:'Hvem bor sammen med sine svigerforældre?', answer:'C', why:'Kenji: "Min kones forældre bor i en lille lejlighed … i den ene ende af huset" — his parents-in-law.' },
    { q:'Hvem synes, at det er for dyrt at bo, hvor han/hun bor?', answer:'A', why:'Pavel: rent eats half his salary — "det synes jeg ærligt talt er for meget". Trap: Mariam calls her rent "helt rimelig".' }
  ]
},
writing:[
{ id:'ew1', opgave:'Opgave 1', concept:'w-opg1', minWords:100, maxWords:200,
  title:'Klage til boligselskabet Parkbo',
  situation:'Du bor til leje hos boligselskabet Parkbo. Der har ikke været varme i din lejlighed i en uge, og det er vinter. Du vil skrive en klage til boligselskabet.',
  taskIntro:'Skriv en klage til boligselskabet Parkbo. Du skal fortælle:',
  bullets:['hvem du er, og hvor du bor','hvad problemet er, og hvor længe det har varet','hvad du selv har gjort for at løse problemet','hvad du forventer, at boligselskabet gør nu.'],
  model:'Kære Parkbo\n\nMit navn er Amina Yusuf, og jeg bor i jeres lejlighed på Engvej 7, 1. th. i Holbæk.\n\nJeg skriver til jer, fordi der ikke har været varme i min lejlighed siden i mandags — altså i en hel uge. Der er kun 13 grader i stuen, og det er et stort problem, fordi jeg har to små børn, og fordi den yngste allerede er blevet forkølet.\n\nJeg har naturligvis prøvet at løse problemet selv. Jeg har tjekket alle radiatorerne og lukket helt op for dem, og i tirsdags ringede jeg til jeres varmemester og lagde en besked. Desværre har ingen ringet tilbage, selvom jeg også har skrevet en mail i torsdags.\n\nJeg forventer derfor, at I sender en håndværker senest i morgen. Hvis det ikke kan lade sig gøre, vil jeg gerne vide, hvordan I vil løse problemet, og om vi kan få et afslag i huslejen for den periode, hvor lejligheden ikke kan bruges normalt.\n\nI kan kontakte mig på telefon 71 22 33 44 — også i dag.\n\nPå forhånd tak for hurtig hjælp.\n\nVenlig hilsen\nAmina Yusuf\nEngvej 7, 1. th.' },
{ id:'ew2', opgave:'Opgave 2', concept:'w-opg2', minWords:90, maxWords:200,
  title:'Svar til din ven Samir',
  situation:'Du har fået en e-mail fra din ven, Samir.',
  taskIntro:'Læs e-mailen, og skriv et svar til Samir. Du skal svare på alle Samirs spørgsmål. Du skal skrive minimum 90 ord.',
  email:'Hej!\nTillykke med dit nye arbejde — hvor er det godt gået! Hvordan går det på jobbet? Hvad laver du i løbet af en almindelig dag? Hvordan er dine nye kolleger? Og vigtigst af alt: Skal vi ikke fejre det? Hvornår har du tid?\nKnus\nSamir',
  bullets:['Hvordan går det på jobbet?','Hvad laver du i løbet af en almindelig dag?','Hvordan er dine kolleger?','Hvornår har du tid til at fejre det?'],
  model:'Hej Samir\n\nTusind tak — og tak for din søde mail! Jeg blev så glad for den.\n\nDet går rigtig godt på jobbet. Jeg er stadig ny, så jeg lærer noget hver eneste dag, men jeg føler mig allerede hjemme.\n\nEn almindelig dag starter klokken 8 med et kort møde. Bagefter pakker jeg varer og hjælper kunder i butikken, og om eftermiddagen bestiller jeg nye varer hjem. Tiden flyver af sted!\n\nMine kolleger er virkelig søde. De hjælper mig, når jeg er i tvivl, og vi griner meget i pauserne. Min chef er også flink, selvom hun har travlt.\n\nOg ja — selvfølgelig skal vi fejre det! Jeg har fri på lørdag. Skal vi spise på den nye libanesiske restaurant klokken 18? Jeg giver!\n\nKnus\nLina' }
],
/* grouped under the four dimensions used broadly to assess Danish writing proficiency
   (opgaveløsning, kommunikativ værdi, sammenhæng/struktur, sproglig korrekthed) — same
   10 checklist points as before, now labelled by which dimension each one actually tests */
rubric:[
  { cat:'Opgaveløsning', text:'Every bullet/question in the task is covered (compare one by one)' },
  { cat:'Opgaveløsning', text:'The length requirement is met' },
  { cat:'Sammenhæng & struktur', text:'Clear structure: greeting → purpose → details → closing' },
  { cat:'Kommunikativ værdi', text:'The tone fits the receiver (polite-neutral / warm)' },
  { cat:'Sammenhæng & struktur', text:'At least three connectors used (fordi, derfor, men, desuden, selvom …)' },
  { cat:'Sproglig korrekthed', text:'V2/inversion is correct after fronted time/place ("Derfor kan jeg…", "I tirsdags ringede jeg…")' },
  { cat:'Sproglig korrekthed', text:'SAV is correct after fordi/at/hvis/når/selvom (ikke BEFORE the verb)' },
  { cat:'Sproglig korrekthed', text:'ikke/altid/aldrig placed correctly in main clauses' },
  { cat:'Opgaveløsning', text:'A clear closing request or conclusion is present' },
  { cat:'Sproglig korrekthed', text:'Spelling and punctuation checked (capital letters, commas before fordi/at/hvis)' }
]
};
const RUBRIC_CATS = ['Opgaveløsning','Kommunikativ værdi','Sammenhæng & struktur','Sproglig korrekthed'];

/* ---------- DAILY SMALL TALK (Hverdagsdansk) ---------- */
const SMALLTALK = [
{ id:'office-morning', cat:'Morgen på kontoret', icon:'sunrise', items:[
  { da:'Godmorgen! Har du haft en god weekend?', en:'Good morning! Did you have a good weekend?', note:'THE Monday opener. Expect "Ja, stille og rolig" back — and ask a follow-up.' },
  { da:'Hvordan går det? — Det går godt, tak. Hvad med dig?', en:'How is it going? — Fine, thanks. And you?', note:'Danes answer briefly and return the question. Always return it!' },
  { da:'Nå, er du allerede i gang?', en:'Oh, you are already at it?', note:'Friendly comment to an early-bird colleague. "Nå" is the most Danish word there is.' },
  { da:'Vil du have en kop kaffe med?', en:'Do you want a cup of coffee (brought along)?', note:'Offering coffee on the way builds goodwill instantly.' },
  { da:'Sikke et vejr i dag, hvad?', en:'What weather today, right?', note:'Works rain or shine. "hvad?" at the end invites agreement.' },
  { da:'Hvordan gik din ferie?', en:'How was your holiday?', note:'Ask the day a colleague returns — they expect it.' },
  { da:'Jeg er lige kommet, så jeg skal lige have en kaffe først.', en:'I just arrived, so I need a coffee first.', note:'Notice the inversion after "så" is NOT used here — "så" = so/then keeps normal order.' },
  { da:'Vi ses til mødet klokken ni!', en:'See you at the nine o’clock meeting!' }
]},
{ id:'office-lunch', cat:'Frokost og pauser', icon:'coffee', items:[
  { da:'Skal vi spise frokost sammen?', en:'Shall we have lunch together?', note:'The fastest way into the social life of a Danish workplace.' },
  { da:'Hvad har du med i dag? Det dufter godt!', en:'What did you bring today? It smells great!' },
  { da:'Er der mere kaffe på kanden?', en:'Is there more coffee in the pot?' },
  { da:'Jeg henter lige en kop kaffe — skal jeg tage en med til dig?', en:'I am getting a coffee — shall I bring you one?' },
  { da:'Jeg giver kage på fredag — det er min fødselsdag.', en:'Cake is on me on Friday — it is my birthday.', note:'In Denmark YOU bring cake on YOUR birthday. Know this rule!' },
  { da:'Hvordan går det med børnene?', en:'How are the kids doing?', note:'Safe personal small talk once you know a colleague a little.' },
  { da:'Har du set den nye serie på DR?', en:'Have you seen the new series on DR?', note:'TV, sport and houses are reliable Danish lunch topics.' },
  { da:'Nå, jeg må tilbage til arbejdet. Vi snakkes ved!', en:'Well, back to work. Talk later!', note:'"Vi snakkes ved" is the perfect friendly exit line.' }
]},
{ id:'office-help', cat:'Møder og hjælp på jobbet', icon:'users', items:[
  { da:'Har du to minutter?', en:'Do you have two minutes?', note:'The standard polite interruption — far better than just starting to talk.' },
  { da:'Kan du hjælpe mig med det her, når du har tid?', en:'Can you help me with this when you have time?' },
  { da:'Undskyld, kan du sige det igen? Jeg forstod det ikke helt.', en:'Sorry, can you say that again? I did not quite understand.', note:'Asking again is respected — guessing is not.' },
  { da:'Hvad betyder det ord? Jeg er stadig ved at lære dansk.', en:'What does that word mean? I am still learning Danish.', note:'Colleagues LOVE helping — this sentence turns them into free teachers.' },
  { da:'Det er en god pointe.', en:'That is a good point.', note:'Perfect meeting phrase — shows you follow the discussion.' },
  { da:'Skal jeg sende dig en mail om det?', en:'Shall I send you an email about it?' },
  { da:'Jeg vender tilbage til dig efter frokost.', en:'I will get back to you after lunch.', note:'"At vende tilbage" — the most used phrase in Danish offices.' },
  { da:'Tak for hjælpen — det var en stor hjælp!', en:'Thanks for the help — it helped a lot!' },
  { da:'God weekend, når du når dertil!', en:'Have a good weekend, when you get there!', note:'The Friday classic, usable from Friday noon onwards.' }
]},
{ id:'shop-super', cat:'I supermarkedet', icon:'shopping-cart', items:[
  { da:'Undskyld, hvor finder jeg mælken?', en:'Excuse me, where do I find the milk?' },
  { da:'Har I flere af dem på lager?', en:'Do you have more of these in stock?' },
  { da:'Er der tilbud på kaffen i denne uge?', en:'Is the coffee on offer this week?', note:'"tilbud" (offers) is a national sport — check the tilbudsavis.' },
  { da:'Jeg skal bede om en pose, tak.', en:'A bag, please.', note:'Bags cost money and you bag your own groceries — fast!' },
  { da:'Kan jeg betale med kort? — Ja, selvfølgelig.', en:'Can I pay by card? — Yes, of course.' },
  { da:'Har du app’en eller et medlemskort? — Nej tak.', en:'Do you have the app or a member card? — No, thanks.', note:'You will be asked this at every checkout. A simple "nej tak" works.' },
  { da:'Vil du have kvitteringen med? — Nej tak, det er fint.', en:'Do you want the receipt? — No thanks, it is fine.' },
  { da:'Hvor er pantautomaten?', en:'Where is the deposit-bottle machine?', note:'Bring your bottles back — pant is money!' },
  { da:'Undskyld, jeg tror, du er gået forrest i køen.', en:'Excuse me, I think you went ahead in the queue.', note:'Danes take queues seriously. Say it calmly and politely.' },
  { da:'Tak, og fortsat god dag!', en:'Thanks, and a continued good day!', note:'"Fortsat god dag" sounds wonderfully native at the checkout.' }
]},
{ id:'shop-other', cat:'Tøjbutik, bager og café', icon:'shopping-bag', items:[
  { da:'Jeg kigger bare, tak.', en:'I am just looking, thanks.', note:'Stops shop assistants politely — the most useful shopping sentence.' },
  { da:'Har I den her i medium / i størrelse 40?', en:'Do you have this in medium / size 40?' },
  { da:'Må jeg prøve den? Hvor er prøverummet?', en:'May I try it on? Where is the fitting room?' },
  { da:'Kan jeg bytte den, hvis den ikke passer?', en:'Can I exchange it if it does not fit?', note:'"byttemærke" = exchange sticker. Ask for it when buying gifts.' },
  { da:'Det er en gave — kan I pakke den ind?', en:'It is a present — can you wrap it?' },
  { da:'Jeg vil gerne bede om to rundstykker og et rugbrød.', en:'Two breakfast rolls and a rye bread, please.', note:'"Jeg vil gerne bede om…" is the golden polite ordering phrase.' },
  { da:'En kaffe med mælk, tak. Til at tage med.', en:'A coffee with milk, please. To go.' },
  { da:'Hvad koster den her? Den står ikke med pris.', en:'What does this cost? It has no price on it.' }
]},
{ id:'weather', cat:'Vejret — den sikre samtale', icon:'cloud-sun', items:[
  { da:'Sikke et dejligt vejr i dag!', en:'What lovely weather today!' },
  { da:'Det skulle blive regn i weekenden, siger de.', en:'They say it will rain at the weekend.', note:'"siger de" (they say) makes you sound like you watch DR weather like everyone else.' },
  { da:'Typisk dansk sommer, ikke?', en:'Typical Danish summer, right?', note:'Said with a smile when it rains in July. Instant connection.' },
  { da:'Nu bliver dagene heldigvis længere igen.', en:'Luckily the days are getting longer again.', note:'The standard hopeful January line — Danes live by the light.' },
  { da:'Man skal nyde solen, mens den er her!', en:'You must enjoy the sun while it is here!' },
  { da:'Det blæser altid i Danmark, har jeg lært.', en:'It is always windy in Denmark, I have learned.', note:'Self-deprecating newcomer humour — works every time.' }
]}
];


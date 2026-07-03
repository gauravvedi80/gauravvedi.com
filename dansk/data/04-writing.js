/* Dansk Coach — data/04-writing.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   DATA — WRITING LAB (authentic SIRI Modul 3.3 task formats)
   ===================================================================== */
const WRITING = {
tasks:[
{ id:'w1a', opgave:'Opgave 1', concept:'w-opg1', minWords:100, maxWords:200,
  title:'Klage til boligforeningen',
  situation:'Du bor i en lejlighed i boligforeningen AL-bolig. Du har problemer med din nabo. Du vil skrive en klage til boligforeningen.',
  taskIntro:'Skriv en klage til boligforeningen AL-bolig. Du skal fortælle:',
  bullets:['hvor du bor, og hvor din nabo bor','hvorfor du vil klage over din nabo','hvordan du har prøvet at løse problemet','hvad du håber, at boligforeningen vil gøre.'],
  structure:['Greeting: "Kære AL-bolig" or "Til boligforeningen AL-bolig"','Introduce yourself + where you live (bullet 1)','State why you are writing + describe the problem (bullet 2)','Explain what you have already tried (bullet 3)','Say what you hope they will do — politely (bullet 4)','Closing: "På forhånd tak for hjælpen" + "Venlig hilsen" + name/contact'],
  planning:'One line per bullet before you write. Example plan: 1) Solvej 12, 2.tv — nabo 3.tv. 2) høj musik om natten → kan ikke sove. 3) talt med ham 2 gange + besked. 4) tal med ham / forklar reglerne.',
  modelPassing:'Kære AL-bolig\n\nJeg hedder Sara Ahmadi, og jeg bor på Solvej 12, 2. tv. Min nabo bor lige over mig på 3. tv.\n\nJeg skriver til jer, fordi min nabo spiller meget høj musik om natten. Det sker næsten hver weekend og tit også i hverdagen. Jeg kan ikke sove, og jeg er meget træt, når jeg skal på arbejde.\n\nJeg har prøvet at tale med min nabo to gange. Han siger undskyld, men musikken fortsætter. Jeg har også skrevet en besked til ham, men han svarer ikke.\n\nJeg håber, at I kan tale med min nabo om problemet og fortælle ham om reglerne i foreningen.\n\nVenlig hilsen\nSara Ahmadi, Solvej 12, 2. tv.',
  modelStrong:'Kære AL-bolig\n\nMit navn er Sara Ahmadi, og jeg har boet på Solvej 12, 2. tv. i tre år. Min nabo bor i lejligheden lige over mig på 3. tv.\n\nJeg skriver til jer, fordi jeg gennem de sidste to måneder har haft store problemer med støj fra min nabo. Han spiller meget høj musik — ofte til klokken to eller tre om natten. Derfor kan jeg ikke sove, og det er svært for mig at passe mit arbejde, fordi jeg altid er træt.\n\nJeg har naturligvis prøvet at løse problemet selv. Jeg har talt med min nabo to gange, og jeg har også skrevet en venlig besked til ham. Desværre har det ikke hjulpet, selvom han hver gang siger undskyld.\n\nJeg håber derfor, at I vil kontakte min nabo og minde ham om foreningens regler om støj. Hvis det ikke hjælper, vil jeg gerne høre, hvad jeg ellers kan gøre.\n\nPå forhånd tak for hjælpen.\n\nVenlig hilsen\nSara Ahmadi\nSolvej 12, 2. tv. · Telefon: 50 12 34 56',
  whyBetter:['Covers all four bullets in the task order — easy for the censor to tick off.','Concrete details (two months, until 2-3 at night, three years) make the complaint credible.','Word-order variety with correct inversion: "Derfor kan jeg ikke sove", "Desværre har det ikke hjulpet".','Correct SAV in subordinate clauses: "fordi jeg altid er træt", "selvom han hver gang siger undskyld".','Polite escalation ("Hvis det ikke hjælper…") instead of anger — perfect halvformel tone.','Clear closing request, thanks in advance, and contact information.'],
  commonMistakes:['Forgetting bullet 1 (where YOU live) because the problem feels more important.','Angry tone: "I SKAL gøre noget NU!" — politeness is part of the score.','"fordi min nabo spiller ikke musik stille" — SAV breaks under pressure; check every fordi.','No closing request — a complaint must say what you want to happen.']
},
{ id:'w1b', opgave:'Opgave 1', concept:'w-opg1', minWords:100, maxWords:200,
  title:'Henvendelse til kommunen om børnehaveplads',
  situation:'Du er lige flyttet til Brøndby Kommune med din familie. Din datter på 3 år skal starte i børnehave. Du vil skrive til kommunens pladsanvisning.',
  taskIntro:'Skriv en henvendelse til pladsanvisningen i Brøndby Kommune. Du skal fortælle:',
  bullets:['hvem du er, og hvornår du er flyttet til kommunen','hvorfor du skriver','hvilke ønsker du har til børnehaven (fx sted og åbningstider)','hvilke spørgsmål du har til pladsanvisningen.'],
  structure:['Greeting: "Kære Pladsanvisningen i Brøndby Kommune"','Who you are + when you moved (bullet 1)','Why you write: your daughter needs a place (bullet 2)','Your wishes: location, opening hours (bullet 3)','Your questions: waiting time, documents, price (bullet 4)','Closing + thanks + contact information'],
  planning:'Plan: 1) familie, flyttet 1. maj. 2) datter 3 år → brug for plads. 3) tæt på station, åben til 17, gerne fra august. 4) ventetid? dokumenter? pris?',
  modelPassing:'Kære Pladsanvisningen\n\nJeg hedder Pavel Novak. Jeg er flyttet til Brøndby Kommune den 1. maj sammen med min kone og vores datter, Eva. Eva er 3 år gammel.\n\nJeg skriver til jer, fordi Eva skal starte i børnehave. Vi vil gerne have en plads så hurtigt som muligt, helst fra august.\n\nVi ønsker en børnehave tæt på Brøndby Strand Station, fordi vi ikke har bil. Det er også vigtigt, at børnehaven har åbent til klokken 17, fordi jeg arbejder til klokken 16.\n\nJeg har tre spørgsmål: Hvor lang er ventetiden? Hvilke dokumenter skal I bruge fra os? Og hvad koster en plads om måneden?\n\nPå forhånd tak for hjælpen.\n\nVenlig hilsen\nPavel Novak',
  modelStrong:'Kære Pladsanvisningen i Brøndby Kommune\n\nMit navn er Pavel Novak, og den 1. maj flyttede jeg til kommunen sammen med min kone og vores datter, Eva, som er 3 år gammel. Vi bor på Strandesplanaden 24 i Brøndby Strand.\n\nJeg skriver til jer, fordi Eva skal starte i børnehave, og vi vil derfor gerne skrives op til en plads. Hvis det er muligt, håber vi, at hun kan begynde i august, når min kone starter på sit nye arbejde.\n\nVi har to ønsker til børnehaven. For det første skal den gerne ligge tæt på Brøndby Strand Station, fordi vi ikke har bil. For det andet er det vigtigt, at den har åbent til klokken 17, da jeg først har fri klokken 16.\n\nDesuden har jeg nogle spørgsmål: Hvor lang er ventetiden i øjeblikket? Hvilke dokumenter skal I bruge fra os? Og er det muligt at besøge børnehaven, inden Eva starter?\n\nI kan kontakte mig på telefon 52 33 44 55 eller på denne mail.\n\nPå forhånd tak for hjælpen. Jeg ser frem til at høre fra jer.\n\nVenlig hilsen\nPavel Novak',
  whyBetter:['Address and timing details give the kommune everything it needs — the text does a real job.','Structured wishes with "For det første… For det andet…" — clear signposting.','Inversion handled correctly after fronted elements: "den 1. maj flyttede jeg…", "Desuden har jeg…".','Subordinate clauses are correct and varied: "fordi vi ikke har bil", "da jeg først har fri", "inden Eva starter".','Closes with contact info AND a forward-looking sentence — a complete, professional henvendelse.'],
  commonMistakes:['Answering only two of the four bullets — wishes and questions are often forgotten.','Mixing the questions into one long sentence; number them or ask them one at a time.','"fordi vi har ikke bil" — the classic SAV error. Check every fordi/da/når.','Too informal: this is the kommune, not a friend — no "Hej!" and no smileys.']
},
{ id:'w2a', opgave:'Opgave 2', concept:'w-opg2', minWords:90, maxWords:200,
  title:'Svar til din veninde Aja',
  situation:'Du har fået en e-mail fra din veninde, Aja.',
  taskIntro:'Læs e-mailen, og skriv et svar til Aja. Du skal svare på alle Ajas spørgsmål. Du skal skrive minimum 90 ord.',
  email:'Hej!\nJeg har hørt, at du er ude at rejse. Hvor er du henne? Hvorfor er du ude at rejse? Hvad laver du? Hvordan er stedet, som du besøger? Ja, der er meget, jeg gerne vil høre om, så skriv og fortæl mig det hele.\nMange hilsner\nAja',
  bullets:['Hvor er du henne?','Hvorfor er du ude at rejse?','Hvad laver du?','Hvordan er stedet, som du besøger?'],
  structure:['Warm greeting + thanks for the mail','Answer question 1: where you are','Answer question 2: why you are travelling','Answer question 3: what you are doing','Answer question 4: what the place is like','Friendly closing + sign-off'],
  planning:'Underline every question mark in Ajas mail first. Plan: 1) Barcelona. 2) min brors bryllup. 3) sightseeing, strand, familiemiddage. 4) varmt, smukt, billigere end DK.',
  modelPassing:'Hej Aja!\n\nTak for din mail. Hvor er det dejligt at høre fra dig!\n\nJeg er i Barcelona i Spanien. Jeg er her, fordi min bror skal giftes på lørdag. Hele familien er med, og vi skal være her i ti dage.\n\nOm dagen går vi rundt i byen og ser på de gamle bygninger. I går var vi på stranden, og i morgen skal vi spise middag med min brors nye familie.\n\nByen er meget smuk, og vejret er varmt — omkring 28 grader hver dag. Maden er fantastisk, og det er billigere end i Danmark.\n\nVi ses, når jeg kommer hjem!\n\nMange hilsner\nLeila',
  modelStrong:'Hej Aja!\n\nTusind tak for din mail — hvor er det dejligt, at du tænker på mig!\n\nLige nu sidder jeg på en lille café i Barcelona. Jeg er rejst herned, fordi min bror skal giftes på lørdag med sin spanske kæreste, Carmen. Det er derfor en helt særlig tur for hele familien.\n\nOm dagen oplever vi byen: Vi har set Sagrada Família, og i går lå vi på stranden hele eftermiddagen. Om aftenen spiser vi sammen med Carmens familie, selvom vi ikke taler ret meget spansk — vi griner os igennem det!\n\nStedet er fantastisk. Byen er smuk og levende, vejret er varmt, og maden er den bedste, jeg nogensinde har smagt. Hvis du ikke har været her, skal du tage af sted!\n\nSkal vi drikke kaffe, når jeg er hjemme igen i næste uge? Så fortæller jeg det hele.\n\nKnus\nLeila',
  whyBetter:['All four questions answered — in the same order Aja asked them.','Natural, warm tone with personal details (Carmen, Sagrada Família) — it reads like a real friend.','Correct inversion after fronted elements: "Lige nu sidder jeg…", "Om aftenen spiser vi…", "Så fortæller jeg…".','Subordinate clauses used confidently: "fordi min bror skal giftes", "selvom vi ikke taler ret meget spansk", "Hvis du ikke har været her…".','Ends by giving the conversation back to Aja (coffee invitation) — excellent email behaviour.'],
  commonMistakes:['Skipping one of the four questions — count the question marks!','Writing 60 words: minimum is 90. Greeting + 4 answers + closing gets you there naturally.','Past/present tense chaos: pick "I am here now" and keep the timeline clear.','Formal kommune-style language to a close friend ("Jeg skriver til dig angående…") — wrong register.']
},
{ id:'w2b', opgave:'Opgave 2', concept:'w-opg2', minWords:90, maxWords:200,
  title:'Svar til din chef Mette',
  situation:'Du har fået en e-mail fra din chef, Mette.',
  taskIntro:'Læs e-mailen, og skriv et svar til Mette. Du skal svare på alle Mettes spørgsmål. Du skal skrive minimum 90 ord.',
  email:'Hej!\nSom du måske har hørt, holder vi personalemøde på fredag klokken 15. Kan du arbejde lidt længere på fredag, så du kan være med? Hvordan går det med dine opgaver i denne uge? Har du brug for hjælp til noget? Og en sidste ting: Hvad synes du, vi skal tale om på mødet?\nSkriv til mig, når du har tid.\nHilsen\nMette',
  bullets:['Kan du arbejde længere på fredag og være med til mødet?','Hvordan går det med dine opgaver i denne uge?','Har du brug for hjælp til noget?','Hvad synes du, mødet skal handle om?'],
  structure:['Greeting + thanks for the mail','Answer 1: yes/no to Friday — and if no, suggest a solution','Answer 2: status on your tasks','Answer 3: do you need help — be concrete','Answer 4: suggest a topic for the meeting + a short reason','Professional, friendly closing'],
  planning:'Plan: 1) ja, kan blive til kl. 17 (henter barn først kl. 17.30). 2) opgaver går fint, lager færdigt onsdag. 3) brug for hjælp til det nye computersystem. 4) tale om vagtplanen for sommeren.',
  modelPassing:'Hej Mette\n\nTak for din mail.\n\nJa, jeg kan godt arbejde længere på fredag. Jeg skal først hente min søn klokken 17.30, så jeg kan være med til mødet klokken 15.\n\nMine opgaver går fint i denne uge. Jeg er næsten færdig med at tælle varerne på lageret, og jeg bliver helt færdig onsdag.\n\nJeg har brug for lidt hjælp til det nye computersystem. Jeg kan ikke finde ud af at printe lister. Kan du eller Jonas vise mig det?\n\nJeg synes, vi skal tale om vagtplanen for sommeren på mødet, fordi mange skal holde ferie i juli.\n\nVi ses på fredag!\n\nVenlig hilsen\nAmir',
  modelStrong:'Hej Mette\n\nTak for din mail — og tak, fordi du spørger.\n\nJa, det kan jeg sagtens. På fredag kan jeg blive til klokken 17, fordi min kone henter vores søn den dag. Så jeg deltager gerne i mødet klokken 15.\n\nMine opgaver kører efter planen i denne uge. Optællingen på lageret er næsten færdig, og hvis alt går vel, afslutter jeg den allerede onsdag eftermiddag.\n\nDer er én ting, jeg gerne vil have hjælp til: det nye computersystem. Jeg kan registrere varer, men jeg kan ikke finde ud af at printe ugelisterne. Hvis du eller Jonas har ti minutter i morgen, ville det være en stor hjælp.\n\nTil mødet synes jeg, at vi skal tale om sommerens vagtplan. Mange kolleger holder ferie i juli, og derfor er det en god idé at planlægge i god tid.\n\nVi ses på fredag — og god dag!\n\nVenlig hilsen\nAmir',
  whyBetter:['Every question gets its own small paragraph in Mettes order — effortless to follow.','Concrete and practical: times, days, names, a specific request ("ti minutter i morgen").','Inversion mastered: "På fredag kan jeg blive…", "Til mødet synes jeg…", "derfor er det en god idé…".','SAV correct in every subordinate clause: "fordi min kone henter…", "hvis alt går vel", "at jeg ikke kan finde ud af…".','Professional but warm tone — exactly the register for a friendly boss.'],
  commonMistakes:['Answering the Friday question and forgetting the rest — four questions need four answers.','Vague status ("det går fint") with no detail — show language by being concrete.','Asking for help without saying WITH WHAT.','"fordi jeg kan ikke printe" — check SAV in every fordi/hvis sentence before sending.']
}
],

phrases:[
{ cat:'Openings', icon:'door-open', items:[
  'Kære AL-bolig',
  'Til boligforeningen / Til Pladsanvisningen',
  'Mit navn er … , og jeg bor på …',
  'Jeg hedder … , og jeg er flyttet til kommunen den …',
  'Hej …! Tak for din mail.',
  'Tusind tak for din besked — dejligt at høre fra dig!'
]},
{ cat:'Reason for writing', icon:'help-circle', items:[
  'Jeg skriver til jer, fordi …',
  'Jeg skriver for at høre, om …',
  'Grunden til, at jeg skriver, er, at …',
  'Jeg vil gerne spørge om …',
  'Jeg kontakter jer angående …',
  'Jeg vil gerne skrives op til …'
]},
{ cat:'Explaining a problem', icon:'alert-circle', items:[
  'Jeg har et problem med …',
  'Desværre er der et problem med …',
  'Problemet er, at …',
  'Det er et stort problem for mig, fordi …',
  'Situationen er desværre blevet værre, fordi …',
  'Jeg har prøvet at løse problemet ved at …'
]},
{ cat:'Asking politely', icon:'hand-helping', items:[
  'Kan I hjælpe mig med at …?',
  'Jeg vil gerne bede jer om at …',
  'Kunne I fortælle mig, hvornår …?',
  'Jeg vil gerne høre, om det er muligt at …',
  'Jeg håber, at I kan …',
  'Er det muligt at få en tid til …?'
]},
{ cat:'Adding information', icon:'plus-circle', items:[
  'Desuden vil jeg gerne nævne, at …',
  'Derudover har jeg et spørgsmål om …',
  'For det første … For det andet …',
  'Til sidst vil jeg gerne tilføje, at …',
  'Det er også vigtigt for mig, at …',
  'Jeg kan i øvrigt oplyse, at …'
]},
{ cat:'Closings', icon:'door-closed', items:[
  'På forhånd tak for hjælpen.',
  'Jeg ser frem til at høre fra jer.',
  'I kan kontakte mig på telefon … eller på denne mail.',
  'Skriv endelig, hvis I har spørgsmål.',
  'Venlig hilsen',
  'Mange hilsner / Knus (kun til venner!)'
]}
],

connectors:[
  {w:'og', e:'and'},{w:'men', e:'but'},{w:'så', e:'so / then'},{w:'fordi', e:'because (SAV!)'},
  {w:'derfor', e:'therefore (inversion!)'},{w:'desuden', e:'furthermore (inversion!)'},
  {w:'alligevel', e:'nevertheless'},{w:'selvom', e:'even though (SAV!)'},
  {w:'hvis', e:'if (SAV!)'},{w:'når', e:'when (SAV!)'},{w:'for eksempel', e:'for example'},
  {w:'til gengæld', e:'on the other hand / in return'},{w:'først', e:'first'},
  {w:'bagefter', e:'afterwards (inversion!)'},{w:'til sidst', e:'finally (inversion!)'},
  {w:'da', e:'since / as (SAV!)'}
],

checklist:[
  'Did I respond to ALL points/questions in the task prompt?',
  'Did I start with a clear reason for writing?',
  'Did I use polite and appropriately formal language for the receiver?',
  'Did I structure the text with a beginning, middle and end?',
  'Did I use connectors (fordi, derfor, desuden, men, selvom)?',
  'Did I check V2/inversion after time and place expressions?',
  'Did I check word order after fordi/at/hvis/når/selvom (SAV)?',
  'Did I check the placement of ikke/aldrig/altid/tit?',
  'Did I include a clear closing request or conclusion?',
  'Did I check spelling and punctuation?',
  'Is my text the right length? (Opg. 1: 100–200 words · Opg. 2: min. 90 words)'
]
};


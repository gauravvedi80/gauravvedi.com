/* Dansk Coach — data/01-lessons.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   DATA — LEARN MODE LESSONS
   ===================================================================== */
const LESSONS = [
{
  id:'l1', icon:'anchor', title:'V2 — the verb lives in seat 2', subtitle:'Word order in Danish main clauses',
  concepts:['v2-main','tense-present'],
  explain:'Danish main clauses follow one iron rule: the finite verb (the verb that changes with tense) is ALWAYS the second element. Not the second word — the second <b>element</b>. Position 1 can hold the subject, a time phrase, a place phrase or an object, but whatever you put there, the verb refuses to move from seat 2. English lets you say "Tomorrow I will work" — Danish does not. This single rule explains most word-order points you will win or lose in Modul 3.3.',
  examples:[
    {da:'Jeg arbejder i Netto.', en:'I work at Netto. (subject first — looks like English)'},
    {da:'Nu arbejder jeg i Netto.', en:'Now I work at Netto. (time word first → subject jumps behind the verb)'},
    {da:'Min mand laver aftensmad hver dag.', en:'My husband makes dinner every day.'},
    {da:'Hver dag laver min mand aftensmad.', en:'Every day my husband makes dinner. (verb still 2nd!)'}
  ],
  maps:[
    {type:'main', cells:['Jeg','arbejder','—','altid','i Netto'], note:'Subject in position 1'},
    {type:'main', cells:['Nu','arbejder','jeg','altid','i Netto'], note:'Time word in position 1 → subject moves to position 3'}
  ],
  mistakes:[
    'Putting the verb 3rd after a fronted element: ✗ "Nu jeg arbejder…"',
    'Counting words instead of elements — "Min gamle nabo" is ONE element in position 1.',
    'Forgetting that V2 also applies after long openers: "Efter arbejde i går aftes…" still needs the verb next.'
  ],
  contrasts:[
    {bad:'I dag jeg skal købe ind.', good:'I dag skal jeg købe ind.', why:'"I dag" fills seat 1, so the finite verb "skal" must take seat 2 and "jeg" moves to seat 3.'},
    {bad:'Om sommeren vi cykler til stranden.', good:'Om sommeren cykler vi til stranden.', why:'"Om sommeren" is position 1 → verb second, subject third.'}
  ],
  trick:'Position 1 can change, but the verb must sit in seat 2. Imagine the verb is glued to chair number 2 — everyone else moves around it.',
  trap:'Exam trap: tasks love to start sentences with a time phrase ("I weekenden…", "Om mandagen…") exactly because learners forget to swap subject and verb. If the sentence does not start with the subject — INVERT.',
  drill:['Jeg drikker kaffe hver morgen.','Hver morgen drikker jeg kaffe.','Min datter spiller fodbold om tirsdagen.','Om tirsdagen spiller min datter fodbold.'],
  mini:[
    { qid:'l1m1', prompt:'Choose the correct sentence:', concept:'v2-main',
      options:[
        {text:'I aften jeg ser en film.', ok:false, mistakeType:'Verb in 3rd position', why:'"I aften" already fills seat 1, so "jeg ser" puts the verb in seat 3 — illegal in a main clause.'},
        {text:'I aften ser jeg en film.', ok:true, why:'"I aften" = position 1, "ser" = position 2, subject "jeg" follows. Perfect V2.'},
        {text:'I aften en film ser jeg.', ok:false, mistakeType:'Object before verb', why:'The object cannot squeeze between position 1 and the verb.'}
      ],
      explanation:'Whatever stands first, the finite verb is element number 2. "I aften ser jeg en film" keeps "ser" in seat 2.',
      trick:'Verb = seat 2. Always.', decon:{type:'main', cells:['I aften','ser','jeg','—','en film']}
    },
    { qid:'l1m2', prompt:'Which sentence is correct Danish?', concept:'v2-main',
      options:[
        {text:'Min kollega hjælper mig tit med dansk.', ok:true, why:'Subject first, verb second, the adverb "tit" after the verb — textbook main clause.'},
        {text:'Min kollega tit hjælper mig med dansk.', ok:false, mistakeType:'Adverb before finite verb', why:'"tit" has pushed the verb to 3rd position. In main clauses the central adverb comes AFTER the finite verb.'},
        {text:'Tit min kollega hjælper mig med dansk.', ok:false, mistakeType:'No inversion after fronted adverb', why:'If "tit" takes position 1, the verb must come immediately after: "Tit hjælper min kollega…".'}
      ],
      explanation:'"Min kollega" (1) + "hjælper" (2) + "tit" (central adverb after the verb). Both wrong options break the V2 rule.',
      trick:'Main clause skeleton: Subject + Verb + Adverb.', decon:{type:'main', cells:['Min kollega','hjælper','—','tit','mig med dansk']}
    }
  ],
  recap:['The finite verb is ALWAYS element 2 in a main clause.','Position 1 can be subject, time, place or object — one element only.','If position 1 is not the subject, subject moves to position 3 (inversion).','Count elements, not words.'],
  practice:{label:'Train V2 in the Grammar Trainer', fn:"DC.go('grammar')"}
},
{
  id:'l2', icon:'repeat', title:'Inversion — time and place first', subtitle:'What happens when the sentence does not start with the subject',
  concepts:['inv-time','inv-place','tense-past'],
  explain:'Inversion means the subject and the finite verb swap places. It is not a new rule — it is V2 doing its job. When you front a time expression (i går, i morgen, om vinteren, klokken 8) or a place expression (i Danmark, hjemme hos os, på mit arbejde), that expression occupies position 1. The verb must stay in position 2, so the subject is pushed to position 3. Danes do this constantly to make texts flow, and the SIRI writing test rewards you for doing it correctly — but only if you remember to swap.',
  examples:[
    {da:'I går tog jeg bussen til sprogskolen.', en:'Yesterday I took the bus to language school.'},
    {da:'Om vinteren bliver det mørkt klokken fire.', en:'In winter it gets dark at four.'},
    {da:'I mit hjemland spiser man aftensmad sent.', en:'In my home country people eat dinner late.'},
    {da:'På mit arbejde taler vi kun dansk.', en:'At my work we only speak Danish.'}
  ],
  maps:[
    {type:'main', cells:['I går','tog','jeg','—','bussen til sprogskolen'], note:'Time expression fronted → inversion'},
    {type:'main', cells:['I Danmark','cykler','mange','—','til arbejde'], note:'Place expression fronted → inversion'}
  ],
  mistakes:[
    'Keeping English order: ✗ "I Danmark mange mennesker cykler."',
    'Inverting when the subject is first (no need!): ✗ "Jeg tog i går bussen" is odd — keep time at the end or front it properly.',
    'Forgetting inversion after a fronted SUBORDINATE clause: "Hvis det regner, tager jeg bussen" — the whole hvis-clause is position 1!'
  ],
  contrasts:[
    {bad:'I weekenden vi besøger min svigermor.', good:'I weekenden besøger vi min svigermor.', why:'"I weekenden" is position 1, so "besøger" must come second and "vi" third.'},
    {bad:'Hjemme hos os man tager skoene af.', good:'Hjemme hos os tager man skoene af.', why:'Place expression first → verb second, subject "man" third.'},
    {bad:'Når jeg kommer hjem, jeg laver kaffe.', good:'Når jeg kommer hjem, laver jeg kaffe.', why:'The entire når-clause fills position 1 of the main clause — so the main clause must invert: verb before subject.'}
  ],
  trick:'TIME or PLACE first? SWAP! Front it — flip it. The comma after a fronted hvis/når-clause works like a springboard: the verb jumps over the subject.',
  trap:'Exam trap: a fronted subordinate clause ("Hvis det regner, …", "Når jeg får tid, …") counts as position 1. Learners handle the subordinate clause correctly and then forget to invert the main clause after the comma. The censor sees this instantly.',
  drill:['I morgen skal jeg til samtale.','Om søndagen sover vi længe.','I min familie laver min far maden.','Hvis jeg får tid, ringer jeg til dig.'],
  mini:[
    { qid:'l2m1', prompt:'Choose the correct sentence:', concept:'inv-time',
      options:[
        {text:'I sidste uge jeg var syg.', ok:false, mistakeType:'No inversion after time expression', why:'"I sidste uge" fills seat 1 — the verb "var" must come next, not "jeg".'},
        {text:'I sidste uge var jeg syg.', ok:true, why:'Time expression (1) + var (2) + jeg (3). Correct inversion.'},
        {text:'Var jeg i sidste uge syg.', ok:false, mistakeType:'Question order in a statement', why:'Starting with the verb makes a yes/no question, not a statement.'}
      ],
      explanation:'Fronted time expression forces subject–verb swap: "I sidste uge var jeg syg."',
      trick:'Time first? Swap!', decon:{type:'main', cells:['I sidste uge','var','jeg','—','syg']}
    },
    { qid:'l2m2', prompt:'"Hvis det regner, ___" — what follows?', concept:'inv-time',
      options:[
        {text:'jeg tager bussen.', ok:false, mistakeType:'No inversion after fronted clause', why:'The hvis-clause is position 1 of the whole sentence, so the main clause must start with its verb.'},
        {text:'tager jeg bussen.', ok:true, why:'The fronted hvis-clause acts as position 1 → "tager" (2) + "jeg" (3). Perfect.'},
        {text:'bussen tager jeg.', ok:false, mistakeType:'Object misplaced', why:'This fronts the object inside the main clause as well — confusing and wrong here.'}
      ],
      explanation:'A fronted subordinate clause occupies position 1. After the comma: verb first, then subject — "…, tager jeg bussen."',
      trick:'The comma is a springboard — the verb jumps over the subject.', decon:{type:'main', cells:['Hvis det regner','tager','jeg','—','bussen']}
    }
  ],
  recap:['Inversion = subject and verb swap so the verb stays in seat 2.','Triggers: fronted time, fronted place, fronted objects — and whole fronted subordinate clauses.','After "Hvis…, / Når…," the main clause starts with its VERB.','Vary your sentence openings in writing — correct inversion earns marks.'],
  practice:{label:'Train inversion in the Grammar Trainer', fn:"DC.go('grammar')"}
},
{
  id:'l3', icon:'move-horizontal', title:'Central adverbs — where does "ikke" go?', subtitle:'ikke, altid, aldrig, tit in main clauses (and with modals + perfect)',
  concepts:['adv-main','modal','tense-perfect'],
  explain:'Central adverbs (ikke, altid, aldrig, tit, ofte, også, snart, allerede, desværre) describe the whole sentence, and Danish gives them a fixed parking spot. In a MAIN clause that spot is immediately AFTER the finite verb: "Jeg drikker ikke kaffe." With a modal verb (kan, skal, vil, må) the finite verb is the modal — so the adverb parks right after the modal and BEFORE the main verb: "Jeg kan ikke komme." In the perfect tense the finite verb is har/er, so the adverb goes after har/er: "Jeg har aldrig været i Jylland." Same rule every time: find the FINITE verb, park the adverb behind it.',
  examples:[
    {da:'Jeg spiser ikke kød.', en:'I do not eat meat.'},
    {da:'Hun kommer altid for sent.', en:'She always arrives late.'},
    {da:'Jeg kan ikke arbejde på lørdag.', en:'I cannot work on Saturday. (after the modal!)'},
    {da:'Vi har aldrig prøvet vinterbadning.', en:'We have never tried winter bathing. (after har!)'}
  ],
  maps:[
    {type:'main', cells:['Jeg','drikker','—','ikke','kaffe om aftenen'], note:'Simple verb: adverb after it'},
    {type:'main', cells:['Jeg','kan','—','ikke','komme i morgen'], note:'Modal: ikke between modal and infinitive'},
    {type:'main', cells:['Hun','har','—','altid','boet i Aarhus'], note:'Perfect: adverb after har/er'}
  ],
  mistakes:[
    'Adverb before the finite verb (subordinate-clause order leaking in): ✗ "Jeg ikke spiser kød."',
    'Adverb after the infinitive: ✗ "Jeg kan komme ikke."',
    'Adverb after the past participle: ✗ "Jeg har været aldrig i Jylland."'
  ],
  contrasts:[
    {bad:'Han ikke arbejder om søndagen.', good:'Han arbejder ikke om søndagen.', why:'Main clause: the finite verb comes directly after the subject, and ikke follows the verb.'},
    {bad:'Jeg vil gerne ikke arbejde over.', good:'Jeg vil ikke arbejde over.', why:'"ikke" parks right after the modal "vil". ("gerne" and "ikke" also clash — choose one.)'},
    {bad:'Vi har set aldrig den film.', good:'Vi har aldrig set den film.', why:'In perfect tense the adverb follows "har", never the participle.'}
  ],
  trick:'Main clause: Subject + Verb + Adverb (SVA). Find the verb that carries the tense — ikke stands in its shadow, one step behind.',
  trap:'Exam trap: questions love modal + ikke ("kan ikke komme", "vil ikke arbejde", "må ikke ryge"). If you see TWO verbs, the adverb goes between them — after the first, before the second.',
  drill:['Jeg ryger ikke.','Jeg kan ikke komme på fredag.','Vi spiser aldrig fastfood i hverdagen.','Han har altid cyklet til arbejde.'],
  mini:[
    { qid:'l3m1', prompt:'Place "ikke" correctly: "Jeg ___ arbejde på søndag." (kan + arbejde)', concept:'modal',
      options:[
        {text:'Jeg kan ikke arbejde på søndag.', ok:true, why:'"kan" is the finite verb, so "ikke" parks right after it and before the infinitive.'},
        {text:'Jeg ikke kan arbejde på søndag.', ok:false, mistakeType:'Subordinate order in main clause', why:'"ikke" before the finite verb is subordinate-clause order — wrong in a main clause.'},
        {text:'Jeg kan arbejde ikke på søndag.', ok:false, mistakeType:'Adverb after infinitive', why:'"ikke" may not trail after the infinitive "arbejde".'}
      ],
      explanation:'With modals the chain is modal + ikke + infinitive: "kan ikke arbejde".',
      trick:'Two verbs? ikke goes between them.', decon:{type:'main', cells:['Jeg','kan','—','ikke','arbejde på søndag']}
    },
    { qid:'l3m2', prompt:'Choose the correct perfect-tense sentence:', concept:'tense-perfect',
      options:[
        {text:'Jeg har boet aldrig i en lille by.', ok:false, mistakeType:'Adverb after participle', why:'"aldrig" cannot follow the participle "boet".'},
        {text:'Jeg har aldrig boet i en lille by.', ok:true, why:'"har" is the finite verb — "aldrig" follows it directly.'},
        {text:'Jeg aldrig har boet i en lille by.', ok:false, mistakeType:'Subordinate order in main clause', why:'Adverb before "har" is the subordinate pattern, not main-clause order.'}
      ],
      explanation:'Perfect tense: subject + har/er + ADVERB + participle. "Jeg har aldrig boet…"',
      trick:'The adverb stands in the shadow of har/er.', decon:{type:'main', cells:['Jeg','har','—','aldrig','boet i en lille by']}
    }
  ],
  recap:['Main clause: adverb right AFTER the finite verb.','Modal verbs: modal + ikke + infinitive.','Perfect tense: har/er + ikke/aldrig + participle.','Always locate the finite verb first — the adverb shadows it.'],
  practice:{label:'Train adverb placement now', fn:"DC.go('grammar')"}
},
{
  id:'l4', icon:'git-branch', title:'Subordinate clauses — the SAV pattern', subtitle:'fordi, at, hvis, når, selvom change the word order',
  concepts:['sav-conn','adv-sub'],
  explain:'A subordinate clause begins with a connector (fordi, at, hvis, når, selvom, da, om, som) and cannot stand alone. Inside it, Danish flips the adverb rule: the central adverb moves IN FRONT of the verb. Main clause: "Jeg kommer ikke." Subordinate: "… fordi jeg IKKE kommer." The skeleton is Connector + Subject + Adverb + Verb (SAV). There is no inversion inside a subordinate clause — the subject always comes straight after the connector. This is the single most tested grammar point in Modul 3.3 writing, because learners write "fordi jeg kan ikke…" out of habit.',
  examples:[
    {da:'Jeg bliver hjemme, fordi jeg ikke har det godt.', en:'I am staying home because I am not feeling well.'},
    {da:'Hun siger, at hun aldrig drikker kaffe.', en:'She says that she never drinks coffee.'},
    {da:'Hvis du ikke kan komme, skal du ringe.', en:'If you cannot come, you must call.'},
    {da:'Selvom jeg tit er træt, træner jeg om aftenen.', en:'Even though I am often tired, I train in the evening.'}
  ],
  maps:[
    {type:'sub', cells:['fordi','jeg','ikke','kan','komme i dag'], note:'SAV: adverb BEFORE the verb'},
    {type:'sub', cells:['selvom','han','aldrig','har','tid'], note:'Same pattern with every connector'}
  ],
  mistakes:[
    'Main-clause order after fordi: ✗ "fordi jeg kan ikke komme".',
    'Inversion after the connector: ✗ "fordi kan jeg ikke komme".',
    'Forgetting that AT-clauses count too: ✗ "Hun siger, at hun drikker aldrig kaffe."'
  ],
  contrasts:[
    {bad:'Jeg cykler, fordi det er ikke dyrt.', good:'Jeg cykler, fordi det ikke er dyrt.', why:'After "fordi": subject + ADVERB + verb. "ikke" must stand before "er".'},
    {bad:'Han siger, at han kan ikke sove.', good:'Han siger, at han ikke kan sove.', why:'In the at-clause "ikke" moves in front of the finite verb "kan".'},
    {bad:'Hvis du ikke ringer, jeg bliver bekymret.', good:'Hvis du ikke ringer, bliver jeg bekymret.', why:'Two rules at once: SAV inside the hvis-clause, then INVERSION in the main clause after the comma.'}
  ],
  trick:'Main clause: Subject + Verb + Adverb. Subordinate clause: Subject + Adverb + Verb. Remember: in the "sub" the adverb SUBmarines — it dives in front of the verb. Checklist word: fordi-at-hvis-når-selvom = "FAHNS" — see one, move ikke forward.',
  trap:'Exam trap: the test combines both clause types in ONE sentence ("Hvis det ikke regner, cykler jeg"). You must use SAV before the comma and inversion after it. Check each half separately.',
  drill:['…fordi jeg ikke kan komme.','…at hun aldrig spiser kød.','…hvis du ikke har tid.','…selvom vi tit er trætte.'],
  mini:[
    { qid:'l4m1', prompt:'Complete: "Jeg kommer ikke til festen, fordi …"', concept:'sav-conn',
      options:[
        {text:'… jeg skal ikke have fri.', ok:false, mistakeType:'Main-clause order after fordi', why:'"skal ikke" is main-clause order. After fordi the adverb climbs before the verb.'},
        {text:'… jeg ikke skal have fri.', ok:true, why:'Connector + subject + ikke + verb. Perfect SAV.'},
        {text:'… skal jeg ikke have fri.', ok:false, mistakeType:'Inversion inside subordinate clause', why:'No inversion after a connector — the subject comes first.'}
      ],
      explanation:'After fordi: "jeg ikke skal" — Subject, Adverb, Verb.',
      trick:'In the sub, the adverb SUBmarines in front of the verb.', decon:{type:'sub', cells:['fordi','jeg','ikke','skal','have fri']}
    },
    { qid:'l4m2', prompt:'Which sentence is completely correct?', concept:'adv-sub',
      options:[
        {text:'Hun siger, at hun tit ser danske film.', ok:true, why:'"tit" stands before the verb "ser" inside the at-clause — correct SAV.'},
        {text:'Hun siger, at hun ser tit danske film.', ok:false, mistakeType:'Main-clause order after at', why:'Inside an at-clause the adverb must move before the verb: "at hun tit ser…".'},
        {text:'Hun siger, at tit hun ser danske film.', ok:false, mistakeType:'Adverb before subject', why:'The subject comes straight after the connector — the adverb cannot jump in front of it.'}
      ],
      explanation:'at + hun + tit + ser. The adverb sits between subject and verb in every subordinate clause.',
      trick:'FAHNS words → ikke/altid/tit move forward.', decon:{type:'sub', cells:['at','hun','tit','ser','danske film']}
    }
  ],
  recap:['Subordinate clauses start with fordi/at/hvis/når/selvom/da/om/som.','Pattern: Connector + Subject + ADVERB + Verb (SAV).','Never invert inside a subordinate clause.','Fronted subordinate clause = position 1 → invert the following main clause.'],
  practice:{label:'Train SAV in the Grammar Trainer', fn:"DC.go('grammar')"}
},
{
  id:'l5', icon:'mail', title:'Writing the SIRI way', subtitle:'Opgave 1 (halvformel henvendelse) & Opgave 2 (e-mail) structure',
  concepts:['w-opg1','w-opg2','w-polite','w-connectors'],
  explain:'The Modul 3.3 writing test has two tasks, and both are judged on the same things: did you answer EVERY point in the task, is the text organised with a beginning, middle and end, is the tone right, and is your word order correct? Opgave 1 is a halvformel henvendelse — typically a complaint or inquiry to a boligforening, kommune or workplace. The task gives you bullet points ("Du skal fortælle: …") — each bullet is worth marks, so cover all of them. Opgave 2 is an e-mail, often a reply to a private email where you must answer ALL the questions in it (minimum 90 words). The tone there is friendly; in Opgave 1 it is polite and neutral — no slang, no anger, no "Hej skat".',
  examples:[
    {da:'Kære AL-bolig / Til boligforeningen AL-bolig', en:'Opgave 1 opening — neutral and polite.'},
    {da:'Jeg skriver til jer, fordi jeg har et problem med min nabo.', en:'State your reason in line one.'},
    {da:'Jeg håber, at I kan hjælpe mig med at finde en løsning.', en:'Close with a clear, polite wish.'},
    {da:'Hej Aja! Tak for din mail — hvor er det dejligt at høre fra dig!', en:'Opgave 2 opening — warm, personal.'}
  ],
  maps:[
    {type:'main', cells:['Derfor','skriver','jeg','—','til jer i dag'], note:'Use inversion to vary your openings — it earns marks'},
    {type:'sub', cells:['fordi','min nabo','ikke','reagerer','på mine beskeder'], note:'Reasons with fordi need SAV order'}
  ],
  mistakes:[
    'Skipping a bullet point from the task — the most common reason for failing.',
    'Wrong tone: writing "Hej!" + smileys to the kommune, or stiff formality to a friend.',
    'No paragraph structure: one long block with no beginning, middle or end.',
    'Word order collapsing in fordi/hvis sentences under time pressure.',
    'Too short: under 90 words in Opgave 2 costs you the task.'
  ],
  contrasts:[
    {bad:'I skal fikse det NU!', good:'Jeg håber, at I kan løse problemet hurtigt.', why:'A complaint must stay polite — demanding and angry language lowers the impression of your level.'},
    {bad:'Jeg skriver fordi min nabo larmer og jeg kan ikke sove og jeg er træt…', good:'Jeg skriver, fordi min nabo larmer hver nat. Derfor kan jeg ikke sove, og jeg er meget træt på arbejdet.', why:'Short, connected sentences with derfor/og/fordi beat one breathless chain — and note "fordi min nabo larmer" (SAV) and "Derfor kan jeg" (inversion).'}
  ],
  trick:'The bullet-point contract: the task bullets ARE your plan. One bullet = one small paragraph, in order. Tick them off as you write — covered bullets are points in the bank.',
  trap:'Exam trap: Opgave 2 hides its questions inside a chatty email ("Hvor er du henne? Hvad laver du?…"). Underline every question mark in the prompt FIRST — each one must get an answer, or the censor counts the task as incomplete.',
  drill:['Jeg skriver til jer, fordi…','Jeg vil gerne høre, om…','Kan I fortælle mig, hvornår…?','På forhånd tak for hjælpen.'],
  mini:[
    { qid:'l5m1', prompt:'Best opening line to the boligforening about a noisy neighbour?', concept:'w-opg1',
      options:[
        {text:'HEJ! Min nabo er totalt umulig!!!', ok:false, mistakeType:'Wrong register', why:'Capitals, slang and exclamation marks are far too informal/aggressive for a halvformel henvendelse.'},
        {text:'Jeg skriver til jer, fordi jeg har et problem med min nabo i nr. 14.', ok:true, why:'Polite, concrete, states the reason immediately — exactly what the censor wants in line one.'},
        {text:'Hvordan går det hos jer? Jeg har det fint.', ok:false, mistakeType:'Missing purpose', why:'Small talk delays the purpose. A henvendelse states its reason in the first line.'}
      ],
      explanation:'Open with WHO you are / WHY you write. "Jeg skriver til jer, fordi…" is the safest, strongest opener.',
      trick:'Reason in line one — always.', decon:null
    },
    { qid:'l5m2', prompt:'The task says "Du skal skrive minimum 90 ord" and lists 4 questions. What is the winning strategy?', concept:'w-opg2',
      options:[
        {text:'Answer the 2 questions I have the best vocabulary for, in detail.', ok:false, mistakeType:'Incomplete task coverage', why:'Unanswered questions = incomplete task, no matter how beautiful the rest is.'},
        {text:'Answer all 4 questions, 1-3 sentences each, then add a friendly opening and closing.', ok:true, why:'Full coverage + structure + enough words. This is exactly how a passing answer is built.'},
        {text:'Write 200+ words about the topic in general to be safe.', ok:false, mistakeType:'Off-task writing', why:'Length without answering the actual questions does not score — and more text means more grammar errors.'}
      ],
      explanation:'Coverage beats brilliance: every question answered, clear structure, 90+ words.',
      trick:'Underline every "?" in the prompt — each needs an answer.', decon:null
    }
  ],
  recap:['Every bullet/question in the task MUST be covered.','Opgave 1: polite-neutral tone; Opgave 2: friendly but structured.','Structure: greeting → reason → details/answers → request/closing → sign-off.','Leave 5 minutes to check fordi/hvis word order and ikke-placement.'],
  practice:{label:'Open the Writing Lab', fn:"DC.go('writing')"}
},
{
  id:'l6', icon:'mic', title:'Speaking from a mindmap', subtitle:'Oral Opgave 1 (emneopgave) & Opgave 2 (samtale) technique',
  concepts:['o-mindmap','o-expand','o-conversation','o-thinking'],
  explain:'In the oral test, Opgave 1 is the emneopgave: you have prepared TWO topics with a mindmap of keywords for each (keywords only — full sentences are not allowed!). You draw one by lot and talk about it for 1-2 minutes, then the examiner asks follow-up questions for 3-4 minutes ("Vil du fortælle lidt mere om…?", "Kan du give nogen eksempler på…?", "Hvorfor?"). Opgave 2 is a conversation task: first a pair discussion about a topic with four pictures where you exchange opinions and ask each other questions, then individual questions about your own experiences. The examiners judge whether you can speak in connected language, give reasons, and keep a conversation alive — not whether your grammar is perfect.',
  examples:[
    {da:'Jeg vil gerne fortælle om mine sunde og usunde vaner.', en:'Open your presentation by naming the topic.'},
    {da:'For det første… For det andet… Til sidst…', en:'Signpost your branches — it sounds structured.'},
    {da:'Det er et godt spørgsmål. Jeg skal lige tænke mig om.', en:'Thinking-time phrase — buys you 3 seconds gracefully.'},
    {da:'I mit hjemland er det helt anderledes, fordi…', en:'Comparison sentences impress — and invite follow-ups you can prepare.'}
  ],
  maps:[
    {type:'main', cells:['Hver morgen','spiser','jeg','—','havregryn med frugt'], note:'Inversion makes your spoken Danish sound natural'},
    {type:'sub', cells:['fordi','jeg','ikke','har','tid om morgenen'], note:'Reasons in speech use SAV too'}
  ],
  mistakes:[
    'Writing full sentences on the mindmap and reading aloud — examiners stop this and it fails the purpose.',
    'One-sentence answers in the follow-up ("Ja." / "Nej, ikke rigtigt.").',
    'Memorised monologue that collapses at the first unexpected question.',
    'Silence instead of thinking-time phrases.'
  ],
  contrasts:[
    {bad:'(Examiner: Kan du lide at træne?) — "Ja."', good:'"Ja, det kan jeg godt. Jeg løber for eksempel en tur to gange om ugen, fordi det giver mig energi. I mit hjemland trænede jeg aldrig, så det er faktisk en ny vane."', why:'Point → example → reason → comparison. Four sentences instead of one word — that is what "udfolder sproget" means.'},
    {bad:'(silence …)', good:'"Det har jeg ikke tænkt så meget over før, men jeg tror, at…"', why:'A thinking-time phrase keeps the conversation alive while your brain catches up.'}
  ],
  trick:'PREP every answer: Point ("Jeg synes…"), Reason ("fordi…"), Example ("for eksempel…"), Personal link ("I mit hjemland… / I Danmark oplever jeg…"). Four steps ≈ 30 seconds of connected speech.',
  trap:'Exam trap: the examiner deliberately asks about the branch you said LEAST about. Prepare at least one example and one opinion for EVERY branch of your mindmap — including the boring ones.',
  drill:['Jeg synes, at… fordi…','For eksempel…','Det minder mig om…','På den ene side… på den anden side…'],
  mini:[
    { qid:'l6m1', prompt:'Your mindmap for the oral exam should contain:', concept:'o-mindmap',
      options:[
        {text:'Full sentences I can read aloud.', ok:false, mistakeType:'Reading instead of speaking', why:'The official rules require keywords only (stikord) — the teacher checks this. Reading aloud is not allowed.'},
        {text:'Keywords only — single words and short notes per branch.', ok:true, why:'Stikord trigger free speech; that is exactly what the format demands and what examiners want to hear.'},
        {text:'Nothing — better to improvise everything.', ok:false, mistakeType:'No preparation support', why:'You are allowed support — refusing it just raises the risk of blackout under pressure.'}
      ],
      explanation:'Officially: mindmap with stikord (enkeltord), not whole sentences. The keywords are triggers, not a script.',
      trick:'Keywords are triggers, not a script.', decon:null
    },
    { qid:'l6m2', prompt:'The examiner asks: "Du siger, du godt kan lide at cykle — hvorfor?" Best reaction?', concept:'o-followup',
      options:[
        {text:'"Fordi det er godt."', ok:false, mistakeType:'No expansion', why:'Technically an answer, but it shows no language. Expand: reason + example + comparison.'},
        {text:'"Det er et godt spørgsmål! Jeg kan godt lide at cykle, fordi det er billigt og sundt. For eksempel cykler jeg til arbejde hver dag, selv om vinteren. I mit hjemland kørte jeg altid i bil, så det var en stor forandring."', ok:true, why:'Thinking-time phrase + point + reason + example + comparison: a complete PREP answer.'},
        {text:'(Change topic to something easier.)', ok:false, mistakeType:'Avoiding the question', why:'Dodging the question signals you did not understand it. Answer first — THEN steer with a hook.'}
      ],
      explanation:'Follow-ups are invitations to show language. Answer directly, then expand with fordi / for eksempel / i mit hjemland.',
      trick:'Answer first, expand second, steer third.', decon:null
    }
  ],
  recap:['Opgave 1: 1-2 min presentation from keyword mindmap + 3-4 min follow-ups.','Opgave 2: pair discussion of 4 pictures + individual questions.','PREP: Point, Reason, Example, Personal link.','Never answer with one sentence; never go silent — use thinking-time phrases.'],
  practice:{label:'Open the Oral Strategist', fn:"DC.go('oral')"}
}
];


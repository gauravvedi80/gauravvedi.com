/* Dansk Coach — data/02-grammar.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   DATA — GRAMMAR TRAINER (15 questions)
   ===================================================================== */
const GRAMMAR_QUESTIONS = [
{ id:'g1', type:'mc', difficulty:'Easy', concept:'inv-time', extraConcepts:['v2-main'], tag:'Choose the correct word order',
  prompt:'The sentence starts with "I morgen". Which version is correct?',
  options:[
    {text:'I morgen jeg skal til lægen.', ok:false, mistakeType:'No inversion after time expression', why:'"I morgen" fills position 1, so "jeg skal" pushes the finite verb into 3rd position — V2 is broken.'},
    {text:'I morgen skal jeg til lægen.', ok:true, why:'"I morgen" (1) + "skal" (2) + "jeg" (3). The verb keeps seat 2, the subject steps back. Perfect inversion.'},
    {text:'I morgen til lægen skal jeg.', ok:false, mistakeType:'Two elements before the verb', why:'Both the time phrase AND the place phrase stand before the verb — only ONE element may fill position 1.'}
  ],
  explanation:'A fronted time expression triggers inversion: the finite verb stays in position 2, so the subject must move behind it. You chose correctly only if "skal" was the 2nd element.',
  trick:'Time first? Swap! Verb is glued to seat 2.',
  decon:{type:'main', cells:['I morgen','skal','jeg','—','til lægen']},
  hints:['Is this a main clause or a subordinate clause? (No connector like fordi/at → main clause.)',
    'What fills position 1? "I morgen" — the whole time expression is ONE element.',
    'Find the finite verb: "skal". Where must it stand in a main clause?',
    'Skeleton: [I morgen] [VERB] [subject] [rest].',
    'Answer: "I morgen skal jeg til lægen" — verb in seat 2, subject in seat 3.'] },

{ id:'g2', type:'mc', difficulty:'Easy', concept:'adv-main', extraConcepts:['tense-present'], tag:'Place the adverb',
  prompt:'Where does "ikke" belong? — "Han kommer til festen."',
  options:[
    {text:'Han ikke kommer til festen.', ok:false, mistakeType:'Subordinate order in main clause', why:'"ikke" before the finite verb is the subordinate-clause pattern. This is a main clause.'},
    {text:'Han kommer ikke til festen.', ok:true, why:'Main clause: subject + verb + ADVERB. "ikke" parks right behind the finite verb "kommer".'},
    {text:'Han kommer til festen ikke.', ok:false, mistakeType:'Adverb at sentence end', why:'Danish central adverbs do not trail at the end like English "…not" sometimes does in poetry. Fixed spot: after the finite verb.'}
  ],
  explanation:'In main clauses the central adverb (ikke, altid, aldrig, tit) stands immediately after the finite verb: "Han kommer ikke…".',
  trick:'Main clause skeleton: Subject + Verb + Adverb.',
  decon:{type:'main', cells:['Han','kommer','—','ikke','til festen']},
  hints:['Main clause or subordinate clause? There is no connector — main clause.',
    'Position 1 is the subject "Han".',
    'The finite verb is "kommer".',
    'Skeleton: Han + kommer + [ADVERB] + rest.',
    'Answer: "Han kommer ikke til festen."'] },

{ id:'g3', type:'order', difficulty:'Medium', concept:'inv-time', extraConcepts:['v2-main'], tag:'Build the sentence',
  prompt:'Build a correct sentence starting with "Om mandagen":',
  words:['Om mandagen','spiller','jeg','fodbold','med mine kolleger'],
  answer:'Om mandagen spiller jeg fodbold med mine kolleger',
  wrongWhy:'After the fronted time expression "Om mandagen", the finite verb "spiller" must come immediately (position 2), then the subject "jeg", then the rest.',
  explanation:'"Om mandagen" (position 1) → "spiller" (position 2) → "jeg" (position 3) → "fodbold med mine kolleger" (rest). Inversion is mandatory because the sentence does not start with the subject.',
  trick:'Front it — flip it.',
  decon:{type:'main', cells:['Om mandagen','spiller','jeg','—','fodbold med mine kolleger']},
  hints:['Main clause (no connector). It must obey V2.',
    'Position 1 is given: "Om mandagen".',
    'The finite verb is "spiller" — it must be the next element.',
    'Skeleton: Om mandagen + spiller + jeg + rest.',
    'Answer: "Om mandagen spiller jeg fodbold med mine kolleger."'] },

{ id:'g4', type:'mc', difficulty:'Medium', concept:'sav-conn', extraConcepts:['adv-sub'], tag:'Subordinate clause',
  prompt:'Complete correctly: "Jeg bliver hjemme i dag, fordi …"',
  options:[
    {text:'… jeg har ikke det godt.', ok:false, mistakeType:'Main-clause order after fordi', why:'"har ikke" is main-clause order. After fordi the adverb must move IN FRONT of the verb.'},
    {text:'… jeg ikke har det godt.', ok:true, why:'fordi + jeg (S) + ikke (A) + har (V). Textbook SAV.'},
    {text:'… har jeg ikke det godt.', ok:false, mistakeType:'Inversion inside subordinate clause', why:'No inversion after a connector — the subject must come directly after "fordi".'}
  ],
  explanation:'"fordi" starts a subordinate clause, and there the order is Subject + Adverb + Verb: "fordi jeg ikke har det godt".',
  trick:'In the sub, the adverb SUBmarines in front of the verb.',
  decon:{type:'sub', cells:['fordi','jeg','ikke','har','det godt']},
  hints:['"fordi" is a connector → this is a subordinate clause.',
    'After the connector, the subject "jeg" comes first — no inversion allowed.',
    'The finite verb is "har".',
    'Skeleton: fordi + jeg + ikke + har + rest.',
    'Answer: "… fordi jeg ikke har det godt."'] },

{ id:'g5', type:'mc', difficulty:'Hard', concept:'sav-conn', extraConcepts:['inv-time'], tag:'Identify the mistake',
  prompt:'Find the mistake: "Hvis det regner ikke, cykler jeg på arbejde."',
  options:[
    {text:'"cykler jeg" is wrong — it should be "jeg cykler".', ok:false, mistakeType:'Missed inversion rule', why:'"cykler jeg" is actually CORRECT: the fronted hvis-clause fills position 1, so the main clause must invert.'},
    {text:'"regner ikke" is wrong — it should be "ikke regner".', ok:true, why:'Inside the hvis-clause SAV applies: "Hvis det IKKE regner". The main clause "cykler jeg" was already correct.'},
    {text:'The sentence is completely correct.', ok:false, mistakeType:'Missed SAV violation', why:'"Hvis det regner ikke" uses main-clause order inside a subordinate clause — that is the error.'}
  ],
  explanation:'Two rules meet: inside the hvis-clause the adverb goes BEFORE the verb ("det ikke regner"), and after the comma the main clause inverts ("cykler jeg"). Only the first half was broken.',
  trick:'Check each half separately: SAV before the comma, inversion after it.',
  decon:{type:'sub', cells:['Hvis','det','ikke','regner','→ cykler jeg på arbejde']},
  hints:['The sentence has TWO clauses: a hvis-clause and a main clause. Check them one at a time.',
    'The connector is "hvis" — what word-order pattern does it demand?',
    'Finite verbs: "regner" (sub) and "cykler" (main). Where must "ikke" stand relative to "regner"?',
    'Skeleton: Hvis + det + ikke + regner, + VERB + subject…',
    'Answer: the error is "regner ikke" → "Hvis det ikke regner, cykler jeg på arbejde."'] },

{ id:'g6', type:'mc', difficulty:'Medium', concept:'inv-place', extraConcepts:['v2-main'], tag:'Repair the sentence',
  prompt:'Repair: "I København man kan cykle overalt."',
  options:[
    {text:'I København kan man cykle overalt.', ok:true, why:'Place expression (1) + finite verb "kan" (2) + subject "man" (3). Inversion repaired.'},
    {text:'I København man cykle kan overalt.', ok:false, mistakeType:'Verb cluster broken', why:'"kan" and "cykle" are now in the wrong order AND the verb is still not in position 2.'},
    {text:'Man i København kan cykle overalt.', ok:false, mistakeType:'Element squeezed before verb', why:'"Man i København" jams two elements before the verb. Either start with "Man kan…" or "I København kan man…".'}
  ],
  explanation:'A fronted place expression works exactly like a time expression: it occupies position 1, so the verb must follow immediately — "I København kan man cykle overalt".',
  trick:'TIME or PLACE first? SWAP!',
  decon:{type:'main', cells:['I København','kan','man','—','cykle overalt']},
  hints:['Main clause — no connector in sight.',
    'Position 1: the place expression "I København".',
    'The finite verb is "kan" (not "cykle" — "cykle" is the infinitive).',
    'Skeleton: I København + kan + man + cykle overalt.',
    'Answer: "I København kan man cykle overalt."'] },

{ id:'g7', type:'mc', difficulty:'Easy', concept:'modal', extraConcepts:['adv-main'], tag:'Modal verbs',
  prompt:'Which sentence places "ikke" correctly?',
  options:[
    {text:'Jeg kan ikke komme i morgen.', ok:true, why:'"kan" is the finite verb; "ikke" parks right after it, before the infinitive "komme".'},
    {text:'Jeg kan komme ikke i morgen.', ok:false, mistakeType:'Adverb after infinitive', why:'"ikke" cannot trail behind the infinitive — it belongs between the two verbs.'},
    {text:'Jeg ikke kan komme i morgen.', ok:false, mistakeType:'Subordinate order in main clause', why:'Adverb before the finite verb is SAV — only correct after fordi/at/hvis/når/selvom.'}
  ],
  explanation:'With modal verbs the chain is: modal + ikke + infinitive. "Jeg kan ikke komme."',
  trick:'Two verbs? ikke goes between them.',
  decon:{type:'main', cells:['Jeg','kan','—','ikke','komme i morgen']},
  hints:['Main clause or subordinate? No connector → main clause.',
    'Position 1 is the subject "Jeg".',
    'There are two verbs: "kan" (finite) and "komme" (infinitive). The adverb shadows the FINITE one.',
    'Skeleton: Jeg + kan + ikke + komme + rest.',
    'Answer: "Jeg kan ikke komme i morgen."'] },

{ id:'g8', type:'order', difficulty:'Medium', concept:'sav-conn', extraConcepts:['adv-sub'], tag:'Build the clause',
  prompt:'Build the subordinate clause: "Han kommer til mødet, …"',
  words:['selvom','han','aldrig','har','tid'],
  answer:'selvom han aldrig har tid',
  wrongWhy:'After "selvom": subject first ("han"), then the adverb ("aldrig"), then the finite verb ("har"). No inversion, and the adverb must stand before the verb.',
  explanation:'"selvom" is a connector, so SAV applies: selvom + han + aldrig + har + tid.',
  trick:'FAHNS words (fordi, at, hvis, når, selvom) → adverb dives in front of the verb.',
  decon:{type:'sub', cells:['selvom','han','aldrig','har','tid']},
  hints:['"selvom" is a connector → subordinate clause.',
    'The subject "han" must come directly after the connector.',
    'The finite verb is "har".',
    'Skeleton: selvom + han + aldrig + har + tid.',
    'Answer: "selvom han aldrig har tid".'] },

{ id:'g9', type:'mc', difficulty:'Medium', concept:'adv-sub', extraConcepts:['sav-conn'], tag:'at-clauses count too',
  prompt:'Choose the correct sentence:',
  options:[
    {text:'Hun siger, at hun kan ikke komme på fredag.', ok:false, mistakeType:'Main-clause order after at', why:'Inside an at-clause the adverb must move before the verb: "at hun ikke kan komme".'},
    {text:'Hun siger, at hun ikke kan komme på fredag.', ok:true, why:'at + hun + ikke + kan: perfect SAV inside the at-clause.'},
    {text:'Hun siger, at ikke hun kan komme på fredag.', ok:false, mistakeType:'Adverb before subject', why:'The subject comes straight after "at" — the adverb cannot jump in front of it.'}
  ],
  explanation:'"at" is a connector exactly like fordi — many learners forget this. The clause it starts uses SAV: "at hun ikke kan komme".',
  trick:'"at" is a FAHNS word — quiet but it still flips the order.',
  decon:{type:'sub', cells:['at','hun','ikke','kan','komme på fredag']},
  hints:['Look after the comma: "at" starts a subordinate clause.',
    'Directly after "at" comes the subject "hun".',
    'The finite verb is "kan".',
    'Skeleton: at + hun + ikke + kan + komme…',
    'Answer: "Hun siger, at hun ikke kan komme på fredag."'] },

{ id:'g10', type:'mc', difficulty:'Hard', concept:'inv-time', extraConcepts:['sav-conn'], tag:'Identify the mistake',
  prompt:'Find the mistake: "Når jeg kommer hjem fra arbejde, jeg laver aftensmad."',
  options:[
    {text:'"Når jeg kommer hjem" is wrong — it should be "Når kommer jeg hjem".', ok:false, mistakeType:'Inversion inside subordinate clause', why:'Inside a når-clause there is NO inversion — "Når jeg kommer hjem" is correct.'},
    {text:'"jeg laver" is wrong — it should be "laver jeg".', ok:true, why:'The fronted når-clause fills position 1 of the whole sentence, so the main clause must invert: "…, laver jeg aftensmad."'},
    {text:'The sentence is completely correct.', ok:false, mistakeType:'Missed inversion after fronted clause', why:'After a fronted subordinate clause the main clause MUST start with its verb — "jeg laver" breaks V2.'}
  ],
  explanation:'A fronted subordinate clause counts as position 1. The main clause after the comma therefore starts with the verb: "Når jeg kommer hjem, LAVER JEG aftensmad."',
  trick:'The comma is a springboard — the verb jumps over the subject.',
  decon:{type:'main', cells:['Når jeg kommer hjem','laver','jeg','—','aftensmad']},
  hints:['Two clauses again. The når-clause itself is fine — check the MAIN clause.',
    'What fills position 1 of the whole sentence? The entire når-clause.',
    'The main clause finite verb is "laver". Which element must it be?',
    'Skeleton: [Når jeg kommer hjem,] + laver + jeg + aftensmad.',
    'Answer: "…, laver jeg aftensmad" — the original "jeg laver" was the mistake.'] },

{ id:'g11', type:'mc', difficulty:'Medium', concept:'tense-perfect', extraConcepts:['adv-main'], tag:'Perfect tense',
  prompt:'Which sentence is correct?',
  options:[
    {text:'Jeg har aldrig været i Jylland.', ok:true, why:'"har" is the finite verb — "aldrig" follows it, before the participle "været".'},
    {text:'Jeg har været aldrig i Jylland.', ok:false, mistakeType:'Adverb after participle', why:'The adverb may not trail after the participle "været".'},
    {text:'Jeg aldrig har været i Jylland.', ok:false, mistakeType:'Subordinate order in main clause', why:'"aldrig" before "har" is the subordinate pattern — wrong in a main clause.'}
  ],
  explanation:'Perfect tense: subject + har/er + ADVERB + participle. "Jeg har aldrig været i Jylland."',
  trick:'The adverb stands in the shadow of har/er.',
  decon:{type:'main', cells:['Jeg','har','—','aldrig','været i Jylland']},
  hints:['Main clause, perfect tense (har + participle).',
    'Position 1: subject "Jeg".',
    'The FINITE verb is "har" (not "været").',
    'Skeleton: Jeg + har + aldrig + været…',
    'Answer: "Jeg har aldrig været i Jylland."'] },

{ id:'g12', type:'mc', difficulty:'Hard', concept:'sav-conn', extraConcepts:['modal'], tag:'Repair the sentence',
  prompt:'Repair: "Hun siger, at hun vil ikke arbejde i weekenden."',
  options:[
    {text:'Hun siger, at hun ikke vil arbejde i weekenden.', ok:true, why:'SAV restored: at + hun + ikke + vil (+ arbejde). The adverb stands before the modal.'},
    {text:'Hun siger, at vil hun ikke arbejde i weekenden.', ok:false, mistakeType:'Inversion inside subordinate clause', why:'The subject must come straight after "at" — no inversion.'},
    {text:'Hun siger, at hun vil arbejde ikke i weekenden.', ok:false, mistakeType:'Adverb after infinitive', why:'This pushes "ikke" even further from its spot — it belongs BEFORE the finite verb in an at-clause.'}
  ],
  explanation:'In subordinate clauses the adverb stands before the whole verb cluster: "at hun IKKE VIL arbejde". Main clause habit ("vil ikke") is the classic trap here.',
  trick:'Subordinate + modal: ikke first, THEN both verbs.',
  decon:{type:'sub', cells:['at','hun','ikke','vil','arbejde i weekenden']},
  hints:['"at" → subordinate clause → SAV.',
    'Subject "hun" follows the connector.',
    'The finite verb is the modal "vil". In SAV, does ikke come before or after it?',
    'Skeleton: at + hun + ikke + vil + arbejde…',
    'Answer: "…, at hun ikke vil arbejde i weekenden."'] },

{ id:'g13', type:'mc', difficulty:'Hard', concept:'inv-place', extraConcepts:['adv-main'], tag:'Two rules at once',
  prompt:'Which sentence is completely correct?',
  options:[
    {text:'Hjemme hos os vi spiser altid klokken 18.', ok:false, mistakeType:'No inversion after place expression', why:'"Hjemme hos os" fills position 1 — "vi spiser" leaves the verb in 3rd position.'},
    {text:'Hjemme hos os spiser vi altid klokken 18.', ok:true, why:'Place (1) + spiser (2) + vi (3) + altid (adverb after verb+subject) — both rules respected.'},
    {text:'Hjemme hos os spiser altid vi klokken 18.', ok:false, mistakeType:'Adverb before subject after inversion', why:'After inversion the order is verb + SUBJECT + adverb: "spiser vi altid", not "spiser altid vi".'}
  ],
  explanation:'With inversion, the subject squeezes between verb and adverb: "…spiser VI altid…". Place expression first, verb second, subject third, central adverb fourth.',
  trick:'Inverted skeleton: Position 1 + Verb + Subject + Adverb + rest.',
  decon:{type:'main', cells:['Hjemme hos os','spiser','vi','altid','klokken 18']},
  hints:['Main clause with a fronted PLACE expression.',
    'Position 1: "Hjemme hos os" (one element).',
    'Finite verb "spiser" takes position 2 — and where does the subject go now?',
    'Skeleton: Hjemme hos os + spiser + vi + altid + klokken 18.',
    'Answer: "Hjemme hos os spiser vi altid klokken 18."'] },

{ id:'g14', type:'mc', difficulty:'Medium', concept:'v2-main', extraConcepts:['inv-time','tense-past'], tag:'derfor triggers inversion',
  prompt:'Complete: "Bussen var aflyst. Derfor ___ for sent på arbejde."',
  options:[
    {text:'jeg kom', ok:false, mistakeType:'No inversion after derfor', why:'"Derfor" fills position 1, so the verb must come before the subject.'},
    {text:'kom jeg', ok:true, why:'"Derfor" (1) + "kom" (2) + "jeg" (3). Adverbials like derfor/desuden/alligevel trigger inversion exactly like time expressions.'},
    {text:'jeg kommer', ok:false, mistakeType:'No inversion + wrong tense', why:'Besides the missing inversion, the story is in the past — "kommer" breaks the tense.'}
  ],
  explanation:'Connector-adverbs like derfor, desuden, alligevel and bagefter occupy position 1 and force inversion: "Derfor kom jeg for sent."',
  trick:'derfor/desuden/alligevel = position 1 words → verb next.',
  decon:{type:'main', cells:['Derfor','kom','jeg','—','for sent på arbejde']},
  hints:['"Derfor" starts a MAIN clause (it is an adverb, not a connector like fordi).',
    '"Derfor" itself occupies position 1.',
    'The finite verb must be the very next element. The text is past tense.',
    'Skeleton: Derfor + kom + jeg + rest.',
    'Answer: "Derfor kom jeg for sent på arbejde."'] },

{ id:'g15', type:'mc', difficulty:'Hard', concept:'sav-conn', extraConcepts:['inv-time','adv-sub'], tag:'Final boss: repair both clauses',
  prompt:'Repair BOTH errors: "Om vinteren jeg cykler aldrig, fordi det er ikke sikkert."',
  options:[
    {text:'Om vinteren cykler jeg aldrig, fordi det ikke er sikkert.', ok:true, why:'Main clause inverted ("cykler jeg aldrig") AND SAV restored in the fordi-clause ("det ikke er"). Both errors fixed.'},
    {text:'Om vinteren cykler jeg aldrig, fordi det er ikke sikkert.', ok:false, mistakeType:'SAV violation remains', why:'The inversion is fixed, but "er ikke" is still main-clause order inside the fordi-clause.'},
    {text:'Om vinteren jeg cykler aldrig, fordi det ikke er sikkert.', ok:false, mistakeType:'Inversion failure remains', why:'The fordi-clause is fixed, but "jeg cykler" still leaves the main-clause verb in 3rd position.'}
  ],
  explanation:'Error 1: fronted "Om vinteren" demands inversion → "cykler jeg aldrig". Error 2: after fordi, SAV → "det ikke er sikkert". The exam loves sentences that hide two word-order rules at once.',
  trick:'One sentence, two checks: V2 in the main clause, SAV after the connector.',
  decon:{type:'sub', cells:['fordi','det','ikke','er','sikkert']},
  hints:['There are TWO clauses and TWO errors — find them one at a time.',
    'Main clause: "Om vinteren" is position 1. What must come second?',
    'Subordinate clause: "fordi" demands which pattern for "ikke" and "er"?',
    'Skeletons: Om vinteren + cykler + jeg + aldrig | fordi + det + ikke + er + sikkert.',
    'Answer: "Om vinteren cykler jeg aldrig, fordi det ikke er sikkert."'] }
];


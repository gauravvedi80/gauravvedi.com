/* Dansk Coach — data/06-strategy.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   DATA — EXAM STRATEGY
   ===================================================================== */
const STRATEGY = [
{ id:'st-read', icon:'book-open', part:'Læsning', title:'The reading test as a whole',
  points:['You have 50 minutes for ALL reading tasks — no dictionary, no aids.','Do the task types you are strongest in first; bank the safe points.','Never leave a gap blank — an educated guess costs nothing.','Keep 5 minutes at the end to revisit flagged questions.'],
  trap:'Trap: spending 20 minutes perfecting Opgave 1 and rushing the rest. Set a time budget per task BEFORE you start.' },
{ id:'st-cloze', icon:'text-cursor-input', part:'Læsning · Opgave 1', title:'Cloze — missing words',
  points:['Read the whole sentence before choosing — the right word must fit grammar AND meaning.','Test collocations: holde fest, tage noget med, senest den 15.','Check small words: pr., for, til, om change meaning completely.','Read your final text once — does it sound like Danish?'],
  trap:'Trap: choosing a word that fits the meaning but breaks the grammar (or the reverse). The answer must do both jobs.' },
{ id:'st-2a', icon:'messages-square', part:'Læsning · Opgave 2A/2B', title:'Chat — find the missing replies',
  points:['Read the WHOLE chat first to understand the situation.','The right reply matches BOTH the message before it and the message after it.','A reply with a question must get an answer in the next message — check!','Three options are never used. Eliminate replies that contradict the flow.'],
  trap:'Trap: keyword overlap. A wrong option often repeats words from the chat (søn, lørdag, caféen) without fitting the dialogue. Match the FUNCTION, not the words.' },
{ id:'st-o3', icon:'between-horizontal-start', part:'Læsning · Opgave 3', title:'Insert the missing sentence',
  points:['Read the full paragraph first — the gap sentence must fit the whole flow.','Follow pronouns: det/den/de/han must point back at something real.','Signal words steer: a sentence starting with "Men" must contradict; "Derfor" must follow a cause.','Read the paragraph again WITH your chosen sentence — does it flow?'],
  trap:'Trap: an option that is true and sounds nice but breaks the logic of the NEXT sentence. Always read past the gap before deciding.' },
{ id:'st-o4', icon:'users', part:'Læsning · Opgave 4', title:'Match persons with questions',
  points:['Read all questions FIRST, then read the texts with the questions in mind.','Underline who does/thinks what — small margin notes save re-reading.','Watch negations and contrasts: "selvom", "men", "til gengæld" flip the meaning.','Answer the easy matches first; re-read only for the hard ones.'],
  trap:'Trap: two persons mention the same topic, but only one MATCHES the question. (One sorts waste easily, the other finds it hard.) Read the verbs and opinions, not just the topic words.' },
{ id:'st-w1', icon:'mail-warning', part:'Skrivning · Opgave 1', title:'Halvformel henvendelse',
  points:['Underline every bullet in the task — each one must be covered.','Spend 5 minutes planning: one line per bullet.','Polite, neutral tone: no anger, no slang, no smileys.','Use connectors and vary your openers (Derfor…, Desuden…).','Save 5 minutes to check V2, fordi-clauses and ikke-placement.','Length 100–200 words.'],
  trap:'Trap: writing beautifully about the problem but forgetting bullet 4 (what you want them to DO). Unanswered bullets are the #1 reason for failing.' },
{ id:'st-w2', icon:'mail', part:'Skrivning · Opgave 2', title:'E-mail — answer everything',
  points:['Count the question marks in the mail you received — every question needs an answer.','Match the register: warm to a friend, professional to a boss.','State things concretely: times, days, names, places.','Minimum 90 words — greeting + answers + closing gets you there.','End by giving something back: a question, an invitation, a wish.'],
  trap:'Trap: the questions are hidden inside a chatty text. Underline them FIRST, answer them in order, tick them off.' },
{ id:'st-m1a', icon:'presentation', part:'Mundtlig · Opgave 1', title:'The presentation (1–2 min)',
  points:['Prepare TWO topics — you draw one by lot.','Mindmap with keywords ONLY — full sentences are not allowed.','Structure: intro → branches one by one (fact + example + opinion) → short conclusion.','Practise out loud with a timer until 1-2 minutes feels natural.','Forgot a word? Describe it or simplify. Never stop talking.'],
  trap:'Trap: memorising a script. It collapses at the first follow-up question, and examiners hear recitation immediately. Train speaking from keywords.' },
{ id:'st-m1b', icon:'message-circle-question', part:'Mundtlig · Opgave 1', title:'Follow-up questions (3–4 min)',
  points:['Expect: "Vil du fortælle lidt mere om…?", "Kan du give nogen eksempler på…?", "Hvorfor?"','Prepare one example + one opinion for EVERY branch of your mindmap.','Answer with PREP: Point, Reason, Example, Personal link.','Use thinking-time phrases instead of silence.'],
  trap:'Trap: the examiner asks about the branch you said least about. Prepare the boring branches too.' },
{ id:'st-m2a', icon:'users-round', part:'Mundtlig · Opgave 2', title:'Del 1 — the pair conversation (ca. 4 min)',
  points:['Express a preference about ALL four pictures — the examiner checks this.','Ask your partner real questions and react to the answers.','Disagree politely: "Det forstår jeg godt, men jeg synes…"','Keep balance: do not dominate, do not disappear.'],
  trap:'Trap: turning the conversation into two monologues. The task tests INTERACTION — ask, answer, react.' },
{ id:'st-m2b', icon:'user-round', part:'Mundtlig · Opgave 2', title:'Del 2 — individual questions (ca. 3 min)',
  points:['Questions are about YOUR preferences and experiences — personal answers win.','Answer directly first, then expand with reasons and examples.','Compare with your home country — examiners love it and you can prepare it.','Use hooks to steer toward topics you know well.'],
  trap:'Trap: one-sentence answers. "Ja, det kan jeg godt lide" shows nothing. Always add fordi + for eksempel.' },
{ id:'st-gram', icon:'spell-check', part:'All parts', title:'The 60-second grammar check',
  points:['Find every sentence start: time/place first? → verb second.','Find every fordi/at/hvis/når/selvom → ikke BEFORE the verb.','Find every ikke/altid/aldrig/tit → after the verb in main clauses.','Two verbs? Adverb between them (kan ikke komme).','Check this in writing — and hear it in your head when speaking.'],
  trap:'Trap: checking only the sentences you are unsure about. Errors hide in the sentences that "feel" right — check them ALL with the V2/SAV scan.' },
{ id:'st-day', icon:'calendar-check', part:'Test day', title:'Time, nerves and energy',
  points:['Reading 50 min: wear a watch; budget time per task.','Writing: plan 5 min, write, keep 5 min to check word order.','Oral: breathe, smile, and treat the examiner like a curious neighbour.','A mistake is not a disaster — correcting yourself ("…undskyld, jeg mener…") shows language awareness and is completely fine.'],
  trap:'Trap: cramming the night before. Sleep beats last-minute grammar — a rested brain hears its own word-order errors.' }
];


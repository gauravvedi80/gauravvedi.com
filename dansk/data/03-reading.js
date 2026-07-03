/* Dansk Coach — data/03-reading.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   DATA — READING SIMULATOR (authentic SIRI Modul 3.3 task formats)
   ===================================================================== */
const READING = {

strategy: {
  points:[
    {icon:'list-checks', t:'Read the questions first', d:'Know what you are hunting before you read. In Opgave 4, read all seven questions before touching the texts.'},
    {icon:'search', t:'Scan for keywords', d:'Names, numbers, dates, weekdays, prices and places jump off the page. Match keywords in the question to keywords in the text.'},
    {icon:'ban', t:'Do not translate every word', d:'You have 50 minutes for the whole reading test. Understanding the MESSAGE beats understanding every word.'},
    {icon:'scissors', t:'Eliminate impossible answers', d:'In every matching task some options contradict the text. Cross them out first — choosing between 2 is easier than choosing between 4.'},
    {icon:'link-2', t:'Follow the pronouns', d:'det, den, han, hun, de, dem point BACKWARDS to something already mentioned. If "de" has nobody to point to, the sentence does not fit the gap.'},
    {icon:'signpost', t:'Notice signal words', d:'men, derfor, fordi, selvom, alligevel, desuden, til gengæld, på den anden side steer the logic. A sentence starting with "Men" must contradict what came before.'}
  ]
},

cloze: {
  id:'cloze', concept:'r-keywords', opgave:'Opgave 1',
  title:'Sommerfest i boligforeningen',
  instruction:'Læs teksten. Der mangler seks ord. Vælg for hvert hul det ord, der passer bedst, blandt de 12 ord i ordbanken.',
  parts:[
    'Kære beboere. Lørdag den 21. juni ', {g:0}, ' vi sommerfest i gården. Vi ', {g:1},
    ' klokken 14 med kaffe og kage. Bagefter er der spil og musik ', {g:2},
    ' børn og voksne. Foreningen sørger for grillmad, men I skal selv ', {g:3},
    ' drikkevarer med. Det koster 30 kroner ', {g:4},
    ' person at være med. I kan tilmelde jer ', {g:5},
    ' den 15. juni hos Jonas i nr. 8. Vi glæder os til at se jer!'
  ],
  bank:['begynder','for','går','holder','købe','med','om','pr.','senest','slutter','tage','før'],
  gaps:[
    { correct:'holder', why:'Danish says "at holde fest" — to hold a party.' },
    { correct:'begynder', why:'Klokken 14 is when the party STARTS — "bagefter" describes what happens next, so it cannot be "slutter" (ends).' },
    { correct:'for', why:'"musik FOR børn og voksne" — for + the people something is intended for.' },
    { correct:'tage', why:'The fixed phrase is "at tage noget MED" (bring along).' },
    { correct:'pr.', why:'Prices per person use "pr.": "30 kroner pr. person".' },
    { correct:'senest', why:'Deadlines use "senest" (= no later than): "tilmelde jer senest den 15. juni".' }
  ]
},

chats:[
{ id:'chat1', concept:'r-2a', opgave:'Opgave 2A',
  title:'Sofia skriver til sin kollega Omar',
  situation:'Situation: Sofia skriver til sin kollega Omar.',
  instruction:'Læs Sofias og Omars chat. Der er 3 beskeder fra Sofia. Find de svar fra Omar, der passer (A–F). Der er tre svar, du ikke skal bruge. Se eksemplet (0).',
  personX:'Sofia', personY:'Omar',
  example:{ x:'Hej Omar! Har du tid til at hjælpe mig med noget?', reply:'Hej Sofia! Ja, selvfølgelig. Hvad handler det om?', letter:'Z' },
  turns:[
    { x:'Min søn er blevet syg, så jeg kan ikke tage min vagt på lørdag. Kan du måske tage den?', correct:'D',
      why:'D reacts to the bad news AND asks "Hvornår er vagten?" — and Sofia answers exactly that ("fra klokken 10 til 18") in her next message.' },
    { x:'Den er fra klokken 10 til 18 i caféen.', correct:'B',
      why:'B accepts ("Det passer fint") and proposes a swap — which Sofia agrees to next ("Ja, det kan jeg sagtens"). The dialogue only flows if B sits here.' },
    { x:'Ja, det kan jeg sagtens. Tusind tak for hjælpen, Omar!', correct:'F',
      why:'Sofia says thank you, so the fitting reply is "Det var så lidt" + a kind wish for her sick son.' }
  ],
  options:[
    { letter:'A', text:'Nej desværre, jeg holder ferie i hele næste måned.', distractorWhy:'Looks tempting for gap 1, but the rest of the chat shows Omar DOES take the shift — a refusal would end the conversation.' },
    { letter:'B', text:'Det passer fint. Men så vil jeg gerne bytte, så du tager min vagt på onsdag aften. Er det okay?' },
    { letter:'C', text:'Ja, caféen er lukket på søndag, så vi skal ikke arbejde.', distractorWhy:'Talks about Sunday and closing — nobody in the chat asks about that. Keyword overlap ("caféen") is the trap.' },
    { letter:'D', text:'Det var da ærgerligt. Jeg skal lige tjekke min kalender først. Hvornår er vagten?' },
    { letter:'E', text:'Min søn skal også til fodbold på lørdag.', distractorWhy:'Repeats keywords ("søn", "lørdag") but answers no question and fits no gap — a classic keyword trap.' },
    { letter:'F', text:'Det var så lidt. Jeg håber, din søn hurtigt får det bedre.' }
  ]
},
{ id:'chat2', concept:'r-2a', opgave:'Opgave 2A',
  title:'Ali skriver til sin nabo Karen',
  situation:'Situation: Ali skriver til sin nabo Karen.',
  instruction:'Læs Alis og Karens chat. Der er 3 beskeder fra Ali. Find de svar fra Karen, der passer (A–F). Der er tre svar, du ikke skal bruge. Se eksemplet (0).',
  personX:'Ali', personY:'Karen',
  example:{ x:'Hej Karen! Jeg venter på en vigtig pakke i morgen, men jeg er på arbejde hele dagen.', reply:'Hej Ali! Det er ikke noget problem. Skal jeg tage imod pakken for dig?', letter:'Z' },
  turns:[
    { x:'Ja tak, hvis det ikke er for meget besvær? Posten kommer normalt mellem klokken 10 og 12.', correct:'D',
      why:'Ali mentions the delivery window; D confirms availability ("Jeg arbejder hjemme i morgen, så jeg er der hele dagen") — a direct, logical answer.' },
    { x:'Tusind tak! Hvad kan jeg gøre for at sige tak for hjælpen?', correct:'F',
      why:'Ali offers to return the favour; F politely declines but suggests watering the flowers in July — which Ali then accepts ("Det er en aftale!").' },
    { x:'Det er en aftale! Hvornår rejser du på ferie?', correct:'A',
      why:'Ali asks WHEN — A answers with a time ("Den første uge i juli") and practical details about the key.' }
  ],
  options:[
    { letter:'A', text:'Den første uge i juli. Jeg lægger en nøgle i din postkasse, inden jeg rejser.' },
    { letter:'B', text:'Nej, jeg har ikke bestilt nogen pakke.', distractorWhy:'Karen is not the one expecting a parcel — this confuses the two roles in the chat.' },
    { letter:'C', text:'Posten kommer aldrig her i området.', distractorWhy:'Contradicts the whole situation: Ali clearly expects a delivery between 10 and 12.' },
    { letter:'D', text:'Det er helt fint. Jeg arbejder hjemme i morgen, så jeg er der hele dagen.' },
    { letter:'E', text:'Tak for hjælpen med flytningen i søndags.', distractorWhy:'Mentions a past favour that never appears in this conversation — no gap asks about it.' },
    { letter:'F', text:'Det behøver du ikke! Men du må gerne vande mine blomster, når jeg er på ferie i juli.' }
  ]
}
],

o3: {
  id:'o3', concept:'r-3', opgave:'Opgave 3',
  title:'Claras nye hverdag',
  instruction:'Læs teksten "Claras nye hverdag". Der er fem afsnit. I hvert afsnit mangler der en sætning. Under hvert afsnit står der fire sætninger. Vælg den sætning, der passer i afsnittet. Der er tre sætninger i hvert afsnit, du ikke skal bruge.',
  paragraphs:[
  { pre:'Clara er 34 år og arbejder som social- og sundhedshjælper på et plejehjem i Aarhus. Hun har altid haft travlt på sit arbejde, og for cirka et år siden begyndte hun at føle sig træt og stresset. Hun sov dårligt om natten, og om morgenen havde hun tit hovedpine. Samtidig blev hun oftere forkølet og måtte melde sig syg flere gange på en måned. ',
    post:' For hun ville gerne have mere energi i hverdagen, være mindre syg og få det bedre med sig selv.',
    options:[
      {text:'Derfor besluttede hun at ændre sine vaner.', ok:true, why:'"Derfor" points back to the problems (tired, stressed, often ill), and "ændre sine vaner" is exactly what the following sentence ("For hun ville gerne have mere energi…") explains the reason for. Logic flows both ways.'},
      {text:'Derfor sagde hun sit job op og flyttede hjem til sine forældre.', ok:false, why:'Too drastic — the rest of the text shows Clara still works at the plejehjem (her colleagues notice her energy in paragraph 5).'},
      {text:'Men hun var aldrig træt om morgenen.', ok:false, why:'Directly contradicts the paragraph: she sleeps badly and has headaches in the morning.'},
      {text:'Hun begyndte derfor at arbejde endnu flere timer.', ok:false, why:'Working MORE does not match the next sentence, which says she wanted more energy and better health.'}
    ]},
  { pre:'Det første, Clara ændrede, var sin kost. Før købte hun ofte fastfood på vej hjem fra arbejde, fordi hun var alt for træt til at lave mad. Nu planlægger hun ugens måltider i weekenden og handler stort ind om lørdagen, så der altid er friske grøntsager i køleskabet. ',
    post:' På den måde spiser de sundere, og samtidig sparer de penge, fordi de næsten aldrig smider mad ud.',
    options:[
      {text:'Hun bor alene og spiser for det meste helt alene.', ok:false, why:'The next sentence says "spiser DE sundere" — the pronoun "de" needs two people, so this option breaks the reference chain.'},
      {text:'Hendes kæreste Jonas hjælper også med at lave maden.', ok:true, why:'This introduces the second person that the pronoun "de" in the next sentence refers to. Without Jonas, "de" points at nobody.'},
      {text:'Derfor har hun ikke længere tid til at lave mad.', ok:false, why:'Illogical: the paragraph describes how she NOW plans and cooks — not that she stopped.'},
      {text:'Hun spiser stadig fastfood næsten hver aften.', ok:false, why:'Contradicts "Det første, Clara ændrede, var sin kost" and the healthy-eating conclusion.'}
    ]},
  { pre:'Clara begyndte også at dyrke motion. I starten var det rigtig svært at finde energien, og hun havde mest lyst til at blive liggende på sofaen efter en lang arbejdsdag. ',
    post:' Nu cykler hun til arbejde hver dag, og om onsdagen går hun til svømning sammen med sin kollega Pia. Hun kan mærke, at hun er blevet stærkere, og at hun ikke længere bliver så hurtigt forpustet.',
    options:[
      {text:'Derfor droppede hun helt at træne igen.', ok:false, why:'Contradicts the next sentence ("Nu cykler hun til arbejde hver dag").'},
      {text:'Hun har altid elsket at løbe maratonløb.', ok:false, why:'Contradicts "I starten var det rigtig svært" — someone who always ran marathons would not struggle to start.'},
      {text:'Men hun startede stille og roligt med korte gåture efter aftensmaden.', ok:true, why:'"Men" turns the struggle into action, and "stille og roligt" bridges perfectly from sofa to the daily cycling described next. The contrast word is the key signal.'},
      {text:'Pia synes ikke, at de skal svømme sammen.', ok:false, why:'Contradicts the text: Clara DOES swim with Pia every Wednesday.'}
    ]},
  { pre:'Claras søvn er også blevet meget bedre. Før lå hun tit vågen til langt ud på natten og kiggede på sin telefon. Nu lægger hun telefonen væk i stuen en time, før hun skal sove. ',
    post:' Det betyder, at hun nu sover syv-otte timer hver nat, og at hun vågner udhvilet og med mere energi om morgenen.',
    options:[
      {text:'Derfor ser hun film på telefonen, til hun falder i søvn.', ok:false, why:'Contradicts the previous sentence — the phone is in the living room.'},
      {text:'Hun drikker også en stor kop kaffe lige inden sengetid.', ok:false, why:'Coffee before bed works against better sleep — the logic of the paragraph collapses.'},
      {text:'Men hun sover stadig kun fire timer om natten.', ok:false, why:'Directly contradicts "sover syv-otte timer hver nat" in the next sentence.'},
      {text:'I stedet læser hun en bog eller hører rolig musik.', ok:true, why:'"I stedet" (instead) points back to the phone she put away and explains the calm routine that leads to 7-8 hours of sleep.'}
    ]},
  { pre:'I dag, et år senere, har Clara det meget bedre, og hun er næsten aldrig syg. Hendes kolleger på plejehjemmet har lagt mærke til, at hun har fået mere overskud i hverdagen, og flere af dem har spurgt, hvordan hun har gjort. ',
    post:' Clara synes, det er en rigtig god idé, for hun ved nu, at det er meget nemmere at holde sunde vaner, når man gør det sammen med andre.',
    options:[
      {text:'Derfor er hun begyndt at spise fastfood igen.', ok:false, why:'Contradicts the whole story of the text.'},
      {text:'Derfor har de spurgt, om hun vil være med til at starte et løbehold på arbejdspladsen.', ok:true, why:'"de" = the curious colleagues, and the running club is the "idé" Clara calls "en rigtig god idé" in the next sentence — both pronoun and logic fit.'},
      {text:'Men hun har ikke ændret noget i sit liv det sidste år.', ok:false, why:'Contradicts everything the text has described.'},
      {text:'Hendes chef synes, at hun skal holde op med at træne.', ok:false, why:'Does not fit: Clara would hardly call THAT "en rigtig god idé".'}
    ]}
  ],
  extra:{ q:'Hvad er tekstens hovedbudskab? (main idea — bonus comprehension question)', concept:'r-inference',
    options:[
      {text:'Man kan få mere energi og et bedre liv ved at ændre sine vaner lidt ad gangen.', ok:true, why:'The text follows exactly this arc: small changes (food, exercise, sleep) over a year → more energy, almost never ill.'},
      {text:'Man skal sige sit job op, hvis man er stresset.', ok:false, why:'Clara keeps her job the whole way through — the text never recommends quitting.'},
      {text:'Det er umuligt at ændre vaner, når man arbejder fuldtid.', ok:false, why:'The text proves the opposite.'},
      {text:'Sund mad er det eneste, der betyder noget for helbredet.', ok:false, why:'Food is only one of three changes — exercise and sleep get equal weight.'}
    ]}
},

o4: {
  id:'o4', concept:'r-4', opgave:'Opgave 4',
  title:'Tre personer fortæller om deres grønne vaner',
  instruction:'Læs de tre tekster, og læs spørgsmålene (1–7). Find den person, der passer til hvert spørgsmål. Sæt kryds ud for den person (A, B eller C), der passer. Se eksemplet (0).',
  persons:[
    { label:'A', name:'Marco', text:'Jeg cykler til arbejde hele året — også om vinteren, når det regner og sner. Mine kolleger synes, jeg er lidt skør, men jeg elsker den friske luft, og jeg sparer både penge og CO2. Derhjemme sorterer vi vores affald, og det går faktisk ret nemt, fordi kommunen har lavet et godt system med tydelige farver på spandene. Min kone vil gerne købe flere økologiske varer, men jeg synes ærligt talt, at de er alt for dyre, så vi køber dem kun, når de er på tilbud. Vi spiser kød flere gange om ugen, selvom min datter tit siger, at vi burde lade være. Måske har hun ret, men jeg har ikke ændret noget endnu. Til gengæld smider vi næsten aldrig mad ud.' },
    { label:'B', name:'Yuki', text:'For to år siden solgte min mand og jeg vores bil, og nu deler vi en delebil med tre andre familier her i kvarteret. Det fungerer rigtig godt, fordi vi mest har brug for bilen i weekenden. Jeg elsker at gå på loppemarked, og det meste af mit tøj og mange af vores møbler er købt brugt — det er billigere, og det er bedre for miljøet. Derhjemme spiser vi næsten kun grøntsager; kød får vi måske to gange om måneden. Mine venner siger, at jeg burde cykle noget mere, men om vinteren tager jeg altid bussen, for jeg fryser hurtigt. Og så må jeg ærligt indrømme, at jeg elsker lange, varme brusebade, selvom jeg godt ved, at man burde spare på vandet.' },
    { label:'C', name:'Amira', text:'Da jeg kom til Danmark, vidste jeg næsten ingenting om affaldssortering, og jeg synes stadig, det er svært at finde ud af, hvad der skal i hvilken spand — plast, metal, madaffald og alt det andet. Heldigvis hjælper mine børn mig. Det er faktisk dem, der har lært mig de fleste af mine grønne vaner, for de lærer en masse om miljøet i skolen. Nu slukker vi altid lyset, når vi går ud af et rum, vi tager korte brusebade, og vi lukker for vandet, mens vi børster tænder. Jeg køber tit økologisk mælk, selvom den koster lidt mere, fordi mine børn synes, det er vigtigt. Jeg har ikke kørekort, så jeg tager bussen til arbejde hver dag.' }
  ],
  example:{ q:'Hvem bruger en delebil?', answer:'B' },
  questions:[
    { q:'Hvem cykler til arbejde hele året?', answer:'A', why:'Marco: "Jeg cykler til arbejde hele året — også om vinteren". Trap: Yukis friends say she SHOULD cycle more, but she takes the bus in winter.' },
    { q:'Hvem køber tit brugte ting?', answer:'B', why:'Yuki: clothes and furniture from loppemarked. Nobody else mentions secondhand shopping.' },
    { q:'Hvem spiser næsten ikke kød?', answer:'B', why:'Yuki: "vi spiser næsten kun grøntsager; kød … to gange om måneden". Trap: Marcos daughter WANTS them to eat less meat, but they have not changed.' },
    { q:'Hvem synes, det er svært at sortere affald?', answer:'C', why:'Amira: "jeg synes stadig, det er svært at finde ud af, hvad der skal i hvilken spand". Trap: Marco mentions sorting but says it is EASY ("det går faktisk ret nemt").' },
    { q:'Hvem sparer på vandet?', answer:'C', why:'Amira: short showers and water off while brushing teeth. Trap: Yuki KNOWS one should save water but loves long hot showers.' },
    { q:'Hvem har lært grønne vaner af sine børn?', answer:'C', why:'Amira: "Det er faktisk dem, der har lært mig de fleste af mine grønne vaner". Trap: Marcos daughter gives advice, but he admits he has not changed anything.' },
    { q:'Hvem synes, at økologiske varer er for dyre?', answer:'A', why:'Marco: "jeg synes ærligt talt, at de er alt for dyre". Trap: Amira mentions the price too — but SHE buys organic milk anyway.' }
  ]
},

reflection:[
  { id:'qfirst', q:'Did you read the questions before reading the texts?' },
  { id:'scan', q:'Did you scan for keywords (names, numbers, days) instead of reading word for word?' },
  { id:'translate', q:'Did you catch yourself trying to translate every word?' },
  { id:'pronoun', q:'Did you check what the pronouns (det/den/de) pointed back to before choosing?' }
]
};


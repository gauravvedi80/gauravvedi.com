/* Dansk Coach — data/11-examsets.js
   Classic script (no modules): load order matters and is set in index.html.
   Top-level const/let are shared across files via the global lexical scope. */
/* =====================================================================
   PHASE 7 — EXAM SIMULATION DATA (3 complete mock exams)
   Formats mirror the official Gyldendal modultest papers (3A/3B/3C):
   reading 2A chat + skim + Opg.3 insertion + Opg.4, writing 2 tasks,
   oral emneopgave + samtale. Content is original.
   ===================================================================== */
const EXAMSETS = [
/* ------------------- EXAM 1 · Hverdag og helbred ------------------- */
{ id:'sim1', title:'Mock Exam 1 · Hverdag og helbred',
  reading:{
    chat:{ title:'Sara skriver til sin veninde Noor', situation:'Situation: Sara skriver til sin veninde Noor.',
      personX:'Sara', personY:'Noor',
      example:{ x:'Hej Noor! Jeg skal til lægen på fredag, og jeg er lidt nervøs.', reply:'Hej Sara! Det er helt naturligt. Vil du have selskab?' },
      turns:[
        { x:'Ja, det ville jeg meget gerne. Kan du tage med?', correct:'B',
          why:'B accepts and asks WHEN — which Sara answers next with the exact time.' },
        { x:'Klokken ti om formiddagen, hos Dr. Berg på Nørregade.', correct:'D',
          why:'D proposes meeting a little before the appointment — which Sara agrees to next ("klokken halv ti").' },
        { x:'Ja, lad os mødes klokken halv ti udenfor klinikken.', correct:'F',
          why:'F confirms the plan and reassures Sara — a natural, warm closing to the exchange.' }
      ],
      options:[
        { letter:'A', text:'Jeg kan desværre ikke, jeg arbejder hele fredagen.', distractorWhy:'Contradicts the rest of the chat, where Noor clearly does come along.' },
        { letter:'B', text:'Selvfølgelig kan jeg det. Hvornår er tiden?' },
        { letter:'C', text:'Min læge hedder også Dr. Berg.', distractorWhy:'Keyword trap ("Dr. Berg") — but nobody asks about Noors egen læge.' },
        { letter:'D', text:'Så mødes vi klokken halv ti udenfor, så vi har god tid sammen inden.' },
        { letter:'E', text:'Jeg tror, klinikken har lukket om fredagen.', distractorWhy:'Contradicts the appointment Sara has already been given for Friday at ten.' },
        { letter:'F', text:'Perfekt. Bare rolig, det skal nok gå godt — jeg er der klokken halv ti.' }
      ] },
    cloze:{
      title:'Influenzavaccination i Sundhedshuset',
      instruction:'Læs teksten. Der mangler seks ord. Vælg for hvert hul det ord, der passer bedst, blandt de 12 ord i ordbanken.',
      parts:[
        'Influenzavaccination i Sundhedshuset. Fra mandag den 10. november tilbyder vi gratis vaccination mod influenza til alle over 65 år og til borgere med kronisk sygdom. Du skal ikke bestille tid — mød bare op i åbningstiden. Vaccinationen foregår hver dag ', {g:0},
        ' klokken 9 til 15, undtagen i weekenden. Husk at ', {g:1},
        ' dit sundhedskort. Hvis du er forkølet eller har feber, bedes du ', {g:2},
        ' med at komme, til du er rask igen. Vaccinen virker først efter cirka to uger, så vent ikke ', {g:3},
        ' længe med at få den. Har du spørgsmål, kan du ringe til os ', {g:4},
        ' klokken 8 og 9 på telefon 44 20 15 30. Vi glæder os til at ', {g:5},
        ' jer!'
      ],
      bank:['fra','til','medbringe','glemme','vente','skynde','for','efter','mellem','om','se','høre'],
      gaps:[
        { correct:'fra', why:'The fixed time-range pattern is "fra klokken 9 til 15" (from 9 to 15). The gap needs the starting-point preposition "fra" because "til" already marks the end point later in the same phrase — Danish never doubles "til...til".' },
        { correct:'medbringe', why:'"Husk at medbringe dit sundhedskort" is the standard fixed collocation for bringing an ID/document to an appointment — notices always use "medbringe," not a plain verb like "tage" or "glemme."' },
        { correct:'vente', why:'The collocation is "vente med at komme" (wait before coming). The context (forkølet/feber) logically calls for staying away, i.e. waiting — not the opposite action.' },
        { correct:'for', why:'"vent ikke for længe" is the fixed pattern "for + adjective/adverb" meaning "too" (too long). Only "for" combines with "længe" this way in Danish — no other preposition fits this slot.' },
        { correct:'mellem', why:'"ringe mellem klokken 8 og 9" (call between 8 and 9) needs "mellem" to frame the two time points — "om" or "efter" cannot connect two clock times in this pattern.' },
        { correct:'se', why:'The fixed closing phrase in Danish notices is "Vi glæder os til at se jer!" (we look forward to seeing you) — used for an in-person visit to the clinic, matching the whole notice about showing up in person.' }
      ]
    },
    chat2:{
      title:'Yasmin skriver til sin veninde Freja', situation:'Situation: Yasmin skriver til sin veninde Freja.',
      personX:'Yasmin', personY:'Freja',
      example:{ x:'Hej Freja! Har du to minutter?', reply:'Hej Yasmin! Ja, hvad så?' },
      turns:[
        { x:'Hej Freja! Hvordan har du det i dag? Er du stadig syg?', correct:'C',
          why:'C answers the health question directly (still has a cough, but better) and adds the pharmacy errand, which Yasmin responds to next by asking WHEN the medicine is ready.' },
        { x:'Okay, hvornår er den klar til afhentning?', correct:'E',
          why:'E gives a specific time (klokken 16) — which Yasmin can then agree to and confirm she is on her way, closing the exchange naturally.' },
        { x:'Fint, så henter jeg den klokken 16 og kommer forbi med den bagefter.', correct:'A',
          why:'A thanks Yasmin and reminds her to also buy nogle citroner, which fits a caring-friend closing message and gives the exchange a natural, warm ending.' }
      ],
      options:[
        { letter:'A', text:'Tusind tak! Kan du også lige købe nogle citroner til mig, hvis apoteket ligger tæt på et supermarked?' },
        { letter:'B', text:'Nej, jeg har det faktisk værre i dag, jeg tror, jeg må ringe til lægen igen.', distractorWhy:'Contradicts the rest of the chat, where Freja is clearly getting better and only waiting for medicine at the apotek — a worse turn would not lead into picking up medicine.' },
        { letter:'C', text:'Jeg har det lidt bedre, men jeg hoster stadig. Kan du hente min medicin på apoteket?' },
        { letter:'D', text:'Ja, jeg har allerede hentet medicinen i morges.', distractorWhy:'Contradicts the next turn, where Yasmin still asks when the medicine will be ready — the errand cannot already be done.' },
        { letter:'E', text:'Den er klar klokken 16. Du skal bare vise dit sundhedskort.' },
        { letter:'F', text:'Apoteket har desværre lukket i denne uge på grund af ferie.', distractorWhy:'Contradicts the plan that follows, where Yasmin picks the medicine up later the same day — the apotek must be open.' }
      ]
    },
    skim:{ title:'Opslag: Sundhedsdag i Medborgerhuset',
      text:'Frivilligcentret inviterer til gratis sundhedsdag i Medborgerhuset søndag den 2. marts kl. 10–15. Du kan få målt dit blodtryk og blodsukker, tale med en kostvejleder og prøve et kort motionsprogram for begyndere. Klokken 11 og igen klokken 13 holder læge Anne Holst et foredrag om søvn og stress — det varer 45 minutter, og der er plads til 60 personer pr. gang. Billetter til foredraget hentes ved indgangen fra kl. 9.30 — først til mølle. Husk indendørssko, hvis du vil deltage i motionsprogrammet. Spørgsmål kan sendes til kontakt@frivilligcentret.dk.',
      questions:[
        { q:'Hvad koster sundhedsdagen?', options:[{text:'Den er gratis', ok:true, why:'"inviterer til gratis sundhedsdag".'},{text:'60 kr.', ok:false, why:'60 er antal pladser til foredraget.'},{text:'45 kr.', ok:false, why:'45 er foredragets længde i minutter.'}]},
        { q:'Hvornår holder lægen foredrag?', options:[{text:'Kl. 11 og kl. 13', ok:true, why:'"Klokken 11 og igen klokken 13".'},{text:'Kl. 9.30', ok:false, why:'9.30 er billetudlevering.'},{text:'Kl. 10–15', ok:false, why:'Det er hele dagens åbningstid.'}]},
        { q:'Hvad skal man huske til motionsprogrammet?', options:[{text:'Indendørssko', ok:true, why:'"Husk indendørssko, hvis du vil deltage…".'},{text:'Billet fra lægen', ok:false, why:'Billetter gælder foredraget og hentes ved indgangen.'},{text:'Madpakke', ok:false, why:'Mad nævnes ikke.'}]}
      ]},
    o3:{ title:'Noah og pauserne på arbejdet', paragraphs:[
      { pre:'Noah har arbejdet som lagermedarbejder i fem år, og i det sidste halve år har han følt sig mere og mere stresset. Han glemmer tit at holde pause, og om eftermiddagen får han ofte hovedpine og ondt i nakken. ',
        post:' Hun foreslog, at han begyndte at holde korte pauser hver time.',
        options:[
          {text:'Derfor talte han med sin kollega Ida om problemet.', ok:true, why:'"Derfor" points back to the stress/headaches, and talking to Ida sets up her suggestion in the next sentence about short breaks.'},
          {text:'Derfor bad han om at få flere opgaver.', ok:false, why:'More tasks would make the stress worse, not lead to a colleague suggesting breaks.'},
          {text:'Han har aldrig haft hovedpine på arbejdet.', ok:false, why:'Contradicts "får han ofte hovedpine".'},
          {text:'Ida arbejder slet ikke sammen med Noah.', ok:false, why:'Contradicts the next sentence, where "hun" (Ida) makes a suggestion directly to him.'}
        ]},
      { pre:'Noah var skeptisk i starten. Han syntes, at pauser ville gøre ham langsommere, og han var bange for, at chefen ville blive utilfreds. ',
        post:' Til hans overraskelse blev han faktisk hurtigere til at pakke varer efter pausen.',
        options:[
          {text:'Han prøvede alligevel at holde en femminutters pause hver time.', ok:true, why:'"Alligevel" flips his skepticism into action, and trying the break directly leads into the surprising result in the next sentence.'},
          {text:'Han droppede idéen med det samme.', ok:false, why:'If he dropped the idea, there would be no break to produce the surprising result afterward.'},
          {text:'Chefen forbød ham at holde pause.', ok:false, why:'Nothing in the text mentions the boss reacting yet — this jumps ahead illogically.'},
          {text:'Han blev fyret på grund af pauserne.', ok:false, why:'Contradicts the positive outcome described in the next sentence.'}
        ]},
      { pre:'Efter to uger kunne Noah mærke en stor forskel. Nakkesmerterne var næsten væk, og han var mindre træt, når han kom hjem. ',
        post:' Han opdagede, at en kort gåtur udenfor på lageret hjalp mere end bare at stå stille og kigge på sin telefon.',
        options:[
          {text:'Han begyndte derfor at eksperimentere med, hvad han lavede i pauserne.', ok:true, why:'This bridges the improvement to the next sentence, where he discovers that a short walk works better than standing still on the phone.'},
          {text:'Han holdt op med at holde pauser, fordi det ikke hjalp.', ok:false, why:'Contradicts "en stor forskel" and the improvements described.'},
          {text:'Nakkesmerterne blev meget værre.', ok:false, why:'Contradicts "Nakkesmerterne var næsten væk".'},
          {text:'Han flyttede til et andet lager.', ok:false, why:'Nothing supports a change of workplace; irrelevant to the pattern of the text.'}
        ]},
      { pre:'Noah fortalte sin chef, Birgitte, om de gode resultater. ',
        post:' Nu har alle på lageret ret til to femminutters gåpauser om dagen, og sygefraværet er faldet markant.',
        options:[
          {text:'Birgitte blev positivt overrasket og indførte samme ordning for hele holdet.', ok:true, why:'This explains why "alle på lageret" now has the same break rights in the next sentence — a direct cause and effect.'},
          {text:'Birgitte sagde, at pauser var spild af tid.', ok:false, why:'Contradicts the next sentence, where everyone gets official break rights.'},
          {text:'Birgitte fyrede Noah for at tale om det.', ok:false, why:'Contradicts the positive outcome for the whole team.'},
          {text:'Noah fortalte det aldrig til Birgitte.', ok:false, why:'Directly contradicts the pre-text: "Noah fortalte sin chef, Birgitte, om de gode resultater."'}
        ]},
      { pre:'I dag er Noah en af de medarbejdere, der er bedst til at huske sine pauser. Han hjælper endda nye kolleger med at komme i gang med gode vaner. ',
        post:' Noah siger selv, at de små pauser har givet ham langt mere energi — både på arbejdet og derhjemme.',
        options:[
          {text:'For nylig blev han valgt til lagerets arbejdsmiljørepræsentant.', ok:true, why:'Being chosen as workplace-environment representative is the natural culmination of his journey and fits right before his own concluding statement about the benefits.'},
          {text:'Han er holdt op med at tage pauser, fordi han har for travlt.', ok:false, why:'Contradicts "en af de medarbejdere, der er bedst til at huske sine pauser".'},
          {text:'Ingen af hans kolleger har lyttet til hans råd.', ok:false, why:'Contradicts "hjælper endda nye kolleger".'},
          {text:'Han overvejer at sige sit job op.', ok:false, why:'Contradicts the positive, energised tone of his own closing statement.'}
        ]}
    ] },
    o4:{
      title:'Tre personer fortæller om søvn og skærmtid om aftenen',
      instruction:'Læs de tre tekster, og læs spørgsmålene (1–7). Find den person, der passer til hvert spørgsmål. Se eksemplet (0).',
      persons:[
        { label:'A', name:'Malene', text:'Jeg går som regel i seng klokken 22.30, for jeg skal op klokken 6 hver morgen. De sidste par år har jeg haft en fast regel: Mobilen skal ligge i køkkenet om natten, ikke på natbordet. I stedet læser jeg altid tyve minutter i en bog, før jeg slukker lyset. Det fungerer godt, og jeg sover normalt hele natten uden at vågne. Der er dog perioder, hvor jeg har svært ved at falde i søvn, især når der er meget travlt på arbejdet — så ligger jeg og tænker på mine opgaver i stedet for at slappe af. Min mand har foreslået, at jeg prøver en meditations-app, men jeg har faktisk ikke fået downloadet den endnu.' },
        { label:'B', name:'Jonas', text:'Jeg ved godt, at jeg burde lægge mobilen fra mig om aftenen, men det er svært. Jeg ligger tit og scroller på de sociale medier i over en time, efter jeg er kommet i seng, og bagefter ser jeg som regel en episode mere af en serie, selvom jeg havde lovet mig selv kun én. Klokken bliver ofte over midnat, før lyset går ud, og jeg vågner meget træt. Min kæreste bliver frustreret over det og siger, at det stærke skærmlys holder mig vågen. Jeg har prøvet at sætte mobilen på flytilstand, men jeg tjekker den bare igen efter ti minutter. Indtil videre har jeg ikke ændret noget.' },
        { label:'C', name:'Birgit', text:'Jeg går faktisk tidligt i seng, allerede klokken 21.30, fordi jeg elsker at have god tid til at falde til ro. Problemet er, at jeg ofte vågner midt om natten og ikke kan lade være med at tjekke min mail, for jeg er bange for at overse noget vigtigt fra arbejdet. Så ligger jeg måske med telefonen i tyve minutter, før jeg kan falde i søvn igen. Jeg har flyttet opladeren ud på gangen, så mobilen ikke ligger lige ved siden af mig, men det har desværre ikke hjulpet — jeg står bare op og henter den alligevel. Til gengæld drikker jeg aldrig kaffe efter klokken fire.' }
      ],
      example:{ q:'Hvem går tidligst i seng om aftenen?', answer:'C' },
      questions:[
        { q:'Hvem opbevarer altid sin mobil i et andet rum om natten?', answer:'A', why:'Malene: "Mobilen skal ligge i køkkenet om natten, ikke på natbordet." Trap: Birgit has moved her charger to the hallway, but she still gets up and fetches the phone anyway — the plan does not actually keep it away from her.' },
        { q:'Hvem ser en episode mere af en serie, selvom personen havde lovet sig selv kun at se én?', answer:'B', why:'Jonas: "ser jeg som regel en episode mere af en serie, selvom jeg havde lovet mig selv kun én." Neither Malene nor Birgit mentions series at all.' },
        { q:'Hvem har svært ved at falde i søvn, når der er travlt på arbejdet?', answer:'A', why:'Malene: "Der er dog perioder, hvor jeg har svært ved at falde i søvn, især når der er meget travlt på arbejdet." Trap: Birgit also connects her sleep to work, but her problem is waking up in the MIDDLE of the night to check email out of fear of missing something — not difficulty falling asleep in the first place.' },
        { q:'Hvem vågner midt om natten og tjekker sin mail?', answer:'C', why:'Birgit: "jeg ofte vågner midt om natten og ikke kan lade være med at tjekke min mail." Trap: Jonas also has a poor sleep pattern caused by screens, but his problem is falling asleep too late from scrolling and series, not waking up mid-sleep to check work mail.' },
        { q:'Hvem har prøvet at bruge flytilstand på telefonen?', answer:'B', why:'Jonas: "Jeg har prøvet at sætte mobilen på flytilstand, men jeg tjekker den bare igen efter ti minutter." Trap: Malene has been offered a meditation app by her husband — a different kind of suggestion (relaxation, not switching off the phone signal) — and she has not even tried it yet.' },
        { q:'Hvem læser i en bog, før lyset bliver slukket om aftenen?', answer:'A', why:'Malene: "jeg læser altid tyve minutter i en bog, før jeg slukker lyset." No one else mentions reading.' },
        { q:'Hvem har fået foreslået en løsning af sin partner, som personen endnu ikke er kommet i gang med?', answer:'A', why:'Malene: her husband suggested a meditation app, but "jeg har faktisk ikke fået downloadet den endnu." Trap: Jonas’s girlfriend is frustrated and comments on the screen light, but she does not suggest a concrete solution — she only names the problem. Birgit acted on her OWN idea (moving the charger), not a partner’s suggestion.' }
      ]
    },
    /* extra insertion drill on this theme — not part of the official o4 person-match, kept as bonus practice */
    o4extra:{ kind:'insertion', title:'Et sundere arbejdsliv',
      parts:[
        'Mange danske arbejdspladser arbejder i dag aktivt med medarbejdernes sundhed. Det handler ikke kun om at undgå sygedage — gladere medarbejdere laver simpelthen bedre arbejde. ', {g:0},
        ' Andre steder får medarbejderne tilskud til fitness eller en gratis frugtordning.\n\nPå lageret hos firmaet Daxo i Horsens startede de for to år siden et løbehold. ', {g:1},
        ' I dag løber næsten tyve kolleger sammen hver onsdag efter arbejde, og flere af dem har løbet halvmaraton sammen.\n\nOgså den mentale sundhed har fået plads. ', {g:2},
        ' Det kan være svært at sige højt, at man har det dårligt, men en kort, ærlig samtale kan fange problemerne, før de vokser sig store.\n\nEksperterne minder dog om, at sundhed på jobbet skal være et tilbud. ', {g:3},
        ' Ellers bliver det sunde valg bare endnu en pligt — og så virker det ikke.'
      ],
      pool:[
        { letter:'A', text:'Nogle firmaer tilbyder for eksempel en times betalt motion om ugen.', gap:0, why:'"for eksempel" giver det første konkrete eksempel på, hvordan arbejdspladser arbejder med sundhed — og "Andre steder…" fortsætter listen.' },
        { letter:'B', text:'I starten var de kun fire, der mødte op.', gap:1, why:'Kontrasten fire → tyve binder afsnittet sammen: "I dag løber næsten tyve…" kræver et lille starttal før.' },
        { letter:'C', text:'Hos Daxo holder lederen derfor en kort trivselssamtale med hver medarbejder hvert halve år.', gap:2, why:'"den mentale sundhed har fået plads" → den konkrete ordning; næste sætning handler netop om at sige tingene højt i en samtale.' },
        { letter:'D', text:'Ingen skal føle sig tvunget til at løbe eller tabe sig.', gap:3, why:'"skal være et tilbud" → forklaringen; "Ellers bliver det sunde valg bare endnu en pligt" peger direkte tilbage på tvang.' },
        { letter:'E', text:'Derfor er kantinen lukket om fredagen.', gap:null, why:'Distractor: en lukket kantine har intet med sundhedstilbud at gøre.' },
        { letter:'F', text:'Løb er den eneste motionsform, der virker.', gap:null, why:'Distractor: modsiger tekstens brede tilgang (fitness, frugt, samtaler).' }
      ]}
  },
  writing:[
    { id:'ew7', opgave:'Opgave 1', concept:'w-opg1', minWords:100, maxWords:200,
      title:'Framelding af medlemskab i Fitness Nord pga. skade',
      situation:'Du har haft et fuldt medlemskab hos Fitness Nord i et år, men du har fået en skade i knæet og kan ikke træne foreløbig. Du vil skrive til fitnesscentret.',
      taskIntro:'Skriv en besked til Fitness Nord. Du skal fortælle:',
      bullets:['hvem du er, og hvilket medlemskab du har','hvorfor du skriver','hvad der er sket, og hvor længe du tror, det varer','hvad du gerne vil have, at fitnesscentret gør.'],
      model:'Kære Fitness Nord\n\nMit navn er Peter Holm, og jeg har haft et fuldt medlemskab hos jer i et år.\n\nJeg skriver til jer, fordi jeg desværre har fået en skade i knæet, efter jeg faldt på is i sidste uge. Lægen har sagt, at jeg ikke må træne benene i mindst to måneder, og jeg kan derfor ikke bruge mit medlemskab lige nu.\n\nDet er ærgerligt, for jeg har ellers trænet hos jer tre gange om ugen det sidste år, og jeg glæder mig til at komme tilbage, når knæet er raskt igen.\n\nJeg vil derfor gerne bede jer om at sætte mit medlemskab på pause i to måneder, indtil jeg er klar til at træne igen. Kan I bekræfte, at det er muligt, og om der er noget, jeg skal gøre for at sætte det i gang?\n\nPå forhånd tak for hjælpen.\n\nVenlig hilsen\nPeter Holm' },
    { id:'ew8', opgave:'Opgave 2', concept:'w-opg2', minWords:90, maxWords:200,
      title:'Svar til din veninde Lotte om lægebesøget',
      situation:'Du har fået en e-mail fra din veninde, Lotte.',
      taskIntro:'Læs e-mailen, og skriv et svar til Lotte. Du skal svare på alle Lottes spørgsmål. Du skal skrive minimum 90 ord.',
      email:'Hej!\nHvordan gik det hos lægen i går? Var det noget alvorligt? Har du fået noget medicin, eller skal du bare hvile dig? Og har du stadig lyst til at gå en tur i weekenden, eller skal vi vente lidt?\nKram\nLotte',
      bullets:['Hvordan gik det hos lægen?','Var det noget alvorligt?','Har du fået medicin, eller skal du bare hvile dig?','Har du lyst til at gå en tur i weekenden?'],
      model:'Hej Lotte\n\nTak, fordi du spørger — det var sødt af dig!\n\nDet gik faktisk meget bedre, end jeg havde frygtet. Lægen sagde, at det bare er en forkølelse, der har lagt sig lidt i brystet, så det er heldigvis ikke noget alvorligt.\n\nJeg har ikke fået nogen medicin — lægen sagde, at jeg bare skal drikke rigeligt og hvile mig et par dage, så går det over af sig selv.\n\nMed hensyn til turen i weekenden vil jeg meget gerne gå en tur, men måske skal vi tage det roligt og gå en kort tur i stedet for den lange, vi plejer? Jeg vil gerne ud og have frisk luft, bare ikke for langt endnu.\n\nSkal vi sige lørdag formiddag, hvis vejret er godt?\n\nKnus\nMaria' }
  ],
  oral:{
    o1:{ topic:'Mine sunde/usunde vaner', mm:'mm1',
      followUps:[
        {q:'Vil du fortælle lidt mere om din morgenmad?', tests:'Elaboration on a small branch.', approach:'Concrete habit + one opinion: "Hver morgen spiser jeg… fordi…"'},
        {q:'Du siger, du gerne vil træne mere — hvad forhindrer dig?', tests:'Honest reasoning with fordi-clauses.', approach:'One real obstacle + plan: "fordi jeg arbejder sent. Men fra næste måned vil jeg…"'},
        {q:'Kan du give et eksempel på en vane, du har ændret i Danmark?', tests:'Past→present comparison.', approach:'Before/after: "I mit hjemland… men nu… "'},
        {q:'Hvorfor tror du, danskerne cykler så meget?', tests:'Linking topic to Danish society.', approach:'Two reasons + own experience: "fordi byerne er bygget til det, og fordi det er billigt. Jeg er selv begyndt…"'}
      ]},
    o2:{ title:'Sundhed og motion', intro:'Emnet er "Sundhed og motion". Tal om billederne, og giv udtryk for, hvad I synes om de fire måder at holde sig sund på — og hvorfor.',
      images:[{icon:'dumbbell',label:'Fitnesscenter'},{icon:'trees',label:'Gåture i naturen'},{icon:'bike',label:'Cykling i hverdagen'},{icon:'chef-hat',label:'Sund madlavning'}],
      del1Backup:'Hvis samtalen går i stå, spørger eksaminator: "Hvilken af de fire måder at holde sig sund på kan du bedst lide — fitnesscenter, gåture i naturen, cykling eller sund madlavning? Hvorfor?"',
      questions:[
        'Hvordan holder du dig selv i form? Hvorfor på den måde?',
        'Hvad synes du om at træne i fitnesscenter? Hvorfor/hvorfor ikke?',
        'Er motion vigtigere end kost, synes du? Hvorfor?',
        'Hvordan var dine vaner i dit hjemland sammenlignet med nu?',
        'Du siger, du godt kan lide … — vil du fortælle lidt mere om det?',
        'Hvad vil du anbefale en ven, der gerne vil i gang med at motionere?'
      ]}
  }
},
/* ------------------- EXAM 2 · Bolig og naboskab ------------------- */
{ id:'sim2', title:'Mock Exam 2 · Bolig og naboskab',
  reading:{
    chat:{ title:'Karim skriver til sin nabo Søren', situation:'Situation: Karim skriver til sin nabo Søren.',
      personX:'Karim', personY:'Søren',
      example:{ x:'Hej Søren! Har du fem minutter til at hjælpe mig med noget praktisk?', reply:'Hej Karim! Ja da — hvad drejer det sig om?' },
      turns:[
        { x:'Jeg skal hænge to hylder op, men jeg har ingen boremaskine. Må jeg låne din?', correct:'D', why:'Søren siger ja og spørger HVORNÅR — og Karim svarer netop med et tidspunkt i næste besked.' },
        { x:'I morgen eftermiddag, hvis det passer? Ved 16-tiden.', correct:'B', why:'B bekræfter tidspunktet og tilbyder oven i købet at hjælpe — hvilket Karim takker ja til bagefter.' },
        { x:'Det ville være fantastisk! Jeg er ikke så god til at bore i beton.', correct:'F', why:'F beroliger ("det er mine vægge også") og aftaler at tage det rigtige bor med — logisk svar på beton-problemet.' }
      ],
      options:[
        { letter:'A', text:'Nej, jeg har aldrig ejet en boremaskine.', distractorWhy:'Modsiger resten af samtalen, hvor Søren netop hjælper med at bore.' },
        { letter:'B', text:'16 passer perfekt. Skal jeg ikke bare komme over og hjælpe dig med det?' },
        { letter:'C', text:'Hylderne ser flotte ud på billedet.', distractorWhy:'Ingen har sendt billeder — keyword-fælde ("hylder").' },
        { letter:'D', text:'Selvfølgelig må du det. Hvornår skal du bruge den?' },
        { letter:'E', text:'Min boremaskine gik desværre i stykker i sidste uge.', distractorWhy:'Fristende til hul 1, men så ville resten af samtalen om at bore i morgen ikke give mening.' },
        { letter:'F', text:'Bare rolig — det er mine vægge også! Jeg tager betonboret med.' }
      ]},
    cloze:{
      title:'Oprydningsdag i gården',
      instruction:'Læs teksten. Der mangler seks ord. Vælg for hvert hul det ord, der passer bedst, blandt de 12 ord i ordbanken.',
      parts:[
        'Kære beboere. Bestyrelsen holder oprydningsdag i gården lørdag den 9. august ', {g:0},
        ' klokken 10 til 13. Vi skal samle affald, ', {g:1},
        ' stier og klippe hækken foran opgang 3-7. Alle er velkomne til at hjælpe, men det er ikke et krav. Har du redskaber som river eller koste, må du gerne tage dem ', {g:2},
        '. Foreningen sørger ', {g:3},
        ' handsker og affaldssække til alle. Bagefter spiser vi frokost sammen i gården, og bestyrelsen giver kaffe og kage. Tilmeld dig ', {g:4},
        ' onsdag den 6. august, så vi ved, hvor mange der kommer. Skriv til Camilla i nr. 4, ', {g:5},
        ' du har spørgsmål. Vi håber, at rigtig mange vil være med!'
      ],
      bank:['fra','feje','med','for','senest','hvis','til','rydde','hjem','om','tidligst','når'],
      gaps:[
        { correct:'fra', why:'Time spans use the paired preposition "fra … til …": "fra klokken 10 til 13" (from 10 to 1 o\'clock). "Til" is already used later in the same phrase, so it can\'t fill this slot too, and "om"/"ved" don\'t pair with "til" this way.' },
        { correct:'feje', why:'You "feje stier" (sweep paths) — the fixed collocation for cleaning a path with a broom. "Rydde" is tempting because the whole event is called "oprydningsdag", but you rydde op (tidy/clear) affald, not stier; "vaske" (wash) and "male" (paint) don\'t fit paths either.' },
        { correct:'med', why:'The fixed phrase is "tage noget MED" (bring something along). "Hjem" is a contradiction trap — the tools should be brought TO the cleanup day, not taken home; "ud"/"op" aren\'t used with "tage" in this everyday sense.' },
        { correct:'for', why:'The verb "sørge FOR noget" (take care of / provide something) always takes "for" — here the association sørger for handsker og affaldssække. "Om" is a common wrong-preposition trap for A2 learners, and "til"/"med" don\'t combine with "sørge" this way.' },
        { correct:'senest', why:'Sign-up deadlines use "senest" (no later than): "Tilmeld dig senest onsdag den 6. august". "Tidligst" (earliest) is the opposite meaning and would make no sense as a deadline; "snart"/"allerede" don\'t fit the fixed deadline phrase.' },
        { correct:'hvis', why:'"Hvis du har spørgsmål" introduces a condition (if you have questions, then write to Camilla) — a request that may or may not apply. "Når" is the main trap because it also translates loosely as "when", but "når" implies questions will definitely occur, which doesn\'t fit a polite open-ended offer; "fordi" (because) and "selvom" (although) don\'t express a condition at all.' }
      ]
    },
    chat2:{
      title:'Mille skriver til sin nabo Jonas', situation:'Situation: Mille skriver til sin nabo Jonas.',
      personX:'Mille', personY:'Jonas',
      example:{ x:'Hej Jonas! Har du to minutter — jeg vil gerne spørge dig om noget.', reply:'Hej Mille! Ja da, hvad er der?' },
      turns:[
        { x:'Jeg skal på ferie i næste uge, og jeg har ingen til at vande mine planter. Kunne du gøre det for mig?', correct:'C',
          why:'C siger ja og spørger HVOR LÆNGE Mille er væk — og Mille svarer netop med antal dage i sin næste besked.' },
        { x:'Kun fem dage — fra mandag til fredag. Jeg lægger en nøgle i din postkasse søndag aften.', correct:'E',
          why:'E bekræfter, at fem dage er nemt, og spørger, HVOR OFTE planterne skal vandes — hvilket Mille svarer på i sidste besked.' },
        { x:'En gang er nok, gerne onsdag. Og du må meget gerne tage posten ind også, hvis der kommer noget.', correct:'A',
          why:'A siger ja til begge dele (vand onsdag + post) og runder samtalen naturligt af med et venligt tilbud om nøglen tilbage — logisk afslutning på ferie-aftalen.' }
      ],
      options:[
        { letter:'A', text:'Onsdag er perfekt, det kan jeg sagtens huske. Jeg tager også posten ind og lægger den på dit køkkenbord.' },
        { letter:'B', text:'Jeg har desværre ingen planter selv, så jeg ved ikke noget om det.', distractorWhy:'Irrelevant og off-topic — Jonas’ egne planter (eller mangel på samme) svarer ikke på, hvor tit Milles planter skal vandes.' },
        { letter:'C', text:'Det vil jeg gerne! Hvor lang tid er du væk?' },
        { letter:'D', text:'Nej, jeg rejser faktisk selv på ferie i næste uge.', distractorWhy:'Contradiction/tense trap — the rest of the chat shows Jonas is home and available (he agrees to water plants and take in post), so claiming he is also away next week makes the following turns illogical.' },
        { letter:'E', text:'Fem dage er nemt at klare. Hvor tit skal de vandes?' },
        { letter:'F', text:'Jeg vandede mine egne planter i går, så de har det fint.', distractorWhy:'Keyword trap on \'vande planter\' — talks about Jonas’ own plants in the past tense instead of answering Milles question about frequency for HER plants.' }
      ]
    },
    skim:{ title:'Besked fra boligforeningen: Vandet lukkes',
      text:'Kære beboere i Blok B. På grund af reparation af et rør i kælderen lukker vi for vandet i hele blokken tirsdag den 14. november fra kl. 9 til cirka kl. 14. Vi anbefaler, at I tapper vand til drikke og madlavning aftenen før. Toiletterne kan ikke bruges, mens vandet er lukket — i stedet kan I benytte toiletterne i fælleshuset, som er åbent hele dagen. Vaskekælderen er lukket hele tirsdagen. Hvis vandet er brunt, når det kommer tilbage, skal I lade hanen løbe i fem minutter. Spørgsmål: ring til varmemesteren på 70 22 18 90 (hverdage kl. 8–9).',
      questions:[
        { q:'Hvor længe er vandet lukket?', options:[{text:'Fra kl. 9 til ca. kl. 14', ok:true, why:'"fra kl. 9 til cirka kl. 14".'},{text:'Hele tirsdagen', ok:false, why:'Det er VASKEKÆLDEREN, der er lukket hele dagen.'},{text:'Fra kl. 8 til 9', ok:false, why:'8–9 er varmemesterens telefontid.'}]},
        { q:'Hvad skal man gøre aftenen før?', options:[{text:'Tappe vand til drikke og madlavning', ok:true, why:'"tapper vand til drikke og madlavning aftenen før".'},{text:'Ringe til varmemesteren', ok:false, why:'Telefonen er kun til spørgsmål, hverdage 8–9.'},{text:'Vaske alt sit tøj', ok:false, why:'Nævnes ikke — vaskekælderen er bare lukket tirsdag.'}]},
        { q:'Hvad gør man, hvis vandet er brunt bagefter?', options:[{text:'Lader hanen løbe i fem minutter', ok:true, why:'"lade hanen løbe i fem minutter".'},{text:'Ringer efter en VVS’er', ok:false, why:'Ikke nævnt — det brune vand er normalt efter reparation.'},{text:'Bruger fælleshusets vand resten af ugen', ok:false, why:'Fælleshuset nævnes kun for toiletter under lukningen.'}]},
        { q:'Hvornår kan man ringe til varmemesteren?', options:[{text:'Hverdage kl. 8–9', ok:true, why:'"(hverdage kl. 8–9)".'},{text:'Tirsdag kl. 9–14', ok:false, why:'Det er vandluknings-tidsrummet.'},{text:'Hele dagen', ok:false, why:'Det er fælleshusets åbningstid.'}]}
      ]},
    o3:{ title:'Idas første lejlighed', paragraphs:[
      { pre:'Ida er 23 år og har boet hjemme hos sine forældre i Randers hele sit liv. Nu har hun fået studieplads i Aarhus, og hun glæder sig — men hun ved også, at det bliver svært at finde en bolig. ', post:' Hver morgen tjekker hun derfor boligsiderne, inden hun overhovedet spiser morgenmad.',
        options:[
          {text:'Alle siger nemlig, at der er meget få billige lejligheder i Aarhus.', ok:true, why:'"nemlig" forklarer, hvorfor det bliver svært — og forklarer den daglige jagt på boligsiderne i næste sætning.'},
          {text:'Derfor vil hun helst blive boende hjemme.', ok:false, why:'Modsiger, at hun glæder sig og leder efter bolig hver morgen.'},
          {text:'Hun har allerede fundet en stor og billig lejlighed.', ok:false, why:'Så ville hun ikke tjekke boligsider hver morgen.'},
          {text:'Aarhus er Danmarks mindste by.', ok:false, why:'Faktuelt forkert og uden forbindelse til afsnittet.'}
        ]},
      { pre:'Efter to måneders søgning får Ida endelig svar på en lille etværelses lejlighed tæt på universitetet. Hun bliver inviteret til fremvisning sammen med tolv andre unge. ', post:' To dage senere ringer udlejeren og siger, at lejligheden er hendes, hvis hun stadig vil have den.',
        options:[
          {text:'Til fremvisningen smiler hun, stiller gode spørgsmål og fortæller, at hun har en stabil SU og et fritidsjob.', ok:true, why:'Hendes gode indtryk ved fremvisningen forklarer, hvorfor udlejeren netop vælger hende to dage senere.'},
          {text:'Hun beslutter sig for ikke at tage til fremvisningen.', ok:false, why:'Så kunne hun ikke få lejligheden bagefter.'},
          {text:'Lejligheden ligger i København.', ok:false, why:'Modsiger "tæt på universitetet" i Aarhus-historien.'},
          {text:'De tolv andre får alle sammen lejligheden.', ok:false, why:'Ulogisk — én lejlighed, én lejer.'}
        ]},
      { pre:'Nu skal der skrives kontrakt, og Ida læser den grundigt sammen med sin far. Hun skal betale tre måneders husleje i depositum — det er mange penge for en studerende. ', post:' Med lånet på plads kan hun skrive under, og hun får nøglerne den første i måneden.',
        options:[
          {text:'Heldigvis kan hun låne beløbet af sine forældre og betale tilbage lidt hver måned.', ok:true, why:'"Med lånet på plads" i næste sætning kræver, at et lån er blevet nævnt — forældrelånet er broen.'},
          {text:'Derfor opgiver hun lejligheden.', ok:false, why:'Modsiger, at hun skriver under og får nøgler.'},
          {text:'Depositum er gratis for studerende.', ok:false, why:'Modsiger "det er mange penge for en studerende".'},
          {text:'Hendes far synes, kontrakten er ulovlig.', ok:false, why:'Ingen konflikt nævnes — og det ville stoppe underskriften.'}
        ]},
      { pre:'Den første weekend i september flytter Ida. Hendes forældre kører flyttebilen, og to veninder hjælper med at bære kasser op på fjerde sal — uden elevator! ', post:' Bagefter sidder de alle sammen på gulvet og spiser pizza mellem flyttekasserne, og Ida tænker, at det er den bedste dag i hendes liv.',
        options:[
          {text:'Efter seks timer står de sidste kasser endelig i lejligheden.', ok:true, why:'Tidsbroen "Efter seks timer" afslutter bæreriet og leder naturligt til pizza-hvilen "bagefter".'},
          {text:'Ida fortryder og flytter hjem igen samme dag.', ok:false, why:'Modsiger "den bedste dag i hendes liv".'},
          {text:'Der er heldigvis elevator i ejendommen.', ok:false, why:'Modsiger "uden elevator!" lige før.'},
          {text:'Veninderne tager hjem, før de er færdige.', ok:false, why:'Modsiger "de alle sammen" om pizzaen bagefter.'}
        ]},
      { pre:'Der er stadig meget, Ida skal vænne sig til: at købe ind selv, at vaske tøj i kælderen og at få pengene til at række. ', post:' Hendes mor griner i telefonen og siger, at sådan har alle det den første måned — og at det netop er sådan, man bliver voksen.',
        options:[
          {text:'En aften ringer hun hjem og indrømmer, at hun faktisk savner sin mors madpakker.', ok:true, why:'Opkaldet og indrømmelsen er det, moren reagerer på i næste sætning ("griner i telefonen").'},
          {text:'Hun lærer aldrig at lave mad.', ok:false, why:'For absolut og passer ikke til den varme afslutning.'},
          {text:'Hendes mor flytter ind hos hende.', ok:false, why:'Ingen antydning — og ville modsige selvstændigheds-pointen.'},
          {text:'Hun holder op med at tale med sine forældre.', ok:false, why:'Modsiger telefonsamtalen i næste sætning.'}
        ]}
    ]},
    o4:{
      title:'Opgave 4 — Tre personer fortæller om deres naboer',
      instruction:'Læs de tre tekster, og læs spørgsmålene (1–7). Find den person, der passer til hvert spørgsmål. Se eksemplet (0).',
      persons:[
        { label:'A', name:'Hassan', text:'Jeg bor i en lejlighed på tredje sal, og jeg kører taxi — ofte lange aftenvagter og også i weekenden. Når jeg endelig er hjemme, er jeg mest bare træt, så jeg kender ærligt talt ikke mine naboer særlig godt. Vi nikker til hinanden i opgangen, men det er stort set det hele; jeg har hverken tid eller overskud til at være med i noget fælles i huset. Sidste år var der dog en episode: Naboen ovenover holdt en fest en torsdag aften, og musikken var så høj, at jeg slet ikke kunne sove før arbejde næste morgen. Jeg bankede på og forklarede roligt, at jeg skulle tidligt op. Han undskyldte med det samme og skruede ned for musikken. Nu hilser vi faktisk varmt på hinanden, hver gang vi mødes i opgangen, og han har sagt undskyld igen flere gange siden.' },
        { label:'B', name:'Beata', text:'Vi bor i et rækkehus, og jeg elsker vores lille fællesskab her. Hvert år i august arrangerer jeg vejfest for hele gaden — omkring femten husstande — med grill, bordtennis og et langt fælles kaffebord. Vi har også en fast aftale om, at vi skiftes til at vande hinandens blomster og holde øje med husene, når naboerne er på ferie; jeg har selv en nøgle til tre af husene på vejen. Der er dog én ting, der stadig gør mig virkelig ked af det: Naboen ved siden af fældede vores fælles hæk sidste forår uden overhovedet at spørge først, fordi han syntes, den skyggede for meget i hans have. Jeg blev meget vred over det, og vi har faktisk ikke talt sammen siden — jeg hilser ham ikke engang, når jeg ser ham i haven. Det er trist, for ellers er her et rigtig godt naboskab.' },
        { label:'C', name:'Naledi', text:'Jeg bor i en andelsbolig og sidder i bestyrelsen, hvor jeg blandt andet står for vores årlige storskraldsdag, hvor alle kan sætte gamle møbler og cykler ud i gården. Jeg er ret glad for flere af naboerne og låner tit værktøj eller lidt mel hos dem, hvis jeg mangler noget derhjemme. Sidste efterår ombyggede naboen under mig sit badeværelse, og der var boremaskine og hamren sent om aftenen i flere uger — det var hårdt, for jeg skal tidligt op med børnene hver morgen. Jeg klagede til bestyrelsen i stedet for at gå direkte til ham, og bestyrelsen holdt et møde, hvor vi lavede en fast regel om, at støjende arbejde kun må foregå i dagtimerne. Det løste faktisk problemet helt, og nu er der ro igen om aftenen. Jeg har dog ikke selv talt med naboen om det bagefter, men konflikten er heldigvis overstået.' }
      ],
      example:{ q:'Hvem kører taxi?', answer:'A' },
      questions:[
        { q:'Hvem har stadig en uløst konflikt med en bestemt nabo?', answer:'B', why:'Beata: hun og naboen har ikke talt sammen siden hækken blev fældet, og hun hilser ham ikke engang længere. Trap: Hassan havde også en konflikt (støj fra en fest), men den blev løst, og de hilser nu varmt på hinanden.' },
        { q:'Hvem sidder i boligens bestyrelse?', answer:'C', why:'Naledi: "jeg ... sidder i bestyrelsen". Trap: Beata arrangerer vejfest og har en nøgleordning med naboerne, men det er ikke en formel bestyrelsespost.' },
        { q:'Hvem kender ikke sine naboer godt, fordi han/hun arbejder meget?', answer:'A', why:'Hassan: lange taxavagter gør, at han er for træt til at kende naboerne, og han har hverken tid eller overskud til fællesskab i huset. Trap: Naledi har også travlt (bestyrelsesarbejde, tidlig morgen med børn), men hun er tydeligt glad for og i kontakt med flere naboer.' },
        { q:'Hvem arrangerer en årlig fest for hele gaden?', answer:'B', why:'Beata: "Hvert år i august arrangerer jeg vejfest for hele gaden". Trap: Naledi arrangerer en årlig storskraldsdag, men det er en affaldsdag, ikke en fest.' },
        { q:'Hvem løste selv en konflikt med en nabo ved at tale direkte med ham, og hilser nu venligt på ham?', answer:'A', why:'Hassan bankede selv på hos naboen og talte roligt med ham om støjen — nu hilser de varmt. Trap: Naledis konflikt blev løst gennem bestyrelsen, ikke ved at hun selv talte med naboen; hun skriver endda, at hun ikke selv har talt med ham om det bagefter.' },
        { q:'Hvem passer naboernes planter og huse, når de er på ferie?', answer:'B', why:'Beata: "vi skiftes til at vande hinandens blomster og holde øje med husene, når naboerne er på ferie". Ingen af de to andre nævner en praktisk ferieordning med naboerne.' },
        { q:'Hvem har oplevet støjgener fra en nabos renovering?', answer:'C', why:'Naledi: boremaskine og hamren fra naboens badeværelsesrenovering sent om aftenen. Trap: Hassan oplevede også høj støj fra en nabo, men det var fra en fest, ikke en renovering.' }
      ]
    },
    /* extra insertion drill on this theme — not part of the official o4 person-match, kept as bonus practice */
    o4extra:{ kind:'insertion', title:'Fra storby til landsby',
      parts:[
        'Flere og flere danske børnefamilier flytter fra de store byer ud i mindre byer og landsbyer. Huspriserne er den vigtigste grund: For prisen på en treværelses lejlighed i København kan man mange steder få et helt hus med have. ', {g:0},
        ' Tid er nemlig den nye luksus for travle familier.\n\nMen livet på landet kræver noget af tilflytterne. ', {g:1},
        ' Uden bil hænger hverdagen simpelthen ikke sammen ret mange steder uden for byerne.\n\nTil gengæld venter der ofte et stærkt fællesskab. ', {g:2},
        ' Mange tilflyttere fortæller, at de efter et halvt år kender flere mennesker i landsbyen, end de gjorde efter ti år i byen.\n\nEksperter forventer, at udviklingen fortsætter. ', {g:3},
        ' Når man kan arbejde hjemmefra to-tre dage om ugen, betyder afstanden til kontoret pludselig meget mindre.'
      ],
      pool:[
        { letter:'A', text:'Mange nævner også, at de er trætte af trafik og af at skynde sig.', gap:0, why:'"også" tilføjer grund nummer to efter huspriserne, og "tid er den nye luksus" følger direkte op på at skynde sig.' },
        { letter:'B', text:'Den offentlige transport kører sjældent, så de fleste familier skal have mindst én bil.', gap:1, why:'Forklarer kravet til tilflytterne; næste sætning ("Uden bil…") fortsætter præcis dén tanke.' },
        { letter:'C', text:'I landsbyen hilser man på alle, og foreningerne mangler altid frivillige hænder.', gap:2, why:'Konkretiserer "et stærkt fællesskab" og forklarer, hvorfor tilflyttere hurtigt kender mange.' },
        { letter:'D', text:'Hjemmearbejde er nemlig blevet normalt i mange brancher.', gap:3, why:'"nemlig" begrunder eksperternes forventning, og næste sætning uddyber hjemmearbejdets effekt.' },
        { letter:'E', text:'Derfor flytter de fleste tilbage til byen efter et år.', gap:null, why:'Distraktor: modsiger tekstens positive konklusion og eksperternes forventning.' },
        { letter:'F', text:'Huse på landet er generelt dyrere end lejligheder i København.', gap:null, why:'Distraktor: modsiger tekstens hovedargument om billigere huse.' }
      ]}
  },
  writing:[
    { id:'ew3', opgave:'Opgave 1', concept:'w-opg1', minWords:100, maxWords:200,
      title:'Klage til udlejer: Vaskemaskinen i kælderen',
      situation:'Du bor til leje hos boligselskabet Parkbo. Den fælles vaskemaskine i kælderen har været i stykker i tre uger, og du har to små børn og meget vasketøj. Du vil skrive en klage.',
      taskIntro:'Skriv en klage til boligselskabet Parkbo. Du skal fortælle:',
      bullets:['hvem du er, og hvor du bor','hvad problemet er, og hvor længe det har varet','hvad problemet betyder for dig og din familie','hvad du forventer, der nu skal ske.'],
      model:'Kære Parkbo\n\nMit navn er Lin Wei, og jeg bor på Parkvej 8, st. tv.\n\nJeg skriver til jer, fordi vaskemaskinen i vores fælleskælder har været i stykker i tre uger nu. Der hænger en seddel om, at den bliver repareret "snarest", men der er ikke sket noget endnu.\n\nDet er et stort problem for min familie, fordi vi har to små børn og derfor vasker tøj næsten hver dag. Lige nu kører jeg til min svigermor i Vejle to gange om ugen for at vaske — det tager tid og koster benzin. Møntvasken i byen koster desuden over 200 kroner om ugen.\n\nJeg forventer derfor, at maskinen bliver repareret eller udskiftet inden for en uge. Hvis det ikke kan lade sig gøre, synes jeg, at I skal dække vores udgifter til møntvask, indtil maskinen virker igen. Jeg vil gerne have et svar på denne mail, så jeg ved, hvad der kommer til at ske.\n\nPå forhånd tak for hjælpen.\n\nVenlig hilsen\nLin Wei, Parkvej 8, st. tv. · Telefon 60 21 43 87' },
    { id:'ew4', opgave:'Opgave 2', concept:'w-opg2', minWords:90, maxWords:200,
      title:'Svar til din veninde Paula om din nye lejlighed',
      situation:'Du har fået en e-mail fra din veninde, Paula.',
      taskIntro:'Læs e-mailen, og skriv et svar til Paula. Du skal svare på alle Paulas spørgsmål. Du skal skrive minimum 90 ord.',
      email:'Hej!\nTillykke med den nye lejlighed!! Jeg er SÅ nysgerrig: Hvordan ser den ud — hvor mange værelser har I? Hvordan er kvarteret og naboerne? Hvad mangler I stadig at købe? Og vigtigst: Hvornår må jeg komme og se den?\nKnus\nPaula',
      bullets:['Hvordan ser lejligheden ud — hvor mange værelser?','Hvordan er kvarteret og naboerne?','Hvad mangler I at købe?','Hvornår må Paula komme på besøg?'],
      model:'Hej Paula\n\nTusind tak — vi er stadig helt lykkelige!\n\nLejligheden har tre værelser: et soveværelse, et børneværelse og en dejlig lys stue med altan. Køkkenet er lille, men helt nyt, og fra altanen kan vi se en lille sø.\n\nKvarteret er roligt med mange børnefamilier, og naboerne har allerede sagt hej. Kvinden ved siden af kom faktisk med en kage i går — det havde jeg ikke ventet i Danmark!\n\nVi mangler stadig en sofa og nogle lamper. Lige nu sidder vi på havestole i stuen, og det ser ret sjovt ud. Vi leder efter noget brugt på DBA, fordi nyt er alt for dyrt.\n\nDu må komme, lige så snart sofaen er her — gerne om to uger? Skal vi sige lørdag den 18.? Så laver jeg middag, og du får hele rundvisningen.\n\nKnus\nMaya' }
  ],
  oral:{
    o1:{ topic:'Arbejdsdeling i min familie', mm:null,
      branches:['hvem laver mad / handler ind','rengøring og tøjvask','børnene: hente, bringe, lektier','økonomi og papirarbejde','hvad vi diskuterer / er uenige om','mening: er delingen fair?'],
      followUps:[
        {q:'Vil du fortælle lidt mere om, hvem der laver mad hos jer — og hvorfor?', tests:'Concrete everyday description with reasons.', approach:'Fact + reason + lille eksempel: "Min mand laver mest mad, fordi han kommer først hjem…"'},
        {q:'Er arbejdsdelingen anderledes, end den var i dit hjemland?', tests:'Cultural comparison.', approach:'"I mit hjemland… men i Danmark oplever jeg…" + din egen holdning.'},
        {q:'Du siger, I nogle gange diskuterer opvasken — hvordan løser I det?', tests:'Narrative + problem-solving language.', approach:'Lille ærlig historie + løsning: "Nu har vi en plan på køleskabet…"'},
        {q:'Hvad synes du om ligestilling i danske familier?', tests:'Opinion on society with begrundelse.', approach:'PREP: holdning + fordi + eksempel fra hverdagen + sammenligning.'}
      ]},
    o2:{ title:'Bolig', intro:'Emnet er "Bolig" (officielt tema fra modultest 3B). Tal om billederne, og fortæl, hvad I synes om de forskellige måder at bo på — og hvorfor.',
      images:[{icon:'building-2',label:'Lejlighed i byen'},{icon:'home',label:'Hus med have'},{icon:'users',label:'Bofællesskab'},{icon:'trees',label:'Kolonihavehus'}],
      del1Backup:'Hvis samtalen går i stå, spørger eksaminator: "Hvilken af de fire boligtyper kan du bedst lide — lejlighed i byen, hus med have, bofællesskab eller kolonihavehus? Hvorfor?"',
      questions:[
        'Hvordan bor du nu, og hvad er det bedste ved din bolig?',
        'Hvad synes du om at bo i lejlighed i byen? Hvorfor/hvorfor ikke?',
        'Kunne du tænke dig at bo i et bofællesskab? Hvorfor (ikke)?',
        'Hvordan boede du i dit hjemland — hvad er den største forskel?',
        'Du siger, du drømmer om … — vil du fortælle lidt mere om det?',
        'Hvad er vigtigst for dig: beliggenhed, pris eller plads? Hvorfor?'
      ]}
  }
},
/* ------------------- EXAM 3 · Fritid og fællesskab ------------------- */
{ id:'sim3', title:'Mock Exam 3 · Fritid og fællesskab',
  reading:{
    chat:{ title:'Lena skriver til sin veninde Aya', situation:'Situation: Lena skriver til sin veninde Aya.',
      personX:'Lena', personY:'Aya',
      example:{ x:'Hej Aya! Skal vi i biografen i denne uge?', reply:'Hej! Ja, hvor hyggeligt — hvad vil du se?' },
      turns:[
        { x:'Der går en ny dansk komedie, som skulle være rigtig sjov. Hvad siger du?', correct:'D', why:'D siger ja til komedien og spørger om DAGEN — og Lena svarer "torsdag eller fredag" i sin næste besked.' },
        { x:'Jeg kan torsdag eller fredag. Helst efter klokken 18.', correct:'F', why:'F vælger torsdag 18.30 og foreslår at spise først — hvilket Lena svarer på ("pizzastedet ved siden af").' },
        { x:'God idé! Skal vi prøve det nye pizzasted lige ved siden af biografen?', correct:'B', why:'B siger ja til pizza og tilbyder at bestille BILLETTERNE — Lena kvitterer med at bestille BORDET.' }
      ],
      options:[
        { letter:'A', text:'Nej, jeg hader komedier.', distractorWhy:'Modsiger resten af chatten, hvor de planlægger netop dén film.' },
        { letter:'B', text:'Ja! Og så køber jeg billetterne online — der er tit udsolgt torsdag.' },
        { letter:'C', text:'Filmen fik kun én stjerne i avisen.', distractorWhy:'Negativ kommentar uden spørgsmål eller svar — passer i intet hul.' },
        { letter:'D', text:'Den vil jeg meget gerne se! Hvilken dag tænker du?' },
        { letter:'E', text:'Jeg var i biografen i går med min bror.', distractorWhy:'Fortid uden forbindelse — svarer ikke på noget.' },
        { letter:'F', text:'Torsdag klokken 18.30 passer mig perfekt. Skal vi spise noget først?' }
      ]},
    cloze:{
      title:'Løbeklub i nabolaget',
      instruction:'Læs teksten. Der mangler seks ord. Vælg for hvert hul det ord, der passer bedst, blandt de 12 ord i ordbanken.',
      parts:[
        'Kære naboer. Vil du gerne motionere sammen med andre? Så kom ', {g:0},
        ' i vores nye løbeklub! Vi ', {g:1},
        ' hver tirsdag klokken 18 ved parkeringspladsen foran skolen. Turen ', {g:2},
        ' cirka en time, og alle kan være med — både begyndere og øvede løbere. Det er helt gratis at deltage, men vi beder ', {g:3},
        ', at I tilmelder jer ', {g:4},
        ' søndag, så vi ved, hvor mange der kommer. Efter løbeturen holder vi en kort pause med vand og frugt, hvor man kan snakke og lære hinanden bedre at kende. Har du spørgsmål, ', {g:5},
        ' du gerne skrive til Mads i nr. 12. Vi glæder os til at løbe med jer!'
      ],
      bank:['med','mødes','tager','om','senest','må','hjem','møder','bruger','for','først','skal'],
      gaps:[
        { correct:'med', why:'The fixed phrase is "at komme MED" (to join in/come along) — right after "Så kom", the notice is inviting neighbours to join the club, so "med" completes this set expression. "Hjem" (home) would make no sense in an invitation to join a new club.' },
        { correct:'mødes', why:'"Vi mødes hver tirsdag" uses the reciprocal verb "mødes" (to meet up with each other) because no object follows — the group simply gathers. "Møder" is the plain transitive form of "at møde" and needs a direct object, so it cannot stand alone before "hver tirsdag".' },
        { correct:'tager', why:'Danish uses the fixed collocation "turen TAGER en time" (the trip takes an hour) to describe duration. "Bruger" (uses/spends) needs a person as subject, like "vi bruger en time", not "turen bruger en time" — a subject-mismatch trap.' },
        { correct:'om', why:'The fixed verb phrase is "at bede OM noget" (to ask for/request something) — here the club asks for sign-ups. "For" is tempting because "bede for" exists in Danish, but it means "to pray for" someone, which contradicts the practical, everyday context of a sign-up deadline.' },
        { correct:'senest', why:'Deadlines use "senest" (no later than): "tilmelde jer senest søndag" tells readers the last possible day to sign up. "Først" would suggest sign-ups cannot happen UNTIL Sunday, which contradicts the purpose of giving a final deadline.' },
        { correct:'må', why:'"Må du gerne skrive" expresses polite permission/invitation ("you are welcome to write"), fitting the friendly, optional tone of contacting Mads with questions. "Skal" expresses obligation, which clashes with the soft, inviting tone of the rest of the notice.' }
      ]
    },
    chat2:{
      title:'Rasmus skriver til sin ven Malthe', situation:'Situation: Rasmus skriver til sin ven Malthe.',
      personX:'Rasmus', personY:'Malthe',
      example:{ x:'Hej Malthe! Har du lige to minutter?', reply:'Hej Rasmus! Ja, hvad så?' },
      turns:[
        { x:'Jeg har hørt, at du har meldt dig ind i badmintonklubben. Hvornår træner I?', correct:'D',
          why:'D answers WHEN (Tuesday evenings at seven) — which Rasmus responds to next by confirming he can make that day.' },
        { x:'Tirsdag klokken 19 lyder perfekt. Skal jeg selv have en ketsjer med, eller kan man låne en?', correct:'B',
          why:'B answers the equipment question directly (rackets can be borrowed the first time) and adds a concrete offer to bring shuttlecocks — which Rasmus reacts to next by offering to pay half.' },
        { x:'Fint, så låner jeg en ketsjer i aften. Skal jeg betale halvdelen for fjerboldene?', correct:'F',
          why:'F declines the money offer, proposes buying proper shoes together instead, and sets a concrete meeting point/time — the natural closing of the exchange.' }
      ],
      options:[
        { letter:'A', text:'Nej, jeg er stoppet i klubben for en måned siden.', distractorWhy:'Contradicts the rest of the chat, where Malthe clearly still trains and invites Rasmus along.' },
        { letter:'B', text:'Vi træner tirsdag klokken 19. Du kan låne en ketsjer første gang — jeg tager fjerbolde med.' },
        { letter:'C', text:'Jeg spiller faktisk fodbold, ikke badminton.', distractorWhy:'Contradicts the premise of the whole chat — Malthe is clearly the one who plays badminton.' },
        { letter:'D', text:'Vi træner hver tirsdag klokken 19 i hallen ved skolen.' },
        { letter:'E', text:'Klubben har lukket på grund af ferie i denne uge.', distractorWhy:'Contradicts the concrete Tuesday-at-19 plan that the rest of the chat builds on.' },
        { letter:'F', text:'Glem pengene — lad os hellere købe ordentlige indendørssko sammen. Vi mødes udenfor hallen klokken kvart i 7.' }
      ]
    },
    skim:{ title:'Plakat: Kulturnat i Holbæk',
      text:'Fredag den 13. september inviterer Holbæk til Kulturnat fra kl. 17 til midnat. Over 40 steder i byen holder åbent med gratis oplevelser: Biblioteket byder på oplæsning for børn kl. 17.30, museet viser byens historie i levende billeder kl. 19 og 21, og i kirken kan du høre gospelkor kl. 20. På havnen sælger lokale foreninger mad fra hele verden — overskuddet går til byens nye ungdomsklub. Aftenens højdepunkt er det store lysshow over havnen kl. 23. Armbånd til alle arrangementer koster 50 kr. for voksne; børn under 16 kommer gratis ind overalt. Armbånd købes på biblioteket og i Turistinformationen fra den 1. september.',
      questions:[
        { q:'Hvad koster Kulturnatten for voksne?', options:[{text:'50 kr. for et armbånd', ok:true, why:'"Armbånd … koster 50 kr. for voksne".'},{text:'Den er gratis for alle', ok:false, why:'Kun børn under 16 kommer gratis ind — "gratis oplevelser" beskriver stederne, men armbåndet koster 50 kr.'},{text:'40 kr.', ok:false, why:'40 er antallet af åbne steder.'}]},
        { q:'Hvornår er lysshowet?', options:[{text:'Kl. 23', ok:true, why:'"lysshow over havnen kl. 23".'},{text:'Kl. 19 og 21', ok:false, why:'Det er museets visninger.'},{text:'Ved midnat', ok:false, why:'Midnat er sluttidspunktet for hele natten.'}]},
        { q:'Hvad går overskuddet fra maden til?', options:[{text:'Byens nye ungdomsklub', ok:true, why:'"overskuddet går til byens nye ungdomsklub".'},{text:'Foreningerne selv', ok:false, why:'Foreningerne sælger maden, men overskuddet går videre.'},{text:'Biblioteket', ok:false, why:'Biblioteket sælger armbånd og holder oplæsning.'}]},
        { q:'Hvor køber man armbånd?', options:[{text:'På biblioteket og i Turistinformationen', ok:true, why:'Sidste sætning.'},{text:'På havnen', ok:false, why:'På havnen sælges mad.'},{text:'I kirken', ok:false, why:'Kirken har gospelkor.'}]}
      ]},
    o3:{ title:'Viktor og vinterbadning', paragraphs:[
      { pre:'Viktor flyttede til Esbjerg for to år siden og arbejder på havnen. Arbejdet er fint, men om vinteren synes han, at livet i Danmark kan være mørkt og lidt trist. En kollega bliver ved med at fortælle ham om vinterbadeklubben på stranden. ', post:' Så en mørk lørdag morgen i januar tager han alligevel med kollegaen ned til stranden.',
        options:[
          {text:'Viktor synes ærligt talt, at det lyder helt skørt at hoppe i iskoldt vand frivilligt.', ok:true, why:'Hans skepsis forklarer "alligevel" i næste sætning — modstanden skal etableres, før overvindelsen giver mening.'},
          {text:'Viktor har vinterbadet hele sit liv.', ok:false, why:'Modsiger overraskelsen og "alligevel".'},
          {text:'Kollegaen hader at bade om vinteren.', ok:false, why:'Modsiger, at kollegaen bliver ved med at anbefale klubben.'},
          {text:'Stranden i Esbjerg er lukket om vinteren.', ok:false, why:'Så kunne lørdagsturen ikke finde sted.'}
        ]},
      { pre:'Det første dyp varer cirka ti sekunder, og Viktor skriger højere, end han har gjort siden barndommen. Men da han kommer op af vandet, sker der noget mærkeligt: Hele kroppen bobler af varme og energi. ', post:' Allerede i bilen på vej hjem spørger han kollegaen, hvornår de skal afsted igen.',
        options:[
          {text:'Han griner og har det bedre, end han har haft det hele vinteren.', ok:true, why:'Glæden bygger bro mellem den boblende energi og spørgsmålet om at tage afsted igen.'},
          {text:'Han beslutter sig for aldrig at gøre det igen.', ok:false, why:'Modsiger spørgsmålet i bilen.'},
          {text:'Han fryser resten af dagen og bliver syg.', ok:false, why:'Modsiger varmen og energien.'},
          {text:'Vandet er overraskende varmt i januar.', ok:false, why:'Modsiger det iskolde dyp og skriget.'}
        ]},
      { pre:'Viktor melder sig ind i klubben ugen efter. Medlemmerne er alt fra unge studerende til pensionister, og efter badet drikker de altid kaffe sammen i klubhuset med udsigt over havet. ', post:' Nu kender han pludselig tyve mennesker i en by, hvor han før kun kendte sine kolleger.',
        options:[
          {text:'Det er her ved kaffebordet, at Viktor for alvor lærer danskerne at kende.', ok:true, why:'Kaffebordet → de tyve nye bekendtskaber: sætningen forbinder ritualet med resultatet i næste sætning.'},
          {text:'Viktor springer altid kaffen over og kører direkte hjem.', ok:false, why:'Så ville han ikke pludselig kende tyve mennesker.'},
          {text:'Klubhuset ligger langt fra vandet.', ok:false, why:'Modsiger "med udsigt over havet".'},
          {text:'Medlemmerne taler kun engelsk sammen.', ok:false, why:'Intet i teksten antyder det — og det ville svække pointen om at lære danskere at kende.'}
        ]},
      { pre:'Vinterbadning har også ændret Viktors syn på den danske vinter. Mørket er det samme, men nu er der noget at stå op til om lørdagen. ', post:' "Man kan ikke ændre vejret," siger han, "men man kan ændre, hvad man gør i det."',
        options:[
          {text:'Han har endda købt en varm badekåbe og glæder sig til de koldeste morgener.', ok:true, why:'Den konkrete detalje viser forvandlingen og leder naturligt til hans citat om at handle i stedet for at klage.'},
          {text:'Derfor er han flyttet tilbage til sit hjemland.', ok:false, why:'Modsiger hele historien.'},
          {text:'Han bader nu kun om sommeren.', ok:false, why:'Modsiger "de koldeste morgener" og klubbens formål.'},
          {text:'Vintermørket er forsvundet i Esbjerg.', ok:false, why:'Teksten siger netop "Mørket er det samme".'}
        ]},
      { pre:'I næste måned skal klubben holde sin årlige nytårsdukkert, hvor over hundrede mennesker bader sammen, og Viktor har meldt sig som frivillig hjælper. ', post:' Måske, tænker han, er det netop sådan, man finder sig til rette i et nyt land: ti kolde sekunder ad gangen.',
        options:[
          {text:'Han skal stå klar med varme drikke og holde styr på badegæsterne.', ok:true, why:'Konkretiserer den frivillige rolle, før den afsluttende refleksion runder historien af.'},
          {text:'Han har meldt sig ud af klubben igen.', ok:false, why:'Modsiger frivillig-rollen i samme sætning.'},
          {text:'Nytårsdukkerten er aflyst i år.', ok:false, why:'Modsiger "skal klubben holde".'},
          {text:'Kun nye medlemmer må deltage.', ok:false, why:'Modsiger "over hundrede mennesker bader sammen".'}
        ]}
    ]},
    o4:{
      title:'Tre personer fortæller om deres fritidsinteresser',
      instruction:'Læs de tre tekster, og læs spørgsmålene (1–7). Find den person, der passer til hvert spørgsmål. Se eksemplet (0).',
      persons:[
        { label:'A', name:'Diana', text:'Jeg har spillet håndbold, siden jeg var barn, og nu spiller jeg på et hold for voksne to gange om ugen. Vi træner tirsdag og torsdag, og der er kamp næsten hver lørdag. Jeg meldte mig ind for tre år siden, kort efter jeg flyttede til byen, og det var faktisk sådan, jeg fik mine første danske venner. Efter kampene går vi altid ud og spiser sammen, og det er der, jeg får talt mest dansk uden for arbejdet. Min træner siger, at jeg er blevet meget bedre til at forstå, hvad hun råber inde fra sidelinjen. Jeg ville gerne spille noget oftere, men med to børn derhjemme er to gange om ugen faktisk lige rigeligt. Kontingentet er ikke så dyrt, synes jeg, når man tænker på, hvor meget man får ud af det.' },
        { label:'B', name:'Hassan', text:'Jeg er meget glad for skak, og jeg spiller for det meste alene på min telefon, når jeg har et ledigt kvarter. For nylig fandt jeg dog en skakklub, der mødes i biblioteket hver onsdag aften, og jeg har været der to gange nu. Det er lidt svært at komme i gang, for de andre kender hinanden godt i forvejen, men alle har været venlige over for mig. Jeg overvejer at melde mig ind officielt, men jeg har ikke besluttet mig endnu, fordi onsdag også er den dag, jeg plejer at ringe hjem til min familie. Klubben koster faktisk ikke noget at være med i, hvilket er dejligt, for jeg har ikke så mange penge til fritidsaktiviteter lige nu. Jeg håber, at jeg med tiden kan blive lidt bedre til at tale dansk, hvis jeg begynder at komme fast.' },
        { label:'C', name:'Mei', text:'Jeg elsker at strikke, og for et halvt år siden startede jeg med at gå til en strikkecafé i kulturhuset hver anden mandag. Det var min nabo, der inviterede mig med første gang, og nu er vi blevet en fast gruppe på omkring ti kvinder i alle aldre. Vi drikker kaffe, strikker og snakker om alt muligt — børn, arbejde, opskrifter. Jeg har lært utrolig meget nyt dansk der, for vi taler jo hele tiden, mens hænderne arbejder. Det koster 20 kroner hver gang til kaffe og kage, hvilket jeg synes er helt rimeligt. Min mand forstår ikke rigtig, hvorfor jeg bruger min fritid på det, men for mig betyder gruppen mindst lige så meget som selve strikningen. Jeg har faktisk fået to helt nye danske veninder gennem cafeen.' }
      ],
      example:{ q:'Hvem spiller håndbold?', answer:'A' },
      questions:[
        { q:'Hvem har for nylig fået nye danske venner gennem sin fritidsinteresse?', answer:'C', why:'Mei startede i strikkecafeen for kun et halvt år siden og skriver, at hun "har fået to helt nye danske veninder gennem cafeen" — altså for nylig. Trap: Diana fik også danske venner gennem håndbold, men det var for tre år siden, ikke for nylig.' },
        { q:'Hvem er ikke sikker på, om hun/han vil melde sig officielt ind i en klub?', answer:'B', why:'Hassan: "jeg overvejer at melde mig ind officielt, men jeg har ikke besluttet mig endnu." Trap: Mei er allerede en fast del af gruppen, og Diana meldte sig ind for tre år siden — ingen af dem er i tvivl.' },
        { q:'Hvem praktiserer sin fritidsinteresse mest alene, men har for nylig fundet et fællesskab?', answer:'B', why:'Hassan: spiller mest skak alene på telefonen, men fandt for nylig en skakklub i biblioteket. Trap: Meis nabo inviterede hende med i en gruppe fra starten — hun praktiserede aldrig alene først.' },
        { q:'Hvem betaler for kaffe og kage til sin fritidsaktivitet?', answer:'C', why:'Mei: "Det koster 20 kroner hver gang til kaffe og kage." Trap: hverken Dianas håndboldkontingent eller Hassans gratis skakklub nævner betaling for kaffe og kage.' },
        { q:'Hvem taler mest dansk, mens han eller hun laver sin fritidsaktivitet?', answer:'C', why:'Mei: "jeg har lært utrolig meget nyt dansk der, for vi taler jo hele tiden, mens hænderne arbejder." Trap: Diana taler mest EFTER kampene over middagen, ikke under selve spillet, og Hassan håber først at blive bedre til dansk, når han begynder at komme fast — han er der endnu ikke.' },
        { q:'Hvem har været med i sin klub i flere år?', answer:'A', why:'Diana: "Jeg meldte mig ind for tre år siden." Trap: Mei har kun gået til strikkecafé i et halvt år, og Hassan har kun besøgt skakklubben to gange.' },
        { q:'Hvem er i tvivl om at fortsætte på grund af et andet fast ugentligt gøremål?', answer:'B', why:'Hassan: onsdag er også den dag, han plejer at ringe hjem til familien, hvilket er grunden til, at han ikke har meldt sig officielt ind. Trap: Dianas to faste træningsdage er en fast del af hendes liv, og hun nævner ingen konflikt, selvom hun har to børn.' }
      ]
    },
    /* extra insertion drill on this theme — not part of the official o4 person-match, kept as bonus practice */
    o4extra:{ kind:'insertion', title:'Foreningslivet — Danmarks hemmelige lim',
      parts:[
        'Over 90 procent af alle danskere er medlem af mindst én forening — en idrætsklub, en grundejerforening, et kor eller noget helt fjerde. ', {g:0},
        ' Foreningerne bygger nemlig på frivilligt arbejde: Træneren, kassereren og kagebageren får ingen løn.\n\nFor nye borgere er foreningslivet en genvej ind i samfundet. ', {g:1},
        ' Man behøver ikke tale perfekt dansk for at spille fodbold eller plante blomster sammen.\n\nMange kommuner støtter derfor foreningerne med gratis lokaler og kurser for frivillige. ', {g:2},
        ' Undersøgelser viser nemlig, at mennesker med et aktivt foreningsliv er mindre ensomme og har større tillid til andre.\n\nSå hvis du vil forstå Danmark, så meld dig ind i en forening. ', {g:3},
        ' Resten — sproget, vennerne, fællesskabet — kommer næsten af sig selv.'
      ],
      pool:[
        { letter:'A', text:'Tallet overrasker mange udlændinge, men det er en helt central del af dansk kultur.', gap:0, why:'"Tallet" peger tilbage på de 90 procent, og "central del af dansk kultur" leder ind i forklaringen om frivillighed.' },
        { letter:'B', text:'Her møder man nemlig danskere om en fælles interesse — ikke om at være ny i landet.', gap:1, why:'Forklarer "genvej ind i samfundet"; næste sætning om sprog fortsætter pointen om den fælles aktivitet.' },
        { letter:'C', text:'Pengene er godt givet ud, mener forskerne.', gap:2, why:'Vurderingen af støtten begrundes af "Undersøgelser viser nemlig…" lige efter.' },
        { letter:'D', text:'Det kræver kun, at du møder op den første gang.', gap:3, why:'Opfordringens lille barriere ("kun … møde op") spejles af "Resten kommer næsten af sig selv".' },
        { letter:'E', text:'Foreninger findes kun i København.', gap:null, why:'Distraktor: faktuelt forkert og modsiger "alle danskere".' },
        { letter:'F', text:'Derfor er kontingentet altid meget dyrt.', gap:null, why:'Distraktor: frivilligt arbejde gør foreninger billige, ikke dyre.' }
      ]}
  },
  writing:[
    { id:'ew5', opgave:'Opgave 1', concept:'w-opg1', minWords:100, maxWords:200,
      title:'Henvendelse til idrætsforeningen',
      situation:'Din søn på 8 år vil gerne gå til fodbold. Du har set, at FC Vestby har børnehold, men du har spørgsmål om pris, tider og udstyr. Du vil skrive til foreningen.',
      taskIntro:'Skriv en henvendelse til FC Vestby. Du skal fortælle:',
      bullets:['hvem du er, og hvem henvendelsen handler om','hvorfor du skriver','hvilke spørgsmål du har (mindst tre)','hvordan foreningen kan kontakte dig.'],
      model:'Kære FC Vestby\n\nMit navn er Sara Osman, og jeg skriver til jer, fordi min søn Yusuf på 8 år meget gerne vil gå til fodbold. Han spiller hver dag i skolegården, og hans kammerat går allerede på jeres U9-hold.\n\nJeg har set på jeres hjemmeside, at I har hold for børn, men jeg har nogle spørgsmål, før vi melder ham ind.\n\nFor det første vil jeg gerne vide, hvad det koster om året, og om man kan betale pr. halvår. For det andet: Hvornår træner U9-holdet, og hvor foregår træningen om vinteren? For det tredje: Hvilket udstyr skal vi selv købe — og har klubben eventuelt brugte støvler, man kan overtage? Til sidst vil jeg gerne høre, om Yusuf må prøve at træne med et par gange, før vi beslutter os.\n\nI kan kontakte mig på telefon 50 44 12 76 eller på denne mail — gerne efter klokken 15.\n\nPå forhånd tak for hjælpen. Yusuf glæder sig allerede!\n\nVenlig hilsen\nSara Osman' },
    { id:'ew6', opgave:'Opgave 2', concept:'w-opg2', minWords:90, maxWords:200,
      title:'Svar til din ven Marco om madklubben',
      situation:'Du har fået en e-mail fra din ven, Marco.',
      taskIntro:'Læs e-mailen, og skriv et svar til Marco. Du skal svare på alle Marcos spørgsmål. Du skal skrive minimum 90 ord.',
      email:'Hej!\nNogle stykker fra sprogskolen vil starte en madklub, hvor vi mødes en gang om måneden og laver mad fra vores hjemlande. Har du lyst til at være med? Hvilken ret fra dit hjemland ville du lave til os? Passer den første fredag i måneden dig? Og må vi eventuelt være hjemme hos dig den første gang — vi har ikke fundet et lokale endnu?\nHilsen\nMarco',
      bullets:['Vil du være med i madklubben?','Hvilken ret vil du lave?','Passer den første fredag i måneden?','Må klubben mødes hjemme hos dig første gang?'],
      model:'Hej Marco\n\nSikke en god idé — tak, fordi du spørger mig!\n\nJa, jeg vil helt sikkert være med. Jeg elsker at lave mad, og jeg vil rigtig gerne lære jer bedre at kende uden grammatikbøger på bordet.\n\nFra mit hjemland vil jeg lave biryani — det er en krydret risret med kylling, som hele min familie er vokset op med. Den dufter fantastisk, og jeg lover, at den ikke bliver for stærk!\n\nDen første fredag i måneden passer mig fint. Jeg arbejder til klokken 16, så kan vi begynde klokken 17.30?\n\nOg ja — I må gerne komme hjem til os første gang. Vi har et stort køkken, og min kone synes også, det lyder hyggeligt. Der er plads til otte personer omkring bordet.\n\nSkal jeg lave en lille indkøbsliste og sende den i gruppen?\n\nVi ses til biryani!\n\nHilsen\nArjun' }
  ],
  oral:{
    o1:{ topic:'Min fritidsinteresse', mm:null,
      branches:['hvad laver jeg / hvor tit','hvordan startede det','udstyr og penge','mennesker: alene eller sammen','hvad giver det mig','mine planer med hobbyen'],
      followUps:[
        {q:'Vil du fortælle lidt mere om, hvordan du startede med din hobby?', tests:'Past-tense narrative.', approach:'Lille historie med da/dengang: "Da jeg var barn… / Det startede, da min nabo inviterede mig…"'},
        {q:'Kan du give nogen eksempler på, hvad din hobby koster i tid og penge?', tests:'Concrete numbers + balanced view.', approach:'"Cirka … kroner om måneden og … timer om ugen. På den ene side er det dyrt — på den anden side sparer jeg…"'},
        {q:'Du siger, du oftest gør det alene — savner du ikke fællesskabet?', tests:'Handling a gentle challenge.', approach:'Concede + nuance: "Jo, nogle gange. Derfor har jeg meldt mig ind i en klub, hvor…"'},
        {q:'Tror du, danskerne bruger deres fritid anderledes end folk i dit hjemland?', tests:'Society comparison.', approach:'En tydelig forskel + eksempel + din mening om hvorfor.'}
      ]},
    o2:{ title:'At møde nye venner', intro:'Emnet er "At møde nye venner" (officielt tema fra modultest 3A). Her er nogle billeder, der viser forskellige situationer, hvor man kan møde nye venner. Tal om, hvad I synes om de forskellige måder — og hvorfor.',
      images:[{icon:'smartphone',label:'Online / sociale medier'},{icon:'briefcase',label:'På arbejdet'},{icon:'party-popper',label:'Til fest / i byen'},{icon:'bike',label:'Fritidsaktiviteter og sport'}],
      del1Backup:'Hvis samtalen går i stå, spørger eksaminator: "Hvilken af de fire måder at møde nye venner på kan du bedst lide — online, på arbejdet, til fest eller til fritidsaktiviteter? Hvorfor?"',
      questions:[
        'Hvordan kan du bedst lide at møde nye venner? Hvorfor?',
        'Er det svært at møde nye venner som voksen? Hvorfor/hvorfor ikke?',
        'Kan du fortælle lidt om, hvordan du sidst lærte nye mennesker at kende? (hvor, hvornår, hvordan, nemt/svært)',
        'Hvad synes du om at møde nye mennesker online, fx på sociale medier?',
        'Er det nemmere eller sværere at få venner i Danmark end i dit hjemland? Hvorfor?',
        'Du siger, at … — vil du fortælle lidt mere om det?'
      ]}
  }
}
];


# Dansk Coach 3.3 — Project Instructions

## What this project is
A single-file HTML web application called "Dansk Coach 3.3 — Learn, Practice, Remember".
It is a Danish language learning coach for Danskuddannelse 3, Modul 3.3 exam preparation.
It aligns to the official SIRI Modul 3.3 exam format and Opgave types.

## SIRI Exam Alignment
- Reading: Opgave 2A (skim/scan), Opgave 3 (longer comprehension), Opgave 4 (sentence insertion)
- Writing: Opgave 1 (halvformel henvendelse), Opgave 2 (email)
- Oral: Opgave 1 (mindmap presentation + follow-up), Opgave 2 (task-based conversation)
- Oral mindmap topics: Mine sunde/usunde vaner, Mine grønne vaner, At lære dansk

## Technical rules
- Everything must be in ONE single HTML file: dansk-coach.html
- Tailwind CSS via CDN and Lucide Icons via CDN are the only external dependencies
- All logic, data, lessons, questions, explanations must be embedded in the HTML file
- Vanilla JavaScript only. No frameworks.
- All user progress must persist in localStorage
- No placeholders, no TODO comments, no truncated arrays, no fake buttons
- Every interactive element must be fully functional

## Quality rules
- Teaching quality is more important than visual decoration
- Every explanation must be useful for a real DU3 Modul 3.3 learner
- All Danish text must be natural and appropriate for DU3 level
- All English explanations must be clear and practical for an adult learner
- The app must teach first, then test — not just quiz
- All practice must mirror real SIRI Opgave formats

## Output rules
- Write the complete file to ./dansk-coach.html
- Do not ask for confirmation between steps
- Do not output markdown or explanations — only write the HTML file
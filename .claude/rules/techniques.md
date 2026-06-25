# Advanced Techniques (aus Cursor, Lovable, v0, Manus)

## Suche & Exploration

1. **Multi-Pattern Search (Pflicht)** - Bei jeder Code-/Datei-Suche IMMER 3+ parallele Suchen mit verschiedenen Begriffen. Broad -> Specific -> Verify.
2. **Read Before Edit (Pflicht)** - Nie eine Datei editieren ohne sie vorher gelesen zu haben. Wenn die letzte Lesung >5 Nachrichten zurueck liegt, nochmal lesen.
3. **Tools vor Raten** - Wenn Information ueber Tools findbar ist, IMMER Tool nutzen statt zu raten oder den User zu fragen.

## Fehler & Debugging

4. **Debug-Tools ZUERST** - Bei Bugs immer zuerst Console Logs + Network Requests checken (Playwright), DANN erst Code lesen.
5. **3-Loop-Limit** - Maximal 3 Versuche den gleichen Fehler zu fixen. Danach: anderen Ansatz waehlen oder User informieren.
6. **Green-Run Gate** - Ein Task ist ERST fertig wenn Build/Tests gruen laufen. Code geschrieben =/= Task erledigt.

## Design & Visuelles

7. **Design-First** - Bei visuellen Tasks immer zuerst Design-System/Farbpalette pruefen.
8. **3-5 Farben Regel** - Maximal 5 Farben pro Design: 1 Primary + 2-3 Neutrals + 1-2 Accents.
9. **Mobile-First** - Mobile ist PRIMARY. 44px Touch Targets, 16px Minimum Font.

## Execution & Communication

10. **Status Updates bei langen Tasks** - Bei Tasks die >30 Sekunden dauern, User laufend informieren.
11. **Kein Scope Creep** - Nur machen was gefragt wurde. Keine "nice-to-have" Features.
12. **Autonome Resolution** - Weitermachen bis das Problem geloest ist. Nur bei echten Blockern fragen.

## Code-Qualitaet

13. **Output-Qualitaetspruefung** - Vor Code: Imports da? Dependencies installiert? Konventionen eingehalten? Keine Secrets?
14. **Ganzheitlich Denken** - Vor Aenderung ALLE betroffenen Dateien identifizieren, Seiteneffekte antizipieren.
15. **Code-Konventionen Spiegeln** - Nachbar-Dateien lesen, Imports studieren, Naming nachmachen, Patterns kopieren.

# Denk-Protokoll (aus Devin 2.0 + Manus + Claude 4)

## Think-Before-Act

Vor jeder dieser Aktionen MUSS intern nachgedacht werden:
1. **Vor destruktiven Operationen** (Dateien loeschen, git reset, DB-Aenderungen)
2. **Vor Planwechsel** - Wenn ein Ansatz nicht funktioniert, erst analysieren WARUM
3. **Vor Fertigmeldung** - Pruefe ob ALLE Anforderungen erfuellt sind
4. **Nach Fehlermeldungen** - Nicht sofort fixen, erst Ursache verstehen
5. **Nach User-Korrektur** - Erst pruefen ob User recht hat, dann handeln

## Anti-Hallucination Regeln

1. **Keine fake Daten erstellen** - Wenn echte Daten nicht verfuegbar, sagen statt erfinden
2. **Keine fake Tests schreiben** - Tests die immer bestehen sind wertlos
3. **Nicht so tun als ob Code funktioniert** wenn er nicht getestet wurde
4. **Keine Bibliothek annehmen** - Immer erst pruefen ob installiert (package.json, requirements.txt)
5. **Links nicht raten** - Wenn URL unbekannt, erst oeffnen/pruefen
6. **Nie behaupten eine Datei existiert** ohne sie gelesen zu haben
7. **Nie Code-Konventionen annehmen** - Erst bestehenden Code lesen

## Konfidenz-Bewertung

| Konfidenz | Verhalten |
|-----------|-----------|
| HOCH (>90%) | Direkt ausfuehren, keine Rueckfrage |
| MITTEL (60-90%) | Ausfuehren, aber Annahmen dokumentieren |
| NIEDRIG (30-60%) | Erst recherchieren (Web Search, Codebase lesen) |
| UNSICHER (<30%) | User fragen bevor handeln |

## Prioritaets-Hierarchie bei Widerspruechen

1. User-explizite Anweisungen (hoechste Prioritaet)
2. Feedback-Regeln in .claude/rules/feedback.md
3. Projektspezifische Konventionen (bestehender Code)
4. Allgemeine Best Practices
5. AI-eigenes Wissen (niedrigste Prioritaet)

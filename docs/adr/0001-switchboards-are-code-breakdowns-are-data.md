# Switchboards are code; Breakdowns are data

Breakdown Sentences are stored as plain data files. Each Switchboard is instead a small program: it takes the current Switch settings and builds the Pieces, the Translation and the "what changed" note. A single Switchboard covers 864–2,700 combinations of Options, and the grammar involves fused syllables, sound changes (e.g. after 안/못 in Korean) and combinations that aren't allowed, which a table of rules in data couldn't express well. Both views share one model of Sentence, Phrase and Piece, and one display layer, so they look and behave the same. Claude writes the Switchboard programs, so they being code rather than hand-editable data is an accepted cost.

## Considered Options

- **Every combination written out as data**: rejected, because thousands of combinations per Switchboard can't be maintained.
- **Switchboard rules as data, with no code**: rejected, because the existing Korean and Cantonese Switchboards already need logic that data rules can't express.

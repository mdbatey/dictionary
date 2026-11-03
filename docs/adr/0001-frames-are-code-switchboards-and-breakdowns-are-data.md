# Frames are code; Switchboards and Breakdowns are data

Breakdown Sentences are stored as plain data files. Switchboard grammar is code: for each Language, each Frame (intransitive, transitive, giving…) is a small program that takes the current Switch settings and Words and builds the Pieces, the Translation and the "what changed" note. A Switchboard itself is then just data on top of a Frame: which Frame, which Words it starts with, and which Switches it shows. A new Switchboard on an existing Frame, or a new Word, needs no code. Code is only needed the first time a Language uses a Frame.

We chose this because a single Switchboard covers 864–2,700 combinations of Options, and the grammar involves fused syllables, sound changes (e.g. after 안/못 in Korean), honorific verbs and combinations that aren't allowed. A table of rules in data couldn't express that well. Both views share one model of Sentence, Phrase and Piece, and one display layer. Claude writes the Frame programs, so the fact that they are code rather than hand-editable data is an accepted cost.

## Considered Options

- **Every combination written out as data**: rejected, because thousands of combinations per Switchboard can't be maintained.
- **Switchboard rules as data, with no code**: rejected, because the existing Korean and Cantonese Switchboards already need logic that data rules can't express.
- **One program per Switchboard** (as the old pages did): rejected, because Switchboards that share a sentence shape would repeat the same grammar code.

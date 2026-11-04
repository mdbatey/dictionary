# Adding a Set of Sentences

A **Set** is a named, ordered group of Sentences in one Language, shown on the Breakdowns tab. It has numbered chips, comparison links and a closing summary. A Set is pure data: no code changes.

## 1. Decide first

- **Theme and name:** e.g. "Questions", or "The Danish Dozen". The `id` appears in addresses, e.g. `#/zh/breakdowns/questions`.
- **Source:** imported from an old page (see [adding-a-language.md](adding-a-language.md), step 5), or written from scratch. If from scratch, decide with the owner who checks accuracy.
- **Order:** which Sentences build on which, and which pairs are worth comparing.

## 2. Where it goes

Add the Set to the Language's `sets` array in `src/content/<language>.ts`. If the file gets long, put the Set in its own file, e.g. `src/content/<language>-<set>.ts`, and import it. The Breakdowns tab opens on a Language's first Set.

## 3. Writing each Sentence

| Field | Rules |
|---|---|
| `id` | Unique within the Set. Usually `'1'`, `'2'`…; it's shown on the chips. |
| `translation` | A natural English translation, not the literal gloss. |
| `explanation` | Markdown. Bold is `**…**`; a link to another Sentence in the Set is `[#3](sentence:3)`. |
| `compareWith` | Optional: the id of the Sentence it should be compared with. |
| `parts` | Phrases in order, with punctuation as plain strings (e.g. `'.'`, `'。'`). |

Each **Phrase** has a `type` (subject, object, indirect-object, verb-phrase, modifier or question), a `caption`, and its `pieces`.

Each **Piece** has:
- `script`;
- `pron`, keyed by Pronunciation System id. Store the default system, or the source of a derived default, e.g. Jyutping for Yale;
- `gloss`: literal and short. It may be `''`, which keeps alignment;
- `role`: a site-wide Role id that the Language lists;
- optionally a `note` for this Sentence (Markdown), `changed: true` if it differs from the compared Sentence, and `fuse` / `dropped` for special cases.

The **summary** goes in the Set's `summary`: a list of `{ text, sentences? }`. Link to Sentences inline with `[#3](sentence:3)`, or list their ids in `sentences`.

## 4. Keep in mind

- **One line per Sentence.** A Sentence shrinks to fit the phone's width, down to 72 %, then scrolls sideways. About 8–9 Pieces fit at 390 px. Longer Sentences scroll slightly, which the owner accepted in #6.
- **Tonal Languages:** each Piece's tone-bearing pronunciation must split into **one syllable per character** (e.g. 苹果 → píng guǒ). The check reports it if not.
- **Reuse wording** from the Language's existing Sets and Role rules, so the Set feels consistent.

## 5. Done when

- `npm run check` passes. It catches unknown Roles, missing pronunciations, mismatched tone syllables, and comparison or summary links to Sentences that don't exist.
- In the browser, at phone width, in light and dark mode:
  - the chips jump to each Sentence,
  - comparison links work and changed Pieces are outlined,
  - summary links go to the right Sentences,
  - the detail panel shows each Note and the Role's rule.
- The PR states the source and how accuracy was checked.

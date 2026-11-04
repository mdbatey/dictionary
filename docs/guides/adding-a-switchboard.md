# Adding a Switchboard (or Words)

Per ADR 0001, **Frames are code; Switchboards and Words are data.** First work out which case applies:

| Case | Example | Work |
|---|---|---|
| **A. Add Words only** | Another recipient for the Korean giving Switchboard | Data. The Words appear automatically in every Switchboard whose slot they fit. |
| **B. New Switchboard on an existing Frame** | A second Korean giving Switchboard with different starting Words or fewer Switches | Data only |
| **C. New Frame** | The first "Who + Verb" (intransitive) Switchboard in a Language | Frame code + data. Usually its own ticket. |

The existing Frames are `ko-giving`, `zh-giving` and `yue-giving`, in `src/frames/` and registered in `src/frames/index.ts`.

## Words (all cases)

Words live in `src/content/<language>-words.ts` (see `Word` in `src/model.ts`).

| Field | Notes |
|---|---|
| `id`, `script`, `meaning`, `wordClass` | `meaning` is English. A Word Switch shows it as the Option label, capitalized. |
| `gloss`, `pron`, `note` | `gloss` is used when it differs from `meaning` (e.g. "grandma"). |
| `facts` | Grammar facts the Frame needs: `person`, `number`, `honorific`. |
| `tags` | Tags a slot can require: **person** (recipients), **thing** (objects). |
| `frames` | For verbs: the Frames the verb fits. |
| `honorificOf` | The Honorific Link, e.g. 드리다 → 주다. An honorific recipient brings it in. |
| `forms` | Stored Forms by name, e.g. pronoun `plain` / `polite` / `suffix`, or the Korean verb stem blocks `inf`, `pastV`…. Regular Forms should come from rules; store only what the rules can't work out. |

**A Word Switch offers every Word that fits the slot:** the right `wordClass`, every Tag the slot requires and, for verbs, the Frame. So adding a Word with the right class and Tags is all case A needs.

The checks fail the build if a Word is missing a Form or fact its Frame needs (each Frame's `slots` list them), or if no Word fits a Word Switch's slot.

## Case B: the Switchboard file

Add an entry to `src/content/<language>-switchboards.ts`:
- `id` and `name`. The address is `#/<language>/switchboards/<id>`.
- `frame`.
- `words`: fixed Words for slots without a Word Switch.
- `switches`, in display order:
  - **Grammar Switches:** `{ kind: 'grammar', options: [{ id, label, sub?, hint? }] }`. `sub` is a short native label, e.g. 해요체.
  - **Word Switches:** `{ kind: 'word', slot }`.
- `start`: the starting setting for every Switch. Reset returns here.

## Case C: a new Frame

Create `src/frames/<language>-<shape>.ts`, exporting a `Frame` (see `src/frames/types.ts`), and register it in `src/frames/index.ts`.
- `slots`: what each slot accepts (`wordClass`, `tags`) and what its Words must have (`forms`, `facts`).
- `grammar`: the Grammar Switch ids it understands.
- `disallowed(grammar)` (optional): `{ switchId: { optionId: reason } }` for combinations that aren't allowed. Blocked Options are then disabled with the reason, `allSettings` skips them, and `applyChoice` moves a Switch off an Option that just became blocked.
- `build(words, grammar, language)`: returns the Phrases (Pieces with `script`, `pron`, `gloss`, `role`, and optionally `note`, `fuse`, `dropped`), the punctuation and the English `translation`.

Keep grammar rules in the Frame, and keep everything about specific Words (spellings, notes, irregular Forms) in the word list.

## Tests (test point 2: "What does this Switchboard show?")

Add a `describe` block to `src/switchboard.test.ts`, following the Korean, Mandarin and Cantonese blocks:
- **The starting settings match the answer key.**
- **Every sample in the answer key matches:** script, pronunciation, gloss, Role, punctuation and Translation. The answer key goes in `src/fixtures/<language>-<shape>-samples.json`.
  - **From an old page:** run its grammar code to record the samples (see `tools/import/extract-switchboard.example.cjs`), then run a one-off check of *every* allowed combination, notes included.
  - **From scratch:** there's no old page, so the owner (or whoever they choose) confirms a small set of samples. Those become the answer key.
- **Every allowed combination builds** (`allSettings`). Assert the expected count if there are blocked combinations.
- **Word Switches offer the expected Words.**
- **Blocked Options are disabled with their reasons and reset** (`disabledOptions`, `applyChoice`), if the Frame has `disallowed`.

Case A only needs the existing tests to still pass. They build every combination with every Word that fits, so a new Word that breaks the Frame fails them.

## Done when

- `npm run check` passes.
- In the browser, at phone width, in light and dark mode:
  - the Switchboard is listed on the Switchboards tab,
  - flipping each Switch outlines only what changed,
  - blocked Options show their reasons,
  - Reset works, and the Sentence stays docked while scrolling,
  - the Sound picker and tone colours are right for the Language.
- The PR states where the grammar came from and how it was checked.

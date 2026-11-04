# Adding a Language

A new Language is new content, not new features. The screens, toolbar, Sound picker, tone colours and checks all work from the Language's data. Code is only needed for a pronunciation converter or a Switchboard Frame.

**First run:** Danish (#9) was deferred out of v1 to be the first Language added with this guide. Its old page is `reference/breakdowns/danish-dozen.html`.

## 1. Decide first (a short `/grill-with-docs`)

| Question | Examples |
|---|---|
| Where does the content come from? | An old page in `reference/` (import it), or written from scratch (who checks accuracy?) |
| Ids and names | `id: 'da'`, `name: 'Danish'`, `nativeName: 'Dansk'`, `tag: 'da'` (the BCP 47 tag for the `lang` attribute) |
| Pronunciation Systems: which are **stored**, and which are **derived** (worked out from a stored one)? Which is shown first? | Cantonese stores Jyutping and derives Yale and IPA, showing Yale first. Korean stores Romanization (Dozen) and Revised Romanization + IPA (Switchboard); both romanizations are labelled "Romanization" so the Language uses one name. |
| Is it tonal? How are tones written? | `tones: { system: 'pinyin', style: 'marks' }` or `{ system: 'jyutping', style: 'numbers' }` |
| Which Roles does it use? Does it need Roles the site doesn't have yet? | Danish uses `definite` and `preposition`, which already exist |
| The first Set of Sentences | See [adding-a-set.md](adding-a-set.md) |
| A Switchboard now, or later? | See [adding-a-switchboard.md](adding-a-switchboard.md) |

## 2. Files

| What | Where |
|---|---|
| The Language | `src/content/<name>.ts`, exporting a `Language` (see `src/model.ts`). Use `src/content/mandarin.ts` as a template. |
| Register it | Add it to `languages` in `src/content/index.ts`. The order there is the language picker's order. |
| Word list and Switchboards (when added) | `src/content/<name>-words.ts` and `src/content/<name>-switchboards.ts` |

The `Language` object holds:
- `roles`: one entry per Role used, keyed by the site-wide Role id, each with **this Language's** general rule and an optional label. For example, Mandarin labels `possessive` as "的 · possessive / descriptive".
- `pronunciationSystems`: each `{ id, label }`, with `derive: { from, rule }` for derived systems.
- `defaultPronunciation`: the system shown first. It can be a derived one.
- `tones` (if tonal), `sets`, `words` and `switchboards`.

## 3. New Roles (only if needed)

1. Add the Role to `src/content/roles.ts`, with a label and a style: `chip`, `text` or `inverted`.
2. Add its colour token `--role-<id>` to `src/styles/tokens.css`, as `light-dark(<light>, <dark>)` when the two differ.
   - Text-styled Roles need **4.5:1 contrast** on both backgrounds.
   - Chip colours need 4.5:1 against `--chip-ink`.
   - Pick a colour that differs from its neighbours in the same Language.
3. Add a sample character to `samples` in `src/colors.ts`.
4. **Ask the owner to approve the colour** on the colour key page (`/dictionary/colors.html`). They approved the palette in #3, and any addition is theirs to accept. The page shows only the device's current mode, so check it once in light mode and once in dark.

## 4. Pronunciation converters (only for derived systems)

1. Write the converter, e.g. `src/jyutping.ts`, which converts Jyutping to Yale and IPA syllable by syllable.
2. Add its rule name to `PronunciationSystem['derive']['rule']` in `src/model.ts`, and a case to `derivedPron` in `src/derive.ts`.
3. **Check it against an answer key** before trusting it, e.g. the old Cantonese Switchboard's Yale and IPA tables. Use a one-off script, and say in the PR what it matched.

The content checks then fail the build for any Piece whose derived pronunciation can't be worked out.

## 5. Importing from an old page

For pages in the "Dozen" format (Mandarin, Cantonese and Danish all use it), `tools/import/` has the scripts:

1. `node tools/import/extract-dozen.cjs reference/breakdowns/<page>.html <out>.json` runs the page's data section in a sandbox and saves it as JSON.
2. Write a config like `tools/import/mandarin-dozen.config.json`: ids, names, the old-Role → site-Role map and Pronunciation Systems.
3. `python3 tools/import/gen_dozen.py <out>.json src/content/<name>.ts <config>.json` generates the Language file. It converts `<b>` → `**bold**` and `#N` links → `[#N](sentence:N)`.
4. **One-off fidelity check:** a throwaway test comparing every Sentence, Piece, Note, comparison, rule and summary point with the extracted JSON. Delete it before committing, and report the result in the PR.

The only intended changes are the site-wide colours, Phrase Types (if the old page used box colours) and Markdown instead of HTML. Anything else that differs is a bug.

## 6. Done when

- `npm run check` passes.
- The language picker lists the Language, and its first Set works at phone width, in light and dark mode.
- The Sound picker offers the right systems. Tone colours and the tone key are right (tonal Languages only).
- The colour key page shows any new Roles, and the owner has approved them.
- The PR states where the content came from and how accuracy was checked.

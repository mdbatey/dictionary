# v1: Base

**Goal:** rebuild everything the old pages in `reference/` already do on one shared base: data-driven Breakdowns, Switchboards built on Frames and Words, one set of design tokens, published on GitHub Pages.

**Status:** planned. All 12 tickets are GitHub issues (sub-issues of #1). The issues are the source of truth, so update them rather than this file.

- **Spec:** [#1](https://github.com/mdbatey/dictionary/issues/1)
- **Vocabulary:** `GLOSSARY.md`
- **Architecture:** `docs/adr/`

## Changes since the spec was written

- **Design tokens.** Every color (Roles, Phrase Types, tones) and the shared look (fonts, spacing, rounding) are defined once, by name, with a light and a dark value. Everything else refers to those names, so changing a color is a one-line edit.
- **Korean "Who + Verb" moved to v2.** v1 rebuilds what already exists. Words are still proven in v1 through the Korean giving Switchboard (pronoun Words, Grandma with the Honorific Link 드리다 → 주다).

Both changes are noted in a comment on #1.

## Tickets

The site is titled **Dictionary Layers**. Each ticket is built on its own branch and opened as a pull request for the owner to merge.

| Ticket | Issue | Blocked by |
|---|---|---|
| 1. Walking skeleton: one Korean Sentence live on GitHub Pages | [#2](https://github.com/mdbatey/dictionary/issues/2) | none |
| 2. Design tokens and colour review | [#3](https://github.com/mdbatey/dictionary/issues/3) | #2 |
| 3. Getting around: language picker, header and addresses | [#4](https://github.com/mdbatey/dictionary/issues/4) | #2 |
| 4. Piece detail panel, colour-key filter and layer toggles | [#5](https://github.com/mdbatey/dictionary/issues/5) | #2 |
| 5. The Korean Dozen as the first Korean Set | [#6](https://github.com/mdbatey/dictionary/issues/6) | #2, #3 |
| 6. The Mandarin Dozen, the sound picker and tone colours | [#7](https://github.com/mdbatey/dictionary/issues/7) | #6 |
| 7. The Cantonese Dozen with Jyutping, Yale and IPA | [#8](https://github.com/mdbatey/dictionary/issues/8) | #7 |
| 8. The Danish Dozen | [#9](https://github.com/mdbatey/dictionary/issues/9) | #6 |
| 9. Korean giving Switchboard built on Words | [#10](https://github.com/mdbatey/dictionary/issues/10) | #3 |
| 10. Switchboard controls and feedback | [#11](https://github.com/mdbatey/dictionary/issues/11) | #10, #5, #7 |
| 11. Mandarin giving Switchboard | [#12](https://github.com/mdbatey/dictionary/issues/12) | #10, #7 |
| 12. Cantonese giving Switchboard | [#13](https://github.com/mdbatey/dictionary/issues/13) | #10, #8 |

**Order:**
- #2 starts first.
- After #2: #3, #4 and #5 can run in parallel.
- After #3: #6 and #10.
- After #6: #7 and #9.
- After #10: #11, #12 and #13, once their other blockers are done.

Each issue has the full "what to build" and acceptance criteria.

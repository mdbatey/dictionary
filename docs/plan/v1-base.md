# v1: Base

**Goal:** rebuild everything the old pages in `reference/` already do on one shared base: data-driven Breakdowns, Switchboards built on Frames and Words, one set of design tokens, published on GitHub Pages.

**Status:** planned. These 12 tickets are drafts; none have been created as GitHub issues yet.

- **Spec:** [#1](https://github.com/mdbatey/dictionary/issues/1)
- **Vocabulary:** `GLOSSARY.md`
- **Architecture:** `docs/adr/`

## Changes since the spec was written

- **Design tokens.** Every color (Roles, Phrase Types, tones) and the shared look (fonts, spacing, rounding) are defined once, by name, with a light and a dark value. Everything else refers to those names, so changing a color is a one-line edit.
- **Korean "Who + Verb" moved to v2.** v1 rebuilds what already exists. Words are still proven in v1 through the Korean giving Switchboard (pronoun Words, Grandma with the Honorific Link 드리다 → 주다).

When the tickets are created, add a comment on #1 noting both changes. Don't edit the spec itself.

## When the tickets are created

- Each becomes a GitHub issue labelled `v1` and `ready-for-agent`, as a sub-issue of #1, with native "blocked by" links.
- Once all 12 exist, replace the ticket details below with links to the issues.

## Tickets

Every ticket is a thin, end-to-end slice that can be seen working on its own.

| # | Ticket | Blocked by |
|---|---|---|
| 1 | Walking skeleton: one Korean Sentence live on GitHub Pages | none |
| 2 | Design tokens and color review | 1 |
| 3 | Getting around: language picker, header and addresses | 1 |
| 4 | Piece detail panel, color-key filter and layer toggles | 1 |
| 5 | Korean in 13 Sentences as the first Korean Set | 1, 2 |
| 6 | The Mandarin Dozen, the sound picker and tone colors | 5 |
| 7 | The Cantonese Dozen with Jyutping, Yale and IPA | 6 |
| 8 | The Danish Dozen | 5 |
| 9 | Korean giving Switchboard built on Words | 2 |
| 10 | Switchboard controls and feedback | 9, 4, 6 |
| 11 | Mandarin giving Switchboard | 9, 6 |
| 12 | Cantonese giving Switchboard | 9, 7 |

**Order:**
- 1 starts first.
- After 1: tickets 2, 3 and 4 can run in parallel.
- After 2: tickets 5 and 9.
- After 5: tickets 6 and 8.
- After 9: tickets 10, 11 and 12, once their other blockers are done.

### 1. Walking skeleton: one Korean Sentence live on GitHub Pages

**What to build:** the smallest end-to-end site. One Sentence from *Korean in 13 Sentences* shows on the live GitHub Pages site, with aligned Gloss / script / pronunciation layers and Role colors. A GitHub Action runs the checks and publishes on every push to `main`. The first rule of the "Is the content valid?" check is in place.

- [ ] The site builds with Vite and TypeScript and is published to GitHub Pages by a GitHub Action on every push to `main`
- [ ] One Korean Sentence shows with its Pieces' Gloss, script and pronunciation stacked and aligned, coloured by Role
- [ ] The content check runs in the build and returns zero problems for real content
- [ ] A Piece with a Role its Language doesn't have makes the content check (and so the build) fail
- [ ] Looks right at phone width in light and dark mode

### 2. Design tokens and color review

**What to build:** one place that defines every color by name, with a light and a dark value. That covers each Role, each Phrase Type and each tone, plus the shared fonts, spacing and rounding. A color key preview page shows every Role and Phrase Type on sample Pieces in light and dark mode. The owner reviews the colors on this page and approves or changes them before any content is moved over.

- [ ] Every color used by the site comes from a named token; no raw colors anywhere else
- [ ] Changing one token's value changes that color everywhere it is used, in light and dark mode
- [ ] The site-wide Role list gives each Role one token, a display style, a label and a general rule
- [ ] The starting palette follows the style guide: yellow = subject marker, teal = stem, pink = tense, cyan = politeness
- [ ] The preview page shows every Role, Phrase Type and tone color on sample Pieces, in light and dark mode
- [ ] The owner has reviewed and approved the colors

### 3. Getting around: language picker, header and addresses

**What to build:** on a first visit, a language picker. After that, the site reopens on the Language and view used last. A shared header switches Language and switches between Breakdowns and Switchboards. Every view has a bookmarkable address, and the back button works. A Language with no Switchboards shows "none yet".

- [ ] First visit shows a language picker; later visits reopen the last Language and view
- [ ] The site still works if browser storage is unavailable
- [ ] The header switches Language and view on every page
- [ ] Every view, Set, Sentence and Switchboard has its own address; back and forward work
- [ ] A Language without Switchboards shows "none yet" on the Switchboard tab

### 4. Piece detail panel, color-key filter and layer toggles

**What to build:**
- Tapping a Piece opens a detail panel with the large script, Role, Gloss, pronunciation, the Role's general rule and the Piece's Note, plus Previous/Next buttons.
- A collapsible color key lists the Roles on the page; tapping a Role highlights only its Pieces.
- Gloss, pronunciation and Phrase outlines can each be turned on and off.

- [ ] Tapping a Piece opens the detail panel with all the fields above; Previous/Next step through Pieces
- [ ] The color key lists only the Roles used on the page and can be collapsed
- [ ] Tapping a Role highlights its Pieces and dims the rest; tapping again clears it
- [ ] Gloss, pronunciation and Phrase outline layers each toggle on and off
- [ ] Respects reduced motion; tap targets are at least 44px

### 5. Korean in 13 Sentences as the first Korean Set

**What to build:** all 13 Sentences of *Korean in 13 Sentences* moved over as-is to form the first Korean Set:
- Phrase Types replace the old box colors 1–5.
- Explanations and the summary are in Markdown.
- Each Sentence has its Translation.
- Numbered Sentence chips appear in a sticky bar.
- Comparison links mark the Pieces that changed.
- A summary closes the Set, with links back to its Sentences.

- [ ] All 13 Sentences, Pieces, Notes and Explanations match the old page apart from the intended changes (colors, Phrase Types, Markdown)
- [ ] Each Phrase is outlined in its Phrase Type's color, with its caption
- [ ] Sticky numbered chips jump to each Sentence
- [ ] Comparison links work and changed Pieces are marked
- [ ] The Set summary shows, and its links go to the right Sentences
- [ ] A comparison or summary link to a Sentence that doesn't exist fails the content check

### 6. The Mandarin Dozen, the sound picker and tone colors

**What to build:**
- The Mandarin Dozen moved over as the first Mandarin Set.
- Each Language lists its Pronunciation Systems and a default; a sound picker shows only that Language's systems.
- Tone colors for Mandarin can be turned on and off.

- [ ] All 12 Mandarin Sentences match the old page apart from the intended changes
- [ ] Each Language declares its Pronunciation Systems and default; the sound picker lists only those
- [ ] Mandarin shows tone-marked Pinyin; tone colors toggle on and off
- [ ] A Piece missing a pronunciation in its Language's default system fails the content check

### 7. The Cantonese Dozen with Jyutping, Yale and IPA

**What to build:** the Cantonese Dozen moved over as the first Cantonese Set. Jyutping is stored. Yale and IPA are worked out automatically from it, syllable by syllable. Cantonese has tone colors too.

- [ ] All 12 Cantonese Sentences match the old page apart from the intended changes
- [ ] The sound picker offers Jyutping, Yale and IPA; Yale and IPA are derived, not stored
- [ ] Cantonese tone colors toggle on and off

### 8. The Danish Dozen

**What to build:** the Danish Dozen moved over as the first Danish Set. It uses the respelling pronunciation, off by default, and keeps suffixes such as *-et* and *-s* as their own Pieces.

- [ ] All 12 Danish Sentences match the old page apart from the intended changes
- [ ] The pronunciation layer starts off for Danish and can be turned on
- [ ] Attached suffixes show as separate Pieces with their own Role

### 9. Korean giving Switchboard built on Words

**What to build:** the first Frame, the first word list and the first Switchboard.
- **Frame:** the Korean giving Frame ("I give the apple to Minho") written as code.
- **Word list:** pronouns carrying person and number; Minho; Grandma, carrying "is honorific"; the apple; and 드리다 with its Honorific Link to 주다. Nouns carry **person** or **thing** Tags.
- **Switchboard:** a data file naming the Frame, its starting Words and its Switches (who, level, tense, negate, type, to). Who and To are Word Switches.
- **Screen:** a basic page where flipping a Switch replaces and highlights only the affected Pieces.

- [ ] Flipping any Switch changes only the affected Pieces, and they are highlighted
- [ ] Choosing Grandma brings in 드리다 instead of 주다
- [ ] Who and To offer Words automatically from the word list, filtered by word class and Tag
- [ ] "What does this Switchboard show?" tests: all 864 combinations build a Sentence and a Translation
- [ ] Sample combinations captured from the old Korean Switchboard match it exactly (script, pronunciation, Gloss and Role per Piece, plus Translation)
- [ ] A Switchboard naming an unknown Frame, Switch or Word, or a Word missing a grammar fact its Frame needs, fails the content check

### 10. Switchboard controls and feedback

**What to build:** the full Switchboard experience from the old pages:
- the Before → Now line and "what changed" note,
- Changed/Same markers per slot, the register hint and Reset,
- Options that can't combine shown disabled with a reason,
- the Sentence staying on screen while scrolling,
- a searchable list for Word Switches with many Words,
- the detail panel and sound picker working on Switchboards.

- [ ] Each flip shows Before → Now and a short "what changed" note
- [ ] Changed/Same markers and the register hint show; Reset restores the starting settings
- [ ] Disallowed Options are disabled with a reason and never build a Sentence
- [ ] The Sentence stays docked while scrolling through Switches
- [ ] A Word Switch with many Words shows a searchable list
- [ ] Tapping a Piece opens the detail panel; the sound picker works

### 11. Mandarin giving Switchboard

**What to build:** the Mandarin giving Frame and word list, and the Mandarin Switchboard (who, time, negate, type, object). Disallowed combinations include A不A disabling Negate.

- [ ] All allowed combinations build; disallowed ones are disabled with a reason
- [ ] Sample combinations captured from the old Mandarin Switchboard match it exactly
- [ ] Who offers pronoun Words, including 您 carrying "is honorific"; the object is a Word Switch

### 12. Cantonese giving Switchboard

**What to build:** the Cantonese giving Frame and word list, and the Cantonese Switchboard (who, time, negate, type, object, ending), with its disallowed combinations (e.g. A-not-A disables Negate, and the restrictions on 喇).

- [ ] All allowed combinations build; disallowed ones are disabled with a reason
- [ ] Sample combinations captured from the old Cantonese Switchboard match it exactly
- [ ] Who and the object are Word Switches

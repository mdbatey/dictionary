# v3: Explore words

**Goal:** make the word lists something you can look things up in. See a Word with all its Forms, jump from a Piece in a Sentence to its Word, and search by English meaning (e.g. "sleep" → 자다) to see the Word in Sentences and Switchboards.

**Status:** ideas and decisions captured. Needs its own grilling and spec before tickets.

**Depends on:** v1 complete. It's best after v2, so the word lists are larger and used by more Switchboards.

## What's in it

| Item | Depends on | Notes |
|---|---|---|
| A page for each Word | — | Shows all its Forms (e.g. go · goes · went · gone · going) and its links (e.g. 드리다 ↔ 주다). |
| Tapping a Breakdown Piece shows its Word | — | Breakdown Pieces get linked to the Word they come from. |
| Word search | Word page, Piece → Word links | Type "sleep" → 자다, with its Forms, the Sentences using it, and the Switchboards it fits. |
| Home page | Word search | Something to show beyond the language picker. |

## Already decided (from the v1 grilling)

- **One Word holds all its Forms.** "Went" is a Form of "go", not its own entry. Looking up a Form leads back to its Word.
- **The same spelling can be a Form of two Words** (Spanish *fui* = "I went" and "I was"). Looking it up shows both.
- **Separately written words are separate Words** ("will go" = will + go). Always-attached endings (-었-, -요, -et) are explained by their Role and Note, not as Words.
- **Search goes both directions.** English meaning → Word (type "sleep"), and script or romanization → Word (type 자다 or "jada").
- **Search results link into Switchboards** with the Word already selected, e.g. opening the Korean "Who + Verb" Switchboard on 자다.

## Open questions for v3's grilling

- How do Breakdown Pieces get linked to Words: added by hand when content is written, or matched automatically with a manual override?
- Does search cover all Languages at once or only the current one?
- Should a Word page list every Form, including rule-made ones, or only the common ones, with the rest expandable?
- What goes on the home page: Language tiles, a search box, recently viewed items, "word of the day"?
- Should Words get example Sentences of their own, or only show the Sentences that already use them?

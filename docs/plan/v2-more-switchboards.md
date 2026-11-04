# v2: More Switchboards

**Goal:** use the Words and Frames built in v1 to add new Switchboards cheaply. Each Switchboard swaps verbs, nouns and later adjectives in and out of a reusable sentence shape.

**Status:** ideas and decisions captured. Needs its own grilling and spec before tickets.

**Depends on:** v1 complete, in particular the Korean giving Switchboard (Frames, word list, Word Switches) and the Mandarin and Cantonese Switchboards.

## What's in it

| Item | Notes |
|---|---|
| Korean "Who + Verb" Switchboard | Intransitive Frame ("I run", "I dance"). Moved here from v1. |
| "Who + Verb" Switchboards for Mandarin, Cantonese and Danish | One intransitive Frame per Language. |
| Danish giving Switchboard | Danish has Breakdowns but no Switchboard after v1. |
| Danish IPA and other content improvements | v1 moved the Danish content over as-is, with respelling only. |
| Adjective Frames | "I eat the **big** apple" / "The apple is **big**". |
| Searchable list for Word Switches with many Words | Moved from v1 (#11): only matters once the word lists grow. |

## Already decided (from the v1 grilling)

- **A Switchboard is data on top of a Frame** (ADR 0001). A new Switchboard on an existing Frame needs no code. Code is only needed the first time a Language uses a Frame, so each item above needs Frame code once per Language.
- **Word Switches fill themselves automatically.** Every Word in the Language's word list that fits the slot's word class and Tags is offered. Adding a verb makes it appear in every Switchboard whose Frame it fits.
- **Verbs say which Frames they fit:** intransitive, transitive or giving. That stops "I run the apple to Minho".
- **Regular Forms come from rules; only irregular Forms are stored.** Every Form is labelled with the same names as the Switch Options.
- **A Word Switch with many Words becomes a searchable list.** On screen, it looks like any other Switch.

### Korean "Who + Verb": agreed starting verbs

| Verb | Meaning | Why it's included |
|---|---|---|
| 가다 | go | vowel stem, fuses (가요) |
| 자다 | sleep | vowel stem, fuses (자요) |
| 달리다 | run | ㅣ stem → 달려요 |
| 춤추다 | dance | ㅜ stem → 춤춰요 |
| 쉬다 | rest | stays separate (쉬어요) |
| 일하다 | work | 하다 verb → 일해요 |
| 걷다 | walk | irregular ㄷ → 걸어요 |
| 울다 | cry | ㄹ stem, changes in some Forms |

Switches: who, verb, tense, politeness level, negation, statement/question. It reuses the Korean politeness, tense, negation and sound-change rules from the giving Frame.

### Adjective Frames: what each Language will show

- **Korean:** adjectives conjugate like verbs (커요, 컸어요), so "The apple is big" is the natural first Frame.
- **Danish:** adjectives change with the noun's gender and definiteness (*en stor bil / et stort hus / den store bil*), so nouns need their gender as a grammar fact.
- **Mandarin and Cantonese:** adjectives don't change form; the interest is in 很 and in how adjectives come before nouns with 的 / 嘅.

## Open questions for v2's grilling

- Which verbs start the Mandarin, Cantonese and Danish "Who + Verb" Switchboards?
- Should there be a transitive Frame ("I eat the apple") too, and in which Languages first?
- Which adjective Frame comes first, attributive ("the big apple") or predicative ("the apple is big"), and in which Languages?
- What does the Danish giving Switchboard's Switch set look like (Danish has no politeness levels; does it get definiteness or word-order Switches instead)?
- Which Pronunciation System should Danish IPA follow, and should the respelling stay as an option?
- Do new Tags beyond **person** and **thing** become necessary once more nouns are added?

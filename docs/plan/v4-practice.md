# v4: Practice

**Goal:** move from looking at grammar to practising it: flashcards drawn from the word lists and Sentences, audio, and quicker navigation in the detail panel.

**Status:** ideas and decisions captured. Needs its own grilling and spec before tickets.

**Depends on:** v3. Flashcards work best when Words are connected to the Sentences that use them.

## What's in it

| Item | Notes |
|---|---|
| Flashcards | Cards drawn from the word lists and/or Sentences, with review scheduling. |
| Audio / text-to-speech | None of the old pages had audio; this is new. |
| Keyboard and swipe extras | Arrow keys and swipe-to-close in the detail panel (the old Mandarin, Cantonese and Danish pages had swipe-to-close). |

## Already decided (from the v1 grilling)

- **Flashcards were deliberately left until the word lists exist,** so we can decide what a card is with real content in hand.
- **Progress lives in the browser only.** There's no server and no accounts, so progress doesn't sync between your phone and laptop. Revisit only if that becomes a real problem.
- **Cards reuse the shared display.** A card shows a Piece, Word or Sentence with the same Role colors and layers as the rest of the site.

## Open questions for v4's grilling

- **What is a card?** A Word, a Form, a single Piece, or a whole Sentence, or a mix?
- **Which direction?** Script → meaning, meaning → script, listening → meaning, or several?
- **What review schedule?** A simple box system (wrong answers come back sooner) or a full spaced-repetition algorithm?
- **Can cards come from Switchboards?** For example "make the past polite form of 걷다" → 걸었어요.
- **Where does audio come from?** The browser's built-in speech voices (free, quality varies by Language and device) or recorded audio (better, but needs recordings)?
- **Where does audio play?** Per Piece, per Sentence, on cards, or all three?

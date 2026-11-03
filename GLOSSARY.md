# Dictionary

A personal language-study site that shows sentences in several languages taken apart piece by piece, so their grammar can be seen rather than just described.

## Content

**Language**:
A language the site teaches, together with the Roles and Pronunciation Systems it uses. Adding one adds content, not features.
_Avoid_: Locale, course

**Sentence**:
A target-language sentence made of Phrases in order, with its English Translation and an Explanation of how it works.
_Avoid_: Example, line

**Phrase**:
A group of adjacent Pieces that belong together as one unit of meaning, such as a subject or a verb phrase. It has a caption and a Phrase Type.
_Avoid_: Word box, chunk, word (when you mean the group)

**Phrase Type**:
What a Phrase does in its Sentence (subject, object, verb phrase, modifier, question). It is shown as the color of the Phrase's outline.
_Avoid_: Box color, category

**Piece**:
The smallest tappable unit of a Sentence: one morpheme or word, in its original script, with a Pronunciation, a Gloss, a Role and a Note.
_Avoid_: Morph, token, segment, syllable

**Role**:
The grammatical job a Piece does, such as negation, possessive or tense. Each Role has one fixed color across the whole site, and each Language uses only some of the Roles.
_Avoid_: Job, function, fn, part of speech

**Gloss**:
A literal, piece-by-piece English meaning of a Piece, as opposed to a natural Translation.
_Avoid_: Meaning, translation (when you mean the literal gloss)

**Translation**:
A natural, idiomatic English rendering of a whole Sentence.
_Avoid_: Gloss, English line

**Note**:
An explanation of what one Piece is doing in this particular Sentence. The general rule for its Role is a separate thing.
_Avoid_: Description (that is the Role's general rule)

**Explanation**:
A short write-up of how a whole Sentence works, shown alongside it.
_Avoid_: What, notes

**Pronunciation System**:
A way of writing how a Piece sounds, such as Pinyin, Jyutping, Yale, Revised Romanization or IPA. Each Language lists the systems it supports and which one it shows by default.
_Avoid_: Romanization (it is only one kind), sound mode

## Vocabulary

**Word**:
One dictionary entry in one Language: its dictionary form, Pronunciation, English meaning, word class, and the grammar facts the rules need (such as a noun's gender or "is honorific"). Each Language has its own word list. Anything that can be written on its own is a Word, including grammar words such as "will", 会 and 了. Endings that are always attached are not Words.
_Avoid_: Entry, lemma, vocab item, term

**Form**:
One written word that belongs to a Word, labeled by the grammar it expresses using the same names as Switch Options (e.g. "went" is the past Form of "go", and "habla" is the he/she + present Form of "hablar"). Regular Forms are worked out by the rules, and only irregular ones are stored, but every Form belongs to exactly one Word. The same spelling can be a Form of two different Words. Anything written as separate words is two Words, not one Form.
_Avoid_: Conjugation, inflection, variant

**Honorific Link**:
A labeled link from one Word to another Word that it replaces when speaking to or about someone honored, such as 드리다 "give (to someone honored)" → 주다 "give". It is a separate Word, not a Form.
_Avoid_: Synonym, alternate form

**Tag**:
A simple label on a Word that a Frame's slot can require, such as **person** (for a recipient) or **thing** (for an object).
_Avoid_: Category, type, semantic class

## Views

**Breakdown**:
The view that shows a Set of fixed Sentences, each taken apart into Phrases and Pieces.
_Avoid_: Dozen, lesson page

**Set**:
A named, ordered group of Sentences in one Language, with links between Sentences meant to be compared and a closing summary.
_Avoid_: Dozen, deck, lesson

**Switchboard**:
The view built around one Sentence whose grammar the learner changes by flipping Switches. Only the Pieces affected by a change are replaced. Each Switchboard is built on one Frame and states which Words it starts with and which Switches it shows.
_Avoid_: Generator, conjugator

**Switch**:
One thing the learner can change on a Switchboard. It has a label and a fixed or Word-based list of Options. Every Switch looks the same to the learner; there are two kinds behind the scenes.
_Avoid_: Toggle, control, setting

**Grammar Switch**:
A Switch that changes how the Sentence is said, such as tense, politeness, negation, or statement vs question.
_Avoid_: Mode

**Word Switch**:
A Switch that changes which Word fills a slot in the Frame, such as who, the verb, the object or the recipient. It automatically offers every Word in the Language's word list that fits the slot's word class and Tags. The Word's grammar facts can change other Pieces too (e.g. "he" changes the verb's Form; "Grandma" brings in an honorific verb).
_Avoid_: Vocab slot, word picker

**Option**:
One value a Switch can take, such as "past" for a tense Switch. Some combinations of Options are not allowed.
_Avoid_: Choice, value

**Frame**:
A reusable sentence shape with named slots, such as intransitive ("I run"), transitive ("I eat the apple") or giving ("I give the apple to Minho"). Each slot takes a word class and may require Tags. Each verb fits some Frames and not others. Many Switchboards can share one Frame.
_Avoid_: Template, pattern, sentence type

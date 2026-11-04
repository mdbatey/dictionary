import type { Language } from '../model';
import { cantoneseSwitchboards } from './cantonese-switchboards';
import { cantoneseWords } from './cantonese-words';

// Moved over as-is from reference/breakdowns/cantonese-dozen.html ("The Cantonese Dozen").
// Intended changes only: site-wide colours, and Markdown instead of HTML. Only Jyutping is stored;
// Yale and IPA are worked out from it (src/jyutping.ts).
export const cantonese: Language = {
  id: "yue",
  nativeName: "廣東話",
  name: "Cantonese",
  tag: "yue-Hant",
  tones: { system: 'jyutping', style: 'numbers' },
  roles: {
    noun: { rule: "A thing, person or place. Cantonese nouns take no article and never change form for singular or plural." },
    verb: { rule: "An action or state word. Cantonese verbs never conjugate for person, number or tense — separate time words, adverbs and complements do that work instead." },
    pronoun: { rule: "佢 is the everyday spoken pronoun for \"he,\" \"she\" AND \"it\" — one word, one sound, no gender or animacy distinction at all in speech." },
    plural: { rule: "哋 pluralizes a pronoun (我→我哋, \"I\"→\"we\"). 啲 does similar work before a noun to mean \"some/the [plural]\". Ordinary nouns like 蘋果 never change form themselves." },
    possessive: { label: "嘅 · possessive / descriptive", rule: "嘅 is Cantonese’s workhorse particle: after a noun it marks possession (\"X嘅Y\" = Y belonging to X); at the end of a description before nothing follows, it marks a simple statement of quality." },
    measure: { label: "個 · measure word", rule: "Cantonese requires a measure word between a number/demonstrative and most nouns. 個 is the general-purpose one. Paired with 呢 or 嗰 (呢個/嗰個), it also does the job English uses \"this one\"/\"that one\" — and often \"it\" — for." },
    demonstrative: { rule: "呢 (\"this\") and 嗰 (\"that\") point at something specific and combine with a measure word before a noun or in place of a pronoun." },
    "final-particle": { rule: "A short syllable glued to the very end of a sentence that colors its tone — questioning, softening, emphatic. Spoken Cantonese uses dozens of these; Mandarin has far fewer." },
    modal: { rule: "Words like 一定要 (must), 想 (want to) and 會 (will) sit directly before the main verb, with no auxiliary conjugation." },
    negation: { rule: "唔 negates whatever comes right after it. Doubled around a verb (V唔V), it also builds a yes/no question." },
    potential: { rule: "到, added after a verb and 唔, builds \"cannot manage to [verb]\" — 食唔到 = \"can’t eat [it].\" This whole pattern has no single-word equivalent in English." },
    time: { rule: "Time expressions like 聽日 (tomorrow) sit right after the subject, before the verb — there's no future-tense verb ending to place instead." },
    // From reference/switchboards/cantonese-switchboard.html (used by the giving Switchboard):
    tense: { label: "Aspect marker", rule: "咗 (done), 過 (ever) and 緊 (in progress) attach right after the verb. They show how the action unfolds, not when." },
    number: { label: "Number", rule: "一 and 兩 come before the measure word." },
    question: { label: "Question particle", rule: "嗎 turns a statement into a yes/no question. It sounds bookish in Cantonese; A-not-A questions are the everyday choice." },
    adverb: { rule: "Short adverbs like 就 sit between the time word and the verb, adding shades of immediacy or sequence." },
  },
  pronunciationSystems: [
    { id: "jyutping", label: "Jyutping" },
    { id: "yale", label: "Yale", derive: { from: "jyutping", rule: "jyutping-to-yale" } },
    { id: "ipa", label: "IPA", derive: { from: "jyutping", rule: "jyutping-to-ipa" } },
  ],
  // Yale by default (owner's preference); the old Dozen page showed Jyutping. Yale is worked out from the stored Jyutping.
  defaultPronunciation: "yale",
  sets: [
    {
      id: "cantonese-dozen",
      name: "The Cantonese Dozen",
      sentences: [
        {
          id: '1',
          translation: "The apple is red.",
          explanation: "Sets the baseline pattern **係 … 嘅** for \"X is [description],\" and introduces 蘋果 and 紅色, reused through the whole set.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "蘋果", pron: { jyutping: "ping4 gwo2" }, gloss: "apple", role: 'noun', note: "The basic noun for this whole set." },
            ] },
            { type: 'verb-phrase', caption: "is red", pieces: [
              { script: "係", pron: { jyutping: "hai6" }, gloss: "is", role: 'verb', note: "The linking verb \"to be.\"" },
              { script: "紅色", pron: { jyutping: "hung4 sik1" }, gloss: "red", role: 'noun', note: "Literally \"red color.\"" },
              { script: "嘅", pron: { jyutping: "ge3" }, gloss: "—", role: 'possessive', note: "嘅 closes out a simple description: 係…嘅 reads as \"is [a red one].\"" },
            ] },
          ],
        },
        {
          id: '2',
          translation: "It is John's apple.",
          explanation: "呢個 (literally \"this [one]\") does the job English uses the neutral pronoun \"it\" for — Cantonese prefers a demonstrative + measure word over a bare pronoun for \"this/it.\"",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "呢個", pron: { jyutping: "ni1 go3" }, gloss: "this (one)", role: 'measure', note: "呢 (\"this\") + 個 (measure word) together stand in for the subject — Cantonese has no separate neutral \"it\" here." },
            ] },
            { type: 'verb-phrase', caption: "is", pieces: [
              { script: "係", pron: { jyutping: "hai6" }, gloss: "is", role: 'verb', note: "Same linking verb as #1." },
            ] },
            { type: 'object', caption: "John's apple", pieces: [
              { script: "約翰", pron: { jyutping: "Joek3 hon6" }, gloss: "John", role: 'noun', note: "A phonetic transliteration of the English name." },
              { script: "嘅", pron: { jyutping: "ge3" }, gloss: "'s", role: 'possessive', note: "嘅 after a noun marks possession: 約翰嘅蘋果 = \"John’s apple.\"" },
              { script: "蘋果", pron: { jyutping: "ping4 gwo2" }, gloss: "apple", role: 'noun', note: "Same noun as #1." },
            ] },
          ],
        },
        {
          id: '3',
          translation: "I give John the apple.",
          explanation: "Cantonese’s double-object order is **畀 + thing + recipient** — the mirror image of Mandarin’s 给 + recipient + thing.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { jyutping: "ngo5" }, gloss: "I", role: 'pronoun', note: "First-person pronoun." },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "畀", pron: { jyutping: "bei2" }, gloss: "give", role: 'verb', note: "The verb \"to give.\"" },
            ] },
            { type: 'object', caption: "thing given", pieces: [
              { script: "個", pron: { jyutping: "go3" }, gloss: "[measure]", role: 'measure', note: "The general measure word, required before 蘋果 here." },
              { script: "蘋果", pron: { jyutping: "ping4 gwo2" }, gloss: "apple", role: 'noun', note: "No \"the\" — definiteness comes from context, not an article." },
            ] },
            { type: 'object', caption: "recipient", pieces: [
              { script: "約翰", pron: { jyutping: "Joek3 hon6" }, gloss: "John", role: 'noun', note: "The person receiving the apple." },
            ] },
          ],
        },
        {
          id: '4',
          translation: "We give him the apple.",
          explanation: "The only change from #3 is the subject, pluralized with the suffix **哋** — the giving pattern itself, 畀個蘋果, doesn’t move.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { jyutping: "ngo5" }, gloss: "I", role: 'pronoun', note: "The base pronoun \"I.\"" },
              { script: "哋", pron: { jyutping: "dei6" }, gloss: "[plural]", role: 'plural', note: "哋 attaches to a pronoun to pluralize it: 我(I)→我哋(we)." },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "畀", pron: { jyutping: "bei2" }, gloss: "give", role: 'verb', note: "Same verb as #3." },
            ] },
            { type: 'object', caption: "thing given", pieces: [
              { script: "個", pron: { jyutping: "go3" }, gloss: "[measure]", role: 'measure', note: "Same measure word." },
              { script: "蘋果", pron: { jyutping: "ping4 gwo2" }, gloss: "apple", role: 'noun', note: "Same noun." },
            ] },
            { type: 'object', caption: "recipient", pieces: [
              { script: "佢", pron: { jyutping: "keoi5" }, gloss: "him", role: 'pronoun', note: "The same pronoun used for \"he,\" \"she\" and \"it\" — context alone tells you which is meant." },
            ] },
          ],
        },
        {
          id: '5',
          translation: "He gives it to John.",
          explanation: "With no common spoken word for inanimate \"it,\" Cantonese reaches for **嗰個** (\"that one\") instead — a demonstrative doing a pronoun’s job.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "佢", pron: { jyutping: "keoi5" }, gloss: "he", role: 'pronoun', note: "The all-purpose third-person pronoun — \"he,\" \"she\" or \"it\" depending on context." },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "畀", pron: { jyutping: "bei2" }, gloss: "give", role: 'verb', note: "Same verb." },
            ] },
            { type: 'object', caption: "it (that one)", pieces: [
              { script: "嗰", pron: { jyutping: "go2" }, gloss: "that", role: 'demonstrative', note: "嗰 (\"that\") points back at something already mentioned — the apple." },
              { script: "個", pron: { jyutping: "go3" }, gloss: "[measure]", role: 'measure', note: "嗰個 together, \"that one,\" is how spoken Cantonese usually says \"it\" for an object — there's no everyday pronoun equivalent." },
            ] },
            { type: 'object', caption: "recipient", pieces: [
              { script: "約翰", pron: { jyutping: "Joek3 hon6" }, gloss: "John", role: 'noun', note: "The recipient." },
            ] },
          ],
        },
        {
          id: '6',
          translation: "She gives it to him.",
          explanation: "Swap #5’s subject and recipient and almost nothing changes on the surface: **佢畀嗰個…佢** uses the identical pronoun 佢 twice, for \"she\" and \"him\" alike — spoken Cantonese leans entirely on context here.",
          compareWith: '5',
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "佢", pron: { jyutping: "keoi5" }, gloss: "she", role: 'pronoun', note: "The exact same word and sound as \"he\" in #5 — Cantonese speech marks no gender here at all." },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "畀", pron: { jyutping: "bei2" }, gloss: "give", role: 'verb', note: "Same verb." },
            ] },
            { type: 'object', caption: "it (that one)", pieces: [
              { script: "嗰", pron: { jyutping: "go2" }, gloss: "that", role: 'demonstrative', note: "Same as #5." },
              { script: "個", pron: { jyutping: "go3" }, gloss: "[measure]", role: 'measure', note: "Same as #5." },
            ] },
            { type: 'object', caption: "recipient", pieces: [
              { script: "佢", pron: { jyutping: "keoi5" }, gloss: "him", role: 'pronoun', note: "Now the recipient too is 佢 — the same word that opened the sentence as the subject.", changed: true },
            ] },
          ],
        },
        {
          id: '7',
          translation: "Is the apple red?",
          explanation: "Rather than adding one particle like Mandarin’s 吗, this doubles the verb around 唔 (**係唔係**, \"is-not-is\") and often adds a sentence-final particle like **㗎** on top — two layers of question-marking at once.",
          compareWith: '1',
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "蘋果", pron: { jyutping: "ping4 gwo2" }, gloss: "apple", role: 'noun', note: "Same noun as #1." },
            ] },
            { type: 'question', caption: "is-not-is red?", pieces: [
              { script: "係", pron: { jyutping: "hai6" }, gloss: "is", role: 'verb', note: "The verb, stated once…" },
              { script: "唔", pron: { jyutping: "m4" }, gloss: "not", role: 'negation', note: "…then negated and repeated: 係唔係 = \"is-not-is,\" the classic Cantonese/Chinese A-not-A question form.", changed: true },
              { script: "係", pron: { jyutping: "hai6" }, gloss: "is", role: 'verb', note: "…the second half of the doubled verb." },
              { script: "紅色", pron: { jyutping: "hung4 sik1" }, gloss: "red", role: 'noun', note: "Unchanged from #1." },
              { script: "㗎", pron: { jyutping: "gaa3" }, gloss: "[question tone]", role: 'final-particle', note: "A sentence-final particle that seals the question with a conversational tone — one of dozens spoken Cantonese uses for shades of attitude.", changed: true },
            ] },
          ],
        },
        {
          id: '8',
          translation: "The apples are red.",
          explanation: "Going from \"the apple\" to \"the apples\" only changes the subject (蘋果 → 啲蘋果); 係紅色嘅 carries over exactly as in #1.",
          compareWith: '1',
          parts: [
            { type: 'subject', caption: "the apples", pieces: [
              { script: "啲", pron: { jyutping: "di1" }, gloss: "[plural]", role: 'plural', note: "啲 before a noun marks an unspecified plural quantity: 啲蘋果 = \"the apples/some apples.\"", changed: true },
              { script: "蘋果", pron: { jyutping: "ping4 gwo2" }, gloss: "apple(s)", role: 'noun', note: "蘋果 itself never changes form for plural." },
            ] },
            { type: 'verb-phrase', caption: "is red", pieces: [
              { script: "係", pron: { jyutping: "hai6" }, gloss: "is / are", role: 'verb', note: "Same verb whether the subject is singular or plural." },
              { script: "紅色", pron: { jyutping: "hung4 sik1" }, gloss: "red", role: 'noun', note: "Unchanged." },
              { script: "嘅", pron: { jyutping: "ge3" }, gloss: "—", role: 'possessive', note: "Unchanged." },
            ] },
          ],
        },
        {
          id: '9',
          translation: "I must give it to him.",
          explanation: "Shows where a **modal verb** slots in: right before the whole giving phrase, in front of 畀嗰個, not attached to it.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { jyutping: "ngo5" }, gloss: "I", role: 'pronoun', note: "First-person pronoun." },
            ] },
            { type: 'modifier', caption: "must", pieces: [
              { script: "一定要", pron: { jyutping: "jat1 ding6 jiu3" }, gloss: "must", role: 'modal', note: "A modal placed directly before the main verb phrase — no auxiliary conjugation, no \"to.\"" },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "畀", pron: { jyutping: "bei2" }, gloss: "give", role: 'verb', note: "Same verb." },
            ] },
            { type: 'object', caption: "it (that one)", pieces: [
              { script: "嗰", pron: { jyutping: "go2" }, gloss: "that", role: 'demonstrative', note: "Same as #5." },
              { script: "個", pron: { jyutping: "go3" }, gloss: "[measure]", role: 'measure', note: "Same as #5." },
            ] },
            { type: 'object', caption: "recipient", pieces: [
              { script: "佢", pron: { jyutping: "keoi5" }, gloss: "him", role: 'pronoun', note: "The recipient." },
            ] },
          ],
        },
        {
          id: '10',
          translation: "I want to give it to her.",
          explanation: "Only the modal changes from #9 (一定要→想); the recipient 佢 is spelled and spoken identically whether it means \"him\" or \"her\" — Cantonese speech simply doesn’t distinguish.",
          compareWith: '9',
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { jyutping: "ngo5" }, gloss: "I", role: 'pronoun', note: "First-person pronoun." },
            ] },
            { type: 'modifier', caption: "want to", pieces: [
              { script: "想", pron: { jyutping: "soeng2" }, gloss: "want to", role: 'modal', note: "A different modal, filling the same slot as 一定要 in #9.", changed: true },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "畀", pron: { jyutping: "bei2" }, gloss: "give", role: 'verb', note: "Same verb." },
            ] },
            { type: 'object', caption: "it (that one)", pieces: [
              { script: "嗰", pron: { jyutping: "go2" }, gloss: "that", role: 'demonstrative', note: "Same as #9." },
              { script: "個", pron: { jyutping: "go3" }, gloss: "[measure]", role: 'measure', note: "Same as #9." },
            ] },
            { type: 'object', caption: "recipient", pieces: [
              { script: "佢", pron: { jyutping: "keoi5" }, gloss: "her", role: 'pronoun', note: "The recipient — written and pronounced exactly the same as \"him\" was in #9." },
            ] },
          ],
        },
        {
          id: '11',
          translation: "I'm going to know tomorrow.",
          explanation: "聽日 is a reminder that Cantonese and Mandarin aren’t just different pronunciations of the same words — plenty of everyday vocabulary, including \"tomorrow,\" is genuinely different.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { jyutping: "ngo5" }, gloss: "I", role: 'pronoun', note: "First-person pronoun." },
            ] },
            { type: 'modifier', caption: "tomorrow, then", pieces: [
              { script: "聽日", pron: { jyutping: "ting1 jat6" }, gloss: "tomorrow", role: 'time', note: "Cantonese’s own word for \"tomorrow\" — not a pronunciation of Mandarin’s 明天, but a different word entirely." },
              { script: "就", pron: { jyutping: "zau6" }, gloss: "then / right away", role: 'adverb', note: "就 signals that something follows soon or as a settled next step." },
            ] },
            { type: 'verb-phrase', caption: "will know", pieces: [
              { script: "會", pron: { jyutping: "wui5" }, gloss: "will", role: 'modal', note: "會 marks future likelihood, since the verb itself can’t change to show tense." },
              { script: "知", pron: { jyutping: "zi1" }, gloss: "know", role: 'verb', note: "The main verb — often shortened from 知道 in casual speech." },
            ] },
          ],
        },
        {
          id: '12',
          translation: "I can't eat the apple.",
          explanation: "食唔到 uses a **potential complement** (verb + 唔 + 到) rather than a modal like \"cannot\" — it specifically means unable to manage the action, not simply forbidden to do it.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { jyutping: "ngo5" }, gloss: "I", role: 'pronoun', note: "First-person pronoun." },
            ] },
            { type: 'verb-phrase', caption: "can't eat", pieces: [
              { script: "食", pron: { jyutping: "sik6" }, gloss: "eat", role: 'verb', note: "The main verb." },
              { script: "唔", pron: { jyutping: "m4" }, gloss: "not", role: 'negation', note: "唔 negates the complement that follows." },
              { script: "到", pron: { jyutping: "dou2" }, gloss: "[can manage to]", role: 'potential', note: "到 after V唔 builds a potential complement: 食唔到 = \"can’t manage to eat\" — a different structure from a plain modal like \"cannot.\"" },
            ] },
            { type: 'object', caption: "the apple", pieces: [
              { script: "個", pron: { jyutping: "go3" }, gloss: "[measure]", role: 'measure', note: "The measure word before the noun." },
              { script: "蘋果", pron: { jyutping: "ping4 gwo2" }, gloss: "apple", role: 'noun', note: "Unchanged." },
            ] },
          ],
        },
      ],
      summary: [
        { text: "Giving reverses direction. Cantonese says **畀 + thing + recipient** ([#3](sentence:3) 畀個蘋果約翰), the mirror of Mandarin’s 给 + recipient + thing — a real word-order difference, not just an accent." },
        { text: "佢 covers he, she AND it. One word, one sound, no gender or animacy marking at all in casual speech ([#5](sentence:5), [#6](sentence:6)) — even more collapsed than Mandarin’s \"tā.\"" },
        { text: "There’s no everyday spoken word for \"it.\" A demonstrative + measure word, **嗰個** (\"that one\"), fills in instead ([#5](sentence:5))." },
        { text: "Questions can stack two devices at once: doubling the verb around 唔 (**係唔係**, \"is-not-is\") and tacking on a sentence-final particle like **㗎** ([#7](sentence:7)) — Cantonese’s sentence-final particles alone number in the dozens, well beyond Mandarin’s handful." },
        { text: "\"Can’t\" often means a potential complement, not a modal. **食唔到** ([#12](sentence:12)) — \"eat-not-arrive\" — specifically means unable to manage the action, a structure with no single English word." },
        { text: "Cantonese has its own everyday vocabulary, not just its own pronunciation: 聽日 for \"tomorrow\" ([#11](sentence:11)), 畀 for \"give,\" 佢 for \"he/she/it,\" 哋 for the plural suffix — all different words from their Mandarin counterparts, even though the writing systems overlap." },
        { text: "Plural still never touches the noun itself. 我哋 (\"we\") and 啲蘋果 (\"the apples\") mark plural on the pronoun or with a quantifier in front of the noun — 蘋果 and 我 stay exactly as they are." },
      ],
    },
  ],
  words: cantoneseWords,
  switchboards: cantoneseSwitchboards,
};

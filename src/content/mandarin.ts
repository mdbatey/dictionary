import type { Language } from '../model';
import { mandarinSwitchboards } from './mandarin-switchboards';
import { mandarinWords } from './mandarin-words';

// Moved over as-is from reference/breakdowns/mandarin-dozen.html ("The Mandarin Dozen").
// Intended changes only: site-wide colours, and Markdown instead of HTML.
export const mandarin: Language = {
  id: "zh",
  nativeName: "中文",
  name: "Mandarin",
  tag: "zh-Hans",
  tones: { system: 'pinyin', style: 'marks' },
  roles: {
    noun: { rule: "A thing, person or place. Chinese nouns take no article (\"a\"/\"the\") and don't change form for singular or plural." },
    verb: { rule: "An action or state word. Chinese verbs never conjugate for person, number or tense — that work is done by separate time words and particles." },
    pronoun: { rule: "A stand-in for a noun. 他 (he), 她 (she) and 它 (it) are written differently but all pronounced \"tā\" — the distinction is visual, not audible." },
    possessive: { label: "的 · possessive / descriptive", rule: "的 is one of the hardest-working words in Mandarin: after a noun it marks possession (\"X的Y\" = Y belonging to X); after an adjective-like word before 是, it turns it into a description." },
    question: { label: "吗 · question particle", rule: "Added to the very end of a statement, 吗 turns it into a yes/no question. Nothing else in the sentence changes." },
    ba: { rule: "把 pulls a specific, already-known object in front of the verb, instead of leaving it after: \"把 [object] [verb]\" roughly means \"take [object] and [verb] it.\"" },
    negation: { rule: "不 (and, for the verb \"have,\" 没) negates whatever comes right after it — usually a verb or modal verb." },
    modal: { rule: "Words like 必须 (must), 想 (want to), 能 (can) and 会 (will) sit directly before the main verb, with no auxiliary conjugation." },
    demonstrative: { rule: "这 (\"this\") and 那 (\"that\") point at something specific. They combine with 个 or 些 before a noun." },
    measure: { label: "个 · measure word", rule: "Chinese requires a measure word between a demonstrative or number and most nouns. 个 is the general-purpose one, used when a more specific measure word isn't needed." },
    time: { rule: "Time expressions like 明天 (tomorrow) usually come right after the subject, before the verb — there's no future-tense verb ending to do this job instead." },
    adverb: { rule: "Short adverbs like 就 sit between the subject/time word and the verb, adding shades of meaning (immediacy, sequence, emphasis)." },
    // From reference/switchboards/mandarin-switchboard.html (used by the giving Switchboard):
    tense: { label: "Aspect marker", rule: "了 (completed), 过 (experienced) and 在 (in progress) show how the action unfolds, not when it happens." },
    number: { label: "Number", rule: "一 and 两 come before the measure word, never directly before the noun." },
    plural: { rule: "们 pluralizes a pronoun or person noun (我→我们). 些 does similar work after a demonstrative (这→这些). Ordinary nouns like 苹果 never change form themselves." },
  },
  pronunciationSystems: [{ id: "pinyin", label: "Pinyin" }],
  defaultPronunciation: "pinyin",
  sets: [
    {
      id: "mandarin-dozen",
      name: "The Mandarin Dozen",
      sentences: [
        {
          id: '1',
          translation: "The apple is red.",
          explanation: "Sets the baseline pattern **是 … 的** for \"X is [description]\" and introduces 苹果 and 红色, which every later sentence in the set reuses.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "苹果", pron: { pinyin: "píngguǒ" }, gloss: "apple", role: 'noun', note: "The basic noun for this whole set. No article needed." },
            ] },
            { type: 'verb-phrase', caption: "is red", pieces: [
              { script: "是", pron: { pinyin: "shì" }, gloss: "is", role: 'verb', note: "The linking verb \"to be,\" joining the subject to a description." },
              { script: "红色", pron: { pinyin: "hóngsè" }, gloss: "red", role: 'noun', note: "Literally \"red color\" — Chinese color words are often nouns, not adjectives." },
              { script: "的", pron: { pinyin: "de" }, gloss: "—", role: 'possessive', note: "的 here nominalizes 红色 so that 是…的 reads as \"is [a red one],\" Chinese’s usual way of saying a simple description." },
            ] },
          ],
        },
        {
          id: '2',
          translation: "It is John's apple.",
          explanation: "Shows 的 doing possessive work (X的Y = \"Y that belongs to X\") — a second job for the same particle seen in #1.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "这", pron: { pinyin: "zhè" }, gloss: "this / it", role: 'demonstrative', note: "A pointing word used here as the subject, standing in for \"it.\"" },
            ] },
            { type: 'verb-phrase', caption: "is", pieces: [
              { script: "是", pron: { pinyin: "shì" }, gloss: "is", role: 'verb', note: "Same linking verb as #1." },
            ] },
            { type: 'object', caption: "John's apple", pieces: [
              { script: "约翰", pron: { pinyin: "Yuēhàn" }, gloss: "John", role: 'noun', note: "A phonetic transliteration of the English name — foreign names are usually rendered by sound, not meaning." },
              { script: "的", pron: { pinyin: "de" }, gloss: "'s", role: 'possessive', note: "的 after a noun marks possession: 约翰的苹果 = \"John’s apple.\"" },
              { script: "苹果", pron: { pinyin: "píngguǒ" }, gloss: "apple", role: 'noun', note: "Same noun as #1." },
            ] },
          ],
        },
        {
          id: '3',
          translation: "I give John the apple.",
          explanation: "Introduces the basic double-object order: **subject + 给 + recipient + thing**, with no equivalent of \"to.\"",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { pinyin: "wǒ" }, gloss: "I", role: 'pronoun', note: "First-person pronoun." },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "给", pron: { pinyin: "gěi" }, gloss: "give", role: 'verb', note: "给 is a double-object verb: 给 + recipient + thing given, no preposition needed." },
            ] },
            { type: 'object', caption: "recipient", pieces: [
              { script: "约翰", pron: { pinyin: "Yuēhàn" }, gloss: "John", role: 'noun', note: "The person receiving the apple." },
            ] },
            { type: 'object', caption: "thing given", pieces: [
              { script: "苹果", pron: { pinyin: "píngguǒ" }, gloss: "apple", role: 'noun', note: "No \"the\" — definiteness is understood from context, not marked by an article." },
            ] },
          ],
        },
        {
          id: '4',
          translation: "We give him the apple.",
          explanation: "The only change from #3 is the subject, and it’s made plural with the suffix **们** rather than a new word — the verb 给 doesn’t change at all.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { pinyin: "wǒ" }, gloss: "I", role: 'pronoun', note: "The base pronoun \"I.\"" },
              { script: "们", pron: { pinyin: "men" }, gloss: "[plural]", role: 'plural', note: "们 attaches to a pronoun to pluralize it: 我(I)→我们(we)." },
            ] },
            { type: 'verb-phrase', caption: "give", pieces: [
              { script: "给", pron: { pinyin: "gěi" }, gloss: "give", role: 'verb', note: "Same double-object verb as #3." },
            ] },
            { type: 'object', caption: "recipient", pieces: [
              { script: "他", pron: { pinyin: "tā" }, gloss: "him", role: 'pronoun', note: "Third-person pronoun. Spoken \"tā\" is identical for he/she/it — only the character shows which." },
            ] },
            { type: 'object', caption: "thing given", pieces: [
              { script: "苹果", pron: { pinyin: "píngguǒ" }, gloss: "apple", role: 'noun', note: "Same noun again." },
            ] },
          ],
        },
        {
          id: '5',
          translation: "He gives it to John.",
          explanation: "Because \"it\" (the apple) is already known from context, it moves in front of the verb with **把** instead of trailing 给 the way 苹果 did in #3.",
          compareWith: '3',
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "他", pron: { pinyin: "tā" }, gloss: "he", role: 'pronoun', note: "Third-person pronoun \"he\" — same sound as 她 (she) and 它 (it)." },
            ] },
            { type: 'object', caption: "fronted object", pieces: [
              { script: "把", pron: { pinyin: "bǎ" }, gloss: "—", role: 'ba', note: "把 pulls a definite, already-known object in front of the verb: 把它给 ≈ \"[take] it [and] give.\"" },
              { script: "它", pron: { pinyin: "tā" }, gloss: "it", role: 'pronoun', note: "Third-person pronoun for things — also \"tā,\" disambiguated only in writing." },
            ] },
            { type: 'verb-phrase', caption: "give to John", pieces: [
              { script: "给", pron: { pinyin: "gěi" }, gloss: "give (to)", role: 'verb', note: "Same verb as #3–#4, now following the 把-fronted object instead of preceding a new noun." },
              { script: "约翰", pron: { pinyin: "Yuēhàn" }, gloss: "John", role: 'noun', note: "The recipient." },
            ] },
          ],
        },
        {
          id: '6',
          translation: "She gives it to him.",
          explanation: "Subject and recipient swap (他↔她), but every one of the four pronouns in this sentence is still pronounced **tā** — Mandarin leans on characters, not sound, to keep them apart.",
          compareWith: '5',
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "她", pron: { pinyin: "tā" }, gloss: "she", role: 'pronoun', note: "Third-person pronoun \"she\" — again pronounced \"tā.\"", changed: true },
            ] },
            { type: 'object', caption: "fronted object", pieces: [
              { script: "把", pron: { pinyin: "bǎ" }, gloss: "—", role: 'ba', note: "Same 把 construction as #5." },
              { script: "它", pron: { pinyin: "tā" }, gloss: "it", role: 'pronoun', note: "\"It\" — same sound as 他/她 once more." },
            ] },
            { type: 'verb-phrase', caption: "give to him", pieces: [
              { script: "给", pron: { pinyin: "gěi" }, gloss: "give (to)", role: 'verb', note: "Same verb." },
              { script: "他", pron: { pinyin: "tā" }, gloss: "him", role: 'pronoun', note: "\"Him\" — the fourth \"tā\" in this short sentence.", changed: true },
            ] },
          ],
        },
        {
          id: '7',
          translation: "Is the apple red?",
          explanation: "The whole sentence is identical to #1; Mandarin makes a yes/no question just by adding **吗** at the end, unlike English’s subject–verb inversion.",
          compareWith: '1',
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "苹果", pron: { pinyin: "píngguǒ" }, gloss: "apple", role: 'noun', note: "Same noun as #1." },
            ] },
            { type: 'verb-phrase', caption: "is red", pieces: [
              { script: "是", pron: { pinyin: "shì" }, gloss: "is", role: 'verb', note: "Unchanged from #1." },
              { script: "红色", pron: { pinyin: "hóngsè" }, gloss: "red", role: 'noun', note: "Unchanged from #1." },
              { script: "的", pron: { pinyin: "de" }, gloss: "—", role: 'possessive', note: "Unchanged from #1." },
            ] },
            { type: 'question', caption: "question", pieces: [
              { script: "吗", pron: { pinyin: "ma" }, gloss: "?", role: 'question', note: "吗 turns a plain statement into a yes/no question when added to the very end — no word order change needed.", changed: true },
            ] },
          ],
        },
        {
          id: '8',
          translation: "The apples are red.",
          explanation: "Going from \"the apple\" to \"the apples\" only changes the subject (苹果 → 这些苹果); the predicate 是红色的 is copied over untouched.",
          compareWith: '1',
          parts: [
            { type: 'subject', caption: "these apples", pieces: [
              { script: "这", pron: { pinyin: "zhè" }, gloss: "this", role: 'demonstrative', note: "The demonstrative \"this.\"" },
              { script: "些", pron: { pinyin: "xiē" }, gloss: "[plural]", role: 'plural', note: "些 after 这 marks a plural, unspecified quantity: 这些 = \"these.\"", changed: true },
              { script: "苹果", pron: { pinyin: "píngguǒ" }, gloss: "apple(s)", role: 'noun', note: "苹果 itself never changes form for plural — Mandarin nouns don't inflect for number." },
            ] },
            { type: 'verb-phrase', caption: "is red", pieces: [
              { script: "是", pron: { pinyin: "shì" }, gloss: "is / are", role: 'verb', note: "Same verb whether the subject is singular or plural — 是 never conjugates." },
              { script: "红色", pron: { pinyin: "hóngsè" }, gloss: "red", role: 'noun', note: "Unchanged." },
              { script: "的", pron: { pinyin: "de" }, gloss: "—", role: 'possessive', note: "Unchanged." },
            ] },
          ],
        },
        {
          id: '9',
          translation: "I must give it to him.",
          explanation: "Shows where a **modal verb** slots in: right before the main verb phrase, in front of the whole 把 construction, not attached to it.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { pinyin: "wǒ" }, gloss: "I", role: 'pronoun', note: "First-person pronoun." },
            ] },
            { type: 'modifier', caption: "must", pieces: [
              { script: "必须", pron: { pinyin: "bìxū" }, gloss: "must", role: 'modal', note: "A modal verb placed directly before the main verb phrase — no auxiliary conjugation, no \"to.\"" },
            ] },
            { type: 'object', caption: "fronted object", pieces: [
              { script: "把", pron: { pinyin: "bǎ" }, gloss: "—", role: 'ba', note: "Same 把 construction as #5–#6." },
              { script: "它", pron: { pinyin: "tā" }, gloss: "it", role: 'pronoun', note: "\"It,\" referring back to the apple." },
            ] },
            { type: 'verb-phrase', caption: "give to him", pieces: [
              { script: "给", pron: { pinyin: "gěi" }, gloss: "give (to)", role: 'verb', note: "Same verb." },
              { script: "他", pron: { pinyin: "tā" }, gloss: "him", role: 'pronoun', note: "The recipient." },
            ] },
          ],
        },
        {
          id: '10',
          translation: "I want to give it to her.",
          explanation: "Only the modal (必须→想) and the recipient pronoun (他→她) change from #9; the rest of the sentence, 把它给, carries over exactly.",
          compareWith: '9',
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { pinyin: "wǒ" }, gloss: "I", role: 'pronoun', note: "First-person pronoun." },
            ] },
            { type: 'modifier', caption: "want to", pieces: [
              { script: "想", pron: { pinyin: "xiǎng" }, gloss: "want to", role: 'modal', note: "A different modal verb, filling the same slot as 必须 in #9.", changed: true },
            ] },
            { type: 'object', caption: "fronted object", pieces: [
              { script: "把", pron: { pinyin: "bǎ" }, gloss: "—", role: 'ba', note: "Same 把 construction." },
              { script: "它", pron: { pinyin: "tā" }, gloss: "it", role: 'pronoun', note: "\"It.\"" },
            ] },
            { type: 'verb-phrase', caption: "give to her", pieces: [
              { script: "给", pron: { pinyin: "gěi" }, gloss: "give (to)", role: 'verb', note: "Same verb." },
              { script: "她", pron: { pinyin: "tā" }, gloss: "her", role: 'pronoun', note: "The recipient — swapped from 他 in #9.", changed: true },
            ] },
          ],
        },
        {
          id: '11',
          translation: "I'm going to know tomorrow.",
          explanation: "With no verb tense to lean on, futurity here is carried entirely by the time word **明天**, the adverb **就**, and the modal **会** — three separate words doing what \"’m going to\" does in one.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { pinyin: "wǒ" }, gloss: "I", role: 'pronoun', note: "First-person pronoun." },
            ] },
            { type: 'modifier', caption: "tomorrow, then", pieces: [
              { script: "明天", pron: { pinyin: "míngtiān" }, gloss: "tomorrow", role: 'time', note: "Time words usually sit right after the subject and before the verb — there's no future-tense verb ending to place it near instead." },
              { script: "就", pron: { pinyin: "jiù" }, gloss: "then / right away", role: 'adverb', note: "就 signals that something follows soon or as a natural next step, reinforcing 明天 as a near, settled point in time." },
            ] },
            { type: 'verb-phrase', caption: "will know", pieces: [
              { script: "会", pron: { pinyin: "huì" }, gloss: "will", role: 'modal', note: "会 marks future likelihood. Since Chinese verbs don't conjugate for tense, a word like 会 carries that meaning instead." },
              { script: "知道", pron: { pinyin: "zhīdào" }, gloss: "know", role: 'verb', note: "The main verb." },
            ] },
          ],
        },
        {
          id: '12',
          translation: "I can't eat the apple.",
          explanation: "不 negates the modal 能 directly, and the object needs its measure word 个 once it follows a demonstrative — a requirement that never came up while 苹果 stood alone in earlier sentences.",
          parts: [
            { type: 'subject', caption: "subject", pieces: [
              { script: "我", pron: { pinyin: "wǒ" }, gloss: "I", role: 'pronoun', note: "First-person pronoun." },
            ] },
            { type: 'modifier', caption: "cannot", pieces: [
              { script: "不", pron: { pinyin: "bù" }, gloss: "not", role: 'negation', note: "不 negates whatever sits directly in front of it — here, the modal 能." },
              { script: "能", pron: { pinyin: "néng" }, gloss: "can", role: 'modal', note: "The modal \"can / be able to,\" negated as 不能, \"cannot.\"" },
            ] },
            { type: 'verb-phrase', caption: "eat", pieces: [
              { script: "吃", pron: { pinyin: "chī" }, gloss: "eat", role: 'verb', note: "The main verb." },
            ] },
            { type: 'object', caption: "this apple", pieces: [
              { script: "这", pron: { pinyin: "zhè" }, gloss: "this", role: 'demonstrative', note: "The same demonstrative as #2 and #8." },
              { script: "个", pron: { pinyin: "gè" }, gloss: "[measure]", role: 'measure', note: "个 is the general-purpose measure word, required between a demonstrative and most nouns: 这个苹果 = \"this [one] apple.\"" },
              { script: "苹果", pron: { pinyin: "píngguǒ" }, gloss: "apple", role: 'noun', note: "Unchanged." },
            ] },
          ],
        },
      ],
      summary: [
        { text: "No verb ever conjugates. 是, 给, 吃 and 知道 look identical whether the subject is 我, 我们, 他 or 她, and whether the action is past, present or future — time words (明天), adverbs (就) and modals (会, 能, 想, 必须) carry that information instead." },
        { text: "Definiteness moves the object. A general object trails the verb ([#3](sentence:3) 给约翰苹果), but a specific, already-known one is fronted with **把** ([#5](sentence:5) 把它给约翰) — English marks the same distinction with articles, Chinese with word order." },
        { text: "的 does two unrelated jobs: marking possession ([#2](sentence:2) 约翰的苹果) and turning a noun into a description after 是 ([#1](sentence:1) 是红色的)." },
        { text: "Plurality is never on the noun. 苹果 is identical whether it means \"apple\" or \"apples\" ([#1](sentence:1) vs [#8](sentence:8)); plural is marked on pronouns with 们 and on demonstratives with 些." },
        { text: "A demonstrative needs a measure word before most nouns — 这个苹果, not 这苹果 ([#12](sentence:12)) — a small requirement with no English equivalent." },
        { text: "Three pronouns collapse to one sound. 他, 她 and 它 (he/she/it) are all pronounced \"tā\"; only the character on the page tells them apart ([#5](sentence:5), [#6](sentence:6))." },
        { text: "A yes/no question is just a statement plus 吗 at the end — no auxiliary verb, no inversion ([#1](sentence:1) vs [#7](sentence:7))." },
      ],
    },
  ],
  words: mandarinWords,
  switchboards: mandarinSwitchboards,
};

import type { Word } from '../model';

// The Cantonese word list. Jyutping and notes are taken from reference/switchboards/cantonese-switchboard.html.
// Plural pronouns are built from a base pronoun plus the plural suffix 哋, shown as two Pieces.
export const cantoneseWords: Word[] = [
  { id: 'i', script: '我', meaning: 'I', wordClass: 'pronoun', facts: { person: 1, number: 'singular' }, forms: { plain: { script: '我', pron: { jyutping: 'ngo5' }, gloss: 'I' } } },
  {
    id: 'you', script: '你', meaning: 'you', wordClass: 'pronoun', facts: { person: 2, number: 'singular' },
    forms: { plain: { script: '你', pron: { jyutping: 'nei5' }, gloss: 'you', note: "Cantonese has no polite 'you' like Mandarin 您. Politeness comes from word choice and particles instead." } },
  },
  {
    id: 'he-she', script: '佢', meaning: 'he/she', wordClass: 'pronoun', facts: { person: 3, number: 'singular' },
    forms: { plain: { script: '佢', pron: { jyutping: 'keoi5' }, gloss: 'he/she', note: '佢 means he, she or it. Cantonese makes no gender distinction, even in writing.' } },
  },
  {
    id: 'we', script: '我哋', meaning: 'we', wordClass: 'pronoun', facts: { person: 1, number: 'plural' },
    forms: { plain: { script: '我', pron: { jyutping: 'ngo5' }, gloss: 'I' }, suffix: { script: '哋', pron: { jyutping: 'dei6' }, gloss: 'pl.' } },
  },
  {
    id: 'you-all', script: '你哋', meaning: 'you all', wordClass: 'pronoun', facts: { person: 2, number: 'plural' },
    forms: { plain: { script: '你', pron: { jyutping: 'nei5' }, gloss: 'you' }, suffix: { script: '哋', pron: { jyutping: 'dei6' }, gloss: 'pl.', note: '你哋 = you all.' } },
  },
  {
    id: 'they', script: '佢哋', meaning: 'they', wordClass: 'pronoun', facts: { person: 3, number: 'plural' },
    forms: { plain: { script: '佢', pron: { jyutping: 'keoi5' }, gloss: 'he/she' }, suffix: { script: '哋', pron: { jyutping: 'dei6' }, gloss: 'pl.', note: '佢哋 = they, for any mix of people.' } },
  },
  {
    id: 'ah-ming', script: '阿明', meaning: 'Ah Ming', wordClass: 'noun', tags: ['person'], pron: { jyutping: 'aa3 ming4' },
    note: "阿 aa3 before a name is a friendly prefix, like 'Ah Ming'. In Cantonese the thing given comes BEFORE the person: 畀個蘋果阿明, literally 'give the apple Ah Ming'.",
  },
  { id: 'apple', script: '蘋果', meaning: 'apple', wordClass: 'noun', tags: ['thing'], pron: { jyutping: 'ping4 gwo2' } },
  { id: 'give', script: '畀', meaning: 'give', wordClass: 'verb', frames: ['yue-giving'], pron: { jyutping: 'bei2' }, note: "畀 bei2 = give. Also written 俾. It's the same word." },
];

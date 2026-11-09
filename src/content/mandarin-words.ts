import type { Word } from '../model';

// The Mandarin word list. Pinyin and notes are taken from reference/switchboards/mandarin-switchboard.html.
// Plural pronouns are built from a base pronoun plus the plural suffix 们, shown as two Pieces.
export const mandarinWords: Word[] = [
  { id: 'i', script: '我', meaning: 'I', wordClass: 'pronoun', facts: { person: 1, number: 'singular' }, forms: { plain: { script: '我', pron: { pinyin: 'wǒ' }, gloss: 'I' } } },
  { id: 'you', script: '你', meaning: 'you', wordClass: 'pronoun', facts: { person: 2, number: 'singular' }, forms: { plain: { script: '你', pron: { pinyin: 'nǐ' }, gloss: 'you', note: '你 is the everyday \'you\' for friends and equals.' } } },
  { id: 'he', script: '他', meaning: 'he', wordClass: 'pronoun', facts: { person: 3, number: 'singular' }, forms: { plain: { script: '他', pron: { pinyin: 'tā' }, gloss: 'he', note: '他 (he) and 她 (she) sound identical: tā. Only the written character differs.' } } },
  { id: 'she', script: '她', meaning: 'she', wordClass: 'pronoun', facts: { person: 3, number: 'singular' }, forms: { plain: { script: '她', pron: { pinyin: 'tā' }, gloss: 'she', note: '她 and 他 are both pronounced tā. You can only tell them apart in writing.' } } },
  {
    id: 'we', script: '我们', meaning: 'we', wordClass: 'pronoun', facts: { person: 1, number: 'plural' },
    forms: { plain: { script: '我', pron: { pinyin: 'wǒ' }, gloss: 'I' }, suffix: { script: '们', pron: { pinyin: 'men' }, gloss: 'pl.', note: '们 is neutral tone: short and light.' } },
  },
  {
    id: 'they', script: '他们', meaning: 'they', wordClass: 'pronoun', facts: { person: 3, number: 'plural' },
    forms: { plain: { script: '他', pron: { pinyin: 'tā' }, gloss: 'he' }, suffix: { script: '们', pron: { pinyin: 'men' }, gloss: 'pl.', note: '他们 is used for any group that includes a man. 她们 is only for all-female groups.' } },
  },
  {
    id: 'xiaoming', script: '小明', meaning: 'Xiao Ming', wordClass: 'noun', tags: ['person'], pron: { pinyin: 'Xiǎo Míng' },
    note: "小明 is a stock name, like 'Johnny' in English textbooks. 小 (little) is a common affectionate prefix.",
  },
  { id: 'apple', script: '苹果', meaning: 'apple', wordClass: 'noun', tags: ['thing'], pron: { pinyin: 'píng guǒ' } },
  { id: 'give', script: '给', meaning: 'give', wordClass: 'verb', frames: ['zh-giving'], pron: { pinyin: 'gěi' } },
];

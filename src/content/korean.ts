import type { Language } from '../model';

// Source: reference/breakdowns/korean-13-sentences.html (Sentence 3). Renamed "The Korean Dozen" to match the other Sets.
export const korean: Language = {
  id: 'ko',
  nativeName: '한국어',
  name: 'Korean',
  tag: 'ko',
  // Rules from reference/breakdowns/korean-13-sentences.html. Roles used by the rest of the Set arrive in #6.
  roles: {
    pronoun: { rule: 'I, he, she, it. Korean drops these whenever context makes them clear.' },
    noun: { rule: 'A thing, person or place. Particles attach right after it.' },
    topic: { rule: 'Marks what the sentence is about. 는 after a vowel, 은 after a consonant.' },
    object: { rule: 'Marks the direct object (the thing given, eaten). 를 after a vowel, 을 after a consonant.' },
    recipient: { rule: "에게 means 'to' a person or animal. 한테 is the casual spoken version." },
    verb: { label: 'Verb / adjective stem', rule: "The dictionary form with -다 removed. Adjectives like 'red' conjugate exactly like verbs." },
    polite: { rule: '요 on the end makes it informal polite, the safe default with most people.' },
  },
  pronunciationSystems: [{ id: 'rom', label: 'Romanization' }],
  defaultPronunciation: 'rom',
  sets: [
    {
      id: 'korean-dozen',
      name: 'The Korean Dozen',
      sentences: [
        {
          id: '3',
          translation: 'I give John the apple.',
          explanation:
            'Giving uses two particles. **에게** marks who receives, **를** marks what is given. Their order can swap, because the particles carry the meaning.',
          parts: [
            {
              type: 'subject',
              caption: 'I (topic)',
              pieces: [
                { script: '나', pron: { rom: 'na' }, gloss: 'I', role: 'pronoun', note: 'With -요 endings, many speakers use the humbler 저 (jeo) instead of 나.' },
                { script: '는', pron: { rom: '-neun' }, gloss: 'topic', role: 'topic' },
              ],
            },
            {
              type: 'indirect-object',
              caption: 'recipient',
              pieces: [
                { script: '존', pron: { rom: 'jon' }, gloss: 'John', role: 'noun' },
                { script: '에게', pron: { rom: '-e-ge' }, gloss: 'to', role: 'recipient' },
              ],
            },
            {
              type: 'object',
              caption: 'the thing given',
              pieces: [
                { script: '사과', pron: { rom: 'sa-gwa' }, gloss: 'apple', role: 'noun' },
                { script: '를', pron: { rom: '-leul' }, gloss: 'd.o.', role: 'object' },
              ],
            },
            {
              type: 'verb-phrase',
              caption: 'give',
              pieces: [
                { script: '줘', pron: { rom: 'jwo' }, gloss: 'give', role: 'verb', note: "주다 'to give'. 주 + 어 contracts to 줘." },
                { script: '요', pron: { rom: '-yo' }, gloss: 'pol', role: 'polite' },
              ],
            },
            '.',
          ],
        },
      ],
    },
  ],
  switchboards: [],
};

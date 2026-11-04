import type { Language } from '../model';

// Source: reference/breakdowns/korean-13-sentences.html (Sentence 3). Renamed "The Korean Dozen" to match the other Sets.
export const korean: Language = {
  id: 'ko',
  nativeName: '한국어',
  name: 'Korean',
  tag: 'ko',
  roles: ['pronoun', 'noun', 'topic', 'object', 'recipient', 'stem', 'polite'],
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
              type: 'recipient',
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
                { script: '줘', pron: { rom: 'jwo' }, gloss: 'give', role: 'stem', note: "주다 'to give'. 주 + 어 contracts to 줘." },
                { script: '요', pron: { rom: '-yo' }, gloss: 'pol', role: 'polite' },
              ],
            },
            '.',
          ],
        },
      ],
    },
  ],
};

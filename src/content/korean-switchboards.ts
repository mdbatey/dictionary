import type { Switchboard } from '../model';

// Switchboards are data on top of a Frame (ADR 0001). Source: reference/switchboards/korean-switchboard.html.
export const koreanSwitchboards: Switchboard[] = [
  {
    id: 'giving',
    name: 'I give the apple to…',
    frame: 'ko-giving',
    words: { thing: 'apple', verb: 'give' },
    switches: [
      { id: 'who', label: 'Who', kind: 'word', slot: 'who' },
      {
        id: 'level', label: 'Level', kind: 'grammar', options: [
          { id: 'casual', label: 'Casual', sub: '반말', hint: 'Close friends, siblings, people younger than you.' },
          { id: 'polite', label: 'Polite', sub: '해요체', hint: 'The everyday safe default: coworkers, shop staff, acquaintances.' },
          { id: 'formal', label: 'Formal', sub: '합쇼체', hint: 'First meetings, customers, presentations, the news.' },
          { id: 'plain', label: 'Plain', sub: '해라체', hint: 'Written Korean (books, diaries, articles), or adults speaking to children.' },
        ],
      },
      {
        id: 'tense', label: 'Tense', kind: 'grammar', options: [
          { id: 'past', label: 'Past' }, { id: 'present', label: 'Present' }, { id: 'future', label: 'Future' },
        ],
      },
      {
        id: 'negate', label: 'Negate', kind: 'grammar', options: [
          { id: 'none', label: 'None' }, { id: 'dont', label: "Don't", sub: '안' }, { id: 'cant', label: "Can't", sub: '못' },
        ],
      },
      {
        id: 'type', label: 'Type', kind: 'grammar', options: [
          { id: 'statement', label: 'Statement' }, { id: 'question', label: 'Question' },
        ],
      },
      { id: 'to', label: 'To', kind: 'word', slot: 'to' },
    ],
    start: { who: 'i', level: 'polite', tense: 'present', negate: 'none', type: 'statement', to: 'minho' },
  },
];

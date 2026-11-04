import type { Switchboard } from '../model';

// Switchboards are data on top of a Frame (ADR 0001). Source: reference/switchboards/cantonese-switchboard.html.
// As in Mandarin, the "Object" Switch chooses how many / which apples (個, 一個…), so it's a Grammar Switch.
export const cantoneseSwitchboards: Switchboard[] = [
  {
    id: 'giving',
    name: 'I give Ah Ming the apple',
    frame: 'yue-giving',
    words: { to: 'ah-ming', thing: 'apple', verb: 'give' },
    switches: [
      { id: 'who', label: 'Who', kind: 'word', slot: 'who' },
      {
        id: 'time', label: 'Time', kind: 'grammar', options: [
          { id: 'habit', label: 'Habit', hint: 'No marker: habits and general statements.' },
          { id: 'zo', label: 'Did', sub: '咗', hint: '咗 after the verb: the action is done.' },
          { id: 'gwo', label: 'Ever', sub: '過', hint: '過 after the verb: it has happened at least once.' },
          { id: 'gan', label: 'Now', sub: '緊', hint: '緊 after the verb: happening right now.' },
          { id: 'wui', label: 'Will', sub: '會', hint: '會 before the verb: will / likely to.' },
        ],
      },
      { id: 'negate', label: 'Negate', kind: 'grammar', options: [{ id: 'none', label: 'No' }, { id: 'not', label: 'Not', sub: '唔 / 冇' }] },
      {
        id: 'type', label: 'Type', kind: 'grammar', options: [
          { id: 'statement', label: 'Statement' }, { id: 'a-not-a', label: 'Question', sub: 'A-not-A' }, { id: 'maa', label: 'Question', sub: '嗎' },
        ],
      },
      {
        id: 'object', label: 'Object', kind: 'grammar', options: [
          { id: 'the', label: 'The apple', sub: '個' }, { id: 'one', label: 'An apple', sub: '一個' }, { id: 'this', label: 'This', sub: '呢個' },
          { id: 'that', label: 'That', sub: '嗰個' }, { id: 'two', label: 'Two', sub: '兩個' },
        ],
      },
      {
        id: 'ending', label: 'Ending', kind: 'grammar', options: [
          { id: 'plain', label: 'Plain' }, { id: 'gaa', label: 'Explaining', sub: '㗎' }, { id: 'laa', label: 'Now / already', sub: '喇' },
        ],
      },
    ],
    start: { who: 'i', time: 'habit', negate: 'none', type: 'statement', object: 'the', ending: 'plain' },
  },
];

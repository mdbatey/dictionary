import type { Switchboard } from '../model';

// Switchboards are data on top of a Frame (ADR 0001). Source: reference/switchboards/mandarin-switchboard.html.
// The old page's "Object" Switch chooses how many / which apples (一个, 这个…), so it's a Grammar Switch;
// the noun itself, 苹果, is a Word fixed in the "thing" slot.
export const mandarinSwitchboards: Switchboard[] = [
  {
    id: 'giving',
    name: 'I give Xiao Ming an apple',
    frame: 'zh-giving',
    words: { to: 'xiaoming', thing: 'apple', verb: 'give' },
    switches: [
      { id: 'who', label: 'Who', kind: 'word', slot: 'who' },
      {
        id: 'time', label: 'Time', kind: 'grammar', options: [
          { id: 'habit', label: 'Habit', hint: 'No marker: habits and general statements.' },
          { id: 'le', label: 'Did', sub: '了', hint: '了 after the verb: the action was completed.' },
          { id: 'guo', label: 'Ever', sub: '过', hint: '过 after the verb: it has happened at least once.' },
          { id: 'zai', label: 'Now', sub: '在', hint: '在 before the verb: happening right now.' },
          { id: 'hui', label: 'Will', sub: '会', hint: '会 before the verb: will / is likely to.' },
        ],
      },
      { id: 'negate', label: 'Negate', kind: 'grammar', options: [{ id: 'none', label: 'No' }, { id: 'not', label: 'Not', sub: '不/没' }] },
      {
        id: 'type', label: 'Type', kind: 'grammar', options: [
          { id: 'statement', label: 'Statement' }, { id: 'ma', label: 'Question', sub: '吗' }, { id: 'a-not-a', label: 'Question', sub: 'A不A' },
        ],
      },
      {
        id: 'object', label: 'Object', kind: 'grammar', options: [
          { id: 'one', label: 'An', sub: '一个' }, { id: 'this', label: 'This', sub: '这个' }, { id: 'that', label: 'That', sub: '那个' },
          { id: 'two', label: 'Two', sub: '两个' }, { id: 'bare', label: 'Apples' },
        ],
      },
    ],
    start: { who: 'i', time: 'habit', negate: 'none', type: 'statement', object: 'one' },
  },
];

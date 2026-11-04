import './styles/tokens.css';
import './styles/app.css';
import './styles/colors.css';
import { content } from './content';
import { h } from './dom';
import type { PhraseType, RoleStyle } from './model';

// Sample script for each Role, so every swatch shows a real example. Preview only.
const samples: Record<string, string> = {
  pronoun: '나', noun: '사과', verb: '줘', adjective: 'rød', demonstrative: '这', time: '내일',
  subject: '가', topic: '는', object: '를', recipient: '에게', possessive: '의', copula: '예요',
  connect: '고', measure: '个', ba: '把', modal: 'vil', 'final-particle': '喇',
  tense: '었', polite: '요', informal: '어', plural: '们', adverb: '就', question: '吗',
  potential: '到', definite: '-et', preposition: 'til', negation: '안',
};

const styleNames: Record<RoleStyle, string> = { chip: 'Chip', text: 'Colored text', inverted: 'Inverted' };

const phraseTypes: { type: PhraseType; label: string; sample: string; note?: string }[] = [
  { type: 'subject', label: 'Subject', sample: '나는' },
  { type: 'object', label: 'Object', sample: '사과를' },
  { type: 'indirect-object', label: 'Indirect object', sample: '존에게' },
  { type: 'verb-phrase', label: 'Verb phrase', sample: '줘요' },
  { type: 'modifier', label: 'Modifier', sample: '빨간' },
  { type: 'question', label: 'Question', sample: '뭐예요?' },
];

const tones = [
  { token: 'tone-1', label: 'Tone 1', mandarin: '妈 mā', cantonese: '詩 si1' },
  { token: 'tone-2', label: 'Tone 2', mandarin: '麻 má', cantonese: '史 si2' },
  { token: 'tone-3', label: 'Tone 3', mandarin: '马 mǎ', cantonese: '試 si3' },
  { token: 'tone-4', label: 'Tone 4', mandarin: '骂 mà', cantonese: '時 si4' },
  { token: 'tone-5', label: 'Tone 5', mandarin: '', cantonese: '市 si5' },
  { token: 'tone-6', label: 'Tone 6', mandarin: '', cantonese: '事 si6' },
  { token: 'tone-neutral', label: 'Neutral', mandarin: '吗 ma', cantonese: '' },
];

function usedBy(roleId: string): string {
  const names = content.languages.filter((l) => Object.hasOwn(l.roles, roleId)).map((l) => l.name);
  return names.length ? names.join(', ') : 'Not used yet';
}

function rolesPanel(theme: 'light' | 'dark'): HTMLElement {
  return h('section', { class: `panel theme-${theme}` }, [
    h('h2', {}, [theme === 'light' ? 'Roles · light mode' : 'Roles · dark mode']),
    h('div', { class: 'role-grid' }, Object.entries(content.roles).map(([id, role]) =>
      h('div', { class: 'role-row' }, [
        h('span', { class: `piece-script style-${role.style}`, '--role-color': `var(--role-${id})` }, [samples[id] ?? '·']),
        h('span', { class: 'role-text' }, [
          h('span', { class: 'role-name' }, [role.label]),
          h('span', { class: 'role-meta' }, [`--role-${id} · ${styleNames[role.style]} · ${usedBy(id)}`]),
        ]),
      ]),
    )),
  ]);
}

function phrasePanel(theme: 'light' | 'dark'): HTMLElement {
  return h('section', { class: `panel theme-${theme}` }, [
    h('h2', {}, [`Phrase Types · ${theme} mode`]),
    h('div', { class: 'phrase-grid' }, phraseTypes.map((p) =>
      h('div', { class: 'phrase', '--phrase-color': `var(--phrase-${p.type})` }, [
        h('span', { class: 'phrase-caption' }, [p.note ? `${p.label} (${p.note.toLowerCase()})` : p.label]),
        h('span', { class: 'phrase-sample' }, [p.sample]),
      ]),
    )),
  ]);
}

function tonePanel(theme: 'light' | 'dark'): HTMLElement {
  return h('section', { class: `panel theme-${theme}` }, [
    h('h2', {}, [`Tones · ${theme} mode`]),
    h('div', { class: 'tone-grid' }, tones.map((t) =>
      h('div', { class: 'tone' }, [
        h('span', { class: 'tone-label' }, [t.label]),
        h('span', { class: 'tone-sample', lang: 'zh-Hans', style: `color: var(--${t.token})` }, [t.mandarin || '—']),
        h('span', { class: 'tone-sample', lang: 'yue-Hant', style: `color: var(--${t.token})` }, [t.cantonese || '—']),
      ]),
    )),
    h('p', { class: 'panel-note' }, ['Rows: Mandarin, then Cantonese. Shown only when "Tone colors" is on.']),
  ]);
}

document.querySelector('#app')!.append(
  h('header', { class: 'site-header' }, [h('a', { class: 'site-title', href: './' }, ['Dictionary Layers'])]),
  h('main', { class: 'colors-page' }, [
    h('h1', { class: 'set-title' }, ['Color key']),
    h('p', { class: 'lead' }, ['Every color is a named token in src/styles/tokens.css, with its light and dark value side by side. Change a token once and it changes everywhere.']),
    h('div', { class: 'pair' }, [rolesPanel('light'), rolesPanel('dark')]),
    h('div', { class: 'pair' }, [phrasePanel('light'), phrasePanel('dark')]),
    h('div', { class: 'pair' }, [tonePanel('light'), tonePanel('dark')]),
    h('section', { class: 'panel' }, [
      h('h2', {}, ['Temporary emphasis']),
      h('p', { class: 'panel-note' }, [
        'Red is reserved for "just changed" on Switchboards and is never a Role color: ',
        h('span', { class: 'piece-script style-chip changed', '--role-color': 'var(--role-verb)' }, ['드려']),
      ]),
    ]),
  ]),
);

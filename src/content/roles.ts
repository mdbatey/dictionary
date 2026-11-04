import type { Role } from '../model';

// The site-wide Role list. Each Role's colour is the design token `--role-<id>` in src/styles/tokens.css.
// Each Language lists the Roles it uses, with its own general rule (see the Language files).
export const roles: Record<string, Role> = {
  // Chips: words and particles
  pronoun: { label: 'Pronoun', style: 'chip' },
  noun: { label: 'Noun', style: 'chip' },
  verb: { label: 'Verb', style: 'chip' },
  adjective: { label: 'Adjective', style: 'chip' },
  demonstrative: { label: 'Demonstrative', style: 'chip' },
  time: { label: 'Time word', style: 'chip' },
  subject: { label: 'Subject marker', style: 'chip' },
  topic: { label: 'Topic marker', style: 'chip' },
  object: { label: 'Object marker', style: 'chip' },
  recipient: { label: 'Recipient marker', style: 'chip' },
  possessive: { label: 'Possessive', style: 'chip' },
  copula: { label: 'Copula "to be"', style: 'chip' },
  connect: { label: 'Connecting ending', style: 'chip' },
  measure: { label: 'Measure word', style: 'chip' },
  ba: { label: '把 · disposal marker', style: 'chip' },
  modal: { label: 'Modal / helper verb', style: 'chip' },
  'final-particle': { label: 'Sentence-final particle', style: 'chip' },
  number: { label: 'Number', style: 'chip' },
  // Coloured text: endings and small grammar words
  tense: { label: 'Tense marker', style: 'text' },
  polite: { label: 'Polite suffix', style: 'text' },
  informal: { label: 'Informal ending', style: 'text' },
  plural: { label: 'Plural marker', style: 'text' },
  adverb: { label: 'Adverb', style: 'text' },
  question: { label: 'Question particle', style: 'text' },
  potential: { label: 'Potential complement', style: 'text' },
  definite: { label: 'Definite suffix ("the")', style: 'text' },
  preposition: { label: 'Preposition', style: 'text' },
  // Inverted
  negation: { label: 'Negation', style: 'inverted' },
};

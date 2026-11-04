import type { Role } from '../model';

// The site-wide Role list. Each Role's colour is the design token `--role-<id>` (see src/styles/tokens.css).
// Rules are taken from reference/breakdowns/korean-13-sentences.html.
export const roles: Record<string, Role> = {
  pronoun: { label: 'Pronoun', style: 'chip', rule: 'I, he, she, it. Korean drops these whenever context makes them clear.' },
  noun: { label: 'Noun', style: 'chip', rule: 'A thing, person or place. Particles attach right after it.' },
  topic: { label: 'Topic marker', style: 'chip', rule: 'Marks what the sentence is about. 는 after a vowel, 은 after a consonant.' },
  object: { label: 'Object marker', style: 'chip', rule: 'Marks the direct object (the thing given, eaten). 를 after a vowel, 을 after a consonant.' },
  recipient: { label: 'Recipient marker', style: 'chip', rule: "에게 means 'to' a person or animal. 한테 is the casual spoken version." },
  stem: { label: 'Verb / adjective stem', style: 'chip', rule: "The dictionary form with -다 removed. Adjectives like 'red' conjugate exactly like verbs." },
  polite: { label: 'Polite suffix', style: 'text', rule: '요 on the end makes it informal polite, the safe default with most people.' },
};

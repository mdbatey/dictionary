import type { Word } from '../model';

// The Korean word list. Forms, pronunciations and notes are taken from
// reference/switchboards/korean-switchboard.html. Pronunciation: rr = Revised Romanization as pronounced, ipa = IPA.
// Note: 주다 and 드리다 store their fused stem blocks (줘, 줬, 줄…) as the old page did; rules that work out
// regular Forms arrive with the "Who + Verb" Switchboard in v2.
export const koreanWords: Word[] = [
  // Pronouns: plain Form for casual/plain speech, polite Form for polite/formal speech.
  {
    id: 'i', script: '나', meaning: 'I', wordClass: 'pronoun', facts: { person: 1, number: 'singular' },
    forms: {
      plain: { script: '나', pron: { rr: 'na', ipa: 'na' }, gloss: 'I', note: "나 is the plain 'I', used in casual and plain speech." },
      polite: { script: '저', pron: { rr: 'jeo', ipa: 'tɕʌ' }, gloss: 'I (humble)', note: "저 is the humble 'I', expected in polite and formal speech." },
    },
  },
  {
    id: 'you', script: '너', meaning: 'you', wordClass: 'pronoun', facts: { person: 2, number: 'singular' },
    forms: {
      plain: { script: '너', pron: { rr: 'neo', ipa: 'nʌ' }, gloss: 'you', note: "너 is only for close friends and people younger than you. It's rude anywhere else." },
      polite: {
        script: '(you)', pron: { rr: '—', ipa: '—' }, gloss: 'dropped', dropped: true,
        note: "Koreans avoid saying 'you' in polite speech. Leave it out when it's obvious, or use the person's name or title (민수 씨는, 선생님은).",
      },
    },
  },
  {
    id: 'he', script: '그', meaning: 'he', wordClass: 'pronoun', facts: { person: 3, number: 'singular' },
    forms: { plain: { script: '그', pron: { rr: 'geu', ipa: 'kɯ' }, gloss: 'he', note: "그 for 'he' is mostly written. In speech people say 그 사람 (that person) or use the name." } },
  },
  {
    id: 'she', script: '그녀', meaning: 'she', wordClass: 'pronoun', facts: { person: 3, number: 'singular' },
    forms: { plain: { script: '그녀', pron: { rr: 'geunyeo', ipa: 'kɯnjʌ' }, gloss: 'she', note: '그녀 is mostly written. In speech: 그 사람 or the name.' } },
  },
  {
    id: 'we', script: '우리', meaning: 'we', wordClass: 'pronoun', facts: { person: 1, number: 'plural' },
    forms: {
      plain: { script: '우리', pron: { rr: 'uri', ipa: 'uɾi' }, gloss: 'we', note: "우리 is the plain 'we'." },
      polite: { script: '저희', pron: { rr: 'jeohui', ipa: 'tɕʌi' }, gloss: 'we (humble)', note: "저희 is the humble 'we'. Use it with people outside your group. The ㅎ is usually silent: jeo-i." },
    },
  },
  {
    id: 'they', script: '그들', meaning: 'they', wordClass: 'pronoun', facts: { person: 3, number: 'plural' },
    forms: {
      plain: {
        script: '그들', pron: { rr: 'geudeur', ipa: 'kɯdɯɾ' }, gloss: 'they', note: '그들 = 그 (he/that) + 들 (plural). Mostly written.',
        particleNote: 'The ㄹ of 들 slides onto it: geu-deu-reun.',
      },
    },
  },
  // Nouns
  {
    id: 'minho', script: '민호', meaning: 'Minho', wordClass: 'noun', tags: ['person'], pron: { rr: 'minho', ipa: 'minɦo' },
    note: 'The ㅎ between vowels or after ㄴ is soft, almost silent: [minɦo].',
  },
  {
    id: 'grandma', script: '할머니', meaning: 'Grandma', gloss: 'grandma', wordClass: 'noun', tags: ['person'],
    facts: { honorific: true }, pron: { rr: 'halmeoni', ipa: 'halmʌni' },
  },
  { id: 'apple', script: '사과', meaning: 'apple', wordClass: 'noun', tags: ['thing'], pron: { rr: 'sagwa', ipa: 'saɡwa' } },
  // Verbs
  {
    id: 'give', script: '주다', meaning: 'give', wordClass: 'verb', frames: ['ko-giving'], note: "주다 'to give'.",
    forms: {
      inf: { script: '줘', pron: { rr: 'jwo', ipa: 'tɕwʌ' } },
      base: { script: '주', pron: { rr: 'ju', ipa: 'tɕu' } },
      fut: { script: '줄', pron: { rr: 'jul', ipa: 'tɕul' } },
      fml: { script: '줍', pron: { rr: 'jum', ipa: 'tɕum' } },
      pln: { script: '준', pron: { rr: 'jun', ipa: 'tɕun' } },
      pastV: { script: '줬', pron: { rr: 'jwoss', ipa: 'tɕwʌs͈' } },
      pastC: { script: '줬', pron: { rr: 'jwot', ipa: 'tɕwʌt̚' } },
      pastN: { script: '줬', pron: { rr: 'jwon', ipa: 'tɕwʌn' } },
    },
  },
  {
    id: 'give-honorific', script: '드리다', meaning: 'give (to someone honoured)', wordClass: 'verb', frames: ['ko-giving'], honorificOf: 'give',
    note: '드리다 is the humble verb for giving to someone older or higher in status. It replaces 주다 completely.',
    forms: {
      inf: { script: '드려', pron: { rr: 'deuryeo', ipa: 'tɯɾjʌ' } },
      base: { script: '드리', pron: { rr: 'deuri', ipa: 'tɯɾi' } },
      fut: { script: '드릴', pron: { rr: 'deuril', ipa: 'tɯɾil' } },
      fml: { script: '드립', pron: { rr: 'deurim', ipa: 'tɯɾim' } },
      pln: { script: '드린', pron: { rr: 'deurin', ipa: 'tɯɾin' } },
      pastV: { script: '드렸', pron: { rr: 'deuryeoss', ipa: 'tɯɾjʌs͈' } },
      pastC: { script: '드렸', pron: { rr: 'deuryeot', ipa: 'tɯɾjʌt̚' } },
      pastN: { script: '드렸', pron: { rr: 'deuryeon', ipa: 'tɯɾjʌn' } },
    },
  },
];

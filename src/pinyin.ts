import { splitSyllables, toneOf } from './tones';

// Works out IPA from pinyin, one syllable at a time, joined with dashes ("píngguǒ" → "pʰiŋ˧˥-kwo˨˩˦").
// Tones are shown with Chao tone letters; the neutral tone has none. Tone sandhi is not applied:
// the IPA follows the tone the pinyin is written with.

const PLAIN: Record<string, string> = {};
for (const [marked, base] of [['āáǎà', 'a'], ['ēéěè', 'e'], ['īíǐì', 'i'], ['ōóǒò', 'o'], ['ūúǔù', 'u'], ['ǖǘǚǜü', 'v']] as const) {
  for (const c of marked) PLAIN[c] = base;
}

const INITIALS: Record<string, string> = {
  b: 'p', p: 'pʰ', m: 'm', f: 'f', d: 't', t: 'tʰ', n: 'n', l: 'l', g: 'k', k: 'kʰ', h: 'x',
  j: 'tɕ', q: 'tɕʰ', x: 'ɕ', zh: 'ʈʂ', ch: 'ʈʂʰ', sh: 'ʂ', r: 'ʐ', z: 'ts', c: 'tsʰ', s: 's',
};
const FINALS: Record<string, string> = {
  a: 'a', o: 'wo', e: 'ɤ', ai: 'ai', ei: 'ei', ao: 'au', ou: 'ou', an: 'an', en: 'ən', ang: 'aŋ', eng: 'əŋ', ong: 'ʊŋ', er: 'aɚ',
  i: 'i', ia: 'ja', iao: 'jau', ie: 'je', iu: 'jou', ian: 'jɛn', in: 'in', iang: 'jaŋ', ing: 'iŋ', iong: 'jʊŋ',
  u: 'u', ua: 'wa', uo: 'wo', uai: 'wai', ui: 'wei', uan: 'wan', un: 'wən', uang: 'waŋ', ueng: 'wəŋ',
  v: 'y', ve: 'ɥe', van: 'ɥɛn', vn: 'yn',
};
// Syllables written with y- or w- (no initial consonant).
const ZERO: Record<string, string> = {
  yi: 'i', ya: 'ja', yao: 'jau', ye: 'je', you: 'jou', yan: 'jɛn', yin: 'in', yang: 'jaŋ', ying: 'iŋ', yong: 'jʊŋ',
  yu: 'y', yue: 'ɥe', yuan: 'ɥɛn', yun: 'yn',
  wu: 'u', wa: 'wa', wo: 'wo', wai: 'wai', wei: 'wei', wan: 'wan', wen: 'wən', wang: 'waŋ', weng: 'wəŋ',
};
const TONE_LETTERS = ['', '˥', '˧˥', '˨˩˦', '˥˩'];

function syllableIpa(syllable: string): string | null {
  const plain = [...syllable.toLowerCase()].map((c) => PLAIN[c] ?? c).join('');
  const tone = TONE_LETTERS[toneOf(syllable, 'marks')]!;
  if (ZERO[plain]) return ZERO[plain] + tone;
  if (FINALS[plain] && /^[aoe]/.test(plain)) return (plain === 'o' ? 'o' : FINALS[plain]) + tone;
  const initial = ['zh', 'ch', 'sh'].find((i) => plain.startsWith(i)) ?? plain[0]!;
  let final = plain.slice(initial.length);
  if (!INITIALS[initial]) return null;
  // After j, q, x the written u is ü; after z/c/s and zh/ch/sh/r, i is a buzzed (apical) vowel.
  if ('jqx'.includes(initial) && final.startsWith('u')) final = 'v' + final.slice(1);
  let vowel = FINALS[final];
  if (final === 'i' && 'zcs'.includes(initial)) vowel = 'ɹ̩';
  if (final === 'i' && ['zh', 'ch', 'sh', 'r'].includes(initial)) vowel = 'ɻ̩';
  if (final === 'o' && 'bpmf'.includes(initial)) vowel = 'wo';
  if (!vowel) return null;
  return INITIALS[initial] + vowel + tone;
}

/** IPA for a Piece's pinyin, given how many characters it has (one syllable each). Null if it can't be split or read. */
export function pinyinToIpa(pinyin: string, characters: number): string | null {
  const syllables = splitSyllables(pinyin, characters, 'marks');
  if (!syllables) return null;
  const ipa = syllables.map(syllableIpa);
  return ipa.some((s) => s === null) ? null : ipa.join('-');
}

// Tones for tonal Languages: split a Piece's pronunciation into one syllable per character, and read each syllable's tone.

const MARKS: [string, number][] = [['āēīōūǖ', 1], ['áéíóúǘ', 2], ['ǎěǐǒǔǚ', 3], ['àèìòùǜ', 4]];
const BASE: Record<string, string> = {};
for (const [chars] of MARKS) [...chars].forEach((c, i) => (BASE[c] = 'aeiouv'[i]!));
BASE['ü'] = 'v';

const INITIALS = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w', ''];
const FINALS = new Set([
  'a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'er',
  'i', 'ia', 'iao', 'ie', 'iu', 'ian', 'in', 'iang', 'ing', 'iong',
  'u', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ueng', 'ue', 'v', 've', 'van', 'vn',
]);

/** Whether a toneless, lower-case string is one pinyin syllable. */
function isPinyinSyllable(s: string): boolean {
  return INITIALS.some((ini) => s.startsWith(ini) && FINALS.has(s.slice(ini.length)) && (ini !== '' || /^[aoe]/.test(s)));
}

/** Splits pinyin with tone marks (e.g. "píngguǒ") into exactly `count` syllables, or returns null if it can't. */
function splitPinyin(pinyin: string, count: number): string[] | null {
  const plain = [...pinyin.toLowerCase()].map((c) => BASE[c] ?? c).join('');
  const original = [...pinyin];
  const memo = new Map<string, number[] | null>();
  const go = (from: number, left: number): number[] | null => {
    const key = `${from},${left}`;
    if (memo.has(key)) return memo.get(key)!;
    let result: number[] | null = null;
    if (left === 0) result = from === plain.length ? [] : null;
    else {
      for (let end = Math.min(plain.length, from + 6); end > from && !result; end--) {
        if (!isPinyinSyllable(plain.slice(from, end))) continue;
        const rest = go(end, left - 1);
        if (rest) result = [end, ...rest];
      }
    }
    memo.set(key, result);
    return result;
  };
  const words = pinyin.split(/[\s'’-]+/).filter(Boolean);
  if (words.length > 1) {
    // Separators mark syllable boundaries; split each word, sharing out the count.
    const parts: string[] = [];
    let remaining = count;
    for (let i = 0; i < words.length; i++) {
      const word = words[i]!;
      const need = i === words.length - 1 ? remaining : [...Array(remaining).keys()].map((k) => k + 1).find((k) => splitPinyin(word, k) && splitPinyin(words.slice(i + 1).join(' '), remaining - k));
      if (!need) return null;
      const split = splitPinyin(word, need);
      if (!split) return null;
      parts.push(...split);
      remaining -= need;
    }
    return parts;
  }
  const ends = go(0, count);
  if (!ends) return null;
  let start = 0;
  return ends.map((end) => { const syl = original.slice(start, end).join(''); start = end; return syl; });
}

/** Splits a pronunciation into exactly `count` syllables, or returns null. */
export function splitSyllables(pron: string, count: number, style: 'marks' | 'numbers'): string[] | null {
  if (style === 'numbers') {
    const syllables = pron.trim().split(/\s+/);
    return syllables.length === count && syllables.every((s) => /[a-z]+[1-6]$/i.test(s)) ? syllables : null;
  }
  return splitPinyin(pron, count);
}

/** The tone of one syllable: 1–6, or 0 for neutral (pinyin without a tone mark). */
export function toneOf(syllable: string, style: 'marks' | 'numbers'): number {
  if (style === 'numbers') return Number(syllable.at(-1)) || 0;
  for (const [chars, tone] of MARKS) if ([...syllable].some((c) => chars.includes(c))) return tone;
  return 0;
}

/** The characters of a script string that each carry one syllable (Han characters). */
export function syllableCharacters(script: string): string[] {
  return [...script].filter((c) => /\p{Script=Han}/u.test(c));
}

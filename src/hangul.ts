// Works out IPA from Hangul, one syllable block at a time, joined with dashes ("사과" → "sa-kwa").
// Each syllable is read on its own: sound changes between syllables (linking, voicing, assimilation)
// are deliberately left out, so the result lines up with the Pieces like the romanization does.

const INITIALS = ['k', 'k͈', 'n', 't', 't͈', 'ɾ', 'm', 'p', 'p͈', 's', 's͈', '', 'tɕ', 't͈ɕ', 'tɕʰ', 'kʰ', 'tʰ', 'pʰ', 'h'];
const VOWELS = ['a', 'ɛ', 'ja', 'jɛ', 'ʌ', 'e', 'jʌ', 'je', 'o', 'wa', 'wɛ', 'we', 'jo', 'u', 'wʌ', 'we', 'wi', 'ju', 'ɯ', 'ɰi', 'i'];
// Final consonants as pronounced at the end of a syllable (e.g. ㅅ, ㅈ, ㅎ all sound as an unreleased t).
const FINALS = ['', 'k̚', 'k̚', 'k̚', 'n', 'n', 'n', 't̚', 'l', 'k̚', 'm', 'l', 'l', 'l', 'p̚', 'l', 'm', 'p̚', 'p̚', 't̚', 't̚', 'ŋ', 't̚', 't̚', 'k̚', 't̚', 'p̚', 't̚'];

/** IPA for one Hangul syllable block, or null if it isn't one. */
function syllableIpa(ch: string): string | null {
  const code = ch.codePointAt(0)! - 0xac00;
  if (code < 0 || code > 11171) return null;
  return INITIALS[Math.floor(code / 588)]! + VOWELS[Math.floor((code % 588) / 28)]! + FINALS[code % 28]!;
}

/** IPA for a Hangul word or Piece, syllables joined with dashes; `suffix` adds a leading dash (e.g. "-nɯn"). Null if not all Hangul. */
export function hangulToIpa(script: string, suffix = false): string | null {
  const syllables = [...script].map(syllableIpa);
  if (!syllables.length || syllables.some((s) => s === null)) return null;
  return (suffix ? '-' : '') + syllables.join('-');
}

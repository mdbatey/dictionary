// Works out Yale and IPA from Jyutping, syllable by syllable, so only Jyutping needs storing.

const INITIALS = ['ng', 'gw', 'kw', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'w', 'z', 'c', 's', 'j'];

interface Syllable { initial: string; final: string; tone: number; capital: boolean }

function parse(syllable: string): Syllable | null {
  const m = /^([A-Za-z]+)([1-6])$/.exec(syllable);
  if (!m) return null;
  const body = m[1]!.toLowerCase();
  const tone = Number(m[2]);
  const capital = m[1]![0] !== body[0];
  if (body === 'm' || body === 'ng') return { initial: '', final: body, tone, capital };
  const initial = INITIALS.find((i) => body.startsWith(i) && body.length > i.length) ?? '';
  const final = body.slice(initial.length);
  return IPA_FINALS[final] ? { initial, final, tone, capital } : null;
}

const capitalize = (s: string, yes: boolean) => (yes ? s[0]!.toUpperCase() + s.slice(1) : s);

// ---------- Yale ----------
const YALE_INITIALS: Record<string, string> = { z: 'j', c: 'ch', j: 'y' };
const YALE_MARK: Record<number, string> = { 1: '̄', 2: '́', 3: '', 4: '̀', 5: '́', 6: '' };

function yaleSyllable(s: Syllable): string {
  let initial = YALE_INITIALS[s.initial] ?? s.initial;
  let final = s.final === 'aa' ? 'a' : s.final.replace(/oe|eo/, 'eu');
  if (s.initial === 'j' && final.startsWith('yu')) initial = ''; // jyu → yu
  const low = s.tone >= 4;
  if (final === 'm' || final === 'ng') {
    return capitalize(final[0] + YALE_MARK[s.tone]! + final.slice(1) + (low ? 'h' : ''), s.capital).normalize('NFC');
  }
  // The tone mark goes on the first vowel (on the u of "yu"); the low-tone h follows the vowels.
  const vowels = /^(y?[aeiou]+)/.exec(final)?.[1] ?? '';
  const at = final.startsWith('yu') ? 1 : 0;
  const marked = vowels.slice(0, at + 1) + YALE_MARK[s.tone] + vowels.slice(at + 1);
  return capitalize(initial + marked + (low ? 'h' : '') + final.slice(vowels.length), s.capital).normalize('NFC');
}

// ---------- IPA ----------
const IPA_INITIALS: Record<string, string> = {
  '': '', b: 'p', p: 'pʰ', m: 'm', f: 'f', d: 't', t: 'tʰ', n: 'n', l: 'l', g: 'k', k: 'kʰ', ng: 'ŋ', h: 'h',
  gw: 'kʷ', kw: 'kʷʰ', w: 'w', z: 'ts', c: 'tsʰ', s: 's', j: 'j',
};
const IPA_FINALS: Record<string, string> = {
  aa: 'aː', aai: 'aːi', aau: 'aːu', aam: 'aːm', aan: 'aːn', aang: 'aːŋ', aap: 'aːp', aat: 'aːt', aak: 'aːk',
  a: 'ɐ', ai: 'ɐi', au: 'ɐu', am: 'ɐm', an: 'ɐn', ang: 'ɐŋ', ap: 'ɐp', at: 'ɐt', ak: 'ɐk',
  e: 'ɛː', ei: 'ei', eu: 'ɛːu', em: 'ɛːm', en: 'ɛːn', eng: 'ɛːŋ', ep: 'ɛːp', et: 'ɛːt', ek: 'ɛːk',
  i: 'iː', iu: 'iːu', im: 'iːm', in: 'iːn', ing: 'ɪŋ', ip: 'iːp', it: 'iːt', ik: 'ɪk',
  o: 'ɔː', oi: 'ɔːy', ou: 'ou', on: 'ɔːn', ong: 'ɔːŋ', ot: 'ɔːt', ok: 'ɔːk',
  oe: 'œː', oeng: 'œːŋ', oek: 'œːk', eoi: 'ɵy', eon: 'ɵn', eot: 'ɵt',
  u: 'uː', ui: 'uːy', un: 'uːn', ung: 'ʊŋ', ut: 'uːt', uk: 'ʊk',
  yu: 'yː', yun: 'yːn', yut: 'yːt', m: 'm̩', ng: 'ŋ̍',
};
const IPA_TONES: Record<number, string> = { 1: '˥', 2: '˧˥', 3: '˧', 4: '˨˩', 5: '˩˧', 6: '˨' };

function ipaSyllable(s: Syllable): string {
  return IPA_INITIALS[s.initial]! + IPA_FINALS[s.final]! + IPA_TONES[s.tone]!;
}

/** Converts Jyutping ("ping4 gwo2") to Yale or IPA, or returns null if any syllable isn't valid Jyutping. */
export function fromJyutping(jyutping: string, to: 'yale' | 'ipa'): string | null {
  const syllables = jyutping.trim().split(/\s+/).map(parse);
  if (syllables.some((s) => !s)) return null;
  return (syllables as Syllable[]).map(to === 'yale' ? yaleSyllable : ipaSyllable).join(' ');
}

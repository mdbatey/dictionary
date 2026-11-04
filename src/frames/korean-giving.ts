import type { Language, Piece, Word } from '../model';
import type { Frame } from './types';

// The Korean giving Frame: "[who] [to whom] [what] give". Ported from the grammar of
// reference/switchboards/korean-switchboard.html; notes are kept word for word.

const R = (rr: string, ipa: string) => ({ rr, ipa });
type Pron = ReturnType<typeof R>;

function piece(script: string, pron: Pron, gloss: string, role: string, note?: string | null, extra: Partial<Piece> = {}): Piece {
  return { script, pron, gloss, role, ...(note ? { note } : {}), ...extra };
}

/** Whether a Hangul syllable block ends in a consonant (has a final consonant, 받침). */
function endsInConsonant(script: string): boolean {
  const code = script.codePointAt(script.length - 1) ?? 0;
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
}

const humble = (level: string) => level === 'polite' || level === 'formal';

function subject(who: Word, level: string): Piece[] {
  const form = (humble(level) && who.forms?.['polite']) || who.forms?.['plain'];
  if (!form) throw new Error(`${who.id} has no plain Form`);
  if (form.dropped) return [piece(form.script, R('—', '—'), form.gloss ?? 'dropped', 'pronoun', form.note, { dropped: true })];
  const pron = piece(form.script, form.pron as Pron, form.gloss ?? who.gloss ?? who.meaning, 'pronoun', form.note);
  const topic = endsInConsonant(form.script)
    ? piece('은', R('eun', 'ɯn'), 'topic', 'topic', ['The word ends in a consonant, so 은 instead of 는.', form.particleNote].filter(Boolean).join(' '))
    : piece('는', R('neun', 'nɯn'), 'topic', 'topic');
  return [pron, topic];
}

function receiver(to: Word, level: string): Piece[] {
  const noun = piece(to.script, to.pron as Pron, to.gloss ?? to.meaning, 'noun', to.note);
  return to.facts?.honorific
    ? [noun, piece('께', R('kke', 'k͈e'), 'to (hon.)', 'recipient', '께 is the honorific version of 에게. Use it for people you show respect to.')]
    : [noun, piece('에게', R('ege', 'eɡe'), 'to', 'recipient', level === 'casual' ? 'In casual speech most people say 한테 (hante) instead.' : null)];
}

function object(thing: Word): Piece[] {
  const noun = piece(thing.script, thing.pron as Pron, thing.gloss ?? thing.meaning, 'noun', thing.note);
  return endsInConsonant(thing.script) ? [noun, piece('을', R('eul', 'ɯl'), 'd.o.', 'object')] : [noun, piece('를', R('reul', 'ɾɯl'), 'd.o.', 'object')];
}

/** The verb's first consonant changes sound after 안 (voiced) or 못 (tensed); spelling and RR stay the same. */
function afterNeg(rom: Pron, negate: string): Pron {
  if (negate === 'dont') return R(rom.rr, rom.ipa.replace(/^tɕ/, 'dʑ').replace(/^t(?!ɕ)/, 'd'));
  if (negate === 'cant') return R(rom.rr, rom.ipa.replace(/^tɕ/, 't͈ɕ').replace(/^t(?!ɕ|͈)/, 't͈'));
  return rom;
}

function verb(V: Word, g: Record<string, string>): Piece[] {
  const { level, tense, negate } = g as Record<'level' | 'tense' | 'negate' | 'type', string>;
  const q = g['type'] === 'question';
  const nb = V.note ?? '';
  const F = (name: string): [string, Pron] => {
    const form = V.forms?.[name];
    if (!form) throw new Error(`${V.id} has no "${name}" Form`);
    return [form.script, form.pron as Pron];
  };
  const out: Piece[] = [];
  if (negate !== 'none') {
    out.push(negate === 'dont'
      ? piece('안', R('an', 'an'), 'not', 'negation', "안 = don't / won't. It's a choice not to give. After 안, the next consonant is voiced: [an dʑwʌ].")
      : piece('못', R('mot', 'mot̚'), "can't", 'negation', "못 = can't. Something prevents it. It makes the next consonant tense: 못 줘 sounds like [mot̚ t͈ɕwʌ]."));
  }
  let first = true;
  const P = (pair: [string, Pron], gloss: string, role: string, note?: string, fuse?: string): Piece => {
    let rom = pair[1];
    if (first) { rom = afterNeg(rom, negate); first = false; }
    return piece(pair[0], rom, gloss, role, note, fuse ? { fuse } : {});
  };
  const inf = F('inf'), base = F('base'), fut = F('fut'), fml = F('fml'), pln = F('pln');
  if (tense === 'present') {
    if (level === 'casual') out.push(P(inf, 'give', 'verb', `${nb} Stem + casual ending 어 contract into ${inf[0]}.`, 'informal'));
    if (level === 'polite') out.push(P(inf, 'give', 'verb', `${nb} Stem + 어 contract into ${inf[0]}.`, 'informal'),
      piece('요', R('yo', 'jo'), 'pol', 'polite', '요 turns the casual form into polite speech. Questions use the same form with rising intonation.'));
    if (level === 'formal') out.push(P(fml, 'give', 'verb', `${nb} The ㅂ of the formal ending tucks under the stem: ${base[0]} + ㅂ → ${fml[0]}. Before ㄴ it's pronounced m: ${fml[1].rr}-ni-da.`, 'polite'),
      q ? piece('니까', R('nikka', 'nik͈a'), '?(fml)', 'polite', 'The formal question ending. Statements end in 니다 instead.') : piece('니다', R('nida', 'nida'), 'fml', 'polite', 'The formal polite statement ending.'));
    if (level === 'plain') {
      if (q) out.push(P(base, 'give', 'verb', nb), piece('니', R('ni', 'ni'), '?', 'informal', 'Plain question ending, typically adult → child.'));
      else out.push(P(pln, 'give', 'verb', `${nb} Present plain statements add ㄴ다 after a vowel: ${base[0]} + ㄴ → ${pln[0]}.`, 'informal'),
        piece('다', R('da', 'da'), 'plain', 'informal', 'The plain (written) statement ending. After ㄴ the ㄷ is voiced: [nda].'));
    }
  }
  if (tense === 'past') {
    const pastV = F('pastV'), pastC = F('pastC'), pastN = F('pastN');
    const pastNote = (form: [string, Pron]) => `${nb} Stem + past 었 contract into ${form[0]}. The blue underline marks the tense fused inside the block.`;
    if (level === 'casual') out.push(P(pastV, 'gave', 'verb', `${pastNote(pastV)} Before a vowel the ㅆ moves onto the next syllable: -sseo.`, 'tense'),
      piece('어', R('eo', 'ʌ'), '', 'informal', 'Casual ending after the past marker.'));
    if (level === 'polite') out.push(P(pastV, 'gave', 'verb', `${pastNote(pastV)} Before a vowel the ㅆ moves onto the next syllable: -sseo-yo.`, 'tense'),
      piece('어', R('eo', 'ʌ'), '', 'informal'), piece('요', R('yo', 'jo'), 'pol', 'polite'));
    if (level === 'formal') out.push(P(pastC, 'gave', 'verb', `${pastNote(pastC)} Before a consonant the ㅆ is cut short (t) and makes the next sound tense.`, 'tense'),
      q ? piece('습니까', R('seumnikka', 's͈ɯmnik͈a'), '?(fml)', 'polite', 'After a consonant (the ㅆ of 었) the formal ending is 습니까.')
        : piece('습니다', R('seumnida', 's͈ɯmnida'), 'fml', 'polite', 'After a consonant (the ㅆ of 었) the formal ending is 습니다, not ㅂ니다. Pronounced -sseum-ni-da.'));
    if (level === 'plain') out.push(
      q ? P(pastN, 'gave', 'verb', `${pastNote(pastN)} Before ㄴ the ㅆ turns into n: -n-ni.`, 'tense') : P(pastC, 'gave', 'verb', `${pastNote(pastC)} Before ㄷ the ㅆ is cut short and tenses it: -t-tta.`, 'tense'),
      q ? piece('니', R('ni', 'ni'), '?', 'informal') : piece('다', R('da', 't͈a'), 'plain', 'informal', 'In the past, the plain ending is just 다.'));
  }
  if (tense === 'future') {
    out.push(P(fut, 'give', 'verb', `${nb} Stem + ㄹ ('will') → ${fut[0]}. The blue underline marks the future ㄹ. It makes the next consonant tense: 거 sounds like [k͈ʌ].`, 'tense'));
    if (level === 'casual') out.push(piece('거', R('geo', 'k͈ʌ'), 'thing', 'tense', "거 = 것 'thing'. -ㄹ 거 = 'the thing that will…', the everyday future."), piece('야', R('ya', 'ja'), 'is', 'copula', "Casual 'is'."));
    if (level === 'polite') out.push(piece('거', R('geo', 'k͈ʌ'), 'thing', 'tense', "거 = 것 'thing'. -ㄹ 거 = 'the thing that will…'."), piece('예요', R('yeyo', 'jejo'), 'is', 'copula', "Polite 'is' after a vowel."));
    if (level === 'formal') out.push(q ? piece('겁니까', R('geomnikka', 'k͈ʌmnik͈a'), 'thing+is?', 'copula', '것 + 입니까 contracted. Formal question.') : piece('겁니다', R('geomnida', 'k͈ʌmnida'), 'thing+is', 'copula', '것 + 입니다 contracted. Formal statement.'));
    if (level === 'plain') out.push(
      q ? piece('거', R('geo', 'k͈ʌ'), 'thing', 'tense') : piece('것', R('geos', 'k͈ʌɕ'), 'thing', 'tense', 'In writing the full 것 is used, not 거. Before 이 the ㅅ is pronounced [ɕ]: geo-si-da.'),
      q ? piece('니', R('ni', 'ni'), '?', 'informal', 'Plain question.') : piece('이다', R('ida', 'ida'), 'is', 'copula', "Plain 'is': the dictionary form of the copula."));
  }
  return out;
}

function english(who: Word, to: Word, thing: Word, g: Record<string, string>): string {
  const S = who.meaning;
  const third = who.facts?.person === 3 && who.facts.number === 'singular';
  const q = g['type'] === 'question';
  const cap = (x: string) => x[0]!.toUpperCase() + x.slice(1);
  const key = `${g['tense']}-${g['negate']}`;
  const T: Record<string, (string | null)[]> = {
    'present-none': q ? [third ? 'does' : 'do', null] : [null, third ? 'gives' : 'give'],
    'present-dont': [third ? "doesn't" : "don't"], 'present-cant': ["can't"],
    'past-none': q ? ['did', null] : [null, 'gave'], 'past-dont': ["didn't"], 'past-cant': ["couldn't"],
    'future-none': ['will'], 'future-dont': ["won't"], 'future-cant': ["won't", null, 'be able to give'],
  };
  const t = T[key]!;
  const aux = t[0];
  let main = 'give';
  if (t[1]) main = t[1];
  if (t[2]) main = t[2];
  const rest = `${to.meaning} the ${thing.meaning}`;
  const txt = q ? `${cap(aux!)} ${S} ${main} ${rest}?` : aux ? `${cap(S)} ${aux} ${main} ${rest}.` : `${cap(S)} ${main} ${rest}.`;
  return txt.replace(/^i /, 'I ');
}

export const koreanGiving: Frame = {
  id: 'ko-giving',
  languageId: 'ko',
  slots: {
    who: { wordClass: 'pronoun', forms: ['plain'], facts: ['person', 'number'] },
    to: { wordClass: 'noun', tags: ['person'] },
    thing: { wordClass: 'noun', tags: ['thing'] },
    verb: { wordClass: 'verb', forms: ['inf', 'base', 'fut', 'fml', 'pln', 'pastV', 'pastC', 'pastN'] },
  },
  grammar: ['level', 'tense', 'negate', 'type'],
  build(words, grammar, language: Language) {
    const who = words['who']!, to = words['to']!, thing = words['thing']!;
    // Giving to someone honoured swaps in the verb linked to this one by an Honorific Link (주다 → 드리다).
    const plainVerb = words['verb']!;
    const V = to.facts?.honorific ? language.words.find((w) => w.honorificOf === plainVerb.id) ?? plainVerb : plainVerb;
    return {
      parts: [
        { type: 'subject', caption: 'subject', pieces: subject(who, grammar['level']!) },
        { type: 'indirect-object', caption: 'receiver', pieces: receiver(to, grammar['level']!) },
        { type: 'object', caption: 'object', pieces: object(thing) },
        { type: 'verb-phrase', caption: 'verb', pieces: verb(V, grammar) },
        grammar['type'] === 'question' ? '?' : '.',
      ],
      translation: english(who, to, thing, grammar),
    };
  },
};

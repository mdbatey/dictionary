import type { Piece, Word } from '../model';
import type { Frame } from './types';

// The Cantonese giving Frame: "[who] 畀 [what] [to whom]" (the thing comes before the person). Ported from
// the grammar of reference/switchboards/cantonese-switchboard.html; notes are kept word for word.

function piece(script: string, jyutping: string, gloss: string, role: string, note?: string | null): Piece {
  return { script, pron: { jyutping }, gloss, role, ...(note ? { note } : {}) };
}

function subject(who: Word): Piece[] {
  const plain = who.forms?.['plain'];
  if (!plain) throw new Error(`${who.id} has no plain Form`);
  const out = [piece(plain.script, plain.pron['jyutping']!, plain.gloss ?? who.meaning, 'pronoun', plain.note)];
  const suffix = who.forms?.['suffix'];
  if (suffix) out.push(piece(suffix.script, suffix.pron['jyutping']!, suffix.gloss ?? 'pl.', 'plural', suffix.note));
  return out;
}

function verb(give: Word, g: Record<string, string>): Piece[] {
  const out: Piece[] = [];
  const G = (note?: string) => piece(give.script, give.pron!['jyutping']!, give.meaning, 'verb', note || give.note);
  const time = g['time'];
  if (g['type'] === 'a-not-a') {
    switch (time) {
      case 'habit': out.push(G(), piece('唔', 'm4', 'not', 'negation', "A-not-A: 畀唔畀 = 'give not give?', the everyday yes/no question."), G()); break;
      case 'zo': out.push(piece('有', 'jau5', 'have', 'modal', '有冇 + verb asks whether something happened. 咗 drops out.'), piece('冇', 'mou5', 'not have', 'negation'), G()); break;
      case 'gwo': out.push(piece('有', 'jau5', 'have', 'modal'), piece('冇', 'mou5', 'not have', 'negation'), G(), piece('過', 'gwo3', 'ever', 'tense', "過 stays: 'have you ever given…?'")); break;
      case 'gan': out.push(piece('係', 'hai6', 'is', 'modal', "係唔係 ('is it or isn't it') wraps around a statement to make a question."), piece('唔', 'm4', 'not', 'negation'), piece('係', 'hai6', 'is', 'modal'), G(), piece('緊', 'gan2', '-ing', 'tense')); break;
      case 'wui': out.push(piece('會', 'wui5', 'will', 'modal', 'The helper verb is doubled, not 畀.'), piece('唔', 'm4', 'not', 'negation'), piece('會', 'wui5', 'will', 'modal'), G()); break;
    }
    return out;
  }
  const neg = g['negate'] === 'not';
  if (neg) {
    if (time === 'habit') out.push(piece('唔', 'm4', 'not', 'negation', "唔 m4 for habits and choices. It's a syllabic m with no vowel."));
    if (time === 'zo') out.push(piece('冇', 'mou5', 'not have', 'negation', "冇 (literally 'not have') says it didn't happen. It replaces 咗, so 咗 disappears."));
    if (time === 'gwo') out.push(piece('冇', 'mou5', 'not have', 'negation', "冇 + verb + 過 = 'have never'. Unlike 咗, 過 stays."));
    if (time === 'gan') out.push(piece('冇', 'mou5', 'not have', 'negation', "冇 + verb + 緊 = 'isn't (in the middle of) doing'."));
    if (time === 'wui') out.push(piece('唔', 'm4', 'not', 'negation', "唔會 = won't."));
  }
  if (time === 'wui') out.push(piece('會', 'wui5', 'will', 'modal', '會 goes before the verb: will / likely to.'));
  out.push(G());
  if (time === 'zo' && !neg) out.push(piece('咗', 'zo2', 'done', 'tense', "咗 right after the verb marks the action as done, like Mandarin 了. It isn't a past tense."));
  if (time === 'gwo') out.push(piece('過', 'gwo3', 'ever', 'tense', '過 after the verb: has happened at least once.'));
  if (time === 'gan') out.push(piece('緊', 'gan2', '-ing', 'tense', '緊 after the verb means in progress. Mandarin puts 在 before the verb instead.'));
  return out;
}

function object(thing: Word, g: Record<string, string>): Piece[] {
  const neg = g['negate'] === 'not' && g['type'] !== 'a-not-a';
  const noun = (note?: string) => piece(thing.script, thing.pron!['jyutping']!, thing.gloss ?? thing.meaning, 'noun', note);
  const mw = (note?: string) => piece('個', 'go3', '(mw)', 'measure', note);
  if (g['object'] === 'one' && neg) return [noun("Negative sentences usually drop 一個: you didn't give 'an apple', you didn't give apples at all.")];
  switch (g['object']) {
    case 'the': return [mw("個 with no number in front works like 'the': 個蘋果 = the apple. Mandarin can't do this."), noun()];
    case 'one': return [piece('一', 'jat1', 'one', 'number'), mw(), noun()];
    case 'this': return [piece('呢', 'ni1', 'this', 'demonstrative', '呢 ni1 = this.'), mw(), noun()];
    case 'that': return [piece('嗰', 'go2', 'that', 'demonstrative', "嗰 go2 = that. It's not the same word as 個 go3: different tone, different character."), mw(), noun()];
    default: return [piece('兩', 'loeng5', 'two', 'number', "Use 兩, not 二, for 'two' before a measure word."), mw(), noun("蘋果 doesn't change for plural.")];
  }
}

function receiver(to: Word, g: Record<string, string>): Piece[] {
  const out = [piece(to.script, to.pron!['jyutping']!, to.gloss ?? to.meaning, 'noun', to.note)];
  if (g['type'] === 'maa') out.push(piece('嗎', 'maa3', '?', 'question', '嗎 sounds formal or Mandarin-like in Cantonese. Everyday speech prefers A-not-A (畀唔畀) or other particles.'));
  if (g['type'] === 'statement' && g['ending'] === 'gaa') out.push(piece('㗎', 'gaa3', '(explaining)', 'final-particle', "㗎 adds 'that's how it is'. It explains or reassures, like saying 'you know' or 'I do'."));
  if (g['type'] === 'statement' && g['ending'] === 'laa') out.push(piece('喇', 'laa3', '(now/already)', 'final-particle', "喇 marks a new situation: 'now', 'already', or 'not anymore' in negative sentences."));
  return out;
}

function english(who: Word, to: Word, thing: Word, g: Record<string, string>): string {
  const S = who.meaning;
  const third = who.facts?.person === 3 && who.facts.number === 'singular';
  const be = who.facts?.person === 1 && who.facts.number === 'singular' ? 'am' : third ? 'is' : 'are';
  const have = third ? 'has' : 'have';
  const neg = g['negate'] === 'not' && g['type'] !== 'a-not-a';
  const q = g['type'] !== 'statement';
  const n = thing.meaning;
  const O = ({ the: `the ${n}`, one: neg ? `any ${n}s` : `${/^[aeiou]/.test(n) ? 'an' : 'a'} ${n}`, this: `this ${n}`, that: `that ${n}`, two: `two ${n}s` } as Record<string, string>)[g['object']!]!;
  const R = to.meaning;
  const cap = (x: string) => x[0]!.toUpperCase() + x.slice(1);
  let t = '';
  switch (g['time']) {
    case 'habit': t = !q ? (neg ? `${S} ${third ? "doesn't" : "don't"} give ${R} ${O}.` : `${S} ${third ? 'gives' : 'give'} ${R} ${O}.`) : `${neg ? (third ? "Doesn't" : "Don't") : third ? 'Does' : 'Do'} ${S} give ${R} ${O}?`; break;
    case 'zo': t = !q ? (neg ? `${S} didn't give ${R} ${O}.` : `${S} gave ${R} ${O}.`) : `${neg ? "Didn't" : 'Did'} ${S} give ${R} ${O}?`; break;
    case 'gwo': t = !q ? (neg ? `${S} ${have} never given ${R} ${O}.` : `${S} ${have} given ${R} ${O} before.`) : neg ? `${cap(have)}n't ${S} ever given ${R} ${O}?` : `${cap(have)} ${S} ever given ${R} ${O}?`; break;
    case 'gan': t = !q ? (neg ? `${S} ${be} not giving ${R} ${O}.` : `${S} ${be} giving ${R} ${O}.`) : neg ? `${be === 'am' ? "Aren't" : `${cap(be)}n't`} ${S} giving ${R} ${O}?` : `${cap(be)} ${S} giving ${R} ${O}?`; break;
    case 'wui': t = !q ? (neg ? `${S} won't give ${R} ${O}.` : `${S} will give ${R} ${O}.`) : `${neg ? "Won't" : 'Will'} ${S} give ${R} ${O}?`; break;
  }
  return cap(t).replace(/ i /g, ' I ');
}

export const cantoneseGiving: Frame = {
  id: 'yue-giving',
  languageId: 'yue',
  slots: {
    who: { wordClass: 'pronoun', forms: ['plain'], facts: ['person', 'number'] },
    to: { wordClass: 'noun', tags: ['person'] },
    thing: { wordClass: 'noun', tags: ['thing'] },
    verb: { wordClass: 'verb' },
  },
  grammar: ['time', 'negate', 'type', 'object', 'ending'],
  disallowed(g): Record<string, Record<string, string>> {
    const out: Record<string, Record<string, string>> = {};
    if (g['type'] === 'a-not-a') out['negate'] = { not: 'An A-not-A question already contains the negative.' };
    const ending: Record<string, string> = {};
    if (g['type'] !== 'statement') {
      ending['gaa'] = ending['laa'] = 'Ending particles here are for statements.';
    } else if (g['time'] === 'gwo' || g['time'] === 'gan' || (g['negate'] === 'not' && g['time'] === 'zo')) {
      ending['laa'] = "喇 doesn't sound natural with this combination.";
    }
    if (Object.keys(ending).length) out['ending'] = ending;
    return out;
  },
  build(words, grammar) {
    const who = words['who']!, to = words['to']!, thing = words['thing']!, give = words['verb']!;
    return {
      parts: [
        { type: 'subject', caption: 'subject', pieces: subject(who) },
        { type: 'verb-phrase', caption: 'verb', pieces: verb(give, grammar) },
        { type: 'object', caption: 'object', pieces: object(thing, grammar) },
        { type: 'indirect-object', caption: 'receiver', pieces: receiver(to, grammar) },
        grammar['type'] === 'statement' ? '。' : '？',
      ],
      translation: english(who, to, thing, grammar),
    };
  },
};

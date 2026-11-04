import type { Piece, Word } from '../model';
import type { Frame } from './types';

// The Mandarin giving Frame: "[who] 给 [to whom] [what]". Ported from the grammar of
// reference/switchboards/mandarin-switchboard.html; notes are kept word for word.

function piece(script: string, pinyin: string, gloss: string, role: string, note?: string | null): Piece {
  return { script, pron: { pinyin }, gloss, role, ...(note ? { note } : {}) };
}

const SANDHI3 = "给 gěi and 小 xiǎo are both 3rd tone. When two 3rd tones meet, the first is spoken rising: gěi Xiǎo sounds like géi Xiǎo. Pinyin normally keeps the written tone, so it's written gěi here.";

function subject(who: Word): Piece[] {
  const plain = who.forms?.['plain'];
  if (!plain) throw new Error(`${who.id} has no plain Form`);
  const out = [piece(plain.script, plain.pron['pinyin']!, plain.gloss ?? who.meaning, 'pronoun', plain.note)];
  const suffix = who.forms?.['suffix'];
  if (suffix) out.push(piece(suffix.script, suffix.pron['pinyin']!, suffix.gloss ?? 'pl.', 'plural', suffix.note));
  return out;
}

function verb(give: Word, g: Record<string, string>): Piece[] {
  const out: Piece[] = [];
  const G = (note?: string | null) => piece(give.script, give.pron!['pinyin']!, give.meaning, 'verb', note);
  const time = g['time'];
  if (g['type'] === 'a-not-a') {
    switch (time) {
      case 'habit': out.push(G(), piece('不', 'bu', 'not', 'negation', 'In A-not-A questions 不 is unstressed and neutral tone.'), G()); break;
      case 'le': out.push(piece('有', 'yǒu', 'have', 'modal', '有没有 + verb asks whether something happened.'), piece('没', 'méi', 'not', 'negation'), piece('有', 'yǒu', 'have', 'modal'),
        G("了 drops out in A-not-A questions. 有没有 already asks 'did it happen?'")); break;
      case 'guo': out.push(piece('有', 'yǒu', 'have', 'modal'), piece('没', 'méi', 'not', 'negation'), piece('有', 'yǒu', 'have', 'modal'), G(), piece('过', 'guo', 'ever', 'tense', "过 stays: 'have you ever given…?'")); break;
      case 'zai': out.push(piece('是', 'shì', 'is', 'modal', "是不是 ('is it or isn't it') can wrap around almost any statement to make a question."), piece('不', 'bu', 'not', 'negation'), piece('是', 'shì', 'is', 'modal'), piece('在', 'zài', '-ing', 'tense'), G()); break;
      case 'hui': out.push(piece('会', 'huì', 'will', 'modal', 'The helper verb is doubled, not 给.'), piece('不', 'bu', 'not', 'negation', 'Unstressed in A-not-A, so no tone change.'), piece('会', 'huì', 'will', 'modal'), G()); break;
    }
    return out;
  }
  const neg = g['negate'] === 'not';
  const nextRisesNote = time === 'guo' || (time === 'le' && !neg) ? null : SANDHI3;
  if (neg) {
    if (time === 'habit') out.push(piece('不', 'bù', 'not', 'negation', "不 for habits and choices: 'I don't give him apples.' It stays 4th tone because 给 is 3rd tone."));
    if (time === 'le') out.push(piece('没', 'méi', 'not', 'negation', '没 (short for 没有) says it didn\'t happen. It replaces 了, so 了 disappears.'));
    if (time === 'guo') out.push(piece('没', 'méi', 'not', 'negation', "没 + verb + 过 = 'have never'. Unlike 了, 过 stays."));
    if (time === 'zai') out.push(piece('没', 'méi', 'not', 'negation', "没在 = 'isn't (in the middle of) doing'. 不在 would mean 'isn't here'."));
    if (time === 'hui') out.push(piece('不', 'bú', 'not', 'negation', '不 changes from 4th tone (bù) to 2nd tone (bú) before another 4th tone. 会 is huì, so it\'s bú huì.'));
  }
  if (time === 'zai') out.push(piece('在', 'zài', '-ing', 'tense', "在 before the verb means the action is in progress. It's the same character as 'at/in' a place."));
  if (time === 'hui') out.push(piece('会', 'huì', 'will', 'modal', "会 = will / likely to. It also means 'can' for learned skills (我会说中文, I can speak Chinese)."));
  out.push(G(nextRisesNote));
  if (time === 'le' && !neg) out.push(piece('了', 'le', 'done', 'tense', "了 right after the verb marks the action as completed. It isn't a past tense. It says the action finished, whenever that was."));
  if (time === 'guo') out.push(piece('过', 'guo', 'ever', 'tense', "过 after the verb means it has happened at least once: 'have given before'."));
  return out;
}

function receiver(to: Word): Piece[] {
  return [piece(to.script, to.pron!['pinyin']!, to.gloss ?? to.meaning, 'noun', to.note)];
}

function object(thing: Word, g: Record<string, string>): Piece[] {
  const neg = g['negate'] === 'not' && g['type'] !== 'a-not-a';
  const o = g['object'];
  const out: Piece[] = [];
  const noun = (note?: string | null) => piece(thing.script, thing.pron!['pinyin']!, thing.gloss ?? thing.meaning, 'noun', note || "The noun is the same for one apple or many. There's no plural ending.");
  if (o === 'one' && neg) {
    out.push(noun("Negative sentences usually drop 一个. You didn't give 'an apple', you didn't give apples at all."));
  } else {
    if (o === 'one') out.push(piece('一', 'yí', 'one', 'number', '一 is yī on its own but becomes yí before a 4th tone like 个 gè.'), piece('个', 'gè', '(mw)', 'measure', "The general measure word. It's required between 一 and 苹果."));
    if (o === 'this') out.push(piece('这', 'zhè', 'this', 'demonstrative'), piece('个', 'ge', '(mw)', 'measure', 'In 这个 / 那个 the 个 is usually unstressed (neutral tone).'));
    if (o === 'that') out.push(piece('那', 'nà', 'that', 'demonstrative'), piece('个', 'ge', '(mw)', 'measure'));
    if (o === 'two') out.push(piece('两', 'liǎng', 'two', 'number', "Use 两 (liǎng), not 二 (èr), for 'two' before a measure word."), piece('个', 'ge', '(mw)', 'measure'));
    const bareLe = o === 'bare' && g['time'] === 'le' && g['type'] !== 'a-not-a' && !neg;
    out.push(noun(bareLe ? 'With a bare noun, 了 right after the verb sounds unfinished. Native speakers would add a number (一个) or end the sentence with 了.'
      : o === 'bare' ? 'With no number or measure word, 苹果 means apples in general.' : null));
  }
  if (g['type'] === 'ma') out.push(piece('吗', 'ma', '?', 'question', '吗 is neutral tone. Add it to the end of a statement and it becomes a yes/no question.'));
  return out;
}

function english(who: Word, to: Word, thing: Word, g: Record<string, string>): string {
  const S = who.meaning.replace(/ \(.*\)$/, '');
  const third = who.facts?.person === 3 && who.facts.number === 'singular';
  const be = who.facts?.person === 1 && who.facts.number === 'singular' ? 'am' : third ? 'is' : 'are';
  const have = third ? 'has' : 'have';
  const n = thing.meaning;
  const O = ({ one: `${/^[aeiou]/.test(n) ? 'an' : 'a'} ${n}`, this: `this ${n}`, that: `that ${n}`, two: `two ${n}s`, bare: `${n}s` } as Record<string, string>)[g['object']!]!;
  const q = g['type'] !== 'statement';
  const neg = g['negate'] === 'not' && g['type'] !== 'a-not-a';
  const Oneg = neg && g['object'] === 'one' ? `any ${n}s` : O;
  const cap = (x: string) => x[0]!.toUpperCase() + x.slice(1);
  const R = to.meaning;
  const Ob = neg ? Oneg : O;
  let t = '';
  switch (g['time']) {
    case 'habit':
      t = !q ? (neg ? `${S} ${third ? "doesn't" : "don't"} give ${R} ${Ob}.` : `${S} ${third ? 'gives' : 'give'} ${R} ${Ob}.`)
        : `${neg ? (third ? "Doesn't" : "Don't") : third ? 'Does' : 'Do'} ${S} give ${R} ${Ob}?`; break;
    case 'le':
      t = !q ? (neg ? `${S} didn't give ${R} ${Ob}.` : `${S} gave ${R} ${Ob}.`) : `${neg ? "Didn't" : 'Did'} ${S} give ${R} ${Ob}?`; break;
    case 'guo':
      t = !q ? (neg ? `${S} ${have} never given ${R} ${Ob}.` : `${S} ${have} given ${R} ${Ob} before.`)
        : neg ? `${cap(have)}n't ${S} ever given ${R} ${Ob}?` : `${cap(have)} ${S} ever given ${R} ${Ob}?`; break;
    case 'zai':
      t = !q ? (neg ? `${S} ${be} not giving ${R} ${Ob}.` : `${S} ${be} giving ${R} ${Ob}.`)
        : neg ? `${be === 'am' ? "Aren't" : `${cap(be)}n't`} ${S} giving ${R} ${Ob}?` : `${cap(be)} ${S} giving ${R} ${Ob}?`; break;
    case 'hui':
      t = !q ? (neg ? `${S} won't give ${R} ${Ob}.` : `${S} will give ${R} ${Ob}.`) : `${neg ? "Won't" : 'Will'} ${S} give ${R} ${Ob}?`; break;
  }
  return cap(t).replace(/ i /g, ' I ');
}

export const mandarinGiving: Frame = {
  id: 'zh-giving',
  languageId: 'zh',
  slots: {
    who: { wordClass: 'pronoun', forms: ['plain'], facts: ['person', 'number'] },
    to: { wordClass: 'noun', tags: ['person'] },
    thing: { wordClass: 'noun', tags: ['thing'] },
    verb: { wordClass: 'verb' },
  },
  grammar: ['time', 'negate', 'type', 'object'],
  disallowed(grammar): Record<string, Record<string, string>> {
    if (grammar['type'] === 'a-not-a') return { negate: { not: "An A-not-A question can't also be negative." } };
    return {};
  },
  build(words, grammar) {
    const who = words['who']!, to = words['to']!, thing = words['thing']!, give = words['verb']!;
    return {
      parts: [
        { type: 'subject', caption: 'subject', pieces: subject(who) },
        { type: 'verb-phrase', caption: 'verb', pieces: verb(give, grammar) },
        { type: 'indirect-object', caption: 'receiver', pieces: receiver(to) },
        { type: 'object', caption: 'object', pieces: object(thing, grammar) },
        grammar['type'] === 'statement' ? '。' : '？',
      ],
      translation: english(who, to, thing, grammar),
    };
  },
};

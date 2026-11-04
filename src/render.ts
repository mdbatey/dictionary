import { h, inlineMarkdown } from './dom';
import { isPhrase, type Content, type Language, type Phrase, type Piece, type Sentence, type SentenceSet } from './model';
import { derivedPron } from './derive';
import { shownRole } from './roles';
import { readPronChoice } from './storage';
import { splitSyllables, syllableCharacters, toneOf } from './tones';

/** For tonal Languages: each character of a Piece with the tone of its syllable, or null if they don't line up. */
function tonesOf(piece: Pick<Piece, 'script' | 'pron'>, language: Language): { chars: string[]; syllables: string[]; tones: number[] } | null {
  if (!language.tones) return null;
  const chars = syllableCharacters(piece.script);
  const syllables = chars.length ? splitSyllables(piece.pron[language.tones.system] ?? '', chars.length, language.tones.style) : null;
  return syllables ? { chars, syllables, tones: syllables.map((s) => toneOf(s, language.tones!.style)) } : null;
}

/** The coloured script of a Piece, drawn in its Role's style. Tonal characters carry their tone for tone colours. */
export function pieceScript(piece: Piece, language: Language, content: Content, extraClass = ''): HTMLElement {
  const role = shownRole(piece.role, language, content);
  const t = tonesOf(piece, language);
  let i = 0;
  const children = t ? [...piece.script].map((c) => (/\p{Script=Han}/u.test(c) ? h('span', { 'data-tone': String(t.tones[i++]) }, [c]) : c)) : [piece.script];
  return h('span', { class: `piece-script style-${role.style} ${extraClass}`.trim(), lang: language.tag, '--role-color': `var(--role-${piece.role})` }, children);
}

/** The Pronunciation System to show: the learner's choice for this Language, else the default. */
export function pronSystem(language: Language): string {
  const chosen = readPronChoice(language.id);
  return chosen && language.pronunciationSystems.some((p) => p.id === chosen) ? chosen : language.defaultPronunciation;
}

/** A Piece's pronunciation in the chosen (or default) system, or else the first system it has. */
export function pronOf(piece: Pick<Piece, 'script' | 'pron'>, language: Language): string {
  const chosen = language.pronunciationSystems.find((ps) => ps.id === pronSystem(language));
  // Not available for this Piece? Use the first system it has, in the Language's order (the Sound picker's order too).
  return (chosen && derivedPron(piece, chosen))
    ?? language.pronunciationSystems.map((ps) => derivedPron(piece, ps)).find((p) => p)
    ?? Object.values(piece.pron)[0] ?? '';
}

/** A Piece's pronunciation as text, with each syllable carrying its tone when it's the tone-bearing system. */
function pronElement(piece: Piece, language: Language): (Node | string)[] {
  const t = tonesOf(piece, language);
  if (!t || pronSystem(language) !== language.tones?.system || !piece.pron[language.tones.system]) return [pronOf(piece, language)];
  // Keep the spacing the pronunciation was written with ("píngguǒ" vs "píng guǒ"); numbered tones are always spaced.
  const sep = language.tones.style === 'numbers' || /\s/.test(pronOf(piece, language)) ? ' ' : '';
  return t.syllables.flatMap((s, i) => [...(i && sep ? [sep] : []), h('span', { 'data-tone': String(t.tones[i]) }, [s])]);
}

function renderPiece(piece: Piece, index: number, language: Language, content: Content, onTap: (index: number) => void): HTMLElement {
  const role = shownRole(piece.role, language, content);
  const fuse = piece.fuse ? shownRole(piece.fuse, language, content) : undefined;
  const label = [piece.script, piece.gloss, role.label, fuse && `with ${fuse.label}`, piece.dropped && 'left unsaid', piece.changed && 'changed'].filter(Boolean).join(', ');
  const classes = ['piece', piece.changed && 'is-changed', piece.dropped && 'is-dropped'].filter(Boolean).join(' ');
  const script = pieceScript(piece, language, content);
  if (piece.fuse) {
    script.classList.add('has-fuse');
    script.style.setProperty('--fuse-color', `var(--role-${piece.fuse})`);
  }
  const button = h('button', { class: classes, type: 'button', 'data-role': piece.role, 'aria-label': label }, [
    h('span', { class: 'piece-gloss', 'aria-hidden': 'true' }, [piece.gloss]),
    script,
    h('span', { class: 'piece-pron', 'aria-hidden': 'true' }, pronElement(piece, language)),
  ]);
  button.addEventListener('click', () => onTap(index));
  return button;
}

function renderPhrase(phrase: Phrase, firstIndex: number, language: Language, content: Content, onTap: (index: number) => void): HTMLElement {
  return h('div', { class: 'phrase', '--phrase-color': `var(--phrase-${phrase.type})` }, [
    h('span', { class: 'phrase-caption' }, [phrase.caption]),
    h('div', { class: 'phrase-pieces' }, phrase.pieces.map((piece, i) => renderPiece(piece, firstIndex + i, language, content, onTap))),
  ]);
}

/** A Sentence's Phrases and punctuation as one row. `onTap` receives the index of the tapped Piece (see piecesOf). */
export function renderParts(parts: Sentence['parts'], language: Language, content: Content, onTap: (index: number) => void): HTMLElement {
  let next = 0;
  return h('div', { class: 'parts' }, parts.map((part) => {
    if (!isPhrase(part)) return h('span', { class: 'punct', lang: language.tag }, [part]);
    const el = renderPhrase(part, next, language, content, onTap);
    next += part.pieces.length;
    return el;
  }));
}

/**
 * A Sentence card. `addressOf` gives the address of a Sentence in the same Set (for its own link and its
 * comparison link); `onTap` receives the index of the tapped Piece within the Sentence (see piecesOf).
 */
export function renderSentence(
  sentence: Sentence, set: SentenceSet, language: Language, content: Content,
  addressOf: (sentenceId: string) => string, onTap: (index: number) => void,
): HTMLElement {
  const compared = sentence.compareWith ? set.sentences.find((s) => s.id === sentence.compareWith) : undefined;
  return h('article', { class: 'sentence', id: `sentence-${sentence.id}` }, [
    h('a', { class: 'sentence-number', href: addressOf(sentence.id) }, [`Sentence ${sentence.id}`]),
    h('p', { class: 'translation' }, [`“${sentence.translation}”`]),
    renderParts(sentence.parts, language, content, onTap),
    h('p', { class: 'explanation' }, inlineMarkdown(sentence.explanation, addressOf)),
    ...(compared ? [h('a', { class: 'compare-link', href: addressOf(compared.id) }, [
      h('span', {}, [`Compare with Sentence ${compared.id}: “${compared.translation}”`]),
      h('span', { class: 'compare-hint' }, ['Changed Pieces are outlined']),
    ])] : []),
  ]);
}

/** The numbered Sentence chips for a Set; `current` is the Sentence opened from its address, if any. */
export function renderSentenceChips(set: SentenceSet, addressOf: (sentenceId: string) => string, current?: string): HTMLElement {
  return h('nav', { class: 'sentence-chips', 'aria-label': 'Sentences' }, set.sentences.map((s) =>
    h('a', { class: 'chip', href: addressOf(s.id), 'aria-label': `Sentence ${s.id}: ${s.translation}`, ...(s.id === current && { 'aria-current': 'true' }) }, [s.id])));
}

/** A Set's closing summary, each point linking to the Sentences that show it. */
export function renderSummary(set: SentenceSet, addressOf: (sentenceId: string) => string): HTMLElement | null {
  if (!set.summary?.length) return null;
  return h('section', { class: 'summary', 'aria-labelledby': 'summary-title' }, [
    h('h2', { id: 'summary-title' }, ['Summary']),
    h('ul', {}, set.summary.map((point) =>
      h('li', {}, [
        h('span', {}, inlineMarkdown(point.text, addressOf)),
        ...(point.sentences?.length ? [h('span', { class: 'summary-links' }, point.sentences.map((id) => h('a', { href: addressOf(id) }, [`Sentence ${id}`])))] : []),
      ]))),
  ]);
}

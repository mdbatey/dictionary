import { h, inlineMarkdown } from './dom';
import { isPhrase, type Content, type Language, type Phrase, type Piece, type Sentence, type SentenceSet } from './model';
import { shownRole } from './roles';

/** The coloured script of a Piece, drawn in its Role's style. */
export function pieceScript(piece: Piece, language: Language, content: Content, extraClass = ''): HTMLElement {
  const role = shownRole(piece.role, language, content);
  return h('span', { class: `piece-script style-${role.style} ${extraClass}`.trim(), lang: language.tag, '--role-color': `var(--role-${piece.role})` }, [piece.script]);
}

/** A Piece's pronunciation in the Language's default system, or else the first system it has. */
export function pronOf(piece: { pron: Record<string, string> }, language: Language): string {
  return piece.pron[language.defaultPronunciation] ?? Object.values(piece.pron)[0] ?? '';
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
    h('span', { class: 'piece-pron', 'aria-hidden': 'true' }, [pronOf(piece, language)]),
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
    h('p', { class: 'explanation' }, inlineMarkdown(sentence.explanation)),
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
        h('span', {}, inlineMarkdown(point.text)),
        h('span', { class: 'summary-links' }, point.sentences.map((id) => h('a', { href: addressOf(id) }, [`Sentence ${id}`]))),
      ]))),
  ]);
}

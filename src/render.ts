import { h, inlineMarkdown } from './dom';
import { isPhrase, type Content, type Language, type Phrase, type Piece, type Sentence } from './model';
import { shownRole } from './roles';

/** The coloured script of a Piece, drawn in its Role's style. */
export function pieceScript(piece: Piece, language: Language, content: Content, extraClass = ''): HTMLElement {
  const role = shownRole(piece.role, language, content);
  return h('span', { class: `piece-script style-${role.style} ${extraClass}`.trim(), lang: language.tag, '--role-color': `var(--role-${piece.role})` }, [piece.script]);
}

function renderPiece(piece: Piece, index: number, language: Language, content: Content, onTap: (index: number) => void): HTMLElement {
  const role = shownRole(piece.role, language, content);
  const button = h('button', { class: 'piece', type: 'button', 'data-role': piece.role, 'aria-label': `${piece.script}, ${piece.gloss}, ${role.label}` }, [
    h('span', { class: 'piece-gloss', 'aria-hidden': 'true' }, [piece.gloss]),
    pieceScript(piece, language, content),
    h('span', { class: 'piece-pron', 'aria-hidden': 'true' }, [piece.pron[language.defaultPronunciation] ?? '']),
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

/** A Sentence card. `onTap` receives the index of the tapped Piece within the Sentence (see piecesOf). */
export function renderSentence(sentence: Sentence, language: Language, content: Content, address: string, onTap: (index: number) => void): HTMLElement {
  let next = 0;
  const parts = sentence.parts.map((part) => {
    if (!isPhrase(part)) return h('span', { class: 'punct', lang: language.tag }, [part]);
    const el = renderPhrase(part, next, language, content, onTap);
    next += part.pieces.length;
    return el;
  });
  return h('article', { class: 'sentence', id: `sentence-${sentence.id}` }, [
    h('a', { class: 'sentence-number', href: address }, [`Sentence ${sentence.id}`]),
    h('p', { class: 'translation' }, [`“${sentence.translation}”`]),
    h('div', { class: 'parts' }, parts),
    h('p', { class: 'explanation' }, inlineMarkdown(sentence.explanation)),
  ]);
}

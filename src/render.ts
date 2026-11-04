import { h, inlineMarkdown } from './dom';
import { isPhrase, type Content, type Language, type Phrase, type Piece, type Sentence } from './model';

function renderPiece(piece: Piece, language: Language, content: Content): HTMLElement {
  const role = content.roles[piece.role];
  return h('span', { class: 'piece' }, [
    h('span', { class: 'piece-gloss' }, [piece.gloss]),
    h('span', { class: `piece-script style-${role?.style ?? 'chip'}`, lang: language.tag, '--role-color': `var(--role-${piece.role})`, title: role?.label ?? piece.role }, [piece.script]),
    h('span', { class: 'piece-pron' }, [piece.pron[language.defaultPronunciation] ?? '']),
  ]);
}

function renderPhrase(phrase: Phrase, language: Language, content: Content): HTMLElement {
  return h('div', { class: 'phrase', '--phrase-color': `var(--phrase-${phrase.type})` }, [
    h('span', { class: 'phrase-caption' }, [phrase.caption]),
    h('div', { class: 'phrase-pieces' }, phrase.pieces.map((piece) => renderPiece(piece, language, content))),
  ]);
}

export function renderSentence(sentence: Sentence, language: Language, content: Content): HTMLElement {
  return h('article', { class: 'sentence' }, [
    h('p', { class: 'translation' }, [`“${sentence.translation}”`]),
    h('div', { class: 'parts' }, sentence.parts.map((part) =>
      isPhrase(part) ? renderPhrase(part, language, content) : h('span', { class: 'punct', lang: language.tag }, [part]),
    )),
    h('p', { class: 'explanation' }, inlineMarkdown(sentence.explanation)),
  ]);
}

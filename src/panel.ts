import { h, inlineMarkdown } from './dom';
import { piecesOf, type Content, type Language, type Sentence } from './model';
import { pieceScript } from './render';
import { shownRole } from './roles';

let dialog: HTMLDialogElement | undefined;

function getDialog(): HTMLDialogElement {
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.className = 'sheet';
  dialog.setAttribute('aria-label', 'Piece details');
  // Tapping the dimmed backdrop (outside the sheet) closes it.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.body.append(dialog);
  return dialog;
}

/** Opens the detail panel on one Piece of a Sentence. Previous/Next step through that Sentence's Pieces. */
export function openPiecePanel(sentence: Sentence, index: number, language: Language, content: Content): void {
  const pieces = piecesOf(sentence);
  const piece = pieces[index];
  if (!piece) return;
  const role = shownRole(piece.role, language, content);
  const prev = pieces[index - 1];
  const next = pieces[index + 1];
  const pron = piece.pron[language.defaultPronunciation];

  const step = (to: number, label: string, target: typeof prev) => {
    const button = h('button', { class: 'sheet-step', type: 'button', ...(target ? {} : { disabled: '' }) }, [label]);
    button.addEventListener('click', () => openPiecePanel(sentence, to, language, content));
    return button;
  };
  const close = h('button', { class: 'sheet-close', type: 'button', 'aria-label': 'Close' }, ['×']);
  close.addEventListener('click', () => getDialog().close());

  const sections: HTMLElement[] = [];
  if (piece.note) {
    sections.push(h('section', { class: 'sheet-section' }, [h('h3', {}, ['In this Sentence']), h('p', {}, inlineMarkdown(piece.note))]));
  }
  if (role.rule) {
    sections.push(h('section', { class: 'sheet-section' }, [h('h3', {}, ['The general rule']), h('p', { class: 'sheet-rule' }, inlineMarkdown(role.rule))]));
  }

  const d = getDialog();
  d.replaceChildren(
    h('div', { class: 'sheet-grip', 'aria-hidden': 'true' }),
    h('div', { class: 'sheet-head' }, [
      pieceScript(piece, language, content, 'sheet-script'),
      h('div', { class: 'sheet-facts' }, [
        h('span', { class: `role-tag style-${role.style}`, '--role-color': `var(--role-${piece.role})` }, [role.label]),
        h('span', { class: 'sheet-gloss' }, [piece.gloss]),
        ...(pron ? [h('span', { class: 'sheet-pron' }, [pron])] : []),
      ]),
      close,
    ]),
    ...sections,
    h('div', { class: 'sheet-steps' }, [
      step(index - 1, prev ? `← ${prev.script}` : '←', prev),
      step(index + 1, next ? `${next.script} →` : '→', next),
    ]),
  );
  if (!d.open) d.showModal();
  close.focus();
}

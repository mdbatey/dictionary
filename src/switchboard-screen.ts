import { content } from './content';
import { h } from './dom';
import { fitToOneLine } from './fit';
import type { Language, Switchboard } from './model';
import { openPiecePanel } from './panel';
import { renderParts } from './render';
import { applyChoice, disabledOptions, optionsFor, showSwitchboard } from './switchboard';

/**
 * The Switchboard screen: the Sentence, and its Switches. Flipping a Switch rebuilds the Sentence with
 * showSwitchboard and outlines only the Pieces that changed.
 */
export function renderSwitchboard(switchboard: Switchboard, language: Language): HTMLElement {
  let settings: Record<string, string> = { ...switchboard.start };
  let previous: Record<string, string> | undefined;
  const sentenceArea = h('section', { class: 'sentence switchboard-sentence', 'aria-live': 'polite' });
  const switchesArea = h('div', { class: 'switches' });
  let stopFit: (() => void) | undefined;

  const draw = () => {
    const view = showSwitchboard(switchboard, language, settings, previous);
    const sentence = { id: 'switchboard', parts: view.parts, translation: view.translation, explanation: '' };
    const row = renderParts(view.parts, language, content, (index) => openPiecePanel(sentence, index, language, content));
    sentenceArea.replaceChildren(row, h('p', { class: 'translation' }, [`“${view.translation}”`]));
    stopFit?.();
    stopFit = fitToOneLine(row).stop;

    const disabled = disabledOptions(switchboard, language, settings);
    switchesArea.replaceChildren(...switchboard.switches.map((sw) => {
      const options = optionsFor(sw, switchboard, language);
      const reasons = disabled[sw.id] ?? {};
      return h('div', { class: 'switch', role: 'group', 'aria-label': sw.label }, [
        h('span', { class: 'switch-label' }, [sw.label]),
        h('div', { class: 'switch-options' }, options.map((o) => {
          const on = settings[sw.id] === o.id;
          const reason = reasons[o.id];
          const button = h('button', {
            class: 'switch-option', type: 'button', 'aria-pressed': String(on),
            ...(reason ? { disabled: '', title: reason, 'aria-description': reason } : {}),
          }, [o.label, ...(o.sub ? [h('span', { class: 'switch-sub', lang: language.tag }, [o.sub])] : [])]);
          button.addEventListener('click', () => {
            if (on || reason) return;
            previous = settings;
            settings = applyChoice(switchboard, language, settings, sw.id, o.id);
            draw();
          });
          return button;
        })),
        ...Object.values(reasons).map((r) => h('p', { class: 'switch-reason' }, [r])),
      ]);
    }));
  };
  draw();
  return h('div', { class: 'switchboard' }, [sentenceArea, switchesArea]);
}

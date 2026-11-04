import { h } from './dom';
import type { Content, Language, Piece } from './model';
import { rolesUsed } from './roles';
import { readLayers, saveLayers, type Layers } from './storage';

const layerLabels: Record<keyof Layers, string> = { gloss: 'Gloss', pron: 'Pronunciation', phrases: 'Phrases' };

/**
 * The layer toggles and the color key for one screen. Layers hide or show the gloss, pronunciation and
 * Phrase outlines on `scope`; tapping a Role in the color key highlights its Pieces and dims the rest.
 * `onLayout` runs after anything that changes how wide a Sentence is.
 */
export function renderToolbar(scope: HTMLElement, pieces: Piece[], language: Language, content: Content, onLayout: () => void): HTMLElement {
  const layers = readLayers();
  const applyLayers = () => {
    for (const key of Object.keys(layerLabels) as (keyof Layers)[]) scope.classList.toggle(`hide-${key}`, !layers[key]);
    onLayout();
  };

  const toggles = (Object.keys(layerLabels) as (keyof Layers)[]).map((key) => {
    const button = h('button', { class: 'toggle', type: 'button', 'aria-pressed': String(layers[key]) }, [layerLabels[key]]);
    button.addEventListener('click', () => {
      layers[key] = !layers[key];
      button.setAttribute('aria-pressed', String(layers[key]));
      saveLayers(layers);
      applyLayers();
    });
    return button;
  });

  let highlighted: string | null = null;
  const roleButtons = rolesUsed(pieces, language, content).map((role) => {
    const button = h('button', {
      class: `key-role style-${role.style}`, type: 'button', 'aria-pressed': 'false', '--role-color': `var(--role-${role.id})`,
    }, [role.label]);
    button.addEventListener('click', () => {
      highlighted = highlighted === role.id ? null : role.id;
      roleButtons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      if (highlighted) button.setAttribute('aria-pressed', 'true');
      scope.querySelectorAll<HTMLElement>('.piece').forEach((p) => {
        p.classList.toggle('is-dimmed', highlighted !== null && p.dataset['role'] !== highlighted);
      });
    });
    return button;
  });

  queueMicrotask(applyLayers);
  return h('div', { class: 'toolbar' }, [
    h('div', { class: 'toggles', role: 'group', 'aria-label': 'Layers' }, toggles),
    h('details', { class: 'color-key' }, [
      h('summary', {}, ['Color key']),
      h('p', { class: 'key-hint' }, ['Tap a Role to highlight it.']),
      h('div', { class: 'key-roles' }, roleButtons),
    ]),
  ]);
}

import { h } from './dom';
import type { Content, Language, Piece } from './model';
import { rolesUsed } from './roles';
import { hasSourceFor } from './derive';
import { pronSystem } from './render';
import { readLayers, readTones, saveLayers, savePronChoice, saveTones, type Layers } from './storage';

const layerLabels: Record<keyof Layers, string> = { gloss: 'Gloss', pron: 'Pronunciation', phrases: 'Phrases' };

/** Dims every Piece in `scope` except those with the highlighted Role. Call again after redrawing Pieces. */
export function applyHighlight(scope: HTMLElement): void {
  const highlighted = scope.dataset['highlight'];
  scope.querySelectorAll<HTMLElement>('.piece').forEach((p) => {
    p.classList.toggle('is-dimmed', highlighted !== undefined && p.dataset['role'] !== highlighted);
  });
}

/**
 * The layer toggles and the color key for one screen. Layers hide or show the gloss, pronunciation and
 * Phrase outlines on `scope`; tapping a Role in the color key highlights its Pieces and dims the rest.
 * `onLayout` runs after anything that changes how wide a Sentence is.
 */
export function renderToolbar(
  scope: HTMLElement, pieces: Piece[], language: Language, content: Content, onLayout: () => void, onRedraw: () => void,
): HTMLElement {
  const layers = readLayers();
  let tones = readTones();
  const applyLayers = () => {
    for (const key of Object.keys(layerLabels) as (keyof Layers)[]) scope.classList.toggle(`hide-${key}`, !layers[key]);
    scope.classList.toggle('show-tones', Boolean(language.tones) && tones);
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
      if (highlighted) scope.dataset['highlight'] = highlighted; else delete scope.dataset['highlight'];
      applyHighlight(scope);
    });
    return button;
  });

  // Tone colours: only for tonal Languages.
  // Tone marks (Mandarin): tones 1–4 plus neutral. Tone numbers (Cantonese): tones 1–6.
  const ordinal = (n: number) => `${n}${['st', 'nd', 'rd'][n - 1] ?? 'th'}`;
  const toneNumbers = language.tones?.style === 'numbers' ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4];
  const toneKey = h('div', { class: 'tone-key', 'aria-hidden': String(!tones) }, [
    'Tones: ',
    ...toneNumbers.map((n) => h('span', { 'data-tone': String(n) }, [ordinal(n)])),
    ...(language.tones?.style === 'numbers' ? [] : [h('span', { 'data-tone': '0' }, ['neutral'])]),
  ]);
  if (language.tones) {
    const toneButton = h('button', { class: 'toggle', type: 'button', 'aria-pressed': String(tones) }, ['Tone colors']);
    toneButton.addEventListener('click', () => {
      tones = !tones;
      toneButton.setAttribute('aria-pressed', String(tones));
      toneKey.setAttribute('aria-hidden', String(!tones));
      saveTones(tones);
      applyLayers();
    });
    toggles.push(toneButton);
  }

  // Sound picker: only the systems this page's Pieces actually have, and only when there's a choice.
  const systems = language.pronunciationSystems.filter((ps) => pieces.some((p) => hasSourceFor(p, ps)));
  // The chosen system if this page has it, otherwise the first one it has (e.g. Korean Switchboards have no Romanization).
  const current = systems.some((ps) => ps.id === pronSystem(language)) ? pronSystem(language) : systems[0]?.id;
  const soundPicker = systems.length > 1
    ? h('div', { class: 'sound-picker', role: 'group', 'aria-label': 'Sound' }, [
      h('span', { class: 'sound-label' }, ['Sound']),
      ...systems.map((ps) => {
        const button = h('button', { class: 'toggle', type: 'button', 'aria-pressed': String(ps.id === current) }, [ps.label]);
        button.addEventListener('click', () => { savePronChoice(language.id, ps.id); onRedraw(); });
        return button;
      }),
    ])
    : null;

  queueMicrotask(applyLayers);
  return h('div', { class: 'toolbar' }, [
    h('div', { class: 'toggles', role: 'group', 'aria-label': 'Layers' }, toggles),
    ...(soundPicker ? [soundPicker] : []),
    ...(language.tones ? [toneKey] : []),
    h('details', { class: 'color-key' }, [
      h('summary', {}, ['Color key']),
      h('p', { class: 'key-hint' }, ['Tap a Role to highlight it.']),
      h('div', { class: 'key-roles' }, roleButtons),
    ]),
  ]);
}

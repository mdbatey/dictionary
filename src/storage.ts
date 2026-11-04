const LAST_PLACE = 'dictionary-layers:last-place';

/** The address of the last screen visited, or null. Storage can be unavailable (private mode, blocked). */
export function readLastPlace(): string | null {
  try {
    return localStorage.getItem(LAST_PLACE);
  } catch {
    return null;
  }
}

export function saveLastPlace(address: string): void {
  try {
    localStorage.setItem(LAST_PLACE, address);
  } catch {
    // Remembering the last place is a convenience; the site works without it.
  }
}

const LAYERS = 'dictionary-layers:layers';

/** Which layers are shown on Sentences. */
export interface Layers {
  gloss: boolean;
  pron: boolean;
  phrases: boolean;
}

const defaultLayers: Layers = { gloss: true, pron: true, phrases: true };

export function readLayers(): Layers {
  try {
    const saved = JSON.parse(localStorage.getItem(LAYERS) ?? '{}') as Partial<Layers>;
    return {
      gloss: typeof saved.gloss === 'boolean' ? saved.gloss : defaultLayers.gloss,
      pron: typeof saved.pron === 'boolean' ? saved.pron : defaultLayers.pron,
      phrases: typeof saved.phrases === 'boolean' ? saved.phrases : defaultLayers.phrases,
    };
  } catch {
    return { ...defaultLayers };
  }
}

export function saveLayers(layers: Layers): void {
  try {
    localStorage.setItem(LAYERS, JSON.stringify(layers));
  } catch {
    // Layer choices are a convenience; the defaults are used next time.
  }
}

import { fromJyutping } from './jyutping';
import type { PronunciationSystem } from './model';

/** A pronunciation in a derived system (e.g. Yale), worked out from the stored one, or null if it can't be. */
export function derivedPron(pron: Record<string, string>, system: PronunciationSystem): string | null {
  if (!system.derive) return pron[system.id] ?? null;
  const source = pron[system.derive.from];
  if (!source) return null;
  switch (system.derive.rule) {
    case 'jyutping-to-yale': return fromJyutping(source, 'yale');
    case 'jyutping-to-ipa': return fromJyutping(source, 'ipa');
  }
}

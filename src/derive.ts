import { hangulToIpa } from './hangul';
import { fromJyutping } from './jyutping';
import type { Piece, PronunciationSystem } from './model';
import { pinyinToIpa } from './pinyin';
import { syllableCharacters } from './tones';

type Pronounced = Pick<Piece, 'script' | 'pron'>;

/** The text a derived system is worked out from: the Piece's script, or one of its stored pronunciations. */
function sourceOf(piece: Pronounced, system: PronunciationSystem): string | undefined {
  if (!system.derive) return undefined;
  return system.derive.from === 'script' ? piece.script : piece.pron[system.derive.from];
}

/**
 * A Piece's pronunciation in one system: the stored one if there is one (e.g. the Korean Switchboard's IPA),
 * otherwise worked out from its source (e.g. Yale from Jyutping, IPA from Hangul), or null if it can't be.
 */
export function derivedPron(piece: Pronounced, system: PronunciationSystem): string | null {
  const stored = piece.pron[system.id];
  if (stored) return stored;
  const source = sourceOf(piece, system);
  if (!system.derive || !source) return null;
  switch (system.derive.rule) {
    case 'jyutping-to-yale': return fromJyutping(source, 'yale');
    case 'jyutping-to-ipa': return fromJyutping(source, 'ipa');
    case 'hangul-to-ipa': return hangulToIpa(source, piece.pron[system.derive.suffixFrom ?? '']?.startsWith('-') ?? false);
    case 'pinyin-to-ipa': return pinyinToIpa(source, syllableCharacters(piece.script).length);
  }
}

/** Whether a Piece has what a system needs: a stored value, or the source it's worked out from. */
export function hasSourceFor(piece: Pronounced, system: PronunciationSystem): boolean {
  return Boolean(piece.pron[system.id] || sourceOf(piece, system));
}

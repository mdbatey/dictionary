import { describe, expect, it } from 'vitest';
import { content } from './content';
import samples from './fixtures/korean-giving-samples.json';
import { isPhrase } from './model';
import { allSettings, optionsFor, showSwitchboard, type SwitchboardView } from './switchboard';

const korean = content.languages.find((l) => l.id === 'ko')!;
const giving = korean.switchboards.find((s) => s.id === 'giving')!;

/** Each Piece as [script, Revised Romanization, IPA, gloss, Role], the shape the old page's output was recorded in. */
function pieceRows(view: SwitchboardView): string[][] {
  return view.parts.flatMap((part) => (isPhrase(part) ? part.pieces.map((p) => [p.script, p.pron['rr'] ?? '', p.pron['ipa'] ?? '', p.gloss, p.role]) : []));
}

describe('showSwitchboard: Korean giving', () => {
  it('matches the old page at the starting settings', () => {
    const expected = samples.samples[0]!;
    expect(expected.settings).toEqual(giving.start);
    const view = showSwitchboard(giving, korean, giving.start);
    expect(pieceRows(view)).toEqual(expected.pieces);
    expect(view.translation).toBe(expected.translation);
  });

  it.each(samples.samples.map((s, i) => [i, s] as const))('matches the old page for sample %i', (_i, sample) => {
    const view = showSwitchboard(giving, korean, sample.settings);
    expect(pieceRows(view)).toEqual(sample.pieces);
    expect(view.parts.at(-1)).toBe(sample.punctuation);
    expect(view.translation).toBe(sample.translation);
  });

  it('offers every Word that fits a Word Switch slot, filtered by word class and Tag', () => {
    const labels = (id: string) => optionsFor(giving.switches.find((s) => s.id === id)!, giving, korean).map((o) => o.label);
    expect(labels('who')).toEqual(['I', 'You', 'He', 'She', 'We', 'They']);
    expect(labels('to')).toEqual(['Minho', 'Grandma']);
    expect(labels('level')).toEqual(['Casual', 'Polite', 'Formal', 'Plain']);
  });

  it('builds a Sentence and a Translation for every combination of Options and Words', () => {
    const every = allSettings(giving, korean);
    expect(every).toHaveLength(6 * 4 * 3 * 3 * 2 * 2);
    for (const settings of every) {
      const view = showSwitchboard(giving, korean, settings);
      expect(pieceRows(view).length, JSON.stringify(settings)).toBeGreaterThan(0);
      expect(view.translation, JSON.stringify(settings)).toMatch(/^[A-Z].*[.?]$/);
    }
  });

  it('marks only the Pieces that changed since the previous settings', () => {
    const changedAfter = (change: Record<string, string>) => {
      const view = showSwitchboard(giving, korean, { ...giving.start, ...change }, giving.start);
      return view.parts.flatMap((p) => (isPhrase(p) ? p.pieces : [])).filter((p) => p.changed).map((p) => p.script);
    };
    expect(changedAfter({ to: 'grandma' })).toEqual(['할머니', '께', '드려']);
    expect(changedAfter({ negate: 'dont' })).toEqual(['안']);
    expect(changedAfter({})).toEqual([]);
  });
});

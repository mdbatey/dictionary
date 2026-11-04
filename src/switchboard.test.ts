import { describe, expect, it } from 'vitest';
import { content } from './content';
import samples from './fixtures/korean-giving-samples.json';
import zhSamples from './fixtures/mandarin-giving-samples.json';
import yueSamples from './fixtures/cantonese-giving-samples.json';
import { isPhrase } from './model';
import { allSettings, applyChoice, disabledOptions, optionsFor, showSwitchboard, type SwitchboardView } from './switchboard';

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

const mandarin = content.languages.find((l) => l.id === 'zh')!;
const zhGiving = mandarin.switchboards.find((s) => s.id === 'giving')!;

/** Each Piece as [script, Pinyin, gloss, Role]. */
function zhRows(view: SwitchboardView): string[][] {
  return view.parts.flatMap((part) => (isPhrase(part) ? part.pieces.map((p) => [p.script, p.pron['pinyin'] ?? '', p.gloss, p.role]) : []));
}

describe('showSwitchboard: Mandarin giving', () => {
  it('matches the old page at the starting settings', () => {
    const expected = zhSamples.samples[0]!;
    expect(expected.settings).toEqual(zhGiving.start);
    const view = showSwitchboard(zhGiving, mandarin, zhGiving.start);
    expect(zhRows(view)).toEqual(expected.pieces);
    expect(view.parts.at(-1)).toBe(expected.punctuation);
    expect(view.translation).toBe(expected.translation);
  });

  it.each(zhSamples.samples.map((s, i) => [i, s] as const))('matches the old page for sample %i', (_i, sample) => {
    const view = showSwitchboard(zhGiving, mandarin, sample.settings);
    expect(zhRows(view)).toEqual(sample.pieces);
    expect(view.parts.at(-1)).toBe(sample.punctuation);
    expect(view.translation).toBe(sample.translation);
  });

  it('offers the seven pronouns, with 您 marked honorific', () => {
    expect(optionsFor(zhGiving.switches[0]!, zhGiving, mandarin).map((o) => o.label)).toEqual(['I', 'You', 'You (polite)', 'He', 'She', 'We', 'They']);
    expect(mandarin.words.find((w) => w.script === '您')!.facts?.honorific).toBe(true);
  });

  it('leaves out combinations that are not allowed, and builds every allowed one', () => {
    const every = allSettings(zhGiving, mandarin);
    expect(every).toHaveLength(7 * 5 * 2 * 3 * 5 - 7 * 5 * 5);
    expect(every.some((s) => s['type'] === 'a-not-a' && s['negate'] === 'not')).toBe(false);
    for (const settings of every) expect(showSwitchboard(zhGiving, mandarin, settings).translation, JSON.stringify(settings)).toMatch(/^[A-Z].*[.?]$/);
  });

  it('disables Not during an A-not-A question, with a reason, and switches it off when A-not-A is chosen', () => {
    const negated = { ...zhGiving.start, negate: 'not' };
    expect(disabledOptions(zhGiving, mandarin, negated)).toEqual({});
    expect(disabledOptions(zhGiving, mandarin, { ...zhGiving.start, type: 'a-not-a' })).toEqual({ negate: { not: "An A-not-A question can't also be negative." } });
    expect(applyChoice(zhGiving, mandarin, negated, 'type', 'a-not-a')).toEqual({ ...zhGiving.start, type: 'a-not-a', negate: 'none' });
  });
});

const cantonese = content.languages.find((l) => l.id === 'yue')!;
const yueGiving = cantonese.switchboards.find((s) => s.id === 'giving')!;

/** Each Piece as [script, Jyutping, gloss, Role]. */
function yueRows(view: SwitchboardView): string[][] {
  return view.parts.flatMap((part) => (isPhrase(part) ? part.pieces.map((p) => [p.script, p.pron['jyutping'] ?? '', p.gloss, p.role]) : []));
}

describe('showSwitchboard: Cantonese giving', () => {
  it('matches the old page at the starting settings', () => {
    const expected = yueSamples.samples[0]!;
    expect(expected.settings).toEqual(yueGiving.start);
    const view = showSwitchboard(yueGiving, cantonese, yueGiving.start);
    expect(yueRows(view)).toEqual(expected.pieces);
    expect(view.parts.at(-1)).toBe(expected.punctuation);
    expect(view.translation).toBe(expected.translation);
  });

  it.each(yueSamples.samples.map((s, i) => [i, s] as const))('matches the old page for sample %i', (_i, sample) => {
    const view = showSwitchboard(yueGiving, cantonese, sample.settings);
    expect(yueRows(view)).toEqual(sample.pieces);
    expect(view.parts.at(-1)).toBe(sample.punctuation);
    expect(view.translation).toBe(sample.translation);
  });

  it('offers the six pronouns', () => {
    expect(optionsFor(yueGiving.switches[0]!, yueGiving, cantonese).map((o) => o.label)).toEqual(['I', 'You', 'He/she', 'We', 'You all', 'They']);
  });

  it('builds exactly the 1,200 combinations the old page allowed', () => {
    const every = allSettings(yueGiving, cantonese);
    expect(every).toHaveLength(1200);
    for (const settings of every) expect(showSwitchboard(yueGiving, cantonese, settings).translation, JSON.stringify(settings)).toMatch(/^[A-Z].*[.?]$/);
  });

  it('disables endings and Not where they do not fit, and resets them when a choice blocks them', () => {
    const start = yueGiving.start;
    expect(disabledOptions(yueGiving, cantonese, { ...start, type: 'maa' })).toEqual({
      ending: { gaa: 'Ending particles here are for statements.', laa: 'Ending particles here are for statements.' },
    });
    expect(disabledOptions(yueGiving, cantonese, { ...start, time: 'gwo' })).toEqual({ ending: { laa: "喇 doesn't sound natural with this combination." } });
    expect(applyChoice(yueGiving, cantonese, { ...start, ending: 'gaa' }, 'type', 'a-not-a')).toEqual({ ...start, type: 'a-not-a', ending: 'plain' });
    expect(applyChoice(yueGiving, cantonese, { ...start, ending: 'laa' }, 'time', 'gwo')).toEqual({ ...start, time: 'gwo', ending: 'plain' });
  });
});

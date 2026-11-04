import { frames } from './frames';
import type { GrammarOption, Language, Phrase, Switchboard, SwitchDef, Word } from './model';

/** What a Switchboard shows for one choice of settings. */
export interface SwitchboardView {
  parts: (Phrase | string)[];
  translation: string;
}

/**
 * "What does this Switchboard show?" Builds the Sentence for one setting of every Switch
 * (a Grammar Option id or a Word id per Switch id). The screen calls this too.
 * With `previous` settings, Pieces that weren't in the same Phrase before are marked `changed`.
 */
export function showSwitchboard(
  switchboard: Switchboard, language: Language, settings: Record<string, string>, previous?: Record<string, string>,
): SwitchboardView {
  const view = build(switchboard, language, settings);
  if (!previous) return view;
  const before = build(switchboard, language, previous).parts;
  view.parts = view.parts.map((part, i) => {
    if (typeof part === 'string') return part;
    const old = before[i];
    // Match Pieces by script and Role, each old Piece used once; anything unmatched is new.
    const unmatched = typeof old === 'string' || !old ? [] : old.pieces.map((p) => `${p.script}|${p.role}`);
    return {
      ...part,
      pieces: part.pieces.map((p) => {
        const at = unmatched.indexOf(`${p.script}|${p.role}`);
        if (at >= 0) { unmatched.splice(at, 1); return p; }
        return { ...p, changed: true };
      }),
    };
  });
  return view;
}

function build(switchboard: Switchboard, language: Language, settings: Record<string, string>): SwitchboardView {
  const frame = frames[switchboard.frame];
  if (!frame) throw new Error(`Unknown Frame "${switchboard.frame}"`);
  const word = (id: string): Word => {
    const found = language.words.find((w) => w.id === id);
    if (!found) throw new Error(`Unknown Word "${id}"`);
    return found;
  };
  const words: Record<string, Word> = Object.fromEntries(Object.entries(switchboard.words).map(([slot, id]) => [slot, word(id)]));
  const grammar: Record<string, string> = {};
  for (const sw of switchboard.switches) {
    const value = settings[sw.id] ?? switchboard.start[sw.id]!;
    if (sw.kind === 'word') words[sw.slot] = word(value);
    else grammar[sw.id] = value;
  }
  return frame.build(words, grammar, language);
}

/** One choice on a Switch: a Grammar Option, or a Word offered by a Word Switch. */
export interface SwitchOption {
  id: string;
  label: string;
  sub?: string;
  hint?: string;
}

/** The Words that fit a Frame slot: right word class, every required Tag, and (for verbs) the right Frame. */
export function wordsForSlot(switchboard: Switchboard, slot: string, language: Language): Word[] {
  const spec = frames[switchboard.frame]?.slots[slot];
  if (!spec) return [];
  return language.words.filter((w) =>
    w.wordClass === spec.wordClass
    && (spec.tags ?? []).every((t) => w.tags?.includes(t))
    && (w.wordClass !== 'verb' || (w.frames?.includes(switchboard.frame) ?? false))
    && w.honorificOf === undefined);
}

/** The choices a Switch offers. A Word Switch offers every Word in the word list that fits its slot. */
export function optionsFor(sw: SwitchDef, switchboard: Switchboard, language: Language): SwitchOption[] {
  if (sw.kind === 'grammar') return sw.options.map((o: GrammarOption) => ({ ...o }));
  return wordsForSlot(switchboard, sw.slot, language).map((w) => ({ id: w.id, label: w.meaning[0]!.toUpperCase() + w.meaning.slice(1) }));
}

/** Every combination of settings a Switchboard allows (each Switch's Options, Word Switches included). */
export function allSettings(switchboard: Switchboard, language: Language): Record<string, string>[] {
  const every = switchboard.switches.reduce<Record<string, string>[]>(
    (combos, sw) => combos.flatMap((combo) => optionsFor(sw, switchboard, language).map((o) => ({ ...combo, [sw.id]: o.id }))),
    [{}],
  );
  return every.filter((settings) => !isBlocked(switchboard, language, settings));
}

function grammarOf(switchboard: Switchboard, settings: Record<string, string>): Record<string, string> {
  return Object.fromEntries(switchboard.switches.filter((sw) => sw.kind === 'grammar').map((sw) => [sw.id, settings[sw.id] ?? switchboard.start[sw.id]!]));
}

/** Options that can't be chosen with the current settings, as { switchId: { optionId: reason } }. */
export function disabledOptions(switchboard: Switchboard, _language: Language, settings: Record<string, string>): Record<string, Record<string, string>> {
  return frames[switchboard.frame]?.disallowed?.(grammarOf(switchboard, settings)) ?? {};
}

function isBlocked(switchboard: Switchboard, language: Language, settings: Record<string, string>): boolean {
  const disabled = disabledOptions(switchboard, language, settings);
  return Object.entries(disabled).some(([switchId, options]) => settings[switchId] !== undefined && settings[switchId]! in options);
}

/**
 * The settings after choosing one Option. If that makes another Switch's current Option disallowed
 * (e.g. choosing an A-not-A question while Negate is on), that Switch moves to its first allowed Option.
 */
export function applyChoice(
  switchboard: Switchboard, language: Language, settings: Record<string, string>, switchId: string, optionId: string,
): Record<string, string> {
  const next = { ...settings, [switchId]: optionId };
  const disabled = disabledOptions(switchboard, language, next);
  for (const sw of switchboard.switches) {
    if (sw.id === switchId || !(next[sw.id]! in (disabled[sw.id] ?? {}))) continue;
    const allowed = optionsFor(sw, switchboard, language).find((o) => !(o.id in (disabled[sw.id] ?? {})));
    if (allowed) next[sw.id] = allowed.id;
  }
  return next;
}

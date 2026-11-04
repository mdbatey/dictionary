import type { Language, Phrase, Word } from '../model';

/** What a Frame slot accepts, and what a Word needs in order to fill it. */
export interface FrameSlot {
  wordClass: Word['wordClass'];
  /** Tags a Word must have to fill this slot, e.g. ["person"]. */
  tags?: string[];
  /** Stored Forms the Frame's rules need from every Word in this slot. */
  forms?: string[];
  /** Grammar facts the Frame's rules need from every Word in this slot. */
  facts?: (keyof NonNullable<Word['facts']>)[];
}

/** One sentence shape for one Language, written as code (ADR 0001). */
export interface Frame {
  id: string;
  languageId: string;
  slots: Record<string, FrameSlot>;
  /** The Grammar Switch ids the Frame understands. */
  grammar: string[];
  /**
   * Options that can't be chosen with the current Grammar Options, as { switchId: { optionId: reason } }.
   * Leave out when every combination is allowed.
   */
  disallowed?(grammar: Record<string, string>): Record<string, Record<string, string>>;
  /** Builds the Sentence for one choice of Words (by slot) and Grammar Options (by Grammar Switch id). */
  build(words: Record<string, Word>, grammar: Record<string, string>, language: Language): { parts: (Phrase | string)[]; translation: string };
}

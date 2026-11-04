// The content model. Terms follow GLOSSARY.md.

/** How a Role is drawn: a filled chip, coloured text, or inverted (dark chip, light text). */
export type RoleStyle = 'chip' | 'text' | 'inverted';

/**
 * The grammatical job a Piece does. Each Role has one fixed colour (the design token `--role-<id>`)
 * and display style across the whole site.
 */
export interface Role {
  label: string;
  style: RoleStyle;
}

/** How one Language uses a Role: its general rule in that Language, and optionally its own label. */
export interface LanguageRole {
  /** The general rule for this Role in this Language, shown in the detail panel. */
  rule: string;
  /** A Language-specific label, e.g. "的 · possessive / descriptive". Defaults to the Role's label. */
  label?: string;
}

export type PhraseType = 'subject' | 'object' | 'indirect-object' | 'verb-phrase' | 'modifier' | 'question';

/** One morpheme or word in a Sentence. */
export interface Piece {
  script: string;
  /** Pronunciation, keyed by Pronunciation System id. */
  pron: Record<string, string>;
  gloss: string;
  /** A Role id from the site-wide Role list. */
  role: string;
  /** What this Piece is doing in this particular Sentence. */
  note?: string;
}

/** A group of adjacent Pieces forming one unit of meaning, outlined in its Phrase Type's colour. */
export interface Phrase {
  type: PhraseType;
  caption: string;
  pieces: Piece[];
}

/** A Sentence is Phrases in order; a string is punctuation between them. */
export interface Sentence {
  id: string;
  parts: (Phrase | string)[];
  translation: string;
  /** Markdown. */
  explanation: string;
}

/** A named, ordered group of Sentences in one Language. */
export interface SentenceSet {
  id: string;
  name: string;
  sentences: Sentence[];
}

/** The Switchboards a Language offers. Filled in from #10 onwards. */
export interface SwitchboardSummary {
  id: string;
  name: string;
}

export interface PronunciationSystem {
  id: string;
  label: string;
}

export interface Language {
  id: string;
  /** Name in the language itself, e.g. 한국어. */
  nativeName: string;
  /** English name, e.g. Korean. */
  name: string;
  /** BCP 47 tag for the lang attribute, e.g. "ko". */
  tag: string;
  /** The Roles this Language uses, keyed by Role id. */
  roles: Record<string, LanguageRole>;
  pronunciationSystems: PronunciationSystem[];
  defaultPronunciation: string;
  sets: SentenceSet[];
  switchboards: SwitchboardSummary[];
}

export interface Content {
  /** The site-wide Role list, keyed by Role id. */
  roles: Record<string, Role>;
  languages: Language[];
}

export function isPhrase(part: Phrase | string): part is Phrase {
  return typeof part !== 'string';
}

/** Every Piece in a Sentence, in reading order. */
export function piecesOf(sentence: Sentence): Piece[] {
  return sentence.parts.flatMap((part) => (isPhrase(part) ? part.pieces : []));
}

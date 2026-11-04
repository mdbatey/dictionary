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
  /** True when this Piece differs from the Sentence this one is compared with. */
  changed?: boolean;
  /** A second Role fused into the same syllable block (e.g. past 었 inside 줬). Drawn as an underline. */
  fuse?: string;
  /** True for a Piece that is left unsaid, such as "you" in polite Korean. Drawn faded. */
  dropped?: boolean;
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
  /** The id of another Sentence in the same Set that this one is meant to be compared with. */
  compareWith?: string;
}

/** One point of a Set's closing summary, with the Sentences that show it. */
export interface SummaryPoint {
  /** Markdown. */
  text: string;
  /** Ids of Sentences in the same Set, listed after the text. (Points can also link inline: [#3](sentence:3).) */
  sentences?: string[];
}

/** A named, ordered group of Sentences in one Language. */
export interface SentenceSet {
  id: string;
  name: string;
  sentences: Sentence[];
  summary?: SummaryPoint[];
}

/** One written form of a Word, such as 저 (the polite Form of the Word "I"). */
export interface WordForm {
  script: string;
  pron: Record<string, string>;
  /** Literal gloss for this Form, if it differs from the Word's (e.g. "I (humble)"). */
  gloss?: string;
  note?: string;
  /** Extra note for the particle that follows this Form (e.g. how 들's ㄹ slides onto 은). */
  particleNote?: string;
  /** For a Form that is left unsaid in this register (e.g. "you" in polite Korean). */
  dropped?: boolean;
}

/** One dictionary entry in one Language (see GLOSSARY.md). */
export interface Word {
  id: string;
  /** The dictionary form, e.g. 주다. */
  script: string;
  /** English meaning, e.g. "give", "Minho". */
  meaning: string;
  /** Literal gloss shown above the Word in a Sentence, if it differs from the meaning (e.g. "grandma"). */
  gloss?: string;
  /** Pronunciation of the dictionary form, keyed by Pronunciation System. */
  pron?: Record<string, string>;
  wordClass: 'pronoun' | 'noun' | 'verb';
  /** A note about the Word itself, shown on Pieces made from it. */
  note?: string;
  /** Grammar facts the rules need. */
  facts?: {
    person?: 1 | 2 | 3;
    number?: 'singular' | 'plural';
    honorific?: boolean;
  };
  /** Tags a Frame's slot can require, e.g. "person", "thing". */
  tags?: string[];
  /** For verbs: the Frames this verb fits. */
  frames?: string[];
  /** The id of the Word this one replaces when speaking to or about someone honoured (the Honorific Link). */
  honorificOf?: string;
  /** Stored Forms, keyed by name. */
  forms?: Record<string, WordForm>;
}

export interface GrammarOption {
  id: string;
  label: string;
  /** A short native-language name, e.g. 해요체. */
  sub?: string;
  /** When to use it, shown as the register hint. */
  hint?: string;
}

/** A Grammar Switch changes how the Sentence is said; a Word Switch changes which Word fills a Frame slot. */
export type SwitchDef =
  | { id: string; label: string; kind: 'grammar'; options: GrammarOption[] }
  | { id: string; label: string; kind: 'word'; slot: string };

/** A Switchboard is data on top of a Frame (ADR 0001). */
export interface Switchboard {
  id: string;
  name: string;
  /** The Frame id, e.g. "ko-giving". */
  frame: string;
  /** Word ids for slots that have no Word Switch, e.g. { verb: 'give', object: 'apple' }. */
  words: Record<string, string>;
  switches: SwitchDef[];
  /** Starting setting for every Switch: a Grammar Option id or a Word id. */
  start: Record<string, string>;
}

export interface PronunciationSystem {
  id: string;
  label: string;
  /** For a system worked out from another one instead of stored, e.g. Yale from Jyutping. */
  derive?: { from: string; rule: 'jyutping-to-yale' | 'jyutping-to-ipa' };
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
  /** For tonal Languages: the Pronunciation System whose syllables carry the tones (tone marks or tone numbers). */
  tones?: { system: string; style: 'marks' | 'numbers' };
  sets: SentenceSet[];
  words: Word[];
  switchboards: Switchboard[];
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

import { derivedPron, hasSourceFor } from './derive';
import { frames } from './frames';
import { optionsFor, wordsForSlot } from './switchboard';
import { splitSyllables, syllableCharacters } from './tones';
import { isPhrase, type Content, type Language } from './model';

/** One thing wrong with the content, with where it is. */
export interface Problem {
  where: string;
  message: string;
}

/** The Sentence ids a Markdown text links to with [text](sentence:N). */
function sentenceLinks(markdown: string): string[] {
  return [...markdown.matchAll(/\]\(sentence:([^)\s]+)\)/g)].map((m) => m[1]!);
}

/** "Is the content valid?": returns every problem found; an empty list means the content is valid. */
export function checkContent(content: Content): Problem[] {
  const problems: Problem[] = [];
  for (const language of content.languages) {
    for (const role of Object.keys(language.roles)) {
      if (!Object.hasOwn(content.roles, role)) {
        problems.push({ where: language.name, message: `Role "${role}" is not in the site-wide Role list` });
      }
    }
    for (const set of language.sets) {
      const sentenceIds = new Set(set.sentences.map((s) => s.id));
      (set.summary ?? []).forEach((point, i) => {
        for (const id of [...(point.sentences ?? []), ...sentenceLinks(point.text)].filter((id) => !sentenceIds.has(id))) {
          problems.push({
            where: `${language.name} › ${set.name} › Summary point ${i + 1}`,
            message: `Links to Sentence ${id}, which is not in this Set`,
          });
        }
      });
      for (const sentence of set.sentences) {
        const notes = sentence.parts.flatMap((p) => (isPhrase(p) ? p.pieces.map((pc) => pc.note ?? '') : []));
        for (const id of [sentence.explanation, ...notes].flatMap(sentenceLinks).filter((id) => !sentenceIds.has(id))) {
          problems.push({ where: `${language.name} › ${set.name} › Sentence ${sentence.id}`, message: `Links to Sentence ${id}, which is not in this Set` });
        }
        if (sentence.compareWith !== undefined && !sentenceIds.has(sentence.compareWith)) {
          problems.push({
            where: `${language.name} › ${set.name} › Sentence ${sentence.id}`,
            message: `Compares with Sentence ${sentence.compareWith}, which is not in this Set`,
          });
        }
        for (const part of sentence.parts) {
          if (!isPhrase(part)) continue;
          for (const piece of part.pieces) {
            const defaultSystem = language.pronunciationSystems.find((ps) => ps.id === language.defaultPronunciation);
            // A derived default (e.g. Yale) needs its source stored; bad source text is reported by the derivation check below.
            if (!(defaultSystem ? hasSourceFor(piece, defaultSystem) : piece.pron[language.defaultPronunciation])) {
              problems.push({
                where: `${language.name} › ${set.name} › Sentence ${sentence.id} › ${piece.script}`,
                message: `Missing a pronunciation in ${defaultSystem?.label ?? language.defaultPronunciation}, ${language.name}'s default`,
              });
            }
            let syllablesMisaligned = false;
            if (language.tones) {
              const characters = syllableCharacters(piece.script);
              const spoken = piece.pron[language.tones.system] ?? '';
              if (characters.length > 0 && !splitSyllables(spoken, characters.length, language.tones.style)) {
                syllablesMisaligned = true;
                const systemLabel = language.pronunciationSystems.find((ps) => ps.id === language.tones!.system)?.label ?? language.tones.system;
                problems.push({
                  where: `${language.name} › ${set.name} › Sentence ${sentence.id} › ${piece.script}`,
                  message: `${systemLabel} "${spoken}" does not split into one syllable for each of its ${characters.length} characters`,
                });
              }
            }
            // Skipped when the syllables are already reported: that's the root cause of anything derived from them failing.
            const underivable = syllablesMisaligned ? [] : language.pronunciationSystems.filter((ps) => ps.derive && hasSourceFor(piece, ps) && !derivedPron(piece, ps));
            if (underivable.length) {
              const fromId = underivable[0]!.derive!.from;
              const fromLabel = fromId === 'script' ? 'the script' : language.pronunciationSystems.find((ps) => ps.id === fromId)?.label ?? fromId;
              problems.push({
                where: `${language.name} › ${set.name} › Sentence ${sentence.id} › ${piece.script}`,
                message: `${underivable.map((ps) => ps.label).join(' and ')} can't be worked out from ${fromLabel} "${fromId === 'script' ? piece.script : piece.pron[fromId]}"`,
              });
            }
            if (!Object.hasOwn(language.roles, piece.role)) {
              problems.push({
                where: `${language.name} › ${set.name} › Sentence ${sentence.id} › ${piece.script}`,
                message: `Role "${piece.role}" is not one of ${language.name}'s Roles`,
              });
            }
          }
        }
      }
    }
  }
  for (const language of content.languages) problems.push(...checkSwitchboards(language));
  return problems;
}

/** Switchboards must name a real Frame, real Switches and real Words, and every Word must give its Frame what it needs. */
function checkSwitchboards(language: Language): Problem[] {
  const problems: Problem[] = [];
  for (const sb of language.switchboards) {
    const where = `${language.name} › Switchboard "${sb.id}"`;
    const frame = frames[sb.frame];
    if (!frame) {
      problems.push({ where, message: `Frame "${sb.frame}" does not exist` });
      continue;
    }
    for (const [slot, id] of Object.entries(sb.words)) {
      if (!language.words.some((w) => w.id === id)) {
        problems.push({ where, message: `Word "${id}" (slot "${slot}") is not in the ${language.name} word list` });
      }
    }
    for (const sw of sb.switches) {
      const offered = optionsFor(sw, sb, language).map((o) => o.id);
      const start = sb.start[sw.id];
      if (start === undefined || !offered.includes(start)) {
        problems.push({ where, message: `Starts the "${sw.id}" Switch on "${start ?? 'nothing'}", which it does not offer` });
      }
    }
    for (const id of Object.keys(sb.start).filter((id) => !sb.switches.some((sw) => sw.id === id))) {
      problems.push({ where, message: `Starts a Switch "${id}" that it does not have` });
    }
    for (const sw of sb.switches) {
      if (sw.kind === 'word' && wordsForSlot(sb, sw.slot, language).length === 0) {
        problems.push({ where, message: `No Word in the ${language.name} word list fits the "${sw.slot}" slot` });
      }
    }
    // Every Word that can fill a slot (offered, fixed, or brought in by an Honorific Link) must have what the Frame needs.
    for (const [slot, spec] of Object.entries(frame.slots)) {
      const fixed = language.words.filter((w) => w.id === sb.words[slot]);
      const direct = [...wordsForSlot(sb, slot, language), ...fixed];
      const linked = language.words.filter((w) => w.honorificOf && direct.some((c) => c.id === w.honorificOf));
      for (const word of new Set([...direct, ...linked])) {
        for (const fact of spec.facts ?? []) {
          if (word.facts?.[fact] === undefined) {
            problems.push({ where, message: `Word "${word.id}" (slot "${slot}") is missing the grammar fact "${fact}" that Frame "${frame.id}" needs` });
          }
        }
        for (const form of spec.forms ?? []) {
          if (!word.forms?.[form]) {
            problems.push({ where, message: `Word "${word.id}" (slot "${slot}") is missing the Form "${form}" that Frame "${frame.id}" needs` });
          }
        }
      }
    }
  }
  return problems;
}

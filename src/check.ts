import { frames } from './frames';
import { optionsFor, wordsForSlot } from './switchboard';
import { isPhrase, type Content, type Language } from './model';

/** One thing wrong with the content, with where it is. */
export interface Problem {
  where: string;
  message: string;
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
        for (const id of point.sentences.filter((id) => !sentenceIds.has(id))) {
          problems.push({
            where: `${language.name} › ${set.name} › Summary point ${i + 1}`,
            message: `Links to Sentence ${id}, which is not in this Set`,
          });
        }
      });
      for (const sentence of set.sentences) {
        if (sentence.compareWith !== undefined && !sentenceIds.has(sentence.compareWith)) {
          problems.push({
            where: `${language.name} › ${set.name} › Sentence ${sentence.id}`,
            message: `Compares with Sentence ${sentence.compareWith}, which is not in this Set`,
          });
        }
        for (const part of sentence.parts) {
          if (!isPhrase(part)) continue;
          for (const piece of part.pieces) {
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

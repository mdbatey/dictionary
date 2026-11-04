import { isPhrase, type Content } from './model';

/** One thing wrong with the content, with where it is. */
export interface Problem {
  where: string;
  message: string;
}

/** "Is the content valid?": returns every problem found; an empty list means the content is valid. */
export function checkContent(content: Content): Problem[] {
  const problems: Problem[] = [];
  for (const language of content.languages) {
    for (const role of language.roles) {
      if (!Object.hasOwn(content.roles, role)) {
        problems.push({ where: language.name, message: `Role "${role}" is not in the site-wide Role list` });
      }
    }
    const languageRoles = new Set(language.roles);
    for (const set of language.sets) {
      for (const sentence of set.sentences) {
        for (const part of sentence.parts) {
          if (!isPhrase(part)) continue;
          for (const piece of part.pieces) {
            if (!languageRoles.has(piece.role)) {
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
  return problems;
}

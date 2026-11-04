import { describe, expect, it } from 'vitest';
import { checkContent } from './check';
import { content } from './content';
import type { Content, Phrase } from './model';

/** A copy of the real content with the first Korean Piece given a different Role. */
function withFirstKoreanPieceRole(role: string): Content {
  const broken = structuredClone(content);
  const firstPhrase = broken.languages[0]!.sets[0]!.sentences[0]!.parts[0] as Phrase;
  firstPhrase.pieces[0]!.role = role;
  return broken;
}

describe('checkContent', () => {
  it('finds no problems in the real content', () => {
    expect(checkContent(content)).toEqual([]);
  });

  it('reports a Piece whose Role its Language does not use', () => {
    expect(checkContent(withFirstKoreanPieceRole('tense'))).toEqual([
      { where: 'Korean › Korean in 13 Sentences › Sentence 3 › 나', message: 'Role "tense" is not one of Korean\'s Roles' },
    ]);
  });

  it('reports a Language that lists a Role missing from the site-wide Role list', () => {
    const broken = structuredClone(content);
    broken.languages[0]!.roles.push('topik');
    expect(checkContent(broken)).toEqual([
      { where: 'Korean', message: 'Role "topik" is not in the site-wide Role list' },
    ]);
  });
});

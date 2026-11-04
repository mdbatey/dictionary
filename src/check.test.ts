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
    expect(checkContent(withFirstKoreanPieceRole('measure'))).toEqual([
      { where: 'Korean › The Korean Dozen › Sentence 1 › 사과', message: 'Role "measure" is not one of Korean\'s Roles' },
    ]);
  });

  it('reports a Language that lists a Role missing from the site-wide Role list', () => {
    const broken = structuredClone(content);
    broken.languages[0]!.roles['topik'] = { rule: 'A misspelt Role.' };
    expect(checkContent(broken)).toEqual([
      { where: 'Korean', message: 'Role "topik" is not in the site-wide Role list' },
    ]);
  });

  it('reports a comparison link to a Sentence that does not exist', () => {
    const broken = structuredClone(content);
    broken.languages[0]!.sets[0]!.sentences[0]!.compareWith = '99';
    expect(checkContent(broken)).toEqual([
      { where: 'Korean › The Korean Dozen › Sentence 1', message: 'Compares with Sentence 99, which is not in this Set' },
    ]);
  });

  it('reports a Set summary point linking to a Sentence that does not exist', () => {
    const broken = structuredClone(content);
    broken.languages[0]!.sets[0]!.summary = [{ text: 'Word order is subject, object, verb.', sentences: ['1', '42'] }];
    expect(checkContent(broken)).toEqual([
      { where: 'Korean › The Korean Dozen › Summary point 1', message: 'Links to Sentence 42, which is not in this Set' },
    ]);
  });
});

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

  it('reports a Switchboard that names a Frame that does not exist', () => {
    const broken = structuredClone(content);
    broken.languages[0]!.switchboards[0]!.frame = 'ko-gving';
    expect(checkContent(broken)).toEqual([
      { where: 'Korean › Switchboard "giving"', message: 'Frame "ko-gving" does not exist' },
    ]);
  });

  it('reports a Switchboard that names a Word that does not exist', () => {
    const broken = structuredClone(content);
    broken.languages[0]!.switchboards[0]!.words['thing'] = 'banana';
    expect(checkContent(broken)).toEqual([
      { where: 'Korean › Switchboard "giving"', message: 'Word "banana" (slot "thing") is not in the Korean word list' },
    ]);
  });

  it('reports starting settings for an unknown Switch or an Option a Switch does not offer', () => {
    const broken = structuredClone(content);
    broken.languages[0]!.switchboards[0]!.start['speed'] = 'fast';
    broken.languages[0]!.switchboards[0]!.start['to'] = 'apple';
    expect(checkContent(broken)).toEqual([
      { where: 'Korean › Switchboard "giving"', message: 'Starts the "to" Switch on "apple", which it does not offer' },
      { where: 'Korean › Switchboard "giving"', message: 'Starts a Switch "speed" that it does not have' },
    ]);
  });

  it('reports a Word missing a Form or grammar fact its Frame needs', () => {
    const broken = structuredClone(content);
    const words = broken.languages[0]!.words;
    delete words.find((w) => w.id === 'give-honorific')!.forms!['fut'];
    delete words.find((w) => w.id === 'they')!.facts!.number;
    expect(checkContent(broken)).toEqual([
      { where: 'Korean › Switchboard "giving"', message: 'Word "they" (slot "who") is missing the grammar fact "number" that Frame "ko-giving" needs' },
      { where: 'Korean › Switchboard "giving"', message: 'Word "give-honorific" (slot "verb") is missing the Form "fut" that Frame "ko-giving" needs' },
    ]);
  });

  it('reports a Word Switch whose slot no Word fits', () => {
    const broken = structuredClone(content);
    for (const w of broken.languages[0]!.words) w.tags = w.tags?.filter((t) => t !== 'person');
    expect(checkContent(broken)).toEqual([
      { where: 'Korean › Switchboard "giving"', message: 'Starts the "to" Switch on "minho", which it does not offer' },
      { where: 'Korean › Switchboard "giving"', message: 'No Word in the Korean word list fits the "to" slot' },
    ]);
  });

  it("reports a Piece missing a pronunciation in its Language's default system", () => {
    const broken = structuredClone(content);
    const firstPhrase = broken.languages[0]!.sets[0]!.sentences[0]!.parts[0] as Phrase;
    delete firstPhrase.pieces[0]!.pron['rom'];
    expect(checkContent(broken)).toEqual([
      { where: 'Korean › The Korean Dozen › Sentence 1 › 사과', message: 'Missing a pronunciation in Romanization, Korean\'s default' },
    ]);
  });

  it('reports tone syllables that do not match the characters one to one', () => {
    const broken = structuredClone(content);
    const mandarin = broken.languages.find((l) => l.id === 'zh')!;
    const firstPhrase = mandarin.sets[0]!.sentences[0]!.parts[0] as Phrase;
    firstPhrase.pieces[0]!.pron['pinyin'] = 'píng';
    expect(checkContent(broken)).toEqual([
      { where: 'Mandarin › The Mandarin Dozen › Sentence 1 › 苹果', message: 'Pinyin "píng" does not split into one syllable for each of its 2 characters' },
    ]);
  });

  it('reports a Markdown link to a Sentence that does not exist', () => {
    const broken = structuredClone(content);
    const set = broken.languages.find((l) => l.id === 'zh')!.sets[0]!;
    set.summary![0]!.text += ' See [#99](sentence:99).';
    set.sentences[1]!.explanation += ' Like [#40](sentence:40).';
    expect(checkContent(broken)).toEqual([
      { where: 'Mandarin › The Mandarin Dozen › Summary point 1', message: 'Links to Sentence 99, which is not in this Set' },
      { where: 'Mandarin › The Mandarin Dozen › Sentence 2', message: 'Links to Sentence 40, which is not in this Set' },
    ]);
  });
});

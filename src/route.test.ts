import { describe, expect, it } from 'vitest';
import type { Content, Language } from './model';
import { resolveRoute } from './route';

function language(id: string, name: string, setIds: string[], sentenceIds: string[]): Language {
  return {
    id, name, nativeName: name, tag: id, roles: {},
    pronunciationSystems: [{ id: 'rom', label: 'Romanization' }], defaultPronunciation: 'rom',
    sets: setIds.map((setId) => ({
      id: setId, name: `${name} ${setId}`,
      sentences: sentenceIds.map((sid) => ({ id: sid, parts: [], translation: '', explanation: '' })),
    })),
    switchboards: [],
  };
}

const content: Content = {
  roles: {},
  languages: [language('ko', 'Korean', ['dozen', 'more'], ['1', '2', '3']), language('da', 'Danish', ['dozen'], ['1'])],
};

describe('resolveRoute', () => {
  it('shows the language picker on a first visit', () => {
    expect(resolveRoute('', content, null)).toEqual({ show: { kind: 'picker' } });
  });

  it('reopens the last place visited on a later visit', () => {
    expect(resolveRoute('', content, '#/ko/breakdowns/more/2')).toEqual({ redirect: '#/ko/breakdowns/more/2' });
  });

  it('shows a Sentence within its Set', () => {
    expect(resolveRoute('#/ko/breakdowns/more/2', content, null)).toEqual({
      show: { kind: 'breakdowns', languageId: 'ko', setId: 'more', sentenceId: '2' },
    });
  });

  it('shows a Set from the top', () => {
    expect(resolveRoute('#/ko/breakdowns/more', content, null)).toEqual({
      show: { kind: 'breakdowns', languageId: 'ko', setId: 'more' },
    });
  });

  it("sends a Language's address to its Breakdowns", () => {
    expect(resolveRoute('#/ko', content, null)).toEqual({ redirect: '#/ko/breakdowns' });
  });

  it('sends Breakdowns to its first Set', () => {
    expect(resolveRoute('#/ko/breakdowns', content, null)).toEqual({ redirect: '#/ko/breakdowns/dozen' });
  });

  it("shows a Language's Switchboards, even when it has none yet", () => {
    expect(resolveRoute('#/da/switchboards', content, null)).toEqual({ show: { kind: 'switchboards', languageId: 'da' } });
  });

  it('sends a Sentence that no longer exists to its Set', () => {
    expect(resolveRoute('#/ko/breakdowns/more/99', content, null)).toEqual({ redirect: '#/ko/breakdowns/more' });
  });

  it("sends a Set that no longer exists to the Language's Breakdowns", () => {
    expect(resolveRoute('#/ko/breakdowns/gone/2', content, null)).toEqual({ redirect: '#/ko/breakdowns' });
  });

  it('shows "not found" for an unknown Language or view', () => {
    expect(resolveRoute('#/xx/breakdowns', content, null)).toEqual({ show: { kind: 'not-found' } });
    expect(resolveRoute('#/ko/somewhere', content, null)).toEqual({ show: { kind: 'not-found' } });
  });

  it('shows the language picker when the last place no longer exists', () => {
    expect(resolveRoute('', content, '#/xx/breakdowns')).toEqual({ show: { kind: 'picker' } });
  });

  it('always shows the language picker at #/languages', () => {
    expect(resolveRoute('#/languages', content, '#/ko/breakdowns/more/2')).toEqual({ show: { kind: 'picker' } });
  });
});

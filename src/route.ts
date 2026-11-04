import type { Content } from './model';

/** A screen the site can show. Screens hold ids, so they compare and serialise easily. */
export type Screen =
  | { kind: 'picker' }
  | { kind: 'breakdowns'; languageId: string; setId: string; sentenceId?: string }
  | { kind: 'switchboards'; languageId: string }
  | { kind: 'switchboard'; languageId: string; switchboardId: string }
  | { kind: 'not-found' };

/** What an address resolves to: a screen to show, or another address to go to instead. */
export type Resolution = { show: Screen } | { redirect: string };

const notFound: Resolution = { show: { kind: 'not-found' } };

/**
 * "What does this address show?" Turns a location hash (e.g. "#/ko/breakdowns/korean-dozen/3")
 * into a screen, or into a redirect for addresses that are incomplete or out of date.
 * `lastPlace` is the address of the last screen visited, if any.
 */
export function resolveRoute(hash: string, content: Content, lastPlace: string | null): Resolution {
  const path = hash.replace(/^#\/?/, '');
  if (path === '') return lastPlace && isLivePlace(lastPlace, content) ? { redirect: lastPlace } : { show: { kind: 'picker' } };
  if (path === 'languages') return { show: { kind: 'picker' } };

  const [languageId, view, setId, sentenceId] = path.split('/').map(decodeURIComponent);
  const language = content.languages.find((l) => l.id === languageId);
  if (!language) return notFound;
  const base = `#/${language.id}`;

  if (!view) return { redirect: `${base}/breakdowns` };
  if (view === 'switchboards') {
    if (!setId) return { show: { kind: 'switchboards', languageId: language.id } };
    const sb = language.switchboards.find((s) => s.id === setId);
    return sb ? { show: { kind: 'switchboard', languageId: language.id, switchboardId: sb.id } } : { redirect: `${base}/switchboards` };
  }
  if (view !== 'breakdowns') return notFound;

  if (!setId) {
    const first = language.sets[0];
    return first ? { redirect: `${base}/breakdowns/${first.id}` } : notFound;
  }
  const set = language.sets.find((s) => s.id === setId);
  if (!set) return { redirect: `${base}/breakdowns` };

  if (!sentenceId) return { show: { kind: 'breakdowns', languageId: language.id, setId: set.id } };
  const sentence = set.sentences.find((s) => s.id === sentenceId);
  if (!sentence) return { redirect: `${base}/breakdowns/${set.id}` };
  return { show: { kind: 'breakdowns', languageId: language.id, setId: set.id, sentenceId: sentence.id } };
}

/** Whether a saved address still leads somewhere real (so reopening it won't land on "not found"). */
function isLivePlace(address: string, content: Content): boolean {
  if (address.replace(/^#\/?/, '') === '') return false;
  const resolution = resolveRoute(address, content, null);
  return !('show' in resolution && resolution.show.kind === 'not-found');
}

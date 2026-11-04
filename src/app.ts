import { content } from './content';
import { h } from './dom';
import { fitToOneLine } from './fit';
import { piecesOf, type Language } from './model';
import { openPiecePanel } from './panel';
import { renderSentence, renderSentenceChips, renderSummary } from './render';
import { resolveRoute, type Screen } from './route';
import { readLastIn, readLastPlace, saveLastIn, saveLastPlace } from './storage';
import { renderSwitchboard } from './switchboard-screen';
import { renderToolbar } from './toolbar';

const SITE = 'Dictionary Layers';

function header(language: Language | undefined, view: 'breakdowns' | 'switchboards' | undefined, extra?: HTMLElement): HTMLElement {
  const top = h('div', { class: 'header-top' }, [
    h('a', { class: 'site-title', href: '#/languages' }, [SITE]),
    h('a', { class: 'language-button', href: '#/languages', 'aria-label': language ? `Language: ${language.name}. Change language` : 'Choose a language' }, [
      language ? `${language.nativeName} · ${language.name}` : 'Choose a language',
    ]),
  ]);
  if (!language) return h('header', { class: 'site-header' }, [top]);
  // Each tab returns to the Set / Switchboard last used in this Language (if it still exists), else the first.
  const lastIn = (id: 'breakdowns' | 'switchboards') => {
    const last = readLastIn(language.id, id);
    const exists = id === 'breakdowns' ? language.sets.some((x) => x.id === last) : language.switchboards.some((x) => x.id === last);
    return last && exists ? `/${last}` : '';
  };
  const tab = (id: 'breakdowns' | 'switchboards', label: string) =>
    h('a', { class: 'tab', href: `#/${language.id}/${id}${lastIn(id)}`, ...(view === id && { 'aria-current': 'page' }) }, [label]);
  return h('header', { class: 'site-header' }, [
    top,
    h('nav', { class: 'tabs', 'aria-label': 'Views' }, [tab('breakdowns', 'Breakdowns'), tab('switchboards', 'Switchboards')]),
    ...(extra ? [extra] : []),
  ]);
}

/** A row of named buttons for choosing between a Language's Sets or Switchboards; nothing when there's only one. */
function picker(label: string, items: { id: string; name: string; href: string }[], current: string): HTMLElement[] {
  if (items.length < 2) return [];
  return [h('nav', { class: 'picker', 'aria-label': label }, items.map((item) =>
    h('a', { class: 'toggle picker-item', href: item.href, ...(item.id === current && { 'aria-current': 'page' }) }, [item.name])))];
}

function footer(): HTMLElement {
  return h('footer', { class: 'site-footer' }, [h('a', { href: './colors.html' }, ['Color key'])]);
}

type ScreenParts = { title: string; body: HTMLElement[]; extra?: HTMLElement };

function pickerScreen(): ScreenParts {
  return {
    title: SITE,
    body: [
      h('h1', { class: 'page-title' }, ['Choose a language']),
      h('ul', { class: 'language-list' }, content.languages.map((language) =>
        h('li', {}, [
          h('a', { class: 'language-card', href: `#/${language.id}` }, [
            h('span', { class: 'language-native', lang: language.tag }, [language.nativeName]),
            h('span', { class: 'language-name' }, [language.name]),
          ]),
        ]),
      )),
    ],
  };
}

function breakdownsScreen(language: Language, setId: string, sentenceId?: string): { title: string; body: HTMLElement[]; extra: HTMLElement } {
  const set = language.sets.find((s) => s.id === setId)!;
  const addressOf = (id: string) => `#/${language.id}/breakdowns/${set.id}/${id}`;
  const sentences = h('div', { class: 'sentences' }, set.sentences.map((sentence) =>
    renderSentence(sentence, set, language, content, addressOf, (index) => openPiecePanel(sentence, index, language, content))));
  const summary = renderSummary(set, addressOf);
  return {
    title: `${set.name} · ${SITE}`,
    extra: renderSentenceChips(set, addressOf, sentenceId),
    body: [
      ...picker('Sets', language.sets.map((x) => ({ id: x.id, name: x.name, href: `#/${language.id}/breakdowns/${x.id}` })), set.id),
      h('h1', { class: 'page-title' }, [set.name]),
      renderToolbar(sentences, set.sentences.flatMap(piecesOf), language, content, refitAll, redraw),
      sentences,
      ...(summary ? [summary] : []),
    ],
  };
}

function switchboardsScreen(language: Language): ScreenParts {
  const body: HTMLElement[] = [h('h1', { class: 'page-title' }, [`${language.name} Switchboards`])];
  if (language.switchboards.length === 0) {
    body.push(h('p', { class: 'empty' }, [`None yet. ${language.name} Switchboards are on the way.`]));
  } else {
    body.push(h('ul', { class: 'language-list' }, language.switchboards.map((sb) =>
      h('li', {}, [h('a', { class: 'language-card', href: `#/${language.id}/switchboards/${sb.id}` }, [h('span', { class: 'switchboard-name' }, [sb.name])])]))));
  }
  return { title: `${language.name} Switchboards · ${SITE}`, body };
}

function oneSwitchboardScreen(language: Language, switchboardId: string): ScreenParts {
  const sb = language.switchboards.find((s) => s.id === switchboardId)!;
  return {
    title: `${sb.name} · ${SITE}`,
    body: [
      ...picker('Switchboards', language.switchboards.map((x) => ({ id: x.id, name: x.name, href: `#/${language.id}/switchboards/${x.id}` })), sb.id),
      h('h1', { class: 'page-title' }, [sb.name]),
      renderSwitchboard(sb, language),
    ],
  };
}

function notFoundScreen(): ScreenParts {
  return {
    title: `Not found · ${SITE}`,
    body: [
      h('h1', { class: 'page-title' }, ['Page not found']),
      h('p', { class: 'empty' }, ['This address doesn\'t lead anywhere. ', h('a', { href: '#/languages' }, ['Choose a language']), '.']),
    ],
  };
}

let fitted: { refit: () => void; stop: () => void }[] = [];
let shown: Screen | undefined;

/** Draws the current screen again (e.g. after the Sound picker changes), keeping the scroll position. */
function redraw(): void {
  if (!shown) return;
  const y = window.scrollY;
  show(shown);
  window.scrollTo(0, y);
}

function refitAll(): void {
  fitted.forEach((f) => f.refit());
}

let headerObserver: ResizeObserver | undefined;

/** Keeps --header-h equal to the sticky header's real height, so docked elements sit right under it. */
function watchHeaderHeight(el: HTMLElement): void {
  headerObserver?.disconnect();
  const update = () => document.documentElement.style.setProperty('--header-h', `${Math.round(el.getBoundingClientRect().height)}px`);
  update();
  headerObserver = new ResizeObserver(update);
  headerObserver.observe(el);
}

function show(screen: Screen): void {
  shown = screen;
  const language = 'languageId' in screen ? content.languages.find((l) => l.id === screen.languageId) : undefined;
  const view = screen.kind === 'breakdowns' ? 'breakdowns' : screen.kind === 'switchboards' || screen.kind === 'switchboard' ? 'switchboards' : undefined;
  const { title, body, extra } =
    screen.kind === 'breakdowns' ? breakdownsScreen(language!, screen.setId, screen.sentenceId)
    : screen.kind === 'switchboards' ? switchboardsScreen(language!)
    : screen.kind === 'switchboard' ? oneSwitchboardScreen(language!, screen.switchboardId)
    : screen.kind === 'not-found' ? notFoundScreen()
    : pickerScreen();

  fitted.forEach((f) => f.stop());
  const app = document.querySelector<HTMLElement>('#app')!;
  const siteHeader = header(language, view, extra);
  app.replaceChildren(siteHeader, h('main', {}, body), footer());
  watchHeaderHeight(siteHeader);
  document.title = title;
  fitted = [...app.querySelectorAll<HTMLElement>('.parts')].map(fitToOneLine);

  if (screen.kind === 'breakdowns' && screen.sentenceId) {
    const target = document.getElementById(`sentence-${screen.sentenceId}`);
    target?.classList.add('is-target');
    target?.scrollIntoView({ block: 'start' });
    app.querySelector('.sentence-chips [aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  } else {
    window.scrollTo(0, 0);
  }
  if (view) saveLastPlace(location.hash);
  if (screen.kind === 'breakdowns') saveLastIn(screen.languageId, 'breakdowns', screen.setId);
  if (screen.kind === 'switchboard') saveLastIn(screen.languageId, 'switchboards', screen.switchboardId);
}

function route(): void {
  const resolution = resolveRoute(location.hash, content, readLastPlace());
  if ('redirect' in resolution) {
    // replace(), so incomplete addresses don't leave extra steps in the back button's history.
    location.replace(resolution.redirect);
    return;
  }
  show(resolution.show);
}

export function start(): void {
  window.addEventListener('hashchange', route);
  route();
}

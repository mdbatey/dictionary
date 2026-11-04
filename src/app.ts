import { content } from './content';
import { h } from './dom';
import { fitToOneLine } from './fit';
import { piecesOf, type Language } from './model';
import { openPiecePanel } from './panel';
import { renderSentence } from './render';
import { resolveRoute, type Screen } from './route';
import { readLastPlace, saveLastPlace } from './storage';
import { renderToolbar } from './toolbar';

const SITE = 'Dictionary Layers';

function header(language: Language | undefined, view: 'breakdowns' | 'switchboards' | undefined): HTMLElement {
  const top = h('div', { class: 'header-top' }, [
    h('a', { class: 'site-title', href: '#/languages' }, [SITE]),
    h('a', { class: 'language-button', href: '#/languages', 'aria-label': language ? `Language: ${language.name}. Change language` : 'Choose a language' }, [
      language ? `${language.nativeName} · ${language.name}` : 'Choose a language',
    ]),
  ]);
  if (!language) return h('header', { class: 'site-header' }, [top]);
  const tab = (id: 'breakdowns' | 'switchboards', label: string) =>
    h('a', { class: 'tab', href: `#/${language.id}/${id}`, ...(view === id && { 'aria-current': 'page' }) }, [label]);
  return h('header', { class: 'site-header' }, [
    top,
    h('nav', { class: 'tabs', 'aria-label': 'Views' }, [tab('breakdowns', 'Breakdowns'), tab('switchboards', 'Switchboards')]),
  ]);
}

function footer(): HTMLElement {
  return h('footer', { class: 'site-footer' }, [h('a', { href: './colors.html' }, ['Color key'])]);
}

function pickerScreen(): { title: string; body: HTMLElement[] } {
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

function breakdownsScreen(language: Language, setId: string): { title: string; body: HTMLElement[] } {
  const set = language.sets.find((s) => s.id === setId)!;
  const sentences = h('div', { class: 'sentences' }, set.sentences.map((sentence) =>
    renderSentence(sentence, language, content, `#/${language.id}/breakdowns/${set.id}/${sentence.id}`,
      (index) => openPiecePanel(sentence, index, language, content))));
  return {
    title: `${set.name} · ${SITE}`,
    body: [
      h('h1', { class: 'page-title' }, [set.name]),
      renderToolbar(sentences, set.sentences.flatMap(piecesOf), language, content, refitAll),
      sentences,
    ],
  };
}

function switchboardsScreen(language: Language): { title: string; body: HTMLElement[] } {
  const body: HTMLElement[] = [h('h1', { class: 'page-title' }, [`${language.name} Switchboards`])];
  if (language.switchboards.length === 0) {
    body.push(h('p', { class: 'empty' }, [`None yet. ${language.name} Switchboards are on the way.`]));
  } else {
    body.push(h('ul', { class: 'switchboard-list' }, language.switchboards.map((sb) => h('li', {}, [sb.name]))));
  }
  return { title: `${language.name} Switchboards · ${SITE}`, body };
}

function notFoundScreen(): { title: string; body: HTMLElement[] } {
  return {
    title: `Not found · ${SITE}`,
    body: [
      h('h1', { class: 'page-title' }, ['Page not found']),
      h('p', { class: 'empty' }, ['This address doesn\'t lead anywhere. ', h('a', { href: '#/languages' }, ['Choose a language']), '.']),
    ],
  };
}

let fitted: { refit: () => void; stop: () => void }[] = [];

function refitAll(): void {
  fitted.forEach((f) => f.refit());
}

function show(screen: Screen): void {
  const language = 'languageId' in screen ? content.languages.find((l) => l.id === screen.languageId) : undefined;
  const view = screen.kind === 'breakdowns' || screen.kind === 'switchboards' ? screen.kind : undefined;
  const { title, body } =
    screen.kind === 'breakdowns' ? breakdownsScreen(language!, screen.setId)
    : screen.kind === 'switchboards' ? switchboardsScreen(language!)
    : screen.kind === 'not-found' ? notFoundScreen()
    : pickerScreen();

  fitted.forEach((f) => f.stop());
  const app = document.querySelector<HTMLElement>('#app')!;
  app.replaceChildren(header(language, view), h('main', {}, body), footer());
  document.title = title;
  fitted = [...app.querySelectorAll<HTMLElement>('.parts')].map(fitToOneLine);

  if (screen.kind === 'breakdowns' && screen.sentenceId) {
    const target = document.getElementById(`sentence-${screen.sentenceId}`);
    target?.classList.add('is-target');
    target?.scrollIntoView({ block: 'start' });
  } else {
    window.scrollTo(0, 0);
  }
  if (view) saveLastPlace(location.hash);
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

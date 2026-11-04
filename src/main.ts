import './styles/tokens.css';
import './styles/app.css';
import { content } from './content';
import { h } from './dom';
import { fitToOneLine } from './fit';
import { renderSentence } from './render';

const app = document.querySelector<HTMLDivElement>('#app')!;
const language = content.languages[0]!;
const set = language.sets[0]!;

app.append(
  h('header', { class: 'site-header' }, [h('p', { class: 'site-title' }, ['Dictionary Layers'])]),
  h('main', {}, [
    h('h1', { class: 'set-title' }, [set.name]),
    ...set.sentences.map((sentence) => renderSentence(sentence, language, content)),
  ]),
);

app.querySelectorAll<HTMLElement>('.parts').forEach(fitToOneLine);

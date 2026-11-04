type Child = Node | string;

/** Builds an element. Text children become text nodes, so content can never inject markup. */
export function h(tag: string, props: Record<string, string> = {}, children: Child[] = []): HTMLElement {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'class') el.className = value;
    else if (key.startsWith('--')) el.style.setProperty(key, value);
    else el.setAttribute(key, value);
  }
  for (const child of children) el.append(child);
  return el;
}

/**
 * Renders the small subset of Markdown the content uses as safe DOM nodes: **bold**, and links to other
 * Sentences in the same Set written [text](sentence:N). `sentenceHref` turns a Sentence id into an address;
 * without it, links render as plain text.
 */
export function inlineMarkdown(text: string, sentenceHref?: (id: string) => string): Child[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(sentence:[^)\s]+\))/).filter(Boolean).map((chunk) => {
    if (chunk.startsWith('**') && chunk.endsWith('**')) return h('strong', {}, [chunk.slice(2, -2)]);
    const link = /^\[([^\]]+)\]\(sentence:([^)\s]+)\)$/.exec(chunk);
    if (link) return sentenceHref ? h('a', { class: 'sentence-link', href: sentenceHref(link[2]!) }, [link[1]!]) : link[1]!;
    return chunk;
  });
}

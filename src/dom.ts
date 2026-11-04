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

/** Renders the small subset of Markdown used so far (**bold**) as safe DOM nodes. */
export function inlineMarkdown(text: string): Child[] {
  return text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((chunk) =>
    chunk.startsWith('**') && chunk.endsWith('**') ? h('strong', {}, [chunk.slice(2, -2)]) : chunk,
  );
}

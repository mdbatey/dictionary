/** Smallest scale a Sentence may shrink to before it scrolls sideways instead. */
const MIN_FIT = 0.72;

/**
 * Keeps a Sentence on one line: scales its text down (via the --fit custom property) just enough
 * to fit the available width, never below MIN_FIT. Anything still too wide scrolls sideways.
 * Returns a function that stops watching for resizes.
 */
export function fitToOneLine(row: HTMLElement): () => void {
  const fit = () => {
    // Spacing doesn't scale with the text, so re-measure a few times until it fits.
    let scale = 1;
    row.style.setProperty('--fit', '1');
    for (let i = 0; i < 4 && row.scrollWidth > row.clientWidth && scale > MIN_FIT; i++) {
      scale = Math.max(MIN_FIT, Math.floor(scale * (row.clientWidth / row.scrollWidth) * 100) / 100);
      row.style.setProperty('--fit', String(scale));
    }
  };
  fit();
  const observer = new ResizeObserver(fit);
  observer.observe(row.parentElement ?? row);
  document.fonts?.ready.then(fit);
  return () => observer.disconnect();
}

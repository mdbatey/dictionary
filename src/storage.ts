const LAST_PLACE = 'dictionary-layers:last-place';

/** The address of the last screen visited, or null. Storage can be unavailable (private mode, blocked). */
export function readLastPlace(): string | null {
  try {
    return localStorage.getItem(LAST_PLACE);
  } catch {
    return null;
  }
}

export function saveLastPlace(address: string): void {
  try {
    localStorage.setItem(LAST_PLACE, address);
  } catch {
    // Remembering the last place is a convenience; the site works without it.
  }
}

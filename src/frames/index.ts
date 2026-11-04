import { koreanGiving } from './korean-giving';
import type { Frame } from './types';

/** Every Frame, by id. */
export const frames: Record<string, Frame> = {
  [koreanGiving.id]: koreanGiving,
};

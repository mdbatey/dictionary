import type { Content } from '../model';
import { korean } from './korean';
import { mandarin } from './mandarin';
import { roles } from './roles';

export const content: Content = {
  roles,
  languages: [korean, mandarin],
};

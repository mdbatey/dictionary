import type { Content, Language, Piece, Role } from './model';

/** A Role as one Language shows it: its site-wide style plus that Language's label and rule. */
export interface ShownRole {
  id: string;
  label: string;
  rule: string;
  style: Role['style'];
}

export function shownRole(roleId: string, language: Language, content: Content): ShownRole {
  const role = content.roles[roleId];
  const own = language.roles[roleId];
  return { id: roleId, label: own?.label ?? role?.label ?? roleId, rule: own?.rule ?? '', style: role?.style ?? 'chip' };
}

/** The Roles used by these Pieces, in site-wide Role list order. */
export function rolesUsed(pieces: Piece[], language: Language, content: Content): ShownRole[] {
  const used = new Set(pieces.map((p) => p.role));
  return Object.keys(content.roles).filter((id) => used.has(id)).map((id) => shownRole(id, language, content));
}

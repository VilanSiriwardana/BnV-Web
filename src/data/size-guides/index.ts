// UX-Spec §9.2: measurements are owner-supplied (TBD). The size guide stays hidden until a table exists here.
export type SizeGuide = { title: string; columns: string[]; rows: string[][] };

export const sizeGuides: Partial<Record<string, SizeGuide>> = {};

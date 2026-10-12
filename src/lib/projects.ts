import { readFileSync } from "node:fs";
import { z } from "zod";
import type { BakedData, BakedRepo } from "./baked.ts";
import { sanitizeText } from "./format.ts";

export const CategorySchema = z.enum([
  "Developer Tools",
  "AI & Agents",
  "Web Apps",
  "Learning",
  "Media",
  "Network",
  "Documents",
  "Meta",
]);

/** Hand-written layer: filenames are slugs, frontmatter carries voice, never numbers. */
export const RepoEntrySchema = z.object({
  /** Override when the filename cannot be the slug (e.g. dotfiles like `.github.md` are invisible to globs). */
  slug: z
    .string()
    .regex(/^[a-z0-9.-]+$/)
    .optional(),
  blurb: z.string().min(1).max(200),
  story: z.string().min(1).max(240).optional(),
  category: CategorySchema,
  accent: z.enum(["primary", "secondary", "highlight"]),
  pattern: z.enum(["orbit", "grid", "stack", "wave"]),
  image: z.string().startsWith("/").optional(),
});

export type RepoEntry = z.infer<typeof RepoEntrySchema>;
export type FullProject = BakedRepo & {
  blurb: string;
  story: string | null;
  category: z.infer<typeof CategorySchema>;
  accent: "primary" | "secondary" | "highlight";
  pattern: "orbit" | "grid" | "stack" | "wave";
  image: string | null;
};

/**
 * The single source sections read. Joins machine numbers (baked) with human
 * voice (collection) by slug and throws on any drift: duplicate slugs,
 * unknown slugs either side, or schema violations. Sorted stars-first.
 */
export function joinProjects(
  baked: BakedData,
  entries: { slug: string; data: unknown }[],
): FullProject[] {
  const parsed = entries.map((e) => {
    const data = RepoEntrySchema.parse(e.data);
    return { slug: data.slug ?? e.slug, ...data };
  });
  const seen = new Set<string>();
  for (const p of parsed) {
    if (seen.has(p.slug)) throw new Error(`duplicate repo slug ${p.slug}`);
    seen.add(p.slug);
  }
  const bySlug = new Map(baked.repos.map((r) => [r.name.toLowerCase(), r]));
  const out: FullProject[] = [];
  for (const p of parsed) {
    const b = bySlug.get(p.slug);
    if (!b) throw new Error(`unknown repo ${p.slug}`);
    if (p.image) {
      const fsPath = `public${p.image}`;
      try {
        readFileSync(fsPath);
      } catch {
        throw new Error(`missing image file ${fsPath} for ${p.slug}`);
      }
    }
    out.push({
      ...b,
      description: sanitizeText(b.description),
      blurb: sanitizeText(p.blurb),
      story: p.story === undefined ? null : sanitizeText(p.story),
      category: p.category,
      accent: p.accent,
      pattern: p.pattern,
      image: p.image ?? null,
    });
  }
  for (const b of baked.repos) {
    if (!seen.has(b.name.toLowerCase())) throw new Error(`missing content for ${b.name}`);
  }
  return out.sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
}

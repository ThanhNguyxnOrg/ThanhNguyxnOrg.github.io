import { z } from "zod";

export const BakedRepoSchema = z.object({
  name: z.string(),
  repoUrl: z.url(),
  description: z.string(),
  language: z.string(),
  license: z.string().nullable(),
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  openIssues: z.number().int().nonnegative(),
  pushedAt: z.string(),
  defaultBranch: z.string(),
  hasPages: z.boolean(),
  demoUrl: z.url().nullable(),
  topics: z.array(z.string()),
  unverified: z.array(z.string()).default([]),
});

export const BakedNpmSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  downloads30d: z.number().int().nonnegative(),
});

export const BakedTotalsSchema = z.object({
  repos: z.number().int().nonnegative(),
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  openIssues: z.number().int().nonnegative(),
  languages: z.array(z.string()),
  packages: z.number().int().nonnegative(),
  demos: z.number().int().nonnegative(),
  downloads30d: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
});

export const BakedDataSchema = z.object({
  fetchedAt: z.string(),
  totals: BakedTotalsSchema,
  repos: z.array(BakedRepoSchema),
  npm: z.array(BakedNpmSchema),
});

export type BakedData = z.infer<typeof BakedDataSchema>;
export type BakedRepo = z.infer<typeof BakedRepoSchema>;

export function loadBaked(json: unknown): BakedData {
  return BakedDataSchema.parse(json);
}

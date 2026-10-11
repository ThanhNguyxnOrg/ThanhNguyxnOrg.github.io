import { defineCollection } from "astro:content";
import { z } from "zod";
import { RepoEntrySchema } from "./lib/projects.ts";

const timeline = defineCollection({
  type: "content",
  schema: z.object({
    date: z.string().regex(/^\d{4}-\d{2}$/),
    title: z.string().min(1).max(80),
    description: z.string().min(1).max(220),
    tags: z.array(z.string()).optional(),
    current: z.boolean().optional(),
  }),
});

const repos = defineCollection({
  type: "content",
  schema: RepoEntrySchema,
});

export const collections = { repos, timeline };

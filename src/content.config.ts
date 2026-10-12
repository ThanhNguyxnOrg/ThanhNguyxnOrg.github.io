import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";
import { RepoEntrySchema } from "./lib/projects.ts";

const timeline = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/timeline" }),
  schema: z.object({
    date: z.string().regex(/^\d{4}-\d{2}$/),
    title: z.string().min(1).max(80),
    description: z.string().min(1).max(220),
    tags: z.array(z.string()).optional(),
    current: z.boolean().optional(),
  }),
});

const repos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/repos" }),
  schema: RepoEntrySchema,
});

const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string().min(1).max(80),
    origin: z.string().min(1),
  }),
});

export const collections = { repos, timeline, docs };

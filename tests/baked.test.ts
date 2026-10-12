import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BakedDataSchema } from "../src/lib/baked.ts";
import { formatCount, sanitizeText } from "../src/lib/format.ts";

const validRepo = {
  name: "blendops",
  repoUrl: "https://github.com/ThanhNguyxnOrg/blendops",
  description: "AI-native Blender workflow specs",
  language: "JavaScript",
  license: "MIT",
  stars: 3,
  forks: 0,
  openIssues: 0,
  pushedAt: "2026-09-21T15:15:14Z",
  createdAt: "2026-04-09T00:00:00Z",
  defaultBranch: "main",
  hasPages: false,
  demoUrl: null,
  homepage: null,
  topics: ["ai-agents"],
};

const validDoc = {
  fetchedAt: "2026-10-11",
  foundedAt: "2026-04-09",
  totals: {
    repos: 16,
    stars: 10,
    forks: 7,
    openIssues: 0,
    languages: ["TypeScript"],
    packages: 2,
    demos: 5,
    downloads30d: 313,
    followers: 8,
  },
  repos: [validRepo],
  npm: [
    {
      name: "archpulse",
      version: "0.5.3",
      description: "Living architecture diagrams",
      keywords: ["architecture"],
      downloads30d: 146,
    },
  ],
};

describe("baked schema", () => {
  it("accepts a valid document", () => {
    assert.doesNotThrow(() => BakedDataSchema.parse(validDoc));
  });

  it("rejects a repo entry missing repoUrl", () => {
    const bad = {
      ...validDoc,
      repos: [{ ...validRepo, repoUrl: undefined }],
    };
    assert.throws(() => BakedDataSchema.parse(bad));
  });
});

describe("formatters", () => {
  it("formats 167 as 167", () => {
    assert.equal(formatCount(167), "167");
  });

  it("sanitizes API text to the ASCII gate", () => {
    assert.equal(sanitizeText("prep — curated"), "prep - curated");
    assert.equal(sanitizeText("🌐 A curated collection"), "A curated collection");
    assert.equal(sanitizeText("plain text 123"), "plain text 123");
  });
});

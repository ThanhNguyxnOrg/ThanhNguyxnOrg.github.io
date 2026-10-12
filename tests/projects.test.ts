import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { joinProjects } from "../src/lib/projects.ts";
import type { BakedData } from "../src/lib/baked.ts";

function baked(names: string[]): BakedData {
  return {
    fetchedAt: "2026-10-11",
    foundedAt: null,
    totals: {
      repos: names.length,
      stars: 0,
      forks: 0,
      openIssues: 0,
      languages: ["TypeScript"],
      packages: 0,
      demos: 0,
      downloads30d: 0,
      followers: 0,
    },
    repos: names.map((name, i) => ({
      name,
      repoUrl: `https://github.com/ThanhNguyxnOrg/${name}`,
      description: `${name} description`,
      language: "TypeScript",
      license: "MIT",
      stars: names.length - i,
      forks: 0,
      openIssues: 0,
      pushedAt: "2026-10-10T00:00:00Z",
      defaultBranch: "main",
      hasPages: false,
      demoUrl: null,
      homepage: null,
      topics: [],
      unverified: [],
    })),
    npm: [],
  };
}

const entry = {
  blurb: "A tool that does things.",
  category: "Developer Tools",
  accent: "primary",
  pattern: "orbit",
} as const;

describe("joinProjects", () => {
  it("merges numbers with voice sorted stars-first", () => {
    const out = joinProjects(baked(["b-repo", "a-repo"]), [
      { slug: "b-repo", data: entry },
      { slug: "a-repo", data: entry },
    ]);
    assert.equal(out[0].name, "b-repo");
    assert.equal(out[0].blurb, entry.blurb);
    assert.equal(out[1].name, "a-repo");
  });

  it("throws on a duplicate slug", () => {
    assert.throws(() =>
      joinProjects(baked(["a-repo"]), [
        { slug: "a-repo", data: entry },
        { slug: "a-repo", data: entry },
      ]),
    );
  });

  it("throws on an entry with no baked repo", () => {
    assert.throws(() => joinProjects(baked(["a-repo"]), [{ slug: "ghost", data: entry }]), /unknown repo ghost/);
  });

  it("throws when a baked repo has no entry", () => {
    assert.throws(() => joinProjects(baked(["a-repo", "b-repo"]), [{ slug: "a-repo", data: entry }]), /missing content/);
  });

  it("rejects an invalid category", () => {
    assert.throws(() =>
      joinProjects(baked(["a-repo"]), [{ slug: "a-repo", data: { ...entry, category: "Games" } }]),
    );
  });

  it("prefers an explicit slug override for unglobbable filenames", () => {
    const out = joinProjects(baked([".github"]), [
      { slug: "github", data: { ...entry, slug: ".github" } },
    ]);
    assert.equal(out[0].name, ".github");
  });
});

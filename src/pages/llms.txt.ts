import type { APIRoute } from "astro";
import { loadSiteData } from "../lib/site-data";

/**
 * llms.txt generated at build time from the single source, so its numbers
 * can never go stale. Follows the llmstxt.org v2 shape: H1, blockquote
 * summary, detail paragraphs, H2 link lists. Links only verified URLs.
 */
export const GET: APIRoute = async () => {
  const { baked, projects } = await loadSiteData();
  const t = baked.totals;
  const demos = projects.filter((p) => p.demoUrl !== null);
  const lines: string[] = [
    "# ThanhNguyxnOrg",
    "",
    `> Independent technology practice building developer tools, AI workflows, and open source utilities. ${t.repos} public repositories, ${t.stars} stars, ${t.forks} forks, ${t.openIssues} open issues, ${demos.length} live demos, ${t.packages} npm packages with ${t.downloads30d} downloads in 30 days (snapshot ${baked.fetchedAt}).`,
    "",
    "ThanhNguyxnOrg is not a company. It is a working base and long-term archive for projects that matter to its maintainers. Numbers here refresh daily from the GitHub and npm APIs; each figure carries its fetch date on the site. Nothing here is invented: thin histories stay thin, dead links stay unlinked.",
    "",
    "## Projects",
    "",
    ...projects.map((p) => `- [${p.name}](${p.repoUrl}): ${p.blurb}`),
    "",
    "## Live demos",
    "",
    ...demos.map((p) => `- [${p.name} demo](${p.demoUrl}): verified live.`),
    "",
    "## Packages",
    "",
    ...baked.npm.map(
      (p) => `- [${p.name} ${p.version}](https://www.npmjs.com/package/${p.name}): ${p.description}, ${p.downloads30d} downloads in 30 days.`,
    ),
    "",
    "## Site pages",
    "",
    "- [Home](https://thanhnguyxnorg.github.io/): hero, live metrics, top-6 projects.",
    "- [Projects](https://thanhnguyxnorg.github.io/projects): full searchable index of every repository.",
    "- [Journey](https://thanhnguyxnorg.github.io/journey): project histories and milestones.",
    "- [About](https://thanhnguyxnorg.github.io/about): principles, migration note, live stack, ecosystem.",
    "",
    "## Docs",
    "",
    "- [Org profile](https://github.com/ThanhNguyxnOrg/.github/blob/main/profile/README.md): showcase top 6 and full project list.",
    "- [Projects](https://github.com/ThanhNguyxnOrg/.github/blob/main/docs/projects.md): every repository with maturity notes.",
    "- [Stack](https://github.com/ThanhNguyxnOrg/.github/blob/main/docs/stack.md): languages and platforms that ship.",
    "- [Philosophy](https://github.com/ThanhNguyxnOrg/.github/blob/main/docs/philosophy.md): visible, organized, honest growth.",
    "- [Migration note](https://github.com/ThanhNguyxnOrg/.github/blob/main/docs/migration.md): second-life policy for older work.",
    "- [Support](https://github.com/ThanhNguyxnOrg/.github/blob/main/SUPPORT.md): best-effort tiers and how to get help.",
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

# Design: Multi-page split — 2026-10-12

## Intent
Homepage is one long scroll mixing showcase, full index, timeline, and packages. Split into focused pages so each has room for its effects, homepage becomes a short overview, nav/footer gain real destinations.

## Sitemap (my calls — user delegated)
- `/` — Hero (orbit + canvas), MetricsBand, Featured top-6, Journey teaser (first 3 stops + link), CTA. Explorer full list MOVES OUT.
- `/projects` — full Explorer index (search/filter/paging, all repos, logos).
- `/journey` — full Timeline + sticky panel.
- `/about` — Philosophy grid + migration note + stack stats + Ecosystem rows (org/packages/people/bot), rendered with site tokens (not raw markdown dump).
- Shared: SiteHeader nav (Projects, Journey, Packages→/projects#packages?, About, Support), footer sitemap, llms.txt updated per page, custom 404.

## Content sourcing (key decision)
The 4 mds live in the `.github` repo, not the site. No cross-repo build fetch (fragile, unauthenticated rate limits). Vendor one-time copies into `src/content/docs/{philosophy,migration,stack,projects-note}.md` with an `origin:` frontmatter field noting upstream path. projects.md's auto tables are NOT copied — live data already comes from `baked.json`. Stack numbers render live from `baked.totals`/`languages`, never copied.

## Non-goals
No blog engine, no search-across-pages, no i18n, no per-project detail pages (cards link out to GitHub as today).

## Constraints
- Same tokens, same reduced-motion guards, same test/build/check gates (add route tests: every nav href resolves, no dead links).
- Static output (`astro build`, GitHub Pages): no SSR, pagination stays client-side island as today.
- Homepage keeps all current sections' components reusable: Featured/Explorer/Journey render on both home (teaser props) and full pages — prop-driven, no forks.

## Left to the builder
Exact teaser lengths (suggest: home Explorer preview 4 newest-updated + "Browse all N" link; home Journey first 3 stops), 404 copy, nav active-state styling. CTA band renders at the bottom of every page.

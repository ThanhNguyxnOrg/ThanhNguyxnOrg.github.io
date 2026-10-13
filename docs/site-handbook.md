# ThanhNguyxnOrg.github.io — Site Handbook

Sổ tay duy nhất cho site org: kiến trúc, design system, data pipeline, deploy,
quy trình thêm nội dung và nhật ký quyết định. Đọc file này trước khi sửa site.

- Stack: Astro 7 + React 19 + Tailwind 4 + GSAP + Zod. Ngôn ngữ: TypeScript.
- Live: https://thanhnguyxnorg.github.io/ (repo `ThanhNguyxnOrg/ThanhNguyxnOrg.github.io`, nhánh `main`).
- Ethos: mọi con số đều từ dữ liệu verified (`baked.json`), không claim bịa;
  giọng văn do người viết trong `src/content/`; single gold accent; dark-first.

## 1. Cấu trúc repo

```text
src/
  pages/          index.astro  projects.astro  journey.astro  about.astro  404.astro  llms.txt.ts
  layouts/        Layout.astro (head/meta/SEO, header, footer, scroll progress)
  sections/       Hero, MetricsBand, Featured, TechMarquee, Philosophy,
                  Journey, Explorer, Ecosystem, CTA, TimelineBeam
  components/     UI dùng chung (Button, Badge/Tag, Content, Reveal/motion...)
  content/        repos/*.md  timeline/*.md  docs/*.md  (+ content.config.ts)
  data/           baked.json (số liệu máy, KHÔNG sửa tay)
  lib/            baked.ts  projects.ts (join)  site-data.ts  format.ts
  styles/         tokens.css (single source of truth cho design)
  site/           ProjectBits.tsx (visual + actions cho project)
scripts/          sync.ts (bắn GitHub API → baked.json)  check-dist.mjs  check-links.mjs
tests/            node:test, assert chuỗi nội dung file (xem §7)
public/           brand/ (board 1024px)  logos/  favicons  robots.txt  sitemap.xml  og-image.png
docs/             research-*.md + handbook này
.github/workflows/  deploy.yml (test → build → Pages)  sync-site.yml (cron data)
```

## 2. Routes và sections

| Route | Nội dung (trên → dưới) |
|---|---|
| `/` | Hero (constellation + StarCanvas) → MetricsBand (4 stat + sparkline) → Featured (1 lead + 5 card) → TechMarquee → Philosophy (4 nguyên tắc) → Journey preview (3 mốc) → Explorer preview (4 repo) → CTA `#support` |
| `/projects` | Explorer full: search + filter category/topic/sort + phân trang 8 + EmptyState → CTA |
| `/journey` | Journey full timeline + sticky panel "Currently reading" → CTA |
| `/about` | Philosophy → Migration (prose + rail ảnh) → Stack (lang bars + prose + rail ảnh) → Ecosystem → CTA |
| `/404` | "Nothing here but honest void." + về home / xem projects |
| `/llms.txt` | Context cho LLM, chỉ URL verified |

Mỗi trang đúng 1 `<h1>` (dạng `sr-only` để không vỡ layout), còn lại là `h2`.

## 3. Design system (`src/styles/tokens.css`)

- Palette: nền midnight `#080b14`, chữ ink, accent gold duy nhất
  (`#f59e0b`/`#fcd34d`). Không tím/cyan/lime/đỏ trong UI.
- Chữ: Space Grotesk (display), Inter (body), JetBrains Mono (chỉ cho DATA:
  date, count, code — không dùng mono để trang trí).
- Tiện ích dùng nhiều: `card-ticks` (góc gold), `lamp-cone`, `bg-blueprint(-fine)`,
  `bg-dots-gold`, `bg-aurora`, `focus-dim`, `title-shadow`, `image-frame`,
  `tabular`, `divider-orn` (§/◆/+), `noise-overlay`, `transition-ui`.
- Motion: entrance duy nhất là `Reveal` (y+fade, expo.out 0.6s), riêng card lead
  Featured dùng variant `settle` (scale .985→1). Còn lại: CountUp 1200ms,
  TiltCard lead, TimelineBeam scrub, marquee 48s, rail Ken Burns 26s,
  chấm live 2.4s. Tất cả transform/opacity, `prefers-reduced-motion` tắt全局.
- Decor (`aria-hidden`, `alt=""`) không bao giờ mang thông tin: rails about,
  Starfield, TimelineBeam, marquee, constellation orbits.

## 4. Data pipeline — vì sao repo mới PHẢI thêm tay 1 entry

Ba lớp dữ liệu, nhập theo đúng thứ tự:

1. **Máy** — `scripts/sync.ts` bắn GitHub API (≤40 calls) + npm registry, ghi
   `src/data/baked.json`: stars, forks, language, topics, downloads, totals,
   `fetchedAt`. Chạy tay: `node scripts/sync.ts --out src/data/baked.json`.
2. **Người** — `src/content/repos/<slug>.md`: `blurb` (≤200 chữ), `story` (tùy chọn,
   ≤240), `category` (1 trong 8), `accent` (primary/secondary/highlight),
   `pattern` (orbit/grid/stack/wave), `image`/`logo` (phải tồn tại trong `public/`).
   File `github.md` dùng `slug:` override cho tên đặc biệt (`.github`).
3. **Join** — `joinProjects()` (`src/lib/projects.ts`) ghép máy + người theo slug,
   sort stars-first, và **throw khi lệch**: repo mới chưa có entry → build đỏ.
   Đây là chủ ý (drift detection), không phải bug.

> Sync tự động (cron `0 0 * * *` ở `sync-site.yml`) chỉ refresh SỐ.
> Nó không thể bịa blurb/story/category — đó là giọng người.
> Quy tắc: **repo mới → thêm 1 file `src/content/repos/*.md` rồi mới yên tâm**,
> nếu không lần sync nửa đêm sẽ làm đỏ build và chặn deploy.
> (Thực tế đã xảy ra: repo website này ra đời sau site, entry tay
> `thanhnguyxnorg.github.io.md` được thêm để đón sync.)

Tags/topics: `topics` GitHub → hiển thị qua `Tag`, tối đa 6 trên card Featured
(`Strip`/`Poster` slice 0..6). Muốn đổi tag hiển thị: sửa topics trên GitHub,
sync tự kéo về. Đừng nhồi tag SEO — topics là phân loại thật.

Timeline (`src/content/timeline/*.md`): `date: YYYY-MM`,
`title` ≤80, `description` ≤220 ký tự, `tags` phải trùng tên repo nếu muốn panel
Journey hiện ảnh repo đó, `current: true` cho mốc hiện tại.
Docs (`src/content/docs/*.md`): `title` ≤80 + `origin` (nguồn gốc bài).

## 5. Deploy và CI

- Nhánh `main` (đã đổi từ `master` cho khớp default GitHub). Push `main` →
  `deploy.yml`: job `test` (build + `npm test`) → `build` (withastro/action) →
  `deploy` (Pages). Test đỏ thì dừng, không deploy.
- `sync-site.yml`: cron hằng ngày bake data → `npm test && build` → commit
  `src/data/baked.json` nếu đổi → push `main` → tự trigger deploy. Chạy tay:
  Actions → "Sync site data" → Run workflow.
- URL: `https://thanhnguyxnorg.github.io/` (có redirect `/about` → `/about/`).

## 6. Quy trình làm việc chuẩn

1. Viết code → `npm test` (96 test) → `npm run build` → `npx astro check` →
   `node scripts/check-dist.mjs` (glyph decor §◆×· đã allowlist).
2. Commit rõ nghĩa, merge branch vào `main` bằng merge commit, push.
3. Đừng sửa `src/data/baked.json` tay — chạy sync.
4. Ảnh mới vào `public/`: board ≤1024px cạnh dài, rail <200 KB, PNG nhỏ hơn càng tốt;
   `logo.png` đã nén 256px. Ảnh decor: `alt=""` + `loading="lazy"` + `decoding="async"`.
5. Không có `OPENAI_API_KEY` trên máy này nên không sinh ảnh AI tại chỗ;
   ảnh mới = ảnh thật hoặc board có sẵn.

## 7. Testing

- Convention: `node --test "tests/**/*.test.ts"`, đọc file + assert chuỗi
  (`readFileSync` + `includes`). Nhanh (~1s), nhưng chỉ bắt wiring — refactor đổi
  tên class là đỏ, và không cover hành vi runtime/DOM/a11y.
- Test mới viết cùng pattern, đặt tên theo batch (`pro-batch`, `decor-batch`).
- `check-dist.mjs` quét `dist/`: cấm em/en-dash, cấm chữ "figma", anchor phải resolve,
  đủ file (og-image/llms/favicon/logo), meta tags. Chưa đấu vào `npm test`.

## 8. Nhật ký quyết định

- Stack rail dùng `/brand/cogmint.png` tạm (board pipeline hợp "What ships",
  caption ghi đúng tên, aria-hidden) thay vì chờ ảnh user — đổi 1 dòng `src`
  khi có ảnh mới. Chi tiết: `docs/research-rail-imagery.md` §5.
- `h1` các trang phụ để `sr-only` (Explorer/Journey/Philosophy không nhận prop `as`).
- `check-dist` allowlist thêm §◆×· vì là decor chủ ý, vẫn cấm em/en-dash.
- `master` → `main` để khớp GitHub + trigger deploy.
- Ảnh rail crop portrait từ board ngang bằng `object-cover`; grade gold
  (`saturate .82` + overlay hard-light) để board lạc tông chìm vào palette.

## 9. Backlog (chưa làm, theo mức độ)

- Nặng: không còn (og-image/h1/logo/CI đã xong).
- Vừa: ảnh workspace thật cho Stack rail; `logo.png` hiển thị 44px nhưng file 256px
  vẫn thừa — cân nhắc SVG; font Google đang render-blocking (thiếu preconnect thì đã
  có, còn self-host thì chưa).
- Nhẹ: Journey `key={panel.image}` remount ảnh mỗi lần qua mốc; observer dep
  `[shown.length]`; StarCanvas tốn GPU khi hero visible; test behavior cho
  sparkline/showSpark; `rel`/`sizes` favicon đã sửa còn `site.webmanifest` thì chưa có.

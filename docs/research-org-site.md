# Research: Org Site ThanhNguyxnOrg (thanhnguyxnorg.github.io)

- Ngày nghiên cứu: 2026-10-11 (UTC).
- Nguyên tắc: CHỈ primary sources — response thật từ API/registry, page fetch live, file local đã đọc. Mỗi claim có nguồn đi kèm.
- File local đã đọc: `D:\Code\ThanhNguyxnOrg\.github\profile\README.md`, `docs/philosophy.md`, `docs/projects.md`, `docs/stack.md`, `docs/migration.md`. Thư mục site `D:\Code\ThanhNguyxnOrg\ThanhNguyxnOrg.github.io` đang TRỐNG (0 entries, đã kiểm tra).
- Bối cảnh org (từ API live + profile README): org `ThanhNguyxnOrg` — "An independent technology practice", 16 public repos, members `@ThanhNguyxn07` + `@RealThanhNguyxn`, focus developer-tools + ai-agents.

---

## Phần 1 — Dấu chân ThanhNguyxn NGOÀI GitHub (chỉ cái VERIFY được)

### 1.1. VERIFY ĐƯỢC

| # | Footprint | URL nguồn | Số liệu verify (live 11/10/2026) |
|---|---|---|---|
| 1 | GitHub org ThanhNguyxnOrg (neo chính) | https://github.com/ThanhNguyxnOrg | API `GET /orgs/ThanhNguyxnOrg` → `login: ThanhNguyxnOrg`, description "An independent technology practice focused on building, exploring, and evolving ideas.", `blog: null`, `email: null`, `public_repos: 16`, `followers: 8`, `created_at: 2026-04-09` |
| 2 | Members org (public) | https://github.com/orgs/ThanhNguyxnOrg/people | API `GET /orgs/ThanhNguyxnOrg/members` → `['RealThanhNguyxn', 'ThanhNguyxn07']` (200, không cần auth vì public membership) |
| 3 | GitHub user ThanhNguyxn07 | https://github.com/ThanhNguyxn07 | API `GET /users/ThanhNguyxn07` → name "Thanh Nguyen", `blog: ""`, `public_repos: 4`, `followers: 1`, `created_at: 2026-03-30`. 4 repos ĐỀU là fork: `graphify`, `mempalace`, `ollama`, `openclaw` (từ `GET /users/ThanhNguyxn07/repos`) |
| 4 | GitHub user RealThanhNguyxn | https://github.com/RealThanhNguyxn | API `GET /users/RealThanhNguyxn` → name "Thanh Nguyen", `public_repos: 2`, `followers: 0`, `created_at: 2026-04-09`. 2 repos ĐỀU là fork: `codex` (từ openai), `vscode` (từ microsoft) |
| 5 | npm publisher `thanhnguyxn` — 2 packages | https://www.npmjs.com/~thanhnguyxn | Registry API `/-/v1/search?text=ThanhNguyxn` → `total: 2`. Profile page npm ghi "ThanhNguyxn", "2 Packages", "0 Organizations". Chi tiết từ `registry.npmjs.org/<pkg>`: `archpulse@0.5.3` ("Living architecture diagrams for modern codebases…", created 2026-01-19) và `production-backend-kit@1.1.2` ("Production-grade backend engineering patterns, checklists & AI adapters", created 2026-01-16), maintainers đều là `thanhnguyxn` |
| 6 | HuggingFace user ThanhNguyxn | https://huggingface.co/ThanhNguyxn | Fetch live: tên "ThanhNguyen", username ThanhNguyxn, 5 followers / 0 following, **0 public models, 0 public datasets** (tài khoản placeholder, chưa có nội dung) |

### 1.2. ĐÃ KIỂM TRA NHƯNG KHÔNG VERIFY ĐƯỢC / KHÔNG TỒN TẠI (không dùng làm footprint)

- `github.com/ThanhNguyxn` (user personal trùng tên hiển thị npm): API `GET /users/ThanhNguyxn` → **404**, fetch page repo `ThanhNguyxn/SheerID-Verification-Tool` → **404** (11/10/2026). Lưu ý: websearch index có snippet khoe repo này "3.4k stars / thanhnguyxn.github.io/…" nhưng live check 404 nên **không verify được, không ghi vào site**. Trang npm `~thanhnguyxn` có link GitHub `@ThanhNguyxn` trỏ đúng login này — hiện lookup 404 (có thể đã đổi tên/xóa).
- `ThanhNguyxn07/lumen-subtitle-studio` (websearch thấy 1 hit): không có trong `GET /users/ThanhNguyxn07/repos` (chỉ 4 forks) → không verify được.
- PyPI: `GET https://pypi.org/pypi/ThanhNguyxn/json` → **404**; package `archpulse` trên PyPI → **404**. Không có footprint Python registry.
- crates.io: `GET /api/v1/crates?q=ThanhNguyxn` (kèm User-Agent) → `total: 0`. Không có footprint Rust registry.
- `https://thanhnguyxn.github.io/` → **404**; `https://thanhnguyxnorg.github.io/` → **404** (đúng kỳ vọng: chưa có site nào được deploy).
- Blog/site cá nhân, LinkedIn/X/YouTube chính chủ: đã websearch các keyword `ThanhNguyxn`, `ThanhNguyxn07`, `RealThanhNguyxn`, `ThanhNguyxnOrg` (+ biến thể npm/blog/youtube/twitter/linkedin) — kết quả trả về toàn là người trùng tên "Thanh Nguyen" không liên quan hoặc mirror github. **Không có mục nào verify được ngoài 6 mục ở §1.1.**

### 1.3. Kết luận cho site

- Ngoài GitHub, footprint thật duy nhất đáng show là **npm (2 packages)** + HuggingFace ở dạng link nhỏ (chưa có content, cân nhắc không show).
- Không bịa social links. Site nên link: GitHub org, 2 member profiles, npm publisher page, 2 package pages.

---

## Phần 2 — Mẫu site org/practice độc lập làm tốt (đã mở từng site 11/10/2026)

### Site 1 — https://antfu.me (Anthony Fu, open-source individual practice)

- Cấu trúc section: top nav (Blog / Projects / Talks / Sponsors / Podcasts / Photos / Demos) → hero 3 dòng ("fanatical open sourceror…") → **dòng proof bằng link repo thật** ("Creator of Vitest, Slidev, VueUse…" / "Core team of Vue, Nuxt, Vite") → đoạn ngắn về blog/talks/streams → social (GitHub, Bluesky, Discord, X) → sponsors (OpenCollective + GitHub Sponsors).
- Cách show projects: **tên + link, không khoe số**; có trang `/projects` full-list riêng, homepage chỉ nêu tên nổi bật nhất.
- Philosophy: 1 câu ("Dreaming up cool ideas and making them come true…"), không trang triết lý dài.
- Đáng học: hero ngắn + proof-links; tách `/projects`; thêm trang `/uses` (hardware/software) tạo cá tính; sponsor block minh bạch.

### Site 2 — https://www.joshwcomeau.com (independent educator)

- Cấu trúc: homepage = **article list** (title + excerpt + "Read more") → "Browse by Category" → **"Popular Content" top-10** → newsletter signup → footer có Interactive Courses (domain riêng: css-for-js.dev, joyofreact.com).
- Metrics: không show stars/followers; show "popular" theo lượt đọc thật.
- Đáng học: content-first (blog là homepage); top-10 popular thay vì "featured tùy cảm tính"; tách courses ra subdomain riêng khi lớn; newsletter thay cho social ồn.

### Site 3 — https://kentcdodds.com (individual practice, có số liệu thật)

- Cấu trúc: hero = **mission 1 câu** ("Helping people make the world a better place through quality software.") → intro video 2 phút → blog recommendations → **course cards** (Epic Product Engineer / Epic AI / Epic Web / Epic React / TestingJS) → Discord community CTA → about cá nhân → sitemap footer đầy đủ.
- Metrics show thật từ DB riêng: "**214** blog posts… read **965,479** times by **766,595** people" — con số khiêm tốn nhưng cụ thể nên đáng tin.
- Đáng học: mission statement 1 câu đặt đầu trang; đếm số thật của mình (posts/reads/downloads) thay vì phóng đại; gom offerings thành cards đồng dạng; community CTA rõ (Discord); footer sitemap.

### Site 4 — https://unjs.io (OSS collective — mẫu GẦN NHẤT với ThanhNguyxnOrg)

- Cấu trúc: nav (Packages / Blog / Relations) → hero 2 dòng ("Unleash JavaScript's Potential…") → **"The UnJS Philosophy" 3 trụ cột** (High-quality & Single-Purpose / Collaborative & Welcoming / Consistency & Compatibility, mỗi trụ cột 1 icon + 2 dòng) → **"The UnJS Universe" carousel** (mỗi package 1 card logo → link trang package riêng) → **metrics band 4 số** (63 Packages / 49k Stars / 421m Monthly Downloads / 4k Followers) → footer (Contribute / Discussions / Contact).
- Đối chiếu quy mô (trung thực): họ 63 pkgs–49k stars; ThanhNguyxnOrg hiện tại **16 repos – 10 stars tổng** (tính từ API live §3) → KHÔNG copy metrics band kiểu lớn; thay bằng band khiêm tốn đúng số thật (repos / stars / languages / packages npm).
- Đáng học: philosophy 3 gạch đầu dòng có icon; package grid mỗi item 1 card; metrics band; link Contribute/Discussions thay vì "contact us" corporate; trang `/packages/<name>` riêng cho từng project (site mình có thể link thẳng về GitHub repo thay vì làm trang riêng).

### Site 5 (tham khảo nhanh) — https://leerob.com (Lee Robinson)

- Cấu trúc: bio ngắn → **"Notes"** (beliefs / ai / dx / developer-marketing / docs…) → "Blogs". Không show metrics.
- Đáng học: mục **"Notes/Beliefs"** là nơi chứa philosophy dạng evergreen — site mình nên có 1 trang `/philosophy` tương tự (nội dung đã có sẵn trong `.github/docs/philosophy.md`).

### Tổng hợp điều đáng học cho site này (từ 5 site trên)

1. Hero ≤ 3 dòng + proof-links thật (học antfu, kent, unjs).
2. Philosophy gói trong 3 trụ cột hoặc 1 trang Notes (học unjs, leerob) — dùng lại nội dung `docs/philosophy.md` sẵn có.
3. Projects = grid cards link thẳng repo, homepage chỉ Top 6 (khớp cơ chế AUTO-TOP6 sẵn có trong profile README), full list 1 trang riêng (khớp AUTO-FULL trong `docs/projects.md`).
4. Metrics band CHỈ số thật đếm được (§3): repos / stars / languages / npm packages.
5. Tránh corporate slop: không mission-vision-values sáo, không stock photo, không "contact sales" — thay bằng Contribute/Discussions/issues links.

---

## Phần 3 — Kho metrics auto-sync được cho org site tĩnh (test live bằng curl.exe, không auth, 11/10/2026)

### 3.1. Endpoint nào cho số liệu gì (đã gọi thử, đều 200)

| Endpoint (GET, public, không auth) | Số liệu dùng được cho site | Kết quả test live |
|---|---|---|
| `/orgs/ThanhNguyxnOrg` | name, description, `public_repos: 16`, `followers: 8`, created_at | 200 — đã lấy full (xem §1.1 mục 1) |
| `/orgs/ThanhNguyxnOrg/repos?per_page=100` | Toàn bộ 16 repos 1 request: `stargazers_count`, `forks_count`, `open_issues_count`, `language`, `topics[]`, `description`, `pushed_at`, `license`, `homepage`, `html_url` | 200, `count: 16`, **tổng stars = 10** (blendops 3, lumeo 2, apidex-hub/Snapbooth/PurgeKit/StepDSA/awesome-cert-sherpa 1, còn lại 0) |
| `/repos/{owner}/{repo}/languages` | bytes code mỗi ngôn ngữ → vẽ top-languages tại build-time, không phụ thuộc service thứ 3 | 200 — vd `blendops: {"JavaScript": 38209}` |
| `/repos/{owner}/{repo}/releases?per_page=5` | version mới nhất, số releases → badge/card "latest release" | 200 — vd blendops trả list 3 items |
| `/repos/{owner}/{repo}/contributors?per_page=5` | login + contributions → "top contributors" | 200 — vd blendops: `RealThanhNguyxn 183`, `dependabot[bot] 5` |
| `/repos/{owner}/{repo}/stats/commit_activity` | 52 tuần commit → sparkline activity | **202** (đang compute — code phải retry sau vài giây rồi cache; behavior chuẩn của endpoint stats) |
| `/orgs/ThanhNguyxnOrg/members` | members public | 200 → 2 logins |
| `/rate_limit` | kiểm tra quota, **không tốn quota** | 200 — `limit: 60, remaining: 36` tại thời điểm test |

### 3.2. BẮT BUỘC cần token/CI (không làm được public)

- **Traffic (views/clones/referrers/paths)**: `GET /repos/{o}/{r}/traffic/views` không auth → **401** (test live). Docs chính thức ghi traffic endpoints chỉ "for repositories that you have write access to" (cần token có quyền). Kể cả có token: API chỉ trả **14 ngày gần nhất**, muốn lịch sử phải có CI cron fetch + lưu lại. → Kết luận: site tĩnh public KHÔNG show views/clones trừ khi dựng GitHub Actions workflow dùng token riêng (token phải giữ trong secrets, không bao giờ fetch từ browser).
- `GET /orgs/ThanhNguyxnOrg/members` chỉ liệt kê public membership; members để private thì cần auth — hiện tại cả 2 members đều public nên không vấn đề.

### 3.3. Badge động dùng được cho org (đã test live)

- **shields.io** (docs: https://shields.io/ — "dynamic badges… static badges…"): test `https://img.shields.io/github/stars/ThanhNguyxnOrg/blendops?style=flat-square` → **200**. Patterns dùng được: `github/stars/{o}/{r}`, `github/forks/{o}/{r}`, `github/followers/{org}`, `github/last-commit/{o}/{r}`, `github/license/{o}/{r}`, `github/languages/top/{o}/{r}`. Profile README hiện tại đã dùng `github/followers/ThanhNguyxnOrg` + `github/stars/...` per-repo (nguồn: file local `profile/README.md`, `docs/projects.md`) → tái dùng y nguyên.
- **skillicons.dev**: test `https://skillicons.dev/icons?i=ts,js,py` → **200**. Profile đang dùng `icons?i=ts,js,py,go,rust,powershell,vue,svelte,tauri,docker,nodejs,express,git,githubactions,vscode&perline=8` (nguồn: file local) → tái dùng.
- **github-readme-stats**: test `https://github-readme-stats.vercel.app/api?username=ThanhNguyxnOrg&show_icons=true` → **200**. Lưu ý trung thực: service thiết kế theo từng login (user-oriented); nó render được với login org nhưng số liệu gắn với login đó — **test visual trước khi show**, và phương án bền hơn là tự tính top-languages từ `/languages` (§3.1) rồi render SVG/tĩnh tại build-time.
- Đang dùng sẵn trong profile (tái dùng được, kèm lưu ý uptime bên thứ 3): `capsule-render.vercel.app` (header/footer wave), `komarev.com/ghpvc` (profile views — con số này là views của badge, không phải traffic GitHub thật, không nhầm lẫn), `readme-typing-svg.demolab.com` (nguồn: file local `profile/README.md`).

### 3.4. Rate limit public + cách cache (đã verify cả header lẫn docs)

- Unauthenticated: **60 requests/hour/IP** — verify 2 nguồn: response header live `x-ratelimit-limit: 60` (còn 40 tại thời điểm test) + docs https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api ("The primary rate limit for unauthenticated requests is 60 requests per hour").
- Có auth: PAT **5,000/h**; `GITHUB_TOKEN` trong Actions **1,000/h/repo** (nguồn: cùng trang docs).
- Cách cache cho site tĩnh (khuyến nghị):
  1. **Build-time fetch, không fetch từ browser**: 1 GitHub Actions workflow (cron 1 lần/ngày, theo mẫu auto-update sẵn có `AUTO-TOP6/AUTO-FULL/AUTO-STACK` trong `.github` repo) gọi `GET /orgs/.../repos?per_page=100` (1 req) + `.../languages` × 16 repos (16 req) + org (1 req) ≈ **18 req/lần** — vừa trong cả quota 60/h public lẫn 1,000/h GITHUB_TOKEN.
  2. Gửi `If-None-Match` (ETag) để nhận `304` khi không đổi; commit kết quả thành `data/*.json` trong site repo rồi bake vào HTML lúc build → visitor không tốn quota, không phụ thuộc API uptime.
  3. `stats/commit_activity` (202) thì retry sau ~10s trong workflow rồi cache luôn.
  4. Badge shields/skillicons để client-side `<img>` bình thường (quota tính bên shields, không ăn quota GitHub của mình).

---

## Danh sách nguồn đầy đủ

**GitHub API (response live, không auth, 11/10/2026):**
1. https://api.github.com/orgs/ThanhNguyxnOrg
2. https://api.github.com/orgs/ThanhNguyxnOrg/repos?per_page=100
3. https://api.github.com/orgs/ThanhNguyxnOrg/members
4. https://api.github.com/users/ThanhNguyxn07 (+ `/repos?per_page=100`)
5. https://api.github.com/users/RealThanhNguyxn (+ `/repos?per_page=100`)
6. https://api.github.com/users/ThanhNguyxn (404)
7. https://api.github.com/repos/ThanhNguyxnOrg/blendops/languages|releases|contributors|stats/commit_activity|traffic/views (401)
8. https://api.github.com/rate_limit

**Registry/package (live):**
9. https://www.npmjs.com/~thanhnguyxn (profile: 2 packages)
10. https://registry.npmjs.org/-/v1/search?text=ThanhNguyxn (total: 2)
11. https://registry.npmjs.org/archpulse và https://registry.npmjs.org/production-backend-kit (version/desc/created)
12. https://pypi.org/pypi/ThanhNguyxn/json (404) — âm tính
13. https://crates.io/api/v1/crates?q=ThanhNguyxn&per_page=5 (total: 0) — âm tính

**Pages/profiles (fetch live):**
14. https://huggingface.co/ThanhNguyxn (tồn tại, trống content)
15. https://github.com/ThanhNguyxn/SheerID-Verification-Tool (404 — snippet websearch không verify được)
16. https://thanhnguyxn.github.io/ (404) và https://thanhnguyxnorg.github.io/ (404)
17. https://github.com/ThanhNguyxnOrg (org page đối chiếu members/repos hiển thị)

**Mẫu site (mở + đọc live 11/10/2026):**
18. https://antfu.me
19. https://www.joshwcomeau.com
20. https://kentcdodds.com
21. https://unjs.io
22. https://leerob.com

**Docs chính thức + file local:**
23. https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api (60/h unauth; 5,000/h PAT; 1,000/h GITHUB_TOKEN)
24. https://docs.github.com/en/rest/metrics/traffic (traffic yêu cầu write access)
25. https://shields.io/ (dynamic/static badges)
26. Live-check badge: https://img.shields.io/github/stars/ThanhNguyxnOrg/blendops?style=flat-square (200); https://skillicons.dev/icons?i=ts,js,py (200); https://github-readme-stats.vercel.app/api?username=ThanhNguyxnOrg&show_icons=true (200)
27. File local: `D:\Code\ThanhNguyxnOrg\.github\profile\README.md`, `docs/philosophy.md`, `docs/projects.md`, `docs/stack.md`, `docs/migration.md`

---

## Phần 4 — Census 16 repos + npm + Pages live (chạy 11/10/2026 UTC)

- Nguyên tắc giữ nguyên: CHỈ primary sources. Mỗi claim dưới đây từ response API/registry/HTTP thật gọi ngày 11/10/2026.
- Quota GitHub unauthenticated (60 req/h): sau request repos-list còn `x-ratelimit-remaining: 18`, sau 8 request languages còn `10`. Theo quy tắc remaining < 10 thì DỪNG → đã dừng mọi call GitHub API tiếp theo. Reset quota lúc `2026-10-11T03:45:10Z`.

### 4.1. Bảng per-repo đầy đủ (nguồn: 1 request `GET /orgs/ThanhNguyxnOrg/repos?per_page=100`, 200, count 16)

| Repo | Description (nguyên văn API) | language | License (spdx) | ★ / Forks / Open issues | pushed_at | default_branch | has_pages | homepage (nguyên văn API) |
|---|---|---|---|---|---|---|---|---|
| .github | Organization profile and community health files for ThanhNguyxnOrg | Python | null (None) | 0 / 0 / 0 | 2026-10-11T02:53:49Z | main | false | null |
| apidex-hub | 🌐 A curated collection of awesome free APIs for developers. Categorized, tested daily, and well-documented. Your one-stop resource for public APIs. | TypeScript | MIT | 1 / 1 / 0 | 2026-10-10T06:25:30Z | main | true | https://thanhnguyxnorg.github.io/apidex-hub/ |
| awesome-cert-sherpa | Community-driven IT certification prep — curated resources, 1,590+ original practice questions, anti-dump pledge. AWS, Azure, GCP, CISSP, CCNA, CKA & more. | TypeScript | MIT | 1 / 2 / 0 | 2026-10-09T14:37:53Z | main | true | https://thanhnguyxnorg.github.io/awesome-cert-sherpa/ |
| blendops | AI-native Blender workflow and skill pack for non-Blender users, built around official Blender MCP, Claude Blender Connector, and Blender CLI. | JavaScript | MIT | 3 / 0 / 0 | 2026-09-21T15:15:14Z | main | false | https://github.com/ThanhNguyxnOrg/blendops |
| cogmint | Dark-first control plane for Claude Code orchestration. Visual ops surface for agents, skills, commands, workflows, and plugins. | Vue | MIT | 0 / 0 / 0 | 2026-10-04T23:08:14Z | main | false | https://github.com/ThanhNguyxnOrg/cogmint |
| ForgeHelm | ⚒️ ForgeHelm — A powerful Chrome Extension for bulk GitHub repository management. Archive, delete, transfer, manage topics, change visibility, and more — all in one place. | JavaScript | MIT | 0 / 0 / 0 | 2026-09-27T23:04:40Z | main | false | https://github.com/ThanhNguyxnOrg/ForgeHelm/releases/latest |
| git-account-switcher | ⚡ Fast multi-account Git identity & GitHub CLI switcher. Switch accounts, tokens, commit authors, and noreply emails in 1 second. Zero SSH needed. Works on Windows, macOS, and Linux. | PowerShell | MIT | 0 / 0 / 0 | 2026-10-06T14:57:19Z | master | false | null |
| judgeloom-core | A modern, high-performance competitive programming online judge platform built with Django, Channels, and Celery. | Python | AGPL-3.0 | 0 / 0 / 0 | 2026-10-04T23:05:29Z | master | false | https://github.com/ThanhNguyxnOrg/judgeloom-core |
| lagvex | Open-source game latency reducer & ping booster via WinTun and Go VPS Relay | Go | MIT | 0 / 0 / 0 | 2026-10-10T06:25:27Z | main | false | null |
| LayoutLingua | Preserve-layout and math formula PDF translator for academic research and global literature. | Python | AGPL-3.0 | 0 / 0 / 0 | 2026-10-10T06:57:01Z | main | false | https://github.com/ThanhNguyxnOrg/LayoutLingua#readme |
| Locsight | Blazing-fast codebase health, security, and refactoring hotspot analyzer built with Rust and Tauri v2. | TypeScript | MIT | 0 / 0 / 0 | 2026-10-09T03:14:53Z | main | false | null |
| lumeo | Bilingual captions and live AI dubbing for YouTube. Three tiers, one click: free caption translation, ~5s Standard dub, <1s Realtime dub. | JavaScript | MIT | 2 / 2 / 0 | 2026-10-09T11:03:01Z | main | false | https://thanhnguyxnorg.github.io/lumeo/ |
| PurgeKit | Ultimate developer-focused system uninstaller and deep cleaner for Windows. | Rust | Apache-2.0 | 0 / 0 / 0 | 2026-10-09T03:16:18Z | main | false | null |
| SkillGauge | 🏆 Static auditing engine and leaderboard platform for agentic process instructions using a strict 100-criteria scientific matrix. | TypeScript | null (None) | 0 / 0 / 0 | 2026-10-11T02:53:53Z | main | true | https://thanhnguyxnorg.github.io/SkillGauge/ |
| Snapbooth | Browser photobooth with count-in capture, filters, frames, GIF export, and GitHub Pages | TypeScript | null (None) | 1 / 1 / 0 | 2026-09-21T15:15:29Z | main | true | https://thanhnguyxnorg.github.io/Snapbooth/ |
| StepDSA | Interactive DSA learning platform & visualizer with deterministic time-travel engine and playground. | TypeScript | MIT | 1 / 1 / 0 | 2026-10-02T16:08:27Z | main | true | https://ThanhNguyxnOrg.github.io/StepDSA/ |

- Tổng cộng từ response trên: **stars = 10** (blendops 3, lumeo 2, apidex-hub/awesome-cert-sherpa/Snapbooth/StepDSA 1, còn lại 0 — khớp §3.1), **forks = 7**, **open_issues = 0 toàn org**.
- Topics[] đầy đủ từng repo (nguồn: cùng response repos-list):
  - .github (5): community-health, docs, github, organization, templates
  - apidex-hub (15): api, api-collection, api-directory, api-list, apis, awesome, awesome-list, developer-resources, developer-tools, free, free-api, open-source, public-apis, resources, rest-api
  - awesome-cert-sherpa (13): awesome-list, aws, azure, ccna, certification, cissp, docusaurus, exam-prep, gcp, kubernetes, open-source, security-plus, terraform
  - blendops (15): agent-skills, ai-agents, blender, blender-mcp, claude, claude-code, creative-ai, glb, gltf, product-visualization, react-three-fiber, skills, threejs, web-3d, workflows
  - cogmint (12): agent-orchestration, ai-agents, anthropic, claude, claude-code, dark-theme, dashboard, developer-tools, nuxt, plugin, typescript, vue
  - ForgeHelm (11): bulk-operations, chrome-extension, developer-tools, forgehelm, github, github-api, javascript, manifest-v3, productivity, repository-management, tailwindcss
  - git-account-switcher (8): account-switcher, cross-platform, developer-tools, git, git-identity, github, github-cli, multi-account
  - judgeloom-core (20): atcoder, celery, competitive-programming, django, django-channels, django-ninja, docker, icpc, ioi, judge, mypy, oj, online-judge, postgresql, pydantic, python, redis, rest-api, ruff, websockets
  - lagvex (10): cs2, game-booster, golang, latency-reducer, ping-booster, pubg, split-tunneling, valorant, vpn, wintun
  - LayoutLingua (17): academic-paper, android, cross-platform, deepseek, desktop-app, document-ai, gemini, latex, layout-preservation, math-formulas, multilingual, ocr, pdf, pdf-translation, pdf-translator, python, translation
  - Locsight (9): code-analysis, developer-tools, metrics, react, rust, security-scanner, static-analysis, tauri, typescript
  - lumeo (10): ai-dubbing, chrome-extension, javascript, manifest-v3, realtime, speech-to-text, subtitles, text-to-speech, translation, youtube
  - PurgeKit (10): cleaner, developer-tools, power-user, rust, svelte, tauri, uninstaller, uwp, win32, windows
  - SkillGauge (12): agent-skills, ai-agents, developer-tools, leaderboard, llm-agents, mcp-server, prompt-engineering, prompt-evaluation, prompt-metrics, prompt-optimization, static-analysis, static-auditor
  - Snapbooth (16): boomerang, browser, browser-only, camera, countdown, filters, frames, gif, github-pages, photobooth, privacy-first, qr-code, react, typescript, vite, webcam
  - StepDSA (7): algorithms, data-structures, dsa, education, learning, typescript, visualizer

### 4.2. Languages bytes từng repo (nguồn: `GET /repos/ThanhNguyxnOrg/<repo>/languages`, đều 200)

| Repo | Response languages (bytes, nguyên văn) |
|---|---|
| blendops | JavaScript 38209 |
| lumeo | JavaScript 692421, CSS 76464, HTML 46466, Shell 3747, PowerShell 1528 |
| apidex-hub | TypeScript 105265, Python 68334, JavaScript 17868, CSS 4886, HTML 1682 |
| awesome-cert-sherpa | TypeScript 111404, CSS 6128, HTML 2469, JavaScript 460 |
| Snapbooth | TypeScript 130245, CSS 41242, JavaScript 1621, HTML 932 |
| StepDSA | TypeScript 3018377, JavaScript 26403, CSS 3759, HTML 1128, C++ 754, Python 399 |
| SkillGauge | TypeScript 302588, JavaScript 22567, CSS 19010, Python 5559, Shell 1884, HTML 564, Dart 396 |
| PurgeKit | Rust 332495, Svelte 207788, CSS 2284, Batchfile 1726, JavaScript 1414, TypeScript 953, HTML 835 |

- **CHƯA LẤY ĐƯỢC (hết quota, remaining = 10, dừng theo quy tắc):** languages của 8 repos `.github`, `cogmint`, `ForgeHelm`, `git-account-switcher`, `judgeloom-core`, `lagvex`, `LayoutLingua`, `Locsight`. Bù tạm: trường `language` chính ở §4.1 đã có cho cả 16 (Python/Vue/JavaScript/PowerShell/Python/Go/Python/TypeScript) — đủ để bake bộ lọc Archive theo ngôn ngữ chính; byte-breakdown bổ sung sau khi quota reset (sau 03:45:10Z).
- **CHƯA LẤY ĐƯỢC:** releases của cả 16 repos (`GET .../releases?per_page=1` — 0 request đã gọi). Bằng chứng gián tiếp từ README local (không thay thế API): `blendops/README.md` link tới `releases/tag/v0.7.0-draft`; badge `github/v/release` xuất hiện trong README của blendops, LayoutLingua, Locsight; link `/releases` trong README của Lagvex, PurgeKit, Locsight, LayoutLingua, ForgeHelm(homepage). Kết luận: có release thật ở ít nhất blendops; số còn lại cần gọi API sau reset.

### 4.3. npm — 2 packages publisher `thanhnguyxn` (nguồn: registry + downloads API, số chính xác)

| Package | Latest | Description (nguyên văn registry) | Keywords | repository.url (nguyên văn) | Downloads 30 ngày (2026-09-10→2026-10-09) |
|---|---|---|---|---|---|
| archpulse | 0.5.3 | Living architecture diagrams for modern codebases - auto-generate and maintain draw.io diagrams from your code | architecture, diagram, draw.io, drawio, documentation, code-analysis, dependency-graph, visualization, github-action, developer-tools | git+https://github.com/ThanhNguyxn/ArchPulse.git | **146** (`{"downloads":146,...,"package":"archpulse"}`) |
| production-backend-kit | 1.1.2 | Production-grade backend engineering patterns, checklists & AI adapters | backend, patterns, checklists, api-design, production, engineering, cli, best-practices, ai-tools | git+https://github.com/ThanhNguyxn/backend-engineering-kit.git | **167** (`{"downloads":167,...,"package":"production-backend-kit"}`) |

- Nguồn: `https://registry.npmjs.org/archpulse` (created 2026-01-19T13:17:14.895Z, latest-time 2026-01-20), `https://registry.npmjs.org/production-backend-kit` (created 2026-01-16T05:17:09.263Z, latest-time 2026-01-19), `https://api.npmjs.org/downloads/point/last-month/<pkg>`. Maintainer cả 2: `thanhnguyxn`.
- ⚠️ Trung thực khi bake: `repository.url` cả 2 package trỏ về login `github.com/ThanhNguyxn/...` — login này hiện lookup **404** (§1.2). Site chỉ show version/downloads/keywords, KHÔNG link repo GitHub từ trường này nếu chưa verify.

### 4.4. README local ↔ demo URL thật (nguồn: file `D:\Code\<repo>\README.md` đã đọc + `curl -w "%{http_code}"`)

- Cả 15/15 repo org có checkout local tại `D:\Code\<repo>\` đều **tồn tại README.md** (đã kiểm tra từng file; riêng repo `.github` local nằm ở `D:\Code\ThanhNguyxnOrg\.github`, không áp dụng).
- Demo URL tìm được trong README local:
  - apidex-hub → `https://thanhnguyxnorg.github.io/apidex-hub/` (khớp homepage API)
  - awesome-cert-sherpa → `https://thanhnguyxnorg.github.io/awesome-cert-sherpa/` + subpath `/practice`
  - SkillGauge → `https://thanhnguyxnorg.github.io/SkillGauge/` (README chỉ có 2 URLs, 1 là demo này)
  - Snapbooth → `https://thanhnguyxnorg.github.io/Snapbooth/` (+ badge `GitHub_Pages-live`)
  - StepDSA → `https://ThanhNguyxnOrg.github.io/StepDSA/`
  - 10 repos còn lại (blendops, cogmint, ForgeHelm, git-account-switcher, judgeloom-core, Lagvex, LayoutLingua, Locsight, lumeo, PurgeKit): README **không chứa** demo/github.io/vercel/netlify URL nào (chỉ github.com git-clone, shields, raw.githubusercontent, release links).
- Ma trận Pages live (`https://thanhnguyxnorg.github.io/<repo>/`, HTTP status thật):

| Repo | has_pages (API) | HTTP status | Kết luận |
|---|---|---|---|
| apidex-hub | true | **200** | demo live thật |
| awesome-cert-sherpa | true | **200** | demo live thật (lưu ý: subpath `/practice` fetch trực tiếp → **404**, có thể là SPA route của Docusaurus — cần mở browser kiểm chứng trước khi link `/practice`) |
| SkillGauge | true | **200** | demo live thật |
| Snapbooth | true | **200** | demo live thật |
| StepDSA | true | **200** | demo live thật |
| lumeo | false | **404** | homepage API `.../lumeo/` CHẾT — site không được link demo này; chỉ link repo |
| blendops, cogmint, ForgeHelm, git-account-switcher, judgeloom-core, lagvex, LayoutLingua, Locsight, PurgeKit, .github | false | **404** | không có demo |

### 4.5. Kết luận: số nào bake được vào site (baked data)

1. **Showcase (Top 6, có demo live + stars):** apidex-hub, awesome-cert-sherpa, Snapbooth, StepDSA, SkillGauge (5 demo live 200) + blendops (nhiều stars nhất: 3, languages đã có). Mỗi card: description + topics + ★/forks + top-language + nút Live Demo (5/6) + link repo.
2. **Archive (full 16):** toàn bộ §4.1 bake được — name/description/language/license/stars/forks/issues/pushed_at/branch/has_pages/homepage/topics đều từ 1 response API đã lưu. Lọc theo `language` chính đủ dùng ngay.
3. **Metrics band (số thật):** 16 repos / 10 stars / 7 forks / 0 open issues / 6 primary languages (TypeScript, JavaScript, Python, Rust, Go, Vue, PowerShell — đếm từ trường language) / 2 npm packages / 5 live demos. Tổng downloads npm 30 ngày: 146 + 167 = **313**.
4. **npm section:** 2 packages với version + description + keywords + downloads chính xác (§4.3); không link repository.url (404).
5. **Chưa bake, chờ quota reset:** byte-breakdown languages 8 repos + releases toàn org (danh sách thiếu ở §4.2). Không bịa "latest release" khi chưa có response 200.

### Danh sách nguồn bổ sung (nối tiếp §1–3, live 11/10/2026)

28. https://api.github.com/orgs/ThanhNguyxnOrg/repos?per_page=100 (200, 16 repos — bảng §4.1 + topics + totals stars 10/forks 7/issues 0; `x-ratelimit-remaining: 18` sau call)
29. Languages 200 (8/16): https://api.github.com/repos/ThanhNguyxnOrg/blendops|lumeo|apidex-hub|awesome-cert-sherpa|Snapbooth|StepDSA|SkillGauge|PurgeKit/languages (remaining 17→10, dừng; 8 repos còn lại chưa lấy)
30. Registry: https://registry.npmjs.org/archpulse (0.5.3) và https://registry.npmjs.org/production-backend-kit (1.1.2) — version/desc/keywords/repository/maintainer/created
31. Downloads: https://api.npmjs.org/downloads/point/last-month/archpulse (146) và .../production-backend-kit (167), window 2026-09-10→2026-10-09
32. Pages live-check (`curl -w "%{http_code}"`): 200 = apidex-hub, awesome-cert-sherpa, SkillGauge, Snapbooth, StepDSA; 404 = .github, blendops, cogmint, ForgeHelm, git-account-switcher, judgeloom-core, lagvex, LayoutLingua, Locsight, lumeo, PurgeKit; subpath `awesome-cert-sherpa/practice` → 404
33. File local đã đọc: `D:\Code\apidex-hub|awesome-cert-sherpa|blendops|cogmint|ForgeHelm|git-account-switcher|judgeloom-core|Lagvex|LayoutLingua|Locsight|lumeo|PurgeKit|SkillGauge|Snapbooth|StepDSA\README.md` (15/15 tồn tại; demo URL chỉ có ở 5 repos §4.4)

# Research: Stack cho Org Site tĩnh (GitHub Pages, HTML tĩnh, TypeScript)

- Ngày check: 2026-10-11 (UTC). Tất cả số liệu là response live gọi trong ngày.
- Nguyên tắc: CHỈ primary sources — registry.npmjs.org, api.npmjs.org, github.com (page HTML), docs chính thức, raw.githubusercontent.com repo chính chủ, toolchain local. Mỗi claim kèm nguồn.
- File local đã đọc (không sửa): `GLOSSARY.md`, `docs/research-org-site.md` (Phần 3: site tĩnh + baked data fetch tại build-time bằng workflow cron, output HTML, deploy GitHub Pages).
- Yêu cầu khớp: deploy GitHub Pages + output HTML tĩnh + TypeScript + vừa trending thật vừa hợp việc.

---

## 1. Astro — framework chính

| Mục | Kết quả live 11/10/2026 | Nguồn |
|---|---|---|
| Version mới nhất | **7.3.8** | `GET https://registry.npmjs.org/astro/latest` → `version` |
| GitHub stars | **63,154** (số nhúng trong HTML, làm tròn hiển thị ~63.2k) | `GET https://github.com/withastro/astro` (HTML, `stargazerCount: 63154`) — API `api.github.com` bị rate-limit IP chung lúc check nên dùng HTML page chính chủ thay thế |
| Downloads/tuần | **7,176,501** (window 2026-10-03→2026-10-09) | `GET https://api.npmjs.org/downloads/point/last-week/astro` |
| Static output mặc định | **Có, chính thức**: "By default, Astro pages, routes, and API endpoints will be pre-rendered at build time as static" | https://docs.astro.build/en/guides/on-demand-rendering/ |
| Islands | **Có, capability chính thức**: trang concept "Islands architecture" — "Astro became popular as the first mainstream JavaScript web framework with selective hydration built-in"; component mặc định render ra HTML/CSS và "stripping out all client-side JavaScript automatically", chỉ hydrate khi gắn `client:*` | https://docs.astro.build/en/concepts/islands/ |
| Deploy GitHub Pages | **Có guide + action chính thức**: trang "Deploy your Astro Site to GitHub Pages" — "Astro maintains an official Astro GitHub Action... recommended way", dùng `withastro/action@v6` + `actions/deploy-pages@v5` | https://docs.astro.build/en/guides/deploy/github/ |
| Node engines | `node >= 22.12.0`, `npm >= 9.6.5` | `GET https://registry.npmjs.org/astro/7.3.8` → `engines` |

Khớp việc: site cần HTML tĩnh + baked data (§3 research-org-site: fetch API tại build-time, bake vào HTML) — Astro static-first + `astro build` ra `dist/` là đúng bản chất, không cần server, không hydration thừa.

## 2. Tailwind CSS v4 — styling

| Mục | Kết quả live 11/10/2026 | Nguồn |
|---|---|---|
| Version mới nhất | **4.3.3** | `GET https://registry.npmjs.org/tailwindcss/latest` → `version` |
| GitHub stars | **97,856** | `GET https://github.com/tailwindlabs/tailwindcss` (HTML, `stargazerCount: 97856`) |
| Downloads/tuần | **135,532,035** (2026-10-03→2026-10-09) | `GET https://api.npmjs.org/downloads/point/last-week/tailwindcss` |
| Tương thích Astro qua `@tailwindcss/vite` | **Có, là đường chính thức 2 chiều**: (a) Tailwind có framework guide riêng cho Astro, bước "Configure Vite Plugin" dùng `@tailwindcss/vite`; (b) Astro docs đánh dấu `@astrojs/tailwind` là **Deprecated**: "Tailwind CSS now offers a Vite plugin which is the preferred way to use Tailwind 4 in Astro" | (a) https://tailwindcss.com/docs/installation/framework-guides/astro — (b) https://docs.astro.build/en/guides/integrations-guide/tailwind/ |
| Version plugin | `@tailwindcss/vite` **4.3.3** (khớp core) | `GET https://registry.npmjs.org/@tailwindcss%2Fvite/latest` |

Kết luận: Tailwind v4 + Astro = Vite plugin `@tailwindcss/vite@4.3.3`, KHÔNG dùng `@astrojs/tailwind` (deprecated cho v4).

## 3. GSAP + ScrollTrigger — animation

| Mục | Kết quả live 11/10/2026 | Nguồn |
|---|---|---|
| Version mới nhất | **3.15.0** | `GET https://registry.npmjs.org/gsap/latest` → `version` |
| License registry | `Standard 'no charge' license: https://gsap.com/standard-license` | cùng response registry trên → `license` |
| Free kể cả commercial | **Có, chính thức từ repo GreenSock**: "Thanks to Webflow, GSAP is now **100% FREE** including ALL of the bonus plugins... even for commercial use!" | https://raw.githubusercontent.com/greensock/GSAP/master/README.md (§"GSAP is FREE!") |
| Downloads/tuần | **5,919,624** (2026-10-03→2026-10-09) | `GET https://api.npmjs.org/downloads/point/last-week/gsap` |
| ScrollTrigger | Nằm trong chính package `gsap` (`import ScrollTrigger from "gsap/ScrollTrigger"`), không package/version riêng | cùng README trên (§NPM + §"ScrollTrigger & ScrollSmoother") |
| Dùng được với Astro static/islands | **Có**: GSAP "framework-agnostic", "Zero dependencies", file NPM là ES modules (`import gsap from "gsap"`) → import trực tiếp trong `<script>` của Astro component hoặc trong React island qua `client:*` directive; có package chính chủ `@gsap/react@2.1.2` với hook `useGSAP()` cho React island | cùng README (§"Using React?"); cơ chế `client:*`: https://docs.astro.build/en/guides/framework-components/ |

Khớp việc: site content tĩnh + điểm nhấn scroll animation (hero, metrics band, showcase cards) — GSAP + ScrollTrigger qua 1 island/`client:visible`, phần còn lại giữ 0 JS.

## 4. React 19 — island framework

| Mục | Kết quả live 11/10/2026 | Nguồn |
|---|---|---|
| Version mới nhất | **19.3.0** (`react-dom` và `@types/react` cùng **19.3.0**) | `GET https://registry.npmjs.org/react/latest`, `.../react-dom/latest`, `.../@types%2Freact/latest` |
| GitHub stars | **250,826** | `GET https://github.com/facebook/react` (HTML, `stargazerCount: 250826`) |
| Downloads/tuần | **187,492,785** (2026-10-03→2026-10-09) | `GET https://api.npmjs.org/downloads/point/last-week/react` |
| Làm Astro island được | **Có, chính thức**: integration `@astrojs/react` (latest **7.0.1**) có `peerDependencies` gồm `react: ^17.0.2 \|\| ^18.0.0 \|\| ^19.0.0` (và `react-dom`, `@types/react`, `@types/react-dom` tương ứng) → React 19 được support; islands page liệt kê React trong các framework được hỗ trợ, hydrate theo `client:load` / `client:visible` / `client:idle` | `GET https://registry.npmjs.org/@astrojs%2Freact/7.0.1` → `peerDependencies`; https://docs.astro.build/en/concepts/islands/; https://docs.astro.build/en/guides/framework-components/ |

Khớp việc: chỉ dùng React cho đảo tương tác nhỏ (vd. bộ lọc Archive, mobile nav) qua `client:visible`/`client:idle`; toàn bộ Showcase/Archive/metrics vẫn là Astro component tĩnh 0 JS.

## 5. TypeScript — strict ở mức nào

| Mục | Kết quả live 11/10/2026 | Nguồn |
|---|---|---|
| Version mới nhất | **7.0.2** | `GET https://registry.npmjs.org/typescript/latest` → `version` |
| Downloads/tuần | **306,988,910** (2026-10-03→2026-10-09) | `GET https://api.npmjs.org/downloads/point/last-week/typescript` |
| Astro hỗ trợ strict | **Có, chính thức 3 template**: "Three extensible tsconfig.json templates are included in Astro: `base`, `strict`, and `strictest`... We recommend using `strict` or `strictest` if you plan to write TypeScript in your project", kế thừa qua `"extends": "astro/tsconfigs/strict"` | https://docs.astro.build/en/guides/typescript/ (§"TSConfig templates") |

Khớp việc: dùng `"extends": "astro/tsconfigs/strict"` (đủ cho site content; `strictest` chỉ khi muốn siết tối đa) + `typescript@7.0.2`.

## 6. Bun vs npm local

| Mục | Kết quả live 11/10/2026 | Nguồn |
|---|---|---|
| Bun version mới nhất | **1.4.3** (tag `bun-v1.4.3`; npm package `bun` cũng `1.4.3`) | redirect `https://github.com/oven-sh/bun/releases/latest` → `.../tag/bun-v1.4.3`; `GET https://registry.npmjs.org/bun/latest` |
| Bun stars | **96,185** | `GET https://github.com/oven-sh/bun` (HTML, `stargazerCount: 96185`) |
| Setup-bun chính thức | **Có**: repo `oven-sh/setup-bun` tồn tại (HTTP 200) | `GET https://github.com/oven-sh/setup-bun` → 200 |
| Astro + Bun | **Được support ở 2 mức**: (a) official Astro GitHub Action "scans for a lockfile to detect your preferred package manager (npm, yarn, pnpm, or bun)... commit `bun.lockb`"; (b) docs có recipe "Use Bun with Astro" | (a) https://docs.astro.build/en/guides/deploy/github/ — (b) nav docs https://docs.astro.build/en/install-and-setup/ |
| Toolchain local (máy này) | **npm 12.0.2 + Node v26.3.0; Bun CHƯA cài** (`bun` → CommandNotFound) | chạy trực tiếp `npm --version`, `node --version`, `bun --version` ngày 11/10/2026 |
| Engines Astro 7.3.8 | cần `node >= 22.12.0`, `npm >= 9.6.5` → toolchain local **đạt** | registry astro/7.3.8 `engines` (§1) |

Khớp việc: **giữ npm làm primary** (đã có local, action chính thức default Node 24 + autodetect lockfile; thêm Bun nghĩa là thêm 1 lockfile phải đồng bộ). Bun chỉ nên vào khi cần tăng tốc CI qua `oven-sh/setup-bun` — không bắt buộc cho site này. Lưu ý trung thực: official action build trên Node (mặc định 24), Bun ở đây là package manager, không phải runtime thay Node trên Pages.

## 7. Đối thủ loại trừ nhanh

- **Next.js `output: 'export'` thua Astro cho site content tĩnh**: docs chính thức liệt kê 13 nhóm tính năng **not supported** khi static export — dynamic routes không `generateStaticParams()`, route handlers dùng Request, cookies, rewrites/redirects/headers, ISR, Image Optimization với default loader, Draft Mode, Server Actions, Intercepting Routes... (nguồn: https://nextjs.org/docs/app/guides/static-exports, docs v16.4.0 cập nhật 2026-08-09). Thêm điểm trừ bản chất: Next.js vẫn ship React runtime + hydration toàn trang theo mô hình SPA-chia-nhỏ, trong khi Astro render HTML tĩnh 0 JS mặc định và chỉ hydrate đảo được đánh dấu (nguồn: https://docs.astro.build/en/concepts/islands/). Với site chỉ cần trang tĩnh + baked data + deploy Pages, Next.js là mang framework server-full đi disable dần tính năng — sai tool cho việc.

---

## Kết luận — stack khuyến nghị (ghim version 2026-10-11)

| Lớp | Chọn | Version ghim |
|---|---|---|
| SSG + islands | `astro` | 7.3.8 |
| Island UI | `react` + `react-dom` + `@astrojs/react` | 19.3.0 / 19.3.0 / 7.0.1 |
| Types (React island) | `@types/react` (+ `@types/react-dom` theo 19.x khi cần) | 19.3.0 |
| CSS | `tailwindcss` + `@tailwindcss/vite` | 4.3.3 / 4.3.3 |
| Animation | `gsap` (gồm ScrollTrigger; `@gsap/react` optional cho island) | 3.15.0 (2.1.2) |
| Ngôn ngữ | `typescript` + `"extends": "astro/tsconfigs/strict"` | 7.0.2 |
| Package manager / CI | **npm** (local 12.0.2 đã đạt engines); deploy bằng `withastro/action@v6` theo guide Pages chính thức | — |

Lệnh cài (chạy trong thư mục site repo, sau `npm init` nếu cần):

```bash
npm install astro@7.3.8
npm install react@19.3.0 react-dom@19.3.0 @astrojs/react@7.0.1 @types/react@19.3.0
npm install tailwindcss@4.3.3 @tailwindcss/vite@4.3.3
npm install gsap@3.15.0
npm install -D typescript@7.0.2
npx astro add react
```

Lưu ý khi dựng:

1. Tailwind v4 đi qua Vite plugin (`@tailwindcss/vite` trong `astro.config`), không dùng `@astrojs/tailwind` (deprecated cho v4).
2. `tsconfig.json` kế thừa `"extends": "astro/tsconfigs/strict"`.
3. GSAP chỉ load trong island/`client:visible` (hero/metrics/showcase hiệu ứng scroll); trang còn lại giữ 0 JS theo đúng Islands.
4. Baked data (§3 research-org-site) fetch trong workflow cron + bake lúc `astro build`, không fetch từ browser — khớp static-first của Astro.
5. Deploy: `withastro/action@v6` + `actions/deploy-pages@v5`, `site` trỏ `https://thanhnguyxnorg.github.io`, commit `package-lock.json` để action autodetect npm.
6. Không cần Bun (chưa cài local, không bắt buộc); nếu sau này muốn tăng tốc CI thì thêm `oven-sh/setup-bun` + `bun.lockb`.

---

## Danh sách nguồn đầy đủ (tất cả live 11/10/2026 UTC)

**Registry (version/engines/peerDeps/license):**
1. `https://registry.npmjs.org/astro/latest` → 7.3.8; `.../astro/7.3.8` → engines `node >= 22.12.0`, `npm >= 9.6.5`
2. `https://registry.npmjs.org/tailwindcss/latest` → 4.3.3; `.../@tailwindcss%2Fvite/latest` → 4.3.3; `.../@astrojs%2Freact/7.0.1` → peerDeps React `^17/18/19`, `@astrojs/react` latest 7.0.1
3. `https://registry.npmjs.org/gsap/latest` → 3.15.0 + license `Standard 'no charge'`
4. `https://registry.npmjs.org/react/latest` + `react-dom/latest` + `@types/react/latest` → 19.3.0; `.../typescript/latest` → 7.0.2; `.../bun/latest` → 1.4.3

**Downloads (api.npmjs.org, window 2026-10-03→2026-10-09):**
5. `/downloads/point/last-week/astro` → 7,176,501; `tailwindcss` → 135,532,035; `gsap` → 5,919,624; `react` → 187,492,785; `typescript` → 306,988,910

**GitHub pages (HTML chính chủ, do api.github.com rate-limit IP chung lúc check):**
6. `https://github.com/withastro/astro` → stargazerCount 63154; `tailwindlabs/tailwindcss` → 97856; `facebook/react` → 250826; `oven-sh/bun` → 96185
7. `https://github.com/oven-sh/bun/releases/latest` → redirect tag `bun-v1.4.3`; `https://github.com/oven-sh/setup-bun` → HTTP 200
8. `https://raw.githubusercontent.com/greensock/GSAP/master/README.md` → "100% FREE... even for commercial use" (Webflow), framework-agnostic/zero-deps/ESM, `@gsap/react` + `useGSAP()`

**Docs chính thức:**
9. https://docs.astro.build/en/concepts/islands/ (static-mặc-định + selective hydration + hỗ trợ React)
10. https://docs.astro.build/en/guides/on-demand-rendering/ ("By default... pre-rendered at build time as static")
11. https://docs.astro.build/en/guides/deploy/github/ (action `withastro/action@v6`, autodetect npm/yarn/pnpm/bun lockfile)
12. https://docs.astro.build/en/guides/integrations-guide/tailwind/ (`@astrojs/tailwind` Deprecated, Vite plugin là preferred cho Tailwind 4)
13. https://tailwindcss.com/docs/installation/framework-guides/astro (guide Astro dùng `@tailwindcss/vite`)
14. https://docs.astro.build/en/guides/framework-components/ (`client:load`/`client:visible`...)
15. https://docs.astro.build/en/guides/typescript/ (templates `base`/`strict`/`strictest`, khuyên `strict`/`strictest`)
16. https://nextjs.org/docs/app/guides/static-exports (13 nhóm unsupported + deploy Pages template)

**Local:**
17. `npm --version` → 12.0.2; `node --version` → v26.3.0; `bun --version` → chưa cài; file đã đọc `GLOSSARY.md`, `docs/research-org-site.md`.

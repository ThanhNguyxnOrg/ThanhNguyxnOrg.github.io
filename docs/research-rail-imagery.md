# Research: Ảnh thật cho 2 side-rail trang trí ở `src/pages/about.astro` (Migration + Stack)

> **Vị trí file này:** `docs/research-rail-imagery.md` **trong repo web** (`ThanhNguyxnOrg.github.io/docs/`).
> Lý do đặt ở đây: repo web đã có quy ước ghi chú research tại `docs/` với tiền tố `research-*`
> (14 file hiện có: `docs/research-decor-fx.md`, `research-decor2/3/4-fx.md`, `research-card-fx.md`,
> `research-ecosystem-fx.md`, `research-ecosystem2-fx.md`, `research-below-fold-fx.md`,
> `research-showcase-fx.md`, `research-visual-fx.md`, `research-patterns.md`, `research-solar.md`,
> `research-prose-fx.md`, `research-fx4.md` — liệt kê bằng `read docs/` ngày 2026-10-13).
> Thư mục còn lại (`D:\Code\ThanhNguyxnOrg\docs\research\`) dùng quy ước khác
> (`YYYY-MM-DD-*.md`, ví dụ `2026-10-11-repo-social-image-research.md`) và chứa research cấp org,
> không phải research visual của site — nên không đặt ở đó.
> Phạm vi file này: **chỉ research (đọc + ghi 1 file), KHÔNG sửa code sản phẩm**.
> Phương pháp: mọi claim dưới đây đều từ file local đã đọc trực tiếp trong phiên 2026-10-13,
> mỗi claim kèm nguồn `đường-dẫn:đồng`. Số đo kích thước/dung lượng đo bằng `python`
> (`os.path.getsize` + `PIL.Image.open().size`) trên cây `public/` cùng ngày.

## 0. Hiện trạng 2 rail cần thay

- Section Migration: `src/pages/about.astro:30-51` — cột text `lg:col-span-7` + rail
  `src/pages/about.astro:40-49`: `aside aria-hidden="true" class="hidden lg:col-span-5 lg:block"`,
  bên trong `.side-rail.card-ticks.sticky.top-32` gồm plate "Migration" (`about.astro:42`),
  glyph trừu tượng `→` (`about.astro:43`), meter "A second life" (`about.astro:44-47).
- Section Stack: `src/pages/about.astro:52-83` — rail `about.astro:72-81` tương tự,
  glyph trừu tượng `'{…}'` (`about.astro:75`), meter "What ships" (`about.astro:76-79`).
- Khung rail (CSS): `src/styles/tokens.css:467-482` — flex column, `min-height: 34rem`,
  `overflow: hidden`, nền grid gold 24px, viền + glow gold; ghost giữa
  (`tokens.css:494-503`, `clamp(7rem, 9vw, 11rem)`, stroke gold mờ) là chỗ glyph `→` / `'{…}'`
  đang chiếm — đây chính là slot sẽ đặt ảnh thật.
- Hệ quả ràng buộc: rail **chỉ hiện ở `lg+`** (`hidden … lg:block`, `about.astro:40,72`),
  `sticky top-32`, portrait hẹp (~`col-span-5` ≈ 380–480px rộng, tối thiểu 544px cao),
  và toàn bộ `aside` đã `aria-hidden="true"` — ảnh thay vào là **decorative thuần**,
  đúng chỗ cho `alt=""` + giữ nguyên `aria-hidden` (chi tiết §4).

## 1. Kiểm kê ảnh có sẵn trong `public/`

### 1.1. `public/brand/` — 16 board dự án (ứng viên reuse)

Tất cả PNG đều đúng `1024×512` (tỉ lệ 2:1, khớp badge `1280×640` mà
`src/site/ProjectBits.tsx:40-43` in lên card — badge là label định dạng, không phải kích thước file).
Đo ngày 2026-10-13:

| File | Kích thước | Dung lượng |
|---|---|---|
| `public/brand/apidex-hub.png` | 1024×512 PNG/RGBA | 163.6 KB |
| `public/brand/awesome-cert-sherpa.png` | 1024×512 PNG/RGBA | 152.2 KB |
| `public/brand/blendops.png` | 1024×512 PNG/RGBA | 196.6 KB |
| `public/brand/cogmint.png` | 1024×512 PNG/RGBA | 127.2 KB |
| `public/brand/forgehelm.png` | 1024×512 PNG/RGBA | 251.1 KB |
| `public/brand/git-account-switcher.png` | 1024×512 PNG/RGBA | 155.7 KB |
| `public/brand/judgeloom-core.png` | 1024×512 PNG/RGBA | 144.5 KB |
| `public/brand/lagvex.png` | 1024×512 PNG/RGBA | 198.4 KB |
| `public/brand/layoutlingua.png` | 1024×512 PNG/RGBA | 245.0 KB |
| `public/brand/locsight.png` | 1024×512 PNG/RGBA | 138.6 KB |
| `public/brand/lumeo.png` | 1024×512 PNG/RGBA | 123.8 KB |
| `public/brand/org-github.jpg` | **1024×572 JPEG/RGB** (lệch 2:1, gần 16:9) | **80.3 KB** (nhẹ nhất) |
| `public/brand/purgekit.png` | 1024×512 PNG/RGBA | 135.0 KB |
| `public/brand/skillgauge.png` | 1024×512 PNG/RGBA | **487.9 KB** (nặng nhất) |
| `public/brand/snapbooth.png` | 1024×512 PNG/RGBA | 148.5 KB |
| `public/brand/stepdsa.png` | 1024×512 PNG/RGBA | 152.9 KB |

### 1.2. `public/logos/` — 15 logo (SVG + PNG nhỏ, không hợp làm ảnh rail)

`apidex-hub.svg` 0.9 KB · `awesome-cert-sherpa.png` 200×200 46.3 KB ·
`blendops.png` 163×189 27.5 KB · `cogmint.svg` 1.7 KB · `forgehelm.png` 128×128 4.4 KB ·
`git-account-switcher.png` 237×156 49.3 KB · `judgeloom-core.png` 256×256 55.2 KB ·
`lagvex.png` 232×256 115.0 KB · `layoutlingua.png` 256×256 100.5 KB ·
`locsight.png` 256×256 54.6 KB · `lumeo.png` 108×126 4.4 KB · `purgekit.png` 148×256 31.4 KB ·
`skillgauge.png` 219×256 88.8 KB · `snapbooth.svg` 1.0 KB · `stepdsa.svg` 1.8 KB.
Logo là mark nhỏ/icon — phóng lên rail portrait sẽ vỡ hoặc lọt thỏm; không đề xuất làm ảnh rail
(đúng vai trò hiện tại của chúng: `src/content/repos/*.md` dùng `logo:` cho Explorer thumb,
`image:` cho board lớn — kiểm kê §1.4).

### 1.3. `public/` gốc — logo org + icons (không phải ảnh nội dung)

`public/logo.png` 645×773 PNG/RGBA **636.4 KB** (artwork logo org, dùng decorative ở
`src/components/Logo.tsx:9-16` với `alt=""`) ·
`public/apple-touch-icon.png` 180×180 55.1 KB · `public/favicon.ico` 32×32 3.1 KB ·
`public/robots.txt`, `public/sitemap.xml` (không phải ảnh).
`logo.png` quá nặng (gấp ~8 lần board JPEG) và là mark vuông-dọc, không hợp crop rail.

### 1.4. Cách các entry dùng 2 tầng ảnh (ngữ cảnh reuse)

16/16 entry `src/content/repos/*.md` khai `image:` (15× `/brand/*.png` + 1× `/logo.png`
cho `github.md` — `src/content/repos/github.md:6`, `src/content/repos/skillgauge.md:5-6` mẫu);
15/16 entry khai thêm `logo:` trỏ `/logos/*` (đếm bằng script, khớp ngưỡng test
`tests/brand-images.test.ts:41` `logos >= 15` và `checked >= 16` ở `brand-images.test.ts:17`).

### 1.5. Hợp chủ đề từng rail — đánh giá trung thực

- **Rail Migration ("A second life"):** chỉ có **1 file hợp chủ đề thật sự**:
  `public/brand/org-github.jpg` — đây là board fallback của Journey,
  section viết về "second lives" (`src/sections/Journey.tsx:16,55-57,65:
  "Second lives… nothing here is invented") + `tests/journey-panel.test.ts:14-15`
  pin fallback này. Nội dung là ảnh chụp org board (JPEG 1024×572) nên đặt cạnh prose
  migration (`src/content/docs/migration.md:6-16`: "restoring… a second life") là khớp nghĩa nhất.
  Các board dự án còn lại là artwork từng repo, gán vào rail Migration sẽ thành trang trí lạc đề.
- **Rail Stack ("What ships" / live):** **không có file sẵn nào hợp chủ đề.**
  `src/content/docs/stack.md:6` ("what the organization actually ships") + thanh language
  đếm live (`about.astro:57-67`) là dữ liệu verified — không tồn tại ảnh chụp terminal/editor/workspace
  nào trong `public/` để minh họa. Reuse board dự án bất kỳ ở đây là gán nhãn sai ngữ nghĩa
  (dù rail `aria-hidden`, mắt người vẫn đọc ảnh như minh họa cho "stack").
- Kết luận §1: kho local chỉ giải được **1/2 rail** (Migration ← `org-github.jpg`).
  Rail Stack bắt buộc cần ảnh mới (xem phương án B, §3).

## 2. Pipeline ảnh của site (đọc 5 file)

- **Render pattern — `src/site/ProjectBits.tsx:10-55` (`ProjectVisual`):**
  có `image` → `<img src loading="lazy" alt="" class="absolute inset-0 size-full object-cover">`
  (`ProjectBits.tsx:29-37`) + scrim gradient (`:38`) + badge format (`:39-43`); không có →
  glyph generative (`:45-47`). Comment chủ ý ở `ProjectBits.tsx:5-9`:
  **"no fake screenshots, no stock imagery posing as UI"** — rào ethos trực tiếp cho mọi ảnh mới.
  Rail có thể copy nguyên pattern này (absolute cover + `loading="lazy"` + `alt=""`).
- **Validate file — `src/lib/projects.ts:29` + `:67-74`:** `image` phải `startsWith("/")`,
  `joinProjects` `readFileSync("public" + image)` và throw nếu thiếu. Lưu ý: validator này chỉ chạy
  cho entry repos qua `joinProjects`, **rail hard-code trong `about.astro` không đi qua đó** —
  nếu gắn ảnh rail bằng string literal thì phải tự giữ kỷ luật tương đương
  (test `tests/brand-images.test.ts:6-18` cũng chỉ quét `src/content/repos/*.md`, không quét `about.astro`).
- **Config ảnh — `astro.config.mjs:1-11`:** KHÔNG có `image.service`, KHÔNG `remotePatterns`,
  KHÔNG `domains` — site **không dùng Astro Image optimization** (`astro:assets`/`getImage`
  không xuất hiện ở `src/` theo grep §2). Mọi ảnh là file tĩnh `public/` + `<img>` thường,
  nên tác giả phải **tự resize/nén trước khi commit** — không có pipeline nào cứu ảnh 2 MB.
- **CSP — `src/layouts/Layout.astro:1-83`:** KHÔNG có `<meta http-equiv="Content-Security-Policy">`,
  KHÔNG header CSP nào trong `src/` (grep `Content-Security-Policy|remotePatterns|…` chỉ trúng
  `sharp` trong `package-lock.json` và chữ "verified/unverified" ở `scripts/sync.ts:8-11`).
  → Kỹ thuật không chặn ảnh remote, nhưng đó không phải đèn xanh (xem §3C).
- **Tiền lệ dùng ảnh local khác:**
  Featured cards `aspect-[2/1] + ProjectVisual` (`src/sections/Featured.tsx:66,79,105`);
  Journey panel `<img loading="lazy" alt="" class="aspect-[2/1] w-full object-cover">`
  (`src/sections/Journey.tsx:79`); Logo decorative `alt=""` (`src/components/Logo.tsx:9-16`).
  Tiền lệ remote duy nhất: avatar GitHub `https://github.com/${slug}.png?size=64` 64px kèm
  `onError` ẩn ảnh (`src/sections/Ecosystem.tsx:53-61`) — tức remote chỉ được chấp nhận ở cỡ
  thumbnail có graceful fallback, không phải ảnh nội dung chính.
- **Phát hiện phụ (cần fix trước/kèm khi đụng tới ảnh):**
  `src/layouts/Layout.astro:25-27` khai `og:image → /og-image.png` nhưng file này
  **không tồn tại** trong `public/` lẫn `dist/` (kiểm tra `os.path.exists` 2026-10-13: cả hai `False`).
  Mọi ảnh rail mới nên đi kèm test tồn tại file để không lặp lại lỗi này.

## 3. Bốn phương án + ma trận ưu–nhược

### A. Reuse ảnh local có sẵn (Migration ← `org-github.jpg`; Stack ← giữ glyph hoặc reuse tạm)

- Build offline: **tốt nhất** — file đã có trong `public/`, copy qua `dist/` nguyên vẹn
  (bằng chứng `dist/brand/*` tồn tại sau build); 0 byte mới, 0 dependency mới.
- Dung lượng: +0 KB; `org-github.jpg` chỉ 80.3 KB, nhẹ nhất kho.
- Bản quyền: an toàn tuyệt đối (asset của org).
- Ethos "verified data, no invented claims" (`scripts/sync.ts:8-11` "never invented values";
  `Journey.tsx:65` "nothing here is invented"; `ProjectBits.tsx:5-9` "no stock posing as UI"):
  an toàn — đều là artifact thật của org, rail lại `aria-hidden` nên không tạo claim mới.
- Kỹ thuật: JPEG 1024×572 `object-cover` vào rail portrait sẽ **crop 2 bên mạnh** (rail hẹp/cao,
  board ngang 2:1) — chấp nhận được cho decorative nhưng mất bố cục board; trùng ảnh với
  Journey panel (`Journey.tsx:56-57` dùng cùng file làm fallback) → 1 ảnh xuất hiện 2 lần trên site.
  Rail Stack **không có ứng viên xứng đáng** (§1.5) — phương án này thực chất chỉ giải 1/2 rail.
- Khuyến nghị: dùng cho Migration ngay; Stack không nên reuse bừa.

### B. User cung cấp ảnh chụp thật (workspace / terminal / code / sự kiện) — KHUYẾN NGHỊ cho rail Stack (và thay cả Migration nếu có ảnh hợp hơn)

- Build offline: tốt — ảnh mới vào `public/` (gợi ý `public/about/rail-migration.jpg`,
  `public/about/rail-stack.jpg`), build tĩnh phục vụ như mọi board hiện có.
- Dung lượng: kiểm soát được nếu tuân thủ §4 (resize ≤1024px cạnh dài, JPEG ~70–100 KB như
  `org-github.jpg` 80.3 KB là benchmark; tránh lặp vết `skillgauge.png` 487.9 KB và
  `logo.png` 636.4 KB). Vì không có pipeline optimize (`astro.config.mjs:1-11` trống),
  **bước nén là trách nhiệm thủ công** khi chuẩn bị file.
- Bản quyền: an toàn (ảnh tự chụp/screenshot của user).
- Ethos: **khớp nhất** — ảnh thật của workspace/stack thật, đúng tinh thần verified;
  rail `aria-hidden` nên càng không rủi ro claim sai.
- Kỹ thuật: chụp/chọn ảnh **dọc hoặc vuông** để ít bị crop trong rail portrait
  (`tokens.css:467-482` `min-height: 34rem` + `overflow: hidden`); đặt `loading="lazy"`,
  `alt=""`, giữ `aside aria-hidden="true"` (`about.astro:40,72`); nên bổ sung test tồn tại file
  kiểu `brand-images.test.ts:6-18` cho 2 file mới (hiện test không quét `about.astro` — §2).
- Nhược duy nhất: cần user hành động (chụp/chọn + gửi ảnh).

### C. Ảnh stock remote (Unsplash/Pexels hotlink hoặc URL ngoài)

- Build offline: **kém** — build xong nhưng ảnh phụ thuộc mạng lúc xem; GitHub Pages + mạng chậm
  = rail trống/méo (khung `min-height: 34rem` còn đó, ảnh mất). Không có `onError` fallback nào
  theo pattern `Ecosystem.tsx:58-60` nếu implement cẩu thả.
- Dung lượng repo: +0 KB, nhưng trả giá bằng request runtime ngoài + layout shift nếu thiếu
  `width/height` (Logo làm đúng ở `Logo.tsx:12-13`, các `<img>` board hiện tại không set — chớ lặp lại).
- Bản quyền: **rủi ro cao nhất** — mỗi stock cần check license/attribution; hotlink còn vi phạm
  ToS một số CDN.
- Ethos: **vi phạm tinh thần** — ảnh stock trang trí cạnh prose "where I started / what I rebuilt"
  (`migration.md:30-34`) và "actually ships" (`stack.md:6`) dễ bị đọc như minh họa thật cho
  workspace/stack (đúng điều `ProjectBits.tsx:5-9` cấm: "no stock imagery posing as UI"),
  dù `aria-hidden` giảm nhẹ về mặt AT.
- Kỹ thuật: không bị CSP chặn (§2 — không có CSP), nhưng thêm origin thứ ba vào page,
  mất `referrerpolicy` kiểm soát; muốn "an toàn" phải download về local — lúc đó nó thành phương án B
  phiên bản stock (vẫn còn vấn đề ethos + license). **Không khuyến nghị.**

### D. Ảnh AI-generated

- Build offline: tốt nếu lưu local (như B), kém nếu dùng URL remote (như C).
- Dung lượng: kiểm soát được như B.
- Bản quyền/provenance: **mờ** — quyền thương mại tùy generator/license, không có provenance
  để đối chiếu; site vốn "every number verified" (`Ecosystem.tsx:30`) và "never invented"
  (`sync.ts:11`) — pixel bịa đặt là mâu thuẫn trực tiếp với ethos này.
- Ethos: **vi phạm rõ nhất** — user yêu cầu "ẢNH THẬT"; ảnh AI đặt cạnh prose về hành trình thật
  (`migration.md`) là invented claim bằng hình ảnh, tệ hơn stock ở chỗ không thể ghi nguồn thật.
- Kỹ thuật: như B. **Không khuyến nghị** trừ khi đổi scope thành "minh họa trừu tượng trang trí"
  (lúc đó glyph hiện tại đã đạt yêu cầu với 0 KB — xem `tokens.css:494-503`).

### Ma trận tóm tắt

| Tiêu chí | A. Reuse local | B. Ảnh user (khuyến nghị) | C. Stock remote | D. AI-generated |
|---|---|---|---|---|
| Build offline | ✅ tốt nhất | ✅ tốt | ❌ phụ thuộc mạng | ⚠️ nếu lưu local |
| Dung lượng | ✅ +0 KB | ✅ nếu nén (§4) | ✅ repo / ❌ runtime | ✅ nếu nén |
| Bản quyền | ✅ org asset | ✅ tự sở hữu | ❌ license/hotlink | ❌ provenance mờ |
| Ethos verified/no-invented | ✅ | ✅ khớp nhất | ❌ posing-as-real | ❌❌ invented pixels |
| Đúng "ảnh thật" user muốn | ⚠️ chỉ Migration | ✅ cả 2 rail | ⚠️ thật-nhưng-lạc | ❌ không phải thật |
| Rủi ro kỹ thuật | crop ngang→dọc, trùng Journey | cần test file mới | flash/fallback, CLS | như B + rủi ro niềm tin |

## 4. Ràng buộc kỹ thuật bắt buộc khi implement (cho phase build sau)

1. **Decorative + `aria-hidden` giữ nguyên:** giữ `aria-hidden="true"` trên cả 2 `aside`
   (`about.astro:40,72`), ảnh dùng `alt=""` + `loading="lazy"` theo đúng pattern
   `ProjectBits.tsx:29-32` và `Journey.tsx:79`. Không thêm caption/figure có chữ —
   chữ trong rail hiện là plate/meter trang trí (`about.astro:42,44-47,73,76-79`).
2. **Định dạng/vị trí:** file mới vào `public/` (gợi ý `public/about/*.jpg`), path tuyệt đối
   `/…` theo schema `projects.ts:29`; test `perf-budget.test.ts:12-16` chỉ quét
   `public/logos` + `public/brand` với glob `png|jpg|jpeg` — nếu đặt ở `public/about/`
   thì **mở rộng test quét thêm**, và lưu ý test `pngWidth` (`perf-budget.test.ts:6-10`)
   **bỏ qua JPEG** (`return null`) nên JPEG cần review tay.
3. **Ngân sách kích thước (từ tiền lệ + test):** brand ≤1024px cạnh dài
   (`perf-budget.test.ts:24`), benchmark tốt `org-github.jpg` 1024×572/80.3 KB;
   giữ mỗi rail **< ~200 KB**, tránh vết `skillgauge.png` 487.9 KB / `logo.png` 636.4 KB.
   Rail là portrait (`min-height: 34rem`, `overflow: hidden`, `tokens.css:467-482`) nên
   asset dọc/vuông (gợi ý ~768×1024 JPEG) crop ít hơn hẳn board ngang 1024×512.
4. **Không конфиг thêm:** `astro.config.mjs:1-11` không có image service — dùng `<img>` thường,
   `object-cover`, `loading="lazy"`; không cần `remotePatterns`/CSP mới (không có CSP — §2).
5. **Đừng lặp lỗi `og-image`:** kèm test tồn tại file cho ảnh rail mới (pattern
   `brand-images.test.ts:6-18`), vì tiền lệ `Layout.astro:25` trỏ `/og-image.png` không tồn tại (§2).

## 5. Quyết định build (ghi sau implement, commit `58083c4`)

- **Migration rail** theo đúng phương án A: `/brand/org-github.jpg` (80.3 KB).
- **Stack rail chệch khỏi §1.5/§3 (ghi nhận có chủ ý):** dùng `/brand/cogmint.png`
  (127.2 KB) thay vì chờ ảnh user, vì user duyệt "làm đi" mà không gửi ảnh. Lý do chấp nhận:
  board vẽ pipeline SESSION → AGENTS → SKILLS → SHIP, đọc được như minh họa trừu tượng cho
  "What ships"; caption trong rail ghi đúng tên board ("Cogmint pipeline board") nên không phát
  sinh claim sai; `aside` giữ `aria-hidden` + `alt=""` nên không giấu thông tin khỏi AT.
  Khi nào có ảnh workspace của user, thay 1 dòng `src` ở `about.astro` là xong.
- **Chệch khỏi §4.1 (có chủ ý):** có thêm caption chữ trong rail (plate + `side-rail-cap`).
  Caption chỉ đặt tên thứ đang hiển thị, nằm trong `aside aria-hidden` nên không tạo nội dung
  mới cho AT.
- Thực đo hiệu năng: 2 ảnh tổng ~207 KB, `loading="lazy"`, chỉ fetch ở breakpoint `lg`.

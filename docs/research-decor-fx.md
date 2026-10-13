# Research: Đồ decor tĩnh cho section DƯỚI hero (đợt 5 — pure decor, 0 số liệu mới)

> Context site áp dụng: Astro static 1 trang, nền `#080b14`, accent gold `#f59e0b`/`#fcd34d`, font Space Grotesk / Inter / JetBrains Mono, Tailwind v4, GSAP. Hero đã chốt. Đợt 4 (`docs/research-below-fold-fx.md`) đã có 9 hiệu ứng — user vẫn thấy thiếu decor nên đợt này chỉ thêm đồ **thuần trang trí, CSS-only, tĩnh sẵn**, không thêm số liệu mới, không thêm motion loop mới.
> Quy tắc file này: CHỈ primary sources (trang mở trực tiếp bằng fetch ngày 2026-10-11 trong phiên này, docs chính thức). Mỗi claim kèm URL nguồn ngay sau câu.
> Không trùng: `docs/research-patterns.md` (starfield A/B/C, magnetic, spotlight, copy, status-pill, divider eyebrow/Fig/timestamp, footer 3 mẫu), `docs/research-solar.md` (orbit `svgOrigin`, counter-rotation, pause 2.2.2, target 24px, contrast label), `docs/research-visual-fx.md` (gradient keyword, underline offset, pulse-dot, tabular-nums, reveal-once, scroll-margin + content-visibility), `docs/research-showcase-fx.md` (marquee, tilt, progress bar, cursor glow, gradient border, noise, count-up, timeline beam, lamp), `docs/research-below-fold-fx.md` (§1 language-bar, §2 stat chips, §3 sparkline, §4 avatar stack, §5 pointer-highlight + số nền, §6 meteor divider, §7 skeleton/empty/counts, §8 install-command, §9 sparkles CTA), spec `docs/superpowers/specs/2026-10-11-showcase-fx-design.md`, `src/styles/tokens.css` (đã có `bg-blueprint` 48px, `bg-aurora`, `text-gradient-gold`, `tabular`, `marquee-track`, `border-gold-hover`, `lamp-cone`, `section-glow`, `noise-overlay`, `focus-ring`, `::selection` gold, `:focus-visible` gold), `src/sections/Featured.tsx` (TiltCard + border-gold-hover + ProjectVisual), `MetricsBand.tsx` (CountUp), `Philosophy.tsx` (4 nguyên tắc text-only), `Journey.tsx` (TimelineBeam), `Explorer.tsx` (filter sidebar + EmptyState SearchX), `Ecosystem.tsx` (numbered rows 01… + ArrowUpRight), `CTA.tsx` (GlowSection + 3 buttons).
> Hiện trạng code đã đọc (ngày 2026-10-11, toàn bộ file kể trên): grep toàn `src/` xác nhận **chưa tồn tại** `::first-letter`, `::marker`, `drop-cap`, `watermark`, `corner-tick`, `<kbd>`, `double-rule`, `text-stroke` — 10 món dưới đây đều mới thật.

## 0. Phương pháp, giới hạn quan sát và log fetch

- Tất cả URL §1–§10 được **mở trực tiếp bằng fetch ngày 2026-10-11**, không viết theo trí nhớ.
- **0 URL lỗi/404 trong phiên này.** Không mở lại Linear/Raycast/Dub/Cal/OpenStatus/TypeHero trong phiên này nên file này **không claim** site production nào dùng pattern nào — lineage duy nhất là demo live Aceternity + docs chính thức (MDN, Tailwind, shadcn).
- Giới hạn công cụ: fetch trả về nội dung/cấu trúc (markdown đã strip) nên màu pixel/độ mượt **không xác thực được** — file này chỉ nêu cấu trúc/props/CSS đã publish, và toàn bộ 10 món đều **tĩnh** nên giới hạn này không ảnh hưởng.

---

## 1. Blueprint grid biến thể theo section (fine-grid 24px + dot-grid + mask fade)

- Vấn đề nó giải quyết: `tokens.css` hiện chỉ có **1** `bg-blueprint` (ô 48px, trắng 4.5%) dùng chung — mọi section dưới hero trông cùng 1 nền; 3 biến thể ô/mật độ khác nhau tạo nhịp "giấy kỹ thuật → chấm → trơn" mà vẫn cùng 1 ngôn ngữ.
- Điểm khác với cái đã có (không trùng): `bg-blueprint` 48px + dot-grid hero (`docs/research-patterns.md` §2.1) + 3 variant Grid/Grid-Small/Dot của Aceternity (trang Grid and Dot Backgrounds publish đúng 3 variant Grid / Grid Small / Dot — <https://ui.aceternity.com/components/grid-and-dot-backgrounds>, mở trực tiếp trong phiên này) — file này bổ sung **fine-grid 24px viền gold 3%** (chưa có: grid hiện tại trắng 4.5%), **dot-grid gold** (dot hiện tại của pattern là trắng/mặc định), và **mask fade rìa** (chưa có ở token nào).
- Nguồn kỹ thuật: Tailwind publish cú pháp `bg-[<value>]` arbitrary (`background-image: <value>;`) và `bg-(image:<custom-property>)` — <https://tailwindcss.com/docs/background-image> (mở trực tiếp trong phiên này); mask fade rìa bằng utilities `mask-x-from-70%`/`mask-y-from-70%` ("apply a mask to two sides… at the same time") và radial `mask-radial-from-…` — <https://tailwindcss.com/docs/mask-image> (mở trực tiếp trong phiên này).
- Cách làm tối giản (CSS-only, 3 utility mới trong `tokens.css`, 0 JS): `bg-blueprint-fine` (linear-gradient gold 3%, size 24px), `bg-dots-gold` (radial-gradient dot gold 5%, tile 22px), mỗi section bọc 1 lớp `absolute inset-0 -z-10` + `mask-y-from-70%` để grid tan dần về 2 rìa dọc — đúng semantics mask 2 phía của — <https://tailwindcss.com/docs/mask-image>.
- Chi phí perf: **~0** — background tĩnh paint 1 lần, không JS, không repaint theo frame (tĩnh như `bg-blueprint` đã có).
- Tắt reduced-motion: không cần (đã tĩnh) — chỉ cần không gắn animation cho 3 lớp này, đúng 2 giá trị `no-preference`/`reduce` của — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.
- Áp cho section nào: **Philosophy** (fine-grid gold — giấy lab), **Explorer** (dot-grid — bảng tra cứu), **Journey** (giữ trơn để TimelineBeam đã có không bị nhiễu) — tối đa 3 section, mỗi section 1 biến thể.
- Contrast/a11y: grid/dot opacity ≤5% nên chữ giữ 4.5:1 theo — <https://webaim.org/articles/contrast/>; lớp nền `aria-hidden="true"`.
- Có cần thêm content file không: **KHÔNG**.

## 2. Divider ornament: hairline + glyph giữa (◆ / + / §) + nhãn mono

- Vấn đề nó giải quyết: giữa các section hiện chỉ có `border-t border-border` trơn (mắt lướt qua không dừng); meteor band (`docs/research-below-fold-fx.md` §6) thì động — cần 1 divider **tĩnh** có điểm nhấn ở giữa.
- Điểm khác với cái đã có (không trùng): divider chữ eyebrow/Fig-0.x/timestamp (`docs/research-patterns.md` §3.4) là thuần typography không đường kẻ; meteor divider là animation loop; lamp là cone sáng — món này là **đường kẻ + glyph giữa**, chưa file nào có.
- Nguồn kỹ thuật (primary, quan sát trực tiếp): trang MDN `<hr>` có Try-it publish đúng pattern này — `hr { border: none; border-top: 3px double #333333; … }` + `hr::after { content: "§"; padding: 0 4px; position: relative; top: -13px; }` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr> (mở trực tiếp trong phiên này); cùng trang định nghĩa `<hr>` là thematic break có implicit ARIA role `separator` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr>.
- Cách làm tối giản (CSS-only, ~10 dòng, copy cấu trúc MDN): `<hr class="divider-orn" data-glyph="◆">` với `border-top: 1px solid gold-dim; overflow: visible;` + `::after { content: attr(data-glyph); background: #080b14; padding: 0 12px; }` chồng lên giữa đường kẻ — đúng composition `border-top` + `::after content` của — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr>; glyph luân phiên `◆` / `+` / `§` theo section, kèm nhãn mono micro 2 bên nếu muốn (`// 02 — PHILOSOPHY`).
- Chi phí perf: **~0** — 1 node tĩnh, paint 1 lần.
- Tắt reduced-motion: không cần (tĩnh sẵn).
- Áp cho section nào: **tối đa 3 vị trí** — trên Philosophy, trên Ecosystem, trên footer (không đặt cạnh meteor strip nếu meteor đã dùng ở Featured→Journey để khỏi 2 divider kề nhau).
- Contrast/a11y: dùng `<hr>` thật → screen reader hiểu là `separator` theo — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr>; glyph `aria-hidden` (đã nằm trong `::after` nên AT bỏ qua); màu đường kẻ là non-text → 3:1 theo — <https://webaim.org/articles/contrast/> (§1.4.11).
- Có cần thêm content file không: **KHÔNG** — glyph/nhãn hardcode theo thứ tự section.

## 3. Card corner ticks (dấu + ở 4 góc card, kiểu registration mark)

- Vấn đề nó giải quyết: Featured Poster/Strip cards hiện là khung `rounded-xl border` trơn — 4 dấu `+` gold mờ ở góc cho cảm giác "bản vẽ kỹ thuật" mà không thêm border mới hay shadow mới.
- Nguồn kỹ thuật: MDN ghi `::before` "is often used to add cosmetic content to an element with the `content` property, such as icons, quote marks, or other decoration" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::before> (mở trực tiếp trong phiên này); không file research nào trước đây dùng `::before`/`::after` cho corner decor (grep `src/` không có).
- Cách làm tối giản (CSS-only, 1 utility `card-ticks`, 0 node DOM thêm): card `position: relative` + `::before/::after` vẽ 2 góc trên (content `"+"`, mono gold 40%, position absolute offset -8px), thêm 1 span `aria-hidden` cho 2 góc dưới — hoặc 4 góc bằng 2 pseudo + background; giữ offset ngoài border để không đè nội dung.
- Chi phí perf: **~0** — pseudo-element tĩnh, paint cùng card.
- Tắt reduced-motion: không cần (tĩnh sẵn).
- Áp cho section nào: **Featured lead card + Poster cards** (tối đa 4 card) — Strip cards và Explorer rows giữ trơn để phân cấp (lead nổi hơn list).
- Contrast/a11y: ticks là decorative non-text → `aria-hidden`, opacity ≤40% để không tạo nhiễu cạnh chữ; không ảnh hưởng 4.5:1 của text — <https://webaim.org/articles/contrast/>.
- Có cần thêm content file không: **KHÔNG**.

## 4. Quote-mark khổ lớn sau headline section (dấu “ 96–160px gold 8%)

- Vấn đề nó giải quyết: `SectionHeader` description ở Philosophy/Ecosystem/CTA là đoạn văn trơn — 1 dấu ngoặc kép khổ lớn đứng sau headline cho mắt biết "đây là câu tuyên ngôn" mà không thêm từ nào.
- Điểm khác với cái đã có (không trùng): pointer-highlight (`docs/research-below-fold-fx.md` §5) là viền vẽ quanh keyword (có animation 1 lần); đây là **glyph nền tĩnh**, không vẽ, không loop.
- Nguồn kỹ thuật (primary, quan sát trực tiếp): Try-it trang MDN `<blockquote>` publish đúng pattern — `blockquote p::before { content: "\201C"; }` + `blockquote p::after { content: "\201D"; }` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blockquote> (mở trực tiếp trong phiên này); trang MDN `::before` có hẳn ví dụ "Quotation marks" dùng `q::before { content: "«"; }` / `q::after { content: "»"; }` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::before>; cùng trang `<blockquote>` quy định "attribution for the quotation, if any, must be placed outside the `<blockquote>` element" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blockquote>.
- Cách làm tối giản (CSS-only): description lead được bọc `<figure>` + `::before { content: "\201C"; font: Space Grotesk 700 120px; color: gold 8%; position: absolute; top: -0.4em; left: -0.15em; }`, attribution (nếu có) đặt ngoài quote theo đúng quy định trên — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blockquote>.
- Chi phí perf: **~0** — 1 glyph text tĩnh.
- Tắt reduced-motion: không cần (tĩnh sẵn).
- Áp cho section nào: **tối đa 2 vị trí** — Philosophy description ("These are the principles…") + CTA description ("Personal workspace, best effort…"); các section còn lại giữ header thường.
- Contrast/a11y: glyph 8% opacity là decorative → `aria-hidden` (pseudo-element vốn đã bị AT bỏ qua phần lớn, và MDN cũng cảnh báo "::before… is not reliably accessible to screen readers" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::before> — nên không bao giờ đặt thông tin trong glyph); text quote giữ 4.5:1 — <https://webaim.org/articles/contrast/>.
- Có cần thêm content file không: **KHÔNG**.

## 5. Drop-cap chữ cái đầu (Space Grotesk gold, 3 dòng)

- Vấn đề nó giải quyết: đoạn văn dài ở Philosophy/Ecosystem (mô tả principle, snapshot note) mở đầu phẳng — 1 chữ cái đầu khổ lớn tạo điểm vào bài kiểu editorial mà không thêm heading mới.
- Nguồn kỹ thuật: MDN định nghĩa `::first-letter` "applies styles to the first letter of the first line of a block container" (Baseline, widely available) kèm ví dụ drop cap (`h2 + p::first-letter { … font-size: 250%; float: left; }`) — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::first-letter> (mở trực tiếp trong phiên này); allowlist gồm font/color/margin/padding/border/float — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::first-letter> — đủ cho drop-cap (không cần thuộc tính ngoài allowlist).
- Cách làm tối giản (CSS-only, 5 dòng): `.dropcap::first-letter { font-family: Space Grotesk; font-weight: 700; font-size: 3.2em; line-height: 0.85; float: left; margin: 0.06em 0.12em 0 0; color: #fcd34d; }` — đúng composition `font-size %` + `float: left` trong ví dụ MDN — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::first-letter>.
- Chi phí perf: **0** — 1 pseudo-element, không JS, không layout shift sau paint đầu.
- Tắt reduced-motion: không cần (tĩnh).
- Áp cho section nào: **1 đoạn duy nhất** — description `SectionHeader` của Philosophy (đoạn dài nhất trang, xứng đáng 1 drop-cap); cấm rải sang Explorer rows (list ngắn, drop-cap gây rối nhịp đọc).
- Contrast/a11y: chữ cái đầu là text → 4.5:1 trên `#080b14` (gold `#fcd34d` sáng, đạt dư) — <https://webaim.org/articles/contrast/>; `float: left` không đổi thứ tự DOM nên screen reader đọc bình thường.
- Có cần thêm content file không: **KHÔNG**.

## 6. kbd hints tĩnh (phím tắt gợi ý trong Explorer + footer)

- Vấn đề nó giải quyết: Explorer `SearchField` hiện là ô search trơn — 1 hint `/` trong ô search và 1 dòng hint footer (`g h` về đầu?) cho dev audience cảm giác "tool thật" mà không cần implement phím tắt phức tạp (hint chỉ trang trí cho filter có sẵn).
- Điểm khác với cái đã có (không trùng): install-command card (`docs/research-below-fold-fx.md` §8) là card `npm i <pkg>` + nút copy cho rows Package — món này là **gợi ý phím** (`/`, `esc`) cho search/filter, không copy, không liên quan npm.
- Nguồn kỹ thuật: MDN định nghĩa `<kbd>` "represents user input (typically keyboard input)" và cho phép lồng `<kbd><kbd>Ctrl</kbd>+<kbd>N</kbd></kbd>` cho tổ hợp phím — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd> (mở trực tiếp trong phiên này); shadcn publish composition `Kbd` + `KbdGroup` (nhóm phím) và pattern đặt `Kbd` trong input (`⌘K` trong InputGroupAddon) — <https://ui.shadcn.com/docs/components/base/kbd> (mở trực tiếp trong phiên này).
- Cách làm tối giản (CSS-only + ≤5 dòng JS có sẵn): `<kbd>` style chip mono micro (border gold-dim, radius 4px, padding 1px 6px) đặt trong `SearchField` (hint `/` focus search) và cạnh nút Reset filters (hint `esc`) — đúng pattern Kbd-trong-input của — <https://ui.shadcn.com/docs/components/base/kbd>; nếu có JS thì wire `/`→focus + `esc`→reset (dùng handler sẵn của Explorer), không JS thì hint vẫn đứng yên như decor.
- Chi phí perf: **~0** — text tĩnh + tối đa 2 key listener có sẵn logic.
- Tắt reduced-motion: không cần (không motion).
- Áp cho section nào: **Explorer duy nhất** (search + reset) + optional 1 hint footer (`/` back to search — anchor `#archive`).
- Contrast/a11y: `<kbd>` là text → 4.5:1 — <https://webaim.org/articles/contrast/>; `<kbd>` không có implicit ARIA role riêng (MDN: "No corresponding role" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd>) nên hint không thay thế label thật của input — giữ `<label>` của SearchField.
- Có cần thêm content file không: **KHÔNG**.

## 7. Section index tabs (dải neo mono 01–07, sticky dưới nav)

- Vấn đề nó giải quyết: trang 1 màn hình dài 7 section mà nav chỉ có vài link — 1 dải index mono (`01 Projects / 02 Practice / 03 Journey / 04 Index / 05 Packages / 06 Contact`) cho user biết mình đang ở chương nào, click nhảy anchor (đã có `scroll-mt-20` + `scroll-margin` từ `docs/research-visual-fx.md` §6).
- Điểm khác với cái đã có (không trùng): numbered steps 01/02/03 (Cal.com pattern, `docs/research-patterns.md` §3.4) là đánh số trong nội dung; số nền khổ lớn (`docs/research-below-fold-fx.md` §5) là decor nền header; scroll progress bar (`docs/research-showcase-fx.md` §3) là thanh % — món này là **nav anchor có số**, chưa có.
- Nguồn kỹ thuật: shadcn publish composition `Tabs > TabsList > TabsTrigger… + TabsContent` và variant `variant="line"` cho TabsList kiểu gạch chân — <https://ui.shadcn.com/docs/components/base/tabs> (mở trực tiếp trong phiên này); mượn **visual language** line-tabs cho dải index nhưng semantics là `<nav>` anchor thuần (không panel → không dùng tablist ARIA, tránh ARIA sai).
- Cách làm tối giản (0 JS bắt buộc): `<nav aria-label="Sections">` sticky `top-[nav-height]` với 6 anchor mono micro, active state bằng `aria-current="true"` + gạch gold (wire bằng IO có sẵn của reveal-once hoặc `:target`; không JS thì vẫn click nhảy anchor nhờ `scroll-mt-20` đã có).
- Chi phí perf: **~0 khi không JS** (anchor thuần); bản highlight active bằng IO async rẻ như reveal-once.
- Tắt reduced-motion: không cần block riêng (nhảy anchor là instant khi tokens đã `scroll-behavior: auto` dưới `reduce` trong `src/styles/tokens.css`).
- Áp cho section nào: **1 dải duy nhất** toàn trang (desktop only, `hidden lg:flex`; mobile đã có nav gọn).
- Contrast/a11y: link text 4.5:1 mọi state (active/inactive đo độc lập) — <https://webaim.org/articles/contrast/>; là `<nav>` với link thật ≥24×24 theo — <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>; active dùng `aria-current`, không dùng `aria-selected` (không phải tablist).
- Có cần thêm content file không: **KHÔNG** — 6 anchor hardcode theo `id` section đã có.

## 8. Footer big-type watermark (chữ TNORG/ORG khổng lồ 8–12% opacity)

- Vấn đề nó giải quyết: footer hiện (theo spec footer 3-4 cột + legal row + status) thiếu điểm neo mắt cuối trang; 1 dòng chữ org khổ khổng lồ cắt tràn đáy cho footer cảm giác "poster" mà không thêm cột link mới.
- Điểm khác với cái đã có (không trùng): số nền section (`docs/research-below-fold-fx.md` §5) nằm ở header 3 section giữa trang; big-type CTA (`docs/research-below-fold-fx.md` §9) là headline đọc được display-2xl — watermark footer là **chữ trang trí tràn khung, không cần đọc**, vị trí + opacity khác hẳn.
- Nguồn kỹ thuật: Tailwind publish scale tới `text-9xl` (8rem/128px) và cú pháp `text-[<value>]` cho cỡ tùy ý (clamp fluid) — <https://tailwindcss.com/docs/font-size> (mở trực tiếp trong phiên này); opacity thấp qua color-mix/opacity đã có tiền lệ số nền 8% ở file đợt 4.
- Cách làm tối giản (CSS-only): footer bottom block `overflow-hidden` + dòng `font-display font-bold text-[clamp(4rem,14vw,12rem)] leading-none text-[#fcd34d]/10 select-none` chữ "TNORG", `translate-y-1/4` để cắt tràn đáy — chỉ font-size + opacity + overflow, đúng utilities — <https://tailwindcss.com/docs/font-size>.
- Chi phí perf: **~0** — 1 text node paint 1 lần.
- Tắt reduced-motion: không cần (tĩnh sẵn).
- Áp cho section nào: **footer bottom duy nhất** (dưới legal row, trên cùng watermark là status line mono đã có).
- Contrast/a11y: watermark là decorative → `aria-hidden="true"`, `select-none`; chữ legal/copyright phía trên giữ 4.5:1 — <https://webaim.org/articles/contrast/>; không đặt link nào đè lên watermark (tránh target chồng).
- Có cần thêm content file không: **KHÔNG** — hardcode "TNORG".

## 9. Custom list markers (◆ / → gold cho ul có sẵn)

- Vấn đề nó giải quyết: các `<ul>` hiện tại (footer link lists, Journey tags, Tags trong Featured/Explorer) dùng bullet mặc định của browser/Preflight — marker gold mono cho list cảm giác "terminal" đồng bộ với JetBrains Mono toàn trang.
- Nguồn kỹ thuật: MDN định nghĩa `::marker` "selects the marker box of a list item… works on any element set to `display: list-item`, such as `<li>` and `<summary>`" và allowlist gồm `color`, `content`, font properties, `white-space` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::marker> (mở trực tiếp trong phiên này); ví dụ Try-it của trang đổi `content: "✝ "` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::marker> — tức đổi glyph marker là usage chuẩn.
- Cách làm tối giản (CSS-only, 4 dòng): `ul.list-gold > li::marker { content: "◆ "; color: rgb(245 158 11 / 0.7); font-size: 0.7em; }` (footer sitemap), biến thể `content: "→ "` cho Journey tag list; không đụng `ol` (giữ số thứ tự thật của Ecosystem/Journey).
- Chi phí perf: **0** — pseudo-element, không JS.
- Tắt reduced-motion: không cần (tĩnh).
- Áp cho section nào: **footer link lists + Journey tags** (2 vị trí); cấm áp vào Explorer filter chips (đã có ToggleChip state) và Ecosystem rows (đã có số 01…).
- Contrast/a11y: marker 0.7em gold-dim là non-text decorative — không phát sinh nghĩa vụ 4.5:1 của text, text li giữ 4.5:1 — <https://webaim.org/articles/contrast/>; marker do CSS sinh ra, AT bỏ qua, không ảnh hưởng đọc list.
- Có cần thêm content file không: **KHÔNG**.

## 10. Hairline double-rules (viền đôi phân tách cấp cao)

- Vấn đề nó giải quyết: mọi section đều `border-t border-border` đơn giống nhau — 1–2 vị trí dùng viền đôi để báo "sang phần mới của trang" (trước CTA, trên footer) mà không cần divider ornament hay lamp mới.
- Điểm khác với cái đã có (không trùng): `border-t` đơn đã rải khắp sections; gradient border (`docs/research-showcase-fx.md` §5) là viền conic quanh card; double-rule là **kiểu viền CSS `double`**, chưa dùng ở đâu (grep không có).
- Nguồn kỹ thuật: MDN publish `border-style: double` — "Displays two straight lines that add up to the pixel size defined by `border-width`" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-style> (mở trực tiếp trong phiên này); trang MDN `<hr>` còn publish combo `border-top: 3px double` cho thematic break — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr>.
- Cách làm tối giản (CSS-only, 1 class): `.rule-double { border-top: 3px double rgb(245 158 11 / 0.35); }` thay `border-t border-border` ở 2 vị trí — đúng semantics `double` + `border-width` của — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-style>.
- Chi phí perf: **0** — border tĩnh.
- Tắt reduced-motion: không cần (tĩnh).
- Áp cho section nào: **tối đa 2 vị trí** — top CTA + top footer (nếu footer đã có divider ornament §2 thì chọn 1 trong 2, cấm xếp double-rule sát ornament).
- Contrast/a11y: viền là non-text → 3:1 với `#080b14` — <https://webaim.org/articles/contrast/> (§1.4.11); là border trên `<section>` có sẵn, không thêm node nên không ảnh hưởng AT.
- Có cần thêm content file không: **KHÔNG**.

---

## 11. Bảng xếp wow / rủi ro + thứ tự triển khai (chỉ tính file này)

| # | Decor (§) | Wow | Rủi ro | Một câu chốt + nguồn chính |
|---|-----------|-----|--------|-----------------------------|
| 1 | Grid biến thể + mask (§1) | ★★★★ | ~0 | 3 utility tĩnh, mask rìa đúng docs — `bg-[<value>]` — <https://tailwindcss.com/docs/background-image>, mask 2 phía — <https://tailwindcss.com/docs/mask-image>. |
| 2 | Custom list markers (§9) | ★★★ | 0 | 4 dòng CSS, usage chuẩn `content` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::marker>. |
| 3 | Double-rules (§10) | ★★★ | 0 | 1 class `double`, semantics publish sẵn — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-style>. |
| 4 | Divider ornament (§2) | ★★★★ | ~0 | Copy cấu trúc Try-it MDN (`border-top` + `::after content`) — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr>. |
| 5 | Corner ticks (§3) | ★★★★ | ~0 | Pseudo decor đúng định nghĩa MDN — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::before>. |
| 6 | kbd hints (§6) | ★★★ | ~0 | Pattern Kbd-trong-input publish sẵn — <https://ui.shadcn.com/docs/components/base/kbd>, `<kbd>` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd>. |
| 7 | Drop-cap (§5) | ★★★ | ~0 | Ví dụ drop cap nguyên mẫu MDN — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::first-letter>. |
| 8 | Quote-mark khổ lớn (§4) | ★★★ | thấp | `content: "\201C"` từ Try-it — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blockquote>; rủi ro duy nhất là đặt sai attribution (đã rào bằng quy định ngoài-blockquote). |
| 9 | Section index tabs (§7) | ★★★★ | thấp | Visual line-tabs — <https://ui.shadcn.com/docs/components/base/tabs>; rủi ro duy nhất là gán nhầm tablist ARIA (đã rào: dùng `<nav>`). |
| 10 | Footer watermark (§8) | ★★★★★ | thấp nhất nếu cap đúng | 1 text node, cỡ fluid — <https://tailwindcss.com/docs/font-size>; làm cuối cùng, sai opacity là lỗi duy nhất có thể. |

- Thứ tự triển khai khuyến nghị: §1 → §9 → §10 → §2 → §3 → §6 → §5 → §4 → §7 → §8 (nền + viền + marker trước vì chạm nhiều section; nav + watermark sau cùng vì là điểm nhấn đóng trang).
- Công tắc chung giữ nguyên: block `prefers-reduced-motion: reduce` trong `src/styles/tokens.css` (10 món này tĩnh sẵn nên không cần gate JS riêng) — đúng 2 giá trị `no-preference`/`reduce` của — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.

## 12. Blacklist (giữ toàn bộ cũ + cap cho decor mới)

- Giữ blacklist cũ từ `docs/research-patterns.md` §5 + `docs/research-visual-fx.md` + `docs/research-showcase-fx.md` §11 + `docs/research-below-fold-fx.md` §11 + spec `docs/superpowers/specs/2026-10-11-showcase-fx-design.md` §2: **no back-to-top, no live-clock, no meme/doge, no magnetic toàn trang, no spotlight toàn trang (kể cả + cursor glow cùng grid), no canvas starfield full-sky mới, no parallax/pin, no custom scrollbar, no fake screenshot posing as UI, no Recharts runtime cho strip trang trí, no tooltip hover-only, no language-bar width animation**.
- Giữ toàn bộ cap số lượng cũ: marquee ≤1; tilt ≤1 card; moving-border động ≤1 CTA (còn lại hover-only); cursor glow ≤2 section; lamp ≤2 header; noise 1 layer; meteors 1 strip `number ≤3`; sparkles 1 CTA band density thấp nhất; sparkline 1 strip SVG tĩnh; avatar stack ≤2 vị trí ≤8 avatar; pointer-highlight ≤3 section header; install-command chỉ rows Package; language-bar Featured lead + Explorer rows; skeleton Explorer only <300ms.
- Cap mới từ file này (decor tĩnh nhưng cấm rải): grid biến thể **≤3 utility, ≤3 section** (§1); divider ornament **≤3 vị trí**, cấm kề meteor strip (§2); corner ticks **≤4 card** Featured only (§3); quote-mark **≤2 vị trí** (§4); drop-cap **1 đoạn duy nhất** (§5); kbd hints **Explorer + ≤1 footer** (§6); index tabs **1 dải desktop-only** (§7); watermark **1 footer bottom** (§8); markers **footer + Journey tags** (§9); double-rules **≤2 vị trí**, cấm xếp sát ornament (§10).
- Loại thẳng từ danh sách ứng viên (lý do không trùng lặp): **selection styling biến thể** (đã có `::selection` gold trong `tokens.css` + chốt ở `docs/research-patterns.md` §5 — đổi màu selection theo section gây rối nhận diện); **focus-ring restyle** (đã có `:focus-visible` gold + utility `focus-ring` trong `tokens.css`, đúng khuyến nghị `:focus-visible` phân biệt keyboard/pointer của — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible>); **patterned empty-state backdrop** (EmptyState đã có `EmptyMedia` icon graphic theo composition shadcn Empty ở `docs/research-below-fold-fx.md` §7 — thêm hatch/dot sau lưng là decor chồng decor).

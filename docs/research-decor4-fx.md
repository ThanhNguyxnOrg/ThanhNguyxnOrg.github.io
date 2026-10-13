# Research: Decor đợt 8 — marquee-fade/metrics-band/card-footer/tombstone/cta-frame/footer-kicker/mobile-nav (CSS-only tĩnh)

> Context site áp dụng: Astro static 1 trang, nền `#080b14`, accent gold `#f59e0b`/`#fcd34d`, font Space Grotesk / Inter / JetBrains Mono, Tailwind v4, GSAP. Đợt này chỉ thêm đồ **thuần trang trí, CSS-only, tĩnh sẵn, ~0 perf**, cho 6 vùng còn trống theo yêu cầu: Hero phụ (metrics strip, marquee), Featured cards (ngoài scrim/glow/zoom/badge), Philosophy grid, CTA band (ngoài notch/glow), footer, nav mobile.
> Quy tắc file này: CHỈ primary sources (trang mở trực tiếp bằng fetch ngày 2026-10-12 trong phiên này, docs chính thức). Mỗi claim kèm URL nguồn ngay sau câu.
> Không trùng: `src/styles/tokens.css` (đã có `bg-blueprint`/`bg-blueprint-fine`/`bg-dots-gold`, `bg-aurora`, `text-gradient-gold`, `tabular`, `marquee-track`, `border-gold-hover`, `lamp-cone`, `section-glow`, `noise-overlay`, `focus-ring`, `card-ticks`, `divider-orn`, `cta-notch`, `::selection` gold, `caret-color`, `:target` flash, counters `ol.principles`, `text-wrap: balance`, legal separators, kill-switch `reduce`), `docs/research-decor-fx.md` (grid biến thể, divider ornament, corner ticks, quote-mark, drop-cap, kbd hints, index tabs, watermark, list markers ◆/→, double-rules), `docs/research-decor2-fx.md` (ghost-stroke, fieldset/legend, `:focus-within`, `::placeholder`, diamond nodes + halo, dashed, wavy footer hover, wash band), `docs/research-decor3-fx.md` (caret, `:target`, counters, balance, gutter, ruler, notch, separators), `docs/research-card-fx.md` (scrim chân ảnh, title-đè-ảnh, image-frame glow, hover zoom, format badge, eyebrow pill + hairline ảnh/nội-dung), `docs/research-ecosystem-fx.md` + `docs/research-ecosystem2-fx.md` (numbered rows, chips, install-command, avatar, sticky rail, clamp, hover 3 lớp, group headers, zebra, snapshot CardFooter, empty/skeleton), `docs/research-below-fold-fx.md`, `docs/research-showcase-fx.md`, `docs/research-visual-fx.md`, `docs/research-patterns.md`, `docs/research-solar.md`.
> Hiện trạng code đã đọc (ngày 2026-10-12, trong phiên này): `src/sections/TechMarquee.tsx` (track `marquee-track` + duplicate `aria-hidden`, KHÔNG mask rìa), `src/sections/MetricsBand.tsx` + `src/components/Content.tsx:49-63` (`Stat` đã có bar trái `w-0.5 bg-primary`, `StatGroup` là grid trần KHÔNG khung), `src/sections/Featured.tsx:48-75` (Poster/Strip: actions nằm trong `div.mt-auto` KHÔNG hairline; lead đã có `SyncStats` `border-y`), `src/sections/Philosophy.tsx:19-25` (cells verb/line/body, KHÔNG end-mark), `src/sections/CTA.tsx` + `Content.tsx:119-132` (`cta-notch` + `section-glow` + `bg-aurora` + `bg-blueprint` mask, KHÔNG khung offset), `src/components/SiteFooter.tsx:46-49` (column titles `p` mono trơn, KHÔNG kicker), `src/components/SiteNav.tsx:80-96` (mobile panel `ul flex-col`, links `py-3` KHÔNG divider, current chỉ đổi màu chữ KHÔNG rail).

## 0. Phương pháp, giới hạn quan sát và log fetch

- Tất cả URL §1–§7 được **mở trực tiếp bằng fetch ngày 2026-10-12**, không viết theo trí nhớ.
- **1 redirect ghi rõ:** `https://tailwindcss.com/docs/divide-width` trả về nội dung trang `border-width` (Tailwind v4 gộp divide vào mục "Between children" của trang border-width) — các claim về `divide-x`/`divide-y` dưới đây dẫn URL đích thực tế là <https://tailwindcss.com/docs/border-width>. Còn lại 0 lỗi/404.
- Giới hạn công cụ: fetch trả về nội dung/cấu trúc (markdown đã strip) nên màu pixel **không xác thực được** — file này chỉ nêu cấu trúc/CSS đã publish, và toàn bộ 7 món đều **tĩnh** nên giới hạn này không ảnh hưởng.
- File này **không claim** site production nào dùng pattern nào; lineage duy nhất là docs chính thức (MDN, Tailwind, shadcn) + code local đã đọc.

---

## 1. Marquee rìa mờ dần (edge fade bằng mask-x, không thêm marquee thứ 2)

- Vấn đề nó giải quyết: `TechMarquee.tsx:26-31` là dải chữ chạy tới sát 2 mép viewport rồi bị `overflow-hidden` cắt cụt ở mép — 1 mask mờ 2 rìa cho chữ "tan" vào nền thay vì cắt phẳng, mà không thêm node, không thêm marquee (giữ cap marquee ≤1).
- Điểm khác với cái đã có (không trùng): `marquee-track` (tokens) là **animation loop**; mask `mask-y-from-70%` đã dùng cho **grid nền dọc** (Philosophy fine-grid); món này là **mask ngang trên dải marquee**, hướng + target khác hẳn.
- Nguồn kỹ thuật: Tailwind publish đúng pattern này — "use utilities like `mask-x-from-70%` and `mask-y-to-90%` to apply a mask to two sides of an element at the same time" kèm ví dụ `mask-x-from-70% mask-x-to-90%` — <https://tailwindcss.com/docs/mask-image> (mở trực tiếp trong phiên này).
- Cách làm tối giản (CSS-only, 1 class trên wrapper `overflow-hidden` đã có): thêm `mask-x-from-85% mask-x-to-95%` (rìa mờ ~5–15% mỗi bên, giữa đặc) — đúng semantics mask 2 phía của — <https://tailwindcss.com/docs/mask-image>; không đụng track animation, không đụng duplicate `aria-hidden`.
- Chi phí perf: **~0** — mask tĩnh paint cùng layer (không phải animation mới; animation duy nhất vẫn là `marquee-scroll` đã có).
- Tắt reduced-motion: không cần block riêng (mask là tĩnh; khi `reduce` track đã `[animation:none]` + hiện grid tĩnh theo code `TechMarquee.tsx:27`, mask rìa vẫn đẹp trên grid tĩnh).
- Áp cho: **TechMarquee duy nhất** (1 dải); cấm áp mask-x lên Journey/Explorer rows (text scan cần rìa sắc nét).
- Contrast/a11y: mask chỉ mờ pixels rìa (decorative fade), chữ giữa giữ 4.5:1 theo — <https://webaim.org/articles/contrast/>; wrapper đã `role="presentation"` + bản duplicate `aria-hidden` giữ nguyên.
- Có cần thêm content file không: **KHÔNG**.

## 2. Metrics band có khung chứa (framed strip cho 4 Stats)

- Vấn đề nó giải quyết: `MetricsBand.tsx:21-33` render `StatGroup` trần (grid 2→4 cột, không khung, không nền) — 4 số CountUp đứng lơ lửng giữa Hero và Projects; 1 khung band `rounded-xl border` gom 4 stats thành "dải chỉ số" đọc như 1 thiết bị, mà không đụng sparkline/count-up/tabular đã có.
- Điểm khác với cái đã có (không trùng): mỗi `Stat` đã có **bar trái riêng** (`w-0.5 bg-primary` trong `Content.tsx:52`) — món này là **khung ngoài của cả strip**, cấp độ container, chưa tồn tại (grep `MetricsBand.tsx` không có `border`/`rounded` nào); `divide-x` đã cân nhắc và **loại** (bar-trái từng stat + divide giữa cột = 2 vạch dọc kề nhau, rối — ghi rõ để khỏi đề xuất lại).
- Nguồn kỹ thuật: Tailwind publish `rounded-xl` → `border-radius: 0.75rem` (trong bảng `rounded-sm…rounded-3xl`) — <https://tailwindcss.com/docs/border-radius> (mở trực tiếp trong phiên này) — và `border` → `border-width: 1px` — <https://tailwindcss.com/docs/border-width> (mở trực tiếp trong phiên này); band = `rounded-xl border border-border bg-surface/60 px-6 py-8 md:px-10` bọc ngoài `StatGroup` (giữ nguyên bars + CountUp bên trong).
- Chi phí perf: **0** — border/background tĩnh, không JS.
- Tắt reduced-motion: không cần (tĩnh; CountUp bên trong giữ gate `reduce` của nó).
- Áp cho: **MetricsBand duy nhất** (1 strip); cấm bọc khung tương tự cho StatGroup khác (không có StatGroup thứ 2 — giữ band độc quyền).
- Contrast/a11y: khung là non-text → 3:1 với `#080b14` theo — <https://webaim.org/articles/contrast/> (§1.4.11); `dl` semantics của `StatGroup` giữ nguyên (khung là `div` bọc ngoài, không chen vào giữa `dl`).
- Có cần thêm content file không: **KHÔNG**.

## 3. Featured card footer hairline (vạch ngăn trên hàng actions Poster/Strip)

- Vấn đề nó giải quyết: `Featured.tsx:57,72` — hàng `ProjectActions` nằm trong `div.mt-auto` sát khối Tags/summary, không có gì báo "đây là chân card"; 1 hairline `border-t` trên footer gom actions thành vùng riêng, mắt scan card dài đỡ lạc.
- Điểm khác với cái đã có (không trùng): hairline `card-fx` §9 nằm **giữa ảnh và summary** (ranh trên của nội dung); món này nằm **giữa nội dung và actions** (ranh dưới, chân card) — cùng kỹ thuật `border-t`, khác vị trí + vai trò (divider nội-dung vs footer actions).
- Nguồn kỹ thuật (lineage trực tiếp): shadcn định nghĩa `CardFooter` là "used for actions and secondary content at the bottom of the card" — <https://ui.shadcn.com/docs/components/base/card> (mở trực tiếp trong phiên này) — và style mặc định của chính `CardFooter` trong changelog của trang đó mang `border-t` (`"flex items-center rounded-b-xl border-t bg-muted/50 …"`) — <https://ui.shadcn.com/docs/components/base/card> — tức "footer actions có vạch ngăn trên" là ngôn ngữ gốc của shadcn, ở đây chỉ mượn vai footer (không mang component shadcn thật).
- Cách làm tối giản: `div.mt-auto` của Poster/Strip thêm `border-t border-border pt-5` (giữ `mt-auto` đẩy chân); bản TNORG không cần `bg-muted/50` của shadcn (card đã `bg-surface`).
- Chi phí perf: **0** — border tĩnh.
- Tắt reduced-motion: không cần (tĩnh).
- Áp cho: **Poster + Strip only** (lead EXCLUDE — lead đã có `SyncStats` `border-y` ngay trên actions ở `Featured.tsx:97-98`, thêm hairline nữa là 2 vạch kề nhau); cấm Explorer rows (rows scan cần gọn, footer rule làm nặng list).
- Contrast/a11y: hairline non-text → 3:1 — <https://webaim.org/articles/contrast/> (§1.4.11); actions vẫn là links/buttons thật, không đổi target-size.
- Có cần thêm content file không: **KHÔNG**.

## 4. Philosophy tombstone end-marks (dấu ∎ kết mỗi principle, kiểu editorial QED)

- Vấn đề nó giải quyết: 4 cells Philosophy (`verb/line/body`) kết thúc lửng — body text-sm dừng đột ngột; 1 dấu kết bài gold (`∎`/`■`, quy ước tombstone/Halmos trong xuất bản học thuật) cho mỗi cell cảm giác "luận điểm đã chứng minh xong" mà không thêm từ nào, không thêm số (counters đã có ở đầu cell).
- Điểm khác với cái đã có (không trùng): list markers ◆/→ (`decor` §9) là **bullet ĐẦU mỗi `li`** qua `::marker`; quote-mark (`decor` §4) là **glyph nền khổ lớn** sau headline; counters (`decor3` §3) là **số ĐẦU cell** qua `::before`; món này là **dấu CUỐI body** qua `::after` — vị trí + pseudo + vai trò đều khác.
- Nguồn kỹ thuật: MDN định nghĩa `::after` "creates a pseudo-element that is the last child of the selected element. It is often used to add cosmetic content … such as icons, quote marks, or other decoration" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::after> (mở trực tiếp trong phiên này).
- Cách làm tối giản (CSS-only, 1 rule): `.principle-body::after { content: " ∎"; color: rgb(245 158 11 / 0.6); font-size: 0.8em; }` gắn vào span body (cần class mới trên body span — hiện body là span trơn `Featured`? là `Philosophy.tsx:23` span trơn, thêm class khi implement).
- Chi phí perf: **0** — pseudo-element tĩnh.
- Tắt reduced-motion: không cần (tĩnh).
- Rào a11y bắt buộc: MDN cảnh báo "Using an `::after` pseudo-element to add content is discouraged, as it is not reliably accessible to screen readers" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::after> — nên tombstone là decorative thuần (AT bỏ qua là đúng ý đồ, không mang thông tin); text body giữ 4.5:1 — <https://webaim.org/articles/contrast/>.
- Áp cho: **4 cells Philosophy only**; cấm rải sang Ecosystem descriptions (list cần scan, end-mark gây nhiễu) và CTA description (đã có quote-mark cap).
- Có cần thêm content file không: **KHÔNG**.

## 5. CTA offset frame (khung outline cách band 8–12px, silhouette đôi cùng notch)

- Vấn đề nó giải quyết: CTA band đã có `cta-notch` (hình dáng) + `section-glow`/`bg-aurora` (nền sáng) — nhưng rìa ngoài band vẫn "tan" vào nền `#080b14`, mắt không thấy biên chặng cuối; 1 khung hairline đứng cách band 8–12px tạo silhouette đôi (khung trong cắt góc + khung ngoài thẳng) mà không thêm border mới vào band (border-gold-hover đã dành cho cards).
- Điểm khác với cái đã có (không trùng): `card-ticks` là **dấu + ở góc card**; `image-frame` là **ring ôm ảnh**; diamond halo (`decor2` §5) là **halo 4px quanh node 12px** (marker timeline); `rule-double` là **border-style double liền biên**; món này là **outline đứng NGOÀI border, cách 8–12px, quanh cả CTA band** — khác element, khác khoảng cách, khác mục đích (poster-frame vs node-marker).
- Nguồn kỹ thuật: MDN định nghĩa `outline` là "a line outside of the element's border" và "outlines don't take up space, so they don't affect the layout" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/outline> (mở trực tiếp trong phiên này) — khoảng cách chỉnh bằng `outline-offset`, Tailwind publish `outline-offset-<number>` → `outline-offset: <number>px` với ví dụ `outline-offset-4` — <https://tailwindcss.com/docs/outline-offset> (mở trực tiếp trong phiên này); chốt `outline outline-1 outline-[#f59e0b]/40 outline-offset-8` (md: `outline-offset-12`) trên wrapper `GlowSection` đã mang `cta-notch`.
- Rào kỹ thuật trung thực: `clip-path` "creates a clipping region… Parts that are inside the region are shown, while those outside are hidden" (đã dẫn ở `decor3` §7) — outline vẽ ngoài border nên **bị clip-path của cùng element cắt ở 2 góc chéo**, khung ngoài sẽ khuyết đúng chỗ góc cắt (trông như khung "né" theo silhouette — thường là đẹp, nhưng phải verify visual; nếu vỡ thì chuyển frame sang inner `CTASection` không bị clip).
- Chi phí perf: **~0** — outline tĩnh paint 1 lần, 0 layout (không chiếm chỗ theo MDN trên).
- Tắt reduced-motion: không cần (tĩnh, không transition).
- Áp cho: **CTA band duy nhất** (silhouette độc quyền chặng cuối, cùng nguyên tắc với notch); cấm cards (cards giữ `rounded-xl` + ticks).
- Contrast/a11y: khung là non-text → 3:1 với `#080b14` — <https://webaim.org/articles/contrast/> (§1.4.11); không cắt vào hit-area buttons (offset 8–12px nằm ngoài band).
- Có cần thêm content file không: **KHÔNG**.

## 6. Footer column-title kicker rules (thanh gold 24px trên mỗi tiêu đề cột)

- Vấn đề nó giải quyết: `SiteFooter.tsx:48` — 3 column titles (`Product`/`Resources`/…) là dòng mono micro trơn, mắt lướt footer không thấy "đầu cột"; 1 thanh gold ngắn (24×2px) đứng trên mỗi title cho nhịp "vạch — nhãn — links" mà không thêm icon, không đụng markers của lists bên dưới.
- Điểm khác với cái đã có (không trùng): markers ◆ (`decor` §9) là **bullet của từng link trong `ul`**; wavy hover (`decor2` §7) là **kiểu gạch chân khi hover**; món này là **thanh block tĩnh TRÊN title** (ngoài list, không phải bullet, không phải hover) — khác vị trí, khác trigger.
- Nguồn kỹ thuật: Tailwind publish thang width `w-<number>` → `width: calc(var(--spacing) * <number>)` (ví dụ `w-24`, `w-6` = 1.5rem = 24px) — <https://tailwindcss.com/docs/width> (mở trực tiếp trong phiên này); kicker = `span aria-hidden block h-0.5 w-6 bg-primary/70 mb-3` đặt trên `p` title (màu dùng token `primary`, đúng single-accent).
- Chi phí perf: **0** — 3 block tĩnh (1/cột).
- Tắt reduced-motion: không cần (tĩnh).
- Áp cho: **footer sitemap columns only** (≤3 titles); cấm Ecosystem group headers (đã có `h3` + count riêng) và SectionHeaders (đã có lamp/ghost/highlight — cấm xếp kicker cạnh 3 món đó).
- Contrast/a11y: thanh là decorative non-text (`aria-hidden`), titles giữ 4.5:1 — <https://webaim.org/articles/contrast/>; không phải list-marker nên không ảnh hưởng semantics `ul`.
- Có cần thêm content file không: **KHÔNG** — titles hardcode trong `columns` prop đã có.

## 7. Mobile nav: row hairlines + current rail (panel `md:hidden` có nhịp list + mốc trang hiện tại)

- Vấn đề nó giải quyết: `SiteNav.tsx:80-96` — mobile panel là stack links `py-3 text-display-md` liền nhau không vạch ngăn, link trang hiện tại chỉ khác màu chữ (`aria-[current=page]:text-fg`); trên màn 360px mắt khó phân ranh giới rows và khó thấy "đang ở đâu" (desktop có rail `h-0.5 bg-primary` dưới link — `SiteNav.tsx:63` — mobile không có tương đương).
- Điểm khác với cái đã có (không trùng): desktop current-rail là **thanh ngang dưới link inline**; legal separators (`decor3` §8) là **`::before "·"` giữa items footer-bottom** (cap footer-bottom only, giữ nguyên); món này là **hairline NGANG giữa rows dọc + rail DỌC trái cho current** trong panel mobile — khác breakpoint, khác hướng, khác cơ chế.
- Nguồn kỹ thuật: (a) hairlines — Tailwind publish "use utilities like `divide-x` and `divide-y-4` to add borders between child elements" (mục Between children) — <https://tailwindcss.com/docs/border-width> (mở trực tiếp trong phiên này; slug `divide-width` redirect về trang này trong Tailwind v4); chốt `divide-y divide-border` trên `ul` panel (không padding riêng từng `li`, đúng semantics divide = border giữa children). (b) current rail — `aria-current="page"` đã render trong code (`SiteNav.tsx:87`); MDN định nghĩa: non-null `aria-current` "indicates that this element represents the current item within a container", ví dụ chuẩn là link trang hiện tại với `aria-current="page"`, và "Only mark one element in a set" — <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current> (mở trực tiếp trong phiên này); rail = `{current && <span aria-hidden className="w-0.5 self-stretch bg-primary" />}` đặt trước label trong link flex (link hiện `flex items-baseline gap-4` — thêm span rail vào đầu), mirror ngôn ngữ rail desktop nhưng xoay dọc hợp layout stack.
- Cách giữ a11y: rail là `aria-hidden` (thông tin "current" đã nằm trong `aria-current`, không дублировать tín hiệu — đúng nguyên tắc "Only mark one element" của MDN trên); mỗi link giữ target ≥24×24 (hiện `py-3` đã dư).
- Chi phí perf: **0** — divide + span tĩnh, panel chỉ render khi `open`.
- Tắt reduced-motion: không cần (tĩnh; panel open/close không animation trong code hiện tại — giữ nguyên, cấm thêm slide-down).
- Áp cho: **mobile panel only** (`md:hidden`, `SiteNav.tsx:80-96`); cấm desktop inline links (đã có rail ngang) và footer lists (đã có markers + wavy).
- Contrast/a11y: rail gold trên `#080b14` là non-text cue phụ → 3:1 — <https://webaim.org/articles/contrast/> (§1.4.11); text current/non-current giữ 4.5:1 độc lập mọi state ("text in all these states must meet the same contrast requirements (and must be evaluated independently)" — <https://webaim.org/articles/contrast/>).
- Có cần thêm content file không: **KHÔNG** — `items`/`currentHref` đã có trong props `SiteNav`.

---

## 8. Bảng xếp wow / rủi ro + thứ tự triển khai (chỉ tính file này)

| # | Decor (§) | Wow | Rủi ro | Một câu chốt + nguồn chính |
|---|-----------|-----|--------|-----------------------------|
| 1 | Marquee edge fade (§1) | ★★★★ | ~0 | 1 class mask-x, không thêm marquee — `mask-x-from-70%` 2 phía — <https://tailwindcss.com/docs/mask-image>. |
| 2 | Metrics framed band (§2) | ★★★★ | ~0 | Gom 4 stats thành 1 dải thiết bị — `rounded-xl` — <https://tailwindcss.com/docs/border-radius>, `border` — <https://tailwindcss.com/docs/border-width>. |
| 3 | Card footer hairline (§3) | ★★★ | 0 | Footer actions đúng vai shadcn — `CardFooter` "actions and secondary content at the bottom" + `border-t` mặc định — <https://ui.shadcn.com/docs/components/base/card>. |
| 4 | Tombstone end-marks (§4) | ★★★ | thấp | Dấu kết editorial, rào AT bằng cảnh báo MDN — cosmetic `content` + "not reliably accessible" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::after>; rủi ro duy nhất là đặt thông tin vào glyph (đã cấm). |
| 5 | CTA offset frame (§5) | ★★★★★ | thấp | Silhouette đôi cho chặng cuối, 0 layout — outline ngoài border + không chiếm chỗ — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/outline>, offset px — <https://tailwindcss.com/docs/outline-offset>; rủi ro duy nhất là clip-path cắt outline ở góc chéo (đã rào verify/fallback inner). |
| 6 | Footer kicker rules (§6) | ★★★ | 0 | 3 thanh 24px, nhịp vạch–nhãn–links — thang `w-<number>` — <https://tailwindcss.com/docs/width>. |
| 7 | Mobile nav rows + rail (§7) | ★★★★ | ~0 | Panel mobile có nhịp + mốc current như desktop — divide giữa children — <https://tailwindcss.com/docs/border-width>, `aria-current="page"` + one-element rule — <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current>. |

- Thứ tự triển khai khuyến nghị: §7 → §3 → §6 → §2 (rows/khung/vạch — chạm layout list trước, 0 rủi ro) → §1 → §4 (mask + glyph, tĩnh nhưng cần nhìn) → §5 (frame CTA cuối cùng vì phụ thuộc clip-path verify).
- Công tắc chung giữ nguyên: block `prefers-reduced-motion: reduce` trong `src/styles/tokens.css` (7 món tĩnh sẵn, không cần gate JS riêng) — đúng 2 giá trị `no-preference`/`reduce` của — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.

## 9. Blacklist (kế thừa toàn bộ + cap cho file này)

- Giữ toàn bộ blacklist cũ từ `docs/research-patterns.md` §5 + `docs/research-visual-fx.md` + `docs/research-showcase-fx.md` §11 + `docs/research-below-fold-fx.md` §11 + `docs/research-decor-fx.md` §12 + `docs/research-decor2-fx.md` §10 + `docs/research-decor3-fx.md` §10 + `docs/research-card-fx.md` §11 + `docs/research-ecosystem-fx.md` §9 + `docs/research-ecosystem2-fx.md` §11: **no back-to-top, no live-clock, no meme/doge, no magnetic toàn trang, no spotlight toàn trang, no canvas starfield full-sky mới, no parallax/pin, no custom scrollbar styling, no fake screenshot posing as UI, no Recharts runtime cho strip trang trí, no tooltip hover-only, no language-bar width animation, no syntax-highlighter runtime, no avatar-stack gộp People, no shimmer loop cho skeleton, no sticky journey panel, no sync-stats restyle, no logo thumbs, no caret restyle, no target-flash mở rộng, no counters mở rộng, no balance mở rộng, no gutter mở rộng, no ruler (đã bỏ), no notch mở rộng, no legal-separators mở rộng, no sticky eco rail mở rộng, no clamp mở rộng, no hover-inset mở rộng**.
- Giữ toàn bộ cap số lượng cũ: marquee ≤1 (file này chỉ fade rìa, không thêm dải); tilt ≤1 card; moving-border động ≤1 CTA; cursor glow ≤2 section; lamp ≤2 header; noise 1 layer; meteors 1 strip `number ≤3`; sparkles 1 CTA band density thấp nhất; sparkline 1 strip SVG tĩnh; avatar stack ≤2 vị trí ≤8 avatar; pointer-highlight ≤3 section header; install-command chỉ rows Package; language-bar Featured lead + Explorer rows; skeleton Explorer only <300ms; grid biến thể ≤3 section; divider ornament ≤3 vị trí; corner ticks ≤4 card Featured; quote-mark ≤2; drop-cap 1 đoạn; kbd Explorer + ≤1 footer; index tabs 1 dải desktop-only; watermark 1 footer; markers footer-columns + Journey tags; double-rules ≤2; ghost-stroke ≤2 header; fieldset 3 nhóm; focus-within 2 container; placeholder 1 input; diamond nodes Journey only + halo 1 node; dashed 1 connector + 1 empty-frame; wavy hover footer-links only; wash band ≤2; title-đè-ảnh ≤2 Poster; image-glow Poster + lead; hover zoom cap 1.04 (cấm thumb); badge góc ảnh ≤2/card; eyebrow pill Poster only; group headers ≤4; zebra 1 tint; sticky ≤2 trục; snapshot 1 box; caret 1 input; target 1 rule chung; counters Philosophy only; balance headings only; gutter `stable` đơn 1 cột; corner-cut CTA only; separators footer-bottom only.
- Cap mới từ file này: edge fade **TechMarquee only**, cấm rows scan (§1); framed band **MetricsBand only**, cấm StatGroup thứ 2 (§2); footer hairline **Poster + Strip, lead exclude** (đã có SyncStats rule), cấm Explorer rows (§3); tombstone **4 cells Philosophy**, cấm Ecosystem/CTA (§4); offset frame **CTA only**, cấm cards, verify clip-path trước merge (§5); kicker rules **≤3 footer titles**, cấm group headers/SectionHeaders (§6); divide + rail **mobile panel only**, cấm desktop links/footer (§7).
- Loại thẳng từ danh sách ứng viên: **marquee thứ 2** (cap ≤1 — fade rìa thay thế); **`divide-x` giữa Stats** (đụng bar-trái từng stat = 2 vạch kề nhau); **rank index `F-01` trên Featured cards** (họ numbered đã có ở Ecosystem rows/Philosophy counters/Cal steps — thêm số là trùng ngôn ngữ); **gradient hairline top-footer** (vị trí top-footer đã dành cho double-rule trong cap cũ); **`gap-px` hairline grid cho Philosophy** (cùng họ divider đã rải khắp trang); **stat hover tint** (rows non-interactive hover là fake affordance); **mobile nav slide-down animation** (thêm motion vào disclosure đang tĩnh — xung đột `reduce`); **back-to-top** (blacklist từ patterns §3.4 — không site mẫu nào có, giữ cấm).

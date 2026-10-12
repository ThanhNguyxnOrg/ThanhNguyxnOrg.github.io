# Research: Decor đợt 6 — headers/sidebar/timeline/footer/empty/focus/transitions (CSS-only tĩnh)

> Context site áp dụng: Astro static 1 trang, nền `#080b14`, accent gold `#f59e0b`/`#fcd34d`, font Space Grotesk / Inter / JetBrains Mono, Tailwind v4, GSAP. Đợt này chỉ thêm đồ **thuần trang trí, CSS-only, tĩnh sẵn, ~0 perf**, cho 7 vùng còn trống: section headers (ngoài lamp/quote-mark), Explorer sidebar, Journey timeline nodes, footer, empty states, focus/hover states, background section transitions.
> Quy tắc file này: CHỈ primary sources (trang mở trực tiếp bằng fetch ngày 2026-10-12 trong phiên này, docs chính thức). Mỗi claim kèm URL nguồn ngay sau câu.
> Không trùng: `src/styles/tokens.css` (đã có `bg-blueprint` 48px, `bg-blueprint-fine` 24px gold 3%, `bg-dots-gold`, `bg-aurora`, `text-gradient-gold`, `tabular`, `marquee-track`, `border-gold-hover`, `lamp-cone`, `section-glow`, `noise-overlay`, `focus-ring`, `card-ticks`, `divider-orn`, `transition-ui`, `::selection` gold, `:focus-visible` gold, kill-switch `reduce`), `docs/research-decor-fx.md` (10 món: grid biến thể, divider ornament, corner ticks, quote-mark, drop-cap, kbd hints, index tabs, footer watermark TNORG, list markers ◆/→, double-rules), `docs/research-below-fold-fx.md` (§1 language-bar, §2 stat chips, §3 sparkline, §4 avatar stack, §5 pointer-highlight + số nền, §6 meteor divider, §7 skeleton/empty/counts, §8 install-command, §9 sparkles CTA + separator), `docs/research-card-fx.md` (§4 scrim chân ảnh, §5 title đè ảnh, §6 image-frame glow, §7 hover zoom, §8 format badge, §9 eyebrow pill + hairline), `docs/research-showcase-fx.md` (marquee, tilt, progress bar, cursor glow, gradient border, noise, count-up, timeline beam, lamp), `docs/research-visual-fx.md` (gradient keyword, underline offset, pulse-dot, tabular-nums, reveal-once, scroll-margin + content-visibility).

## 0. Phương pháp, giới hạn quan sát và log fetch

- Tất cả URL §1–§8 được **mở trực tiếp bằng fetch ngày 2026-10-12**, không viết theo trí nhớ.
- **2 URL 404 trong phiên này (đều là slug đoán, đã bỏ):** `https://ui.shadcn.com/docs/components/base/fieldset` và `https://ui.shadcn.com/docs/components/fieldset` — shadcn không có component Fieldset; phần grouping lấy lineage từ shadcn Sidebar (`SidebarGroup`/`SidebarGroupLabel`) và shadcn Input (`Field`/`FieldLabel`) thay thế, cả 2 đều mở thành công. Còn lại 0 lỗi.
- Giới hạn công cụ: fetch trả về nội dung/cấu trúc (markdown đã strip) nên màu pixel/độ mượt **không xác thực được** — file này chỉ nêu cấu trúc/props/CSS đã publish, và toàn bộ 8 món đều **tĩnh** nên giới hạn này không ảnh hưởng.
- File này **không claim** site production nào dùng pattern nào; lineage duy nhất là demo live Aceternity + docs chính thức (MDN, Tailwind, shadcn).

---

## 1. Ghost outline keyword sau headline section (chữ viền rỗng gold, không fill)

- Vấn đề nó giải quyết: headline các section giữa trang (Journey/Ecosystem/Explorer) cùng 1 kiểu fill đặc nên nhịp đọc đều đều; 1 từ viền-rỗng đứng sau headline (kiểu "04 / LAB / INDEX" khổ lớn, chỉ viền không ruột) cho cảm giác poster mà không thêm từ mới, không thêm motion.
- Điểm khác với cái đã có (không trùng): `text-gradient-gold` là fill gradient đặc; số nền (`below-fold` §5) là fill mờ 8%; watermark footer là fill 10% tràn khung; quote-mark là glyph `“` nền — món này là **stroke-only outline text**, và `docs/research-decor-fx.md` §12 đã grep xác nhận `text-stroke` **chưa tồn tại** trong `src/`.
- Nguồn kỹ thuật: MDN định nghĩa `-webkit-text-stroke` là "shorthand property specifies the width and color of strokes for text characters" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/-webkit-text-stroke> (mở trực tiếp trong phiên này) — với constituent là `-webkit-text-stroke-width` + `-webkit-text-stroke-color` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/-webkit-text-stroke> (mở trực tiếp trong phiên này) — và syntax chuẩn `-webkit-text-stroke: 2px red` như ví dụ trang — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/-webkit-text-stroke> (mở trực tiếp trong phiên này).
- Cách làm tối giản (CSS-only, 1 utility `ghost-stroke`, 0 node mới nếu gắn vào span có sẵn): `.ghost-stroke { -webkit-text-stroke: 1px rgb(245 158 11 / 0.45); color: transparent; }` đặt lên từ khóa phụ sau headline (ví dụ eyebrow "02 — PRACTICE" giữ fill, từ nền "LAB" outline), cỡ `text-display-lg`, `aria-hidden="true"`, `select-none`.
- Chi phí perf: **0** — text paint 1 lần, không JS.
- Tắt reduced-motion: không cần (tĩnh sẵn).
- Áp cho: **tối đa 2 section header** (Journey + Ecosystem; các header còn lại giữ lamp/quote-mark/pointer-highlight đã có — cấm xếp ghost-stroke sát số nền §5 below-fold để khỏi 2 chữ nền chồng nhau).
- Contrast/a11y: ghost là decorative → `aria-hidden`, không bao giờ đặt thông tin duy nhất trong chữ viền (headline fill thật đứng cạnh giữ 4.5:1 — <https://webaim.org/articles/contrast/>); stroke 1px gold 45% trên `#080b14` chỉ là non-text.
- Có cần thêm content file không: **KHÔNG** — từ ghost hardcode theo section (số thứ tự/tên ngắn đã có).

## 2. Explorer sidebar: nhóm filter bằng `<fieldset>` + `<legend>` (khung + caption đúng semantics)

- Vấn đề nó giải quyết: sidebar Explorer hiện là stack div trơn (SearchField + ToggleChips category/tags + sort) — mắt không phân biệt "nhóm nào là nhóm nào"; 3 khung fieldset có caption khắc ngay trên viền cho sidebar cảm giác "control panel" mà còn đúng semantics form.
- Điểm khác với cái đã có (không trùng): ToggleChip + counts (`below-fold` §7), kbd hints `/`/`esc` (`decor` §6), skeleton/empty (`below-fold` §7) đều là **nội dung trong** nhóm; món này là **khung + caption của nhóm**, chưa file nào có (grep `src/` không có `<fieldset>`/`<legend>`).
- Nguồn semantics: MDN định nghĩa `<fieldset>` "is used to group several controls as well as labels within a web form" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset> (mở trực tiếp trong phiên này) — caption của nhóm là "the first `<legend>` element nested inside it" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset> (mở trực tiếp trong phiên này) — và implicit ARIA role là `group` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset> (mở trực tiếp trong phiên này) — tức screen reader tự hiểu ranh giới nhóm không cần ARIA thủ công.
- Nguồn style: MDN ghi mặc định fieldset có "a `2px` `groove` border surrounding the contents" với legend "placed over the `block-start` border" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset> (mở trực tiếp trong phiên này) — và "You can feel free to style the `<fieldset>` and `<legend>` in any way you want" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset> (mở trực tiếp trong phiên này) — nên bản TNORG reset `groove` thành `1px solid rgb(245 158 11 / 0.25)`, radius `rounded-lg`, legend là chip mono micro gold (`px-2`, nền `#080b14` để "cắt" viền đúng kiểu caption khắc viền).
- Lineage component: shadcn Sidebar publish đúng composition nhóm sidebar — `SidebarGroup` gồm `SidebarGroupLabel` + `SidebarGroupAction` + `SidebarGroupContent` — <https://ui.shadcn.com/docs/components/base/sidebar> (mở trực tiếp trong phiên này) — tức "nhóm có label + action + content" là ngôn ngữ chuẩn; fieldset/legend ở đây là bản native-semantics của cùng ý tưởng (không mang Sidebar JS collapsible vào Astro static).
- Cách làm tối giản: 3 fieldset — `Category`, `Tags`, `Sort` (SearchField đứng ngoài/ngoài fieldset, giữ `<label>` thật đã có); legend của Tags kèm count `(n)` đã tính sẵn từ `tagCounts`.
- Chi phí perf: **0** — HTML tĩnh, không JS (cấm dùng `disabled` attr của fieldset để tắt nhóm — không có nhu cầu disable filter nào).
- Tắt reduced-motion: không cần (tĩnh).
- Áp cho: **Explorer sidebar duy nhất** (desktop `lg:`; mobile sidebar collapse thành accordion/filter-sheet thì giữ nguyên fieldset — semantics không đổi).
- Contrast/a11y: legend text mono micro → 4.5:1 trên `#080b14` — <https://webaim.org/articles/contrast/>; viền khung là non-text → 3:1 (§1.4.11); giữ `<label>` của SearchField (placeholder §4 không thay label — rào MDN ở §4).
- Có cần thêm content file không: **KHÔNG** — groups suy ra từ props `categories`/`tagCounts` đã có trong `Explorer.tsx`.

## 3. Focus state cấp container: sidebar/search sáng viền khi con bên trong được focus (`:focus-within`)

- Vấn đề nó giải quyết: `:focus-visible` gold toàn cục đã có nhưng chỉ sáng **đúng control đang focus** (ô search nhỏ, chip nhỏ) — user keyboard khó thấy "mình đang ở panel nào"; sáng cả panel chứa nó cho feedback vùng rõ hơn mà vẫn CSS-only, 0 JS.
- Điểm khác với cái đã có (không trùng): `:focus-visible` + utility `focus-ring` trong `tokens.css` là **outline của chính element focus**; `border-gold-hover` là **hover** của card — món này là **trạng thái focus của container cha**, chưa token nào có (grep `src/` không có `focus-within`).
- Nguồn kỹ thuật: MDN định nghĩa `:focus-within` "matches an element if the element or any of its descendants are focused" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-within> (mở trực tiếp trong phiên này) — và ví dụ chuẩn chính là "highlighting an entire `<form>` container when the user focuses on one of its `<input>` fields" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-within> (mở trực tiếp trong phiên này) — ánh xạ 1:1 sang "highlight sidebar khi search/chip bên trong được focus".
- Cách làm tối giản (CSS-only, 2 selector trong `tokens.css`, 0 JS): `.filter-panel:focus-within { border-color: rgb(252 211 77 / 0.7); box-shadow: 0 0 0 1px rgb(245 158 11 / 0.3); }` (đồng bộ màu `border-gold-hover` nhưng trigger là focus-con, không phải hover-cha); áp cho sidebar panel + SearchField wrapper (khi kbd `/` nhảy vào search thì cả panel sáng).
- Chi phí perf: **~0** — pseudo-class tĩnh theo trạng thái focus, paint khi tab qua lại.
- Tắt reduced-motion: không cần block riêng (đổi màu tức thì, không animation; nếu gắn `transition-ui` thì kill-switch `reduce` toàn cục đã triệt).
- Áp cho: **Explorer sidebar + SearchField wrapper** (2 container); cấm rải sang Featured cards (cards đã có hover-glow, thêm focus-glow là 2 glow chồng nhau).
- Contrast/a11y: viền focus-container là non-text cue bổ sung → 3:1 với nền — <https://webaim.org/articles/contrast/> (§1.4.11); **không thay thế** outline gold của control đang focus (`:focus-visible` giữ nguyên để chỉ báo chính xác) — đúng quan hệ `:focus` ⊂ `:focus-within` của MDN, container chỉ là echo.
- Có cần thêm content file không: **KHÔNG**.

## 4. Explorer search: placeholder mono gold-dim (`::placeholder`)

- Vấn đề nó giải quyết: SearchField hiện placeholder mặc định xám mờ của browser — 1 dòng gợi ý mono gold-dim (`Search the lab… try "astro"`) biến ô search thành decor tự giới thiệu mà không thêm hint-node nào.
- Điểm khác với cái đã có (không trùng): kbd hint `/` trong search (`decor` §6) là **chip phím**; label của SearchField là **nhãn thật**; món này là **style của chính placeholder text**, chưa token nào đụng tới (grep `src/` không có `placeholder` styling).
- Nguồn kỹ thuật: MDN định nghĩa `::placeholder` "represents the placeholder text in an `<input>` or `<textarea>` element" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::placeholder> (mở trực tiếp trong phiên này) — với ví dụ đổi `color`/`font-size`/`font-style: italic` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::placeholder> (mở trực tiếp trong phiên này) — và lưu ý "Only the subset of CSS properties that apply to the `::first-line` pseudo-element can be used" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::placeholder> (mở trực tiếp trong phiên này) — nên chỉ dùng color/font/opacity (đủ cho mono + italic + gold-dim), cấm background/margin.
- Nguồn consistency: MDN cảnh báo "browsers use different default colors… If you want consistent placeholder text color across the browsers, then set the `color` explicitly" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::placeholder> (mở trực tiếp trong phiên này) — nên set explicit `color: rgb(163 169 191 / 0.75)` (fg-muted 75%) + `opacity: 1` để Firefox (mặc định 54% opacity input color) và Chrome (darkgray) render giống nhau.
- Lineage component: shadcn Input publish composition `Field` + `FieldLabel` + `FieldDescription` cho input có label/description — <https://ui.shadcn.com/docs/components/base/input> (mở trực tiếp trong phiên này) — tức label thật + hint là pattern chuẩn; placeholder ở đây chỉ là echo trang trí của description, không thay thế.
- Cách làm tối giản: `input::placeholder { font-family: JetBrains Mono; font-size: text-micro; font-style: italic; color: rgb(163 169 191 / 0.75); opacity: 1; }` (~5 dòng, 1 selector).
- Chi phí perf: **0** — text paint cùng input.
- Tắt reduced-motion: không cần (tĩnh).
- Áp cho: **Explorer SearchField duy nhất** (1 input); cấm đặt vào CTA/contact form (nếu có) để placeholder-voice đồng nhất 1 chỗ.
- Contrast/a11y: MDN yêu cầu placeholder "contrast ratio… high enough that people experiencing low vision conditions will be able to read it" với mốc 4.5:1 cho text — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::placeholder> (mở trực tiếp trong phiên này) — nên đo fg-muted-75% trên nền input (surface `#0e1220`); và "Placeholders are not a replacement for the `<label>` element" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::placeholder> (mở trực tiếp trong phiên này) — giữ `<label>` thật, placeholder chỉ là ví dụ cú pháp (`try "astro"`), không phải hướng dẫn duy nhất.
- Có cần thêm content file không: **KHÔNG** — string hardcode 1 dòng.

## 5. Journey timeline nodes: nút kim cương xoay 45° + halo tách nền (diamond + outline-offset)

- Vấn đề nó giải quyết: TimelineBeam đã có là **vạch spine chạy dọc** — nhưng các node (chấm tròn mặc định) chưa có decor riêng, mắt không phân biệt stop "đã qua / hiện tại / sắp tới"; nút kim cương + halo cho 3 trạng thái bằng hình-dạng mà không thêm màu mới, không thêm JS.
- Điểm khác với cái đã có (không trùng): Tracing Beam/Timeline beam (`showcase` §8) là **đường spine + progress theo scroll**; avatar stack là tròn overlap; món này là **hình nút mốc**, chưa có ở Journey.
- Nguồn xoay: Tailwind publish `rotate-<number>` → `rotate: <number>deg` với ví dụ `rotate-45`/`rotate-90` — <https://tailwindcss.com/docs/rotate> (mở trực tiếp trong phiên này) — nên node = `size-3 rotate-45 bg-gold` (hình vuông xoay thành kim cương), stop hiện tại thêm `ring-1 ring-[#fcd34d]`, stop tương lai `bg-transparent border border-gold-dim` (rỗng = chưa tới).
- Nguồn halo: Tailwind publish `outline-offset-<number>` → `outline-offset: <number>px` với ví dụ `outline-2 outline-offset-2/4` — <https://tailwindcss.com/docs/outline-offset> (mở trực tiếp trong phiên này) — nên node hiện tại dùng `outline outline-1 outline-[#f59e0b]/60 outline-offset-4` để có vòng halo cách node 4px, tách kim cương khỏi spine/nền `#080b14` (khác với `ring` ôm sát của image-frame glow `card-fx` §6).
- Lineage timeline: Aceternity Timeline định nghĩa data shape `TimelineEntry = { title: string; content: React.ReactNode }` với "sticky header and scroll beam follow" — <https://ui.aceternity.com/components/timeline> (mở trực tiếp trong phiên này) — beam đã có ở Journey, node-shape là phần implementer tự chọn nên kim cương không phá lineage.
- Cách làm tối giản: 3 class node (past/current/future) + halo chỉ cho current; node `aria-hidden` (trạng thái thật nằm trong text "2024 — shipped" bên cạnh).
- Chi phí perf: **~0** — transform tĩnh paint 1 lần (không phải hover animation; `rotate` ở đây là trạng thái, không chuyển động).
- Tắt reduced-motion: không cần (không motion).
- Áp cho: **Journey timeline duy nhất** (mọi node; halo chỉ 1 node current).
- Contrast/a11y: node là non-text marker → 3:1 với nền — <https://webaim.org/articles/contrast/> (§1.4.11); kim cương xoay không mang nghĩa duy nhất (kèm label năm + trạng thái chữ "now"/"next"); node `aria-hidden`, list mốc là HTML thật.
- Có cần thêm content file không: **KHÔNG** — trạng thái past/current/future suy ra từ thứ tự stops đã có.

## 6. Ngôn ngữ "nét đứt": connector Journey tương lai + khung vacant của empty state (`border-style: dashed`)

- Vấn đề nó giải quyết: 2 nơi cần nói "chỗ này chưa có gì" — đoạn connector tới stop tương lai của Journey, và khung EmptyState khi filter không trúng repo nào; nét đứt là ký hiệu bản vẽ cho "đường dự kiến / ô trống" mà không thêm chữ giải thích.
- Điểm khác với cái đã có (không trùng): `divider-orn` là solid + glyph giữa; `rule-double` là **double**; skeleton là pulse xám — **`dashed` chưa dùng ở đâu** (2 file trước chỉ cite `double` + `solid` từ cùng trang MDN, chưa bao giờ dùng `dashed`).
- Nguồn kỹ thuật: MDN định nghĩa `dashed` là "a series of short square-ended dashes or line segments" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-style> (mở trực tiếp trong phiên này) — phân biệt với `dotted` ("rounded dots") — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-style> (mở trực tiếp trong phiên này) — và `double` ("two straight lines that add up to the pixel size defined by border-width" — đã dùng cho rule-double) — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-style> (mở trực tiếp trong phiên này); animation type là `discrete` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-style> (mở trực tiếp trong phiên này) — tức tĩnh sẵn, không thể animate mượt (đúng ý đồ decor tĩnh).
- Cách làm tối giản: (a) Journey — đoạn spine từ node current tới stop "next" dùng `border-l border-dashed border-[#f59e0b]/40` thay vạch đặc (đặc = đã đi qua, đứt = sắp tới); (b) EmptyState — bọc `EmptyHeader`+`EmptyContent` đã có (`below-fold` §7) trong khung `rounded-xl border border-dashed border-[#f59e0b]/30 p-8` = "ô trống chờ điền", giữ nguyên icon radar/flask + 2 buttons Reset/Browse.
- Lineage empty: shadcn Empty composition chuẩn `Empty > EmptyHeader (EmptyMedia + EmptyTitle + EmptyDescription) + EmptyContent` — đã chốt ở `below-fold` §7, món này chỉ thêm khung dashed ngoài composition đó, không sửa composition.
- Chi phí perf: **0** — border tĩnh.
- Tắt reduced-motion: không cần (tĩnh; khác skeleton pulse trong cùng EmptyState flow — skeleton giữ gate cũ).
- Áp cho: **1 connector Journey (đoạn tới future-stop) + 1 khung Explorer empty-state** (2 vị trí, cấm rải dashed sang card/divider khác để nét đứt giữ nghĩa "chưa có").
- Contrast/a11y: nét đứt là non-text → 3:1 với `#080b14` — <https://webaim.org/articles/contrast/> (§1.4.11); khung empty không thay thế text (title/description giữ 4.5:1, `aria-live="polite"` giữ nguyên).
- Có cần thêm content file không: **KHÔNG**.

## 7. Footer links hover: gạch chân kiểu dotted/wavy (`text-decoration-style`, hover-only)

- Vấn đề nó giải quyết: footer link lists đã có markers ◆ (`decor` §9) nhưng hover chỉ đổi màu chữ — 1 kiểu gạch chân lạ (chấm/wavy gold) cho hover cảm giác "hand-finished" mà vẫn là underline thật (không phải pseudo-element vẽ thêm).
- Điểm khác với cái đã có (không trùng): underline offset gold (`visual-fx` §2) chốt **offset + màu** (`underline-offset-4`, `decoration-[#f59e0b]/60 → #fcd34d`) — món này chốt **kiểu nét** (style), chiều trực giao chưa ai đụng (grep `src/` không có `decoration-dotted`/`decoration-wavy`).
- Nguồn kỹ thuật: Tailwind publish mapping 1:1 — `decoration-dotted`/`decoration-dashed`/`decoration-wavy` → `text-decoration-style` tương ứng, kèm ví dụ `underline decoration-dotted` — <https://tailwindcss.com/docs/text-decoration-style> (mở trực tiếp trong phiên này); MDN định nghĩa 5 giá trị `solid | double | dotted | dashed | wavy` ("Draws a wavy line" cho wavy) — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration-style> (mở trực tiếp trong phiên này) — và initial là `solid` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration-style> (mở trực tiếp trong phiên này) — nên idle giữ `solid` (hoặc không gạch), hover bật `wavy`.
- Cách làm tối giản: footer links `underline decoration-transparent hover:decoration-wavy hover:decoration-[#fcd34d] underline-offset-4` — idle không gạch (decoration-transparent), hover hiện wavy gold; giữ `:focus-visible` outline đã có (wavy chỉ cho hover pointer, keyboard vẫn outline).
- Chi phí perf: **~0** — đổi decoration khi hover, paint text 1 dòng.
- Tắt reduced-motion: không cần (đổi style tức thì, không animation; `text-decoration-style` vốn `discrete` theo MDN).
- Áp cho: **footer link lists duy nhất** (sitemap + legal row); cấm áp vào body links trong đoạn văn (đoạn văn giữ solid để dễ đọc) và Journey tags (đã có markers).
- Contrast/a11y: mọi state hover/focus "must meet the same contrast requirements (and must be evaluated independently)" — <https://webaim.org/articles/contrast/> — chữ link giữ màu `fg-soft` đạt 4.5:1 độc lập, gạch wavy chỉ là cue phụ; wavy không thay thế focus outline cho keyboard.
- Có cần thêm content file không: **KHÔNG**.

## 8. Background section transitions: dải wash gold tuyến tính full-bleed (linear tint band)

- Vấn đề nó giải quyết: chuyển section hiện chỉ có `border-t` đơn / divider ornament / meteor strip (động) — 1 dải wash gold mờ full-bleed cao ~160px giữa 2 section cho cảm giác "sang chương" mà tĩnh hoàn toàn (không loop như meteor, không glyph như ornament).
- Điểm khác với cái đã có (không trùng): `bg-aurora` là **radial** 2 blob gold trang trí nền section; `lamp-cone` là **conic** trên header; scrim (`card-fx` §4) là linear **đen chân ảnh phục vụ đọc chữ** — món này là **linear gold tint full-bleed giữa các section**, hướng + màu + vị trí đều khác 3 token trên.
- Nguồn kỹ thuật: Tailwind publish `bg-linear-to-b` → `linear-gradient(to bottom, var(--tw-gradient-stops))` — <https://tailwindcss.com/docs/background-image> (mở trực tiếp trong phiên này) — kèm color stops `from-… via-… to-…` và stop positions `from-10%`/`via-30%`/`to-90%` — <https://tailwindcss.com/docs/background-image> (mở trực tiếp trong phiên này) — đủ để dựng band `h-40 bg-linear-to-b from-transparent via-[#f59e0b]/[.07] to-transparent` (`aria-hidden`, không chữ bên trong).
- Cách làm tối giản: 1 utility `section-wash` trong `tokens.css` (3 dòng: direction + stops), đặt tối đa 2 vị trí (trên Ecosystem, trên footer nếu footer chưa dùng divider ornament — cấm xếp wash sát ornament/meteor để khỏi 2 transition kề nhau).
- Chi phí perf: **~0** — gradient tĩnh paint 1 lần, không JS.
- Tắt reduced-motion: không cần (tĩnh sẵn).
- Áp cho: **tối đa 2 transition** (Ecosystem-top + footer-top dự kiến; nếu 1 trong 2 đã có ornament thì nhường ornament, không xếp chồng).
- Contrast/a11y: band thuần decorative → `aria-hidden="true"`, opacity peak 7% để chữ section kề không rớt contrast (đo chữ trên điểm sáng nhất của band nếu band chạm text — thực hành band đứng riêng strip nên không phủ chữ nào).
- Có cần thêm content file không: **KHÔNG**.

---

## 9. Bảng xếp wow / rủi ro + thứ tự triển khai (chỉ tính file này)

| # | Decor (§) | Wow | Rủi ro | Một câu chốt + nguồn chính |
|---|-----------|-----|--------|-----------------------------|
| 1 | Ghost outline header (§1) | ★★★★ | ~0 | Stroke-only text, grep xác nhận chưa tồn tại — shorthand width+color — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/-webkit-text-stroke>. |
| 2 | fieldset/legend sidebar (§2) | ★★★★ | ~0 | Semantics group + caption khắc viền, role `group` miễn phí — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset>; lineage SidebarGroup — <https://ui.shadcn.com/docs/components/base/sidebar>. |
| 3 | Diamond nodes + halo (§5) | ★★★★ | ~0 | Vuông xoay 45° + halo offset — `rotate-45` — <https://tailwindcss.com/docs/rotate>, `outline-offset-4` — <https://tailwindcss.com/docs/outline-offset>; lineage TimelineEntry — <https://ui.aceternity.com/components/timeline>. |
| 4 | Dashed kép nghĩa (§6) | ★★★ | 0 | 1 giá trị `dashed` cho 2 vị trí "chưa có", discrete-tĩnh — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-style>. |
| 5 | :focus-within panel (§3) | ★★★ | ~0 | Sáng cả panel khi con được focus, ví dụ form-chuẩn MDN — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-within>. |
| 6 | Placeholder mono (§4) | ★★★ | thấp | Set color explicit cho đồng nhất cross-browser, giữ `<label>` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::placeholder>; lineage Field+Label — <https://ui.shadcn.com/docs/components/base/input>. |
| 7 | Wavy footer hover (§7) | ★★★ | ~0 | Chiều style trực giao với offset đã có — utilities — <https://tailwindcss.com/docs/text-decoration-style>, 5 giá trị — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration-style>. |
| 8 | Wash band transition (§8) | ★★★ | ~0 | Linear tint tĩnh thay meteor động — `bg-linear-to-b` + stops — <https://tailwindcss.com/docs/background-image>. |

- Thứ tự triển khai khuyến nghị: §2 → §3 → §4 (sidebar trước: khung + focus + placeholder là 1 cụm) → §5 → §6 (Journey: nodes trước, dashed sau) → §1 → §7 → §8 (điểm nhấn + transition sau cùng, dễ revert từng cái).
- Công tắc chung giữ nguyên: block `prefers-reduced-motion: reduce` trong `src/styles/tokens.css` (8 món tĩnh sẵn, không cần gate JS riêng).

## 10. Blacklist (giữ toàn bộ cũ + cap cho file này)

- Giữ blacklist cũ từ `docs/research-decor-fx.md` §12 + `docs/research-below-fold-fx.md` §11 + `docs/research-card-fx.md` §11: **no back-to-top, no live-clock, no meme/doge, no magnetic toàn trang, no spotlight toàn trang, no canvas starfield full-sky mới, no parallax/pin, no custom scrollbar, no fake screenshot posing as UI, no Recharts runtime cho strip trang trí, no tooltip hover-only, no language-bar width animation**.
- Giữ toàn bộ cap số lượng cũ: marquee ≤1; tilt ≤1 card; moving-border động ≤1 CTA; cursor glow ≤2 section; lamp ≤2 header; noise 1 layer; meteors 1 strip `number ≤3`; sparkles 1 CTA band density thấp nhất; sparkline 1 strip SVG tĩnh; avatar stack ≤2 vị trí ≤8 avatar; pointer-highlight ≤3 section header; install-command chỉ rows Package; language-bar Featured lead + Explorer rows; skeleton Explorer only <300ms; grid biến thể ≤3 section; divider ornament ≤3 vị trí; corner ticks ≤4 card; quote-mark ≤2; drop-cap 1 đoạn; kbd Explorer + ≤1 footer; index tabs 1 dải desktop-only; watermark 1 footer; markers footer + Journey tags; double-rules ≤2; Strip side ≤ số Strip hiện có; title-đè-ảnh ≤2 Poster; image-glow Poster + lead; hover zoom cap 1.04; badge góc ảnh ≤2/card; eyebrow pill Poster only.
- Cap mới từ file này: ghost-stroke **≤2 header**, cấm kề số nền (§1); fieldset **3 nhóm** Category/Tags/Sort, search đứng ngoài (§2); focus-within **2 container** sidebar + search (§3); placeholder **1 input Explorer** (§4); diamond nodes **Journey only**, halo **1 node current** (§5); dashed **1 connector + 1 empty-frame**, cấm rải (§6); wavy hover **footer links only**, cấm body text (§7); wash band **≤2 transition**, cấm kề ornament/meteor (§8).
- Loại thẳng từ danh sách ứng viên: **shadcn Fieldset component** (không tồn tại — 2 slug đoán đều 404 trong phiên này, dùng SidebarGroup/Input lineage thay thế); **`disabled` fieldset tắt filter** (không có nhu cầu disable, thêm attr là thêm rủi ro form); **node tròn/số thứ tự cho Journey** (số nền đã có ở header, node cần hình-dạng không cần số); **wash band có chữ** (band là transition thuần, chữ trong band mờ 7% là tự sát contrast).

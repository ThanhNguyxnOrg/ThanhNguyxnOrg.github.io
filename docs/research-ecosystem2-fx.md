# Research: Ecosystem2 FX — rows/list trình bày cho "Where the code lives."

> Context site áp dụng: Astro static 1 trang, section `Ecosystem` (`src/sections/Ecosystem.tsx`, 106 dòng), nền `#080b14`, accent gold `#f59e0b`/`#fcd34d`, font Space Grotesk / Inter / JetBrains Mono, Tailwind v4.
> Phạm vi file này: **chỉ** cách trình bày danh sách link dạng rows (org profile / packages / people) — cân cột trái/phải, rút gọn copy, row hover, group headers theo kind, zebra, sticky header, snapshot placement, empty/loading.
> Quy tắc file này: CHỈ primary sources (trang mở trực tiếp bằng fetch ngày 2026-10-12 trong phiên này). Mỗi claim kèm URL nguồn ngay sau câu.
> Không trùng: `docs/research-ecosystem-fx.md` (đã chốt: numbered rows `01…06`, version/download chips, install-command copy `npm i <pkg>`, avatar 32px + fallback, bot row, `divider-orn` — file này không đề xuất lại); `src/styles/tokens.css` (đã có `tabular`, `focus-ring`, `transition-ui`, `divider-orn`, `text-gradient-gold`, kill-switch `prefers-reduced-motion: reduce` — file này chỉ dùng lại, không tạo token mới).

## 0. Hiện trạng code và log fetch

- Hiện trạng `Ecosystem.tsx`: `section#packages` > `div.grid lg:grid-cols-12` > cột trái `lg:col-span-5` (`SectionHeader` + snapshot box dashed) + cột phải `ul lg:col-span-7` rows `grid-cols-[2.5rem_1fr_auto]` (`src/sections/Ecosystem.tsx:23-40`).
- Rows hiện tại đã có: số thứ tự mono, kind mono gold, label display + avatar/version/download chips, description `body-sm`, lệnh copy cho Package, `ArrowUpRight` / `Pending` (`src/sections/Ecosystem.tsx:44-99`).
- Vấn đề user nêu: chữ loạn (description dài không clamp, không group), thiếu decor (hover chỉ `hover:bg-surface`, không zebra, không sticky, snapshot nằm dưới header đẩy cột trái dài, không empty/loading khi bake lỗi).
- Log fetch phiên này (mở trực tiếp, không viết theo trí nhớ): MDN `<ul>` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul>; MDN `position` (gồm sticky + ví dụ sticky headings cho list A/B/C) — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position>; MDN `:empty` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:empty>; MDN `:hover` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:hover>; MDN `<section>` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section>; Tailwind `divide-width` (mục Between children) — <https://tailwindcss.com/docs/divide-width>; Tailwind `position` (mục Sticky positioning elements, ví dụ contacts A/B/C) — <https://tailwindcss.com/docs/position>; Tailwind `hover-focus-and-other-states` (mục group-hover, first/last, odd/even table) — <https://tailwindcss.com/docs/hover-focus-and-other-states>; Tailwind `line-clamp` — <https://tailwindcss.com/docs/line-clamp>; Tailwind `text-overflow` (`truncate`) — <https://tailwindcss.com/docs/text-overflow>; shadcn Separator (mục List) — <https://ui.shadcn.com/docs/components/separator>; shadcn Item (composition + Group/Header/Separator/Link/variant/size) — <https://ui.shadcn.com/docs/components/base/item>; shadcn Table (composition + Caption/Header/Footer) — <https://ui.shadcn.com/docs/components/base/table>; shadcn Empty (composition) — <https://ui.shadcn.com/docs/components/base/empty>; shadcn Skeleton ("placeholder while loading" + variant Table) — <https://ui.shadcn.com/docs/components/base/skeleton>; shadcn Card (composition Header/Content/Footer) — <https://ui.shadcn.com/docs/components/base/card>; Aceternity Timeline ("sticky header and scroll beam") — <https://ui.aceternity.com/components/timeline>; Dub homepage (footer nhóm Product/Solutions/Resources/Company/Compare) — <https://dub.co>; Linear homepage (footer nhóm Product/Features/Company/Resources/Connect/Legal + board Backlog/Todo/In Progress/Done) — <https://linear.app>.
- Giới hạn công cụ: fetch trả markdown đã strip nên màu pixel/độ mượt **không xác thực được** — toàn bộ đề xuất dưới đây đều **tĩnh + CSS-only**, nên giới hạn này không ảnh hưởng.

---

## 1. Cân cột trái/phải: cột trái sticky, cột phải list thuần

- Vấn đề nó giải quyết: cột trái (`SectionHeader` + snapshot box) hiện cuộn mất cùng rows, user đọc row 5–6 không còn context "Where the code lives." (`src/sections/Ecosystem.tsx:26-39`).
- Cách làm tối giản: cột trái thêm `lg:sticky lg:top-24 lg:self-start` — sticky là "positioned as `relative` until it crosses a specified threshold, then treat it as `fixed` until its parent is off screen" — <https://tailwindcss.com/docs/position> — ngưỡng `top-24` chừa chỗ nav; cột phải giữ `ul` hiện tại, không đổi grid rows.
- Lineage sticky-rail: Aceternity Timeline được mô tả đúng pattern này — "A timeline component with sticky header and scroll beam follow." — <https://ui.aceternity.com/components/timeline> — áp vào đây là sticky **text rail** thay vì timeline beam (không mang beam/scroll-JS theo).
- Rào kỹ thuật: sticky "always creates a new stacking context" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position> — nên cột trái không đặt `z-index` cao hơn rows, tránh đè `ArrowUpRight` focus-ring; chỉ sticky từ `lg:` trở lên, mobile giữ flow dọc (tránh sticky chiếm viewport 360px).
- Perf: **0** — CSS-only, không JS.
- Reduced-motion: không cần (sticky không phải animation).
- A11y: sticky không đổi DOM order nên screen reader đọc header trước list như cũ; `<section>` hiện đã có `aria-labelledby="eco-title"` (`src/sections/Ecosystem.tsx:23`) — giữ nguyên.

## 2. Rút gọn copy: `line-clamp-2` cho description, `truncate` cho label/handle

- Vấn đề nó giải quyết: description mấy rows Package/People dài 1–3 dòng không đều nhau gây "chữ loạn"; label + handle `@login` có thể tràn trên mobile.
- Cách làm: description thêm `line-clamp-2` — utilities "for clamping text to a specific number of lines" với ví dụ `line-clamp-3` cho đoạn văn dài — <https://tailwindcss.com/docs/line-clamp>; label/handle 1 dòng thêm `truncate` — `truncate` = "`overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`" — <https://tailwindcss.com/docs/text-overflow>.
- Quy tắc áp: description clamp **2 dòng** (đủ đọc, rows đều nhau); `npm i <pkg>` và version/download chips **không clamp** (code/data phải nguyên); `lg:line-clamp-none` không dùng ở đây vì list cần nhịp đều cả desktop (ngược với pattern undo-clamp `lg:line-clamp-none` cho article — <https://tailwindcss.com/docs/line-clamp> — không áp).
- Không trùng: chips mono đã chốt ở ecosystem-fx §2–§3 giữ nguyên; file này chỉ giới hạn **độ dài text**, không tách chip mới.
- Perf: **0** — CSS-only.
- Reduced-motion: không cần.
- A11y: clamp bằng CSS vẫn giữ full text trong DOM nên screen reader đọc đủ; không dùng `title=` tooltip thay thế (tooltip hover-only đã blacklist ở ecosystem-fx §9).

## 3. Row hover states 3 lớp (bg + gold inset + arrow), không giấu thông tin sau hover

- Vấn đề nó giải quyết: hover hiện tại chỉ `hover:bg-surface` (`src/sections/Ecosystem.tsx:93`), rows link trông như text tĩnh, user không biết cả row bấm được.
- Cách làm (CSS-only, dùng lại `transition-ui` đã có): (a) `hover:bg-surface` giữ; (b) thêm inset trái gold 2px qua `box-shadow: inset 2px 0 0 gold` hoặc `border-l` — chọn `box-shadow` để không đổi layout; (c) arrow `group-hover:translate + group-hover:text-secondary` đã có (`src/sections/Ecosystem.tsx:83`) giữ + thêm `group-hover:text-primary-text` cho kind label. Pattern parent-state chuẩn Tailwind: "mark the parent with the `group` class, and use `group-*` variants like `group-hover` to style the target" — <https://tailwindcss.com/docs/hover-focus-and-other-states>; lineage component: shadcn Item "Use the `render` prop to render the item as a link. The hover and focus states will be applied to the anchor element." — <https://ui.shadcn.com/docs/components/base/item> — đúng cấu trúc `<a>` bọc row hiện tại.
- Rào bắt buộc: `:hover` "is problematic on touchscreens… might never match… Web developers should make sure that content is accessible on devices with limited or non-existent hovering" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:hover> — nên hover chỉ là **decor cộng thêm** (bg/inset/arrow), mọi thông tin (version, downloads, lệnh copy, Pending) luôn hiển thị không-hover; thêm `focus-visible` cùng style với hover qua `focus-ring` đã có.
- Perf: **0** — CSS-only, `transition-ui` đã có trong tokens.
- Reduced-motion: giữ kill-switch toàn cục đã có (`tokens.css:310-318`); hover là đổi màu/dịch 2px, không animation loop.
- A11y: cả row là 1 `<a>` duy nhất đã chốt (ecosystem-fx §5), không thêm tab-stop; `Pending` rows không phải link nên không có hover-link (tránh fake affordance).

## 4. Group headers theo kind (Organization / Packages / People), không thêm row mới

- Vấn đề nó giải quyết: 6 rows phẳng `01…06` trộn 4 kinds, mắt phải đọc kind mono từng row mới phân loại được.
- Cách làm: giữ 1 `ul` + số thứ tự liên tục, chèn **non-link header rows** (`li aria-hidden` hoặc `li > h3`) trước mỗi nhóm kind: `Organization (01) / Packages (02–03) / Resources (04) / People (05–06)`. Semantics: `<section>` "should always have a heading" và "each `<section>` should be identified, typically by including a heading as a child" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section> — áp ở cấp nhóm: mỗi nhóm list có heading `h3` mono micro gold + count (`Packages · 2`).
- Lineage grouping: shadcn Item có sẵn composition nhóm — "`ItemGroup` to group related items" + "`ItemHeader` to add a header above the item content" + "`ItemSeparator` between items" — <https://ui.shadcn.com/docs/components/base/item>; shadcn Table có composition `Table > TableHeader > TableRow > TableHead` riêng khỏi `TableBody` — <https://ui.shadcn.com/docs/components/base/table> — tức header nhóm tách khỏi body rows là pattern chuẩn, không phải ý tưởng lạ.
- Lineage footer thực tế: Dub gom links footer thành nhóm có nhãn Product / Solutions / Resources / Company / Compare — <https://dub.co>; Linear gom footer thành Product / Features / Company / Resources / Connect / Legal và board thành Backlog / Todo / In Progress / Done — <https://linear.app> — cùng nguyên tắc "flat link list → labeled groups", áp vào Ecosystem là group headers theo `kind` đã có trong type `EcoResource`.
- Cấu trúc cho phép: `<ul>` "Permitted content: Zero or more `<li>`…" với "Implicit ARIA role: `list`" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul> — header nhóm là `li` chứa `h3`, không phá role list; không dùng nested `ul` trừ khi cần (quy tắc "To nest a list, place it inside an `<li>`" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul> — chỉ dùng nếu tách hẳn 4 `ul` con, mặc định khuyến nghị 1 `ul` + header `li` đơn giản hơn).
- Không trùng: kind mono chip từng row giữ nguyên (ecosystem-fx §2); header nhóm là **nhãn nhóm**, không thay chip row.
- Perf: **0** — thêm 3–4 `li` tĩnh.
- A11y: header `li` đặt `aria-hidden="true"` nếu chỉ decor lặp lại kind (vì kind đã có text từng row), HOẶC dùng `h3` thật nếu muốn SR điều hướng theo nhóm — quyết lúc implement, mặc định khuyến nghị `h3` thật vì có count khác với kind row.

## 5. Zebra siêu nhạt + trim first/last (thay vì divider đậm mọi row)

- Vấn đề nó giải quyết: hiện mọi row `border-b border-border` đều nhau (`src/sections/Ecosystem.tsx:89`), list 6 rows trông như kẻ vở; border đậm + description dài = rối.
- Cách làm: giữ `border-b` nhưng làm zebra **siêu nhạt chỉ trên nền**, không đổi chữ: `even:bg-white/[0.015]` (gold tint `even:bg-[#f59e0b]/[0.03]` là trần tối đa, test contrast sau). Pattern chuẩn Tailwind: "`odd:bg-white even:bg-gray-50`" cho `tr` trong `tbody` — <https://tailwindcss.com/docs/hover-focus-and-other-states> — áp vào `li` thay vì `tr`; trim padding đầu/cuối list bằng "`first:pt-0 last:pb-0`" như ví dụ people-list — <https://tailwindcss.com/docs/hover-focus-and-other-states>.
- Quan hệ với divider hiện tại: shadcn Separator có variant "Horizontal separators between list items" — <https://ui.shadcn.com/docs/components/separator> — và Tailwind có "Use utilities like `divide-x` and `divide-y-4` to add borders between child elements" — <https://tailwindcss.com/docs/divide-width> — tức có 2 cách vẽ ngăn cách (border từng row vs divide của parent); chốt giữ `border-b` hiện tại (ít đụng code nhất), zebra chỉ là lớp nền phụ, không thay divider-orn section.
- Không trùng: `divider-orn` đầu section giữ nguyên; zebra áp **trong** list, ornament áp **ngoài** list.
- Perf: **0**.
- Reduced-motion: không cần.
- A11y: zebra là `background-color` thuần decor, chữ giữ `fg`/`fg-muted` 4.5:1 trên `#080b14`; không dùng màu làm tín hiệu duy nhất (số thứ tự + header nhóm §4 vẫn mang thông tin).

## 6. Sticky group subheaders trong cột list (kế thừa list A/B/C)

- Vấn đề nó giải quyết: khi cuộn 6 rows (+ copy lệnh + avatar), user quên đang ở nhóm nào nếu §4 đã thêm headers mà headers cuộn mất.
- Cách làm: header nhóm §4 thêm `sticky top-16` + nền đặc `bg-[#080b14]/95 backdrop-blur` + `border-b`. Chuẩn Tailwind: "Use the `sticky` utility to position an element as `relative` until it crosses a specified threshold, then treat it as `fixed`" với ví dụ danh bạ sticky `A / B / C` trên từng nhóm contacts — <https://tailwindcss.com/docs/position> — áp y hệt cho `Organization / Packages / People`.
- Rào kỹ thuật MDN: "A common use for sticky positioning is for the headings in an alphabetized list. The `B` heading will appear just below the items that begin with `A` until they are scrolled offscreen" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position> — và "At least one inset property needs to be set to a non-`auto` value" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position> — nên bắt buộc set `top-*` (khuyến nghị `top-16` dưới nav sticky, không phải `top-0` đè nav).
- Quan hệ với §1: §1 sticky **cột trái** (rail), §6 sticky **headers trong cột phải** — 2 sticky khác trục, không thay nhau; nếu chỉ được chọn 1 thì ưu tiên §1 (rẻ hơn, ít rủi ro đè chữ hơn sticky nhiều headers).
- Perf/a11y: CSS-only; sticky headers có nền đặc để chữ list không xuyên qua (rào che chữ đã nêu ở MDN position Accessibility — tránh obscure content khi zoom — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position>).

## 7. Snapshot box: từ "hộp lẻ dưới header" thành `CardFooter` của cột trái

- Vấn đề nó giải quyết: snapshot hiện là `div dashed` lẻ giữa header và list (`src/sections/Ecosystem.tsx:32-38`), trên desktop nó kéo cột trái dài lệch với list, trên mobile nó chen giữa title và links.
- Cách làm: bọc cột trái thành shadcn Card mini: `CardHeader(CardTitle = "Where the code lives." + CardDescription)` + `CardContent(Snapshot…)` + `CardFooter("Numbers refresh daily…")` — composition chuẩn "`Card > CardHeader(CardTitle/CardDescription/CardAction) + CardContent + CardFooter`" — <https://ui.shadcn.com/docs/components/base/card> — không cần mang component shadcn thật, chỉ mượn **thứ tự khối** để snapshot thành footer meta thay vì hộp lạc.
- Chi tiết: tách dòng hiện tại "`Snapshot {fetchedAt}.` + `Numbers refresh daily…`" thành 2 vai: `CardContent` giữ `Snapshot {fetchedAt}` mono (data), `CardFooter` giữ câu refresh daily (meta) với `text-micro fg-subtle`; thêm `size="sm"` concept ("small size variant uses smaller spacing" — <https://ui.shadcn.com/docs/components/base/card>) vì cột trái chỉ 5/12.
- Không trùng: nội dung snapshot giữ nguyên chữ, chỉ đổi **vị trí/vai**; không thêm số liệu mới, không đụng chips/avatar.
- Perf: **0** — sắp xếp lại div tĩnh.
- A11y: snapshot là text meta (`<p>`), không interactive; `fetchedAt` là `<time>` nếu parse được date, ngược lại giữ `span` mono (không claim semantics mới ngoài Card composition đã dẫn).

## 8. Empty + loading states cho list bake (khi `resources` rỗng / sync lỗi)

- Vấn đề nó giải quyết: pipeline `scripts/sync.ts` giữ số cũ khi registry lỗi (đã ghi ở ecosystem-fx §0), nhưng nếu bake trả `resources = []` thì `ul` render trống — section chỉ còn header trơ, user tưởng site gãy.
- Empty state: khi `resources.length === 0`, render 1 khối Empty thay `ul`: composition "`Empty > EmptyHeader(EmptyMedia + EmptyTitle + EmptyDescription) + EmptyContent`" — <https://ui.shadcn.com/docs/components/base/empty> — ví dụ `EmptyTitle "No data"` + `EmptyDescription` + nút/link `EmptyContent` — <https://ui.shadcn.com/docs/components/base/empty> — áp vào đây: Title "Ecosystem feed unavailable.", Description "Snapshot build failed — links back on next daily sync.", Content link GitHub org (link thật duy nhất chắc chắn sống).
- Loading/skeleton (cho dev preview + tương lai hydrat hóa, Astro static hiện tại bake-time nên skeleton chỉ hiển thị nếu có client fetch): text shadcn "Use to show a placeholder while content is loading." — <https://ui.shadcn.com/docs/components/base/skeleton> — và có sẵn variant "`SkeletonTable`" cho rows dạng bảng — <https://ui.shadcn.com/docs/components/base/skeleton> — áp vào đây là 3 skeleton rows (`h-16` + avatar circle + lines) với `aria-hidden`, KHÔNG animation shimmer lạ (giữ `transition-ui` hiện có).
- Hook CSS phát hiện rỗng (optional, không JS): `:empty` "represents any element that has no children" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:empty> — có thể style `ul:empty` thành min-height + message, nhưng mặc định khuyến nghị render Empty block có chữ rõ nghĩa thay vì CSS-only vì SR cần text.
- Không trùng: `Pending` cho từng row lẻ (url null) giữ nguyên; Empty ở đây là **cả list rỗng**, khác cấp độ.
- Perf: **0 khi không kích hoạt** (nhánh render điều kiện, không thêm dependency).
- A11y: Empty block dùng heading + text thật (không `aria-hidden`); skeleton (nếu dùng) `aria-hidden="true"` + `role="status"` text "Loading ecosystem…" cho SR.

---

## 9. A11y / perf / reduced-motion tổng (chỉ tính file này)

| Món (§) | Perf | Reduced-motion | A11y chốt + nguồn |
|---|---|---|---|
| Sticky rail trái (§1) | 0 (CSS) | không cần | giữ DOM order + `aria-labelledby` đã có; sticky tạo stacking context — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position> |
| Clamp copy (§2) | 0 | không cần | full text vẫn trong DOM; `truncate` công thức overflow/ellipsis/nowrap — <https://tailwindcss.com/docs/text-overflow>; clamp đa dòng — <https://tailwindcss.com/docs/line-clamp> |
| Row hover (§3) | 0 | kill-switch có sẵn | hover decor-only, touch rào — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:hover>; parent-state `group-hover` — <https://tailwindcss.com/docs/hover-focus-and-other-states>; link-hover states — <https://ui.shadcn.com/docs/components/base/item> |
| Group headers (§4) | 0 (3–4 `li`) | không cần | mỗi nhóm có heading — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section>; list role — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul>; grouping lineage Dub/Linear — <https://dub.co>, <https://linear.app> |
| Zebra + trim (§5) | 0 | không cần | màu decor-only; `odd/even` + `first/last` pattern — <https://tailwindcss.com/docs/hover-focus-and-other-states>; separators-between-items lineage — <https://ui.shadcn.com/docs/components/separator>, <https://tailwindcss.com/docs/divide-width> |
| Sticky subheaders (§6) | 0 | không cần | sticky A/B/C pattern — <https://tailwindcss.com/docs/position>; sticky headings list + threshold rule — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position>; sticky-rail lineage — <https://ui.aceternity.com/components/timeline> |
| Snapshot CardFooter (§7) | 0 | không cần | composition Header/Content/Footer + `size="sm"` — <https://ui.shadcn.com/docs/components/base/card> |
| Empty/Skeleton (§8) | 0 khi không kích hoạt | không cần (không shimmer) | Empty composition — <https://ui.shadcn.com/docs/components/base/empty>; Skeleton placeholder + Table variant — <https://ui.shadcn.com/docs/components/base/skeleton>; `:empty` hook — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:empty> |

- Công tắc chung giữ nguyên: block `prefers-reduced-motion: reduce` trong `src/styles/tokens.css:310-318` (8 món file này tĩnh/CSS-only nên không cần gate JS riêng).
- Cap số lượng cho section này: headers nhóm **≤4** (theo 4–5 kinds của `EcoResource`); zebra **1 tint duy nhất**; sticky **≤2 trục** (§1 rail + §6 subheaders); snapshot **1 box**; Empty/Skeleton **1 nhánh điều kiện**.

## 10. Bảng xếp wow / rủi ro + thứ tự triển khai (chỉ tính file này)

| # | Món (§) | Wow | Rủi ro | Một câu chốt + nguồn chính |
|---|---|---|---|---|
| 1 | Group headers (§4) | ★★★★★ | ~0 | Hết "chữ loạn" nhanh nhất; grouping lineage — <https://ui.shadcn.com/docs/components/base/item>, <https://dub.co>, <https://linear.app> |
| 2 | Clamp copy (§2) | ★★★★ | ~0 | Rows đều nhau 1 phát; clamp — <https://tailwindcss.com/docs/line-clamp>, <https://tailwindcss.com/docs/text-overflow> |
| 3 | Row hover 3 lớp (§3) | ★★★★ | thấp | Rows link lộ affordance; group-hover — <https://tailwindcss.com/docs/hover-focus-and-other-states>; touch rào — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:hover> |
| 4 | Sticky rail trái (§1) | ★★★ | ~0 | Context không mất khi cuộn; sticky rail lineage — <https://ui.aceternity.com/components/timeline>, <https://tailwindcss.com/docs/position> |
| 5 | Snapshot CardFooter (§7) | ★★★ | ~0 | Hết hộp lạc; Card composition — <https://ui.shadcn.com/docs/components/base/card> |
| 6 | Zebra + trim (§5) | ★★ | ~0 | Nhịp list mịn; odd/even + first/last — <https://tailwindcss.com/docs/hover-focus-and-other-states> |
| 7 | Sticky subheaders (§6) | ★★★ | thấp–trung bình | Chỉ làm sau §4; A/B/C pattern — <https://tailwindcss.com/docs/position>, <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position> |
| 8 | Empty/Skeleton (§8) | ★★ | ~0 | Chống section trơ khi bake lỗi; Empty — <https://ui.shadcn.com/docs/components/base/empty>; Skeleton — <https://ui.shadcn.com/docs/components/base/skeleton> |

- Thứ tự triển khai khuyến nghị: §4 → §2 → §3 → §1 → §7 → §5 → §8 → §6 (nhóm + chữ trước; hover/rail/snapshot sau; zebra/empty/sticky-subheaders cuối).
- Thay đổi code dự kiến (không làm trong file research này): cột trái thêm `sticky self-start`; description thêm `line-clamp-2`; rows thêm shadow-inset hover; chèn 3–4 header `li`; snapshot tách Content/Footer; thêm nhánh `resources.length === 0`.

## 11. Blacklist + cam kết không trùng (cho file ecosystem2 này)

- Giữ toàn bộ blacklist cũ (ecosystem-fx §9 + decor-fx §12): no back-to-top, no live-clock, no meme, no magnetic/spotlight toàn trang, no starfield mới, no parallax/pin, no custom scrollbar, no fake screenshot, no Recharts, no tooltip hover-only, no language-bar width animation, no syntax-highlighter runtime, no avatar-stack gộp People.
- Không đề xuất lại món ecosystem-fx đã chốt: numbered rows, version/download chips, install-command copy, avatar + fallback, bot row, `divider-orn`.
- Loại thẳng cho section này: **sticky toàn section** (chỉ sticky rail/subheaders, không pin cả section); **zebra màu mạnh/vân** (chỉ 1 tint ≤3% overlay); **clamp code/chips** (chỉ clamp description/label); **hover giấu thông tin** (hover decor-only, touch rào — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:hover>); **skeleton shimmer loop** (tĩnh, Skeleton text-only — <https://ui.shadcn.com/docs/components/base/skeleton>); **group headers không heading** (mỗi nhóm phải có heading — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section>).

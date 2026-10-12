# Research: Ảnh cover 2:1 (1280x640 social-preview) trong cards + decor Featured/Explorer

> Context site áp dụng: Astro static 1 trang, nền `#080b14`, accent gold `#f59e0b`/`#fcd34d`, font Space Grotesk / Inter / JetBrains Mono, Tailwind v4, GSAP. Ảnh cover là social-preview boards 1280x640 = đúng tỉ lệ 2:1.
> Hiện trạng code đã đọc (ngày 2026-10-12, trong phiên này): `src/sections/Featured.tsx` — Poster `ProjectVisual … className="aspect-[2/1] overflow-hidden rounded-lg border border-border"` (đẹp, đúng tỉ lệ nguồn); lead card `ProjectVisual … className="aspect-[2/1] lg:col-span-7"` (đẹp); Strip `ProjectVisual … className="order-first min-h-48 md:order-none md:col-span-2"` (KHÔNG aspect — dải side-band cao phụ thuộc row, visual side-by-side bị stretch/crop thất thường); `src/sections/Explorer.tsx` — thumb `ProjectVisual … label={false} className="hidden aspect-square overflow-hidden rounded-md border border-border sm:block"` trong row `sm:grid-cols-[8rem_1fr]` (vuông 8rem, ẩn hẳn dưới `sm`); `src/site/ProjectBits.tsx` — `ProjectVisual` render `<img … className="absolute inset-0 size-full object-cover">` khi có `image`, fallback `ProjectGlyph` khi không (quy ước "no fake screenshots" giữ nguyên).
> Quy tắc file này: CHỈ primary sources (trang mở trực tiếp bằng fetch ngày 2026-10-12 trong phiên này, docs chính thức). Mỗi claim kèm URL nguồn ngay sau câu.
> Không trùng: `src/styles/tokens.css` (đã có `bg-blueprint` 48px, `bg-blueprint-fine` 24px gold 3%, `bg-dots-gold`, `bg-aurora`, `text-gradient-gold`, `tabular`, `marquee-track`, `border-gold-hover`, `lamp-cone`, `section-glow`, `noise-overlay`, `focus-ring`, `card-ticks`, `divider-orn`, `::selection` gold, `:focus-visible` gold), `src/sections/Featured.tsx` (TiltCard + border-gold-hover + ProjectVisual + SyncStats), `src/sections/Explorer.tsx` (filter sidebar + ToggleChip + EmptyState SearchX + `bg-dots-gold`), `docs/research-decor-fx.md` (10 món: grid biến thể, divider ornament, corner ticks, quote-mark, drop-cap, kbd hints, index tabs, footer watermark, list markers, double-rules), `docs/research-below-fold-fx.md` (§1 language-bar, §2 stat chips, §3 sparkline, §4 avatar stack, §5 pointer-highlight + số nền, §6 meteor divider, §7 skeleton/empty/counts, §8 install-command, §9 sparkles CTA).

## 0. Phương pháp, giới hạn quan sát và log fetch

- Tất cả URL §1–§9 được **mở trực tiếp bằng fetch ngày 2026-10-12**, không viết theo trí nhớ.
- **1 URL 404 trong phiên này:** slug đoán `https://ui.aceternity.com/components/3d-card` trả 404, đã sửa thành slug đúng `https://ui.aceternity.com/components/3d-card-effect` và mở thành công — <https://ui.aceternity.com/components/3d-card-effect> (mở trực tiếp trong phiên này). Còn lại 0 lỗi.
- Giới hạn công cụ: fetch trả về nội dung/cấu trúc (markdown đã strip) nên màu pixel/độ mượt **không xác thực được** — file này chỉ nêu cấu trúc/props/CSS đã publish.
- File này **không claim** site production nào dùng pattern nào; lineage duy nhất là demo live Aceternity + docs chính thức (MDN, Tailwind, shadcn).

---

## 1. Layout cho ảnh 2:1 trong card cột hẹp: stack (chuẩn) vs side (off-label)

- Pattern chuẩn của shadcn Card cho ảnh là **stack**: "Add an image before the card header to create a card with an image" — <https://ui.shadcn.com/docs/components/card> (mở trực tiếp trong phiên này) — tức ảnh nằm trên, header/content/footer dưới, đúng cấu trúc Poster hiện tại nên Poster giữ nguyên.
- Composition chuẩn của Card là `Card > CardHeader (CardTitle + CardDescription + CardAction) + CardContent + CardFooter` — <https://ui.shadcn.com/docs/components/card> (mở trực tiếp trong phiên này) — không có slot "side media" nào, nên Strip side-by-side là off-label so với docs.
- Shadcn còn publish kỹ thuật edge-to-edge cho ảnh trong card: "Use negative margins with `-mx-(--card-spacing)` to make content go edge to edge while keeping it aligned with the card inset" và root tự xử lý `has-[>img:first-child]:pt-0` + `*:[img:first-child]:rounded-t-xl` — <https://ui.shadcn.com/docs/components/card> (mở trực tiếp trong phiên này) — tức ảnh stack được phép tràn full-bleed tới viền card, là cơ sở cho decor overlay/title-đè-ảnh §4–§5.
- Lineage Aceternity cùng hướng: Bento Grid là "A skewed grid layout with Title, description and a header component" với props `items: {title, description, header, icon}` — <https://ui.aceternity.com/components/bento-grid> (mở trực tiếp trong phiên này) — tức visual (`header`) cũng là slot **trên** title/description, không có variant side-media nào trong props.
- Kết luận cho card cột hẹp (`lg:col-span-5` ≈ 1/3 page): **stack luôn thắng** — khung 2:1 giữ đúng tỉ lệ nguồn 1280x640, không crop, không stretch; side chỉ hợp lệ khi cột media đủ rộng (lead `lg:col-span-7` đã đúng) hoặc khi chấp nhận crop có kiểm soát (§2).
- Cách sửa Strip tối giản (0 component mới): hoặc (a) chuyển Strip thành stack như Poster nhưng giữ typographic density (title lớn + SyncStats gọn), hoặc (b) giữ grid 5 cột nhưng khóa media bằng `aspect-[2/1] md:aspect-auto md:h-full` + `object-center` (§2) + `min-h-48` đã có, để box side luôn có 1 chiều auto cho `aspect-ratio` có tác dụng theo MDN — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio> (mở trực tiếp trong phiên này).
- Contrast/a11y: layout stack/side đều không đổi contrast chữ (chữ nằm ngoài ảnh); nếu thêm title-đè-ảnh thì đo lại theo §5.
- Có cần thêm content file không: **KHÔNG**.

## 2. Khung 2:1 + `object-fit`: vì sao Poster đẹp, Strip bị stretch

- MDN định nghĩa `aspect-ratio` "allows you to define the desired width-to-height ratio of an element's box" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio> (mở trực tiếp trong phiên này) — Poster/lead đặt `aspect-[2/1]` trên đúng ảnh nguồn 2:1 nên tỉ lệ khung ≡ tỉ lệ nội dung, không còn gì để crop/stretch.
- Cùng trang MDN rào điều kiện: "At least one of the box's sizes needs to be automatic in order for `aspect-ratio` to have any effect" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio> (mở trực tiếp trong phiên này) — Strip side không đặt aspect nào, box cao phụ thuộc text cột trái nên rơi đúng trường hợp "không có chiều auto" → browser tự kéo visual cho đầy ô, gây stretch.
- Tailwind publish mapping 1:1: `aspect-[<value>]` → `aspect-ratio: <value>;`, kèm `aspect-square` (1/1), `aspect-video` (16/9), `aspect-auto` — <https://tailwindcss.com/docs/aspect-ratio> (mở trực tiếp trong phiên này) — nên `aspect-[2/1]` hiện tại là cách viết chuẩn Tailwind v4, không cần wrapper component.
- Shadcn AspectRatio xác nhận cùng họ API: `<AspectRatio ratio={16 / 9}>` bọc `<Image className="rounded-md object-cover">` — <https://ui.shadcn.com/docs/components/base/aspect-ratio> (mở trực tiếp trong phiên này) — tức pattern "khung ratio + img cover" đã là chuẩn docs, code hiện tại (`aspect-[2/1]` + `object-cover` trong `ProjectBits.tsx`) chỉ là bản utility-first của đúng pattern này.
- MDN phân biệt 5 giá trị `object-fit`: `cover` "filling the element's entire content box… the object will be clipped to fit", `contain` "fitting within… letterboxed/pillarboxed", `fill` là initial "stretched to fit", `none` "not resized", `scale-down` lấy nhỏ hơn của `none`/`contain` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit> (mở trực tiếp trong phiên này) — nên `object-cover` của `ProjectVisual` là lựa chọn đúng duy nhất cho khung 2:1 đầy ảnh; cấm đổi sang `fill` (stretch chữ trong board) hay `none` (tràn khung).
- Tailwind publish đủ 5 utilities tương ứng: `object-cover`, `object-contain`, `object-fill`, `object-none`, `object-scale-down` — <https://tailwindcss.com/docs/object-fit> (mở trực tiếp trong phiên này) — nên mọi đổi fit đều là đổi 1 class, không cần CSS mới.
- Chi phí perf: **0** — aspect + object-fit là layout/paint tĩnh, không JS.
- Tắt reduced-motion: không cần (không motion).
- Có cần thêm content file không: **KHÔNG**.

## 3. Thumb list nhỏ (8rem vuông): cover + hide — cấm contain/fill

- MDN: `cover` lấp đầy box bằng cách clip phần thừa theo tỉ lệ — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit> (mở trực tiếp trong phiên này) — board 2:1 nhét vào thumb vuông 8rem sẽ mất ~50% chiều ngang (2 cạnh trái/phải), giữa vẫn còn glyph/title trung tâm nếu board thiết kế center-safe; đây là trade-off chấp nhận được cho thumb điều hướng.
- MDN: `contain` giữ toàn bộ object nhưng "letterboxed/pillarboxed if its aspect ratio does not match" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit> (mở trực tiếp trong phiên này) — board 2:1 trong ô vuông sẽ sinh 2 dải trống trên/dưới ≈ 25% chiều cao mỗi dải ở 8rem, trông như ảnh lỗi trên nền `#080b14`, nên **cấm** `contain` cho Explorer thumb.
- MDN: `fill` là initial và "will be stretched to fit" khi tỉ lệ lệch — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit> (mở trực tiếp trong phiên này) — board 2:1 bị nén dọc thành 1:1 làm méo text/logo, nên **cấm** `fill`.
- Cứu vãn crop khi giữ `cover`: `object-position` "specifies the alignment of the replaced element's contents within the element's box" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-position> (mở trực tiếp trong phiên này) — và initial là `50% 50%` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-position> (mở trực tiếp trong phiên này) — nên mặc định đã là center-crop cân 2 bên, chỉ cần thêm `object-top` khi board nào dồn headline lên đỉnh.
- Tailwind publish 9 vị trí (`object-center`, `object-top`, `object-bottom`, 4 góc, 2 cạnh) + custom `object-[<value>]` — <https://tailwindcss.com/docs/object-position> (mở trực tiếp trong phiên này) — nên focal-point là 1 class trên `<img>` trong `ProjectVisual`, không cần prop mới nếu hardcode `object-center` làm default.
- Quyết định cho Explorer: **giữ `aspect-square` + `object-cover` + `object-center` trên desktop, giữ `hidden sm:block` (ẩn hẳn dưới `sm`) như hiện tại** — thumb 8rem vốn là affordance nhận diện, mobile đã có title/blurb đủ thông tin nên ẩn là đúng (không tốn 8rem chiều cao cho ảnh bị crop nặng); cấm `contain` (bars), cấm `fill` (méo), cấm ép `aspect-[2/1]` trong row 8rem (thumb dẹt 128px×64px quá nhỏ để nhận diện).
- Contrast/a11y: thumb `alt=""` đã đúng (decorative, title nằm cạnh); giữ nguyên, không đặt thông tin duy nhất trong ảnh.
- Có cần thêm content file không: **KHÔNG** — focal override (nếu cần) là class lẻ theo từng repo có board lệch, không cần schema mới.

## 4. Decor 1 — Overlay gradient chân ảnh (đọc được label/title đè ảnh)

- Vấn đề nó giải quyết: `ProjectVisual` đã có label `bg-bg/80 backdrop-blur` ở `bottom-3 left-3`, nhưng board sáng màu (trắng/vàng) vẫn có thể nuốt chữ label; 1 gradient chân ảnh đen→trong suốt đảm bảo chữ luôn đọc được mà không cần hộp đặc che board.
- Nguồn kỹ thuật: Tailwind publish `bg-linear-to-t` (= `linear-gradient(to top, var(--tw-gradient-stops))`) và `bg-linear-to-b` — <https://tailwindcss.com/docs/background-image> (mở trực tiếp trong phiên này) — cộng color stops `from-indigo-500 via-… to-…` và stop positions `from-10%`/`via-30%`/`to-90%` — <https://tailwindcss.com/docs/background-image> (mở trực tiếp trong phiên này) — đủ để dựng scrim chân ảnh bằng 1 lớp `absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#080b14] to-transparent`.
- Cách làm tối giản (0 node mới nếu tái dùng): thêm lớp scrim `aria-hidden` trong `ProjectVisual` phía trên `<img>`/glyph, dưới label; scrim chỉ render khi `label !== false` (Explorer thumb `label={false}` khỏi cần scrim).
- Điểm khác với cái đã có (không trùng): `bg-aurora` trong `tokens.css` là radial gold trang trí nền section; `lamp-cone` là cone sáng trên header; scrim này là **linear đen chân ảnh phục vụ đọc chữ**, chưa token nào có.
- Chi phí perf: **~0** — 1 gradient tĩnh paint cùng ảnh.
- Tắt reduced-motion: không cần (tĩnh).
- Áp cho: **Poster + lead card** (2 vị trí có label/title đè ảnh); Strip side nếu giữ side thì cũng cần; Explorer thumb không cần (không label).
- Contrast/a11y: scrim là non-text nhưng mục đích là nâng chữ label lên 4.5:1 — đo chữ `text-fg-subtle` trên điểm tối nhất của scrim; scrim `aria-hidden`.
- Có cần thêm content file không: **KHÔNG**.

## 5. Decor 2 — Title/category đè lên ảnh (image-header card)

- Vấn đề nó giải quyết: Poster hiện tại là title-khô + ảnh-khô tách rời (MetaLabel → h3 → ảnh → summary), tốn ~200px chiều dọc cho 2 block; đặt category + title đè lên đỉnh ảnh (kiểu image-header) gom 2 block thành 1, card cột hẹp đỡ dài.
- Nguồn kỹ thuật (lineage trực tiếp): shadcn publish "Add an image before the card header to create a card with an image" — <https://ui.shadcn.com/docs/components/card> (mở trực tiếp trong phiên này) — tức ảnh-làm-header là usage chuẩn; đặt chữ lên ảnh chỉ là thêm 1 lớp absolute trong header-image đó, không phá composition `CardHeader > CardTitle + CardDescription` — <https://ui.shadcn.com/docs/components/card> (mở trực tiếp trong phiên này).
- Lineage Aceternity: Bento item gộp `{title, description, header}` trong 1 card — <https://ui.aceternity.com/components/bento-grid> (mở trực tiếp trong phiên này) — và Focus Cards render title đè trực tiếp lên ảnh cover ("Forest Adventure", "Valley of life" đè lên ảnh demo) — <https://ui.aceternity.com/components/focus-cards> (mở trực tiếp trong phiên này) — nên title-đè-ảnh là visual language đã publish của chính Aceternity.
- Cách làm tối giản: trong Poster, bọc `ProjectVisual` + 1 block absolute `top-0` chứa `MetaLabel` + `h3` (chuyển `p-6 md:p-8` của card thành padding của block đè), ảnh giữ `aspect-[2/1]`; bắt buộc kèm scrim đỉnh ảnh (mirror của §4, `bg-linear-to-b`) để chữ đọc được — gradient 2 hướng đều có sẵn — <https://tailwindcss.com/docs/background-image> (mở trực tiếp trong phiên này).
- Điểm khác với cái đã có (không trùng): pointer-highlight + số nền (`docs/research-below-fold-fx.md` §5) là decor cho `SectionHeader`; đây là **title của card nằm trong ảnh**, chưa có ở Featured/Explorer.
- Chi phí perf: **~0** — text + gradient tĩnh.
- Tắt reduced-motion: không cần (tĩnh).
- Áp cho: **tối đa 2 Poster cards** thí điểm (giữ lead + Strip chữ-trên-ảnh-dưới để phân cấp; cấm rải sang Explorer rows — list cần scan nhanh, title đè ảnh làm chậm đọc).
- Contrast/a11y: chữ đè ảnh là text thật → 4.5:1 trên điểm sáng nhất của board (đo với board sáng nhất, không đo trung bình); giữ `h3` trong DOM order trước ảnh hoặc sau đều được miễn heading level không đổi.
- Có cần thêm content file không: **KHÔNG**.

## 6. Decor 3 — Border glow theo ảnh (image-frame ring, tách khỏi card border)

- Vấn đề nó giải quyết: card đã có `border-gold-hover` (viền card sáng khi hover cả card) trong `tokens.css`; nhưng ảnh 2:1 trong card cột hẹp vẫn "chìm" vào nền `#080b14` khi board tối — 1 ring/inner-glow ôm sát khung ảnh (không phải khung card) tách ảnh khỏi nền ngay cả khi chưa hover.
- Nguồn kỹ thuật (lineage): Aceternity Card Spotlight publish props `radius` ("The radius of the spotlight effect in pixels") và `color` ("The background color of the spotlight effect") — <https://ui.aceternity.com/components/card-spotlight> (mở trực tiếp trong phiên này) — tức glow radial theo vị trí là pattern đã publish; bản tối giản ở đây là **static gold ring** (không track chuột, không JS) nên rẻ hơn hẳn demo gốc mà cùng ngôn ngữ "sáng viền".
- Điểm khác với cái đã có (không trùng): `border-gold-hover` là border của **card** + shadow khi hover; `shadow-glow-primary` trong `@theme` là token shadow chưa gắn vào ảnh nào; món này là **ring tĩnh của khung ảnh** (`ring-1 ring-inset ring-[#f59e0b]/25` + `shadow-[0_0_24px_-8px_rgb(245_158_11/0.4)]` bám `rounded-lg` của Poster), không trigger theo hover card.
- Cách làm tối giản: thêm 1 class vào `ProjectVisual` khi dùng trong Poster/lead (`rounded-lg` đã có) — không thêm node; màu gold dùng `rgb(245 158 11 / …)` đồng bộ `tokens.css`.
- Chi phí perf: **~0** — border/shadow tĩnh paint 1 lần.
- Tắt reduced-motion: không cần (không motion; nếu sau này thêm glow pulse thì gate `reduce`).
- Áp cho: **Poster + lead** (ảnh 2:1 lớn); cấm áp vào Explorer thumb 8rem (ring trên thumb nhỏ gây nhiễu viền list).
- Contrast/a11y: ring là non-text decorative → 3:1 với nền là đủ, không cần 4.5:1; không dùng màu làm tín hiệu duy nhất (ảnh vẫn có label/title).
- Có cần thêm content file không: **KHÔNG**.

## 7. Decor 4 — Hover zoom trên ảnh (scale ảnh trong khung `overflow-hidden`)

- Vấn đề nó giải quyết: Featured cards hiện hover chỉ sáng viền card (`border-gold-hover`); ảnh board tĩnh đơ — zoom nhẹ ảnh trong khung cho feedback "card sống" mà không cần tilt thứ 2 (TiltCard đã chiếm quota motion của lead).
- Nguồn kỹ thuật: Tailwind publish `scale-<number>` (`scale: <number>% <number>%`) và pattern hover chuẩn `class="scale-95 hover:scale-120"` ("Prefix a `scale` utility with a variant like `hover:*`") — <https://tailwindcss.com/docs/scale> (mở trực tiếp trong phiên này) — nên zoom là `group-hover:scale-[1.04]` trên `<img>` + `transition-ui` đã có trong `tokens.css`.
- Lineage Aceternity: 3D Card Effect là "card perspective effect, hover over the card to elevate card elements" với `CardContainer`/`CardBody`/`CardItem (translateX/Y/Z, rotateX/Y/Z)` — <https://ui.aceternity.com/components/3d-card-effect> (mở trực tiếp trong phiên này) — tức hover-elevate là ngôn ngữ gốc của Aceternity; zoom-scale là bản rẻ (không perspective JS) của cùng ý tưởng, và lead đã có TiltCard nên Poster/Strip chỉ nên dùng zoom để tránh 2 motion 3D chồng nhau.
- Cách làm tối giản: card thêm `group`, `<img>` trong `ProjectVisual` thêm `transition-ui group-hover:scale-[1.04]`; khung đã `overflow-hidden` (Poster có, lead cần bổ sung) để ảnh zoom không tràn; cap `1.04` để text trong board không vỡ nét khi phóng.
- Điểm khác với cái đã có (không trùng): `marquee-track` là loop toàn dải; `TiltCard` là tilt JS của lead; zoom này là **scale CSS của ảnh**, chưa có ở token/component nào (grep `src/` không có `group-hover:scale`).
- Chi phí perf: **thấp** — `scale` là transform compositor-friendly, chỉ chạy khi hover 1 card.
- Tắt reduced-motion: khi `reduce` thì không zoom (giữ frame cuối = ảnh gốc) — kill-switch `prefers-reduced-motion` trong `tokens.css` đã triệt transition toàn cục; không cần gate JS riêng.
- Áp cho: **Poster + Strip + lead** (tất cả ảnh 2:1 lớn); cấm áp vào Explorer thumb (list 8rem zoom gây nhảy layout cảm giác, và thumb ẩn trên mobile nên motion lãng phí).
- Contrast/a11y: zoom không đổi contrast; ảnh decorative (`alt=""`) nên không phát sinh nghĩa vụ AT; giữ focus-visible của card/actions không bị ảnh hưởng.
- Có cần thêm content file không: **KHÔNG**.

## 8. Decor 5 — Image count / format badge trên góc ảnh (`2:1 · 1280×640` / `1 / 6`)

- Vấn đề nó giải quyết: user không biết board nào là ảnh thật, board nào là glyph fallback; 1 badge mono micro góc ảnh cho biết trạng thái visual mà không cần đọc code hay đoán.
- Nguồn component: shadcn Badge — usage `<Badge variant="default | outline | secondary | destructive">`, variants đầy đủ `default | secondary | destructive | outline | ghost | link`, custom màu qua class — <https://ui.shadcn.com/docs/components/base/badge> (mở trực tiếp trong phiên này) — nên badge góc ảnh dùng `variant="outline"` + class gold-dim trên nền `bg-bg/80 backdrop-blur` (đồng bộ label sẵn có trong `ProjectVisual`).
- Nguồn icon-inline: shadcn publish "render an icon inside the badge" với `data-icon="inline-start"` — <https://ui.shadcn.com/docs/components/base/badge> (mở trực tiếp trong phiên này) — nên badge gắn icon `ImageIcon`/`ImageOff` (đã import `ImageOff` trong `ProjectBits.tsx`) là đúng docs.
- Cách làm tối giản: góc trên-phải ảnh 1 badge `font-mono text-micro uppercase`: có ảnh → `2:1` (hoặc `1280×640` nếu đủ chỗ), fallback glyph → `glyph` (hoặc icon-only); bản count `1/6` chỉ dùng nếu sau này 1 card có nhiều board — hiện tại mỗi card 1 visual nên **format badge > count badge**.
- Điểm khác với cái đã có (không trùng): stat chips ★/fork (`docs/research-below-fold-fx.md` §2) là data repo dưới title; `AvatarGroupCount "+n"` là count người; kbd hints (`docs/research-decor-fx.md` §6) là gợi ý phím — badge này là **metadata của ảnh**, chưa file nào có.
- Chi phí perf: **0** — text tĩnh.
- Tắt reduced-motion: không cần (tĩnh).
- Áp cho: **Poster + lead** (ảnh lớn đủ chỗ cho badge 2 góc: label trái + badge phải); Explorer thumb 8rem **cấm** (2 badge trên 128px gây chật, chỉ giữ không label như hiện tại).
- Contrast/a11y: badge text → 4.5:1 trên scrim/blur nền; badge `aria-hidden` nếu thông tin đã có trong label, hoặc `aria-label` đầy đủ nếu là tín hiệu duy nhất ("Real preview image, 1280 by 640").
- Có cần thêm content file không: **KHÔNG** — suy ra từ `p.image != null` đã có trong `FullProject`.

## 9. Decor 6 — Eyebrow chip nổi trên ảnh (category pill thay MetaLabel khô) + hairline divider ảnh/nội dung

- Vấn đề nó giải quyết: `MetaLabel` hiện nằm trên title, xa ảnh — dời category thành pill nổi góc trên-trái ảnh giúp mắt đọc "thuộc nhóm nào" ngay trên visual; hairline `border-t border-border` giữa ảnh và summary (khi giữ layout stack) cho nhịp "xem → đọc" rõ hơn mà không cần divider ornament mới.
- Nguồn kỹ thuật: pill = Badge `outline` + icon inline-start — <https://ui.shadcn.com/docs/components/base/badge> (mở trực tiếp trong phiên này); hairline divider là `<hr>`/`border-t` thuần, semantics `separator` đã publish — cùng họ với divider-orn trong `tokens.css` nhưng bản này là hairline trơn trong card (không glyph giữa) nên không trùng `divider-orn`.
- Điểm khác với cái đã có (không trùng): `divider-orn` (`tokens.css`) là ornament giữa các section (glyph `◆/+/§` + `data-glyph`); `border-t border-border` giữa section đã rải khắp trang; món này là **hairline trong card + pill trên ảnh**, 2 vị trí chưa ai dùng.
- Cách làm tối giản: pill absolute `top-3 left-3` (đối xứng label `bottom-3 left-3` sẵn có, badge §8 ở `top-3 right-3` — 4 góc mỗi góc 1 món, cấm thêm món thứ 5); hairline là `border-t border-border` trên block summary khi card giữ stack.
- Chi phí perf: **0** — text + border tĩnh.
- Tắt reduced-motion: không cần (tĩnh).
- Áp cho: **Poster duy nhất** (card cột hẹp cần gom thông tin lên ảnh); lead đã có MetaLabel + SyncStats đủ đầy nên giữ nguyên để phân cấp; Explorer cấm (row scan không chịu nổi 3 pill/row).
- Contrast/a11y: pill text 4.5:1 trên scrim đỉnh (§5 mirror); hairline non-text 3:1.
- Có cần thêm content file không: **KHÔNG** — category đã có trong `FullProject`.

## 10. Bảng xếp wow / rủi ro + thứ tự triển khai (chỉ tính file này)

| # | Món (§) | Wow | Rủi ro | Một câu chốt + nguồn chính |
|---|---------|-----|--------|-----------------------------|
| 1 | Stack vs side (§1) | ★★★★ | ~0 | Về đúng docs: ảnh-trước-header là usage chuẩn — <https://ui.shadcn.com/docs/components/card>; Bento header-slot cũng trên-title — <https://ui.aceternity.com/components/bento-grid>. |
| 2 | Khung 2:1 + cover (§2) | ★★★ | 0 | Giữ `aspect-[2/1]` + `object-cover`, cấm `fill` stretch — `aspect-ratio: <value>` — <https://tailwindcss.com/docs/aspect-ratio>, `cover/clipped` vs `fill/stretched` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit>. |
| 3 | Thumb vuông (§3) | ★★★ | 0 | Cover-center + ẩn mobile, cấm contain-bars/fill-méo — `object-position` alignment + initial `50% 50%` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-position>, 9 vị trí Tailwind — <https://tailwindcss.com/docs/object-position>. |
| 4 | Scrim chân ảnh (§4) | ★★★ | ~0 | 1 gradient đen, chữ label luôn đọc được — `bg-linear-to-t` + stops — <https://tailwindcss.com/docs/background-image>. |
| 5 | Title đè ảnh (§5) | ★★★★ | thấp | Gộp MetaLabel+h3 lên ảnh, lineage Focus Cards title-trên-ảnh — <https://ui.aceternity.com/components/focus-cards>; cần scrim đỉnh — <https://tailwindcss.com/docs/background-image>. |
| 6 | Image-frame glow (§6) | ★★★ | ~0 | Ring tĩnh ôm ảnh (tách khỏi card border), rẻ hơn spotlight track-chuột — props `radius`/`color` — <https://ui.aceternity.com/components/card-spotlight>. |
| 7 | Hover zoom (§7) | ★★★★ | thấp | `group-hover:scale-[1.04]`, rẻ hơn 3D-tilt đã có ở lead — `hover:*` scale pattern — <https://tailwindcss.com/docs/scale>, perspective lineage — <https://ui.aceternity.com/components/3d-card-effect>. |
| 8 | Format/count badge (§8) | ★★★ | 0 | Badge outline + icon inline, phân biệt ảnh thật/glyph — usage + variants + `data-icon` — <https://ui.shadcn.com/docs/components/base/badge>. |
| 9 | Eyebrow pill + hairline (§9) | ★★★ | ~0 | Pill category trên ảnh + hairline trong card, không trùng divider-orn section — Badge icon — <https://ui.shadcn.com/docs/components/base/badge>. |

- Thứ tự triển khai khuyến nghị: §1 → §2 → §3 (khóa layout/fit trước, 0 decor mới) → §4 → §6 → §8 (nền đọc được + khung + badge, tĩnh rẻ) → §7 (motion duy nhất, sau tĩnh) → §5 → §9 (đụng typography, làm cuối để dễ revert từng card).
- Công tắc chung giữ nguyên: block `prefers-reduced-motion: reduce` trong `src/styles/tokens.css` (chỉ §7 cần gate, các món còn lại tĩnh sẵn).

## 11. Blacklist (giữ toàn bộ cũ + cap cho file này)

- Giữ blacklist cũ từ `docs/research-decor-fx.md` §12 + `docs/research-below-fold-fx.md` §11 + spec showcase: **no back-to-top, no live-clock, no meme/doge, no magnetic toàn trang, no spotlight toàn trang, no canvas starfield full-sky mới, no parallax/pin, no custom scrollbar, no fake screenshot posing as UI, no Recharts runtime cho strip trang trí, no tooltip hover-only, no language-bar width animation**.
- Giữ toàn bộ cap số lượng cũ: marquee ≤1; tilt ≤1 card (lead giữ, Poster/Strip dùng zoom thay tilt); moving-border động ≤1 CTA; cursor glow ≤2 section; lamp ≤2 header; noise 1 layer; meteors 1 strip `number ≤3`; sparkles 1 CTA band density thấp nhất; sparkline 1 strip SVG tĩnh; avatar stack ≤2 vị trí ≤8 avatar; pointer-highlight ≤3 section header; install-command chỉ rows Package; language-bar Featured lead + Explorer rows; skeleton Explorer only <300ms; grid biến thể ≤3 section; divider ornament ≤3 vị trí; corner ticks ≤4 card Featured; quote-mark ≤2; drop-cap 1 đoạn; kbd Explorer + ≤1 footer; index tabs 1 dải desktop-only; watermark 1 footer; markers footer + Journey tags; double-rules ≤2.
- Cap mới từ file này: Strip side **≤ số Strip hiện có, cấm nhân rộng sang card mới** (§1 — card mới mặc định stack); Explorer thumb **giữ `hidden sm:block`, cấm hiện thumb mobile** (§3); scrim **chỉ nơi có chữ đè ảnh** (§4–§5); title-đè-ảnh **≤2 Poster** (§5); image-glow **Poster + lead, cấm thumb 8rem** (§6); hover zoom **cap 1.04, cấm thumb list** (§7); badge góc ảnh **≤2/card (label + format), thumb cấm** (§8); eyebrow pill + hairline **Poster only, 4 góc mỗi góc 1 món** (§9).
- Loại thẳng từ danh sách ứng viên: **`object-fill` cho mọi ảnh** (là initial nhưng stretch text board — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit>); **`object-contain` + nền bars cho thumb** (letterbox/pillarbox — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit>); **side-media mới cho card cột hẹp** (off-label so với composition Card — <https://ui.shadcn.com/docs/components/card> và props Bento `{title, description, header, icon}` — <https://ui.aceternity.com/components/bento-grid>); **tilt/3D thứ 2 cho Poster** (lead đã có TiltCard, perspective hover đã có lineage — <https://ui.aceternity.com/components/3d-card-effect> — thêm nữa là motion chồng motion); **spotlight track-chuột cho ảnh** (demo gốc cần JS theo chuột, static ring đủ — props `radius`/`color` — <https://ui.aceternity.com/components/card-spotlight>).

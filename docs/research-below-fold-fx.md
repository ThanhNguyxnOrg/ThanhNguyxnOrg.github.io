# Research: Below-fold FX — bớt chữ, thêm graphic (đợt 4)

> Context site áp dụng: Astro static 1 trang, nền `#080b14`, accent gold `#f59e0b`/`#fcd34d`, font Space Grotesk / Inter / JetBrains Mono, Tailwind v4, GSAP. Hero đã chốt (orbit 5 repo + canvas 150 sao + gradient "Evolve.").
> Vấn đề user nêu: dưới hero còn quá nhiều chữ — metrics strip (16/10/314/5), section "Things leaving the lab." + featured card blendops, các section chữ dài (Philosophy), timeline Journey, Explorer list, Ecosystem, CTA, footer.
> Quy tắc file này: CHỈ primary sources (trang mở trực tiếp bằng fetch ngày 2026-10-11 trong phiên này, docs chính thức). Mỗi claim kèm URL nguồn ngay sau câu.
> Không trùng: `docs/research-patterns.md` (starfield A/B/C, magnetic, spotlight, copy, status-pill, divider eyebrow/Fig/timestamp, footer 3 mẫu), `docs/research-solar.md` (orbit svgOrigin, counter-rotation, pause 2.2.2, target 24px, contrast label), `docs/research-visual-fx.md` (gradient keyword, underline offset, pulse-dot, tabular-nums, reveal-once, scroll-margin + content-visibility), `docs/research-showcase-fx.md` (marquee, tilt, progress bar, cursor glow, gradient border, noise, count-up, timeline beam, lamp), spec `docs/superpowers/specs/2026-10-11-showcase-fx-design.md` (giữ nguyên phase, không vẽ lại kiến trúc).
> Hiện trạng code đã đọc (ngày 2026-10-11): `src/sections/Featured.tsx` (lead blendops + TiltCard + border-gold-hover + ProjectVisual glyph + highlights 48/26/189), `src/sections/MetricsBand.tsx` (CountUp 4 số), `src/sections/Journey.tsx` (Timeline + TimelineBeam đã có), `src/sections/Explorer.tsx` (filter sidebar + ToggleChip + EmptyState SearchX đã có), `src/sections/Ecosystem.tsx` (numbered rows 01… + ArrowUpRight), `src/sections/CTA.tsx` (GlowSection + 3 buttons), `src/sections/Philosophy.tsx` (4 nguyên tắc Build/Explore/Evolve/Second life, text-only), `src/site/ProjectBits.tsx` (ProjectVisual = generative glyph, KHÔNG fake screenshot), `src/styles/tokens.css` (đã có marquee-track, border-gold-hover, lamp-cone, section-glow, noise-overlay, tabular, kill-switch reduce).

## 0. Phương pháp, giới hạn quan sát và log fetch

- Tất cả URL §1–§9 được **mở trực tiếp bằng fetch ngày 2026-10-11**, không viết theo trí nhớ.
- Giới hạn công cụ: fetch trả về **nội dung/cấu trúc** (markdown đã strip), nên độ mượt animation, màu pixel, blur thực tế **không xác thực được** — chỉ nêu ở mức cấu trúc/props đã publish.
- **0 URL 404 trong phiên này.** Ghi rõ 1 redirect: các path rút gọn `https://ui.shadcn.com/docs/components/progress`, `/skeleton`, `/badge`, `/avatar` đều resolve về nội dung trang `…/components/base/…` tương ứng (nav trong trang trả về liệt kê path `/docs/components/base/progress` — <https://ui.shadcn.com/docs/components/base/progress>); các trang Aceternity mở đúng path và trả đủ nội dung demo + props.
- Production lineage: file này **không claim** site production nào dùng pattern nào (Linear/Raycast/Cal/OpenStatus/TypeHero không mở lại trong phiên này); lineage duy nhất là **demo live trên Aceternity + docs chính thức** (MDN, GitHub REST, shadcn).

---

## 1. Project card: thanh ngôn ngữ stacked-bar (thay 1 đoạn mô tả bằng 1 vạch dữ liệu)

- Vấn đề nó giải quyết: card Featured/Explorer hiện tại đọc bằng chữ (summary + tag list 6 topics) — user chê "quá nhiều chữ"; 1 stacked-bar ngôn ngữ cho mắt dữ liệu thật mà không thêm chữ — `ProjectVisual` glyph giữ nguyên (quy ước "no fake screenshots" trong `src/site/ProjectBits.tsx` không bị phá).
- Nguồn data: mỗi repo trong schema `GET /orgs/{org}/repos` đều có field `language` (string|null) và `languages_url` (uri) — <https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-organization-repositories> (mở trực tiếp trong phiên này).
- Nguồn component: shadcn Progress — "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar", usage `<Progress value={33} />`, composition `Progress > ProgressLabel + ProgressValue + ProgressTrack > ProgressIndicator` — <https://ui.shadcn.com/docs/components/base/progress> (mở trực tiếp trong phiên này).
- Nguồn semantics: phần tử `<progress>` HTML "displays an indicator showing the completion progress of a task, typically displayed as a progress bar", có implicit ARIA role `progressbar`, attributes `max`/`value` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress> (mở trực tiếp trong phiên này).
- Cách làm tối giản: dưới `ProjectVisual` của lead card + mỗi row Explorer, render 1 stacked-bar 4px gồm 2–3 segment (tỉ lệ từ `languages_url`, fallback chỉ `language` chính = 100%); mỗi segment là `<progress>` hoặc div `role="progressbar"` + `<label>`/legend chữ mono micro bên dưới ("TypeScript 72 · Astro 20 · CSS 8"); không animation khi load (width render sẵn từ HTML tĩnh), chỉ fade cùng reveal-once đã có.
- Chi phí perf: **~0** — DOM tĩnh, không JS runtime, không rAF; chi phí duy nhất nằm ở build-time (xem content-file bên dưới).
- Tắt reduced-motion: không cần (tĩnh sẵn); đúng 2 giá trị `no-preference`/`reduce` của — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.
- Section áp dụng: **Featured lead card** (thay hàng tags 6 topics dài) + **Explorer rows** (1 dòng bar thay 6 Tag pills).
- Contrast/a11y: legend chữ giữ 4.5:1 theo — <https://webaim.org/articles/contrast/>; mỗi segment có `<label>` hoặc `aria-label` ("TypeScript 72 percent") theo quy tắc labeling của — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress>; màu segment gold/stone trên `#080b14` là non-text → 3:1 theo — <https://webaim.org/articles/contrast/> (§1.4.11).
- Có cần thêm content file không: **CÓ** — `baked.json` hiện chỉ có repo top-level fields; tỉ lệ ngôn ngữ cần fetch thêm `languages_url` mỗi repo trong `scripts/sync.ts` (N request thêm cho N repo, cache vào `baked.json`); bản tối giản (chỉ `language` chính, không tỉ lệ) thì **không cần** vì field `language` đã có sẵn trong response schema — <https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-organization-repositories>.

## 2. Repo meta-row: stat chips ★/fork/language-dot (icon + số, khỏi câu dài)

- Vấn đề nó giải quyết: card hiện diễn đạt "được star nhiều / đã ổn định" bằng câu văn; 1 hàng meta-row icon+số đọc lướt nhanh hơn và đúng ngôn ngữ GitHub user đã quen.
- Nguồn data: response schema `GET /orgs/{org}/repos` có sẵn `stargazers_count` (integer), `forks_count` (integer), `language` (string|null), `topics` (array) — <https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-organization-repositories> (mở trực tiếp trong phiên này).
- Nguồn component: shadcn Badge — "Displays a badge or a component that looks like a badge", variants `default | secondary | destructive | outline | ghost | link`, hỗ trợ icon trong badge (`data-icon="inline-start"`) và custom colors qua class — <https://ui.shadcn.com/docs/components/base/badge> (mở trực tiếp trong phiên này).
- Cách làm tối giản: meta-row mono micro dưới title card: `[★ 314] [⑂ 21] [● TypeScript]` — 3 badge outline gold-dim, icon lucide (Star, GitFork, Circle dot), số `tabular-nums` (đã có utility `tabular` trong `src/styles/tokens.css`); thay thế câu "ranked by stars" trong description SectionHeader bằng dữ liệu nhìn thấy được.
- Chi phí perf: **0** — HTML tĩnh, icon SVG inline, không JS.
- Tắt reduced-motion: không cần (tĩnh).
- Section áp dụng: **Featured** (lead + Poster/Strip cards) + **Explorer rows** (gộp vào cùng dòng với tên repo).
- Contrast/a11y: text trong badge là text thường → **4.5:1** — <https://webaim.org/articles/contrast/>; badge là `<span>` (không phải link) nên không phát sinh target-size; số dùng `tabular-nums` theo — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric>.
- Có cần thêm content file không: **KHÔNG** — `stargazers_count`/`forks_count`/`language` đã có trong payload `sync.ts` đang fetch (`/orgs/.../repos?per_page=100` theo spec `docs/superpowers/specs/2026-10-11-showcase-fx-design.md` §3), chỉ cần plumb qua `FullProject`.

## 3. Metrics strip: sparkline/mini-bars sao theo repo (số CountUp đã có + hình)

- Vấn đề nó giải quyết: `MetricsBand.tsx` hiện là 4 số CountUp đứng trơ (16/10/314/5); thêm 1 sparkline/bar nhỏ dưới số Stars = "phân bố sao theo repo" giúp strip đỡ giống bảng kế toán; CountUp giữ nguyên (đã research ở `docs/research-showcase-fx.md` §7).
- Nguồn component: shadcn Chart — "Beautiful charts. Built using Recharts", pattern build bằng Recharts primitives + `ChartContainer`/`ChartTooltip`, yêu cầu "Remember to set a `min-h-[VALUE]` on the `ChartContainer`… required for the chart to be responsive" — <https://ui.shadcn.com/docs/components/base/chart> (mở trực tiếp trong phiên này).
- Nguồn a11y cho chart: cùng trang publish prop `accessibilityLayer` — "adds keyboard access and screen reader support to your charts", usage `<LineChart accessibilityLayer />` — <https://ui.shadcn.com/docs/components/base/chart> (mở trực tiếp trong phiên này).
- Cách làm tối giản (khuyến nghị BẢN KHÔNG RECHARTS): 8–12 cột bar SVG tĩnh (mỗi cột = 1 repo top, chiều cao ∝ stars), 1 màu gold `0.55` opacity, cột top-1 gold đặc; render SSR từ `baked.json`, không tooltip JS (dùng `<title>` trong SVG); chỉ làm nếu muốn nhẹ hơn Recharts — vì Recharts là runtime JS nặng cho 1 strip trang trí.
- Chi phí perf: **thấp** — SVG tĩnh ~12 node, 0 JS; bản Recharts đầy đủ thì **trung bình** (bundle + JS render) nên **không khuyến nghị** cho Astro static strip.
- Tắt reduced-motion: không cần (tĩnh); nếu thêm grow-animation khi vào viewport thì gate `reduce` → hiện đầy ngay, đúng `reduce` là setting OS — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.
- Section áp dụng: **MetricsBand** duy nhất (dưới số Stars, hoặc 1 hàng bars chung cho cả strip).
- Contrast/a11y: bars là non-text → 3:1 với `#080b14` — <https://webaim.org/articles/contrast/> (§1.4.11); SVG `role="img"` + `aria-label` ("Stars per repository, top repository 314 stars"); số CountUp giữ `aria-live="off"` theo spec `docs/superpowers/specs/2026-10-11-showcase-fx-design.md` §5.
- Có cần thêm content file không: **KHÔNG** — suy ra từ stars/repo đã có trong `baked.json`.

## 4. Contributor avatar stack + animated tooltip (social-proof thay đoạn "members" bằng chữ)

- Vấn đề nó giải quyết: phần con người (members/contributors) hiện chỉ có thể kể bằng chữ; 1 hàng avatar chồng nhau + tooltip tên/role khi hover biến "ai làm" thành graphic.
- Nguồn demo: Aceternity Animated Tooltip — "A cool tooltip that reveals on hover, follows mouse pointer", props `items: Array<{id: number, name: string, designation: string, image: string}>` — <https://ui.aceternity.com/components/animated-tooltip> (mở trực tiếp trong phiên này).
- Nguồn component: shadcn Avatar — composition `Avatar > AvatarImage + AvatarFallback + AvatarBadge`, group pattern `AvatarGroup > Avatar… + AvatarGroupCount` (count "+3" cho người thừa), `AvatarImage src` + `AvatarFallback` khi ảnh lỗi — <https://ui.shadcn.com/docs/components/base/avatar> (mở trực tiếp trong phiên này).
- Cách làm tối giản: hàng 5–8 avatar overlap (`-ml-2`, ring `#080b14`), `AvatarFallback` = initials (không vỡ khi ảnh GitHub lỗi), `AvatarGroupCount "+n"` cho phần còn lại; hover/focus hiện tooltip tên + role (bản tối giản: tooltip CSS/focus-visible, không cần motion "follows mouse" của demo gốc); mỗi avatar là `<a>` về GitHub profile.
- Chi phí perf: **thấp** — ảnh avatar GitHub (size nhỏ `?s=64`), lazy-loading + decoding async; tooltip CSS-only khi hover.
- Tắt reduced-motion: tooltip của demo gốc bám chuột (motion) → khi `reduce` thì tooltip hiện **tĩnh** tại chỗ (không follow), đúng logic `reduce` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>; vẫn giữ đầy đủ thông tin (functional, không decorative).
- Section áp dụng: **Ecosystem** (hàng People) + **Journey stop "current"** (ai đang làm) — tối đa 2 vị trí.
- Contrast/a11y: fallback initials là text → 4.5:1 — <https://webaim.org/articles/contrast/>; avatar link hit-area ≥24×24 theo — <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>; tooltip phải focus được bằng keyboard (không hover-only).
- Có cần thêm content file không: **CÓ (optional)** — danh sách member cố định thì hardcode 5–8 `{name, role, avatarUrl}` trong 1 content file mới; động theo GitHub thì endpoint `GET /repos/{owner}/{repo}/contributors` "sorts them by the number of commits per contributor in descending order" và "may return information that is a few hours old because the GitHub REST API caches contributor data" — <https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-organization-repositories> (mở trực tiếp trong phiên này) — tức dữ liệu contributor là cache-friendly, hợp cron daily sẵn có.

## 5. Section header graphic: pointer-highlight keyword + số thứ tự nền khổ lớn

- Vấn đề nó giải quyết: mọi `SectionHeader` hiện cùng 1 nhịp (eyebrow + headline + description) nên trang dài gây mệt; 1 từ khóa trong headline được "khoanh vẽ" + 1 số thứ tự section nền khổ lớn (`01`/`02`…) tạo nhịp chương mà không thêm motion nền.
- Nguồn demo (highlight): Aceternity Pointer Highlight — "highlights text when it's in view, with a pointer and border", props `children`, `rectangleClassName`, `pointerClassName`, `containerClassName` — <https://ui.aceternity.com/components/pointer-highlight> (mở trực tiếp trong phiên này).
- Nguồn pattern (số thứ tự): nhịp numbered steps `01/02/03` đã quan sát trực tiếp tại Cal.com và ghi trong `docs/research-patterns.md` §3.4 — <https://cal.com/>; không fetch lại trong phiên này nên không claim mới.
- Cách làm tối giản: trong `SectionHeader`, 1 keyword/headline được bọc highlight (viền gold vẽ 1 lần khi vào viewport qua reveal-once đã có, KHÔNG loop); góc phải header đặt số thứ tự section (`01`–`07`, Space Grotesk 64–96px, `text-transparent` stroke hoặc gold 8% opacity, `aria-hidden`); tối đa áp cho **Philosophy + Ecosystem + Journey** (3 section chữ nặng nhất), các section còn lại giữ header thường để khỏi loãng.
- Chi phí perf: **thấp** — 1 border-draw animation/section (stroke-dashoffset, compositor-friendly), số nền là text tĩnh paint 1 lần.
- Tắt reduced-motion: khi `reduce` → highlight hiện **đầy đủ tĩnh** (không vẽ dần), số nền giữ nguyên (tĩnh sẵn) — đúng tinh thần tone-down của — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.
- Section áp dụng: **Philosophy** (highlight "Useful"/"Evolve"), **Ecosystem**, **Journey**.
- Contrast/a11y: keyword trong highlight vẫn là text → 4.5:1 ở mọi state — <https://webaim.org/articles/contrast/>; số nền khổ lớn là decorative → `aria-hidden="true"`, opacity ≤10% để không tạo nền biến thiên sau chữ khác.
- Có cần thêm content file không: **KHÔNG** — số thứ tự hardcode theo thứ tự section, keyword là prop của `SectionHeader` đã có.

## 6. Divider giữa section: meteor band hẹp (1 dải duy nhất, thay marquee thứ 2)

- Vấn đề nó giải quyết: giữa các section hiện chỉ có `border-t border-border` (mắt lướt qua không dừng); cần 1 divider có graphic nhưng **không** thêm marquee thứ 2 (marquee đã có 1 dải TechMarquee — spec `docs/superpowers/specs/2026-10-11-showcase-fx-design.md` §4 giới hạn marquee ≤1).
- Nguồn demo: Aceternity Meteor Effect — "A group of beams in the background of a container", props `className`, `number` ("The number of meteors you want in the card"), trang publish keyframes Tailwind v4 chuẩn (`@theme inline { --animate-meteor-effect: meteor 5s linear infinite; @keyframes meteor { … rotate(215deg) translateX(-500px) … } }`) — <https://ui.aceternity.com/components/meteors> (mở trực tiếp trong phiên này).
- Nguồn thay thế (nếu meteor quá động): Aceternity Background Beams — "Multiple background beams that follow a path of SVG, makes a good hero section background", props `className` — <https://ui.aceternity.com/components/background-beams> (mở trực tiếp trong phiên này) — nhưng mô tả gốc đã định vị là hero background, dùng làm divider là off-label nên meteor là lựa chọn chính.
- Cách làm tối giản: 1 divider strip cao ~120–160px giữa Featured và Journey (điểm rơi mắt sau khi đọc card dài): nền transparent, `number={3}` meteors gold (không trắng như demo), `overflow-hidden`, trên/dưới là hairline `border-border`; không chữ trong divider.
- Chi phí perf: **thấp–trung bình** — 3 node animation `transform` loop (compositor-friendly); đắt dần theo `number` nên cap 3.
- Tắt reduced-motion: khi `reduce` thì `animation: none`, meteors hiện **tĩnh** (3 vệt đứng yên) hoặc ẩn hẳn — decorative nên ẩn hẳn cũng đạt, đúng `reduce` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>; kill-switch toàn cục trong `src/styles/tokens.css` đã phủ.
- Section áp dụng: **1 divider duy nhất** Featured→Journey (không lặp lại mỗi section).
- Contrast/a11y: divider thuần decorative → `aria-hidden="true"`; vệt meteor không đi qua chữ nào (strip riêng biệt, không phủ text) nên không phát sinh nghĩa vụ đo contrast chữ — <https://webaim.org/articles/contrast/>.
- Có cần thêm content file không: **KHÔNG**.

## 7. Explorer: skeleton rows + empty-state graphic + filter chips có count

- Vấn đề nó giải quyết: Explorer là section "đông chữ nhất" (sidebar filter + list rows); khi filter đổi, list nhảy layout khô; empty state hiện tại (`EmptyState` + SearchX) tốt nhưng chưa có visual riêng; chips chưa hiện count nên user không biết filter nào đáng bấm.
- Nguồn skeleton: shadcn Skeleton — "Use to show a placeholder while content is loading", variants đã publish: avatar, card, text, form, table — <https://ui.shadcn.com/docs/components/base/skeleton> (mở trực tiếp trong phiên này).
- Nguồn empty-state: shadcn Empty — "Use the Empty component to display an empty state", composition `Empty > EmptyHeader (EmptyMedia + EmptyTitle + EmptyDescription) + EmptyContent` (chứa button/input), `EmptyMedia variant="icon"` cho icon — <https://ui.shadcn.com/docs/components/base/empty> (mở trực tiếp trong phiên này).
- Nguồn chips: ToggleChip hiện tại tương đương shadcn Badge — variants `default | secondary | destructive | outline | ghost | link`, hỗ trợ icon inline — <https://ui.shadcn.com/docs/components/base/badge> (mở trực tiếp trong phiên này).
- Cách làm tối giản: (a) khi `query/category/tags/sort` đổi, hiện 3 skeleton rows (dòng xám `animate-pulse` 200ms rồi swap kết quả thật — vì filter là client-side instant, skeleton chỉ là nhịp mắt, không phải loading thật); (b) empty-state giữ composition Empty chuẩn: `EmptyMedia` icon radar/flask gold + `EmptyTitle` "Nothing in the lab matches" + `EmptyDescription` + 2 buttons (Reset / Browse top-starred); (c) mỗi ToggleChip thêm count mono micro (`astro (3)`), count đã tính sẵn trong `tagCounts`/`categories` của `Explorer.tsx`.
- Chi phí perf: **thấp** — skeleton là 3 div pulse CSS, hiện <300ms; chips count là text tĩnh.
- Tắt reduced-motion: `animate-pulse` là animation loop → khi `reduce` thì skeleton hiện **tĩnh** (không pulse) hoặc bỏ qua skeleton, hiện kết quả ngay; kill-switch `src/styles/tokens.css` đã triệt `animation-duration` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.
- Section áp dụng: **Explorer** duy nhất.
- Contrast/a11y: skeleton `aria-hidden` (decorative, kết quả thật đọc bình thường); empty-state title/description giữ 4.5:1 — <https://webaim.org/articles/contrast/>; chip count là text → 4.5:1; vùng result count giữ `aria-live="polite"` đã có trong `Explorer.tsx`.
- Có cần thêm content file không: **KHÔNG** — counts suy ra từ `projects` prop sẵn có.

## 8. Ecosystem/packages: install-command card (kbd + copy, thay dòng mô tả)

- Vấn đề nó giải quyết: rows Ecosystem hiện 3 dòng chữ (kind/label/description) + icon ArrowUpRight; với resource loại Package, 1 card lệnh `npm i <pkg>` copy được 1 click ăn điểm utility với dev hơn 1 câu mô tả — pattern "mọi code hiển thị đều copy được" đã quan sát tại shadcn installation docs trong `docs/research-patterns.md` §4.3 — <https://ui.shadcn.com/docs/installation>.
- Nguồn demo: Aceternity Code Block — "A configurable code block component built on top of react-syntax-highlighter", props `language`, `filename`, `highlightLines`, `code` HOẶC `tabs[]` (`{name, code, language, highlightLines}`) — <https://ui.aceternity.com/components/code-block> (mở trực tiếp trong phiên này).
- Nguồn kbd: shadcn Kbd — "Used to display textual user input from keyboard", composition `Kbd` + `KbdGroup`, usage `<Kbd>Ctrl</Kbd>` — <https://ui.shadcn.com/docs/components/base/kbd> (mở trực tiếp trong phiên này).
- Cách làm tối giản (KHÔNG mang react-syntax-highlighter vào Astro static): card 1 dòng mono `npm i <pkg>` (hoặc `pnpm add`) + nút Copy (Copy→Check 1.5s + `aria-live="polite"`, đúng chuẩn đã nêu ở `docs/research-patterns.md` §4.3); chỉ render cho resource `kind === 'Package'` có URL; Organization/People/Resource giữ row hiện tại.
- Chi phí perf: **~0** — text tĩnh + 1 clipboard handler; không highlighter runtime.
- Tắt reduced-motion: không cần (phản hồi Copy→Check là đổi icon, không motion).
- Section áp dụng: **Ecosystem** (rows Package only).
- Contrast/a11y: lệnh mono là text → 4.5:1 — <https://webaim.org/articles/contrast/>; nút copy là `<button>` ≥24×24 theo — <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>; thông báo "Copied" qua `aria-live="polite"` (không toast).
- Có cần thêm content file không: **CÓ (nhỏ)** — `EcoResource` hiện chỉ có `{kind, label, description, url}`; cần thêm field `package?: string` (tên npm) cho rows Package, hoặc suy ra từ URL nếu URL đã là npm link — kiểm tra content file resources trước khi implement.

## 9. CTA/footer: sparkles canvas + big-type + separator ngữ nghĩa

- Vấn đề nó giải quyết: CTA hiện là 1 headline + 3 buttons trên nền glow tĩnh; footer cần 1 điểm neo mắt cuối trang mà không phải live-clock/back-to-top (blacklist). Sparkles gold thưa + headline display-2xl + status line là đủ.
- Nguồn demo: Aceternity Sparkles — "A configurable sparkles component that can be used as a background or as a standalone component", props `id`, `className`, `background`, `particleSize`, `minSize`, `maxSize`, `speed`, `particleColor`, `particleDensity` — <https://ui.aceternity.com/components/sparkles> (mở trực tiếp trong phiên này).
- Nguồn separator: shadcn Separator — "Visually or semantically separates content", usage `<Separator />`, hỗ trợ `orientation="vertical"` — <https://ui.shadcn.com/docs/components/base/separator> (mở trực tiếp trong phiên này).
- Cách làm tối giản: CTA bọc sparkles thưa (`particleDensity` thấp, `particleColor` gold `#f59e0b`, `speed` chậm, chỉ trong CTA band không full-page); headline giữ nguyên câu "Use it. Fork it. Make it better." nhưng lên `display-2xl` với 1 từ gradient gold (utility `text-gradient-gold` đã có trong `src/styles/tokens.css`); trên footer đặt `<Separator />` + status line mono ("Snapshot {date} · All repos public") thay pill động.
- Chi phí perf: **trung bình** — sparkles là canvas rAF thứ 2 toàn trang (cạnh StarCanvas hero); giới hạn: `particleDensity` thấp nhất đọc được, pause khi CTA ngoài viewport (IO disconnect), pause khi tab nền (rAF tự pause theo — <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame>).
- Tắt reduced-motion: khi `reduce` thì **không mount canvas**, CTA hiện trên nền `bg-aurora` tĩnh đã có — đúng best practice "decorative → removing it entirely" của — <https://gsap.com/resources/a11y>; headline gradient tĩnh giữ nguyên (không cần tắt — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>).
- Section áp dụng: **CTA + footer top** duy nhất.
- Contrast/a11y: sparkles là decorative → `aria-hidden`; headline trên nền sparkles phải đo ở điểm sáng nhất, "testing the area where contrast is lowest" — <https://webaim.org/articles/contrast/>; giữ `particleDensity`/opacity thấp để chữ `var(--color-fg)` không rớt dưới 4.5:1.
- Có cần thêm content file không: **KHÔNG** — status line dùng `fetchedAt` đã có.

---

## 10. Bảng xếp wow / rủi ro + thứ tự triển khai (chỉ tính file này)

| # | Hiệu ứng (§) | Wow | Rủi ro | Một câu chốt + nguồn chính |
|---|--------------|-----|--------|-----------------------------|
| 1 | Stat chips ★/fork (§2) | ★★★★ | ~0 | Data đã có sẵn trong payload sync, 0 JS — schema `stargazers_count`/`forks_count` — <https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-organization-repositories>. |
| 2 | Explorer skeleton/empty/counts (§7) | ★★★ | ~0 | Chuẩn shadcn Empty/Skeleton composition, counts từ props sẵn — <https://ui.shadcn.com/docs/components/base/empty>, <https://ui.shadcn.com/docs/components/base/skeleton>. |
| 3 | Install-command copy (§8) | ★★★★ | thấp | Dev copy lệnh mỗi ngày; kbd + copy 1 click — <https://ui.shadcn.com/docs/components/base/kbd>, <https://ui.aceternity.com/components/code-block>. |
| 4 | Language stacked-bar (§1) | ★★★★ | thấp–trung bình | Graphic dữ liệu thật thay đoạn văn; tốn thêm fetch `languages_url` ở build — <https://ui.shadcn.com/docs/components/base/progress>, <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress>. |
| 5 | Metrics sparkline (§3) | ★★★ | thấp | SVG tĩnh 12 cột, không Recharts runtime — chart a11y `accessibilityLayer` — <https://ui.shadcn.com/docs/components/base/chart>. |
| 6 | Header highlight + số nền (§5) | ★★★ | thấp | 1 border-draw + số decorative, tối đa 3 section — <https://ui.aceternity.com/components/pointer-highlight>. |
| 7 | Avatar stack + tooltip (§4) | ★★★★ | trung bình | Social-proof mạnh nhất nhưng thêm ảnh ngoài + tooltip keyboard — `AvatarGroup`/`AvatarGroupCount` — <https://ui.shadcn.com/docs/components/base/avatar>, props tooltip — <https://ui.aceternity.com/components/animated-tooltip>. |
| 8 | Meteor divider (§6) | ★★★ | trung bình | 1 strip 3 meteors, keyframes v4 publish sẵn; là animation loop thứ N của trang — <https://ui.aceternity.com/components/meteors>. |
| 9 | CTA sparkles (§9) | ★★★★★ | cao nhất | Wow nhất nhưng canvas rAF thứ 2; làm cuối cùng, IO-guard + `reduce` → không mount — props `particleDensity`/`speed` — <https://ui.aceternity.com/components/sparkles>, separator — <https://ui.shadcn.com/docs/components/base/separator>. |

- Thứ tự triển khai khuyến nghị: §2 → §7 → §8 → §1 → §3 → §5 → §4 → §6 → §9 (tĩnh/rẻ/data-sẵn trước; ảnh ngoài + loop + canvas sau).
- Công tắc chung giữ nguyên: block `prefers-reduced-motion: reduce` trong `src/styles/tokens.css` + gate JS bằng `gsap.matchMedia`/`matchMedia` (tiền lệ `MOTION_OK_QUERY` trong `src/sections/Hero.tsx`), đúng snippet 2 nhánh của — <https://gsap.com/resources/a11y>.

## 11. Blacklist (giữ cũ + giới hạn số lượng mới)

- Giữ blacklist cũ từ `docs/research-patterns.md` §5 + `docs/research-visual-fx.md` + `docs/research-showcase-fx.md` §11: **no back-to-top, no live-clock, no meme/doge, no magnetic toàn trang, no spotlight toàn trang, no canvas starfield full-sky mới, no parallax/pin, no custom scrollbar**.
- Bổ sung từ file này (giới hạn số lượng để trang 1 màn hình không nghẹt): marquee vẫn ≤1 (không thêm marquee thứ 2 — divider dùng meteor §6 thay thế); meteors **1 strip duy nhất, `number ≤3`**; sparkles **1 CTA band duy nhất, density thấp nhất**; sparkline **1 strip MetricsBand** (SVG tĩnh, cấm Recharts runtime); avatar stack **≤2 vị trí, ≤8 avatar**; pointer-highlight **≤3 section header**; install-command **chỉ rows Package**; language-bar **Featured lead + Explorer rows** (không rải Poster/Strip nếu card đã đủ đầy); skeleton **Explorer only, hiện <300ms**.
- Cấm thêm từ file này: fake screenshot posing as UI (quy ước `ProjectBits.tsx` — visual vẫn là generative glyph + data-bars, không ảnh stock giả UI); Recharts runtime cho strip trang trí; tooltip hover-only (mọi tooltip phải focus được); language-bar animation width khi load (render width cuối sẵn từ HTML tĩnh).

# Research: Visual FX nhẹ cho ThanhNguyxnOrg.github.io (đợt 2)

> Context: Astro + Tailwind v4 + GSAP, nền `#080b14`, accent gold (`#f59e0b`/`#fcd34d`), font Space Grotesk / Inter / JetBrains Mono. Hero đã có orbit 5 repo + starfield 46 sao CSS (`src/sections/Hero.tsx`), tokens đã có `bg-blueprint`, `bg-aurora`, `::selection` gold, `animate-twinkle`.
> Quy tắc file này: CHỈ primary sources (docs chính thức hoặc trang đã mở trực tiếp trong phiên này). Mỗi claim kèm URL ngay sau câu.
> Không trùng với `docs/research-patterns.md` (§2 starfield A/B/C, §4 magnetic/spotlight/copy/status-pill, §5 bảng 7 pattern) và `docs/research-solar.md` (orbit `svgOrigin`, counter-rotation, pause 2.2.2, target 24px, contrast label 10–11px).
> Blacklist giữ nguyên từ `docs/research-patterns.md`: không back-to-top, không live-clock, không meme (không site mẫu nào có — xem `docs/research-patterns.md` §3.4, §4.4).

---

## 1. Gold gradient keyword trong headline (tĩnh, CSS-only)

- Nguồn: Tailwind docs `background-clip` publish utility `bg-clip-text` (`background-clip: text;`) kèm ví dụ headline gradient "Hello world" — <https://tailwindcss.com/docs/background-clip> (mở trực tiếp trong phiên này).
- Cách làm: 1 từ trong headline (ví dụ "Evolve.") dùng `bg-gradient-to-r from-[#fcd34d] to-[#f59e0b] bg-clip-text text-transparent` trên nền `#080b14` — kỹ thuật chính là `bg-clip-text` từ docs trên — <https://tailwindcss.com/docs/background-clip>.
- Chi phí perf: **~0** — paint một lần, không JS, không animation, compositor không repaint theo frame (tĩnh như `bg-aurora`/`bg-blueprint` đã có trong `src/styles/tokens.css`).
- Contrast: chữ gradient trên nền chuyển vẫn phải đạt chuẩn, WCAG không cho công thức đo gradient nên "recommend usually testing the area where contrast is lowest" — <https://webaim.org/articles/contrast/>; ngưỡng text thường là **4.5:1**, large text (≥24px thường / ≥18.66px bold) là **3:1**, và "18 points maps to 24 pixels" — <https://webaim.org/articles/contrast/>. Thực hành: chỉ gradient 1 từ display-size (đã là large text), 2 stop đều là gold sáng (`#fcd34d`→`#f59e0b`) để điểm tối nhất vẫn sáng trên `#080b14`; đo thực tế bằng WebAIM checker trước khi merge.
- Tắt reduced-motion: không cần tắt (đã tĩnh) — chỉ cần không gắn thêm animation di chuyển cho lớp này, logic theo — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.
- Áp cho: **Hero headline** (1 từ) + tái dùng cho 1 headline mỗi section dài chữ (Projects / About) để trang nhiều chữ có điểm neo mắt mà không thêm JS.

## 2. Link underline gold offset (hover/focus-only, CSS-only)

- Nguồn: Tailwind docs `text-underline-offset` publish các utility `underline-offset-1/2/4/8` (`text-underline-offset: <n>px`) — <https://tailwindcss.com/docs/text-underline-offset> (mở trực tiếp trong phiên này).
- Cách làm: body link dùng `underline decoration-[#f59e0b]/60 underline-offset-4 hover:decoration-[#fcd34d] focus-visible` giữ nguyên outline gold đã có trong `src/styles/tokens.css` (`:focus-visible { outline: 2px solid var(--color-focus) }`). Chỉ đổi màu/offset khi hover/focus, không autoplay — nên không phát sinh nghĩa vụ pause như orbit autoplay (đối chiếu ngưỡng 2.2.2 trong `docs/research-solar.md` §3.1).
- Chi phí perf: **~0** — `text-decoration` transition trên `:hover`/`:focus` chỉ paint khi tương tác, không rAF, không layout shift nếu giữ `underline-offset` cố định (không animate offset).
- Contrast: mọi trạng thái màu chữ (hover/focus/active) phải đo độc lập, "text in all these states must meet the same contrast requirements (and must be evaluated independently)" — <https://webaim.org/articles/contrast/>; giữ màu chữ `var(--color-fg)`/`--color-fg-soft` (đã đạt trên `#080b14`), chỉ đổi màu gạch chân gold.
- Tắt reduced-motion: không cần block riêng (không có motion liên tục); nếu thêm `transition` thì tokens đã kill toàn cục dưới `reduce` (`transition-duration: 0.01ms` trong `src/styles/tokens.css`), đúng định nghĩa `reduce` = user đã bật giảm motion ở OS — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.
- Áp cho: **mọi section nhiều chữ** (About, project descriptions, footer links) — thay cho việc thêm icon/animation vào đoạn văn.

## 3. Status pulse-dot (chấm ping gold, `motion-safe` only)

- Nguồn: Tailwind docs `animation` publish `animate-ping` (`scale(2) + opacity 0`, keyframes `ping 1s cubic-bezier(0,0,0.2,1) infinite`) với ví dụ badge "notification badges" bằng 2 span lồng nhau (ping tuyệt đối + dot tương đối) — <https://tailwindcss.com/docs/animation> (mở trực tiếp trong phiên này).
- Cách làm: copy đúng cấu trúc 2-span trong docs (`relative flex size-2/3` + `absolute animate-ping` + dot đặc), đổi màu sang gold token (`bg-[#f59e0b]`), đặt cạnh pill "All repos public" (footer) hoặc chip "LIVE DEMO" (project card). Docs cũng publish pattern hỗ trợ reduced-motion bằng variant `motion-safe:`/`motion-reduce:` ("For situations where the user has specified that they prefer reduced motion, you can conditionally apply animations… using the `motion-safe` and `motion-reduce` variants") — <https://tailwindcss.com/docs/animation>.
- Chi phí perf: **thấp** — 1–3 node/dot, animation opacity+scale (compositor-friendly), không JS; chỉ dùng tối đa 1 dot/section, cấm rải toàn trang (rủi ro vestibular khi nhân bản — scaling/panning vật lớn là trigger theo — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>).
- Tắt reduced-motion: dùng `motion-safe:animate-ping` (chỉ chạy khi `no-preference`) + dot đặc luôn hiển thị tĩnh dưới `reduce` — đúng variant docs khuyến nghị — <https://tailwindcss.com/docs/animation>; nền đã có tiền lệ `motion-reduce:animate-none` cho starfield trong `src/sections/Hero.tsx`.
- Contrast: dot là non-text (3:1 với nền kề, không phải 4.5:1 của text) — ngưỡng non-text/UI 3:1 trích trong — <https://webaim.org/articles/contrast/> (§1.4.11); chữ cạnh dot vẫn giữ 4.5:1 theo — <https://webaim.org/articles/contrast/> (§1.4.3).
- Áp cho: **Footer status pill** + **chip "live demo" trên project card** (kế thừa `docs/research-patterns.md` §4.4 nhưng thay pill tĩnh bằng dot ping có guard).

## 4. Tabular-nums cho stats/stars (chống giật số, CSS 1 dòng)

- Nguồn: MDN `font-variant-numeric` định nghĩa `tabular-nums` ("numbers are all of the same size, allowing them to be easily aligned like in tables", OpenType `tnum`) — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric> (mở trực tiếp trong phiên này).
- Cách làm: class `tabular-nums` (Tailwind map thẳng sang thuộc tính trên) cho mọi con số JetBrains Mono: star count trong node orbit, stats Stars/Repos/Contributors (pattern counter `docs/research-patterns.md` §1.3), dates. Thuộc tính này `Inherited: yes`, `Animation type: discrete` nên không gây animation — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric>.
- Chi phí perf: **0** — 1 thuộc tính CSS, không JS, còn giảm layout shift khi số đổi (số đẳng rộng không nudge cột).
- Tắt reduced-motion: không cần (tĩnh); không ảnh hưởng contrast (không đổi màu, chỉ đổi glyph số).
- Áp cho: **Hero node star counts** (`src/sections/Hero.tsx` `<text>` số sao), **section stats/counters**, **footer năm/copyright** — đúng chỗ "hiện nhiều chữ + số" của site.

## 5. Reveal-once khi scroll (IntersectionObserver, chạy 1 lần)

- Nguồn API: `IntersectionObserver` "provides a way to asynchronously observe changes in the intersection of a target element with viewport", quan sát qua `observe()`/`unobserve()`, callback nhận `intersectionRatio` — <https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver> (mở trực tiếp trong phiên này).
- Nguồn behavior chuẩn GSAP-side: ScrollTrigger có flag `once: true` ("will kill() itself as soon as the end position is reached once… perfect for times when you only want an animation to play once") và `toggleActions: "play none none none"` mặc định — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/> (mở trực tiếp trong phiên này). Chọn 1 trong 2 implement (ưu tiên IO thuần vì nhẹ hơn ScrollTrigger cho fade đơn giản).
- Cách làm (JS ít, ~15 dòng): `.reveal { opacity: 0; translate: 0 16px; transition: opacity 600ms, translate 600ms }` + `.reveal.is-in { opacity: 1; translate: none }`; IO threshold 0.15, `unobserve()` ngay khi vào viewport (chạy 1 lần, không re-trigger khi scroll lên/xuống) — semantic khớp `once: true` của — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>.
- Chi phí perf: **thấp** — IO là async, không scroll-listener mỗi frame; mỗi section trigger 1 lần rồi disconnect; chỉ `opacity`+`translate` (compositor) đúng duration token `--duration-slow: 600ms` trong `src/styles/tokens.css`.
- Tắt reduced-motion: gate bằng `matchMedia("(prefers-reduced-motion: reduce)")` — khi `reduce` thì không tạo observer, thêm `is-in` ngay (hiện tĩnh); đúng 2 giá trị `no-preference`/`reduce` của — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>. Song song đó CSS `transition-duration: 0.01ms` toàn cục trong `src/styles/tokens.css` đã triệt tiêu transition còn sót.
- Contrast/a11y: nội dung mặc định trong DOM (không `display:none`), chỉ fade — không mất find-in-page/keyboard; ngưỡng text giữ 4.5:1 theo — <https://webaim.org/articles/contrast/>.
- Áp cho: **Projects grid, About paragraphs, Footer** — trang 1 trang dài chữ cần nhịp hiện dần nhưng cấm parallax/pin (nặng, xung đột `reduce`).

## 6. Anchor offset + render-budget cho trang dài (scroll-margin + content-visibility)

- Nguồn scroll-margin: MDN `scroll-margin-top` ("defines the top margin of the scroll snap area", áp dụng mọi element, giá trị `<length>`) — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-margin-top> (mở trực tiếp); Tailwind publish utilities `scroll-mt-<number>` (`scroll-margin-top`) kèm docs responsive/breakpoint — <https://tailwindcss.com/docs/scroll-margin> (mở trực tiếp trong phiên này).
- Nguồn render-budget: MDN `content-visibility: auto` ("skip… rendering work until it becomes needed… makes the initial page load much faster", kèm ví dụ `section { content-visibility: auto; contain-intrinsic-size: auto 500px; }` cho long pages) và khẳng định "Off-screen content within a `content-visibility: auto`… remains in the DOM and the accessibility tree" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility> (mở trực tiếp trong phiên này).
- Cách làm: mỗi `<section id>` thêm `scroll-mt-20/24` (trừ chiều cao sticky nav, không JS); các section dưới fold thêm `content-visibility: auto; contain-intrinsic-size: auto 600px` (giữ chiều cao placeholder chống layout shift) — cả 2 đều CSS thuần, 0 JS.
- Chi phí perf: **âm (tiết kiệm)** — `scroll-margin` 0 cost runtime; `content-visibility: auto` bỏ layout/paint section ngoài viewport, lợi nhất đúng với "site hiện nhiều chữ" (nhiều section text dài).
- Tắt reduced-motion: không cần (cả 2 đều không phải animation); `content-visibility: auto` giữ a11y tree theo — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility>.
- Contrast: không đổi màu/chữ nên không ảnh hưởng 4.5:1 — <https://webaim.org/articles/contrast/>.
- Áp cho: **toàn bộ section có anchor** (`#projects`, `#about`, `#contact`) + **mọi section text dài dưới fold**.

---

## Phụ lục: thứ tự triển khai (wow/rủi ro) và cái đã loại

| # | Pattern (file này) | Vì sao thứ tự này |
|---|---|---|
| 1 | §6 scroll-margin + content-visibility | 0 JS, cứu trang dài chữ ngay, rủi ro ~0 |
| 2 | §4 tabular-nums | 1 class, hết giật số, rủi ro 0 |
| 3 | §2 underline offset | Mọi link đọc được hơn, 0 motion |
| 4 | §1 gradient keyword | 1 từ/headline, tĩnh, đo contrast 1 lần |
| 5 | §5 reveal-once | JS ít, chỉ sau khi 1–4 xong, gate `reduce` bắt buộc |
| 6 | §3 pulse-dot | Animation duy nhất trong file — để cuối, ≤3 dot, `motion-safe` only |

- Đã loại (trùng hoặc blacklist): canvas starfield full-sky, orbit thêm vòng, magnetic button toàn trang, spotlight toàn trang, back-to-top, live-clock, custom scrollbar, meme headline — lý do xem `docs/research-patterns.md` §5 và `docs/research-solar.md` §1–§3.
- Công tắc chung: giữ block `prefers-reduced-motion: reduce` trong `src/styles/tokens.css` + gate JS bằng `gsap.matchMedia`/`matchMedia` (tiền lệ `MOTION_OK_QUERY` trong `src/sections/Hero.tsx`).

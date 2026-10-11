# Research: Showcase FX lòe loẹt nhưng pro (đợt 3, gói B1)

> Context site áp dụng: org 1 trang Astro static, nền `#080b14`, accent gold `#f59e0b`/`#fcd34d`, font Space Grotesk + Inter + JetBrains Mono, Tailwind v4, GSAP, hero đã có orbit 5 repo + starfield 46 sao CSS (`src/sections/Hero.tsx`), tokens đã có `bg-blueprint`, `bg-aurora`, `::selection` gold, `animate-twinkle` (`src/styles/tokens.css`).
> Quy tắc file này: CHỈ primary sources (trang đã mở trực tiếp trong phiên này, docs chính thức). Mỗi claim kèm URL nguồn ngay sau câu.
> Không trùng: `docs/research-patterns.md` (§2 starfield A/B/C, §4 magnetic/spotlight/copy/status-pill, §5 bảng 7 pattern), `docs/research-solar.md` (orbit `svgOrigin`, counter-rotation, pause 2.2.2, target 24px, contrast label 10–11px), `docs/research-visual-fx.md` (gradient keyword, underline offset, pulse-dot, tabular-nums, reveal-once, scroll-margin + content-visibility). Chỗ nào gần với pattern cũ sẽ ghi rõ điểm khác biệt.

## 0. Phương pháp và giới hạn quan sát

- Tất cả URL dưới đây được **mở trực tiếp bằng fetch ngày 2026-10-11**, không viết theo trí nhớ.
- Giới hạn công cụ: fetch trả về **nội dung/cấu trúc** (markdown đã strip), nên motion mượt mà, màu pixel, blur thực tế **không quan sát được trực tiếp** — mọi claim visual thuần túy được ghi rõ là "không xác thực được độ mượt/màu qua fetch" hoặc chỉ nêu ở mức cấu trúc/props đã publish.
- Các site production Linear / Raycast / Cal / OpenStatus / TypeHero **không mở lại trong phiên này**, nên file này **không claim** site nào dùng pattern nào — production lineage duy nhất được mở trực tiếp trong phiên là Dub (`https://www.dub.co/`), còn lại lineage là **demo live trên Aceternity** (site thật đang chạy pattern) + docs chính thức (MDN, WebAIM, GSAP).
- 1 URL mở sai path trả 404 (`https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Media/pointer`), đã mở lại đúng path `@media/pointer` — ghi rõ để trung thực.

---

## 1. Marquee vô hạn (dải tech-stack / contributors chạy ngang)

- Nguồn demo: trang Infinite Moving Cards ghi "A customizable group of cards that move infinitely in a loop. Made with Framer Motion and Tailwind CSS." — <https://ui.aceternity.com/components/infinite-moving-cards> (mở trực tiếp trong phiên này).
- Trang publish keyframes Tailwind v4 chuẩn để copy: `--animate-scroll: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite;` với `@keyframes scroll { to { transform: translate(calc(-50% - 0.5rem)); } }` — <https://ui.aceternity.com/components/infinite-moving-cards> (mở trực tiếp trong phiên này).
- Props đã publish trên cùng trang: `direction` (`"left" | "right"`, mặc định `"left"`), `speed` (`"fast" | "normal" | "slow"`, mặc định `"fast"`), `pauseOnHover` (boolean, mặc định `true`) — <https://ui.aceternity.com/components/infinite-moving-cards> (mở trực tiếp trong phiên này).
- Cách làm tối giản (CSS-only, ~20 dòng): nhân đôi list item (2 bản giống hệt, bản 2 `aria-hidden="true"`), track `display: flex; width: max-content; animation: scroll 40s linear infinite;`, hover `animation-play-state: paused` — đúng keyframes `translate(-50%)` của trang trên — <https://ui.aceternity.com/components/infinite-moving-cards>.
- Chi phí perf: **thấp** — 1 animation `transform` duy nhất trên track (compositor-friendly, không layout/paint mỗi frame), số node gấp đôi nhưng là DOM tĩnh; chỉ đắt khi nhồi ảnh nặng vào item (tránh, chỉ dùng chip chữ + icon SVG).
- Tắt dưới reduced-motion: marquee autoplay vô hạn thuộc nhóm motion tự chạy — khi `reduce` thì **dừng hẳn** (`animation: none`, hiện dải tĩnh cuộn ngang bằng overflow-x hoặc grid tĩnh), đúng 2 giá trị `no-preference`/`reduce` của — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>; đồng thời tokens đã kill CSS motion toàn cục dưới `reduce` trong `src/styles/tokens.css`.
- Áp cho section nào: **dải tech-stack** (TypeScript / Astro / GSAP / Tailwind…) giữa Hero và Projects, hoặc dải contributor names sau Members — 1 marquee duy nhất toàn trang, `speed` chậm (~40–60s/vòng), chữ mono gold-dim.
- Contrast/a11y: chữ trong marquee vẫn là text thường nên ngưỡng **4.5:1**, large text (≥24px thường / ≥18.66px bold) là **3:1**, và "18 points maps to 24 pixels" — <https://webaim.org/articles/contrast/>; bản duplicate `aria-hidden` để screen reader không đọc 2 lần; vùng marquee `overflow: hidden` phải có fallback đọc được khi tắt animation.

## 2. Bento tilt 3D (project cards nghiêng theo chuột)

- Nguồn demo: trang 3D Card Effect ghi "A card perspective effect, hover over the card to elevate card elements." — <https://ui.aceternity.com/components/3d-card-effect> (mở trực tiếp trong phiên này).
- Props đã publish trên cùng trang: `CardContainer` (`children`, `className`, `containerClassName`), `CardBody`, `CardItem` với `translateX/translateY/translateZ` và `rotateX/rotateY/rotateZ` (number hoặc string) — <https://ui.aceternity.com/components/3d-card-effect> (mở trực tiếp trong phiên này).
- Khác với spotlight đã có (`docs/research-patterns.md` §4.2 là glow theo chuột hiện radial): tilt là **biến dạng perspective của cả card** (rotateX/rotateY theo vị trí chuột + translateZ từng lớp), không phải lớp glow phủ thêm — 2 hiệu ứng cộng được nhưng tính là 2 chi phí riêng.
- Cách làm tối giản (JS ít, không cần lib): container `perspective: 1000px`, card `transform-style: preserve-3d`, listener `mousemove` tính `rotateX/rotateY` tối đa ±6–8°, `mouseleave` reset về 0 với transition 400ms — pattern tương đương props `rotateX/rotateY` của trang trên — <https://ui.aceternity.com/components/3d-card-effect>.
- Chi phí perf: **thấp–trung bình** — chỉ `transform` (compositor) khi đang hover, idle 0 cost; đắt khi gắn cho cả grid cùng lúc (mỗi card 1 listener) → chỉ gắn **1 featured card** (repo top-1 sao), các card còn lại tĩnh.
- Tắt dưới reduced-motion: khi `reduce` thì **không gắn listener tilt**, card hiện tĩnh; GSAP-side dùng nhánh `gsap.matchMedia` `reduce` → chỉ fade opacity, không xoay — đúng snippet chuẩn trang a11y của GSAP — <https://gsap.com/resources/a11y>; CSS-state tương đương `reduce` = user đã bật giảm motion ở OS — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.
- Áp cho section nào: **Projects bento grid** — card repo top-1 (kèm demo) tilt nhẹ, inner `CardItem` translateZ cho star-count badge nổi lên; mobile/coarse pointer hiện tĩnh.
- Contrast/a11y: tilt không đổi màu nên không ảnh hưởng ratio, nhưng mọi trạng thái hover/focus của text "must meet the same contrast requirements (and must be evaluated independently)" — <https://webaim.org/articles/contrast/>; card vẫn là `<a>` focus được, `:focus-visible` giữ outline gold trong `src/styles/tokens.css`; không dùng tilt để truyền thông tin (decorative → bỏ hẳn khi `reduce` là đúng, theo câu hỏi "decorative hay functional? … removing it entirely is the best option" — <https://gsap.com/resources/a11y>).

## 3. Scroll progress bar (thanh gold chạy theo % cuộn)

- Nguồn API: ScrollTrigger config `onUpdate` "gets called every time the progress of the ScrollTrigger changes", callback nhận instance có `progress` — ví dụ `onUpdate: self => console.log("progress", self.progress)` — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/> (mở trực tiếp trong phiên này).
- Cùng trang document `scrub: true` "links the animation's progress directly to the scrollbar" và `scrub: <number>` làm mượt catch-up — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/> (mở trực tiếp trong phiên này); progress bar dùng `onUpdate` (JS thuần, không cần scrub timeline).
- Cách làm tối giản (~10 dòng, 0 lib mới): thanh `position: fixed; top: 0; height: 2–3px; background: linear-gradient(90deg, #f59e0b, #fcd34d); transform-origin: 0 50%;` + `ScrollTrigger.create({ start: 0, end: "max", onUpdate: self => bar.style.transform = scaleX(self.progress) })` — dùng đúng `progress` 0→1 của — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>; fallback không-GSAP: `scroll` listener tính `scrollY / (scrollHeight - innerHeight)`.
- Chi phí perf: **thấp** — 1 node fixed, chỉ `transform: scaleX` (compositor), update theo scroll event đã được ScrollTrigger batch; tránh `width` (gây layout mỗi frame).
- Tắt dưới reduced-motion: progress bar **gắn với scroll của user** (dừng scroll = dừng motion, user kiểm soát) nên không phải autoplay vestibular trigger kiểu "scaling or panning large objects" — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>; thực hành: giữ thanh tĩnh (vẫn hiện % đúng, không transition mượt) hoặc ẩn hẳn dưới `reduce` — chọn ẩn nếu muốn tối giản vì nó là decorative.
- Áp cho section nào: **toàn trang** (fixed top, dưới nav), 2px gold gradient — hợp nhất với site 1 trang dài chữ vì cho user biết còn bao nhiêu section.
- Contrast/a11y: thanh 2–3px là non-text/UI → ngưỡng **3:1 với màu kề** (nền `#080b14`), không phải 4.5:1 của text — ngưỡng non-text/UI 3:1 trích trong — <https://webaim.org/articles/contrast/> (§1.4.11); thanh `aria-hidden="true"` (decorative, thông tin % cuộn không cần đọc); không làm thanh clickable để khỏi thêm target.

## 4. Cursor glow theo chuột (section-level, khác spotlight-card)

- Nguồn lineage: trang Following Pointer ghi "A custom pointer that follows mouse arrow and animates in pointer and content." với props `FollowerPointerCard` (`children`, `className`, `title`) — <https://ui.aceternity.com/components/following-pointer> (mở trực tiếp trong phiên này).
- Điểm khác với spotlight đã có (`docs/research-patterns.md` §4.2 Card Spotlight: radial glow **trong từng card** theo hover, props `radius` 350px): cursor glow ở đây là **1 lớp radial duy nhất phủ cả section**, tâm di chuyển theo chuột toàn section qua CSS vars `--mx/--my` — rẻ hơn spotlight khi grid đông card (1 layer vs N layer).
- Cách làm tối giản (CSS vars + 1 listener/section): section có `::before { background: radial-gradient(480px at var(--mx) var(--my), rgb(245 158 11 / 0.08), transparent 70%); }`, JS `mousemove` (rAF-throttle) set vars; không có hover thì lớp glow đứng yên ở tâm — không cần Framer Motion của demo gốc — <https://ui.aceternity.com/components/following-pointer>.
- Chi phí perf: **thấp** nếu 1 section + rAF-throttle (paint radial-gradient mỗi frame chuột di, nhưng chỉ khi di chuột); **đắt** nếu phủ toàn trang + gradient lớn → giới hạn **Hero + CTA/footer** (2 vùng), radius ≤480px, opacity ≤10%.
- Tắt dưới reduced-motion + mobile: khi `reduce` thì không gắn listener (glow đứng yên hoặc ẩn) — đúng logic `reduce` của — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>; khi `(pointer: coarse)` (ngón tay touchscreen, kém chính xác) thì tắt hẳn vì không có hover — định nghĩa `coarse`/`fine` trong — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer>.
- Áp cho section nào: **Hero** (dưới orbit, trên `bg-aurora` đã có) + **CTA/contact cuối trang** — tuyệt đối không phủ lên đoạn văn dài (làm chữ khó đọc khi nền sáng lên theo chuột).
- Contrast/a11y: glow làm nền sau chữ **sáng lên cục bộ** nên text trên vùng glow vẫn phải đạt chuẩn ở điểm contrast thấp nhất — "recommend usually testing the area where contrast is lowest" — <https://webaim.org/articles/contrast/>; giữ opacity ≤0.10 để chữ `var(--color-fg)` không rớt dưới 4.5:1; lớp glow `pointer-events: none` + `aria-hidden`.

## 5. Gradient border (viền gold chạy quanh featured card / CTA)

- Nguồn demo 1: trang Moving Border ghi "A border that moves around the container. Perfect for making your buttons stand out." — <https://ui.aceternity.com/components/moving-border> (mở trực tiếp trong phiên này).
- Props đã publish trên cùng trang: `borderRadius` (mặc định `"1.75rem"`), `duration` (mặc định `2000`ms), `borderClassName`, `containerClassName`, `as` (mặc định `"button"`) — <https://ui.aceternity.com/components/moving-border> (mở trực tiếp trong phiên này).
- Nguồn demo 2: trang Hover Border Gradient ghi "A hover effect that expands to the entire container with a gradient border." với props `duration` (mặc định `1`s), `clockwise` (mặc định `true`), `as` (mặc định `"button"`) — <https://ui.aceternity.com/components/hover-border-gradient> (mở trực tiếp trong phiên này).
- Cách làm tối giản (CSS-only, không JS): wrapper `padding: 1.5px; border-radius: 1rem; background: conic-gradient(from var(--a), #f59e0b, #fcd34d, transparent 40%, #f59e0b);` + `@property --a` animate xoay 4–6s linear infinite (bản moving), hoặc chỉ hiện gradient khi `:hover/:focus-visible` (bản hover — rẻ hơn, khuyến nghị); inner card nền `#080b14` đè lên giữa.
- Chi phí perf: bản moving **trung bình** (paint conic-gradient xoay mỗi frame, chỉ 1–2 node); bản hover-only **~0 khi idle** (tĩnh, chỉ paint khi hover) — chốt bản hover cho org, moving chỉ cho **1 CTA duy nhất** nếu muốn.
- Tắt dưới reduced-motion: khi `reduce` thì `animation: none`, giữ **viền gold tĩnh** (border 1px `#f59e0b`/60) — vẫn đẹp, đúng tinh thần "tone-down thay vì giữ nguyên" của MDN — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>; tokens đã có kill-switch toàn cục trong `src/styles/tokens.css`.
- Áp cho section nào: **featured repo card** (top-1 sao) + **CTA "Star us on GitHub"** cuối trang — tối đa 2 vị trí, cấm rải cả grid (loãng focus + tốn paint).
- Contrast/a11y: viền là non-text → **3:1 với nền kề** — <https://webaim.org/articles/contrast/> (§1.4.11); text trong card giữ 4.5:1 độc lập mọi state hover/focus — <https://webaim.org/articles/contrast/>; nếu `as="button"`/link thì giữ `:focus-visible` outline gold đã có.

## 6. Noise/grain overlay tĩnh (film grain cho nền dark)

- Nguồn lineage: trang Noise Background ghi "A dynamic background effect with animated gradients, noise texture, and smooth motion." — <https://ui.aceternity.com/components/noise-background> (mở trực tiếp trong phiên này).
- Props đã publish trên cùng trang: `noiseIntensity` (0–1, mặc định `0.2`), `speed` (mặc định `0.1`), `animating` (mặc định `true`), `backdropBlur`, `gradientColors` — <https://ui.aceternity.com/components/noise-background> (mở trực tiếp trong phiên này).
- Khác biệt chốt cho org: dùng **bản tĩnh** (`animating = false` tương đương: noise render 1 lần, không di chuyển gradient) — vì site đã có orbit GSAP + starfield twinkle trong `src/sections/Hero.tsx`, thêm gradient động nữa là 3 motion nền chồng nhau.
- Cách làm tối giản (CSS-only, 0 JS): overlay `position: fixed; inset: 0; pointer-events: none; opacity: 0.05–0.07;` với `background-image: url("data:image/svg+xml,...feTurbulence...")` tile 180–240px — tương đương `noiseIntensity: 0.2` ở opacity thấp của trang trên — <https://ui.aceternity.com/components/noise-background>; SVG tile inline nên không thêm request mạng.
- Chi phí perf: **~0 khi tĩnh** (1 layer paint 1 lần, compositor giữ); bản `animating: true` (di chuyển gradient + noise) tốn paint mỗi frame toàn màn hình — **không dùng** cho Astro static.
- Tắt dưới reduced-motion: đã tĩnh nên **không cần tắt** — chỉ cần cam kết không gắn animation cho lớp này, đúng định nghĩa `reduce` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.
- Áp cho section nào: **toàn trang** (1 fixed overlay dưới content, trên `bg-aurora`/`bg-blueprint`), opacity 0.05 — cho nền `#080b14` đỡ "phẳng nhựa", ảnh chụp màn hình vẫn sạch.
- Contrast/a11y: grain 5–7% opacity không đổi màu chữ đo được (text vẫn 4.5:1 — <https://webaim.org/articles/contrast/>); overlay `aria-hidden` + `pointer-events: none`; người nhạy cảm pattern/visual-noise nặng nên giữ opacity ≤0.07 (khuyến nghị thực hành, không phải ngưỡng WCAG).

## 7. Counter count-up (Stars / Repos / Contributors nhảy số khi vào viewport)

- Nguồn production (mở trực tiếp trong phiên này): Dub có section "Built to scale" với 3 counters "Links Created / Events Tracked / Revenue Tracked" đứng thay testimonial — <https://www.dub.co/> (mở trực tiếp trong phiên này).
- Ghi rõ ranh giới: `docs/research-patterns.md` §1.3 đã nêu pattern counter của Dub ở mức cấu trúc; section này bổ sung **cách implement tối giản** (chưa có ở file cũ).
- Nguồn API trigger: `IntersectionObserver` "provides a way to asynchronously observe changes in the intersection of a target element with viewport", quản lý bằng `observe()`/`unobserve()` — <https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver> (mở trực tiếp trong phiên này).
- Nguồn API animation: `window.requestAnimationFrame()` "tells the browser you wish to perform an animation… before the next repaint", tần suất khớp refresh rate, "paused in most browsers when running in background tabs… to improve performance and battery life", và "must call requestAnimationFrame() again if you want to animate another frame… one-shot" — <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame> (mở trực tiếp trong phiên này).
- Cách làm tối giản (~25 dòng): IO threshold 0.4 trigger 1 lần → `unobserve()` ngay; rAF loop 1200ms ease-out từ 0 → target, format `toLocaleString("en-US")` + `tabular-nums` (đã research ở `docs/research-visual-fx.md` §4 để số không giật); server render số cuối sẵn trong HTML, JS chỉ animate khi `no-preference`.
- Chi phí perf: **thấp** — IO async không scroll-listener, rAF chạy 1.2s/counter rồi dừng hẳn, 3 counters song song vẫn rẻ; nền tab thì browser tự pause rAF — <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame>.
- Tắt dưới reduced-motion: khi `reduce` thì **không tạo observer/loop, hiện số cuối tĩnh** (đã có sẵn trong HTML) — đúng 2 giá trị `no-preference`/`reduce` — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>; đây là "functional" info (con số thật) nên giữ thông tin, bỏ animation — đúng câu hỏi "decorative hay functional?" của — <https://gsap.com/resources/a11y>.
- Áp cho section nào: **Stats strip** (Stars / Repos / Contributors) ngay sau Hero hoặc trước Projects — ánh xạ 1:1 từ "Built to scale" của Dub — <https://www.dub.co/>.
- Contrast/a11y: số là text → **4.5:1** (số display-size lớn có thể hưởng 3:1 large-text — <https://webaim.org/articles/contrast/>); dùng `<output>`/`aria-live="off"` (không đọc số nhảy gây ồn screen reader, chỉ đọc số cuối); tôn trọng `tabular-nums`.

## 8. Timeline draw-on-scroll (vạch beam vẽ theo milestone khi cuộn)

- Nguồn demo 1: trang Tracing Beam ghi "A Beam that follows the path of an SVG as the user scrolls. Adjusts beam length with scroll speed." với props `className`, `children` — <https://ui.aceternity.com/components/tracing-beam> (mở trực tiếp trong phiên này).
- Nguồn demo 2: trang Timeline ghi "A timeline component with sticky header and scroll beam follow." với data type `TimelineEntry = { title: string; content: React.ReactNode }` — <https://ui.aceternity.com/components/timeline> (mở trực tiếp trong phiên này).
- Nguồn scroll-link: ScrollTrigger `scrub: true` "links the animation's progress directly to the scrollbar" — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/> (mở trực tiếp trong phiên này); `once: true` "will kill() itself as soon as the end position is reached once… perfect for times when you only want an animation to play once" — cùng trang — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>.
- Khác với timeline chữ của OpenStatus trong `docs/research-patterns.md` §1.5 (timestamp divider thuần cấu trúc): đây là **vạch SVG vẽ dần theo scroll** (stroke-dashoffset đi theo progress), tức thêm motion vào timeline đã có.
- Cách làm tối giản (GSAP, ~20 dòng): spine SVG `path` dài, CSS `stroke-dasharray/offset` = chiều dài path; `gsap.to(path, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: "#milestones", start: "top 70%", end: "bottom 60%", scrub: 0.5 } })` — đúng semantics `scrub` của — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>; dot mỗi mốc `toggleClass: "active"` khi qua.
- Chi phí perf: **trung bình** — scrub update `stroke` mỗi frame scroll (paint đường 2px, rẻ hơn blur/shadow); chỉ 1 path + vài dot; `once`-style: giữ scrub (vẽ lui khi cuộn lên là đúng UX timeline, không kill).
- Tắt dưới reduced-motion: khi `reduce` thì **không tạo scrub tween, spine hiện đầy đủ tĩnh** (milestone đọc như list thường) — qua `gsap.matchMedia` nhánh `reduce` theo snippet chuẩn — <https://gsap.com/resources/a11y>; motion này do user điều khiển (scroll) nhưng vẫn là large-swipe trigger nên tắt là an toàn — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.
- Áp cho section nào: **Milestones/Journey** (repo ra đời → 100 stars → top-5 OSS…) giữa Projects và About — data shape copy `TimelineEntry` trên — <https://ui.aceternity.com/components/timeline>.
- Contrast/a11y: spine gold trên `#080b14` là non-text → **3:1** — <https://webaim.org/articles/contrast/>; text milestone 4.5:1 — <https://webaim.org/articles/contrast/>; spine `aria-hidden`, nội dung milestone là list HTML thật (screen reader đọc không cần SVG).

## 9. Lamp section divider (header phát sáng kiểu Linear)

- Nguồn demo: trang Lamp Section Header ghi "A lamp effect as seen on linear, great for section headers." với props `children`, `className` — <https://ui.aceternity.com/components/lamp-effect> (mở trực tiếp trong phiên này).
- Ghi rõ trung thực: lineage "as seen on linear" là **lời của trang demo**, research này không mở linear.app trong phiên nên không xác thực độc lập — không claim Linear dùng thật; bằng chứng dùng được là demo live của chính Aceternity — <https://ui.aceternity.com/components/lamp-effect>.
- Khác với divider chữ trong `docs/research-patterns.md` §3.4 (eyebrow/numbered/timestamp thuần typography, 0 CSS): lamp là **visual divider** (cone sáng + headline nổi trên) — dùng thay nhau, không dùng cùng lúc 2 divider/section.
- Cách làm tối giản (CSS-only): header có `::before` cone `conic-gradient(from 180deg at 50% 0%, transparent 42%, rgb(245 158 11 / 0.18), transparent 58%)` mask fade + headline Space Grotesk gold; entry fade 1 lần bằng reveal-once đã có (`docs/research-visual-fx.md` §5), không autoplay loop.
- Chi phí perf: **~0 khi tĩnh** (2 gradient paint 1 lần); nếu thêm shimmer loop thì thành animation vô hạn toàn section — **không thêm**, giữ tĩnh + reveal-once.
- Tắt dưới reduced-motion: đã tĩnh (trừ reveal-once 1 lần đã có gate `reduce` → hiện ngay trong `docs/research-visual-fx.md` §5) nên không cần block riêng — đúng `reduce` là setting giảm motion ở OS — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>.
- Áp cho section nào: **tối đa 2 header** (Projects + Contact/CTA) — headline display-size, cone gold thay vì trắng của demo gốc để hợp accent.
- Contrast/a11y: headline display-size hưởng ngưỡng large-text **3:1** nhưng thực hành giữ ≥4.5:1 vì cone sáng làm nền biến thiên — đo ở điểm nền sáng nhất, "testing the area where contrast is lowest" — <https://webaim.org/articles/contrast/>; cone `aria-hidden`, headline là `<h2>` thật.

---

## 10. Bảng xếp wow / rủi ro (cao → thấp, chỉ tính file này)

| # | Hiệu ứng | Wow | Rủi ro | Một câu chốt + nguồn chính |
|---|----------|-----|--------|-----------------------------|
| 1 | Scroll progress bar (§3) | ★★★★ | ~0 | 1 node fixed + `scaleX(progress)`, idle 0 cost — `onUpdate: self.progress` — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>. |
| 2 | Counter count-up (§7) | ★★★★ | thấp | Số nhảy 1.2s rồi dừng, rAF tự pause nền tab — lineage Dub "Built to scale" — <https://www.dub.co/>, loop rAF — <https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame>. |
| 3 | Marquee tech-stack (§1) | ★★★★ | thấp | 1 keyframes `translate(-50%)` + `pauseOnHover` có sẵn — <https://ui.aceternity.com/components/infinite-moving-cards>. |
| 4 | Gradient border hover (§5) | ★★★★ | thấp | Bản hover-only idle ~0, `duration`/`clockwise` publish sẵn — <https://ui.aceternity.com/components/hover-border-gradient>. |
| 5 | Noise tĩnh (§6) | ★★★ | ~0 | 1 layer paint 1 lần, `noiseIntensity 0.2` + `animating: false` tương đương — <https://ui.aceternity.com/components/noise-background>. |
| 6 | Lamp divider (§9) | ★★★ | ~0 | Tĩnh + reveal-once đã có, tối đa 2 header — <https://ui.aceternity.com/components/lamp-effect>. |
| 7 | Bento tilt (§2) | ★★★★ | trung bình | Chỉ 1 featured card, ±6–8°, coarse/`reduce` → tĩnh — props `rotateX/rotateY` — <https://ui.aceternity.com/components/3d-card-effect>. |
| 8 | Cursor glow section (§4) | ★★★ | trung bình | 1 layer/section, rAF-throttle, `(pointer: coarse)` tắt — lineage — <https://ui.aceternity.com/components/following-pointer>, pointer — <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer>. |
| 9 | Timeline draw (§8) | ★★★★★ | cao nhất | Wow nhất nhưng thêm scrub tween toàn section — beam theo scroll — <https://ui.aceternity.com/components/tracing-beam>, `scrub` — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>; làm cuối cùng. |

- Thứ tự triển khai khuyến nghị: §3 → §7 → §5 → §6 → §1 → §9 → §2 → §4 → §8 (tĩnh/rẻ trước, motion/scrub sau).
- Công tắc chung giữ nguyên: block `prefers-reduced-motion: reduce` trong `src/styles/tokens.css` + gate JS bằng `gsap.matchMedia`/`matchMedia` (tiền lệ `MOTION_OK_QUERY` trong `src/sections/Hero.tsx`) — đúng snippet `gsap.matchMedia` 2 nhánh của — <https://gsap.com/resources/a11y>.

## 11. Blacklist giữ nguyên (không làm)

- No back-to-top, no live-clock, no meme — không site mẫu nào có, đã kết luận trong `docs/research-patterns.md` §3.4 + §4.4 — giữ nguyên.
- Không thêm từ file này: magnetic toàn trang (chỉ demo, đã loại ở `docs/research-patterns.md` §4.1/§5), spotlight toàn trang (đã có per-card ở `docs/research-patterns.md` §4.2 — §4 file này là 1 layer/section, không phải per-card, không tính là trùng nhưng cấm dùng cả 2 cùng lúc trên cùng grid), canvas starfield full-sky mới (đã có §2 `docs/research-patterns.md` + starfield CSS trong `src/sections/Hero.tsx`), parallax/pin (nặng, xung đột `reduce` — đã cấm ở `docs/research-visual-fx.md` §5), custom scrollbar (rủi ro a11y, 0 bằng chứng — `docs/research-patterns.md` §3.4).
- Giới hạn số lượng: marquee ≤1, tilt ≤1 card, moving-border động ≤1 CTA (còn lại hover-only), cursor glow ≤2 section, lamp ≤2 header, noise 1 layer — trang 1 màn hình không chịu nổi 9 hiệu ứng chạy cùng lúc.

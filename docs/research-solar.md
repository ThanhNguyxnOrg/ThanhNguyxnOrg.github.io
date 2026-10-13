# Research: Solar / Orbit Hero (5 repo nodes quanh logo trung tâm)

> Phạm vi: hero bản đồ 5 repo top-sao quay quanh logo trung tâm.
> Quy tắc của file này: CHỈ primary sources (docs chính thức, spec W3C, MDN, website đã mở trực tiếp).
> Mỗi claim đều kèm URL nguồn ngay sau câu.
> Lưu ý context: file `GLOSSARY.md` được đề cập trong yêu cầu **không tồn tại** trong repo tại thời điểm
> research (đã kiểm tra thư mục gốc ngày 2026-10-11) — nên file này không trích dẫn nó.

---

## 1. Ví dụ thật: 4 website đã MỞ trực tiếp, từng làm motif quỹ đạo / node-map chuyển động

### 1.1. TailwindFlex — "Interactive Multi-Layer Orbit Animation with Tailwind CSS"

- URL: <https://tailwindflex.com/@arshidiqbaldev/interactive-multi-layer-orbit-animation-with-tailwind-css>
- Đây là ví dụ gần nhất với hero của site: **logo tĩnh ở tâm + 3 vòng tròn đồng tâm (38% / 62% / 84%)**,
  mỗi vòng gắn 6 icon-node, vòng quay bằng CSS keyframes (`animate-circle-slow/mid/fast`),
  **node counter-quay ngược (`animate-circle-content-slow/mid/fast`) để icon luôn đứng thẳng**
  — quan sát trực tiếp từ source code nhúng trên trang.
- Làm tốt:
  - Counter-rotation giữ icon/node thẳng đứng khi vòng quay → đúng pattern ta cần cho label repo.
  - Vòng orbit chỉ là `border border-zinc-50/20` mờ + `mask-[radial-gradient(...)]` làm mờ rìa ngoài,
    nền tối `bg-gray-950` → node nổi rõ mà không cần label.
  - Kích thước vòng theo `%` của container vuông (`aspect-square`) nên responsive không cần breakpoint riêng.
- Cái dở để tránh:
  - **Không có nút pause/stop nào**, animation chạy vô hạn — rơi đúng trường hợp WCAG 2.2.2 (xem §3.1).
  - Node **không clickable, không có label chữ nào** — với hero "bản đồ repo" thì đây là thiếu sót chức năng,
    và cũng né được vấn đề "chữ xoay khó đọc" bằng cách… không có chữ.
  - Không thấy xử lý `prefers-reduced-motion`.

### 1.2. nicholasboidi.tech — portfolio hệ mặt trời 3D, click planet để xem nội dung

- URL: <https://nicholasboidi.tech/>
- Làm tốt:
  - Node **click được**: "click a planet to explore", "click a moon to explore · esc to return" —
    chữ quan sát trực tiếp trên trang; mỗi planet mở nội dung tương ứng (About/Experience/Projects/…).
  - Có **lối thoát khỏi motion**: nút "ENTER ORBIT" kèm "Skip — use simple layout" — tức luôn có bản tĩnh
    cho người không muốn/không dùng được motion. Đây là pattern tốt nhất trong 4 site về mặt accessibility.
  - Onboarding ngay trong hero: 4 gợi ý "Orbit / Zoom / Explore / Navigate" giải thích thao tác
    (drag xoay, scroll zoom, click planet) — node-map chuyển động **bắt buộc phải dạy thao tác**, không tự hiểu được.
- Cái dở để tránh:
  - Phụ thuộc điều khiển con trỏ (drag/scroll/pinch) trên canvas 3D — khả năng vận hành bằng bàn phím
    của các node là dấu hỏi; node-map canvas mà không có danh sách tương đương (list liên kết) sẽ kẹt keyboard user.
  - Nặng 3D, tốn GPU cho một hero mà bản chất chỉ cần 5 node.

### 1.3. thelaraib.com/feature-planet — "rotating frontend universe" cho portfolio

- URL: <https://www.thelaraib.com/feature-planet>
- Làm tốt:
  - Neo motion bằng panel tĩnh: khối "Visual Identity / Metallic, controlled, and futuristic…
    anchors the page so the motion-heavy orbit still feels like part of a premium personal brand system"
    (chữ trên trang) — bài học: **giữ một vùng tĩnh (logo + tóm tắt) để mắt có chỗ nghỉ** giữa nền xoay.
  - Phân tầng nội dung theo lớp quỹ đạo (Foundation/Advanced/Expert Zone) + "Progress Signal" — orbit mang
    **ý nghĩa thông tin** (vòng trong = cơ bản → vòng ngoài = nâng cao), không xoay cho đẹp.
- Cái dở để tránh:
  - Motion dày đặc toàn trang + autoplay nhiều lớp; không thấy nút pause tổng — nguy cơ vi phạm 2.2.2 (§3.1).
  - Trang chữ nhiều phủ trên nền động — đúng vấn đề contrast nền biến thiên (§4).

### 1.4. bodhimooij.com/lab/orbit — orbit gắn với scroll thay vì autoplay

- URL: <https://www.bodhimooij.com/lab/orbit>
- Mô tả trên trang: "Scroll-pinned orbit of portrait images that rotate 180° and spread outward
  while centered headline copy scales and fades in."
- Làm tốt:
  - Motion **do người dùng điều khiển (scroll)** chứ không tự chạy → dừng scroll là dừng motion,
    về bản chất đã là "user control", né được nghĩa vụ nút pause của 2.2.2 mà vẫn có hiệu ứng orbit.
  - Component có tham số cấu hình công khai (spread, scroll length) — orbit nên có tham số tốc độ/bán kính,
    không hard-code.
- Cái dở để tránh:
  - Source đóng ("Source for this component is private") — không học được kỹ thuật, chỉ học được ý tưởng.
  - Scroll-pin/scroll-jacking dễ gây khó chịu và xung đột với reduced-motion nếu không tắt khi `reduce`.

### Tổng kết cái dở chung (tránh cho hero 5 repo)

1. Autoplay vô hạn + không nút pause → vi phạm WCAG 2.2.2 khi đủ 3 điều kiện (§3.1). 3/4 site mắc.
2. Node nhỏ/khó click, không có hit-area dự phòng → vi phạm 2.5.8 (§3.2).
3. Label xoay theo quỹ đạo (không counter-rotation) → không đọc được; TailwindFlex chứng minh
   counter-rotation là chuẩn de-facto.
4. Không tôn trọng `prefers-reduced-motion`; chỉ nicholasboidi có lối thoát ("simple layout").

---

## 2. Kỹ thuật GSAP từ docs chính thức

### 2.1. Xoay group SVG quanh tâm ngoài bằng `svgOrigin`

- Nguồn: <https://gsap.com/resources/svg/> (mục "Transform SVG elements around any point in the SVG canvas"):
  > "Our CSSPlugin recognizes a `svgOrigin` special property that works exactly like transformOrigin
  > but it uses the SVG's **global coordinate space** instead of the element's local coordinate space.
  > This can be very useful if, for example, you want to make a bunch of SVG elements rotate around a common point."
- Snippet từ docs:
  ```js
  //rotate svgElement as though its origin is at x:250, y:100 in the SVG canvas's global coordinates.
  gsap.to(svgElement, { duration: 1, rotation: 270, svgOrigin: "250 100" });
  ```
- Ràng buộc từ docs: "`svgOrigin` only supports px-based values (no percentages)."
  → Tâm quỹ đạo phải tính ra px trong hệ tọa độ SVG (ví dụ tâm viewBox), không dùng `%`.
- Áp dụng cho hero: mỗi vòng quỹ đạo là một `<g>`, tween `rotation: "+=360"` với
  `svgOrigin: "<cx> <cy>"` (tâm logo), `duration` khác nhau mỗi vòng, `repeat: -1, ease: "none"`.

### 2.2. Counter-rotation giữ label thẳng bằng `transformOrigin` trên chính node

- Nguồn `transformOrigin` trên SVG: <https://gsap.com/resources/svg/> (mục "Set the transformOrigin"):
  ```js
  gsap.to("rect", { duration: 1, rotation: 360, transformOrigin: "50% 50%" }); //percents
  gsap.to("rect", { duration: 1, rotation: 360, transformOrigin: "center center" }); //keywords
  gsap.to("rect", { duration: 1, rotation: 360, transformOrigin: "50px 50px" }); //pixels
  ```
  Docs khẳng định behavior này đồng nhất DOM và SVG trên mọi trình duyệt chính, khác với
  CSS thuần (Firefox không honor %/keyword trên SVG — chi tiết trong bài CSS-Tricks được docs dẫn:
  <https://css-tricks.com/svg-animation-on-css-transforms/>).
- Pattern counter-rotation (GHÉP từ 2 primitive đã document ở §2.1 + §2.2 — GSAP không publish
  snippet "counter-rotation" nguyên khối, nên snippet dưới là composition, không phải trích nguyên văn):
  ```js
  // Vòng quay quanh tâm logo (tâm SVG tại cx,cy)
  gsap.to("#orbit-ring-1", { rotation: "+=360", svgOrigin: "200 200",
    duration: 40, repeat: -1, ease: "none" });
  // Node con quay ngược đúng bằng đó quanh TÂM CỦA CHÍNH NÓ → label luôn đứng thẳng
  gsap.to("#orbit-ring-1 .repo-node", { rotation: "-=360", transformOrigin: "50% 50%",
    duration: 40, repeat: -1, ease: "none" });
  ```
  Điều kiện bắt buộc: parent và child **cùng duration, cùng ease `"none"`, cùng thời điểm start**
  (tốt nhất đặt trong một timeline) — nếu lệch nhau label sẽ trôi dần.
- Bằng chứng thực tế pattern này đúng: TailwindFlex (§1.1) dùng đúng cặp
  `animate-circle-*` (parent) + `animate-circle-content-*` (child counter-spin).

### 2.3. `gsap.matchMedia()` cho reduced-motion (và breakpoint)

- Nguồn: <https://gsap.com/docs/v3/GSAP/gsap.matchMedia()> — `gsap.matchMedia()` nhận đúng chuỗi media query
  của `window.matchMedia()`, và mọi animation/ScrollTrigger tạo trong handler **tự revert khi query hết match**:
  > "`gsap.matchMedia()` lets you tuck setup code into a function that only executes when a particular
  > media query matches and then when it no longer matches, all the GSAP animations and ScrollTriggers
  > created during that function's execution get **reverted automatically**!"
- Snippet conditions syntax từ docs (gộp breakpoint + reduced-motion):
  ```js
  let mm = gsap.matchMedia();
  mm.add(
    {
      isDesktop: "(min-width: 800px)",
      isMobile: "(max-width: 799px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      let { isDesktop, isMobile, reduceMotion } = context.conditions;
      gsap.to(".box", {
        rotation: isDesktop ? 360 : 180,
        duration: reduceMotion ? 0 : 2, // skip to the end if prefers-reduced-motion
      });
    }
  );
  ```
- Áp dụng cho hero: nhánh `reduceMotion === true` thì **không tạo tween xoay** (render trạng thái tĩnh cuối),
  nhánh còn lại tạo orbit timeline. Dùng thêm `gsap.matchMediaRefresh()` để re-run khi user bật/tắt
  toggle giảm motion trong UI — nguồn: <https://gsap.com/docs/v3/GSAP/gsap.matchMediaRefresh%28%29>:
  > "Immediately reverts all active/matching MatchMedia objects and then runs any that currently match.
  > This can be particularly useful when you need to accommodate a UI checkbox that toggles something
  > like 'reduce motion'".

### 2.4. Pause/resume mượt bằng `timeScale` (kết hợp tween)

- Nguồn: <https://gsap.com/docs/v3/GSAP/Timeline/timeScale%28%29>:
  > "Factor that's used to scale time in the animation where 1 = normal speed (the default),
  > 0.5 = half speed, 2 = double speed" … "You can even tween the `timeScale` to gradually slow it down
  > or speed it up."
  ```js
  var currentTimeScale = tl.timeScale(); // getter
  tl.timeScale(0.5);                     // setter: nửa tốc độ
  ```
- Pattern pause/resume mượt (composition từ câu "tween the timeScale" trong docs):
  ```js
  gsap.to(orbitTl, { timeScale: 0, duration: 0.6, ease: "power2.out",
    onComplete: () => orbitTl.pause() });   // pause mềm, không khựng
  orbitTl.play(); gsap.to(orbitTl, { timeScale: 1, duration: 0.6 }); // resume mềm
  ```
- Lưu ý trung thực: đây là nhu cầu phụ thêm — **nghĩa vụ WCAG 2.2.2 chỉ đòi hỏi cơ chế pause/stop/hide
  hoạt động, không đòi hỏi "mượt"** (§3.1). `timeScale` tween là polish, không phải compliance.

### 2.5. Khuyến nghị reduce-vs-remove của GSAP (áp đúng hero này)

- Nguồn: <https://gsap.com/resources/a11y> (mục "Reduce or Remove?"):
  - Câu hỏi 1: animation có gây trigger mạnh không? — "animations with large swiping movements on the x or y axis
    can make users with vestibular disorders dizzy or nauseated. Small areas of change, like micro-interactions,
    or simple opacity changes are usually ok."
  - Câu hỏi 2: decorative hay functional? — "If it's just decorative, removing it entirely is the best option."
- Áp dụng: quỹ đạo hero là **decorative + chuyển động vòng lớn** → với `prefers-reduced-motion: reduce`,
  GSAP khuyến nghị **bỏ hẳn xoay** (render tĩnh), không phải xoay chậm lại. Snippet chuẩn từ trang a11y:
  ```js
  let mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".box", { opacity: 0, rotation: 360, ease: "back.out" });
  });
  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.from(".box", { opacity: 0 }); // chỉ fade, không xoay
  });
  ```
- Trang a11y cũng khuyên thêm **toggle giảm motion trong UI** vì "there's no guarantee that everyone affected
  by motion knows how to change their settings" — cùng một nút này có thể gộp làm nút pause 2.2.2 (§3.1).

---

## 3. Accessibility áp đúng trường hợp hero 5 node xoay

### 3.1. WCAG 2.2.2 Pause, Stop, Hide — khi nào chuyển động tự chạy BẮT BUỘC có nút pause

- Chuẩn (Level A), nguồn định nghĩa: <https://www.w3.org/TR/WCAG22/#pause-stop-hide>,
  giải thích: <https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html>
  (w3.org chặn fetch tự động ngày research nên trích theo nội dung đã xác thực qua Stark
  <https://www.getstark.co/wcag-explained/operable/enough-time/pause-stop-hide> + bản Understanding WCAG 2.0
  <https://www.w3.org/WAI/WCAG20/Understanding/pause-stop-hide.html>):
- Ngưỡng cụ thể — phải đủ **CẢ 3 điều kiện** mới phát sinh nghĩa vụ:
  1. nội dung **tự bắt đầu chạy** (starts automatically),
  2. kéo dài **hơn 5 giây** (lasts more than five seconds),
  3. **hiển thị song song với nội dung khác** (presented in parallel with other content).
  Khi đó phải có cơ chế để user **pause, stop, hoặc hide**, trừ khi chuyển động là thiết yếu
  (essential — ví dụ loading indicator; orbit trang trí **không** thuộc ngoại lệ).
- Đối chiếu hero: orbit autoplay + lặp vô hạn + nằm cạnh headline/nav → đủ cả 3 → **bắt buộc có nút điều khiển**.
- **Hover-pause có đủ không? KHÔNG.** Bản Understanding của W3C nêu rõ trường hợp animation chỉ dừng
  khi focus/hover vào nó rồi tự chạy lại khi rời chuột **không được tính** là cơ chế đạt chuẩn
  (nội dung ý này được trích trong Understanding SC 2.2.2: "Having an animation stop only so long as a user
  has focus on it (where it restarts as soon as the user moves the focus away) would not be considered a…"
  [cơ chế hợp lệ]). Hover-pause chỉ là enhancement; vẫn cần nút pause thật, keyboard-operable, giữ trạng thái.
- Kỹ thuật đạt chuẩn ghi trong Understanding (đủ một trong các cách):
  - G4 "Allowing the content to be paused and restarted from where it was paused",
  - G186 "Using a control in the web page that stops moving, blinking, or auto-updating content",
  - SCR33 (dùng script + cơ chế pause).
- Best practice trong cùng tài liệu: một trang có nhiều phần chuyển động thì nên có **một cơ chế chung**
  pause tất cả, thay vì mỗi phần một nút.

### 3.2. Kích thước target tối thiểu cho node clickable — WCAG 2.5.8 (AA, mới từ WCAG 2.2)

- Nguồn: <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>
- Ngưỡng: target cho pointer input **ít nhất 24×24 CSS px**, ngoại trừ 5 trường hợp:
  Spacing (vòng tròn đường kính 24px quanh tâm target không giao target khác), Equivalent (có control
  khác cùng chức năng mà đạt chuẩn), Inline (nằm trong câu), User-agent control, Essential.
- Phân biệt để không over/under-build: 24×24 là **2.5.8 Level AA**; 44×44 là **2.5.5 Level AAA (Enhanced)**
  — nguồn phân biệt: <https://accessibility.build/wcag/2-5-8>.
- Áp dụng cho hero: mỗi node repo là `<a>`/`<button>` có **hit-area ≥ 24×24 CSS px** (padding tính vào hit-area,
  không cần phóng to artwork — nguồn: accessibility.build). Khuyến nghị thực tế: 44×44 cho thoải mái
  (Apple HIG 44pt / Material 48dp được nhắc trong <https://specification.website/spec/accessibility/touch-target-size>),
  nhưng ngưỡng bắt buộc là 24.
- Cạm bẫy riêng của node-map xoay: node di chuyển nên tâm click khó đoán + các node có thể lướt sát nhau;
  khi pause (nút §3.1) layout đứng yên thì đo spacing mới có ý nghĩa — thêm lý do nút pause là bắt buộc,
  không chỉ vì 2.2.2.

### 3.3. `prefers-reduced-motion` theo MDN

- Nguồn: <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>
- Định nghĩa: media feature phát hiện user đã bật setting giảm motion ở OS; "Such animations can trigger
  discomfort for those with vestibular motion disorders. Animations such as scaling or panning large objects
  can be vestibular motion triggers." Quỹ đạo full-hero xoay liên tục thuộc đúng nhóm trigger này.
- Hai giá trị: `no-preference` (đánh giá false) và `reduce` (true); `@media (prefers-reduced-motion)`
  tương đương `(prefers-reduced-motion: reduce)`.
- Snippet chuẩn MDN (tone-down thay vì giữ nguyên):
  ```css
  @media (prefers-reduced-motion: reduce) {
    .animation { animation: dissolve 4s linear infinite both; /* fade nhẹ, không scale/xoay */ }
  }
  ```
- Áp cho hero (kết hợp §2.5): khi `reduce` → **không xoay, render tĩnh** (bỏ hẳn là best practice vì orbit
  là decorative + large movement); giữ lại fade/entry nhẹ nếu muốn. Triển khai qua `gsap.matchMedia`
  (§2.3), không chỉ CSS, để JS không tạo tween xoay.

---

## 4. Chữ trên nền chuyển động: ngưỡng cho label mono 10–11px sau counter-rotation

### 4.1. Ngưỡng contrast bắt buộc — WCAG 1.4.3 (AA)

- Nguồn định nghĩa: <https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html>;
  diễn giải chi tiết đã xác thực qua WebAIM: <https://webaim.org/articles/contrast/>
  (trích nguyên văn SC trong bài WebAIM):
  > "The visual presentation of text and images of text has a contrast ratio of at least **4.5:1**,
  > except… **Large Text:** Large-scale text… at least **3:1**…"
- "Large text" = **≥18pt (≈24px) thường, hoặc ≥14pt (≈18.66px) nếu bold** — nguồn:
  <https://webaim.org/articles/contrast/> ("WCAG defines large text as text that is 18pt and larger,
  or 14pt and larger *if* it is bold… 18 points maps to 24 pixels").
- Đối chiếu: label mono **10–11px ≈ 7.5–8.25pt** → **không phải large text** → ngưỡng bắt buộc là **4.5:1**,
  không được hưởng mức 3:1. (Phép đổi pt→px là quy đổi đơn vị chuẩn của WebAIM, không phải suy diễn yêu cầu.)
- Hai chi tiết dễ trượt, nguồn cùng bài WebAIM:
  - **Không được làm tròn lên**: "#777777… 4.47:1… does not meet this requirement" — tính toán phải ra ≥4.5:1 thật.
  - Chữ trên gradient/ảnh/nền biến thiên **vẫn phải đạt chuẩn**; WCAG không cho công thức đo,
    WebAIM khuyến nghị "usually testing the area where contrast is lowest" — với nền orbit xoay,
    phải đo ở vị trí nền **sáng nhất** mà label có thể đi qua.

### 4.2. Điều kiện để 10–11px mono đọc được (vượt trên con số 4.5:1)

1. **Counter-rotation là tiên quyết** (§2.2): label chỉ đọc được khi **đứng yên tuyệt đối**; chữ xoay theo
   quỹ đạo dù đạt 21:1 cũng không đọc được khi đang chuyển động. TailwindFlex (§1.1) là bằng chứng thực tế.
2. **Nền sau chữ phải ổn định**: vì orbit xoay làm nền sau label thay đổi liên tục, cần một trong:
   - pill/chip nền đặc (solid) sau label, đo contrast chip-vs-chữ ≥4.5:1 — cách chắc chắn nhất;
   - hoặc halo/viền: WCAG cho phép tính outline/border của chữ như màu foreground khi đo
     (nguồn: <https://webaim.org/articles/contrast/>, mục "Outline and halo").
   Text-shadow mờ đơn thuần **không** được tính vào ratio — phải là scrim/halo đủ dày hoặc chip đặc.
3. **Trạng thái hover/focus của node cũng phải đạt 4.5:1 độc lập** — nguồn cùng bài WebAIM:
   "there is no mention of special consideration for these changes in text color, so text in all these states
   must meet the same contrast requirements (and must be evaluated independently)."
4. Font mono 10–11px nét mảnh: 4.5:1 là **sàn**, nên target cao hơn (≥7:1, mức AAA 1.4.6
   <https://webaim.org/articles/contrast/>) cho label nhỏ — đây là khuyến nghị thực hành, ghi rõ không phải
   nghĩa vụ AA.

---

## 5. Checklist áp dụng cho hero (tổng hợp từ 4 phần trên)

| # | Việc | Nguồn |
|---|------|-------|
| 1 | Orbit `<g>` xoay bằng `rotation` + `svgOrigin` tâm logo (px, không %), `ease: "none"`, mỗi vòng `duration` riêng | §2.1 |
| 2 | Label counter-quay ngược, `transformOrigin: "50% 50%"`, cùng duration/ease/start với vòng (chung timeline) | §2.2 |
| 3 | Nút pause/play thật (G4/G186), keyboard-operable, giữ trạng thái; hover-pause chỉ là phụ | §3.1 |
| 4 | `gsap.matchMedia` nhánh `reduce` → bỏ xoay, render tĩnh; toggle UI + `matchMediaRefresh()` | §2.3, §2.5, §3.3 |
| 5 | Hit-area node ≥24×24 CSS px (AA bắt buộc); khuyến nghị 44 | §3.2 |
| 6 | Label 10–11px mono ≥4.5:1 tại điểm nền sáng nhất, trên chip đặc hoặc halo tính được; hover/focus đo riêng | §4 |
| 7 | Danh sách repo dạng list liên kết song song canvas/SVG để keyboard + screen reader dùng được (rút từ §1.2) | §1.2 |

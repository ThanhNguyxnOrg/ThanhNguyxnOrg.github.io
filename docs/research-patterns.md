# Research: Premium Patterns cho Dark Devtool / Org Site

> Context site áp dụng: org page 1 trang, nền `#080b14`, accent vàng gold, font Space Grotesk + Inter + JetBrains Mono, Tailwind v4, GSAP, Astro static.
> Quy tắc file này: CHỈ primary sources (trang đã mở trực tiếp, docs chính thức). Mỗi claim kèm URL nguồn ngay sau câu.
> Lưu ý context: file `GLOSSARY.md` được đề cập trong yêu cầu **không tồn tại** trong repo tại thời điểm research
> (đã kiểm tra thư mục gốc ngày 2026-10-11) — nên file này không trích dẫn nó.

---

## 0. Phương pháp và giới hạn quan sát

- Tất cả site dưới đây được **mở trực tiếp bằng fetch ngày 2026-10-11**, không viết theo trí nhớ.
- Giới hạn công cụ: fetch trả về **nội dung/cấu trúc** (markdown/HTML đã strip), nên các hiệu ứng **hover animation, màu pixel,
  grain, blur, border-opacity** không quan sát được trực tiếp — mọi claim về visual thuần túy được ghi rõ là "không xác thực được"
  hoặc chỉ nêu ở mức cấu trúc quan sát được.
- 3 URL đã mở nhưng trả về **nội dung agent-markdown thay vì trang visual** nên bị loại khỏi danh sách site mẫu, ghi rõ để trung thực:
  <https://vercel.com/>, <https://supabase.com/>, <https://resend.com/> (nội dung trả về là setup guide/SDK cho AI agent,
  không phải layout trang). Tương tự <https://darkroom.engineering/> chỉ trả agent-summary, không đủ bằng chứng visual nên không đưa vào top 6.

---

## 1. Sáu website dark đã MỞ trực tiếp

### 1.1. Linear — <https://linear.app/>

- **Kỹ thuật 1 — Product-UI-in-hero:** ngay dưới headline "The product development system for teams and agents" là **screenshot UI app thật**
  (issue DRV-8852, board Intake/Planning/Build, diff review) thay vì illustration trừu tượng — quan sát trực tiếp từ nội dung trang.
- **Kỹ thuật 2 — Numbered figure divider:** các khối giá trị được đánh số kiểu tài liệu kỹ thuật **"Fig 0.1 / Fig 0.2 / Fig 0.3"**
  (Purpose-built / Powered by agents / Designed for speed), sau đó là nhịp section lặp lại Intake → Planning → AI → Build,
  mỗi section gồm headline 2 dòng + đoạn mô tả + link "Learn more→" + demo visual — quan sát trực tiếp.
- **Kỹ thuật 3 — Footer mega-column + legal row tách riêng:** 5 nhóm cột (Product / Features / Company / Resources / Connect)
  + hàng legal riêng dưới cùng (Privacy / Terms / DPA / AUP) + link **Status trỏ ra subdomain riêng** `https://linearstatus.com`
  — quan sát trực tiếp từ footer trang.
- Hợp cho org 1 trang: nhịp "eyebrow → headline → demo → link" và footer 5 cột + legal row copy-paste được ngay; product-UI-in-hero
  chỉ hợp nếu org có screenshot/tool để khoe, org thuần link-repo thì thay bằng orbit/solar hero đã có.

### 1.2. Raycast — <https://www.raycast.com/>

- **Kỹ thuật 1 — Brand bằng chính công cụ của mình:** hero vẽ **cả bàn phím vật lý (esc → F-keys → keycap chữ)**
  kèm 4 tính từ đứng riêng dòng (Fast / Ergonomic / Personal / Reliable) — quan sát trực tiếp; bài học: hero nên "show công cụ",
  không "tả công cụ".
- **Kỹ thuật 2 — Extension card grid = mẫu cho repo cards:** mỗi card gồm **icon + tên + mô tả 1 dòng + screenshot**
  (Linear, Google Translate, Spotify, Arc, 1Password, Notion…), cuối grid là card "Plus thousands more… / Browse the store"
  — quan sát trực tiếp; đây là layout gần nhất với "grid 5 repo" của org.
- **Kỹ thuật 3 — Social-proof wall + footer dịch vụ:** dải avatar + quote của ~25 nhân vật (Guillermo Rauch/Vercel, MKBHD,
  Adam Wathan/Tailwind…) kèm "Favorite Feature / Top Extension" từng người; footer 6 nhóm
  (Product / Core Features / Top Extensions / Company / Community / By Raycast) + ô **Subscribe newsletter** — quan sát trực tiếp.
- Hợp cho org 1 trang: card grid + "card cuối điều hướng" và contributor wall rất hợp; keyboard-visual không hợp (org không có phần cứng/IDE),
  thay bằng orbit/starfield đã định.

### 1.3. Dub — <https://www.dub.co/> (indie-hacker OSS, mô hình gần org nhất)

- **Kỹ thuật 1 — Eyebrow nhãn sản phẩm làm divider:** mỗi section mở bằng nhãn ngắn (Affiliate Programs / Conversion Analytics / Short Links,
  rồi Dub Links / Dub Analytics / Dub Partners / Dub API) + headline lớn + 3 bullet kèm "Learn more" — quan sát trực tiếp.
- **Kỹ thuật 2 — Live counters làm section "Built to scale":** 3 con số động (Links Created / Events Tracked / Revenue Tracked)
  đứng thay testimonial — quan sát trực tiếp; org ánh xạ thành Stars / Repos / Contributors.
- **Kỹ thuật 3 — Footer craft đáng copy:** 5 cột (Product / Solutions / Resources / Company / Compare) + pill
  **"Loading status…" link ra <https://status.dub.co>** + badge AICPA SOC 2 + dòng "© 2026 Dub Technologies, Inc." — quan sát trực tiếp.
- Hợp cho org 1 trang: **hợp nhất trong 6 site** — Dub cũng là team nhỏ/bán-OSS, 1 trang dài, nhịp eyebrow + counter + footer status pill
  áp nguyên được; chỉ cần đổi accent sang gold.

### 1.4. Cal.com — <https://cal.com/> (OSS collective, scheduling)

- **Kỹ thuật 1 — Numbered steps + FAQ:** khối "How it works" đánh số **01/02/03** (Connect calendar / Set availability / Choose how to meet),
  cuối trang là FAQ accordion + CTA lặp lại "Smarter, simpler scheduling" — quan sát trực tiếp.
- **Kỹ thuật 2 — Demo-link cá nhân:** card booking mẫu `cal.com/cedric` kèm avatar/tên/timezone ngay trong section tính năng
  ("Stand out with a custom booking link") — quan sát trực tiếp; bài học: đặt 1 repo-link thật có thể click ngay trong hero thay vì nút chết.
- **Kỹ thuật 3 — Footer sâu + mission line:** 4-5 cột (Downloads / Solutions / Use Cases / Resources / Company) +
  dòng mission "Our mission is to connect a billion people by 2031" + dòng trademark "Cal.com® and Cal® are registered trademarks…
  All rights reserved." — quan sát trực tiếp.
- Hợp cho org 1 trang: numbered steps hợp cho section "How we work / Quy trình contribute"; footer mission + trademark line hợp cho org
  muốn vẻ "tổ chức thật"; FAQ chỉ hợp nếu org nhận câu hỏi lặp lại, không thì bỏ.

### 1.5. OpenStatus — <https://www.openstatus.dev/> (OSS status-page, dark)

- **Kỹ thuật 1 — Live status widget trong hero:** ngay dưới headline là panel "All Systems Operational" với component
  (Checkout API **99.94%**, Webhooks 99.99%), thanh uptime 45 ngày, timestamp **"Oct 11, 2026 15:17 (UTC)"**, badge "powered by openstatus"
  — quan sát trực tiếp; đây là trust-device mạnh nhất trong 6 site.
- **Kỹ thuật 2 — Timeline timestamp làm section divider:** toàn bộ giữa trang là story incident Pur 09:41 → 09:43 → 09:44 → 10:14 → 11:02
  → +1 week → +6 months, mỗi mốc là 1 section (monitor / declare / notify / mitigate / postmortem / record / audit log) — quan sát trực tiếp;
  org ánh xạ thành timeline "repo ra đời / milestone stars".
- **Kỹ thuật 3 — Footer OSS chuẩn:** 8 nhóm (Products / Tooling / Resources / Compare / Use Cases / Blog / Tools / Community / Company) +
  link "Talk to the founders" + status "Unknown → https://status.openstatus.dev" + dual logo light/dark cho từng customer — quan sát trực tiếp.
- Hợp cho org 1 trang: status widget + timeline milestone rất hợp cho devtool audience; dual-logo và 8 cột footer quá nặng cho org 1 trang,
  rút gọn còn 3-4 cột.

### 1.6. TypeHero — <https://typehero.dev/> (OSS community, dev audience)

- **Kỹ thuật 1 — Contributor avatar wall:** section "Built by the community" render **~150 GitHub avatar link thẳng về profile**
  (bautistaaa, Hacksore, QuiiBz, juliusmarminge…) + 2 CTA "Join the Discord / Contribute on GitHub" — quan sát trực tiếp;
  đây đúng là pattern org cần cho "members".
- **Kỹ thuật 2 — GitHub-first CTA + headline treatment:** nav có nút **"Star us on GitHub"**, hero chữ "type hero" cỡ khổng lồ +
  challenge cards gắn chip độ khó (EASY/HARD) + section "many features, wow" kèm ảnh doge — quan sát trực tiếp;
  bài học: headline mono/chip EASY-HARD và meme liều lượng nhỏ làm devtool bớt khô mà không mất pro.
- **Kỹ thuật 3 — Footer tối giản:** newsletter "Stay Informed" + "Built with by the Trash Devs community." +
  Privacy/Terms + "© 2026 TypeHero" — quan sát trực tiếp; "built-with strip" ở đây là dòng credit cộng đồng, không phải logo cloud.
- Hợp cho org 1 trang: **hợp nhất về mặt tổ chức** (OSS + community + GitHub-first); avatar wall 150 người scale-down thành 5-12 core member
  + nút star; meme/doge không hợp nếu org muốn nghiêm.

---

## 2. Starfield / particle nền: 3 cách, từ nhẹ tới nặng

### 2.1. Cách A — CSS dots tĩnh (nhẹ nhất, 0 JS)

- Cách làm: dot pattern bằng `radial-gradient()` nhiều lớp làm `background-image` (chấm 1px lặp theo tile), phủ thêm 1 lớp
  radial-glow gold mờ cho hero — primitive `radial-gradient()` được document đầy đủ kèm demo tương tác tại
  <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient>
  (cú pháp `radial-gradient(circle at center, …)`, repeating variant, live "Try it").
- Demo chính chủ cấp component: trang Grid and Dot Backgrounds của Aceternity (3 variant Grid / Grid Small / Dot, live preview + copy-prompt)
  tại <https://ui.aceternity.com/components/grid-and-dot-backgrounds>.
- Chi phí perf: **gần bằng 0** — background tĩnh do compositor vẽ 1 lần, không JS, không repaint mỗi frame, không tốn pin;
  hợp làm **lớp nền mặc định** của site tĩnh Astro.
- Tắt dưới reduced-motion: không cần tắt (đã tĩnh); chỉ cần không gắn thêm animation di chuyển cho lớp này — logic theo
  <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion> (§2.4).

### 2.2. Cách B — Canvas 2D + requestAnimationFrame (động: twinkle + sao băng)

- Cách làm: `<canvas>` vẽ sao bằng script theo MDN Canvas tutorial
  (<https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial> — từ Basic usage → Drawing shapes →
  Basic/Advanced animations, kèm snippet code từng bước).
- Demo chính chủ cấp component: Shooting Stars + Stars Background của Aceternity tại
  <https://ui.aceternity.com/components/shooting-stars-and-stars-background> — props đã publish:
  `starDensity` mặc định `0.00015` (số sao theo diện tích pixel), `twinkleProbability` `0.7`,
  `minTwinkleSpeed` `0.5` / `maxTwinkleSpeed` `1` (giây), shooting-star có `minSpeed`/`maxSpeed`/`minDelay`/`maxDelay` ms;
  trang ghi rõ component gốc của Vijay Verma cho figmaplug.in và dẫn source gốc
  (ghi theo trang Aceternity, không mở repo gốc nên không claim thêm).
- Chi phí perf (nguồn MDN Optimizing canvas: <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas>):
  tốn **1 full redraw mỗi frame**; MDN yêu cầu: pre-render vật lặp ra offscreen canvas, tránh `shadowBlur`,
  batch calls, chỉ render phần đổi thay, dùng `requestAnimationFrame` thay `setInterval`,
  `getContext("2d", { alpha: false })` nếu nền đặc, scale đúng DPR, nền tĩnh chuyển sang CSS `background` dưới canvas.
  Quy ra starfield: cap ~120-200 sao, `shadowBlur` chỉ cho 1-3 sao băng, twinkle bằng opacity sin thay vì redraw path.
- Tắt dưới reduced-motion: **dừng rAF, giữ frame tĩnh cuối** (canvas còn hình sao đứng yên) — xem §2.4.

### 2.3. Cách C — SVG (sao băng trail + cụm sao ít, trang trí điểm xuyết)

- Cách làm: phần tử SVG cho vệt sao băng (gradient trail) + CSS keyframes opacity/translate; bằng chứng pattern này có thật:
  bảng props Shooting Stars của Aceternity ghi rõ trail render trong **"SVG container"**
  (`className` = "Additional CSS classes to apply to the SVG container") —
  nguồn <https://ui.aceternity.com/components/shooting-stars-and-stars-background>.
- Chi phí perf: mỗi ngôi sao là 1 DOM node — **rẻ với vài chục node, đắt khi lên hàng trăm** (layout/paint theo DOM, không batch được
  như canvas); chỉ hợp cho 1-3 vệt sao băng + cụm sao trang trí quanh logo, không hợp làm full-sky.
- Tắt dưới reduced-motion: `animation: none` trong block reduce + giữ SVG hiển thị tĩnh — xem §2.4.

### 2.4. Công tắc reduced-motion chuẩn (áp cho cả 3 cách)

- Nguồn: <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion> —
  `reduce` = user đã bật giảm motion ở OS (page liệt kê đường bật trên GNOME/KDE/Windows/macOS/iOS/Android/Firefox);
  animation scale/pan vật lớn là vestibular trigger; snippet chuẩn của MDN là **tone-down** (đổi `pulse` scale thành `dissolve` opacity).
- Áp cho site này (nghiêm hơn snippet MDN vì hero đã có orbit GSAP xoay):
  ```css
  @media (prefers-reduced-motion: reduce) {
    .starfield-canvas, .shooting-star { display: none; }
    .starfield-static { display: block; } /* dot-grid CSS §2.1 luôn render */
  }
  ```
  ```js
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) startStarfield(); // không tạo rAF khi reduce; xem thêm file docs/research-solar.md §2.3 về gsap.matchMedia
  ```
- Khuyến nghị chốt: **Cách A (CSS dots + gold glow) làm mặc định cho mọi user; Cách B chỉ là enhancement khi
  `no-preference` + màn hình ≥768px + cap sao**; Cách C chỉ nếu muốn 1 vệt sao băng trang trí.

---

## 3. Footer và section-divider mẫu (cấu trúc quan sát được)

### 3.1. Mẫu 1 — Dub footer — <https://www.dub.co/> (khuyến nghị copy)

- Cấu trúc quan sát trực tiếp: 5 cột link (Product / Solutions / Resources / Company / Compare — cột Compare toàn link "Dub vs X"
  là chi tiết craft SEO đáng học) + hàng dưới gồm pill **trạng thái live** ("Loading status…" → <https://status.dub.co>) +
  badge **AICPA SOC 2 Type II** + "© 2026 Dub Technologies, Inc.".
- Vì sao hợp org 1 trang: đầy đủ trust-signal mà chỉ 2 hàng; pill status là pattern duy nhất trong 6 site đưa "live" vào footer.

### 3.2. Mẫu 2 — Linear footer — <https://linear.app/> (chuẩn devtool tối giản)

- Cấu trúc quan sát trực tiếp: 5 nhóm (Product / Features / Company / Resources / Connect — cột Connect gom Slack/X/GitHub/YouTube) +
  **legal row 4 link** (Privacy / Terms / DPA / AUP) tách bạch + Status ra `https://linearstatus.com`.
- Vì sao hợp org 1 trang: legal row riêng giúp footer org (vốn ít link) trông "công ty thật"; cột Connect là nơi đặt GitHub/Discord/Email của org.

### 3.3. Mẫu 3 — Cal.com footer — <https://cal.com/> (kiểu collective)

- Cấu trúc quan sát trực tiếp: mission line trên cùng ("Our mission is to connect a billion people by 2031") +
  4-5 cột sâu (Downloads / Solutions / Use Cases / Resources / Company) + dòng trademark + support email `support@cal.com`.
- Vì sao hợp/không hợp: mission line + trademark line cho org vẻ "tổ chức có chủ quyền"; cột Use Cases/Downloads thừa cho org 1 trang — cắt.

### 3.4. Section-divider: 3 nhịp đã quan sát (không cần hairline CSS vẫn "ngắt" được)

- **Eyebrow nhãn + headline (Dub/Linear):** mỗi section Dub mở bằng nhãn sản phẩm, Linear mở bằng "Fig 0.x" — divider bằng chữ, 0 CSS.
- **Timestamp timeline (OpenStatus):** 09:41 → 09:43 → … → +6 months, mỗi mốc 1 section — org ánh xạ thành timeline repo/milestone.
- **Numbered steps (Cal.com 01/02/03):** divider bằng số thứ tự cho section quy trình/contribute.
- Trung thực ghi rõ: **không site nào trong 6 site để lộ custom scrollbar qua fetch nội dung**, và **không site nào có nút back-to-top
  quan sát được** — nên với org 1 trang: bỏ back-to-top (sticky nav + footer sitemap đủ), không custom scrollbar (rủi ro a11y, 0 bằng chứng
  site đẹp nào cần nó trong mẫu quan sát).

---

## 4. Micro-interaction đáng tiền cho devtool audience (mỗi thứ 1 ví dụ thật)

### 4.1. Magnetic button — demo trực tiếp tại <https://ui.aceternity.com/components/magnetic-button>

- Trang ghi: "A button that subtly drifts toward the cursor as you hover, with a spring-based return when you leave",
  props đã publish: `strength` mặc định `0.8` (1 = bám cursor 1:1), `maxDistance` mặc định `100`px; cài qua
  `npx shadcn@latest add @aceternity/magnetic-button`.
- Ghi rõ giới hạn: đây là **demo live trên chính site Aceternity** (site thật đang chạy pattern), research này **không xác thực được
  site production cụ thể nào dùng** — không claim bừa.
- Áp cho org: chỉ gắn cho **1 CTA chính hero** (View GitHub / Star us), `strength ≤0.4`, tắt khi `(pointer: coarse)` hoặc reduce.

### 4.2. Spotlight card — <https://ui.aceternity.com/components/card-spotlight> (+ lineage TypeHero)

- Trang Card Spotlight ghi: "a spotlight effect revealing a radial gradient background", props `radius` mặc định `350`px,
  `color` mặc định `"#262626"`; trang Spotlight chị em (<https://ui.aceternity.com/components/spotlight>) ghi rõ
  **"This component is inspired from TypeHero's landing page"** — tức lineage production là <https://typehero.dev/>
  (đã mở trực tiếp ở §1.6, dark + card difficulty EASY/HARD).
- Áp cho org: repo cards dò theo chuột hiện radial gold-glow (đổi `color` sang gold 8-12% opacity cho hợp accent);
  radius 350 vừa card ~300px; fallback mobile = viền gold tĩnh (không có hover thì spotlight vô nghĩa).

### 4.3. Copy-to-clipboard — quan sát trực tiếp tại <https://ui.shadcn.com/docs/installation>

- Bằng chứng trực tiếp trên trang: nút **"Copy Page"** ở đầu bài + nút **Copy trên từng code block**
  (block `pnpm dlx shadcn@latest init -t [framework]` có chữ "Copy" cuối dòng) — pattern "mọi code hiển thị đều copy được 1 click".
- Áp cho org: nút copy cạnh **git clone URL / GitHub org URL / contact email** ở hero + footer; phản hồi chỉ cần đổi icon
  Copy→Check 1.5s + `aria-live="polite"` thông báo "Copied" (không toast rườm rà).

### 4.4. Live status pill — production tại <https://status.dub.co> + widget tại <https://www.openstatus.dev/>

- Bằng chứng trực tiếp: status.dub.co render **System status theo component (App / API / Link Redirects / Website) kèm "100% uptime"** +
  calendar tháng + Subscribe + link Privacy/Terms; footer Dub có pill status live (§3.1); hero OpenStatus có widget uptime 45 ngày (§1.5);
  footer Linear link Status ra subdomain riêng (§1.1).
- Áp cho org: pill footer "● All repos public" hoặc uptime GitHub (link ra github.com/org) — tĩnh nhưng đặt đúng vị trí "status"
  mà devtool audience luôn tìm; **không khuyến nghị live clock** (giờ địa phương) vì **không site nào trong 6 site mẫu có** —
  pattern chưa xác thực, wow thấp cho org dev.

---

## 5. Bảng khuyến nghị — xếp theo tỉ lệ wow / rủi ro (cao → thấp)

| # | Pattern | Một câu chốt |
|---|---------|--------------|
| 1 | `::selection` gold + focus-visible gold (CSS 5 dòng, 0 JS) | Wow tức thì mỗi lần bôi đen/tab, rủi ro ~0 — nguồn allowlist thuộc tính tại <https://developer.mozilla.org/en-US/docs/Web/CSS/::selection> (chỉ `color`/`background-color`/decoration, giữ contrast ≥4.5:1). |
| 2 | Hero CSS dot-grid + radial gold glow tĩnh (§2.1) | Nền "ngầu" không tốn frame nào, là fallback tự nhiên khi tắt mọi motion — demo <https://ui.aceternity.com/components/grid-and-dot-backgrounds>. |
| 3 | Divider eyebrow + numbered section kiểu Dub/Linear (§3.4) | Nhịp "nhãn → headline → demo → link" làm trang 1 section dài trông như nhiều chương, chi phí chỉ là chữ — mẫu <https://www.dub.co/>, <https://linear.app/>. |
| 4 | Repo cards kiểu Raycast grid + spotlight hover (§1.2 + §4.2) | Card icon+tên+mô tả 1 dòng+screenshot + glow theo chuột = ngôn ngữ devtool quen thuộc, rủi ro thấp — <https://www.raycast.com/>, <https://ui.aceternity.com/components/card-spotlight>. |
| 5 | Copy-to-clipboard cho clone URL (§4.3) | Dev audience copy lệnh mỗi ngày, 1 nút Copy→Check ăn điểm utility hơn mọi animation — mẫu trực tiếp <https://ui.shadcn.com/docs/installation>. |
| 6 | Footer 3-4 cột + legal row + status pill (§3.1–§3.3) | Công thức Dub/Linear/Cal: cột link gọn + hàng legal + pill live = footer "tổ chức thật" trong 2 hàng — <https://www.dub.co/>, <https://linear.app/>, <https://cal.com/>. |
| 7 | Canvas starfield giới hạn (§2.2, chỉ khi `no-preference`) | Wow cao nhất nhưng rủi ro perf/pin cao nhất — cap ~150 sao, cấm `shadowBlur`, dừng rAF khi reduce, và chỉ thêm sau khi 6 pattern trên xong. |

Không làm (có bằng chứng loại): magnetic button toàn trang (chỉ demo, chưa thấy production — §4.1), back-to-top và custom scrollbar
(không site mẫu nào có — §3.4), live clock footer (0/6 site — §4.4), meme/doge headline (lệch tone org nghiêm — §1.6).

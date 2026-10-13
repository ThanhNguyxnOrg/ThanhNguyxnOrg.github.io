# Spec: Showcase FX full trang (Hero B + 3 phase) — 2026-10-11

## 1. Hiểu chung (user duyệt)
- **User nói:** hero chốt B canvas wow; toàn trang phải lòe loẹt, nhiều effect graphic ngầu; giữ pro; giờ note chuẩn quốc tế; top-5 orbit phải tự đổi khi repo mới lên top.
- **Giả định của t (user chưa phản đối):** giữ nền `#080b14` + gold `#f59e0b/#fcd34d`, font Space Grotesk/Inter/JetBrains Mono, Astro static + Tailwind v4 + GSAP; không đổi data pipeline; mọi motion có guard `prefers-reduced-motion`.
- **Thành công:** nhìn vào thấy ngầu ngay từ hero, cuộn xuống mỗi section có 1 điểm nhấn, `npm test + build` xanh, contrast đạt, `reduce` → tĩnh hết.

## 2. Phạm vi
- **Làm:** Hero B (canvas 150 sao + vệt băng + fix cắt label) + Phase 1 (progress, count-up, gradient border hover, noise tĩnh) + Phase 2 (marquee 1 dải, lamp ≤2 header, tilt 1 card, glow ≤2 section) + Phase 3 (timeline draw scrub).
- **Không làm:** back-to-top, live-clock, meme, magnetic toàn trang, spotlight toàn trang + cursor glow cùng grid, canvas full-sky mới, parallax/pin, custom scrollbar. Lý do: `docs/research-patterns.md §5`, `docs/research-showcase-fx.md §11`.

## 3. Kiến trúc
- Data giữ nguyên: `scripts/sync.ts` fetch `/orgs/.../repos?per_page=100` → sort sao → `src/data/baked.json` (`fetchedAt` ISO `YYYY-MM-DD`) → `src/lib/projects.ts joinProjects` sort → `Hero.tsx slice(0,5)`, `Featured.tsx slice(0,6)`. Repo mới đủ sao tự vào sau cron daily, `repoUrl/demoUrl` đổi theo. Không sửa pipeline.
- Visual là lớp phủ client-only: Astro render HTML tĩnh có số cuối sẵn; JS chỉ enhance khi `matchMedia('(prefers-reduced-motion: reduce)') === false` + `pointer: fine` (cho tilt/glow). Tắt JS vẫn đọc đủ.
- Tokens mới chỉ thêm vào `src/styles/tokens.css` (`--mx/--my`, `@property --a`, keyframes `scroll`), không đổi palette.

## 4. Components (file chạm)
1. `Hero.tsx`: fix overflow label (container rộng + `min-w-0`, svg `overflow-visible`), thêm `StarCanvas.tsx` (canvas rAF, cap 150, `alpha:false`, DPR scale, ≥768px mới mount), 1 vệt băng SVG.
2. `SiteChrome.tsx` hoặc `Layout.astro`: `ScrollProgress.tsx` fixed top 2px `scaleX(progress)` qua ScrollTrigger `onUpdate`.
3. `MetricsBand.tsx`: `CountUp` IO threshold 0.4 → rAF 1200ms ease-out, `tabular-nums`, SSR số cuối, `aria-live off`.
4. `Featured.tsx` + `ProjectBits`: featured top-1 `gradient border hover-only` + `tilt ±6-8°` (`preserve-3d`, reset 400ms); CTA duy nhất được `moving-border` động.
5. `tokens.css`: `noise overlay` fixed 1 layer opacity 0.05–0.07 SVG feTurbulence inline.
6. Mới `TechMarquee.tsx`: 1 dải, duplicate `aria-hidden`, `scroll 40-60s linear infinite`, hover pause, `reduce` → grid tĩnh.
7. `SectionHeader`: `lamp` cone `conic-gradient` tĩnh + `reveal-once` đã có; tối đa Projects + CTA.
8. `Hero` + `CTA`: `cursor glow` 1 layer/section `radial 480px / 0.08`, rAF-throttle vars `--mx/--my`, `pointer-events none`.
9. `Journey.tsx`: `TimelineBeam` path `stroke-dashoffset` scrub 0.5, dot active class; `reduce` → spine tĩnh đầy.

## 5. Motion / a11y / touch
- `reduce` → dừng: marquee, tilt listener, glow listener, scrub tween, count-up loop, canvas rAF; giữ viền gold tĩnh, số cuối tĩnh, spine đầy. Tiền lệ `MOTION_OK_QUERY` trong `Hero.tsx`.
- Contrast: text 4.5:1, large-text 3:1, non-text/UI 3:1 (WebAIM). Glow/noise/lamp giữ opacity thấp để không rớt chữ; đo điểm nền sáng nhất.
- Hit-area node/link ≥24px (AA 2.5.8), khuyến nghị 44px; giữ nút pause orbit + focus-visible gold; marquee duplicate `aria-hidden`; progress/spine/glow/noise `aria-hidden`.

## 6. Perf budget
- Idle: noise 1 paint, gradient/lamp tĩnh, hover-border ~0, progress 1 transform/scroll, marquee 1 transform loop, canvas 1 redraw/frame (chỉ hero, pause khi tab nền), tilt/glow chỉ khi hover/di chuột, timeline 1 stroke/frame scroll.
- Cấm: `shadowBlur` (trừ 1-3 sao băng), `width` animation, ảnh nặng trong marquee, >số lượng ở §2.

## 7. Testing
- `npm test` (giữ `tests/sync.test.ts ≤40 calls`), `npm run build`, `astro check`.
- Thêm test: `baked` vẫn sort sao; component guard `reduce`/`pointer coarse` render tĩnh; không snapshot pixel.
- Check tay: 375/768/1024/1440, keyboard tab hết, bật reduce OS, throttle CPU 4x.

## 8. Triển khai
P1: progress → count-up → gradient border → noise. P2: marquee → lamp → tilt → glow. P3: timeline scrub cuối. Mỗi phase 1 commit riêng, dễ revert.

# Spec: Below-fold decor batch 1 (grid variants + divider ornament + corner ticks) — 2026-10-11

## 1. Hiểu chung
- **User nói:** section dưới hero còn nhiều chữ, thiếu decor; hero đã đẹp giữ nguyên.
- **Giả định:** giữ nền `#080b14` + gold, font hiện tại; chỉ thêm CSS tĩnh, không thêm số liệu/motion loop/JS mới.
- **Thành công:** mỗi section dưới có nhịp nền riêng, divider có điểm dừng mắt, Featured cards có dấu kỹ thuật; `npm test + build + astro check` xanh.

## 2. Phạm vi
- **Làm (§ theo `docs/research-decor-fx.md`):** §1 grid biến thể (fine-grid 24px gold 3% + dot-grid gold + mask fade), §2 divider ornament (`<hr>` + `::after` glyph `◆/+/§`), §3 corner ticks (`+` 4 góc card).
- **Không làm:** 7 món còn lại (quote-mark, drop-cap, kbd, index tabs, watermark, marker, double-rules) — đợt sau; không motion loop mới; blacklist cũ giữ nguyên.

## 3. Thiết kế
- `src/styles/tokens.css` thêm 3 utility: `bg-blueprint-fine` (linear gold 3%, 24px), `bg-dots-gold` (radial dot gold 5%, tile 22px), `.divider-orn` (`border-top` + `::after { content: attr(data-glyph) }`), `.card-ticks` (`position:relative` + pseudo `+` gold 40% offset -8px). Mask fade dùng Tailwind `mask-y-from-70%`.
- Áp dụng: Philosophy → fine-grid; Explorer → dot-grid; Journey giữ trơn (tránh nhiễu TimelineBeam). Divider `<hr class="divider-orn" data-glyph="◆">` tối đa 3 vị trí (trên Philosophy, Ecosystem, footer; không kề meteor strip). Ticks cho lead + Poster cards (≤4), Strip/rows giữ trơn.
- Nền decor `aria-hidden`, glyph trong pseudo (AT bỏ qua), `<hr>` thật giữ role `separator`. Grid opacity ≤5%, ticks ≤40% → chữ giữ 4.5:1, kẻ non-text 3:1.

## 4. Kiểm thử
- Test mới `tests/decor-batch1.test.ts`: assert 3 token tồn tại trong `tokens.css`, divider dùng `<hr>`, ticks có `aria-hidden`.
- `npm test` (giờ 28 tests) + `npm run build` + `npx astro check` (0 errors) xanh.

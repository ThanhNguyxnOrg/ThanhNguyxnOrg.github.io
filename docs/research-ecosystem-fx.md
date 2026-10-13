# Research: Ecosystem FX — decor/utility cho đúng 1 section "Where the code lives."

> Context site áp dụng: Astro static 1 trang, section `Ecosystem` duy nhất (`src/sections/Ecosystem.tsx`, 64 dòng), nền `#080b14`, accent gold `#f59e0b`/`#fcd34d`, font Space Grotesk / Inter / JetBrains Mono, Tailwind v4.
> Phạm vi file này: **chỉ** 6 rows hiện tại của section (1 Organization + 2 Package + 1 Resource + 2 People) dựng trong `src/pages/index.astro:34-65`. Không đề xuất hiệu ứng cho section khác.
> Quy tắc file này: CHỈ primary sources (trang mở trực tiếp bằng fetch ngày 2026-10-12 trong phiên này). Mỗi claim kèm URL nguồn ngay sau câu.
> Không trùng: `src/styles/tokens.css` (đã có `tabular`, `focus-ring`, `transition-ui`, `divider-orn`, `text-gradient-gold`, kill-switch `prefers-reduced-motion: reduce`); `src/components/Badge.tsx` (đã có `Badge` 4 tones + `Tag` + `MetaLabel`); `src/components/CopyButton.tsx` (đã có copy → Check 1.5s + `aria-live="polite"`); `docs/research-below-fold-fx.md` §4 (avatar stack + tooltip — pattern tổng quát, file này chỉ chốt cách áp cho 2 rows People cụ thể) và §8 (install-command card — pattern tổng quát, file này chỉ chốt chuỗi lệnh + vị trí đặt cho 2 rows Package cụ thể); `docs/research-decor-fx.md` (toàn bộ 10 decor tĩnh — `divider-orn`, `kbd` hints, markers, double-rules... — đã chốt, không đề xuất lại).

## 0. Phương pháp, hiện trạng code và log fetch

- Hiện trạng `Ecosystem.tsx`: type `EcoResource = { kind, label, description, url }`, render `ul` rows `grid-cols-[2.5rem_1fr_auto]`, kind mono micro gold + label display title + description body-sm + `ArrowUpRight` nếu có url, chữ `Pending` nếu `url: null` (`src/sections/Ecosystem.tsx:4-63`).
- Hiện trạng 6 rows dựng ở `src/pages/index.astro:34-65`: row 1 Organization (`ThanhNguyxnOrg on GitHub` → `https://github.com/ThanhNguyxnOrg`); rows 2–3 Package map từ `baked.npm` với `label = name + version`, `description = description + "Downloaded N times in the last 30 days."`, url npm; row 4 Resource (`Control room` → `https://github.com/ThanhNguyxnOrg/.github`); rows 5–6 People (`RealThanhNguyxn`, `ThanhNguyxn07`, description `"Organization member."` — chữ trơ, chưa avatar).
- Hiện trạng data npm trong `src/data/baked.json:502-538`: `archpulse 0.5.3 / downloads30d 145`, `production-backend-kit 1.1.2 / downloads30d 169` (số snapshot tại thời điểm bake; pipeline giữ số cũ khi registry lỗi trong `scripts/sync.ts:133-144`).
- Nợ kỹ thuật nhìn thấy ngay: version bị nhét vào `label` (không phải chip mono riêng); download-count bị nhét vào câu `description` (không scan được); 2 rows Package chưa có lệnh copy; 2 rows People chưa có avatar/GitHub visual.
- Log fetch phiên này (mở trực tiếp, không viết theo trí nhớ): shadcn Badge trang rút gọn — <https://ui.shadcn.com/docs/components/badge> — resolve ra cùng nội dung trang base — <https://ui.shadcn.com/docs/components/base/badge>; shadcn Avatar rút gọn — <https://ui.shadcn.com/docs/components/avatar> — cùng nội dung base — <https://ui.shadcn.com/docs/components/base/avatar>; shadcn Kbd rút gọn — <https://ui.shadcn.com/docs/components/kbd> — cùng nội dung base — <https://ui.shadcn.com/docs/components/base/kbd>; shadcn Tooltip — <https://ui.shadcn.com/docs/components/tooltip>; Aceternity Code Block — <https://ui.aceternity.com/components/code-block>; GitHub REST org members — <https://docs.github.com/en/rest/orgs/members?apiVersion=2022-11-28>; GitHub REST users — <https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28>; MDN `<img>` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img>; MDN `<kbd>` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd>; MDN `<code>` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/code>; MDN Clipboard `writeText()` — <https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText>; npm `npm-install` CLI — <https://docs.npmjs.com/cli/v11/commands/npm-install>.
- Fetch lỗi ghi rõ, không claim từ đó: `https://ui.shadcn.com/docs/components/code-block` trả **404** (shadcn không có component code-block — vì vậy file này dùng Aceternity Code Block làm lineage thay thế — <https://ui.aceternity.com/components/code-block>); `https://github.com/npm/registry/blob/main/docs/download-counts.md` trả **503** (không claim quy ước downloads API từ đó — số downloads dẫn từ `baked.json` + `scripts/sync.ts` local); trang WCAG target-size trả **403** (không claim số pixel WCAG mới — chỉ dẫn lại chuẩn `Tooltip` focus/hover đã publish — <https://ui.shadcn.com/docs/components/tooltip>).
- Giới hạn công cụ: fetch trả về nội dung/cấu trúc (markdown đã strip) nên màu pixel/độ mượt **không xác thực được** — toàn bộ đề xuất dưới đây đều **tĩnh + CSS-only trừ 1 clipboard handler đã có sẵn**, nên giới hạn này không ảnh hưởng.

---

## 1. Bản đồ 6 rows → việc cần làm cho từng row (không thêm row mới)

| # | Row hiện tại (`src/pages/index.astro`) | Loại decor/utility duy nhất áp cho row đó | Nguồn chính |
|---|---|---|---|
| 1 | Organization — `ThanhNguyxnOrg on GitHub` → `https://github.com/ThanhNguyxnOrg` | Giữ row link hiện tại + thêm org avatar 32px (`AvatarImage src="https://github.com/ThanhNguyxnOrg.png"` + `AvatarFallback` "TN") | Pattern ảnh GitHub `.png` publish ngay trong usage shadcn — <https://ui.shadcn.com/docs/components/base/avatar>; composition fallback — <https://ui.shadcn.com/docs/components/base/avatar> |
| 2 | Package — `archpulse 0.5.3`, 145 downloads/30d → npm link | Version chip mono `v0.5.3` (§2) + download chip (§3) + install-command copy `npm i archpulse` (§4) | Badge variants — <https://ui.shadcn.com/docs/components/base/badge>; lệnh `npm install [<package-spec> ...]` + alias `i` — <https://docs.npmjs.com/cli/v11/commands/npm-install> |
| 3 | Package — `production-backend-kit 1.1.2`, 169 downloads/30d → npm link | Như row 2 với `npm i production-backend-kit` | Như row 2 |
| 4 | Resource — `Control room` → `https://github.com/ThanhNguyxnOrg/.github` | Giữ row link hiện tại, không avatar, không install-command (không phải package, không phải người) | Không cần nguồn mới — giữ `ArrowUpRight` đã có |
| 5 | People — `RealThanhNguyxn` → `https://github.com/RealThanhNguyxn` | Avatar 32px + link GitHub, `alt="@RealThanhNguyxn"`, fallback initials "RT" (§5) | `avatar_url` + `html_url` trong schema `Simple User` — <https://docs.github.com/en/rest/orgs/members?apiVersion=2022-11-28>; `AvatarImage src/alt` + `AvatarFallback` — <https://ui.shadcn.com/docs/components/base/avatar>; `alt` thay thế ảnh — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img> |
| 6 | People — `ThanhNguyxn07` → `https://github.com/ThanhNguyxn07` | Như row 5, fallback "T7"/"TH" | Như row 5 |

- Không gộp 2 rows People thành 1 avatar-stack: `Ecosystem.tsx` render 1 row/1 resource có link riêng + số thứ tự `01…06`, stack sẽ phá nhịp numbered-rows đã có (`src/sections/Ecosystem.tsx:31-47`); avatar-stack tổng quát đã thuộc `docs/research-below-fold-fx.md` §4, file này cố ý không lặp lại.
- Không thêm install-command cho rows Organization/Resource/People: lệnh `npm install <name>` chỉ có nghĩa với package publish trên registry — <https://docs.npmjs.com/cli/v11/commands/npm-install> — 3 loại row còn lại giữ link thuần.

---

## 2. Version chip mono (tách version khỏi `label` thành chip)

- Vấn đề nó giải quyết: hiện `label` = `"archpulse 0.5.3"` (nối chuỗi trong `src/pages/index.astro:43`), version lẫn vào tên, không scan được, không style mono riêng được.
- Cách làm tối giản: `label` chỉ còn tên package (`archpulse`), version render chip mono riêng `v0.5.3` / `v1.1.2` cạnh label — dùng `Badge` tone `neutral` đã có trong `src/components/Badge.tsx:6-26` (không tạo component badge mới); version lấy từ field `version` đã có trong `baked.json` (`archpulse 0.5.3`, `production-backend-kit 1.1.2` — `src/data/baked.json:502-538`).
- Nguồn component: shadcn Badge — "Displays a badge or a component that looks like a badge" — <https://ui.shadcn.com/docs/components/base/badge>; variants publish `default | secondary | destructive | outline | ghost | link` — <https://ui.shadcn.com/docs/components/base/badge>; chọn variant outline/neutral để version không tranh mắt với download chip (1 row tối đa 2 chips).
- Nguồn type: version chip là text mono micro — đúng quy ước "Mono labels (data only: dates, counts, codes)" đã có trong `src/styles/tokens.css:88-94`; số/chữ trong chip giữ `tabular` đã có (`src/styles/tokens.css:236-238`).
- Tiền tố `v`: npm CLI ghi version dạng `<name>@<version>` — <https://docs.npmjs.com/cli/v11/commands/npm-install> — chip hiển thị `v0.5.3` là quy ước đọc, còn lệnh copy (§4) dùng tên trần không version để luôn cài latest.
- Chi phí perf: **0** — text tĩnh từ `baked.json`, không JS.
- Tắt reduced-motion: không cần (tĩnh sẵn).
- Contrast/a11y: chip là text → giữ 4.5:1 trên `#080b14` (gold-soft `#fcd34d` trên nền đã dùng cho `primary-text` trong tokens); chip là `<span>` không tương tác nên không phát sinh target-size.
- Có cần thêm content file không: **KHÔNG** — `version` đã có trong `baked.npm`; chỉ cần ngừng nối chuỗi version vào `label` ở `src/pages/index.astro:43` khi implement.

## 3. Download-count chip (tách khỏi `description` thành chip quét được)

- Vấn đề nó giải quyết: hiện description = `"… Downloaded 145 times in the last 30 days."` (nối chuỗi trong `src/pages/index.astro:44`), con số chìm trong câu văn; tách thành chip `[⤓ 145/mo]` để mắt scan 2 rows Package trong 1 giây.
- Cách làm tối giản: description chỉ còn mô tả package gốc từ registry (`baked.json:506,524`); downloads render chip thứ 2 cạnh version chip — icon lucide `Download` + số `tabular-nums` + hậu tố `/mo` (30 ngày); dùng `Badge` + icon inline — pattern icon-trong-badge publish với `data-icon="inline-start"` — <https://ui.shadcn.com/docs/components/base/badge>.
- Nguồn data: `downloads30d` đã bake sẵn (145 / 169 — `src/data/baked.json:519,536`), pipeline fetch từ npm downloads endpoint và cộng dồn vào `totals.downloads30d` trong `scripts/sync.ts:123-155`; vì doc download-counts của npm registry fetch lỗi 503 trong phiên này nên file này **không claim** endpoint chính thức nào ngoài code pipeline local.
- Nguồn số: chip số dùng `tabular-nums` — utility `tabular` đã có trong `src/styles/tokens.css:236-238`.
- Định dạng số: giữ số nguyên thô (`145`, `169`) vì <1000 không cần rút gọn; khi implement thêm quy tắc `≥1000 → 1.2k` thì là logic format local (`src/lib/format.ts`), không cần nguồn ngoài.
- Chi phí perf: **0** — text tĩnh, icon SVG inline.
- Tắt reduced-motion: không cần (tĩnh).
- Contrast/a11y: chip text 4.5:1; số có `aria-label` đầy đủ ("145 downloads in the last 30 days") vì `/mo` viết tắt mắt thường hiểu nhưng screen reader cần chữ đầy đủ.
- Có cần thêm content file không: **KHÔNG** — `downloads30d` đã có trong payload `baked.npm`.

## 4. Install-command copy `npm i <pkg>` (utility cho đúng 2 rows Package)

- Vấn đề nó giải quyết: rows Package hiện chỉ link ra trang npm — dev muốn cài phải click qua + gõ lại tên; 1 dòng lệnh copy 1 click đúng "mọi code hiển thị đều copy được" (pattern tổng quát đã chốt ở `docs/research-below-fold-fx.md` §8 — file này chỉ chốt **chuỗi lệnh + vị trí** cho 2 rows cụ thể, không đề xuất lại pattern).
- Chuỗi lệnh chốt: `npm i archpulse` và `npm i production-backend-kit` — `npm install [<package-spec> ...]` với aliases publish gồm `add, i, in, ins, inst, insta, instal, isnt, isnta, isntal, isntall` — <https://docs.npmjs.com/cli/v11/commands/npm-install> — nên `npm i <name>` là alias chính thức, ngắn nhất để đặt vừa row mobile 360px; dạng `<name>` trần (không version) cài tag `latest` theo mặc định ("Do a `<name>@<tag>` install, where `<tag>` is the tag config… default value is `latest`") — <https://docs.npmjs.com/cli/v11/commands/npm-install>.
- Cách render tối giản (KHÔNG mang highlighter runtime vào Astro static): 1 dòng `<code>npm i archpulse</code>` mono + nút `CopyButton` đã có (`src/components/CopyButton.tsx:5-41`, copy → Check 1.5s + `aria-live="polite"`), đặt dưới description trong cùng row Package; chỉ render khi `kind === 'Package'`.
- Nguồn semantics code: `<code>` "displays its contents… short fragment of computer code… default monospace font" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/code>; lệnh 1 dòng dùng `<code>` (không cần `<pre>` bọc ngoài vì note MDN chỉ yêu cầu `<pre>` cho multi-line — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/code>).
- Nguồn clipboard: `writeText()` "writes the specified text to the system clipboard, returning a Promise" — <https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText>; "Writing to the clipboard can only be done in a secure context" — <https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText> — đúng vì `CopyButton.tsx` đã có fallback `textarea + execCommand` cho non-secure context (`src/components/CopyButton.tsx:11-24`).
- Lineage code-block (ghi rõ để khỏi mang thừa): Aceternity Code Block là "configurable code block component built on top of react-syntax-highlighter" với props `language`, `filename`, `highlightLines`, `code` HOẶC `tabs[]` — <https://ui.aceternity.com/components/code-block> — file này **loại thẳng** `react-syntax-highlighter` runtime cho 2 dòng lệnh tĩnh (lý do đã nêu ở below-fold §8, giữ nguyên); shadcn không có component code-block (fetch 404 trong phiên này — xem §0).
- Có dùng `<kbd>` cho lệnh không: **KHÔNG** — `<kbd>` "represents user input (typically keyboard input)" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd>; shadcn Kbd "Used to display textual user input from keyboard" với composition `Kbd` + `KbdGroup`, usage `<Kbd>Ctrl</Kbd>` — <https://ui.shadcn.com/docs/components/base/kbd> — lệnh npm là code để copy, không phải phím bấm, nên `<code>` + nút copy là semantics đúng; `kbd` hints đã có cho Explorer ở `docs/research-decor-fx.md` §6, không lấn sang đây.
- Chi phí perf: **~0** — text tĩnh + 1 clipboard handler đã có sẵn, không thêm dependency.
- Tắt reduced-motion: không cần (phản hồi Copy→Check là đổi icon, không motion).
- Contrast/a11y: lệnh mono là text → 4.5:1; nút copy là `<button>` có `aria-label` ("Copy…" / "Copied") + `aria-live="polite"` đã có trong `CopyButton.tsx:28-39`; thông báo "Copied" qua live-region, không toast.
- Có cần thêm content file không: **CÓ (nhỏ, đã báo trước ở below-fold §8)** — `EcoResource` hiện chỉ có `{kind, label, description, url}` (`src/sections/Ecosystem.tsx:4-9`); khi implement thêm field `package?: string` (tên npm trần) cho 2 rows Package, hoặc suy `package` từ `url` npm — quyết lúc implement, không cần fetch thêm API.

## 5. Avatar + GitHub link cho 2 rows People (và org avatar row 1)

- Vấn đề nó giải quyết: 2 rows People hiện là chữ trơ (`label` + `"Organization member."` — `src/pages/index.astro:53-64`), không mặt, không dấu hiệu GitHub; thêm avatar 32px biến "ai" thành visual mà vẫn giữ link verify được (quy tắc "destinations without proof stay unlinked" trong header `Ecosystem.tsx:20` được giữ — avatar không thay link, chỉ đứng cạnh link).
- Nguồn data: `GET /orgs/{org}/members` trả về mảng `Simple User` — <https://docs.github.com/en/rest/orgs/members?apiVersion=2022-11-28>; mỗi item có `avatar_url` (required, uri) + `html_url` (required, uri) + `login` (required) — <https://docs.github.com/en/rest/orgs/members?apiVersion=2022-11-28>; endpoint `GET /users/{username}` trả cùng schema user với `avatar_url`, `html_url`, `name`, `bio` — <https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28> — tức implement có thể chọn: (a) hardcode 2 member hiện tại với `avatar_url = https://avatars.githubusercontent.com/…` lấy 1 lần từ API, hoặc (b) suy URL ảnh `https://github.com/<login>.png` (pattern `.png` sau username publish ngay trong usage shadcn `<AvatarImage src="https://github.com/shadcn.png" />` — <https://ui.shadcn.com/docs/components/base/avatar>); khuyến nghị (b) cho site tĩnh vì không thêm request build-time, `login` đã có sẵn trong URL profile hiện tại.
- Nguồn component: shadcn Avatar — "An image element with a fallback for representing the user" — <https://ui.shadcn.com/docs/components/base/avatar>; composition `Avatar > AvatarImage + AvatarFallback + AvatarBadge` — <https://ui.shadcn.com/docs/components/base/avatar>; usage `<Avatar><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>CN</AvatarFallback></Avatar>` — <https://ui.shadcn.com/docs/components/base/avatar>; `AvatarImage` có props `src` + `alt` — <https://ui.shadcn.com/docs/components/base/avatar>; `AvatarFallback` "displays a fallback when the image fails to load" — <https://ui.shadcn.com/docs/components/base/avatar> — fallback initials cho 2 member: `RT` (RealThanhNguyxn), `T7` (ThanhNguyxn07); row Organization dùng fallback `TN`.
- Nguồn `<img>`: `alt` "Defines text that can replace the image… provide a useful value for alt whenever possible" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img>; avatar là ảnh có nghĩa (nhận diện người) nên `alt="@RealThanhNguyxn"` / `alt="@ThanhNguyxn07"` (không để `alt=""` vì rỗng nghĩa là decorative — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img>); `loading="lazy"` "Defers loading the image until it reaches a calculated distance from the viewport" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img>; `decoding="async"` decode sau khi present nội dung khác — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img>; cặp `width`+`height` "enables the aspect ratio… to reserve the space… reducing or even preventing a layout shift" — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img> — chốt avatar `32×32` (`width=32 height=32`, CSS `size-8 rounded-full`).
- Cách đặt trong row: avatar đứng trước `label` (thay số thứ tự? **KHÔNG** — giữ số `01…06` đã có ở `Ecosystem.tsx:34`), layout `avatar 32px + (label + handle mono `@login`) + ArrowUpRight`; handle `@RealThanhNguyxn` là text thật (không phải tooltip hover-only) để mobile đọc được; tooltip hover chỉ là optional bổ sung theo composition `Tooltip > TooltipTrigger + TooltipContent` — <https://ui.shadcn.com/docs/components/tooltip> — và định nghĩa gốc "displays information… when the element receives keyboard focus or the mouse hovers over it" — <https://ui.shadcn.com/docs/components/tooltip> — tức nếu thêm tooltip thì phải focus được, không hover-only (rào đã có từ below-fold §4/§11, giữ nguyên).
- Chi phí perf: **thấp** — 3 ảnh ngoài (1 org + 2 member) `?s=64`, `loading="lazy"`, `decoding="async"`, kích thước cố định chống layout shift; không thêm JS (link `<a>` thuần đã có ở `Ecosystem.tsx:50-53`).
- Tắt reduced-motion: không cần (ảnh tĩnh).
- Contrast/a11y: fallback initials là text → 4.5:1; link avatar + link label TRÙNG đích là lỗi lặp tab-stop — chốt: **1 link duy nhất/row** (cả avatar + label nằm trong cùng 1 `<a>`, đúng cấu trúc `<a>` bọc row đã có ở `Ecosystem.tsx:50-53`); ví dụ image-link chuẩn MDN lồng `<img>` trong `<a>` và "make the alternative text describe the resource the link is pointing to" — xem pattern tại — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img>; mỗi row People giữ `sr-only " (opens in a new tab)"` đã có (`Ecosystem.tsx:52`).
- Có cần thêm content file không: **KHÔNG bắt buộc** — 2 logins đã hardcode trong `index.astro:53-64`; nếu muốn verify tự động thì thêm 2 request `GET /users/{username}` vào `scripts/sync.ts` (lấy `avatar_url` bake vào JSON), nhưng mặc định khuyến nghị pattern `https://github.com/<login>.png` không cần content file mới.
- Không trùng với below-fold §4: §4 là avatar-stack + tooltip cho nhóm contributors (nhiều avatar chồng nhau); file này là **1 avatar/row + link verify** cho đúng 2 rows People + 1 org avatar — khác cấu trúc, khác mục đích (identify + verify thay vì social-proof).

## 6. Rows Organization + Resource: giữ nguyên, chỉ thêm org avatar

- Row Organization giữ link `https://github.com/ThanhNguyxnOrg` + description hiện tại; thêm duy nhất org avatar như §5 (pattern `.png` — <https://ui.shadcn.com/docs/components/base/avatar>); không thêm chip, không install-command.
- Row Resource (`Control room` → `.github`) giữ nguyên 100% — đây là row "giấy tờ" (contributing/support/security), thêm decor sẽ làm nó trông như package/người; không nguồn mới cần dẫn cho quyết định "không làm gì".
- Nhịp visual sau khi làm §2–§5: mỗi row Package có 2 chips + 1 dòng lệnh; mỗi row People/Organization có 1 avatar; row Resource trơ nhất — đúng phân cấp (package = dùng được, people/org = nhận diện, resource = đọc thêm).

---

## 7. A11y / perf / reduced-motion tổng cho cả section (chỉ tính file này)

| Món (§) | Perf | Reduced-motion | A11y chốt + nguồn |
|---|---|---|---|
| Version chip (§2) | 0 (text tĩnh) | không cần | text 4.5:1; `<span>` không tương tác |
| Download chip (§3) | 0 (text + SVG inline) | không cần | text 4.5:1; `aria-label` đầy đủ thay `/mo` viết tắt |
| Install-command (§4) | ~0 (text + handler có sẵn) | không cần (đổi icon) | `<code>` đúng semantics — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/code>; copy qua `writeText()` + fallback, secure-context lưu ý — <https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText>; live-region đã có |
| Avatar People/Org (§5) | thấp (3 ảnh lazy 64px) | không cần | `alt` có nghĩa, không rỗng — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img>; `width`+`height` chống shift — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img>; 1 link/row, giữ `sr-only`; tooltip nếu có phải focus được — <https://ui.shadcn.com/docs/components/tooltip> |
| Org/Resource giữ (§6) | 0 | không cần | không thêm node tương tác |

- Công tắc chung giữ nguyên: block `prefers-reduced-motion: reduce` trong `src/styles/tokens.css:306-315` (10 món file này tĩnh sẵn nên không cần gate JS riêng).
- Cap số lượng cho section này: chips **≤2/row Package** (version + downloads); install-command **đúng 2 rows Package**; avatar **đúng 3 ảnh** (1 org + 2 member), `size-8`, không stack, không tooltip bắt buộc.

## 8. Bảng xếp wow / rủi ro + thứ tự triển khai (chỉ tính file này)

| # | Món (§) | Wow | Rủi ro | Một câu chốt + nguồn chính |
|---|---|---|---|---|
| 1 | Download chip (§3) | ★★★★ | ~0 | Số đang chôn trong câu văn thành visual scan; icon-badge pattern — <https://ui.shadcn.com/docs/components/base/badge> |
| 2 | Version chip (§2) | ★★★ | ~0 | Tách version khỏi label, data đã có trong `baked.json`; variants — <https://ui.shadcn.com/docs/components/base/badge> |
| 3 | Install-command (§4) | ★★★★ | thấp | `npm i <pkg>` là alias chính thức — <https://docs.npmjs.com/cli/v11/commands/npm-install>; copy semantics `<code>` + `writeText()` — <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/code>, <https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText> |
| 4 | Avatar People (§5) | ★★★★ | thấp–trung bình | `avatar_url`/`html_url` có sẵn trong schema — <https://docs.github.com/en/rest/orgs/members?apiVersion=2022-11-28>; fallback khi ảnh lỗi — <https://ui.shadcn.com/docs/components/base/avatar>; rủi ro duy nhất là ảnh ngoài (lazy + size cố định đã rào) |
| 5 | Org avatar (§5–§6) | ★★★ | ~0 | Cùng pattern `.png` — <https://ui.shadcn.com/docs/components/base/avatar>; 1 ảnh, rủi ro không đáng kể |

- Thứ tự triển khai khuyến nghị: §3 → §2 → §4 → §5 (chips tĩnh/data-sẵn trước; lệnh copy dùng `CopyButton` có sẵn; avatar ảnh ngoài làm cuối).
- Thay đổi data nhỏ duy nhất: ngừng nối chuỗi version/downloads vào `label`/`description` ở `src/pages/index.astro:41-46`, thêm field `package?: string` cho rows Package (đã báo ở below-fold §8).

## 9. Blacklist + cam kết không trùng (cho section Ecosystem)

- Giữ toàn bộ blacklist cũ (`research-patterns` §5, `research-visual-fx`, `research-showcase-fx` §11, `research-below-fold-fx` §11, `research-decor-fx` §12): no back-to-top, no live-clock, no meme, no magnetic/spotlight toàn trang, no starfield mới, no parallax/pin, no custom scrollbar, no fake screenshot, no Recharts, no tooltip hover-only, no language-bar width animation.
- Giữ cap cũ áp vào section này: install-command chỉ rows Package (below-fold §11); avatar-stack ≤2 vị trí ≤8 avatar KHÔNG dùng ở đây (giữ numbered-rows); `kbd` hints chỉ Explorer/footer (decor §12) — lệnh npm ở đây dùng `<code>`, không dùng `<kbd>`.
- Loại thẳng cho section này: **syntax-highlighter runtime** (Aceternity Code Block build trên `react-syntax-highlighter` — <https://ui.aceternity.com/components/code-block> — thừa cho 2 dòng `npm i`); **shadcn code-block** (không tồn tại — 404 trong phiên này); **avatar-stack gộp 2 People** (phá numbered-rows + trùng below-fold §4); **version/downloads dạng text trong câu** (giữ là nợ UX, phải tách chip §2–§3); **tooltip bắt buộc cho People** (handle `@login` text thật đã đủ trên mobile; tooltip chỉ optional và phải focus được — <https://ui.shadcn.com/docs/components/tooltip>).

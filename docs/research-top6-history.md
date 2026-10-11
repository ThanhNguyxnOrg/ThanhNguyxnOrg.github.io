# Research: Quá khứ 6 repo Showcase (phục vụ kể chuyện trên org site)

- Ngày nghiên cứu: 2026-10-11 (UTC).
- Nguyên tắc: CHỈ primary sources — `git` local + GitHub API public + file local đã đọc. Mỗi claim có nguồn đi kèm. Không bịa, không tô hồng.
- Bối cảnh: org `ThanhNguyxnOrg` tạo ngày 2026-04-09 (nguồn: briefing `docs/research-org-site.md` §1.1 — `GET /orgs/ThanhNguyxnOrg` → `created_at: 2026-04-09`). Mọi history commit sớm hơn ngày này = dấu vết tiền-org / migration.
- File này KHÔNG đụng tới `docs/research-org-site.md` (agent khác đang append).
- Triết lý đối chiếu: `D:\Code\ThanhNguyxnOrg\.github\docs\migration.md` — migration = "direct re-upload / cleaned-up rewrite / modernized rebuild / continuation / archived snapshot", mục đích "second life", "preserve growth".
- Giới hạn quota: GitHub API public 60 req/h đã cạn giữa chừng (`GET /rate_limit` → `remaining: 0`, reset epoch 1791690310). Hệ quả: endpoint `.../releases?per_page=5` của 4 repo (PurgeKit, Snapbooth, awesome-cert-sherpa, apidex-hub) trả **403 rate-limited, chưa verify** — thay bằng git tags local làm fallback, ghi rõ chỗ nào chưa verify.

---

## 1. blendops — sinh ra trong org, sprint tháng 4–5/2026

| Mục | Giá trị + nguồn |
|---|---|
| Remote origin | `https://github.com/ThanhNguyxnOrg/blendops.git` (nguồn: `git -C D:\Code\blendops remote -v`) |
| GitHub `created_at` | `2026-04-24T15:17:43Z`, `fork: false`, stars 3 (nguồn: `GET https://api.github.com/repos/ThanhNguyxnOrg/blendops`) |
| Commit đầu tiên | `c4886bf 2026-04-24 "Initial commit: BlendOps MVP scaffold"` — **trùng ngày repo được tạo** → sinh ra trong org, không phải migration (nguồn: `git log --reverse --format="%h %ad %s" --date=short \| head -3`) |
| Quy mô commit đầu | 22 files, 2.308 insertions — scaffold monorepo `packages/core`, `packages/schemas` (nguồn: `git show --stat c4886bf`) |
| Tổng commit | 189 (nguồn: `git rev-list --count HEAD`) |
| Contributors | Thanh-Nguyxn 183, dependabot[bot] 5, BlendOps 1 (nguồn: `git shortlog -sne HEAD`) |
| Nhịp độ | 2026-04: 122 commits, 2026-05: 52, 2026-06: 10, 2026-07: 1, 2026-09: 4 — sprint dồn dập rồi chững (nguồn: `git log --format=%ad` group theo tháng) |
| Release đầu tiên (đã verify API) | `v0.7.0-draft` (prerelease), published 2026-05-09 bởi `RealThanhNguyxn`, tên release "+6 MCP-aware coding agents + Antigravity upgrade (26 install targets)" (nguồn: `GET .../blendops/releases?per_page=5` — bản full lưu ở tool-output, đọc được item đầu) |
| Tags local | `v0.1.0-draft` … `v0.7.0-draft` (nguồn: `git tag --list`) |
| Cột mốc trong log | Phase Batch 1→8 mở rộng skills 16→48 (`fe0ef15`, `3fb43fb`, `985f4b9`, `0ccc4f7`, `d1ba039`); `896f204` "v0.7.0-draft prep"; `71e0714` "Clarify scope: BlendOps publishes skills layer; runtime paths are upstream redirect" — lần gọt scope quan trọng (nguồn: `git log --oneline --grep` release/governance/MVP) |
| README hiện tại | "AI-native Blender workflow specs for people who do not know Blender", badge `Release: v0.7.0-draft`, `skills-48`, `install targets-26`, "Inspired by: Superpowers + BMad" (nguồn: `D:\Code\blendops\README.md` 40 dòng đầu) |
| Dấu vết migration | **Không.** Không có commit "migration", history bắt đầu đúng ngày tạo repo. |

**➜ 1 câu story cho site:** BlendOps sinh ra trong org ngày 24/04/2026 dưới dạng MVP scaffold, được build dồn dập suốt tháng 4–5 (174/189 commit) thành bộ skill-pack Blender cho người không biết Blender, chốt ở chuỗi draft release v0.1→v0.7 — repo org-native thuần túy, không phải second-life.

---

## 2. lumeo — tiền-org, đổi tên, hợp nhất 2 codebase (Lumen + Echoly)

| Mục | Giá trị + nguồn |
|---|---|
| Remote origin | `https://github.com/ThanhNguyxnOrg/lumeo.git` (nguồn: `git remote -v`) |
| GitHub `created_at` | `2026-05-10T02:58:10Z`, `fork: false`, stars 2, forks 2 (nguồn: `GET https://api.github.com/repos/ThanhNguyxnOrg/lumeo`) |
| Commit đầu tiên | `9f2d735 2026-04-03 "Initialize extension repository with cleaned project structure"` — **sớm hơn ngày tạo repo GitHub 5 tuần** → code tồn tại trước, mang history theo khi vào org (re-upload giữ history). Tác giả `ThanhNguyxn07`, co-author `Thanh Nguyen Tuan <thanhnguyentuan2007@gmail.com>` — identity thời personal (nguồn: `git log --reverse`, `git show --stat 9f2d735`) |
| Tổng commit | 79 (nguồn: `git rev-list --count HEAD`) |
| Contributors | RealThanhNguyxn 62, dependabot[bot] 11, ThanhNguyxn07 5, ThanhNguyxn 1 (nguồn: `git shortlog -sne HEAD`) |
| Cột mốc 1 — đổi tên | `df7ae51 2026-05-09 "feat(brand): rename Lumen Subtitle Studio → Lumeo"` (nguồn: `git show -s --format='%h %ad %s' df7ae51`) |
| Cột mốc 2 — hợp nhất | `5a4726c 2026-05-09 "feat(v2): merge Echoly v0.2.1 baseline as Lumen Subtitle Studio v2.0.0-beta.1"` — nhập codebase engine lồng tiếng AI thứ hai. CHANGELOG tự ghi: "merges the existing Lumen v1 caption-translation tool with the Echoly v0.2.1 live AI dubbing engine", giữ namespace `.ec-`, rename `ECHOLY_VERSION`→`LUMEN_VERSION`→`LUMEO_VERSION` (nguồn: `git show -s 5a4726c`, `D:\Code\lumeo\CHANGELOG.md` dòng 96, 156, 224–251) |
| Cột mốc 3 — releases | Tag `v1.0.0` (tagger RealThanhNguyxn, 2026-05-14, sau commit `ecfc2c6 "release: v1.0.0 — stable caption + TTS"`); tag `v2.0.0` 2026-10-06 ("Three-tier captions and AI dubbing, unified custom AI gateway"); release mới nhất đã verify API: `v2.0.6` published 2026-10-09 bởi `thanhnguyxnagent[bot]`, kèm asset `lumeo-v2.0.6.zip` (nguồn: `git tag` show, `GET .../lumeo/releases?per_page=5`, `git log --since=2026-05-10 --until=2026-05-16`) |
| README hiện tại | "Bilingual captions & live AI dubbing for YouTube — one extension, three tiers", Chrome MV3, "No account… No telemetry… keys stay on device" (nguồn: `D:\Code\lumeo\README.md` 40 dòng đầu) |
| Dấu vết migration/second-life | Có: chữ "cleaned project structure" ở commit đầu + historyxy predates repo + đổi tên + merge 2 dòng code. Không có commit nào chữ "migration" (nguồn: `git log --grep` rename/rebrand/lumen/migrat chỉ ra 4 commits trên). |

**➜ 1 câu story cho site:** Lumeo khởi đầu trước org (tháng 4/2026, tay ThanhNguyxn07) dưới tên Lumen Subtitle Studio, vào org tháng 5 thì đổi tên thành Lumeo và hợp nhất thêm engine Echoly — từ tool dịch caption thành extension 3 tầng caption + lồng tiếng AI, release đều tới v2.0.6 (10/2026). Đúng chất "modernized rebuild" của migration.md.

---

## 3. apidex-hub — catalog API cộng đồng; lịch sử local THIẾU (shallow clone)

| Mục | Giá trị + nguồn |
|---|---|
| Remote origin | `https://github.com/ThanhNguyxnOrg/apidex-hub.git`; remote phụ `contributor → https://github.com/kriptoburak/awesome-free-apis.git` — **hiện fetch báo `fatal: repository not found`** (repo upstream đã biến mất) (nguồn: `git remote -v`, `git fetch contributor --dry-run`) |
| GitHub `created_at` | `2026-05-07T06:43:42Z`, `fork: false`, size 58397 (≈58 MB, lớn nhất Top 6), stars 1, forks 1 (nguồn: `GET https://api.github.com/repos/ThanhNguyxnOrg/apidex-hub`) |
| Lịch sử local | **SHALLOW CLONE — chỉ 17 commits từ 2026-10-06 tới 2026-10-10** (nguồn: `git rev-parse --is-shallow-repository` → `true`; `git log --format='%h %ad %s'` full 17 dòng). Lịch sử từ 05/2026 tới 10/2026 **không có local, không kết luận được** — site không được bịa origin story chi tiết. |
| Contributors (17 commits thấy được) | RealThanhNguyxn 9, ThanhNguyxnAgent[bot] 8 (nguồn: `git shortlog -sne HEAD`) |
| Dấu vết previous home (thời personal) | Badge visitor trong README vẫn trỏ `path=ThanhNguyxn%2Fapidex-hub` (login personal `ThanhNguyxn` — account hiện lookup 404, xem briefing §1.2); badge Buy-Me-A-Coffee trỏ `buymeacoffee.com/thanhnguyxn`; LICENSE ghi `Copyright (c) 2025 Thanh Nguyen` (nguồn: `git show HEAD:README.md`, `D:\Code\apidex-hub\LICENSE` 8 dòng đầu). Không tìm thấy chữ kriptoburak/awesome-free-apis trong file tracked (nguồn: `git grep -i kriptoburak|awesome-free-apis` → rỗng). |
| Câu chuyện 17 commit thấy được | Saga "dọn link chết": `90c0f74` xóa 275 dead Apify links (fixes #7), `0295019` auto-remove (fixes #9), `1862ed6` xóa 16 dead links (fixes #10); pipeline `c418ca3` "auto-remediate dead links with incident issues and discussions dashboard"; file `CONTEXT.md` định nghĩa domain model (API Entry, Link Health 2-stage check, Safety Brake) (nguồn: full git log 17 dòng, `D:\Code\apidex-hub\CONTEXT.md`) |
| Tags / releases | Không có tag local (nguồn: `git tag --list` rỗng); releases API **chưa verify (403 rate-limit)**. |
| README hiện tại | "A curated collection of awesome public APIs and web scrapers…", Pages site, ví dụ code Python/JS, bảng 5 cột chuẩn (nguồn: `D:\Code\apidex-hub\README.md` 40 dòng đầu + tail) |

**➜ 1 câu story cho site (ghi kèm caveat):** APIDex Hub là catalog API free kèm website tra cứu, nổi bật ở hệ thống tự động kiểm tra và dọn link chết mỗi ngày — nhưng clone local bị shallow (chỉ còn 17 commit tháng 10/2026) nên quá khứ trước đó chưa dựng được; chỉ chắc chắn nó từng sống ở namespace personal `ThanhNguyxn` (dấu vết còn trong badge/README). **Lịch sử mỏng — site chỉ kể tới đây.**

---

## 4. awesome-cert-sherpa — second-life rõ nhất: previous home + rewrite có backup tag

| Mục | Giá trị + nguồn |
|---|---|
| Remote origin | `https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa.git` (nguồn: `git remote -v`) |
| GitHub `created_at` | `2026-05-17T13:53:41Z`, `fork: false`, stars 1, forks 2 (nguồn: `GET https://api.github.com/repos/ThanhNguyxnOrg/awesome-cert-sherpa`) |
| Commit đầu tiên | `8f34a6d 2026-02-14 "chore: scaffold Docusaurus docs portal (TypeScript + pnpm, GitHub Pages config)"` — **sớm hơn org 2 tháng**, scaffold 42 files/13.194 insertions (nguồn: `git log --reverse`, `git show --stat 8f34a6d`). Cùng ngày đã có content: `e10f78e` "expand core content to 640 questions (14 certs)" và `ef8f023` "complete visual overhaul" (nguồn: `git show -s` từng commit). |
| Tổng commit | 110 (nguồn: `git rev-list --count HEAD`) |
| Contributors | dependabot[bot] 52, RealThanhNguyxn 48, ThanhNguyxn 7, crushcert 2, Thanh Nguyen 1 (nguồn: `git shortlog -sne HEAD`; riêng `crushcert <hello@crushcert.com>` là contributor ngoài duy nhất Top 6) |
| Bằng chứng previous home | Commit `e7f3156 2026-04-06 "chore: update links for ThanhNguyxn-Org migration"` đổi toàn bộ URL `github.com/ThanhNguyxn/awesome-cert-sherpa` → `github.com/ThanhNguyxn-Org/awesome-cert-sherpa` (lưu ý tên org trung gian **có gạch nối** `ThanhNguyxn-Org`, khác tên hiện tại) — previous owner chính là login personal `ThanhNguyxn` nay đã 404 (nguồn: `git show e7f3156 -- README.md package.json` hiện diff URL cũ/mới) |
| Bằng chứng migration (văn bản) | File `.mailmap`: "All contributions are credited to RealThanhNguyxn **after the May 2026 migration**", ánh xạ 3 identity cũ (gmail thanhnguyentuan2007, user-id 74597207 của login `ThanhNguyxn`, `ThanhNguyxn07`) về RealThanhNguyxn (nguồn: `D:\Code\awesome-cert-sherpa\.mailmap` toàn file) |
| Cột mốc rewrite | Tag `backup-pre-rewrite-2026-05-17` chốt đúng commit `e7f3156` (Apr 6) → `a02f2d5 2026-05-17 "feat(ui): rebuild site with Topographic Expedition design system"` → `45f4057 2026-05-18 "feat: migrate from Docusaurus to Vite SPA"` (nguồn: `git show -s backup-pre-rewrite-2026-05-17`, `git log --since=2026-05-15 --until=2026-05-20`) |
| Tags / releases | Chỉ 1 tag backup, không tag release; releases API **chưa verify (403 rate-limit)** (nguồn: `git tag --list`) |
| README hiện tại | "Community-driven IT certification prep — 1,590+ original practice questions, anti-dump pledge", 14 certs (AWS/Azure/GCP/CISSP/CCNA/CKA…), "Study smarter, summit higher" (nguồn: `D:\Code\awesome-cert-sherpa\README.md` 40 dòng đầu; API description khớp) |

**➜ 1 câu story cho site:** CertSherpa ra đời tháng 2/2026 ở nhà cũ personal (`ThanhNguyxn/awesome-cert-sherpa`), tháng 4 chuyển sang org, tháng 5 được backup-tag rồi rewrite từ Docusaurus sang Vite SPA với design Topographic — ví dụ sạch nhất của "second life" trong migration.md: giữ content (ngân hàng câu hỏi), thay toàn bộ vỏ.

---

## 5. PurgeKit — thả nguyên project trong 1 commit, lịch sử mỏng nhất

| Mục | Giá trị + nguồn |
|---|---|
| Remote origin | `https://github.com/ThanhNguyxnOrg/PurgeKit.git` (nguồn: `git remote -v`) |
| GitHub `created_at` | `2026-06-10T14:24:56Z`, `fork: false`, language Rust, license Apache-2.0 (duy nhất Top 6 không dùng MIT), stars 1 (nguồn: `GET https://api.github.com/repos/ThanhNguyxnOrg/PurgeKit`) |
| Commit đầu tiên | `9e77007 2026-06-10 "feat: complete core backend, flat ember orange redesign, logo assets, and detailed documentation"` — **đúng ngày tạo repo**, và thả **77 files / 18.642 insertions trong MỘT commit** (nguồn: `git log --reverse`, `git show --stat 9e77007`). Cách viết message ("complete backend", "redesign") gợi ý đây là squashed import từ nơi khác, nhưng **không có marker migration nào trong history** → trung thực ghi là "không phân biệt được born-in-org hay squashed import". |
| Tổng commit | 93 (nguồn: `git rev-list --count HEAD`) |
| Contributors | ThanhNguyn 34, dependabot[bot] 28, RealThanhNguyxn 18, ThanhNguyxn 10, "Tchou mendi" 3 (nguồn: `git shortlog -sne HEAD` — 5 identities, nhiều nhất Top 6) |
| Cột mốc releases | Tag `v1.0.0` (2026-06-11, "version-free installer filenames") — ngay hôm sau commit đầu; tag `v1.1.0` (2026-06-14, "fix borrow checker"); CHANGELOG head hiện tại `[1.2.1] - 2026-10-07` (security hardening, PATH cleaner) — tag v1.2.x chưa có trong clone local (nguồn: `git show -s v1.0.0/v1.1.0`, `D:\Code\PurgeKit\CHANGELOG.md` 30 dòng đầu, `git tag --list` chỉ có v1.0.0/v1.1.0). Releases API **chưa verify (403 rate-limit)**. |
| Cột mốc pipeline | `30948e6` "switch release publishing to ThanhNguyxnAgent GitHub App token", `78bddad` "require explicit release commit header" — release tự động hóa bằng bot (nguồn: `git log --grep` release/rewrite) |
| README hiện tại | "The Ultimate Developer-Focused System Uninstaller & Deep Cleaner… Clean 100% of app remnants", Tauri v2 + Svelte v5 + Rust, Windows 10/11 (nguồn: `D:\Code\PurgeKit\README.md` 40 dòng đầu) |
| Dấu vết migration | **Không có** (grep migrat/re-upload/previous/second-life trong tracked files chỉ ra từ chuyên môn như "registry", "snapshot" — không liên quan previous home). |

**➜ 1 câu story cho site:** PurgeKit xuất hiện tháng 6/2026 dưới dạng một project Tauri+Rust gần như hoàn chỉnh ngay từ commit đầu, release v1.0.0 chỉ sau một ngày rồi đi đều tới v1.2.x — công cụ dọn máy cho developer; **lịch sử mỏng** (không dấu vết previous home), site không nên thêu dệt quá khứ cho nó.

---

## 6. Snapbooth — repo GIÀ nhất (2025), đổi brand, đổi stack, đổi tên

| Mục | Giá trị + nguồn |
|---|---|
| Remote origin | `https://github.com/ThanhNguyxnOrg/Snapbooth.git` (nguồn: `git remote -v`) |
| GitHub `created_at` | `2026-05-19T16:44:46Z`, `fork: false`, stars 1, forks 1, **không license** (nguồn: `GET https://api.github.com/repos/ThanhNguyxnOrg/Snapbooth`) |
| Commit đầu tiên | `5d90f9c 2025-05-12 "Initial commit"` — **già hơn org gần 1 năm**, và chỉ chứa 1 file `.gitattributes` (2 insertions): scaffold rỗng chờ code (nguồn: `git log --reverse`, `git show --stat 5d90f9c`) |
| Tổng commit | 127, **100% của 1 người** RealThanhNguyxn (nguồn: `git rev-list --count HEAD`, `git shortlog -sne HEAD` 1 dòng duy nhất) |
| Thời 2025 (static site) | Loạt commit Oct 2025: site photobooth đa trang HTML, brand **"SnapStrip"** (`5978c1d` "Update logo… SnapStrip branding"), Pages ở **`thanhnguyxn.github.io/Photo-Booth`** (`7191fba`), i18n Việt–Anh (`5563384`, `73d9b84`), QR share qua tmpfiles.org/catbox.moe (nguồn: `git log --since=2025-01-01 --until=2026-01-01` 30 dòng đầu, `git log --grep` rename/rebrand) |
| Cột mốc migration | `1c3d068 2026-04-06 "chore: update links for ThanhNguyxn-Org migration"` — diff cho thấy `github.com/ThanhNguyxn/Photo-Booth` → `github.com/ThanhNguyxn-Org/Photo-Booth`: previous home là repo personal **`ThanhNguyxn/Photo-Booth`** (nguồn: `git show -s 1c3d068`, `git show 1c3d068` diff URL) |
| Cột mốc đổi stack + tên | `a6bf413 2026-05-19 "Rebuild photobooth as React studio"` → `49d9eff 2026-05-20 "Rename repository to Snapbooth"` (nguồn: `git show -s` từng commit; stat 49d9eff chỉ 5 files đổi tên/bản build) |
| 2026 | 19 commits (nguồn: `git log --since=2026-01-01` count) |
| Tags / releases | Không tag; releases API **chưa verify (403 rate-limit)** (nguồn: `git tag --list` rỗng) |
| README hiện tại | "Privacy-first browser photo booth… Browser-only. Count-in shutter. Filters, frames, GIFs, QR share", React 18 + Vite 6 + TS, live Pages (nguồn: `D:\Code\Snapbooth\README.md` toàn phần đầu; API description khớp) |

**➜ 1 câu story cho site:** Snapbooth là repo già nhất Top 6 — khởi đầu từ một scaffold trống tháng 5/2025, lớn lên thành site photobooth tĩnh tên SnapStrip trên domain personal, rồi theo migration vào org (4/2026), lột xác thành React studio và chốt tên Snapbooth (5/2026). Câu chuyện second-life dài hơi nhất, và là repo duy nhất 100% một tác giả.

---

## Tổng hợp nhanh cho site (bảng đối chiếu)

| Repo | Sinh | Vào org / tạo GH | Dạng quá khứ | Story 1 câu |
|---|---|---|---|---|
| blendops | 2026-04-24 (trong org) | = ngày tạo GH 2026-04-24 | org-native, sprint 4–5/2026 | Skill-pack Blender build dồn dập, chốt chuỗi draft v0.1→v0.7 |
| lumeo | 2026-04-03 (tiền-org) | tạo GH 2026-05-10 | re-upload giữ history + rename + merge 2 codebase | Từ Lumen Subtitle Studio + engine Echoly thành extension dubbing 3 tầng, tới v2.0.6 |
| apidex-hub | không rõ (shallow) | tạo GH 2026-05-07 | **lịch sử mỏng** — upstream remote chết, vết personal còn trong badge | Catalog API free + pipeline dọn link chết; quá khứ chi tiết chưa dựng được |
| awesome-cert-sherpa | 2026-02-14 (tiền-org) | tạo GH 2026-05-17 | previous home `ThanhNguyxn/…` + rewrite Docusaurus→Vite có backup tag | Second-life mẫu mực: giữ ngân hàng câu hỏi, thay toàn bộ vỏ |
| PurgeKit | 2026-06-10 (= ngày tạo GH) | = ngày tạo GH | **lịch sử mỏng** — 1 commit thả 77 files, không marker migration | Tool dọn máy Tauri+Rust, v1.0.0 sau đúng 1 ngày; không thêu quá khứ |
| Snapbooth | 2025-05-12 (già nhất) | tạo GH 2026-05-19 | previous home `ThanhNguyxn/Photo-Booth`, brand SnapStrip, static→React, đổi tên | Second-life dài hơi nhất: scaffold 2025 → SnapStrip → React Snapbooth, 1 tác giả |

## Nguồn đã dùng (đầy đủ)

**Git local (D:\Code\<repo>):** `log --reverse --format="%h %ad %s" --date=short`, `rev-list --count HEAD`, `shortlog -sne HEAD`, `remote -v`, `tag --list`, `show --stat <sha>`, `show -s --format='%h %ad %s'`, `log --grep=<kw> -i`, `grep -i -n <kw> -- HEAD -- <paths>`, `rev-parse --is-shallow-repository`, `branch -a`, `fetch contributor --dry-run` — áp dụng cho cả 6 repo blendops / lumeo / apidex-hub / awesome-cert-sherpa / PurgeKit / Snapbooth.

**GitHub API (public, không auth, 11/10/2026):**
1. `https://api.github.com/repos/ThanhNguyxnOrg/blendops` (200 — created_at, stars, topics)
2. `https://api.github.com/repos/ThanhNguyxnOrg/lumeo` (200)
3. `https://api.github.com/repos/ThanhNguyxnOrg/apidex-hub` (200)
4. `https://api.github.com/repos/ThanhNguyxnOrg/awesome-cert-sherpa` (200)
5. `https://api.github.com/repos/ThanhNguyxnOrg/PurgeKit` (200)
6. `https://api.github.com/repos/ThanhNguyxnOrg/Snapbooth` (200)
7. `https://api.github.com/repos/ThanhNguyxnOrg/blendops/releases?per_page=5` (200 — v0.7.0-draft 2026-05-09)
8. `https://api.github.com/repos/ThanhNguyxnOrg/lumeo/releases?per_page=5` (200 — v2.0.2→v2.0.6)
9. `.../PurgeKit|Snapbooth|awesome-cert-sherpa|apidex-hub/releases?per_page=5` (**403 rate-limit, chưa verify** — bù bằng git tags)
10. `https://api.github.com/rate_limit` (`limit: 60, remaining: 0`, reset 1791690310)

**File local đã đọc:** `D:\Code\ThanhNguyxnOrg\ThanhNguyxnOrg.github.io\docs\research-org-site.md` (context, không sửa), `...\GLOSSARY.md`, `D:\Code\ThanhNguyxnOrg\.github\docs\migration.md`, `README.md` + `CHANGELOG.md` + `CONTEXT.md` + `.mailmap` + `LICENSE` các repo như trích dẫn ở từng mục.

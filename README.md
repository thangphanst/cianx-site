# CianX — cianx.site

Thư viện / catalog cá nhân của Cian: phần mềm, extension, skill, công cụ và website hữu ích.

## Kiến trúc

- Web tĩnh thuần (HTML/CSS/JS), **không build step, không database, không server**.
- Deploy: **Cloudflare Pages** nối với repo GitHub này — push lên `main` là tự deploy.
- Dữ liệu tách khỏi giao diện: `data/catalog.json`. Giao diện tự render từ dữ liệu này.

## Thêm / sửa một mục (quy trình cho Muse)

1. Chỉ sửa `data/catalog.json`: thêm object vào `items` với các trường
   `id` (slug duy nhất), `name`, `url`, `type` (`software|extension|skill|website|tool`),
   `description` (tiếng Việt, ngắn), `tags[]`, `platform[]`, `pricing` (`Free|Freemium|Paid`),
   `featured` (bool), `dateAdded` (`YYYY-MM-DD`), `note` (tuỳ chọn).
2. Icon tự lấy từ favicon của domain trong `url` — không cần thêm file ảnh.
3. Nếu cần loại mới: thêm vào `categories` trong cùng file + tuỳ chỉnh giao diện nếu cần.
4. Commit + push lên `main`, chờ Cloudflare Pages deploy (~1 phút), kiểm tra https://cianx.site

## Cloudflare Pages settings

- Framework preset: None
- Build command: *(trống)*
- Build output directory: `/` (root của repo)
- Custom domain: `cianx.site` (+ `www` nếu muốn)

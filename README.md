# gauravvedi.com

Personal site of Gaurav Vedi — commercial-analytics / data leader in Copenhagen.
Plain static HTML/CSS/JS, no build step, deployed on Cloudflare Pages.

## Structure

| Path | URL | What |
|------|-----|------|
| `index.html` | `/` | Home |
| `dansk/` | `/dansk` | **Danish for PD3** — a free Danskuddannelse 3 (Modul 3.3) coach (index.html + js/ + data/ + vendor/, fully client-side) |
| `_headers` | — | Security headers for Cloudflare Pages |
| _(planned)_ `about/`, `writing/` | `/about`, `/writing` | Future sections |

## Design system

- **Colour** — warm graphite `#1b1a1c` (dark sections), warm paper `#faf9f6` (light sections), brass accent `#c79a3e` (`#dcae57` on dark, `#866223` for accent text on light). Ink `#1c1b1a` / `#42413e` / `#6d6c68`. No blue/navy or corporate palette.
- **Type** — Familjen Grotesk (display), Inter Tight (body), JetBrains Mono (labels), via Google Fonts.
- **Motion** — hero fade-up, scroll-reveal (IntersectionObserver), keyword marquee; all respect `prefers-reduced-motion`.

## Develop

No build step. Serve the folder and open the pages:

```sh
python3 -m http.server 8642
# http://localhost:8642        → home
# http://localhost:8642/dansk/ → Danish coach
```

## Deploy

Cloudflare Pages with GitHub Git integration. Every push to `main` deploys automatically.
No build command; **output directory = repo root**. Custom domains: `gauravvedi.com`, `www`.

## Content & privacy

- Danish content is original. Official SIRI / PD3 exam papers and textbooks are **not** reproduced or committed (see `.gitignore`).
- No login, no tracking, no cookies.

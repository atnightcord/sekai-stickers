# SEO Audit — st.ayaka.one (Sekai Stickers)

**Date:** 2026-06-13
**Site:** https://st.ayaka.one
**Type:** SPA tool (Vite + React) on Cloudflare Pages
**Previous deploy:** CRA-based (`/static/js/main.*`) — still serving old build
**Current repo:** Vite 8 + React 19 build

---

## Executive Summary

**Overall health: Poor.** The site is a client-rendered SPA with near-zero crawlability. Most SEO fundamentals are missing: no robots.txt, no sitemap, no canonical tags, no semantic HTML, no structured data. The live deployment serves a stale CRA build that doesn't match the current Vite repo. Google sees an empty `<div id="root">` with a `<noscript>` fallback.

**Top 5 priority issues:**

1. **No robots.txt or sitemap.xml** — Google has no crawl guidance; all 404s return 200 (SPA catch-all)
2. **Entire content behind JS** — Google may render the SPA, but there is zero static/semantic HTML for crawlers or social preview bots
3. **No canonical URL** — no `<link rel="canonical">` tag
4. **No semantic HTML** — no `<main>`, `<h1>`, `<nav>`, `<header>`, `<footer>`, no headings at all in the app view
5. **OG image uses relative path** — `og:image` is `/og-image.png` instead of absolute URL `https://st.ayaka.one/og-image.png`; some platforms may fail to resolve

---

## Technical SEO Findings

### 1. No robots.txt
- **Impact:** High
- **Evidence:** `curl https://st.ayaka.one/robots.txt` returns the SPA HTML (200), not a robots.txt file
- **Fix:** Create `public/robots.txt` with proper directives and sitemap reference
- **Priority:** 1

### 2. No sitemap.xml
- **Impact:** High
- **Evidence:** `curl https://st.ayaka.one/sitemap.xml` returns the SPA HTML (200)
- **Fix:** Create `public/sitemap.xml` listing all indexable pages
- **Priority:** 1

### 3. Soft 404s — all paths return HTTP 200
- **Impact:** High
- **Evidence:** `curl -I https://st.ayaka.one/nonexistent-page-test` returns 200 (SPA catch-all)
- **Fix:** This is inherent to SPA hosting. Mitigate by: (a) adding robots.txt to block non-existent paths, (b) ensuring sitemap only lists real pages, (c) implement proper 404 handling in Cloudflare Pages `_redirects` or `vercel.json` if possible
- **Priority:** 2

### 4. No canonical URL
- **Impact:** High
- **Evidence:** No `<link rel="canonical">` in index.html or public/index.html
- **Fix:** Add `<link rel="canonical" href="https://st.ayaka.one/" />` to the `<head>`
- **Priority:** 1

### 5. Stale CRA build still deployed
- **Impact:** Medium
- **Evidence:** Live site serves `/static/js/main.32d4ad8f.js` and `/static/css/main.c49c322a.css` — CRA paths. Current repo builds to `/assets/index-*.js` (Vite). The `public/static/js/main.12a1fd73.js` is an old CRA artifact.
- **Fix:** Deploy the Vite build. Remove `public/static/` directory (dead CRA assets). Remove stale `powered-by-vercel.svg`, `vercel-logotype-light.svg` if migrating to Cloudflare Pages.
- **Priority:** 2

### 6. No cache headers on HTML
- **Impact:** Low
- **Evidence:** `cache-control: public, max-age=0, must-revalidate` on HTML. Static assets have 31-day cache. This is actually acceptable for an SPA.
- **Fix:** No immediate action needed
- **Priority:** 5

### 7. No structured data / schema markup
- **Impact:** Medium
- **Evidence:** No JSON-LD in HTML, no schema.org markup. As a web app tool, `WebApplication` schema would be appropriate.
- **Fix:** Add `WebApplication` + `SoftwareApplication` JSON-LD to index.html
- **Priority:** 3

---

## On-Page SEO Findings

### 8. No semantic HTML in the app
- **Impact:** High
- **Evidence:** App.jsx renders `<div className="vertical">`, `<div className="settings">`, etc. — no `<main>`, `<h1>`, `<nav>`, `<section>`, no heading hierarchy. The entire UI is div soup.
- **Fix:** Wrap in `<main>`, add `<h1>` for the app title, use `<section>` for settings panels, `<label>` + proper `htmlFor` associations
- **Priority:** 2

### 9. OG image uses relative URL
- **Impact:** High
- **Evidence:** `<meta property="og:image" content="/og-image.png" />` — relative path. Twitter/Facebook scrapers may not resolve it.
- **Fix:** Change to absolute: `https://st.ayaka.one/og-image.png`
- **Priority:** 1

### 10. Meta description is thin
- **Impact:** Medium
- **Evidence:** `content="Project sekai stickers maker"` — 29 chars, vague. Should be 150-160 chars with keywords and value prop.
- **Fix:** Expand to something like: "Create custom Project Sekai sticker images with your own text. Choose from 50+ characters, customize fonts, colors, and positioning. Free online tool."
- **Priority:** 3

### 11. Title tag could be more descriptive
- **Impact:** Medium
- **Evidence:** `<title>Sekai Stickers</title>` — 14 chars. Missing keyword context.
- **Fix:** Change to something like: "Sekai Stickers — Project Sekai Sticker Maker | Free Online Tool"
- **Priority:** 3

### 12. No alt text on character images in grid
- **Impact:** Low
- **Evidence:** Picker.jsx uses `alt={c.name}` — this is actually fine for character images. But images are loaded lazily without width/height, causing potential CLS.
- **Fix:** Add explicit `width` and `height` to picker images to prevent layout shift
- **Priority:** 4

### 13. Dead/unused files in public/
- **Impact:** Low
- **Evidence:** `public/static/js/main.12a1fd73.js` (old CRA bundle), `public/powered-by-vercel.svg`, `public/vercel-logotype-light.svg` — all from previous hosting.
- **Fix:** Remove dead assets to reduce deploy size and avoid confusing crawlers
- **Priority:** 4

### 14. Third-party ad script in index.html
- **Impact:** Low (SEO), Medium (trust)
- **Evidence:** `<script src="https://alwingulla.com/88/tag.min.js" data-zone="7598" async data-cfasync="false"></script>` and live site has `<script src="https://quge5.com/88/tag.min.js" data-zone="193317" async data-cfasync="false"></script>`. These are Propeller Ads ad scripts. Google's helpful content system may flag ad-heavy pages.
- **Fix:** Consider loading ads after content; ensure `data-cfasync="false"` doesn't bypass Cloudflare performance features. At minimum, add `loading="lazy"` equivalent for ad scripts.
- **Priority:** 4

### 15. bot-privacy.html and bot-tos.html lack SEO value
- **Impact:** Low
- **Evidence:** Static HTML pages for privacy/terms — not linked from the SPA, not in sitemap. These are fine as-is.
- **Fix:** Add `<meta name="robots" content="noindex">` to these pages so they don't compete with the main page in search results
- **Priority:** 5

---

## Content Quality Assessment

### 16. Entire app is a JS tool — zero crawlable content
- **Impact:** Critical
- **Evidence:** Google can render SPAs, but the rendered output is a tool UI with no descriptive text content. There is no "about" text, no FAQ, no explanation of what the tool does. Social preview bots (Twitter, Discord, Line) cannot render JS at all — they rely entirely on meta tags.
- **Fix:** This is the fundamental SEO challenge for a tool SPA. Mitigate by:
  1. Ensuring meta tags are comprehensive and compelling (title, description, OG)
  2. Adding a brief descriptive `<p>` inside `<noscript>` as a fallback
  3. Consider adding a static landing section above the tool with descriptive content
- **Priority:** 1

### 17. No internal linking structure
- **Impact:** Low
- **Evidence:** SPA with a single route `/`. No blog, no feature pages, no character pages. This limits topical authority.
- **Fix:** Long-term: consider adding static pages for top characters (e.g., `/miku`, `/kaito`) with pre-made sticker examples
- **Priority:** 5

---

## Prioritized Action Plan

### Critical (blocks proper crawling/indexing)
1. ✅ Create `public/robots.txt` — allow all, reference sitemap
2. ✅ Create `public/sitemap.xml` — list the single page
3. ✅ Fix OG image to absolute URL
4. ✅ Add canonical tag
5. ✅ Add `<noscript>` content with tool description

### High-impact improvements
6. ✅ Add `WebApplication` structured data (JSON-LD)
7. ✅ Improve meta description (150-160 chars)
8. ✅ Improve title tag (50-60 chars, keyword-rich)
9. Add semantic HTML (`<main>`, `<h1>`, `<section>`)

### Quick wins
10. Remove dead CRA assets (`public/static/`)
11. Remove stale Vercel branding files
12. Add `noindex` to privacy/tos pages

### Long-term recommendations
13. Add descriptive static content/landing section
14. Build character-specific pages for long-tail keywords
15. Consider pre-rendering / SSR for better crawlability

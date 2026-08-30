# Blog revamp — completed implementation plan

## Goal

Replace the VuePress 1 site with a Node 25, pnpm-only Astro publication while preserving all eight articles, historical routes, search visibility, and the intended split between articles and poems. The locked background and primary design tokens are both `#212121`; foreground and interaction colors remain high contrast.

## Phase 1 — platform and content foundation (completed)

- Replaced VuePress, Webpack, Bootstrap, Stylus, Forestry, PWA, nprogress, and smooth-scroll with Astro static output, Vue islands, and Tailwind's supported Vite integration.
- Moved all eight Markdown sources with `git mv` into the validated `blog` collection; created an empty, validated `poems` collection without fabricating content.
- Preserved source images, fonts, favicons, and `ads.txt` in Astro's `public/` convention; removed committed generated VuePress output.
- Pinned Node 25.9.0 and pnpm 10.33.0, with Netlify publishing `dist/`.

Acceptance: a credential-free production build emits eight canonical blog pages and an empty poems zone.

## Phase 2 — dual editorial experience and public contracts (completed)

- Built a concise landing page, 6/2 blog pagination, article and poem layouts, blog-scoped tag routes, custom 404, and a future-ready poem route.
- Kept TOC, newsletter, ad slot, lazy Disqus, and on-demand image zoom in the blog layout only. The poem layout imports none of those integrations.
- Added a Vue-powered search dialog over a Pagefind index, per-page canonical/Open Graph/Twitter metadata, sitemap, robots, and separate RSS feeds (8 blog items, 0 poem items).
- Added exact Netlify 301 rules for eight dated routes and eight short routes, scoped legacy tag handling, and old feed endpoints. Internal links between the Portuguese and English 2025 articles now use canonical routes.
- Recovered the committed VuePress identifier `v-1f7a93f4` for the 2020 portfolio post. Other VuePress identifiers were build-path hashes and cannot be derived honestly; those use their legacy canonical page URL for Disqus resolution.

Acceptance: all public routes are reachable, redirects are explicit, and no blog-only service appears on poems routes.

## Phase 3 — verification and shipping gates (completed)

- Replaced the obsolete VuePress snapshot with migration, redirect, content-count, token, and layout isolation tests.
- Added a built-output verifier for route existence, pagination, feed counts, sitemap host, Pagefind artifacts, and internal links.
- Added Playwright navigation tests at desktop and mobile sizes, including the 8-post reachability invariant and a real Pagefind query.
- Added a deterministic, credential-free local build path and project operations documentation.

Acceptance: `pnpm check`, `pnpm test`, `pnpm build`, `pnpm verify:output`, and `pnpm test:e2e` pass; Lighthouse is run against a representative built article when local Chrome is available.

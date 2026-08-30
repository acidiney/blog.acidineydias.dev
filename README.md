# blog.acidineydias.dev

A static Astro publication with two deliberately separate collections: rich long-form articles and a quiet poems space. The site builds to `dist/`, creates its search index with Pagefind, and deploys to Netlify.

## Requirements

- Node 25.9.0 (`.nvmrc`)
- pnpm 10.33.0 (pinned in `package.json`)

```sh
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm verify:configured
pnpm build
pnpm verify:output
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm verify` runs the complete check, unit, configured-integration fixture build, normal build, static-output, and browser-test sequence. `verify:configured` builds into a temporary directory with safe dummy public values and inspects rendered HTML for GA, AdSense, and newsletter markup; it never serves the build or contacts those services. Normal tests and local builds require no external service credentials and make no third-party requests.

## Content

- Articles: `src/content/blog/*.md` → `/blog/:slug/`
- Poems: `src/content/poems/*.md` → `/poems/:slug/`

Both collections are validated by `src/content.config.ts`. Articles require a featured-image source and dimensions; known articles use responsive optimized derivatives, while a new image safely falls back to its declared source. Poems have their own smaller contract and do not require blog legacy metadata or images. Content defaults to Portuguese and can declare `language: en`; Pagefind builds separate Portuguese and English indexes, and the site-wide search uses the current page language as its primary index and merges the other language regardless of where the search begins.

Article frontmatter includes `legacyPath`, which keeps old URLs and Disqus page URLs stable. The one recoverable historical VuePress Disqus hash is stored as `legacyIdentifier` on `refazendo-meu-portfolio-parte-1.md`; all other old hash identifiers depended on an unrecoverable VuePress build path, so those threads fall back to the legacy canonical URL rather than a fabricated hash.

## Optional public environment variables

| Variable | Purpose |
| --- | --- |
| `PUBLIC_GA_ID` | Loads Google Analytics only when set |
| `PUBLIC_ADSENSE_CLIENT` | AdSense client, blog pages only |
| `PUBLIC_ADSENSE_SLOT` | AdSense slot paired with the client |
| `PUBLIC_NEWSLETTER_ENDPOINT` | Newsletter form endpoint; without it the form is non-submitting |
| `PUBLIC_DISQUS_SHORTNAME` | Disqus shortname; defaults to the historical `acidineydias` |

Never place private keys in `PUBLIC_*` variables: Astro exposes them to the browser. Redirects live in `netlify.toml`; the verifier tests every dated and short legacy post mapping without relying on static-server redirect emulation.

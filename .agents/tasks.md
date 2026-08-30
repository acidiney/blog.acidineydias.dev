---
skill: task-breakdown
version: 1
date: 2026-08-30
status: approved
scope: locked
---

# Shared context

- Astro renders the Markdown heading list in `BlogToc.astro`.
- The TOC tracks level-two and level-three headings only.
- The approved palette uses `#212121` plus the existing muted and rule tokens.
- The existing brand signature stays above the index.
- Articles without headings keep the `Leitura contínua` state.
- No new runtime dependency is allowed.

## Task 1: Track the current desktop section

**Depends on:** None

**Outcome:** The sticky desktop TOC exposes the reader's current `H2` or `H3` through a connected active line and matching text state.

**Why:** This delivers the requested reading-position effect and makes long articles easier to navigate.

**Acceptance:** In a desktop browser on an article containing both heading levels, scrolling across successive headings moves the sole `aria-current="location"` state to the matching TOC link and its connected segment uses the primary ink color.

**Autonomy:** AFK

## Task 2: Preserve responsive and no-heading behavior

**Depends on:** Task 1

**Outcome:** The active state remains legible on narrow screens without the desktop spine, while articles without headings retain their current fallback.

**Why:** The effect must not damage mobile reading or short articles.

**Acceptance:** Mobile end-to-end coverage confirms the active link uses the compact indicator without horizontal page overflow, and the no-heading article still displays `Leitura contínua`.

**Autonomy:** AFK

---
skill: task-breakdown
version: 4
date: 2026-08-30
status: complete
scope: locked
---

# Shared context

- Article summary text uses the `.dek` class in `BlogPostLayout.astro`.
- The approved summary width is the existing 960px article content width.
- Font size, color, margins, line height, title, metadata, byline, spacing, and layout remain unchanged.

## Task 1: Widen the article summary text block

**Depends on:** None

**Outcome:** Article summaries use the full reading column beneath their titles on desktop.

**Why:** The previous 740px limit leaves available space unused and wraps long summaries too early.

**Acceptance:** The computed `.dek` width reaches at least 940px on the desktop test viewport while its font size remains 21.12px.

**Autonomy:** AFK

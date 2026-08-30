---
skill: task-breakdown
version: 4
date: 2026-08-30
status: complete
scope: locked
---

# Shared context

- Article summary text uses the `.dek` class in `BlogPostLayout.astro`.
- The approved scale is `clamp(1.25rem, 2vw, 1.55rem)`.
- Width, color, margins, line height, title, metadata, byline, spacing, and layout remain unchanged.

## Task 1: Increase the article summary text

**Depends on:** None

**Outcome:** Article summaries have more visual presence beneath their titles at every viewport width.

**Why:** The current summary text appears too small relative to the title and available reading width.

**Acceptance:** The computed `.dek` font size reaches 24.8px on a wide viewport and never drops below 20px on narrow screens.

**Autonomy:** AFK

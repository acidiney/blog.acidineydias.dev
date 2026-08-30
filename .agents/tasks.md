---
skill: task-breakdown
version: 5
date: 2026-08-30
status: complete
scope: locked
---

# Shared context

- Reading time is calculated at build time from each Markdown body.
- The approved speed is 220 words per minute, rounded up with a one-minute minimum.
- The estimate appears beside the existing author byline.
- Portuguese and English articles use localized labels.
- No runtime dependency is allowed.

## Task 1: Calculate reading time

**Depends on:** None

**Outcome:** The content layer exposes a stable reading-time estimate for any Markdown body.

**Why:** A shared build-time calculation keeps estimates consistent across all articles.

**Acceptance:** One unit test verifies the one-minute minimum and rounds 221 readable words to two minutes.

**Autonomy:** AFK

## Task 2: Show the localized estimate

**Depends on:** Task 1

**Outcome:** Every article byline includes its reading-time estimate in the article language.

**Why:** Readers can judge the commitment before starting the article without adding another metadata row.

**Acceptance:** One browser test finds `min de leitura` on a Portuguese article and `min read` on an English article beside the author.

**Autonomy:** AFK

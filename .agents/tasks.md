---
skill: task-breakdown
version: 2
date: 2026-08-30
status: complete
scope: locked
---

# Shared context

- The approved article reading axis is 960px.
- The local environment has no newsletter endpoint or AdSense credentials.
- Disqus uses the existing `acidineydias` shortname fallback and legacy article metadata.
- The closing section remains light, square, and free of cards or decorative backgrounds.
- No new runtime dependency is allowed.

## Task 1: Load the conversation automatically

**Depends on:** None

**Outcome:** Every blog article requests and mounts its Disqus conversation without asking the reader to click a control.

**Why:** This removes the gated interaction explicitly rejected by the user.

**Acceptance:** Opening an article issues one request to the configured Disqus embed URL without user interaction and renders no manual load button.

**Autonomy:** AFK

## Task 2: Compact the article closing section

**Depends on:** Task 1

**Outcome:** The article ends with one restrained conversation block on the 960px reading axis, while unconfigured advertising and newsletter UI remain absent.

**Why:** This removes the empty bands and competing headings visible in the supplied screenshot.

**Acceptance:** In the default local build, the article has no visible ad placeholder or newsletter, and the conversation heading shares the article content left edge with no explanatory sentence.

**Autonomy:** AFK

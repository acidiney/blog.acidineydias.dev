---
skill: task-breakdown
version: 3
date: 2026-08-30
status: complete
scope: locked
---

# Shared context

- The approved visual direction is a warm, light, minimal editorial interface.
- The search remains a native dialog backed by the existing Pagefind integration.
- The desktop dialog has a 560px maximum width and grows only when status or results content appears.
- Existing typography and color tokens remain authoritative.
- No new runtime dependency is allowed.

## Task 1: Compact the initial search surface

**Depends on:** None

**Outcome:** Opening search shows a centered, restrained editorial dialog with a single compact control row.

**Why:** The current oversized panel, thick outlines, and large controls dominate the article.

**Acceptance:** At a desktop viewport, the unopened-results dialog is no wider than 560px and uses one thin outer rule with no heavy double outline.

**Autonomy:** AFK

## Task 2: Integrate search states into the compact dialog

**Depends on:** Task 1

**Outcome:** Loading, empty, error, and result states extend the dialog below the search row without changing search behavior.

**Why:** The dialog must stay compact initially while still making real search results easy to scan.

**Acceptance:** Submitting a query renders the existing Pagefind status or results beneath the controls and keeps keyboard focus styles visible.

**Autonomy:** AFK

## Task 3: Adapt and verify the dialog

**Depends on:** Task 2

**Outcome:** The same search interaction fits narrow screens and passes the project checks.

**Why:** The compact desktop layout must not introduce clipped controls or horizontal overflow on mobile.

**Acceptance:** At a 390px viewport, opening, submitting, and closing search produces no horizontal overflow and Escape still dismisses the dialog.

**Autonomy:** AFK

# Article summary scale

## Goal

Increase only the article summary text size so it has more presence beneath the title.

## Design

- Change `.dek` from `clamp(1.08rem, 1.7vw, 1.32rem)` to `clamp(1.25rem, 2vw, 1.55rem)`.
- Preserve the existing 740px maximum width, muted color, zero margin, and 1.5 line height.
- Do not change the title, metadata, byline, header spacing, or mobile layout.

## Acceptance

The article summary reaches 1.55rem on wide screens and remains fluid down to 1.25rem without horizontal overflow.

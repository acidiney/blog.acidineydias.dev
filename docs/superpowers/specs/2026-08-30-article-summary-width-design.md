# Article summary width

## Goal

Increase only the article summary block width so longer summaries use the full reading column beneath the title.

## Design

- Change `.dek` from a 740px maximum width to the existing 960px article content width.
- Preserve the original `clamp(1.08rem, 1.7vw, 1.32rem)` font size.
- Preserve the muted color, zero margin, and 1.5 line height.
- Do not change the title, metadata, byline, header spacing, or mobile layout.

## Acceptance

The article summary measures at least 940px on the desktop test viewport and retains a 21.12px computed font size.

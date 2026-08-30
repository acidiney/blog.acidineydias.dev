# Article TOC scrollspy

## Goal

Turn the article table of contents into a quiet reading-position indicator inspired by the supplied reference. The effect must preserve the approved light, minimal editorial design.

## Visual behavior

- Keep the existing brand signature above the index.
- Draw one neutral vertical spine beside the heading list.
- Indent level-three headings and connect them to the spine with a short horizontal branch.
- Render inactive headings and line segments with the existing muted tokens.
- Render the current heading and its line segment with `#212121`.
- Avoid cards, new colors, shadows, pills, or decorative containers.

## Scroll behavior

- Track both level-two and level-three Markdown headings.
- Select the last heading whose top has crossed a reading threshold near the top of the viewport.
- Update `aria-current="location"` on the corresponding link.
- Recalculate on scroll, resize, and hash navigation.
- Keep the active link visible inside the sticky TOC when the list exceeds the viewport.
- Leave the existing "Leitura contínua" state unchanged for articles without headings.

## Implementation

- Add stable heading identifiers to each TOC item in `BlogToc.astro`.
- Use a small inline script with `requestAnimationFrame`; no new dependency is needed.
- Build the spine, branches, and active segment with CSS pseudo-elements.
- Disable animated transitions under `prefers-reduced-motion`.
- On narrow layouts, retain the horizontal TOC and use an underline as the active indicator instead of the desktop spine.

## Verification

- Confirm an article with mixed `H2` and `H3` updates the active item while scrolling.
- Confirm `aria-current` follows the visual state.
- Confirm articles without headings still show "Leitura contínua".
- Confirm the desktop TOC remains sticky and the mobile list remains horizontally scrollable.

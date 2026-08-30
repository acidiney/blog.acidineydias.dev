# Poems title scale

## Goal

Reduce the poems index headline so Portuguese diacritics remain clear and the empty page feels restrained rather than oversized.

## Design

- Keep the current 860px poems column, eyebrow, copy, and empty state.
- Change the headline maximum size from 9rem to 5rem while retaining a fluid mobile size.
- Give the headline a 1.04 line height so accents and descenders cannot collide between lines.
- Preserve the existing display font, weight, color, and editorial alignment.
- Keep the change local to `/poems/`; article titles and other display headings remain unchanged.

## Acceptance

- At a 1974px-wide viewport, the headline computes to no more than 80px with at least 1.04 line height.
- The headline has no overlapping lines, stays inside the poems column, and does not cause horizontal overflow.
- The poems empty-state content and all other pages retain their current styling.

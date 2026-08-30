# Search dialog design

## Goal

Replace the oversized search panel with a compact editorial dialog that supports reading instead of dominating the article beneath it.

## Visual direction

- Use the existing warm light surface, ink color, rules, and typography tokens.
- Keep the dialog centered with a 560px maximum width on desktop.
- Use a thin rule, a small corner radius, and no heavy double borders or shadows.
- Place the search field and submit action on one row.
- Render the close action as a quiet icon button in the dialog header.
- Let the dialog grow vertically only when status text or search results appear.

## Behaviour

- Opening the dialog focuses the search field.
- Submitting an empty value does not run a search.
- Loading, empty, and error messages occupy the results area without changing the overall visual language.
- Results remain keyboard accessible and use clear focus states.
- Escape and the close control dismiss the dialog.

## Responsive layout

- On narrow screens, the dialog uses the available viewport width with a 1rem outer gutter.
- The search input remains the dominant control.
- The submit button stays beside the input while space permits and moves below it only on very narrow screens.

## Acceptance criteria

- The initial dialog is visibly smaller than the current implementation.
- No control uses a thick outline or exaggerated rounding.
- The dialog height expands only after results or status content is rendered.
- Search behaviour and Pagefind integration remain unchanged.
- Desktop and mobile layouts have no overflow.

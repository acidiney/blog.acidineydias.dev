# Article end matter

## Goal

Replace the loose blocks below each article with one compact closing section on the existing 960px reading axis.

## Composition

- Keep article tags as the first closing element.
- Do not render the advertising placeholder when AdSense is not configured.
- Do not render the newsletter when its endpoint is not configured.
- When configured, keep advertisements and the newsletter inside the same 960px axis with restrained spacing.
- Place the conversation section after the configured integrations.
- Separate the conversation from preceding content with one hairline rule.
- Let the Disqus interface provide its own comment heading; do not repeat it in the page shell.
- Use the approved Söhne/Helvetica display stack for every heading and Inter for body copy; do not introduce a third typeface.
- Avoid cards, backgrounds, rounded containers, oversized type, and large empty bands.

## Disqus behavior

- Configure the legacy URL, optional identifier, and article title before loading Disqus.
- Request the Disqus embed automatically when the page loads.
- Remove the manual load button and its event handler.
- Preserve the `disqus_thread` mount element and a short noscript fallback.

## Responsive behavior

- Keep the section full-width within the 960px article column.
- Let the Disqus embed handle its own internal responsive layout.
- Keep vertical spacing between 2rem and 3rem on desktop and mobile.

## Verification

- Confirm the default local page contains no ad placeholder and no unavailable newsletter.
- Confirm the Disqus embed request occurs without a click.
- Confirm the conversation section shares the article content left edge.
- Confirm no manual Disqus button or explanatory sentence remains.

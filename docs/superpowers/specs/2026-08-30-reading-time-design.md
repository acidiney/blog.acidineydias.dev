# Reading time

## Goal

Show an automatic reading-time estimate beside the article author without adding visual noise to the header.

## Calculation

- Calculate the estimate at build time from the Markdown body.
- Count readable words after removing Markdown syntax that is not displayed as prose.
- Divide the word count by 220 words per minute and round up.
- Return at least one minute.
- Add no runtime dependency.

## Presentation

- Portuguese articles render `Por Acidiney Dias · N min de leitura`.
- English articles render `By Acidiney Dias · N min read`.
- Keep the existing byline color, size, margin, and single-line layout when space allows.
- Allow the byline to wrap naturally on narrow screens.

## Testing

- Unit tests cover empty content, a sub-220-word article, and content above 220 words.
- Browser tests confirm Portuguese and English labels beside the author.

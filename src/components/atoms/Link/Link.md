# Atom: Link (Web Component)

Reusable Web Component for internal and external navigation. Exposes the custom element
`<app-link>`, which renders an `<a>` in the light DOM so that global styles (e.g., `.menu__link`)
continue to apply.

- File: `src/components/atoms/Link.ts`
- Main function: `createLink(text: string, href: string, options?: LinkOptions): HTMLElement`

## API

Parameters:

- `text`: Visible text of the link.
- `href`: Destination URL or hash.
- `options` (optional) of type `LinkOptions` (see `src/interfaces/LinkOptions.interface.ts`):
  - `target`: defaults to `_self`. If `_blank`, secure `rel` is applied automatically.
  - `rel`: link relationship. If `target === '_blank'` and not provided, uses
    `"noopener noreferrer"`.
  - `classes`: additional list of CSS classes for styling (applied to the inner `<a>`).

Attributes of `<app-link>`:

- `href`: link destination (reflected in the inner `<a>`).
- `target`: link target.
- `rel`: link relationship (automatically adjusted when `target="_blank"`).
- `text`: textual content to display in the inner `<a>`.
- `data-classes`: classes to apply to the inner `<a>` (space-separated).

Returns:

- `HTMLElement` (`<app-link>`) ready to be inserted into the DOM.

## Generated markup

Example of DOM result:

```html
<app-link href="https://example.com/docs" target="_blank" data-classes="menu__link">
  <a href="https://example.com/docs" target="_blank" rel="noopener noreferrer" class="menu__link"
    >Documentation</a
  >
</app-link>
```

## Usage example

```ts
import { createLink } from '@/components/atoms/Link';

const link = createLink('Documentation', 'https://example.com/docs', {
  target: '_blank',
  classes: ['menu__link'],
});

document.body.appendChild(link);
```

## Accessibility

- Maintains a semantic `<a>` in the DOM, ensuring native behavior and accessibility.
- When `target="_blank"` is used, applies `rel="noopener noreferrer"` for security.
- Ensure that the link text describes the destination (avoid "click here").

## Styles

- Classes passed in `options.classes` (or via `data-classes`) are applied to the inner `<a>`,
  allowing reuse of existing styles like `.menu__link`.

## Tests

- Unit tests in `src/components/atoms/Link.test.ts`:
  - Verifies that the custom element (`APP-LINK`) is created and that the inner `<a>` receives
    `href`, `target`, `rel` and additional classes.

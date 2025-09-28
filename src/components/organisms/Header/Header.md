# Organism: Header

Combines the brand (title) with the `Menu` component to form the site header.

- File: `src/components/organisms/Header.ts`
- Main function: `createHeader(title: string, items: MenuItem[]): HTMLElement`

## API

Parameters:

- `title`: Title/branding text displayed in the header.
- `items`: Array of `MenuItem` (see `src/interfaces/MenuItem.interface.ts`) to build the menu.

Returns:

- `HTMLElement` (`<header class="site-header">`) with the brand and menu.

## Generated markup

```html
<header class="site-header">
  <div class="site-header__brand">
    <h1 class="site-header__title">Training</h1>
  </div>
  <!-- Menu component here -->
</header>
```

## Usage example

```ts
import { createHeader } from '@/components/organisms/Header';
import type { MenuItem } from '@/interfaces/MenuItem.interface';

const items: MenuItem[] = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

const header = createHeader('Training', items);
document.body.appendChild(header);
```

## Styles

- Styling in `src/style.css`:
  - `.site-header` for header layout.
  - `.site-header__title`/`.site-header__brand` for branding.
  - The menu inherits styles defined for `.menu` and internal elements.

## Accessibility

- Semantic structure with `<header>` and `<h1>`.
- The internal `Menu` component handles button behavior and `aria-expanded`.

## Tests

- Unit tests in `src/components/organisms/Header.test.ts`:
  - Verifies that the title is rendered.
  - Ensures that the menu is included and contains 5 items.

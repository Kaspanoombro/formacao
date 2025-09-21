# Molecule: Menu

Renders a responsive navigation menu with hamburger button on small screens.

- File: `src/components/molecules/Menu.ts`
- Main function: `createMenu(items: MenuItem[]): HTMLElement`

## API

Parameters:

- `items`: Array of `MenuItem` (see `src/interfaces/MenuItem.interface.ts`), each item with:
  - `label`: displayed text.
  - `href`: link destination.

Returns:

- `HTMLElement` (`<nav class="menu">`) containing the toggle button and item list.

## Generated markup

Base structure inserted into the DOM:

```html
<nav class="menu">
  <button class="menu__toggle" aria-label="Open menu" aria-expanded="false">
    <span class="menu__bar"></span><span class="menu__bar"></span><span class="menu__bar"></span>
  </button>
  <ul class="menu__list">
    <li class="menu__item"><a class="menu__link" href="#">Home</a></li>
    <!-- ... remaining items -->
  </ul>
</nav>
```

## Usage example

```ts
import { createMenu } from '@/components/molecules/Menu';
import type { MenuItem } from '@/interfaces/MenuItem.interface';

const items: MenuItem[] = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

const menu = createMenu(items);
document.body.appendChild(menu);
```

## Accessibility

- The open/close button controls state through `aria-expanded` and the `is-open` class on the
  `<nav>`.
- Use descriptive link labels.
- Navigation is semantic: `<nav>` + `<ul>/<li>/<a>`.

## Responsive behavior

- Desktop: horizontal list (`.menu__list`) visible.
- Mobile (`max-width: 768px`):
  - `.menu__toggle` becomes visible.
  - List is hidden by default and shown vertically when `.menu.is-open` is applied.
- Styles are defined in `src/style.css`.

## Tests

- Unit tests in `src/components/molecules/Menu.test.ts`:
  - Verifies rendering of 5 items.
  - Verifies toggle behavior (open/close) and `aria-expanded`.

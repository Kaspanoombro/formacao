import { createLink } from '../atoms/Link/Link.ts';
import type { MenuItem } from '../../interfaces/MenuItem.interface';

/**
 * Molecule: Menu
 * Renders a responsive navigation menu with a hamburger toggle on mobile.
 */
export function createMenu(items: MenuItem[]): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'menu';

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'menu__toggle';
  toggleBtn.setAttribute('aria-label', 'Open menu');
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.innerHTML =
    '<span class="menu__bar"></span><span class="menu__bar"></span><span class="menu__bar"></span>';

  const list = document.createElement('ul');
  list.className = 'menu__list';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'menu__item';
    const link = createLink(item.label, item.href, { classes: ['menu__link'] });
    li.appendChild(link);
    list.appendChild(li);
  });

  // Toggle behavior for mobile
  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  nav.appendChild(toggleBtn);
  nav.appendChild(list);
  return nav;
}

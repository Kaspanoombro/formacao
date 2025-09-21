import { createMenu } from '../molecules/Menu';
import type { MenuItem } from '../../interfaces/MenuItem.interface';

/**
 * Organism: Header
 * Combines branding and the responsive Menu.
 */
export function createHeader(title: string, items: MenuItem[]): HTMLElement {
  const header = document.createElement('header');
  header.className = 'site-header';

  const brand = document.createElement('div');
  brand.className = 'site-header__brand';
  const h1 = document.createElement('h1');
  h1.className = 'site-header__title';
  h1.textContent = title;
  brand.appendChild(h1);

  const menu = createMenu(items);

  header.appendChild(brand);
  header.appendChild(menu);

  return header;
}

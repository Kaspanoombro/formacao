import { describe, it, expect } from 'vitest';
import { createHeader } from './Header.ts';
import type { MenuItem } from './MenuItem.interface.ts';

describe('Organism: Header', () => {
  it('renders a title and includes the menu', () => {
    const items: MenuItem[] = [
      { label: 'Início', href: '#' },
      { label: 'Sobre', href: '#sobre' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Blog', href: '#blog' },
      { label: 'Contacto', href: '#contacto' },
    ];

    const header = createHeader('Formação', items);
    const title = header.querySelector('.site-header__title');
    const menu = header.querySelector('.menu');

    expect(header.tagName).toBe('HEADER');
    expect(title?.textContent).toBe('Formação');
    expect(menu).toBeTruthy();
    expect(menu?.querySelectorAll('.menu__item').length).toBe(5);
  });
});

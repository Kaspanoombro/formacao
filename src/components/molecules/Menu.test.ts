import { describe, it, expect, beforeEach } from 'vitest';
import { createMenu } from './Menu';
import type { MenuItem } from '../../interfaces/MenuItem.interface';

describe('Molecule: Menu', () => {
  let items: MenuItem[];
  beforeEach(() => {
    items = [
      { label: 'Início', href: '#' },
      { label: 'Sobre', href: '#sobre' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Blog', href: '#blog' },
      { label: 'Contacto', href: '#contacto' },
    ];
  });

  it('renders 5 items', () => {
    const menu = createMenu(items);
    const renderedItems = menu.querySelectorAll('.menu__item');
    expect(renderedItems.length).toBe(5);
  });

  it('toggles open/close state via button', () => {
    const menu = createMenu(items);
    const btn = menu.querySelector<HTMLButtonElement>('.menu__toggle')!;

    expect(menu.classList.contains('is-open')).toBe(false);
    expect(btn.getAttribute('aria-expanded')).toBe('false');

    btn.click();

    expect(menu.classList.contains('is-open')).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('true');

    btn.click();

    expect(menu.classList.contains('is-open')).toBe(false);
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });
});

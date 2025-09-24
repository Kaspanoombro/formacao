import { describe, it, expect } from 'vitest';
import { createLink } from './Link.ts';

describe('Atom: Link (Web Component)', () => {
  it('creates a custom element that renders an anchor with text and href', () => {
    const el = createLink('Google', 'https://google.com');
    expect(el.tagName).toBe('APP-LINK');
    const a = el.querySelector('a');
    expect(a).toBeTruthy();
    expect(a?.textContent).toBe('Google');
    expect(a?.getAttribute('href')).toBe('https://google.com');
    expect(a?.getAttribute('target')).toBe('_self');
  });

  it('sets security rel when target is _blank', () => {
    const el = createLink('Ext', 'https://example.com', { target: '_blank' });
    const a = el.querySelector('a')!;
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toContain('noopener');
  });

  it('applies custom classes to the inner anchor', () => {
    const el = createLink('Docs', '#', { classes: ['menu__link', 'active'] });
    const a = el.querySelector('a')!;
    expect(a.classList.contains('menu__link')).toBe(true);
    expect(a.classList.contains('active')).toBe(true);
  });
});

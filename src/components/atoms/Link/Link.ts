import type { LinkOptions } from '../../../interfaces/LinkOptions.interface.ts';

/**
 * Atom: Link as a Web Component
 * Exposes a custom element <app-link> that renders an <a> element in the light DOM
 * so that global styles (e.g., .menu__link) can still apply.
 */
class AppLink extends HTMLElement {
  static get observedAttributes() {
    return ['href', 'target', 'rel', 'text', 'data-classes'];
  }

  private ensureAnchor(): HTMLAnchorElement {
    let a = this.querySelector('a');
    if (!a) {
      a = document.createElement('a');
      this.appendChild(a);
    }
    return a as HTMLAnchorElement;
  }

  private render() {
    const a = this.ensureAnchor();

    const href = this.getAttribute('href') ?? '#';
    a.setAttribute('href', href);

    const target = this.getAttribute('target') ?? '_self';
    a.setAttribute('target', target);

    const relAttr = this.getAttribute('rel');
    if (target === '_blank') {
      a.setAttribute('rel', relAttr ?? 'noopener noreferrer');
    } else if (relAttr) {
      a.setAttribute('rel', relAttr);
    } else {
      a.removeAttribute('rel');
    }

    a.textContent = this.getAttribute('text') ?? this.textContent ?? '';

    // Apply classes to inner <a> so existing CSS continues to work
    const classes = (this.getAttribute('data-classes') ?? '').trim();
    if (classes.length) a.className = classes;
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }
}

// Define the custom element once
if (!customElements.get('app-link')) {
  customElements.define('app-link', AppLink);
}

export type { AppLink };

export function createLink(
  text: string,
  href: string, options: LinkOptions = {}): HTMLElement {
  const el = document.createElement('app-link') as AppLink;
  el.setAttribute('href', href);
  el.setAttribute('text', text);
  if (options.target) el.setAttribute('target', options.target);
  if (options.rel) el.setAttribute('rel', options.rel);
  if (options.classes?.length) el.setAttribute('data-classes', options.classes.join(' '));
  return el as unknown as HTMLElement;
}

/**
 * Atom: TemperatureValue as Web Component <temp-value>
 * Renders a temperature value in Celsius with proper semantics in light DOM.
 */
class TempValue extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'unit'];
  }

  connectedCallback() {
    // Keep class for existing CSS selectors
    this.classList.add('temp-value');
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private parseValue(): number | null {
    const attr = this.getAttribute('value');
    if (attr == null || attr === '') return null;
    const n = Number(attr);
    return Number.isFinite(n) ? n : null;
  }

  private render() {
    const unit = this.getAttribute('unit') ?? '°C';
    const value = this.parseValue();

    this.setAttribute('role', 'text');
    if (value == null || !isFinite(value)) {
      this.textContent = '—';
      this.setAttribute('aria-label', 'sem dados');
      this.removeAttribute('data-value');
    } else {
      const rounded = Math.round(value * 10) / 10;
      this.textContent = `${rounded} ${unit}`;
      this.setAttribute('data-value', String(rounded));
      this.setAttribute('aria-label', `${rounded} ${unit}`);
    }
  }
}

if (!customElements.get('temp-value')) {
  customElements.define('temp-value', TempValue);
}

export type { TempValue };

export function createTemperatureValue(value: number | null, unit: string = '°C'): HTMLElement {
  const el = document.createElement('temp-value') as TempValue;
  if (value != null && isFinite(value)) el.setAttribute('value', String(value));
  else el.setAttribute('value', '');
  if (unit && unit !== '°C') el.setAttribute('unit', unit);
  return el as unknown as HTMLElement;
}

export function updateTemperatureValue(el: HTMLElement, value: number | null, unit: string = '°C') {
  // If it's our custom element, update via attributes; otherwise fallback to text update
  if (el instanceof HTMLElement && el.tagName.toLowerCase() === 'temp-value') {
    if (value != null && isFinite(value)) el.setAttribute('value', String(value));
    else el.setAttribute('value', '');
    if (unit && unit !== '°C') el.setAttribute('unit', unit);
    else el.removeAttribute('unit');
    return;
  }

  el.setAttribute('role', 'text');
  if (value == null || !isFinite(value)) {
    el.textContent = '—';
    el.setAttribute('aria-label', 'sem dados');
    el.removeAttribute('data-value');
  } else {
    const rounded = Math.round(value * 10) / 10;
    el.textContent = `${rounded} ${unit}`;
    el.setAttribute('data-value', String(rounded));
    el.setAttribute('aria-label', `${rounded} ${unit}`);
  }
}

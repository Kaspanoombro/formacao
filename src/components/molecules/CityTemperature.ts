import { createTemperatureValue, updateTemperatureValue } from '../atoms/TemperatureValue';

/**
 * Molecule: CityTemperature as Web Component <city-temp>
 * Shows a city name alongside its current temperature value.
 */
export interface CityTemperatureRefs {
  root: HTMLElement;
  valueEl: HTMLElement;
}

class CityTemp extends HTMLElement {
  static get observedAttributes() {
    return ['city', 'value'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    // Build light DOM content
    this.classList.add('city-temp');
    this.innerHTML = '';

    const nameEl = document.createElement('div');
    nameEl.className = 'city-temp__name';
    nameEl.textContent = this.getAttribute('city') ?? '';

    const valueEl = createTemperatureValue(this.parseValue());
    valueEl.classList.add('city-temp__value');

    this.appendChild(nameEl);
    this.appendChild(valueEl);
  }

  private parseValue(): number | null {
    const attr = this.getAttribute('value');
    if (attr == null || attr === '') return null;
    const n = Number(attr);
    return Number.isFinite(n) ? n : null;
  }
}

if (!customElements.get('city-temp')) {
  customElements.define('city-temp', CityTemp);
}

export function createCityTemperature(
  city: string,
  temperature: number | null = null,
): CityTemperatureRefs {
  const el = document.createElement('city-temp') as CityTemp;
  el.setAttribute('city', city);
  if (temperature != null && isFinite(temperature)) el.setAttribute('value', String(temperature));
  else el.setAttribute('value', '');
  // Return refs compatible with previous API
  // The value element will be created on connect; for tests (synchronous), ensure it exists now
  // by triggering a render if not connected yet
  if ('connectedCallback' in el && typeof el.connectedCallback === 'function') {
    el.connectedCallback();
  }
  const valueEl =
    (el.querySelector('.city-temp__value') as HTMLElement) ?? createTemperatureValue(null);
  if (!el.contains(valueEl)) el.appendChild(valueEl);
  return { root: el as unknown as HTMLElement, valueEl };
}

export function updateCityTemperature(refs: CityTemperatureRefs, temperature: number | null) {
  // If using the custom element, set attribute; otherwise update inner atom
  if (refs.root.tagName.toLowerCase() === 'city-temp') {
    if (temperature != null && isFinite(temperature))
      refs.root.setAttribute('value', String(temperature));
    else refs.root.setAttribute('value', '');
    const inner = refs.root.querySelector('.city-temp__value') as HTMLElement | null;
    if (inner) updateTemperatureValue(inner, temperature);
    return;
  }
  updateTemperatureValue(refs.valueEl, temperature);
}

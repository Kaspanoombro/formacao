import { createTemperatureValue, updateTemperatureValue } from '../../atoms/TemperatureValue/TemperatureValue.ts';

/**
 * Reference object for accessing CityTemperature component elements
 * Provides handles to the root element and internal temperature value element
 * for external manipulation and updates
 * 
 * @interface CityTemperatureRefs
 */
export interface CityTemperatureRefs {
  /** The root HTML element of the city temperature component */
  root: HTMLElement;
  /** The internal temperature value display element */
  valueEl: HTMLElement;
}

/**
 * Custom web component that displays a city name alongside its temperature value
 * Extends HTMLElement to provide a molecule-level component for showing
 * city temperature data with automatic attribute observation and rendering
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <city-temp city="Lisboa" value="22.5"></city-temp>
 * 
 * <!-- Without temperature data -->
 * <city-temp city="Porto"></city-temp>
 * ```
 * 
 * @example
 * ```javascript
 * const cityTemp = document.createElement('city-temp');
 * cityTemp.setAttribute('city', 'Coimbra');
 * cityTemp.setAttribute('value', '18.3');
 * document.body.appendChild(cityTemp);
 * ```
 */
class CityTemp extends HTMLElement {
  /**
   * Defines which attributes should trigger attributeChangedCallback when modified
   * @returns Array of attribute names to observe ('city', 'value')
   */
  static get observedAttributes() {
    return ['city', 'value'];
  }

  /**
   * Lifecycle method called when the element is connected to the DOM
   * Triggers initial rendering of the component
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Lifecycle method called when observed attributes change
   * Triggers re-rendering to reflect the new attribute values
   */
  attributeChangedCallback() {
    this.render();
  }

  /**
   * Renders the component's HTML structure with city name and temperature value
   * Creates the DOM elements for displaying the city name and temperature,
   * clearing any previous content and rebuilding from current attributes
   * @private
   */
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

  /**
   * Parses the 'value' attribute to extract a valid temperature number
   * Converts string attribute to number, returning null for invalid values
   * @returns The temperature as a number or null if invalid/missing
   * @private
   */
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

/**
 * Factory function to create a CityTemperature component instance
 * Creates and configures a city-temp custom element with the specified
 * city name and optional temperature value
 * 
 * @param city - The name of the city to display
 * @param temperature - The temperature value in Celsius (null for no data)
 * @returns Reference object containing handles to the component elements
 * 
 * @example
 * ```javascript
 * import { createCityTemperature } from './CityTemperature.ts';
 * 
 * // Create with temperature data
 * const refs = createCityTemperature('Lisboa', 22.5);
 * document.body.appendChild(refs.root);
 * 
 * // Create without temperature data
 * const refs2 = createCityTemperature('Porto', null);
 * document.body.appendChild(refs2.root);
 * ```
 */
export function createCityTemperature(
  city: string,
  temperature: number | null = null,
): CityTemperatureRefs {
  const el = document.createElement('city-temp') as CityTemp;
  el.setAttribute('city', city);
  if (temperature != null && isFinite(temperature)) el.setAttribute('value', String(temperature));
  else el.setAttribute('value', '');
  // Return refs compatible with previous API
  // The value element will be created on connecting; for tests (synchronous), ensure it exists now
  // by triggering a render if not connected yet
  if ('connectedCallback' in el && typeof el.connectedCallback === 'function') {
    el.connectedCallback();
  }
  const valueEl =
    (el.querySelector('.city-temp__value') as HTMLElement) ?? createTemperatureValue(null);
  if (!el.contains(valueEl)) el.appendChild(valueEl);
  return { root: el as unknown as HTMLElement, valueEl };
}

/**
 * Updates the temperature value displayed in a CityTemperature component
 * Modifies the temperature display while preserving the city name,
 * handling both custom element and direct element approaches
 * 
 * @param refs - Reference object from createCityTemperature
 * @param temperature - The new temperature value in Celsius (null for no data)
 * 
 * @example
 * ```javascript
 * import { createCityTemperature, updateCityTemperature } from './CityTemperature.ts';
 * 
 * const refs = createCityTemperature('Coimbra', null);
 * document.body.appendChild(refs.root);
 * 
 * // Update with new temperature data
 * updateCityTemperature(refs, 18.3);
 * 
 * // Clear temperature data
 * updateCityTemperature(refs, null);
 * ```
 */
export function updateCityTemperature(refs: CityTemperatureRefs, temperature: number | null) {
  // If using the custom element, set an attribute; otherwise update inner atom
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

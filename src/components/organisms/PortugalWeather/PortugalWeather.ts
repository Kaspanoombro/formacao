import { createCityTemperature, updateCityTemperature } from '../../molecules/CityTemperature/CityTemperature.ts';
import { fetchCurrentTemps, type CityName } from '../../../services/ipma.service.ts';

/**
 * Factory function to create a PortugalWeather web component instance
 * Creates and returns a custom element that displays current temperatures
 * for Portuguese cities (Lisboa, Porto, Coimbra) using IPMA weather data
 * 
 * @returns A custom HTML element instance of the pt-weather component
 * 
 * @example
 * ```javascript
 * import { createPortugalWeather } from './PortugalWeather.ts';
 * 
 * // Create and append to DOM
 * const weatherWidget = createPortugalWeather();
 * document.body.appendChild(weatherWidget);
 * 
 * // The component will automatically load and display temperature data
 * ```
 */
export function createPortugalWeather(): HTMLElement {
  // Backward compatibility: return the custom element instance
  return document.createElement('pt-weather');
}

/**
 * Custom web component that displays current weather temperatures for Portuguese cities
 * Extends HTMLElement to provide a weather widget that fetches and displays
 * real-time temperature data from IPMA for Lisboa, Porto, and Coimbra
 * 
 * @example
 * ```html
 * <!-- Use directly in HTML -->
 * <pt-weather></pt-weather>
 * ```
 * 
 * @example
 * ```javascript
 * // Create programmatically
 * const weather = document.createElement('pt-weather');
 * document.body.appendChild(weather);
 * ```
 */
class PtWeather extends HTMLElement {
  /** The status display element showing loading/update information */
  private statusEl!: HTMLElement;
  /** Array of supported Portuguese cities */
  private cities: CityName[] = ['Lisboa', 'Porto', 'Coimbra'];
  /** Map storing references to city temperature components */
  private cityRefs = new Map<CityName, ReturnType<typeof createCityTemperature>>();

  /**
   * Lifecycle method called when the element is connected to the DOM
   * Initializes the component by rendering the UI and fetching initial data
   */
  connectedCallback() {
    this.render();
    this.refresh().then(() => {});
  }

  /**
   * Renders the component's HTML structure and creates city temperature components
   * Creates the main weather widget layout with title, status, and city temperature list
   * @private
   */
  private render() {
    const section = document.createElement('section');
    section.className = 'weather-pt';

    const title = document.createElement('h2');
    title.className = 'weather-pt__title';
    title.textContent = 'Current temperature (IPMA)';

    this.statusEl = document.createElement('div');
    this.statusEl.className = 'weather-pt__status';
    this.statusEl.textContent = 'Loading…';

    const list = document.createElement('div');
    list.className = 'weather-pt__list';

    this.cityRefs.clear();
    for (const city of this.cities) {
      const refs = createCityTemperature(city, null);
      this.cityRefs.set(city, refs);
      list.appendChild(refs.root);
    }

    section.appendChild(title);
    section.appendChild(this.statusEl);
    section.appendChild(list);

    this.replaceChildren(section);
  }

  /**
   * Fetches fresh temperature data from IPMA and updates the display
   * Retrieves current temperatures for all supported cities and updates
   * the corresponding city temperature components with the new data
   * 
   * @returns Promise that resolves when the refresh is complete
   * 
   * @example
   * ```javascript
   * const weatherWidget = document.querySelector('pt-weather');
   * await weatherWidget.refresh(); // Manually refresh data
   * ```
   */
  async refresh() {
    try {
      const data = await fetchCurrentTemps(this.cities);
      let any = false;
      for (const city of this.cities) {
        const t = data[city]?.temperature ?? null;
        const refs = this.cityRefs.get(city)!;
        updateCityTemperature(refs, t);
        if (t != null && isFinite(t)) any = true;
      }
      this.statusEl.textContent = any ? 'Updated now' : 'No data available';
    } catch {
      // IPMA fetch failed - silent handling for production
      this.statusEl.textContent = 'Failed to fetch data';
    }
  }
}

if (!customElements.get('pt-weather')) {
  customElements.define('pt-weather', PtWeather);
}

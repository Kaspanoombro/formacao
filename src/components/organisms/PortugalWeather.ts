import { createCityTemperature, updateCityTemperature } from '../molecules/CityTemperature';
import { fetchCurrentTemps, type CityName } from '../../services/ipma.service';

/**
 * Organism: PortugalWeather as Web Component <pt-weather>
 * Displays current temperatures for Lisboa, Porto and Coimbra using IPMA data.
 */
export function createPortugalWeather(): HTMLElement {
  // Backwards compatibility: return the custom element instance
  return document.createElement('pt-weather');
}

class PtWeather extends HTMLElement {
  private statusEl!: HTMLElement;
  private cities: CityName[] = ['Lisboa', 'Porto', 'Coimbra'];
  private cityRefs = new Map<CityName, ReturnType<typeof createCityTemperature>>();

  connectedCallback() {
    this.render();
    this.refresh();
  }

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

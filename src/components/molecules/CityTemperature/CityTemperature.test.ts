import { describe, it, expect } from 'vitest';
import { createCityTemperature, updateCityTemperature } from './CityTemperature.ts';

describe('Molecule: CityTemperature', () => {
  it('renders city name and placeholder', () => {
    const refs = createCityTemperature('Lisboa', null);
    expect(refs.root.querySelector('.city-temp__name')?.textContent).toBe('Lisboa');
    expect(refs.root.querySelector('.city-temp__value')?.textContent).toBe('—');
  });

  it('updates value', () => {
    const refs = createCityTemperature('Porto', null);
    updateCityTemperature(refs, 19.9);
    expect(refs.root.querySelector('.city-temp__value')?.textContent).toBe('19.9 °C');
  });
});

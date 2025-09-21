import { describe, it, expect } from 'vitest';
import { createTemperatureValue, updateTemperatureValue } from './TemperatureValue';

describe('Atom: TemperatureValue', () => {
  it('renders dash when value is null', () => {
    const el = createTemperatureValue(null);
    expect(el.textContent).toBe('—');
    expect(el.getAttribute('aria-label')).toBe('sem dados');
  });

  it('renders value with unit and updates correctly', () => {
    const el = createTemperatureValue(20);
    expect(el.textContent).toContain('°C');

    updateTemperatureValue(el, 21.234);
    expect(el.textContent).toBe('21.2 °C');
    expect(el.getAttribute('data-value')).toBe('21.2');
  });
});

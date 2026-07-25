import { beforeEach, describe, expect, it } from 'vitest';
import { registerCustomElements } from './index.ts';
import type { RangeSlider } from './range-slider.ts';

describe('<range-slider>', () => {
  beforeEach(() => {
    registerCustomElements();
    document.body.innerHTML = '';
  });

  it('uses default values when attributes are missing', () => {
    const el = document.createElement('range-slider') as RangeSlider;
    document.body.appendChild(el);

    expect(el.value).toBe(0);
  });

  it('supports custom value setter and attribute rendering', () => {
    const el = document.createElement('range-slider') as RangeSlider;
    el.setAttribute('label-key', 'hydration');
    el.setAttribute('unit', '%');
    el.setAttribute('target-id', 'testSlider');
    el.setAttribute('val-id', 'testValDisplay');
    el.setAttribute('min', '50');
    el.setAttribute('max', '80');
    el.setAttribute('step', '1');
    el.value = 65;

    document.body.appendChild(el);

    const input = el.querySelector('#testSlider') as HTMLInputElement;
    const valDisplay = el.querySelector('#testValDisplay');
    const label = el.querySelector('label');

    expect(input).not.toBeNull();
    expect(input.value).toBe('65');
    expect(valDisplay?.textContent).toBe('65');
    expect(label?.getAttribute('data-i18n')).toBe('hydration');
  });

  it('updates display and emits slider-input event on input', () => {
    const el = document.createElement('range-slider') as RangeSlider;
    el.setAttribute('value', '65');
    el.setAttribute('min', '50');
    el.setAttribute('max', '80');
    el.setAttribute('unit', '%');
    document.body.appendChild(el);

    const valDisplay = el.querySelector('strong');
    expect(valDisplay?.textContent).toBe('65');

    let emittedVal = 0;
    el.addEventListener('slider-input', (e: Event) => {
      emittedVal = (e as CustomEvent).detail.value;
    });

    const input = el.querySelector('input') as HTMLInputElement;
    input.value = '70';
    input.dispatchEvent(new Event('input'));

    expect(emittedVal).toBe(70);
    expect(valDisplay?.textContent).toBe('70');
  });

  it('re-renders on setAttribute when value changes', () => {
    const el = document.createElement('range-slider') as RangeSlider;
    document.body.appendChild(el);

    el.setAttribute('value', '25');
    expect(el.value).toBe(25);
    const valDisplay = el.querySelector('strong');
    expect(valDisplay?.textContent).toBe('25');
  });
});

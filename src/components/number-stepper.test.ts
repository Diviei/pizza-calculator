import { beforeEach, describe, expect, it } from 'vitest';
import { registerCustomElements } from './index.ts';
import type { NumberStepper } from './number-stepper.ts';

describe('<number-stepper>', () => {
  beforeEach(() => {
    registerCustomElements();
    document.body.innerHTML = '';
  });

  it('uses default property values when attributes are missing', () => {
    const el = document.createElement('number-stepper') as NumberStepper;
    document.body.appendChild(el);

    expect(el.value).toBe(1);
    expect(el.min).toBe(1);
    expect(el.max).toBe(100);
    expect(el.actionStep).toBe(1);
  });

  it('supports custom value setter and target-id attribute', () => {
    const el = document.createElement('number-stepper') as NumberStepper;
    el.setAttribute('target-id', 'testInput');
    el.value = 5;
    document.body.appendChild(el);

    expect(el.value).toBe(5);
    const input = el.querySelector('#testInput') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe('5');
  });

  it('increments and decrements with actionStep and clamps to boundaries', () => {
    const el = document.createElement('number-stepper') as NumberStepper;
    el.setAttribute('value', '5');
    el.setAttribute('min', '2');
    el.setAttribute('max', '8');
    el.setAttribute('action-step', '2');
    document.body.appendChild(el);

    const emitted: number[] = [];
    el.addEventListener('stepper-change', (e: Event) => {
      emitted.push((e as CustomEvent).detail.value);
    });

    const incBtn = el.querySelector('.btn-increment') as HTMLButtonElement;
    const decBtn = el.querySelector('.btn-decrement') as HTMLButtonElement;

    // 5 + 2 = 7
    incBtn.click();
    expect(el.value).toBe(7);

    // 7 + 2 = 9 -> clamped to max 8
    incBtn.click();
    expect(el.value).toBe(8);

    // 8 - 2 = 6
    decBtn.click();
    expect(el.value).toBe(6);

    // 6 - 2 = 4
    decBtn.click();
    expect(el.value).toBe(4);

    // 4 - 2 = 2
    decBtn.click();
    expect(el.value).toBe(2);

    // 2 - 2 = 0 -> clamped to min 2
    decBtn.click();
    expect(el.value).toBe(2);

    expect(emitted).toEqual([7, 8, 6, 4, 2, 2]);
  });

  it('handles input events on internal number input', () => {
    const el = document.createElement('number-stepper') as NumberStepper;
    el.setAttribute('value', '3');
    el.setAttribute('min', '1');
    document.body.appendChild(el);

    let lastVal = 0;
    el.addEventListener('stepper-change', (e: Event) => {
      lastVal = (e as CustomEvent).detail.value;
    });

    const input = el.querySelector('input') as HTMLInputElement;

    // Type 6
    input.value = '6';
    input.dispatchEvent(new Event('input'));
    expect(lastVal).toBe(6);
    expect(el.value).toBe(6);

    // Type empty string / invalid input -> falls back to min (1)
    input.value = '';
    input.dispatchEvent(new Event('input'));
    expect(lastVal).toBe(1);
    expect(el.value).toBe(1);
  });

  it('updates DOM in-place on setAttribute when value, min, max, step changes', () => {
    const el = document.createElement('number-stepper') as NumberStepper;
    document.body.appendChild(el);

    el.setAttribute('value', '10');
    expect(el.value).toBe(10);
    const input = el.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('10');

    el.setAttribute('min', '5');
    el.setAttribute('max', '50');
    el.setAttribute('step', '2');
    expect(input.min).toBe('5');
    expect(input.max).toBe('50');
    expect(input.step).toBe('2');
  });
});

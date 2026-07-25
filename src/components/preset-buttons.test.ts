import { beforeEach, describe, expect, it } from 'vitest';
import { registerCustomElements } from './index.ts';
import type { PresetButtons } from './preset-buttons.ts';

describe('<preset-buttons>', () => {
  beforeEach(() => {
    registerCustomElements();
    document.body.innerHTML = '';
  });

  it('uses default value of 8 when attribute is missing', () => {
    const el = document.createElement('preset-buttons') as PresetButtons;
    document.body.appendChild(el);

    expect(el.value).toBe(8);
    const activeBtn = el.querySelector('.preset-btn.active') as HTMLButtonElement;
    expect(activeBtn?.getAttribute('data-hours')).toBe('8');
  });

  it('highlights the active preset matching value setter', () => {
    const el = document.createElement('preset-buttons') as PresetButtons;
    el.value = 24;
    document.body.appendChild(el);

    expect(el.value).toBe(24);
    const activeBtn = el.querySelector('.preset-btn.active') as HTMLButtonElement;
    expect(activeBtn?.getAttribute('data-hours')).toBe('24');
  });

  it('emits preset-select event and updates active class when preset button is clicked', () => {
    const el = document.createElement('preset-buttons') as PresetButtons;
    el.setAttribute('value', '4');
    document.body.appendChild(el);

    const emitted: number[] = [];
    el.addEventListener('preset-select', (e: Event) => {
      emitted.push((e as CustomEvent).detail.hours);
    });

    const btn48 = el.querySelector('.preset-btn[data-hours="48"]') as HTMLButtonElement;
    const btn8 = el.querySelector('.preset-btn[data-hours="8"]') as HTMLButtonElement;

    btn48.click();
    expect(el.value).toBe(48);

    btn8.click();
    expect(el.value).toBe(8);

    expect(emitted).toEqual([48, 8]);
  });

  it('re-renders on setAttribute when value changes', () => {
    const el = document.createElement('preset-buttons') as PresetButtons;
    document.body.appendChild(el);

    el.setAttribute('value', '48');
    expect(el.value).toBe(48);
    const activeBtn = el.querySelector('.preset-btn.active') as HTMLButtonElement;
    expect(activeBtn?.getAttribute('data-hours')).toBe('48');
  });
});

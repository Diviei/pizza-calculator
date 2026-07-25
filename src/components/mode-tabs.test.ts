import { beforeEach, describe, expect, it } from 'vitest';
import { registerCustomElements } from './index.ts';
import type { PizzaModeTabs } from './mode-tabs.ts';

describe('<pizza-mode-tabs>', () => {
  beforeEach(() => {
    registerCustomElements();
    document.body.innerHTML = '';
  });

  it('renders simple tab as active by default', () => {
    const el = document.createElement('pizza-mode-tabs') as PizzaModeTabs;
    document.body.appendChild(el);

    expect(el.activeMode).toBe('simple');
    const tabSimple = el.querySelector('#tabSimple');
    const tabAdvanced = el.querySelector('#tabAdvanced');

    expect(tabSimple?.classList.contains('active')).toBe(true);
    expect(tabAdvanced?.classList.contains('active')).toBe(false);
  });

  it('supports activeMode getter and setter', () => {
    const el = document.createElement('pizza-mode-tabs') as PizzaModeTabs;
    document.body.appendChild(el);

    el.activeMode = 'advanced';
    expect(el.getAttribute('active-mode')).toBe('advanced');
    expect(el.activeMode).toBe('advanced');
  });

  it('emits mode-change when clicking simple and advanced tabs', () => {
    const el = document.createElement('pizza-mode-tabs') as PizzaModeTabs;
    document.body.appendChild(el);

    const emitted: string[] = [];
    el.addEventListener('mode-change', (e: Event) => {
      emitted.push((e as CustomEvent).detail.mode);
    });

    const tabAdvanced = el.querySelector('#tabAdvanced') as HTMLButtonElement;
    const tabSimple = el.querySelector('#tabSimple') as HTMLButtonElement;

    tabAdvanced.click();
    expect(emitted).toEqual(['advanced']);

    tabSimple.click();
    expect(emitted).toEqual(['advanced', 'simple']);
  });

  it('re-renders on setAttribute when active-mode changes', () => {
    const el = document.createElement('pizza-mode-tabs') as PizzaModeTabs;
    document.body.appendChild(el);

    el.setAttribute('active-mode', 'advanced');
    expect(el.activeMode).toBe('advanced');
    const tabAdvanced = el.querySelector('#tabAdvanced');
    expect(tabAdvanced?.classList.contains('active')).toBe(true);
  });
});

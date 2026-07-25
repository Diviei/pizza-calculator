import { beforeEach, describe, expect, it } from 'vitest';
import { registerCustomElements } from './index.ts';
import type { PizzaStyleSelector } from './pizza-style-selector.ts';

describe('<pizza-style-selector>', () => {
  beforeEach(() => {
    registerCustomElements();
    document.body.innerHTML = '';
  });

  it('renders neapolitan style as active by default', () => {
    const el = document.createElement('pizza-style-selector') as PizzaStyleSelector;
    document.body.appendChild(el);

    expect(el.activeStyle).toBe('neapolitan');
    const btnNeapolitan = el.querySelector('#styleNeapolitanBtn');
    const btnTondaRomana = el.querySelector('#styleTondaRomanaBtn');

    expect(btnNeapolitan?.classList.contains('active')).toBe(true);
    expect(btnTondaRomana?.classList.contains('active')).toBe(false);
  });

  it('supports activeStyle getter and setter', () => {
    const el = document.createElement('pizza-style-selector') as PizzaStyleSelector;
    document.body.appendChild(el);

    el.activeStyle = 'tonda_romana';
    expect(el.getAttribute('active-style')).toBe('tonda_romana');
    expect(el.activeStyle).toBe('tonda_romana');
  });

  it('emits style-change event when clicking style cards', () => {
    const el = document.createElement('pizza-style-selector') as PizzaStyleSelector;
    document.body.appendChild(el);

    const emitted: string[] = [];
    el.addEventListener('style-change', (e: Event) => {
      emitted.push((e as CustomEvent).detail.style);
    });

    const btnTondaRomana = el.querySelector('#styleTondaRomanaBtn') as HTMLButtonElement;
    const btnNeapolitan = el.querySelector('#styleNeapolitanBtn') as HTMLButtonElement;

    btnTondaRomana.click();
    expect(emitted).toEqual(['tonda_romana']);

    btnNeapolitan.click();
    expect(emitted).toEqual(['tonda_romana', 'neapolitan']);
  });

  it('updates DOM classes when active-style attribute changes', () => {
    const el = document.createElement('pizza-style-selector') as PizzaStyleSelector;
    document.body.appendChild(el);

    el.setAttribute('active-style', 'tonda_romana');
    expect(el.activeStyle).toBe('tonda_romana');
    const btnTondaRomana = el.querySelector('#styleTondaRomanaBtn');
    expect(btnTondaRomana?.classList.contains('active')).toBe(true);
  });
});

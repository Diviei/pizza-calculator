import { beforeEach, describe, expect, it } from 'vitest';
import { registerCustomElements } from './index.ts';
import type { IngredientCard } from './ingredient-card.ts';

describe('<ingredient-card>', () => {
  beforeEach(() => {
    registerCustomElements();
    document.body.innerHTML = '';
  });

  it('renders simple card format with icon and title-key', () => {
    const el = document.createElement('ingredient-card') as IngredientCard;
    el.setAttribute('simple', '');
    el.setAttribute('icon', 'flour');
    el.setAttribute('title-key', 'flour');
    el.setAttribute('value', '650.0');
    el.setAttribute('unit', 'g');
    el.setAttribute('card-class', 'ingredient-flour');
    el.setAttribute('res-id', 'simpleFlourRes');
    el.setAttribute('title-id', 'simpleFlourTitle');

    document.body.appendChild(el);

    const icon = el.querySelector('.simple-card-icon svg');
    const title = el.querySelector('#simpleFlourTitle');
    const val = el.querySelector('#simpleFlourRes');

    expect(icon).not.toBeNull();
    expect(title?.getAttribute('data-i18n')).toBe('flour');
    expect(val?.textContent).toBe('650.0');
  });

  it('renders simple card format without icon', () => {
    const el = document.createElement('ingredient-card') as IngredientCard;
    el.setAttribute('simple', '');
    el.setAttribute('value', '10.0');

    document.body.appendChild(el);

    const icon = el.querySelector('.simple-card-icon');
    expect(icon).toBeNull();
  });

  it('renders advanced card format with baker percentage', () => {
    const el = document.createElement('ingredient-card') as IngredientCard;
    el.setAttribute('title-key', 'water');
    el.setAttribute('value', '420.0');
    el.setAttribute('unit', 'g');
    el.setAttribute('baker-pct', '65%');
    el.setAttribute('res-id', 'waterRes');
    el.setAttribute('pct-id', 'waterPctDisplay');

    document.body.appendChild(el);

    const title = el.querySelector('.ingredient-name');
    const val = el.querySelector('#waterRes');
    const pct = el.querySelector('#waterPctDisplay');

    expect(title?.getAttribute('data-i18n')).toBe('water');
    expect(val?.textContent).toBe('420.0');
    expect(pct?.textContent).toBe('65%');
  });

  it('renders advanced card format without baker percentage', () => {
    const el = document.createElement('ingredient-card') as IngredientCard;
    el.setAttribute('value', '100.0');
    document.body.appendChild(el);

    const pct = el.querySelector('.baker-pct');
    expect(pct).toBeNull();
  });

  it('updates DOM in-place on setAttribute when value, baker-pct, or icon changes', () => {
    const el = document.createElement('ingredient-card') as IngredientCard;
    el.setAttribute('simple', '');
    el.setAttribute('icon', 'flour');
    el.setAttribute('value', '10.0');
    document.body.appendChild(el);

    el.setAttribute('value', '50.0');
    const val = el.querySelector('.simple-card-value span');
    expect(val?.textContent).toBe('50.0');

    el.setAttribute('icon', 'water');
    const iconSvg = el.querySelector('.simple-card-icon svg');
    expect(iconSvg).not.toBeNull();

    const advEl = document.createElement('ingredient-card') as IngredientCard;
    advEl.setAttribute('baker-pct', '65%');
    document.body.appendChild(advEl);

    advEl.setAttribute('baker-pct', '70%');
    const pct = advEl.querySelector('.baker-pct');
    expect(pct?.textContent).toBe('70%');
  });
});

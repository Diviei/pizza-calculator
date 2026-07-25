/**
 * Custom Elements Registration Barrel Module
 */

import { IngredientCard } from './ingredient-card.ts';
import { PizzaModeTabs } from './mode-tabs.ts';
import { PizzaStyleSelector } from './pizza-style-selector.ts';
import { NumberStepper } from './number-stepper.ts';
import { PresetButtons } from './preset-buttons.ts';
import { RangeSlider } from './range-slider.ts';

export { IngredientCard, NumberStepper, PizzaModeTabs, PizzaStyleSelector, PresetButtons, RangeSlider };

export function registerCustomElements(): void {
  if (!customElements.get('pizza-mode-tabs')) {
    customElements.define('pizza-mode-tabs', PizzaModeTabs);
  }
  if (!customElements.get('pizza-style-selector')) {
    customElements.define('pizza-style-selector', PizzaStyleSelector);
  }
  if (!customElements.get('number-stepper')) {
    customElements.define('number-stepper', NumberStepper);
  }
  if (!customElements.get('range-slider')) {
    customElements.define('range-slider', RangeSlider);
  }
  if (!customElements.get('preset-buttons')) {
    customElements.define('preset-buttons', PresetButtons);
  }
  if (!customElements.get('ingredient-card')) {
    customElements.define('ingredient-card', IngredientCard);
  }
}


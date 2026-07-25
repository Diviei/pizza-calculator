import { describe, expect, it } from 'vitest';
import { registerCustomElements } from './index.ts';

describe('Custom Elements Registration (index.ts)', () => {
  it('registers all 5 custom elements once and handles re-registration gracefully', () => {
    registerCustomElements();

    expect(customElements.get('pizza-mode-tabs')).toBeDefined();
    expect(customElements.get('number-stepper')).toBeDefined();
    expect(customElements.get('range-slider')).toBeDefined();
    expect(customElements.get('preset-buttons')).toBeDefined();
    expect(customElements.get('ingredient-card')).toBeDefined();

    // Calling again shouldn't throw error due to customElements.get guard
    expect(() => registerCustomElements()).not.toThrow();
  });
});

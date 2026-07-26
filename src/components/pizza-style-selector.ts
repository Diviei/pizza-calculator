/**
 * Web Component: <pizza-style-selector>
 * Selector for pizza styles (Neapolitan vs Tonda Romana)
 */

import type { PizzaStyle } from '../calculator.ts';

export class PizzaStyleSelector extends HTMLElement {
  static get observedAttributes() {
    return ['active-style'];
  }

  private isRendered = false;

  connectedCallback() {
    if (!this.isRendered) {
      this.render();
      this.isRendered = true;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue && this.isConnected) {
      if (!this.isRendered) {
        this.render();
        this.isRendered = true;
      } else {
        this.updateDOM(name, newValue as PizzaStyle);
      }
    }
  }

  get activeStyle(): PizzaStyle {
    return (this.getAttribute('active-style') as PizzaStyle) || 'neapolitan';
  }

  set activeStyle(style: PizzaStyle) {
    this.setAttribute('active-style', style);
  }

  private updateDOM(_name: string, newValue: PizzaStyle) {
    const isNeapolitan = newValue === 'neapolitan';
    const btnNeapolitan = this.querySelector('#styleNeapolitanBtn');
    const btnTondaRomana = this.querySelector('#styleTondaRomanaBtn');

    if (btnNeapolitan) {
      if (isNeapolitan) {
        btnNeapolitan.classList.add('active');
        btnNeapolitan.setAttribute('aria-checked', 'true');
      } else {
        btnNeapolitan.classList.remove('active');
        btnNeapolitan.setAttribute('aria-checked', 'false');
      }
    }

    if (btnTondaRomana) {
      if (!isNeapolitan) {
        btnTondaRomana.classList.add('active');
        btnTondaRomana.setAttribute('aria-checked', 'true');
      } else {
        btnTondaRomana.classList.remove('active');
        btnTondaRomana.setAttribute('aria-checked', 'false');
      }
    }
  }

  private render() {
    const isNeapolitan = this.activeStyle === 'neapolitan';

    this.innerHTML = `
      <div class="pizza-style-selector-container">
        <label class="style-selector-label" data-i18n="pizzaStyleLabel">Estilo de Pizza</label>
        <div class="pizza-style-grid" role="radiogroup" aria-label="Estilo de Pizza">
          <button type="button" id="styleNeapolitanBtn" class="pizza-style-card ${isNeapolitan ? 'active' : ''}" role="radio" aria-checked="${isNeapolitan}" data-style="neapolitan">
            <div class="style-card-header">
              <span class="style-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16Z"/><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/></svg>
              </span>
              <span class="style-title" data-i18n="styleNeapolitan">Napolitana</span>
            </div>
            <span class="style-desc" data-i18n="styleNeapolitanDesc">Masa esponjosa (Bola 280g • 65% Hidr.)</span>
          </button>
          
          <button type="button" id="styleTondaRomanaBtn" class="pizza-style-card ${!isNeapolitan ? 'active' : ''}" role="radio" aria-checked="${!isNeapolitan}" data-style="tonda_romana">
            <div class="style-card-header">
              <span class="style-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/></svg>
              </span>
              <span class="style-title" data-i18n="styleTondaRomana">Tonda Romana</span>
            </div>
            <span class="style-desc" data-i18n="styleTondaRomanaDesc">Fina y crujiente (Bola 180g • 57% Hidr.)</span>
          </button>
        </div>
      </div>
    `;

    const btnNeapolitan = this.querySelector('#styleNeapolitanBtn');
    const btnTondaRomana = this.querySelector('#styleTondaRomanaBtn');

    const handleSelect = (style: PizzaStyle) => {
      this.activeStyle = style;
      this.dispatchEvent(
        new CustomEvent('style-change', {
          detail: { style },
          bubbles: true,
          composed: true,
        }),
      );
    };

    btnNeapolitan?.addEventListener('click', () => handleSelect('neapolitan'));
    btnTondaRomana?.addEventListener('click', () => handleSelect('tonda_romana'));
  }
}

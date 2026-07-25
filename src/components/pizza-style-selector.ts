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
              <span class="style-icon">🍕</span>
              <span class="style-title" data-i18n="styleNeapolitan">Napolitana</span>
            </div>
            <span class="style-desc" data-i18n="styleNeapolitanDesc">Masa esponjosa (Bola 280g • 65% Hidr.)</span>
          </button>
          
          <button type="button" id="styleTondaRomanaBtn" class="pizza-style-card ${!isNeapolitan ? 'active' : ''}" role="radio" aria-checked="${!isNeapolitan}" data-style="tonda_romana">
            <div class="style-card-header">
              <span class="style-icon">🫓</span>
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

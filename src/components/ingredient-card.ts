/**
 * Web Component: <ingredient-card>
 * Reusable ingredient card for results grid in Simple & Advanced modes
 */

export class IngredientCard extends HTMLElement {
  static get observedAttributes() {
    return ['icon', 'title-key', 'value', 'unit', 'baker-pct', 'card-class', 'res-id', 'pct-id', 'title-id', 'simple'];
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
        this.updateDOM(name, newValue);
      }
    }
  }

  private updateDOM(name: string, newValue: string) {
    const resId = this.getAttribute('res-id') || '';
    const pctId = this.getAttribute('pct-id') || '';

    if (name === 'value') {
      const valEl = resId
        ? this.querySelector(`#${resId}`)
        : this.querySelector('.simple-card-value span, .ingredient-value span');
      if (valEl) valEl.textContent = newValue;
    } else if (name === 'baker-pct') {
      const pctEl = pctId ? this.querySelector(`#${pctId}`) : this.querySelector('.baker-pct');
      if (pctEl) pctEl.textContent = newValue;
    } else if (name === 'icon') {
      const iconEl = this.querySelector('.simple-card-icon');
      if (iconEl) iconEl.textContent = newValue;
    }
  }

  private render() {
    const icon = this.getAttribute('icon') || '';
    const titleKey = this.getAttribute('title-key') || '';
    const value = this.getAttribute('value') || '0.0';
    const unit = this.getAttribute('unit') || 'g';
    const bakerPct = this.getAttribute('baker-pct');
    const cardClass = this.getAttribute('card-class') || '';
    const resId = this.getAttribute('res-id') || '';
    const pctId = this.getAttribute('pct-id') || '';
    const titleId = this.getAttribute('title-id') || '';

    const isSimple = this.hasAttribute('simple');
    const existingTitleText = this.querySelector('[data-i18n]')?.textContent || '';

    if (isSimple) {
      this.innerHTML = `
        <div class="simple-card ${cardClass}">
          <div class="simple-card-header">
            ${icon ? `<span class="simple-card-icon">${icon}</span>` : ''}
            <span ${titleId ? `id="${titleId}"` : ''} class="simple-card-title" ${titleKey ? `data-i18n="${titleKey}"` : ''}>${existingTitleText}</span>
          </div>
          <div class="simple-card-value">
            <span ${resId ? `id="${resId}"` : ''}>${value}</span> <small>${unit}</small>
          </div>
        </div>
      `;
    } else {
      this.innerHTML = `
        <div class="result-card ${cardClass}">
          <span ${titleId ? `id="${titleId}"` : ''} class="ingredient-name" ${titleKey ? `data-i18n="${titleKey}"` : ''}>${existingTitleText}</span>
          <div class="ingredient-value">
            <span ${resId ? `id="${resId}"` : ''}>${value}</span> <small>${unit}</small>
          </div>
          ${bakerPct !== null ? `<span class="baker-pct" ${pctId ? `id="${pctId}"` : ''}>${bakerPct}</span>` : ''}
        </div>
      `;
    }
  }
}

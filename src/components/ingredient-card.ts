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

  private getSvgIcon(iconAttr: string): string {
    if (!iconAttr) return '';
    if (iconAttr.startsWith('<svg')) return iconAttr;

    // Lucide SVG mappings for ingredients
    switch (iconAttr) {
      case 'flour':
      case '🌾':
        return `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 12 2l10 20"/><path d="M12 2v20"/><path d="M6.5 13h11"/></svg>`;
      case 'water':
      case '💧':
        return `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`;
      case 'salt':
      case '🧂':
        return `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
      case 'yeast':
      case '🧫':
      case '🌱':
        return `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>`;
      default:
        return `<span class="simple-card-icon-text">${iconAttr}</span>`;
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

      const fillEl = this.querySelector<HTMLElement>('.baker-progress-fill');
      if (fillEl) {
        const numericVal = parseFloat(newValue.replace('%', '')) || 0;
        const widthVal =
          numericVal >= 100 ? '100%' : numericVal >= 40 ? `${numericVal}%` : `${Math.max(6, numericVal * 2.5)}%`;
        fillEl.style.width = widthVal;
      }
    } else if (name === 'icon') {
      const iconEl = this.querySelector('.simple-card-icon');
      if (iconEl) iconEl.innerHTML = this.getSvgIcon(newValue);
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
    const svgIconHtml = this.getSvgIcon(icon);

    if (isSimple) {
      const widthVal = cardClass.includes('flour')
        ? '100%'
        : cardClass.includes('water')
          ? '65%'
          : cardClass.includes('salt')
            ? '12%'
            : '8%';
      this.innerHTML = `
        <div class="simple-card ${cardClass}">
          <div class="simple-card-header">
            ${svgIconHtml ? `<span class="simple-card-icon">${svgIconHtml}</span>` : ''}
            <span ${titleId ? `id="${titleId}"` : ''} class="simple-card-title" ${titleKey ? `data-i18n="${titleKey}"` : ''}>${existingTitleText}</span>
          </div>
          <div class="simple-card-value">
            <span ${resId ? `id="${resId}"` : ''}>${value}</span> <small>${unit}</small>
          </div>
          <div class="baker-progress-bar"><div class="baker-progress-fill" style="width: ${widthVal}"></div></div>
        </div>
      `;
    } else {
      const pctStr = bakerPct || '100%';
      const numericVal = parseFloat(pctStr.replace('%', '')) || 0;
      const widthVal =
        numericVal >= 100 ? '100%' : numericVal >= 40 ? `${numericVal}%` : `${Math.max(6, numericVal * 2.5)}%`;
      this.innerHTML = `
        <div class="result-card ${cardClass}">
          <div class="result-card-header">
            <span ${titleId ? `id="${titleId}"` : ''} class="ingredient-name" ${titleKey ? `data-i18n="${titleKey}"` : ''}>${existingTitleText}</span>
            ${bakerPct !== null ? `<span class="baker-pct" ${pctId ? `id="${pctId}"` : ''}>${bakerPct}</span>` : ''}
          </div>
          <div class="ingredient-value">
            <span ${resId ? `id="${resId}"` : ''}>${value}</span> <small>${unit}</small>
          </div>
          <div class="baker-progress-bar"><div class="baker-progress-fill" style="width: ${widthVal}"></div></div>
        </div>
      `;
    }
  }
}

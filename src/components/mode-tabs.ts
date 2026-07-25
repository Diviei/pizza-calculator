/**
 * Web Component: <pizza-mode-tabs>
 */

export class PizzaModeTabs extends HTMLElement {
  static get observedAttributes() {
    return ['active-mode'];
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
        this.updateDOM(name, newValue as 'simple' | 'advanced');
      }
    }
  }

  get activeMode(): 'simple' | 'advanced' {
    return (this.getAttribute('active-mode') as 'simple' | 'advanced') || 'simple';
  }

  set activeMode(mode: 'simple' | 'advanced') {
    this.setAttribute('active-mode', mode);
  }

  private updateDOM(_name: string, newValue: 'simple' | 'advanced') {
    const isSimple = newValue === 'simple';
    const tabSimple = this.querySelector('#tabSimple');
    const tabAdvanced = this.querySelector('#tabAdvanced');

    if (tabSimple) {
      if (isSimple) {
        tabSimple.classList.add('active');
        tabSimple.setAttribute('aria-selected', 'true');
      } else {
        tabSimple.classList.remove('active');
        tabSimple.setAttribute('aria-selected', 'false');
      }
    }

    if (tabAdvanced) {
      if (!isSimple) {
        tabAdvanced.classList.add('active');
        tabAdvanced.setAttribute('aria-selected', 'true');
      } else {
        tabAdvanced.classList.remove('active');
        tabAdvanced.setAttribute('aria-selected', 'false');
      }
    }
  }

  private render() {
    const isSimple = this.activeMode === 'simple';
    const existingTabSimpleText = this.querySelector('#tabSimple')?.textContent || '';
    const existingTabAdvancedText = this.querySelector('#tabAdvanced')?.textContent || '';

    this.innerHTML = `
      <div class="mode-tabs-container" role="tablist" aria-label="Modos de la calculadora">
        <button type="button" id="tabSimple" class="mode-tab ${isSimple ? 'active' : ''}" role="tab" aria-selected="${isSimple}" data-i18n="modeSimple">${existingTabSimpleText}</button>
        <button type="button" id="tabAdvanced" class="mode-tab ${!isSimple ? 'active' : ''}" role="tab" aria-selected="${!isSimple}" data-i18n="modeAdvanced">${existingTabAdvancedText}</button>
      </div>
    `;

    const tabSimple = this.querySelector('#tabSimple');
    const tabAdvanced = this.querySelector('#tabAdvanced');

    tabSimple?.addEventListener('click', () => {
      this.activeMode = 'simple';
      this.dispatchEvent(new CustomEvent('mode-change', { detail: { mode: 'simple' }, bubbles: true, composed: true }));
    });

    tabAdvanced?.addEventListener('click', () => {
      this.activeMode = 'advanced';
      this.dispatchEvent(
        new CustomEvent('mode-change', { detail: { mode: 'advanced' }, bubbles: true, composed: true }),
      );
    });
  }
}

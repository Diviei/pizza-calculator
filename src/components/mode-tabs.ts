/**
 * Web Component: <pizza-mode-tabs>
 */

export class PizzaModeTabs extends HTMLElement {
  static get observedAttributes() {
    return ['active-mode'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  get activeMode(): 'simple' | 'advanced' {
    return (this.getAttribute('active-mode') as 'simple' | 'advanced') || 'simple';
  }

  set activeMode(mode: 'simple' | 'advanced') {
    this.setAttribute('active-mode', mode);
  }

  private render() {
    const isSimple = this.activeMode === 'simple';
    this.innerHTML = `
      <div class="mode-tabs-container" role="tablist" aria-label="Modos de la calculadora">
        <button type="button" id="tabSimple" class="mode-tab ${isSimple ? 'active' : ''}" role="tab" aria-selected="${isSimple}" data-i18n="modeSimple">⚡ Modo Simple</button>
        <button type="button" id="tabAdvanced" class="mode-tab ${!isSimple ? 'active' : ''}" role="tab" aria-selected="${!isSimple}" data-i18n="modeAdvanced">⚙️ Modo Avanzado</button>
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

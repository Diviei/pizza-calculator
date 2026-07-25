/**
 * Web Component: <preset-buttons>
 * Fermentation time quick preset buttons (4h, 8h, 24h, 48h)
 */

export class PresetButtons extends HTMLElement {
  static get observedAttributes() {
    return ['value'];
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

  get value(): number {
    return parseFloat(this.getAttribute('value') || '8');
  }

  set value(val: number) {
    this.setAttribute('value', val.toString());
  }

  private updateDOM(_name: string, newValue: string) {
    const activeHours = parseFloat(newValue);
    this.querySelectorAll('.preset-btn').forEach((btn) => {
      const btnHours = parseFloat(btn.getAttribute('data-hours') || '8');
      if (btnHours === activeHours) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  private render() {
    const activeHours = this.value;
    this.innerHTML = `
      <div class="preset-section">
        <span class="preset-label" data-i18n="presetLabel">Accesos rápidos:</span>
        <div class="preset-buttons">
          <button type="button" class="preset-btn ${activeHours === 4 ? 'active' : ''}" data-hours="4" data-i18n="preset4h">⚡ 4h (Rápida)</button>
          <button type="button" class="preset-btn ${activeHours === 8 ? 'active' : ''}" data-hours="8" data-i18n="preset8h">☀️ 8h (Mismo día)</button>
          <button type="button" class="preset-btn ${activeHours === 24 ? 'active' : ''}" data-hours="24" data-i18n="preset24h">🌙 24h (1 día nevera)</button>
          <button type="button" class="preset-btn ${activeHours === 48 ? 'active' : ''}" data-hours="48" data-i18n="preset48h">❄️ 48h (2 días nevera)</button>
        </div>
      </div>
    `;

    this.querySelectorAll('.preset-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const hours = parseFloat(btn.getAttribute('data-hours') || '8');
        this.value = hours;
        this.dispatchEvent(
          new CustomEvent('preset-select', {
            detail: { hours },
            bubbles: true,
            composed: true,
          }),
        );
      });
    });
  }
}

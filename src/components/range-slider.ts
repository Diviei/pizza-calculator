/**
 * Web Component: <range-slider>
 * Reusable slider component with value display and i18n label support
 */

export class RangeSlider extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'min', 'max', 'step', 'label-key', 'unit', 'target-id', 'val-id'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  get value(): number {
    return parseFloat(this.getAttribute('value') || '0');
  }

  set value(val: number) {
    this.setAttribute('value', val.toString());
  }

  private render() {
    const labelKey = this.getAttribute('label-key') || '';
    const unit = this.getAttribute('unit') || '';
    const targetId = this.getAttribute('target-id') || '';
    const valId = this.getAttribute('val-id') || '';
    const min = this.getAttribute('min') || '0';
    const max = this.getAttribute('max') || '100';
    const step = this.getAttribute('step') || '1';

    this.innerHTML = `
      <div class="input-group">
        <div class="label-row">
          <label ${targetId ? `for="${targetId}"` : ''} ${labelKey ? `data-i18n="${labelKey}"` : ''}></label>
          <span class="value-display"><strong ${valId ? `id="${valId}"` : ''}>${this.value}</strong>${unit}</span>
        </div>
        <div class="range-wrapper">
          <input type="range" ${targetId ? `id="${targetId}"` : ''} min="${min}" max="${max}" value="${this.value}" step="${step}" class="slider">
        </div>
      </div>
    `;

    const input = this.querySelector('input');
    const valDisplay = this.querySelector('strong');

    input?.addEventListener('input', (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value) || 0;
      if (valDisplay) valDisplay.textContent = val.toString();
      this.setAttribute('value', val.toString());
      this.dispatchEvent(
        new CustomEvent('slider-input', {
          detail: { value: val },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }
}

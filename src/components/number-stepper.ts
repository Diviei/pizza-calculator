/**
 * Web Component: <number-stepper>
 * Reusable stepper component with + / - buttons and number input
 */

export class NumberStepper extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'min', 'max', 'step', 'action-step', 'target-id'];
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
    return parseFloat(this.getAttribute('value') || '1');
  }

  set value(val: number) {
    this.setAttribute('value', val.toString());
  }

  get min(): number {
    return parseFloat(this.getAttribute('min') || '1');
  }

  get max(): number {
    return parseFloat(this.getAttribute('max') || '100');
  }

  get actionStep(): number {
    return parseFloat(this.getAttribute('action-step') || '1');
  }

  private step(delta: number) {
    const next = Math.min(this.max, Math.max(this.min, this.value + delta));
    this.value = next;
    this.dispatchEvent(
      new CustomEvent('stepper-change', {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private render() {
    const targetId = this.getAttribute('target-id') || '';
    const inputId = targetId ? `id="${targetId}"` : '';

    this.innerHTML = `
      <div class="number-control">
        <button type="button" class="btn-step btn-decrement">-</button>
        <input type="number" ${inputId} min="${this.min}" max="${this.max}" value="${this.value}" step="${this.getAttribute('step') || '1'}" required>
        <button type="button" class="btn-step btn-increment">+</button>
      </div>
    `;

    const decBtn = this.querySelector('.btn-decrement');
    const incBtn = this.querySelector('.btn-increment');
    const inputEl = this.querySelector('input');

    decBtn?.addEventListener('click', () => this.step(-this.actionStep));
    incBtn?.addEventListener('click', () => this.step(this.actionStep));

    inputEl?.addEventListener('input', (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value) || this.min;
      this.setAttribute('value', val.toString());
      this.dispatchEvent(
        new CustomEvent('stepper-change', {
          detail: { value: val },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }
}

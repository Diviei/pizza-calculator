import { beforeEach, describe, expect, it, vi } from 'vitest';
import indexHtml from '../index.html?raw';
import { initApp } from './app.ts';

describe('App Integration Tests - Bug Reproduction & Fix Verification', () => {
  beforeEach(() => {
    localStorage.clear();
    // Load index.html body content into document.body
    const html = indexHtml.replace(/<script[\s\S]*?<\/script>/gi, '');
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    document.body.innerHTML = bodyMatch ? bodyMatch[1] : html;

    // Initialize application logic
    initApp();
  });

  it('reproduces label disappearance and yeast not updating on subsequent ambient temperature changes (Simple Mode)', () => {
    // Locate the simple temp RT range slider component and its label
    const tempRtComponent = document.querySelector('range-slider[target-id="simpleTempRtSlider"]');
    expect(tempRtComponent).not.toBeNull();

    const label = tempRtComponent?.querySelector('label');
    expect(label).not.toBeNull();
    // Initially label should have translated text content (e.g. "Temperatura ambiente" or "Room Temperature")
    const initialLabelText = label?.textContent;
    expect(initialLabelText).toBeTruthy();

    const yeastRes = document.getElementById('simpleYeastRes');
    expect(yeastRes).not.toBeNull();
    const initialYeast = yeastRes?.textContent;

    // 1st temperature change: set temperature to 28°C
    const sliderInput1 = tempRtComponent?.querySelector('#simpleTempRtSlider') as HTMLInputElement;
    expect(sliderInput1).not.toBeNull();

    sliderInput1.value = '28';
    sliderInput1.dispatchEvent(new Event('input', { bubbles: true }));

    // BUG CHECK 1: Label text should NOT disappear
    const labelAfterFirstChange = tempRtComponent?.querySelector('label');
    expect(labelAfterFirstChange?.textContent).toBe(initialLabelText);

    // Record yeast value after first change
    const yeastAfterFirstChange = yeastRes?.textContent;
    expect(yeastAfterFirstChange).not.toBe(initialYeast);

    // 2nd temperature change: set temperature to 15°C
    // Query the input currently in the DOM inside the component
    const sliderInput2 = tempRtComponent?.querySelector('#simpleTempRtSlider') as HTMLInputElement;
    expect(sliderInput2).not.toBeNull();

    sliderInput2.value = '15';
    sliderInput2.dispatchEvent(new Event('input', { bubbles: true }));

    // BUG CHECK 2: Yeast value MUST update on subsequent change!
    const yeastAfterSecondChange = yeastRes?.textContent;
    expect(yeastAfterSecondChange).not.toBe(yeastAfterFirstChange);
  });

  it('reproduces label disappearance and value updates on Advanced Mode controls (hydration, salt, tempRt, tempFridge)', () => {
    // Switch to Advanced mode by clicking tab
    const tabAdvanced = document.getElementById('tabAdvanced') as HTMLButtonElement;
    tabAdvanced.click();

    const tempRtComponent = document.querySelector('range-slider[target-id="tempRtSlider"]');
    expect(tempRtComponent).not.toBeNull();

    const label = tempRtComponent?.querySelector('label');
    expect(label?.textContent).toBeTruthy();
    const initialLabelText = label?.textContent;

    const yeastRes = document.getElementById('yeastRes');
    const initialYeast = yeastRes?.textContent;

    // 1st change
    const sliderInput1 = tempRtComponent?.querySelector('#tempRtSlider') as HTMLInputElement;
    sliderInput1.value = '28';
    sliderInput1.dispatchEvent(new Event('input', { bubbles: true }));

    expect(tempRtComponent?.querySelector('label')?.textContent).toBe(initialLabelText);
    const yeastAfterFirst = yeastRes?.textContent;
    expect(yeastAfterFirst).not.toBe(initialYeast);

    // 2nd change
    const sliderInput2 = tempRtComponent?.querySelector('#tempRtSlider') as HTMLInputElement;
    sliderInput2.value = '15';
    sliderInput2.dispatchEvent(new Event('input', { bubbles: true }));

    expect(yeastRes?.textContent).not.toBe(yeastAfterFirst);
  });

  it('checks if number-stepper components re-render and lose event bindings on changes', () => {
    const ballsComponent = document.querySelector('number-stepper[target-id="simpleBalls"]');
    expect(ballsComponent).not.toBeNull();

    const input1 = ballsComponent?.querySelector('#simpleBalls') as HTMLInputElement;
    expect(input1).not.toBeNull();

    // Change input value directly
    input1.value = '6';
    input1.dispatchEvent(new Event('input', { bubbles: true }));

    const summaryRes = document.getElementById('simpleDoughSummaryDisplay');
    expect(summaryRes?.textContent).toMatch(/6 (bolas|balls)/i);

    // 2nd change on the input element currently in DOM
    const input2 = ballsComponent?.querySelector('#simpleBalls') as HTMLInputElement;
    input2.value = '8';
    input2.dispatchEvent(new Event('input', { bubbles: true }));

    expect(summaryRes?.textContent).toMatch(/8 (bolas|balls)/i);
  });

  it('handles theme toggling correctly', () => {
    const themeBtn = document.getElementById('themeToggleBtn') as HTMLButtonElement;
    expect(themeBtn).not.toBeNull();

    themeBtn.click();
    expect(document.body.classList.contains('light-theme')).toBe(true);

    themeBtn.click();
    expect(document.body.classList.contains('dark-theme')).toBe(true);
  });

  it('handles reset button and preset buttons correctly', () => {
    const tabSimple = document.getElementById('tabSimple') as HTMLButtonElement;
    const tabAdvanced = document.getElementById('tabAdvanced') as HTMLButtonElement;
    tabAdvanced.click();
    tabSimple.click();

    const btn24 = document.querySelector('.preset-btn[data-hours="24"]') as HTMLButtonElement;
    btn24.click();

    const simpleHours = document.getElementById('simpleHours') as HTMLInputElement;
    expect(simpleHours.value).toBe('24');

    const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
    resetBtn.click();
    expect(simpleHours.value).toBe('8');
  });

  it('handles stepper buttons (+ / -) in both modes', () => {
    const incBtnSimple = document.querySelector(
      'number-stepper[target-id="simpleBalls"] .btn-increment',
    ) as HTMLButtonElement;
    incBtnSimple.click();
    const simpleBalls = document.getElementById('simpleBalls') as HTMLInputElement;
    expect(simpleBalls.value).toBe('5');

    const decBtnSimple = document.querySelector(
      'number-stepper[target-id="simpleBalls"] .btn-decrement',
    ) as HTMLButtonElement;
    decBtnSimple.click();
    expect(simpleBalls.value).toBe('4');

    const tabAdvanced = document.getElementById('tabAdvanced') as HTMLButtonElement;
    tabAdvanced.click();

    const incBtnAdv = document.querySelector(
      'number-stepper[target-id="numberOfBalls"] .btn-increment',
    ) as HTMLButtonElement;
    incBtnAdv.click();
    const numberOfBalls = document.getElementById('numberOfBalls') as HTMLInputElement;
    expect(numberOfBalls.value).toBe('2');

    const decBtnAdv = document.querySelector(
      'number-stepper[target-id="numberOfBalls"] .btn-decrement',
    ) as HTMLButtonElement;
    decBtnAdv.click();
    expect(numberOfBalls.value).toBe('1');
  });

  it('handles language switching popover menu, click outside, and escape key correctly', () => {
    const langBtn = document.getElementById('langMenuBtn') as HTMLButtonElement;
    const popover = document.getElementById('langPopover');

    // Click to open
    langBtn.click();
    expect(popover?.classList.contains('hidden')).toBe(false);

    // Click again to toggle close
    langBtn.click();
    expect(popover?.classList.contains('hidden')).toBe(true);

    // Click to open
    langBtn.click();
    expect(popover?.classList.contains('hidden')).toBe(false);

    // Press non-Escape key (Enter) -> should remain open
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(popover?.classList.contains('hidden')).toBe(false);

    // Click outside popover to close
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(popover?.classList.contains('hidden')).toBe(true);

    // Open again and press Escape key to close
    langBtn.click();
    expect(popover?.classList.contains('hidden')).toBe(false);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(popover?.classList.contains('hidden')).toBe(true);

    // Open and select language
    langBtn.click();
    const enOption = document.querySelector('.lang-option-item[data-lang="en"]') as HTMLButtonElement;
    enOption.click();

    expect(document.documentElement.lang).toBe('en');
    expect(popover?.classList.contains('hidden')).toBe(true);

    // Test other languages
    langBtn.click();
    const itOption = document.querySelector('.lang-option-item[data-lang="it"]') as HTMLButtonElement;
    itOption.click();
    expect(document.documentElement.lang).toBe('it');
  });

  it('handles simple mode controls and radio buttons', () => {
    const simpleHoursInput = document.getElementById('simpleHours') as HTMLInputElement;
    simpleHoursInput.value = '12';
    simpleHoursInput.dispatchEvent(new Event('input', { bubbles: true }));

    const simpleTempRtInput = document.getElementById('simpleTempRtSlider') as HTMLInputElement;
    simpleTempRtInput.value = '24';
    simpleTempRtInput.dispatchEvent(new Event('input', { bubbles: true }));
    simpleTempRtInput.dispatchEvent(new Event('change', { bubbles: true }));

    const simpleTempFridgeInput = document.getElementById('simpleTempFridgeSlider') as HTMLInputElement;
    simpleTempFridgeInput.value = '6';
    simpleTempFridgeInput.dispatchEvent(new Event('input', { bubbles: true }));
    simpleTempFridgeInput.dispatchEvent(new Event('change', { bubbles: true }));

    const simpleDryYeastRadio = document.getElementById('simpleYeastDry') as HTMLInputElement;
    simpleDryYeastRadio.checked = true;
    simpleDryYeastRadio.dispatchEvent(new Event('change', { bubbles: true }));

    const simpleYeastTitle = document.getElementById('simpleYeastTitle');
    expect(simpleYeastTitle?.textContent).toBeTruthy();
  });

  it('tests advanced mode slider and stepper controls', () => {
    const tabAdvanced = document.getElementById('tabAdvanced') as HTMLButtonElement;
    tabAdvanced.click();

    const ballWeightInput = document.getElementById('ballWeight') as HTMLInputElement;
    ballWeightInput.value = '300';
    ballWeightInput.dispatchEvent(new Event('input', { bubbles: true }));

    const hydrationInput = document.getElementById('hydrationSlider') as HTMLInputElement;
    hydrationInput.value = '70';
    hydrationInput.dispatchEvent(new Event('input', { bubbles: true }));

    const waterPct = document.getElementById('waterPctDisplay');
    expect(waterPct?.textContent).toBe('70%');

    const saltInput = document.getElementById('saltSlider') as HTMLInputElement;
    saltInput.value = '3.0';
    saltInput.dispatchEvent(new Event('input', { bubbles: true }));

    const saltPct = document.getElementById('saltPctDisplay');
    expect(saltPct?.textContent).toBe('3%');

    const tempFridgeInput = document.getElementById('tempFridgeSlider') as HTMLInputElement;
    tempFridgeInput.value = '5';
    tempFridgeInput.dispatchEvent(new Event('input', { bubbles: true }));
    tempFridgeInput.dispatchEvent(new Event('change', { bubbles: true }));

    const hoursRtInput = document.getElementById('hoursRt') as HTMLInputElement;
    hoursRtInput.value = '0';
    hoursRtInput.dispatchEvent(new Event('input', { bubbles: true }));
    hoursRtInput.dispatchEvent(new Event('change', { bubbles: true }));

    const hoursFridgeInput = document.getElementById('hoursFridge') as HTMLInputElement;
    hoursFridgeInput.value = '0';
    hoursFridgeInput.dispatchEvent(new Event('input', { bubbles: true }));
    hoursFridgeInput.dispatchEvent(new Event('change', { bubbles: true }));

    const warningNotice = document.getElementById('warningNotice');
    expect(warningNotice?.classList.contains('hidden')).toBe(false);

    const advancedDryYeastRadio = document.getElementById('yeastDry') as HTMLInputElement;
    advancedDryYeastRadio.checked = true;
    advancedDryYeastRadio.dispatchEvent(new Event('change', { bubbles: true }));
  });

  it('handles PWA toasts and install prompt events', async () => {
    const pwaInstallToast = document.getElementById('pwaInstallToast');
    const pwaInstallBtn = document.getElementById('pwaInstallBtn');
    const pwaInstallCloseBtn = document.getElementById('pwaInstallCloseBtn');

    let promptCalled = false;
    const promptEvent = new Event('beforeinstallprompt');
    (promptEvent as any).prompt = () => {
      promptCalled = true;
    };
    (promptEvent as any).userChoice = Promise.resolve({ outcome: 'accepted' });

    window.dispatchEvent(promptEvent);
    expect(pwaInstallToast?.classList.contains('hidden')).toBe(false);

    if (pwaInstallBtn) {
      pwaInstallBtn.click();
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(promptCalled).toBe(true);
    }

    if (pwaInstallToast && pwaInstallCloseBtn) {
      pwaInstallToast.classList.remove('hidden');
      pwaInstallCloseBtn.click();
      expect(pwaInstallToast.classList.contains('hidden')).toBe(true);
    }

    const pwaUpdateToast = document.getElementById('pwaUpdateToast');
    const pwaUpdateBtn = document.getElementById('pwaUpdateBtn');
    const pwaUpdateCloseBtn = document.getElementById('pwaUpdateCloseBtn');
    if (pwaUpdateToast && pwaUpdateCloseBtn) {
      pwaUpdateToast.classList.remove('hidden');
      pwaUpdateCloseBtn.click();
      expect(pwaUpdateToast.classList.contains('hidden')).toBe(true);
    }

    if (pwaUpdateBtn) {
      const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});
      pwaUpdateBtn.click();
      expect(reloadSpy).toHaveBeenCalled();
    }
  });

  it('handles localStorage errors gracefully', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('ReadError');
    });

    initApp();

    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
  });

  it('loads saved state from localStorage properly', () => {
    localStorage.setItem('pizza_calculator_mode', 'advanced');
    localStorage.setItem(
      'pizza_calculator_simple_settings_v1',
      JSON.stringify({
        numberOfBalls: 5,
        hoursTotal: 12,
        yeastType: 'Instant Dry',
        tempRt: 24,
        tempFridge: 5,
      }),
    );
    localStorage.setItem(
      'pizza_calculator_settings_v1',
      JSON.stringify({
        numberOfBalls: 3,
        ballWeight: 250,
        hydrationPercentage: 70,
        saltPercentage: 3,
        yeastType: 'Instant Dry',
        hoursRt: 6,
        tempRt: 24,
        hoursFridge: 24,
        tempFridge: 4,
      }),
    );

    initApp();

    const hydrationVal = document.getElementById('hydrationVal');
    expect(hydrationVal?.textContent).toBe('70');
  });
});

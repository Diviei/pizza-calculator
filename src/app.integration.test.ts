import { beforeEach, describe, expect, it, vi } from 'vitest';
import indexHtml from '../index.html?raw';
import { initApp, setSwRegistration } from './app.ts';

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

  it('handles color theme palette selection and persistence correctly', () => {
    const colorThemeBtn = document.getElementById('colorThemeMenuBtn') as HTMLButtonElement;
    expect(colorThemeBtn).not.toBeNull();

    // Default theme attribute should be 'amber'
    expect(document.body.getAttribute('data-color-theme')).toBe('amber');

    // Click menu to open popover
    colorThemeBtn.click();
    const popover = document.getElementById('colorThemePopover');
    expect(popover?.classList.contains('hidden')).toBe(false);

    // Select 'chic' theme
    const chicBtn = document.querySelector('.color-theme-option-item[data-color-theme="chic"]') as HTMLButtonElement;
    expect(chicBtn).not.toBeNull();
    chicBtn.click();

    expect(document.body.getAttribute('data-color-theme')).toBe('chic');
    expect(localStorage.getItem('pizza_calculator_color_theme')).toBe('chic');
    expect(popover?.classList.contains('hidden')).toBe(true);

    // Select 'basil' theme
    colorThemeBtn.click();
    const basilBtn = document.querySelector('.color-theme-option-item[data-color-theme="basil"]') as HTMLButtonElement;
    basilBtn.click();

    expect(document.body.getAttribute('data-color-theme')).toBe('basil');
    expect(localStorage.getItem('pizza_calculator_color_theme')).toBe('basil');
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
      const postMessageSpy = vi.fn();
      const mockRegistration = {
        waiting: {
          postMessage: postMessageSpy,
        },
      } as unknown as ServiceWorkerRegistration;

      setSwRegistration(mockRegistration);

      const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});
      pwaUpdateBtn.click();
      expect(postMessageSpy).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
      expect(reloadSpy).toHaveBeenCalled();
      reloadSpy.mockRestore();
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

  it('renders dynamic preparation guide steps and copy recipe button in both simple and advanced modes', () => {
    // 1. Simple Mode Preparation Guide
    const simplePrepSteps = document.getElementById('simplePrepSteps');
    expect(simplePrepSteps?.children.length).toBe(3);
    expect(simplePrepSteps?.textContent).toMatch(/Impasto|Amasado|Mezcla|Mixing|Preparation|Pétrissage|Mischen/i);

    // Click simple copy recipe button
    const simpleCopyBtn = document.getElementById('simpleCopyBtn') as HTMLButtonElement;
    expect(simpleCopyBtn).not.toBeNull();
    simpleCopyBtn.click();
    const copyToast = document.getElementById('copyToast');
    expect(copyToast?.classList.contains('hidden')).toBe(false);

    // 2. Switch to Advanced Mode and test fermentation time variations (Ambient only, Fridge only, Combined)
    const tabAdvanced = document.getElementById('tabAdvanced') as HTMLButtonElement;
    tabAdvanced.click();

    const hoursRtInput = document.getElementById('hoursRt') as HTMLInputElement;
    const hoursFridgeInput = document.getElementById('hoursFridge') as HTMLInputElement;
    const advancedPrepSteps = document.getElementById('advancedPrepSteps');

    // Case A: Ambient only (hoursRt=8, hoursFridge=0)
    hoursRtInput.value = '8';
    hoursFridgeInput.value = '0';
    hoursRtInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(advancedPrepSteps?.textContent).toMatch(/temperatura ambiente|room temp/i);

    // Case B: Fridge only (hoursRt=0, hoursFridge=24)
    hoursRtInput.value = '0';
    hoursFridgeInput.value = '24';
    hoursRtInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(advancedPrepSteps?.textContent).toMatch(/nevera|frigo|fridge/i);

    // Case C: Combined mixed fermentation (hoursRt=4, hoursFridge=20)
    hoursRtInput.value = '4';
    hoursFridgeInput.value = '20';
    hoursRtInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(advancedPrepSteps?.textContent).toMatch(/Mixta|Mixed|temperatura ambiente/i);

    // Click advanced copy recipe button
    const advancedCopyBtn = document.getElementById('advancedCopyBtn') as HTMLButtonElement;
    expect(advancedCopyBtn).not.toBeNull();
    advancedCopyBtn.click();
    expect(copyToast?.classList.contains('hidden')).toBe(false);
  });

  it('updates calculations and defaults when switching to Tonda Romana pizza style', () => {
    // 1. Simple mode initial state (Neapolitan 4 balls @ 280g = 1120g)
    const summaryDisplay = document.getElementById('simpleDoughSummaryDisplay');
    expect(summaryDisplay?.textContent).toContain('280g');

    // Select Tonda Romana style card in Simple mode
    const styleSelector = document.getElementById('simpleStyleSelector');
    const tondaBtn = styleSelector?.querySelector('#styleTondaRomanaBtn') as HTMLButtonElement;
    expect(tondaBtn).not.toBeNull();
    tondaBtn.click();

    // Summary display should now show 180g balls (4 * 180 = 720g total)
    expect(summaryDisplay?.textContent).toContain('720');
    expect(summaryDisplay?.textContent).toContain('180g');

    // Flour should be updated to ~451.4g for 720g total at 57% hyd, 2.5% salt
    const flourRes = document.getElementById('simpleFlourRes');
    expect(flourRes?.textContent).toBe('451.4');

    // Prep guide should mention Tonda Romana stretching (rodillo/fina/mattarello/sottile) and 2-3h rest
    const simplePrepSteps = document.getElementById('simplePrepSteps');
    expect(simplePrepSteps?.textContent).toMatch(/rodillo|fina|mattarello|sottile/i);
    expect(simplePrepSteps?.textContent).toMatch(/2 a 3|2-3/i);

    // 2. Switch to Advanced mode
    const tabAdvanced = document.getElementById('tabAdvanced') as HTMLButtonElement;
    tabAdvanced.click();

    const ballWeightInput = document.getElementById('ballWeight') as HTMLInputElement;
    const hydrationSlider = document.getElementById('hydrationSlider') as HTMLInputElement;

    // Advanced inputs should reflect Tonda Romana defaults (180g ball, 57% hydration)
    expect(ballWeightInput.value).toBe('180');
    expect(hydrationSlider.value).toBe('57');

    // Switch back to Neapolitan in Advanced mode
    const advStyleSelector = document.getElementById('advancedStyleSelector');
    const neapolitanBtn = advStyleSelector?.querySelector('#styleNeapolitanBtn') as HTMLButtonElement;
    neapolitanBtn.click();

    expect(ballWeightInput.value).toBe('280');
    expect(hydrationSlider.value).toBe('65');
  });

  it('builds shareable URL and handles share button clicks in simple and advanced mode', () => {
    const simpleShareBtn = document.getElementById('simpleShareBtn') as HTMLButtonElement;
    expect(simpleShareBtn).not.toBeNull();
    simpleShareBtn.click();

    const copyToast = document.getElementById('copyToast');
    expect(copyToast?.classList.contains('hidden')).toBe(false);

    // Switch to advanced mode and test share button
    const tabAdvanced = document.getElementById('tabAdvanced') as HTMLButtonElement;
    tabAdvanced.click();

    const advancedShareBtn = document.getElementById('advancedShareBtn') as HTMLButtonElement;
    expect(advancedShareBtn).not.toBeNull();
    advancedShareBtn.click();
    expect(copyToast?.classList.contains('hidden')).toBe(false);
  });

  it('parses URL query parameters correctly on initialization', () => {
    delete (window as any).location;
    (window as any).location = new URL(
      'https://pizzacalc.app/?mode=advanced&style=tonda_romana&balls=6&weight=200&hydration=60&salt=3&hoursRt=6&tempRt=24&hoursFridge=12&tempFridge=4&lang=en',
    );

    initApp();

    const ballWeightInput = document.getElementById('ballWeight') as HTMLInputElement;
    const hydrationSlider = document.getElementById('hydrationSlider') as HTMLInputElement;
    expect(ballWeightInput.value).toBe('200');
    expect(hydrationSlider.value).toBe('60');

    // Simple mode URL params test
    (window as any).location = new URL(
      'https://pizzacalc.app/?mode=simple&style=neapolitan&balls=8&hours=12&tempRt=25&tempFridge=5&yeast=Instant%20Dry&lang=es',
    );
    initApp();

    const simpleBallsInput = document.getElementById('simpleBalls') as HTMLInputElement;
    const simpleHoursInput = document.getElementById('simpleHours') as HTMLInputElement;
    expect(simpleBallsInput.value).toBe('8');
    expect(simpleHoursInput.value).toBe('12');
  });

  it('handles clipboard fallback when navigator.clipboard is unavailable', () => {
    vi.spyOn(navigator, 'clipboard', 'get').mockReturnValue(undefined as any);

    const simpleCopyBtn = document.getElementById('simpleCopyBtn') as HTMLButtonElement;
    simpleCopyBtn.click();

    const copyToast = document.getElementById('copyToast');
    expect(copyToast?.classList.contains('hidden')).toBe(false);
  });
});

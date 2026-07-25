/**
 * Pizza Dough Calculator - Client-side UI & Binding Engine (TypeScript)
 * Internationalization: Scalable N-language support with custom floating popover UI
 */

import {
  type CalculationResults,
  calculateDough,
  calculateSimpleDough,
  DEFAULTS,
  type DoughInputs,
  PIZZA_STYLES,
  type PizzaStyle,
  type YeastType,
} from './calculator.ts';
import { registerCustomElements } from './components/index.ts';
import { getInitialLanguage, type LanguageCode, setSavedLanguage, translations } from './i18n.ts';

// Register Native Custom Elements
registerCustomElements();

export type ThemeMode = 'dark' | 'light';
export type AppMode = 'simple' | 'advanced';

const DEFAULT_THEME: ThemeMode = 'dark';
const STORAGE_KEY = 'pizza_calculator_settings_v1';
const SIMPLE_STORAGE_KEY = 'pizza_calculator_simple_settings_v1';
const THEME_KEY = 'pizza_calculator_theme';
const MODE_KEY = 'pizza_calculator_mode';
const STYLE_KEY = 'pizza_calculator_style_v1';

// Current active language, mode & style state
let currentLang: LanguageCode = getInitialLanguage();
let currentMode: AppMode = 'simple';
let currentPizzaStyle: PizzaStyle = 'neapolitan';

// DOM Element Registry (Dynamic Getters for Live References)
const elements = {
  // Mode Tabs & Containers
  get tabSimple() {
    return document.getElementById('tabSimple') as HTMLButtonElement;
  },
  get tabAdvanced() {
    return document.getElementById('tabAdvanced') as HTMLButtonElement;
  },
  get simpleModeContainer() {
    return document.getElementById('simpleModeContainer') as HTMLElement;
  },
  get advancedModeContainer() {
    return document.getElementById('advancedModeContainer') as HTMLElement;
  },

  // Simple Mode Controls & Displays
  get simpleBalls() {
    return document.getElementById('simpleBalls') as HTMLInputElement;
  },
  get simpleHours() {
    return document.getElementById('simpleHours') as HTMLInputElement;
  },
  get simpleHoursVal() {
    return document.getElementById('simpleHoursVal') as HTMLElement;
  },
  get simpleYeastInputs() {
    return document.getElementsByName('simpleYeastType') as NodeListOf<HTMLInputElement>;
  },
  get simpleTempRtSlider() {
    return document.getElementById('simpleTempRtSlider') as HTMLInputElement;
  },
  get simpleTempRtVal() {
    return document.getElementById('simpleTempRtVal') as HTMLElement;
  },
  get simpleTempFridgeSlider() {
    return document.getElementById('simpleTempFridgeSlider') as HTMLInputElement;
  },
  get simpleTempFridgeVal() {
    return document.getElementById('simpleTempFridgeVal') as HTMLElement;
  },
  get simpleTimeSplitDisplay() {
    return document.getElementById('simpleTimeSplitDisplay') as HTMLElement;
  },
  get simpleDoughSummaryDisplay() {
    return document.getElementById('simpleDoughSummaryDisplay') as HTMLElement;
  },
  get simpleFlourRes() {
    return document.getElementById('simpleFlourRes') as HTMLElement;
  },
  get simpleWaterRes() {
    return document.getElementById('simpleWaterRes') as HTMLElement;
  },
  get simpleSaltRes() {
    return document.getElementById('simpleSaltRes') as HTMLElement;
  },
  get simpleYeastRes() {
    return document.getElementById('simpleYeastRes') as HTMLElement;
  },
  get simpleYeastTitle() {
    return document.getElementById('simpleYeastTitle') as HTMLElement;
  },
  get simpleDefaultsNotice() {
    return document.querySelector('.defaults-notice') as HTMLElement;
  },

  // Advanced Mode Inputs
  get numberOfBalls() {
    return document.getElementById('numberOfBalls') as HTMLInputElement;
  },
  get ballWeight() {
    return document.getElementById('ballWeight') as HTMLInputElement;
  },
  get hydrationSlider() {
    return document.getElementById('hydrationSlider') as HTMLInputElement;
  },
  get hydrationVal() {
    return document.getElementById('hydrationVal') as HTMLElement;
  },
  get saltSlider() {
    return document.getElementById('saltSlider') as HTMLInputElement;
  },
  get saltVal() {
    return document.getElementById('saltVal') as HTMLElement;
  },
  get yeastInputs() {
    return document.getElementsByName('yeastType') as NodeListOf<HTMLInputElement>;
  },
  get hoursRt() {
    return document.getElementById('hoursRt') as HTMLInputElement;
  },
  get tempRtSlider() {
    return document.getElementById('tempRtSlider') as HTMLInputElement;
  },
  get tempRtVal() {
    return document.getElementById('tempRtVal') as HTMLElement;
  },
  get hoursFridge() {
    return document.getElementById('hoursFridge') as HTMLInputElement;
  },
  get tempFridgeSlider() {
    return document.getElementById('tempFridgeSlider') as HTMLInputElement;
  },
  get tempFridgeVal() {
    return document.getElementById('tempFridgeVal') as HTMLElement;
  },

  // Advanced Output Displays
  get totalDoughWeightDisplay() {
    return document.getElementById('totalDoughWeightDisplay') as HTMLElement;
  },
  get flourRes() {
    return document.getElementById('flourRes') as HTMLElement;
  },
  get waterRes() {
    return document.getElementById('waterRes') as HTMLElement;
  },
  get saltRes() {
    return document.getElementById('saltRes') as HTMLElement;
  },
  get yeastRes() {
    return document.getElementById('yeastRes') as HTMLElement;
  },
  get waterPctDisplay() {
    return document.getElementById('waterPctDisplay') as HTMLElement;
  },
  get saltPctDisplay() {
    return document.getElementById('saltPctDisplay') as HTMLElement;
  },
  get yeastPctDisplay() {
    return document.getElementById('yeastPctDisplay') as HTMLElement;
  },
  get yeastLabel() {
    return document.getElementById('yeastLabel') as HTMLElement;
  },
  get warningNotice() {
    return document.getElementById('warningNotice') as HTMLElement;
  },

  // Buttons & Controls
  get resetBtn() {
    return document.getElementById('resetBtn') as HTMLButtonElement;
  },
  get themeToggleBtn() {
    return document.getElementById('themeToggleBtn') as HTMLButtonElement;
  },
  get sunIcon() {
    return document.getElementById('sunIcon') as HTMLElement;
  },
  get moonIcon() {
    return document.getElementById('moonIcon') as HTMLElement;
  },

  // Language Popover UI
  get langMenuBtn() {
    return document.getElementById('langMenuBtn') as HTMLButtonElement | null;
  },
  get currentLangBadge() {
    return document.getElementById('currentLangBadge') as HTMLElement | null;
  },
  get langPopover() {
    return document.getElementById('langPopover') as HTMLElement | null;
  },

  // Copy Buttons & Mobile Quick Bar
  get simpleCopyBtn() {
    return document.getElementById('simpleCopyBtn') as HTMLButtonElement | null;
  },
  get advancedCopyBtn() {
    return document.getElementById('advancedCopyBtn') as HTMLButtonElement | null;
  },
  get mobileQuickBar() {
    return document.getElementById('mobileQuickBar') as HTMLElement | null;
  },
  get quickFlour() {
    return document.getElementById('quickFlour') as HTMLElement | null;
  },
  get quickWater() {
    return document.getElementById('quickWater') as HTMLElement | null;
  },
  get quickYeast() {
    return document.getElementById('quickYeast') as HTMLElement | null;
  },
  get copyToast() {
    return document.getElementById('copyToast') as HTMLElement | null;
  },
  get simplePrepSteps() {
    return document.getElementById('simplePrepSteps') as HTMLElement | null;
  },
  get advancedPrepSteps() {
    return document.getElementById('advancedPrepSteps') as HTMLElement | null;
  },
  get simpleShareBtn() {
    return document.getElementById('simpleShareBtn') as HTMLButtonElement | null;
  },
  get advancedShareBtn() {
    return document.getElementById('advancedShareBtn') as HTMLButtonElement | null;
  },
};

/**
 * Update all DOM text nodes according to current language with fallback
 */
function applyLanguage(lang: LanguageCode): void {
  currentLang = lang;
  document.documentElement.lang = lang;
  const t = translations[lang] || translations.en || translations.es;
  const fallback = translations.en || translations.es;

  // Text content translation
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n') as keyof typeof t;
    const val = t[key] || fallback[key];
    if (val) {
      if (el.tagName === 'TITLE') {
        document.title = val;
      } else {
        el.textContent = val;
      }
    }
  });

  // Title attributes translation
  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title') as keyof typeof t;
    const val = t[key] || fallback[key];
    if (val) el.title = val;
  });

  // Update header button badge text
  if (elements.currentLangBadge) {
    elements.currentLangBadge.textContent = lang.toUpperCase();
  }

  // Update active state in popover menu
  document.querySelectorAll<HTMLButtonElement>('.lang-option-item').forEach((btn) => {
    const itemLang = btn.getAttribute('data-lang') as LanguageCode;
    const checkEl = btn.querySelector('.lang-check');
    if (itemLang === lang) {
      btn.classList.add('active');
      if (checkEl) checkEl.textContent = '✓';
    } else {
      btn.classList.remove('active');
      if (checkEl) checkEl.textContent = '';
    }
  });

  setSavedLanguage(lang);
  calculate();
  calculateSimple();
}

/**
 * Switch Active App Mode (Simple vs Advanced)
 */
function setMode(mode: AppMode): void {
  currentMode = mode;
  if (elements.tabSimple && elements.tabAdvanced && elements.simpleModeContainer && elements.advancedModeContainer) {
    if (mode === 'simple') {
      elements.tabSimple.classList.add('active');
      elements.tabSimple.setAttribute('aria-selected', 'true');
      elements.tabAdvanced.classList.remove('active');
      elements.tabAdvanced.setAttribute('aria-selected', 'false');

      elements.simpleModeContainer.classList.remove('hidden');
      elements.advancedModeContainer.classList.add('hidden');
      calculateSimple();
    } else {
      elements.tabAdvanced.classList.add('active');
      elements.tabAdvanced.setAttribute('aria-selected', 'true');
      elements.tabSimple.classList.remove('active');
      elements.tabSimple.setAttribute('aria-selected', 'false');

      elements.advancedModeContainer.classList.remove('hidden');
      elements.simpleModeContainer.classList.add('hidden');
      calculate();
    }
  }
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch (e) {
    console.warn('LocalStorage error saving mode:', e);
  }
}

/**
 * Render Dynamic Step-by-Step Preparation Guide
 */
function renderPrepGuide(
  targetEl: HTMLElement | null,
  data: {
    flourGrams: number;
    waterGrams: number;
    saltGrams: number;
    yeastGrams: number;
    hoursRt: number;
    tempRt: number;
    hoursFridge: number;
    tempFridge: number;
    numberOfBalls: number;
    ballWeight: number;
  },
): void {
  if (!targetEl) return;
  const t = translations[currentLang] || translations.en || translations.es;

  const step1Title = t.prepStep1Title || '🥣 1. Amasado y Mezcla';
  const step1Body = (t.prepStep1Body || '')
    .replace('{yeast}', data.yeastGrams.toFixed(2))
    .replace('{water}', data.waterGrams.toFixed(1))
    .replace('{flour}', data.flourGrams.toFixed(1))
    .replace('{salt}', data.saltGrams.toFixed(1));

  const step2Title = t.prepStep2Title || '⏱️ 2. Fermentación y Control de Tiempo';
  let step2Body = '';
  if (data.hoursFridge === 0) {
    step2Body = (t.prepStep2AmbientOnly || '')
      .replace('{tempRt}', data.tempRt.toString())
      .replace('{hoursRt}', data.hoursRt.toString());
  } else if (data.hoursRt === 0) {
    step2Body = (t.prepStep2FridgeOnly || '')
      .replace('{tempFridge}', data.tempFridge.toString())
      .replace('{hoursFridge}', data.hoursFridge.toString());
  } else {
    step2Body = (t.prepStep2Combined || '')
      .replace('{hoursRt}', data.hoursRt.toString())
      .replace('{tempRt}', data.tempRt.toString())
      .replace('{hoursFridge}', data.hoursFridge.toString())
      .replace('{tempFridge}', data.tempFridge.toString());
  }

  const step3Title = t.prepStep3Title || '🍕 3. Boleado, Formado y Horneado';
  const rawStep3 =
    currentPizzaStyle === 'tonda_romana'
      ? t.prepStep3BodyTondaRomana || t.prepStep3Body
      : t.prepStep3BodyNeapolitan || t.prepStep3Body;

  const step3Body = (rawStep3 || '')
    .replace('{balls}', data.numberOfBalls.toString())
    .replace('{weight}', data.ballWeight.toString());

  targetEl.innerHTML = `
    <div class="prep-step-item">
      <div class="prep-step-header">${step1Title}</div>
      <div class="prep-step-text">${step1Body}</div>
    </div>
    <div class="prep-step-item">
      <div class="prep-step-header">${step2Title}</div>
      <div class="prep-step-text">${step2Body}</div>
    </div>
    <div class="prep-step-item">
      <div class="prep-step-header">${step3Title}</div>
      <div class="prep-step-text">${step3Body}</div>
    </div>
  `;
}

/**
 * Switch Active Pizza Style (Neapolitan vs Tonda Romana)
 */
function setPizzaStyle(style: PizzaStyle, updateAdvancedInputs: boolean = false): void {
  currentPizzaStyle = style;
  const styleConfig = PIZZA_STYLES[style] || PIZZA_STYLES.neapolitan;

  // Sync custom element attributes across the app
  document.querySelectorAll('pizza-style-selector').forEach((el) => {
    el.setAttribute('active-style', style);
  });

  if (updateAdvancedInputs) {
    if (elements.ballWeight) elements.ballWeight.value = styleConfig.ballWeight.toString();
    if (elements.hydrationSlider) {
      elements.hydrationSlider.value = styleConfig.hydrationPercentage.toString();
      if (elements.hydrationVal) elements.hydrationVal.textContent = styleConfig.hydrationPercentage.toString();
    }
    if (elements.saltSlider) {
      elements.saltSlider.value = styleConfig.saltPercentage.toString();
      if (elements.saltVal) elements.saltVal.textContent = styleConfig.saltPercentage.toString();
    }
  }

  try {
    localStorage.setItem(STYLE_KEY, style);
  } catch (e) {
    console.warn('LocalStorage error saving style:', e);
  }

  calculateSimple();
  calculate();
}

/**
 * Perform calculation for Simple Mode
 */
function calculateSimple(): void {
  if (!elements.simpleBalls || !elements.simpleHours) return;

  const t = translations[currentLang] || translations.en || translations.es;

  const numberOfBalls = Math.max(1, parseInt(elements.simpleBalls.value, 10) || 1);
  const hoursTotal = Math.max(0, parseFloat(elements.simpleHours.value) || 0);

  let yeastType: YeastType = 'Fresh';
  if (elements.simpleYeastInputs) {
    elements.simpleYeastInputs.forEach((input) => {
      if (input.checked) yeastType = input.value as YeastType;
    });
  }

  const tempRt = elements.simpleTempRtSlider ? parseFloat(elements.simpleTempRtSlider.value) || 22 : 22;
  const tempFridge = elements.simpleTempFridgeSlider ? parseFloat(elements.simpleTempFridgeSlider.value) || 4 : 4;

  if (elements.simpleHoursVal) elements.simpleHoursVal.textContent = hoursTotal.toString();
  if (elements.simpleTempRtVal) elements.simpleTempRtVal.textContent = tempRt.toString();
  if (elements.simpleTempFridgeVal) elements.simpleTempFridgeVal.textContent = tempFridge.toString();

  const results = calculateSimpleDough(numberOfBalls, hoursTotal, yeastType, tempRt, tempFridge, currentPizzaStyle);

  // Update ingredient displays
  if (elements.simpleFlourRes) elements.simpleFlourRes.textContent = results.flourGrams.toFixed(1);
  if (elements.simpleWaterRes) elements.simpleWaterRes.textContent = results.waterGrams.toFixed(1);
  if (elements.simpleSaltRes) elements.simpleSaltRes.textContent = results.saltGrams.toFixed(1);
  if (elements.simpleYeastRes) elements.simpleYeastRes.textContent = results.yeastGrams.toFixed(2);

  if (currentMode === 'simple') {
    if (elements.quickFlour) elements.quickFlour.textContent = `🌾 ${results.flourGrams.toFixed(1)}g`;
    if (elements.quickWater) elements.quickWater.textContent = `💧 ${results.waterGrams.toFixed(1)}g`;
    if (elements.quickYeast) elements.quickYeast.textContent = `🧫 ${results.yeastGrams.toFixed(2)}g`;
  }

  // Update simple yeast label title
  if (elements.simpleYeastTitle) {
    elements.simpleYeastTitle.textContent =
      (yeastType as string) === 'Instant Dry' ? t.yeastDryLabel : t.yeastFreshLabel;
  }

  // Dough Summary text
  if (elements.simpleDoughSummaryDisplay) {
    const summaryTemplate = t.simpleDoughSummary || 'Masa total: {total}g ({balls} bolas de {weight}g)';
    elements.simpleDoughSummaryDisplay.textContent = summaryTemplate
      .replace('{total}', results.totalDoughWeight.toFixed(1))
      .replace('{balls}', numberOfBalls.toString())
      .replace('{weight}', results.ballWeight.toString());
  }

  // Update defaults notice depending on active pizza style
  if (elements.simpleDefaultsNotice) {
    elements.simpleDefaultsNotice.textContent =
      currentPizzaStyle === 'tonda_romana' ? t.simpleDefaultsInfoTondaRomana : t.simpleDefaultsInfoNeapolitan;
  }

  // Time split display text
  if (elements.simpleTimeSplitDisplay) {
    let splitText = '';
    if (results.hoursFridge === 0) {
      const template = t.simpleTimeSplitAmbient || '⚡ {rt}h a Temperatura Ambiente ({tempRt}°C)';
      splitText = template.replace('{rt}', results.hoursRt.toString()).replace('{tempRt}', tempRt.toString());
    } else if (results.hoursRt === 0) {
      const template = t.simpleTimeSplitFridge || '❄️ {fridge}h en Nevera ({tempFridge}°C)';
      splitText = template
        .replace('{fridge}', results.hoursFridge.toString())
        .replace('{tempFridge}', tempFridge.toString());
    } else {
      const template =
        t.simpleTimeSplitCombined || '⚡ {rt}h a Temp. Ambiente ({tempRt}°C) + ❄️ {fridge}h en Nevera ({tempFridge}°C)';
      splitText = template
        .replace('{rt}', results.hoursRt.toString())
        .replace('{tempRt}', tempRt.toString())
        .replace('{fridge}', results.hoursFridge.toString())
        .replace('{tempFridge}', tempFridge.toString());
    }
    elements.simpleTimeSplitDisplay.textContent = splitText;
  }

  // Highlight active preset button if hoursTotal matches
  document.querySelectorAll<HTMLButtonElement>('.preset-btn').forEach((btn) => {
    const btnHours = parseFloat(btn.getAttribute('data-hours') || '0');
    if (btnHours === hoursTotal) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Render Dynamic Preparation Guide
  renderPrepGuide(elements.simplePrepSteps, {
    flourGrams: results.flourGrams,
    waterGrams: results.waterGrams,
    saltGrams: results.saltGrams,
    yeastGrams: results.yeastGrams,
    hoursRt: results.hoursRt,
    tempRt: tempRt,
    hoursFridge: results.hoursFridge,
    tempFridge: tempFridge,
    numberOfBalls: numberOfBalls,
    ballWeight: results.ballWeight,
  });

  saveSimpleState({ numberOfBalls, hoursTotal, yeastType, tempRt, tempFridge, pizzaStyle: currentPizzaStyle });
}

/**
 * Perform calculation and update DOM elements for Advanced Mode
 */
function calculate(): CalculationResults {
  const t = translations[currentLang] || translations.en || translations.es;

  // Extract inputs safely
  const numberOfBalls = Math.max(1, parseInt(elements.numberOfBalls.value, 10) || 1);
  const ballWeight = Math.max(10, parseFloat(elements.ballWeight.value) || 280);
  const hydrationPercentage = parseFloat(elements.hydrationSlider.value) || 65;
  const saltPercentage = parseFloat(elements.saltSlider.value) || 2.5;

  let yeastType: YeastType = 'Fresh';
  elements.yeastInputs.forEach((input) => {
    if (input.checked) yeastType = input.value as YeastType;
  });

  const hoursRt = Math.max(0, parseFloat(elements.hoursRt.value) || 0);
  const tempRt = parseFloat(elements.tempRtSlider.value) || 22;
  const hoursFridge = Math.max(0, parseFloat(elements.hoursFridge.value) || 0);
  const tempFridge = parseFloat(elements.tempFridgeSlider.value) || 4;

  const inputs: DoughInputs = {
    numberOfBalls,
    ballWeight,
    hydrationPercentage,
    saltPercentage,
    yeastType,
    hoursRt,
    tempRt,
    hoursFridge,
    tempFridge,
  };

  const results = calculateDough(inputs);

  // Update Displays
  if (elements.totalDoughWeightDisplay)
    elements.totalDoughWeightDisplay.textContent = `${results.totalDoughWeight.toFixed(1)} g`;
  if (elements.flourRes) elements.flourRes.textContent = results.flourGrams.toFixed(1);
  if (elements.waterRes) elements.waterRes.textContent = results.waterGrams.toFixed(1);
  if (elements.saltRes) elements.saltRes.textContent = results.saltGrams.toFixed(1);
  if (elements.yeastRes) elements.yeastRes.textContent = results.yeastGrams.toFixed(2);

  if (currentMode === 'advanced') {
    if (elements.quickFlour) elements.quickFlour.textContent = `🌾 ${results.flourGrams.toFixed(1)}g`;
    if (elements.quickWater) elements.quickWater.textContent = `💧 ${results.waterGrams.toFixed(1)}g`;
    if (elements.quickYeast) elements.quickYeast.textContent = `🧫 ${results.yeastGrams.toFixed(2)}g`;
  }

  // Percentage Badges
  if (elements.waterPctDisplay) elements.waterPctDisplay.textContent = `${hydrationPercentage}%`;
  if (elements.saltPctDisplay) elements.saltPctDisplay.textContent = `${saltPercentage}%`;
  if (elements.yeastPctDisplay) elements.yeastPctDisplay.textContent = `${results.yeastPercentage.toFixed(3)}%`;

  // Dynamic Yeast Label
  if (elements.yeastLabel) {
    elements.yeastLabel.textContent = (yeastType as string) === 'Instant Dry' ? t.yeastDryLabel : t.yeastFreshLabel;
  }

  // Toggle warning notice if total fermentation time is 0
  if (elements.warningNotice) {
    if (hoursRt + hoursFridge === 0) {
      elements.warningNotice.classList.remove('hidden');
    } else {
      elements.warningNotice.classList.add('hidden');
    }
  }

  // Render Dynamic Preparation Guide
  renderPrepGuide(elements.advancedPrepSteps, {
    flourGrams: results.flourGrams,
    waterGrams: results.waterGrams,
    saltGrams: results.saltGrams,
    yeastGrams: results.yeastGrams,
    hoursRt: hoursRt,
    tempRt: tempRt,
    hoursFridge: hoursFridge,
    tempFridge: tempFridge,
    numberOfBalls: numberOfBalls,
    ballWeight: ballWeight,
  });

  saveState(inputs);
  return results;
}

/**
 * Save current settings to LocalStorage
 */
function saveState(state: DoughInputs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

function saveSimpleState(state: {
  numberOfBalls: number;
  hoursTotal: number;
  yeastType: YeastType;
  tempRt: number;
  tempFridge: number;
  pizzaStyle?: PizzaStyle;
}): void {
  try {
    localStorage.setItem(SIMPLE_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('LocalStorage error saving simple state:', e);
  }
}

/**
 * Load settings from LocalStorage
 */
function loadState(): void {
  try {
    const savedMode = localStorage.getItem(MODE_KEY) as AppMode | null;
    if (savedMode === 'simple' || savedMode === 'advanced') {
      currentMode = savedMode;
    }

    const savedStyle = localStorage.getItem(STYLE_KEY) as PizzaStyle | null;
    if (savedStyle === 'neapolitan' || savedStyle === 'tonda_romana') {
      currentPizzaStyle = savedStyle;
    }

    const savedSimple = localStorage.getItem(SIMPLE_STORAGE_KEY);
    if (savedSimple) {
      const simpleData = JSON.parse(savedSimple);
      if (simpleData.numberOfBalls !== undefined && elements.simpleBalls)
        elements.simpleBalls.value = simpleData.numberOfBalls.toString();
      if (simpleData.hoursTotal !== undefined && elements.simpleHours)
        elements.simpleHours.value = simpleData.hoursTotal.toString();
      if (simpleData.yeastType && elements.simpleYeastInputs) {
        elements.simpleYeastInputs.forEach((input) => {
          input.checked = String(input.value) === String(simpleData.yeastType);
        });
      }
      if (simpleData.tempRt !== undefined && elements.simpleTempRtSlider) {
        elements.simpleTempRtSlider.value = simpleData.tempRt.toString();
        if (elements.simpleTempRtVal) elements.simpleTempRtVal.textContent = simpleData.tempRt.toString();
      }
      if (simpleData.tempFridge !== undefined && elements.simpleTempFridgeSlider) {
        elements.simpleTempFridgeSlider.value = simpleData.tempFridge.toString();
        if (elements.simpleTempFridgeVal) elements.simpleTempFridgeVal.textContent = simpleData.tempFridge.toString();
      }
      if (simpleData.pizzaStyle === 'neapolitan' || simpleData.pizzaStyle === 'tonda_romana') {
        currentPizzaStyle = simpleData.pizzaStyle;
      }
    }

    document.querySelectorAll('pizza-style-selector').forEach((el) => {
      el.setAttribute('active-style', currentPizzaStyle);
    });

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state: Partial<DoughInputs> = JSON.parse(saved);

      if (state.numberOfBalls !== undefined) elements.numberOfBalls.value = state.numberOfBalls.toString();
      if (state.ballWeight !== undefined) elements.ballWeight.value = state.ballWeight.toString();

      if (state.hydrationPercentage !== undefined) {
        elements.hydrationSlider.value = state.hydrationPercentage.toString();
        elements.hydrationVal.textContent = state.hydrationPercentage.toString();
      }

      if (state.saltPercentage !== undefined) {
        elements.saltSlider.value = state.saltPercentage.toString();
        elements.saltVal.textContent = state.saltPercentage.toString();
      }

      if (state.yeastType) {
        elements.yeastInputs.forEach((input) => {
          input.checked = String(input.value) === String(state.yeastType);
        });
      }

      if (state.hoursRt !== undefined) elements.hoursRt.value = state.hoursRt.toString();
      if (state.tempRt !== undefined) {
        elements.tempRtSlider.value = state.tempRt.toString();
        elements.tempRtVal.textContent = state.tempRt.toString();
      }

      if (state.hoursFridge !== undefined) elements.hoursFridge.value = state.hoursFridge.toString();
      if (state.tempFridge !== undefined) {
        elements.tempFridgeSlider.value = state.tempFridge.toString();
        elements.tempFridgeVal.textContent = state.tempFridge.toString();
      }
    }
  } catch (e) {
    console.warn('Failed to load saved state:', e);
  }
}

/**
 * Manage Light/Dark Theme Switching
 */
function initTheme(): void {
  const savedTheme = (localStorage.getItem(THEME_KEY) as ThemeMode) || DEFAULT_THEME;
  setTheme(savedTheme);

  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener('click', () => {
      const currentTheme: ThemeMode = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      const nextTheme: ThemeMode = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }
}

function setTheme(theme: ThemeMode): void {
  if (theme === 'dark') {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    if (elements.sunIcon) elements.sunIcon.classList.remove('hidden');
    if (elements.moonIcon) elements.moonIcon.classList.add('hidden');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    if (elements.sunIcon) elements.sunIcon.classList.add('hidden');
    if (elements.moonIcon) elements.moonIcon.classList.remove('hidden');
  }
  localStorage.setItem(THEME_KEY, theme);
}

let deferredInstallPrompt: any = null;
let activeSwRegistration: ServiceWorkerRegistration | null = null;
let isRefreshing = false;

export function setSwRegistration(reg: ServiceWorkerRegistration | null): void {
  activeSwRegistration = reg;
}

function initPwaToasts(): void {
  const pwaUpdateToast = document.getElementById('pwaUpdateToast');
  const pwaUpdateBtn = document.getElementById('pwaUpdateBtn');
  const pwaUpdateCloseBtn = document.getElementById('pwaUpdateCloseBtn');

  const pwaInstallToast = document.getElementById('pwaInstallToast');
  const pwaInstallBtn = document.getElementById('pwaInstallBtn');
  const pwaInstallCloseBtn = document.getElementById('pwaInstallCloseBtn');

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (pwaInstallToast) {
      pwaInstallToast.classList.remove('hidden');
    }
  });

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          console.log('[PWA] User accepted install prompt');
        }
        deferredInstallPrompt = null;
      }
      if (pwaInstallToast) pwaInstallToast.classList.add('hidden');
    });
  }

  if (pwaInstallCloseBtn && pwaInstallToast) {
    pwaInstallCloseBtn.addEventListener('click', () => {
      pwaInstallToast.classList.add('hidden');
    });
  }

  if (pwaUpdateCloseBtn && pwaUpdateToast) {
    pwaUpdateCloseBtn.addEventListener('click', () => {
      pwaUpdateToast.classList.add('hidden');
    });
  }

  if (pwaUpdateBtn) {
    pwaUpdateBtn.addEventListener('click', () => {
      const waitingWorker = activeSwRegistration?.waiting;
      if (waitingWorker) {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      }
      if (!('serviceWorker' in navigator) || !waitingWorker) {
        if (!isRefreshing) {
          isRefreshing = true;
          window.location.reload();
        }
      }
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!isRefreshing) {
        isRefreshing = true;
        window.location.reload();
      }
    });
  }

  // Automatic recovery for 404 asset/chunk load failures (scripts & stylesheets) after deployment
  window.addEventListener(
    'error',
    (event) => {
      const target = event.target as HTMLElement | null;
      const isScriptError = target && target.tagName === 'SCRIPT';
      const isStyleError = target && target.tagName === 'LINK';

      if (isScriptError || isStyleError) {
        console.warn(
          `[PWA] ${isScriptError ? 'Script' : 'Stylesheet'} load error detected (outdated asset). Auto-reloading page...`,
        );
        if (!isRefreshing) {
          isRefreshing = true;
          window.location.reload();
        }
      }
    },
    true,
  );

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('previewPwa')) {
    if (pwaUpdateToast) pwaUpdateToast.classList.remove('hidden');
    if (pwaInstallToast) pwaInstallToast.classList.remove('hidden');
  }
}

/**
 * Copy Recipe to Clipboard
 */
function copyRecipeToClipboard(): void {
  const t = translations[currentLang] || translations.en || translations.es;
  let text = '';
  if (currentMode === 'simple') {
    const balls = elements.simpleBalls?.value || '4';
    const flour = elements.simpleFlourRes?.textContent || '0';
    const water = elements.simpleWaterRes?.textContent || '0';
    const salt = elements.simpleSaltRes?.textContent || '0';
    const yeast = elements.simpleYeastRes?.textContent || '0';
    const yeastTitle = elements.simpleYeastTitle?.textContent || 'Levadura';
    const timeSplit = elements.simpleTimeSplitDisplay?.textContent || '';

    text =
      `🍕 Pizza Calculator (${t.modeSimple})\n` +
      `-------------------------\n` +
      `• ${t.numberOfBalls}: ${balls}\n` +
      `• ${t.flour}: ${flour}g\n` +
      `• ${t.water}: ${water}g\n` +
      `• ${t.saltIngredient}: ${salt}g\n` +
      `• ${yeastTitle}: ${yeast}g\n` +
      `• ${timeSplit}\n` +
      `-------------------------\n` +
      `${currentPizzaStyle === 'tonda_romana' ? t.simpleDefaultsInfoTondaRomana : t.simpleDefaultsInfoNeapolitan}`;
  } else {
    const balls = elements.numberOfBalls?.value || '1';
    const weight = elements.ballWeight?.value || '280';
    const flour = elements.flourRes?.textContent || '0';
    const water = elements.waterRes?.textContent || '0';
    const salt = elements.saltRes?.textContent || '0';
    const yeast = elements.yeastRes?.textContent || '0';
    const yeastTitle = elements.yeastLabel?.textContent || 'Levadura';
    const hydration = elements.hydrationVal?.textContent || '65';
    const saltPct = elements.saltVal?.textContent || '2.5';
    const yeastPct = elements.yeastPctDisplay?.textContent || '0';

    text =
      `🍕 Pizza Calculator (${t.modeAdvanced})\n` +
      `-------------------------\n` +
      `• ${t.numberOfBalls}: ${balls} (${weight}g/c.u.)\n` +
      `• ${t.flour}: ${flour}g (100%)\n` +
      `• ${t.water}: ${water}g (${hydration}%)\n` +
      `• ${t.saltIngredient}: ${salt}g (${saltPct}%)\n` +
      `• ${yeastTitle}: ${yeast}g (${yeastPct})\n` +
      `-------------------------\n` +
      `TA: ${elements.hoursRt?.value || 0}h @ ${elements.tempRtVal?.textContent || 22}°C | Frigo: ${elements.hoursFridge?.value || 0}h @ ${elements.tempFridgeVal?.textContent || 4}°C`;
  }

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  const toast = elements.copyToast;
  if (toast) {
    const msgEl = document.getElementById('copyToastMsg');
    const t = translations[currentLang] || translations.es;
    if (msgEl) msgEl.textContent = t.recipeCopiedToast;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2500);
  }
}

/**
 * Build shareable URL containing recipe parameters
 */
export function buildShareableUrl(): string {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('mode', currentMode);
  url.searchParams.set('style', currentPizzaStyle);
  url.searchParams.set('lang', currentLang);

  if (currentMode === 'simple') {
    if (elements.simpleBalls) url.searchParams.set('balls', elements.simpleBalls.value);
    if (elements.simpleHours) url.searchParams.set('hours', elements.simpleHours.value);
    if (elements.simpleTempRtSlider) url.searchParams.set('tempRt', elements.simpleTempRtSlider.value);
    if (elements.simpleTempFridgeSlider) url.searchParams.set('tempFridge', elements.simpleTempFridgeSlider.value);
    const simpleYeast = Array.from(elements.simpleYeastInputs || []).find((i) => i.checked)?.value || 'Fresh';
    url.searchParams.set('yeast', simpleYeast);
  } else {
    if (elements.numberOfBalls) url.searchParams.set('balls', elements.numberOfBalls.value);
    if (elements.ballWeight) url.searchParams.set('weight', elements.ballWeight.value);
    if (elements.hydrationSlider) url.searchParams.set('hydration', elements.hydrationSlider.value);
    if (elements.saltSlider) url.searchParams.set('salt', elements.saltSlider.value);
    if (elements.hoursRt) url.searchParams.set('hoursRt', elements.hoursRt.value);
    if (elements.tempRtSlider) url.searchParams.set('tempRt', elements.tempRtSlider.value);
    if (elements.hoursFridge) url.searchParams.set('hoursFridge', elements.hoursFridge.value);
    if (elements.tempFridgeSlider) url.searchParams.set('tempFridge', elements.tempFridgeSlider.value);
    const yeast = Array.from(elements.yeastInputs || []).find((i) => i.checked)?.value || 'Fresh';
    url.searchParams.set('yeast', yeast);
  }

  return url.toString();
}

/**
 * Share Recipe URL handler (Web Share API with fallback to Clipboard)
 */
function shareRecipeToClipboard(): void {
  const shareUrl = buildShareableUrl();
  const t = translations[currentLang] || translations.es;

  if (navigator.share) {
    navigator
      .share({
        title: 'PizzaCalc | Recipe',
        text: '¡Mira mi receta de masa de pizza en PizzaCalc! 🍕',
        url: shareUrl,
      })
      .catch(() => {
        copyUrlToClipboard(shareUrl, t.linkCopiedToast);
      });
  } else {
    copyUrlToClipboard(shareUrl, t.linkCopiedToast);
  }
}

function copyUrlToClipboard(text: string, toastMsg: string): void {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast(toastMsg))
      .catch(() => {});
  }
  showToast(toastMsg);
}

function showToast(customMessage?: string): void {
  const toast = elements.copyToast;
  const msgEl = document.getElementById('copyToastMsg');
  if (msgEl && customMessage) {
    msgEl.textContent = customMessage;
  }
  if (toast) {
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2500);
  }
}

/**
 * Parse URL Query Parameters on App Load
 */
export function parseUrlParameters(): boolean {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('mode') && !params.has('style') && !params.has('balls') && !params.has('lang')) {
    return false;
  }

  const lang = params.get('lang') as LanguageCode | null;
  if (lang && ['es', 'en', 'it', 'fr', 'de'].includes(lang)) {
    currentLang = lang;
    setSavedLanguage(lang);
  }

  const mode = params.get('mode') as AppMode | null;
  if (mode === 'simple' || mode === 'advanced') {
    currentMode = mode;
  }

  const style = params.get('style') as PizzaStyle | null;
  if (style === 'neapolitan' || style === 'tonda_romana') {
    currentPizzaStyle = style;
  }

  if (currentMode === 'simple') {
    const balls = params.get('balls');
    if (balls && elements.simpleBalls) elements.simpleBalls.value = balls;

    const hours = params.get('hours');
    if (hours && elements.simpleHours) {
      elements.simpleHours.value = hours;
      if (elements.simpleHoursVal) elements.simpleHoursVal.textContent = hours;
    }

    const tempRt = params.get('tempRt');
    if (tempRt && elements.simpleTempRtSlider) {
      elements.simpleTempRtSlider.value = tempRt;
      if (elements.simpleTempRtVal) elements.simpleTempRtVal.textContent = tempRt;
    }

    const tempFridge = params.get('tempFridge');
    if (tempFridge && elements.simpleTempFridgeSlider) {
      elements.simpleTempFridgeSlider.value = tempFridge;
      if (elements.simpleTempFridgeVal) elements.simpleTempFridgeVal.textContent = tempFridge;
    }

    const yeast = params.get('yeast');
    if (yeast && elements.simpleYeastInputs) {
      elements.simpleYeastInputs.forEach((i) => {
        i.checked = i.value === yeast;
      });
    }
  } else {
    const balls = params.get('balls');
    if (balls && elements.numberOfBalls) elements.numberOfBalls.value = balls;

    const weight = params.get('weight');
    if (weight && elements.ballWeight) elements.ballWeight.value = weight;

    const hydration = params.get('hydration');
    if (hydration && elements.hydrationSlider) {
      elements.hydrationSlider.value = hydration;
      if (elements.hydrationVal) elements.hydrationVal.textContent = hydration;
    }

    const salt = params.get('salt');
    if (salt && elements.saltSlider) {
      elements.saltSlider.value = salt;
      if (elements.saltVal) elements.saltVal.textContent = salt;
    }

    const hoursRt = params.get('hoursRt');
    if (hoursRt && elements.hoursRt) elements.hoursRt.value = hoursRt;

    const tempRt = params.get('tempRt');
    if (tempRt && elements.tempRtSlider) {
      elements.tempRtSlider.value = tempRt;
      if (elements.tempRtVal) elements.tempRtVal.textContent = tempRt;
    }

    const hoursFridge = params.get('hoursFridge');
    if (hoursFridge && elements.hoursFridge) elements.hoursFridge.value = hoursFridge;

    const tempFridge = params.get('tempFridge');
    if (tempFridge && elements.tempFridgeSlider) {
      elements.tempFridgeSlider.value = tempFridge;
      if (elements.tempFridgeVal) elements.tempFridgeVal.textContent = tempFridge;
    }

    const yeast = params.get('yeast');
    if (yeast && elements.yeastInputs) {
      elements.yeastInputs.forEach((i) => {
        i.checked = i.value === yeast;
      });
    }
  }

  return true;
}

/**
 * Attach Event Listeners
 */

export function initApp(): void {
  isRefreshing = false;
  initTheme();
  const hasUrlParams = parseUrlParameters();
  if (!hasUrlParams) {
    loadState();
  }
  setMode(currentMode);
  applyLanguage(currentLang);
  initEventListeners();
  initPwaToasts();
}

function initEventListeners(): void {
  // Listen for pizza style changes
  document.addEventListener('style-change', (e: Event) => {
    const customEvent = e as CustomEvent<{ style: PizzaStyle }>;
    if (customEvent.detail?.style) {
      setPizzaStyle(customEvent.detail.style, true);
    }
  });

  // Share Recipe Buttons
  if (elements.simpleShareBtn) {
    elements.simpleShareBtn.addEventListener('click', shareRecipeToClipboard);
  }
  if (elements.advancedShareBtn) {
    elements.advancedShareBtn.addEventListener('click', shareRecipeToClipboard);
  }

  // Copy Recipe Buttons
  if (elements.simpleCopyBtn) {
    elements.simpleCopyBtn.addEventListener('click', copyRecipeToClipboard);
  }
  if (elements.advancedCopyBtn) {
    elements.advancedCopyBtn.addEventListener('click', copyRecipeToClipboard);
  }
  // Mode Switcher Tabs
  if (elements.tabSimple && elements.tabAdvanced) {
    elements.tabSimple.addEventListener('click', () => setMode('simple'));
    elements.tabAdvanced.addEventListener('click', () => setMode('advanced'));
  }

  // Simple Mode Input Listeners
  if (elements.simpleBalls) {
    elements.simpleBalls.addEventListener('input', calculateSimple);
    elements.simpleBalls.addEventListener('change', calculateSimple);
  }
  if (elements.simpleHours) {
    elements.simpleHours.addEventListener('input', calculateSimple);
    elements.simpleHours.addEventListener('change', calculateSimple);
  }

  // Simple Yeast Radio buttons
  if (elements.simpleYeastInputs) {
    elements.simpleYeastInputs.forEach((input) => {
      input.addEventListener('change', calculateSimple);
    });
  }

  // Simple Temperature Sliders
  if (elements.simpleTempRtSlider) {
    elements.simpleTempRtSlider.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (elements.simpleTempRtVal) elements.simpleTempRtVal.textContent = target.value;
      calculateSimple();
    });
    elements.simpleTempRtSlider.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (elements.simpleTempRtVal) elements.simpleTempRtVal.textContent = target.value;
      calculateSimple();
    });
  }

  if (elements.simpleTempFridgeSlider) {
    elements.simpleTempFridgeSlider.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (elements.simpleTempFridgeVal) elements.simpleTempFridgeVal.textContent = target.value;
      calculateSimple();
    });
    elements.simpleTempFridgeSlider.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (elements.simpleTempFridgeVal) elements.simpleTempFridgeVal.textContent = target.value;
      calculateSimple();
    });
  }

  // Simple Mode Stepper Buttons (+ / -)
  document.querySelectorAll<HTMLButtonElement>('.btn-step-simple').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const actionValue = parseFloat(btn.getAttribute('data-action') || '0');
      const inputEl = document.getElementById(targetId || '') as HTMLInputElement | null;

      if (inputEl) {
        const current = parseFloat(inputEl.value) || 0;
        const min = parseFloat(inputEl.getAttribute('min') || '1');
        const max = parseFloat(inputEl.getAttribute('max') || '100');
        const newValue = Math.min(max, Math.max(min, current + actionValue));
        inputEl.value = newValue.toString();
        calculateSimple();
      }
    });
  });

  // Preset Buttons (4h, 8h, 24h, 48h)
  document.querySelectorAll<HTMLButtonElement>('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const hours = parseFloat(btn.getAttribute('data-hours') || '8');
      if (elements.simpleHours) {
        elements.simpleHours.value = hours.toString();
        calculateSimple();
      }
    });
  });

  // Language Popover Menu Listeners
  if (elements.langMenuBtn && elements.langPopover) {
    elements.langMenuBtn.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      const isHidden = elements.langPopover?.classList.contains('hidden');
      if (isHidden) {
        elements.langPopover?.classList.remove('hidden');
        elements.langMenuBtn?.setAttribute('aria-expanded', 'true');
      } else {
        elements.langPopover?.classList.add('hidden');
        elements.langMenuBtn?.setAttribute('aria-expanded', 'false');
      }
    });

    document.querySelectorAll<HTMLButtonElement>('.lang-option-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang') as LanguageCode;
        if (lang) {
          applyLanguage(lang);
          elements.langPopover?.classList.add('hidden');
          elements.langMenuBtn?.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', (e: MouseEvent) => {
      if (elements.langPopover && elements.langMenuBtn) {
        if (
          !elements.langPopover.classList.contains('hidden') &&
          !elements.langPopover.contains(e.target as Node) &&
          !elements.langMenuBtn.contains(e.target as Node)
        ) {
          elements.langPopover.classList.add('hidden');
          elements.langMenuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && elements.langPopover && !elements.langPopover.classList.contains('hidden')) {
        elements.langPopover.classList.add('hidden');
        if (elements.langMenuBtn) elements.langMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Sync slider label values and trigger calculate for Advanced mode
  if (elements.hydrationSlider) {
    elements.hydrationSlider.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (elements.hydrationVal) elements.hydrationVal.textContent = target.value;
      calculate();
    });
  }

  if (elements.saltSlider) {
    elements.saltSlider.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (elements.saltVal) elements.saltVal.textContent = target.value;
      calculate();
    });
  }

  if (elements.tempRtSlider) {
    elements.tempRtSlider.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (elements.tempRtVal) elements.tempRtVal.textContent = target.value;
      calculate();
    });
    elements.tempRtSlider.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (elements.tempRtVal) elements.tempRtVal.textContent = target.value;
      calculate();
    });
  }

  if (elements.tempFridgeSlider) {
    elements.tempFridgeSlider.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (elements.tempFridgeVal) elements.tempFridgeVal.textContent = target.value;
      calculate();
    });
    elements.tempFridgeSlider.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (elements.tempFridgeVal) elements.tempFridgeVal.textContent = target.value;
      calculate();
    });
  }

  // Numeric Inputs for Advanced mode
  [elements.numberOfBalls, elements.ballWeight, elements.hoursRt, elements.hoursFridge].forEach((input) => {
    if (input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    }
  });

  // Yeast Type Radio buttons
  if (elements.yeastInputs) {
    elements.yeastInputs.forEach((input) => {
      input.addEventListener('change', calculate);
    });
  }

  // Stepper Buttons (+ / -) for Advanced mode
  document.querySelectorAll<HTMLButtonElement>('.btn-step').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const actionValue = parseFloat(btn.getAttribute('data-action') || '0');
      const inputEl = document.getElementById(targetId || '') as HTMLInputElement | null;

      if (inputEl) {
        const current = parseFloat(inputEl.value) || 0;
        const min = parseFloat(inputEl.getAttribute('min') || '0');
        const max = parseFloat(inputEl.getAttribute('max') || '1000');
        const newValue = Math.min(max, Math.max(min, current + actionValue));
        inputEl.value = newValue.toString();
        calculate();
      }
    });
  });

  // Reset Button
  if (elements.resetBtn) {
    elements.resetBtn.addEventListener('click', () => {
      if (elements.simpleBalls) elements.simpleBalls.value = '4';
      if (elements.simpleHours) elements.simpleHours.value = '8';
      if (elements.simpleYeastInputs) {
        elements.simpleYeastInputs.forEach((input) => {
          input.checked = input.value === 'Fresh';
        });
      }
      if (elements.simpleTempRtSlider) {
        elements.simpleTempRtSlider.value = '22';
        if (elements.simpleTempRtVal) elements.simpleTempRtVal.textContent = '22';
      }
      if (elements.simpleTempFridgeSlider) {
        elements.simpleTempFridgeSlider.value = '4';
        if (elements.simpleTempFridgeVal) elements.simpleTempFridgeVal.textContent = '4';
      }

      if (elements.numberOfBalls) elements.numberOfBalls.value = DEFAULTS.numberOfBalls.toString();
      if (elements.ballWeight) elements.ballWeight.value = DEFAULTS.ballWeight.toString();

      if (elements.hydrationSlider) {
        elements.hydrationSlider.value = DEFAULTS.hydrationPercentage.toString();
        if (elements.hydrationVal) elements.hydrationVal.textContent = DEFAULTS.hydrationPercentage.toString();
      }

      if (elements.saltSlider) {
        elements.saltSlider.value = DEFAULTS.saltPercentage.toString();
        if (elements.saltVal) elements.saltVal.textContent = DEFAULTS.saltPercentage.toString();
      }

      if (elements.yeastInputs) {
        elements.yeastInputs.forEach((input) => {
          input.checked = String(input.value) === String(DEFAULTS.yeastType);
        });
      }

      if (elements.hoursRt) elements.hoursRt.value = DEFAULTS.hoursRt.toString();
      if (elements.tempRtSlider) {
        elements.tempRtSlider.value = DEFAULTS.tempRt.toString();
        if (elements.tempRtVal) elements.tempRtVal.textContent = DEFAULTS.tempRt.toString();
      }

      if (elements.hoursFridge) elements.hoursFridge.value = DEFAULTS.hoursFridge.toString();
      if (elements.tempFridgeSlider) {
        elements.tempFridgeSlider.value = DEFAULTS.tempFridge.toString();
        if (elements.tempFridgeVal) elements.tempFridgeVal.textContent = DEFAULTS.tempFridge.toString();
      }

      setPizzaStyle('neapolitan', true);
    });
  }
}

// Initial Bootstrapping
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Register Service Worker for PWA Offline Capabilities & Cache Versioning
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        setSwRegistration(reg);
        console.log('[PWA] ServiceWorker registered with scope:', reg.scope);
        const pwaUpdateToast = document.getElementById('pwaUpdateToast');

        if (reg.waiting && navigator.serviceWorker.controller && pwaUpdateToast) {
          pwaUpdateToast.classList.remove('hidden');
        }

        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller && pwaUpdateToast) {
                pwaUpdateToast.classList.remove('hidden');
              }
            };
          }
        };
      })
      .catch((err) => console.warn('[PWA] ServiceWorker registration failed:', err));
  });
}

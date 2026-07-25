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

// Current active language & mode state
let currentLang: LanguageCode = getInitialLanguage();
let currentMode: AppMode = 'simple';

// DOM Element Registry
const elements = {
  // Mode Tabs & Containers
  tabSimple: document.getElementById('tabSimple') as HTMLButtonElement,
  tabAdvanced: document.getElementById('tabAdvanced') as HTMLButtonElement,
  simpleModeContainer: document.getElementById('simpleModeContainer') as HTMLElement,
  advancedModeContainer: document.getElementById('advancedModeContainer') as HTMLElement,

  // Simple Mode Controls & Displays
  simpleBalls: document.getElementById('simpleBalls') as HTMLInputElement,
  simpleHours: document.getElementById('simpleHours') as HTMLInputElement,
  simpleHoursVal: document.getElementById('simpleHoursVal') as HTMLElement,
  simpleYeastInputs: document.getElementsByName('simpleYeastType') as NodeListOf<HTMLInputElement>,
  simpleTempRtSlider: document.getElementById('simpleTempRtSlider') as HTMLInputElement,
  simpleTempRtVal: document.getElementById('simpleTempRtVal') as HTMLElement,
  simpleTempFridgeSlider: document.getElementById('simpleTempFridgeSlider') as HTMLInputElement,
  simpleTempFridgeVal: document.getElementById('simpleTempFridgeVal') as HTMLElement,
  simpleTimeSplitDisplay: document.getElementById('simpleTimeSplitDisplay') as HTMLElement,
  simpleDoughSummaryDisplay: document.getElementById('simpleDoughSummaryDisplay') as HTMLElement,
  simpleFlourRes: document.getElementById('simpleFlourRes') as HTMLElement,
  simpleWaterRes: document.getElementById('simpleWaterRes') as HTMLElement,
  simpleSaltRes: document.getElementById('simpleSaltRes') as HTMLElement,
  simpleYeastRes: document.getElementById('simpleYeastRes') as HTMLElement,
  simpleYeastTitle: document.getElementById('simpleYeastTitle') as HTMLElement,

  // Advanced Mode Inputs
  numberOfBalls: document.getElementById('numberOfBalls') as HTMLInputElement,
  ballWeight: document.getElementById('ballWeight') as HTMLInputElement,
  hydrationSlider: document.getElementById('hydrationSlider') as HTMLInputElement,
  hydrationVal: document.getElementById('hydrationVal') as HTMLElement,
  saltSlider: document.getElementById('saltSlider') as HTMLInputElement,
  saltVal: document.getElementById('saltVal') as HTMLElement,
  yeastInputs: document.getElementsByName('yeastType') as NodeListOf<HTMLInputElement>,
  hoursRt: document.getElementById('hoursRt') as HTMLInputElement,
  tempRtSlider: document.getElementById('tempRtSlider') as HTMLInputElement,
  tempRtVal: document.getElementById('tempRtVal') as HTMLElement,
  hoursFridge: document.getElementById('hoursFridge') as HTMLInputElement,
  tempFridgeSlider: document.getElementById('tempFridgeSlider') as HTMLInputElement,
  tempFridgeVal: document.getElementById('tempFridgeVal') as HTMLElement,

  // Advanced Output Displays
  totalDoughWeightDisplay: document.getElementById('totalDoughWeightDisplay') as HTMLElement,
  flourRes: document.getElementById('flourRes') as HTMLElement,
  waterRes: document.getElementById('waterRes') as HTMLElement,
  saltRes: document.getElementById('saltRes') as HTMLElement,
  yeastRes: document.getElementById('yeastRes') as HTMLElement,
  waterPctDisplay: document.getElementById('waterPctDisplay') as HTMLElement,
  saltPctDisplay: document.getElementById('saltPctDisplay') as HTMLElement,
  yeastPctDisplay: document.getElementById('yeastPctDisplay') as HTMLElement,
  yeastLabel: document.getElementById('yeastLabel') as HTMLElement,
  warningNotice: document.getElementById('warningNotice') as HTMLElement,

  // Buttons & Controls
  resetBtn: document.getElementById('resetBtn') as HTMLButtonElement,
  themeToggleBtn: document.getElementById('themeToggleBtn') as HTMLButtonElement,
  sunIcon: document.getElementById('sunIcon') as HTMLElement,
  moonIcon: document.getElementById('moonIcon') as HTMLElement,

  // Language Popover UI
  langMenuBtn: document.getElementById('langMenuBtn') as HTMLButtonElement | null,
  currentLangBadge: document.getElementById('currentLangBadge') as HTMLElement | null,
  langPopover: document.getElementById('langPopover') as HTMLElement | null,
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

  const results = calculateSimpleDough(numberOfBalls, hoursTotal, yeastType, tempRt, tempFridge);

  // Update ingredient displays
  if (elements.simpleFlourRes) elements.simpleFlourRes.textContent = results.flourGrams.toFixed(1);
  if (elements.simpleWaterRes) elements.simpleWaterRes.textContent = results.waterGrams.toFixed(1);
  if (elements.simpleSaltRes) elements.simpleSaltRes.textContent = results.saltGrams.toFixed(1);
  if (elements.simpleYeastRes) elements.simpleYeastRes.textContent = results.yeastGrams.toFixed(2);

  // Update simple yeast label title
  if (elements.simpleYeastTitle) {
    elements.simpleYeastTitle.textContent =
      (yeastType as string) === 'Instant Dry' ? t.yeastDryLabel : t.yeastFreshLabel;
  }

  // Dough Summary text
  if (elements.simpleDoughSummaryDisplay) {
    const summaryTemplate = t.simpleDoughSummary || 'Masa total: {total}g ({balls} bolas de 280g)';
    elements.simpleDoughSummaryDisplay.textContent = summaryTemplate
      .replace('{total}', results.totalDoughWeight.toFixed(1))
      .replace('{balls}', numberOfBalls.toString());
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

  saveSimpleState({ numberOfBalls, hoursTotal, yeastType, tempRt, tempFridge });
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
    }

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

  elements.themeToggleBtn.addEventListener('click', () => {
    const currentTheme: ThemeMode = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const nextTheme: ThemeMode = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

function setTheme(theme: ThemeMode): void {
  if (theme === 'dark') {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    elements.sunIcon.classList.remove('hidden');
    elements.moonIcon.classList.add('hidden');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    elements.sunIcon.classList.add('hidden');
    elements.moonIcon.classList.remove('hidden');
  }
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * PWA Install & Update Toast Handlers
 */
let deferredInstallPrompt: any = null;

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
      window.location.reload();
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (pwaUpdateToast) {
        pwaUpdateToast.classList.remove('hidden');
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('previewPwa')) {
    if (pwaUpdateToast) pwaUpdateToast.classList.remove('hidden');
    if (pwaInstallToast) pwaInstallToast.classList.remove('hidden');
  }
}

/**
 * Attach Event Listeners
 */
function initEventListeners(): void {
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
  }

  if (elements.simpleTempFridgeSlider) {
    elements.simpleTempFridgeSlider.addEventListener('input', (e: Event) => {
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
      const isHidden = elements.langPopover!.classList.contains('hidden');
      if (isHidden) {
        elements.langPopover!.classList.remove('hidden');
        elements.langMenuBtn!.setAttribute('aria-expanded', 'true');
      } else {
        elements.langPopover!.classList.add('hidden');
        elements.langMenuBtn!.setAttribute('aria-expanded', 'false');
      }
    });

    document.querySelectorAll<HTMLButtonElement>('.lang-option-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang') as LanguageCode;
        if (lang) {
          applyLanguage(lang);
          elements.langPopover!.classList.add('hidden');
          elements.langMenuBtn!.setAttribute('aria-expanded', 'false');
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
  elements.hydrationSlider.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    elements.hydrationVal.textContent = target.value;
    calculate();
  });

  elements.saltSlider.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    elements.saltVal.textContent = target.value;
    calculate();
  });

  elements.tempRtSlider.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    elements.tempRtVal.textContent = target.value;
    calculate();
  });

  elements.tempFridgeSlider.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    elements.tempFridgeVal.textContent = target.value;
    calculate();
  });

  // Numeric Inputs for Advanced mode
  [elements.numberOfBalls, elements.ballWeight, elements.hoursRt, elements.hoursFridge].forEach((input) => {
    if (input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    }
  });

  // Yeast Type Radio buttons
  elements.yeastInputs.forEach((input) => {
    input.addEventListener('change', calculate);
  });

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

    elements.numberOfBalls.value = DEFAULTS.numberOfBalls.toString();
    elements.ballWeight.value = DEFAULTS.ballWeight.toString();

    elements.hydrationSlider.value = DEFAULTS.hydrationPercentage.toString();
    elements.hydrationVal.textContent = DEFAULTS.hydrationPercentage.toString();

    elements.saltSlider.value = DEFAULTS.saltPercentage.toString();
    elements.saltVal.textContent = DEFAULTS.saltPercentage.toString();

    elements.yeastInputs.forEach((input) => {
      input.checked = String(input.value) === String(DEFAULTS.yeastType);
    });

    elements.hoursRt.value = DEFAULTS.hoursRt.toString();
    elements.tempRtSlider.value = DEFAULTS.tempRt.toString();
    elements.tempRtVal.textContent = DEFAULTS.tempRt.toString();

    elements.hoursFridge.value = DEFAULTS.hoursFridge.toString();
    elements.tempFridgeSlider.value = DEFAULTS.tempFridge.toString();
    elements.tempFridgeVal.textContent = DEFAULTS.tempFridge.toString();

    calculateSimple();
    calculate();
  });
}

// Initial Bootstrapping
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadState();
  setMode(currentMode);
  applyLanguage(currentLang);
  initEventListeners();
  initPwaToasts();
});

// Register Service Worker for PWA Offline Capabilities & Cache Versioning
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => console.log('[PWA] ServiceWorker registered with scope:', reg.scope))
      .catch((err) => console.warn('[PWA] ServiceWorker registration failed:', err));
  });
}

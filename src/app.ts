/**
 * Pizza Dough Calculator - Client-side UI & Binding Engine (TypeScript)
 * Internationalization: Scalable N-language support with custom floating popover UI
 */

import { translations, getInitialLanguage, setSavedLanguage, LanguageCode } from './i18n.ts';
import { calculateDough, DoughInputs, CalculationResults, YeastType, DEFAULTS } from './calculator.ts';

export type ThemeMode = 'dark' | 'light';

const DEFAULT_THEME: ThemeMode = 'dark';
const STORAGE_KEY = 'pizza_calculator_settings_v1';
const THEME_KEY = 'pizza_calculator_theme';

// Current active language state
let currentLang: LanguageCode = getInitialLanguage();

// DOM Element Registry
const elements = {
  // Inputs
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

  // Output Displays
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
  langPopover: document.getElementById('langPopover') as HTMLElement | null
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
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
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
  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title') as keyof typeof t;
    const val = t[key] || fallback[key];
    if (val) el.title = val;
  });

  // Update header button badge text
  if (elements.currentLangBadge) {
    elements.currentLangBadge.textContent = lang.toUpperCase();
  }

  // Update active state in popover menu
  document.querySelectorAll<HTMLButtonElement>('.lang-option-item').forEach(btn => {
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
}

/**
 * Perform calculation and update DOM elements
 */
function calculate(): CalculationResults {
  const t = translations[currentLang] || translations.en || translations.es;

  // Extract inputs safely
  const numberOfBalls = Math.max(1, parseInt(elements.numberOfBalls.value, 10) || 1);
  const ballWeight = Math.max(10, parseFloat(elements.ballWeight.value) || 280);
  const hydrationPercentage = parseFloat(elements.hydrationSlider.value) || 65;
  const saltPercentage = parseFloat(elements.saltSlider.value) || 2.5;
  
  let yeastType: YeastType = 'Fresh';
  elements.yeastInputs.forEach(input => {
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
    tempFridge
  };

  const results = calculateDough(inputs);

  // Update Displays
  elements.totalDoughWeightDisplay.textContent = `${results.totalDoughWeight.toFixed(1)} g`;
  elements.flourRes.textContent = results.flourGrams.toFixed(1);
  elements.waterRes.textContent = results.waterGrams.toFixed(1);
  elements.saltRes.textContent = results.saltGrams.toFixed(1);
  elements.yeastRes.textContent = results.yeastGrams.toFixed(2);

  // Percentage Badges
  elements.waterPctDisplay.textContent = `${hydrationPercentage}%`;
  elements.saltPctDisplay.textContent = `${saltPercentage}%`;
  elements.yeastPctDisplay.textContent = `${results.yeastPercentage.toFixed(3)}%`;

  // Dynamic Yeast Label
  elements.yeastLabel.textContent = (yeastType as string) === 'Instant Dry' 
    ? t.yeastDryLabel 
    : t.yeastFreshLabel;

  // Toggle warning notice if total fermentation time is 0
  if (hoursRt + hoursFridge === 0) {
    elements.warningNotice.classList.remove('hidden');
  } else {
    elements.warningNotice.classList.add('hidden');
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

/**
 * Load settings from LocalStorage
 */
function loadState(): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
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
      elements.yeastInputs.forEach(input => {
        input.checked = (String(input.value) === String(state.yeastType));
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
 * Attach Event Listeners
 */
function initEventListeners(): void {
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

    // Language option click handlers
    document.querySelectorAll<HTMLButtonElement>('.lang-option-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang') as LanguageCode;
        if (lang) {
          applyLanguage(lang);
          elements.langPopover!.classList.add('hidden');
          elements.langMenuBtn!.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close popover when clicking outside
    document.addEventListener('click', (e: MouseEvent) => {
      if (elements.langPopover && elements.langMenuBtn) {
        if (!elements.langPopover.classList.contains('hidden') && 
            !elements.langPopover.contains(e.target as Node) && 
            !elements.langMenuBtn.contains(e.target as Node)) {
          elements.langPopover.classList.add('hidden');
          elements.langMenuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Close popover on Escape key
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && elements.langPopover && !elements.langPopover.classList.contains('hidden')) {
        elements.langPopover.classList.add('hidden');
        if (elements.langMenuBtn) elements.langMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Sync slider label values and trigger calculate
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

  // Numeric Inputs
  ([elements.numberOfBalls, elements.ballWeight, elements.hoursRt, elements.hoursFridge]).forEach(input => {
    if (input) {
      input.addEventListener('input', calculate);
      input.addEventListener('change', calculate);
    }
  });

  // Yeast Type Radio buttons
  elements.yeastInputs.forEach(input => {
    input.addEventListener('change', calculate);
  });

  // Stepper Buttons (+ / -)
  document.querySelectorAll<HTMLButtonElement>('.btn-step').forEach(btn => {
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
    elements.numberOfBalls.value = DEFAULTS.numberOfBalls.toString();
    elements.ballWeight.value = DEFAULTS.ballWeight.toString();

    elements.hydrationSlider.value = DEFAULTS.hydrationPercentage.toString();
    elements.hydrationVal.textContent = DEFAULTS.hydrationPercentage.toString();

    elements.saltSlider.value = DEFAULTS.saltPercentage.toString();
    elements.saltVal.textContent = DEFAULTS.saltPercentage.toString();

    elements.yeastInputs.forEach(input => {
      input.checked = (String(input.value) === String(DEFAULTS.yeastType));
    });

    elements.hoursRt.value = DEFAULTS.hoursRt.toString();
    elements.tempRtSlider.value = DEFAULTS.tempRt.toString();
    elements.tempRtVal.textContent = DEFAULTS.tempRt.toString();

    elements.hoursFridge.value = DEFAULTS.hoursFridge.toString();
    elements.tempFridgeSlider.value = DEFAULTS.tempFridge.toString();
    elements.tempFridgeVal.textContent = DEFAULTS.tempFridge.toString();

    calculate();
  });
}

// Initial Bootstrapping
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadState();
  applyLanguage(currentLang);
  initEventListeners();
});

// Register Service Worker for PWA Offline Capabilities & Cache Versioning
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[PWA] ServiceWorker registered with scope:', reg.scope))
      .catch(err => console.warn('[PWA] ServiceWorker registration failed:', err));
  });
}

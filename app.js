/**
 * Pizza Dough Calculator - Client-side Engine
 * Algorithm: Baker's Percentages + Accumulated Kinetic Fermentation Model
 * Internationalization: Scalable N-language support with custom floating popover UI
 */

import { translations, getInitialLanguage, setSavedLanguage } from './i18n.js';

// Default Configuration Constants
const DEFAULTS = {
  numberOfBalls: 1,
  ballWeight: 280,
  hydrationPercentage: 65,
  saltPercentage: 2.5,
  yeastType: 'Fresh',
  hoursRt: 4,
  tempRt: 22,
  hoursFridge: 0,
  tempFridge: 4,
  theme: 'dark'
};

const STORAGE_KEY = 'pizza_calculator_settings_v1';
const THEME_KEY = 'pizza_calculator_theme';

// Current active language state
let currentLang = getInitialLanguage();

// DOM Element Registry
const elements = {
  // Inputs
  numberOfBalls: document.getElementById('numberOfBalls'),
  ballWeight: document.getElementById('ballWeight'),
  hydrationSlider: document.getElementById('hydrationSlider'),
  hydrationVal: document.getElementById('hydrationVal'),
  saltSlider: document.getElementById('saltSlider'),
  saltVal: document.getElementById('saltVal'),
  yeastInputs: document.getElementsByName('yeastType'),
  hoursRt: document.getElementById('hoursRt'),
  tempRtSlider: document.getElementById('tempRtSlider'),
  tempRtVal: document.getElementById('tempRtVal'),
  hoursFridge: document.getElementById('hoursFridge'),
  tempFridgeSlider: document.getElementById('tempFridgeSlider'),
  tempFridgeVal: document.getElementById('tempFridgeVal'),

  // Output Displays
  totalDoughWeightDisplay: document.getElementById('totalDoughWeightDisplay'),
  flourRes: document.getElementById('flourRes'),
  waterRes: document.getElementById('waterRes'),
  saltRes: document.getElementById('saltRes'),
  yeastRes: document.getElementById('yeastRes'),
  waterPctDisplay: document.getElementById('waterPctDisplay'),
  saltPctDisplay: document.getElementById('saltPctDisplay'),
  yeastPctDisplay: document.getElementById('yeastPctDisplay'),
  yeastLabel: document.getElementById('yeastLabel'),
  warningNotice: document.getElementById('warningNotice'),

  // Buttons & Controls
  resetBtn: document.getElementById('resetBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  sunIcon: document.getElementById('sunIcon'),
  moonIcon: document.getElementById('moonIcon'),

  // Language Popover UI
  langMenuBtn: document.getElementById('langMenuBtn'),
  currentLangBadge: document.getElementById('currentLangBadge'),
  langPopover: document.getElementById('langPopover')
};

/**
 * Update all DOM text nodes according to current language with fallback
 */
function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  const t = translations[lang] || translations.en || translations.es;
  const fallback = translations.en || translations.es;

  // Text content translation
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
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
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = t[key] || fallback[key];
    if (val) el.title = val;
  });

  // Update header button badge text
  if (elements.currentLangBadge) {
    elements.currentLangBadge.textContent = lang.toUpperCase();
  }

  // Update active state in popover menu
  document.querySelectorAll('.lang-option-item').forEach(btn => {
    const itemLang = btn.getAttribute('data-lang');
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
 * Perform all calculation steps and update DOM outputs in real-time
 */
function calculate() {
  const t = translations[currentLang] || translations.en || translations.es;

  // Extract inputs
  const numberOfBalls = Math.max(1, parseInt(elements.numberOfBalls.value) || 1);
  const ballWeight = Math.max(10, parseFloat(elements.ballWeight.value) || 280);
  const hydrationPercentage = parseFloat(elements.hydrationSlider.value) || 65;
  const saltPercentage = parseFloat(elements.saltSlider.value) || 2.5;
  
  let yeastType = 'Fresh';
  for (const input of elements.yeastInputs) {
    if (input.checked) yeastType = input.value;
  }

  const hoursRt = Math.max(0, parseFloat(elements.hoursRt.value) || 0);
  const tempRt = parseFloat(elements.tempRtSlider.value) || 22;
  const hoursFridge = Math.max(0, parseFloat(elements.hoursFridge.value) || 0);
  const tempFridge = parseFloat(elements.tempFridgeSlider.value) || 4;

  // Step 1: Base Flour Calculation (Baker's Percentage)
  const totalDoughWeight = numberOfBalls * ballWeight;
  const flourGrams = totalDoughWeight / (1 + (hydrationPercentage / 100) + (saltPercentage / 100));

  // Step 2: Water & Salt Calculation
  const waterGrams = flourGrams * (hydrationPercentage / 100);
  const saltGrams = flourGrams * (saltPercentage / 100);

  // Step 3: Mixed Yeast Algorithm (Accumulated Kinetic Model)
  const afRt = Math.max(0, tempRt - 3.5);
  const afFridge = Math.max(0, tempFridge - 3.5);

  const contributionRt = hoursRt * Math.pow(afRt, 2);
  const contributionFridge = hoursFridge * Math.pow(afFridge, 2);
  const totalFermentationCapacity = contributionRt + contributionFridge;

  let yeastGrams = 0;
  let yeastPercentage = 0;

  if (totalFermentationCapacity > 0) {
    let freshYeastPercentage = 850 / totalFermentationCapacity;

    if (yeastType === 'Instant Dry') {
      yeastPercentage = freshYeastPercentage / 3;
    } else {
      yeastPercentage = freshYeastPercentage;
    }

    yeastGrams = flourGrams * (yeastPercentage / 100);
  }

  // Update Displays
  elements.totalDoughWeightDisplay.textContent = `${totalDoughWeight.toFixed(1)} g`;
  elements.flourRes.textContent = flourGrams.toFixed(1);
  elements.waterRes.textContent = waterGrams.toFixed(1);
  elements.saltRes.textContent = saltGrams.toFixed(1);
  elements.yeastRes.textContent = yeastGrams.toFixed(2);

  // Percentage Badges
  elements.waterPctDisplay.textContent = `${hydrationPercentage}%`;
  elements.saltPctDisplay.textContent = `${saltPercentage}%`;
  elements.yeastPctDisplay.textContent = `${yeastPercentage.toFixed(3)}%`;

  // Dynamic Yeast Label
  elements.yeastLabel.textContent = yeastType === 'Instant Dry' 
    ? t.yeastDryLabel 
    : t.yeastFreshLabel;

  // Toggle warning notice if total fermentation time is 0
  if (hoursRt + hoursFridge === 0) {
    elements.warningNotice.classList.remove('hidden');
  } else {
    elements.warningNotice.classList.add('hidden');
  }

  // Save parameters to localStorage
  saveState({
    numberOfBalls,
    ballWeight,
    hydrationPercentage,
    saltPercentage,
    yeastType,
    hoursRt,
    tempRt,
    hoursFridge,
    tempFridge
  });
}

/**
 * Save current settings to LocalStorage
 */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

/**
 * Load settings from LocalStorage
 */
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const state = JSON.parse(saved);

    if (state.numberOfBalls !== undefined) elements.numberOfBalls.value = state.numberOfBalls;
    if (state.ballWeight !== undefined) elements.ballWeight.value = state.ballWeight;
    
    if (state.hydrationPercentage !== undefined) {
      elements.hydrationSlider.value = state.hydrationPercentage;
      elements.hydrationVal.textContent = state.hydrationPercentage;
    }
    
    if (state.saltPercentage !== undefined) {
      elements.saltSlider.value = state.saltPercentage;
      elements.saltVal.textContent = state.saltPercentage;
    }

    if (state.yeastType) {
      for (const input of elements.yeastInputs) {
        input.checked = (input.value === state.yeastType);
      }
    }

    if (state.hoursRt !== undefined) elements.hoursRt.value = state.hoursRt;
    if (state.tempRt !== undefined) {
      elements.tempRtSlider.value = state.tempRt;
      elements.tempRtVal.textContent = state.tempRt;
    }

    if (state.hoursFridge !== undefined) elements.hoursFridge.value = state.hoursFridge;
    if (state.tempFridge !== undefined) {
      elements.tempFridgeSlider.value = state.tempFridge;
      elements.tempFridgeVal.textContent = state.tempFridge;
    }
  } catch (e) {
    console.warn('Failed to load saved state:', e);
  }
}

/**
 * Manage Light/Dark Theme Switching
 */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULTS.theme;
  setTheme(savedTheme);

  elements.themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

function setTheme(theme) {
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
function initEventListeners() {
  // Language Popover Menu Listeners
  if (elements.langMenuBtn && elements.langPopover) {
    elements.langMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = elements.langPopover.classList.contains('hidden');
      if (isHidden) {
        elements.langPopover.classList.remove('hidden');
        elements.langMenuBtn.setAttribute('aria-expanded', 'true');
      } else {
        elements.langPopover.classList.add('hidden');
        elements.langMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Language option click handlers
    document.querySelectorAll('.lang-option-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = btn.getAttribute('data-lang');
        if (lang) {
          applyLanguage(lang);
          elements.langPopover.classList.add('hidden');
          elements.langMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close popover when clicking outside
    document.addEventListener('click', (e) => {
      if (!elements.langPopover.classList.contains('hidden') && 
          !elements.langPopover.contains(e.target) && 
          !elements.langMenuBtn.contains(e.target)) {
        elements.langPopover.classList.add('hidden');
        elements.langMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close popover on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !elements.langPopover.classList.contains('hidden')) {
        elements.langPopover.classList.add('hidden');
        elements.langMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Sync slider label values and trigger calculate
  elements.hydrationSlider.addEventListener('input', (e) => {
    elements.hydrationVal.textContent = e.target.value;
    calculate();
  });

  elements.saltSlider.addEventListener('input', (e) => {
    elements.saltVal.textContent = e.target.value;
    calculate();
  });

  elements.tempRtSlider.addEventListener('input', (e) => {
    elements.tempRtVal.textContent = e.target.value;
    calculate();
  });

  elements.tempFridgeSlider.addEventListener('input', (e) => {
    elements.tempFridgeVal.textContent = e.target.value;
    calculate();
  });

  // Numeric Inputs
  ['numberOfBalls', 'ballWeight', 'hoursRt', 'hoursFridge'].forEach(id => {
    elements[id].addEventListener('input', calculate);
    elements[id].addEventListener('change', calculate);
  });

  // Yeast Type Radio buttons
  for (const input of elements.yeastInputs) {
    input.addEventListener('change', calculate);
  }

  // Stepper Buttons (+ / -)
  document.querySelectorAll('.btn-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const actionValue = parseFloat(btn.getAttribute('data-action'));
      const inputEl = document.getElementById(targetId);

      if (inputEl) {
        const current = parseFloat(inputEl.value) || 0;
        const min = parseFloat(inputEl.getAttribute('min')) || 0;
        const max = parseFloat(inputEl.getAttribute('max')) || 1000;
        const newValue = Math.min(max, Math.max(min, current + actionValue));
        inputEl.value = newValue;
        calculate();
      }
    });
  });

  // Reset Button
  elements.resetBtn.addEventListener('click', () => {
    elements.numberOfBalls.value = DEFAULTS.numberOfBalls;
    elements.ballWeight.value = DEFAULTS.ballWeight;

    elements.hydrationSlider.value = DEFAULTS.hydrationPercentage;
    elements.hydrationVal.textContent = DEFAULTS.hydrationPercentage;

    elements.saltSlider.value = DEFAULTS.saltPercentage;
    elements.saltVal.textContent = DEFAULTS.saltPercentage;

    for (const input of elements.yeastInputs) {
      input.checked = (input.value === DEFAULTS.yeastType);
    }

    elements.hoursRt.value = DEFAULTS.hoursRt;
    elements.tempRtSlider.value = DEFAULTS.tempRt;
    elements.tempRtVal.textContent = DEFAULTS.tempRt;

    elements.hoursFridge.value = DEFAULTS.hoursFridge;
    elements.tempFridgeSlider.value = DEFAULTS.tempFridge;
    elements.tempFridgeVal.textContent = DEFAULTS.tempFridge;

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

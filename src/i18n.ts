/**
 * Scalable Internationalization (i18n) TypeScript Module
 * Supports N languages with automatic browser language matching & fallback to 'en'.
 */

export type LanguageCode = 'es' | 'en' | 'it' | 'fr' | 'de';

export interface LanguageInfo {
  name: string;
  flag: string;
}

export interface TranslationDictionary {
  metaTitle: string;
  metaDesc: string;
  appTitle: string;
  appBadge: string;
  resetTitle: string;
  themeTitle: string;
  langSelectTitle: string;
  
  // Block 1: Dimensions
  block1Title: string;
  numberOfBalls: string;
  ballWeight: string;
  totalDoughWeightLabel: string;
  
  // Block 2: Core Parameters
  block2Title: string;
  hydration: string;
  salt: string;
  yeastTypeLabel: string;
  yeastFresh: string;
  yeastDry: string;
  
  // Block 3: Times & Temps
  block3Title: string;
  phaseRt: string;
  hoursRt: string;
  tempRt: string;
  phaseFridge: string;
  hoursFridge: string;
  tempFridge: string;
  
  // Block 4: Results
  resultsTitle: string;
  resultsSubtitle: string;
  warningNotice: string;
  flour: string;
  water: string;
  saltIngredient: string;
  yeastFreshLabel: string;
  yeastDryLabel: string;
  
  footerText: string;
}

export const SUPPORTED_LANGUAGES: Record<LanguageCode, LanguageInfo> = {
  es: { name: 'Español', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇬🇧' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' }
};

export const translations: Record<LanguageCode, TranslationDictionary> = {
  es: {
    metaTitle: 'Calculadora de Masa de Pizza | Fermentación Mixta',
    metaDesc: 'Calcula los ingredientes exactos para tu masa de pizza napolitana o casera según tiempo a temperatura ambiente y nevera.',
    appTitle: 'Pizza Calculator',
    appBadge: 'Fermentación Mixta',
    resetTitle: 'Restablecer valores por defecto',
    themeTitle: 'Cambiar tema claro/oscuro',
    langSelectTitle: 'Seleccionar idioma',
    
    block1Title: 'Dimensiones de la Masa',
    numberOfBalls: 'Número de bolas',
    ballWeight: 'Peso por bola (g)',
    totalDoughWeightLabel: 'Peso total de masa:',
    
    block2Title: 'Parámetros Clave',
    hydration: 'Hidratación',
    salt: 'Sal',
    yeastTypeLabel: 'Tipo de Levadura',
    yeastFresh: '🌾 Fresca',
    yeastDry: '🌱 Seca Instantánea',
    
    block3Title: 'Tiempos y Temperaturas',
    phaseRt: 'Fase Temperatura Ambiente (TA)',
    hoursRt: 'Tiempo TA (horas)',
    tempRt: 'Temperatura TA',
    phaseFridge: 'Fase Nevera / Frío (TC)',
    hoursFridge: 'Tiempo Nevera (horas)',
    tempFridge: 'Temp. Nevera',
    
    resultsTitle: 'Ingredientes Necesarios',
    resultsSubtitle: 'Cálculo exacto para tus dosis de masa',
    warningNotice: '⚠️ Los tiempos de fermentación suman 0h. Añade horas a temp. ambiente o nevera para calcular la levadura.',
    flour: '🌾 Harina',
    water: '💧 Agua',
    saltIngredient: '🧂 Sal',
    yeastFreshLabel: '🧫 Levadura Fresca',
    yeastDryLabel: '🌱 Levadura Seca',
    
    footerText: 'Calculadora de Masa de Pizza PWA • Algoritmo Cinético de Fermentación Mixta'
  },

  en: {
    metaTitle: 'Pizza Dough Calculator | Mixed Fermentation',
    metaDesc: 'Calculate exact pizza dough ingredients based on room temperature and fridge fermentation times.',
    appTitle: 'Pizza Calculator',
    appBadge: 'Mixed Fermentation',
    resetTitle: 'Reset default values',
    themeTitle: 'Toggle light/dark theme',
    langSelectTitle: 'Select language',
    
    block1Title: 'Dough Dimensions',
    numberOfBalls: 'Number of dough balls',
    ballWeight: 'Weight per ball (g)',
    totalDoughWeightLabel: 'Total dough weight:',
    
    block2Title: 'Core Parameters',
    hydration: 'Hydration',
    salt: 'Salt',
    yeastTypeLabel: 'Yeast Type',
    yeastFresh: '🌾 Fresh',
    yeastDry: '🌱 Instant Dry',
    
    block3Title: 'Times & Temperatures',
    phaseRt: 'Room Temperature Phase (RT)',
    hoursRt: 'RT Time (hours)',
    tempRt: 'RT Temperature',
    phaseFridge: 'Fridge Phase (CT)',
    hoursFridge: 'Fridge Time (hours)',
    tempFridge: 'Fridge Temp',
    
    resultsTitle: 'Required Ingredients',
    resultsSubtitle: 'Exact formula breakdown for your dough balls',
    warningNotice: '⚠️ Total fermentation time is 0h. Add room temperature or fridge hours to calculate yeast.',
    flour: '🌾 Flour',
    water: '💧 Water',
    saltIngredient: '🧂 Salt',
    yeastFreshLabel: '🧫 Fresh Yeast',
    yeastDryLabel: '🌱 Instant Dry Yeast',
    
    footerText: 'PWA Pizza Dough Calculator • Kinetic Fermentation Model'
  },

  it: {
    metaTitle: 'Calcolatore Impasto Pizza | Lievitazione Mista',
    metaDesc: 'Calcola gli ingredienti esatti per il tuo impasto della pizza in base ai tempi a temperatura ambiente e in frigorifero.',
    appTitle: 'Pizza Calculator',
    appBadge: 'Lievitazione Mista',
    resetTitle: 'Ripristina valori predefiniti',
    themeTitle: 'Cambia tema chiaro/scuro',
    langSelectTitle: 'Seleziona lingua',
    
    block1Title: 'Dimensioni dell\'Impasto',
    numberOfBalls: 'Numero di panetti',
    ballWeight: 'Peso per panetto (g)',
    totalDoughWeightLabel: 'Peso totale impasto:',
    
    block2Title: 'Parametri Principali',
    hydration: 'Idratazione',
    salt: 'Sale',
    yeastTypeLabel: 'Tipo di Lievito',
    yeastFresh: '🌾 Fresco di Birra',
    yeastDry: '🌱 Secco Istantaneo',
    
    block3Title: 'Tempi e Temperature',
    phaseRt: 'Fase Temperatura Ambiente (TA)',
    hoursRt: 'Tempo TA (ore)',
    tempRt: 'Temperatura TA',
    phaseFridge: 'Fase Frigorifero (TC)',
    hoursFridge: 'Tempo Frigo (ore)',
    tempFridge: 'Temp. Frigo',
    
    resultsTitle: 'Ingredienti Necessari',
    resultsSubtitle: 'Calcolo esatto delle dosi per i tuoi panetti',
    warningNotice: '⚠️ I tempi totali di lievitazione sono 0h. Aggiungi ore a TA o frigo per calcolare il lievito.',
    flour: '🌾 Farina',
    water: '💧 Acqua',
    saltIngredient: '🧂 Sale',
    yeastFreshLabel: '🧫 Lievito Fresco',
    yeastDryLabel: '🌱 Lievito Secco',
    
    footerText: 'Calcolatore Impasto Pizza PWA • Modello Cinetico di Lievitazione'
  },

  fr: {
    metaTitle: 'Calculateur de Pâte à Pizza | Fermentation Mixte',
    metaDesc: 'Calculez les ingrédients exacts pour votre pâte à pizza selon le temps à température ambiante et au réfrigérateur.',
    appTitle: 'Pizza Calculator',
    appBadge: 'Fermentation Mixte',
    resetTitle: 'Réinitialiser les valeurs',
    themeTitle: 'Changer le thème clair/sombre',
    langSelectTitle: 'Choisir la langue',
    
    block1Title: 'Dimensions de la Pâte',
    numberOfBalls: 'Nombre de pâtons',
    ballWeight: 'Poids par pâton (g)',
    totalDoughWeightLabel: 'Poids total de pâte:',
    
    block2Title: 'Paramètres Clés',
    hydration: 'Hydratation',
    salt: 'Sel',
    yeastTypeLabel: 'Type de Levure',
    yeastFresh: '🌾 Fraîche',
    yeastDry: '🌱 Sèche Instantanée',
    
    block3Title: 'Temps & Températures',
    phaseRt: 'Phase Température Ambiante (TA)',
    hoursRt: 'Temps TA (heures)',
    tempRt: 'Température TA',
    phaseFridge: 'Phase Réfrigérateur (TC)',
    hoursFridge: 'Temps Frigo (heures)',
    tempFridge: 'Temp. Frigo',
    
    resultsTitle: 'Ingrédients Nécessaires',
    resultsSubtitle: 'Calcul exact pour vos pâtons de pizza',
    warningNotice: '⚠️ Le temps total de fermentation est de 0h. Ajoutez des heures à TA ou au frigo.',
    flour: '🌾 Farine',
    water: '💧 Eau',
    saltIngredient: '🧂 Sel',
    yeastFreshLabel: '🧫 Levure Fraîche',
    yeastDryLabel: '🌱 Levure Sèche',
    
    footerText: 'Calculateur de Pâte à Pizza PWA • Modèle Cinétique de Fermentation'
  },

  de: {
    metaTitle: 'Pizzateig Rechner | Gemischte Gärung',
    metaDesc: 'Berechne die genauen Zutaten für deinen Pizzateig basierend auf Raumtemperatur und Kühlschrankzeit.',
    appTitle: 'Pizza Calculator',
    appBadge: 'Gemischte Gärung',
    resetTitle: 'Standardwerte zurücksetzen',
    themeTitle: 'Dunkel/Hell-Design umschalten',
    langSelectTitle: 'Sprache auswählen',
    
    block1Title: 'Teig-Dimensionen',
    numberOfBalls: 'Anzahl Teiglinge',
    ballWeight: 'Gewicht pro Teigling (g)',
    totalDoughWeightLabel: 'Gesamtgewicht Teig:',
    
    block2Title: 'Kern-Parameter',
    hydration: 'Hydratisierung',
    salt: 'Salz',
    yeastTypeLabel: 'Hefe-Typ',
    yeastFresh: '🌾 Frische Hefe',
    yeastDry: '🌱 Trockenhefe',
    
    block3Title: 'Zeiten & Temperaturen',
    phaseRt: 'Raumtemperatur-Phase (RT)',
    hoursRt: 'RT Zeit (Stunden)',
    tempRt: 'Raumtemperatur',
    phaseFridge: 'Kühlschrank-Phase (KT)',
    hoursFridge: 'Kühlschrank Zeit (Stunden)',
    tempFridge: 'Kühlschrank Temp.',
    
    resultsTitle: 'Benötigte Zutaten',
    resultsSubtitle: 'Genaue Mengen für deine Teiglinge',
    warningNotice: '⚠️ Gesamte Gehzeit beträgt 0 Std. Bitte Zeiten angeben.',
    flour: '🌾 Mehl',
    water: '💧 Wasser',
    saltIngredient: '🧂 Salz',
    yeastFreshLabel: '🧫 Frische Hefe',
    yeastDryLabel: '🌱 Trockenhefe',
    
    footerText: 'Pizzateig Rechner PWA • Kinetisches Gärmodell'
  }
};

const LANG_STORAGE_KEY = 'pizza_calculator_language';

/**
 * Determine initial language from localStorage or navigator
 */
export function getInitialLanguage(): LanguageCode {
  const saved = localStorage.getItem(LANG_STORAGE_KEY) as LanguageCode | null;
  if (saved && translations[saved]) {
    return saved;
  }
  
  const browserLang = (navigator.language || (navigator as { userLanguage?: string }).userLanguage || '').toLowerCase().slice(0, 2) as LanguageCode;
  return translations[browserLang] ? browserLang : 'en';
}

/**
 * Save language preference
 */
export function setSavedLanguage(lang: LanguageCode): void {
  if (translations[lang]) {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }
}

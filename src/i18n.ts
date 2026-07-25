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

  // FAQ Section
  faqSectionTitle: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
  faqQ3: string;
  faqA3: string;
  faqQ4: string;
  faqA4: string;

  // PWA & Update Alerts
  pwaUpdateNotice: string;
  pwaUpdateBtn: string;
  pwaInstallNotice: string;
  pwaInstallBtn: string;
  dismiss: string;

  // Modes & Simple Mode
  modeSimple: string;
  modeAdvanced: string;
  simpleSectionTitle: string;
  simpleHoursLabel: string;
  presetLabel: string;
  preset4h: string;
  preset8h: string;
  preset24h: string;
  preset48h: string;
  simpleTimeSplitAmbient: string;
  simpleTimeSplitFridge: string;
  simpleTimeSplitCombined: string;
  simpleTipTitle: string;
  simpleTipBody: string;
  simpleDoughSummary: string;
  simpleDefaultsInfo: string;
  simpleDefaultsInfoNeapolitan: string;
  simpleDefaultsInfoTondaRomana: string;

  pizzaStyleLabel: string;
  styleNeapolitan: string;
  styleNeapolitanDesc: string;
  styleTondaRomana: string;
  styleTondaRomanaDesc: string;

  copyRecipeBtn: string;
  recipeCopiedToast: string;
  quickSummaryTitle: string;

  prepStep1Title: string;
  prepStep1Body: string;
  prepStep2Title: string;
  prepStep2AmbientOnly: string;
  prepStep2FridgeOnly: string;
  prepStep2Combined: string;
  prepStep3Title: string;
  prepStep3Body: string;

  footerText: string;
}

export const SUPPORTED_LANGUAGES: Record<LanguageCode, LanguageInfo> = {
  es: { name: 'Español', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇬🇧' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
};

export const translations: Record<LanguageCode, TranslationDictionary> = {
  es: {
    metaTitle: 'Calculadora de Masa de Pizza | Fermentación Mixta',
    metaDesc:
      'Calcula los ingredientes exactos para tu masa de pizza napolitana o casera según tiempo a temperatura ambiente y nevera.',
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
    warningNotice:
      '⚠️ Los tiempos de fermentación suman 0h. Añade horas a temp. ambiente o nevera para calcular la levadura.',
    flour: '🌾 Harina',
    water: '💧 Agua',
    saltIngredient: '🧂 Sal',
    yeastFreshLabel: '🧫 Levadura Fresca',
    yeastDryLabel: '🌱 Levadura Seca',

    faqSectionTitle: 'Preguntas Frecuentes y Guía de Fermentación',
    faqQ1: '¿Cómo funciona el cálculo de fermentación mixta (Nevera + Ambiente)?',
    faqA1:
      'Nuestra calculadora utiliza un algoritmo cinético exponencial que modela la actividad de las levaduras a diferentes temperaturas. La actividad es cercana a cero a 3.5°C (nevera) y aumenta exponencialmente a temperatura ambiente, acumulando la maduración requerida.',
    faqQ2: "¿Qué es el porcentaje de panadero (Baker's Percentage)?",
    faqA2:
      'Es la fórmula estándar usada por pizzaiolos donde el peso de la harina representa el 100%. Todos los demás ingredientes (agua, sal, levadura) se calculan como un porcentaje relativo a la harina.',
    faqQ3: '¿Cuál es la proporción entre levadura fresca y levadura seca instantánea?',
    faqA3:
      'La proporción estándar es 3 a 1. 3 gramos de levadura fresca de panadería equivalen a 1 gramo de levadura seca instantánea en polvo.',
    faqQ4: '¿Puedo usar esta calculadora sin conexión a internet?',
    faqA4:
      '¡Sí! Es una Progressive Web App (PWA) 100% offline. Una vez cargada en tu navegador o añadida a la pantalla de inicio de tu móvil, funciona sin cobertura ni datos.',

    pwaUpdateNotice: 'Nueva versión disponible con mejoras',
    pwaUpdateBtn: 'Actualizar',
    pwaInstallNotice: 'Instala la app para usarla 100% offline',
    pwaInstallBtn: 'Instalar',
    dismiss: 'Cerrar',

    modeSimple: '⚡ Modo Simple',
    modeAdvanced: '⚙️ Modo Avanzado',
    simpleSectionTitle: 'Configuración Rápida',
    simpleHoursLabel: 'Tiempo de Fermentación (horas)',
    presetLabel: 'Accesos rápidos:',
    preset4h: '⚡ 4h (Rápida)',
    preset8h: '☀️ 8h (Mismo día)',
    preset24h: '🌙 24h (1 día nevera)',
    preset48h: '❄️ 48h (2 días nevera)',
    simpleTimeSplitAmbient: '⚡ {rt}h a Temperatura Ambiente (22°C)',
    simpleTimeSplitFridge: '❄️ {fridge}h en Nevera (4°C)',
    simpleTimeSplitCombined: '⚡ {rt}h a Temp. Ambiente (22°C) + ❄️ {fridge}h en Nevera (4°C)',
    simpleTipTitle: '💡 Guía Rápida de Preparación',
    simpleTipBody:
      'Disuelve la levadura fresca en el agua. Agrega la harina, amasa 5 min, añade la sal y amasa hasta obtener una masa lisa. Deja reposar cubierta.',
    simpleDoughSummary: 'Masa total: {total}g ({balls} bolas de {weight}g)',
    simpleDefaultsInfo: 'Fórmula Napolitana: Bola 280g • 65% Hidratación • 2.5% Sal • Levadura fresca',
    simpleDefaultsInfoNeapolitan: 'Fórmula Napolitana: Bola 280g • 65% Hidratación • 2.5% Sal',
    simpleDefaultsInfoTondaRomana: 'Fórmula Tonda Romana: Bola 180g • 57% Hidratación • 2.5% Sal',

    pizzaStyleLabel: 'Estilo de Pizza',
    styleNeapolitan: 'Napolitana',
    styleNeapolitanDesc: 'Masa esponjosa (Bola 280g • 65% Hidr.)',
    styleTondaRomana: 'Tonda Romana',
    styleTondaRomanaDesc: 'Fina y crujiente (Bola 180g • 57% Hidr.)',

    copyRecipeBtn: '📋 Copiar Receta',
    recipeCopiedToast: '✅ ¡Receta copiada al portapapeles!',
    quickSummaryTitle: 'Resumen en Tiempo Real',

    prepStep1Title: '🥣 1. Amasado y Mezcla',
    prepStep1Body:
      'Disuelve {yeast}g de levadura en {water}g de agua. Añade {flour}g de harina y {salt}g de sal. Amasa 10 min hasta obtener una masa lisa y elástica.',
    prepStep2Title: '⏱️ 2. Fermentación y Control de Tiempo',
    prepStep2AmbientOnly:
      'Deja fermentar en un bol tapado a temperatura ambiente ({tempRt}°C) durante {hoursRt} horas. Divide en bolas 2 horas antes de hornear.',
    prepStep2FridgeOnly:
      'Deja reposar 1 hora a temp. ambiente, guarda en nevera ({tempFridge}°C) durante {hoursFridge} horas. Saca las bolas 2.5h antes de hornear para atemperar.',
    prepStep2Combined:
      'Fermentación Mixta: Mantén la masa {hoursRt} horas a temperatura ambiente ({tempRt}°C) y {hoursFridge} horas en nevera ({tempFridge}°C). Saca y atempera 2 horas antes de estirar.',
    prepStep3Title: '🍕 3. Formado y Horneado',
    prepStep3Body:
      'Forma {balls} bolas de {weight}g. Estira con las manos desde el centro sobre sémola dejando el borde (cornicione). Hornea al máximo de temperatura.',

    footerText: 'Calculadora de Masa de Pizza PWA • Algoritmo Cinético de Fermentación Mixta',
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

    faqSectionTitle: 'Frequently Asked Questions & Fermentation Guide',
    faqQ1: 'How does mixed fermentation (Fridge + Room Temp) calculation work?',
    faqA1:
      'Our calculator uses an exponential kinetic algorithm that models yeast metabolic activity across temperatures. Yeast activity drops near zero at 3.5°C (fridge) and increases exponentially at room temperature to reach target maturation.',
    faqQ2: "What is Baker's Percentage?",
    faqA2:
      "Baker's percentage is the professional baking standard where total flour weight equals 100%. All other ingredients (water, salt, yeast) are calculated as a percentage relative to flour mass.",
    faqQ3: 'What is the ratio between fresh yeast and instant dry yeast?',
    faqA3:
      'The standard conversion ratio is 3:1. 3 grams of fresh cake yeast equals 1 gram of active/instant dry yeast powder.',
    faqQ4: 'Can I use this calculator offline?',
    faqA4:
      'Yes! It is a 100% offline Progressive Web App (PWA). Once opened in your browser or installed on your mobile home screen, it works completely offline without network coverage.',

    pwaUpdateNotice: 'New version available with updates',
    pwaUpdateBtn: 'Update',
    pwaInstallNotice: 'Install app for 100% offline use',
    pwaInstallBtn: 'Install',
    dismiss: 'Dismiss',

    modeSimple: '⚡ Simple Mode',
    modeAdvanced: '⚙️ Advanced Mode',
    simpleSectionTitle: 'Quick Setup',
    simpleHoursLabel: 'Fermentation Time (hours)',
    presetLabel: 'Quick presets:',
    preset4h: '⚡ 4h (Fast)',
    preset8h: '☀️ 8h (Same Day)',
    preset24h: '🌙 24h (1 Day Fridge)',
    preset48h: '❄️ 48h (2 Days Fridge)',
    simpleTimeSplitAmbient: '⚡ {rt}h at Room Temp (22°C)',
    simpleTimeSplitFridge: '❄️ {fridge}h in Fridge (4°C)',
    simpleTimeSplitCombined: '⚡ {rt}h Room Temp (22°C) + ❄️ {fridge}h Fridge (4°C)',
    simpleTipTitle: '💡 Quick Preparation Guide',
    simpleTipBody:
      'Dissolve fresh yeast in water. Add flour, knead 5 min, add salt and knead until smooth. Let rest covered.',
    simpleDoughSummary: 'Total dough: {total}g ({balls} balls of {weight}g)',
    simpleDefaultsInfo: 'Neapolitan Standard: 280g ball • 65% Hydration • 2.5% Salt • Fresh yeast',
    simpleDefaultsInfoNeapolitan: 'Neapolitan Formula: 280g ball • 65% Hydration • 2.5% Salt',
    simpleDefaultsInfoTondaRomana: 'Tonda Romana Formula: 180g ball • 57% Hydration • 2.5% Salt',

    pizzaStyleLabel: 'Pizza Style',
    styleNeapolitan: 'Neapolitan',
    styleNeapolitanDesc: 'Airy crust (280g ball • 65% Hydr.)',
    styleTondaRomana: 'Tonda Romana',
    styleTondaRomanaDesc: 'Thin & crispy (180g ball • 57% Hydr.)',

    copyRecipeBtn: '📋 Copy Recipe',
    recipeCopiedToast: '✅ Recipe copied to clipboard!',
    quickSummaryTitle: 'Real-time Summary',

    prepStep1Title: '🥣 1. Mixing & Kneading',
    prepStep1Body:
      'Dissolve {yeast}g of yeast in {water}g of water. Add {flour}g of flour and {salt}g of salt. Knead 10 minutes until smooth and elastic.',
    prepStep2Title: '⏱️ 2. Fermentation & Timing',
    prepStep2AmbientOnly:
      'Let ferment in a covered bowl at room temp ({tempRt}°C) for {hoursRt} hours. Shape into dough balls 2 hours before baking.',
    prepStep2FridgeOnly:
      'Rest 1 hour at room temp, then chill in fridge ({tempFridge}°C) for {hoursFridge} hours. Remove dough balls 2.5 hours before baking to reach room temp.',
    prepStep2Combined:
      'Mixed Fermentation: Keep dough for {hoursRt} hours at room temp ({tempRt}°C) and {hoursFridge} hours in fridge ({tempFridge}°C). Warm up 2 hours before stretching.',
    prepStep3Title: '🍕 3. Balling & Baking',
    prepStep3Body:
      'Divide into {balls} balls of {weight}g. Stretch by hand on semolina outward leaving raised crust edges (cornicione). Bake at max heat.',

    footerText: 'PWA Pizza Dough Calculator • Kinetic Fermentation Model',
  },

  it: {
    metaTitle: 'Calcolatore Impasto Pizza | Lievitazione Mista',
    metaDesc:
      'Calcola gli ingredienti esatti per il tuo impasto della pizza in base ai tempi a temperatura ambiente e in frigorifero.',
    appTitle: 'Pizza Calculator',
    appBadge: 'Lievitazione Mista',
    resetTitle: 'Ripristina valori predefiniti',
    themeTitle: 'Cambia tema chiaro/scuro',
    langSelectTitle: 'Seleziona lingua',

    block1Title: "Dimensioni dell'Impasto",
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

    faqSectionTitle: 'Domande Frequenti e Guida alla Lievitazione',
    faqQ1: 'Come funciona il calcolo della lievitazione mista (Frigo + Ambiente)?',
    faqA1:
      "Il calcolatore utilizza un algoritmo cinetico esponenziale che modella l'attività del lievito alle diverse temperature. L'attività è vicina allo zero a 3.5°C (frigo) e cresce esponenzialmente a temperatura ambiente.",
    faqQ2: "Cos'è la percentuale del pizzaiolo / panificatore?",
    faqA2:
      'È la formula professionale in cui il peso della farina rappresenta il 100%. Tutti gli altri ingredienti (acqua, sale, lievito) sono calcolati in percentuale rispetto alla farina.',
    faqQ3: 'Qual è il rapporto tra lievito fresco e lievito secco istantaneo?',
    faqA3:
      'Il rapporto standard è 3 a 1. 3 grammi di lievito fresco di birra equivalgono a 1 grammo di lievito secco istantaneo.',
    faqQ4: 'Posso usare questo calcolatore offline?',
    faqA4:
      'Sì! È una PWA (Progressive Web App) 100% offline. Una volta caricata o aggiunta alla schermata home del telefono, funziona senza connessione internet.',

    pwaUpdateNotice: 'Nuova versione disponibile',
    pwaUpdateBtn: 'Aggiorna',
    pwaInstallNotice: "Installa l'app per usarla offline",
    pwaInstallBtn: 'Installa',
    dismiss: 'Chiudi',

    modeSimple: '⚡ Modalità Semplice',
    modeAdvanced: '⚙️ Modalità Avanzata',
    simpleSectionTitle: 'Configurazione Rapida',
    simpleHoursLabel: 'Tempo di Lievitazione (ore)',
    presetLabel: 'Scelte rapide:',
    preset4h: '⚡ 4h (Veloce)',
    preset8h: '☀️ 8h (Stesso giorno)',
    preset24h: '🌙 24h (1 giorno frigo)',
    preset48h: '❄️ 48h (2 giorni frigo)',
    simpleTimeSplitAmbient: '⚡ {rt}h a Temp. Ambiente (22°C)',
    simpleTimeSplitFridge: '❄️ {fridge}h in Frigorifero (4°C)',
    simpleTimeSplitCombined: '⚡ {rt}h Temp. Ambiente (22°C) + ❄️ {fridge}h Frigo (4°C)',
    simpleTipTitle: '💡 Guida Rapida di Preparazione',
    simpleTipBody:
      "Sciogli il lievito fresco nell'acqua. Aggiungi la farina, impasta 5 min, unisci il sale e impasta fino a ottenere un panetto liscio.",
    simpleDoughSummary: 'Impasto totale: {total}g ({balls} panetti da {weight}g)',
    simpleDefaultsInfo: 'Standard Napoletano: Panetto 280g • 65% Idratazione • 2.5% Sale • Lievito fresco',
    simpleDefaultsInfoNeapolitan: 'Formula Napoletana: Panetto 280g • 65% Idratazione • 2.5% Sale',
    simpleDefaultsInfoTondaRomana: 'Formula Tonda Romana: Panetto 180g • 57% Idratazione • 2.5% Sale',

    pizzaStyleLabel: 'Stile di Pizza',
    styleNeapolitan: 'Napoletana',
    styleNeapolitanDesc: 'Cornicione alto (Panetto 280g • 65% Idr.)',
    styleTondaRomana: 'Tonda Romana',
    styleTondaRomanaDesc: 'Fina e scrocchiarella (Panetto 180g • 57% Idr.)',

    copyRecipeBtn: '📋 Copia Ricetta',
    recipeCopiedToast: '✅ Ricetta copiata negli appunti!',
    quickSummaryTitle: 'Riepilogo in Tempo Reale',

    prepStep1Title: '🥣 1. Impasto e Miscelazione',
    prepStep1Body:
      'Sciogli {yeast}g di lievito in {water}g di acqua. Aggiungi {flour}g di farina e {salt}g di sale. Impasta 10 minuti fino a ottenere un panetto liscio.',
    prepStep2Title: '⏱️ 2. Lievitazione e Tempi',
    prepStep2AmbientOnly:
      'Lascia lievitare a temperatura ambiente ({tempRt}°C) per {hoursRt} ore. Forma i panetti 2 ore prima di infornare.',
    prepStep2FridgeOnly:
      'Riposo 1 ora a TA, poi in frigorifero ({tempFridge}°C) per {hoursFridge} ore. Togli i panetti dal frigo 2.5 ore prima di stendere.',
    prepStep2Combined:
      'Lievitazione Mista: {hoursRt} ore a temperatura ambiente ({tempRt}°C) e {hoursFridge} ore in frigorifero ({tempFridge}°C). Porta a temperatura ambiente 2 ore prima di stendere.',
    prepStep3Title: '🍕 3. Stesura e Cottura',
    prepStep3Body:
      'Forma {balls} panetti da {weight}g. Stendi a mano lasciando il cornicione alto. Inforna alla massima temperatura.',

    footerText: 'Calcolatore Impasto Pizza PWA • Modello Cinetico di Lievitazione',
  },

  fr: {
    metaTitle: 'Calculateur de Pâte à Pizza | Fermentation Mixte',
    metaDesc:
      'Calculez les ingrédients exacts pour votre pâte à pizza selon le temps à température ambiante et au réfrigérateur.',
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

    faqSectionTitle: 'Foire Aux Questions & Guide de Fermentation',
    faqQ1: 'Comment fonctionne la fermentation mixte (Frigo + Température Ambiante)?',
    faqA1:
      "Notre calculateur utilise un algorithme cinétique modélisant l'activité de la levure selon la température. L'activité est quasi nulle à 3.5°C (frigo) et augmente exponentiellement à température ambiante.",
    faqQ2: "Qu'est-ce que le pourcentage du boulanger?",
    faqA2:
      "C'est la formule standard où le poids de la farine représente 100%. Tous les autres ingrédients (eau, sel, levure) sont exprimés en pourcentage par rapport à la farine.",
    faqQ3: 'Quel est le ratio entre levure fraîche et levure sèche instantanée?',
    faqA3:
      'Le ratio standard est de 3 pour 1. 3g de levure fraîche de boulanger équivalent à 1g de levure sèche instantanée.',
    faqQ4: 'Puis-je utiliser cette application hors ligne?',
    faqA4:
      "Oui! C'est une PWA 100% hors ligne. Une fois ouverte ou ajoutée à l'écran d'accueil de votre smartphone, elle fonctionne sans connexion internet.",

    pwaUpdateNotice: 'Nouvelle version disponible',
    pwaUpdateBtn: 'Mettre à jour',
    pwaInstallNotice: "Installez l'appli pour l'utiliser hors ligne",
    pwaInstallBtn: 'Installer',
    dismiss: 'Fermer',

    modeSimple: '⚡ Mode Simple',
    modeAdvanced: '⚙️ Mode Avancé',
    simpleSectionTitle: 'Configuration Rapide',
    simpleHoursLabel: 'Temps de Fermentation (heures)',
    presetLabel: 'Accès rapides :',
    preset4h: '⚡ 4h (Rapide)',
    preset8h: '☀️ 8h (Même jour)',
    preset24h: '🌙 24h (1 jour frigo)',
    preset48h: '❄️ 48h (2 jours frigo)',
    simpleTimeSplitAmbient: '⚡ {rt}h à Temp. Ambiante (22°C)',
    simpleTimeSplitFridge: '❄️ {fridge}h au Réfrigérateur (4°C)',
    simpleTimeSplitCombined: '⚡ {rt}h Temp. Ambiante (22°C) + ❄️ {fridge}h Frigo (4°C)',
    simpleTipTitle: '💡 Guide de Préparation Rapide',
    simpleTipBody:
      "Dissolvez la levure fraîche dans l'eau. Ajoutez la farine, pétrissez 5 min, ajoutez le sel et pétrissez jusqu'à obtenir une pâte lisse.",
    simpleDoughSummary: 'Pâte totale : {total}g ({balls} pâtons de {weight}g)',
    simpleDefaultsInfo: 'Standard Napolitain : Pâton de 280g • 65% Hydratation • 2.5% Sel • Levure fraîche',
    simpleDefaultsInfoNeapolitan: 'Formule Napolitaine : Pâton de 280g • 65% Hydratation • 2.5% Sel',
    simpleDefaultsInfoTondaRomana: 'Formule Tonda Romana : Pâton de 180g • 57% Hydratation • 2.5% Sel',

    pizzaStyleLabel: 'Style de Pizza',
    styleNeapolitan: 'Napolitaine',
    styleNeapolitanDesc: 'Bords alvéolés (Pâton 280g • 65% Hydr.)',
    styleTondaRomana: 'Tonda Romana',
    styleTondaRomanaDesc: 'Fine et croustillante (Pâton 180g • 57% Hydr.)',

    copyRecipeBtn: '📋 Copier la Recette',
    recipeCopiedToast: '✅ Recette copiée dans le presse-papier !',
    quickSummaryTitle: 'Résumé en Temps Réel',

    prepStep1Title: '🥣 1. Pétrissage et Mélange',
    prepStep1Body:
      "Dissolvez {yeast}g de levure dans {water}g d'eau. Ajoutez {flour}g de farine et {salt}g de sel. Pétrissez 10 min jusqu'à obtenir une pâte lisse.",
    prepStep2Title: '⏱️ 2. Fermentation & Gestion du Temps',
    prepStep2AmbientOnly:
      'Laissez fermenter dans un bol couvert à température ambiante ({tempRt}°C) pendant {hoursRt} heures. Formez les pâtons 2h avant la cuisson.',
    prepStep2FridgeOnly:
      'Reposez 1h à TA, puis mettez au frigo ({tempFridge}°C) pendant {hoursFridge}h. Sortez les pâtons 2.5h avant cuisson pour réchauffer.',
    prepStep2Combined:
      "Fermentation Mixte : {hoursRt}h à température ambiante ({tempRt}°C) et {hoursFridge}h au réfrigérateur ({tempFridge}°C). Sortez 2h avant d'étaler.",
    prepStep3Title: '🍕 3. Façonnage et Cuisson',
    prepStep3Body:
      'Divisez en {balls} pâtons de {weight}g. Étalez à la main en préservant les bords. Enfournez au maximum de votre four.',

    footerText: 'Calculateur de Pâte à Pizza PWA • Modèle Cinétique de Fermentation',
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

    faqSectionTitle: 'Häufig gestellte Fragen & Gärungs-Ratgeber',
    faqQ1: 'Wie funktioniert die Berechnung für gemischte Gärung (Kühlschrank + Raumtemperatur)?',
    faqA1:
      'Der Rechner nutzt ein kinetisches Modell für die Hefeaktivität. Bei 3,5°C im Kühlschrank ruht die Hefe nahezu und entfaltet bei Raumtemperatur exponentiell ihre Gärkraft.',
    faqQ2: 'Was ist die Bäckerprozent-Formel?',
    faqA2:
      'Die Bäckerprozent-Formel ist der Profi-Standard: Das Mehlgewicht entspricht immer 100%. Wasser, Salz und Hefe werden prozentual zum Mehl angegeben.',
    faqQ3: 'Wie rechnet man Frische Hefe in Trockenhefe um?',
    faqA3: 'Das Standardverhältnis ist 3 zu 1. 3 Gramm frische Hefe entsprechen 1 Gramm Trockenhefe.',
    faqQ4: 'Kann ich den Rechner offline nutzen?',
    faqA4:
      'Ja! Es ist eine 100% offlinefähige Progressive Web App (PWA). Einmal geladen oder auf dem Smartphone installiert, funktioniert sie ohne Internet.',

    pwaUpdateNotice: 'Neue Version verfügbar',
    pwaUpdateBtn: 'Aktualisieren',
    pwaInstallNotice: 'App für 100% Offline-Nutzung installieren',
    pwaInstallBtn: 'Installieren',
    dismiss: 'Schließen',

    modeSimple: '⚡ Einfacher Modus',
    modeAdvanced: '⚙️ Erweiterter Modus',
    simpleSectionTitle: 'Schnellkonfiguration',
    simpleHoursLabel: 'Gärzeit (Stunden)',
    presetLabel: 'Schnellauswahl:',
    preset4h: '⚡ 4 Std. (Schnell)',
    preset8h: '☀️ 8 Std. (Gleicher Tag)',
    preset24h: '🌙 24 Std. (1 Tag Kühlschrank)',
    preset48h: '❄️ 48 Std. (2 Tage Kühlschrank)',
    simpleTimeSplitAmbient: '⚡ {rt} Std. Raumtemperatur (22°C)',
    simpleTimeSplitFridge: '❄️ {fridge} Std. Kühlschrank (4°C)',
    simpleTimeSplitCombined: '⚡ {rt} Std. Raumtemp. (22°C) + ❄️ {fridge} Std. Kühlschrank (4°C)',
    simpleTipTitle: '💡 Kurzanleitung zur Zubereitung',
    simpleTipBody:
      'Frische Hefe im Wasser auflösen. Mehl hinzufügen, 5 Min. kneten, Salz zugeben und zu einem glatten Teig kneten.',
    simpleDoughSummary: 'Gesamte Teigmenge: {total}g ({balls} Teigkugeln à {weight}g)',
    simpleDefaultsInfo: 'Neapolitanischer Standard: 280g Teigkugel • 65% Hydratation • 2.5% Salz • Frische Hefe',
    simpleDefaultsInfoNeapolitan: 'Neapolitanische Formel: 280g Teigkugel • 65% Hydratation • 2.5% Salz',
    simpleDefaultsInfoTondaRomana: 'Tonda Romana Formel: 180g Teigkugel • 57% Hydratation • 2.5% Salz',

    pizzaStyleLabel: 'Pizzastil',
    styleNeapolitan: 'Neapolitanisch',
    styleNeapolitanDesc: 'Luftiger Rand (280g Kugel • 65% Hydr.)',
    styleTondaRomana: 'Tonda Romana',
    styleTondaRomanaDesc: 'Dünn & knusprig (180g Kugel • 57% Hydr.)',

    copyRecipeBtn: '📋 Rezept kopieren',
    recipeCopiedToast: '✅ Rezept in die Zwischenablage kopiert!',
    quickSummaryTitle: 'Echtzeit-Zusammenfassung',

    prepStep1Title: '🥣 1. Mischen & Kneten',
    prepStep1Body:
      'Löse {yeast}g Hefe in {water}g Wasser auf. Gib {flour}g Mehl und {salt}g Salz hinzu. 10 Min. kneten bis ein glatter Teig entsteht.',
    prepStep2Title: '⏱️ 2. Gärung & Zeitverwaltung',
    prepStep2AmbientOnly:
      'Teig abgedeckt bei Raumtemperatur ({tempRt}°C) für {hoursRt} Std. gehen lassen. 2 Std. vor dem Backen zu Kugeln formen.',
    prepStep2FridgeOnly:
      '1 Std. bei Raumtemperatur ruhen lassen, dann {hoursFridge} Std. im Kühlschrank ({tempFridge}°C) kühlen. Teiglinge 2.5 Std. vor dem Backen herausnehmen.',
    prepStep2Combined:
      'Gemischte Gärung: {hoursRt} Std. bei Raumtemperatur ({tempRt}°C) und {hoursFridge} Std. im Kühlschrank ({tempFridge}°C). 2 Std. vor dem Dehnen temperieren.',
    prepStep3Title: '🍕 3. Formung & Backen',
    prepStep3Body:
      'Teil den Teig in {balls} Teiglinge à {weight}g. Mit den Händen von innen nach außen dehnen (Rand hoch lassen). Bei Maximalhitze backen.',

    footerText: 'Pizzateig Rechner PWA • Kinetisches Gärmodell',
  },
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

  const browserLang = (navigator.language || (navigator as { userLanguage?: string }).userLanguage || '')
    .toLowerCase()
    .slice(0, 2) as LanguageCode;
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

# Software Design Document: PWA Pizza Dough Calculator

## 1. Project Objective
To create a responsive, fast, and backend-less web application / PWA (Progressive Web App) where all calculation logic runs entirely on the client side. The application will allow users to calculate the exact ingredient weights for pizza dough based on mixed fermentation techniques (Room Temperature + Fridge Time).

## 2. Recommended Tech Stack
*   **Frontend:** HTML5, Vanilla CSS3 (Custom Properties / Variables, Responsive Mobile-First Design, Dark/Light theme toggle), and Vanilla JavaScript (ES6+).
*   **PWA Capabilities:** Include a `manifest.json` file and a basic *Service Worker* to enable installation on mobile devices and 100% offline functionality.
*   **Persistence:** Automatically save the latest user-input parameters into the browser's `localStorage` so they don't have to re-enter them every time the app opens.

---

## 3. Interface Architecture (UI/UX)

The layout must be "Mobile-First" (optimized for smartphones in the kitchen) using a single-card format. Inputs must update the outputs in real-time without requiring a "Calculate" button.

### User Inputs
*   **Block 1: Dough Dimensions**
    *   Number of dough balls (Integer numeric input, min: 1, default: 1)
    *   Weight of each dough ball (Integer numeric input in grams, e.g., 280)
*   **Block 2: Core Parameters**
    *   Hydration Percentage (Slider/Numeric input, range: 50% - 80%, default: 65%)
    *   Salt Percentage (Slider/Numeric input, range: 1% - 4%, default: 2.5%)
    *   Yeast Type (Dropdown/Selector: "Fresh" or "Instant Dry")
*   **Block 3: Times & Temperatures (Mixed Fermentation)**
    *   Room Temperature Time (Numeric input in hours, min: 0, default: 4)
    *   Expected Room Temperature (°C, numeric input or slider, range: 10°C - 35°C, default: 22°C)
    *   Fridge Time (Numeric input in hours, min: 0, default: 0)
    *   Fridge Temperature (°C, numeric input, range: 2°C - 10°C, default: 4°C)

### Outputs (Results)
A clear table with large typography displaying exact weights rounded to one decimal place:
*   Flour (g)
*   Water (g)
*   Salt (g)
*   Selected Yeast (g)

---

## 4. Calculation Logic & Algorithm

The script must execute the following sequential steps every time an input value changes:

### Step 1: Calculate Base Flour
Use the baker's percentage formula to determine the total grams of flour required based on the total desired dough weight (Number of balls * Ball weight). 
*(Note: Yeast weight is marginal to the overall mass, so it is omitted from the initial division to prevent recursive loops).*

```javascript
const totalDoughWeight = numberOfBalls * ballWeight;
const flourGrams = totalDoughWeight / (1 + (hydrationPercentage / 100) + (saltPercentage / 100));
```

### Step 2: Calculate Water & Salt
```javascript
const waterGrams = flourGrams * (hydrationPercentage / 100);
const saltGrams = flourGrams * (saltPercentage / 100);
```

### Step 3: Mixed Yeast Algorithm (Accumulated Kinetic Model)
To resolve the combined impact of room temperature and fridge temperature, the script calculates the Activity Factor (AF) per hour. Yeast activity decreases exponentially at lower temperatures, assuming activity levels reach near-zero at 3.5°C (temperatures at or below 3.5°C have 0 activity contribution).

The hourly Activity Factor formula is:
$$\text{AF} = \max(0, \text{Temperature} - 3.5)^2$$

The script must aggregate the impact of both fermentation phases:

```javascript
const afRt = Math.max(0, tempRt - 3.5);
const afFridge = Math.max(0, tempFridge - 3.5);

const contributionRt = hoursRt * Math.pow(afRt, 2);
const contributionFridge = hoursFridge * Math.pow(afFridge, 2);
const totalFermentationCapacity = contributionRt + contributionFridge;

let yeastGrams = 0;
if (totalFermentationCapacity > 0) {
  // Required Fresh Yeast percentage relative to flour (calibration constant K = 850)
  let yeastPercentage = 850 / totalFermentationCapacity;

  // If Instant Dry Yeast is selected, divide fresh yeast percentage by 3
  if (yeastType === "Instant Dry") {
    yeastPercentage = yeastPercentage / 3;
  }

  yeastGrams = flourGrams * (yeastPercentage / 100);
}
```

---

## 5. Acceptance Criteria
* **Real-time updates:** Any change to an input (whether typed or moved via slider) must instantly trigger a recalculation and re-render the results using `input` or `change` event listeners.
* **Zero-Hour Handling:** If both RT and Fridge times are set to 0, or temperature contribution is 0, the algorithm must handle division safely without breaking or returning `Infinity` / `NaN`.
* **Clean Layout:** Neutral background color with Dark/Light theme switch, self-explanatory inputs with clear labels, and results displayed in highlighted or monospace typography to avoid confusion when reading decimal values.
* **PWA & Offline:** Complete offline support via Service Worker caching, web app manifest, and custom SVG/PNG application icons.
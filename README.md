# 🍕 Pizza Dough Calculator (PWA)

A responsive, fast, and backend-less Progressive Web App (PWA) designed for pizza enthusiasts and pizzaiolos to calculate exact ingredient weights based on **Baker's Percentages** and a **Mixed Fermentation Kinetic Model** (Room Temperature + Fridge Time).

![Lighthouse Score](https://img.shields.io/badge/Lighthouse-100%2F100-success?style=for-the-badge&logo=lighthouse)
![PWA Ready](https://img.shields.io/badge/PWA-Offline--First-orange?style=for-the-badge&logo=pwa)
![Build Tool](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite)
![Languages](https://img.shields.io/badge/i18n-ES%20%7C%20EN%20%7C%20IT%20%7C%20FR%20%7C%20DE-blue?style=for-the-badge)

---

## ✨ Features

- ⚡ **Real-Time Calculation:** Inputs update ingredient output weights instantly without requiring a "Calculate" button.
- 🌾 **Baker's Percentages Formula:** Accurate flour, water, salt, and yeast weight calculations based on total desired dough mass.
- 🧫 **Mixed Fermentation Kinetic Model:** Resolves the combined activity of yeast across Room Temperature (RT) and Fridge (CT) phases.
- 📱 **100% Offline PWA:** Serves assets via Service Worker cache and installs as a standalone app on iOS, Android, and Desktop.
- 🌓 **Adaptive Dark/Light Theme:** Automatic system theme detection with a manual toggle button.
- 🌐 **Multi-Language Support (i18n):** Supports **Spanish 🇪🇸, English 🇬🇧, Italian 🇮🇹, French 🇫🇷, and German 🇩🇪** with automatic browser language detection.
- 💯 **Lighthouse 100/100:** Perfect scores across **Performance, Accessibility (WCAG AAA), Best Practices, and SEO**.

---

## 🧮 Mathematical Model & Algorithm

### Step 1: Base Flour Weight
The flour mass is determined using the baker's percentage division:

$$\text{Flour (g)} = \frac{\text{Total Dough Weight}}{1 + \left(\frac{\text{Hydration \%}}{100}\right) + \left(\frac{\text{Salt \%}}{100}\right)}$$

### Step 2: Water & Salt Weight
$$\text{Water (g)} = \text{Flour (g)} \times \frac{\text{Hydration \%}}{100}$$
$$\text{Salt (g)} = \text{Flour (g)} \times \frac{\text{Salt \%}}{100}$$

### Step 3: Mixed Fermentation Yeast Model (Accumulated Kinetic Activity)
Yeast activity factor per hour ($AF$) is modeled exponentially with near-zero activity at or below $3.5^\circ\text{C}$:

$$\text{AF} = \max(0, \text{Temp} - 3.5)^2$$

Total fermentation capacity is the aggregated impact of both phases:

$$\text{Capacity} = (\text{Hours}_{\text{RT}} \times \text{AF}_{\text{RT}}) + (\text{Hours}_{\text{Fridge}} \times \text{AF}_{\text{Fridge}})$$

Fresh yeast percentage relative to flour uses an optimized calibration constant ($K = 850$):

$$\text{Fresh Yeast \%} = \frac{850}{\text{Capacity}}$$

*(Instant Dry Yeast is calculated at $\frac{1}{3}$ of Fresh Yeast).*

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, Vanilla CSS3 (CSS Variables, Responsive Single-Card Layout), TypeScript (Strict Type Safety, ES6+ Modules).
- **Build Tooling:** [Vite 8](https://vitejs.dev/) with `vite-plugin-pwa 1.3`.
- **PWA & Offline:** Service Worker pre-caching with Workbox static asset versioning.
- **CI/CD:** Automated GitHub Actions workflow deploying to GitHub Pages.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+ or v20+ LTS)
- npm (v9+)

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/Diviei/pizza-calculator.git
cd pizza-calculator

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

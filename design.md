# PizzaCalc Design System (`design.md`)

> **Archetype**: Editorial Craftsman / Artisan Baker (Hallmark Anti-AI-Slop System)  
> **Version**: 1.0.0  
> **Status**: Locked & Canonical  

---

## 1. Visual DNA & Tone

- **Genre**: *Editorial Craftsman / Artisan Baker*.
- **Tone**: Warm, organic, tactile, precise, authentic.
- **Philosophy**: Refuses generic AI template tells (no purple-to-blue gradients, no Inter-everywhere without contrast, no centered-everything, no invented metrics, no un-tinted pure black/white).
- **Core Stance**: High typographic contrast (editorial serif display + crisp monospace numbers + clean sans-serif body), tactile cream flour paper background, toasted amber/terracotta primary accent.

---

## 2. Typography System

| Token Name | Font Family | Role & Usage |
| --- | --- | --- |
| `var(--font-serif)` | `"Newsreader Variable", "Newsreader", Georgia, serif` | Hero headlines, section titles, pizza style cards, quote/chapter headings, FAQ questions. Always roman (`font-style: normal`) for headers. |
| `var(--font-heading)` | `"Outfit Variable", "Outfit", sans-serif` | Buttons, navigation links, segmented controls, stepper labels, modal popover headers. |
| `var(--font-body)` | `"Inter Variable", "Inter", sans-serif` | Running body text, prep guide steps, tooltips, toast notifications. |
| `var(--font-mono)` | `"JetBrains Mono Variable", "JetBrains Mono", monospace` | Gram calculations (`668.7 g`), baker's hydration ratios (`65%`), temperatures (`22°C`), formula tickers, spec sheet tables. |

---

## 3. Color Tokens & Theme Palettes

### Semantic Color Variables

```css
:root {
  --color-primary: #d97706;          /* Toasted Sourdough Amber */
  --color-primary-hover: #b45309;    /* Deep Crust Amber */
  --color-primary-light: rgba(217, 119, 6, 0.14);
  --color-accent: #f59e0b;           /* Warm Ember Gold */
  --color-danger: #ef4444;           /* Tomato Red Alert */
  --color-success: #10b981;          /* Fresh Basil Green */
}
```

### Theme Palettes

1. **Amber (Clásico / Default)**:
   - Light: Background `#fbf8f3` (Flour Paper), Surface `#ffffff`, Text `#0f172a`, Muted `#475569`.
   - Dark: Background `#141210` (Wood-fired Ash), Surface `#1e1b18`, Text `#fdfbf7`, Muted `#cbd5e1`.

2. **Chic (Rosa / Beet & Berry Sourdough)**:
   - Light: Background `#fff1f2`, Primary `#ec4899`.
   - Dark: Background `#120b10`, Primary `#f472b6`.

3. **Basil (Verde / Olive Grove)**:
   - Light: Background `#f0fdf4`, Primary `#10b981`.
   - Dark: Background `#091a13`, Primary `#34d399`.

---

## 4. Spacing, Radius & Elevation Scale

- **Border Radius**:
  - `var(--radius-sm)`: `8px` (Inputs, steppers, badges).
  - `var(--radius-md)`: `14px` (Cards, popovers, bento blocks).
  - `var(--radius-lg)`: `20px` (Hero containers, main layout cards, banners).
  - `var(--radius-pill)`: `9999px` (Buttons, nav pills, status chips).

- **Elevations & Shadows**:
  - Light mode: Warm soft natural shadows (`0 10px 30px -5px rgba(0,0,0,0.08)`).
  - Dark mode: Deep ambient contrast shadows (`0 20px 40px -15px rgba(0,0,0,0.6)`).

---

## 5. Component Anatomy & Macrostructures

1. **Header & Navigation**:
   - `app-header`: Floating masthead layout with brand mark, inline nav links, language & color theme popovers.
2. **Hero Layout (Stat-Led & Formula Ticker)**:
   - `home-hero-section`: Newsreader serif headline + live formula ticker badge in `JetBrains Mono` (`100% Harina • 65% Agua • 2.5% Sal`).
3. **Features Layout (Bento Spec Grid)**:
   - `bento-features-grid`: Asymmetric 3-column bento layout with live formula preview cards.
4. **Pizza Styles (Specimen Diptych)**:
   - `styles-preview-grid`: Diptych spec cards with ratio breakdown tables (`Bola`, `Hidratación`, `Maduración`).
5. **Calculator Workbench**:
   - `mode-layout`: Form column + sticky results column formatted like an Artisan Baker's Spec Sheet.
6. **Footer (Ft4 Dense Colophon)**:
   - `app-footer`: Brand signature, formula metadata, technology colophon.

---

## 6. State Discipline (8-State Rule)

Every interactive component MUST ship code for all 8 states:
1. **Default**: Standard state.
2. **Hover**: Smooth transform (`translateY(-2px)`) + color transition.
3. **Focus-visible**: Outline border `var(--border-focus)`.
4. **Active**: Subtle press state (`translateY(0)` / scale down).
5. **Disabled**: Reduced opacity (`0.5`) + cursor `not-allowed`.
6. **Loading**: Data attribute state with spinner indicator.
7. **Error**: Red accent border + warning message.
8. **Success**: Green accent border + confirmation message.

---

## 7. Responsiveness Non-Negotiables

- Verified at `320px`, `375px`, `414px`, `768px`, and Desktop (`1040px+`).
- Root `overflow-x: clip` to prevent horizontal scrolling.
- Display headers wrap safely via `overflow-wrap: anywhere; min-width: 0`.

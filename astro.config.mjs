import { defineConfig } from 'astro/config';
import VitePWA from '@vite-pwa/astro';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://pizzacalc.app',
  integrations: [
    icon(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['icon.svg', 'favicon.ico'],
      manifest: {
        name: 'Calculadora de Masa de Pizza',
        short_name: 'PizzaCalc',
        description: 'Calculadora de ingredientes para masa de pizza basada en fermentación mixta (Ambiente + Nevera)',
        theme_color: '#ec4899',
        background_color: '#120b10',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  vite: {
    test: {
      environment: 'happy-dom',
      coverage: {
        provider: 'v8',
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.test.ts', 'src/vite-env.d.ts'],
        reporter: ['text', 'json', 'html'],
        thresholds: {
          statements: 90,
          branches: 65,
          functions: 90,
          lines: 90,
        },
      },
    },
  },
});

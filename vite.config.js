import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
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
        start_url: './index.html',
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
      devOptions: {
        enabled: true,
      },
    }),
  ],
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/vite-env.d.ts'],
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 88,
        branches: 64,
        functions: 85,
        lines: 88,
      },
    },
  },
});

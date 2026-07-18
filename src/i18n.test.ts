import { describe, it, expect } from 'vitest';
import { translations, SUPPORTED_LANGUAGES, LanguageCode } from './i18n.ts';

describe('Internationalization (i18n)', () => {
  const supportedLangs = Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[];

  it('supports all 5 target languages (ES, EN, IT, FR, DE)', () => {
    expect(supportedLangs).toEqual(['es', 'en', 'it', 'fr', 'de']);
  });

  it('ensures all translation dictionaries contain non-empty strings for all keys', () => {
    const masterKeys = Object.keys(translations.es);

    supportedLangs.forEach(lang => {
      const dict = translations[lang];
      expect(dict).toBeDefined();

      masterKeys.forEach(key => {
        const val = dict[key as keyof typeof dict];
        expect(val, `Missing key "${key}" in language "${lang}"`).toBeDefined();
        expect(typeof val).toBe('string');
        expect(val.trim().length).toBeGreaterThan(0);
      });
    });
  });
});

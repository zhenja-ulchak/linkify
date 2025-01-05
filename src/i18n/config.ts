export type Locale = (typeof locales)[number];

export const locales = ['en', 'de', 'ru', 'ua'] as const;
export const defaultLocale: Locale = 'en';
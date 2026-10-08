import { en } from './en';
import { ta } from './ta';
import { Language } from '../types';

export const translations = {
  en,
  ta,
};

export type Translations = typeof en;

export function getTranslation(lang: Language): Translations {
  return translations[lang] || translations.en;
}
